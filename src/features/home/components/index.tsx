"use client";

import { useSignOut } from "@/features/auth/core/services/api/mutations.api";

import { Button } from "@/components/ui/button";

const Home = () => {
  const { mutate: signOut, isPending: isSigningOutPending } = useSignOut();

  const handleSignOut = () => signOut();

  return (
    <Button onClick={handleSignOut} disabled={isSigningOutPending}>
      SignOut
    </Button>
  );
};

export default Home;
