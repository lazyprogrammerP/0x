import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import AddCriteriaForm, { IEvaluationCriteria } from "./add-criteria-form";
import AddDataKeyForm, { IDataKey } from "./add-data-key-form";
import AgentCard from "./agent-card";

export type Agent = {
  name: string;
  type: string;
  nature: string;
  prompt: string;
  temperature: number;
  evaluationCriterias: IEvaluationCriteria[];
  dataKeys: IDataKey[];
  uploadedLeads: string;
};

type CreateAgentFormProps = {
  seedData: null | Agent;
};

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ seedData }) => {
  const [evaluationCriterias, setEvaluationCriterias] = useState<
    IEvaluationCriteria[]
  >([]);
  const [dataKeys, setDataKeys] = useState<IDataKey[]>([]);

  const handleAddCriteria = (
    criteriaNameRef: React.RefObject<HTMLInputElement | null>,
    criteriaPromptRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const name = criteriaNameRef.current?.value;
    const prompt = criteriaPromptRef.current?.value;

    if (!name || !prompt) return;

    setEvaluationCriterias([
      ...evaluationCriterias,
      { id: evaluationCriterias.length + 1, name, prompt },
    ]);
  };

  const handleDeleteCriteria =
    (evaluationCriteriaId: number) => (e: React.FormEvent) => {
      setEvaluationCriterias((prev) =>
        prev.filter(
          (evaluationCriteria) => evaluationCriteria.id !== evaluationCriteriaId
        )
      );
    };

  const handleAddDataKey = (
    dataTypeRef: React.RefObject<HTMLSelectElement | null>,
    dataKeyRef: React.RefObject<HTMLInputElement | null>,
    dataDescriptionRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const type = dataTypeRef.current?.value;
    const key = dataKeyRef.current?.value;
    const description = dataDescriptionRef.current?.value;

    if (!type || !key || !description) return;

    setDataKeys((prev) => [
      ...prev,
      { id: dataKeys.length + 1, type, key, description },
    ]);
  };

  const handleDeleteDataKey = (dataKeyId: number) => (e: React.FormEvent) => {
    setDataKeys((prev) => prev.filter((dataKeys) => dataKeys.id !== dataKeyId));
  };

  const handleAddAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleUpdateAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    setEvaluationCriterias(seedData?.evaluationCriterias || []);
    setDataKeys(seedData?.dataKeys || []);
  }, [seedData]);

  return (
    <div className={"drawer drawer-end w-auto"}>
      <input
        id={"create-agent-form"}
        type={"checkbox"}
        className={"drawer-toggle"}
      />

      {seedData ? (
        <div className={"drawer-content z-0"}>
          <label htmlFor={"create-agent-form"}>
            <AgentCard agent={seedData} />
          </label>
        </div>
      ) : (
        <div className={"drawer-content z-0"}>
          <label
            htmlFor={"create-agent-form"}
            className={"btn btn-accent drawer-button"}
          >
            Create Agent
          </label>
        </div>
      )}

      <div className={"drawer-side z-10"}>
        <label
          htmlFor={"create-agent-form"}
          aria-label={"close sidebar"}
          className={"drawer-overlay"}
        ></label>

        <form
          onSubmit={seedData ? handleUpdateAgent : handleAddAgent}
          className={
            "w-11/12 max-w-2xl min-h-screen max-h-screen p-8 space-y-8 bg-base-200 overflow-y-auto"
          }
        >
          <div className={"flex items-center gap-4"}>
            <FaRobot size={32} />
            <h1 className={"text-lg font-bold"}>Create An AI Agent</h1>
          </div>

          <div className={"w-full space-y-4"}>
            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>AI Agent Name</span>
              </div>

              <input
                type={"text"}
                name={"name"}
                required
                placeholder={"Example Sales Agent"}
                defaultValue={seedData?.name}
                className={"input input-bordered w-full"}
              />
            </div>

            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>AI Agent Type</span>
              </div>

              <select
                name={"type"}
                required
                defaultValue={seedData?.type}
                className={"select select-bordered w-full"}
              >
                <option>Outgoing</option>
                <option disabled>Incoming (Coming Soon)</option>
              </select>
            </div>

            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>AI Agent Nature</span>
              </div>

              <select
                name={"nature"}
                required
                defaultValue={seedData?.nature}
                className={"select select-bordered w-full"}
              >
                <option>Call</option>
                <option>Text (Whatsapp)</option>
              </select>
            </div>

            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>AI System Prompt</span>
              </div>

              <textarea
                name={"prompt"}
                required
                defaultValue={seedData?.prompt}
                rows={8}
                placeholder={
                  "Provide instructions for the context of the conversation to the AI Agent."
                }
                className={"textarea textarea-bordered"}
              ></textarea>
            </div>

            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>AI Agent Temperature</span>
              </div>

              <input
                type={"range"}
                name={"temperature"}
                min={0}
                max={1}
                defaultValue={seedData?.temperature || 0.25}
                step={0.05}
                className={"range"}
              />
            </div>

            <div>
              <AddCriteriaForm
                evaluationCriterias={evaluationCriterias}
                handleAddCriteria={handleAddCriteria}
                handleDeleteCriteria={handleDeleteCriteria}
              />
            </div>

            <div>
              <AddDataKeyForm
                dataKeys={dataKeys}
                handleAddDataKey={handleAddDataKey}
                handleDeleteDataKey={handleDeleteDataKey}
              />
            </div>

            <div className={"form-control w-full"}>
              <div className={"label"}>
                <span className={"label-text"}>Upload Leads</span>
              </div>

              <input
                type={"file"}
                name={"file"}
                required
                className={"file-input file-input-bordered w-full"}
              />
            </div>

            {seedData ? (
              <button className={"w-full btn btn-accent"}>Save Changes</button>
            ) : (
              <button className={"w-full btn btn-accent"}>Add Agent</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentForm;

// FORM:
// 1. Agent Name
// 2. Agent Type - Outgoing
// 3. Agent Nature - Call / Text
// 4. System Prompt
// 5. Temperature
// 6. Evaluation Criteria
// 7. Data Collection
// 8. Leads CSV File
