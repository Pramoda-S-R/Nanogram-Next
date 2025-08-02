"use client";
import React, { useRef, useState } from "react";
import {
  FormBuilderCheckbox,
  FormBuilderCheckboxGrid,
  FormBuilderDate,
  FormBuilderDropdown,
  FormBuilderFileUpload,
  FormBuilderLinearScale,
  FormBuilderLongAnswer,
  FormBuilderMultipleChoice,
  FormBuilderMultipleChoiceGrid,
  FormBuilderRating,
  FormBuilderShortAnswer,
  FormBuilderTime,
  FormBuilderTitle,
} from "@/components/client/shared/FormBuilderComponents";
import { FormObj, FormHeader, FormField } from "@/types";

const AdminForm = () => {
  const [header, setHeader] = useState<FormHeader>({ title: "Untitled Form" });
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const index = useRef<number>(0);
  return (
    <div className="w-full h-dvh overflow-y-auto bg-base-300">
      <div className="max-w-3xl mx-auto flex flex-col gap-2 py-2">
        <FormBuilderTitle header={header} setHeader={setHeader} />
        {formFields.map((field, index) => {
          switch (field.config.type) {
            case "short_answer":
              return (
                <FormBuilderShortAnswer
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "long_answer":
              return (
                <FormBuilderLongAnswer
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "multiple_choice":
              return (
                <FormBuilderMultipleChoice
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "checkbox":
              return (
                <FormBuilderCheckbox
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "dropdown":
              return (
                <FormBuilderDropdown
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "linear_scale":
              return (
                <FormBuilderLinearScale
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "rating":
              return (
                <FormBuilderRating
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "multiple_choice_grid":
              return (
                <FormBuilderMultipleChoiceGrid
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "checkbox_grid":
              return (
                <FormBuilderCheckboxGrid
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "date":
              return (
                <FormBuilderDate
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "time":
              return (
                <FormBuilderTime
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            case "file_upload":
              return (
                <FormBuilderFileUpload
                  key={index}
                  index={index}
                  field={field}
                  setField={setFormFields}
                />
              );
            default:
              return (
                <div key={index} className="bg-base-100 p-4 rounded-md">
                  <p>Field type is not implemented yet.</p>
                </div>
              );
          }
        })}
        <div className="flex">
          <button
            className="btn"
            onClick={() => {
              setFormFields((prev) => [
                ...prev,
                {
                  required: true,
                  config: { type: "short_answer", inputType: "text" },
                },
              ]);
              index.current += 1;
            }}
          >
            Add
          </button>
          <button
            className="btn"
            onClick={() => console.log({ header: header, fields: formFields })}
          >
            preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
