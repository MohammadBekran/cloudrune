import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await client.api.auth["get-current-user"]["$get"]();

      if (!response.ok) return null;

      return response;
    },
  });

  return query;
};
