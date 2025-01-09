import Link from "next/link";

import { HOME_SUMMARY_CARD_ITEMS } from "@/features/home/core/constants";
import Image from "next/image";
import { convertFileSize } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import FormattedDateTime from "@/components/formatted-date-time";

const SummaryCards = ({
  summaryCardOptions,
}: {
  summaryCardOptions: ReturnType<typeof HOME_SUMMARY_CARD_ITEMS>;
}) => {
  return (
    <ul className="grid grid-cols-1 gap-4 mt-6 xl:grid-cols-2 xl:gap-9 xl:mt-10">
      {summaryCardOptions.map((card) => {
        const { title, icon, path, size, latestDate } = card;

        const fileSize = convertFileSize({ sizeInBytes: size });

        return (
          <Link
            key={title}
            href={path}
            className="relative rounded-[20px] transition-all p-5 mt-6 bg-white hover:scale-105"
          >
            <div className="space-y-4">
              <div className="flex justify-between gap-3">
                <Image
                  src={icon}
                  alt={title}
                  width={100}
                  height={100}
                  className="absolute top-[-25px] -left-3 w-[190px] z-10 object-contain"
                />
                <h4 className="h4 relative w-full z-10 text-right">
                  {fileSize}
                </h4>
              </div>
              <h5 className="h5 relative z-20 text-center">{title}</h5>
              <Separator className="bg-light-400" />
              <FormattedDateTime date={latestDate} className="text-center" />
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export default SummaryCards;
