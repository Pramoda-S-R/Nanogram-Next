"use client";
import {
  CalendarDays,
  Clock,
  Heart,
  LucideIcon,
  Star,
  ThumbsUp,
} from "lucide-react";
import {
  CSSProperties,
  HTMLInputTypeAttribute,
  ReactNode,
  useState,
} from "react";
import Datetime from "react-datetime";
import "@/styles/calendar.css";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { formatDate } from "@/utils";
import { CheckboxOption, GridBaseObject, MultipleChoiceOption } from "@/types";

// TSX

export function FormTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-primary pt-2 rounded-md">
      <div className="bg-base-100 min-h-32 p-5">
        <h2 className="text-5xl pb-5">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function FormBase({
  question,
  description,
  required = true,
  children,
}: {
  question?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-base-100 p-5">
      <p className="text-lg">
        {question} {required && <span className="text-error">*</span>}
      </p>
      <p className="text-sm mb-2">{description}</p>
      {children}
    </div>
  );
}

export function FormShortAnswer({
  question,
  description,
  type,
}: {
  question?: string;
  description?: string;
  type: HTMLInputTypeAttribute;
}) {
  return (
    <FormBase question={question} description={description}>
      <label className="fieldset-label input">
        <input type={type} className="" />
      </label>
    </FormBase>
  );
}

export function FormLongAnswer({
  question,
  description,
  required,
}: {
  question?: string;
  description?: string;
  required?: boolean;
}) {
  return (
    <FormBase question={question} description={description}>
      <label className="fieldset-label textarea w-[80%]">
        <textarea className="w-full resize-none" />
      </label>
    </FormBase>
  );
}

function MultipleChoiceOptions({
  option,
  formQuestionId,
}: {
  option: string;
  formQuestionId: string;
}) {
  return (
    <label className="flex gap-2">
      <input type="radio" name={formQuestionId} className="radio" />
      {option}
    </label>
  );
}

function MultipleChoiceInput({ formQuestionId }: { formQuestionId: string }) {
  const [input, setInput] = useState("");
  return (
    <label className="flex gap-2 ">
      <input
        type="radio"
        name={formQuestionId}
        className="radio"
        disabled={!input}
      />
      <input
        type="text"
        className="focus-within:outline-none focus:outline-none border-b"
        placeholder="placeholder"
        onChange={(e) => setInput(e.target.value)}
      />
    </label>
  );
}

export function FormMultipleChoice({
  question,
  description,
  options,
  formQuestionId,
}: {
  question?: string;
  description?: string;
  options: MultipleChoiceOption[];
  formQuestionId: string;
}) {
  return (
    <FormBase question={question} description={description}>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index}>
            {option.other ? (
              <MultipleChoiceInput formQuestionId={formQuestionId} />
            ) : (
              <MultipleChoiceOptions
                option={option.option}
                formQuestionId={formQuestionId}
              />
            )}
          </div>
        ))}
      </div>
    </FormBase>
  );
}

function CheckboxOptions({ option }: { option: string }) {
  return (
    <label className="label">
      <input type="checkbox" className="checkbox" />
      {option}
    </label>
  );
}

function CheckboxInput() {
  const [input, setInput] = useState("");
  return (
    <label className="flex gap-2">
      <input type="checkbox" className="checkbox" disabled={!input} />
      <input
        type="text"
        className="focus-within:outline-none focus:outline-none border-b"
        placeholder="placeholder"
        onChange={(e) => setInput(e.target.value)}
      />
    </label>
  );
}

export function FormCheckboxes({
  question,
  description,
  options,
}: {
  question?: string;
  description?: string;
  options: CheckboxOption[];
}) {
  return (
    <FormBase question={question} description={description}>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index}>
            {option.other ? (
              <CheckboxInput />
            ) : (
              <CheckboxOptions option={option.option} />
            )}
          </div>
        ))}
      </div>
    </FormBase>
  );
}

export function FormDropdown({
  question,
  description,
  options,
}: {
  question?: string;
  description?: string;
  options: string[];
}) {
  const [selectedValue, setSelectedValue] = useState<string>("e76aay8");
  return (
    <FormBase question={question} description={description}>
      <div className="flex flex-col gap-2">
        <select
          value={selectedValue}
          className="select"
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="e76aay8" disabled>
            Choose
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </FormBase>
  );
}

