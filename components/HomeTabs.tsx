"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  resumePdf: "/resume.pdf",
};

type TabKey = "Home" | "Projects" | "Info" | "Board";
type Tone = "neutral" | "accent" | "dark";

type ProjectItem = (typeof PROJECTS)[number];
type CategoryKey = ProjectItem["category"];
type Filter = "All" | CategoryKey;

type Chip = { label: string; cat?: CategoryKey; tone?: Tone };
type InfoItem = { year?: number; label: string; sub?: string };

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function pickPrimaryLink(p: ProjectItem) {
  const anyP = p as any;
  return anyP.repo ?? anyP.demo ?? anyP.blog ?? `/projects/${anyP.slug}`;
}

function hashToIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : 0;
}

const THUMB_PATTERNS = [
  "bg-[radial-gradient(circle_at_20%_25%,rgba(255,186,73,.55),transparent_55%),radial-gradient(circle_at_85%_70%,rgba(194,122,58,.32),transparent_55%),linear-gradient(135deg,rgba(255,255,255,.9),rgba(245,236,225,.9))]",
  "bg-[radial-gradient(ellipse_at_30%_35%,rgba(0,0,0,.16),transparent_55%),radial-gradient(ellipse_at_80%_75%,rgba(255,186,73,.35),transparent_55%),linear-gradient(135deg,rgba(252,248,244,1),rgba(244,236,226,1))]",
  "bg-[conic-gradient(from_120deg_at_50%_50%,rgba(255,186,73,.30),rgba(0,0,0,.06),rgba(194,122,58,.24),rgba(0,0,0,.05),rgba(255,186,73,.30))]",
  "bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px),radial-gradient(circle_at_30%_30%,rgba(255,186,73,.30),transparent_55%),linear-gradient(135deg,rgba(252,248,242,1),rgba(242,234,224,1))] bg-[size:18px_18px,18px_18px,auto,auto]",
  "bg-[repeating-linear-gradient(135deg,rgba(0,0,0,.05)_0px,rgba(0,0,0,.05)_10px,transparent_10px,transparent_22px),radial-gradient(circle_at_70%_30%,rgba(255,186,73,.26),transparent_60%),linear-gradient(135deg,rgba(252,247,240,1),rgba(244,235,225,1))]",
  "bg-[radial-gradient(circle_at_20%_25%,rgba(255,210,170,.55),transparent_55%),radial-gradient(circle_at_82%_78%,rgba(0,0,0,.12),transparent_55%),linear-gradient(135deg,rgba(253,248,242,1),rgba(243,233,222,1))]",
];

function Pill({
  active,
  onClick,
  children,
  tone = "neutral",
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: Tone;
}) {
  const base =
    "inline-flex items-center rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-extrabold transition select-none";
  const tones: Record<Tone, string> = {
    neutral:
      "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]",
    dark: "border-black/20 bg-black text-white hover:opacity-90",
    accent:
      "border-black/10 bg-[rgba(255,186,73,.22)] text-[var(--fg)] hover:opacity-90",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, tones[tone], active && "ring-2 ring-black/15")}
    >
      {children}
    </button>
  );
}

function LinkChip({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = isExternal(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-extrabold hover:opacity-90 transition",
        className
      )}
    >
      {children}
      {external ? <span className="text-[var(--muted)]">↗</span> : null}
    </a>
  );
}

function thumbBg(slug: string) {
  return THUMB_PATTERNS[hashToIndex(slug, THUMB_PATTERNS.length)];
}

function Thumb({
  slug,
  cover,
  label,
}: {
  slug: string;
  cover?: string;
  label: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-black/15 aspect-[16/10] bg-black/5">
      {cover ? (
        <>
          <Image src={cover} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/0 to-transparent" />
        </>
      ) : (
        <>
          <div className={cn("absolute inset-0", thumbBg(slug))} />
          <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_15%_20%,black,transparent_40%),radial-gradient(circle_at_85%_75%,black,transparent_45%)]" />
        </>
      )}
    </div>
  );
}

