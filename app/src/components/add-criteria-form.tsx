import React, { useRef } from "react";
import { FaTrash } from "react-icons/fa6";

export type IEvaluationCriteria = {
  id: number;
  name: string;
  prompt: string;
};

type AddCriteriaFormProps = {
  evaluationCriterias: IEvaluationCriteria[];
  handleAddCriteria: (
    criteriaNameRef: React.RefObject<HTMLInputElement | null>,
    criteriaPromptRef: React.RefObject<HTMLInputElement | null>
  ) => void;
  handleDeleteCriteria: (
    evaluationCriteriaId: number
  ) => (e: React.FormEvent) => void;
};

const AddCriteriaForm: React.FC<AddCriteriaFormProps> = ({
  evaluationCriterias,
  handleAddCriteria,
  handleDeleteCriteria,
}) => {
  const criteriaNameRef = useRef<HTMLInputElement>(null);
  const criteriaPromptRef = useRef<HTMLInputElement>(null);

  return (
    <div className={"w-full p-4 space-y-4 bg-base-100 rounded-md"}>
      <div>
        <p>Evaluation Criteria</p>
        <span className={"text-xs lg:text-sm text-base-content"}>
          Define custom criteria to evaluate conversations against. You can find
          the evaluation results for each conversation in the
          &quot;conversations&quot; tab.
        </span>
      </div>

      <div className={"dropdown dropdown-top"}>
        <button className={"btn btn-neutral"}>Add Criteria</button>

        <div
          className={
            "dropdown-content p-4 space-y-2 bg-base-300 z-[1] rounded-2xl shadow"
          }
        >
          <input
            type={"text"}
            ref={criteriaNameRef}
            required
            placeholder={"Criteria Name"}
            className={"input input-sm input-bordered"}
          />

          <input
            type={"text"}
            ref={criteriaPromptRef}
            required
            placeholder={"Prompt"}
            className={"input input-sm input-bordered"}
          />

          <button
            onClick={() =>
              handleAddCriteria(criteriaNameRef, criteriaPromptRef)
            }
            className={"btn btn-sm btn-accent"}
          >
            Add
          </button>
        </div>
      </div>

      <div className={"space-y-2"}>
        {evaluationCriterias.map((evaluationCriteria) => (
          <div
            key={evaluationCriteria.id}
            className={
              "p-4 flex flex-wrap justify-between items-center gap-4 bg-base-200 rounded-md"
            }
          >
            <div>
              <h3 className={"font-bold"}>{evaluationCriteria.name}</h3>
              <p className={"text-sm"}>{evaluationCriteria.prompt}</p>
            </div>

            <button
              onClick={handleDeleteCriteria(evaluationCriteria.id)}
              className={"btn btn-neutral"}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddCriteriaForm;
