"use client";

import Image from "next/image";
import { useMemo, useState, FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/app/projects/data";

// 아이콘
import { FaGithub, FaLinkedin, FaPen, FaTrash, FaUserCircle } from "react-icons/fa";
import { SiHuggingface, SiVelog } from "react-icons/si";
import { MdEmail, MdArticle } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

// --- 상수 및 데이터 ---
const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  linkedin: "https://www.linkedin.com/in/jihee-cho-767aa9260/",
  resumePdf: "/resume.pdf",
};

type TabKey = "Home" | "Projects" | "Info" | "Board";
type ProjectItem = (typeof PROJECTS)[number];
type CategoryKey = ProjectItem["category"];
type Filter = "All" | CategoryKey;

// --- 유틸리티 ---
function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function pickPrimaryLink(p: ProjectItem) {
  const anyP = p as any;
  return anyP.repo ?? anyP.demo ?? anyP.blog ?? `/projects/${anyP.slug}`;
}

// --- 게시판용 타입 및 더미 데이터 ---
type Post = {
  id: number;
  author: string;
  content: string;
  date: string;
  category: "Q&A" | "Guestbook" | "Contact";
};

// --- 컴포넌트들 ---

// 1. 탭 버튼 (파일철 스타일)
function FileTab({
  active,
  onClick,
  label,
  colorClass, // ex: "bg-blue-100 text-blue-900"
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  colorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 text-sm sm:text-base font-bold transition-all duration-200 rounded-t-2xl",
        active
          ? cn("shadow-sm ring-1 ring-black/5 z-10 translate-y-[1px]", colorClass) // 활성 상태
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700" // 비활성 상태
      )}
    >
      {label}
      {/* 활성 상태일 때 아래쪽 경계선을 가려서 연결된 느낌 주기 */}
      {active && (
        <div
          className={cn(
            "absolute bottom-[-2px] left-0 right-0 h-[4px]",
            colorClass
          )}
        />
      )}
    </button>
  );
}

// 2. 필터 버튼 (Projects 탭 내부)
function FilterPill({
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
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-bold transition border",
        active
          ? "bg-slate-800 text-white border-slate-800"
          : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
      )}
    >
      {children}
    </button>
  );
}

