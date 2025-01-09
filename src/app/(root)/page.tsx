import type { Metadata } from "next";

import Home from "@/features/home/components";

export const metadata: Metadata = {
  title: "CloudRune - Home",
  description: "In this page you can see some information about your files",
};

const HomePage = async () => {
  return <Home />;
};

export default HomePage;
