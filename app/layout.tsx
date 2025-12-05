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
      <body
        className="font-sans antialiased bg-[#FDFBF7]"
        style={{
          fontFamily:
            '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
        }}
      >
        {/* 전체 폭: 최대 1440px */}
        <main className="min-h-screen mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-14 xl:px-16">
          {children}
        </main>
      </body>
    </html>
  );
}
