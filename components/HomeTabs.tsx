"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/app/projects/data";

type Category = "All" | "LLM" | "Forecasting" | "Bayesian" | "Segmentation";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  resume: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  github: "https://github.com/jay-lay-down",
};

function ChipLink({
  href,
  children,
  variant = "ghost",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "ghost" | "solid";
}) {
  const cls =
    variant === "solid"
      ? "border-black/15 bg-black text-white hover:opacity-90"
      : "border-[var(--line)] bg-white/70 hover:opacity-85";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        cls,
      ].join(" ")}
    >
      {children} <span className={variant === "solid" ? "text-white/80" : "text-[var(--muted)]"}>↗</span>
    </a>
  );
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent" | "dark";
}) {
  const toneClass =
    tone === "primary"
      ? "border-black/20 bg-black text-white"
      : tone === "accent"
      ? "border-black/10 bg-[var(--accent)]/10 text-[var(--fg)]"
      : tone === "dark"
      ? "border-black/15 bg-black/90 text-white"
      : "border-[var(--line)] bg-white/70 text-[var(--muted)]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        "tracking-tight whitespace-nowrap select-none",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ChipButton({
  children,
  tone = "neutral",
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent" | "dark";
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    tone === "primary"
      ? "border-black/20 bg-black text-white"
      : tone === "accent"
      ? "border-black/10 bg-[var(--accent)]/10 text-[var(--fg)]"
      : tone === "dark"
      ? "border-black/15 bg-black/90 text-white"
      : "border-[var(--line)] bg-white/70 text-[var(--muted)]";

  const activeCls = active ? "ring-2 ring-black/15" : "hover:opacity-85";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition",
        "tracking-tight whitespace-nowrap select-none",
        base,
        activeCls,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ---------- About data (Info) ----------
type Edu = { school: string; degree: "Master" | "Bachelor"; major: string };
type Work = { org: string; team?: string; role?: string };
type Award = { year: number; label: string; extraKey?: number };

const EDUCATION: Edu[] = [
  { school: "서울여자대학교 일반대학원", degree: "Master", major: "아동심리학 전공(석사)" },
  { school: "서울여자대학교", degree: "Bachelor", major: "아동학과 졸업(학사)" },
];

const WORK: Work[] = [
  { org: "Kantar Korea", team: "Analytics" },
  { org: "NIQ-GfK", team: "Global Strategic Account Management" },
  { org: "Macromill Embrain", team: "리서치 1부서 3팀" },
  { org: "MnM Research", team: "연구사업본부" },
  { org: "서울대학교병원", team: "소아정신과 의생명연구원" },
];

const AWARDS: Award[] = [
  { year: 2024, label: "3Q Night out in town", extraKey: 3 }, // quarter = 3
  { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
  { year: 2018, label: "KCI 제 1 논문저자" },
  { year: 2016, label: "한국장학재단 우수연구계획서 선정" },
];

function sortEducation(a: Edu, b: Edu) {
  const rank = (d: Edu["degree"]) => (d === "Master" ? 2 : 1);
  return rank(b.degree) - rank(a.degree);
}

function sortAwards(a: Award, b: Award) {
  const ak = a.year * 10 + (a.extraKey ?? 0);
  const bk = b.year * 10 + (b.extraKey ?? 0);
  return bk - ak;
}

// ---------- Skills / strengths (click to filter) ----------
type SkillChip = { label: string; cat?: Exclude<Category, "All">; tone?: "neutral" | "accent" | "dark" };

const ABOUT_SKILLSET: SkillChip[] = [
  { label: "Problem framing / Planning", tone: "accent" },
  { label: "Analytics / Market research", tone: "accent" },
  { label: "KPI framework", tone: "neutral" },

  { label: "Segmentation", cat: "Segmentation", tone: "accent" },
  { label: "SEM", tone: "neutral" },
  { label: "PCA / Factor analysis", tone: "neutral" },

  { label: "Bayesian modeling", cat: "Bayesian", tone: "accent" },
  { label: "Causal time series (Granger)", tone: "neutral" },
  { label: "Forecasting (SARIMAX)", cat: "Forecasting", tone: "accent" },

  { label: "Python/R automation", tone: "neutral" },
  { label: "Reproducible reporting", tone: "neutral" },

  { label: "LLM fine-tuning (LoRA)", cat: "LLM", tone: "dark" },
  { label: "RAG workflow", cat: "LLM", tone: "dark" },
];

const ABOUT_CORE: SkillChip[] = [
  { label: "Problem definition", tone: "primary" },
  { label: "Method rationale", tone: "primary" },
  { label: "Decision-ready outputs", tone: "neutral" },
  { label: "Automation → productization", tone: "neutral" },
  { label: "Stakeholder alignment", tone: "neutral" },
];

// ---------- Projects helpers ----------
function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  // ✅ 카드 클릭/Details 버튼 클릭 시 이동 우선순위
  return p.repo ?? p.demo ?? p.blog ?? `/projects/${p.slug}`;
}

function inferCategoryOfProject(p: (typeof PROJECTS)[number]): Category {
  const s = `${p.category ?? ""} ${p.title ?? ""} ${p.oneLiner ?? ""}`.toLowerCase();
  if (s.includes("llm") || s.includes("rag") || s.includes("chatbot") || s.includes("lora")) return "LLM";
  if (s.includes("sarimax") || s.includes("forecast") || s.includes("수요") || s.includes("예측")) return "Forecasting";
  if (s.includes("bayes") || s.includes("pymc") || s.includes("bayesian")) return "Bayesian";
  if (s.includes("segment") || s.includes("tree") || s.includes("cluster") || s.includes("세그")) return "Segmentation";
  return "All";
}

// slug 기반으로 패턴을 “랜덤처럼” 고정 선택
function hashSlug(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function fallbackPattern(slug: string) {
  const patterns = [
    // 1) warm aurora
    "radial-gradient(ellipse at 20% 25%, rgba(255, 186, 73, 0.28), transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(121, 81, 255, 0.18), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))",
    // 2) ink + sand
    "radial-gradient(ellipse at 30% 30%, rgba(0,0,0,0.12), transparent 55%), radial-gradient(ellipse at 70% 65%, rgba(255, 186, 73, 0.22), transparent 58%), linear-gradient(135deg, rgba(255,255,255,0.55), rgba(0,0,0,0.03))",
    // 3) soft grid feel
    "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02)), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 18px)",
    // 4) diagonal shimmer
    "linear-gradient(135deg, rgba(0,0,0,0.06), transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(255, 186, 73, 0.22), transparent 55%), radial-gradient(ellipse at 25% 80%, rgba(0,0,0,0.10), transparent 60%)",
    // 5) minimal vignette
    "radial-gradient(ellipse at center, rgba(255,255,255,0.75), rgba(0,0,0,0.08)), radial-gradient(ellipse at 65% 35%, rgba(255, 186, 73, 0.20), transparent 55%)",
  ];
  const idx = hashSlug(slug) % patterns.length;
  return patterns[idx];
}

export default function HomeTabs() {
  const [tab, setTab] = useState<"Home" | "About" | "Details">("Home");
  const [activeCat, setActiveCat] = useState<Category>("All");

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Details" as const, label: "Details" },
    ],
    []
  );

  const featured = useMemo(() => PROJECTS.filter((p) => p.featured).slice(0, 6), []);

  const projectsWithCat = useMemo(() => {
    return PROJECTS.map((p) => ({ ...p, __cat: inferCategoryOfProject(p) as Category }));
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCat === "All") return projectsWithCat;
    return projectsWithCat.filter((p) => p.__cat === activeCat);
  }, [activeCat, projectsWithCat]);

  const aboutEdu = useMemo(() => [...EDUCATION].sort(sortEducation), []);
  const aboutAwards = useMemo(() => [...AWARDS].sort(sortAwards), []);

  const categoryTabs: { key: Category; label: string }[] = [
    { key: "All", label: "All" },
    { key: "LLM", label: "LLM" },
    { key: "Forecasting", label: "Forecasting" },
    { key: "Bayesian", label: "Bayesian" },
    { key: "Segmentation", label: "Segmentation" },
  ];

  const goDetailsWithFilter = (cat?: Exclude<Category, "All">) => {
    if (cat) setActiveCat(cat);
    setTab("Details");
    // 스크롤 살짝 위로 (웹에서 보기 좋게)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      {/* 탭 버튼 */}
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

      {/* 내용 패널 */}
      <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/55 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* HOME */}
        {tab === "Home" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">Home</h2>
            <p className="mt-4 text-[15px] text-[var(--muted)] leading-8">
              프로젝트/리서치/실험을 “보여주는 형태”로 정리하고, 분석 결과를 대시보드·웹·자동화 산출물로 연결하는 일을
              지향해. (홈 화면에서는 Featured만 간단히 보여주고, Details 탭에서 썸네일+레포 링크로 바로 이동돼.)
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resume} variant="solid">
                Resume
              </ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm font-bold">Featured Projects</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">대표 3~4개만 미리보기</div>
                </div>
                <button
                  onClick={() => setTab("Details")}
                  className="text-sm underline underline-offset-4 hover:opacity-80"
                >
                  Go to Details →
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {featured.slice(0, 4).map((p) => {
                  const href = pickPrimaryLink(p);
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={p.slug}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs text-[var(--muted)]">{p.category}</div>
                          <div className="mt-1 font-bold">{p.title}</div>
                          <div className="mt-1 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>
                        </div>
                        <div className="shrink-0 text-sm text-[var(--muted)]">Open ↗</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">About</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
              {/* LEFT: INFO (약력만) */}
              <aside className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-black tracking-tight">Info</div>

                <div className="mt-4 space-y-5 text-sm text-[var(--muted)] leading-7">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]/70">
                      Contact
                    </div>
                    <div className="mt-2">
                      <a
                        className="underline underline-offset-4 hover:opacity-80"
                        href={`mailto:${LINKS.email}`}
                      >
                        {LINKS.email}
                      </a>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <ChipLink href={LINKS.github}>GitHub</ChipLink>
                      <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
                      <ChipLink href={LINKS.velog}>Velog</ChipLink>
                      <ChipLink href={LINKS.resume} variant="solid">
                        Resume
                      </ChipLink>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]/70">
                      Education
                    </div>
                    <ul className="mt-2 space-y-2">
                      {aboutEdu.map((e) => (
                        <li key={`${e.school}-${e.degree}`} className="leading-6">
                          <div className="text-[var(--fg)]/80 font-semibold">{e.school}</div>
                          <div className="text-[var(--muted)]">{e.major}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]/70">
                      Work
                    </div>
                    <ul className="mt-2 space-y-2">
                      {WORK.map((w) => (
                        <li key={`${w.org}-${w.team ?? ""}`} className="leading-6">
                          <div className="text-[var(--fg)]/80 font-semibold">
                            {w.org}
                            {w.team ? <span className="text-[var(--muted)] font-normal"> / {w.team}</span> : null}
                          </div>
                          {w.role ? <div className="text-[var(--muted)]">{w.role}</div> : null}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]/70">
                      Awards
                    </div>
                    <ul className="mt-2 space-y-1">
                      {aboutAwards.map((a) => (
                        <li key={`${a.year}-${a.label}`}>• {a.year} {a.label}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* RIGHT: INTRO + CHIPS */}
              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-6">
                <div className="text-sm font-black tracking-tight">Introduction</div>

                <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
                  7년간 데이터 분석·시장조사 영역에서 일하며, 데이터를 “분석”에서 끝내지 않고 의사결정으로 이어지게 만드는
                  구조를 설계해 왔습니다. 의료 데이터 관리로 커리어를 시작해 리서치 기획, 컨설팅, 예측 모델링까지 경험을
                  확장했고, 프로젝트 초기에 클라이언트의 모호한 요구를 지표·비교군·방법론으로 구체화하고 리드하는 역할을
                  자주 맡았습니다. SEM·시계열·세그멘테이션 등 다양한 기법을 적용해왔지만, 핵심은 항상 왜 이 방법을 쓰는지
                  설명 가능하게 만들고 결과가 어떤 판단으로 연결되는지까지 설계하는 것입니다. 반복 업무는 자동화 툴로
                  구현하고(세그멘테이션 데스크톱 툴), LLM 파인튜닝/배포와 RAG 기반 워크플로우 적용까지 확장해 분석을 실제로
                  “작동 및 서비스하는 형태”로 만들었습니다. 복잡한 내용을 비즈니스 언어로 전달해 이해관계자 간의 연결고리
                  역할을 할 수 있는 커뮤니케이션도 강점입니다.
                </p>

                {/* Chips */}
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-4">
                    <div className="text-xs font-black uppercase tracking-wider text-[var(--fg)]/70">
                      Skillset (click to filter projects)
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 max-w-[56rem]">
                      {ABOUT_SKILLSET.map((t) => (
                        <ChipButton
                          key={t.label}
                          tone={t.tone ?? "neutral"}
                          onClick={() => (t.cat ? goDetailsWithFilter(t.cat) : setTab("Details"))}
                        >
                          {t.label}
                        </ChipButton>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-[var(--muted)]">
                      칩 누르면 Details로 이동하면서 해당 카테고리로 필터됨.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-4">
                    <div className="text-xs font-black uppercase tracking-wider text-[var(--fg)]/70">
                      Core strengths
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 max-w-[56rem]">
                      {ABOUT_CORE.map((t, i) => (
                        <Chip key={t.label} tone={i < 2 ? "primary" : "neutral"}>
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DETAILS (Projects list w/ thumbnail + repo link) */}
        {tab === "Details" && (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Projects (Details)</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  카드 클릭/Details 버튼 → GitHub Repo(우선)로 이동. 위 필터로 카테고리 전환 가능.
                </p>
              </div>
              <a className="text-sm underline underline-offset-4 hover:opacity-80" href="/projects">
                View all →{/* 기존 라우트 유지 */}
              </a>
            </div>

            {/* Category filter tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryTabs.map((c) => (
                <ChipButton
                  key={c.key}
                  active={activeCat === c.key}
                  tone={activeCat === c.key ? "primary" : "neutral"}
                  onClick={() => setActiveCat(c.key)}
                >
                  {c.label}
                </ChipButton>
              ))}
            </div>

            <div className="mt-6 grid gap-4">
              {filteredProjects.map((p) => {
                const href = pickPrimaryLink(p);
                const external = href.startsWith("http");
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
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-[var(--muted)]">{p.category}</div>
                          <Chip tone={p.__cat === "LLM" ? "dark" : p.__cat === "All" ? "neutral" : "accent"}>
                            {p.__cat}
                          </Chip>
                        </div>

                        <div className="mt-1 text-xl font-black tracking-tight">{p.title}</div>
                        <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.stack.slice(0, 10).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3 text-sm">
                          {p.repo && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Repo ↗
                            </span>
                          )}
                          {!p.repo && p.demo && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Demo ↗
                            </span>
                          )}
                          {!p.repo && !p.demo && p.blog && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Blog ↗
                            </span>
                          )}
                        </div>
                      </div>

                      {/* right thumbnail */}
                      <div className="shrink-0 w-[260px]">
                        <div className="relative h-[150px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                          {p.cover ? (
                            <>
                              <Image src={p.cover} alt={`${p.title} cover`} fill className="object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                            </>
                          ) : (
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: fallbackPattern(p.slug),
                              }}
                            />
                          )}

                          <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-semibold border border-white/25 bg-black/40 text-white backdrop-blur">
                            Details →
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
