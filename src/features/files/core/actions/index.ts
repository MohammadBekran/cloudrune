import { Query } from "node-appwrite";

import { TFileType } from "@/features/fileType/core/types";
import type { TUserTotalSpaceUsed } from "@/features/files/core/types";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_FILES_COLLECTION_ID,
} from "@/core/configs";
import { TWO_GIGABYTE_IN_BYTE } from "@/core/constants";

export const getUserTotalSpaceUsed = async ({
  databases,
  currentUser,
}: TUserTotalSpaceUsed) => {
  const files = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_FILES_COLLECTION_ID,
    [Query.equal("owner", [currentUser.$id])]
  );

  const totalSpace = {
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: TWO_GIGABYTE_IN_BYTE,
  };

  for (const file of files.documents) {
    const fileType = file.type as TFileType;
    const latestDate = totalSpace[fileType].latestDate;

    totalSpace[fileType].size += file.size;
    totalSpace.used += file.size;

    if (!latestDate || new Date(file.$updatedAt) > new Date(latestDate)) {
      totalSpace[fileType].latestDate = file.$updatedAt;
    }
  }

  return totalSpace;
};
