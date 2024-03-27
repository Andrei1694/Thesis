import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Outlet } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDevices, createDevice } from "../../utils/requests";
import DeviceCard from "../../components/card.component";
import Pagination from "../../components/pagination.component";
import Modal from "../../components/modal.component";
import DeviceForm from "../../forms/device-form.form";
import Spinner from "../../components/spinner.component";
import DeviceFilter from "./device-filter.component";
import DeviceSearch from "./device-search.component";
import Button from "../../components/button.component";

function DevicesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery(["devices", page, sortBy], () =>
    fetchDevices(page, sortBy)
  );

  const createDeviceMutation = useMutation({
    mutationFn: (params) => createDevice(params),
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });

  useEffect(() => {
    setSearchParams({ page: 1, sortBy: "deviceName:asc" });
  }, []);

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);

  const handleDeviceCreate = async (values) => {
    await createDeviceMutation.mutateAsync(values);
    handleModalClose();
    navigate("/devices?page=1");
  };

  const handleSortChange = (option) => {
    const { key, order } = JSON.parse(JSON.parse(option));

    setSearchParams({
      sortBy: `${decodeURIComponent(key)}:${decodeURIComponent(order)}`,
      page: searchParams.get("page"),
    });
  };

  const renderDevices = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
      );
    }

    if (data) {
      const { data: devices } = data;
      return (
        <div className="grid grid-cols-1 sm:grid-rows-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {devices.map(({ _id, ...value }) => (
            <div key={`deviceCard${_id}`}>
              <DeviceCard
                {...value}
                onClick={() => navigate(`/devices/${_id}`)}
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mt-3">
      {/* <div className="container mt-3">
        <DeviceSearch />
      </div> */}
      <div className="container mt-3">
        <DeviceFilter onSortChange={handleSortChange} />
      </div>

      <div className="container mt-3 w-full h-[500px]">{renderDevices()}</div>
      <div className="container mt-5">
        <Button onClick={handleModalOpen}>Create Device</Button>
        <Modal
          heading="Register New Device"
          isOpen={isModalOpen}
          onClose={handleModalClose}
        >
          <DeviceForm mode="create" onSubmit={handleDeviceCreate} />
        </Modal>
      </div>
      <Outlet />
      <div className="mt-5 mb-5">
        {!isLoading && (
          <Pagination
            page={searchParams.get("page")}
            limit={searchParams.get("limit")}
            total={data?.total}
          />
        )}
      </div>
    </div>
  );
}

export default DevicesListPage;
