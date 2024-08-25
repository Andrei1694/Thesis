import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDevice, updateDevice, deleteDevice, fetchSensors } from "../../utils/requests";
import Modal from "../../components/modal.component";
import DeviceForm from "../../forms/device.form";
import Button from "../../components/button.component";
import Spinner from "../../components/spinner.component";
import RealTimeChart from "../../components/realtime-chart.component";
import io from "socket.io-client";
import Sensor from "./sensor.component";
import {
  JOIN_ROOM,
  RECEIVE_DATA,
  START_STREAMING,
  STOP_STREAMING,
} from "../../utils/typeDefs";

const SOCKET_SERVER_URL = 'http://localhost:4000'
let socket;

function DeviceDetails() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [measurments, setMeasurements] = useState([]);
  const [sliderValue, setSliderValue] = useState(1000);

  const {
    data: deviceData,
    isLoading,
    error: fetchError,
  } = useQuery(["devices", id], () => fetchDevice(id), {
    onError: (error) => {
      console.error("Error fetching device:", error);
      // Display error message to the user
    },
  });

  const { data: sensorsData, error: sensorError, isLoading: isSensorsLoading, isSuccess: isSensorsSuccess } = useQuery(["sensors", id], () => fetchSensors(id), {
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error("Error fetching sensors:", error);
      // Display error message to the user
    },
  });

  useEffect(() => {
    socket = io(`${SOCKET_SERVER_URL}`, {
      path: "/socket.io",
      transports: ["websocket"],
      query: { clientType: "desktop" },
    });

    socket.emit(JOIN_ROOM, "adsasddas");

    socket.on(RECEIVE_DATA, (payload) => {
      const { cpuUsage, date } = payload;
      setMeasurements((prevData) => [...prevData, { date, uv: cpuUsage }]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      // Attempt to reconnect
      socket.connect();
    });

    return () => {
      socket.emit(STOP_STREAMING);
      socket.disconnect();
    };
  }, []);

  const {
    mutate: updateDeviceMutation,
    isLoading: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, values }) => updateDevice(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
    onError: (error) => {
      console.error("Error updating device:", error);
      // Display error message to the user
    },
  });

  const {
    mutate: deleteDeviceMutation,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
      navigate("/devices?page=1");
    },
    onError: (error) => {
      console.error("Error deleting device:", error);
      // Display error message to the user
    },
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleUpdate = async (id, values) => {
    await updateDeviceMutation({ id, values });
    closeModal();
  };

  const handleDelete = () => {
    deleteDeviceMutation(id);
  };

  if (isLoading) return <Spinner />;

  if (fetchError) {
    return <div>Error fetching device: {fetchError.message}</div>;
  }

  const renderSensors = () => {
    if (isSensorsLoading) return <Spinner />;
    if (sensorError) return <div>Error loading sensors: {error.message}</div>;
    return isSensorsSuccess && sensorsData.map((sensor) => {
      console.log(sensor);
      return (
        <div key={`sensor-${sensor._id}`}>
          <Sensor name={sensor.name} />
        </div>
      )
    })

  }

  return (
    <div className="mt-3">
      <div className="container">
        <div className="w-full max-h-[280px] relative bg-white rounded-[10px] shadow p-4 mb-5">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <h5 className="text-xl font-extrabold">
                {deviceData.deviceName}
              </h5>
              <div>
                <span className="text-lg">Description:</span>{" "}
                {deviceData.description}
              </div>
              <div>{deviceData.location}</div>
              <div>Country: {deviceData.country}</div>
              <div>IP: {deviceData.ipAddress}</div>
              <div>Serial Number: {deviceData.serialNumber}</div>
              <div>Manufacturer: {deviceData.manufacturer}</div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col  gap-3 mt-4 md:mt-0">
              <Button onClick={openModal}>Edit Device</Button>
              <Button
                className="bg-customLight hover:bg-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Device"}
              </Button>
              {deleteError && (
                <div className="text-red-500">
                  Error deleting device: {deleteError.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderSensors()}
        </div>
      </div>

      <RealTimeChart data={measurments} />

      <Modal isOpen={isModalOpen} onClose={closeModal} heading="Edit Device">
        <DeviceForm
          mode="edit"
          device={deviceData}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          error={updateError}
        />
      </Modal>
    </div>
  );
}

export default DeviceDetails;