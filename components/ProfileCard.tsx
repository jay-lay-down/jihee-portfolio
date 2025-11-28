import Image from "next/image";

const LINKS = [
  { label: "GitHub", href: "https://github.com/jay-lay-down" },
  { label: "Hugging Face", href: "https://huggingface.co/Jay1121" },
  { label: "Velog", href: "https://velog.io/@jaylaydown" },
  { label: "Resume", href: "https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jihee-cho-767aa9260/" },
];

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-gray-100">
          <Image
            src="/avatar.png"
            alt="Jihee Cho"
            width={112}
            height={112}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Jihee Cho</h1>
        <p className="text-gray-500">Analytics · Data Science · LLM</p>

        <p className="mt-3 text-sm text-gray-800">
          📊 Data → ✍️ Insight → 🚀 Impact
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Bayesian · Time series · Dashboards · Automation · LLM apps
        </p>

        <div className="mt-5 w-full flex flex-wrap gap-2 justify-center">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-800 hover:bg-gray-50"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="mt-5 w-full text-left text-sm text-gray-700 space-y-2">
          <div className="flex items-center gap-2"><span>📍</span><span>Seoul, KR</span></div>
          <div className="flex items-center gap-2"><span>✉️</span><span>Contact via LinkedIn / Email</span></div>
        </div>
      </div>
    </div>
  );
}
