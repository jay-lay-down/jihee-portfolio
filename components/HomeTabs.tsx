"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Competencies from "@/components/Competencies";
import SkillBadges from "@/components/SkillBadges";
import ProjectsGrid from "@/components/ProjectsGrid";
import { PROJECTS } from "@/app/projects/data";

type Tab = "Home" | "About" | "Projects";

export default function HomeTabs() {
  const [tab, setTab] = useState<Tab>("Home");
  const featured = useMemo(() => PROJECTS.filter((p) => p.featured), []);
  const all = useMemo(() => PROJECTS, []);

  return (
    <main className="min-h-screen">
      <div className="px-10 pt-8 pb-16">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-8">
          <a href="/" className="text-sm font-semibold tracking-tight hover:opacity-80 transition">
            Jihee Cho
          </a>

          <nav className="flex items-center gap-2">
            {(["Home", "About", "Projects"] as Tab[]).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "text-sm px-4 py-2 rounded-full border transition",
                    active
                      ? "bg-[var(--fg)] text-white border-[var(--fg)]"
                      : "bg-transparent text-[var(--fg)] border-[var(--line)] hover:bg-white/40",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <a
              className="underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition"
              href="https://huggingface.co/Jay1121"
              target="_blank"
              rel="noreferrer"
            >
              Hugging Face
            </a>
            <a
              className="underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition"
              href="https://velog.io/@jaylaydown"
              target="_blank"
              rel="noreferrer"
            >
              Velog
            </a>
            <a
              className="underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition"
              href="https://github.com/jay-lay-down"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* HOME */}
        {tab === "Home" && (
          <section className="mt-12">
            <h1 className="leading-[0.86] font-black tracking-[-0.055em] text-[clamp(96px,11vw,190px)]">
              PORTFOLIO
            </h1>

            <div className="mt-5 flex items-end justify-between gap-10">
              <p className="max-w-4xl text-lg text-[var(--muted)]">
                Analytics · Bayesian · Time Series · LLM{" "}
                <span className="text-[var(--fg)] font-semibold">— Data → Insight → Impact</span>
              </p>

              <button
                onClick={() => setTab("Projects")}
                className="rounded-full px-6 py-3 text-sm font-semibold border border-black/20 bg-[var(--accent)] text-black hover:brightness-[1.03] transition shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
              >
                View Projects →
              </button>
            </div>

            {/* Hero */}
            <div className="mt-10 relative w-full h-[580px] overflow-hidden rounded-[44px] border border-black/15 shadow-[0_34px_110px_rgba(0,0,0,0.22)]">
              <Image src="/a2026.jpg" alt="Hero" fill priority className="object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_22%,rgba(255,186,73,0.22),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_85%,rgba(196,122,58,0.18),transparent_55%)]" />

              <div className="absolute left-10 top-10 text-white/10 font-black tracking-[-0.06em] text-[clamp(120px,12vw,220px)] select-none">
                2026
              </div>

              <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-6">
                <div className="text-white">
                  <div className="text-sm text-white/80">Jihee Cho · Seoul</div>
                  <div className="mt-1 text-3xl font-bold tracking-tight">
                    Highlights & Selected Work
                  </div>
                  <div className="mt-2 text-sm text-white/80">chubbyfinger1010@gmail.com</div>
                </div>

                <button
                  onClick={() => setTab("About")}
                  className="rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition shadow-[0_16px_50px_rgba(0,0,0,0.22)]"
                >
                  About →
                </button>
              </div>
            </div>

            {/* Featured */}
            <div className="mt-12">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
                <button
                  className="text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--fg)] transition"
                  onClick={() => setTab("Projects")}
                >
                  See all →
                </button>
              </div>

              <div className="mt-6">
                <ProjectsGrid projects={featured} mode="all" columns={1} />
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <section className="mt-12 grid gap-8" style={{ gridTemplateColumns: "520px 1fr" }}>
            <div className="space-y-6">
              <ProfileCard />
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6">
                <h3 className="text-sm font-bold tracking-tight">Core Competencies</h3>
                <div className="mt-4">
                  <Competencies />
                </div>
              </div>
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6">
                <h3 className="text-sm font-bold tracking-tight">Skills</h3>
                <div className="mt-4">
                  <SkillBadges />
                </div>
              </div>
            </div>

            <div className="rounded-[44px] border border-black/15 bg-white/50 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <h2 className="text-[44px] leading-[1.05] font-black tracking-tight">
                About
              </h2>
              <p className="mt-6 text-lg text-[var(--muted)] leading-8">
                프로젝트/리서치/실험을 “보여주는 형태”로 만드는 걸 좋아하고,
                분석 결과를 대시보드/웹/오토메이션으로 연결하는 걸 강점으로 가져가고 있어.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                  <div className="text-sm font-bold">Focus</div>
                  <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                    Bayesian modeling, time series forecasting, LLM applications, analytics automation.
                  </div>
                </div>
                <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                  <div className="text-sm font-bold">Contact</div>
                  <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                    chubbyfinger1010@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {tab === "Projects" && (
          <section className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="text-[56px] leading-[1] font-black tracking-tight">Projects</h2>
              <div className="text-sm text-[var(--muted)]">
                탭/검색으로 정리해둠 (많아도 안 깨짐)
              </div>
            </div>

            <div className="mt-6">
              <ProjectsGrid projects={all} mode="all" columns={1} />
            </div>

            <footer className="mt-16 border-t border-[var(--line)] pt-10 text-sm text-[var(--muted)] flex items-center justify-between">
              <div>© {new Date().getFullYear()} Jihee Cho</div>
              <div className="flex gap-4">
                <a className="underline underline-offset-4 hover:text-[var(--fg)]" href="https://huggingface.co/Jay1121" target="_blank" rel="noreferrer">Hugging Face</a>
                <a className="underline underline-offset-4 hover:text-[var(--fg)]" href="https://velog.io/@jaylaydown" target="_blank" rel="noreferrer">Velog</a>
                <a className="underline underline-offset-4 hover:text-[var(--fg)]" href="https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md" target="_blank" rel="noreferrer">Resume</a>
              </div>
            </footer>
          </section>
        )}
      </div>
    </main>
  );
}
