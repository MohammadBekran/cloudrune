import { Dispatch, SetStateAction } from "react";
import { Models } from "appwrite";

import ImageThumbnail from "@/features/fileType/components/image-thumbnail";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IShareFileProps {
  file: Models.Document;
  userId: string;
  disabled: boolean;
  onEmailsChange: Dispatch<SetStateAction<string[]>>;
  onRemoveUser: ({ email }: { email: string }) => void;
}

const ShareFile = ({
  file,
  userId,
  disabled,
  onEmailsChange,
  onRemoveUser,
}: IShareFileProps) => {
  const isOwner = file.owner.$id === userId;

  return (
    <div className="space-y-5">
      <ImageThumbnail file={file} />
      {isOwner && (
        <div className="space-y-2">
          <p className="subtitle-2 pl-1 text-light-100">
            Share file with other users
          </p>
          <Input
            type="email"
            placeholder="Enter email address"
            onChange={(e) => onEmailsChange(e.target.value.trim().split(","))}
            className="body-2 shad-no-focus w-full h-[52px] rounded-full border px-4 !shadow-drop-1"
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="subtitle-2 text-light-100">Shared with</span>
        <span className="subtitle-2 text-light-200">
          {file.users.length} users
        </span>
      </div>
      <ul
        className={cn({
          "space-y-3": !isOwner,
        })}
      >
        {file.users.length > 0 &&
          file.users.map((email: string) => (
            <li key={email} className="flex justify-between items-center">
              <span>{email}</span>
              {isOwner && (
                <Button
                  disabled={disabled}
                  className="rounded-full shadow-none bg-transparent text-light-100 hover:bg-transparent"
                  onClick={() => onRemoveUser({ email })}
                >
                  <Image
                    src="/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="aspect-square rounded-full"
                  />
                </Button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ShareFile;
