import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jihee Cho | Portfolio",
  description: "Data Analyst Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased bg-[#FDFBF7]">
        <main className="min-h-screen mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-24 max-w-[1440px]">
          {children}
        </main>
      </body>
    </html>
  );
}
