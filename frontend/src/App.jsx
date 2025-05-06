import "./App.css";
import React, { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const [imgSrc, setImgSrc] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNewImage = () => {
    setFinalImage(null);
    setImgSrc(null);
    setLoading(null);
  };

  async function downloadFinalImage() {
    if (!finalImage) return;
    const response = await fetch(finalImage);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "result.png";
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  const handleImageUpload = (imageData) => {
    setImgSrc(imageData.src);
  };

  const handleFinalImage = (url) => {
    setFinalImage(url);
  };

  const handleLoading = (l) => {
    setLoading(l);
  };

  return (
    <div
      className="h-screen bg-white-pink flex justify-start
    items-center flex-col font-roboto text-white overflow-x-hidden"
    >
      <Header
        finalImage={finalImage}
        downloadFinalImage={downloadFinalImage}
        handleNewImage={handleNewImage}
      />
      <Main
        imgSrc={imgSrc}
        handleImageUpload={handleImageUpload}
        finalImage={finalImage}
        handleFinalImage={handleFinalImage}
        loading={loading}
        handleLoading={handleLoading}
      />
    </div>
  );
}

export default App;
