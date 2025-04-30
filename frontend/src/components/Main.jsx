import React, { useState } from "react";
import Navbar from "./Navbar";
import ImageBox from "./ImageBox";
import PromptBox from "./PromptBox";

function Main() {
  const [imgSrc, setImgSrc] = useState(null);
  const [maskBlob, setMaskBlob] = useState(null);
  const [tool, setTool] = useState("pen"); // can have values - pen, highlighter, selector, eraser
  const [brushSize, setBrushSize] = useState(10);

  const handleImageUpload = (imageData) => {
    setImgSrc(imageData.src);
    // You can also store original dimensions if needed
  };

  const handleMaskUpdate = (blob) => {
    setMaskBlob(blob);
    // You can also send to API or process immediately
  };

  const changeTool = (toolName) => {
    setTool(toolName);
  };

  const changeBrushSize = (e) => {
    const value = parseInt(e.target.value, 10);
    setBrushSize(value);
  };

  return (
    <div className="bg-white h-full w-full flex flex-col md:flex-row">
      <Navbar
        tool={tool}
        changeTool={changeTool}
        brushSize={brushSize}
        changeBrushSize={changeBrushSize}
      />
      <div className="w-full h-full">
        <ImageBox
          tool={tool}
          brushSize={brushSize}
          imgSrc={imgSrc}
          onImageUpload={handleImageUpload}
          onMaskUpdate={handleMaskUpdate}
        />
        <PromptBox />
      </div>
    </div>
  );
}

export default Main;
