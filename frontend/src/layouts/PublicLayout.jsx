import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  // Check if the user is authenticated
  const isAuthenticated = false;

  // If the user is authenticated, render the child routes
  return (
    <div>
      {/* Render any common layout elements */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
