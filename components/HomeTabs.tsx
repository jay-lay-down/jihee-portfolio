"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  useEffect,
  FormEvent,
  useCallback,
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
  // ✅ 개발 스택 & DB 관련 스킬 추가
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "Supabase",
  "Database",
];

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
  password_hash?: string; // ✅ 추가
};

type InfoItem = { year?: number; label: string; sub?: string };

// --- 유틸 ---
function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

/**
 * ✅ WebCrypto 기반 비번 해시(PBKDF2)
 * 저장 포맷: pbkdf2$<iterations>$<saltBase64>$<hashBase64>
 */
function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}
function base64ToBytes(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pbkdf2Hash(password: string, iterations = 120_000) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashBytes = new Uint8Array(bits);
  return `pbkdf2$${iterations}$${bytesToBase64(salt)}$${bytesToBase64(hashBytes)}`;
}

async function pbkdf2Verify(password: string, stored: string) {
  // stored: pbkdf2$iters$saltB64$hashB64
  const parts = stored.split("$");
  if (parts.length !== 4) return false;
  const [algo, iterStr, saltB64, hashB64] = parts;
  if (algo !== "pbkdf2") return false;

  const iterations = Number(iterStr);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = base64ToBytes(saltB64);
  const expected = base64ToBytes(hashB64);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const actual = new Uint8Array(bits);

  // constant-time-ish compare
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
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
        "relative px-2 py-2 text-[15px] md:text-base font-extrabold tracking-wide transition",
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
      <div className="px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <NavBtn k="Home" label="HOME" />
          <NavBtn k="Projects" label="PROJECTS" />
          <NavBtn k="Board" label="BOARD" />
        </div>

        <div className="flex items-center gap-1">
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

// 프로젝트 카드
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

// ABOUT 아래 “작은 Info 카드”
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
          <div key={i} className="text-[12px] leading-4 text-stone-600 font-medium">
            <div className="flex gap-2">
              {x.year ? (
                <span className="font-extrabold text-stone-700 shrink-0">{x.year}</span>
              ) : null}
              <span className="font-bold text-stone-700">{x.label}</span>
            </div>
            {x.sub ? <div className="text-[12px] text-stone-500 mt-0.5">{x.sub}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeTabs() {
  const [tab, setTab] = useState<TabKey>("Home");
  const [filter, setFilter] = useState<Filter>("All");

  // --- Board ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCategory, setInputCategory] = useState<"Q&A" | "Guestbook">("Guestbook");

  // ✅ 비밀번호/편집 관련 state 추가
  const [inputPassword, setInputPassword] = useState(""); // 글 등록용
  const [editId, setEditId] = useState<number | null>(null); // 편집 중인 글 id
  const [editContent, setEditContent] = useState(""); // 편집 내용
  const [authPassword, setAuthPassword] = useState(""); // 수정/삭제 인증용 비번

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("guestbook")
        .select("id, author, content, created_at, category, password_hash")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        alert("게시판을 불러오는 중 오류가 발생했습니다. (콘솔 로그 확인)");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      alert("네트워크 문제로 게시판을 불러오지 못했습니다. 잠시 후 다시 시도해 주십시오.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "Board") void fetchPosts();
  }, [tab, fetchPosts]);

  const verifyPassword = async (post: Post, pw: string) => {
    if (!post.password_hash) return false;
    return pbkdf2Verify(pw, post.password_hash);
  };

  const handleDelete = async (post: Post) => {
    if (!authPassword.trim()) return alert("비밀번호를 입력해 주세요.");

    const ok = await verifyPassword(post, authPassword);
    if (!ok) return alert("비밀번호가 맞지 않습니다.");

    try {
      const { error } = await (supabase as any).from("guestbook").delete().eq("id", post.id);

      if (error) {
        console.error("Supabase delete error:", error);
        alert("삭제 중 오류가 발생했습니다.");
        return;
      }

      setAuthPassword("");
      void fetchPosts();
    } catch (err) {
      console.error("Supabase delete exception:", err);
      alert("네트워크 오류로 삭제하지 못했습니다.");
    }
  };

  const handleUpdate = async (post: Post) => {
    if (!authPassword.trim()) return alert("비밀번호를 입력해 주세요.");

    const ok = await verifyPassword(post, authPassword);
    if (!ok) return alert("비밀번호가 맞지 않습니다.");

    const next = editContent.trim();
    if (!next) return alert("내용이 비어있습니다.");

    try {
      const { error } = await (supabase as any)
        .from("guestbook")
        .update({ content: next })
        .eq("id", post.id);

      if (error) {
        console.error("Supabase update error:", error);
        alert("수정 중 오류가 발생했습니다.");
        return;
      }

      setEditId(null);
      setEditContent("");
      setAuthPassword("");
      void fetchPosts();
    } catch (err) {
      console.error("Supabase update exception:", err);
      alert("네트워크 오류로 수정하지 못했습니다.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputContent.trim() || !inputPassword.trim()) return;

    try {
      const password_hash = await pbkdf2Hash(inputPassword);

      const { error }: { error: any } = await (supabase as any)
        .from("guestbook")
        .insert([
          {
            author: inputName,
            content: inputContent,
            category: inputCategory,
            password_hash,
          },
        ]);

      if (error) {
        console.error("Supabase insert error:", error);
        alert("게시글 저장 중 오류가 발생했습니다.");
        return;
      }

      setInputName("");
      setInputContent("");
      setInputPassword("");
      void fetchPosts();
    } catch (err) {
      console.error("Supabase insert exception:", err);
      alert("네트워크 오류로 게시글을 저장하지 못했습니다.");
    }
  };

  // --- Projects 데이터 ---
  const featured = useMemo(() => PROJECTS.filter((p: any) => p.featured), []);
  const categories = useMemo(
    () => Array.from(new Set(PROJECTS.map((p: any) => p.category))) as ProjectCategory[],
    []
  );
  const filteredProjects = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p: any) => p.category === filter)),
    [filter]
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
        {/* HOME */}
        {tab === "Home" && (
          <div className="bg-stone-100/80 pt-0 pb-12 px-0 border-x border-b border-stone-200/50">
            <div className="space-y-10 px-6 lg:px-10">
              {/* ✅ Hero: 위로 이동 + 살짝 크게 */}
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
                  {/* LEFT: ABOUT */}
                  <div className="lg:col-span-8 space-y-8">
                    <section className="h-full rounded-2xl bg-[#f5ebe0]/60 border border-[#e3d5ca] px-6 py-6 sm:px-8 sm:py-7">
                      <h3 className="text-sm font-extrabold tracking-wide text-stone-700 mb-3">
                        ABOUT
                      </h3>

                      <div className="space-y-3 text-[16px] leading-8 text-stone-800 font-medium max-w-5xl break-keep">
                        <p>
                          심리학을 기반으로 데이터 분석을 수행하며, 브랜드·리서치 데이터를 볼 때
                          &nbsp;“이 숫자로 무엇을 결정할 수 있을까?”부터 생각합니다.
                          단순히 지표를 나열하기보다는, 실제 의사결정에 도움이 되는 인사이트를
                          도출하는 일을 더 중요하게 여깁니다.
                        </p>

                        <p>
                          프로젝트를 할 때는 기획 단계에서 문제를 정의하고, 조사·데이터 설계 →
                          모델링 → 대시보드·리포트까지 하나의 흐름으로 이어지도록 기획하는 데
                          강점이 있습니다. 숫자보다 “누가 이 결과를 어떻게 활용할지”를
                          상상하면서 구조를 설계합니다.
                        </p>

                        <p>
                          최근에는 세그멘테이션, 수요 예측, 캠페인 효과 분석 같은 작업에 LLM·RAG를
                          결합해서, 단순 보고서가 아니라 질문하면 맥락을 설명해 주는 AI 서비스
                          형태로 만드는 실험을 하고 있습니다.
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

                  {/* RIGHT: Profile 카드 */}
                  <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-20 bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-sm h-full">
                      <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                        <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                      </div>

                      <h3 className="text-2xl font-black text-stone-900">Jihee Cho</h3>

                      <div className="text-sm font-bold text-stone-500 mt-1">
                        Jan.25.1991 / Seoul
                      </div>

                      <div className="text-sm font-bold text-[#8C5E35] mb-5 mt-2">
                        Analytics · Build · LLM
                      </div>

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
                        <div className="text-xs font-black text-stone-700 tracking-wide mb-2">
                          SKILLS
                        </div>
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

                {/* Featured Projects */}
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

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      {featured.slice(0, 4).map((p: any) => (
                        <ProjectCard key={p.slug} p={p} />
                      ))}
                    </div>
                  </section>
                )}
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

        {/* BOARD */}
        {tab === "Board" && (
          <div className="bg-stone-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-stone-200/50 min-h-[600px]">
            <div className="grid gap-8 px-4 sm:px-6 lg:px-10 grid-cols-1 lg:grid-cols-3">
              {/* ✅ 모바일에서는 글 리스트가 먼저, 폼이 아래로 가도록 order 조정 */}
              <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
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
                      className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-4 items-center gap-3">
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
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0",
                            post.category === "Q&A"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-[#8C5E35]/10 text-[#8C5E35] border-[#8C5E35]/20"
                          )}
                        >
                          {post.category}
                        </span>
                      </div>

                      <p className="text-sm text-stone-700 pl-11 leading-relaxed whitespace-pre-wrap break-words">
                        {post.content}
                      </p>

                      {/* ✅ Edit / Delete UI */}
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
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
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
                                  setAuthPassword("");
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
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
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
                  ))
                )}
              </div>

              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm lg:sticky lg:top-20">
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

                    {/* ✅ 비밀번호 입력 */}
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
                      className="w-full py-3 bg-[#8C5E35] text-white font-bold rounded-xl hover:bg-[#6B4628] transition shadow-md duration-300"
                      disabled={loading}
                    >
                      Post Message
                    </button>
                  </form>
                </div>
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
