import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { searchDevicesRequest } from "../../utils/requests";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";

const DeviceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null); // Ref for the input element
  const { data } = useQuery(
    ["searchDevices", searchTerm],
    () => searchDevicesRequest(searchTerm),
    { enabled: !!searchTerm }
  );

  useEffect(() => {
    if (data && data.devices && searchTerm) {
      const devices = data.devices.map((device) => ({
        _id: device._id,
        deviceName: device.deviceName,
      }));
      const filtered = devices.filter((device) =>
        device.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
  }, [data, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // inputRef.current.focus(); // Focus on the input when typing
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredDevices([]);
    inputRef.current.focus(); // Focus on the input after clearing search
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <form>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for devices..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full h-12 px-4 mb-4 rounded-lg bg-gray-200 focus:outline-none"
            />
          </form>
          {searchTerm && (
            <div>
              <div>
                {filteredDevices.map(({ _id, deviceName }, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/devices/${_id}`)}
                    className="cursor-pointer py-2 px-4 rounded-lg bg-customPrimary hover:bg-customSecondary text-white mb-2"
                  >
                    {deviceName}
                  </div>
                ))}
              </div>
              <Button
                onClick={clearSearch}
                className="py-2 px-4 mt-2  text-white rounded-lg "
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSearch;
