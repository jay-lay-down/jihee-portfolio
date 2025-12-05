import type { Metadata } from "next";
import "./globals.css";

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
      {/* 여기에 style 속성으로 폰트를 강제 주입했습니다 */}
      <body className="antialiased bg-[#FDFBF7]" style={{ fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>
        <main className="min-h-screen max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
          {children}
        </main>
      </body>
    </html>
  );
}