// 3. 소셜 아이콘 버튼
function SocialBtn({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 text-[#5C5046] hover:bg-black hover:text-white transition shadow-sm border border-transparent hover:border-black/10"
    >
      <Icon className="text-lg" />
    </a>
  );
}

// 4. 프로젝트 카드 & 썸네일
function Thumb({ slug, cover, label }: { slug: string; cover?: string; label: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-black/10 aspect-[16/10] bg-gray-50">
      {cover ? (
        <>
          <Image src={cover} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
      )}
    </div>
  );
}

function ProjectCard({ p }: { p: ProjectItem }) {
  const href = pickPrimaryLink(p);
  const anyP = p as any;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-400 hover:shadow-md transition"
    >
      <div className="flex flex-col gap-4">
        <Thumb slug={anyP.slug} cover={anyP.cover} label={anyP.title} />
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase">{String(p.category)}</div>
          <div className="mt-1 text-lg font-black text-slate-900 group-hover:text-blue-600 transition">
            {anyP.title}
          </div>
          <div className="mt-2 text-sm text-slate-600 line-clamp-2">{anyP.oneLiner}</div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(Array.isArray(anyP.stack) ? anyP.stack : []).slice(0, 5).map((s: string) => (
              <span key={s} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

// 5. Featured Tile (Home 탭용)
function FeaturedTile({ p }: { p: ProjectItem }) {
  const href = pickPrimaryLink(p);
  const anyP = p as any;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition hover:shadow-md"
    >
      <div className="p-5 flex-1">
        <div className="text-xs font-bold text-slate-500 mb-1">{String(p.category)}</div>
        <div className="text-lg font-black text-slate-900 leading-tight mb-2">{anyP.title}</div>
        <p className="text-sm text-slate-600 line-clamp-2">{anyP.oneLiner}</p>
      </div>
      <div className="px-5 pb-5">
         <Thumb slug={anyP.slug} cover={anyP.cover} label={anyP.title} />
      </div>
    </a>
  );
}

// 6. Info Block
function InfoBlock({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
        {title}
      </div>
      <div className="space-y-4">
        {items.map((x, i) => (
          <div key={`${title}-${i}`} className="flex gap-4">
            <div className="w-12 shrink-0 text-xs font-bold text-slate-400 pt-1">
              {x.year ? x.year : "•"}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{x.label}</div>
              {x.sub && <div className="text-xs text-slate-500 mt-0.5">{x.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** -----------------------------------------
 * MAIN PAGE COMPONENT
 * ----------------------------------------- */
export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");
  const [isMobileView, setIsMobileView] = useState(false);

  // --- Board State ---
  const [posts, setPosts] = useState<Post[]>([
    { id: 2, author: "Visitor", content: "LLM 파인튜닝 관련해서 문의드려도 될까요?", date: "2025.12.04", category: "Q&A" },
    { id: 1, author: "Jihee", content: "포트폴리오 사이트 오픈했습니다! 자유롭게 글 남겨주세요 :)", date: "2025.12.01", category: "Guestbook" },
  ]);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<"Q&A" | "Guestbook">("Guestbook");

  // --- 게시글 등록 핸들러 ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: inputName,
      content: inputContent,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      category: inputCategory,
    };

    setPosts([newPost, ...posts]); // 최신글이 위로
    setInputName("");
    setInputContent("");
  };

  // --- 데이터 필터링 ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of PROJECTS) set.add(String(p.category));
    return Array.from(set) as CategoryKey[];
  }, []);

  const featured = useMemo(() => PROJECTS.filter((p) => (p as any).featured).slice(0, 4), []);

  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  // --- 데이터셋 ---
  const EDUCATION = [
    { label: "서울여자대학교 일반대학원", sub: "아동심리학 전공 (석사)" },
    { label: "서울여자대학교", sub: "아동학과 (학사)" },
  ];
  const EXPERIENCE = [
    { label: "Kantar Korea", sub: "Analytics" },
    { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
    { label: "Macromill Embrain", sub: "리서치 1부서 3팀" },
    { label: "MnM Research", sub: "연구사업본부" },
    { label: "서울대학교병원", sub: "소아정신과 의생명연구원" },
  ];
  const AWARDS = [
    { year: 2024, label: "3Q Night Out in Town" },
    { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
    { year: 2018, label: "KCI 등재 학술지 제1저자(논문)" },
    { year: 2016, label: "한국장학재단 우수연구계획서 선정" },
  ].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-20">
      
      {/* 1. Header (Clean) */}
      <header className="py-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Jihee Cho</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">Analytics · LLM · Build</p>
        </div>
        
        {/* Mobile View Toggle */}
        <button
          onClick={() => setIsMobileView((prev) => !prev)}
          className="text-xs font-bold text-slate-400 hover:text-slate-800 border border-slate-200 rounded-full px-3 py-1.5 transition"
        >
          {isMobileView ? "💻 PC View" : "📱 Mobile View"}
        </button>
      </header>

      {/* 2. Navigation Tabs (Folder Style) */}
      <nav className="flex items-end gap-1 sm:gap-2 border-b-2 border-slate-100 mb-8 overflow-x-auto">
        <FileTab 
          label="Home" 
          active={tab === "Home"} 
          onClick={() => setTab("Home")} 
          colorClass="bg-slate-800 text-white" 
        />
        <FileTab 
          label="Projects" 
          active={tab === "Projects"} 
          onClick={() => setTab("Projects")} 
          colorClass="bg-indigo-100 text-indigo-900" 
        />
        <FileTab 
          label="Info" 
          active={tab === "Info"} 
          onClick={() => setTab("Info")} 
          colorClass="bg-emerald-100 text-emerald-900" 
        />
        <FileTab 
          label="Board" 
          active={tab === "Board"} 
          onClick={() => setTab("Board")} 
          colorClass="bg-amber-100 text-amber-900" 
        />
      </nav>

      {/* 3. Main Content Area */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* --- HOME TAB --- */}
        {tab === "Home" && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-lg">
              <Image src="/a2026.jpg" alt="Hero" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold w-fit mb-4 border border-white/30">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                  Available for new projects
                </div>
                <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
                  Data Driven, <br/> Decision Ready.
                </h2>
                <p className="text-white/80 max-w-lg leading-relaxed text-sm sm:text-base">
                  데이터 분석과 시장조사를 바탕으로, 의사결정을 실질적으로 지원하는 결과물을 만듭니다.
                </p>
              </div>
            </div>

            {/* Featured & Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Projects */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🔥 Featured Projects
                  </h3>
                  <button onClick={() => setTab("Projects")} className="text-sm font-bold text-slate-400 hover:text-slate-800 underline">View all</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featured.map((p) => <FeaturedTile key={(p as any).slug} p={p} />)}
                </div>
              </div>

              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-[#F4F0EB] rounded-3xl p-6 sm:p-8 border border-[#E6E0D8]">
                  <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-sm mb-4 overflow-hidden mx-auto sm:mx-0">
                    <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-[#4A4036]">Jihee Cho</h3>
                  <div className="text-sm font-bold text-[#8C8070] mb-4">Analytics · Build · LLM</div>
                  <p className="text-sm text-[#5C5046] leading-relaxed mb-6 font-medium">
                    "I specialize in designing and implementing the entire workflow—from planning to modeling and visualization—as a cohesive story."
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#5C5046] font-bold bg-white/50 p-3 rounded-xl">
                      <IoLocationSharp className="text-lg opacity-50" />
                      Seoul, South Korea
                    </div>
                    <a href={`mailto:${LINKS.email}`} className="flex items-center gap-3 text-sm text-[#5C5046] font-bold bg-white/50 p-3 rounded-xl hover:bg-white transition">
                      <MdEmail className="text-lg opacity-50" />
                      {LINKS.email}
                    </a>
                  </div>

                  <div className="flex justify-center gap-3 border-t border-[#DCD6CC] pt-6">
                    <SocialBtn href={LINKS.linkedin} icon={FaLinkedin} />
                    <SocialBtn href={LINKS.github} icon={FaGithub} />
                    <SocialBtn href={LINKS.hf} icon={SiHuggingface} />
                    <SocialBtn href={LINKS.velog} icon={SiVelog} />
                  </div>
                  <a href={LINKS.resumePdf} target="_blank" className="mt-4 block w-full py-3 bg-[#3E342B] text-[#E6DCCF] text-center text-sm font-bold rounded-xl hover:opacity-90 transition">
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {tab === "Projects" && (
          <div className="bg-indigo-50/50 min-h-[500px] p-6 sm:p-8 rounded-3xl rounded-tl-none border border-indigo-100">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black text-indigo-900">All Projects</h2>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={filter === "All"} onClick={() => setFilter("All")}>All</FilterPill>
                  {categories.map((c) => (
                    <FilterPill key={c} active={filter === c} onClick={() => setFilter(c)}>{String(c)}</FilterPill>
                  ))}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((p) => <ProjectCard key={(p as any).slug} p={p} />)}
             </div>
          </div>
        )}

        {/* --- INFO TAB --- */}
        {tab === "Info" && (
          <div className="bg-emerald-50/50 min-h-[500px] p-6 sm:p-8 rounded-3xl rounded-tl-none border border-emerald-100">
             <h2 className="text-2xl font-black text-emerald-900 mb-8">Curriculum Vitae</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoBlock title="Education" items={EDUCATION} />
                <InfoBlock title="Experience" items={EXPERIENCE} />
                <div className="lg:col-span-2">
                  <InfoBlock title="Awards & Honors" items={AWARDS} />
                </div>
             </div>
          </div>
        )}

        {/* --- BOARD TAB (Q&A / Guestbook) --- */}
        {tab === "Board" && (
          <div className="bg-amber-50/50 min-h-[600px] p-6 sm:p-10 rounded-3xl rounded-tl-none border border-amber-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* 왼쪽: 글쓰기 폼 */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm sticky top-8">
                  <h3 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
                    <FaPen className="text-sm" /> Write a Post
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                      <div className="flex gap-2">
                        {["Guestbook", "Q&A"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setInputCategory(c as any)}
                            className={cn(
                              "flex-1 py-2 text-xs font-bold rounded-lg border",
                              inputCategory === c 
                                ? "bg-amber-100 text-amber-800 border-amber-200" 
                                : "bg-slate-50 text-slate-400 border-slate-100"
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Message</label>
                      <textarea 
                        value={inputContent}
                        onChange={(e) => setInputContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                        placeholder="Leave a message..."
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 bg-amber-900 text-amber-50 font-bold rounded-xl hover:bg-amber-800 transition shadow-md"
                    >
                      Post Message
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      * DB 연결 전이므로 새로고침 시 초기화됩니다.
                    </p>
                  </form>
                </div>
              </div>

              {/* 오른쪽: 게시글 목록 */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-black text-amber-900 mb-2 flex items-center gap-2">
                  <MdArticle /> Recent Posts ({posts.length})
                </h3>
                
                {posts.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-medium">
                    첫 번째 글을 남겨주세요! 👋
                  </div>
                ) : (
                  posts.map((post) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={post.id} 
                      className="bg-white p-5 rounded-2xl border border-amber-100/50 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <FaUserCircle />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{post.author}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{post.date}</div>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide",
                          post.category === "Q&A" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                        )}>
                          {post.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-10">
                        {post.content}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} Jihee Cho. All rights reserved.
      </footer>
    </div>
  );
}
