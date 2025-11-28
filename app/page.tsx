import Image from "next/image";
import HomeTabs from "@/components/HomeTabs";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/app/projects/data";

export default function Home() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 4);

  return (
    <main className="w-full">
      {/* HERO (desktop wide) */}
      <section className="relative w-full">
        {/* background image */}
        <div className="absolute inset-0">
          <Image
            src="/a2026.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover"
          />
          {/* overlay for readability */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.85)_0%,rgba(12,12,12,0.65)_35%,rgba(12,12,12,0.25)_65%,rgba(12,12,12,0.55)_100%)]" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* content */}
        <div className="relative mx-auto max-w-[1400px] px-10 py-[92px]">
          <div className="grid grid-cols-12 gap-10 items-end">
            {/* left copy */}
            <div className="col-span-7">
              <div className="text-white/70 text-sm tracking-wide">
                Analytics · Research · Automation · AI
              </div>

              <h1 className="mt-4 text-white font-black tracking-tight leading-[0.95] text-[72px]">
                PORTFOLIO
              </h1>

              <div className="mt-5 text-white/90 text-2xl font-semibold">
                Jihee Cho
              </div>

              <p className="mt-4 max-w-[54ch] text-white/80 text-[15px] leading-8">
                7년차 데이터 분석가로서 시장조사/리서치 기반 프로젝트를 수행하며,
                분석 결과를 대시보드·웹·자동화 산출물로 연결하는 데 강점을 보유하고 있습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <a
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
                  href="/projects"
                >
                  View Projects →
                </a>
                <a
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
                  href="https://huggingface.co/Jay1121"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hugging Face ↗
                </a>
                <a
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
                  href="mailto:chubbyfinger1010@gmail.com"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* right profile card */}
            <div className="col-span-5">
              <div className="ml-auto w-full max-w-[420px] rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-md p-7 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/25 bg-white/10">
                    <Image
                      src="/avatar.jpg"
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-white font-extrabold text-lg leading-tight">
                      Jihee Cho
                    </div>
                    <div className="text-white/70 text-sm">
                      Senior Analyst/Manager · Research & Analytics
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-white/80 leading-7">
                  <div>• Market research (survey/POS) → insight → deliverables</div>
                  <div>• Bayesian / forecasting / segmentation automation</div>
                  <div>• LLM fine-tuning & RAG for analytics workflow</div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href="https://github.com/jay-lay-down"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white underline underline-offset-4 hover:opacity-85"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href="https://velog.io/@jaylaydown"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white underline underline-offset-4 hover:opacity-85"
                  >
                    Velog ↗
                  </a>
                  <a
                    href="https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white underline underline-offset-4 hover:opacity-85"
                  >
                    Resume ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="mx-auto max-w-[1400px] px-10 py-14">
        {/* Featured */}
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight">Featured Projects</h2>
          <a className="text-sm underline underline-offset-4 hover:opacity-80" href="/projects">
            View all →
          </a>
        </div>

        <div className="mt-8 space-y-4">
          {featured.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <HomeTabs />
        </div>
      </section>
    </main>
  );
}
