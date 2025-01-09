import type { Metadata } from "next";

import AuthForm from "@/features/auth/components/auth-form";

import { protectRoute } from "@/core/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "In this page you can sign in to the website to use the features of CloudRune",
};

const SignInPage = async () => {
  await protectRoute({ redirectUrl: "/" });

  return <AuthForm authType="sign-in" />;
};

export default SignInPage;
