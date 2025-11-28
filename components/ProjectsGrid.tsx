"use client";

import { useMemo, useState } from "react";
import ProjectCard, { Project, Category } from "@/components/ProjectCard";

type Mode = "featured" | "all";
const TABS: (Category | "All")[] = ["All", "LLM", "Bayesian", "Forecasting", "Segmentation", "Other"];

export default function ProjectsGrid({
  projects,
  mode,
}: {
  projects: Project[];
  mode: Mode;
}) {
  const [tab, setTab] = useState<(Category | "All")>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let xs = [...projects];

    if (mode === "featured") xs = xs.filter((p) => p.featured);

    if (tab !== "All") xs = xs.filter((p) => p.category === tab);

    const query = q.trim().toLowerCase();
    if (query) {
      xs = xs.filter((p) => {
        const hay = (p.title + " " + p.oneLiner + " " + p.stack.join(" ")).toLowerCase();
        return hay.includes(query);
      });
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
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50",
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
          className="w-full md:w-64 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-6 text-sm text-gray-600">검색 결과 없음… 😇</div>
      )}
    </div>
  );
}
