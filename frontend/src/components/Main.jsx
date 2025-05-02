import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ImageBox from "./ImageBox";
import PromptBox from "./PromptBox";

function Main() {
  const [imgSrc, setImgSrc] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [maskBlob, setMaskBlob] = useState(null);
  const [brushSize, setBrushSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [clear, setClear] = useState(false);
  const [isScribble, setIsScribble] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState(""); // can have values - pen, highlighter, selector, eraser

  useEffect(() => {
    const CURSORS = {
      selector: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <!-- Arrow pointer with dot -->
                <path d="M10 4L8 4 8 16 4 12 2 14 12 24 14 22 6 14 16 14 16 12 10 12z" 
                     fill="#e73e6e" opacity="1"/>
                <circle cx="5" cy="5" r="2" fill="black"/>
              </svg>`,
        hotspot: [1, 1], // Tip of the arrow
        size: 24, // Fixed size for selector
      },
      pen: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="red" opacity="1"/>
              </svg>`,
        hotspot: [brushSize / 2, brushSize / 2], // Center
      },
      highlighter: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="yellow" opacity="0.6"/>
              </svg>`,
        hotspot: [brushSize / 2, brushSize / 2], // Center
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
      const size = tool === "selector" ? 30 : brushSize; // Only eraser uses brushSize

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

  const handleClear = (c) => {
    setClear(c);
  };

  const handleScribble = () => {
    setIsScribble((scribble) => !scribble);
  };

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

  const handleNavOpen = () => {
    setNavOpen((n) => !n);
  };

  const handleSubmit = async () => {
    if (!imgSrc || !maskBlob) {
      alert(
        !imgSrc ? "Please upload an image first" : "Please create a mask first"
      );
      return;
    }

    // Function to process the mask blob
    const processMask = async (blob) => {
      return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          // Draw the image
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          if (!isScribble) {
            // Process each pixel
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3]; // alpha channel

              // Enhanced yellow detection (strict RGB ranges for yellow)
              // Yellow typically has high R+G and low B, with possible transparency
              const isYellow =
                r >= 200 && // High red
                g >= 200 && // High green
                b <= 100 && // Low blue
                a > 50; // Not too transparent

              // Set to pure white or pure black
              const val = isYellow ? 255 : 0;
              data[i] = val; // R
              data[i + 1] = val; // G
              data[i + 2] = val; // B
              data[i + 3] = 255; // Force full opacity
            }
          } else {
            // Process each pixel
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3]; // alpha channel

              // Enhanced yellow detection (strict RGB ranges for yellow)
              // Yellow typically has high R+G and low B, with possible transparency
              const isRed =
                r >= 200 && // High red
                g <= 100 && // High green
                b <= 100 && // Low blue
                a > 50; // Not too transparent

              // Set to pure white or pure black
              const val = isRed ? 255 : 0;
              data[i] = val; // R
              data[i + 1] = val; // G
              data[i + 2] = val; // B
              data[i + 3] = 255; // Force full opacity
            }
          }

          // Put the processed data back
          ctx.putImageData(imageData, 0, 0);

          // Convert back to blob
          canvas.toBlob((processedBlob) => {
            URL.revokeObjectURL(url);
            resolve(processedBlob);
          }, "image/png");
        };

        img.src = url;
      });
    };

    try {
      setLoading(true);
      const originalBlob = await fetch(imgSrc).then((res) => res.blob());
      const processedMaskBlob = await processMask(maskBlob);

      const formData = new FormData();
      formData.append("image", originalBlob, "input.png");
      formData.append("mask", processedMaskBlob, "inputMask.png");

      const uploadRes = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const data = await uploadRes.json();
      const resultUrl = `http://localhost:8000${data.url}`;
      // Display image
      setLoading(false);
      setFinalImage(resultUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload and process.");
    }
  };

  return (
    <div className="bg-white h-full w-full flex flex-col-reverse md:flex-row">
      <Navbar
        tool={tool}
        changeTool={changeTool}
        brushSize={brushSize}
        changeBrushSize={changeBrushSize}
        onClear={handleClear}
        scribble={isScribble}
        handleScribble={handleScribble}
        navOpen={navOpen}
        handleNavOpen={handleNavOpen}
      />
      <div className="w-full h-full">
        <ImageBox
          tool={tool}
          brushSize={brushSize}
          imgSrc={imgSrc}
          onImageUpload={handleImageUpload}
          onMaskUpdate={handleMaskUpdate}
          clear={clear}
          onClear={handleClear}
          loading={loading}
          finalImage={finalImage}
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
