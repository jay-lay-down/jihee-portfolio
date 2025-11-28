export type Category = "LLM" | "Bayesian" | "Forecasting" | "Segmentation" | "Other";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  category: Category;
  featured?: boolean;
  stack: string[];
  links: { label: string; href: string }[];
};

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 hover:bg-[#fcfcfc] transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--soft)] text-[var(--fg)] border border-[var(--line)]">
              {p.category}
            </span>
            {p.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--fg)] text-white">
                Featured
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base font-semibold tracking-tight">{p.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)] leading-6">{p.oneLiner}</p>
        </div>

        <a className="text-sm underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition whitespace-nowrap" href={`/projects/${p.slug}`}>
          Details →
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {p.stack.slice(0, 7).map((s) => (
          <span key={s} className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
            {s}
          </span>
        ))}
        {p.stack.length > 7 && (
          <span className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
            +{p.stack.length - 7}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm px-3 py-1.5 rounded-full border border-[var(--line)] hover:bg-[var(--soft)] transition"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
