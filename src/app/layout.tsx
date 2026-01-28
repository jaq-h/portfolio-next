import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  const { menu, projects, icons, about, contact } = await getAllContent();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to reCAPTCHA domains for faster loading on Contact page */}
        <link
          rel="preconnect"
          href="https://www.google.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
      </head>
      {/* Preload reCAPTCHA script - loads early but doesn't block rendering */}
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="lazyOnload"
      />
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
        <ContentProvider
          menu={menu}
          projects={projects}
          icons={icons}
          about={about}
          contact={contact}
        >
          <div className="2xl:max-w-[1800px] 2xl:mx-auto 2xl:flex">
            <MenuBar />
            <main className="lg:ml-64 2xl:ml-0 2xl:flex-1">{children}</main>
          </div>
        </ContentProvider>
      </body>
    </html>
  );
}
