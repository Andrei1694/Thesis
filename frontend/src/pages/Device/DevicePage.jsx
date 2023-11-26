import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import DefaultModal from "../../components/Modal";
import RegisterDeviceForm from "../../forms/RegisterDeviceForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getDeviceRequest,
  updateDeviceRequest,
  deleteDeviceRequest,
} from "../../utils/requests";

import Button from "../../components/Button";
import Loading from "../../components/Loading";

function DevicePage() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: device, isLoading } = useQuery(["devices", id], () =>
    getDeviceRequest(id)
  );
  const updateMutation = useMutation({
    mutationFn: (params) => {
      console.log(params);
      return updateDeviceRequest(params.id, params.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return deleteDeviceRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateDeviceAction = async (id, values) => {
    const response = await updateMutation.mutateAsync({ id, values });
    if (response.status === 200) setShow(false);
  };

  const deleteRequest = async () => {
    deleteMutation.mutate(id);
    navigate("/devices?page=1");
  };

  const renderDeviceContent = () => {
    return (
      <div className="w-[100%] m-h-[280px] relative bg-white rounded-[10px] shadow p-4">
        <div className="container">
          <div className="flex">
            <div className="flex flex-col w-1 md:w-1/2">
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
              <DefaultModal buttonName="Edit Device">
                <RegisterDeviceForm
                  mode="edit"
                  device={device}
                  action={(id, values) => updateDeviceAction(id, values)}
                />
              </DefaultModal>
              <DefaultModal buttonName="Delete Device">
                Are you shure u want to delete?
                <Button
                  onClick={() => {
                    deleteDevice(id);
                    navigate("/devices");
                  }}
                >
                  Yes
                </Button>
                <Button>No</Button>
              </DefaultModal>
            </div>
            <div className="flex flex-col w-1 md:w-1/2 justify-center">
              <Button onClick={() => setShow(!show)}>Edit Device</Button>
              <Button
                className="bg-customLight hover:bg-white"
                onClick={() => deleteRequest(id)}
              >
                Delete Device
              </Button>
              <DefaultModal
                buttonName="Register New Device"
                show={show}
                handleClose={() => handleClose()}
                handleShow={() => handleShow()}
                device={device}
              >
                <RegisterDeviceForm
                  mode="edit"
                  action={(id, data) => updateDeviceAction(id, data)}
                  device={device}
                />
              </DefaultModal>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderLoading = () => {
    return (
      <div>
        <Loading />
      </div>
    );
  };
  return (
    <div className="mt-3">
      <div>
        <div className="container">
          <div>{isLoading ? renderLoading() : renderDeviceContent()}</div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
export default DevicePage;
