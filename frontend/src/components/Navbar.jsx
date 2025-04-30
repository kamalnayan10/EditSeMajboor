import React from "react";
import NavButton from "./NavButton";

import { FaTrash } from "react-icons/fa";
import { ImUndo2 } from "react-icons/im";
import { FaMagic } from "react-icons/fa";
import { FaHighlighter } from "react-icons/fa";
import { HiPaintBrush } from "react-icons/hi2";
import { BsFillEraserFill } from "react-icons/bs";

function Navbar({ tool, changeTool, brushSize, changeBrushSize }) {
  return (
    <div
      className="flex md:flex-col flex-row 
                md:h-full h-16 
                md:w-1/8 w-full 
                bg-dark-pink
                z-10
                justify-center md:justify-start
                items-center p-2 md:p-6 gap-6 md:gap-10 rounded-r-md"
    >
      <NavButton text="Clear Everything" onClick={() => console.log("Clear")}>
        <FaTrash />
      </NavButton>
      <NavButton text="Undo" onClick={() => console.log("Undo")}>
        <ImUndo2 />
      </NavButton>
      <NavButton
        text="Auto Selector"
        currentTool={tool}
        onClick={() => changeTool("selector")}
      >
        <FaMagic />
      </NavButton>
      <NavButton
        text="Highlighter"
        currentTool={tool}
        onClick={() => changeTool("highlighter")}
      >
        <FaHighlighter />
      </NavButton>
      <NavButton
        text="Pen"
        currentTool={tool}
        onClick={() => changeTool("pen")}
      >
        <HiPaintBrush />
      </NavButton>
      <NavButton
        text="Eraser"
        currentTool={tool}
        onClick={() => changeTool("eraser")}
      >
        <BsFillEraserFill />
      </NavButton>
      {/* Brush Size Slider */}
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <label htmlFor="brush-slider" className="text-white text-sm">
          Brush Size: {brushSize}
        </label>
        <input
          type="range"
          id="brush-slider"
          min="1"
          max="10"
          value={parseInt(brushSize / 10, 10)}
          step="1"
          onChange={changeBrushSize}
          className="slider w-full"
        />
      </div>{" "}
    </div>
  );
}

export default Navbar;
