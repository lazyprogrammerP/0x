import AgentCard from "@/components/agent-card";
import CreateAgentForm from "@/components/create-agent-form";
import Nav from "@/components/nav";
import { FaRobot } from "react-icons/fa6";

const TeamPage = () => {
  return (
    <div className={"w-full min-h-screen lg:flex bg-base-300"}>
      <div className={"p-4 lg:p-0"}>
        <Nav />
      </div>

      <div className={"w-full flex"}>
        <div
          className={
            "w-full lg:w-1/3 2xl:w-1/4 max-h-screen lg:border-r-2 border-base-200 overflow-y-auto"
          }
        >
          <div
            className={
              "w-full flex flex-wrap items-center justify-between gap-2 px-4 pb-4 lg:p-8 border-b-2 border-base-200"
            }
          >
            <h1 className={"text-2xl font-bold"}>Agentic Team</h1>
            <CreateAgentForm seedData={null} />
          </div>

          <div className={"p-4 space-y-2"}>
            <CreateAgentForm
              seedData={{
                name: "Insurance Sales Agent",
                type: "outgoing",
                nature: "call",
                prompt: "Bullshit",
                temperature: 0.25,
                evaluationCriterias: [
                  { id: 1, name: "Pitch", prompt: "How good is the pitch?" },
                ],
                dataKeys: [],
                uploadedLeads: "...",
              }}
            />
          </div>
        </div>

        <div
          className={
            "hidden flex-1 min-h-full lg:flex items-center justify-center gap-2"
          }
        >
          <div
            className={
              "w-full max-w-lg flex flex-col items-center justify-center gap-4"
            }
          >
            <div className={"space-y-2"}>
              <FaRobot size={48} className={"block mx-auto"} />
              <h1 className={"text-2xl text-center font-bold"}>
                Select an Agent
              </h1>
              <p className={"text-sm text-center text-base-content"}>
                Select an existing agent or create a new one to configure and
                test your conversational AI.
              </p>
            </div>

            <CreateAgentForm seedData={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
