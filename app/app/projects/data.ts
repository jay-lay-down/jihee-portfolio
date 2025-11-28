import type { Project } from "@/components/ProjectCard";

export const PROJECTS: Project[] = [
  {
    slug: "ddolbae",
    title: "🤖 AI/LLM-powered Analytics Chatbot",
    oneLiner: "Persona fine-tuning + quantization으로 self-hosting 데모(운영비 최소화)",
    category: "LLM",
    featured: true,
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "bitsandbytes", "Hugging Face Hub", "Gradio"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/jaychatbot_2nd" },
      { label: "Demo", href: "http://www.duboobanmo.site" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/series/side-project-1" },
    ],
  },
  {
    slug: "animal-test",
    title: "🐾 Social Animal Type Test",
    oneLiner: "11가지 사회적 동물 유형 테스트: 설계–채점–UI/UX–배포 end-to-end",
    category: "Other",
    featured: true,
    stack: ["Python", "Gradio", "HTML/CSS", "Hugging Face Spaces"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/animal_test" },
      { label: "Demo", href: "https://myanimaltest.site/" },
      { label: "Space", href: "https://huggingface.co/spaces/Jay1121/animal_test" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%8B%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%8F%99%EB%AC%BC-%EC%9C%A0%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8" },
    ],
  },
  {
    slug: "auto-segment-tool",
    title: "🔧 Auto Segment Tool – Desktop Application (EXE)",
    oneLiner: "Data loading → PCA → Decision Tree segmentation → Excel 리포트 자동화 GUI",
    category: "Segmentation",
    featured: true,
    stack: ["Python", "PySide6", "scikit-learn", "Pandas", "Excel Automation", "PyInstaller"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/auto_segment" },
    ],
  },
  {
    slug: "bayesian-dashboard",
    title: "🌐 Bayesian Modeling & Dashboard",
    oneLiner: "계층적 베이지안으로 선호→추천→구매의도→전환 분석 + 대시보드",
    category: "Bayesian",
    featured: true,
    stack: ["Python", "PyMC", "ArviZ", "pandas", "NumPy", "Plotly/Dash"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_dashboard" },
      { label: "Dashboard", href: "https://jay1121-bayesian-dashboard.hf.space" },
    ],
  },
  {
    slug: "bayesian-norms",
    title: "📈 Brand Image Evaluation with Bayesian Norms",
    oneLiner: "소셜+설문 결합 + 데이터 증강 기반 브랜드 이미지 평가/대시보드",
    category: "Bayesian",
    stack: ["Python", "pandas", "scikit-learn", "KoNLPy/spaCy", "PyMC", "VBA"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_norm" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm" },
      { label: "Dashboard", href: "https://github.com/jay-lay-down/bayesian_norm/blob/main/assets/bayesian_norm_fin.xlsm" },
    ],
  },
  {
    slug: "demand-forecasting",
    title: "📊 Demand Forecasting",
    oneLiner: "SARIMAX 파이프라인 + R 패키지 개발로 예측 안정성/정확도 개선",
    category: "Forecasting",
    featured: true,
    stack: ["R", "forecast", "caret", "tseries", "lmtest", "devtools", "usethis", "roxygen2", "testthat"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/demand_forecasting" },
      { label: "Slides", href: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf" },
    ],
  },
  {
    slug: "brand-share-forecasting",
    title: "☑ Brand Share% Forecasting (Seq2Seq LSTM)",
    oneLiner: "Softmax 최적화 + seq2seq LSTM(Attention)으로 점유율 시퀀스 예측",
    category: "Forecasting",
    stack: ["Python", "TensorFlow/Keras", "LSTM seq2seq", "Additive Attention", "pandas", "NumPy"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/seq2seq_softmax" },
    ],
  },
  {
    slug: "employee-engagement-lpa",
    title: "👥 Drivers of Employee Engagement (LPA)",
    oneLiner: "Latent Profile Analysis로 직원 몰입/이탈 패턴 세분화 → 전략 권고",
    category: "Segmentation",
    stack: ["R", "lavaan", "tidyLPA", "mclust"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/LPA_synthetic_vars" },
      { label: "Slides", href: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf" },
    ],
  },
  {
    slug: "other-projects",
    title: "🔢 Other Projects (Slides Collection)",
    oneLiner: "소셜마이닝/제안서 등 다양한 프로젝트 슬라이드 모음",
    category: "Other",
    stack: ["Slides", "Research", "Proposal"],
    links: [
      { label: "Slides", href: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf" },
    ],
  },
];
