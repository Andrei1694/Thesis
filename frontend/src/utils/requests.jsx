import axios from "axios";
import { getAuthToken } from "./auth";

const URL = import.meta.env.VITE_API_WS_URL;
console.log('In requests.jsx', URL)
const api = axios.create({
  baseURL: URL + '/v1',
});

api.interceptors.request.use(
  (config) => {
    const { token } = getAuthToken() ?? {};
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
  const response = await api.post(`/device`, device);
  return response;
}

export async function fetchDevices(page = 1, sortBy = null) {
  let url = `/device/?page=${page}`;

  if (sortBy) {
    const [name, order] = sortBy.split(":");
    url += `&sortBy=${name}:${order}`;
  }

  const response = await api.get(url);
  return response.data;
}

export async function searchDevices(search) {
  let url = `/device/search?searchTerm=${search}`;

  const response = await api.get(url);
  return response.data;
}

export async function fetchDevice(id) {
  const { data } = await api.get(`/device/${id}`);
  return data.device;
}

export async function updateDevice(id, updateData) {
  const response = await api.patch(`/device/${id}`, updateData);
  return response;
}

export async function deleteDevice(id) {
  const response = await api.delete(`/device/${id}`);
  return response.data;
}

// Users
export async function register(userData) {
  const response = await api.post(`/user/register`, userData);
  return response.data;
}
export async function login(userData) {
  console.log(api.getUri())
  const response = await api.post(`/user/login`, userData);

  return response.data;
}
export async function logout() {
  const response = await api.get(`/user/logout`);
  return response.data;
}
export async function getAllUsers() {
  const response = await api.get(`/user`);
  return response.data;
}

export async function getUser(id) {
  const response = await api.get(`/user/${id}`);
  return response.data;
}

export async function updateUser(id, values) {
  const response = await api.put(`/user/${id}`, values);
  return response.data;
}