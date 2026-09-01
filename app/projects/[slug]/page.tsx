import type { Metadata } from "next";
import { getAllDocs, getDocBySlug, markdownToHtml } from "@/lib/markdown";
import LangTabs from "@/components/LangTabs";
import { PROJECTS } from "../data";
import { SITE_URL } from "@/app/layout";

export function generateStaticParams() {
  return getAllDocs("content/projects").map((d) => ({ slug: d.slug }));
}

/*
  케이스 스터디는 한글본이 본문이고 영문본이 번역이다.
  검색·생성형 엔진이 집어가는 요약은 한글본 기준으로 맞춘다.
*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ko = getDocBySlug("content/projects", `${slug}.ko`);
  const en = getDocBySlug("content/projects", slug);
  const doc = ko ?? en;
  if (!doc) return {};

  const project = PROJECTS.find((p) => p.slug === slug);
  const title = doc.meta.title;
  const description = doc.meta.description ?? project?.oneLinerKo ?? project?.oneLiner ?? "";

  return {
    title,
    description,
    keywords: doc.meta.tags,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/projects/${slug}`,
      locale: "ko_KR",
      publishedTime: doc.meta.date,
      authors: ["조지희 (Jihee Cho)"],
      tags: doc.meta.tags,
      images: project?.cover ? [{ url: project.cover, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project?.cover ? [project.cover] : undefined,
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const en = getDocBySlug("content/projects", slug);
  if (!en) return <main className="p-6">Not found</main>;

  const ko = getDocBySlug("content/projects", `${slug}.ko`);
  const project = PROJECTS.find((p) => p.slug === slug);
  const primary = ko ?? en;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: primary.meta.title,
    description: primary.meta.description,
    inLanguage: "ko-KR",
    datePublished: primary.meta.date,
    keywords: primary.meta.tags?.join(", "),
    url: `${SITE_URL}/projects/${slug}`,
    image: project?.cover ? `${SITE_URL}${project.cover}` : undefined,
    author: { "@type": "Person", name: "조지희", url: SITE_URL },
    publisher: { "@type": "Person", name: "조지희", url: SITE_URL },
    about: project?.stack?.map((s) => ({ "@type": "Thing", name: s })),
    isPartOf: { "@type": "WebSite", name: "조지희 포트폴리오", url: SITE_URL },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "프로젝트", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: primary.meta.title },
    ],
  };

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
