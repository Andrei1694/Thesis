import { create } from "zustand";
import {
  createDeviceRequest,
  deleteDeviceRequest,
  getDeviceRequest,
  getDevicesRequest,
  updateDeviceRequest,
} from "../utils/requests";

const mapToObject = (arr) => {
  const map = new Map();
  arr.map((device) => {
    const { _id: id, ...obj } = device;
    map.set(id, obj);
  });

  return map;
};

export const useDeviceStore = create((set) => ({
  //   bears: 0,
  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  devices: new Map(),
  device: {},
  total: 0,
  isLoading: false,
  setIsLoading: (loading) => {
    set((state) => {
      isLoading: loading;
    });
  },
  getDevices: async (page, sortBy) => {
    set({ isLoading: true });
    const response = await getDevicesRequest(page, sortBy);
    const { data, total } = response.data;
    mapToObject(data);
    set({ devices: mapToObject(data), total, isLoading: false });
    return response;
  },
  addDevice: async (device) => {
    set({ isLoading: true });
    const response = await createDeviceRequest(device);
    const newDevice = response.data.device;
    set((state) => ({
      devices: [...state.devices, newDevice],
      isLoading: false,
    }));
    return response;
  },
  getDeviceById: async (id) => {
    set({ isLoading: true });
    const response = await getDeviceRequest(id);
    const newDevice = response.data.device;
    set((state) => ({
      device: { ...newDevice },
      isLoading: false,
    }));
    return response;
  },
  updateDevice: async (id, data) => {
    set({ isLoading: true });
    const response = await updateDeviceRequest(id, data);
    const newDevice = response.data.device;
    set((state) => ({
      device: { ...newDevice },
    }));
    return response;
  },
  deleteDevice: async (id) => {
    set({ isLoading: true });
    const response = await deleteDeviceRequest(id);
    set((state) => ({
      device: {},
      isLoading: false,
    }));
    return response;
  },
}));
