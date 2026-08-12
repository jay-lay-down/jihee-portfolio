"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  useEffect,
  FormEvent,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { PROJECTS } from "@/app/projects/data";
import { supabase } from "@/lib/supabase";

// 마크다운 (Case Studies용)
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 아이콘
import {
  FaGithub,
  FaLinkedin,
  FaPen,
  FaUserCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import { SiHuggingface, SiVelog } from "react-icons/si";
import {
  MdEmail,
  MdArticle,
  MdSchool,
  MdWork,
  MdEmojiEvents,
  MdEdit,
  MdSave,
  MdCancel,
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

const ABOUT_SKILLS = [
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
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "Supabase",
  "Database",
];

const PAGE_SIZE = 10;

// Featured 프로젝트 slug 순서
const FEATURED_SLUGS = [
  "geo-ai-writing",
  "ddolbae",
  "animal-test",
  "auto-segment-tool",
  "bayesian-dashboard",
  "demand-forecasting",
  "employee-engagement",
];

// --- 언어 ---
export type Lang = "ko" | "en";

const T = {
  en: {
    available: "Available for new projects",
    aboutTitle: "ABOUT",
    aboutP1:
      'I am a researcher and analytics practitioner with a foundation in psychology, and when I look at brand or research data, I start by asking, "What decision can this number help someone make?" I care less about listing metrics for their own sake and more about turning them into insight that helps real people act.',
    aboutP2:
      "My strength is building an end-to-end flow from problem definition to research design, data design, modeling, and finally dashboards or reports. I design around how the output will actually be used, not just how it looks on paper.",
    aboutP3:
      "More recently, I have been combining LLM and RAG approaches with work such as segmentation, demand forecasting, and campaign-effect analysis so the result is not just a report, but an AI-based service that can explain the context behind the answer.",
    education: "Education",
    experience: "Experience",
    awards: "Awards",
    licenses: "Licenses",
    birthCity: "Jan 25, 1991 / Seoul",
    role: "Research · Analytics · AI",
    location: "Seoul, South Korea",
    skills: "SKILLS",
    downloadResume: "Download Resume",
    featuredProjects: "Featured Projects",
    viewAll: "View all →",
    allProjects: "All Projects",
    ndaNote: "Ongoing client projects are not published on this site for confidentiality. Client names in finished case studies are masked.",
    filterAll: "All",
    caseStudies: "Case Studies",
    caseStudiesSub: "Detailed project write-ups with Markdown support",
    loading: "Loading...",
    openFullPage: "Open full page →",
    writePost: "Write a Post",
    yourName: "Your name",
    leaveMessage: "Leave a message...",
    postPassword: "Password (for edit/delete)",
    board: "Board",
    noPosts: "No posts yet.",
    sections: "sections",
  },
  ko: {
    available: "새 프로젝트 문의 환영",
    aboutTitle: "소개",
    aboutP1:
      "심리학을 기반으로 한 리서처이자 데이터 분석 실무자입니다. 브랜드·리서치 데이터를 볼 때 \"이 숫자가 누구의 어떤 의사결정을 도울 수 있을까?\"부터 묻습니다. 지표를 나열하는 것보다, 실제로 사람이 움직일 수 있는 인사이트로 바꾸는 일에 집중합니다.",
    aboutP2:
      "문제 정의부터 조사 설계, 데이터 설계, 모델링, 그리고 대시보드·리포트까지 이어지는 End-to-End 흐름을 만드는 것이 강점입니다. 보기 좋은 산출물이 아니라, 실제로 어떻게 쓰일지를 중심에 두고 설계합니다.",
    aboutP3:
      "최근에는 세그먼테이션, 수요예측, 캠페인 효과 분석 같은 업무에 LLM·RAG 접근을 결합해, 단순한 리포트가 아니라 답의 맥락까지 설명해 주는 AI 기반 서비스로 만드는 작업을 하고 있습니다.",
    education: "학력",
    experience: "경력",
    awards: "수상",
    licenses: "자격증",
    birthCity: "1991.01.25 / 서울",
    role: "리서치 · 데이터 분석 · AI",
    location: "대한민국 서울",
    skills: "스킬",
    downloadResume: "이력서 다운로드",
    featuredProjects: "대표 프로젝트",
    viewAll: "전체 보기 →",
    allProjects: "전체 프로젝트",
    ndaNote: "진행 중인 클라이언트 프로젝트는 비밀유지를 위해 웹에 공개하지 않으며, 종료된 프로젝트도 고객사명은 마스킹합니다.",
    filterAll: "전체",
    caseStudies: "케이스 스터디",
    caseStudiesSub: "프로젝트별 상세 정리 (Markdown 지원)",
    loading: "불러오는 중...",
    openFullPage: "전체 페이지 열기 →",
    writePost: "글 남기기",
    yourName: "이름",
    leaveMessage: "메시지를 남겨주세요...",
    postPassword: "비밀번호 (수정/삭제용)",
    board: "방명록",
    noPosts: "아직 글이 없어요.",
    sections: "개 섹션",
  },
} as const;

// --- 타입 ---
type TabKey = "Home" | "Projects" | "CaseStudies" | "Board";
type ProjectCategory = (typeof PROJECTS)[number]["category"];
type Filter = "All" | ProjectCategory;

type PostCategory = "Q&A" | "Guestbook";
type BoardFilter = "All" | PostCategory;

type Post = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  category: PostCategory;
};

type ProjectDetail = {
  id: number;
  slug: string;
  section_title: string;
  content: string;
  image_url: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
};

type InfoItem = { year?: number; label: string; sub?: string };

// --- 유틸 ---
function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

// ✅ 상단 텍스트형 네비게이션
function TopNav({
  tab,
  setTab,
  lang,
  onLang,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  const NavBtn = ({ k, label }: { k: TabKey; label: string }) => (
    <button
      type="button"
      onClick={() => setTab(k)}
      className={cn(
        "relative px-2 py-2 text-[13px] sm:text-[15px] md:text-base font-extrabold tracking-wide transition",
        tab === k ? "text-stone-900" : "text-stone-400 hover:text-stone-700"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition",
          tab === k ? "bg-[#8C5E35]" : "bg-transparent"
        )}
      />
    </button>
  );

  const IconLink = ({
    href,
    label,
    children,
  }: {
    href: string;
    label: string;
    children: ReactNode;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-11 h-11 rounded-full text-stone-500 hover:text-[#8C5E35] hover:bg-stone-100 transition"
    >
      {children}
    </a>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur border-b border-stone-200">
      <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <NavBtn k="Home" label="HOME" />
          <NavBtn k="Projects" label="PROJECTS" />
          <NavBtn k="CaseStudies" label="CASE STUDIES" />
          <NavBtn k="Board" label="BOARD" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center rounded-full border border-stone-300 overflow-hidden">
            {(["ko", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLang(l)}
                className={cn(
                  "px-3 py-1.5 text-xs font-black transition",
                  lang === l ? "bg-[#8C5E35] text-white" : "bg-white text-stone-500 hover:text-[#8C5E35]"
                )}
              >
                {l === "ko" ? "한국어" : "EN"}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1">
          <IconLink href={LINKS.linkedin} label="LinkedIn">
            <FaLinkedin className="text-[22px]" />
          </IconLink>
          <IconLink href={LINKS.github} label="GitHub">
            <FaGithub className="text-[22px]" />
          </IconLink>
          <IconLink href={LINKS.hf} label="Hugging Face">
            <SiHuggingface className="text-[22px]" />
          </IconLink>
          <IconLink href={LINKS.velog} label="Velog">
            <SiVelog className="text-[22px]" />
          </IconLink>
          <IconLink href={LINKS.resumePdf} label="Resume PDF">
            <FaDownload className="text-[20px]" />
          </IconLink>
          <IconLink href={`mailto:${LINKS.email}`} label="Email">
            <MdEmail className="text-[22px]" />
          </IconLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로젝트 카드 (클릭 가능)
function ProjectCard({ p, onClick, lang = "ko" }: { p: any; onClick?: () => void; lang?: Lang }) {
  return (
    <div
      className={cn(
        "group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full hover:border-[#d4a373]/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
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
          {onClick && (
            <FaChevronRight className="text-stone-300 group-hover:text-[#8C5E35] transition text-sm" />
          )}
        </div>

        <h3 className="text-lg font-black text-stone-900 leading-tight mb-3 group-hover:text-[#8C5E35] transition">
          {lang === "ko" && p.titleKo ? p.titleKo : p.title}
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-2">
          {lang === "ko" && p.oneLinerKo ? p.oneLinerKo : p.oneLiner}
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

        <div
          className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-stone-100"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.isArray(p.links) &&
            p.links.map((link: any) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 text-stone-600 hover:bg-[#8C5E35] hover:text-white hover:border-[#8C5E35] transition-colors duration-300"
              >
                {link.label === "Download" ? (
                  <FaDownload />
                ) : (
                  <FaExternalLinkAlt />
                )}
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

// ABOUT 아래 "작은 Info 카드"
function MiniInfoCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: InfoItem[];
}) {
  return (
    <div className="rounded-xl bg-white/70 border border-[#e3d5ca] px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="text-[#8C5E35]" />
        <div className="text-xs font-black text-stone-800">{title}</div>
      </div>

      <div className="mt-2 space-y-2">
        {items.map((x, i) => (
          <div
            key={i}
            className="text-[12px] leading-4 text-stone-600 font-medium"
          >
            <div className="flex gap-2">
              {x.year ? (
                <span className="font-extrabold text-stone-700 shrink-0">
                  {x.year}
                </span>
              ) : null}
              <span className="font-bold text-stone-700">{x.label}</span>
            </div>
            {x.sub ? (
              <div className="text-[12px] text-stone-500 mt-0.5">{x.sub}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export type CaseStudyHtml = { en: string; ko: string | null };

export default function HomeTabs({
  caseStudies = {},
}: {
  caseStudies?: Record<string, CaseStudyHtml>;
}) {
  const [lang, setLang] = useState<Lang>("ko");
  useEffect(() => {
    const saved = window.localStorage.getItem("site-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  const switchLang = (l: Lang) => {
    setLang(l);
    try {
      window.localStorage.setItem("site-lang", l);
    } catch {}
  };
  const t = T[lang];
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");

  // Case Studies - 선택된 프로젝트 slug
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- Board ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<PostCategory>("Guestbook");
  const [inputPassword, setInputPassword] = useState("");

  const [pwById, setPwById] = useState<Record<number, string>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [boardFilter, setBoardFilter] = useState<BoardFilter>("All");
  const [page, setPage] = useState(1);

  // --- Case Studies (project_details) ---
  const [projectDetails, setProjectDetails] = useState<ProjectDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // 새 섹션 작성
  const [newSlug, setNewSlug] = useState(FEATURED_SLUGS[0]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // 편집 모드
  const [detailEditId, setDetailEditId] = useState<number | null>(null);
  const [detailEditTitle, setDetailEditTitle] = useState("");
  const [detailEditContent, setDetailEditContent] = useState("");
  const [detailEditImageUrl, setDetailEditImageUrl] = useState("");
  const [detailEditPassword, setDetailEditPassword] = useState("");

  // Featured 카드 클릭 → Case Studies 탭 이동 + 스크롤
  const handleFeaturedClick = (slug: string) => {
    setSelectedSlug(slug);
    setTab("CaseStudies");
    setTimeout(() => {
      const el = detailRefs.current[slug];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  // --- Fetch Board Posts ---
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("guestbook")
        .select("id, author, content, created_at, updated_at, category")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fetch Project Details ---
  const fetchProjectDetails = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("project_details")
        .select("*")
        .order("order_num", { ascending: true });

      if (error) {
        console.error("Fetch project_details error:", error);
        setProjectDetails([]);
      } else {
        setProjectDetails(data || []);
      }
    } catch (err) {
      console.error("Fetch project_details exception:", err);
      setProjectDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "Board") void fetchPosts();
    if (tab === "CaseStudies") void fetchProjectDetails();
  }, [tab, fetchPosts, fetchProjectDetails]);

  useEffect(() => {
    setPage(1);
  }, [boardFilter]);

  const filteredPosts = useMemo(() => {
    if (boardFilter === "All") return posts;
    return posts.filter((p) => p.category === boardFilter);
  }, [posts, boardFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pagePosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, page]);

  const getPw = (id: number) => pwById[id] || "";
  const setPw = (id: number, v: string) =>
    setPwById((prev) => ({ ...prev, [id]: v }));
  const clearPw = (id: number) =>
    setPwById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  // --- Board CRUD ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim() || !inputPassword.trim())
      return;

    setLoading(true);
    try {
      const { error } = await (supabase as any).rpc("guestbook_create_post", {
        p_author: inputName,
        p_content: inputContent,
        p_category: inputCategory,
        p_password: inputPassword,
      });

      if (error) {
        console.error("RPC create error:", error);
        alert("An error occurred while saving the post.");
        return;
      }

      setInputName("");
      setInputContent("");
      setInputPassword("");
      void fetchPosts();
    } catch (err) {
      console.error("RPC create exception:", err);
      alert("The post could not be saved because of a network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: Post) => {
    const pw = getPw(post.id).trim();
    if (!pw) return alert("Please enter the password.");

    try {
      const { data, error } = await (supabase as any).rpc(
        "guestbook_delete_post",
        { p_id: post.id, p_password: pw }
      );

      if (error) {
        console.error("RPC delete error:", error);
        alert("An error occurred while deleting the post.");
        return;
      }

      if (data !== true) {
        alert("The password is incorrect or the post no longer exists.");
        return;
      }

      clearPw(post.id);
      void fetchPosts();
    } catch (err) {
      console.error("RPC delete exception:", err);
      alert("The post could not be deleted because of a network error.");
    }
  };

  const handleUpdate = async (post: Post) => {
    const pw = getPw(post.id).trim();
    if (!pw) return alert("Please enter the password.");

    const next = editContent.trim();
    if (!next) return alert("The content cannot be empty.");

    try {
      const { data, error } = await (supabase as any).rpc(
        "guestbook_update_post",
        { p_id: post.id, p_password: pw, p_content: next }
      );

      if (error) {
        console.error("RPC update error:", error);
        alert("An error occurred while updating the post.");
        return;
      }

      if (data !== true) {
        alert("The password is incorrect or the post no longer exists.");
        return;
      }

      setEditId(null);
      setEditContent("");
      clearPw(post.id);
      void fetchPosts();
    } catch (err) {
      console.error("RPC update exception:", err);
      alert("The post could not be updated because of a network error.");
    }
  };

  // --- Case Studies CRUD ---
  const handleAddDetail = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !adminPassword.trim()) {
      alert("Please enter a title, content, and password.");
      return;
    }

    try {
      const { error } = await (supabase as any).rpc("project_detail_create", {
        p_slug: newSlug,
        p_section_title: newTitle,
        p_content: newContent,
        p_image_url: newImageUrl || null,
        p_order_num: projectDetails.filter((d) => d.slug === newSlug).length + 1,
        p_password: adminPassword,
      });

      if (error) {
        console.error("Create detail error:", error);
        alert("An error occurred while adding the section.");
        return;
      }

      setNewTitle("");
      setNewContent("");
      setNewImageUrl("");
      setAdminPassword("");
      fetchProjectDetails();
    } catch (err) {
      console.error("Create detail exception:", err);
      alert("The section could not be added because of a network error.");
    }
  };

  const handleUpdateDetail = async (id: number) => {
    if (!detailEditTitle.trim() || !detailEditContent.trim() || !detailEditPassword.trim()) {
      alert("Please enter a title, content, and password.");
      return;
    }

    try {
      const { data, error } = await (supabase as any).rpc("project_detail_update", {
        p_id: id,
        p_password: detailEditPassword,
        p_section_title: detailEditTitle,
        p_content: detailEditContent,
        p_image_url: detailEditImageUrl || null,
      });

      if (error) {
        console.error("Update detail error:", error);
        alert("An error occurred while updating the section.");
        return;
      }

      if (data === false) {
        alert("The password is incorrect.");
        return;
      }

      setDetailEditId(null);
      setDetailEditTitle("");
      setDetailEditContent("");
      setDetailEditImageUrl("");
      setDetailEditPassword("");
      fetchProjectDetails();
    } catch (err) {
      console.error("Update detail exception:", err);
      alert("The section could not be updated because of a network error.");
    }
  };

  const handleDeleteDetail = async (id: number) => {
    const pw = prompt("Enter the password to delete this section:");
    if (!pw) return;

    try {
      const { data, error } = await (supabase as any).rpc("project_detail_delete", {
        p_id: id,
        p_password: pw,
      });

      if (error) {
        console.error("Delete detail error:", error);
        alert("An error occurred while deleting the section.");
        return;
      }

      if (data === false) {
        alert("The password is incorrect.");
        return;
      }

      fetchProjectDetails();
    } catch (err) {
      console.error("Delete detail exception:", err);
      alert("The section could not be deleted because of a network error.");
    }
  };

  // --- Projects 데이터 ---
  const featured = useMemo(() => {
    return FEATURED_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(PROJECTS.map((p: any) => p.category))) as ProjectCategory[],
    []
  );

  const filteredProjects = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p: any) => p.category === filter)),
    [filter]
  );

  // slug로 프로젝트 찾기
  const getProjectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

  // slug별 상세 섹션들
  const getDetailsBySlug = (slug: string) => projectDetails.filter((d) => d.slug === slug);

  // --- Static Info ---
  const EDUCATION: InfoItem[] =
    lang === "ko"
      ? [
          { label: "서울여자대학교 대학원", sub: "아동심리학 석사" },
          { label: "서울여자대학교", sub: "아동학 학사" },
        ]
      : [
          { label: "Seoul Women's University Graduate School", sub: "M.A. in Child Psychology" },
          { label: "Seoul Women's University", sub: "B.A. in Child Studies" },
        ];
  const EXPERIENCE: InfoItem[] =
    lang === "ko"
      ? [
          { label: "칸타코리아", sub: "Analytics" },
          { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
          { label: "마크로밀엠브레인", sub: "리서치 1부서 3팀" },
          { label: "엠앤엠리서치", sub: "연구사업본부" },
          { label: "서울대학교병원", sub: "의생명연구원 소아정신과" },
        ]
      : [
          { label: "Kantar Korea", sub: "Analytics" },
          { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
          { label: "Macromill Embrain", sub: "Research Division 1, Team 3" },
          { label: "MnM Research", sub: "Research Business Division" },
          { label: "Seoul National University Hospital", sub: "Biomedical Research Institute, Child Psychiatry" },
        ];
  const AWARDS: InfoItem[] =
    lang === "ko"
      ? [
          { year: 2024, label: "3분기 우수사원상" },
          { year: 2024, label: "고객사 NPS 조사 10점 만점 달성" },
          { year: 2021, label: "인적자원위원회 최우수 보고서 선정" },
          { year: 2018, label: "KCI 등재 학술지 제1저자 논문 게재" },
          { year: 2016, label: "한국장학재단 우수 연구계획서 선정" },
        ]
      : [
          { year: 2024, label: "3Q Night Out in Town" },
          { year: 2024, label: "Achieved a perfect 10/10 on a client NPS study" },
          { year: 2021, label: "Selected for Best Report by the Human Resources Committee" },
          { year: 2018, label: "First author publication in a KCI-indexed journal" },
          { year: 2016, label: "Selected for an Outstanding Research Proposal by the Korea Student Aid Foundation" },
        ];
  const LICENSES: InfoItem[] =
    lang === "ko"
      ? [
          { label: "사회조사분석사 2급" },
          { label: "빅데이터분석기사" },
          { label: "데이터분석준전문가 (ADsP)" },
          { label: "Google Analytics Individual Qualification (GAIQ)" },
        ]
      : [
          { label: "Certified Social Research Analyst, Level 2" },
          { label: "Engineer Big Data Analysis" },
          { label: "ADsP: Advanced Data Analytics Semi-Professional" },
          { label: "Google Analytics Individual Qualification (GAIQ)" },
        ];

  return (
    <div className="min-h-screen text-stone-800 pb-20 w-full px-3 sm:px-4">
      <TopNav tab={tab} setTab={setTab} lang={lang} onLang={switchLang} />

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl rounded-b-xl overflow-hidden w-full">
        {/* ========== HOME ========== */}
        {tab === "Home" && (
          <div className="bg-stone-100/80 pt-0 pb-12 px-0 border-x border-b border-stone-200/50">
            <div className="space-y-10 px-6 lg:px-10">
              <div className="relative mt-0 w-full h-[410px] md:h-[480px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/a2026.jpg" alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/55 to-black/80" />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-center text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold w-fit mb-5 border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {t.available}
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-0 leading-tight drop-shadow-lg">
                    Portfolio
                    <br />
                    <span className="text-[#ffba49]">Jihee Cho</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid gap-8 items-stretch grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8 space-y-8">
                    <section className="h-full rounded-2xl bg-[#f5ebe0]/60 border border-[#e3d5ca] px-6 py-6 sm:px-8 sm:py-7">
                      <h3 className="text-sm font-extrabold tracking-wide text-stone-700 mb-3">{t.aboutTitle}</h3>

                      <div className="space-y-3 text-[16px] leading-8 text-stone-800 font-medium max-w-5xl break-keep">
                        <p>{t.aboutP1}</p>
                        <p>{t.aboutP2}</p>
                        <p>{t.aboutP3}</p>
                      </div>

                      <div className="mt-6 border-t border-stone-200 pt-4">
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                          <MiniInfoCard title={t.education} icon={MdSchool} items={EDUCATION} />
                          <MiniInfoCard title={t.experience} icon={MdWork} items={EXPERIENCE} />
                          <MiniInfoCard title={t.awards} icon={MdEmojiEvents} items={AWARDS} />
                          <MiniInfoCard title={t.licenses} icon={MdEmojiEvents} items={LICENSES} />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-20 bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-sm h-full">
                      <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                        <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                      </div>

                      <h3 className="text-2xl font-black text-stone-900">Jihee Cho</h3>
                      <div className="text-sm font-bold text-stone-500 mt-1">{t.birthCity}</div>
                      <div className="text-sm font-bold text-[#8C5E35] mb-5 mt-2">{t.role}</div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-stone-600 font-bold bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <IoLocationSharp className="text-lg text-stone-400" /> {t.location}
                        </div>
                        <a
                          href={`mailto:${LINKS.email}`}
                          className="flex items-center gap-3 text-sm text-stone-600 font-bold bg-stone-50 p-3 rounded-xl border border-stone-100 hover:bg-[#8C5E35] hover:text-white hover:border-[#8C5E35] transition"
                        >
                          <MdEmail className="text-lg" />
                          {LINKS.email}
                        </a>
                      </div>

                      <div className="pt-5 border-t border-stone-200">
                        <div className="text-xs font-black text-stone-700 tracking-wide mb-2">{t.skills}</div>
                        <div className="flex flex-wrap gap-2">
                          {ABOUT_SKILLS.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-stone-50 text-stone-700 border border-stone-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <a
                          href={LINKS.resumePdf}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 block w-full py-3 bg-[#8C5E35] text-white text-center text-sm font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md"
                        >
                          {t.downloadResume}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Projects - 3열 × 2행 (6개) */}
                {featured.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-stone-900">{t.featuredProjects}</h3>
                      <button
                        onClick={() => setTab("Projects")}
                        className="text-sm font-extrabold text-[#8C5E35] hover:underline underline-offset-4"
                      >
                        {t.viewAll}
                      </button>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {featured.slice(0, 6).map((p: any) => (
                        <ProjectCard
                          key={p.slug}
                          p={p}
                          lang={lang}
                          onClick={() => handleFeaturedClick(p.slug)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== PROJECTS ========== */}
        {tab === "Projects" && (
          <div className="bg-stone-200/60 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="space-y-8 px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-stone-900">{t.allProjects}</h2>
                <p className="text-sm text-stone-500 mt-1">{t.ndaNote}</p>

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
                    {t.filterAll}
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

              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((p: any) => (
                  <ProjectCard key={p.slug} p={p} lang={lang} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== CASE STUDIES ========== */}
        {tab === "CaseStudies" && (
          <div className="bg-stone-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="w-full space-y-8 px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">{t.caseStudies}</h2>
                  <p className="text-sm text-stone-500 mt-1">{t.caseStudiesSub}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{t.ndaNote}</p>
                </div>
              </div>

              {detailsLoading ? (
                <div className="py-20 text-center text-stone-400">{t.loading}</div>
              ) : (
                <div className="space-y-6">
                  {PROJECTS.map(({ slug }, idx) => {
                    const project = getProjectBySlug(slug);
                    const details = getDetailsBySlug(slug);
                    const isOpen = selectedSlug === slug;

                    if (!project) return null;

                    return (
                      <div
                        key={slug}
                        ref={(el) => {
                          detailRefs.current[slug] = el;
                        }}
                        className={cn(
                          "bg-white rounded-2xl border overflow-hidden transition-all duration-300",
                          isOpen ? "border-[#8C5E35] shadow-lg" : "border-stone-200 shadow-sm"
                        )}
                      >
                        {/* 아코디언 헤더 */}
                        <button
                          type="button"
                          onClick={() => setSelectedSlug(isOpen ? null : slug)}
                          className="w-full p-5 sm:p-6 flex items-center gap-4 text-left hover:bg-stone-50 transition"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#8C5E35]/10 flex items-center justify-center text-[#8C5E35] font-black shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-[#8C5E35] bg-[#8C5E35]/10 px-2 py-0.5 rounded">
                                {project.category}
                              </span>
                              {details.length > 0 && (
                                <span className="text-xs font-bold text-stone-400">
                                  {details.length} sections
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-black text-stone-900 truncate">
                              {project.title}
                            </h3>
                            <p className="text-sm text-stone-500 truncate">{project.oneLiner}</p>
                          </div>

                          <FaChevronDown
                            className={cn(
                              "text-stone-400 transition-transform duration-300 shrink-0",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {/* 아코디언 내용 */}
                        {isOpen && (
                          <div className="border-t border-stone-100 p-5 sm:p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* 프로젝트 링크 */}
                            <div className="flex flex-wrap gap-2">
                              {project.links?.map((link: any) => (
                                <a
                                  key={link.label}
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 text-stone-600 hover:bg-[#8C5E35] hover:text-white hover:border-[#8C5E35] transition-colors"
                                >
                                  <FaExternalLinkAlt />
                                  {link.label}
                                </a>
                              ))}
                            </div>

                            {/* 상세 섹션들 */}
                            {details.length === 0 ? (
                              caseStudies[slug] ? (
                                <div>
                                  <div
                                    className="case-study-md"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        lang === "ko" && caseStudies[slug].ko
                                          ? (caseStudies[slug].ko as string)
                                          : caseStudies[slug].en,
                                    }}
                                  />
                                  <div className="mt-5">
                                    <a
                                      href={`/projects/${slug}`}
                                      className="text-sm font-bold underline underline-offset-4 text-[#8C5E35] hover:opacity-80"
                                    >
                                      {t.openFullPage}
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
                                  No sections have been added yet.
                                </div>
                              )
                            ) : (
                              <div className="space-y-4">
                                {details.map((section) => (
                                  <div
                                    key={section.id}
                                    className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden"
                                  >
                                    {section.image_url && (
                                      <div className="relative aspect-video bg-stone-200">
                                        <Image
                                          src={section.image_url}
                                          alt={section.section_title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}

                                    <div className="p-4">
                                      {detailEditId === section.id ? (
                                        /* 편집 모드 */
                                        <div className="space-y-3">
                                          <input
                                            type="text"
                                            value={detailEditTitle}
                                            onChange={(e) => setDetailEditTitle(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#8C5E35] outline-none"
                                            placeholder="Section title"
                                          />
                                          <textarea
                                            value={detailEditContent}
                                            onChange={(e) => setDetailEditContent(e.target.value)}
                                            rows={8}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none resize-none font-mono"
                                            placeholder="Content (Markdown supported)"
                                          />
                                          <input
                                            type="text"
                                            value={detailEditImageUrl}
                                            onChange={(e) => setDetailEditImageUrl(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                                            placeholder="Image URL (optional)"
                                          />
                                          <input
                                            type="password"
                                            value={detailEditPassword}
                                            onChange={(e) => setDetailEditPassword(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                                            placeholder="Password"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleUpdateDetail(section.id)}
                                              className="flex items-center gap-1 px-3 py-2 bg-[#8C5E35] text-white rounded-lg text-xs font-bold"
                                            >
                                              <MdSave /> Save
                                            </button>
                                            <button
                                              onClick={() => {
                                                setDetailEditId(null);
                                                setDetailEditTitle("");
                                                setDetailEditContent("");
                                                setDetailEditImageUrl("");
                                                setDetailEditPassword("");
                                              }}
                                              className="flex items-center gap-1 px-3 py-2 border border-stone-300 text-stone-600 rounded-lg text-xs font-bold"
                                            >
                                              <MdCancel /> Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* 보기 모드 - 마크다운 렌더링 */
                                        <>
                                          <div className="flex items-start justify-between gap-3 mb-2">
                                            <h4 className="text-base font-black text-stone-900">
                                              {section.section_title}
                                            </h4>
                                            <div className="flex gap-1 shrink-0">
                                              <button
                                                onClick={() => {
                                                  setDetailEditId(section.id);
                                                  setDetailEditTitle(section.section_title);
                                                  setDetailEditContent(section.content);
                                                  setDetailEditImageUrl(section.image_url || "");
                                                }}
                                                className="p-1.5 text-stone-400 hover:text-[#8C5E35] hover:bg-stone-100 rounded transition"
                                                title="Edit"
                                              >
                                                <MdEdit />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteDetail(section.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                                title="Delete"
                                              >
                                                <FaTrash className="text-xs" />
                                              </button>
                                            </div>
                                          </div>
                                          {/* 마크다운 렌더링 */}
                                          <div className="prose prose-stone prose-sm max-w-none text-stone-600">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                              {section.content}
                                            </ReactMarkdown>
                                          </div>
                                          <div className="mt-3 text-xs text-stone-400">
                                            {new Date(section.created_at).toLocaleDateString("en-US")}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 새 섹션 추가 폼 */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
                <h3 className="text-base font-black text-stone-800 mb-4 flex items-center gap-2">
                  <FaPen className="text-[#8C5E35] text-sm" /> Add a New Section
                  <span className="ml-auto text-xs font-medium text-stone-400">Markdown supported</span>
                </h3>

                <form onSubmit={handleAddDetail} className="space-y-4">
                  <select
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#8C5E35] outline-none"
                  >
                    {FEATURED_SLUGS.map((slug) => {
                      const p = getProjectBySlug(slug);
                      return (
                        <option key={slug} value={slug}>
                          {p?.title || slug}
                        </option>
                      );
                    })}
                  </select>

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                    placeholder="Section title (e.g. Project Background, Tech Stack, Outcome)"
                  />

                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none resize-none font-mono"
                    placeholder="Write the content... (Markdown supported: **bold**, *italic*, - list, [link](url), ```code``` and more)"
                  />

                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                    placeholder="Image URL (optional, e.g. /images/project.png)"
                  />

                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                    placeholder="Password"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8C5E35] text-white font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md"
                  >
                    Add Section
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========== BOARD ========== */}
        {tab === "Board" && (
          <div className="bg-stone-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="w-full max-w-none space-y-8 px-4 sm:px-6 lg:px-10">
              {/* Top: Write (Left) + Image (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Write */}
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-black text-stone-800 mb-4 flex items-center gap-2">
                    <FaPen className="text-[#8C5E35] text-sm" /> {t.writePost}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1">
                    <div className="flex gap-2">
                      {(["Guestbook", "Q&A"] as PostCategory[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setInputCategory(c)}
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
                      placeholder={t.yourName}
                      required
                    />

                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      rows={8}
                      className="w-full flex-1 min-h-[220px] px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition resize-none"
                      placeholder={t.leaveMessage}
                      required
                    />

                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition"
                      placeholder={t.postPassword}
                      required
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#8C5E35] text-white font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md duration-300 mt-auto"
                      disabled={loading}
                    >
                      Post Message
                    </button>
                  </form>
                </div>

                {/* Image */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full">
                    <div className="relative w-full aspect-[4/3]">
                      <Image src="/board.jpg" alt="Board" fill className="object-cover" priority={false} />
                    </div>
                    <div className="p-4 border-t border-stone-100">
                      <div className="text-sm font-black text-stone-800">{t.board}</div>
                      <div className="text-xs text-stone-500 mt-1">
                        Guestbook / Q&amp;A posts are listed below.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Header + Filter */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                  <MdArticle className="text-[#8C5E35]" /> Recent Posts
                </h3>

                <div className="flex flex-wrap gap-2 items-center">
                  {(["All", "Guestbook", "Q&A"] as BoardFilter[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setBoardFilter(c)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition border",
                        boardFilter === c
                          ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                          : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              {loading ? (
                <div className="py-20 text-center text-stone-400">{t.loading}</div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-16 text-center text-stone-400">{t.noPosts}</div>
              ) : (
                <div className="space-y-4">
                  {pagePosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-4 items-center gap-3">
                        <div className="flex gap-3 items-center">
                          <FaUserCircle className="text-stone-300 text-3xl" />
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              <span>{post.author}</span>
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

                            <div className="text-xs text-stone-400">
                              {new Date(post.created_at).toLocaleDateString()}
                              {post.updated_at && (
                                <span className="ml-2 text-stone-300">
                                  (updated {new Date(post.updated_at).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-stone-400">#{post.id}</div>
                      </div>

                      <p className="text-sm text-stone-700 pl-11 leading-relaxed whitespace-pre-wrap break-words">
                        {post.category === "Q&A" ? "[Q&A] " : "[Guestbook] "}
                        {post.content}
                      </p>

                      {/* Edit / Delete */}
                      <div className="mt-4 pl-11">
                        {editId === post.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition resize-none"
                            />

                            <input
                              type="password"
                              value={getPw(post.id)}
                              onChange={(e) => setPw(post.id, e.target.value)}
                              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition"
                              placeholder="Password to save"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdate(post)}
                                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#8C5E35] text-white"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditId(null);
                                  setEditContent("");
                                  clearPw(post.id);
                                }}
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <input
                              type="password"
                              value={getPw(post.id)}
                              onChange={(e) => setPw(post.id, e.target.value)}
                              className="w-full sm:w-64 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition"
                              placeholder="Password for edit/delete"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditId(post.id);
                                  setEditContent(post.content);
                                }}
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(post)}
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pager */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-bold",
                        page <= 1
                          ? "text-stone-300 border-stone-200 bg-stone-50"
                          : "text-stone-700 border-stone-300 bg-white hover:border-[#8C5E35] hover:text-[#8C5E35]"
                      )}
                    >
                      ←
                    </button>

                    <div className="text-sm font-bold text-stone-600">
                      {page} / {totalPages}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-bold",
                        page >= totalPages
                          ? "text-stone-300 border-stone-200 bg-stone-50"
                          : "text-stone-700 border-stone-300 bg-white hover:border-[#8C5E35] hover:text-[#8C5E35]"
                      )}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
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
