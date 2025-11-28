import type { Project } from "@/app/projects/data";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="rounded-3xl border border-black/15 bg-white/55 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs text-[var(--muted)]">{p.category}</div>
          <div className="mt-1 text-xl font-bold tracking-tight">{p.title}</div>
          <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.slice(0, 8).map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/70 text-[var(--muted)]"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {p.repo && (
              <a className="underline underline-offset-4 hover:opacity-80" href={p.repo} target="_blank" rel="noreferrer">
                Repo ↗
              </a>
            )}
            {p.demo && (
              <a className="underline underline-offset-4 hover:opacity-80" href={p.demo} target="_blank" rel="noreferrer">
                Demo ↗
              </a>
            )}
            {p.blog && (
              <a className="underline underline-offset-4 hover:opacity-80" href={p.blog} target="_blank" rel="noreferrer">
                Blog ↗
              </a>
            )}
          </div>
        </div>

        <button className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold border border-black/20 bg-[var(--soft)] hover:bg-white/60 transition">
          Details →
        </button>
      </div>
    </div>
  );
}
