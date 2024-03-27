import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input.component";
import Button from "../../components/button.component";
import { searchDevices } from "../../utils/requests";

const DeviceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { data, isLoading } = useQuery(
    ["searchDevices", searchTerm],
    () => searchDevices(searchTerm),
    { enabled: !!searchTerm }
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
    <div className="relative">
      <div className="absolute top-0 right-0 p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow p-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for devices..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full mb-4"
          />
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            searchTerm && (
              <div>
                {filteredDevices.map(({ _id, deviceName }) => (
                  <div
                    key={_id}
                    onClick={() => navigate(`/devices/${_id}`)}
                    className="cursor-pointer py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white mb-2"
                  >
                    {deviceName}
                  </div>
                ))}
                <Button
                  onClick={clearSearch}
                  className="mt-2 text-white bg-gray-500 hover:bg-gray-600"
                >
                  Clear Search
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSearch;
