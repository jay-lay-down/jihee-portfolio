import { getDocBySlug, markdownToHtml } from "@/lib/markdown";

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug("content/posts", params.slug);
  if (!doc) return <main className="p-6">Not found</main>;

  const html = markdownToHtml(doc.content);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <a className="text-sm underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition" href="/blog">
          ← Back to Blog
        </a>

        <div className="mt-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-7">
          <h1 className="text-2xl font-semibold tracking-tight">{doc.meta.title}</h1>
          {doc.meta.date && <p className="mt-2 text-sm text-[var(--muted)]">{doc.meta.date}</p>}

          {!!doc.meta.tags?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {doc.meta.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </main>
  );
}
