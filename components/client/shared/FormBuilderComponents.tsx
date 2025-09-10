"use client";

import { ReactNode, useEffect, useState } from "react";
import TextareaAutoResize from "react-textarea-autosize";
import "@/styles/calendar.css";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { FormHeader, FormField } from "@/types";
import {
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Clock,
  Copy,
  EllipsisVertical,
  Grid2x2,
  Grid2x2Check,
  Heart,
  Image,
  Minus,
  SquareCheck,
  Star,
  Text,
  ThumbsUp,
  Trash2,
  Type,
} from "lucide-react";
import ColorPicker from "./ui/ColorPicker";

const fieldOptionsMap = {
  short_answer: (
    <div className="flex gap-2">
      <Type />
      Short Answer
    </div>
  ),
  long_answer: (
    <label className="flex gap-2">
      <Text />
      Paragraph
    </label>
  ),
  multiple_choice: (
    <div className="flex gap-2">
      <CircleCheck />
      Multiple Choice
    </div>
  ),
  checkbox: (
    <div className="flex gap-2">
      <SquareCheck />
      Checkboxes
    </div>
  ),
  dropdown: (
    <div className="flex gap-2">
      <ChevronDown />
      Dropdown
    </div>
  ),
  file_upload: (
    <div className="flex gap-2">
      <Image />
      File Upload
    </div>
  ),
  linear_scale: (
    <div className="flex gap-2">
      <Minus />
      Linear Scale
    </div>
  ),
  rating: (
    <div className="flex gap-2">
      <Star />
      Rating
    </div>
  ),
  multiple_choice_grid: (
    <div className="flex gap-2">
      <Grid2x2 />
      Multiple Choice Grid
    </div>
  ),
  checkbox_grid: (
    <div className="flex gap-2">
      <Grid2x2Check />
      Checkbox Grid
    </div>
  ),
  date: (
    <div className="flex gap-2">
      <CalendarDays />
      Date
    </div>
  ),
  time: (
    <div className="flex gap-2">
      <Clock />
      Time
    </div>
  ),
};

// Form Base Bits
function FormBuilderBaseQuestion({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  return (
    <TextareaAutoResize
      placeholder="Question"
      value={field?.title ?? ""}
      className="w-full mr-4 text-lg border-b resize-none focus:outline-none"
      onChange={(e) =>
        setField((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            title: e.target.value,
          };
          return updated;
        })
      }
    />
  );
}

function FormBuilderBaseImage({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  return (
    <div className="tooltip" data-tip="Insert Image">
      <button className="btn btn-circle">
        <Image strokeWidth={1.5} />
      </button>
    </div>
  );
}

function FormBuilderBaseTypeDropdown({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1 w-56">
        <span className="flex items-center gap-1">
          {fieldOptionsMap[field.config.type]}
        </span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {Object.entries(fieldOptionsMap).map(([key, value]) => (
          <li key={key}>
            <button
              onClick={() =>
                setField((prev) => {
                  const updated = [...prev];
                  updated[index] = {
                    ...updated[index],
                    config: {
                      type: key as FormField["config"]["type"],
                    },
                  };
                  return updated;
                })
              }
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormBuilderBaseActions({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() =>
          setField((prev) => {
            return prev.filter((_, i) => i !== index);
          })
        }
      >
        <Trash2 strokeWidth={1.5} />
      </button>
      <button
        onClick={() => {
          setField((prev) => {
            const duplicated = { ...prev[index] };
            return [
              ...prev.slice(0, index + 1),
              duplicated,
              ...prev.slice(index + 1),
            ];
          });
        }}
      >
        <Copy strokeWidth={1.5} />
      </button>
    </div>
  );
}

function FormBuilderConfiger({
  field,
  setField,
  index,
  useDesc,
  setUseDesc,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  useDesc: boolean;
  setUseDesc: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle m-1">
        <EllipsisVertical strokeWidth={1.5} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <label className="w-full label">
            <input
              type="checkbox"
              checked={useDesc}
              className="checkbox"
              onChange={(e) => {
                if (!e.target.checked) {
                  setField((prev) => {
                    const descUpdated = [...prev];
                    descUpdated[index] = {
                      ...descUpdated[index],
                      description: "",
                    };
                    return descUpdated;
                  });
                }
                setUseDesc(e.target.checked);
              }}
            />
            Decription
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" className="checkbox" />
            Response Validation
          </label>
        </li>
      </ul>
    </div>
  );
}

// Form Modular Bits
function MultiChoiceOption({
  field,
  setField,
  index,
  optionIndex,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  optionIndex: number;
}) {
  if (field.config.type !== "multiple_choice") return null;
  return (
    <input
      type="text"
      placeholder="Option"
      className="input"
      value={(field.config?.options ?? [])[optionIndex]?.option ?? ""}
      onChange={(e) =>
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== "multiple_choice") {
            return updated;
          }
          const options = [...(updated[index].config?.options ?? [])];
          options[optionIndex] = {
            ...options[optionIndex],
            option: e.target.value,
          };
          updated[index] = {
            ...updated[index],
            config: {
              ...updated[index].config,
              options,
            },
          };
          return updated;
        })
      }
    />
  );
}

function ChoiceDeleteButton({
  type,
  setField,
  index,
  optionIndex,
}: {
  type: "multiple_choice" | "checkbox" | "dropdown";
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  optionIndex: number;
}) {
  return (
    <button
      className="btn btn-circle btn-soft btn-error"
      onClick={(e) => {
        e.preventDefault();
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== type) {
            return updated;
          }
          if (updated[index].config.type === "dropdown") {
            const options = [...(updated[index].config?.options ?? [])];
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                options: options.filter((_, i) => i !== optionIndex),
              },
            };
          } else {
            const options = [...(updated[index].config?.options ?? [])];
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                options: options.filter((_, i) => i !== optionIndex),
              },
            };
          }
          return updated;
        });
      }}
    >
      <Trash2 strokeWidth={1.5} />
    </button>
  );
}

