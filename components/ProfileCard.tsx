import Image from "next/image";

const LINKS = [
  { label: "Hugging Face", href: "https://huggingface.co/Jay1121" },
  { label: "Velog", href: "https://velog.io/@jaylaydown" },
  { label: "Resume", href: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md" },
  { label: "GitHub", href: "https://github.com/jay-lay-down" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jihee-cho-767aa9260/" },
];

export default function ProfileCard() {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="relative h-36 w-full">
        <Image src="/header.jpg" alt="Header" fill className="object-cover grayscale" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-sm shrink-0">
            <Image
              src="/avatar.png"
              alt="Jihee Cho"
              width={64}
              height={64}
              className="h-full w-full object-cover grayscale"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">Jihee Cho</h1>
            <p className="text-sm text-[var(--muted)]">Analytics · Bayesian · Time Series · LLM</p>
            <p className="text-xs text-[var(--muted)] mt-1">Data → Insight → Impact</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-[var(--line)] text-sm text-[var(--fg)] hover:bg-[var(--soft)] transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="mt-5 text-sm text-[var(--muted)] leading-7">
          📊 정성/정량 데이터 통합 · 🧠 베이지안 모델링/대시보드 · 🤖 AI/LLM 응용<br />
          📈 비즈니스 인사이트 · 🧩 Prompt Engineering · 🤝 글로벌 고객사와 협업
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-1">
            📍 Seoul
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-1">
            ✉️{" "}
            <a className="underline underline-offset-4 hover:text-[var(--fg)] transition" href="mailto:jiheecho@gmail.com">
              jiheecho@gmail.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
