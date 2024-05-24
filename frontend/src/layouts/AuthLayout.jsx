import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { queryClient } from "../App";
import { getAuthToken } from "../utils/auth";

const AuthLayout = () => {
  const navigate = useNavigate();
  const authData = queryClient.getQueryData('authToken')
  useEffect(() => {
    const checkAuth = () => {
      const { token, id } = getAuthToken() ?? {};

      if (token) {
        queryClient.setQueryData("authToken", { token, isAuthenticated: true, id });
      } else {
        queryClient.setQueryData("authToken", {
          token: null,
          isAuthenticated: false,
          id: null
        });
        navigate("/login", { replace: true });
      }
    };

    checkAuth();

    // Listen for storage changes and update the authentication state
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [authData, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