function MultiChoiceAddButton({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  if (field.config.type !== "multiple_choice") return null;
  return (
    <div className="flex items-center gap-2 mt-2">
      <input type="radio" className="radio" disabled />
      <button
        className="btn btn-soft"
        onClick={() =>
          setField((prev) => {
            const updated = [...prev];
            if (updated[index].config.type !== "multiple_choice") {
              return updated;
            }
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                options: [
                  ...(updated[index].config.options ?? []),
                  {
                    option: `Option ${
                      updated[index].config.options?.length
                        ? updated[index].config.options?.length + 1
                        : 1
                    }`,
                    other: false,
                  },
                ],
              },
            };
            return updated;
          })
        }
      >
        Add Option
      </button>
      {(field.config.options ?? []).filter((a) => a.other).length === 0 && (
        <>
          <span>or</span>
          <button
            className="btn btn-soft"
            onClick={() =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "multiple_choice") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    options: [
                      ...(updated[index].config.options ?? []),
                      {
                        option: "",
                        other: true,
                      },
                    ],
                  },
                };
                return updated;
              })
            }
          >
            Add Other Option
          </button>
        </>
      )}
    </div>
  );
}

function CheckboxOption({
  field,
  setField,
  index,
  optionIndex,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  optionIndex: number;
}) {
  if (field.config.type !== "checkbox") return null;
  return (
    <input
      type="text"
      placeholder="Option"
      className="input"
      value={(field.config?.options ?? [])[optionIndex]?.option ?? ""}
      onChange={(e) =>
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== "checkbox") {
            return updated;
          }
          const options = [...(updated[index].config?.options ?? [])];
          options[optionIndex] = {
            ...options[optionIndex],
            option: e.target.value,
          };
          updated[index] = {
            ...updated[index],
            config: {
              ...updated[index].config,
              options,
            },
          };
          return updated;
        })
      }
    />
  );
}

function CheckboxAddButton({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  if (field.config.type !== "checkbox") return null;
  return (
    <div className="flex items-center gap-2 mt-2">
      <input type="checkbox" className="checkbox" disabled />
      <button
        className="btn btn-soft"
        onClick={() =>
          setField((prev) => {
            const updated = [...prev];
            if (updated[index].config.type !== "checkbox") {
              return updated;
            }
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                options: [
                  ...(updated[index].config.options ?? []),
                  {
                    option: `Option ${
                      updated[index].config.options?.length
                        ? updated[index].config.options?.length + 1
                        : 1
                    }`,
                    other: false,
                  },
                ],
              },
            };
            return updated;
          })
        }
      >
        Add Option
      </button>
      {(field.config.options ?? []).filter((a) => a.other).length === 0 && (
        <>
          <span>or</span>
          <button
            className="btn btn-soft"
            onClick={() =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "checkbox") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    options: [
                      ...(updated[index].config.options ?? []),
                      {
                        option: "",
                        other: true,
                      },
                    ],
                  },
                };
                return updated;
              })
            }
          >
            Add Other Option
          </button>
        </>
      )}
    </div>
  );
}

