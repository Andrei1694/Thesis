import DeviceCard from "../../components/DeviceCard";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import DefaultModal from "../../components/Modal";
import RegisterDeviceForm from "../../forms/RegisterDeviceForm";
import Loading from "../../components/Loading";
import DeviceSelect from "./DeviceSelect";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createDeviceRequest, getDevicesRequest } from "../../utils/requests";
import DeviceSearch from "./DeviceSearch";
import Button from "../../components/Button";

function DevicesPage() {
  const [search, setSearch] = useSearchParams();
  const page = search.get("page");
  const sortBy = search.get("sortBy");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    {
      queryKey: ["devices", page, sortBy],
      queryFn: () => getDevicesRequest(page, sortBy),
    },
    {
      // enabled: false,
    }
  );
  const addDeviceMutation = useMutation({
    mutationFn: (params) => {
      return createDeviceRequest(params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("devices");
    },
  });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setSearch({ page: 1 });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addDeviceFormAction = async (values) => {
    const response = await addDeviceMutation.mutateAsync(values);
    if (response.status === 201) {
      setShow(false);
      navigate("/devices?page=1");
    }
  };

  const renderDevices = () => {
    const arr = [];
    if (data) {
      const { data: devices } = data;
      devices.map(({ _id, ...value }) => {
        arr.push(
          <div className="" key={`deviceCard${_id}`}>
            <DeviceCard
              {...value}
              onClick={() => {
                navigate(`/devices/${_id}`);
              }}
            />
          </div>
        );
      });
    }

    return arr;
  };
  const renderContent = () => {
    if (data?.total === 0)
      return (
        <div>
          <h5>No Devices</h5>
        </div>
      );
    return (
      <div className="flex">{isLoading ? <Loading /> : renderDevices()}</div>
    );
  };
  const setSortBy = (option) => {
    let parsedOption = JSON.parse(option);

    const decodedName = decodeURIComponent(parsedOption.name);
    const decodedOrder = decodeURIComponent(parsedOption.order);
    setSearch({
      sortBy: `${decodedName}:${decodedOrder}`,
      page: search.get("page"),
    });
  };
  return (
    <div className="container mt-3">
      <div>
        <div className="container mt-3">
          <DeviceSearch />
        </div>
      </div>
      <div className="container mt-3">
        <div>
          <DeviceSelect action={setSortBy} />
        </div>
      </div>

      <div className="container mt-3">
        <div className="grid grid-cols-1 sm:grid-rows-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {renderDevices()}
        </div>
      </div>
      <div className="container mt-5">
        <Button onClick={() => setShow(!show)}>Create Device</Button>
        <DefaultModal
          heading="Register New Device"
          buttonName="Register New Device"
          show={show}
          handleClose={() => handleClose()}
          handleShow={() => handleShow()}
        >
          <RegisterDeviceForm mode="create" action={addDeviceFormAction} />
        </DefaultModal>
      </div>
      <div className="mt-5 mb-5">
        {isLoading ? null : (
          <Pagination
            page={search.get("page")}
            limit={search.get("limit")}
            total={data?.total}
          />
        )}
      </div>
    </div>
  );
}
export default DevicesPage;
