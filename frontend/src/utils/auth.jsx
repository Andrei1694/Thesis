// utils/authUtils.js
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const setAuthToken = (token) => {
  console.log(token);
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + THIRTY_DAYS_IN_MS;
  localStorage.setItem("authToken", JSON.stringify({ token, expirationTime }));
};

export const getAuthToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("authToken"));
  if (tokenData && tokenData.expirationTime > new Date().getTime()) {
    return tokenData.token;
  }
  return null;
};

export const removeAuthToken = () => {
  console.log('delete token local')
  localStorage.removeItem("authToken");
};
