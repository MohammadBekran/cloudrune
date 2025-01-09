export type TFileTypeDropdownOption = {
  readonly value: string;
  readonly icon: string;
  readonly label: string;
};

export type TFileType = "document" | "image" | "video" | "audio" | "other";

export type TFile =
  | "documents"
  | "images"
  | "videos"
  | "audios"
  | "media"
  | "others";
