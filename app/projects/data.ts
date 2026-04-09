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
    oneLiner: "Self-hosted analytics assistant built with persona fine-tuning and quantization",
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
    oneLiner: "An 11-type social persona test built end to end from scoring logic to UI and deployment",
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
    oneLiner: "GUI automation tool covering data loading, PCA, decision-tree segmentation, AI assistance, and auto-reporting",
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
    oneLiner: "Hierarchical Bayesian funnel analysis with a dashboard built for uncertainty-aware interpretation",
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
    oneLiner: "Brand image evaluation dashboard combining social and survey data with augmentation-driven insights",
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
    oneLiner: "SARIMAX forecasting pipeline and R package development with MAPE ranging from 0.9% to 7.5%",
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
    oneLiner: "Brand share forecasting using Softmax optimization and seq2seq LSTM with additive attention",
    category: "Forecasting",
    stack: ["Python", "TensorFlow", "LSTM", "Attention", "NumPy"],
    links: [{ label: "Repo", href: "https://github.com/jay-lay-down/seq2seq_softmax" }],
  },
  {
    slug: "employee-engagement",
    title: "👥 Drivers of Employee Engagement",
    oneLiner: "LPA-based segmentation of retention and attrition patterns to guide actionable organizational strategy",
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
    oneLiner: "A slide archive covering social mining, proposals, and a range of additional project work",
    category: "Other",
    stack: ["Slides", "PDF"],
    links: [{ label: "Slides PDF", href: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf" }],
  },
];
