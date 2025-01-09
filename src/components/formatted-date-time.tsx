import { cn, formatDateTime } from "@/lib/utils";

interface IFormattedDateTimeProps {
  date: string;
  className?: string;
}

const FormattedDateTime = ({ date, className }: IFormattedDateTimeProps) => {
  const formattedDate = formatDateTime({ isoString: date });

  return (
    <p className={cn("body-1 text-light-200", className)}>{formattedDate}</p>
  );
};

export default FormattedDateTime;
