import FileUploader from "@/components/file-uploader";
import LogoutButton from "@/components/logout-button";
import Search from "@/components/search";

interface IHeaderProps {
  accountId: string;
  ownerId: string;
}

const Header = ({ accountId, ownerId }: IHeaderProps) => {
  return (
    <div className="hidden justify-between items-center gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
      <Search />
      <div className="flex justify-center items-center gap-4">
        <FileUploader accountId={accountId} ownerId={ownerId} />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;
