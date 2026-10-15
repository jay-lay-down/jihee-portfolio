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
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
};

const ABOUT_SKILLS = [
  "SPSS",
  "R",
  "Python",
  "SQL",
  "Excel",
  "PowerPoint",
  "Tableau",
  "PyTorch",
  "TensorFlow",
  "Hugging Face",
  "Hadoop",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "Supabase",
  "Database",
];

const PAGE_SIZE = 10;

// Featured 프로젝트 slug 순서 (소비자 조사 → 시장 인텔리전스 → 설문/심리측정, 3열 × 3행)
const FEATURED_SLUGS = [
  "auto-segment-tool",
  "text-mining-tool",
  "bayesian-norms",
  "bayesian-dashboard",
  "other-projects",
  "geo-ai-writing",
  "demand-forecasting",
  "employee-engagement",
  "animal-test",
];

// 실무 하이라이트 (고객사명 마스킹)
type Highlight = {
  tag: "Consumer Insight" | "Market Intelligence";
  title: string;
  client: string;
  approach: string;
  outcome: string;
};

const HIGHLIGHTS: Record<"ko" | "en", Highlight[]> = {
  ko: [
    {
      tag: "Consumer Insight",
      title: "제과 브랜드 Brand Index 조사",
      client: "국내 제과 A사",
      approach: "유튜브와 커뮤니티 크롤링으로 제품군을 상승/정체/하락 유형으로 나누고, 유형별로 퍼널 검증과 KANO 모듈을 분리 설계",
      outcome: "KANO와 VoC로 '한 입 크기' 니즈와 '부스러기 불편'을 도출, 이후 한 입 크기 제품 출시",
    },
    {
      tag: "Consumer Insight",
      title: "음용 상황 기반 Demand Space",
      client: "국내 음료 B사",
      approach: "음용 시간대, 장소, 동반자, 상황 등 소비 맥락 문항을 변수로 넣어 소비자 세그먼트 설계",
      outcome: "상황 맥락 기반 타깃 인사이트로 동일 고객사 후속 프로젝트 수주",
    },
    {
      tag: "Consumer Insight",
      title: "브랜드 파워 드라이버 진단",
      client: "글로벌 주류 C사",
      approach: "브랜드 인식, 구매 행동 지표 8종을 설명변수로 둔 24개월 롤링 회귀로 월별 드라이버 기여도 산출",
      outcome: "브랜드별 월간/연간 리포트 자동화, 고객사 브랜드 전략 의사결정에 활용",
    },
    {
      tag: "Consumer Insight",
      title: "패션 플랫폼 광고효과 FGD",
      client: "패션 유통 E사",
      approach: "플랫폼 고객 특성에 맞춰 FGD 그룹 구성과 진행 가이드라인을 직접 설계",
      outcome: "내부 모더레이터와 고객사 호평, 동일 고객사 추가 프로젝트 계약",
    },
    {
      tag: "Market Intelligence",
      title: "TV 시장 한국/유럽 소비자 비교",
      client: "글로벌 전자 D사",
      approach: "한국/유럽 판매 데이터와 리뷰 VoC를 인지자/구매고려자/구매자로 나누어 재분석",
      outcome: "구매 장벽(신뢰, A/S 우려)과 전환 트리거(가격 경쟁력)를 도출해 트래킹 지표 제안",
    },
    {
      tag: "Market Intelligence",
      title: "데이터 품질 개선과 신규 데이터 소싱",
      client: "글로벌 전자 고객사",
      approach: "해지 원인을 데이터 정확도 편차로 특정하고 카드 결제 데이터 도입 제안, 리뷰 크롤링/감성분석으로 미커버 영역 보완",
      outcome: "약 5.7억원 규모 재구독 성사, 2024 Q3 우수사원상",
    },
  ],
  en: [
    {
      tag: "Consumer Insight",
      title: "Snack Brand Index Study",
      client: "Domestic confectionery Co. A",
      approach: "Grouped products into rising, flat and declining types using YouTube and community crawling, then designed separate funnel and KANO modules for each type",
      outcome: "KANO and VoC surfaced a need for a bite-size format and a crumb complaint; a bite-size product was later launched",
    },
    {
      tag: "Consumer Insight",
      title: "Occasion-based Demand Space",
      client: "Domestic beverage Co. B",
      approach: "Built consumer segments from occasion variables such as time of day, place, company and situation",
      outcome: "Occasion-level targeting insight led to a follow-up project with the same client",
    },
    {
      tag: "Consumer Insight",
      title: "Brand Power Driver Diagnosis",
      client: "Global brewer C",
      approach: "Estimated monthly driver contributions with a 24-month rolling regression on 8 brand perception and purchase behavior metrics",
      outcome: "Automated monthly and yearly brand reports used in the client's brand strategy decisions",
    },
    {
      tag: "Consumer Insight",
      title: "Fashion Platform Ad Effectiveness FGD",
      client: "Fashion retail Co. E",
      approach: "Designed the group composition and discussion guide around the platform's customer profile",
      outcome: "Praised by the in-house moderator and the client; led to an additional project with the same client",
    },
    {
      tag: "Market Intelligence",
      title: "TV Market: Korea vs Europe Consumers",
      client: "Global electronics Co. D",
      approach: "Re-analyzed Korean and European sales data and review VoC by aware, considering and purchasing consumers",
      outcome: "Identified purchase barriers (trust, after-sales concerns) and the conversion trigger (price), and proposed tracking metrics",
    },
    {
      tag: "Market Intelligence",
      title: "Data Quality and New Data Sourcing",
      client: "Global electronics client",
      approach: "Traced churn to uneven data accuracy, proposed adding card payment data, and filled coverage gaps with review crawling and sentiment analysis",
      outcome: "Won back a renewal worth about KRW 570M; Q3 2024 employee award",
    },
  ],
};

