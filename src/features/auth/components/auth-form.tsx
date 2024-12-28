"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import VerifyOTPModal from "@/features/auth/components/verify-otp-modal";
import { createAccount, signIn } from "@/features/auth/core/actions";
import { useVerifyOTPModal } from "@/features/auth/core/hooks";
import type { TAuthType } from "@/features/auth/core/types";
import { authSchema } from "@/features/auth/core/validations";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/utils";

const AuthForm = ({ authType }: { authType: TAuthType }) => {
  const [accountId, setAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authSchema({ authType });
  type TSignInFormData = z.infer<typeof formSchema>;
  const form = useForm<TSignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { open } = useVerifyOTPModal();

  const isSignInPage = authType === "sign-in";
  const title = isSignInPage ? "Sign In" : "Sign Up";
  const authParagraph = isSignInPage
    ? "Don't have an account?"
    : "Already have an account?";
  const buttonText = isSignInPage ? "Sign In" : "Sign Up";
  const linkTitle = isSignInPage ? "Sign Up" : "Sign In";
  const linkPath = isSignInPage ? "/sign-up" : "/sign-in";

  const onSubmit = async (values: TSignInFormData) => {
    const { email, fullName } = values;

    setIsLoading(true);

    try {
      const account =
        authType === "sign-up"
          ? await createAccount({
              email,
              fullName: fullName ?? "",
            })
          : await signIn({
              email,
            });

      if (account.accountId) {
        setAccountId(account.accountId);
        open({ email });

        toast.success("Success");
      } else toast.error(account.error);
    } catch {
      setIsLoading(false);

      toast.error("Failed to perform this action");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[580px] max-h-[800px] flex flex-col justify-center space-y-7 lg:h-full">
        <h1 className="text-[34px] font-bold text-center leading-[42px] text-light-100 lg:text-start">
          {title}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
            {!isSignInPage && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Full name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full primary-button"
            >
              {buttonText}
              {isLoading && (
                <Image
                  src="/icons/loader.svg"
                  alt="Loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-light-100 body-2">
          {authParagraph}{" "}
          <Link href={linkPath} className="font-medium text-brand ml-1">
            {linkTitle}
          </Link>
        </p>
      </div>
      <VerifyOTPModal accountId={accountId} />
    </>
  );
};

export default AuthForm;