const EDUCATION: InfoItem[] = [
  { label: "서울여자대학교 일반대학원", sub: "아동심리학 전공 (석사)" },
  { label: "서울여자대학교", sub: "아동학과 (학사)" },
];

const EXPERIENCE: InfoItem[] = [
  { label: "Kantar Korea", sub: "Analytics" },
  { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
  { label: "Macromill Embrain", sub: "리서치 1부서 3팀" },
  { label: "MnM Research", sub: "연구사업본부" },
  { label: "서울대학교병원", sub: "소아정신과 의생명연구원" },
];

const AWARDS: InfoItem[] = [
  { year: 2024, label: "3Q Night Out in Town" },
  { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
  { year: 2018, label: "KCI 등재 학술지 제1저자(논문)" },
  { year: 2016, label: "한국장학재단 우수연구계획서 선정" },
].sort((a, b) => (b.year ?? -1) - (a.year ?? -1));

const INFO_SUMMARY =
  "데이터 분석과 시장조사를 바탕으로, 의사결정을 실질적으로 지원하는 결과물을 만듭니다. 요구사항을 문제 정의–분석 설계–모델링–시각화–리포팅까지 한 흐름으로 설계하고 구현해 왔습니다. 반복되는 분석 업무는 자동화·표준화하고, LLM 파인튜닝·배포 및 RAG 워크플로우 적용을 통해 분석을 서비스 형태로 확장하고 있습니다.";

function InfoBlock({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-6">
      <div className="text-sm font-black tracking-tight">{title}</div>
      <div className="mt-3 space-y-2 text-sm text-[var(--muted)] leading-7 font-medium">
        {items.map((x, i) => (
          <div key={`${title}-${i}`} className="flex gap-3">
            <div className="w-14 shrink-0 text-xs font-extrabold text-black/70">
              {x.year ? x.year : ""}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black/90">{x.label}</div>
              {x.sub ? (
                <div className="text-[var(--muted)]">{x.sub}</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: ProjectItem }) {
  const href = pickPrimaryLink(p);
  const external = isExternal(href);
  const anyP = p as any;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group rounded-[26px] border border-[var(--line)] bg-white/70 p-6 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] transition"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        <div className="lg:col-span-7 min-w-0">
          <div className="text-xs font-extrabold text-black/60">
            {String(p.category)}
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
            {anyP.title}
          </div>
          <div className="mt-2 text-[15px] text-[var(--muted)] leading-7 font-medium">
            {anyP.oneLiner}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(Array.isArray(anyP.stack) ? anyP.stack : [])
              .slice(0, 10)
              .map((s: string) => (
                <span
                  key={s}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)]"
                >
                  {s}
                </span>
              ))}
          </div>

          <div className="mt-5 text-sm font-extrabold underline underline-offset-4 group-hover:opacity-90">
            {(anyP.repo
              ? "Repo"
              : anyP.demo
              ? "Demo"
              : anyP.blog
              ? "Blog"
              : "Open") + " ↗"}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Thumb
            slug={anyP.slug}
            cover={anyP.cover}
            label={`${anyP.title} thumbnail`}
          />
        </div>
      </div>
    </a>
  );
}

function FeaturedTile({ p }: { p: ProjectItem }) {
  const href = pickPrimaryLink(p);
  const external = isExternal(href);
  const anyP = p as any;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group"
    >
      <div className="h-full flex flex-col rounded-[28px] border border-[var(--line)] bg-white/70 overflow-hidden hover:shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition">
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-extrabold text-black/60">
              {String(p.category)}
            </div>
            <div className="text-xs font-extrabold text-[var(--muted)]">
              Open ↗
            </div>
          </div>

          <div className="mt-2 text-xl sm:text-2xl font-black tracking-tight">
            {anyP.title}
          </div>

          <p
            className="mt-2 mb-4 text-sm sm:text-[15px] text-[var(--muted)] leading-7 font-medium line-clamp-2"
          >
            {anyP.oneLiner}
          </p>

          <div className="mt-auto">
            <Thumb
              slug={anyP.slug}
              cover={anyP.cover}
              label={`${anyP.title} cover`}
            />
          </div>
        </div>
      </div>
    </a>
  );
}

/** -----------------------------------------
 * MAIN EXPORT
 * ----------------------------------------- */
export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");
  const [isMobileView, setIsMobileView] = useState(false); // Default PC View

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "Projects" as const, label: "Projects" },
      { key: "Info" as const, label: "Info" },
      { key: "Board" as const, label: "Board" },
    ],
    []
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of PROJECTS) set.add(String(p.category));
    return Array.from(set) as CategoryKey[];
  }, []);

  const featured = useMemo(() => {
    const list = PROJECTS.filter((p) => Boolean((p as any).featured));
    return (list.length ? list : PROJECTS).slice(0, 6);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  const { scrollY } = useScroll();
  const wmY = useTransform(scrollY, [0, 800], [0, -70]);
  const wmX = useTransform(scrollY, [0, 800], [0, 26]);

  const skillset = useMemo<Chip[]>(() => {
    const has = (c: string) => categories.includes(c as any);
    const cat = (c: string) =>
      has(c) ? (c as unknown as CategoryKey) : undefined;

    return [
      { label: "Analytics planning / research design", tone: "accent" },
      { label: "Market research (survey/POS/panel)", tone: "accent" },
      { label: "Segmentation", cat: cat("Segmentation"), tone: "dark" },
      { label: "SEM", cat: cat("Bayesian"), tone: "neutral" },
      {
        label: "PCA / Factor analysis",
        cat: cat("Segmentation"),
        tone: "neutral",
      },
      {
        label: "Causal time series (Granger)",
        cat: cat("Forecasting"),
        tone: "neutral",
      },
      {
        label: "Forecasting (SARIMAX)",
        cat: cat("Forecasting"),
        tone: "dark",
      },
      { label: "Bayesian (PyMC)", cat: cat("Bayesian"), tone: "dark" },
      { label: "Automation → productization", tone: "neutral" },
      { label: "LLM fine-tuning (LoRA)", cat: cat("LLM"), tone: "dark" },
      { label: "RAG workflows", cat: cat("LLM"), tone: "dark" },
    ];
  }, [categories]);

  const core = useMemo<Chip[]>(
    () => [
      { label: "Problem definition → decision points", tone: "dark" },
      { label: "Method rationale (explainable choice)", tone: "neutral" },
      { label: "Decision-ready outputs (metrics → action)", tone: "neutral" },
      { label: "Automation → productization", tone: "accent" },
      { label: "Stakeholder alignment & communication", tone: "accent" },
    ],
    []
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Top nav */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg font-black tracking-tight">Jihee Cho</div>

        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <Pill
              key={t.key}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
              tone={tab === t.key ? "dark" : "neutral"}
            >
              {t.label}
            </Pill>
          ))}
          {/* View Toggle Button */}
          <button
            onClick={() => setIsMobileView((prev) => !prev)}
            className="ml-2 text-xs font-bold text-[var(--muted)] hover:text-black border border-[var(--line)] rounded-full px-3 py-1.5 transition"
          >
            {isMobileView ? "💻 PC View" : "📱 Mobile View"}
          </button>
        </div>

        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <LinkChip href={LINKS.github}>GitHub</LinkChip>
          <LinkChip href={LINKS.hf}>HF</LinkChip>
          <LinkChip href={LINKS.velog}>Velog</LinkChip>
        </div>
      </header>

      {/* HOME CONTENT */}
      {tab === "Home" && (
        <>
          {/* --- PC VIEW (DEFAULT) --- */}
          {!isMobileView ? (
            <div className="space-y-6">
              {/* 1. Full-width Hero Banner */}
              <div className="relative w-full h-[360px] md:h-[420px] rounded-[32px] overflow-hidden border border-black/15 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
                <Image
                  src="/a2026.jpg"
                  alt="Hero banner"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                
                {/* Overlay Text */}
                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center">
                  <div className="inline-flex self-start items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold tracking-wide text-white backdrop-blur-md">
                    PORTFOLIO · ANALYTICS · BUILD
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  <h1 className="mt-6 text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
                    Portfolio
                    <span className="block text-[var(--accent)]">Jihee Cho</span>
                  </h1>
                  <p className="mt-6 text-lg text-white/80 max-w-[600px] font-medium leading-relaxed">
                    데이터 분석과 시장조사 경험을 기반으로, <br className="hidden sm:block"/>
                    의사결정을 실질적으로 지원하는 결과물을 만듭니다.
                  </p>
                  
                  {/* Hero Tags */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Decision-ready outputs", "Automation", "LLM / RAG"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Main Grid: Projects (Left) + Profile (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left: Featured Projects (3 cols width) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-end justify-between px-2">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Featured Projects</h2>
                      <p className="text-sm text-[var(--muted)] font-medium mt-1">대표 프로젝트 모음</p>
                    </div>
                    <button
                      onClick={() => setTab("Projects")}
                      className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition"
                    >
                      View all →
                    </button>
                  </div>
                  
                  {/* 2x2 Grid for Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {featured.slice(0, 4).map((p) => (
                      <FeaturedTile key={(p as any).slug} p={p} />
                    ))}
                  </div>
                </div>

                {/* Right: Profile Block (1 col width) - Dark Beige */}
                <div className="lg:col-span-1">
                   {/* Warm/Dark Beige Background */}
                  <div className="sticky top-8 h-fit rounded-[28px] border border-[var(--line)] bg-[#E6DCCF] p-6 sm:p-8 shadow-sm">
                    <div className="relative w-20 h-20 rounded-full border-2 border-white/50 overflow-hidden shadow-sm mb-5">
                      <Image 
                        src="/avatar.jpg" 
                        alt="Avatar" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    
                    <div className="text-xl font-black text-[#4A4036] tracking-tight">Jihee Cho</div>
                    <div className="text-sm font-bold text-[#7D6E5F] mt-1">Analytics · LLM · Build</div>
                    
                    <p className="mt-5 text-sm leading-7 text-[#5C5046] font-medium">
                      기획부터 모델링, 시각화까지의 흐름을 하나의 스토리로 설계하고 구현하는 데 집중해 왔습니다.
                    </p>

                    <div className="mt-8 space-y-3">
                      <a href={LINKS.resumePdf} target="_blank" className="flex items-center justify-center w-full py-3 rounded-xl bg-[#3E342B] text-[#E6DCCF] text-sm font-bold hover:opacity-90 transition">
                        Resume PDF
                      </a>
                      <a href={`mailto:${LINKS.email}`} className="flex items-center justify-center w-full py-3 rounded-xl border border-[#Cac2b6] bg-white/50 text-[#5C5046] text-sm font-bold hover:bg-white/80 transition">
                        Contact Me
                      </a>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#Cac2b6]">
                      <div className="text-xs font-extrabold text-[#7D6E5F] mb-3">LINKS</div>
                      <div className="flex flex-wrap gap-2">
                        <a href={LINKS.github} target="_blank" className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/60 text-[#5C5046] hover:bg-white">GitHub</a>
                        <a href={LINKS.hf} target="_blank" className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/60 text-[#5C5046] hover:bg-white">Hugging Face</a>
                        <a href={LINKS.velog} target="_blank" className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/60 text-[#5C5046] hover:bg-white">Velog</a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* --- MOBILE VIEW (LEGACY) --- */
            <section className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
              <motion.div
                style={{ x: wmX, y: wmY }}
                className="pointer-events-none absolute -top-12 -left-10 text-[150px] sm:text-[210px] font-black tracking-[-.06em] text-black/[0.06]"
              >
                2026
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-10">
                {/* left content */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/75 px-5 py-2.5 text-xs font-extrabold tracking-wide">
                    PORTFOLIO · ANALYTICS · BUILD
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </div>

                  <h1 className="mt-6 text-[44px] sm:text-[66px] leading-[0.95] font-black tracking-tight">
                    Portfolio
                    <span className="block text-[var(--accent2)]">Jihee Cho</span>
                  </h1>

                  <p className="mt-5 text-[15px] sm:text-[17px] leading-8 text-[var(--muted)] max-w-[72ch] font-medium">
                    데이터 분석과 시장조사 경험을 기반으로, 의사결정을 실질적으로
                    지원하는 결과물을 만듭니다.
                    <br />
                    기획부터 모델링, 시각화까지의 흐름을 하나의 스토리로 설계하고
                    구현하는 데 집중해 왔습니다.
                    <span className="block mt-2">
                      아래는 대표 프로젝트이고, 전체 목록은{" "}
                      <b className="text-black">Projects</b> 탭에서 확인하실 수
                      있습니다.
                    </span>
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <LinkChip
                      href={LINKS.github}
                      className="bg-black text-white border-black/20"
                    >
                      GitHub
                    </LinkChip>
                    <LinkChip href={LINKS.hf}>Hugging Face</LinkChip>
                    <LinkChip href={LINKS.velog}>Velog</LinkChip>
                    <LinkChip href={LINKS.resumePdf}>Resume PDF</LinkChip>
                    <LinkChip href={`mailto:${LINKS.email}`}>Contact</LinkChip>
                  </div>

                  <div className="mt-9">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm font-black tracking-tight">
                          Featured
                        </div>
                        <div className="mt-1 text-sm text-[var(--muted)]">
                          대표 프로젝트
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab("Projects")}
                        className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                        {featured.slice(0, 4).map((p) => (
                          <FeaturedTile key={(p as any).slug} p={p} />
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-[var(--muted)] font-medium">
                        더 많은 프로젝트는{" "}
                        <button
                          type="button"
                          onClick={() => setTab("Projects")}
                          className="font-semibold underline underline-offset-4 hover:opacity-80"
                        >
                          Projects 탭
                        </button>
                        에서 모두 확인하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* right hero image (Mobile version side) */}
                <div className="lg:col-span-5">
                  <div className="relative h-[380px] sm:h-[520px] lg:h-[640px] rounded-[28px] overflow-hidden border border-black/15 bg-black/5">
                    <Image
                      src="/a2026.jpg"
                      alt="Hero image"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-white/30">
                          <Image
                            src="/avatar.jpg"
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-xl font-black leading-tight">
                            Jihee Cho
                          </div>
                          <div className="text-white/80 text-sm font-semibold">
                            Analytics · Bayesian · Forecasting · LLM
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {[
                          "Decision-ready outputs",
                          "Automation → productization",
                          "Fine-tuning / RAG",
                        ].map((x) => (
                          <span
                            key={x}
                            className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-extrabold text-white backdrop-blur"
                          >
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Projects Tab */}
      {tab === "Projects" && (
        <section className="rounded-[32px] border border-[var(--line)] bg-white/55 p-6 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Projects
              </h2>
              <p className="mt-3 text-[15px] text-[var(--muted)] leading-8 font-medium">
                카드를 클릭하면 Repo가 우선으로 열립니다. Repo가 없는
                프로젝트는 Demo, 그다음 Blog 순으로 연결됩니다.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Pill
              active={filter === "All"}
              onClick={() => setFilter("All")}
              tone="neutral"
            >
              All
            </Pill>
            {categories.map((k) => (
              <Pill
                key={String(k)}
                active={filter === k}
                onClick={() => setFilter(k)}
                tone={String(k).toLowerCase().includes("llm") ? "accent" : "dark"}
              >
                {String(k)}
              </Pill>
            ))}
          </div>

          <div className="mt-7 grid gap-4">
            {filtered.map((p) => (
              <ProjectCard key={(p as any).slug} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* Info Tab */}
      {tab === "Info" && (
        <section className="rounded-[32px] border border-[var(--line)] bg-white/55 p-6 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Info
              </h2>
              <p className="mt-3 text-[15px] text-[var(--muted)] leading-8 font-medium">
                왼쪽에는 학력·경력·수상 내역을, 오른쪽에는 요약·스킬·코어
                강점을 정리했습니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LinkChip
                href={LINKS.resumePdf}
                className="bg-black text-white border-black/20"
              >
                Resume PDF
              </LinkChip>
              <LinkChip href={`mailto:${LINKS.email}`}>Contact</LinkChip>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* left */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                    <Image
                      src="/avatar.jpg"
                      alt="avatar"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-black tracking-tight">
                      Jihee Cho
                    </div>
                    <div className="text-sm text-[var(--muted)] font-semibold">
                      Analytics · Bayesian · Forecasting · LLM
                    </div>
                    <a
                      className="mt-2 inline-flex text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
                      href={`mailto:${LINKS.email}`}
                    >
                      {LINKS.email}
                    </a>
                  </div>
                </div>
              </div>

              <InfoBlock title="Education" items={EDUCATION} />
              <InfoBlock title="Experience" items={EXPERIENCE} />
              <InfoBlock title="Awards" items={AWARDS} />
            </div>

            {/* right */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-7">
                <div className="text-sm font-black tracking-tight">Summary</div>
                <p className="mt-3 text-[15px] text-[var(--muted)] leading-8 font-medium">
                  {INFO_SUMMARY}
                </p>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-7">
                <div className="text-sm font-black tracking-tight">
                  Skillset
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillset.map((c) => (
                    <Pill
                      key={c.label}
                      tone={c.tone ?? "neutral"}
                      onClick={() => {
                        if (c.cat) {
                          setFilter(c.cat);
                          setTab("Projects");
                        }
                      }}
                    >
                      {c.label}
                      {c.cat ? (
                        <span className="ml-2 text-[11px] text-black/60">
                          ({String(c.cat)})
                        </span>
                      ) : null}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-7">
                <div className="text-sm font-black tracking-tight">
                  Core strengths
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {core.map((c) => (
                    <Pill key={c.label} tone={c.tone ?? "neutral"}>
                      {c.label}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Board Tab */}
      {tab === "Board" && (
        <section className="rounded-[32px] border border-[var(--line)] bg-white/55 p-6 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Board
              </h2>
              <p className="mt-3 text-[15px] text-[var(--muted)] leading-8 font-medium">
                업데이트, 노트, 외부 링크를 모아두는 공간입니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LinkChip
                href={LINKS.velog}
                className="bg-black text-white border-black/20"
              >
                Velog
              </LinkChip>
              <LinkChip href={LINKS.github}>GitHub</LinkChip>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Pinned",
                body: "대표 글, 발표 자료, 주요 링크를 고정해두는 영역입니다.",
              },
              {
                title: "Notes",
                body: "실험·리서치 노트와 짧은 인사이트를 정리합니다.",
              },
              {
                title: "Updates",
                body: "포트폴리오 개선 사항과 배포 기록을 기록합니다.",
              },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-3xl border border-[var(--line)] bg-white/70 p-7"
              >
                <div className="text-sm font-black tracking-tight">
                  {x.title}
                </div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7 font-medium">
                  {x.body}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-2 pb-6 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Jihee Cho</div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              className="underline underline-offset-4 hover:opacity-80"
              href={LINKS.hf}
              target="_blank"
              rel="noreferrer"
            >
              Hugging Face
            </a>
            <a
              className="underline underline-offset-4 hover:opacity-80"
              href={LINKS.velog}
              target="_blank"
              rel="noreferrer"
            >
              Velog
            </a>
            <a
              className="underline underline-offset-4 hover:opacity-80"
              href={`mailto:${LINKS.email}`}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
