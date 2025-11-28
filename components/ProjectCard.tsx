export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  stack: string[];
  links: { label: string; href: string }[];
};

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{p.oneLiner}</p>
        </div>
        <a
          className="text-sm underline underline-offset-4 text-gray-700 hover:text-gray-900"
          href={`/projects/${p.slug}`}
        >
          Details →
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
          >
            {s}
          </span>
        ))}
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
