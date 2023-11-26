import axios from "axios";
const URL = "http://localhost:4000/v1";

export async function createDeviceRequest(device) {
  const response = await axios.post(`${URL}/device`, device);
  console.log(response.data.device);
  return response;
}

export async function getDevicesRequest(page = 1, sortBy = null) {
  let url = `${URL}/device/?page=${page}`;

  if (sortBy) {
    const [name, order] = sortBy.split(":");
    url += `&sortBy=${name}:${order}`;
  }

  const response = await axios.get(url);
  return response.data;
}

export async function searchDevicesRequest(search) {
  let url = `${URL}/device/search?searchTerm=${search}`;

  const response = await axios.get(url);
  return response.data;
}

export async function getDeviceRequest(id) {
  const { data } = await axios.get(`${URL}/device/${id}`);
  return data.device;
}

export async function updateDeviceRequest(id, updateData) {
  const response = await axios.patch(`${URL}/device/${id}`, updateData);
  return response;
}

export async function deleteDeviceRequest(id) {
  const response = await axios.delete(`${URL}/device/${id}`);
  return response.data;
}
