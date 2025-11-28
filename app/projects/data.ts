export type Category = "LLM" | "Forecasting" | "Bayesian" | "Segmentation" | "Other";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  category: Category;
  featured?: boolean;

  repo?: string;
  demo?: string;
  blog?: string;

  stack: string[];
  cover?: string; // e.g. "/covers/ddolbae.jpg" (public/covers/.. 에 넣기)
};

export const PROJECTS: Project[] = [
  {
    slug: "ddolbae-chatbot",
    title: "AI/LLM-powered Analytics Chatbot",
    oneLiner: "LoRA/QLoRA fine-tuning + lightweight self-hosting persona chatbot",
    category: "LLM",
    featured: true,
    repo: "https://github.com/jay-lay-down/jaychatbot_2nd",
    blog: "https://velog.io/@jaylaydown/series/side-project-1",
    demo: "http://www.duboobanmo.site",
    stack: ["Python", "Transformers", "QLoRA", "bitsandbytes", "Hugging Face", "Gradio"],
    // cover: "/covers/ddolbae.jpg",
  },
  {
    slug: "social-animal-test",
    title: "Social Animal Type Test",
    oneLiner: "Metacognition + situation reading test shipped as a real web service",
    category: "LLM",
    featured: true,
    repo: "https://github.com/jay-lay-down/animal_test",
    demo: "https://myanimaltest.site/",
    blog: "https://velog.io/@jaylaydown/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%8B%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%8F%99%EB%AC%BC-%EC%9C%A0%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    stack: ["Python", "Gradio", "HTML/CSS", "Hugging Face Spaces"],
    // cover: "/covers/animal.jpg",
  },
  {
    slug: "auto-segment-tool",
    title: "Auto Segment Tool (Desktop EXE)",
    oneLiner: "Data → PCA → Decision Tree segmentation → Excel reporting automation",
    category: "Segmentation",
    featured: true,
    repo: "https://github.com/jay-lay-down/auto_segment",
    demo: "https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download",
    stack: ["Python", "PySide6", "scikit-learn", "Pandas", "Excel Automation", "PyInstaller"],
    // cover: "/covers/segment.jpg",
  },
  {
    slug: "bayesian-dashboard",
    title: "Bayesian Modeling & Dashboard",
    oneLiner: "Hierarchical Bayesian modeling → interactive dashboard for decision support",
    category: "Bayesian",
    featured: true,
    repo: "https://github.com/jay-lay-down/bayesian_dashboard",
    demo: "https://jay1121-bayesian-dashboard.hf.space",
    stack: ["Python", "PyMC", "ArviZ", "pandas", "NumPy", "Plotly/Dash"],
  },
  {
    slug: "bayesian-norms",
    title: "Brand Image Evaluation with Bayesian Norms",
    oneLiner: "Survey + social data augmentation → Bayesian adjective norm dashboard",
    category: "Bayesian",
    repo: "https://github.com/jay-lay-down/bayesian_norm",
    blog: "https://velog.io/@jaylaydown/BayesianAdjectiveNorm",
    demo: "https://github.com/jay-lay-down/bayesian_norm/blob/main/assets/bayesian_norm_fin.xlsm",
    stack: ["Python", "pandas", "scikit-learn", "NLP", "PyMC", "VBA"],
  },
  {
    slug: "demand-forecasting",
    title: "Demand Forecasting",
    oneLiner: "MDA market indicators → SARIMAX pipeline + R package development",
    category: "Forecasting",
    featured: true,
    repo: "https://github.com/jay-lay-down/demand_forecasting",
    demo: "https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf",
    stack: ["R", "forecast", "caret", "tseries", "lmtest", "SARIMAX", "Package(devtools)"],
  },
  {
    slug: "share-forecasting-seq2seq",
    title: "Brand Share% Forecasting",
    oneLiner: "Softmax optimization + seq2seq LSTM for competitive share forecasting",
    category: "Forecasting",
    repo: "https://github.com/jay-lay-down/seq2seq_softmax",
    stack: ["Python", "TensorFlow/Keras", "LSTM seq2seq", "Attention", "NumPy", "pandas"],
  },
  {
    slug: "employee-engagement-lpa",
    title: "Drivers of Employee Engagement",
    oneLiner: "Latent Profile Analysis for retention strategy & segment-level actions",
    category: "Segmentation",
    repo: "https://github.com/jay-lay-down/LPA_synthetic_vars",
    demo: "https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf",
    stack: ["R", "lavaan", "tidyLPA", "mclust"],
  },
  {
    slug: "other-projects-slides",
    title: "Other Projects (Slides Collection)",
    oneLiner: "Social mining, proposals, and additional presentation materials",
    category: "Other",
    demo: "https://github.com/jay-lay-down/jay-lay-down/blob/main/assets/Example_projects.pdf",
    stack: ["Research", "Deck building", "Storyline", "Client workshops"],
  },
];
