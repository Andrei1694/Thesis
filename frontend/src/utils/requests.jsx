import axios from "axios";
import { getAuthToken } from "./auth";
const URL = "http://localhost:4000/v1";

const api = axios.create({
  baseURL: URL,
});

api.interceptors.request.use(
  (config) => {
    const { token } = getAuthToken() ?? {};
    console.log(getAuthToken()._id);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function createDevice(device) {
  const response = await api.post(`${URL}/device`, device);
  console.log(response.data.device);
  return response;
}

export async function fetchDevices(page = 1, sortBy = null) {
  let url = `${URL}/device/?page=${page}`;

  if (sortBy) {
    const [name, order] = sortBy.split(":");
    url += `&sortBy=${name}:${order}`;
  }

  const response = await api.get(url);
  return response.data;
}

export async function searchDevices(search) {
  let url = `${URL}/device/search?searchTerm=${search}`;

  const response = await api.get(url);
  return response.data;
}

export async function fetchDevice(id) {
  const { data } = await api.get(`${URL}/device/${id}`);
  return data.device;
}

export async function updateDevice(id, updateData) {
  const response = await api.patch(`${URL}/device/${id}`, updateData);
  return response;
}

export async function deleteDevice(id) {
  const response = await api.delete(`${URL}/device/${id}`);
  return response.data;
}

// Users
export async function register(userData) {
  const response = await api.post(`${URL}/user`, userData);
  return response.data;
}

export async function getAllUsers() {
  const response = await api.get(`${URL}/user`);
  return response.data;
}

export async function getUser() {
  const { _id } = getAuthToken() ?? {};
  const response = await api.get(`${URL}/user/${_id}`);
  return response.data;
}
