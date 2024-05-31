import React, { useEffect, useRef, useState } from "react";
import Button from "./button.component";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout, searchDevices } from "../utils/requests";
import { useQuery } from "react-query";
import { queryClient } from "../App";
import { getAuthToken, removeAuthToken } from "../utils/auth";

function UserLogo({ firstName, lastName }) {
  return (
    <div className="flex items-center justify-center">
      <div className="mr-4 w-[40px] h-[40px]">
        <img className="rounded-full w-100 h-100" src="https://picsum.photos/200/300" alt="User Avatar" />
      </div>
      <span className="text-white ml-auto mr-2 whitespace-nowrap">{firstName + " " + lastName}</span>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const authData = queryClient.getQueryData("authToken");
  const isAuthenticated = authData?.isAuthenticated ?? getAuthToken()?.isAuthenticated;
  const userId = authData?.id || getAuthToken()?.id;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [filteredDevices, setFilteredDevices] = useState([]);
  const inputRef = useRef(null);

  const { data: user, isLoading: isUserLoading, refetch: fetchUser } = useQuery(
    ["user", userId],
    () => getUser(userId),
    {
      onSuccess: (response) => {
        const { firstName, lastName } = response;
        setFirstName(firstName);
        setLastName(lastName);
      },
      enabled: isAuthenticated,
    }
  );

  const { data, isLoading } = useQuery(["searchDevices", searchTerm], () => searchDevices(searchTerm), {
    enabled: !!searchTerm,
  });

  const { refetch: logoutUser } = useQuery("logout", logout, {
    enabled: false,
    onSuccess: () => {
      removeAuthToken();
      queryClient.setQueryData("authToken", { isAuthenticated: false, user: null, token: null });
      navigate("/login");
    },
  });

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
    <nav className="bg-customPrimary w-min-[100vw]">
      <div className="flex px-4 py-4 text-white">
        <div className="flex items-center w-100">
          {/* logo */}
          <div className="text-lg whitespace-nowrap">
            Admin Panel
          </div>
          <div className="ml-5 w-[100%]">
            <ul className="flex">
              <li className="mr-2">
                <Link
                  to="/profile"
                  className="text-white hover:bg-customSecondary px-1 py-1 rounded-md text-sm font-medium"
                >
                  My Profile
                </Link>
              </li>
              <li className="mr-2">
                <Link
                  to="/devices?page=1"
                  className="text-white hover:bg-customSecondary px-1 py-1 rounded-md text-sm font-medium"
                >
                  Devices
                </Link>
              </li>
              <li className="mr-2">
                <Link
                  to="/users"
                  className="text-white hover:bg-customSecondary px-1 py-1 rounded-md text-sm font-medium"
                >
                  Users
                </Link>
              </li>
              {!isAuthenticated && (<li className="mr-2">
                <Link to="/login" className="text-white hover:bg-customSecondary px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
              </li>)}
              {isAuthenticated && <Link
                onClick={() => logoutUser()}
                className="text-white hover:bg-customSecondary px-1 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </Link>}
            </ul>
          </div>
          {isAuthenticated && (<div className="ml-auto">
            <Link to="/profile">
              <UserLogo firstName={firstName} lastName={lastName} />
            </Link>
          </div>)}
        </div>
      </div>
    </nav>
  );
};

