"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS, type ProjectCategory } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  resume: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  github: "https://github.com/jay-lay-down",
};

type TabKey = "Home" | "About" | "Projects";
type FilterCat = "All" | ProjectCategory;

type SkillChipTone = "neutral" | "accent" | "dark" | "primary";
type SkillChip = { label: string; tone?: SkillChipTone; cat?: ProjectCategory };

type Project = (typeof PROJECTS)[number];

type InfoItem = { year?: number; label: string; sub?: string };

function cn(...xs: Array<string | false | null | undefined>) {
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
        "inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/75 px-4 py-2 text-sm font-semibold hover:opacity-90 transition",
        className
      )}
    >
      {children}
      <span className="text-black/45">↗</span>
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
          : "border-black/15 bg-white/70 text-black/55 hover:text-black"
      )}
    >
      {children}
    </button>
  );
}

function pickPrimaryLink(p: Project) {
  return (p as any).repo ?? (p as any).demo ?? (p as any).blog ?? `/projects/${(p as any).slug}`;
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function hashToIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : 0;
}

const FALLBACK_PATTERNS = [
  "bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,214,170,0.55),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(30,30,30,0.10),transparent_60%),linear-gradient(135deg,rgba(255,248,240,1),rgba(245,236,225,1))]",
  "bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px),radial-gradient(ellipse_at_30%_30%,rgba(255,193,140,0.40),transparent_55%),linear-gradient(135deg,rgba(252,248,242,1),rgba(242,234,224,1))] bg-[size:18px_18px,18px_18px,auto,auto]",
  "bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.04)_10px,transparent_10px,transparent_22px),radial-gradient(ellipse_at_70%_30%,rgba(255,175,110,0.35),transparent_60%),linear-gradient(135deg,rgba(252,247,240,1),rgba(244,235,225,1))]",
  "bg-[radial-gradient(circle_at_18%_25%,rgba(255,200,150,0.55),transparent_55%),radial-gradient(circle_at_82%_78%,rgba(0,0,0,0.10),transparent_55%),linear-gradient(135deg,rgba(253,248,242,1),rgba(243,233,222,1))]",
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
  { label: "LLM fine-tuning (LoRA)", cat: "LLM", tone: "accent" },
  { label: "RAG workflow", cat: "LLM", tone: "accent" },
];

const CORE_STRENGTHS: SkillChip[] = [
  { label: "Problem definition → decision points", tone: "primary" },
  { label: "Method rationale (explainable choice)", tone: "primary" },
  { label: "Decision-ready outputs (dashboard/report)", tone: "neutral" },
  { label: "Automation → productization", tone: "neutral" },
  { label: "Stakeholder alignment & communication", tone: "dark" },
];

const EDUCATION: InfoItem[] = [
  { label: "서울여자대학교 일반대학원", sub: "아동심리학 전공 (석사)" },
  { label: "서울여자대학교", sub: "아동학과 졸업 (학사)" },
];

const EXPERIENCE: InfoItem[] = [
  { label: "Kantar Korea", sub: "Analytics" },
  { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
  { label: "Macromill Embrain", sub: "리서치 1부서 3팀" },
  { label: "MnM Research", sub: "연구사업본부" },
  { label: "서울대학교병원", sub: "소아정신과 의생명연구원" },
];

const AWARDS: InfoItem[] = [
  { year: 2024, label: "3Q Night out in town" },
  { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
  { year: 2018, label: "KCI 등재 학술지 제1저자" },
  { year: 2016, label: "한국장학재단 우수연구계획서 선정" },
];

const ABOUT_TEXT =
  "7년간 데이터 분석·시장조사 영역에서 데이터를 ‘분석’에서 끝내지 않고 의사결정으로 이어지게 만드는 구조를 설계해 왔습니다. 리서치 기획, 컨설팅, 예측 모델링까지 경험을 확장했고, 지표·비교군·방법론으로 구체화하고 리드하는 역할을 자주 맡았습니다. SEM·시계열·세그멘테이션 등 다양한 기법을 적용해왔지만, 핵심은 왜 이 방법을 쓰는지 설명 가능하게 만들고 결과가 어떤 판단으로 연결되는지까지 설계하는 것입니다. 반복 업무는 자동화 툴로 구현하고(세그멘테이션 데스크톱 툴), LLM 파인튜닝/배포와 RAG 기반 워크플로우 적용까지 확장해 분석을 실제로 ‘작동 및 서비스하는 형태’로 만들었습니다. 복잡한 내용을 비즈니스 언어로 전달해 이해관계자 간 정렬을 만드는 커뮤니케이션도 강점입니다.";

function toneClass(tone?: SkillChipTone) {
  switch (tone) {
    case "primary":
      return "border-black/15 bg-black text-white";
    case "accent":
      return "border-black/10 bg-[rgba(255,186,73,0.26)] text-black";
    case "dark":
      return "border-black/15 bg-[rgba(30,30,30,0.10)] text-black";
    default:
      return "border-black/15 bg-white/80 text-black/65";
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-extrabold tracking-tight transition",
        toneClass(tone),
        clickable && "hover:opacity-90 cursor-pointer"
      )}
    >
      {label}
    </button>
  );
}

