import { useMutation, useQueryClient } from "@tanstack/react-query";
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

type TRenameFileRequest = InferRequestType<
  (typeof client.api.files)["rename-file"]["$patch"]
>;
type TRenameFileResponse = InferResponseType<
  (typeof client.api.files)["rename-file"]["$patch"],
  200
>;

type TDeleteFileRequest = InferRequestType<
  (typeof client.api.files)["delete-file"]["$delete"]
>;
type TDeleteFileResponse = InferResponseType<
  (typeof client.api.files)["delete-file"]["$delete"],
  200
>;

type TUpdateFileUsersRequest = InferRequestType<
  (typeof client.api.files)["update-file-users"]["$post"]
>;
type TUpdateFileUsersResponse = InferResponseType<
  (typeof client.api.files)["update-file-users"]["$post"],
  200
>;

export const useUploadFile = ({
  onUploadFile,
}: {
  onUploadFile?: (fileName: string) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TUploadFileResponse, Error, TUploadFileRequest>({
    mutationKey: ["upload-file"],
    mutationFn: async ({ form }) => {
      const response = await client.api.files["upload-file"]["$post"]({ form });

      if (!response.ok) throw new Error("Failed to upload the file");

      return await response.json();
    },
    onSuccess: (_data, variables) => {
      toast.success("File Uploaded");

      onUploadFile?.(variables.form.file.name);

      queryClient.invalidateQueries({
        queryKey: ["files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      });
    },
    onError: () => toast.error("Failed to upload the file"),
  });

  return mutation;
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TRenameFileResponse, Error, TRenameFileRequest>({
    mutationKey: ["upload-file"],
    mutationFn: async ({ json }) => {
      const response = await client.api.files["rename-file"]["$patch"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to upload the file");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("File Renamed");

      queryClient.invalidateQueries({
        queryKey: ["files"],
      });
    },
    onError: () => toast.error("Failed to rename the file"),
  });

  return mutation;
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TDeleteFileResponse, Error, TDeleteFileRequest>({
    mutationKey: ["delete-file"],
    mutationFn: async ({ json }) => {
      const response = await client.api.files["delete-file"]["$delete"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to delete the file");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("File Deleted");

      queryClient.invalidateQueries({
        queryKey: ["files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      });
    },
    onError: () => toast.error("Failed to delete the file"),
  });

  return mutation;
};

export const useUpdateFileUsers = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TUpdateFileUsersResponse,
    Error,
    TUpdateFileUsersRequest
  >({
    mutationKey: ["update-file-users"],
    mutationFn: async ({ json }) => {
      const response = await client.api.files["update-file-users"]["$post"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to update the users");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Users Updated");

      queryClient.invalidateQueries({
        queryKey: ["files"],
      });
    },
    onError: () => toast.error("Failed to update the users"),
  });

  return mutation;
};
