import "./globals.css";

export const metadata = {
  title: "Jihee Cho | Portfolio",
  description: "Analytics · Data Science · Bayesian · Time Series · LLM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-50 backdrop-blur bg-white/75 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight">
              Jihee Cho
            </a>
            <nav className="flex items-center gap-4 text-sm text-gray-700">
              <a className="hover:text-gray-900" href="/projects">Projects</a>
              <a className="hover:text-gray-900" href="/blog">Blog</a>
              <a className="hover:text-gray-900" href="https://github.com/jay-lay-down" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-600 flex flex-col gap-2">
            <div>© {new Date().getFullYear()} Jihee Cho</div>
            <div className="flex flex-wrap gap-3">
              <a className="underline underline-offset-4" href="https://huggingface.co/Jay1121" target="_blank" rel="noreferrer">Hugging Face</a>
              <a className="underline underline-offset-4" href="https://velog.io/@jaylaydown" target="_blank" rel="noreferrer">Velog</a>
              <a className="underline underline-offset-4" href="https://github.com/jay-lay-down/jiheecho/blob/main/assets/RESUME.md" target="_blank" rel="noreferrer">Resume</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
