"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  resumeMd: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  resumePdf: "/resume.pdf", // (선택) public/resume.pdf 업로드하면 동작
};

type TabKey = "Home" | "About" | "Details";
type Category = "All" | "LLM" | "Forecasting" | "Bayesian" | "Segmentation" | "Other";

type Tone = "neutral" | "accent" | "dark" | "primary";
type ChipItem = { label: string; cat?: Exclude<Category, "All">; tone?: Tone };

type Project = (typeof PROJECTS)[number];

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function pickPrimaryLink(p: Project) {
  return p.repo ?? p.demo ?? p.blog ?? `/projects/${p.slug}`;
}

function hashToIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : 0;
}

const FALLBACK_PATTERNS = [
  "bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,214,170,0.60),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(16,16,16,0.12),transparent_60%),linear-gradient(135deg,rgba(255,248,240,1),rgba(244,233,220,1))]",
  "bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px),radial-gradient(ellipse_at_30%_30%,rgba(255,193,140,0.45),transparent_55%),linear-gradient(135deg,rgba(252,248,242,1),rgba(242,234,224,1))] bg-[size:18px_18px,18px_18px,auto,auto]",
  "bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_10px,transparent_10px,transparent_22px),radial-gradient(ellipse_at_70%_30%,rgba(255,175,110,0.35),transparent_60%),linear-gradient(135deg,rgba(252,247,240,1),rgba(244,235,225,1))]",
  "bg-[radial-gradient(circle_at_18%_25%,rgba(255,200,150,0.60),transparent_55%),radial-gradient(circle_at_82%_78%,rgba(0,0,0,0.12),transparent_55%),linear-gradient(135deg,rgba(253,248,242,1),rgba(243,233,222,1))]",
  "bg-[radial-gradient(ellipse_at_50%_15%,rgba(0,0,0,0.12),transparent_60%),radial-gradient(ellipse_at_30%_80%,rgba(255,210,170,0.45),transparent_60%),linear-gradient(135deg,rgba(252,248,244,1),rgba(244,236,226,1))]",
];

function Pill({
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
    "inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-extrabold transition select-none";
  const tones: Record<Tone, string> = {
    neutral: "border-[var(--line)] bg-white/75 text-[var(--muted)] hover:text-[var(--fg)]",
    dark: "border-black/20 bg-black text-white hover:opacity-90",
    accent: "border-black/10 bg-[rgba(194,122,58,.16)] text-[var(--fg)] hover:opacity-90",
    primary: "border-black/10 bg-[rgba(255,186,73,.24)] text-[var(--fg)] hover:opacity-90",
  };
  const on = active ? "ring-2 ring-black/20" : "";
  return (
    <button type="button" onClick={onClick} className={cn(base, tones[tone], on)}>
      {children}
    </button>
  );
}

function ChipLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = isExternal(href) || href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={external && !href.startsWith("mailto:") ? "_blank" : undefined}
      rel={external && !href.startsWith("mailto:") ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm font-extrabold hover:opacity-90 transition",
        className
      )}
    >
      {children} <span className="text-[var(--muted)]">↗</span>
    </a>
  );
}

/** 아주 단순한 카테고리 보정 (data.ts category 보존) */
function normalizeCategory(p: Project): Exclude<Category, "All"> {
  const c = String(p.category ?? "").toLowerCase();
  if (c.includes("llm")) return "LLM";
  if (c.includes("forecast")) return "Forecasting";
  if (c.includes("bayes")) return "Bayesian";
  if (c.includes("segment")) return "Segmentation";
  if (c.includes("other")) return "Other";
  return "Other";
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
    { year: 2016, text: "한국장학재단 우수 연구계획서 선정" },
  ].sort((a, b) => b.year - a.year),
};

