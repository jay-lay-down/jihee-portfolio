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
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className="antialiased bg-[#FDFBF7]"
        style={{
          fontFamily:
            '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
        }}
      >
        <main className="min-h-screen w-full flex justify-center">
          {/* ✅ 가운데 정렬 + 최대 폭 제한 */}
          <div className="w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
