"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useLogOut } from "@/features/auth/core/services/api/mutations.api";

import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();
  const { mutate: logout } = useLogOut();

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: () => router.push("/sign-in"),
    });

  return (
    <Button
      className="min-w-[54px] h-[52px] flex justify-center items-center transition-all rounded-full shadow-none p-0 bg-brand/10 text-brand hover:bg-brand/20"
      onClick={handleLogout}
    >
      <Image
        src="/icons/logout.svg"
        alt="Logout"
        width={24}
        height={24}
        className="w-6"
      />
    </Button>
  );
};

export default LogoutButton;
