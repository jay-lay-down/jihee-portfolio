import { PROJECTS } from "./data";

function pickPrimaryLink(p: (typeof PROJECTS)[number]) {
  return p.repo ?? p.demo ?? p.blog ?? `/`;
}
function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ProjectsPage() {
  return (
    <main className="container-wide px-10 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">프로젝트 목록</p>

      <div className="mt-8 space-y-3">
        {PROJECTS.map((p) => {
          const href = pickPrimaryLink(p);
          const external = isExternal(href);
          return (
            <
