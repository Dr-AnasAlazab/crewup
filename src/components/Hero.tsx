/** @format */

import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    // LAYER 1: The Parent Container
    // We give it a strict min-height so it doesn't collapse, and overflow-hidden to keep it neat
    <div className="relative max-w-full min-h-150 md:min-h-150 border-t-2 border-t-graphite-200 flex items-start  bg-white">
      {/* LAYER 2: The Full-Bleed Background Image */}
      <div className="absolute h-200  w-full  top-0 bottom-0 right-0 left-70 z-0">
        <Image
          src="/final.png"
          alt="Engineers"
          fill
          priority
          className="object-cover    md:object-center"
        />
      </div>

      {/* LAYER 3: The Magic Gradient Fade */}
      {/* It is solid white on the left, fades in the middle, and is completely see-through on the right */}
      <div className="absolute h-200 inset-0 z-0 bg-linear-to-b md:bg-linear-to-r from-white from-25% to-transparent w-1/2 md:w-3/4" />

      {/* LAYER 4: The Text & Content (Restricted to the left half) */}
      <div className="relative h-200  z-10 w-full md:w-1/2 p-8 md:p-12 lg:p-16  flex flex-col justify-center  md:gap-6 lg:gap-8">
        <h1 className=" text-6xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Build Better.
          {/* Note: I swapped 'full-blue-500' to standard Tailwind blue for the example, make sure to use your exact variable! */}
          <span className="text-blue-600 block mt-1">Together.</span>
        </h1>

        <p className="text-6xl leading-7 md:text-xl text-slate-600 mb-8 max-w-sm  ">
          CrewUp is the marketplace for general contractors to find trusted
          subcontractors and build stronger teams.
        </p>

        {/* CTAs Wrapper */}
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto ">
          <Link
            href="/auth/sign-up"
            className="bg-full-blue-500 h-full hover:bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md transition w-full sm:w-auto text-center"
          >
            Find Subcontractors
          </Link>

          <Link
            href="/projects/new"
            className="bg-white/80 hover:bg-white text-full-blue-600 font-semibold px-3 gap-1.5 py-3.5 rounded-xl transition w-full sm:w-auto text-center border border-full-blue-400 backdrop-blur-sm shadow-sm flex items-center justify-center "
          >
            <CirclePlus size={20} />
            Post a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
