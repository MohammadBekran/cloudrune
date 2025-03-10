"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useLogOut } from "@/features/auth/core/services/api/mutations.api";
import { useGetSummary } from "@/features/files/core/services/api/queries.api";

import FileUploader from "@/components/file-uploader";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SIDEBAR_NAVIGATION_ITEMS } from "@/core/constants";
import { cn, convertFileSize } from "@/lib/utils";

interface IMobileNavigationProps {
  ownerId: string;
  accountId: string;
  avatar: string;
  fullName: string;
  email: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  avatar,
  fullName,
  email,
}: IMobileNavigationProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const { mutate: logOut } = useLogOut();
  const { data: summary } = useGetSummary();

  const summaryUsed = summary?.data.used;
  const isUserAccessToUpload =
    summaryUsed && convertFileSize({ sizeInBytes: summaryUsed });

  const handleLogOut = () => logOut();

  return (
    <header className="h-[60px] flex justify-between items-center px-5 sm:hidden">
      <Logo width={30} height={30} fontSize={20} />
      <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
        <SheetTrigger asChild>
          <Image
            src="/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="h-screen px-3 pt-0">
          <SheetTitle>
            <div className="flex items-center gap-2 rounded-full p-1 my-3 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3">
              <Image
                src={avatar}
                alt="Avatar"
                width={44}
                height={44}
                className="w-10 rounded-full aspect-square object-cover"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <ul className="h5 flex flex-col flex-1 gap-2 text-brand">
            {SIDEBAR_NAVIGATION_ITEMS.map((navigationItem, index) => {
              const { icon, label, path } = navigationItem;

              const isActive = pathname === path;

              const handleNavigationItemClick = () => {
                router.push(path);

                setIsOpenSheet(false);
              };

              return (
                <li
                  key={`${path}-${index}`}
                  className={cn(
                    "h-[52px] flex items-center gap-4 rounded-full cursor-pointer px-6 text-light-100 lg:justify-start lg:px-[30px] lg:rounded-full h5",
                    {
                      "shadow-drop-2 bg-brand text-white": isActive,
                    }
                  )}
                  onClick={handleNavigationItemClick}
                >
                  <Image
                    src={icon}
                    alt="Navigation icon"
                    width={24}
                    height={24}
                  />
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
          <Separator className="my-4 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            {isUserAccessToUpload && isUserAccessToUpload !== "2.0" && (
              <FileUploader accountId={accountId} ownerId={ownerId} />
            )}
            <Button
              type="submit"
              className="h5 h-[52px] rounded-full flex items-center gap-4 px-6 transition-all shadow-none bg-brand/10 text-brand hover:bg-brand/20"
              onClick={handleLogOut}
            >
              <Image
                src="/icons/logout.svg"
                alt="Logout"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
