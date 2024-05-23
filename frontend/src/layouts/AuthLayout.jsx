import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { queryClient } from "../App";
import { getAuthToken } from "../utils/auth";

const AuthLayout = () => {
  const navigate = useNavigate();
  const authData = queryClient.getQueryData("authToken");

  useEffect(() => {
    console.log(authData);
    let isAuthenticated = authData?.isAuthenticated ?? false;
    console.log(isAuthenticated);
    console.log(getAuthToken());

    if (!getAuthToken()) {
      console.log("trigger");
      isAuthenticated = false;
    }

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authData, navigate]);

  // If the user is authenticated, render the child routes
  return (
    <div>
      {/* Render any common layout elements */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
