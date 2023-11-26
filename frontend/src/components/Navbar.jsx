import React from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-customPrimary p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 text-white cursor-pointer">
            {/* Your Logo or Brand */}
            <span
              className="font-bold text-xl"
              onClick={() => navigate("/devices")}
            >
              Admin Panel
            </span>
          </div>
          <div className="hidden md:block">
            <ul className="flex space-x-4 text-white">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to={"/devices?page=1"} className="hover:text-gray-300">
                  Devices
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Users
                </Link>
              </li>
            </ul>
          </div>
          {/* Add Mobile Menu Icon */}
          <div className="md:hidden">
            {/* Mobile menu icon */}
            <Button className="text-white">
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