function InfoBlock({ title, items }: { title: string; items: InfoItem[] }) {
  const sorted =
    title === "Awards"
      ? [...items].sort((a, b) => (b.year ?? -1) - (a.year ?? -1))
      : items;

  return (
    <div className="rounded-3xl border border-black/15 bg-[#f6f1e8] p-6">
      <div className="text-sm font-black tracking-tight">{title}</div>
      <div className="mt-3 space-y-2 text-sm text-black/70 leading-7">
        {sorted.map((x, i) => (
          <div key={`${title}-${i}`} className="flex gap-3">
            <div className="w-14 shrink-0 text-xs font-extrabold text-black/70">
              {x.year ? String(x.year) : ""}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-black/90">{x.label}</div>
              {x.sub && <div className="text-black/60">{x.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [cat, setCat] = useState<FilterCat>("All");

  const { scrollY } = useScroll();
  const wmY = useTransform(scrollY, [0, 800], [0, -60]);
  const wmX = useTransform(scrollY, [0, 800], [0, 20]);

  const projects = useMemo(() => PROJECTS as Project[], []);
  const featured = useMemo(() => {
    const list = (projects as any[]).filter((p) => p.featured);
    return (list.length ? list : projects).slice(0, 4);
  }, [projects]);

  const filtered = useMemo(() => {
    if (cat === "All") return projects;
    return projects.filter((p) => (p as any).category === cat);
  }, [cat, projects]);

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Projects" as const, label: "Projects" },
    ],
    []
  );

  return (
    <section className="mt-10 space-y-8">
      {/* HERO + 2026 워터마크 */}
      <div className="relative overflow-hidden rounded-[28px] border border-black/15 bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        <motion.div
          style={{ x: wmX, y: wmY }}
          className="pointer-events-none absolute -top-10 -left-6 text-[180px] font-black tracking-[-0.06em] text-black/[0.06]"
        >
          2026
        </motion.div>

        <div className="grid grid-cols-12 gap-10 p-10">
          {/* LEFT */}
          <div className="col-span-7 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-4 py-2 text-[11px] font-bold tracking-[0.18em]">
              PORTFOLIO · ANALYTICS · BUILD
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
            </div>

            <h1 className="mt-6 text-[56px] leading-[0.95] font-black tracking-tight">
              Portfolio
              <span className="block text-[26px] text-black/70 mt-2">Jihee Cho</span>
            </h1>

            <p className="mt-6 text-[15.5px] leading-8 text-black/65 max-w-[70ch]">
              프로젝트/리서치/실험을 기획하고, 분석 결과를 대시보드·웹·자동화 산출물로 연결합니다. Home에서는 대표
              프로젝트만 간단히 보여주고, 아래 탭에서 About(약력/강점)과 Projects(전체 Repo 링크)를 상세히 볼 수 있습니다.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resume}>Resume</ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
            </div>

            {/* Featured 리스트 (세로) */}
            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm font-black">Featured Projects</div>
                  <div className="mt-1 text-xs text-black/55">대표 3~4개만 미리보기</div>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("Projects")}
                  className="text-xs font-semibold underline underline-offset-4 hover:opacity-80"
                >
                  Go to Projects →
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {featured.map((p) => {
                  const href = pickPrimaryLink(p);
                  const external = isExternal(href);
                  return (
                    <a
                      key={(p as any).slug}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="block rounded-2xl border border-black/15 bg-white/80 px-6 py-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase text-black/55">
                            {(p as any).category}
                          </div>
                          <div className="mt-1 text-[17px] font-black tracking-tight">
                            {(p as any).title}
                          </div>
                          <div className="mt-1 text-[14px] text-black/60 leading-7">
                            {(p as any).oneLiner}
                          </div>
                        </div>
                        <div className="shrink-0 text-xs font-semibold text-black/55">Open ↗</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 이미지 */}
          <div className="col-span-5 relative z-10">
            <div className="relative h-[520px] rounded-[26px] overflow-hidden border border-black/15 bg-black/5">
              <Image src="/a2026.jpg" alt="Hero" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/30 bg-black/40">
                    <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-[17px] font-extrabold leading-tight">
                      Jihee Cho
                    </div>
                    <div className="text-white/80 text-[13px]">
                      Analytics · Bayesian · Forecasting · LLM/RAG
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    Decision-ready outputs
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    Automation → productization
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    Fine-tuning / RAG workflows
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-black/45">
              * 이미지: <code>public/a2026.jpg</code>, 아바타: <code>public/avatar.jpg</code>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div>
        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <Pill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </Pill>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-black/15 bg-white/60 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          {/* HOME 탭: 안내 정도만 */}
          {tab === "Home" && (
            <div>
              <h2 className="text-3xl font-black tracking-tight">Home</h2>
              <p className="mt-4 text-[15px] text-black/65 leading-8 max-w-[70ch]">
                상단 히어로에서 대표 프로젝트를, 아래 탭에서는{" "}
                <b>About</b> (약력/강점)과 <b>Projects</b>(전체 Repo 링크)를 확인할 수 있습니다.
                자세한 프로젝트 설명은 Projects 탭 내 카테고리별로 정리되어 있습니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Pill onClick={() => setTab("About")}>Go to About →</Pill>
                <Pill onClick={() => setTab("Projects")}>Go to Projects →</Pill>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {tab === "About" && (
            <>
              <h2 className="text-3xl font-black tracking-tight">About</h2>

              <div className="mt-8 grid grid-cols-12 gap-6 items-start">
                {/* LEFT INFO */}
                <div className="col-span-5 space-y-4">
                  <div className="text-sm font-black tracking-tight">Info</div>
                  <InfoBlock title="Education" items={EDUCATION} />
                  <InfoBlock title="Experience" items={EXPERIENCE} />
                  <InfoBlock title="Awards" items={AWARDS} />
                  <div className="rounded-3xl border border-black/15 bg-white/80 p-6">
                    <div className="text-sm font-black tracking-tight">Resume</div>
                    <div className="mt-3">
                      <ChipLink
                        href={LINKS.resume}
                        className="bg-black text-white border-black/20"
                      >
                        Resume PDF
                      </ChipLink>
                    </div>
                  </div>
                </div>

                {/* RIGHT TEXT + SKILLS */}
                <div className="col-span-7">
                  <div className="rounded-3xl border border-black/15 bg-white/80 p-7">
                    <div className="text-sm font-black tracking-tight">Info</div>
                    <p className="mt-3 text-[15.5px] text-black/70 leading-8">{ABOUT_TEXT}</p>

                    <div className="mt-7 grid grid-cols-2 gap-4">
                      <div>
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
                                      setTab("Projects");
                                    }
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                        <div className="mt-3 text-[11px] text-black/50 leading-6">
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-black tracking-tight">Core strengths</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {CORE_STRENGTHS.map((x) => (
                            <Chip key={x.label} label={x.label} tone={x.tone} />
                          ))}
                        </div>

                        <div className="mt-6 text-sm font-black tracking-tight">Contact</div>
                        <div className="mt-2 text-sm text-black/65">
                          <a
                            className="underline underline-offset-4 hover:opacity-80"
                            href={`mailto:${LINKS.email}`}
                          >
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
                </div>
              </div>
            </>
          )}

          {/* PROJECTS */}
          {tab === "Projects" && (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Projects</h2>
                  <p className="mt-2 text-sm text-black/60">
                  </p>
                </div>
                <a
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                  href="/projects"
                >
                  View simple list →
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(["All", "LLM", "Forecasting", "Bayesian", "Segmentation"] as FilterCat[]).map(
                  (k) => (
                    <Pill key={k} active={cat === k} onClick={() => setCat(k)}>
                      {k}
                    </Pill>
                  )
                )}
              </div>

              <div className="mt-8 grid gap-4">
                {filtered.map((p) => {
                  const slug = (p as any).slug as string;
                  const href = pickPrimaryLink(p);
                  const external = isExternal(href);
                  const cover = (p as any).cover as string | undefined;
                  const pattern =
                    FALLBACK_PATTERNS[hashToIndex(slug, FALLBACK_PATTERNS.length)];

                  return (
                    <a
                      key={slug}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="group rounded-3xl border border-black/15 bg-white/70 p-6 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* LEFT */}
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase text-black/55">
                            {(p as any).category}
                          </div>
                          <div className="mt-1 text-[22px] font-black tracking-tight">
                            {(p as any).title}
                          </div>
                          <div className="mt-2 text-sm text-black/60 leading-7">
                            {(p as any).oneLiner}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(Array.isArray((p as any).stack)
                              ? ((p as any).stack as string[])
                              : []
                            ).slice(0, 10).map((s) => (
                              <span
                                key={s}
                                className="text-[11px] px-2 py-1 rounded-full border border-black/12 bg-white/80 text-black/60 font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 text-sm font-extrabold underline underline-offset-4 text-black/80 group-hover:opacity-85">
                            Details ↗
                          </div>
                        </div>

                        {/* RIGHT 썸네일 */}
                        <div className="shrink-0 w-[320px]">
                          <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                            {cover ? (
                              <>
                                <Image
                                  src={cover}
                                  alt={`${(p as any).title} cover`}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                              </>
                            ) : (
                              <div className={cn("absolute inset-0", pattern)} />
                            )}

                            <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-[11px] font-extrabold border border-white/25 bg-black/40 text-white backdrop-blur">
                              Open →
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="mt-6 text-sm text-black/55">
                    해당 카테고리 프로젝트가 아직 없습니다. <code>app/projects/data.ts</code>의{" "}
                    <code>category</code> / <code>stack</code> 값을 확인해 주세요.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
