"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  resume: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  github: "https://github.com/jay-lay-down",
};

type Category = "All" | "LLM" | "Forecasting" | "Bayesian" | "Segmentation";

type SkillChipTone = "neutral" | "accent" | "dark" | "primary";
type SkillChip = {
  label: string;
  cat?: Exclude<Category, "All">;
  tone?: SkillChipTone;
};

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
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
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold hover:opacity-90 transition",
        className
      )}
    >
      {children} <span className="text-[var(--muted)]">↗</span>
    </a>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-extrabold border transition",
        active
          ? "border-black/20 bg-black text-white"
          : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]"
      )}
    >
      {children}
    </button>
  );
}

function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  // Details/카드 클릭 우선순위: Repo > Demo > Blog > 내부 상세
  return (p as any).repo ?? (p as any).demo ?? (p as any).blog ?? `/projects/${(p as any).slug}`;
}

function inferCategory(p: (typeof PROJECTS)[number]): Exclude<Category, "All"> {
  const c = String((p as any).category ?? "").toLowerCase();
  if (c.includes("llm")) return "LLM";
  if (c.includes("forecast")) return "Forecasting";
  if (c.includes("bayes")) return "Bayesian";
  if (c.includes("segment")) return "Segmentation";

  // oneLiner/stack 기반 fallback
  const one = String((p as any).oneLiner ?? "").toLowerCase();
  const stack = Array.isArray((p as any).stack) ? (p as any).stack.join(" ").toLowerCase() : "";

  const text = `${c} ${one} ${stack}`;
  if (/(lora|rag|llm|transformer|gradio|hugging\s?face)/.test(text)) return "LLM";
  if (/(sarimax|forecast|time\s*series|arima|mape|mase)/.test(text)) return "Forecasting";
  if (/(bayes|pymc|arviz|posterior)/.test(text)) return "Bayesian";
  return "Segmentation";
}

function hashToIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : 0;
}

const FALLBACK_PATTERNS = [
  // warm beige + ink
  "bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,214,170,0.55),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(30,30,30,0.10),transparent_60%),linear-gradient(135deg,rgba(255,248,240,1),rgba(245,236,225,1))]",
  // subtle grid + warm
  "bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px),radial-gradient(ellipse_at_30%_30%,rgba(255,193,140,0.40),transparent_55%),linear-gradient(135deg,rgba(252,248,242,1),rgba(242,234,224,1))] bg-[size:18px_18px,18px_18px,auto,auto]",
  // diagonal stripes
  "bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.04)_10px,transparent_10px,transparent_22px),radial-gradient(ellipse_at_70%_30%,rgba(255,175,110,0.35),transparent_60%),linear-gradient(135deg,rgba(252,247,240,1),rgba(244,235,225,1))]",
  // double glow
  "bg-[radial-gradient(circle_at_18%_25%,rgba(255,200,150,0.55),transparent_55%),radial-gradient(circle_at_82%_78%,rgba(0,0,0,0.10),transparent_55%),linear-gradient(135deg,rgba(253,248,242,1),rgba(243,233,222,1))]",
  // clean ink vignette
  "bg-[radial-gradient(ellipse_at_50%_15%,rgba(0,0,0,0.10),transparent_60%),radial-gradient(ellipse_at_30%_80%,rgba(255,210,170,0.40),transparent_60%),linear-gradient(135deg,rgba(252,248,244,1),rgba(244,236,226,1))]",
];

const SKILLSET: SkillChip[] = [
  { label: "Analytics planning", tone: "primary" },
  { label: "Market research", tone: "primary" },
  { label: "Segmentation", cat: "Segmentation", tone: "accent" },
  { label: "SEM", tone: "neutral" },
  { label: "PCA / Factor", tone: "neutral" },
  { label: "Granger / Causal TS", tone: "neutral" },
  { label: "SARIMAX", cat: "Forecasting", tone: "accent" },
  { label: "Bayesian (PyMC)", cat: "Bayesian", tone: "accent" },
  { label: "Automation (Python/R)", tone: "dark" },
  { label: "LLM Fine-tuning (LoRA)", cat: "LLM", tone: "accent" },
  { label: "RAG workflow", cat: "LLM", tone: "accent" },
];

