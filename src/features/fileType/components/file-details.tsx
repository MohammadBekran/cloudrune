import { Models } from "node-appwrite";

import FileDetailRow from "@/features/fileType/components/file-detail-row";
import ImageThumbnail from "@/features/fileType/components/image-thumbnail";

import { convertFileSize, formatDateTime } from "@/lib/utils";

const FileDetails = ({ file }: { file: Models.Document }) => {
  const { extension, size, owner, $updatedAt } = file;

  const fileSize = convertFileSize({ sizeInBytes: size });
  const ownerFullname = owner.fullName;
  const formattedDate = formatDateTime({ isoString: $updatedAt });

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <FileDetailRow label="Format:" value={extension} />
        <FileDetailRow label="Size:" value={fileSize} />
        <FileDetailRow label="Owner" value={ownerFullname} />
        <FileDetailRow label="Last edit:" value={formattedDate} />
      </div>
    </>
  );
};

export default FileDetails;
