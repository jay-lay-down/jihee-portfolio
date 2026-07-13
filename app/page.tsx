// app/page.tsx
import HomeTabs, { type CaseStudyHtml } from "@/components/HomeTabs";
import { getAllDocs, getDocBySlug, markdownToHtml } from "@/lib/markdown";

export default function Home() {
  const caseStudies: Record<string, CaseStudyHtml> = {};
  for (const doc of getAllDocs("content/projects")) {
    const ko = getDocBySlug("content/projects", `${doc.slug}.ko`);
    caseStudies[doc.slug] = {
      en: markdownToHtml(doc.content),
      ko: ko ? markdownToHtml(ko.content) : null,
    };
  }
  return <HomeTabs caseStudies={caseStudies} />;
}
