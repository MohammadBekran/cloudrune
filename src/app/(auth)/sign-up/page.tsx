import type { Metadata } from "next";

import AuthForm from "@/features/auth/components/auth-form";

import { protectRoute } from "@/core/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "In this page you can sign up to the website to use the features of CloudRune",
};

const SignUpPage = async () => {
  await protectRoute({ redirectUrl: "/" });

  return <AuthForm authType="sign-up" />;
};

export default SignUpPage;
