import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster"
// import { RecoilRoot } from 'recoil';
import RecoidContextProvider from "./recoilContextProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Appwrite_hf project",
  description: "this app is for generate word and meaning from youtube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body >
        <RecoidContextProvider>
          {children}
          <Toaster />
          </RecoidContextProvider>
        </body>
      </html>
    
  );
}
