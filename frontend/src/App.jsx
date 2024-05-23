import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import DevicesListPage from "./pages/Device/device-list.page";
import DeviceDetails from "./pages/Device/device-details.page";
import { QueryClient, QueryClientProvider } from "react-query";
import Profile from "./pages/User/profile.page";
import Users from "./pages/User/users.page";
import AuthForm from "./forms/auth.form";
import { useEffect, useState } from "react";
import { getAuthToken } from "./utils/auth";
import LoginPage from "./pages/Login/login.page";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
// Create a client
export const queryClient = new QueryClient();
const MainLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      queryClient.setQueryData("authToken", { token, isAuthenticated: true });
      navigate("/profile");
    }
  }, []);
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
    element: (
      <QueryClientProvider client={queryClient}>
        <MainLayout />
      </QueryClientProvider>
    ),

    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
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
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
