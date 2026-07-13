// app/projects/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PROJECTS } from "./data";

type Lang = "ko" | "en";

function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  return (p as any).repo ?? (p as any).demo ?? (p as any).blog ?? `/projects/${(p as any).slug}`;
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ProjectsPage() {
  const [lang, setLang] = useState<Lang>("ko");
  useEffect(() => {
    const saved = window.localStorage.getItem("site-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  const switchLang = (l: Lang) => {
    setLang(l);
    try {
      window.localStorage.setItem("site-lang", l);
    } catch {}
  };

  return (
    <main className="mx-auto max-w-6xl px-10 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{lang === "ko" ? "프로젝트" : "Projects"}</h1>
          <p className="mt-3 text-[15px] text-[var(--muted)] leading-8">
            {lang === "ko"
              ? "카드를 클릭하면 프로젝트 페이지가 열리고, 저장소·데모·블로그로 이동할 수 있습니다."
              : "Clicking a card opens the project page, where you can navigate to the repo, demo, or blog."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-black/20 overflow-hidden">
            {(["ko", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLang(l)}
                className={
                  "px-3 py-1.5 text-xs font-black transition " +
                  (lang === l ? "bg-[#8C5E35] text-white" : "bg-white/70 text-black/50 hover:text-[#8C5E35]")
                }
              >
                {l === "ko" ? "한국어" : "EN"}
              </button>
            ))}
          </div>
          <a href="/" className="text-sm font-extrabold underline underline-offset-4 hover:opacity-80">
            {lang === "ko" ? "홈으로 →" : "Back home →"}
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        {PROJECTS.map((p) => {
          const href = pickPrimaryLink(p);
          const external = isExternal(href);
          const cover = (p as any).cover as string | undefined;
          const title = lang === "ko" && p.titleKo ? p.titleKo : p.title;
          const oneLiner = lang === "ko" && p.oneLinerKo ? p.oneLinerKo : p.oneLiner;

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
                  <div className="mt-1 text-2xl font-black tracking-tight">{title}</div>
                  <div className="mt-2 text-[15px] text-[var(--muted)] leading-8">{oneLiner}</div>

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
                    {lang === "ko" ? "열기 ↗" : "Open ↗"}
                  </div>
                </div>

                {/* right thumbnail */}
                <div className="shrink-0 w-[320px]">
                  <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-black/15 bg-black/5">
                    {cover ? (
                      <>
                        <Image src={cover} alt={`${title} cover`} fill className="object-cover" />
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
