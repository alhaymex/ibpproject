import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import Navbar from "@/components/Navbar";
import CheckAuth from "@/provider/CheckAuth";
import { MyProvider } from "@/provider/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IBP Project",
  description: "Internet Based Programming Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MyProvider>
      <CheckAuth>
        <html lang="en">
          <body className={inter.className}>
            <NextTopLoader color="yellow" showSpinner={false} />

            <Navbar />
            <main className="m-6">{children}</main>
          </body>
        </html>
      </CheckAuth>
    </MyProvider>
  );
}
