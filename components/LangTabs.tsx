"use client";

import { useEffect, useState } from "react";

type LocalizedDoc = {
  meta: {
    title: string;
    date?: string;
    description?: string;
    tags?: string[];
  };
  html: string;
};

export default function LangTabs({ en, ko }: { en: LocalizedDoc; ko: LocalizedDoc | null }) {
  const [lang, setLang] = useState<"ko" | "en">(ko ? "ko" : "en");
  useEffect(() => {
    const saved = window.localStorage.getItem("site-lang");
    if (saved === "en" || (saved === "ko" && ko)) setLang(saved as "ko" | "en");
  }, [ko]);
  const pickLang = (l: "ko" | "en") => {
    setLang(l);
    try {
      window.localStorage.setItem("site-lang", l);
    } catch {}
  };
  const doc = lang === "ko" && ko ? ko : en;

  return (
    <div className="mt-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-7">
      {ko && (
        <div className="mb-4 flex gap-2">
          {(["ko", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => pickLang(l)}
              className={
                "px-4 py-1.5 rounded-full text-xs font-bold border transition " +
                (lang === l
                  ? "bg-[#8C5E35] text-white border-[#8C5E35]"
                  : "bg-white text-stone-500 border-stone-300 hover:border-[#8C5E35] hover:text-[#8C5E35]")
              }
            >
              {l === "ko" ? "한국어" : "English"}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">{doc.meta.title}</h1>

      {(doc.meta.date || doc.meta.description) && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          {doc.meta.date ?? ""}
          {doc.meta.date && doc.meta.description ? " · " : ""}
          {doc.meta.description ?? ""}
        </p>
      )}

      {!!doc.meta.tags?.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {doc.meta.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </div>
  );
}
