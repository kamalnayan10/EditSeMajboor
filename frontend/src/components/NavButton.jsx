import React from "react";

function NavButton({ text, onClick, children }) {
  return (
    <div className="relative inline-block group" onClick={onClick}>
      <button
        className="flex items-center p-3 hover:bg-[#c31849] text-white rounded-lg transition-all
               duration-300 ease-in-out hover:cursor-pointer hover:rounded-r-none"
      >
        <div className="text-4xl">{children}</div>
      </button>

      {/* absolutely‐positioned tooltip */}
      <span
        className="absolute left-full top-1/2 -translate-y-1/2 h-full flex justify-center items-center
               bg-[#c31849] text-white  rounded-lg px-3 py-1 text-xl
               opacity-0 group-hover:opacity-100 transition-opacity duration-300
               whitespace-nowrap pointer-events-none rounded-l-none"
      >
        {text}
      </span>
    </div>
  );
}

export default NavButton;
