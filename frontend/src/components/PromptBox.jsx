import React from "react";

function PromptBox({ handleSubmit, prompt, handlePrompt }) {
  return (
    <div className="flex w-full h-2/12 bg-light-pink justify-between items-center p-4 sm:p-6 md:p-8 gap-4">
      <input
        type="text"
        className="bg-white-pink text-black h-12 flex-1 min-w-0 p-3 sm:p-4 rounded-lg outline-none text-base sm:text-lg md:text-xl"
        placeholder="Keep empty for removing selected object"
        value={prompt}
        onChange={handlePrompt}
      />
      <button
        className="px-6 sm:px-8 md:px-10 h-12 bg-med-pink rounded-lg text-base sm:text-lg md:text-xl hover:cursor-pointer hover:bg-dark-pink duration-300 whitespace-nowrap"
        onClick={handleSubmit}
      >
        Generate
      </button>
    </div>
  );
}

export default PromptBox;
