import React, { useState } from "react";

const colors = [
  // 🔴 Reds & Oranges
  "darkred",
  "red",
  "tomato",
  "orangered",
  "orange",
  "coral",
  "salmon",

  // 🟡 Yellows & Golds
  "gold",
  "yellow",
  "khaki",
  "lemonchiffon",

  // 🟤 Browns
  "saddlebrown",
  "chocolate",
  "peru",
  "burlywood",

  // 🟢 Greens
  "darkgreen",
  "green",
  "seagreen",
  "mediumseagreen",
  "springgreen",
  "limegreen",
  "lawngreen",

  // 🔵 Blues
  "navy",
  "mediumblue",
  "blue",
  "steelblue",
  "royalblue",
  "dodgerblue",
  "deepskyblue",
  "skyblue",
  "lightblue",

  // 🟣 Purples & Pinks
  "rebeccapurple",
  "purple",
  "mediumorchid",
  "orchid",
  "violet",
  "plum",
  "hotpink",
  "pink",

  // 🟦 Teal/Cyan tones
  "teal",
  "aqua",

  // ⚫️ Neutrals
  "black",
  "gray",
  "darkgray",
  "lightgray",
  "whitesmoke",
  "white",
  "silver",
];

const ColorPicker = ({
  onColorChange,
  defaultColor = colors[0],
}: {
  onColorChange: (color: string) => void;
  defaultColor?: string;
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  // Update the selected color and call the onColorChange callback
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="grid grid-cols-12 gap-2">
      {colors.map((color) => (
        <div
          key={color}
          className={
            "w-7 h-7 rounded-full flex items-center justify-center" +
            (selectedColor === color ? " border-2 border-base-content" : "")
          }
          onClick={() => handleColorChange(color)}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
