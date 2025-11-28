"use client";

import { useMemo, useState } from "react";
import ProjectCard, { Project, Category } from "@/components/ProjectCard";

type Mode = "featured" | "all";
const TABS: (Category | "All")[] = ["All", "LLM", "Bayesian", "Forecasting", "Segmentation", "Other"];

export default function ProjectsGrid({ projects, mode }: { projects: Project[]; mode: Mode }) {
  const [tab, setTab] = useState<(Category | "All")>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let xs = [...projects];
    if (mode === "featured") xs = xs.filter((p) => p.featured);

    if (tab !== "All") xs = xs.filter((p) => p.category === tab);

    const query = q.trim().toLowerCase();
    if (query) {
      xs = xs.filter((p) => (p.title + " " + p.oneLiner + " " + p.stack.join(" ")).toLowerCase().includes(query));
    }

    return xs;
  }, [projects, mode, tab, q]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "text-sm px-3 py-1.5 rounded-full border transition",
                tab === t
                  ? "bg-[var(--fg)] text-white border-[var(--fg)]"
                  : "bg-white text-[var(--fg)] border-[var(--line)] hover:bg-[var(--soft)]",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (title/stack)…"
          className="w-full md:w-64 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list.map((p) => <ProjectCard key={p.slug} p={p} />)}
      </div>

      {list.length === 0 && <div className="mt-6 text-sm text-[var(--muted)]">검색 결과 없음…</div>}
    </div>
  );
}
