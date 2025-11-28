"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS, type Category, type Project } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  resumePdf: "/resume.pdf", // public/resume.pdf 업로드
};

type TabKey = "Home" | "About" | "Details";
type Filter = "All" | Category;

type Tone = "neutral" | "accent" | "dark" | "primary";
type SkillChip = { label: string; cat?: Exclude<Filter, "All">; tone?: Tone };

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-semibold hover:opacity-85 transition"
    >
      {children} <span className="text-[var(--muted)]">↗</span>
    </a>
  );
}

function ChipButton({
  active,
  onClick,
  tone = "neutral",
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition select-none";
  const tones: Record<Tone, string> = {
    neutral: "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]",
    dark: "border-black/20 bg-black text-white hover:opacity-90",
    accent: "border-black/10 bg-[rgba(194,122,58,.14)] text-[var(--fg)] hover:opacity-90",
    primary: "border-black/10 bg-[rgba(255,186,73,.20)] text-[var(--fg)] hover:opacity-90",
  };
  const on = active ? "ring-2 ring-black/20" : "";
  return (
    <button onClick={onClick} className={[base, tones[tone], on].join(" ")}>
      {children}
    </button>
  );
}

function pickPrimaryLink(p: Project) {
  return p.repo ?? p.demo ?? p.blog ?? `/projects/${p.slug}`;
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** slug 기반 고정 “랜덤” 패턴 (SSR/CSR mismatch 방지) */
function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}
function patternIndex(slug: string, n: number) {
  return hashSlug(slug) % n;
}
function patternBg(slug: string) {
  const i = patternIndex(slug, 5);
  switch (i) {
    case 0:
      return "bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,186,73,.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(194,122,58,.25),transparent_55%),linear-gradient(135deg,rgba(0,0,0,.02),rgba(0,0,0,.06))]";
    case 1:
      return "bg-[radial-gradient(circle_at_30%_30%,rgba(194,122,58,.30),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(255,186,73,.26),transparent_55%),radial-gradient(circle_at_40%_80%,rgba(0,0,0,.08),transparent_55%)]";
    case 2:
      return "bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,186,73,.25),rgba(0,0,0,.05),rgba(194,122,58,.22),rgba(0,0,0,.04),rgba(255,186,73,.25))]";
    case 3:
      return "bg-[linear-gradient(115deg,rgba(0,0,0,.08),transparent_35%),radial-gradient(circle_at_65%_35%,rgba(255,186,73,.30),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(194,122,58,.22),transparent_55%)]";
    default:
      return "bg-[radial-gradient(ellipse_at_50%_20%,rgba(0,0,0,.06),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(255,186,73,.28),transparent_55%),radial-gradient(ellipse_at_85%_75%,rgba(194,122,58,.22),transparent_55%)]";
  }
}

const ABOUT_INFO = {
  education: [
    "서울여자대학교 일반대학원 아동심리학 전공(석사)",
    "서울여자대학교 아동학과 졸업(학사)",
  ],
  experience: [
    "Kantar Korea / Analytics",
    "NIQ-GfK / Global Strategic Account Management",
    "Macromill Embrain / 리서치 1부서 3팀",
    "MnM Research / 연구사업본부",
    "서울대학교병원 / 소아정신과 의생명연구원",
  ],
  awards: [
    { year: 2024, text: "3Q Night Out in Town" },
    { year: 2021, text: "인적자원위원회 최우수 보고서 선정" },
    { year: 2018, text: "KCI 등재 학술지 제1저자(논문)" },
    { year: 2016, text: "한국장학재단 우수연구계획서 선정" },
  ].sort((a, b) => b.year - a.year),
};

const ABOUT_SUMMARY =
  "7년간 데이터 분석·시장조사 영역에서 일하며, 데이터를 ‘분석’에서 끝내지 않고 의사결정으로 이어지게 만드는 구조를 설계해 왔습니다. 의료 데이터 관리로 커리어를 시작해 리서치 기획, 컨설팅, 예측 모델링까지 경험을 확장했고, 프로젝트 초기에 클라이언트의 모호한 요구를 지표·비교군·방법론으로 구체화하고 리드하는 역할을 자주 맡았습니다. SEM·시계열·세그멘테이션 등 다양한 기법을 적용해왔지만, 핵심은 왜 이 방법을 쓰는지 설명 가능하게 만들고 결과가 어떤 판단으로 연결되는지까지 설계하는 것입니다. 반복 업무는 자동화 툴로 구현하고(세그멘테이션 데스크톱 툴), LLM 파인튜닝/배포와 RAG 기반 워크플로우 적용까지 확장해 분석을 실제로 ‘작동 및 서비스하는 형태’로 만들었습니다. 복잡한 내용을 비즈니스 언어로 전달해 이해관계자 간 정렬을 만드는 커뮤니케이션도 강점입니다.";

const ABOUT_SKILLSET: SkillChip[] = [
  { label: "Analytics planning / Market research", tone: "primary" },
  { label: "KPI framework · Survey design · POS/Panel", tone: "neutral" },

  { label: "SEM", cat: "Bayesian", tone: "accent" }, // cat은 “필터 연결용”
  { label: "PCA/FA", cat: "Segmentation", tone: "accent" },
  { label: "Segmentation (Tree/Cluster)", cat: "Segmentation", tone: "accent" },

  { label: "Causal time series (Granger)", cat: "Forecasting", tone: "neutral" },
  { label: "Forecasting (SARIMAX)", cat: "Forecasting", tone: "neutral" },

  { label: "Python/R automation", cat: "Segmentation", tone: "dark" },
  { label: "Reproducible reporting", tone: "neutral" },

  { label: "LLM fine-tuning (LoRA)", cat: "LLM", tone: "primary" },
  { label: "RAG workflow", cat: "LLM", tone: "primary" },
  { label: "Lightweight deployment experiments", cat: "LLM", tone: "neutral" },
];

const ABOUT_CORE: SkillChip[] = [
  { label: "Problem definition → analysis design", tone: "primary" },
  { label: "Method rationale (explainable choices)", tone: "primary" },
  { label: "Decision-ready outputs (metrics → action)", tone: "neutral" },
  { label: "Automation → productization", tone: "neutral" },
  { label: "Stakeholder alignment communication", tone: "dark" },
];

function ProjectRow({
  p,
}: {
  p: Project;
}) {
  const href = pickPrimaryLink(p);
  const external = isExternal(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group rounded-3xl border border-[var(--line)] bg-white/70 p-6 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-10">
        {/* left */}
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[var(--muted)]">{p.category}</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight">{p.title}</div>
          <div className="mt-2 text-[15px] text-[var(--muted)] leading-8">{p.oneLiner}</div>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.slice(0, 10).map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)]"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
            <span className="underline underline-offset-4 group-hover:opacity-85">
              {p.repo ? "Repo" : p.demo ? "Demo" : p.blog ? "Blog" : "Details"} ↗
            </span>
          </div>
        </div>

        {/* right thumbnail */}
        <div className="shrink-0 w-[340px]">
          <div className="relative h-[200px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
            {p.cover ? (
              <>
                <Image src={p.cover} alt={`${p.title} cover`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              </>
            ) : (
              <div className={["absolute inset-0", patternBg(p.slug)].join(" ")} />
            )}

            <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold border border-white/25 bg-black/30 text-white backdrop-blur">
              {p.category}
            </div>

            <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-bold border border-white/25 bg-black/40 text-white backdrop-blur">
              Details →
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");

  // 워터마크 2026 모션
  const { scrollY } = useScroll();
  const wmY = useTransform(scrollY, [0, 800], [0, -60]);
  const wmX = useTransform(scrollY, [0, 800], [0, 20]);

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Details" as const, label: "Projects" },
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  const featured = useMemo(() => PROJECTS.filter((p) => p.featured).slice(0, 4), []);

  // URL 해시로 탭 열기(선택): /#about 등
  useEffect(() => {
    const h = typeof window !== "undefined" ? window.location.hash : "";
    if (h === "#about") setTab("About");
    if (h === "#projects") setTab("Details");
  }, []);

  return (
    <section className="mt-10">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* watermark */}
        <motion.div
          style={{ x: wmX, y: wmY }}
          className="pointer-events-none absolute -top-10 -left-10 text-[180px] font-black tracking-[-.06em] text-black/[0.06]"
        >
          2026
        </motion.div>

        <div className="grid grid-cols-12 gap-10 p-10">
          {/* left */}
          <div className="col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-bold tracking-wide">
              PORTFOLIO · ANALYTICS · BUILD
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>

            <h1 className="mt-6 text-[64px] leading-[0.95] font-extrabold tracking-tight">
              Portfolio
              <span className="block text-[var(--accent)]">Jihee Cho</span>
            </h1>

            <p className="mt-6 text-[17px] leading-8 text-[var(--muted)]">
              프로젝트/리서치/실험을 <b className="text-[var(--fg)]">기획</b>하고, 분석 결과를 대시보드·웹·자동화 산출물로 시각화합니다.
              <span className="block mt-2">
                아래 탭에서 About / Projects를 확인할 수 있고, Projects는 <b className="text-[var(--fg)]">Repo로 바로 연결</b>됩니다.
              </span>
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resumePdf}>Resume PDF</ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
            </div>

            {/* featured (세로로 정리) */}
            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm font-extrabold">Featured Projects</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">대표 3~4개만 미리보기</div>
                </div>
                <button
                  onClick={() => setTab("Details")}
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                >
                  View all →
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {featured.map((p) => {
                  const href = pickPrimaryLink(p);
                  const external = isExternal(href);
                  return (
                    <a
                      key={p.slug}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="block rounded-2xl border border-[var(--line)] bg-white/70 px-6 py-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[var(--muted)]">{p.category}</div>
                          <div className="mt-1 text-lg font-extrabold">{p.title}</div>
                          <div className="mt-1 text-[15px] text-[var(--muted)] leading-7">{p.oneLiner}</div>
                        </div>
                        <div className="shrink-0 text-sm font-semibold text-[var(--muted)]">Open ↗</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* right image */}
          <div className="col-span-5">
            <div className="relative h-[520px] rounded-[26px] overflow-hidden border border-black/15 bg-black/5">
              <Image src="/a2026.jpg" alt="Hero image" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/30">
                    <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-lg font-extrabold leading-tight">Jihee Cho</div>
                    <div className="text-white/80 text-sm">Analytics · Bayesian · Forecasting · LLM</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    Decision-ready outputs
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    Automation → productization
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    Fine-tuning / RAG workflows
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-[var(--muted)]">
              * 이미지: public/a2026.jpg / 아바타: public/avatar.jpg (jpg로 맞춰둠)
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-extrabold border transition",
              tab === t.key
                ? "border-black/20 bg-black text-white"
                : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/55 p-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* HOME (간단 안내만) */}
        {tab === "Home" && (
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome</h2>
            <p className="mt-4 text-[16px] text-[var(--muted)] leading-8">
              위 Featured에서 주요 프로젝트를 확인하실 수 있습니다. 더 자세한 약력과 강점은 <b className="text-[var(--fg)]">About</b>, 전체 프로젝트는 <b className="text-[var(--fg)]">Projects</b> 탭에서 확인하세요.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <ChipButton tone="primary" onClick={() => setTab("About")}>Go to About →</ChipButton>
              <ChipButton tone="accent" onClick={() => setTab("Details")}>Go to Projects →</ChipButton>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <div>
            <div className="flex items-end justify-between gap-10">
              <h2 className="text-3xl font-extrabold tracking-tight">About</h2>
              <div className="flex items-center gap-2">
                <ChipLink href={LINKS.resumePdf}>Resume PDF</ChipLink>
                <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-12 gap-8">
              {/* left: INFO */}
              <div className="col-span-4 rounded-[26px] border border-[var(--line)] bg-[var(--soft)] p-7">
                <div className="text-sm font-extrabold tracking-wide">INFO</div>

                <div className="mt-6">
                  <div className="text-xs font-extrabold text-[var(--muted)]">EDUCATION</div>
                  <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--fg)]">
                    {ABOUT_INFO.education.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <div className="text-xs font-extrabold text-[var(--muted)]">EXPERIENCE</div>
                  <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--fg)]">
                    {ABOUT_INFO.experience.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-[var(--accent2)]" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <div className="text-xs font-extrabold text-[var(--muted)]">AWARDS</div>
                  <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--fg)]">
                    {ABOUT_INFO.awards.map((a) => (
                      <li key={a.year + a.text} className="flex gap-2">
                        <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-black/70" />
                        <span>
                          <b className="font-extrabold">{a.year}</b> {a.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={LINKS.resumePdf}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-extrabold hover:opacity-85 transition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Resume PDF <span className="text-[var(--muted)]">↗</span>
                  </a>
                </div>
              </div>

              {/* right: narrative + skillset + strengths */}
              <div className="col-span-8">
                <div className="rounded-[26px] border border-[var(--line)] bg-[var(--soft)] p-7">
                  <div className="text-sm font-extrabold tracking-wide">INFO</div>
                  <p className="mt-4 text-[16px] leading-8 text-[var(--muted)]">{ABOUT_SUMMARY}</p>

                  <div className="mt-8 grid grid-cols-12 gap-6">
                    <div className="col-span-7">
                      <div className="text-sm font-extrabold">Skillset</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ABOUT_SKILLSET.map((c) => (
                          <ChipButton
                            key={c.label}
                            tone={c.tone ?? "neutral"}
                            onClick={() => {
                              if (c.cat) {
                                setFilter(c.cat);
                                setTab("Details");
                              }
                            }}
                          >
                            {c.label}
                            {c.cat ? <span className="ml-2 text-[11px] text-black/60">({c.cat})</span> : null}
                          </ChipButton>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-[var(--muted)]">
                        * Skillset 칩에 (LLM/Forecasting/Bayesian/Segmentation) 표시된 항목을 누르면 Projects가 자동 필터됩니다.
                      </div>
                    </div>

                    <div className="col-span-5">
                      <div className="text-sm font-extrabold">Core strengths</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ABOUT_CORE.map((c) => (
                          <ChipButton key={c.label} tone={c.tone ?? "neutral"}>
                            {c.label}
                          </ChipButton>
                        ))}
                      </div>

                      <div className="mt-6 text-sm font-extrabold">Contact</div>
                      <div className="mt-2 text-sm text-[var(--muted)]">
                        <a className="underline underline-offset-4 hover:opacity-80" href={`mailto:${LINKS.email}`}>
                          {LINKS.email}
                        </a>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <ChipLink href={LINKS.github}>GitHub</ChipLink>
                        <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
                        <ChipLink href={LINKS.velog}>Velog</ChipLink>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[26px] border border-[var(--line)] bg-white/70 p-7">
                  <div className="text-sm font-extrabold">Quick filter</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["All", "LLM", "Forecasting", "Bayesian", "Segmentation", "Other"] as Filter[]).map((k) => (
                      <ChipButton
                        key={k}
                        active={filter === k}
                        tone={k === "All" ? "neutral" : k === "LLM" ? "primary" : "accent"}
                        onClick={() => {
                          setFilter(k);
                          setTab("Details");
                        }}
                      >
                        {k}
                      </ChipButton>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DETAILS */}
        {tab === "Details" && (
          <div>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Projects</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  카드 클릭 시 <b className="text-[var(--fg)]">GitHub Repo(우선)</b>로 이동합니다. (커버 없으면 자동 패턴 적용)
                </p>
              </div>
              <a className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80" href="/projects">
                View simple list →
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {(["All", "LLM", "Forecasting", "Bayesian", "Segmentation", "Other"] as Filter[]).map((k) => (
                <ChipButton
                  key={k}
                  active={filter === k}
                  tone={k === "All" ? "neutral" : k === "LLM" ? "primary" : "accent"}
                  onClick={() => setFilter(k)}
                >
                  {k}
                </ChipButton>
              ))}
            </div>

            <div className="mt-6 grid gap-4">
              {filteredProjects.map((p) => (
                <ProjectRow key={p.slug} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
