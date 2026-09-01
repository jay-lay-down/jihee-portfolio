import type { Metadata } from "next";
import "./globals.css";

export const SITE_URL = "https://www.jayportfolio.xyz";

const DESCRIPTION =
  "심리학 기반 리서처이자 데이터 분석 실무자 조지희의 포트폴리오. 세그먼테이션, 수요예측, 베이지안 모델링, 텍스트마이닝, GEO/LLM 프로젝트를 문제 정의부터 대시보드까지 정리했습니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "조지희 | 리서치 · 데이터 분석 · AI 포트폴리오",
    template: "%s | 조지희 포트폴리오",
  },
  description: DESCRIPTION,
  applicationName: "Jihee Cho Portfolio",
  authors: [{ name: "조지희 (Jihee Cho)", url: SITE_URL }],
  creator: "조지희 (Jihee Cho)",
  keywords: [
    "조지희",
    "Jihee Cho",
    "데이터 분석 포트폴리오",
    "리서처 포트폴리오",
    "마케팅 리서치",
    "세그먼테이션",
    "수요예측",
    "베이지안 모델링",
    "텍스트마이닝",
    "감성분석",
    "GEO",
    "생성형 엔진 최적화",
    "LLM",
    "RAG",
  ],
  alternates: {
    canonical: "/",
    languages: { "ko-KR": "/", "en-US": "/" },
  },
  openGraph: {
    type: "profile",
    siteName: "조지희 포트폴리오",
    title: "조지희 | 리서치 · 데이터 분석 · AI 포트폴리오",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR",
    images: [{ url: "/hero.jpg", width: 2400, height: 1610, alt: "조지희 포트폴리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "조지희 | 리서치 · 데이터 분석 · AI 포트폴리오",
    description: DESCRIPTION,
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "portfolio",
};

/*
  구조화 데이터. 검색엔진의 리치 결과뿐 아니라, 생성형 엔진이 이 사이트를
  인용할 때 "누가 무엇을 하는 사람인지"를 본문 파싱에 기대지 않고
  집어갈 수 있게 하는 것이 목적이다.
*/
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "조지희",
  alternateName: "Jihee Cho",
  url: SITE_URL,
  image: `${SITE_URL}/avatar.jpg`,
  jobTitle: "리서처 · 데이터 분석가",
  description: DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "서울", addressCountry: "KR" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "서울여자대학교 대학원", description: "아동심리학 석사" },
    { "@type": "CollegeOrUniversity", name: "서울여자대학교", description: "아동학 학사" },
  ],
  knowsAbout: [
    "마케팅 리서치",
    "세그먼테이션",
    "수요예측",
    "베이지안 통계",
    "텍스트마이닝",
    "감성분석",
    "생성형 엔진 최적화(GEO)",
    "LLM 파인튜닝",
    "RAG",
  ],
  sameAs: [
    "https://github.com/jay-lay-down",
    "https://www.linkedin.com/in/jihee-cho-767aa9260/",
    "https://huggingface.co/Jay1121",
    "https://velog.io/@jaylaydown",
  ],
};

const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "조지희 포트폴리오",
  url: SITE_URL,
  inLanguage: "ko-KR",
  author: { "@type": "Person", name: "조지희" },
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
          href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquareNeo@1.0/nanumsquareneo.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />
      </head>
      <body
        className="antialiased bg-[#F7FBFD]"
        style={{
          fontFamily:
            '"NanumSquareNeoVariable", NanumSquareNeo, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
        }}
      >
        {/* ✅ 전체 가로 폭 사용 */}
        <main className="min-h-screen w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
