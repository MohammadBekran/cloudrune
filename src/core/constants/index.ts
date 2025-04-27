export const SIDEBAR_NAVIGATION_ITEMS = [
  {
    icon: "/icons/dashboard.svg",
    label: "Dashboard",
    path: "/",
  },
  {
    icon: "/icons/documents.svg",
    label: "Documents",
    path: "/documents",
  },
  {
    icon: "/icons/images.svg",
    label: "Images",
    path: "/images",
  },
  {
    icon: "/icons/video.svg",
    label: "Media",
    path: "/media",
  },
  {
    icon: "/icons/others.svg",
    label: "Others",
    path: "/others",
  },
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const TWO_GIGABYTE_IN_BYTE = 2 * 1024 * 1024;
