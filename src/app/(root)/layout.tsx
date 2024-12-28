import { getCurrentUser } from "@/features/auth/core/actions";

import Sidebar from "@/components/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getCurrentUser();

  return (
    <main className="min-h-screen flex">
      <div>
        <Sidebar
          avatar={user.avatar}
          fullName={user.fullName}
          email={user.email}
        />
      </div>
      <div>{children}</div>
    </main>
  );
};

export default Layout;
