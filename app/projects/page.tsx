// app/projects/page.tsx
import Image from "next/image";
import { PROJECTS } from "./data";

function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  return (p as any).repo ?? (p as any).demo ?? (p as any).blog ?? `/projects/${(p as any).slug}`;
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-10 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Projects</h1>
          <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
            카드 클릭 시 <b className="text-[var(--fg)]">Repo(우선)</b> → Demo → Blog 순으로 이동합니다.
          </p>
        </div>
        <a
          href="/"
          className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80"
        >
          Back home →
        </a>
      </div>

      <div className="mt-8 grid gap-5">
        {PROJECTS.map((p) => {
          const href = pickPrimaryLink(p);
          const external = isExternal(href);
          const cover = (p as any).cover as string | undefined;

          return (
            <a
              key={(p as any).slug}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group rounded-[26px] border border-[var(--line)] bg-white/70 p-6 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-8">
                {/* left */}
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-black/60">{String((p as any).category ?? "")}</div>
                  <div className="mt-1 text-2xl font-black tracking-tight">{String((p as any).title ?? "")}</div>
                  <div className="mt-2 text-[15px] text-[var(--muted)] leading-8">
                    {String((p as any).oneLiner ?? "")}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(Array.isArray((p as any).stack) ? (p as any).stack : [])
                      .slice(0, 12)
                      .map((s: string) => (
                        <span
                          key={s}
                          className="rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-1 text-xs font-semibold text-[var(--muted)]"
                        >
                          {s}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 text-sm font-extrabold underline underline-offset-4 group-hover:opacity-85">
                    Open ↗
                  </div>
                </div>

                {/* right thumbnail */}
                <div className="shrink-0 w-[320px]">
                  <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                    {cover ? (
                      <>
                        <Image src={cover} alt={`${String((p as any).title ?? "")} cover`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,150,0.55),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(0,0,0,0.10),transparent_55%),linear-gradient(135deg,rgba(253,248,242,1),rgba(243,233,222,1))]" />
                    )}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
