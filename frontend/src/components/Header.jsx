import React from "react";
import { MdAdd } from "react-icons/md";
import { GiBowTieRibbon } from "react-icons/gi";

function Header() {
  return (
    <div
      className="flex w-full bg-light-pink p-4 md:p-6 lg:p-10 justify-between items-center flex-col sm:flex-row gap-4
    sm:gap-0 rounded-b-full md:rounded-none"
    >
      <h1 className="nosifer-regular text-3xl sm:text-4xl lg:text-5xl text-dark-pink font-extrabold flex gap-2 sm:gap-5 items-center">
        <GiBowTieRibbon className="text-2xl sm:text-3xl lg:text-4xl" />
        Pookie Edit
        <GiBowTieRibbon className="text-2xl sm:text-3xl lg:text-4xl" />
      </h1>
      <div className="flex gap-2 sm:gap-4">
        <button
          className="bg-dark-pink text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 hover:cursor-pointer
        text-base sm:text-lg md:text-xl rounded-full flex items-center justify-center gap-1 sm:gap-2"
        >
          <MdAdd className="text-lg sm:text-xl" />
          <span className="hidden xs:inline">New Image</span>
          <span className="xs:hidden">New</span>
        </button>
        <button
          className="bg-dark-pink text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 hover:cursor-pointer
        text-base sm:text-lg md:text-xl rounded-full hidden"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Header;
