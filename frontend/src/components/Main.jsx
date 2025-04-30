import React, { useState } from "react";
import Navbar from "./Navbar";
import ImageBox from "./ImageBox";
import PromptBox from "./PromptBox";

function Main() {
  const [imgSrc, setImgSrc] = useState(null);
  const [maskBlob, setMaskBlob] = useState(null);
  const [tool, setTool] = useState("pen"); // can have values - pen, highlighter, selector, eraser
  const [brushSize, setBrushSize] = useState(10);
  const [prompt, setPrompt] = useState("");

  const handleImageUpload = (imageData) => {
    setImgSrc(imageData.src);
  };

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  const handleMaskUpdate = (blob) => {
    setMaskBlob(blob);
  };

  const changeTool = (toolName) => {
    setTool(toolName);
  };

  const changeBrushSize = (e) => {
    const value = parseInt(e.target.value * 10, 10);
    setBrushSize(value);
  };

  const handleSubmit = () => {
    if (!imgSrc || !maskBlob) {
      alert(
        !imgSrc ? "Please upload an image first" : "Please create a mask first"
      );
      return;
    }

    // Create download links for both files
    const downloadFile = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // Download original image
    fetch(imgSrc)
      .then((res) => res.blob())
      .then((blob) => {
        downloadFile(blob, "original_image.png");

        // Download mask
        downloadFile(maskBlob, "image_mask.png");
      })
      .catch((error) => {
        console.error("Error downloading files:", error);
        alert("Error saving files");
      });
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
        <PromptBox
          handleSubmit={handleSubmit}
          prompt={prompt}
          handlePrompt={handlePrompt}
        />
      </div>
    </div>
  );
}

export default Main;
