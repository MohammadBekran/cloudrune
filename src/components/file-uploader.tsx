"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUploadFile } from "@/features/files/core/services/api/mutations.api";
import { useGetSummary } from "@/features/files/core/services/api/queries.api";

import Thumbnail from "@/components/thumbnail";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE } from "@/core/constants";
import {
  cn,
  convertFileSize,
  convertFileToUrl,
  getFileType,
  toast,
} from "@/lib/utils";

interface IFileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({
  ownerId,
  accountId,
  className,
}: IFileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { data: summary } = useGetSummary();
  const { mutateAsync: uploadFile } = useUploadFile({
    onUploadFile: (fileName) =>
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName)
      ),
  });

  const used = convertFileSize({ sizeInBytes: summary?.data?.used! });
  const canUpload = used !== "2 GB";

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles?.filter((f) => f.name !== file.name)
          );

          toast.error("File is too long");
        }

        return await uploadFile({
          form: {
            ownerId,
            accountId,
            file,
            path: "/",
          },
        });
      });

      await Promise.all(uploadPromises);
    },
    [accountId, ownerId, uploadFile]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = ({
    e,
    fileName,
  }: {
    e: React.MouseEvent<HTMLImageElement, MouseEvent>;
    fileName: string;
  }) => {
    e.stopPropagation();

    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        type="button"
        className={cn(
          "primary-button !h-[52px] gap-2 px-10 shadow-drop-1",
          className
        )}
        disabled={!canUpload}
      >
        <Image src="/icons/upload.svg" alt="Upload" width={24} height={24} />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="fixed bottom-10 right-10 z-50 size-full max-w-[480px] h-fit flex flex-col gap-3 rounded-[20px] shadow-drop-3 p-7 bg-white">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.length &&
            files?.map((file, index) => {
              const { type, extension } = getFileType({ fileName: file.name });
              const url = convertFileToUrl({ file });

              return (
                <li
                  key={`${file.name}-${index}`}
                  className="flex justify-between items-center gap-3 rounded-xl shadow-drop-3 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Thumbnail type={type} extension={extension} url={url} />
                    <div className="subtitle-2 max-w-[300px] line-clamp-1 mb-2">
                      {file.name}
                      <Image
                        src="/icons/file-loader.gif"
                        alt="Loader"
                        width={80}
                        height={26}
                      />
                    </div>
                  </div>
                  <Image
                    src="/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    onClick={(e) =>
                      handleRemoveFile({ e, fileName: file.name })
                    }
                  />
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
