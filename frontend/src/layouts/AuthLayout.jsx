import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { queryClient } from "../App";
import { getAuthToken } from "../utils/auth";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (token) {
        queryClient.setQueryData("authToken", { token, isAuthenticated: true });
      } else {
        queryClient.setQueryData("authToken", {
          token: null,
          isAuthenticated: false,
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
  }, [navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
