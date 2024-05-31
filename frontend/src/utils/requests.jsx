import axios from "axios";
import { getAuthToken } from "./auth";

const URL = import.meta.env.VITE_API_WS_URL;

const api = axios.create({
  baseURL: URL,
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
  const response = await api.post(`${URL}/device`, device);
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
  const response = await api.post(`${URL}/user/register`, userData);
  return response.data;
}
export async function login(userData) {
  console.log(api.getUri())
  const response = await api.post(`${URL}/user/login`, userData);

  return response.data;
}
export async function logout() {
  const response = await api.get(`${URL}/user/logout`);
  return response.data;
}
export async function getAllUsers() {
  const response = await api.get(`${URL}/user`);
  return response.data;
}

export async function getUser(id) {
  const response = await api.get(`${URL}/user/${id}`);
  return response.data;
}

export async function updateUser(id, values) {
  const response = await api.put(`${URL}/user/${id}`, values);
  return response.data;
}