import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  // Check if the user is authenticated
  const isAuthenticated = false;

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child routes
  return (
    <div>
      {/* Render any common layout elements */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
