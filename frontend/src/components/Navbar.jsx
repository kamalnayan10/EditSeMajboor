import React from "react";
import NavButton from "./NavButton";

import { FaTrash } from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import { FaHighlighter } from "react-icons/fa";
import { HiPaintBrush } from "react-icons/hi2";
import { BsFillEraserFill } from "react-icons/bs";

function Navbar({
  tool,
  changeTool,
  brushSize,
  changeBrushSize,
  onClear,
  scribble,
  handleScribble,
}) {
  return (
    <div
      className="flex md:flex-col flex-row flex-wrap 
                md:h-full
                md:w-1/8 w-full 
                bg-dark-pink
                z-10
                justify-center md:justify-start
                items-center p-5 md:p-6 gap-1 md:gap-10 md:rounded-r-md rounded-t-md "
    >
      <NavButton
        text="Clear Everything"
        onClick={onClear}
        isActive={false} // Clear button typically shouldn't stay active
      >
        <FaTrash />
      </NavButton>

      <NavButton
        text="Auto Selector"
        currentTool={tool}
        onClick={() => changeTool("selector")}
        isActive={tool === "selector"}
      >
        <FaMagic />
      </NavButton>

      <NavButton
        text="Highlighter"
        currentTool={tool}
        onClick={() => changeTool("highlighter")}
        isActive={tool === "highlighter"}
      >
        <FaHighlighter />
      </NavButton>

      <NavButton
        text="Pen"
        currentTool={tool}
        onClick={() => changeTool("pen")}
        isActive={tool === "pen"}
      >
        <HiPaintBrush />
      </NavButton>

      <NavButton
        text="Eraser"
        currentTool={tool}
        onClick={() => changeTool("eraser")}
        isActive={tool === "eraser"}
      >
        <BsFillEraserFill />
      </NavButton>
      <div className="flex flex-col items-center justify-center md:w-full mb-2 md:mb-0">
        <label className="flex items-center cursor-pointer flex-col justify-center gap-2">
          <span className="text-xs md:text-sm font-medium text-white">
            Scribble
          </span>
          <input
            type="checkbox"
            checked={scribble}
            onChange={handleScribble}
            className="sr-only peer"
          />
          <div
            className="relative w-9 h-5 md:w-11 md:h-6 bg-white peer-focus:outline-none rounded-full peer
          peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
          after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5
          md:after:w-5 after:transition-all ease-in-out peer-checked:bg-med-pink"
          ></div>
        </label>
      </div>
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
      </div>
    </div>
  );
}

export default Navbar;
