import { FILES_SORT_ITEMS } from "@/features/fileType/core/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileFilters } from "@/core/hooks";

const Sort = () => {
  const { fileFilters, setFileFilters } = useFileFilters();

  const handleSortValueChange = (value: string) => {
    setFileFilters({ ...fileFilters, sort: value });
  };

  return (
    <Select
      defaultValue={fileFilters.sort ?? FILES_SORT_ITEMS[0].value}
      onValueChange={handleSortValueChange}
    >
      <SelectTrigger className="shad-no-focus w-full h-11 rounded-[8px] border-transparent shadow-sm bg-white sm:w-[210px]">
        <SelectValue placeholder={FILES_SORT_ITEMS[0].label} />
      </SelectTrigger>
      <SelectContent className="shadow-drop-3">
        {FILES_SORT_ITEMS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
