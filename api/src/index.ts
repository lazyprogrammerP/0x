import fastifyFormbody from "@fastify/formbody";
import fastifySchedule from "@fastify/schedule";
import fastifyWebsocket from "@fastify/websocket";
import { AgentNature, AgentType } from "@prisma/client";
import fastify from "fastify";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import WebSocket from "ws";
import { DataCollectionSchemaDataType } from "./constants";
import db from "./db";
import loadEnv from "./load-env";
import makeCall from "./utils/twilio/make-call";

const env = loadEnv();

const app = fastify({ logger: true });

app.get("/", {}, async (request, reply) => {
  return reply.status(200).send({ message: "The server is up and running." });
});

app.get("/agent", {}, async (request, reply) => {
  const agents = await db.agent.findMany({
    include: { leads: true },
  });

  return reply.status(200).send({ agents });
});

app.post(
  "/agent",
  {
    schema: {
      body: {
        type: "object",
        required: [
          "name",
          "type",
          "nature",
          "prompt",
          "temperature",
          "evaluationCriterias",
          "dataCollectionSchema",
          "leads",
        ],
        properties: {
          name: { type: "string", maxLength: 50 },
          type: { type: "string", enum: [AgentType.OUTBOUND] },
          nature: {
            type: "string",
            enum: [AgentNature.CALL, AgentNature.TEXT],
          },
          prompt: { type: "string", maxLength: 8192 },
          temperature: { type: "number", minimum: 0, maximum: 1 },
          evaluationCriterias: {
            type: "array",
            maxItems: 5,
            items: {
              type: "object",
              required: ["name", "prompt"],
              properties: {
                name: { type: "string", maxLength: 50 },
                prompt: { type: "string", maxLength: 2048 },
              },
            },
          },
          dataCollectionSchema: {
            type: "array",
            maxItems: 5,
            items: {
              type: "object",
              required: ["type", "name", "prompt"],
              properties: {
                type: {
                  type: "string",
                  enum: [
                    DataCollectionSchemaDataType.STRING,
                    DataCollectionSchemaDataType.NUMBER,
                    DataCollectionSchemaDataType.BOOLEAN,
                  ],
                },
                name: { type: "string", maxLength: 50 },
                prompt: { type: "string", maxLength: 2048 },
              },
            },
          },
          leads: {
            type: "array",
            maxItems: 10,
            items: {
              type: "object",
              required: ["name", "phone"],
              properties: {
                name: { type: "string", maxLength: 50 },
                phone: { type: "string", maxLength: 15 },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const {
      name,
      type,
      nature,
      prompt,
      temperature,
      evaluationCriterias,
      dataCollectionSchema,
      leads,
    } = request.body as any;

    const agent = await db.agent.create({
      data: {
        name,
        type,
        nature,
        prompt,
        temperature,
        evaluationCriterias,
        dataCollectionSchema,
        leads: {
          createMany: {
            data: leads.map((lead: any) => ({
              name: lead.name,
              phone: lead.phone,
            })),
          },
        },
      },
    });

    return reply.status(201).send({ agent });
  }
);

app.delete(
  "/agent/:id",
  {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "number" } },
      },
    },
  },
  async (request, reply) => {
    const { id } = request.params as any;

    await db.agent.delete({ where: { id } });

    return reply.status(200).send({ message: "Agent deleted." });
  }
);

app.register(fastifyFormbody);
app.register(fastifyWebsocket);

const SYSTEM_MESSAGE =
  "You are a persuasive sales agent. Always start your conversation by greeting the user and asking them how they are doing today.";

app.register(async (fastify) => {
  fastify.get(
    "/callback/twilio/media-stream",
    { websocket: true },
    (connection, request) => {
      request.log.info("Client connected.");

      // Connection-specific state
      let streamSid: null | string = null;
      let latestMediaTimestamp = 0;
      let lastAssistantItem: null = null;
      let markQueue: string[] = [];
      let responseStartTimestampTwilio: null | number = null;
      let agentId: null | number = null;

      const openAIWS = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
        {
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1",
          },
        }
      );

      const sessionUpdate = {
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: "alloy",
          instructions: SYSTEM_MESSAGE,
          modalities: ["text", "audio"],
          temperature: 0.8,
        },
      };

      const startSession = () => {
        request.log.info("Initializing session with OpenAI.");
        openAIWS.send(JSON.stringify(sessionUpdate));
      };

      const handleSpeechStartedEvent = () => {
        if (markQueue.length > 0 && responseStartTimestampTwilio != null) {
          request.log.info("Received user speech start event (interuption).");

          const elapsedTime =
            latestMediaTimestamp - responseStartTimestampTwilio;

          if (lastAssistantItem) {
            const truncate = {
              type: "conversation.item.truncate",
              item_id: lastAssistantItem,
              content_index: 0,
              audio_end_ms: elapsedTime,
            };

            openAIWS.send(JSON.stringify(truncate));
          }

          const clear = { event: "clear", streamSid: streamSid };
          connection.send(JSON.stringify(clear));

          // Reset
          markQueue = [];
          lastAssistantItem = null;
          responseStartTimestampTwilio = null;
        }
      };

      // Send mark messages to Media Streams so we know if and when AI response playback is finished
      const sendMark = (
        connection: WebSocket.WebSocket,
        streamSid: null | string
      ) => {
        if (streamSid) {
          const mark = {
            event: "mark",
            streamSid: streamSid,
            mark: { name: "responsePart" },
          };

          connection.send(JSON.stringify(mark));
          markQueue.push("responsePart");
        }
      };

      // Open event for OpenAI WebSocket
      openAIWS.on("open", () => {
        request.log.info("Connected to the OpenAI Realtime API.");
        setTimeout(startSession, 100);
      });

      // Listen for messages from the OpenAI WebSocket (and send to Twilio if necessary)
      openAIWS.on("message", (data) => {
        try {
          const response = JSON.parse(data.toString("utf-8"));

          if (response.type === "response.audio.delta" && response.delta) {
            const audioDelta = {
              event: "media",
              streamSid: streamSid,
              media: {
                payload: Buffer.from(response.delta, "base64").toString(
                  "base64"
                ),
              },
            };

            connection.send(JSON.stringify(audioDelta));

            // First delta from a new response starts the elapsed time counter
            if (!responseStartTimestampTwilio) {
              responseStartTimestampTwilio = latestMediaTimestamp;
            }

            if (response.item_id) {
              lastAssistantItem = response.item_id;
            }

            sendMark(connection, streamSid);
          }

          if (response.type === "input_audio_buffer.speech_started") {
            handleSpeechStartedEvent();
          }
        } catch (error) {
          request.log.error("Error processing OpenAI message:", error);
        }
      });

      // Handle incoming messages from Twilio
      connection.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString("utf-8"));

          switch (data.event) {
            case "media":
              latestMediaTimestamp = data.media.timestamp;
              if (openAIWS.readyState === WebSocket.OPEN) {
                const audioAppend = {
                  type: "input_audio_buffer.append",
                  audio: data.media.payload,
                };

                openAIWS.send(JSON.stringify(audioAppend));
              }
              break;

            case "start":
              streamSid = data.start.streamSid;

              agentId = parseInt(data.start.customParameters["agentId"]);
              if (agentId) {
                const agent = await db.agent.findUnique({
                  where: { id: agentId },
                });

                if (agent) {
                  if (openAIWS.readyState === WebSocket.OPEN) {
                    sessionUpdate["session"]["instructions"] = agent.prompt;
                    openAIWS.send(JSON.stringify(sessionUpdate));
                  } else {
                    sessionUpdate["session"]["instructions"] = agent.prompt;
                  }
                }
              }

              // Reset start and media timestamp on a new stream
              responseStartTimestampTwilio = null;
              latestMediaTimestamp = 0;
              break;

            case "mark":
              if (markQueue.length > 0) {
                markQueue.shift();
              }
              break;

            default:
              request.log.info("Received non-media event:", data.event);
              break;
          }
        } catch (error) {
          request.log.error(`Error parsing message: ${error}`);
        }
      });

      // Handle connection close
      connection.on("close", () => {
        if (openAIWS.readyState === WebSocket.OPEN) openAIWS.close();
        request.log.info("Client disconnected.");
      });

      // Handle WebSocket close and errors
      openAIWS.on("close", () => {
        request.log.info("Disconnected from the OpenAI Realtime API.");
      });

      openAIWS.on("error", async (error) => {
        request.log.error(`Error in the OpenAI WebSocket: ${error}`);
      });
    }
  );
});

const callLeadsTask = new AsyncTask(
  "callLeadsTask",
  async () => {
    const agents = await db.agent.findMany({
      where: {
        type: AgentType.OUTBOUND,
        nature: AgentNature.CALL,
        leads: { some: { OR: [{ callSID: null }, { contacted: false }] } },
      },
      include: { leads: true },
    });

    const leads = agents.flatMap((agent) => agent.leads);

    for (const lead of leads) {
      console.log(`Making call to: ${lead.name}, ${lead.phone}`);

      const callSID = await makeCall(lead.phone, lead.agentId);
      await db.lead.update({
        where: { id: lead.id },
        data: { callSID, contacted: true },
      });
    }
  },
  (err) => {
    console.error(`Error in callLeadsTask: ${err}`);
  }
);

const job = new SimpleIntervalJob({ seconds: 10 }, callLeadsTask);

app.register(fastifySchedule);

app.ready().then(() => {
  app.scheduler.addSimpleIntervalJob(job);
});

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Server running at ${address}.`);
});
