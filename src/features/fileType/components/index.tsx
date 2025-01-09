"use client";

import { Loader2Icon } from "lucide-react";

import {
  useGetFiles,
  useGetSummary,
} from "@/features/files/core/services/api/queries.api";
import FileCard from "@/features/fileType/components/file-card";
import Sort from "@/features/fileType/components/sort";
import type { TFile, TFileType } from "@/features/fileType/core/types";

import { useFileFilters } from "@/core/hooks";
import { convertFileSize } from "@/lib/utils";

interface IFileTypeProps {
  type: TFile;
  types: string[];
}

const FileType = ({ type, types }: IFileTypeProps) => {
  const { fileFilters } = useFileFilters();
  const { data: summary } = useGetSummary();
  const { data: files, isLoading: isFilesLoading } = useGetFiles({
    json: {
      types,
      searchText: fileFilters.search ?? undefined,
      sort: fileFilters.sort ?? undefined,
    },
  });

  const fileType = type.split("s")[0] as TFileType;
  const fileSize =
    type === "media"
      ? (summary?.data["video"]?.size ?? 0) +
        (summary?.data["audio"]?.size ?? 0)
      : summary?.data[fileType]?.size ?? 0;

  const filesSize = convertFileSize({
    sizeInBytes: fileSize,
  });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="flex flex-col justify-between mt-2 sm:flex-row sm:items-center">
          <p className="body-1">
            Total: <span className="h5">{filesSize}</span>
          </p>
          <div className="flex items-center mt-5 sm:gap-3 sm:mt-0">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>
      <section className="w-full">
        {isFilesLoading ? (
          <div className="flex justify-center items-center">
            <Loader2Icon className="size-10 text-muted-foreground animate-spin" />
          </div>
        ) : files && files.data.total > 0 ? (
          <section className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files?.data.documents.map((file) => (
              <FileCard key={file.$id} file={file} />
            ))}
          </section>
        ) : (
          <p className="body-2 text-center text-light-100">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default FileType;
