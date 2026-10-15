import { PROJECTS } from "../projects/data";
import { getDocBySlug } from "@/lib/markdown";
import { SITE_URL } from "../layout";

/*
  llms.txt — 생성형 엔진이 사이트를 요약할 때 읽어가는 평문 인덱스.
  PROJECTS와 케이스 스터디 원문에서 만들어 내용이 어긋나지 않게 한다.
*/
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    "# 조지희 (Jihee Cho) 포트폴리오",
    "",
    "> 심리학을 기반으로 한 소비자 리서처. Kantar, NIQ-GfK 등 글로벌 리서치사에서",
    "> 브랜드 진단, 세그먼테이션, Conjoint, KANO, FGI, 사용성 테스트를 설계하고 수행했습니다.",
    "> 최근에는 생성형 AI 검색에서 소비자 질문과 브랜드 노출을 측정하는 GEO 업무를 하고 있습니다.",
    "",
    `사이트: ${SITE_URL}`,
    "소재지: 대한민국 서울",
    "",
    "## 전문 분야",
    "",
    "- 소비자 조사 설계 (정량/정성, 브랜드 진단, Conjoint, KANO, FGI, 사용성 테스트)",
    "- 마케팅·브랜드 리서치, 시장 인텔리전스",
    "- 세그먼테이션 (LPA, 의사결정나무, PCA/EFA)",
    "- 수요예측 (SARIMAX, seq2seq LSTM)",
    "- 베이지안 모델링 및 대시보드",
    "- 텍스트마이닝, 감성분석, 동시출현 네트워크",
    "- 생성형 엔진 최적화(GEO/AEO), LLM 파인튜닝, RAG",
    "",
    "## 프로젝트",
    "",
  ];

  for (const p of PROJECTS) {
    const ko = getDocBySlug("content/projects", `${p.slug}.ko`);
    const title = (p.titleKo ?? p.title).replace(/^[^\p{L}\p{N}]+/u, "").trim();
    lines.push(`### ${title}`);
    lines.push("");
    lines.push(`- 분야: ${p.category}`);
    lines.push(`- 요약: ${p.oneLinerKo ?? p.oneLiner}`);
    lines.push(`- 기술: ${p.stack.join(", ")}`);
    if (ko?.meta.description) lines.push(`- 상세: ${ko.meta.description}`);
    lines.push(`- 케이스 스터디: ${SITE_URL}/projects/${p.slug}`);
    for (const l of p.links) {
      if (l.href.startsWith("http")) lines.push(`- ${l.label}: ${l.href}`);
    }
    lines.push("");
  }

  lines.push("## 참고");
  lines.push("");
  lines.push("진행 중인 클라이언트 프로젝트는 비밀유지를 위해 공개하지 않으며,");
  lines.push("공개된 케이스 스터디에서도 고객사명은 마스킹되어 있습니다.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