export function FromLinearScale({
  question,
  description,
  formQuestionId,
  high,
  low,
  start = 1,
  count,
}: {
  question?: string;
  description?: string;
  formQuestionId: string;
  high?: string;
  low?: string;
  start?: number;
  count: number;
}) {
  return (
    <FormBase question={question} description={description}>
      <div className="w-full flex">
        {high && <div className="w-full">{high}</div>}
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <input
                type="radio"
                name={formQuestionId}
                className="radio mx-auto"
              />
            </div>
          ))}
        </div>
        {low && <div className="w-full">{low}</div>}
      </div>
    </FormBase>
  );
}

export function FromRating({
  question,
  description,
  icon,
  stroke,
  fill,
  count,
}: {
  question?: string;
  description?: string;
  icon: "star" | "heart" | "like";
  stroke: CSSProperties["color"];
  fill: CSSProperties["color"];
  count: number;
}) {
  const [rating, setRating] = useState(0);

  let Icon: LucideIcon;
  if (icon === "star") {
    Icon = Star;
  } else if (icon === "heart") {
    Icon = Heart;
  } else {
    Icon = ThumbsUp;
  }

  return (
    <FormBase question={question} description={description}>
      <div className="w-full flex ">
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <div className="mx-auto">
                <button onClick={() => setRating(index + 1)}>
                  {index < rating ? (
                    <Icon fill={fill} stroke={stroke} />
                  ) : (
                    <Icon stroke={stroke} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormBase>
  );
}

function FormGridBase({
  question,
  description,
  children,
  columns,
}: {
  question?: string;
  description?: string;
  children: ReactNode;
  columns: string[];
}) {
  return (
    <FormBase question={question} description={description}>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </FormBase>
  );
}

function MultiChoiceColumn({ group }: { group: string }) {
  return (
    <td>
      <input type="radio" name={group} className="radio" />
    </td>
  );
}

function MultiChoiceRow({ row, columns }: { row: string; columns: string[] }) {
  return (
    <tr>
      <th>{row}</th>
      {columns.map((column, index) => (
        <MultiChoiceColumn key={index} group={row} />
      ))}
    </tr>
  );
}

export function FormMultiChoiceGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <MultiChoiceRow key={index} row={row} columns={table.columns} />
      ))}
    </FormGridBase>
  );
}

function CheckboxColumn() {
  return (
    <td>
      <input type="checkbox" className="checkbox" />
    </td>
  );
}

function CheckboxRow({ row, columns }: { row: string; columns: string[] }) {
  return (
    <tr>
      <th>{row}</th>
      {columns.map((column, index) => (
        <CheckboxColumn key={index} />
      ))}
    </tr>
  );
}

export function FormCheckboxGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <CheckboxRow key={index} row={row} columns={table.columns} />
      ))}
    </FormGridBase>
  );
}

export function FormDate({
  question,
  description,
  includeTime = false,
}: {
  question?: string;
  description?: string;
  includeTime?: boolean;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <FormBase question={question} description={description}>
      <Popover>
        <PopoverTrigger className="btn">
          <CalendarDays strokeWidth={1.5} />
          {formatDate(
            date?.toISOString() as string,
            includeTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"
          )}
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          className="px-0 py-0 rounded-lg bg-none overflow-clip border-none"
        >
          <Datetime
            input={false}
            timeFormat={includeTime}
            onChange={(date) => {
              if (typeof date !== "string") {
                setDate(date.toDate());
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}

export function FormTime({
  question,
  description,
}: {
  question?: string;
  description?: string;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <FormBase question={question} description={description}>
      <Popover>
        <PopoverTrigger className="btn">
          <Clock strokeWidth={1.5} />
          {formatDate(date?.toISOString() as string, "HH:mm")}
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          className="px-0 py-0 rounded-lg bg-none overflow-clip border-none"
        >
          <Datetime
            input={false}
            dateFormat={false}
            onChange={(date) => {
              if (typeof date !== "string") {
                setDate(date.toDate());
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}

export function FormFileUpload({
  question,
  description,
}: {
  question?: string;
  description?: string;
}) {
  return (
    <FormBase question={question} description={description}>
      <button className="btn btn-secondary">Add Files</button>
    </FormBase>
  );
}
