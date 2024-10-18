import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "/public/font-mfizz-2.4.1/font-mfizz.css";

import StyledComponentsRegistry from '../../lib/registry';

import Head from 'next/head';


import MenuBar from "./components/menu/MenuBar"

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <MenuBar />
          <div className="bg-slate-900">
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
