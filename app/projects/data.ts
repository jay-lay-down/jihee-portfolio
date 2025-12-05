export type Category = "LLM" | "Forecasting" | "Bayesian" | "Segmentation" | "Other";

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
  cover?: string; // 예: "/covers/auto-segment.jpg" (public 아래)
};

export const PROJECTS: Project[] = [
  {
    slug: "ddolbae-chatbot",
    title: "AI/LLM-powered Analytics Chatbot",
    oneLiner: "Persona fine-tuning + self-hosting (QLoRA/Quantization)",
    category: "LLM",
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "bitsandbytes", "Gradio", "HF Hub"],
    featured: true,
    repo: "https://github.com/jay-lay-down/jaychatbot_2nd",
    demo: "http://www.duboobanmo.site",
    blog: "https://velog.io/@jaylaydown/series/side-project-1",
    // cover: "/covers/ddolbae.jpg",
  },
  {
    slug: "social-animal-test",
    title: "Social Animal Type Test",
    oneLiner: "Metacognition & situation-reading type test (11 types) with real deployment",
    category: "Other",
    stack: ["Python", "Gradio", "HTML/CSS", "Hugging Face Spaces"],
    featured: true,
    repo: "https://github.com/jay-lay-down/animal_test",
    demo: "https://myanimaltest.site/",
    blog: "https://velog.io/@jaylaydown/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%8B%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%8F%99%EB%AC%BC-%EC%9C%A0%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    // cover: "/covers/animal.jpg",
  },
  {
    slug: "auto-segment-tool",
    title: "Auto Segment Tool (Desktop EXE)",
    oneLiner: "Data → PCA/FA → Decision Tree Segmentation → Visualization → Excel report automation",
    category: "Segmentation",
    stack: ["Python", "PySide6", "scikit-learn", "pandas", "Excel automation", "PyInstaller"],
    featured: true,
    repo: "https://github.com/jay-lay-down/auto_segment",
    demo: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download",
    // cover: "/covers/auto-segment.jpg",
  },
  {
    slug: "bayesian-modeling-dashboard",
    title: "Bayesian Modeling & Dashboard",
    oneLiner: "Hierarchical Bayesian funnel (Preference → Recommend → Intent → Purchase) dashboard",
    category: "Bayesian",
    stack: ["Python", "PyMC", "ArviZ", "pandas", "NumPy", "Plotly/Dash"],
    featured: true,
    repo: "https://github.com/jay-lay-down/bayesian_dashboard",
    demo: "https://jay1121-bayesian-dashboard.hf.space",
    // cover: "/covers/bayes-dashboard.jpg",
  },
  {
    slug: "bayesian-norms",
    title: "Brand Image Evaluation with Bayesian Norms",
    oneLiner: "Social + survey augmentation → Bayesian norms & dashboard",
    category: "Bayesian",
    stack: ["Python", "pandas", "scikit-learn", "KoNLPy/spaCy", "PyMC", "VBA"],
    repo: "https://github.com/jay-lay-down/bayesian_norm",
    blog: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm",
    demo: "https://github.com/jay-lay-down/bayesian_norm/blob/main/assets/bayesian_norm_fin.xlsm",
    // cover: "/covers/bayes-norm.jpg",
  },
  {
    slug: "demand-forecasting",
    title: "Demand Forecasting",
    oneLiner: "MDA market indicators → SARIMAX pipeline + R package development",
    category: "Forecasting",
    stack: ["R", "forecast", "caret", "tseries", "lmtest", "devtools", "roxygen2", "testthat"],
    repo: "https://github.com/jay-lay-down/demand_forecasting",
    demo: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf",
    // cover: "/covers/forecast.jpg",
  },
  {
    slug: "brand-share-forecasting",
    title: "Brand Share% Forecasting",
    oneLiner: "Softmax optimization + seq2seq LSTM (additive attention) for competitive share forecasting",
    category: "Forecasting",
    stack: ["Python", "TensorFlow/Keras", "LSTM seq2seq", "Additive Attention", "pandas", "NumPy"],
    repo: "https://github.com/jay-lay-down/seq2seq_softmax",
    // cover: "/covers/share.jpg",
  },
  {
    slug: "employee-engagement-lpa",
    title: "Drivers of Employee Engagement",
    oneLiner: "Latent Profile Analysis (LPA) → actionable segments for retention strategy",
    category: "Segmentation",
    stack: ["R", "lavaan", "tidyLPA/mclust"],
    repo: "https://github.com/jay-lay-down/LPA_synthetic_vars",
    demo: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf",
    // cover: "/covers/lpa.jpg",
  },
  {
    slug: "other-projects-slides",
    title: "Other Projects (Slides)",
    oneLiner: "Social mining / proposals / misc slide deck",
    category: "Other",
    stack: ["PowerPoint", "Research", "Storytelling"],
    demo: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf",
  },
];
