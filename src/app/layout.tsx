import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import QueryProvider from "@/components/partials/providers/query-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CloudRune",
  description: "CloudRune - store management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased font-poppins", poppins.className)}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
