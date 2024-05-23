import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { queryClient } from "../App";

const AuthLayout = () => {
  const navigate = useNavigate();
  const authData = queryClient.getQueryData("authToken");
  useEffect(() => {
    console.log(authData);
    const { isAuthenticated } = authData ?? {};
    console.log(isAuthenticated);

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [queryClient.getQueryData("authToken")]);

  // If the user is authenticated, render the child routes
  return (
    <div>
      {/* Render any common layout elements */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
