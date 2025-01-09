import Link from "next/link";
import { Models } from "appwrite";

import FileActions from "@/features/fileType/components/file-actions";

import Thumbnail from "@/components/thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/formatted-date-time";

const FileCard = ({ file }: { file: Models.Document }) => {
  const { url, name, type, extension, size, owner, $createdAt } = file;

  const fileSize = convertFileSize({
    sizeInBytes: size,
  });

  return (
    <Link
      href={url}
      target="_blank"
      className="flex flex-col gap-6 transition-all rounded-[18px] shadow-sm cursor-pointer p-5 bg-white hover:shadow-drop-3"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={type}
          extension={extension}
          url={url}
          classes={{
            figure: "size-20",
            image: "size-11",
          }}
        />
        <div className="flex flex-col justify-between items-end">
          <FileActions file={file} />
          <p className="body-1">{fileSize}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-light-100">
        <p className="subtitle-2 line-clamp-1">{name}</p>
        <FormattedDateTime
          date={$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {owner.fullName}
        </p>
      </div>
    </Link>
  );
};

export default FileCard;
