import Image from "next/image";

import Logo from "@/components/logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex justify-center mt-10 lg:hidden">
        <Logo width={60} height={60} fontSize={22} />
      </div>
      <div className="hidden w-1/2 justify-center items-center p-10 bg-brand xl:w-2/5 lg:flex">
        <div className="max-w-[430px] max-h-[800px] space-y-12">
          <Logo white />
          <div className="space-y-5 text-white">
            <h2 className="text-[34px] font-bold leading-[42px]">
              Manage your files the best way
            </h2>
            <p className="text-base font-normal leading-6">
              This is a place where you can store all of your documents
            </p>
          </div>
          <Image
            src="/images/files.png"
            alt="Store image"
            className="transition-all hover:rotate-2 hover:scale-105"
            width={342}
            height={342}
          />
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 p-4 py-10 bg-white lg:justify-center lg:p-10 lg:py-0">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
