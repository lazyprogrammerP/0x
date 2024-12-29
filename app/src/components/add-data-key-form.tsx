import React, { useRef } from "react";
import { FaTrash } from "react-icons/fa6";

export type IDataKey = {
  id: number;
  type: string;
  key: string;
  description: string;
};

type AddDataKeyForm = {
  dataKeys: IDataKey[];
  handleAddDataKey: (
    dataTypeRef: React.RefObject<HTMLSelectElement | null>,
    dataKeyRef: React.RefObject<HTMLInputElement | null>,
    dataDescriptionRef: React.RefObject<HTMLInputElement | null>
  ) => void;
  handleDeleteDataKey: (dataKeyId: number) => (e: React.FormEvent) => void;
};

const AddDataKeyForm: React.FC<AddDataKeyForm> = ({
  dataKeys,
  handleAddDataKey,
  handleDeleteDataKey,
}) => {
  const dataTypeRef = useRef<HTMLSelectElement>(null);
  const dataKeyRef = useRef<HTMLInputElement>(null);
  const dataDescriptionRef = useRef<HTMLInputElement>(null);

  return (
    <div className={"w-full p-4 space-y-4 bg-base-100 rounded-md"}>
      <div>
        <p>Data Collection</p>
        <span className={"text-xs lg:text-sm text-base-content"}>
          Define custom data specifications to extract from conversation
          transcripts. You can find the evaluation results for each conversation
          in the &quot;conversations&quot; tab.
        </span>
      </div>

      <div className={"dropdown dropdown-top"}>
        <button className={"btn btn-neutral"}>Add Data Key</button>

        <div
          className={
            "dropdown-content p-4 space-y-2 bg-base-300 z-[1] rounded-2xl shadow"
          }
        >
          <select
            ref={dataTypeRef}
            name={"dataType"}
            className={"select select-sm select-bordered w-full"}
          >
            <option disabled>Data Type</option>
            <option>String</option>
            <option>Number</option>
            <option>Boolean</option>
          </select>

          <input
            type={"text"}
            ref={dataKeyRef}
            required
            name={"dataKey"}
            placeholder={"Key"}
            className={"input input-sm input-bordered"}
          />

          <input
            type={"text"}
            ref={dataDescriptionRef}
            required
            name={"dataDescription"}
            placeholder={"Description"}
            className={"input input-sm input-bordered"}
          />

          <button
            onClick={() =>
              handleAddDataKey(dataTypeRef, dataKeyRef, dataDescriptionRef)
            }
            className={"btn btn-sm btn-accent"}
          >
            Add
          </button>
        </div>
      </div>

      <div className={"space-y-2"}>
        {dataKeys.map((dataKey) => (
          <div
            key={dataKey.id}
            className={
              "p-4 flex flex-wrap justify-between items-center gap-4 bg-base-200 rounded-md"
            }
          >
            <div>
              <h3 className={"font-bold"}>{dataKey.key}</h3>
              <p className={"text-sm"}>{dataKey.description}</p>
            </div>

            <button
              onClick={handleDeleteDataKey(dataKey.id)}
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

export default AddDataKeyForm;