function DropdownOption({
  field,
  setField,
  index,
  optionIndex,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  optionIndex: number;
}) {
  if (field.config.type !== "dropdown") return null;
  return (
    <input
      type="text"
      placeholder="Option"
      className="input"
      value={(field.config?.options ?? [])[optionIndex] ?? ""}
      onChange={(e) =>
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== "dropdown") {
            return updated;
          }
          const options = [...(updated[index].config?.options ?? [])];
          options[optionIndex] = e.target.value;
          updated[index] = {
            ...updated[index],
            config: {
              ...updated[index].config,
              options,
            },
          };
          return updated;
        })
      }
    />
  );
}

function DropdownAddButton({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  if (field.config.type !== "dropdown") return null;
  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        className="btn btn-soft"
        onClick={() =>
          setField((prev) => {
            const updated = [...prev];
            if (updated[index].config.type !== "dropdown") {
              return updated;
            }
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                options: [
                  ...(updated[index].config.options ?? []),
                  `Option ${
                    updated[index].config.options?.length
                      ? updated[index].config.options?.length + 1
                      : 1
                  }`,
                ],
              },
            };
            return updated;
          })
        }
      >
        Add Option
      </button>
    </div>
  );
}

function RatingColorPicker({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  if (field.config.type !== "rating") return null;
  return (
    <>
      <Popover>
        <PopoverTrigger className="btn btn-soft">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: field.config.stroke ?? "orange" }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <ColorPicker
            defaultColor={field.config.stroke ?? "orange"}
            onColorChange={(color) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "rating") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    stroke: color,
                  },
                };
                return updated;
              })
            }
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger className="btn btn-soft">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: field.config.fill ?? "gold" }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <ColorPicker
            defaultColor={field.config.fill ?? "gold"}
            onColorChange={(color) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "rating") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    fill: color,
                  },
                };
                return updated;
              })
            }
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

