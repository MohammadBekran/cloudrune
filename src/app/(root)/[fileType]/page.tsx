import type { Metadata } from "next";
import { redirect } from "next/navigation";

import FileType from "@/features/fileType/components";
import { FILE_TYPES } from "@/features/fileType/core/constants";
import type { TFile } from "@/features/fileType/core/types";

import { getFileTypesParams } from "@/lib/utils";

interface IFileTypePageProps {
  params: Promise<{ fileType: string }>;
}

export const generateMetadata = async ({
  params,
}: IFileTypePageProps): Promise<Metadata> => {
  const { fileType } = await params;

  const type =
    fileType.charAt(0).toUpperCase() + fileType.slice(1).toLowerCase();

  return {
    title: type,
    description: `In this page you can see all of your ${type}`,
  };
};

const FileTypePage = async ({ params }: IFileTypePageProps) => {
  const { fileType } = await params;

  if (!FILE_TYPES.includes(fileType as TFile)) redirect("/");
  const types = getFileTypesParams({ type: fileType });

  return <FileType type={fileType as TFile} types={types} />;
};

export default FileTypePage;
