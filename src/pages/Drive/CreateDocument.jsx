import React from "react";

import leftArrow from "@Assets/arrow-left.svg";
import { Link } from "react-router-dom";

export default function CreateDocument() {
  return (
    <main>
      <div className="py-6 pl-4 my-2 border border-[#F5F5F5] shadow-[0_2px_2px_#1B2E5E05] bg-white ">
        <Link to="/dashboard/drive" className="flex items-center gap-3">
          <img src={leftArrow} alt="icon" loading="lazy" className="w-5 h-5" />

          <h4 className="font-semibold text-xl">Drive</h4>
        </Link>
      </div>

      <div className="py-16 px-20 bg-white">
        <h2 className="text-3xl text-[#1D2630] font-semibold mb-6">Proposal</h2>
        <div className="h-[300px] border"></div>
      </div>
    </main>
  );
}
