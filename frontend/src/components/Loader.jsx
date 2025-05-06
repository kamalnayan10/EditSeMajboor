import React from "react";
import { SyncLoader } from "react-spinners";

function Loader() {
  return (
    <div
      className="max-h-[90%] max-w-[90%] md:max-h-full h-full w-full md:max-w-full
     text-2xl flex justify-center items-center"
    >
      <SyncLoader color="#e73e6e" />
    </div>
  );
}

export default Loader;
