import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import DevicesPage from "./pages/Device/DevicesPage";
import DevicePage from "./pages/Device/DevicePage";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
// Create a client
const queryClient = new QueryClient();
const MainPage = () => {
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
        <MainPage />
      </QueryClientProvider>
    ),

    children: [
      {
        path: "devices",
        element: <DevicesPage />,
      },
      {
        path: "devices/:id",
        element: <DevicePage />,
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
