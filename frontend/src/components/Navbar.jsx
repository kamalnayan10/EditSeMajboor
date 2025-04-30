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
                items-center p-2 md:p-6 gap-10 rounded-r-md"
    >
      <NavButton text="Clear Everything">
        <FaTrash />
      </NavButton>
      <NavButton text="Undo">
        <ImUndo2 />
      </NavButton>
      <NavButton
        text="Auto Selector"
        tool={tool}
        onClick={() => changeTool("selector")}
      >
        <FaMagic />
      </NavButton>
      <NavButton
        text="Highlighter"
        tool={tool}
        onClick={() => changeTool("highlighter")}
      >
        <FaHighlighter />
      </NavButton>
      <NavButton text="Pen" tool={tool} onClick={() => changeTool("pen")}>
        <HiPaintBrush />
      </NavButton>
      <NavButton text="Eraser" tool={tool} onClick={() => changeTool("eraser")}>
        <BsFillEraserFill />
      </NavButton>
      <div className="flex flex-col items-center justify-center gap-4">
        <label htmlFor="time-slider">Brush Size</label>
        <input
          type="range"
          id="time-slider"
          min="10"
          max="100"
          step={brushSize}
          onChange={changeBrushSize}
          className="slider"
        />
      </div>
    </div>
  );
}

export default Navbar;
