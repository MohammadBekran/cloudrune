"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Loader2Icon } from "lucide-react";

import { useGetFiles } from "@/features/files/core/services/api/queries.api";

import FormattedDateTime from "@/components/formatted-date-time";
import Thumbnail from "@/components/thumbnail";
import { Input } from "@/components/ui/input";
import { useFileFilters } from "@/core/hooks";

const Search = () => {
  const router = useRouter();
  const { fileFilters, setFileFilters } = useFileFilters();
  const [searchText] = useDebounce(fileFilters.search ?? undefined, 300);
  const [isOpenFiles, setIsOpenFile] = useState(
    (searchText?.length ?? 0) > 0 ? true : false
  );
  const { data: files, isLoading: isFilesLoading } = useGetFiles({
    json: {
      searchText,
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFileFilters({ ...fileFilters, search: e.target.value });

  const handleClickFile = ({ fileType }: { fileType: string }) => {
    const url = `/${
      fileType === "video" || fileType === "audio" ? "media" : fileType + "s"
    }?search=${searchText}`;
    router.push(url);

    setIsOpenFile(false);
  };

  useEffect(() => {
    if (searchText && searchText.length > 0) setIsOpenFile(true);
  }, [searchText]);

  return (
    <div className="relative w-full md:max-w-[480px]">
      <div className="h-[52px] flex flex-1 items-center gap-3 rounded-full shadow-drop-3 px-4">
        <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
        <Input
          type="text"
          value={fileFilters.search ?? ""}
          placeholder="Search..."
          className="body-2 shad-no-focus w-full border-none shadow-none p-0 placeholder:body-1 placeholder:text-light-200"
          onChange={handleSearchChange}
        />
      </div>
      {isOpenFiles &&
        (searchText?.length ?? 0) > 0 &&
        (isFilesLoading ? (
          <div className="search-results-wrapper flex justify-center items-center">
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : (files?.data.total ?? 0) > 0 ? (
          <ul className="search-results-wrapper">
            {files?.data.documents.map((file) => (
              <li
                key={file.$id}
                className="flex justify-between items-center"
                onClick={() => handleClickFile({ fileType: file.type })}
              >
                <div className="w-full flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      classes={{
                        figure: "size-9 min-w-9",
                      }}
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100 truncate max-w-[200px]">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="search-results-wrapper">
            <p className="body-2 text-center text-light-100">No files found</p>
          </div>
        ))}
    </div>
  );
};

export default Search;
