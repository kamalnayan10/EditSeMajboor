import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ImageBox from "./ImageBox";
import PromptBox from "./PromptBox";

function Main() {
  const [imgSrc, setImgSrc] = useState(null);
  const [maskBlob, setMaskBlob] = useState(null);
  const [tool, setTool] = useState(""); // can have values - pen, highlighter, selector, eraser
  const [brushSize, setBrushSize] = useState(10);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const CURSORS = {
      selector: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <!-- Arrow pointer with dot -->
                <path d="M10 4L8 4 8 16 4 12 2 14 12 24 14 22 6 14 16 14 16 12 10 12z" 
                     fill="black" opacity="0.8"/>
                <circle cx="5" cy="5" r="2" fill="black"/>
              </svg>`,
        hotspot: [1, 1], // Tip of the arrow
        size: 24, // Fixed size for selector
      },
      pen: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75 1.85-1.83zM3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" 
                     fill="black" opacity="0.8"/>
              </svg>`,
        hotspot: [4, 22], // Tip of the pen
      },
      highlighter: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M15 14.5V12h2.5l-6-6H9v2.5l6 6zm4.5-10.5L19 3c-.55-.55-1.45-.55-2 0l-1.5 1.5 3 3L20 5c.55-.55.55-1.45 0-2zM9.5 14.5v-3l-4.5 4.5v3h3l4.5-4.5z" 
                     fill="#FFFF00" opacity="0.5"/>
                <path d="M6.5 17.5h3l4.5-4.5v-3l-4.5 4.5h-3z" fill="#FFFF00"/>
              </svg>`,
        hotspot: [4, 20], // Tip of the highlighter
      },
      eraser: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="white" opacity="0.3"/>
              </svg>`,
        hotspot: [brushSize / 2, brushSize / 2], // Center
      },
    };

    const styleId = "global-cursor-style";

    if (["pen", "highlighter", "eraser", "selector"].includes(tool)) {
      const cursor = CURSORS[tool];
      const size = tool === "eraser" ? brushSize : 30; // Only eraser uses brushSize

      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.textContent = `
        * {
          cursor: url('data:image/svg+xml;utf8,${encodeURIComponent(
            cursor.svg.replace(
              'viewBox="0 0 24 24"',
              `width="${size}" height="${size}" viewBox="0 0 24 24"`
            )
          )}') ${cursor.hotspot[0]} ${cursor.hotspot[1]}, auto !important;
        }
      `;
    } else {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, [tool, brushSize]);

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
