import React from "react";
import { MdAdd } from "react-icons/md";
import { GiBowTieRibbon } from "react-icons/gi";

function Header() {
  return (
    <div className="flex w-full bg-light-pink p-10 justify-between items-center">
      <h1 className="font-cal-sans text-5xl text-dark-pink font-extrabold flex gap-5">
        <GiBowTieRibbon />
        Pookie Edit
        <GiBowTieRibbon />
      </h1>
      <div className="flex gap-4">
        <button className="bg-dark-pink text-white px-5 py-2 hover:cursor-pointer text-xl rounded-full flex items-center justify-center gap-2">
          <MdAdd /> New Image
        </button>
        <button className="bg-dark-pink text-white px-5 py-2 hover:cursor-pointer text-xl rounded-full hidden">
          Download
        </button>
      </div>
    </div>
  );
}

export default Header;
