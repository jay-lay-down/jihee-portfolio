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
      <body
        className="antialiased bg-[#FDFBF7]"
        style={{
          fontFamily:
            '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
        }}
      >
        {/* ⬇⬇ 여기서 max-w-screen-xl / mx-auto 싹 제거 */}
        <main className="min-h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
