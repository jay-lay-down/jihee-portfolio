import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

/*
  생성형 엔진 크롤러를 명시적으로 허용한다. 기본값으로도 막히지는 않지만,
  AI 답변에 인용되는 것이 이 사이트의 목적 중 하나라 의도를 분명히 적어 둔다.
*/
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
