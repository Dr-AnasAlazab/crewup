/** @format */

import React from "react";
import Logo from "./Logo";
import Link from "next/link";

// todo linking thre rest of the <li> items to their respective pages once they are created
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <Logo />

      <div className="flex  space-x-4">
        <ul className="flex cursor-pointer space-x-6 font-semibold text-graphite-900">
          <li className="hover:text-full-blue-500 p-2">How it Works</li>
          <li className="hover:text-full-blue-500 p-2">Find Work</li>
          <li className="hover:text-full-blue-500 p-2">Find Contractors</li>
          <li className="hover:text-full-blue-500 p-2">Pricing</li>
          <li className="hover:text-full-blue-500 p-2">Resources</li>
        </ul>
      </div>

      <div className="flex space-x-4">
        <Link
          href="/auth/login"
          className="  hover:text-snow-50 text-graphite-800 
       
        hover:bg-full-blue-600   font-semibold py-3 px-7  rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        >
          Log In
        </Link>

        <Link
          href="/auth/sign-up"
          className="bg-full-blue-500  hover:bg-full-blue-600 text-white font-semibold py-3 px-7 full rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
