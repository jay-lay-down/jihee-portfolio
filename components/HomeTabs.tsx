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
import { MdEmail, MdArticle, MdSchool, MdWork, MdEmojiEvents } from "react-icons/md";
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
type Filter = "All" | "LLM" | "Segmentation" | "Bayesian" | "Forecasting" | "Other";
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

// 꽉 찬 탭 버튼
function FullWidthTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-4 text-base font-bold transition-all duration-300 border-b-[3px]",
        active
          ? "bg-stone-800 text-[#d4a373] border-[#d4a373]"
          : "bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200 hover:text-stone-600"
      )}
    >
      {label}
    </button>
  );
}

// 프로젝트 카드 (썸네일 없으면 그라데이션)
function ProjectCard({ p }: { p: any }) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full hover:border-[#d4a373]/50">
      {/* 썸네일 영역 */}
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
            {/* 부드러운 베이지 그라데이션 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#fef3c7,transparent_55%),radial-gradient(circle_at_100%_100%,#e5e7eb,transparent_55%),linear-gradient(135deg,#fdfcfb,#e5e7eb)]" />
            {/* 살짝 노이즈/쉐도우 느낌 */}
            <div className="absolute inset-0 mix-blend-multiply opacity-60 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.08),transparent_55%)]" />
            <div className="absolute bottom-3 left-4 text-xs font-bold text-stone-700/85">
              {String(p.category)} Project
            </div>
          </div>
        )}
      </div>

      {/* 내용 */}
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
function InfoSection({ title, icon: Icon, items }: { title: string; icon: any; items: InfoItem[] }) {
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
              {x.sub && <div className="text-sm text-stone-400 mt-1 font-medium">{x.sub}</div>}
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

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");
  const [isMobileView, setIsMobileView] = useState(false);

  // PC/모바일에 따라 컨테이너 폭 다르게
  const containerWidth = isMobileView
    ? "max-w-3xl"
    : "max-w-6xl xl:max-w-7xl";

  // --- Board ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<"Q&A" | "Guestbook">("Guestbook");

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (tab === "Board") fetchPosts();
  }, [tab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim()) return;
    const { error } = await supabase.from("guestbook").insert([
      { author: inputName, content: inputContent, category: inputCategory },
    ]);
    if (error) {
      alert("Error!");
    } else {
      setInputName("");
      setInputContent("");
      fetchPosts();
    }
  };

  // --- Projects 데이터 ---
  const featured = useMemo(() => PROJECTS.filter((p: any) => p.featured), []);
  const filteredProjects = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p: any) => p.category === filter)),
    [filter]
  );
  const categories = useMemo(
    () => Array.from(new Set(PROJECTS.map((p: any) => p.category))),
    []
  );

  // --- Static Info ---
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
    <div className="min-h-screen font-sans text-stone-800 pb-20">
      {/* 상단 헤더 */}
      <header
        className={cn(
          "py-10 flex flex-col sm:flex-row items-center justify-between gap-6 w-full mx-auto px-6 sm:px-0",
          containerWidth
        )}
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-stone-900">Jihee Cho</h1>
          {/* ➜ Analytics · LLM · Build 대신 생년/도시 */}
          <p className="text-base text-stone-500 font-bold mt-2">
            Jan.25.1991 / Seoul
          </p>
        </div>
        <button
          onClick={() => setIsMobileView((prev) => !prev)}
          className={cn(
            "text-xs font-bold border rounded-full px-4 py-2 transition duration-300",
            isMobileView
              ? "bg-[#8C5E35] text-white border-[#8C5E35]"
              : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]"
          )}
        >
          {isMobileView ? "📱 Mobile View (ON)" : "💻 PC View"}
        </button>
      </header>

      {/* 탭 내비 */}
      <nav
        className={cn(
          "flex w-full border border-stone-200 rounded-t-xl overflow-hidden shadow-sm mb-0 mx-auto",
          containerWidth
        )}
      >
        <FullWidthTab label="Home" active={tab === "Home"} onClick={() => setTab("Home")} />
        <FullWidthTab
          label="Projects"
          active={tab === "Projects"}
          onClick={() => setTab("Projects")}
        />
        <FullWidthTab label="Info" active={tab === "Info"} onClick={() => setTab("Info")} />
        <FullWidthTab label="Board" active={tab === "Board"} onClick={() => setTab("Board")} />
      </nav>

      {/* 메인 카드 */}
      <main
        className={cn(
          "animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl rounded-b-xl overflow-hidden mx-auto",
          containerWidth,
          "w-full"
        )}
      >
        {/* HOME */}
        {tab === "Home" && (
          <div className="bg-stone-100/80 pt-8 pb-12 px-6 sm:px-10 border-x border-b border-stone-200/50">
            <div className="space-y-10">
              {/* Hero */}
              <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/a2026.jpg" alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/60 to-black/85" />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-center text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold w-fit mb-5 border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Available for new projects
                  </div>
                  {/* ➜ 원래 느낌대로 Portfolio + 이름 */}
                  <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight drop-shadow-lg">
                    Portfolio
                    <span className="block text-[#ffba49]">Jihee Cho</span>
                  </h2>
                  <p className="text-white/90 text-sm sm:text-lg font-medium max-w-xl drop-shadow-md">
                    데이터 분석과 시장조사 경험을 기반으로,
                    <br />
                    의사결정을 실질적으로 지원하는 결과물을 만듭니다.
                  </p>
                </div>
              </div>

              {/* 바로 밑 자기소개 블록 (짙은 베이지) */}
              <section className="rounded-2xl bg-[#f5ebe0] border border-[#e3d5ca] px-6 py-6 sm:px-8 sm:py-7">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-stone-700 mb-2">
                  ABOUT
                </h3>
                <p className="text-sm sm:text-[15px] leading-7 text-stone-800 font-medium max-w-4xl">
                  브랜드·리서치 데이터를 가지고{" "}
                  <span className="font-bold">“무엇을 결정할 수 있는지”</span>
                  부터 생각합니다. 요구사항을 문제 정의 → 분석 설계 → 모델링 → 시각화/리포팅까지
                  한 흐름으로 묶어 설계하고, 반복 가능한 형태로 제품화하는 일을 좋아합니다.
                  LLM·RAG와 결합해서 분석을 서비스 형태로 노출하는 실험도 계속하고 있습니다.
                </p>
              </section>

              {/* Featured + 프로필 그리드 */}
              <div
                className={cn(
                  "grid gap-10",
                  isMobileView ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
                )}
              >
                {/* Featured */}
                <div className={cn(isMobileView ? "col-span-1" : "lg:col-span-8")}>
                  <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <h3 className="text-xl font-black text-stone-800">Featured Projects</h3>
                    </div>
                    <button
                      onClick={() => setTab("Projects")}
                      className="text-sm font-bold text-stone-500 hover:text-[#8C5E35] transition underline underline-offset-4"
                    >
                      View all
                    </button>
                  </div>
                  <div
                    className={cn(
                      "grid gap-6",
                      isMobileView ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                    )}
                  >
                    {featured.slice(0, 4).map((p: any) => (
                      <ProjectCard key={p.slug} p={p} />
                    ))}
                  </div>
                </div>

                {/* Profile 카드 */}
                <div className={cn(isMobileView ? "col-span-1" : "lg:col-span-4")}>
                  <div className="lg:sticky lg:top-8 bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-sm">
                    <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                      <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">Jihee Cho</h3>
                    <div className="text-sm font-bold text-[#8C5E35] mb-5">
                      Analytics · Build · LLM
                    </div>
                    <p className="text-sm text-stone-600 leading-7 font-medium mb-8">
                      기획–모델링–대시보드까지 하나의 스토리로 묶어서 설계하고, 누구나 다시
                      돌려볼 수 있는 형태의 분석 산출물을 만드는 데 관심이 있습니다.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-stone-600 font-bold bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <IoLocationSharp className="text-lg text-stone-400" /> Seoul, South Korea
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
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === "Projects" && (
          <div className="bg-stone-200/60 p-8 sm:p-10 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-stone-900">All Projects</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("All")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition border",
                      filter === "All"
                        ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                        : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]"
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
                          : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]"
                      )}
                    >
                      {String(c)}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "grid gap-8",
                  isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {filteredProjects.map((p: any) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INFO */}
        {tab === "Info" && (
          <div className="bg-stone-800 p-8 sm:p-12 rounded-b-xl min-h-[800px] border-x border-b border-stone-800">
            <div className="mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <FaQuoteLeft className="absolute top-6 left-6 text-white/5 text-6xl" />
                <h2 className="text-2xl font-black text-white mb-6 relative z-10">
                  Professional Summary
                </h2>
                <p className="text-stone-300 leading-9 text-lg font-medium relative z-10 max-w-4xl">
                  데이터 분석과 시장조사 경험을 기반으로, 의사결정을 실질적으로 지원하는 결과물을
                  만듭니다.
                  <br />
                  요구사항을 문제 정의–분석 설계–모델링–시각화–리포팅까지 한 흐름으로 설계하고
                  구현해 왔습니다.
                  <br />
                  반복되는 분석 업무는 자동화·표준화하고, LLM 파인튜닝·배포 및 RAG 워크플로우
                  적용을 통해 분석을 서비스 형태로 확장하고 있습니다.
                </p>
                <div className="mt-8 flex flex-wrap gap-2 relative z-10">
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

            <div
              className={cn(
                "grid gap-x-16 gap-y-12",
                isMobileView ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              )}
            >
              <InfoSection title="Education" icon={MdSchool} items={EDUCATION} />
              <InfoSection title="Experience" icon={MdWork} items={EXPERIENCE} />
              <div className={cn(isMobileView ? "col-span-1" : "lg:col-span-2")}>
                <InfoSection title="Awards & Honors" icon={MdEmojiEvents} items={AWARDS} />
              </div>
            </div>
          </div>
        )}

        {/* BOARD */}
        {tab === "Board" && (
          <div className="bg-stone-100/80 p-8 sm:p-10 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div
              className={cn(
                "grid gap-10",
                isMobileView ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
              )}
            >
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
                          onClick={() => setInputCategory(c as "Q&A" | "Guestbook")}
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg border transition duration-300",
                            inputCategory === c
                              ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                              : "bg-stone-50 text-stone-500 border-stone-200 hover:border-[#8C5E35] hover:text-[#8C5E35]"
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
                  <div className="py-20 text-center text-stone-400">Loading...</div>
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
                            <div className="font-bold text-stone-900">{post.author}</div>
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
                              : "bg-[#8C5E35]/10 text-[#8C5E35] border-[#8C5E35]/20"
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

      <footer className="mt-20 pt-8 border-t border-stone-200 text-center text-xs font-medium text-stone-500">
        © {new Date().getFullYear()} Jihee Cho. All rights reserved.
      </footer>
    </div>
  );
}
