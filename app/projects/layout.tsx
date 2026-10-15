import type { Metadata } from "next";

// projects/page.tsx 는 client component라 metadata를 직접 내보낼 수 없어 여기서 준다.
export const metadata: Metadata = {
  title: "프로젝트",
  description:
    "소비자 세그먼테이션, VoC 텍스트마이닝, 브랜드 이미지 평가, 구매 퍼널, 수요예측, GEO까지 조지희가 문제 정의부터 배포까지 담당한 프로젝트 목록.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "프로젝트 | 조지희 포트폴리오",
    description:
      "소비자 세그먼테이션, VoC 텍스트마이닝, 브랜드 이미지 평가, 수요예측, GEO 프로젝트 목록.",
    url: "/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
