import Image from "next/image";

import Logo from "@/components/logo";
import SidebarNavigation from "@/components/sidebar-navigation";
import Link from "next/link";

interface ISidebarProps {
  avatar: string;
  fullName: string;
  email: string;
}

const Sidebar = ({ avatar, fullName, email }: ISidebarProps) => {
  return (
    <div className="hidden overflow-auto w-[90px] min-h-screen flex-col justify-between py-7 px-5 sm:flex lg:w-[280px] xl:w-[325px]">
      <div>
        <div className="hidden lg:block">
          <Link href="/">
            <Logo width={50} height={50} fontSize={24} />
          </Link>
        </div>
        <div className="lg:hidden">
          <Link href="/">
            <Logo width={50} height={50} showText={false} />
          </Link>
        </div>
        <SidebarNavigation />
      </div>
      <div className="space-y-2">
        <Image src="/images/files-2.png" alt="Files" width={506} height={418} />
        <div className="flex justify-center items-center gap-2 rounded-full mt-4 text-light-100 bg-brand/10 lg:justify-start lg:p-3">
          <Image
            src={avatar}
            alt="Avatar"
            width={44}
            height={44}
            className="w-10 aspect-square rounded-full object-cover"
          />
          <div className="hidden lg:flex lg:flex-col">
            <span className="capitalize truncate subtitle-2">{fullName}</span>
            <span className="caption truncate">{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
