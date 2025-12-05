"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, FormEvent, useCallback } from "react";
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
type TabKey = "Home" | "Projects" | "Board";
type ProjectCategory = (typeof PROJECTS)[number]["category"];
type Filter = "All" | ProjectCategory;

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

// 탭 버튼
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

// Home용 Info 섹션(라이트 톤)
function InfoSectionLight({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: InfoItem[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
        <Icon className="text-[#8C5E35] text-xl" />
        <h3 className="text-base font-black text-stone-900 tracking-wide">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((x, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-14 shrink-0 text-xs font-black text-stone-400 pt-1">
              {x.year ? x.year : "•"}
            </div>
            <div>
              <div className="text-sm font-bold text-stone-800">{x.label}</div>
              {x.sub && <div className="text-xs text-stone-500 mt-1 font-medium">{x.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");
  const [isMobileView, setIsMobileView] = useState(false);

  // --- Board ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<"Q&A" | "Guestbook">("Guestbook");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        alert("게시판을 불러오는 중 오류가 발생했어. (콘솔 로그 확인)");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      alert("네트워크 문제로 게시판을 불러오지 못했어. 잠시 후 다시 시도해줘.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "Board") void fetchPosts();
  }, [tab, fetchPosts]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim()) return;

    try {
      const { error }: { error: any } = await (supabase as any)
        .from("guestbook")
        .insert([{ author: inputName, content: inputContent, category: inputCategory }]);

      if (error) {
        console.error("Supabase insert error:", error);
        alert("게시글 저장 중 오류가 발생했어.");
        return;
      }

      setInputName("");
      setInputContent("");
      void fetchPosts();
    } catch (err) {
      console.error("Supabase insert exception:", err);
      alert("네트워크 오류로 게시글을 저장하지 못했어.");
    }
  };

  // --- Projects 데이터 ---
  const featured = useMemo(() => PROJECTS.filter((p: any) => p.featured), []);
  const categories = useMemo(() => {
    const set = new Set<ProjectCategory>();
    PROJECTS.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, []);

  const filteredProjects = useMemo(() => {
    return filter === "All" ? PROJECTS : PROJECTS.filter((p: any) => p.category === filter);
  }, [filter]);

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

  const LICENSES: InfoItem[] = [
    { label: "사회조사분석사 2급" },
    { label: "빅데이터분석기사" },
    { label: "데이터분석준전문가(AdsP)" },
    { label: "구글 애널리틱스(GAIQ)" },
  ];

  return (
    <div className="min-h-screen text-stone-800 pb-20 w-full">
      {/* 상단 헤더 */}
      <header className="py-10 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 w-full px-0">
        <div className="px-6 lg:px-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-stone-900">Jihee Cho</h1>
            <p className="text-sm text-stone-500 font-semibold mt-1">Jan.25.1991 / Seoul</p>
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
        </div>
      </header>

      {/* 탭 내비 */}
      <nav className="flex w-full border border-stone-200 rounded-t-xl overflow-hidden shadow-sm mb-0">
        <FullWidthTab label="Home" active={tab === "Home"} onClick={() => setTab("Home")} />
        <FullWidthTab
          label="Projects"
          active={tab === "Projects"}
          onClick={() => setTab("Projects")}
        />
        <FullWidthTab label="Board" active={tab === "Board"} onClick={() => setTab("Board")} />
      </nav>

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl rounded-b-xl overflow-hidden w-full">
        {/* HOME */}
        {tab === "Home" && (
          <div className="bg-stone-100/80 pt-8 pb-12 px-0 border-x border-b border-stone-200/50">
            <div className="space-y-10 px-6 lg:px-10">
              {/* Hero */}
              <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/a2026.jpg" alt="Hero" fill className="object-cover" priority />
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
                </div>
              </div>

              {/* Home 본문: 좌(콘텐츠) / 우(프로필) */}
              <div
                className={cn(
                  "grid gap-8 items-start",
                  isMobileView ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
                )}
              >
                {/* LEFT */}
                <div className={cn(isMobileView ? "col-span-1" : "lg:col-span-8", "space-y-8")}>
                  {/* ABOUT 블록 */}
                  <section className="rounded-2xl bg-[#f5ebe0] border border-[#e3d5ca] px-6 py-6 sm:px-8 sm:py-7">
                    <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-stone-700 mb-3">
                      ABOUT
                    </h3>

                    <div className="space-y-3 text-sm sm:text-[15px] leading-7 text-stone-800 font-medium max-w-5xl">
                      <p>
                        심리학을 베이스로 한 데이터 분석가로, 브랜드·리서치 데이터를 볼 때
                        &nbsp;“이 숫자로 무엇을 결정할 수 있을까?”부터 생각해요. 단순히 지표를
                        나열하기보다는, 실제 의사결정에 도움이 되는 인사이트를 정리하는 일을 더
                        중요하게 여깁니다.
                      </p>

                      <p>
                        프로젝트를 할 때는 기획 단계에서 문제를 정의하고, 조사·데이터 설계 →
                        모델링 → 대시보드·리포트까지 하나의 흐름으로 이어지도록 설계해 왔어요.
                        숫자 자체보다 “누가 이 결과를 어떻게 활용할지”를 상상하면서 구조를 짜는
                        편입니다.
                      </p>

                      <p>
                        반복해서 쓰이는 분석은 EXE 툴, 웹 대시보드, 챗봇 등으로 자동화·도구화해서
                        팀 누구나 다시 돌려볼 수 있는 형태로 남기고 있습니다. 최근에는 세그멘테이션,
                        수요 예측, 캠페인 효과 분석 같은 작업에 LLM·RAG를 결합해서, 단순 보고서가
                        아니라 질문하면 맥락을 설명해 주는 AI 서비스 형태로 만드는 실험을 하고 있어요.
                      </p>
                    </div>

                    {/* SKILLS 뱃지 */}
                    <div className="mt-6 border-t border-[#e3d5ca] pt-4">
                      <h4 className="text-xs sm:text-sm font-extrabold tracking-wide text-stone-700 mb-2">
                        SKILLS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Python",
                          "PyTorch",
                          "TensorFlow",
                          "R",
                          "SQL",
                          "Tableau",
                          "Hadoop",
                          "Excel",
                          "PowerPoint",
                          "Hugging Face",
                          "SPSS",
                        ].map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/70 text-stone-700 border border-[#e3d5ca] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* 학력/경력/수상/자격증: 2x2 그리드 */}
                  <section className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base sm:text-lg font-black text-stone-900">Info</h3>
                      <div className="text-xs text-stone-500 font-semibold">
                        (Home에 합쳐서 “휑함” 없앰)
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid gap-6",
                        isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                      )}
                    >
                      <InfoSectionLight title="Education" icon={MdSchool} items={EDUCATION} />
                      <InfoSectionLight title="Experience" icon={MdWork} items={EXPERIENCE} />
                      <InfoSectionLight title="Licenses" icon={MdEmojiEvents} items={LICENSES} />
                      <InfoSectionLight title="Awards" icon={MdEmojiEvents} items={AWARDS} />
                    </div>
                  </section>

                  {/* Featured Projects (있으면 홈에서 맛보기) */}
                  {featured.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-black text-stone-900">
                          Featured Projects
                        </h3>
                        <button
                          onClick={() => setTab("Projects")}
                          className="text-xs font-bold text-[#8C5E35] hover:underline"
                        >
                          View all →
                        </button>
                      </div>
                      <div
                        className={cn(
                          "grid gap-6",
                          isMobileView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                        )}
                      >
                        {featured.slice(0, 4).map((p: any) => (
                          <ProjectCard key={p.slug} p={p} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* RIGHT: Profile 카드 */}
                <div className={cn(isMobileView ? "col-span-1" : "lg:col-span-4")}>
                  <div className="lg:sticky lg:top-8 bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-sm">
                    <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                      <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                    </div>

                    <h3 className="text-2xl font-black text-stone-900">Jihee Cho</h3>
                    <div className="text-sm font-bold text-[#8C5E35] mb-5">
                      Analytics · Build · LLM
                    </div>

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
          <div className="bg-stone-200/60 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="space-y-8 px-6 lg:px-10">
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
                      onClick={() => setFilter(c)}
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

        {/* BOARD */}
        {tab === "Board" && (
          <div className="bg-stone-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div
              className={cn(
                "grid gap-10 px-6 lg:px-10",
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
                          onClick={() => setInputCategory(c as "Guestbook" | "Q&A")}
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
                      disabled={loading}
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
                ) : posts.length === 0 ? (
                  <div className="py-16 text-center text-stone-400">No posts yet.</div>
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
