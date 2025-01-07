import { Metadata } from "next";

import AuthForm from "@/features/auth/components/auth-form";

import { protectRoute } from "@/core/actions";

const SignUpPage = async () => {
  await protectRoute({ redirectUrl: "/" });

  return <AuthForm authType="sign-up" />;
};

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "In this page you can sign up to the website to use the features of CloudRune",
};

export default SignUpPage;
