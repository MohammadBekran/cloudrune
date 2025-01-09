import { useQuery } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/hono";

type TGetFilesRequest = InferRequestType<
  (typeof client.api.files)["get-files"]["$post"]
>;

export const useGetFiles = ({ json }: TGetFilesRequest) => {
  const query = useQuery({
    queryKey: ["files", json],
    queryFn: async () => {
      const response = await client.api.files["get-files"]["$post"]({
        json,
      });

      if (!response.ok) return null;

      return await response.json();
    },
  });

  return query;
};

export const useGetSummary = () => {
  const query = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const response = await client.api.files["summary"]["$get"]();

      if (!response.ok) throw new Error("Failed to get the summary");

      return await response.json();
    },
  });

  return query;
};
