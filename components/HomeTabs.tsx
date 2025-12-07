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

// Featured 프로젝트 slug 순서 (6개)
const FEATURED_SLUGS = [
  "ddolbae",
  "animal-test",
  "auto-segment-tool",
  "bayesian-dashboard",
  "demand-forecasting",
  "employee-engagement",
];

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
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
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
  );
}

// 프로젝트 카드 (클릭 가능)
function ProjectCard({ p, onClick }: { p: any; onClick?: () => void }) {
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

export default function HomeTabs() {
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
        alert("게시판을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      alert("네트워크 문제로 게시판을 불러오지 못했습니다.");
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
        alert("게시글 저장 중 오류가 발생했습니다.");
        return;
      }

      setInputName("");
      setInputContent("");
      setInputPassword("");
      void fetchPosts();
    } catch (err) {
      console.error("RPC create exception:", err);
      alert("네트워크 오류로 게시글을 저장하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: Post) => {
    const pw = getPw(post.id).trim();
    if (!pw) return alert("비밀번호를 입력해 주세요.");

    try {
      const { data, error } = await (supabase as any).rpc(
        "guestbook_delete_post",
        { p_id: post.id, p_password: pw }
      );

      if (error) {
        console.error("RPC delete error:", error);
        alert("삭제 중 오류가 발생했습니다.");
        return;
      }

      if (data !== true) {
        alert("비밀번호가 맞지 않거나 글이 존재하지 않습니다.");
        return;
      }

      clearPw(post.id);
      void fetchPosts();
    } catch (err) {
      console.error("RPC delete exception:", err);
      alert("네트워크 오류로 삭제하지 못했습니다.");
    }
  };

  const handleUpdate = async (post: Post) => {
    const pw = getPw(post.id).trim();
    if (!pw) return alert("비밀번호를 입력해 주세요.");

    const next = editContent.trim();
    if (!next) return alert("내용이 비어있습니다.");

    try {
      const { data, error } = await (supabase as any).rpc(
        "guestbook_update_post",
        { p_id: post.id, p_password: pw, p_content: next }
      );

      if (error) {
        console.error("RPC update error:", error);
        alert("수정 중 오류가 발생했습니다.");
        return;
      }

      if (data !== true) {
        alert("비밀번호가 맞지 않거나 글이 존재하지 않습니다.");
        return;
      }

      setEditId(null);
      setEditContent("");
      clearPw(post.id);
      void fetchPosts();
    } catch (err) {
      console.error("RPC update exception:", err);
      alert("네트워크 오류로 수정하지 못했습니다.");
    }
  };

  // --- Case Studies CRUD ---
  const handleAddDetail = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !adminPassword.trim()) {
      alert("제목, 내용, 비밀번호를 모두 입력해주세요.");
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
        alert("섹션 추가 중 오류가 발생했습니다.");
        return;
      }

      setNewTitle("");
      setNewContent("");
      setNewImageUrl("");
      setAdminPassword("");
      fetchProjectDetails();
    } catch (err) {
      console.error("Create detail exception:", err);
      alert("네트워크 오류로 섹션을 추가하지 못했습니다.");
    }
  };

  const handleUpdateDetail = async (id: number) => {
    if (!detailEditTitle.trim() || !detailEditContent.trim() || !detailEditPassword.trim()) {
      alert("제목, 내용, 비밀번호를 모두 입력해주세요.");
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
        alert("수정 중 오류가 발생했습니다.");
        return;
      }

      if (data === false) {
        alert("비밀번호가 올바르지 않습니다.");
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
      alert("네트워크 오류로 수정하지 못했습니다.");
    }
  };

  const handleDeleteDetail = async (id: number) => {
    const pw = prompt("삭제하려면 비밀번호를 입력하세요:");
    if (!pw) return;

    try {
      const { data, error } = await (supabase as any).rpc("project_detail_delete", {
        p_id: id,
        p_password: pw,
      });

      if (error) {
        console.error("Delete detail error:", error);
        alert("삭제 중 오류가 발생했습니다.");
        return;
      }

      if (data === false) {
        alert("비밀번호가 올바르지 않습니다.");
        return;
      }

      fetchProjectDetails();
    } catch (err) {
      console.error("Delete detail exception:", err);
      alert("네트워크 오류로 삭제하지 못했습니다.");
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
    { year: 2024, label: "고객사 NPS 조사 10점 만점 달성" },
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
    <div className="min-h-screen text-stone-800 pb-20 w-full px-3 sm:px-4">
      <TopNav tab={tab} setTab={setTab} />

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
                    Available for new projects
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
                      <h3 className="text-sm font-extrabold tracking-wide text-stone-700 mb-3">ABOUT</h3>

                      <div className="space-y-3 text-[16px] leading-8 text-stone-800 font-medium max-w-5xl break-keep">
                        <p>
                          심리학을 기반으로 데이터 분석을 수행하며, 브랜드·리서치 데이터를 볼 때
                          &nbsp;"이 숫자로 무엇을 결정할 수 있을까?"부터 생각합니다. 단순히 지표를
                          나열하기보다는, 실제 의사결정에 도움이 되는 인사이트를 도출하는 일을 더
                          중요하게 여깁니다.
                        </p>

                        <p>
                          프로젝트를 할 때는 기획 단계에서 문제를 정의하고, 조사·데이터 설계 → 모델링
                          → 대시보드·리포트까지 하나의 흐름으로 이어지도록 기획하는 데 강점이 있습니다.
                          숫자보다 "누가 이 결과를 어떻게 활용할지"를 상상하면서 구조를 설계합니다.
                        </p>

                        <p>
                          최근에는 세그멘테이션, 수요 예측, 캠페인 효과 분석 같은 작업에 LLM·RAG를 결합해서,
                          단순 보고서가 아니라 질문하면 맥락을 설명해 주는 AI 서비스 형태로 만드는 실험을 하고 있습니다.
                        </p>
                      </div>

                      <div className="mt-6 border-t border-stone-200 pt-4">
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                          <MiniInfoCard title="Education" icon={MdSchool} items={EDUCATION} />
                          <MiniInfoCard title="Experience" icon={MdWork} items={EXPERIENCE} />
                          <MiniInfoCard title="Awards" icon={MdEmojiEvents} items={AWARDS} />
                          <MiniInfoCard title="Licenses" icon={MdEmojiEvents} items={LICENSES} />
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
                      <div className="text-sm font-bold text-stone-500 mt-1">Jan.25.1991 / Seoul</div>
                      <div className="text-sm font-bold text-[#8C5E35] mb-5 mt-2">Analytics · Build · LLM</div>

                      <div className="space-y-3 mb-6">
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

                      <div className="pt-5 border-t border-stone-200">
                        <div className="text-xs font-black text-stone-700 tracking-wide mb-2">SKILLS</div>
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
                          Download Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Projects - 3열 × 2행 (6개) */}
                {featured.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-stone-900">Featured Projects</h3>
                      <button
                        onClick={() => setTab("Projects")}
                        className="text-sm font-extrabold text-[#8C5E35] hover:underline underline-offset-4"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {featured.slice(0, 6).map((p: any) => (
                        <ProjectCard
                          key={p.slug}
                          p={p}
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

              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((p: any) => (
                  <ProjectCard key={p.slug} p={p} />
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
                  <h2 className="text-2xl font-black text-stone-900">Case Studies</h2>
                  <p className="text-sm text-stone-500 mt-1">프로젝트별 상세 설명</p>
                </div>
              </div>

              {detailsLoading ? (
                <div className="py-20 text-center text-stone-400">Loading...</div>
              ) : (
                <div className="space-y-6">
                  {FEATURED_SLUGS.map((slug, idx) => {
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
                                  {details.length}개 섹션
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
                              <div className="py-8 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
                                아직 작성된 내용이 없습니다.
                              </div>
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
                                            placeholder="섹션 제목"
                                          />
                                          <textarea
                                            value={detailEditContent}
                                            onChange={(e) => setDetailEditContent(e.target.value)}
                                            rows={5}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none resize-none"
                                            placeholder="내용"
                                          />
                                          <input
                                            type="text"
                                            value={detailEditImageUrl}
                                            onChange={(e) => setDetailEditImageUrl(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                                            placeholder="이미지 URL (선택)"
                                          />
                                          <input
                                            type="password"
                                            value={detailEditPassword}
                                            onChange={(e) => setDetailEditPassword(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                                            placeholder="비밀번호"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleUpdateDetail(section.id)}
                                              className="flex items-center gap-1 px-3 py-2 bg-[#8C5E35] text-white rounded-lg text-xs font-bold"
                                            >
                                              <MdSave /> 저장
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
                                              <MdCancel /> 취소
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* 보기 모드 */
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
                                                title="수정"
                                              >
                                                <MdEdit />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteDetail(section.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                                title="삭제"
                                              >
                                                <FaTrash className="text-xs" />
                                              </button>
                                            </div>
                                          </div>
                                          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                                            {section.content}
                                          </p>
                                          <div className="mt-2 text-xs text-stone-400">
                                            {new Date(section.created_at).toLocaleDateString("ko-KR")}
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
                  <FaPen className="text-[#8C5E35] text-sm" /> 새 섹션 추가
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
                    placeholder="섹션 제목 (예: 프로젝트 배경, 기술 스택, 결과)"
                  />

                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none resize-none"
                    placeholder="내용을 작성하세요..."
                  />

                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                    placeholder="이미지 URL (선택, 예: /images/project.png)"
                  />

                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] outline-none"
                    placeholder="비밀번호"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8C5E35] text-white font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md"
                  >
                    섹션 추가
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
                    <FaPen className="text-[#8C5E35] text-sm" /> Write a Post
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
                      placeholder="Your name"
                      required
                    />

                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      rows={8}
                      className="w-full flex-1 min-h-[220px] px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition resize-none"
                      placeholder="Leave a message..."
                      required
                    />

                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8C5E35] focus:border-transparent outline-none transition"
                      placeholder="Password (for edit/delete)"
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
                      <div className="text-sm font-black text-stone-800">Board</div>
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
                <div className="py-20 text-center text-stone-400">Loading...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-16 text-center text-stone-400">No posts yet.</div>
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
