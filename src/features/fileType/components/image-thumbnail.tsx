import { Models } from "node-appwrite";

import Thumbnail from "@/components/thumbnail";
import FormattedDateTime from "@/components/formatted-date-time";

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  const { type, name, extension, url, $createdAt } = file;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-light/300 p-3 mb-1 bg-light-400/50">
      <Thumbnail type={type} extension={extension} url={url} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{name}</p>
        <FormattedDateTime date={$createdAt} className="caption text-left" />
      </div>
    </div>
  );
};

export default ImageThumbnail;
