"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project, Category } from "@/app/projects/data";

const TABS: (Category | "All")[] = ["All", "LLM", "Bayesian", "Forecasting", "Segmentation", "Other"];

export default function ProjectsGrid({
  projects,
  mode,
  columns = 1,
}: {
  projects: Project[];
  mode: "all" | "featured";
  columns?: 1 | 2;
}) {
  const [tab, setTab] = useState<(Category | "All")>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let xs = [...projects];
    if (mode === "featured") xs = xs.filter((p) => p.featured);

    if (tab !== "All") xs = xs.filter((p) => p.category === tab);

    const query = q.trim().toLowerCase();
    if (query) {
      xs = xs.filter((p) =>
        (p.title + " " + p.oneLiner + " " + p.stack.join(" ")).toLowerCase().includes(query)
      );
    }
    return xs;
  }, [projects, mode, tab, q]);

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "text-sm px-3 py-1.5 rounded-full border transition",
                  active
                    ? "bg-[var(--fg)] text-white border-[var(--fg)]"
                    : "bg-transparent text-[var(--fg)] border-[var(--line)] hover:bg-white/40",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (title/stack)…"
          className="w-80 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="mt-5 grid gap-5 grid-cols-1">
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>

      {list.length === 0 && <div className="mt-6 text-sm text-[var(--muted)]">검색 결과 없음…</div>}
    </div>
  );
}
