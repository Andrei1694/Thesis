import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If the user is authenticated, redirect them to a protected route
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is not authenticated, render the child routes
  return (
    <div>
      {/* Render any common layout elements for public pages */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
