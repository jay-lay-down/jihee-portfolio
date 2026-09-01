import type { MetadataRoute } from "next";
import { PROJECTS } from "./projects/data";
import { getAllDocs } from "@/lib/markdown";
import { SITE_URL } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = PROJECTS.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const posts = getAllDocs("content/posts").map((d) => ({
    url: `${SITE_URL}/blog/${d.slug}`,
    lastModified: d.meta.date ? new Date(d.meta.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "monthly", priority: 0.5 },
    ...projects,
    ...posts,
  ];
}
