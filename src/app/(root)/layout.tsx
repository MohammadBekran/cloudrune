import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/core/queries";

import Sidebar from "@/components/sidebar";
import { protectRoute } from "@/core/actions";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await protectRoute({ isLoggedIn: false, redirectUrl: "/sign-in" });

  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  const { avatar, fullName, email } = user;

  return (
    <main className="min-h-screen flex">
      <div>
        <Sidebar avatar={avatar} fullName={fullName} email={email} />
      </div>
      <div>{children}</div>
    </main>
  );
};

export default Layout;
