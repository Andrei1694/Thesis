import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, searchDevices } from "../utils/requests";
import { useQuery } from "react-query";
import { queryClient } from "../App";
import { useAuth } from "../utils/auth";
import SearchBar from "./searchbar.component";

function UserLogo({ firstName, lastName }) {
  return (
    <div className="flex items-center max-h-100 w-[200px] h-[50px]">
      <div className="ml-1">
        <img className="rounded-full w-10 h-10" src="https://picsum.photos/200/300" alt="img" />
      </div>
      <span className="text-white ml-auto mr-2 whitespace-nowrap">{firstName + " " + lastName}</span>
    </div>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { isAuthenticated, logout, userId, isAdmin } = useAuth();
  const activeClassName = "bg-customSecondary text-white px-3 py-2 rounded-md text-sm font-medium";
  const inactiveClassName = "text-white hover:bg-customSecondary px-3 py-2 rounded-md text-sm font-medium";
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [filteredDevices, setFilteredDevices] = useState([]);
  const inputRef = useRef(null);

  const query = useQuery(
    ["user", userId],
    () => getUser(userId),
    {
      onSuccess: (response) => {
        const { firstName, lastName } = response;
        setFirstName(firstName);
        setLastName(lastName);
      },
      enabled: isAuthenticated && !!userId,
    }
  );

  const { data, isLoading } = useQuery(["searchDevices", searchTerm], () => searchDevices(searchTerm), {
    enabled: !!searchTerm,
  });

  const handleLogout = () => {
    logout();
    queryClient.setQueryData("authToken", { isAuthenticated: false, user: null, token: null });
    navigate("/login");
  };

  useEffect(() => {
    if (data && data.devices && searchTerm) {
      const filtered = data?.devices.map(({ _id, deviceName }) => ({
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
              <span className="text-white font-bold text-xl cursor-pointer" onClick={() => navigate("/devices")}>
                Admin Panel
              </span>
            </div>
            <div className="hidden md:block">
              {isAuthenticated && (
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? activeClassName : inactiveClassName
                    }
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/devices"
                    className={({ isActive }) =>
                      isActive ? activeClassName : inactiveClassName
                    }
                  >
                    Devices
                  </NavLink>
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      isActive ? activeClassName : inactiveClassName
                    }
                  >
                    Users
                  </NavLink>
                  <button
                    className={inactiveClassName}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
              {!isAuthenticated && (
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? activeClassName : inactiveClassName
                    }
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
          {isAdmin && (<div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <SearchBar />
            </div>
          </div>)}
          {isAuthenticated && (
            <Link to="/profile">
              <UserLogo firstName={firstName} lastName={lastName} />
            </Link>
          )}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-customPrimary inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-customSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-customPrimary focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "bg-customSecondary text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              My Profile
            </NavLink>
            <NavLink
              to="/devices"
              className={({ isActive }) =>
                isActive
                  ? "bg-customSecondary text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Devices
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive
                  ? "bg-customSecondary text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Users
            </NavLink>
            <button
              className="text-white hover:bg-customSecondary block px-3 py-2 rounded-md text-base font-medium"
              onClick={handleLogout}
            >
              Logout
            </button>
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
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 p-2">Loading...</div>
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