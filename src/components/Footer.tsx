export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="text-base font-semibold text-slate-800">Promptly</div>
          <p className="max-w-sm">
            Craft powerful prompts for every AI. Build faster, launch smarter, and stay
            consistent across platforms.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a className="transition hover:text-slate-800" href="mailto:hello@promptly.ai">
            hello@promptly.ai
          </a>
          <a className="transition hover:text-slate-800" href="/">
            Terms
          </a>
          <a className="transition hover:text-slate-800" href="/">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