const ABOUT_SUMMARY =
  "7년간 데이터 분석·시장조사 영역에서, 데이터를 ‘분석’에서 끝내지 않고 의사결정으로 이어지게 만드는 구조를 설계해 왔습니다. 의료 데이터 관리로 시작해 리서치 기획·컨설팅·예측 모델링까지 확장했고, 프로젝트 초기에 모호한 요구를 지표·비교군·방법론으로 구체화하고 리드하는 역할을 자주 맡았습니다. SEM·시계열·세그멘테이션 등 다양한 기법을 적용해왔지만 핵심은 ‘왜 이 방법인지’를 설명 가능하게 만들고 결과가 어떤 판단으로 연결되는지까지 설계하는 것입니다. 반복 업무는 자동화 툴로 제품화했고(세그멘테이션 데스크톱 툴), LLM 파인튜닝/배포와 RAG 기반 워크플로우 적용까지 확장해 분석을 실제로 ‘작동·서비스’ 형태로 만들었습니다. 복잡한 내용을 비즈니스 언어로 전달해 이해관계자 정렬을 만드는 커뮤니케이션도 강점입니다.";

const SKILLSET: ChipItem[] = [
  { label: "Analytics planning / Market research", tone: "primary" },
  { label: "KPI framework · Survey design · POS/Panel", tone: "neutral" },
  { label: "SEM", tone: "neutral" },
  { label: "PCA / Factor", cat: "Segmentation", tone: "accent" },
  { label: "Segmentation (Tree/Cluster)", cat: "Segmentation", tone: "accent" },
  { label: "Granger / Causal TS", cat: "Forecasting", tone: "neutral" },
  { label: "Forecasting (SARIMAX)", cat: "Forecasting", tone: "accent" },
  { label: "Bayesian (PyMC)", cat: "Bayesian", tone: "accent" },
  { label: "Automation (Python/R)", tone: "dark" },
  { label: "LLM Fine-tuning (LoRA)", cat: "LLM", tone: "accent" },
  { label: "RAG workflow", cat: "LLM", tone: "accent" },
];