function RatingSelect({
  field,
  setField,
  index,
}: {
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  if (field.config.type !== "rating") return null;
  return (
    <div className="flex items-center gap-3">
      <select
        defaultValue={3}
        className="select w-16"
        onChange={(e) =>
          setField((prev) => {
            const updated = [...prev];
            if (updated[index].config.type !== "rating") {
              return updated;
            }
            updated[index] = {
              ...updated[index],
              config: {
                ...updated[index].config,
                count: parseInt(e.target.value, 10),
              },
            };
            return updated;
          })
        }
      >
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
      </select>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {!field.config.icon && <Star fill={"gold"} stroke={"orange"} />}
          {field.config.icon === "star" && (
            <Star fill={field.config.fill} stroke={field.config.stroke} />
          )}
          {field.config.icon === "heart" && (
            <Heart fill={field.config.fill} stroke={field.config.stroke} />
          )}
          {field.config.icon === "like" && (
            <ThumbsUp fill={field.config.fill} stroke={field.config.stroke} />
          )}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
        >
          <li>
            <button
              className="flex justify-center gap-2"
              onClick={() =>
                setField((prev) => {
                  const updated = [...prev];
                  if (updated[index].config.type !== "rating") {
                    return updated;
                  }
                  updated[index] = {
                    ...updated[index],
                    config: {
                      ...updated[index].config,
                      icon: "star",
                      fill: "gold",
                      stroke: "orange",
                    },
                  };
                  return updated;
                })
              }
            >
              <Star fill={"gold"} stroke={"orange"} />
            </button>
          </li>
          <li>
            <button
              className="flex justify-center gap-2"
              onClick={() =>
                setField((prev) => {
                  const updated = [...prev];
                  if (updated[index].config.type !== "rating") {
                    return updated;
                  }
                  updated[index] = {
                    ...updated[index],
                    config: {
                      ...updated[index].config,
                      icon: "heart",
                      fill: "red",
                      stroke: "darkred",
                    },
                  };
                  return updated;
                })
              }
            >
              <Heart fill={"red"} stroke={"darkred"} />
            </button>
          </li>
          <li>
            <button
              className="flex justify-center gap-2"
              onClick={() =>
                setField((prev) => {
                  const updated = [...prev];
                  if (updated[index].config.type !== "rating") {
                    return updated;
                  }
                  updated[index] = {
                    ...updated[index],
                    config: {
                      ...updated[index].config,
                      icon: "like",
                      fill: "blue",
                      stroke: "white",
                    },
                  };
                  return updated;
                })
              }
            >
              <ThumbsUp fill={"blue"} stroke={"white"} />
            </button>
          </li>
        </ul>
      </div>
      <RatingColorPicker field={field} setField={setField} index={index} />
    </div>
  );
}

function RatingPreview({ field }: { field: FormField }) {
  if (field.config.type !== "rating") return null;

  return (
    <div className="w-full flex ">
      <div className="w-[80%] mx-auto flex justify-between gap-3">
        {[...Array(field.config.count ?? 3)].map((_, index) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <p className="mx-auto">{index + 1}</p>
            <div className="mx-auto">
              <button>
                {"icon" in field.config ? (
                  <>
                    {field.config.icon === "star" && (
                      <Star
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                    {field.config.icon === "heart" && (
                      <Heart
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                    {field.config.icon === "like" && (
                      <ThumbsUp
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                  </>
                ) : (
                  <Star />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridChoiceAddButton({
  type,
  action,
  setField,
  index,
}: {
  type: "multiple_choice_grid" | "checkbox_grid";
  action: "Add Row" | "Add Column";
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
}) {
  return (
    <button
      className="btn btn-soft"
      onClick={() => {
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== type) {
            return updated;
          }
          const rows = [...(updated[index].config?.table?.rows ?? []), ""];
          const columns = [
            ...(updated[index].config?.table?.columns ?? []),
            "",
          ];
          updated[index] = {
            ...updated[index],
            config: {
              ...updated[index].config,
              table: {
                ...updated[index].config.table,
                rows:
                  action === "Add Row"
                    ? rows
                    : updated[index].config.table?.rows ?? [],
                columns:
                  action === "Add Column"
                    ? columns
                    : updated[index].config.table?.columns ?? [],
              },
            },
          };
          return updated;
        });
      }}
    >
      {action}
    </button>
  );
}

function GridChoiceDeleteButton({
  type,
  actOn,
  setField,
  index,
  optionIndex,
}: {
  type: "multiple_choice_grid" | "checkbox_grid";
  actOn: "row" | "column";
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  index: number;
  optionIndex: number;
}) {
  return (
    <button
      className="btn btn-circle btn-soft btn-error"
      onClick={(e) => {
        e.preventDefault();
        setField((prev) => {
          const updated = [...prev];
          if (updated[index].config.type !== type) {
            return updated;
          }
          const rows = [...(updated[index].config?.table?.rows ?? [])];
          const columns = [...(updated[index].config?.table?.columns ?? [])];
          if (actOn === "row") {
            rows.splice(optionIndex, 1);
          } else {
            columns.splice(optionIndex, 1);
          }
          updated[index] = {
            ...updated[index],
            config: {
              ...updated[index].config,
              table: {
                ...updated[index].config.table,
                rows,
                columns,
              },
            },
          };
          return updated;
        });
      }}
    >
      <Trash2 strokeWidth={1.5} />
    </button>
  );
}

function GridMultiChoiceRowInput({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "multiple_choice_grid") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      {field.config.table?.rows.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Option"
            className="input"
            value={option}
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "multiple_choice_grid") {
                  return updated;
                }
                const rows = [...(updated[index].config?.table?.rows ?? [])];
                rows[optionIndex] = e.target.value;
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    table: {
                      ...updated[index].config.table,
                      rows,
                      columns: updated[index].config.table?.columns ?? [],
                    },
                  },
                };
                return updated;
              })
            }
          />
          <GridChoiceDeleteButton
            type="multiple_choice_grid"
            actOn="row"
            setField={setField}
            index={index}
            optionIndex={optionIndex}
          />
        </div>
      ))}

      <GridChoiceAddButton
        type="multiple_choice_grid"
        action="Add Row"
        setField={setField}
        index={index}
      />
    </div>
  );
}

function GridMultiChoiceColumnInput({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "multiple_choice_grid") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      {field.config.table?.columns.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <input type="radio" defaultChecked className="radio" disabled />
          <input
            type="text"
            placeholder="Option"
            className="input"
            value={option}
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "multiple_choice_grid") {
                  return updated;
                }
                const columns = [
                  ...(updated[index].config?.table?.columns ?? []),
                ];
                columns[optionIndex] = e.target.value;
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    table: {
                      ...updated[index].config.table,
                      rows: updated[index].config.table?.rows ?? [],
                      columns,
                    },
                  },
                };
                return updated;
              })
            }
          />
          <GridChoiceDeleteButton
            type="multiple_choice_grid"
            actOn="column"
            setField={setField}
            index={index}
            optionIndex={optionIndex}
          />
        </div>
      ))}

      <GridChoiceAddButton
        type="multiple_choice_grid"
        action="Add Column"
        setField={setField}
        index={index}
      />
    </div>
  );
}

