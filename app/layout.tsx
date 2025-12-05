import type { Metadata } from "next";
import "./globals.css"; // 여기서 Pretendard 폰트를 불러옴

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
      {/* 폰트 설정은 globals.css에서 처리했으므로 className에서 제거함 */}
      {/* 배경색(bg-[#FDFBF7])은 그대로 유지 */}
      <body className="antialiased bg-[#FDFBF7]">
        <main className="min-h-screen max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
          {children}
        </main>
      </body>
    </html>
  );
}
