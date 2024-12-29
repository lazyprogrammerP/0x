import fastify from "fastify";
import db from "./db";
import loadEnv from "./load-env";

const env = loadEnv();

db.$connect().then(() => {
  console.log(`Connected to database!`);

  const app = fastify({ logger: true });

  app.get("/", {}, async (request, reply) => {
    return reply.status(200).send({ message: "The server is up and running." });
  });

  app.listen({ port: env.PORT }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(`Server running at ${address}.`);
  });
});
