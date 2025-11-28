"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/app/projects/data";

const LINKS = {
  email: "chubbyfinger1010@gmail.com",
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  resume: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md",
  github: "https://github.com/jay-lay-down",
};

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm hover:opacity-85 transition"
    >
      {children} <span className="text-[var(--muted)]">↗</span>
    </a>
  );
}

function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  // ✅ Details 버튼/카드 클릭 시 어디로 보낼지 우선순위
  return p.repo ?? p.demo ?? p.blog ?? `/projects/${p.slug}`;
}

export default function HomeTabs() {
  const [tab, setTab] = useState<"Home" | "About" | "Details">("Home");

  const tabs = useMemo(
    () => [
      { key: "Home" as const, label: "Home" },
      { key: "About" as const, label: "About" },
      { key: "Details" as const, label: "Details" },
    ],
    []
  );

  const featured = useMemo(() => PROJECTS.filter((p) => p.featured).slice(0, 6), []);

  return (
    <section className="mt-10">
      {/* 탭 버튼 */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold border transition",
              tab === t.key
                ? "border-black/20 bg-black text-white"
                : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 내용 패널 */}
      <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/55 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {/* HOME */}
        {tab === "Home" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">Home</h2>
            <p className="mt-4 text-[15px] text-[var(--muted)] leading-8">
              프로젝트/리서치/실험을 “보여주는 형태”로 정리하고, 분석 결과를 대시보드·웹·자동화 산출물로 연결하는 일을
              지향합니다. (홈 화면에서는 Featured만 간단히 보여주고, Details 탭에서 썸네일+레포 링크로 바로 이동됩니다.)
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ChipLink href={LINKS.github}>GitHub</ChipLink>
              <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
              <ChipLink href={LINKS.velog}>Velog</ChipLink>
              <ChipLink href={LINKS.resume}>Resume</ChipLink>
              <ChipLink href={`mailto:${LINKS.email}`}>Contact</ChipLink>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm font-bold">Featured Projects</div>
                  <div className="mt-1 text-sm text-[var(--muted)]">대표 3~6개만 미리보기</div>
                </div>
                <button
                  onClick={() => setTab("Details")}
                  className="text-sm underline underline-offset-4 hover:opacity-80"
                >
                  Go to Details →
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {featured.slice(0, 4).map((p) => {
                  const href = pickPrimaryLink(p);
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={p.slug}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs text-[var(--muted)]">{p.category}</div>
                          <div className="mt-1 font-bold">{p.title}</div>
                          <div className="mt-1 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>
                        </div>
                        <div className="shrink-0 text-sm text-[var(--muted)]">Open ↗</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <>
            <h2 className="text-2xl font-black tracking-tight">About</h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Summary</div>
                <p className="mt-2 text-sm text-[var(--muted)] leading-7">
                  7년차 데이터 분석가로서 서울대학교병원 연구원으로 커리어를 시작해 엠브레인, NIQ(구 GfK), 칸타코리아까지
                  시장조사 및 데이터 분석 경험을 확장해 왔습니다. 현재는 Senior Analyst/Manager로서 프로젝트 리드와 신규
                  사업 개발까지 수행하고 있습니다.
                </p>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Research & Presentation</div>
                <ul className="mt-2 space-y-2 text-sm text-[var(--muted)] leading-7">
                  <li>• 다양한 산업군 리서치 프로젝트 수행(설문/정량/정성/POS)</li>
                  <li>• PPT 스토리라인 구성, 결과 리포팅, 프레젠테이션/워크숍 리드</li>
                  <li>• 클라이언트 니즈 파악 → 제안서/사업개발로 연결</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Stat / ML Skills</div>
                <ul className="mt-2 space-y-2 text-sm text-[var(--muted)] leading-7">
                  <li>• R / Python / SPSS 기반 고급 통계 분석</li>
                  <li>• SEM, PCA/요인분석, Decision Tree, Bayesian Network</li>
                  <li>• Granger causality, SARIMAX 수요예측</li>
                  <li>• LLM fine-tuning(LoRA) / RAG 기반 자동화 툴로 확장</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-6">
                <div className="text-sm font-bold">Contact</div>
                <div className="mt-2 text-sm text-[var(--muted)] leading-7">
                  <a className="underline underline-offset-4 hover:opacity-80" href={`mailto:${LINKS.email}`}>
                    {LINKS.email}
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ChipLink href={LINKS.github}>GitHub</ChipLink>
                  <ChipLink href={LINKS.hf}>Hugging Face</ChipLink>
                  <ChipLink href={LINKS.velog}>Velog</ChipLink>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DETAILS (Projects list w/ thumbnail + repo link) */}
        {tab === "Details" && (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Projects (Details)</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  카드 클릭 또는 Details 버튼을 누르면 GitHub Repo(우선)로 이동합니다.
                </p>
              </div>
              <a className="text-sm underline underline-offset-4 hover:opacity-80" href="/projects">
                View all →
              </a>
            </div>

            <div className="mt-6 grid gap-4">
              {PROJECTS.map((p) => {
                const href = pickPrimaryLink(p);
                const external = href.startsWith("http");
                return (
                  <a
                    key={p.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="group rounded-3xl border border-[var(--line)] bg-white/70 p-6 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* left */}
                      <div className="min-w-0">
                        <div className="text-xs text-[var(--muted)]">{p.category}</div>
                        <div className="mt-1 text-xl font-black tracking-tight">{p.title}</div>
                        <div className="mt-2 text-sm text-[var(--muted)] leading-7">{p.oneLiner}</div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.stack.slice(0, 10).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/80 text-[var(--muted)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3 text-sm">
                          {p.repo && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Repo ↗
                            </span>
                          )}
                          {!p.repo && p.demo && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Demo ↗
                            </span>
                          )}
                          {!p.repo && !p.demo && p.blog && (
                            <span className="underline underline-offset-4 group-hover:opacity-85">
                              Blog ↗
                            </span>
                          )}
                        </div>
                      </div>

                      {/* right thumbnail */}
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

                          <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-semibold border border-white/25 bg-black/40 text-white backdrop-blur">
                            Details →
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
