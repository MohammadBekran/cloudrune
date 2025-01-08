"use client";

import { useLogOut } from "@/features/auth/core/services/api/mutations.api";

import { Button } from "@/components/ui/button";

const Home = () => {
  const { mutate: LogOut, isPending: isSigningOutPending } = useLogOut();

  const handleLogOut = () => LogOut();

  return (
    <Button onClick={handleLogOut} disabled={isSigningOutPending}>
      LogOut
    </Button>
  );
};

export default Home;
