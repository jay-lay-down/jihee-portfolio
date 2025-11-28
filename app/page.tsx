import ProfileCard from "@/components/ProfileCard";
import Section from "@/components/Section";
import ProjectsGrid from "@/components/ProjectsGrid";
import { PROJECTS } from "@/app/projects/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="lg:sticky lg:top-20 h-fit">
          <ProfileCard />
        </aside>

        <div className="space-y-6">
          <Section title="🔑 Core Competencies">
            <div className="text-sm text-gray-700 leading-7">
              📊 정성/정량 데이터 통합 · 🧠 베이지안 모델링/대시보드 · 🤖 AI/LLM 응용<br />
              📈 비즈니스 인사이트 · 🧩 Prompt Engineering · 🤝 글로벌 고객사와 협업
            </div>
          </Section>

          <Section title="🧰 Skills">
            <div className="flex flex-wrap gap-2 text-sm">
              {["Python", "PyTorch", "TensorFlow", "R", "SQL", "Tableau", "Excel", "PowerPoint", "Hugging Face", "SPSS"].map(
                (s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                    {s}
                  </span>
                )
              )}
            </div>
          </Section>

          <Section title="📒 Featured Projects (탭+검색)">
            <ProjectsGrid projects={PROJECTS} mode="featured" />
            <div className="mt-5 flex gap-4 text-sm">
              <a className="underline underline-offset-4 text-gray-700" href="/projects">
                View all projects →
              </a>
              <a className="underline underline-offset-4 text-gray-700" href="/blog">
                Go to blog →
              </a>
            </div>
          </Section>

          <Section title="📊 Stats">
            <div className="grid gap-4 md:grid-cols-2">
              <img
                className="w-full rounded-2xl border border-gray-200 bg-white"
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=jay-lay-down&layout=compact&theme=default"
                alt="Top langs"
              />
              <img
                className="w-full rounded-2xl border border-gray-200 bg-white"
                src="https://streak-stats.demolab.com?user=jay-lay-down&theme=default&hide_border=true&cache_seconds=86400&v=2"
                alt="GitHub streak"
              />
            </div>

            <div className="mt-4">
              <a
                className="underline underline-offset-4 text-sm text-gray-700"
                href="https://leetcode.com/jiheecho"
                target="_blank"
                rel="noreferrer"
              >
                LeetCode profile ↗
              </a>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
