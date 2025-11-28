import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Jihee Cho | Portfolio",
  description: "Analytics · Bayesian · Time Series · LLM · Dashboards",
};

const LINKS = {
  hf: "https://huggingface.co/Jay1121",
  velog: "https://velog.io/@jaylaydown",
  github: "https://github.com/jay-lay-down",
  resumePdf: "/resume.pdf", // ✅ public/resume.pdf 올리면 됨 (없으면 404)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
        <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,247,239,.78)] backdrop-blur">
          <div className="container-wide px-10 py-4 flex items-center justify-between">
            <a href="/" className="text-[15px] font-extrabold tracking-tight hover:opacity-80 transition">
              Jihee Cho
            </a>

            <nav className="flex items-center gap-8 text-sm text-[var(--muted)]">
              <a className="hover:text-[var(--fg)] transition" href="/projects">Projects</a>
              <a className="hover:text-[var(--fg)] transition" href="/blog">Blog</a>
              <a className="hover:text-[var(--fg)] transition" href={LINKS.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>

              <a
                href={LINKS.resumePdf}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-semibold hover:opacity-85 transition"
              >
                Resume PDF <span className="text-[var(--muted)]">↗</span>
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 border-t border-[var(--line)] bg-white/60">
          <div className="container-wide px-10 py-10 text-sm text-[var(--muted)] flex items-center justify-between">
            <div>© {new Date().getFullYear()} Jihee Cho</div>
            <div className="flex items-center gap-6">
              <a className="hover:text-[var(--fg)] transition underline underline-offset-4" href={LINKS.hf} target="_blank" rel="noreferrer">
                Hugging Face
              </a>
              <a className="hover:text-[var(--fg)] transition underline underline-offset-4" href={LINKS.velog} target="_blank" rel="noreferrer">
                Velog
              </a>
              <a className="hover:text-[var(--fg)] transition underline underline-offset-4" href={LINKS.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
