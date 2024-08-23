import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./utils/auth";

// Import components
import Navbar from "./components/navbar.component";
import DevicesListPage from "./pages/Device/device-list.page";
import DeviceDetails from "./pages/Device/device-details.page";
import Profile from "./pages/User/profile.page";
import Users from "./pages/User/users.page";
import LoginPage from "./pages/Login/login.page";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";

// Create a client
export const queryClient = new QueryClient();

const AppLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/devices" replace /> },
          { path: "profile", element: <Profile /> },
          { path: "users", element: <Users /> },
          { path: "users/:id", element: <Profile /> },
          { path: "devices/:id", element: <DeviceDetails /> },
          { path: "devices", element: <DevicesListPage /> },
        ],
      },
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
        ]
      }
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;