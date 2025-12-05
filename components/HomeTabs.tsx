"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, FormEvent } from "react";
import { PROJECTS } from "@/app/projects/data";
import { supabase } from "@/lib/supabase";

// 아이콘
import {
  FaGithub,
  FaLinkedin,
  FaPen,
  FaUserCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaQuoteLeft,
} from "react-icons/fa";
import { SiHuggingface, SiVelog } from "react-icons/si";
import {
  MdEmail,
  MdArticle,
  MdSchool,
  MdWork,
  MdEmojiEvents,
} from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

// --- 상수 ---
const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  linkedin: "https://www.linkedin.com/in/jihee-cho-767aa9260/",
  resumePdf: "/resume.pdf",
};

// --- 타입 ---
type TabKey = "Home" | "Projects" | "Info" | "Board";
type Filter =
  | "All"
  | "LLM"
  | "Segmentation"
  | "Bayesian"
  | "Forecasting"
  | "Other";
type Post = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  category: "Q&A" | "Guestbook";
};
type InfoItem = { year?: number; label: string; sub?: string };

// --- 유틸 ---
function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

// 프로젝트 카드 (썸네일 없으면 그라데이션)
function ProjectCard({ p }: { p: any }) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full hover:border-[#d4a373]/50">
      <div className="relative aspect-[16/9] overflow-hidden">
        {p.cover ? (
          <Image
            src={p.cover}
            alt={p.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#fef3c7,transparent_55%),radial-gradient(circle_at_100%_100%,#e5e7eb,transparent_55%),linear-gradient(135deg,#fdfcfb,#e5e7eb)]" />
            <div className="absolute inset-0 mix-blend-multiply opacity-60 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.08),transparent_55%)]" />
            <div className="absolute bottom-3 left-4 text-xs font-bold text-stone-700/85">
              {String(p.category)} Project
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-[#8C5E35] bg-[#8C5E35]/10 px-2 py-1 rounded uppercase tracking-wide">
            {p.category}
          </span>
        </div>
        <h3 className="text-lg font-black text-stone-900 leading-tight mb-3 group-hover:text-[#8C5E35] transition">
          {p.title}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-2">
          {p.oneLiner}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {Array.isArray(p.stack) &&
            p.stack.slice(0, 5).map((s: string) => (
              <span
                key={s}
                className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md border border-stone-200"
              >
                {s}
              </span>
            ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-stone-100">
          {Array.isArray(p.links) &&
            p.links.map((link: any) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 text-stone-600 hover:bg-[#8C5E35] hover:text-white hover:border-[#8C5E35] transition-colors duration-300"
              >
                {link.label === "Download" ? <FaDownload /> : <FaExternalLinkAlt />}
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

// Info 섹션
function InfoSection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: InfoItem[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <Icon className="text-[#d4a373] text-xl" />
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
      </div>
      <div className="space-y-5">
        {items.map((x, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="w-14 shrink-0 text-sm font-bold text-[#d4a373]/60 pt-0.5 group-hover:text-[#d4a373] transition">
              {x.year ? x.year : "•"}
            </div>
            <div>
              <div className="text-base font-bold text-stone-200 group-hover:text-white transition">
                {x.label}
              </div>
              {x.sub && (
                <div className="text-sm text-stone-400 mt-1 font-medium">
                  {x.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialBtn({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 text-stone-700 hover:bg-[#8C5E35] hover:text-white transition shadow-sm border border-stone-200"
    >
      <Icon className="text-xl" />
    </a>
  );
}

const NAV_ITEMS: { key: TabKey; label: string }[] = [
  { key: "Home", label: "Home" },
  { key: "Projects", label: "Projects" },
  { key: "Info", label: "Info" },
  { key: "Board", label: "Board" },
];

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");

  // --- Board ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<"Q&A" | "Guestbook">(
    "Guestbook",
  );

  // 게시판 읽기
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error }: any = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        alert("게시판을 불러오는 중 오류가 발생했어요. (콘솔 로그 확인)");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      alert("네트워크 문제로 게시판을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "Board") fetchPosts();
  }, [tab]);

  // 게시글 저장
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim()) return;

    try {
      const { error }: any = await supabase.from("guestbook").insert([
        { author: inputName, content: inputContent, category: inputCategory },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        alert(
          `게시글 저장 중 오류가 발생했어요: ${
            (error && (error as any).message) || "알 수 없는 오류"
          }`,
        );
        return;
      }

      setInputName("");
      setInputContent("");
      fetchPosts();
    } catch (err: any) {
      console.error("Supabase insert exception:", err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "네트워크 오류로 게시글을 저장하지 못했어요.";
      alert(`Error: ${msg}`);
    }
  };

  // --- Projects 데이터 ---
  const featured = useMemo(
    () => PROJECTS.filter((p: any) => p.featured),
    [],
  );
  const filteredProjects = useMemo(
    () =>
      filter === "All"
        ? PROJECTS
        : PROJECTS.filter((p: any) => p.category === filter),
    [filter],
  );
  const categories = useMemo(
    () => Array.from(new Set(PROJECTS.map((p: any) => p.category))),
    [],
  );

  // --- Static Info ---
  const EDUCATION: InfoItem[] = [
    { label: "서울여자대학교 일반대학원", sub: "아동심리학 전공 (석사)" },
    { label: "서울여자대학교", sub: "아동학과 (학사)" },
  ];
  const EXPERIENCE: InfoItem[] = [
    { label: "Kantar Korea", sub: "Analytics" },
    {
      label: "NIQ-GfK",
      sub: "Global Strategic Account Management",
    },
    { label: "Macromill Embrain", sub: "리서치 1부서 3팀" },
    { label: "MnM Research", sub: "연구사업본부" },
    { label: "서울대학교병원", sub: "소아정신과 의생명연구원" },
  ];
  const AWARDS: InfoItem[] = [
    { year: 2024, label: "3Q Night Out in Town" },
    { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
    { year: 2018, label: "KCI 등재 학술지 제1저자(논문)" },
    { year: 2016, label: "한국장학재단 우수연구계획서 선정" },
  ];
  const LICENSES: InfoItem[] = [
    { label: "사회조사분석사 2급" },
    { label: "빅데이터분석기사" },
    { label: "데이터분석준전문가(AdsP)" },
    { label: "구글 애널리틱스(GAIQ)" },
  ];
  const SKILLS = [
    "Analytics planning",
    "Market research",
    "Demand Space",
    "SEM / Causal Analysis",
    "Forecasting",
    "Bayesian (PyMC)",
    "Productization",
    "LLM fine-tuning",
    "RAG workflows",
  ];

  return (
    <div className="min-h-screen text-stone-800 pb-20 w-full">
      {/* 상단 헤더: 왼쪽 이름, 오른쪽 텍스트 메뉴 */}
      <header className="py-8 w-full px-6 lg:px-16 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-stone-900">
            Jihee Cho
          </h1>
          <p className="text-sm text-stone-500 font-semibold mt-1">
            Jan.25.1991 / Seoul
          </p>
        </div>
        <nav className="flex gap-8 text-sm font-semibold text-stone-500">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "relative pb-1 transition",
                tab === item.key
                  ? "text-stone-900 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-stone-900"
                  : "hover:text-stone-900",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 메인 카드 */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl rounded-t-2xl rounded-b-xl overflow-hidden w-full border border-stone-200/70 bg-white/60">
        {/* HOME */}
        {tab === "Home" && (
          <div className="bg-stone-100/80 pt-8 pb-12 px-0 border-b border-stone-200/50">
            <div className="space-y-10 px-6 lg:px-10">
              {/* Hero */}
              <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/a2026.jpg"
                  alt="Hero"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/55 to-black/80" />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-center text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold w-fit mb-5 border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Available for new projects
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-0 leading-tight drop-shadow-lg">
                    Portfolio
                    <br />
                    <span className="text-[#ffba49]">Jihee Cho</span>
                  </h2>
                  {/* 아래 설명 문단은 요청대로 제거 */}
                </div>
              </div>

              {/* ABOUT + Profile 한 줄 */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* ABOUT */}
                <section className="lg:col-span-8 rounded-2xl bg-[#f5ebe0] border border-[#e3d5ca] px-6 py-6 sm:px-8 sm:py-7">
                  <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-stone-700 mb-3">
                    ABOUT
                  </h3>
                  <div className="text-sm sm:text-[15px] leading-7 text-stone-800 font-medium max-w-5xl space-y-4">
                    <p>
                      브랜드·리서치 데이터를 가지고 무엇을 결정할 수 있을지부터
                      생각합니다. 단순 지표 나열보다는, 실질적인 도움이 되는
                      인사이트를 도출하는 데 관심이 많습니다.
                    </p>
                    <p>
                      프로젝트를 할 때는 문제 정의 → 분석 설계 → 모델링 →
                      대시보드·리포트 → 자동화·도구화까지 한 흐름으로 묶어서
                      설계해 왔습니다. 반복해서 쓰이는 분석은 EXE·웹
                      대시보드·챗봇 등으로 제품화해서, 팀 내 누구나 다시 돌려볼
                      수 있는 형태로 남기고 있습니다.
                    </p>
                    <p>
                      최근에는 세그멘테이션, 수요 예측, 캠페인 효과 분석 같은
                      작업에 LLM·RAG를 결합해서, 분석 결과를 단순 보고서가 아니라
                      “질문하면 맥락을 설명해 주는 AI 서비스” 형태로 제작하는
                      실험을 하고 있습니다.
                    </p>
                  </div>
                </section>

                {/* Profile 카드 */}
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-sm">
                    <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                      <Image
                        src="/avatar.jpg"
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">
                      Jihee Cho
                    </h3>
                    <div className="text-sm font-bold text-[#8C5E35] mb-5">
                      Analytics · Build · LLM
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-stone-600 font-bold bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <IoLocationSharp className="text-lg text-stone-400" />{" "}
                        Seoul, South Korea
                      </div>
                      <a
                        href={`mailto:${LINKS.email}`}
                        className="flex items-center gap-3 text-sm text-stone-600 font-bold bg-stone-50 p-3 rounded-xl border border-stone-100 hover:bg-[#8C5E35] hover:text-white hover:border-[#8C5E35] transition"
                      >
                        <MdEmail className="text-lg" />
                        {LINKS.email}
                      </a>
                    </div>

                    <div className="flex gap-2 justify-center pt-2">
                      <SocialBtn href={LINKS.linkedin} icon={FaLinkedin} />
                      <SocialBtn href={LINKS.github} icon={FaGithub} />
                      <SocialBtn href={LINKS.hf} icon={SiHuggingface} />
                      <SocialBtn href={LINKS.velog} icon={SiVelog} />
                    </div>
                    <a
                      href={LINKS.resumePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 block w-full py-3 bg-[#8C5E35] text-white text-center text-sm font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>

              {/* Featured Projects – 넓은 화면에서 4개 가로 */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <h3 className="text-xl font-black text-stone-800">
                      Featured Projects
                    </h3>
                  </div>
                  <button
                    onClick={() => setTab("Projects")}
                    className="text-sm font-bold text-stone-500 hover:text-[#8C5E35] transition underline underline-offset-4"
                  >
                    View all
                  </button>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  {featured.slice(0, 4).map((p: any) => (
                    <ProjectCard key={p.slug} p={p} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === "Projects" && (
          <div className="bg-stone-200/60 pt-8 pb-10 px-0 rounded-b-xl border-t border-stone-200/50">
            <div className="space-y-8 px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-stone-900">
                  All Projects
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("All")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition border",
                      filter === "All"
                        ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                        : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]",
                    )}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={String(c)}
                      onClick={() => setFilter(c as Filter)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition border",
                        filter === c
                          ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                          : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]",
                      )}
                    >
                      {String(c)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((p: any) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INFO */}
        {tab === "Info" && (
          <div className="bg-stone-800 pt-8 pb-12 px-0 rounded-b-xl border-t border-stone-800">
            <div className="px-6 lg:px-10">
              {/* 위에 요약 카드 + 아바타 */}
              <div className="mb-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                  <FaQuoteLeft className="absolute top-6 left-6 text-white/5 text-6xl" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-white/20 shadow-md overflow-hidden shrink-0">
                      <Image
                        src="/avatar.jpg"
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-3">
                        Professional Summary
                      </h2>
                      <p className="text-stone-300 leading-8 text-base md:text-lg font-medium max-w-4xl">
                        데이터 분석과 시장조사 경험을 기반으로, 의사결정을 실질적으로
                        지원하는 결과물을 만듭니다.
                        <br />
                        요구사항을 문제 정의–분석 설계–모델링–시각화–리포팅까지 한
                        흐름으로 설계하고 구현해 왔습니다.
                        <br />
                        반복되는 분석 업무는 자동화·표준화하고, LLM 파인튜닝·배포 및
                        RAG 워크플로우 적용을 통해 분석을 서비스 형태로 확장하고
                        있습니다.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                    {SKILLS.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-stone-300 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-x-16 gap-y-12 grid-cols-1 lg:grid-cols-2">
                <InfoSection title="Education" icon={MdSchool} items={EDUCATION} />
                <InfoSection
                  title="Experience"
                  icon={MdWork}
                  items={EXPERIENCE}
                />
                <InfoSection
                  title="Licenses"
                  icon={MdEmojiEvents}
                  items={LICENSES}
                />
                <div className="lg:col-span-2">
                  <InfoSection
                    title="Awards & Honors"
                    icon={MdEmojiEvents}
                    items={AWARDS}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOARD */}
        {tab === "Board" && (
          <div className="bg-stone-100/80 pt-8 pb-10 px-0 rounded-b-xl border-t border-stone-200/50 min-h-[600px]">
            <div className="grid gap-10 px-6 lg:px-10 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm lg:sticky lg:top-8">
                  <h3 className="text-lg font-black text-stone-800 mb-4 flex items-center gap-2">
                    <FaPen className="text-[#8C5E35] text-sm" /> Write a Post
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      {["Guestbook", "Q&A"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setInputCategory(c as "Guestbook" | "Q&A")
                          }
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg border transition duration-300",
                            inputCategory === c
                              ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                              : "bg-stone-50 text-stone-500 border-stone-200 hover:border-[#8C5E35] hover:text-[#8C5E35]",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition"
                      placeholder="Your name"
                      required
                    />
                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition resize-none"
                      placeholder="Leave a message..."
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#8C5E35] text-white font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md duration-300"
                    >
                      Post Message
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-black text-stone-800 mb-4 flex items-center gap-2 border-b border-stone-200 pb-2">
                  <MdArticle className="text-[#8C5E35]" /> Recent Posts
                </h3>
                {loading ? (
                  <div className="py-20 text-center text-stone-400">
                    Loading...
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-4 items-center">
                        <div className="flex gap-3 items-center">
                          <FaUserCircle className="text-stone-300 text-3xl" />
                          <div>
                            <div className="font-bold text-stone-900">
                              {post.author}
                            </div>
                            <div className="text-xs text-stone-400">
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border",
                            post.category === "Q&A"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-[#8C5E35]/10 text-[#8C5E35] border-[#8C5E35]/20",
                          )}
                        >
                          {post.category}
                        </span>
                      </div>
                      <p className="text-sm text-stone-700 pl-11 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-10 pt-8 border-t border-stone-200 text-center text-xs font-medium text-stone-500">
        © {new Date().getFullYear()} Jihee Cho. All rights reserved.
      </footer>
    </div>
  );
}
