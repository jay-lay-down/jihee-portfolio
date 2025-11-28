import fs from "node:fs";
import path from "node:path";

export type DocMeta = {
  title: string;
  date?: string;
  description?: string;
  tags?: string[];
};

export type Doc = {
  slug: string;
  meta: DocMeta;
  content: string;
};

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function markdownToHtml(md: string) {
  let s = escapeHtml(md);

  // code blocks
  s = s.replace(/```([\s\S]*?)```/g, (_m, code) => {
    return `<pre class="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-4 overflow-auto"><code>${code.trim()}</code></pre>`;
  });

  // images ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (_m, alt, url) => {
    return `<img src="${url}" alt="${alt}" class="mt-4 w-full rounded-2xl border border-[var(--line)] grayscale" />`;
  });

  // inline code
  s = s.replace(/`([^`]+)`/g, (_m, code) => {
    return `<code class="px-1.5 py-0.5 rounded bg-[var(--soft)] border border-[var(--line)]">${code}</code>`;
  });

  // links
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, text, url) => {
    return `<a class="underline underline-offset-4 hover:opacity-80 transition" href="${url}" target="_blank" rel="noreferrer">${text}</a>`;
  });

  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // headings
  s = s.replace(/^###\s(.+)$/gm, `<h3 class="mt-7 text-lg font-semibold tracking-tight text-[var(--fg)]">$1</h3>`);
  s = s.replace(/^##\s(.+)$/gm, `<h2 class="mt-8 text-xl font-semibold tracking-tight text-[var(--fg)]">$1</h2>`);
  s = s.replace(/^#\s(.+)$/gm, `<h1 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--fg)]">$1</h1>`);

  // lists
  s = s.replace(/(^-\s.+(\n-\s.+)*)/gm, (block) => {
    const items = block
      .split("\n")
      .map((line) => line.replace(/^-+\s/, "").trim())
      .map((item) => `<li class="ml-5 list-disc">${item}</li>`)
      .join("");
    return `<ul class="mt-3 space-y-1 text-sm leading-7 text-[var(--muted)]">${items}</ul>`;
  });

  // paragraphs
  const parts = s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  s = parts
    .map((p) => {
      if (/^<h[1-3]\b|^<ul\b|^<pre\b|^<img\b/.test(p)) return p;
      return `<p class="mt-3 text-sm leading-7 text-[var(--muted)]">${p.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return s;
}

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { meta: {} as any, content: raw.trim() };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {} as any, content: raw.trim() };

  const header = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();

  const meta: any = {};
  for (const line of header.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    if (key === "tags") {
      meta.tags = val
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((x) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }

    meta[key] = val;
  }

  return { meta, content: body };
}

function readDir(dir: string) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith(".md"));
}

export function getAllDocs(dir: string): Doc[] {
  const files = readDir(dir);
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(process.cwd(), dir, file), "utf8");
      const { meta, content } = parseFrontmatter(raw);
      return {
        slug,
        meta: {
          title: meta.title ?? slug,
          date: meta.date,
          description: meta.description,
          tags: meta.tags ?? [],
        },
        content,
      };
    })
    .sort((a, b) => (b.meta.date ?? "").localeCompare(a.meta.date ?? ""));
}

export function getDocBySlug(dir: string, slug: string): Doc | null {
  const p = path.join(process.cwd(), dir, `${slug}.md`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  const { meta, content } = parseFrontmatter(raw);
  return {
    slug,
    meta: {
      title: meta.title ?? slug,
      date: meta.date,
      description: meta.description,
      tags: meta.tags ?? [],
    },
    content,
  };
}
