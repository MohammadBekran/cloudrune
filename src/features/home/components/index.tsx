"use client";

import { useGetSummary } from "@/features/files/core/services/api/queries.api";
import RecentFilesUploaded from "@/features/home/components/recent-files-uploaded";
import SummaryCards from "@/features/home/components/summary-cards";
import UsageChart from "@/features/home/components/usage-chart";
import { HOME_SUMMARY_CARD_ITEMS } from "@/features/home/core/constants";

const Home = () => {
  const { data: summary } = useGetSummary();

  if (!summary) return;

  const summaryCardOptions = HOME_SUMMARY_CARD_ITEMS({
    totalSpace: summary.data,
  });

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
        <div>
          <UsageChart used={summary?.data.used ?? 0} />
          <SummaryCards summaryCardOptions={summaryCardOptions} />
        </div>
        <RecentFilesUploaded />
      </div>
    </div>
  );
};

export default Home;
