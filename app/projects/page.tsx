import ProjectsGrid from "@/components/ProjectsGrid";
import { PROJECTS } from "./data";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">카드 클릭해서 상세(마크다운)로 보기</p>
          </div>
          <a className="text-sm underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition" href="/">
            ← Home
          </a>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6">
          <ProjectsGrid projects={PROJECTS} mode="all" />
        </div>
      </div>
    </main>
  );
}
