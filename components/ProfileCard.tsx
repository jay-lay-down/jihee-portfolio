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
      {/* Minimal black header (no image needed) */}
      <div className="relative h-24 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="-mt-10 h-20 w-20 rounded-full overflow-hidden ring-4 ring-white shadow-sm shrink-0 bg-white">
            <Image
              src="/avatar.jpg"
              alt="Jihee Cho"
              width={80}
              height={80}
              className="h-full w-full object-cover grayscale"
              priority
            />
          </div>

          {/* Name / tagline */}
          <div className="pt-1">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">Jihee Cho</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Analytics · Bayesian · Time Series · LLM
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
                Data → Insight → Impact
              </span>
              <span className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white text-[var(--muted)]">
                Seoul
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-5 text-sm text-[var(--muted)] leading-7">
          📊 정성/정량 데이터 통합 · 🧠 베이지안 모델링/대시보드 · 🤖 AI/LLM 응용<br />
          📈 비즈니스 인사이트 · 🧩 Prompt Engineering · 🤝 글로벌 고객사와 협업
        </div>

        {/* Links */}
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

        {/* Email */}
        <div className="mt-5 text-xs text-[var(--muted)]">
          ✉️{" "}
          <a
            className="underline underline-offset-4 hover:text-[var(--fg)] transition"
            href="mailto:jiheecho@gmail.com"
          >
            jiheecho@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
