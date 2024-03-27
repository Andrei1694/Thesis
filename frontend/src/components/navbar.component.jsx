import React, { useEffect, useRef, useState } from "react";
import Button from "./button.component";
import { Link, useNavigate } from "react-router-dom";
import { searchDevices } from "../utils/requests";
import { useMutation, useQuery, useQueryClient } from "react-query";
const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [filteredDevices, setFilteredDevices] = useState([]);
  const inputRef = useRef(null);

  const { data, isLoading } = useQuery(
    ["searchDevices", searchTerm],
    () => searchDevices(searchTerm),
    {
      enabled: !!searchTerm,
    }
  );

  useEffect(() => {
    if (data && data.devices && searchTerm) {
      const filtered = data.devices.map(({ _id, deviceName }) => ({
        _id,
        deviceName,
      }));
      setFilteredDevices(filtered);
    }
  }, [data, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredDevices([]);
    inputRef.current?.focus();
  };

  return (
    <nav className="bg-customPrimary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span
                className="text-white font-bold text-xl cursor-pointer"
                onClick={() => navigate("/devices")}
              >
                Admin Panel
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/profile"
                  className="text-white hover:bg-customSecondary px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Profile
                </Link>
                <Link
                  to="/devices?page=1"
                  className="text-white hover:bg-customSecondary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Devices
                </Link>
                <Link
                  to="/users"
                  className="text-white hover:bg-customSecondary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Users
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-3 py-2 placeholder-gray-400 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPrimary sm:text-sm"
                />
                {isLoading ? (
                  <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 p-2">
                    Loading...
                  </div>
                ) : searchTerm && filteredDevices.length > 0 ? (
                  <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                    {filteredDevices.map(({ _id, deviceName }) => (
                      <div
                        key={_id}
                        onClick={() => {
                          navigate(`/devices/${_id}`);
                          clearSearch();
                        }}
                        className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        {deviceName}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-customSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-customPrimary focus:ring-white"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/profile"
              className="text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              My Profile
            </Link>
            <Link
              to="/devices?page=1"
              className="text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Devices
            </Link>
            <Link
              to="/users"
              className="text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Users
            </Link>
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 placeholder-gray-400 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPrimary sm:text-sm"
            />
            {isLoading ? (
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 p-2">
                Loading...
              </div>
            ) : searchTerm && filteredDevices.length > 0 ? (
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                {filteredDevices.map(({ _id, deviceName }) => (
                  <div
                    key={_id}
                    onClick={() => {
                      navigate(`/devices/${_id}`);
                      clearSearch();
                    }}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {deviceName}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
