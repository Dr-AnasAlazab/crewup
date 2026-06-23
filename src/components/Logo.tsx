/** @format */
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <div className="text-3xl text-slate-900 font-bold  font-serif ">
      <Image
        src="/logo.svg"
        alt="CrewUp Logo"
        width={200}
        height={200}
        priority // Ensures the logo loads instantly without layout shift
      />
    </div>
  );
}
