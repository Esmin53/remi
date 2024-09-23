import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rummy Online",
  description: "Online multiplayer rummy card game",
  icons: {
    icon: "/icon.ico", 
    href: "/icon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
			  <link rel='icon' href='/icon.ico' />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen w-full bg-primaryblue text-white">
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
