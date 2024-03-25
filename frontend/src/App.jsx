import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import DevicesListPage from "./pages/Device/device-list.page";
import DevicePage from "./pages/Device/DevicePage";
import { QueryClient, QueryClientProvider } from "react-query";
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
        element: <DevicePage />,
      },
      {
        path: "devices/:sda/edit",
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
