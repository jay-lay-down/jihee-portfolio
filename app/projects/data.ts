// app/projects/data.ts

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  titleKo?: string;
  oneLiner: string;
  oneLinerKo?: string;
  category: "GEO" | "LLM" | "Segmentation" | "Bayesian" | "Forecasting" | "Other";
  featured?: boolean;
  stack: string[];
  links: ProjectLink[];
  cover?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "geo-ai-visibility",
    title: "🔍 GEO Strategy for AI Search Visibility",
    titleKo: "🔍 AI 검색 가시성 GEO 전략",
    oneLiner: "Prompt-first GEO strategy for a leading digital bank — demand-validated prompts, clustering-driven content design, and citation-rate tracking (client masked)",
    oneLinerKo: "프롬프트 퍼스트 GEO 전략 — 수요 검증 프롬프트, 클러스터링 기반 콘텐츠 설계, 인용률 트래킹 (고객사 마스킹)",
    category: "GEO",
    featured: true,
    stack: ["GEO/AEO", "Prompt Design", "Search Ads API", "Embeddings", "Clustering", "KPI Tracking"],
    cover: "/geo_result.png",
    links: [{ label: "Case Study", href: "/projects/geo-ai-visibility" }],
  },
  {
    slug: "geo-ai-writing",
    title: "✍️ AI Writing — Embedding-guided Content Optimization",
    titleKo: "✍️ AI Writing 임베딩 유사도 콘텐츠 최적화",
    oneLiner: "Optimized 141 content touchpoints for a major financial holding company — citation rate 0% → 30.7% in 6 weeks (client masked)",
    oneLinerKo: "대형 금융지주 콘텐츠 141개 지점 최적화 — 6주 만에 인용률 0% → 30.7% (고객사 마스킹)",
    category: "GEO",
    featured: true,
    stack: ["GEO/AEO", "AI Writing", "Embeddings", "Similarity Scoring", "KPI Tracking"],
    links: [{ label: "Case Study", href: "/projects/geo-ai-writing" }],
  },
  {
    slug: "ddolbae",
    title: "🤖 AI/LLM-powered Analytics Chatbot",
    titleKo: "🤖 AI/LLM 페르소나 챗봇",
    oneLiner: "Self-hosted analytics assistant built with persona fine-tuning and quantization",
    oneLinerKo: "페르소나 파인튜닝과 양자화로 만든 셀프호스팅 분석 어시스턴트",
    category: "LLM",
    featured: true,
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "HF Hub", "Gradio"],
    cover: "/im2.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/jaychatbot_2nd" },
      { label: "Demo", href: "http://www.duboobanmo.site" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/series/side-project-1" },
    ],
  },
  {
    slug: "animal-test",
    title: "🐾 Social Animal Type Test",
    titleKo: "🐾 사회적 동물 유형 테스트",
    oneLiner: "An 11-type social persona test built end to end from scoring logic to UI and deployment",
    oneLinerKo: "채점 로직부터 UI·배포까지 직접 만든 11가지 사회적 페르소나 테스트",
    category: "Other",
    featured: true,
    stack: ["Python", "Gradio", "HTML/CSS", "HF Spaces"],
    cover: "/im1.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/animal_test" },
      { label: "Demo", href: "https://myanimaltest.site/" },
      { label: "Space", href: "https://huggingface.co/spaces/Jay1121/animal_test" },
    ],
  },
  {
    slug: "auto-segment-tool",
    title: "🔧 Auto Segment Tool (EXE)",
    titleKo: "🔧 세그먼트 자동화 도구 (EXE)",
    oneLiner: "GUI automation tool covering data loading, PCA, decision-tree segmentation, AI assistance, and auto-reporting",
    oneLinerKo: "데이터 로딩, PCA, 의사결정나무 세분화, AI 어시스턴트, 자동 리포트까지 담은 GUI 자동화 도구",
    category: "Segmentation",
    featured: true,
    stack: ["Python", "PySide6", "scikit-learn", "Pandas", "PyInstaller"],
    cover: "/im3.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/auto_segment" },
      { label: "Download", href: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download" },
    ],
  },
  {
    slug: "bayesian-dashboard",
    title: "🌐 Bayesian Modeling & Dashboard",
    titleKo: "🌐 베이지안 모델링 & 대시보드",
    oneLiner: "Hierarchical Bayesian funnel analysis with a dashboard built for uncertainty-aware interpretation",
    oneLinerKo: "불확실성을 고려해 해석하는 계층 베이지안 퍼널 분석 대시보드",
    category: "Bayesian",
    featured: true,
    stack: ["Python", "PyMC", "ArviZ", "pandas", "Plotly/Dash"],
    cover: "/im4.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_dashboard" },
      { label: "Dashboard", href: "https://jay1121-bayesian-dashboard.hf.space" },
    ],
  },
  {
    slug: "bayesian-norms",
    title: "📈 Brand Image Evaluation (Bayesian)",
    titleKo: "📈 브랜드 이미지 평가 (베이지안)",
    oneLiner: "Brand image evaluation dashboard combining social and survey data with augmentation-driven insights",
    oneLinerKo: "소셜+설문 데이터 증강 기반 브랜드 이미지 평가 대시보드",
    category: "Bayesian",
    stack: ["Python", "pandas", "scikit-learn", "PyMC", "VBA"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_norm" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm" },
    ],
  },
  {
    slug: "demand-forecasting",
    title: "📊 Demand Forecasting Pipeline",
    titleKo: "📊 수요예측 파이프라인",
    oneLiner: "SARIMAX forecasting pipeline and R package development with MAPE ranging from 0.9% to 7.5%",
    oneLinerKo: "SARIMAX 예측 파이프라인 + R 패키지 개발 (MAPE 0.9~7.5%)",
    category: "Forecasting",
    featured: true,
    cover: "/demand.jpg",
    stack: ["R", "forecast", "caret", "devtools", "roxygen2"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/demand_forecasting" },
      { label: "Slides", href: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf" },
    ],
  },
  {
    slug: "brand-share-forecasting",
    title: "☑ Brand Share% Forecasting",
    titleKo: "☑ 브랜드 점유율 예측",
    oneLiner: "Brand share forecasting using Softmax optimization and seq2seq LSTM with additive attention",
    oneLinerKo: "Softmax 최적화와 additive attention 결합 seq2seq LSTM 점유율 예측",
    category: "Forecasting",
    stack: ["Python", "TensorFlow", "LSTM", "Attention", "NumPy"],
    links: [{ label: "Repo", href: "https://github.com/jay-lay-down/seq2seq_softmax" }],
  },
  {
    slug: "employee-engagement",
    title: "👥 Drivers of Employee Engagement",
    titleKo: "👥 직원 몰입 드라이버 분석",
    oneLiner: "LPA-based segmentation of retention and attrition patterns to guide actionable organizational strategy",
    oneLinerKo: "LPA 기반 몰입·이탈 패턴 세분화로 실행 가능한 조직 전략 도출",
    category: "Segmentation",
    featured: true,
    cover: "/satis.jpg",
    stack: ["R", "lavaan", "tidyLPA/mclust"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/LPA_synthetic_vars" },
      { label: "Slides", href: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf" },
    ],
  },
  {
    slug: "other-projects",
    title: "🔢 Other Projects Archive",
    titleKo: "🔢 기타 프로젝트 모음",
    oneLiner: "A slide archive covering social mining, proposals, and a range of additional project work",
    oneLinerKo: "소셜 마이닝, 제안서 등 다양한 프로젝트 슬라이드 아카이브",
    category: "Other",
    stack: ["Slides", "PDF"],
    links: [{ label: "Slides PDF", href: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf" }],
  },
];
