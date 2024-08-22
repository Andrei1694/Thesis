import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import DevicesListPage from "./pages/Device/device-list.page";
import DeviceDetails from "./pages/Device/device-details.page";
import { QueryClient, QueryClientProvider } from "react-query";
import Profile from "./pages/User/profile.page";
import Users from "./pages/User/users.page";
import LoginPage from "./pages/Login/login.page";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import { AuthProvider } from "./utils/auth"; // Make sure to create this file if it doesn't exist

// Create a client
export const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/devices" replace /> },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "devices/:id",
            element: <DeviceDetails />,
          },
          {
            path: "devices",
            element: <DevicesListPage />,
          },
        ],
      },
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ]
      }
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;