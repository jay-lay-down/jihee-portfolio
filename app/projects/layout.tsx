import type { Metadata } from "next";

// projects/page.tsx 는 client component라 metadata를 직접 내보낼 수 없어 여기서 준다.
export const metadata: Metadata = {
  title: "프로젝트",
  description:
    "세그먼테이션, 수요예측, 베이지안 모델링, 텍스트마이닝, GEO/LLM까지 — 조지희가 문제 정의부터 배포까지 담당한 프로젝트 목록.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "프로젝트 | 조지희 포트폴리오",
    description:
      "세그먼테이션, 수요예측, 베이지안 모델링, 텍스트마이닝, GEO/LLM 프로젝트 목록.",
    url: "/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
