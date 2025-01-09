import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Models } from "node-appwrite";

import FileDetails from "@/features/fileType/components/file-details";
import ShareFile from "@/features/fileType/components/share-file";
import { FILE_TYPE_CARD_DROPDOWN_ACTIONS } from "@/features/fileType/core/constants";
import type { TFileTypeDropdownOption } from "@/features/fileType/core/types";
import {
  useDeleteFile,
  useRenameFile,
  useUpdateFileUsers,
} from "@/features/files/core/services/api/mutations.api";
import { useGetCurrentUser } from "@/features/auth/core/services/api/queries.api";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { constructDownloadUrl, toast } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FileActions = ({ file }: { file: Models.Document }) => {
  // TODO: Admin

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<TFileTypeDropdownOption | null>(null);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const { mutate: renameFile, isPending: isRenamingFilePending } =
    useRenameFile();
  const { mutate: deleteFile, isPending: isDeletingFilePending } =
    useDeleteFile();
  const { mutate: updateUsers, isPending: isUpdatingUsersPending } =
    useUpdateFileUsers();
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) return;

  const isOwner = file.owner.$id === currentUser.data.user.$id;
  const isDisabled =
    isRenamingFilePending || isDeletingFilePending || isUpdatingUsersPending;

  const handleCloseAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setName(file.name);
    setEmails([]);
  };

  const handleDropdownActionClick = ({
    actionItem,
  }: {
    actionItem: TFileTypeDropdownOption;
  }) => {
    setAction(actionItem);

    if (["rename", "share", "delete", "details"].includes(actionItem.value))
      setIsModalOpen(true);
  };

  const handleRemoveUser = ({ email }: { email: string }) => {
    const newEmails = emails.filter((e) => e !== email);

    updateUsers(
      {
        json: {
          fileId: file.$id,
          emails: newEmails,
        },
      },
      {
        onSuccess: () => handleCloseAllModals(),
      }
    );
  };

  const handleAction = async () => {
    if (!action) return;

    const actions = {
      rename: () =>
        renameFile(
          {
            json: { fileId: file.$id, name },
          },
          {
            onSuccess: ({ data }) => {
              file.name = data.name;

              handleCloseAllModals();
            },
          }
        ),
      delete: () =>
        deleteFile({
          json: {
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
          },
        }),
      share: async () => {
        if (emails.includes(currentUser?.data.user.email))
          toast.error("You can't add yourself");
        else {
          updateUsers(
            {
              json: {
                fileId: file.$id,
                emails,
              },
            },
            {
              onSuccess: () => handleCloseAllModals(),
            }
          );
        }
      },
    };

    return actions[action.value as keyof typeof actions]();
  };

  const renderDialogContent = () => {
    if (!action) return;

    const { value, label } = action;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    };

    return (
      <DialogContent className="button w-[90%] max-w-[400px] !rounded-[26px] py-8 px-6">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "details" && <FileDetails file={file} />}
          {value === "rename" && (
            <Input type="text" value={name} onChange={handleNameChange} />
          )}
          {value === "delete" && (
            <p className="text-center text-light-100">
              Are you sure you want to delete{" "}
              <span className="font-medium text-brand-100">{file.name}</span>
            </p>
          )}
          {value === "share" && (
            <ShareFile
              file={file}
              disabled={isDisabled}
              userId={currentUser.data.user.$id}
              onEmailsChange={setEmails}
              onRemoveUser={handleRemoveUser}
            />
          )}
        </DialogHeader>
        {isOwner && ["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              type="button"
              disabled={
                isDisabled || (action.value === "share" && emails.length === 0)
              }
              className="h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent"
              onClick={handleCloseAllModals}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isDisabled || (action.value === "share" && emails.length === 0)
              }
              className="primary-button w-full !h-[52px] flex-1 !mx-0"
              onClick={handleAction}
            >
              <p className="capitalize">{value}</p>
              {isDisabled && (
                <Image
                  src="/icons/loader.svg"
                  alt="Loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger>
          <Image src="/icons/dots.svg" alt="Dots" width={34} height={34} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FILE_TYPE_CARD_DROPDOWN_ACTIONS.map((actionItem) => {
            const fileUrl = constructDownloadUrl({ fileId: file.bucketFileId });

            if (
              !isOwner &&
              (actionItem.value === "delete" || actionItem.value === "rename")
            )
              return;

            return (
              <DropdownMenuItem
                key={actionItem.value}
                className="cursor-pointer"
                onClick={() => handleDropdownActionClick({ actionItem })}
              >
                {actionItem.value === "download" ? (
                  <Link
                    href={fileUrl}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default FileActions;