const CORE_STRENGTHS: SkillChip[] = [
  { label: "Problem definition → decision points", tone: "primary" },
  { label: "Method rationale (explainable choice)", tone: "primary" },
  { label: "Decision-ready outputs (dashboard/report)", tone: "neutral" },
  { label: "Automation → productization", tone: "neutral" },
  { label: "Stakeholder alignment & communication", tone: "dark" },
];

type InfoItem = { year?: number; label: string; sub?: string };
const EDUCATION: InfoItem[] = [
  { label: "Seoul Women's University (M.S.)", sub: "Child Psychology" },
  { label: "Seoul Women's University (B.A.)", sub: "Child Studies" },
];

const EXPERIENCE: InfoItem[] = [
  { label: "Kantar Korea", sub: "Analytics" },
  { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
  { label: "Macromill Embrain", sub: "Research Dept. (Team 3)" },
  { label: "MnM Research", sub: "Research & Business Division" },
  { label: "Seoul National University Hospital", sub: "Pediatric Psychiatry · Biomedical Researcher" },
];

const AWARDS: InfoItem[] = [
  { year: 2024, label: "3Q Night out in town" },
  { year: 2021, label: "HR Committee · Best Report 선정" },
  { year: 2018, label: "KCI 등재 · 제1저자 논문" },
  { year: 2016, label: "Korea Student Aid Foundation · 우수 연구계획서 선정" },
];

function toneClass(tone?: SkillChipTone) {
  switch (tone) {
    case "primary":
      return "border-black/15 bg-black text-white";
    case "accent":
      return "border-black/10 bg-[rgba(255,186,73,0.26)] text-black";
    case "dark":
      return "border-black/15 bg-[rgba(30,30,30,0.10)] text-black";
    default:
      return "border-[var(--line)] bg-white/80 text-[var(--muted)]";
  }
}

function Chip({
  label,
  tone,
  onClick,
  clickable,
}: {
  label: string;
  tone?: SkillChipTone;
  onClick?: () => void;
  clickable?: boolean;
}) {
  const base =
    "inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-extrabold tracking-tight transition";
  const hover = clickable ? "hover:opacity-90 cursor-pointer" : "";
  return (
    <span onClick={onClick} className={cn(base, toneClass(tone), hover)}>
      {label}
    </span>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<"Home" | "About" | "Details">("Home");
  const [cat, setCat] = useState<Category>("All");

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Details" as const, label: "Details" },
    ],
    []
  );

  const normalizedProjects = useMemo(() => {
    return PROJECTS.map((p) => {
      const normCat = inferCategory(p);
      const cover = (p as any).cover as string | undefined;
      const featured = Boolean((p as any).featured);
      return { ...p, __cat: normCat, __cover: cover, __featured: featured };
    });
  }, []);

  const filtered = useMemo(() => {
    if (cat === "All") return normalizedProjects;
    return normalizedProjects.filter((p) => (p as any).__cat === cat);
  }, [cat, normalizedProjects]);

  const featured = useMemo(() => {
    const list = normalizedProjects.filter((p) => (p as any).__featured);
    return (list.length ? list : normalizedProjects).slice(0, 4);
  }, [normalizedProjects]);

  const sortedAwards = useMemo(() => {
    return [...AWARDS].sort((a, b) => (b.year ?? -1) - (a.year ?? -1));
  }, []);

  const infoBlock = (title: string, items: InfoItem[]) => (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
      <div className="text-sm font-black tracking-tight">{title}</div>
      <div className="mt-3 space-y-2 text-sm text-[var(--muted)] leading-7">
        {items.map((x, i) => (
          <div key={`${title}-${i}`} className="flex gap-3">
            <div className="w-14 shrink-0 text-xs font-extrabold text-black/70">
              {x.year ? String(x.year) : ""}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black/90">{x.label}</div>
              {x.sub && <div className="text-[var(--muted)]">{x.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="mt-10">
      {/* 탭 버튼 */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <Pill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Pill>
        ))}
      </div>

      {/* 내용 패널 */}
      <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/55 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* HOME */}
        {tab === "Home" && (
          <>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Portfolio</h2>
                <p className="mt-3 text-[15px] text-[var(--muted)] leading-8 max-w-[75ch]">
                  프로젝트/리서치/실험을 “보여주는 형태”로 만들고, 분석 결과를 대시보드·웹·자동화 산출물로 연결해.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ChipLink href={LINKS.github}>GitHub</ChipLink>
                <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
                <ChipLink href={LINKS.velog}>Velog</ChipLink>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-12 gap-6 items-start">
              {/* Left: Avatar + quick */}
              <div className="col-span-4 rounded-3xl border border-[var(--line)] bg-white/70 p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                    {/* public/avatar.jpg */}
                    <Image src="/avatar.jpg" alt="avatar" fill className="object-cover" priority />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-black tracking-tight">Jihee Cho</div>
                    <div className="text-sm text-[var(--muted)]">Analytics · Bayesian · Time Series · LLM</div>
                    <a
                      className="mt-2 inline-flex text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
                      href={`mailto:${LINKS.email}`}
                    >
                      {LINKS.email}
                    </a>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <ChipLink href={LINKS.resume} className="bg-black text-white border-black/20">
                    Resume PDF
                  </ChipLink>
                  <ChipLink href={LINKS.github}>Repo list</ChipLink>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-black tracking-tight">Quick filters</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["All", "LLM", "Forecasting", "Bayesian", "Segmentation"] as Category[]).map((k) => (
                      <Pill
                        key={k}
                        active={cat === k}
                        onClick={() => {
                          setCat(k);
                          setTab("Details");
                        }}
                      >
                        {k}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Featured */}
              <div className="col-span-8">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-black tracking-tight">Featured Projects</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">대표 3~4개</div>
                  </div>
                  <button
                    onClick={() => setTab("Details")}
                    className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
                  >
                    View all →
                  </button>
                </div>

                <div className="mt-4 grid gap-4">
                  {featured.map((p: any) => {
                    const href = pickPrimaryLink(p);
                    const external = href.startsWith("http");
                    const catLabel = p.__cat as Category;
                    return (
                      <a
                        key={p.slug}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="group rounded-3xl border border-[var(--line)] bg-white/70 p-6 hover:shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-black/60">{catLabel}</div>
                            <div className="mt-1 text-xl font-black tracking-tight">{p.title}</div>
                            <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>
                            <div className="mt-4 text-sm font-extrabold underline underline-offset-4 group-hover:opacity-85">
                              Details ↗
                            </div>
                          </div>

                          <div className="shrink-0 w-[240px]">
                            <div className="relative h-[140px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                              {p.__cover ? (
                                <>
                                  <Image src={p.__cover} alt={`${p.title} cover`} fill className="object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                                </>
                              ) : (
                                <div
                                  className={cn("absolute inset-0", FALLBACK_PATTERNS[hashToIndex(p.slug, FALLBACK_PATTERNS.length)])}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <>
            <h2 className="text-4xl font-black tracking-tight">About</h2>

            <div className="mt-8 grid grid-cols-12 gap-6 items-start">
              {/* Left: INFO */}
              <div className="col-span-5 space-y-4">
                <div className="text-sm font-black tracking-tight">INFO</div>
                {infoBlock("Education", EDUCATION)}
                {infoBlock("Experience", EXPERIENCE)}
                {infoBlock("Awards", sortedAwards)}
                <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                  <div className="text-sm font-black tracking-tight">Resume</div>
                  <div className="mt-3">
                    <ChipLink href={LINKS.resume} className="bg-black text-white border-black/20">
                      Resume PDF
                    </ChipLink>
                  </div>
                </div>
              </div>

              {/* Right: narrative + skillset + strengths */}
              <div className="col-span-7">
                <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-7">
                  <div className="text-sm font-black tracking-tight">Info</div>
                  <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
                    7년간 데이터 분석·시장조사 영역에서, 데이터를 “분석”에서 끝내지 않고 의사결정으로 이어지게 만드는 구조를 설계해 왔어.
                    의료 데이터 관리로 시작해 리서치 기획·컨설팅·예측 모델링까지 넓혔고, 프로젝트 초기에 모호한 요구를 지표·비교군·방법론으로
                    구체화하고 리드하는 역할을 자주 맡았지. SEM·시계열·세그멘테이션 등 다양한 기법을 적용해왔지만 핵심은 “왜 이 방법인지”를
                    설명 가능하게 만들고 결과가 어떤 판단으로 연결되는지까지 설계하는 거야. 반복 업무는 자동화 툴로 구현했고(세그멘테이션 데스크톱 툴),
                    LLM 파인튜닝/배포와 RAG 기반 워크플로우 적용까지 확장해서 분석을 실제로 “작동·서비스” 형태로 만들었어. 복잡한 내용을
                    비즈니스 언어로 전달해 이해관계자 정렬을 만드는 커뮤니케이션도 강점이고.
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                      <div className="text-sm font-black tracking-tight">Skillset</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {SKILLSET.map((x) => (
                          <Chip
                            key={x.label}
                            label={x.label}
                            tone={x.tone}
                            clickable={Boolean(x.cat)}
                            onClick={
                              x.cat
                                ? () => {
                                    setCat(x.cat!);
                                    setTab("Details");
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-[var(--muted)] leading-6">
                        카테고리 지정된 칩(LLM/Forecasting/Bayesian/Segmentation) 누르면 Projects가 자동 필터링돼.
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                      <div className="text-sm font-black tracking-tight">Core strengths</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {CORE_STRENGTHS.map((x) => (
                          <Chip key={x.label} label={x.label} tone={x.tone} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <ChipLink href={LINKS.github}>GitHub</ChipLink>
                    <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
                    <ChipLink href={LINKS.velog}>Velog</ChipLink>
                    <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DETAILS */}
        {tab === "Details" && (
          <>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Projects</h2>
                <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
                  카드 클릭 / Details 버튼 → GitHub Repo(우선)로 이동. (Repo 없으면 Demo → Blog 순)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Pill active={cat === "All"} onClick={() => setCat("All")}>
                  All
                </Pill>
                <Pill active={cat === "LLM"} onClick={() => setCat("LLM")}>
                  LLM
                </Pill>
                <Pill active={cat === "Forecasting"} onClick={() => setCat("Forecasting")}>
                  Forecasting
                </Pill>
                <Pill active={cat === "Bayesian"} onClick={() => setCat("Bayesian")}>
                  Bayesian
                </Pill>
                <Pill active={cat === "Segmentation"} onClick={() => setCat("Segmentation")}>
                  Segmentation
                </Pill>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {filtered.map((p: any) => {
                const href = pickPrimaryLink(p);
                const external = href.startsWith("http");
                const pattern = FALLBACK_PATTERNS[hashToIndex(p.slug, FALLBACK_PATTERNS.length)];
                return (
                  <a
                    key={p.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="group rounded-3xl border border-[var(--line)] bg-white/70 p-6 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* left */}
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-black/60">{p.__cat}</div>
                        <div className="mt-1 text-2xl font-black tracking-tight">{p.title}</div>
                        <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(Array.isArray(p.stack) ? p.stack : [])
                            .slice(0, 10)
                            .map((s: string) => (
                              <span
                                key={s}
                                className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                        </div>

                        <div className="mt-5 text-sm font-extrabold underline underline-offset-4 group-hover:opacity-85">
                          Details ↗
                        </div>
                      </div>

                      {/* right thumbnail */}
                      <div className="shrink-0 w-[320px]">
                        <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                          {p.__cover ? (
                            <>
                              <Image src={p.__cover} alt={`${p.title} cover`} fill className="object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                            </>
                          ) : (
                            <div className={cn("absolute inset-0", pattern)} />
                          )}

                          <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-extrabold border border-white/25 bg-black/40 text-white backdrop-blur">
                            Open →
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 text-sm text-[var(--muted)]">해당 카테고리 프로젝트가 아직 없어. (data.ts의 category/stack 확인)</div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
