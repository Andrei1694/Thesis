import { useMutation, useQueries, useQuery } from "react-query";

export const useDevicesQuery = (page, sortBy) => {
  return useQuery(
    {
      queryKey: ["devices", page, sortBy],
      queryFn: () => getDevicesRequest(page, sortBy),
    },
    {
      // enabled: false,
    }
  );
};
