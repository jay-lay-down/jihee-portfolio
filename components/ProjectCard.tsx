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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {p.category}
            </span>
            {p.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-900 text-white">
                Featured
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base font-semibold text-gray-900">{p.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{p.oneLiner}</p>
        </div>

        <a
          className="text-sm underline underline-offset-4 text-gray-700 hover:text-gray-900 whitespace-nowrap"
          href={`/projects/${p.slug}`}
        >
          Details →
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {p.stack.slice(0, 6).map((s) => (
          <span key={s} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {s}
          </span>
        ))}
        {p.stack.length > 6 && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            +{p.stack.length - 6}
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
            className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
