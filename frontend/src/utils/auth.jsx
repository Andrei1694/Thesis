// utils/authUtils.js
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setAuthToken = (token, id) => {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + THIRTY_DAYS_IN_MS;
  localStorage.setItem("authToken", JSON.stringify({ token, expirationTime, id }));
};

export const getAuthToken = () => {
  try {
    const tokenData = JSON.parse(localStorage.getItem("authToken"));
    if (tokenData && tokenData.expirationTime && tokenData.id) {
      const currentTime = new Date().getTime();
      if (tokenData.expirationTime > currentTime) {
        return tokenData;
      } else {
        // Token has expired, remove it from local storage
        localStorage.removeItem("authToken");
      }
    }
  } catch (error) {
    console.error("Error parsing authToken from local storage:", error);
  }
  return null;
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
