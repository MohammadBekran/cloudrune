import Image from "next/image";

import { cn, getFileIcon } from "@/lib/utils";

interface IThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  classes?: {
    figure?: string;
    image?: string;
  };
}

const Thumbnail = ({ type, extension, url = "", classes }: IThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure
      className={cn(
        "size-[50px] min-w-[50px] overflow-hidden flex justify-center items-center rounded-full bg-brand/10",
        classes?.figure
      )}
    >
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="Thumbnail"
        width={100}
        height={100}
        className={cn("size-8 object-contain", classes?.image, {
          "size-full object-cover object-center": isImage,
        })}
      />
    </figure>
  );
};

export default Thumbnail;
