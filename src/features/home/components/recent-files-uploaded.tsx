import { Loader2Icon } from "lucide-react";
import Link from "next/link";

import { useGetFiles } from "@/features/files/core/services/api/queries.api";
import FileActions from "@/features/fileType/components/file-actions";

import FormattedDateTime from "@/components/formatted-date-time";
import Thumbnail from "@/components/thumbnail";

const RecentFilesUploaded = () => {
  const { data: files, isLoading: isFilesLoading } = useGetFiles({
    json: {
      limit: 10,
    },
  });

  return (
    <div className="h-full rounded-[20px] p-5 bg-white xl:p-8">
      <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
      {isFilesLoading ? (
        <div className="h-full flex justify-center items-center">
          <Loader2Icon className="size-10 text-muted-foreground animate-spin" />
        </div>
      ) : (
        files &&
        files.data && (
          <ul className="space-y-3 mt-4">
            {files.data.documents.map((file) => {
              const { $id, name, type, extension, url, $createdAt } = file;

              return (
                <Link
                  href={url}
                  target="_blank"
                  key={$id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <Thumbnail type={type} extension={extension} url={url} />
                    <div className="space-y-1">
                      <span className="subtitle-2 w-full line-clamp-1 text-light-100 sm:max-w-[200px] lg:max-w-[250px]">
                        {name}
                      </span>
                      <FormattedDateTime
                        date={$createdAt}
                        className="caption"
                      />
                    </div>
                  </div>
                  <FileActions file={file} />
                </Link>
              );
            })}
          </ul>
        )
      )}
    </div>
  );
};

export default RecentFilesUploaded;
