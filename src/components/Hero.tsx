/** @format */

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className=" flex border-t-2 border-t-graphite-200">
      <div className="w-full h-full flex flex-1 flex-col justify-center items-start p-8 md:p-16 lg:p-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 h-full">
          Build Better.
          <span className="text-full-blue-500 block">Together.</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-4 h-full">
          CrewUp is the marketplace for general contractors to find trusted
          subcontractors and build stronger teams.
        </p>

        <div className="flex  md:flex gap-4 justify-between items-center w-full h-full">
          <Link
            href=""
            className="bg-full-blue-500 flex-1 text-white px-4 py-2 rounded-md mt-4 inline-block "
          >
            Find Subcontractors
          </Link>

          <Link
            href=""
            className="text-full-blue-500 flex-1 hover:text-full-blue-700 font-semibold mt-4 inline-block"
          >
            Post a Project
          </Link>
        </div>
      </div>

      <div className="w-full h-full flex flex-[2.5]  md:block">
        <Image
          src="/engineers.png"
          alt="Engineers"
          width={800}
          height={500}
          className="object-cover  w-full "
        />
      </div>
    </div>
  );
}
