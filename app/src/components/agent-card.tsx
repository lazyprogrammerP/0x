import React from "react";
import { FaEllipsis, FaRobot } from "react-icons/fa6";
import { Agent } from "./create-agent-form";

type AgentCardProps = {
  agent: Agent;
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className={"p-4 bg-base-200 rounded-md"}>
      <div className={"flex items-center justify-between gap-4"}>
        <div className={"flex items-center gap-2"}>
          <FaRobot />
          <h3>{agent.name}</h3>
        </div>

        <button className={"btn btn-sm btn-neutral"}>
          <FaEllipsis />
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
