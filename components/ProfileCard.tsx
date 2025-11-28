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
      <div className="relative h-24 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="-mt-10 h-20 w-20 rounded-full overflow-hidden ring-4 ring-white shadow-sm shrink-0 bg-white">
            <Image
              src="/avatar.jpg"
              alt="Jihee Cho"
              width={80}
              height={80}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="pt-1">
            <h1 className="text-xl font-bold tracking-tight text-[var(--fg)]">Jihee Cho</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Analytics · Bayesian · Time Series · LLM
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/70 text-[var(--muted)]">
                Data → Insight → Impact
              </span>
              <span className="text-xs px-2 py-1 rounded-full border border-[var(--line)] bg-white/70 text-[var(--muted)]">
                Seoul
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-[var(--line)] text-sm text-[var(--fg)] hover:bg-white/40 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="mt-5 text-xs text-[var(--muted)]">
          ✉️{" "}
          <a className="underline underline-offset-4 hover:text-[var(--fg)] transition" href="mailto:chubbyfinger1010@gmail.com">
            chubbyfinger1010@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
