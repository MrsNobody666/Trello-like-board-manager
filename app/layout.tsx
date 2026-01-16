import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasker AI | Premium Productivity",
  description: "Organize your workflow with next-level precision.",
};

import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { BoardCreationModal } from "@/components/modals/BoardCreationModal";

import { GlobalAutomationModal } from "@/components/modals/GlobalAutomationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased h-full font-sans bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-x-hidden`}
      >
        <ThemeProvider />
        <BoardCreationModal />
        <GlobalAutomationModal />
        <div className="h-full relative">
          <Navbar />
          <div className="flex h-full pt-14">
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-14 z-40 border-r border-neutral-200 dark:border-white/5 bg-white dark:bg-[#030712] shadow-xl">
              <Sidebar />
            </div>
            <main className="flex-1 md:pl-64 h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
