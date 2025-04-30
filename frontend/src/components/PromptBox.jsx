import React from "react";

function PromptBox({ handleSubmit, prompt, handlePrompt }) {
  return (
    <div className="flex h-2/12 w-full bg-light-pink justify-between items-center p-10">
      <input
        type="text"
        className="bg-white-pink text-black h-12 w-1/2 p-4 rounded-lg outline-none text-xl"
        placeholder="Keep empty for removing selected object"
        value={prompt}
        onChange={handlePrompt}
      />
      <button
        className="px-10 h-12 bg-med-pink rounded-lg text-xl hover:cursor-pointer hover:bg-dark-pink duration-500"
        onClick={handleSubmit}
      >
        Generate
      </button>
    </div>
  );
}

export default PromptBox;
