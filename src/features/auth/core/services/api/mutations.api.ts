import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "@/lib/utils";

type TSendEmailOTPRequest = InferRequestType<
  (typeof client.api.auth)["send-email-otp"]["$post"]
>;
type TSendEmailOTPResponse = InferResponseType<
  (typeof client.api.auth)["send-email-otp"]["$post"],
  200
>;

type TVerifyOTPRequest = InferRequestType<
  (typeof client.api.auth)["verify-email-otp"]["$post"]
>;
type TVerifyOTPResponse = InferResponseType<
  (typeof client.api.auth)["verify-email-otp"]["$post"],
  200
>;

type TCreateAccountRequest = InferRequestType<
  (typeof client.api.auth)["create-account"]["$post"]
>;
type TCreateAccountResponse = InferResponseType<
  (typeof client.api.auth)["create-account"]["$post"],
  200
>;

type TSignInRequest = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type TSignInResponse = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"],
  200
>;

type TSignOutResponse = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"],
  200
>;

export const useSendEmailOTP = () => {
  const mutation = useMutation<
    TSendEmailOTPResponse,
    Error,
    TSendEmailOTPRequest
  >({
    mutationKey: ["send-email-otp"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["send-email-otp"]["$post"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to send an email OTP");

      return await response.json();
    },
    onSuccess: () => toast.success("OTP has been sent"),
    onError: () => toast.error("Failed to send an OTP"),
  });

  return mutation;
};

export const useVerifyEmailOTP = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TVerifyOTPResponse, Error, TVerifyOTPRequest>({
    mutationKey: ["verify-email-otp"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["verify-email-otp"]["$post"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to verify email OTP");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("OTP has been verified");

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    onError: () => toast.error("Failed to verify OTP"),
  });

  return mutation;
};

export const useCreateAccount = () => {
  const mutation = useMutation<
    TCreateAccountResponse,
    Error,
    TCreateAccountRequest
  >({
    mutationKey: ["create-account"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["create-account"]["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      return await response.json();
    },
    onSuccess: () => toast.success("Account has been created"),
    onError: () => toast.error("Failed to create account"),
  });

  return mutation;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TSignInResponse, Error, TSignInRequest>({
    mutationKey: ["sign-in"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"]["$post"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to sign in");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged In");

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    onError: () => toast.error("Failed to log in"),
  });

  return mutation;
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TSignOutResponse, Error>({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const response = await client.api.auth["sign-out"]["$post"]();

      if (!response.ok) throw new Error("Failed to sign out");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed Out");

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    onError: () => toast.error("Failed to sign out"),
  });

  return mutation;
};
