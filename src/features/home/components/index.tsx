"use client";

import { signOut } from "@/features/auth/core/actions";

import { Button } from "@/components/ui/button";

const Home = () => {
  const handleSignOut = () => signOut();

  return <Button onClick={handleSignOut}>SignOut</Button>;
};

export default Home;
