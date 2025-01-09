interface IFileDetailRowProps {
  label: string;
  value: string;
}

const FileDetailRow = ({ label, value }: IFileDetailRowProps) => {
  return (
    <div className="flex">
      <p className="w-[30%] body-2 text-left text-light-100">{label}</p>
      <p className="body-2 text-left text-light-100 truncate">{value}</p>
    </div>
  );
};

export default FileDetailRow;
