"use server";

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/core/queries";

export const protectRoute = async ({
  isLoggedIn = true,
  redirectUrl,
}: {
  isLoggedIn?: boolean;
  redirectUrl: string;
}) => {
  const user = await getCurrent();

  if (isLoggedIn ? user : !user) redirect(redirectUrl);
};
