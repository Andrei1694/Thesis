// utils/authUtils.js
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setAuthToken = (token, id) => {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + THIRTY_DAYS_IN_MS;
  localStorage.setItem("authToken", JSON.stringify({ token, expirationTime, id }));
};

export const getAuthToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("authToken"));
  if (tokenData && tokenData.expirationTime > new Date().getTime()) {
    return tokenData;
  }
  return null;
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
