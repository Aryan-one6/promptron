const platforms = [
  "OpenAI",
  "Gemini",
  "Midjourney",
  "Claude",
  "Perplexity",
  "Cohere"
];

export function PlatformLogoRow() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-center text-sm font-semibold text-slate-500 shadow-soft sm:grid-cols-3 md:grid-cols-6">
      {platforms.map((platform) => (
        <div
          key={platform}
          className="flex items-center justify-center rounded-xl border border-slate-100 bg-white px-3 py-3"
        >
          {platform}
        </div>
      ))}
    </div>
  );
}
