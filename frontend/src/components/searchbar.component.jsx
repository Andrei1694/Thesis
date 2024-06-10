import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { searchDevices } from "../utils/requests";

const SearchBar = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDevices, setFilteredDevices] = useState([]);
    const inputRef = useRef(null);

    const { data, isLoading } = useQuery(["searchDevices", searchTerm], () => searchDevices(searchTerm), {
        enabled: !!searchTerm,
    });

    useEffect(() => {
        if (data && data.devices && searchTerm) {
            const filtered = data?.devices.map(({ _id, deviceName }) => ({
                _id,
                deviceName,
            }));
            setFilteredDevices(filtered);
        }
    }, [data, searchTerm]);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };

    const handleSearchBlur = () => {
        if (searchTerm === "") {
            setIsSearchOpen(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setFilteredDevices([]);
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            {isSearchOpen ? (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleSearchBlur}
                    className="px-3 py-2 placeholder-gray-400 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPrimary sm:text-sm transition-width duration-300"
                    style={{ width: isSearchOpen ? "200px" : "0" }}
                />
            ) : (
                <button
                    onClick={handleSearchClick}
                    className="p-2 rounded-md text-white hover:bg-customSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPrimary"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
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
    );
};

export default SearchBar;