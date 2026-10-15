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
  category: "Consumer Research" | "Market Intelligence" | "Survey & Psychometrics" | "AI Side Project";
  featured?: boolean;
  stack: string[];
  links: ProjectLink[];
  cover?: string;
};

// 소비자 조사 → 시장 인텔리전스 → 설문/심리측정 → AI 사이드 프로젝트 순서
export const PROJECTS: Project[] = [
  {
    slug: "auto-segment-tool",
    title: "🧭 Consumer Segmentation & Demand Space Tool",
    titleKo: "🧭 소비자 세그먼테이션 & Demand Space 도구",
    oneLiner: "Desktop tool that automates the full consumer segmentation workflow, from survey recoding and factor analysis to decision trees and a Demand Space map (project time cut by about 30%)",
    oneLinerKo: "설문 리코딩, 요인분석, 의사결정나무, Demand Space 맵까지 소비자 세분화 전 과정을 자동화한 도구 (프로젝트 소요 시간 약 30% 단축)",
    category: "Consumer Research",
    featured: true,
    stack: ["Segmentation", "Demand Space", "PCA/EFA", "Decision Tree", "Python", "RAG"],
    cover: "/im3.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/auto_segment" },
      { label: "Download", href: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download" },
    ],
  },
  {
    slug: "text-mining-tool",
    title: "📝 VoC Text Mining Tool (EXE)",
    titleKo: "📝 VoC 텍스트마이닝 자동화 도구 (EXE)",
    oneLiner: "Nine-tab desktop pipeline that takes consumer buzz and review data from Excel through tokenization, word clouds, co-occurrence networks and sentiment into one export",
    oneLinerKo: "소비자 버즈와 리뷰 데이터를 전처리부터 감성분석까지 9개 탭으로 처리하는 정량분석 파이프라인, 결과는 엑셀 한 파일로",
    category: "Consumer Research",
    featured: true,
    cover: "/textmining.jpg",
    stack: ["VoC", "Sentiment", "Co-occurrence Network", "Kiwi", "VADER", "PyQt5"],
    links: [{ label: "Case Study", href: "/projects/text-mining-tool" }],
  },
  {
    slug: "bayesian-norms",
    title: "📈 Brand Image Evaluation: Reviews + Survey",
    titleKo: "📈 리뷰와 설문을 결합한 브랜드 이미지 평가",
    oneLiner: "Brand image scoring that uses online reviews as the prior and survey responses as the likelihood, keeping adjective-level scores stable even with small samples",
    oneLinerKo: "온라인 리뷰(정성)를 사전 정보로, 설문(정량)을 관측치로 결합해 소표본에서도 안정적인 형용사 단위 브랜드 이미지 점수 산출",
    category: "Consumer Research",
    featured: true,
    stack: ["Brand Image", "Review Mining", "Survey", "Bayesian", "PyMC", "VBA"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_norm" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm" },
    ],
  },
  {
    slug: "bayesian-dashboard",
    title: "🌐 Purchase Funnel Diagnosis Dashboard",
    titleKo: "🌐 구매 퍼널 진단 대시보드",
    oneLiner: "Hierarchical Bayesian model of the preference, recommendation, purchase intent and purchase funnel that shows where each consumer group drops off, with uncertainty",
    oneLinerKo: "선호, 추천, 구매의향, 실제구매 4단계 퍼널의 병목을 소비자 그룹별로 불확실성과 함께 진단하는 계층 베이지안 대시보드",
    category: "Consumer Research",
    featured: true,
    stack: ["Purchase Funnel", "Consumer Segments", "Bayesian", "PyMC", "Plotly/Dash"],
    cover: "/im4.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/bayesian_dashboard" },
      { label: "Dashboard", href: "https://jay1121-bayesian-dashboard.hf.space" },
    ],
  },
  {
    slug: "other-projects",
    title: "🗂️ VoC Mining & Research Design Archive",
    titleKo: "🗂️ VoC 마이닝 & 조사 설계 아카이브",
    oneLiner: "Slides covering social VoC text mining, survey scale development with factor and reliability analysis, and research proposal design",
    oneLinerKo: "소셜 VoC 텍스트마이닝, 설문척도 개발(요인분석, 신뢰도 검증), 조사 제안서 설계 슬라이드 모음",
    category: "Consumer Research",
    featured: true,
    stack: ["VoC", "Text Mining", "Scale Development", "Proposal", "Slides"],
    links: [{ label: "Slides PDF", href: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf" }],
  },
  {
    slug: "geo-ai-writing",
    title: "✍️ GEO: Brand Citation in AI Search",
    titleKo: "✍️ GEO: AI 검색 브랜드 인용 최적화",
    oneLiner: "Measured how a major financial holding company was cited in generative AI answers to consumer questions and optimized 141 content touchpoints; citation rate 0% → 30.7% in 6 weeks (client masked)",
    oneLinerKo: "생성형 AI 검색에서 소비자 질문에 대한 브랜드 인용을 측정하고 콘텐츠 141개 지점을 최적화, 6주 만에 인용률 0% → 30.7% (고객사 마스킹)",
    category: "Market Intelligence",
    featured: true,
    stack: ["GEO/AEO", "AI Search", "Consumer Questions", "Embeddings", "KPI Tracking"],
    links: [{ label: "Case Study", href: "/projects/geo-ai-writing" }],
  },
  {
    slug: "demand-forecasting",
    title: "📊 Market Demand Forecasting Pipeline",
    titleKo: "📊 가전시장 수요예측 파이프라인",
    oneLiner: "SARIMAX demand forecasting that selects useful drivers from 85 market indicators, adopted as the team's standard method (MAPE 0.9 to 7.5%)",
    oneLinerKo: "시장 지표 85개 중 유효 변수를 골라 쓰는 SARIMAX 수요예측, 부서 표준 방법론으로 정착 (MAPE 0.9~7.5%)",
    category: "Market Intelligence",
    featured: true,
    cover: "/demand.jpg",
    stack: ["Time Series", "SARIMAX", "Granger", "R", "R Package"],
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
    category: "Market Intelligence",
    stack: ["Brand Share", "Python", "TensorFlow", "LSTM", "Attention"],
    links: [{ label: "Repo", href: "https://github.com/jay-lay-down/seq2seq_softmax" }],
  },
  {
    slug: "employee-engagement",
    title: "👥 Drivers of Employee Engagement",
    titleKo: "👥 직원 몰입 드라이버 분석",
    oneLiner: "Latent profile analysis of survey responses that segments engagement and attrition patterns into groups with tailored strategies",
    oneLinerKo: "설문 응답을 잠재프로파일분석(LPA)으로 세분화해 몰입/이탈 유형별 관리 전략 도출",
    category: "Survey & Psychometrics",
    featured: true,
    cover: "/satis.jpg",
    stack: ["Survey", "LPA", "R", "lavaan", "tidyLPA/mclust"],
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/LPA_synthetic_vars" },
      { label: "Slides", href: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf" },
    ],
  },
  {
    slug: "animal-test",
    title: "🐾 Social Animal Type Test",
    titleKo: "🐾 사회적 동물 유형 테스트",
    oneLiner: "An 11-type social persona test built end to end, from psychometric item design and scoring logic to web deployment and response collection",
    oneLinerKo: "심리 측정 문항 설계와 채점 로직부터 웹 배포, 응답 데이터 수집까지 직접 만든 11가지 유형 테스트",
    category: "Survey & Psychometrics",
    featured: true,
    stack: ["Psychometrics", "Item Design", "Python", "Gradio", "HF Spaces"],
    cover: "/im1.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/animal_test" },
      { label: "Demo", href: "https://myanimaltest.site/" },
      { label: "Space", href: "https://huggingface.co/spaces/Jay1121/animal_test" },
    ],
  },
  {
    slug: "ddolbae",
    title: "🤖 AI/LLM-powered Analytics Chatbot",
    titleKo: "🤖 AI/LLM 페르소나 챗봇",
    oneLiner: "Self-hosted analytics assistant built with persona fine-tuning and quantization",
    oneLinerKo: "페르소나 파인튜닝과 양자화로 만든 셀프호스팅 분석 어시스턴트",
    category: "AI Side Project",
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "HF Hub", "Gradio"],
    cover: "/im2.jpg",
    links: [
      { label: "Repo", href: "https://github.com/jay-lay-down/jaychatbot_2nd" },
      { label: "Demo", href: "http://www.duboobanmo.site" },
      { label: "Blog", href: "https://velog.io/@jaylaydown/series/side-project-1" },
    ],
  },
];
