import type { TTotalSpace } from "@/features/home/core/types";

export const HOME_SUMMARY_CARD_ITEMS = ({
  totalSpace,
}: {
  totalSpace: TTotalSpace;
}) => {
  return [
    {
      title: "Documents",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      path: "/documents",
      icon: "/icons/file-document-light.svg",
    },
    {
      title: "Images",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      path: "/images",
      icon: "/icons/file-image-light.svg",
    },
    {
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      path: "/media",
      icon: "/icons/file-video-light.svg",
    },
    {
      title: "Others",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      path: "/others",
      icon: "/icons/file-other-light.svg",
    },
  ];
};
