import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDevice, updateDevice, deleteDevice } from "../../utils/requests";
import Modal from "../../components/modal.component";
import DeviceForm from "../../forms/device-form.form";
import Button from "../../components/button.component";
import Spinner from "../../components/spinner.component";
import RealTimeChart from "../../components/realtime-chart.component";
import io from 'socket.io-client'
import Slider from "../../components/slider.component";
const socket = io('http://localhost:4000', {
    transports: ['webscoket', 'polling']
})
function DeviceDetails() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([])
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [sliderValue, setSliderValue] = useState(500);
  const [start,setStart] = useState(false)
  useEffect(() => {
    socket.on('cpuUsage', (responseObject) => {
        const {name,cpuUsage} = responseObject
        console.log(cpuUsage)
        setData((prevData) => [...prevData, {name, uv: cpuUsage}])
    })
}, [])
  const { data: deviceData, isLoading } = useQuery(["devices", id], () =>
    fetchDevice(id)
  );
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const { mutate: updateDeviceMutation, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, values }) => updateDevice(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });

  const { mutate: deleteDeviceMutation, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
      navigate("/devices?page=1");
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

  const startPlay = () => {
    setStart(!start)
    if(start) socket.emit('startRecord', {samplingTime: sliderValue})
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
            <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
              <Button onClick={openModal}>Edit Device</Button>
              <Button
                className="bg-customLight hover:bg-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Device"}
              </Button>
            </div>
          </div>
        </div>

      </div>
      <div>
        <RealTimeChart data={data} />
        <Button onClick={() => startPlay()}>{start ? 'Pause':'Start'}</Button>
        <Slider value={sliderValue} onChange={handleSliderChange} />
        {sliderValue}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <DeviceForm
          mode="edit"
          device={deviceData}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      </Modal>
    </div>
  );
}

export default DeviceDetails;
