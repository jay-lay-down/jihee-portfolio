import { getAllDocs, getDocBySlug, markdownToHtml } from "@/lib/markdown";
import LangTabs from "@/components/LangTabs";

export function generateStaticParams() {
  return getAllDocs("content/projects").map((d) => ({ slug: d.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const en = getDocBySlug("content/projects", slug);
  if (!en) return <main className="p-6">Not found</main>;

  const ko = getDocBySlug("content/projects", `${slug}.ko`);

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <a className="text-sm underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition" href="/projects">
          ← Back to Projects
        </a>

        <LangTabs
          en={{ meta: en.meta, html: markdownToHtml(en.content) }}
          ko={ko ? { meta: ko.meta, html: markdownToHtml(ko.content) } : null}
        />
      </div>
    </main>
  );
}