function GridCheckboxRowInput({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "checkbox_grid") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      {field.config.table?.rows.map((option, optionIndex) => (
        <div className="flex items-center gap-2" key={optionIndex}>
          <input
            type="text"
            placeholder="Option"
            className="input"
            value={option}
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "checkbox_grid") {
                  return updated;
                }
                const rows = [...(updated[index].config?.table?.rows ?? [])];
                rows[optionIndex] = e.target.value;
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    table: {
                      ...updated[index].config.table,
                      rows,
                      columns: updated[index].config.table?.columns ?? [],
                    },
                  },
                };
                return updated;
              })
            }
          />
          <GridChoiceDeleteButton
            type="checkbox_grid"
            actOn="row"
            setField={setField}
            index={index}
            optionIndex={optionIndex}
          />
        </div>
      ))}

      <GridChoiceAddButton
        type="checkbox_grid"
        action="Add Row"
        setField={setField}
        index={index}
      />
    </div>
  );
}

function GridCheckboxColumnInput({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "checkbox_grid") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      {field.config.table?.columns.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <input type="checkbox" className="checkbox" disabled />
          <input
            type="text"
            placeholder="Option"
            className="input"
            value={option}
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "checkbox_grid") {
                  return updated;
                }
                const columns = [
                  ...(updated[index].config?.table?.columns ?? []),
                ];
                columns[optionIndex] = e.target.value;
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    table: {
                      ...updated[index].config.table,
                      rows: updated[index].config.table?.rows ?? [],
                      columns,
                    },
                  },
                };
                return updated;
              })
            }
          />
          <GridChoiceDeleteButton
            type="checkbox_grid"
            actOn="column"
            setField={setField}
            index={index}
            optionIndex={optionIndex}
          />
        </div>
      ))}

      <GridChoiceAddButton
        type="checkbox_grid"
        action="Add Column"
        setField={setField}
        index={index}
      />
    </div>
  );
}

// TSX
export function FormBuilderTitle({
  header,
  setHeader,
}: {
  header: FormHeader;
  setHeader: React.Dispatch<React.SetStateAction<FormHeader>>;
}) {
  return (
    <div className="bg-primary pt-2 rounded-md">
      <div className="bg-base-100 min-h-32 p-5 flex flex-col gap-2">
        <input
          value={header.title}
          type="text"
          className="w-full text-5xl"
          onChange={(e) =>
            setHeader((form) => {
              return {
                ...form,
                title: e.target.value,
              };
            })
          }
        />
        <TextareaAutoResize
          value={header.description}
          name="description"
          className="w-full text-sm rounded-xs resize-none"
          minRows={1}
          onChange={(e) =>
            setHeader((form) => {
              return {
                ...form,
                description: e.target.value,
              };
            })
          }
        />
      </div>
    </div>
  );
}

