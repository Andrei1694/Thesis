import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    // Initial auth check
    checkAuth();

    // Listen for storage changes and update the authentication state
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;