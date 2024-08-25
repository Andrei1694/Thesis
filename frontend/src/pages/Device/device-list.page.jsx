import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Outlet } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDevices, createDevice } from "../../utils/requests";
import DeviceCard from "../../components/card.component";
import Pagination from "../../components/pagination.component";
import Modal from "../../components/modal.component";
import DeviceForm from "../../forms/device.form";
import Spinner from "../../components/spinner.component";
import DeviceFilter from "./device-filter.component";
import Button from "../../components/button.component";
import { useAuth } from "../../utils/auth";

function DevicesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage] = useState(25);
  const { isAdmin } = useAuth();
  const { data, isLoading, isSuccess } = useQuery(["devices", page, sortBy], () =>
    fetchDevices(page, itemsPerPage, sortBy)
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

    if (data && isSuccess) {
      const { data: devices } = data;
      return (
        <div className="grid grid-cols-1 sm:grid-rows-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {isSuccess && devices?.map(({ _id, ...value }) => (
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
      <div className="">
        <DeviceFilter onSortChange={handleSortChange} />
      </div>

      <div className="container mt-3 w-full h-[500px]">{renderDevices()}</div>
      <div className="container mt-5">
        {isAdmin && <Button onClick={handleModalOpen}>Create Device</Button>}
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
            total={data?.total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  );
}

export default DevicesListPage;
