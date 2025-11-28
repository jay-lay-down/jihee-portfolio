export type Category = "LLM" | "Bayesian" | "Forecasting" | "Segmentation" | "Other";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  category: Category;
  stack: string[];
  featured?: boolean;
  repo?: string;
  demo?: string;
  blog?: string;
  cover?: string; // optional thumbnail path in /public
};

export const PROJECTS: Project[] = [
  {
    slug: "ddolbae",
    title: "AI/LLM-powered Analytics Chatbot",
    oneLiner: "Persona fine-tuning + quantization 기반 self-hosting, 운영비 절감",
    category: "LLM",
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "bitsandbytes", "HF Hub", "Gradio"],
    featured: true,
    repo: "https://github.com/jay-lay-down/jaychatbot_2nd",
    demo: "http://www.duboobanmo.site",
    blog: "https://velog.io/@jaylaydown/series/side-project-1",
    // cover: "/covers/ddolbae.jpg",
  },
  {
    slug: "animal-test",
    title: "Social Animal Type Test",
    oneLiner: "메타인지+상황판단 기반 11유형 웹 테스트(설계-채점-UI/UX-배포 end-to-end)",
    category: "Other",
    stack: ["Python", "Gradio", "HTML/CSS", "Hugging Face Spaces"],
    featured: true,
    repo: "https://github.com/jay-lay-down/animal_test",
    demo: "https://myanimaltest.site/",
    blog: "https://velog.io/@jaylaydown/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%8B%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%8F%99%EB%AC%BC-%EC%9C%A0%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    // cover: "/covers/animal.jpg",
  },
  {
    slug: "auto-segment",
    title: "Auto Segment Tool (Desktop EXE)",
    oneLiner: "PCA → Decision Tree segmentation → 시각화/Excel 리포트 자동 생성 GUI",
    category: "Segmentation",
    stack: ["Python", "PySide6", "scikit-learn", "pandas", "PyInstaller"],
    featured: true,
    repo: "https://github.com/jay-lay-down/auto_segment",
    demo: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download",
    // cover: "/covers/auto-segment.jpg",
  },
  {
    slug: "bayesian-dashboard",
    title: "Bayesian Modeling & Dashboard",
    oneLiner: "계층적 베이지안으로 선호→추천→구매의도 전환 분석 + 대시보드",
    category: "Bayesian",
    stack: ["Python", "PyMC", "ArviZ", "pandas", "Plotly/Dash"],
    repo: "https://github.com/jay-lay-down/bayesian_dashboard",
    demo: "https://jay1121-bayesian-dashboard.hf.space",
    // cover: "/covers/bayes-dashboard.jpg",
  },
  {
    slug: "bayesian-norm",
    title: "Brand Image Evaluation with Bayesian Norms",
    oneLiner: "소셜+설문 결합 데이터 증강 기반 브랜드 이미지 평가/대시보드",
    category: "Bayesian",
    stack: ["Python", "NLP", "PyMC", "VBA"],
    repo: "https://github.com/jay-lay-down/bayesian_norm",
    blog: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm",
    // cover: "/covers/bayes-norm.jpg",
  },
  {
    slug: "demand-forecasting",
    title: "Demand Forecasting",
    oneLiner: "MDA 시장 지표로 수요 예측(SARIMAX) + R 패키지화",
    category: "Forecasting",
    stack: ["R", "forecast", "caret", "tseries", "lmtest"],
    repo: "https://github.com/jay-lay-down/demand_forecasting",
    demo: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf",
    // cover: "/covers/demand-forecasting.jpg",
  },
  {
    slug: "seq2seq-share",
    title: "Brand Share% Forecasting (seq2seq)",
    oneLiner: "Softmax 최적화 + seq2seq LSTM + Attention으로 점유율 예측",
    category: "Forecasting",
    stack: ["Python", "TensorFlow/Keras", "LSTM", "Attention", "NumPy", "pandas"],
    repo: "https://github.com/jay-lay-down/seq2seq_softmax",
    // cover: "/covers/seq2seq.jpg",
  },
  {
    slug: "lpa-engagement",
    title: "Drivers of Employee Engagement (LPA)",
    oneLiner: "LPA로 직원 몰입/이직 패턴 세그먼트화 → 실행 전략 도출",
    category: "Segmentation",
    stack: ["R", "lavaan", "tidyLPA", "mclust"],
    repo: "https://github.com/jay-lay-down/LPA_synthetic_vars",
    demo: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf",
    // cover: "/covers/lpa.jpg",
  },
  {
    slug: "other-slides",
    title: "Other Projects (Slides)",
    oneLiner: "다양한 프로젝트 슬라이드/자료 모음",
    category: "Other",
    stack: ["Slides"],
    demo: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf",
    // cover: "/covers/others.jpg",
  },
];
