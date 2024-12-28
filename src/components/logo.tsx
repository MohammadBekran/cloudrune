import Image from "next/image";

import { cn } from "@/lib/utils";

interface ILogoProps {
  white?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
}

const Logo = ({
  white = false,
  width = 100,
  height = 79,
  fontSize,
}: ILogoProps) => {
  const logoUrl = white ? "/icons/white-logo.svg" : "/icons/logo.svg";

  return (
    <div
      className={cn(
        "flex items-center gap-x-2  font-bold",
        white ? "text-white" : "text-brand",
        !fontSize && "text-4xl"
      )}
      style={{ fontSize }}
    >
      <Image src={logoUrl} alt="Logo" width={width} height={height} />
      CloudRune
    </div>
  );
};

export default Logo;
