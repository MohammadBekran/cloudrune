import { parseAsString, useQueryStates } from "nuqs";

export const useFileFilters = () => {
  const [fileFilters, setFileFilters] = useQueryStates({
    search: parseAsString.withOptions({ clearOnDefault: true }),
    sort: parseAsString,
  });

  return {
    fileFilters,
    setFileFilters,
  };
};
