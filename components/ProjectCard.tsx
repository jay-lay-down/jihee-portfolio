import Image from "next/image";
import type { Project } from "@/app/projects/data";

export default function ProjectCard({ p }: { p: Project }) {
  const detailsHref = p.repo ? p.repo : `/projects/${p.slug}`;

  return (
    <div className="rounded-3xl border border-black/15 bg-white/55 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-6">
        {/* Left */}
        <div className="min-w-0">
          <div className="text-xs text-[var(--muted)]">{p.category}</div>
          <div className="mt-1 text-xl font-black tracking-tight">{p.title}</div>
          <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.slice(0, 10).map((s) => (
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

        {/* Right: cover */}
        <div className="shrink-0 w-[260px]">
          <div className="relative h-[150px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
            {p.cover ? (
              <>
                <Image src={p.cover} alt={`${p.title} cover`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,186,73,0.25),transparent_55%),radial-gradient(ellipse_at_70%_70%,rgba(196,122,58,0.18),transparent_55%)]" />
            )}

            {/* ✅ Details -> repo */}
            <a
              href={detailsHref}
              target={p.repo ? "_blank" : undefined}
              rel={p.repo ? "noreferrer" : undefined}
              className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-semibold border border-white/25 bg-black/40 text-white backdrop-blur hover:bg-black/55 transition"
            >
              Details →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
