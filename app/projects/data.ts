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
  // cover 없어도 됨 (없으면 자동 패턴 썸네일)
  cover?: string;
  stack: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "ai-llm-chatbot",
    title: "AI/LLM-powered Analytics Chatbot",
    oneLiner: "Persona fine-tuning + self-hosting (QLoRA / Quantization)",
    category: "LLM",
    featured: true,
    repo: "https://github.com/jay-lay-down/jaychatbot_2nd",
    demo: "http://www.duboobanmo.site",
    blog: "https://velog.io/@jaylaydown/series/side-project-1",
    stack: ["Python", "PyTorch", "Transformers", "QLoRA", "Gradio", "HF Hub"],
  },
  {
    slug: "animal-test",
    title: "Social Animal Type Test",
    oneLiner: "Metacognition & situation-reading type test (11 types) with deployment",
    category: "Other",
    featured: true,
    repo: "https://github.com/jay-lay-down/animal_test",
    demo: "https://myanimaltest.site/",
    blog: "https://velog.io/@jaylaydown/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%8B%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%8F%99%EB%AC%BC-%EC%9C%A0%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    stack: ["Python", "Gradio", "HTML/CSS", "Hugging Face Spaces"],
  },
  {
    slug: "auto-segment",
    title: "Auto Segment Tool (Desktop EXE)",
    oneLiner: "Data → PCA/FA → Decision Tree Segmentation → Viz → Excel report automation",
    category: "Segmentation",
    featured: true,
    repo: "https://github.com/jay-lay-down/auto_segment",
    stack: ["Python", "PySide6", "scikit-learn", "pandas", "PyInstaller", "Excel Automation"],
  },
  {
    slug: "bayesian-dashboard",
    title: "Bayesian Modeling & Dashboard",
    oneLiner: "Hierarchical Bayesian funnel dashboard (Preference → Recommend → Intent → Purchase)",
    category: "Bayesian",
    featured: true,
    repo: "https://github.com/jay-lay-down/bayesian_dashboard",
    demo: "https://jay1121-bayesian-dashboard.hf.space",
    stack: ["Python", "PyMC", "ArviZ", "pandas", "Dashboard"],
  },
];
