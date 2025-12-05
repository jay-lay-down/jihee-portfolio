// app/projects/data.ts

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  category: "LLM" | "Segmentation" | "Bayesian" | "Forecasting" | "Other";
  featured?: boolean;
  stack: string[];
  links: ProjectLink[];
  cover?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "ddolbae",
    title: "🤖 AI/LLM-powered Analytics Chatbot",
    oneLiner: "Persona fine-tuning + quantization 기반 self-hosting",
    category: "LLM",
    featured: true,
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "HF Hub", "Gradio"],
    cover: "/im2.jpg", // ilya-pavlov
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/jaychatbot_2nd" },
      { label: "Demo", href: "http://www.duboobanmo.site" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/series/side-project-1" },
    ],
  },
  {
    slug: "animal-test",
    title: "🐾 Social Animal Type Test",
    oneLiner: "11가지 사회적 동물 유형 테스트: 설계–채점–UI-배포 수행",
    category: "Other",
    featured: true,
    stack: ["Python", "Gradio", "HTML/CSS", "HF Spaces"],
    cover: "/im1.jpg", // joanna-kosinska
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/animal_test" },
      { label: "Demo", href: "https://myanimaltest.site/" },
      { label: "Space", href: "https://huggingface.co/spaces/Jay1121/animal_test" },
    ],
  },
  {
    slug: "auto-segment-tool",
    title: "🔧 Auto Segment Tool (EXE)",
    oneLiner: "데이터 로딩→PCA→Decision Tree→Segment 시각화 + AI Assistant + 자동 리포트 GUI 툴 개발",
    category: "Segmentation",
    featured: true,
    stack: ["Python", "PySide6", "scikit-learn", "Pandas", "PyInstaller"],
    cover: "/im3.jpg", // hal-gatewood
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/auto_segment" },
      { label: "Download", href: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download" },
    ],
  },
  {
    slug: "bayesian-dashboard",
    title: "🌐 Bayesian Modeling & Dashboard",
    oneLiner: "계층적 베이지안을 통한 Funnel 분석 + 대시보드(불확실성 기반 해석)",
    category: "Bayesian",
    featured: true,
    stack: ["Python", "PyMC", "ArviZ", "pandas", "Plotly/Dash"],
    cover: "/im4.jpg", // carlos-muza
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_dashboard" },
      { label: "Dashboard", href: "https://jay1121-bayesian-dashboard.hf.space" },
    ],
  },
  {
    slug: "bayesian-norms",
    title: "📈 Brand Image Evaluation (Bayesian)",
    oneLiner: "소셜+설문 결합 & 데이터 증강 기반 브랜드 이미지 평가 대시보드",
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
    oneLiner: "SARIMAX 파이프라인 + R 패키지 개발(MAPE 0.9~7.5%)",
    category: "Forecasting",
    featured: true,
    stack: ["R", "forecast", "caret", "devtools", "roxygen2"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/demand_forecasting" },
      { label: "Slides", href: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf" },
    ],
  },
  {
    slug: "brand-share-forecasting",
    title: "☑ Brand Share% Forecasting",
    oneLiner: "Softmax 최적화 + LSTM(Additive Attention)로 점유율 예측",
    category: "Forecasting",
    stack: ["Python", "TensorFlow", "LSTM", "Attention", "NumPy"],
    links: [{ label: "Repo", href: "https://github.com/jay-lay-down/seq2seq_softmax" }],
  },
  {
    slug: "employee-engagement",
    title: "👥 Drivers of Employee Engagement",
    oneLiner: "LPA로 조직 이탈/미이탈 패턴 세분화 → 실행 가능한 조직 전략 도출",
    category: "Segmentation",
    stack: ["R", "lavaan", "tidyLPA/mclust"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/LPA_synthetic_vars" },
      { label: "Slides", href: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf" },
    ],
  },
  {
    slug: "other-projects",
    title: "🔢 Other Projects Archive",
    oneLiner: "소셜마이닝/제안서 등 다양한 프로젝트 슬라이드 모음",
    category: "Other",
    stack: ["Slides", "PDF"],
    links: [{ label: "Slides PDF", href: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf" }],
  },
];
