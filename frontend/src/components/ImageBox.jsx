import React, { useRef, useEffect, useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";

function ImageBox({
  tool,
  brushSize,
  imgSrc, // Receive image source from parent
  onImageUpload, // Callback when image is uploaded
  onMaskUpdate, // Callback when mask is updated
  clear,
  onClear,
  loading,
  finalImage,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const containerRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const originalDimensionsRef = useRef({ width: 0, height: 0 });

  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalDimensionsRef.current = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        onImageUpload({
          src: e.target.result,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Initialize canvases when image loads
  useEffect(() => {
    if (
      !imgSrc ||
      !imageCanvasRef.current ||
      !drawingCanvasRef.current ||
      !containerRef.current
    )
      return;

    const imageCanvas = imageCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const container = containerRef.current;
    const img = new Image();

    img.onload = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imgRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;

      let drawWidth, drawHeight;

      if (imgRatio > containerRatio) {
        drawWidth = containerWidth;
        drawHeight = containerWidth / imgRatio;
      } else {
        drawHeight = containerHeight;
        drawWidth = containerHeight * imgRatio;
      }

      imageCanvas.width = drawingCanvas.width = drawWidth;
      imageCanvas.height = drawingCanvas.height = drawHeight;

      imageCanvas.style.width = drawingCanvas.style.width = `${drawWidth}px`;
      imageCanvas.style.height = drawingCanvas.style.height = `${drawHeight}px`;

      const imageCtx = imageCanvas.getContext("2d");
      imageCtx.drawImage(img, 0, 0, drawWidth, drawHeight);

      const drawingCtx = drawingCanvas.getContext("2d");
      drawingCtx.clearRect(0, 0, drawWidth, drawHeight);
    };

    img.src = imgSrc;
  }, [imgSrc]);

  const updateMask = () => {
    if (!imgSrc || originalDimensionsRef.current.width === 0) return;

    const displayCanvas = drawingCanvasRef.current;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = originalDimensionsRef.current.width;
    maskCanvas.height = originalDimensionsRef.current.height;
    const maskCtx = maskCanvas.getContext("2d");

    const scaleX = originalDimensionsRef.current.width / displayCanvas.width;
    const scaleY = originalDimensionsRef.current.height / displayCanvas.height;

    maskCtx.scale(scaleX, scaleY);
    maskCtx.drawImage(displayCanvas, 0, 0);

    maskCanvas.toBlob((blob) => {
      onMaskUpdate(blob);
    }, "image/png");
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineWidth = brushSize;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "pen") {
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.globalCompositeOperation = "source-over";
    } else if (tool === "highlighter") {
      ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
      ctx.globalCompositeOperation = "source-over";
    } else if (tool === "eraser") {
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.globalCompositeOperation = "destination-out";
    }
  };

  const draw = (e) => {
    if (!isDrawing || !imgSrc || !tool) return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // For highlighter: draw short segments
    if (tool === "highlighter") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    updateMask();
  };

  useEffect(() => {
    if (clear) {
      clearDrawing();
      onClear(false);
    }
  }, [clear, onClear]);

  const clearDrawing = () => {
    if (
      !imgSrc ||
      !imageCanvasRef.current ||
      !drawingCanvasRef.current ||
      !containerRef.current
    )
      return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const handleClick = () => {
    if (!imgSrc) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => {},
    };
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => {},
    };
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <div className="flex flex-col h-16/18 w-full">
      <div
        ref={containerRef}
        className={`
          flex-1 bg-white-pink
          flex items-center justify-center
          relative
          ${imgSrc ? "cursor-crosshair" : "cursor-pointer"}
          min-h-[300px] md:min-h-[400px] lg:min-h-[500px]
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {loading || !finalImage ? (
          imgSrc ? (
            <>
              <canvas
                ref={imageCanvasRef}
                className="absolute max-h-[90%] max-w-[90%] md:max-h-full md:max-w-full"
              />
              <canvas
                ref={drawingCanvasRef}
                className="absolute max-h-[90%] max-w-[90%] md:max-h-full md:max-w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </>
          ) : (
            <div
              className="text-gray-500 text-center flex flex-col items-center justify-center p-6 md:p-10
              border-2 border-dashed border-gray-300 duration-300
              rounded-lg hover:text-med-pink mx-4
              hover:border-med-pink cursor-pointer
              
            "
            >
              <BiSolidImageAdd className="text-6xl md:text-8xl lg:text-9xl text-dark-pink" />
              <p className="text-sm md:text-base lg:text-lg">
                Drag & drop an image here
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                or click to select
              </p>
            </div>
          )
        ) : finalImage ? (
          <img
            src={finalImage}
            className="absolute max-h-[90%] max-w-[90%] md:max-h-full md:max-w-full"
          ></img>
        ) : (
          <canvas></canvas>
        )}
      </div>
    </div>
  );
}

export default ImageBox;
