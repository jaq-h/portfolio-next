import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MenuBar from "./components/menubar/MenuBar";
import { ContentProvider } from "@/lib/content/provider";
import { getAllContent } from "@/lib/content/fetcher";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jacques Hebert",
  description: "Personal Project Portfolio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all content server-side from Edge Config (with ISR caching)
  // Falls back to local JSON files if Edge Config is not configured
  const { menu, projects, icons } = await getAllContent();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 min-h-screen`}
      >
        {/*
          Content is fetched server-side and provided via React Context.
          This prevents prop drilling and allows any component to access content.

          Layout breakpoints:
          - Mobile (< md): Hamburger dropdown menu
          - Tablet (md - lg): Top bar with inline nav items
          - Desktop (>= lg): Fixed menu bar (sidebar style) with ml-64 on content
        */}
        <ContentProvider menu={menu} projects={projects} icons={icons}>
          <MenuBar />
          <main className="lg:ml-64">{children}</main>
        </ContentProvider>
      </body>
    </html>
  );
}
