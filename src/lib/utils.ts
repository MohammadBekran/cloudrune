import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  APPWRITE_BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
} from "@/core/configs";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const handleError = ({
  message,
  error,
}: {
  message: string;
  error: unknown;
}) => {
  console.error(message, error);

  throw error;
};

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export const getFileType = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { type: "other", extension: "" };

  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "csv",
    "rtf",
    "ods",
    "ppt",
    "odp",
    "md",
    "html",
    "htm",
    "epub",
    "pages",
    "fig",
    "psd",
    "ai",
    "indd",
    "xd",
    "sketch",
    "afdesign",
    "afphoto",
    "afphoto",
  ];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  if (documentExtensions.includes(extension))
    return { type: "document", extension };
  if (imageExtensions.includes(extension)) return { type: "image", extension };
  if (videoExtensions.includes(extension)) return { type: "video", extension };
  if (audioExtensions.includes(extension)) return { type: "audio", extension };

  return { type: "other", extension };
};

export const convertFileToUrl = ({ file }: { file: File }) =>
  URL.createObjectURL(file);

export const constructFileUrl = ({ fileId }: { fileId: string }) => {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/preview?project=${APPWRITE_PROJECT_ID}`;
};

export const getFileIcon = (
  extension: string | undefined,
  type: File | string
) => {
  switch (extension) {
    // Document
    case "pdf":
      return "/icons/file-pdf.svg";
    case "doc":
      return "/icons/file-doc.svg";
    case "docx":
      return "/icons/file-docx.svg";
    case "csv":
      return "/icons/file-csv.svg";
    case "txt":
      return "/icons/file-txt.svg";
    case "xls":
    case "xlsx":
      return "/icons/file-document.svg";
    // Image
    case "svg":
      return "/icons/file-image.svg";
    // Video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "/icons/file-video.svg";
    // Audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "/icons/file-audio.svg";

    default:
      switch (type) {
        case "image":
          return "/icons/file-image.svg";
        case "document":
          return "/icons/file-document.svg";
        case "video":
          return "/icons/file-video.svg";
        case "audio":
          return "/icons/file-audio.svg";
        default:
          return "/icons/file-other.svg";
      }
  }
};

export { toast } from "sonner";