const CORE: ChipItem[] = [
  { label: "Problem definition → analysis design", tone: "primary" },
  { label: "Method rationale (explainable choices)", tone: "primary" },
  { label: "Decision-ready outputs (metrics → action)", tone: "neutral" },
  { label: "Automation → productization", tone: "neutral" },
  { label: "Stakeholder alignment & communication", tone: "dark" },
];

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [cat, setCat] = useState<Category>("All");

  // watermark motion
  const { scrollY } = useScroll();
  const wmY = useTransform(scrollY, [0, 900], [0, -70]);
  const wmX = useTransform(scrollY, [0, 900], [0, 24]);

  useEffect(() => {
    // optional deep link: /#about , /#projects
    const h = typeof window !== "undefined" ? window.location.hash : "";
    if (h === "#about") setTab("About");
    if (h === "#projects") setTab("Details");
  }, []);

  const normalized = useMemo(() => {
    return PROJECTS.map((p) => ({
      ...p,
      __cat: normalizeCategory(p),
      __cover: p.cover,
      __featured: Boolean(p.featured),
    }));
  }, []);

  const featured = useMemo(() => {
    const list = normalized.filter((p) => p.__featured);
    return (list.length ? list : normalized).slice(0, 4);
  }, [normalized]);

  const filtered = useMemo(() => {
    if (cat === "All") return normalized;
    return normalized.filter((p) => p.__cat === cat);
  }, [cat, normalized]);

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Details" as const, label: "Projects" },
    ],
    []
  );

  const categories: Category[] = ["All", "LLM", "Forecasting", "Bayesian", "Segmentation", "Other"];

  return (
    <section className="mt-10">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        <motion.div
          style={{ x: wmX, y: wmY }}
          className="pointer-events-none absolute -top-14 -left-12 text-[200px] font-black tracking-[-.08em] text-black/[0.06]"
        >
          2026
        </motion.div>

        <div className="grid grid-cols-12 gap-10 p-10">
          {/* LEFT */}
          <div className="col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-xs font-extrabold tracking-wide">
              PORTFOLIO · ANALYTICS · BUILD
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>

            <h1 className="mt-6 text-[68px] leading-[0.92] font-black tracking-tight">
              Portfolio
              <span className="block text-[var(--accent)]">Jihee Cho</span>
            </h1>

            <p className="mt-6 text-[18px] leading-8 text-[var(--muted)]">
              프로젝트/리서치/실험을 <b className="text-[var(--fg)]">기획</b>하고, 분석 결과를{" "}
              <b className="text-[var(--fg)]">대시보드·웹·자동화 산출물</b>로 만들고 운영합니다.
              <span className="block mt-2">
                아래에서 About / Projects를 확인하고, Projects 카드는 <b className="text-[var(--fg)]">Repo 우선</b>으로 바로 연결됩니다.
              </span>
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resumePdf} className="bg-black text-white border-black/20">
                Resume PDF
              </ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
            </div>

            {/* Featured - 세로로 정리 */}
            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm font-black tracking-tight">Featured Projects</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">대표 4개</div>
                </div>
                <button
                  onClick={() => setTab("Details")}
                  className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
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
                      className="block rounded-2xl border border-[var(--line)] bg-white/75 px-6 py-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-black/60">{p.__cat}</div>
                          <div className="mt-1 text-lg font-black">{p.title}</div>
                          <div className="mt-1 text-[15px] text-[var(--muted)] leading-7">{p.oneLiner}</div>
                        </div>
                        <div className="shrink-0 text-sm font-extrabold text-[var(--muted)]">Open ↗</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-span-5">
            <div className="relative h-[560px] rounded-[26px] overflow-hidden border border-black/15 bg-black/5">
              {/* public/a2026.jpg */}
              <Image src="/a2026.jpg" alt="Hero image" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

              <div className="absolute bottom-7 left-7 right-7">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/30 bg-white/10">
                    {/* public/avatar.jpg */}
                    <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-lg font-black leading-tight">Jihee Cho</div>
                    <div className="text-white/80 text-sm">Analytics · Bayesian · Forecasting · LLM</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                    Decision-ready outputs
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                    Automation → productization
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                    Fine-tuning / RAG
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-[var(--muted)]">
              * 이미지: <b>/public/a2026.jpg</b> · 아바타: <b>/public/avatar.jpg</b> (둘 다 jpg)
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2">
        {tabs.map((t) => (
          <Pill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)} tone={tab === t.key ? "dark" : "neutral"}>
            {t.label}
          </Pill>
        ))}
      </div>

      {/* Panel */}
      <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/55 p-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* HOME */}
        {tab === "Home" && (
          <div>
            <h2 className="text-4xl font-black tracking-tight">Welcome</h2>
            <p className="mt-4 text-[16px] text-[var(--muted)] leading-8">
              위 Featured에서 주요 프로젝트를 확인하실 수 있습니다. 더 자세한 약력과 강점은 <b className="text-[var(--fg)]">About</b>, 전체 프로젝트는{" "}
              <b className="text-[var(--fg)]">Projects</b> 탭에서 확인하세요.
            </p>

            <div className="mt-8 flex items-center gap-2">
              <Pill tone="primary" onClick={() => setTab("About")}>
                Go to About →
              </Pill>
              <Pill tone="accent" onClick={() => setTab("Details")}>
                Go to Projects →
              </Pill>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <div>
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-4xl font-black tracking-tight">About</h2>
              <div className="flex items-center gap-2">
                <ChipLink href={LINKS.resumePdf} className="bg-black text-white border-black/20">
                  Resume PDF
                </ChipLink>
                <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-12 gap-8 items-start">
              {/* LEFT: INFO */}
              <div className="col-span-4 rounded-[26px] border border-[var(--line)] bg-[var(--soft)] p-7">
                <div className="text-sm font-black tracking-wide">INFO</div>

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
                      <li key={`${a.year}-${a.text}`} className="flex gap-2">
                        <span className="mt-[10px] h-[6px] w-[6px] rounded-full bg-black/70" />
                        <span>
                          <b className="font-black">{a.year}</b> {a.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <ChipLink href={LINKS.github}>GitHub</ChipLink>
                  <ChipLink href={LINKS.hf}>HF</ChipLink>
                  <ChipLink href={LINKS.velog}>Velog</ChipLink>
                </div>

                <div className="mt-7">
                  <div className="text-sm font-black tracking-tight">Quick filters</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((k) => (
                      <Pill
                        key={k}
                        active={cat === k}
                        onClick={() => {
                          setCat(k);
                          setTab("Details");
                        }}
                        tone={k === "All" ? "neutral" : k === "LLM" ? "primary" : "accent"}
                      >
                        {k}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: NARRATIVE + CHIPS */}
              <div className="col-span-8">
                <div className="rounded-[26px] border border-[var(--line)] bg-white/75 p-7">
                  <div className="text-sm font-black tracking-wide">INFO</div>
                  <p className="mt-4 text-[16px] leading-8 text-[var(--muted)]">{ABOUT_SUMMARY}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div className="rounded-[26px] border border-[var(--line)] bg-[var(--soft)] p-7">
                    <div className="text-sm font-black tracking-tight">Skillset</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {SKILLSET.map((x) => (
                        <Pill
                          key={x.label}
                          tone={x.tone ?? "neutral"}
                          onClick={
                            x.cat
                              ? () => {
                                  setCat(x.cat!);
                                  setTab("Details");
                                }
                              : undefined
                          }
                        >
                          {x.label}
                          {x.cat ? <span className="ml-2 text-[11px] text-black/60">({x.cat})</span> : null}
                        </Pill>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-[var(--muted)]">
                      * (LLM/Forecasting/Bayesian/Segmentation) 표시된 항목을 누르면 Projects가 자동 필터됩니다.
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[var(--line)] bg-[var(--soft)] p-7">
                    <div className="text-sm font-black tracking-tight">Core strengths</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {CORE.map((x) => (
                        <Pill key={x.label} tone={x.tone ?? "neutral"}>
                          {x.label}
                        </Pill>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="text-xs font-extrabold text-[var(--muted)]">CONTACT</div>
                      <a className="mt-2 inline-flex text-sm font-black underline underline-offset-4 hover:opacity-80" href={`mailto:${LINKS.email}`}>
                        {LINKS.email}
                      </a>
                    </div>
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
                <h2 className="text-4xl font-black tracking-tight">Projects</h2>
                <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
                  카드 클릭 / Details → <b className="text-[var(--fg)]">GitHub Repo 우선</b>으로 이동합니다. (Repo 없으면 Demo → Blog 순)
                </p>
              </div>
              <a className="text-sm font-black underline underline-offset-4 hover:opacity-80" href="/projects">
                View simple list →
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((k) => (
                <Pill
                  key={k}
                  active={cat === k}
                  onClick={() => setCat(k)}
                  tone={k === "All" ? "neutral" : k === "LLM" ? "primary" : "accent"}
                >
                  {k}
                </Pill>
              ))}
            </div>

            <div className="mt-8 grid gap-4">
              {filtered.map((p) => {
                const href = pickPrimaryLink(p);
                const external = isExternal(href);
                const pattern = FALLBACK_PATTERNS[hashToIndex(p.slug, FALLBACK_PATTERNS.length)];

                return (
                  <a
                    key={p.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="group rounded-[26px] border border-[var(--line)] bg-white/75 p-7 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-10">
                      {/* LEFT */}
                      <div className="min-w-0">
                        <div className="text-xs font-black text-black/60">{p.__cat}</div>
                        <div className="mt-1 text-2xl font-black tracking-tight">{p.title}</div>
                        <div className="mt-2 text-[15px] text-[var(--muted)] leading-8">{p.oneLiner}</div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {(Array.isArray(p.stack) ? p.stack : []).slice(0, 12).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-3 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)] font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 text-sm font-black underline underline-offset-4 group-hover:opacity-85">
                          {p.repo ? "Repo" : p.demo ? "Demo" : p.blog ? "Blog" : "Details"} ↗
                        </div>
                      </div>

                      {/* RIGHT THUMB */}
                      <div className="shrink-0 w-[360px]">
                        <div className="relative h-[210px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                          {p.__cover ? (
                            <>
                              <Image src={p.__cover} alt={`${p.title} cover`} fill className="object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                            </>
                          ) : (
                            <div className={cn("absolute inset-0", pattern)} />
                          )}

                          <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-black border border-white/25 bg-black/30 text-white backdrop-blur">
                            {p.__cat}
                          </div>

                          <div className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-black border border-white/25 bg-black/40 text-white backdrop-blur">
                            Open →
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}

              {filtered.length === 0 && (
                <div className="mt-10 text-sm text-[var(--muted)]">
                  해당 카테고리 프로젝트가 없습니다. (data.ts의 category 값 확인)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
