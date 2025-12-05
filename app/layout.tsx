// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jihee Cho Portfolio",
  description: "Data Analyst Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 여기에 혹시 <Header />나 <Navbar />가 있었다면 삭제! 
           우리는 page.tsx에서 헤더를 다 컨트롤하니까 여기는 비워둬야 함.
        */}
        
        <main className="min-h-screen max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
          {children}
        </main>

        {/* 여기에 <Footer />가 있었다면 삭제! */}
      </body>
    </html>
  );
}
