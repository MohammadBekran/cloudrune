import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const handleError = ({
  message,
  error,
}: {
  message: string;
  error: unknown;
}) => {
  console.error(message, error);

  throw error;
};

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export { toast } from "sonner";
