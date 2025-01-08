import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "@/lib/utils";

type TUploadFileRequest = InferRequestType<
  (typeof client.api.files)["upload-file"]["$post"]
>;
type TUploadFileResponse = InferResponseType<
  (typeof client.api.files)["upload-file"]["$post"],
  200
>;

export const useUploadFile = () => {
  const mutation = useMutation<TUploadFileResponse, Error, TUploadFileRequest>({
    mutationKey: ["upload-file"],
    mutationFn: async ({ form }) => {
      const response = await client.api.files["upload-file"]["$post"]({ form });

      if (!response.ok) throw new Error("Failed to upload the file");

      return await response.json();
    },
    onSuccess: () => toast.success("File Uploaded"),
    onError: () => toast.error("Failed to upload the file"),
  });

  return mutation;
};
