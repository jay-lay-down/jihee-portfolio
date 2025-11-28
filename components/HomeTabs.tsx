"use client";

import { useMemo, useState } from "react";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  resume: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  github: "https://github.com/jay-lay-down",
};

const REPOS = [
  {
    title: "AI/LLM-powered Analytics Chatbot",
    href: "https://github.com/jay-lay-down/jaychatbot_2nd",
    note: "LoRA/QLoRA 기반 파인튜닝 + self-hosting",
  },
  {
    title: "Social Animal Type Test",
    href: "https://github.com/jay-lay-down/animal_test",
    note: "Gradio 기반 서비스형 웹 테스트",
  },
  {
    title: "Auto Segment Tool (Desktop EXE)",
    href: "https://github.com/jay-lay-down/auto_segment",
    note: "PCA → Tree 기반 segmentation 자동화",
  },
  {
    title: "Bayesian Modeling & Dashboard",
    href: "https://github.com/jay-lay-down/bayesian_dashboard",
    note: "PyMC + 대시보드로 의사결정 연결",
  },
  {
    title: "Brand Image Bayesian Norms",
    href: "https://github.com/jay-lay-down/bayesian_norm",
    note: "소셜+설문 결합, Bayesian 기반 평가",
  },
  {
    title: "Demand Forecasting (SARIMAX)",
    href: "https://github.com/jay-lay-down/demand_forecasting",
    note: "수요예측 파이프라인/패키지화",
  },
  {
    title: "Brand Share% Forecasting (seq2seq)",
    href: "https://github.com/jay-lay-down/seq2seq_softmax",
    note: "seq2seq LSTM/Attention 기반 예측",
  },
  {
    title: "Employee Engagement (LPA)",
    href: "https://github.com/jay-lay-down/LPA_synthetic_vars",
    note: "Latent Profile Analysis로 세그먼트 도출",
  },
];

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm hover:opacity-85 transition"
    >
      {children} <span className="text-[var(--muted)]">↗</span>
    </a>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<"Home" | "About" | "Projects">("Home");

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Projects" as const, label: "Details" },
    ],
    []
  );

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold border transition",
              tab === t.key
                ? "border-black/20 bg-black text-white"
                : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PANEL */}
      <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/55 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {tab === "Home" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">
              About
            </h2>
            <p className="mt-4 text-[15px] text-[var(--muted)] leading-8">
              7년차 데이터 분석가로서 서울대학교병원 연구원으로 커리어를 시작해 엠브레인, NIQ(구 GfK), 칸타코리아까지
              <span className="font-semibold text-[var(--fg)]"> 시장조사·리서치·데이터 분석</span> 경험을 확장해 왔습니다.
              다양한 산업군의 리서치 프로젝트를 수행하며 <span className="font-semibold text-[var(--fg)]">PPT 스토리라인 구성, 프레젠테이션, 클라이언트 워크숍/커뮤니케이션</span>까지 end-to-end로 리드해 왔습니다.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Technical Expertise</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] leading-7">
                  <li>• R / Python / SPSS 기반 고급 통계 분석</li>
                  <li>• SEM, PCA/요인분석, 의사결정나무, Bayesian 네트워크</li>
                  <li>• 시계열 인과(Granger) 및 수요예측(SARIMAX)</li>
                  <li>• LLM 파인튜닝/LoRA, RAG 기반 분석 자동화로 확장</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Highlights</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] leading-7">
                  <li>• GfK 재직 시 중단 고객사 온라인 데이터 윈백으로 매출 회복 및 수상</li>
                  <li>• 입사 첫 해 대형 프로젝트 수주 경험</li>
                  <li>• 수요예측 모델 개발 및 조직 내 표준화 경험</li>
                  <li>• 반복 업무 자동화(분석→시각화→리포팅) 툴을 직접 개발/배포</li>
                </ul>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resume}>Resume</ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>{LINKS.email}</ChipLink>
            </div>
          </>
        )}

        {tab === "About" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">
              Focus (Strengths)
            </h2>

            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">통계 전문성 + 실무 적용력</div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                  분석 기법 자체보다, 비즈니스 문제를 구조화하고 적합한 방법론을 선택해 실행 가능한 인사이트로 연결하는 역량을 강점으로 보유하고 있습니다.
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">End-to-End 자동화 역량</div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                  분석 → 시각화 → 리포팅까지 전 과정을 Python 기반으로 자동화해, 반복 업무를 효율화하고 분석 품질을 표준화하는 방향의 솔루션을 구축해 왔습니다.
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">AI/ML 확장성</div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                  통계 기반 역량을 출발점으로 LLM 파인튜닝/챗봇 구현, RAG 기반 자동화까지 빠르게 습득하고 실제 서비스 형태로 구현해 왔습니다.
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">클라이언트 커뮤니케이션</div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                  비전문가도 이해할 수 있는 언어로 분석 결과를 전달하고, 고객의 니즈를 제안/사업 개발로 연결하는 “영업-분석 통합” 실행 경험을 보유하고 있습니다.
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-3xl border border-[var(--line)] bg-white/70 p-6">
              <div className="text-sm font-bold">Contact</div>
              <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                <a className="underline underline-offset-4 hover:opacity-80" href={`mailto:${LINKS.email}`}>
                  {LINKS.email}
                </a>
              </div>
            </div>
          </>
        )}

        {tab === "Projects" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">
              Details (Selected Repositories)
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-7">
              아래 항목은 각각 GitHub 레포지토리로 연결됩니다.
            </p>

            <div className="mt-6 grid gap-3">
              {REPOS.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-bold">{r.title}</div>
                      <div className="mt-1 text-sm text-[var(--muted)] leading-7">{r.note}</div>
                    </div>
                    <div className="shrink-0 text-sm text-[var(--muted)]">Open ↗</div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