// --- 언어 ---
export type Lang = "ko" | "en";

const T = {
  en: {
    aboutTitle: "ABOUT",
    aboutP1:
      "I am a researcher who wants two things: to try new things, and to see them through. At global research firms I proposed hierarchical Bayesian sample stabilization, AI-based VoC analysis, segmentation automation and synthetic data, and I kept pushing pricing analysis and a demand forecasting method until they became the team standard.",
    aboutP2:
      "But at a research agency, my work ended at the report, however good the insight. I could only guess whether a recommendation had been used by spotting products that reached the market much later. Wanting to act on the findings and see the results myself, I joined a startup in GEO, a field that did not yet have a measurement standard.",
    aboutP3:
      "I designed its measurement system from scratch: about 240 fixed prompts based on real consumer question patterns, sent to four AI models every three days and tracked weekly and monthly. I kept week-to-week variance under 0.3%p and ran KPIs for a financial holding company, a telecom and an internet bank at the same time. My clients ranked first in citation rate and second in mention rate, which made the work an internal best-practice case and brought in new business from the same industry.",
    highlightsTitle: "Research Highlights",
    highlightsSub: "Selected client work. Client names are masked for confidentiality.",
    approach: "Approach",
    outcome: "Outcome",
    education: "Education",
    experience: "Experience",
    awards: "Awards",
    licenses: "Licenses",
    birthCity: "Jan 25, 1991 / Seoul",
    role: "Consumer Research / Market Insight / Analytics",
    location: "Seoul, South Korea",
    skills: "SKILLS",
    featuredProjects: "Featured Projects",
    viewAll: "View all →",
    allProjects: "All Projects",
    ndaNote: "Ongoing client projects are not published on this site for confidentiality.",
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
    aboutTitle: "소개",
    aboutP1:
      "'새로운 시도'와 '끝까지 책임지는 실행'을 원하는 리서처입니다. 글로벌 리서치사에서 위계적 베이지안 표본 안정화, AI 기반 VoC 분석과 세그먼트 자동화, 합성(Synthetic) 데이터를 내부에 제안했고, 프라이싱 분석과 수요예측 방법론은 끝까지 밀어붙여 부서 표준으로 안착시켰습니다.",
    aboutP2:
      "하지만 조사 에이전시에서는 좋은 인사이트를 담은 보고서를 내도 '개선'까지 주도할 수 없었습니다. 제안이 반영됐는지는 시간이 흐른 뒤 시장에 나온 제품을 보고서야 짐작할 수 있었습니다. 직접 실행하고 결과를 확인하고 싶어, 측정 표준조차 없던 GEO 분야의 스타트업에 합류했습니다.",
    aboutP3:
      "실제 소비자의 질문 패턴을 반영한 고정 프롬프트 240여 개를 구조화하고, 4종의 AI 모델에 3일 주기로 질의해 주/월 단위로 추적하는 측정 체계를 처음부터 설계했습니다. 주간 반복 측정 편차를 0.3%p 미만으로 통제했고, 금융지주, 통신사, 인터넷은행의 KPI를 동시에 운영하며 담당 고객사 인용률 1위, 언급률 2위를 달성했습니다. 이 성과는 사내 우수 사례 선정과 동종 업계 신규 수주로 이어졌습니다.",
    highlightsTitle: "소비자 조사 실무 하이라이트",
    highlightsSub: "고객사 프로젝트 중 일부이며, 고객사명은 비밀유지를 위해 마스킹했습니다.",
    approach: "설계",
    outcome: "결과",
    education: "학력",
    experience: "경력",
    awards: "수상",
    licenses: "자격증",
    birthCity: "1991.01.25 / 서울",
    role: "소비자 리서치 / 시장 인사이트 / 데이터 분석",
    location: "대한민국 서울",
    skills: "스킬",
    featuredProjects: "대표 프로젝트",
    viewAll: "전체 보기 →",
    allProjects: "전체 프로젝트",
    ndaNote: "진행 중인 클라이언트 프로젝트는 비밀유지를 위해 웹에 공개하지 않습니다.",
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
        "relative shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-2 text-[0.75rem] sm:text-[0.9375rem] md:text-base font-extrabold tracking-wide transition",
        tab === k ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition",
          tab === k ? "bg-[#355E8C]" : "bg-transparent"
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
      className="inline-flex items-center justify-center w-11 h-11 rounded-full text-slate-500 hover:text-[#355E8C] hover:bg-slate-100 transition"
    >
      {children}
    </a>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-4 min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <NavBtn k="Home" label="HOME" />
          <NavBtn k="Projects" label="PROJECTS" />
          <NavBtn k="CaseStudies" label="CASE STUDIES" />
          <NavBtn k="Board" label="BOARD" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center rounded-full border border-slate-300 overflow-hidden">
            {(["ko", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLang(l)}
                className={cn(
                  "px-2 sm:px-3 py-1.5 text-[0.6875rem] sm:text-xs font-black transition whitespace-nowrap",
                  lang === l ? "bg-[#355E8C] text-white" : "bg-white text-slate-500 hover:text-[#355E8C]"
                )}
              >
                {l === "ko" ? "한국어" : "EN"}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1">
          <IconLink href={LINKS.linkedin} label="LinkedIn">
            <FaLinkedin className="text-[1.375rem]" />
          </IconLink>
          <IconLink href={LINKS.github} label="GitHub">
            <FaGithub className="text-[1.375rem]" />
          </IconLink>
          <IconLink href={LINKS.hf} label="Hugging Face">
            <SiHuggingface className="text-[1.375rem]" />
          </IconLink>
          <IconLink href={LINKS.velog} label="Velog">
            <SiVelog className="text-[1.375rem]" />
          </IconLink>
          <IconLink href={`mailto:${LINKS.email}`} label="Email">
            <MdEmail className="text-[1.375rem]" />
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
        "group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full hover:border-[#73A3D4]/50",
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#DBEAFE,transparent_55%),radial-gradient(circle_at_100%_100%,#e5e7eb,transparent_55%),linear-gradient(135deg,#FBFCFD,#e5e7eb)]" />
            <div className="absolute inset-0 mix-blend-multiply opacity-60 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.08),transparent_55%)]" />
            <div className="absolute bottom-3 left-4 text-xs font-bold text-slate-700/85">
              {String(p.category)} Project
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-[#355E8C] bg-[#355E8C]/10 px-2 py-1 rounded uppercase tracking-wide">
            {p.category}
          </span>
          {onClick && (
            <FaChevronRight className="text-slate-300 group-hover:text-[#355E8C] transition text-sm" />
          )}
        </div>

        <h3 className="text-lg font-black text-slate-900 leading-tight mb-3 group-hover:text-[#355E8C] transition">
          {lang === "ko" && p.titleKo ? p.titleKo : p.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2">
          {lang === "ko" && p.oneLinerKo ? p.oneLinerKo : p.oneLiner}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {Array.isArray(p.stack) &&
            p.stack.slice(0, 5).map((s: string) => (
              <span
                key={s}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-[0.625rem] font-bold rounded-md border border-slate-200"
              >
                {s}
              </span>
            ))}
        </div>

        <div
          className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.isArray(p.links) &&
            p.links.map((link: any) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-[#355E8C] hover:text-white hover:border-[#355E8C] transition-colors duration-300"
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
    <div className="rounded-xl bg-white/70 border border-[#CAD5E3] px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="text-[#355E8C]" />
        <div className="text-xs font-black text-slate-800">{title}</div>
      </div>

      <div className="mt-2 space-y-2">
        {items.map((x, i) => (
          <div
            key={i}
            className="text-[0.75rem] leading-4 text-slate-600 font-medium"
          >
            <div className="flex gap-2">
              {x.year ? (
                <span className="font-extrabold text-slate-700 shrink-0">
                  {x.year}
                </span>
              ) : null}
              <span className="font-bold text-slate-700">{x.label}</span>
            </div>
            {x.sub ? (
              <div className="text-[0.75rem] text-slate-500 mt-0.5">{x.sub}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// 실무 하이라이트 카드
function HighlightCard({ h, approachLabel, outcomeLabel }: { h: Highlight; approachLabel: string; outcomeLabel: string }) {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 p-6 h-full hover:border-[#73A3D4]/50 hover:shadow-md transition">
      <span className="text-xs font-bold text-[#355E8C] bg-[#355E8C]/10 px-2 py-1 rounded uppercase tracking-wide w-fit">
        {h.tag}
      </span>
      <h4 className="mt-3 text-lg font-black text-slate-900 leading-tight break-keep">{h.title}</h4>
      <div className="mt-1 text-xs font-bold text-slate-400">{h.client}</div>

      <dl className="mt-4 space-y-3 text-sm leading-relaxed break-keep">
        <div>
          <dt className="text-[0.6875rem] font-black text-slate-500 tracking-wide">{approachLabel}</dt>
          <dd className="mt-0.5 text-slate-700">{h.approach}</dd>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <dt className="text-[0.6875rem] font-black text-[#355E8C] tracking-wide">{outcomeLabel}</dt>
          <dd className="mt-0.5 font-bold text-slate-900">{h.outcome}</dd>
        </div>
      </dl>
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
  const [boardError, setBoardError] = useState<string | null>(null);

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
    if (!isSupabaseConfigured) {
      setBoardError("게시판 백엔드가 연결되어 있지 않습니다.");
      setPosts([]);
      return;
    }
    setLoading(true);
    setBoardError(null);
    try {
      const { data, error } = await (supabase as any)
        .from("guestbook")
        .select("id, author, content, created_at, updated_at, category")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        setBoardError("게시글을 불러오지 못했습니다.");
        setPosts([]);
      } else {
        setPosts((data as Post[]) || []);
      }
    } catch (err) {
      console.error("Supabase select exception:", err);
      setBoardError("게시판 서버에 연결할 수 없습니다.");
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
          { label: "앤서", sub: "컨설팅팀 (GEO)" },
          { label: "칸타코리아", sub: "Analytics" },
          { label: "NIQ-GfK", sub: "Global Strategic Account Management" },
          { label: "마크로밀엠브레인", sub: "리서치 1부서 3팀" },
          { label: "엠앤엠리서치", sub: "연구사업본부" },
          { label: "서울대학교병원", sub: "의생명연구원 소아정신과" },
        ]
      : [
          { label: "ANSWER", sub: "Consulting Team (GEO)" },
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
    <div className="min-h-screen text-slate-800 pb-20 w-full px-3 sm:px-4">
      <TopNav tab={tab} setTab={setTab} lang={lang} onLang={switchLang} />

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-xl rounded-b-xl overflow-hidden w-full">
        {/* ========== HOME ========== */}
        {tab === "Home" && (
          <div className="bg-slate-100/80 pt-0 pb-12 px-0 border-x border-b border-slate-200/50">
            <div className="space-y-10 px-6 lg:px-10">
              <div className="relative mt-0 w-full h-[clamp(15rem,38vw,30rem)] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/hero.jpg" alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/55 to-black/80" />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-center text-white">
                  <h2 className="text-[clamp(2rem,5.5vw,3.75rem)] font-black mb-0 leading-tight drop-shadow-lg">
                    Portfolio
                    <br />
                    <span className="text-[#49BAFF]">Jihee Cho</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid gap-8 items-stretch grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8 space-y-8">
                    <section className="h-full rounded-2xl bg-[#E0EBF5]/60 border border-[#CAD5E3] px-6 py-6 sm:px-8 sm:py-7">
                      <h3 className="text-sm font-extrabold tracking-wide text-slate-700 mb-3">{t.aboutTitle}</h3>

                      <div className="space-y-3 text-[0.9375rem] leading-[1.85] text-slate-800 font-medium max-w-5xl break-keep">
                        <p>{t.aboutP1}</p>
                        <p>{t.aboutP2}</p>
                        <p>{t.aboutP3}</p>
                      </div>

                      <div className="mt-6 border-t border-slate-200 pt-4">
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
                    <div className="lg:sticky lg:top-20 bg-white/85 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
                      <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-5 overflow-hidden">
                        <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                      </div>

                      <h3 className="text-2xl font-black text-slate-900">Jihee Cho</h3>
                      <div className="text-sm font-bold text-slate-500 mt-1">{t.birthCity}</div>
                      <div className="text-sm font-bold text-[#355E8C] mb-5 mt-2">{t.role}</div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <IoLocationSharp className="text-lg text-slate-400" /> {t.location}
                        </div>
                        <a
                          href={`mailto:${LINKS.email}`}
                          className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-[#355E8C] hover:text-white hover:border-[#355E8C] transition"
                        >
                          <MdEmail className="text-lg" />
                          {LINKS.email}
                        </a>
                      </div>

                      <div className="pt-5 border-t border-slate-200">
                        <div className="text-xs font-black text-slate-700 tracking-wide mb-2">{t.skills}</div>
                        <div className="flex flex-wrap gap-2">
                          {ABOUT_SKILLS.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1.5 rounded-full text-[0.6875rem] font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 실무 하이라이트 - 3열 × 2행 */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{t.highlightsTitle}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t.highlightsSub}</p>
                  </div>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {HIGHLIGHTS[lang].map((h) => (
                      <HighlightCard key={h.title} h={h} approachLabel={t.approach} outcomeLabel={t.outcome} />
                    ))}
                  </div>
                </section>

                {/* Featured Projects - 전체 표시 */}
                {featured.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">{t.featuredProjects}</h3>
                      <button
                        onClick={() => setTab("Projects")}
                        className="text-sm font-extrabold text-[#355E8C] hover:underline underline-offset-4"
                      >
                        {t.viewAll}
                      </button>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {featured.map((p: any) => (
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
          <div className="bg-slate-200/60 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-slate-200/50 min-h-[clamp(24rem,52vw,40rem)]">
            <div className="space-y-8 px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-slate-900">{t.allProjects}</h2>
                <p className="text-sm text-slate-500 mt-1">{t.ndaNote}</p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("All")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition border",
                      filter === "All"
                        ? "bg-[#355E8C] text-white border-[#355E8C]"
                        : "bg-white text-slate-500 border-slate-300 hover:border-[#355E8C] hover:text-[#355E8C]"
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
                          ? "bg-[#355E8C] text-white border-[#355E8C]"
                          : "bg-white text-slate-500 border-slate-300 hover:border-[#355E8C] hover:text-[#355E8C]"
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
          <div className="bg-slate-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-slate-200/50 min-h-[clamp(24rem,52vw,40rem)]">
            <div className="w-full space-y-8 px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{t.caseStudies}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t.caseStudiesSub}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{t.ndaNote}</p>
                </div>
              </div>

              {detailsLoading ? (
                <div className="py-20 text-center text-slate-400">{t.loading}</div>
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
                          isOpen ? "border-[#355E8C] shadow-lg" : "border-slate-200 shadow-sm"
                        )}
                      >
                        {/* 아코디언 헤더 */}
                        <button
                          type="button"
                          onClick={() => setSelectedSlug(isOpen ? null : slug)}
                          className="w-full p-5 sm:p-6 flex items-center gap-4 text-left hover:bg-slate-50 transition"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#355E8C]/10 flex items-center justify-center text-[#355E8C] font-black shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-[#355E8C] bg-[#355E8C]/10 px-2 py-0.5 rounded">
                                {project.category}
                              </span>
                              {details.length > 0 && (
                                <span className="text-xs font-bold text-slate-400">
                                  {details.length} sections
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 truncate">
                              {lang === "ko" && project.titleKo ? project.titleKo : project.title}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
                              {lang === "ko" && project.oneLinerKo ? project.oneLinerKo : project.oneLiner}
                            </p>
                          </div>

                          <FaChevronDown
                            className={cn(
                              "text-slate-400 transition-transform duration-300 shrink-0",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {/* 아코디언 내용 */}
                        {isOpen && (
                          <div className="border-t border-slate-100 p-5 sm:p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* 프로젝트 링크 */}
                            <div className="flex flex-wrap gap-2">
                              {project.links?.map((link: any) => (
                                <a
                                  key={link.label}
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-[#355E8C] hover:text-white hover:border-[#355E8C] transition-colors"
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
                                      className="text-sm font-bold underline underline-offset-4 text-[#355E8C] hover:opacity-80"
                                    >
                                      {t.openFullPage}
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                  No sections have been added yet.
                                </div>
                              )
                            ) : (
                              <div className="space-y-4">
                                {details.map((section) => (
                                  <div
                                    key={section.id}
                                    className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
                                  >
                                    {section.image_url && (
                                      <div className="relative aspect-video bg-slate-200">
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
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#355E8C] outline-none"
                                            placeholder="Section title"
                                          />
                                          <textarea
                                            value={detailEditContent}
                                            onChange={(e) => setDetailEditContent(e.target.value)}
                                            rows={8}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none resize-none font-mono"
                                            placeholder="Content (Markdown supported)"
                                          />
                                          <input
                                            type="text"
                                            value={detailEditImageUrl}
                                            onChange={(e) => setDetailEditImageUrl(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none"
                                            placeholder="Image URL (optional)"
                                          />
                                          <input
                                            type="password"
                                            value={detailEditPassword}
                                            onChange={(e) => setDetailEditPassword(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none"
                                            placeholder="Password"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleUpdateDetail(section.id)}
                                              className="flex items-center gap-1 px-3 py-2 bg-[#355E8C] text-white rounded-lg text-xs font-bold"
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
                                              className="flex items-center gap-1 px-3 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-bold"
                                            >
                                              <MdCancel /> Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* 보기 모드 - 마크다운 렌더링 */
                                        <>
                                          <div className="flex items-start justify-between gap-3 mb-2">
                                            <h4 className="text-base font-black text-slate-900">
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
                                                className="p-1.5 text-slate-400 hover:text-[#355E8C] hover:bg-slate-100 rounded transition"
                                                title="Edit"
                                              >
                                                <MdEdit />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteDetail(section.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                                title="Delete"
                                              >
                                                <FaTrash className="text-xs" />
                                              </button>
                                            </div>
                                          </div>
                                          {/* 마크다운 렌더링 */}
                                          <div className="prose prose-stone prose-sm max-w-none text-slate-600">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                              {section.content}
                                            </ReactMarkdown>
                                          </div>
                                          <div className="mt-3 text-xs text-slate-400">
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
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FaPen className="text-[#355E8C] text-sm" /> Add a New Section
                  <span className="ml-auto text-xs font-medium text-slate-400">Markdown supported</span>
                </h3>

                <form onSubmit={handleAddDetail} className="space-y-4">
                  <select
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#355E8C] outline-none"
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
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none"
                    placeholder="Section title (e.g. Project Background, Tech Stack, Outcome)"
                  />

                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none resize-none font-mono"
                    placeholder="Write the content... (Markdown supported: **bold**, *italic*, - list, [link](url), ```code``` and more)"
                  />

                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none"
                    placeholder="Image URL (optional, e.g. /images/project.png)"
                  />

                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] outline-none"
                    placeholder="Password"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#355E8C] text-white font-bold rounded-xl hover:bg-[#28466B] transition shadow-md"
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
          <div className="bg-slate-100/80 pt-8 pb-10 px-0 rounded-b-xl border-x border-b border-slate-200/50 min-h-[clamp(24rem,52vw,40rem)]">
            <div className="w-full max-w-none space-y-8 px-4 sm:px-6 lg:px-10">
              {/* Top: Write (Left) + Image (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Write */}
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <FaPen className="text-[#355E8C] text-sm" /> {t.writePost}
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
                              ? "bg-[#355E8C] text-white border-[#355E8C]"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-[#355E8C] hover:text-[#355E8C]"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition"
                      placeholder={t.yourName}
                      required
                    />

                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      rows={8}
                      className="w-full flex-1 min-h-[clamp(9rem,18vw,14rem)] px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition resize-none"
                      placeholder={t.leaveMessage}
                      required
                    />

                    <input
                      type="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition"
                      placeholder={t.postPassword}
                      required
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#355E8C] text-white font-bold rounded-xl hover:bg-[#28466B] transition shadow-md duration-300 mt-auto"
                      disabled={loading}
                    >
                      Post Message
                    </button>
                  </form>
                </div>

                {/* Image */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
                    <div className="relative w-full aspect-[4/3]">
                      <Image src="/board.jpg" alt="Board" fill className="object-cover" priority={false} />
                    </div>
                    <div className="p-4 border-t border-slate-100">
                      <div className="text-sm font-black text-slate-800">{t.board}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Guestbook / Q&amp;A posts are listed below.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Header + Filter */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <MdArticle className="text-[#355E8C]" /> Recent Posts
                </h3>

                <div className="flex flex-wrap gap-2 items-center">
                  {(["All", "Guestbook", "Q&A"] as BoardFilter[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setBoardFilter(c)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition border",
                        boardFilter === c
                          ? "bg-[#355E8C] text-white border-[#355E8C]"
                          : "bg-white text-slate-500 border-slate-300 hover:border-[#355E8C] hover:text-[#355E8C]"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              {loading ? (
                <div className="py-20 text-center text-slate-400">{t.loading}</div>
              ) : boardError ? (
                <div className="py-16 text-center">
                  <div className="text-sm font-bold text-slate-600">{boardError}</div>
                  <div className="mt-2 text-xs text-slate-400">
                    잠시 후 다시 시도해 주세요.
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-16 text-center text-slate-400">{t.noPosts}</div>
              ) : (
                <div className="space-y-4">
                  {pagePosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-4 items-center gap-3">
                        <div className="flex gap-3 items-center">
                          <FaUserCircle className="text-slate-300 text-3xl" />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{post.author}</span>
                              <span
                                className={cn(
                                  "text-[0.625rem] font-bold px-2.5 py-1 rounded-full border",
                                  post.category === "Q&A"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : "bg-[#355E8C]/10 text-[#355E8C] border-[#355E8C]/20"
                                )}
                              >
                                {post.category}
                              </span>
                            </div>

                            <div className="text-xs text-slate-400">
                              {new Date(post.created_at).toLocaleDateString()}
                              {post.updated_at && (
                                <span className="ml-2 text-slate-300">
                                  (updated {new Date(post.updated_at).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-slate-400">#{post.id}</div>
                      </div>

                      <p className="text-sm text-slate-700 pl-11 leading-relaxed whitespace-pre-wrap break-words">
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
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition resize-none"
                            />

                            <input
                              type="password"
                              value={getPw(post.id)}
                              onChange={(e) => setPw(post.id, e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition"
                              placeholder="Password to save"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdate(post)}
                                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#355E8C] text-white"
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
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-600"
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
                              className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#355E8C] focus:border-transparent outline-none transition"
                              placeholder="Password for edit/delete"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditId(post.id);
                                  setEditContent(post.content);
                                }}
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(post)}
                                className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
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
                          ? "text-slate-300 border-slate-200 bg-slate-50"
                          : "text-slate-700 border-slate-300 bg-white hover:border-[#355E8C] hover:text-[#355E8C]"
                      )}
                    >
                      ←
                    </button>

                    <div className="text-sm font-bold text-slate-600">
                      {page} / {totalPages}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-bold",
                        page >= totalPages
                          ? "text-slate-300 border-slate-200 bg-slate-50"
                          : "text-slate-700 border-slate-300 bg-white hover:border-[#355E8C] hover:text-[#355E8C]"
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

      <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-xs font-medium text-slate-500">
        © {new Date().getFullYear()} Jihee Cho. All rights reserved.
      </footer>
    </div>
  );
}
