"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { SIDEBAR_NAVIGATION_ITEMS } from "@/core/constants";
import { cn } from "@/lib/utils";

const SidebarNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="mt-9">
      <ul className="space-y-5">
        {SIDEBAR_NAVIGATION_ITEMS.map((navigationItem) => {
          const { icon, label, path } = navigationItem;

          const isActive = pathname === path;

          return (
            <li
              key={path}
              className={cn(
                "h-[52px] flex justify-center items-center rounded-xl cursor-pointer text-light-100 lg:justify-start lg:px-[30px] lg:rounded-full h5",
                {
                  "shadow-drop-2 bg-brand text-white": isActive,
                }
              )}
            >
              <Link href={path} className="flex gap-4">
                <Image
                  src={icon}
                  alt="Navigation icon"
                  width={24}
                  height={24}
                />
                <span className="hidden lg:block">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