export function FormBuilderBase({
  index,
  children,
  field,
  setField,
}: {
  index: number;
  children: ReactNode;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [useDesc, setUseDesc] = useState(false);

  return (
    <div className="bg-base-100 p-5">
      <div className="mb-2">
        <div className="w-full flex items-center">
          <FormBuilderBaseQuestion
            field={field}
            setField={setField}
            index={index}
          />
          <div className="flex items-center gap-2 ml-auto">
            <FormBuilderBaseImage
              field={field}
              setField={setField}
              index={index}
            />
            <FormBuilderBaseTypeDropdown
              field={field}
              setField={setField}
              index={index}
            />
          </div>
        </div>
        {useDesc && (
          <TextareaAutoResize
            placeholder="Description"
            value={field?.description ?? ""}
            className="w-full mt-2 text-sm border-b resize-none focus:outline-none"
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                updated[index] = {
                  ...updated[index],
                  description: e.target.value,
                };
                return updated;
              })
            }
          />
        )}
      </div>
      {children}
      <div className="divider"></div>
      <div className="w-full flex justify-end">
        <FormBuilderBaseActions
          field={field}
          setField={setField}
          index={index}
        />
        <div className="divider divider-horizontal"></div>
        <label className="label">
          Required
          <input
            type="checkbox"
            className="toggle"
            checked={!!field?.required}
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                updated[index] = {
                  ...updated[index],
                  required: e.target.checked,
                };
                return updated;
              })
            }
          />
        </label>
        <FormBuilderConfiger
          field={field}
          setField={setField}
          index={index}
          useDesc={useDesc}
          setUseDesc={setUseDesc}
        />
      </div>
    </div>
  );
}

export function FormBuilderShortAnswer({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <label className="fieldset-label input">
        <p>Short answer text</p>
      </label>
    </FormBuilderBase>
  );
}

export function FormBuilderLongAnswer({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
  question?: string;
  description?: string;
  required?: boolean;
}) {
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <label className="fieldset-label textarea w-[80%]">
        <p>Long answer text</p>
      </label>
    </FormBuilderBase>
  );
}

export function FormBuilderMultipleChoice({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "multiple_choice") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex flex-col gap-2">
        {field.config.options?.map((option, optionIndex) => {
          if (option.other)
            return (
              <div className="flex items-center gap-2" key={optionIndex}>
                <input type="radio" defaultChecked className="radio" disabled />
                <input
                  type="text"
                  placeholder="Other"
                  disabled
                  className="input"
                />
                <ChoiceDeleteButton
                  type="multiple_choice"
                  setField={setField}
                  index={index}
                  optionIndex={optionIndex}
                />
              </div>
            );
          return (
            <div className="flex items-center gap-2" key={optionIndex}>
              <input type="radio" defaultChecked className="radio" disabled />
              <MultiChoiceOption
                key={optionIndex}
                field={field}
                setField={setField}
                index={index}
                optionIndex={optionIndex}
              />
              <ChoiceDeleteButton
                type="multiple_choice"
                setField={setField}
                index={index}
                optionIndex={optionIndex}
              />
            </div>
          );
        })}
      </div>
      <MultiChoiceAddButton field={field} setField={setField} index={index} />
    </FormBuilderBase>
  );
}

export function FormBuilderCheckbox({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "checkbox") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex flex-col gap-2">
        {field.config.options?.map((option, optionIndex) => {
          if (option.other)
            return (
              <div className="flex items-center gap-2" key={optionIndex}>
                <input type="checkbox" className="checkbox" disabled />
                <input
                  type="text"
                  placeholder="Other"
                  disabled
                  className="input"
                />
                <ChoiceDeleteButton
                  type="checkbox"
                  setField={setField}
                  index={index}
                  optionIndex={optionIndex}
                />
              </div>
            );
          return (
            <div className="flex items-center gap-2" key={optionIndex}>
              <input type="checkbox" className="checkbox" disabled />
              <CheckboxOption
                key={optionIndex}
                field={field}
                setField={setField}
                index={index}
                optionIndex={optionIndex}
              />
              <ChoiceDeleteButton
                type="checkbox"
                setField={setField}
                index={index}
                optionIndex={optionIndex}
              />
            </div>
          );
        })}
      </div>
      <CheckboxAddButton field={field} setField={setField} index={index} />
    </FormBuilderBase>
  );
}

