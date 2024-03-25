import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDevice, updateDevice, deleteDevice } from "../../utils/requests";
import Modal from "../../components/modal.component";
import DeviceForm from "../../forms/deviceform.form";
import Button from "../../components/Button";
import Spinner from "../../components/spinner.component";

function DeviceDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: device, isLoading } = useQuery(["devices", id], () =>
    fetchDevice(id)
  );

  const updateDeviceMutation = useMutation({
    mutationFn: ({ id, values }) => updateDevice(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: (id) => deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
      navigate("/devices?page=1");
    },
  });

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);

  const handleDeviceUpdate = async (id, values) => {
    await updateDeviceMutation.mutateAsync({ id, values });
    handleModalClose();
  };

  const handleDeviceDelete = () => {
    deleteDeviceMutation.mutate(id);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mt-3">
      <div className="container">
        <div className="w-full max-h-[280px] relative bg-white rounded-[10px] shadow p-4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <h5 className="text-xl font-extrabold">{device.deviceName}</h5>
              <div>
                <span className="text-lg">Description:</span>{" "}
                {device.description}
              </div>
              <div>{device.location}</div>
              <div>Country: {device.country}</div>
              <div>IP: {device.ipAddress}</div>
              <div>Serial Number: {device.serialNumber}</div>
              <div>Manufacturer: {device.manufacturer}</div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
              <Button onClick={handleModalOpen}>Edit Device</Button>
              <Button
                className="bg-customLight hover:bg-white"
                onClick={handleDeviceDelete}
              >
                Delete Device
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <DeviceForm mode="edit" device={device} onSubmit={handleDeviceUpdate} />
      </Modal>
    </div>
  );
}

export default DeviceDetailsPage;
