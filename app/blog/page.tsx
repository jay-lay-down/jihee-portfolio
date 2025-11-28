import { getAllDocs } from "@/lib/markdown";

export default function BlogList() {
  const posts = getAllDocs("content/posts");

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">마크다운 파일 추가하면 자동 게시</p>
          </div>
          <a className="text-sm underline underline-offset-4 text-[var(--muted)] hover:text-[var(--fg)] transition" href="/">
            ← Home
          </a>
        </div>

        <div className="mt-6 space-y-3">
          {posts.map((p) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 hover:bg-[#fcfcfc] transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold tracking-tight">{p.meta.title}</div>
                <div className="text-xs text-[var(--muted)]">{p.meta.date ?? ""}</div>
              </div>

              {p.meta.description && <div className="mt-1 text-sm text-[var(--muted)]">{p.meta.description}</div>}

              {!!p.meta.tags?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.meta.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