export function FormBuilderDropdown({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "dropdown") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex flex-col gap-2">
        {field.config.options?.map((option, optionIndex) => (
          <div className="flex items-center gap-2" key={optionIndex}>
            <DropdownOption
              field={field}
              setField={setField}
              index={index}
              optionIndex={optionIndex}
            />
            <ChoiceDeleteButton
              type="dropdown"
              setField={setField}
              index={index}
              optionIndex={optionIndex}
            />
          </div>
        ))}
      </div>
      <DropdownAddButton field={field} setField={setField} index={index} />
    </FormBuilderBase>
  );
}

export function FormBuilderLinearScale({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "linear_scale") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3">
          <select
            defaultValue={field.config.start ? field.config.start : 1}
            className="select w-16"
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "linear_scale") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    start: parseInt(e.target.value, 10),
                  },
                };
                return updated;
              })
            }
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
          </select>
          <p>to</p>
          <select
            defaultValue={
              field.config.start && field.config.count
                ? field.config.start + field.config.count - 1
                : 5
            }
            className="select w-16"
            onChange={(e) =>
              setField((prev) => {
                const updated = [...prev];
                if (updated[index].config.type !== "linear_scale") {
                  return updated;
                }
                updated[index] = {
                  ...updated[index],
                  config: {
                    ...updated[index].config,
                    count: parseInt(e.target.value, 10),
                  },
                };
                return updated;
              })
            }
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <p>{field.config.start ? field.config.start : 1}:</p>
            <input
              type="text"
              placeholder="Low"
              className="input w-24"
              value={field.config.low ?? ""}
              onChange={(e) =>
                setField((prev) => {
                  const updated = [...prev];
                  if (updated[index].config.type !== "linear_scale") {
                    return updated;
                  }
                  updated[index] = {
                    ...updated[index],
                    config: {
                      ...updated[index].config,
                      low: e.target.value,
                    },
                  };
                  return updated;
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <p>
              {field.config.start && field.config.count
                ? field.config.start + field.config.count - 1
                : 5}
              :
            </p>
            <input
              type="text"
              placeholder="High"
              className="input w-24"
              value={field.config.high ?? ""}
              onChange={(e) =>
                setField((prev) => {
                  const updated = [...prev];
                  if (updated[index].config.type !== "linear_scale") {
                    return updated;
                  }
                  updated[index] = {
                    ...updated[index],
                    config: {
                      ...updated[index].config,
                      high: e.target.value,
                    },
                  };
                  return updated;
                })
              }
            />
          </div>
        </div>
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderRating({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "rating") return null;

  useEffect(() => {
    if (field.config.type === "rating" && !field.config.count) {
      setField((prev) => {
        const updated = [...prev];
        if (updated[index].config.type !== "rating") {
          return updated;
        }
        updated[index] = {
          ...updated[index],
          config: {
            ...updated[index].config,
            count: 3,
            stroke: "orange",
            fill: "gold",
            icon: "star",
          },
        };
        return updated;
      });
    }
  }, [index]);

  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex flex-col gap-2">
        <RatingSelect field={field} setField={setField} index={index} />
        <RatingPreview field={field} />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderMultipleChoiceGrid({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex w-full gap-2">
        <GridMultiChoiceRowInput
          index={index}
          field={field}
          setField={setField}
        />
        <GridMultiChoiceColumnInput
          index={index}
          field={field}
          setField={setField}
        />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderCheckboxGrid({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "checkbox_grid") return null;

  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <div className="flex w-full gap-2">
        <GridCheckboxRowInput index={index} field={field} setField={setField} />
        <GridCheckboxColumnInput
          index={index}
          field={field}
          setField={setField}
        />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderDate({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "date") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <p className="flex w-[30%] justify-between border-b text-base-content/50">
        YYYY-MM-DD {field.config.includeTime ? "HH:mm" : ""}{" "}
        <CalendarDays strokeWidth={1.5} />
      </p>
    </FormBuilderBase>
  );
}

export function FormBuilderTime({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "time") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <p className="flex w-[30%] justify-between border-b text-base-content/50">
        HH:mm <Clock strokeWidth={1.5} />
      </p>
    </FormBuilderBase>
  );
}

export function FormBuilderFileUpload({
  index,
  field,
  setField,
}: {
  index: number;
  field: FormField;
  setField: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  if (field.config.type !== "file_upload") return null;
  return (
    <FormBuilderBase index={index} field={field} setField={setField}>
      <label className="fieldset-label input">
        <p>File Upload</p>
      </label>
    </FormBuilderBase>
  );
}
