import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/core/queries";

import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobile-navigation";
import { protectRoute } from "@/core/actions";
import Header from "@/components/header";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await protectRoute({ isLoggedIn: false, redirectUrl: "/sign-in" });

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { $id, accountId, avatar, fullName, email } = user;

  return (
    <main className="min-h-screen sm:flex">
      <div>
        <Sidebar avatar={avatar} fullName={fullName} email={email} />
        <MobileNavigation
          ownerId={$id}
          accountId={accountId}
          avatar={avatar}
          fullName={fullName}
          email={email}
        />
      </div>
      <div className="size-full">
        <Header accountId={accountId} ownerId={$id} />
        <div className="overflow-auto h-full flex-1 px-5 py-7 bg-light-400 sm:rounded-[30px] sm:mr-7 md:mb-7 md:px-9 md:py-10">
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
