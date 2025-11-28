import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Jihee Cho | Portfolio",
  description: "Analytics · Bayesian · Time Series · LLM · Dashboards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
        <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/85 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight hover:opacity-80 transition">
              Jihee Cho
            </a>

            <nav className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <a className="hover:text-[var(--fg)] transition" href="/projects">
                Projects
              </a>
              <a className="hover:text-[var(--fg)] transition" href="/blog">
                Blog
              </a>
              <a
                className="hover:text-[var(--fg)] transition"
                href="https://github.com/jay-lay-down"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-[var(--line)] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-[var(--muted)] flex flex-col gap-2">
            <div>© {new Date().getFullYear()} Jihee Cho</div>
            <div className="flex flex-wrap gap-3">
              <a
                className="underline underline-offset-4 hover:text-[var(--fg)] transition"
                href="https://huggingface.co/Jay1121"
                target="_blank"
                rel="noreferrer"
              >
                Hugging Face
              </a>
              <a
                className="underline underline-offset-4 hover:text-[var(--fg)] transition"
                href="https://velog.io/@jaylaydown"
                target="_blank"
                rel="noreferrer"
              >
                Velog
              </a>
              <a
                className="underline underline-offset-4 hover:text-[var(--fg)] transition"
                href="https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
