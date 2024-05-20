import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar.component";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import DevicesListPage from "./pages/Device/device-list.page";
import DeviceDetails from "./pages/Device/device-details.page";
import { QueryClient, QueryClientProvider } from "react-query";
import Profile from "./pages/User/profile.page";
import Users from "./pages/User/users.page";
import AuthModal from "./forms/auth.form";
// Create a client
const queryClient = new QueryClient();
const MainLayout = () => {
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
        path: "devices",
        element: <DevicesListPage />,
      },
      {
        path: "devices/:id",
        element: <DeviceDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "login",
        element: <AuthModal />,
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
