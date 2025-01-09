export const FILE_TYPES = [
  "documents",
  "images",
  "videos",
  "audios",
  "media",
  "others",
] as const;

export const FILE_TYPE_CARD_DROPDOWN_ACTIONS = [
  {
    value: "rename",
    label: "Rename",
    icon: "/icons/edit.svg",
  },
  {
    value: "details",
    label: "Details",
    icon: "/icons/info.svg",
  },
  {
    value: "share",
    label: "Share",
    icon: "/icons/share.svg",
  },
  {
    value: "download",
    label: "Download",
    icon: "/icons/download.svg",
  },
  {
    value: "delete",
    label: "Delete",
    icon: "/icons/delete.svg",
  },
] as const;

export const FILES_SORT_ITEMS = [
  {
    value: "$createdAt-desc",
    label: "Date created (newest)",
  },
  {
    value: "$createdAt-asc",
    label: "Created date (oldest)",
  },
  {
    value: "name-asc",
    label: "Name (A-Z)",
  },
  {
    value: "name-desc",
    label: "Name (Z-A)",
  },
  {
    value: "size-desc",
    label: "Size (highest)",
  },
  {
    value: "size-asc",
    label: "Size (lowest)",
  },
] as const;
