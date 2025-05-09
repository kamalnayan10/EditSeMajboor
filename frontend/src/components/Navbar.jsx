import React from "react";
import NavButton from "./NavButton";
import { FaTrash, FaMagic, FaHighlighter } from "react-icons/fa";
import { BsFillEraserFill } from "react-icons/bs";
import { FaChevronUp } from "react-icons/fa";

function Navbar({
  tool,
  changeTool,
  brushSize,
  changeBrushSize,
  onClear,
  navOpen,
  handleNavOpen,
}) {
  return (
    <div className="bg-light-pink md:bg-dark-pink p-3 w-full md:w-1/3 lg:w-1/8 md:h-full">
      <button
        onClick={handleNavOpen}
        className={` ${navOpen ? "rounded-t-4xl" : "rounded-4xl"}
          md:hidden w-full bg-dark-pink text-white py-2 px-4 flex justify-center items-center `}
      >
        <span className="mr-2">Tools</span>
        <span className={`transition-all ${navOpen ? "rotate-180" : ""}`}>
          <FaChevronUp />
        </span>
      </button>

      <div
        className={`${
          navOpen ? "flex rounded-b-4xl" : "hidden md:flex"
        } flex-row flex-wrap md:flex-col w-full bg-dark-pink z-10 justify-center md:justify-start items-center p-5
        md:p-6 gap-2 md:gap-10 md:rounded-r-md transition-all duration-500 ease-in-out`}
      >
        <NavButton text="Clear Everything" onClick={onClear} isActive={false}>
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
          text="Eraser"
          currentTool={tool}
          onClick={() => changeTool("eraser")}
          isActive={tool === "eraser"}
        >
          <BsFillEraserFill />
        </NavButton>

        <div className="flex md:flex-col flex-row-reverse w-full items-center md:gap-10">
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
      </div>
    </div>
  );
}

export default Navbar;
