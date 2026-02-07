import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "@promptly/ui";
import { api } from "@/lib/api";
import type { Template } from "@/lib/types";
import { SectionHeader } from "@/components/SectionHeader";
import { PlatformLogoRow } from "@/components/PlatformLogoRow";
import { TemplateCard } from "@/components/TemplateCard";

export function LandingPage() {
  const { data: templates = [] } = useQuery({
    queryKey: ["featured-templates"],
    queryFn: () => api.get<Template[]>("/templates?sort=trending"),
    staleTime: 1000 * 60
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-[color:var(--color-accent)/0.1]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 md:flex-row md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)/0.1] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              Promptly Portal
            </div>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Craft powerful prompts for every AI.
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Promptly helps teams build, refine, and deploy prompt systems across OpenAI,
              Gemini, Midjourney, Claude, and future platforms. Build once, ship anywhere.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/builder">
                <Button size="lg">Start Building</Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="secondary">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Card className="animate-fadeUp space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Prompt Snapshot
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  SaaS Launch Brief
                </p>
                <p className="text-sm text-slate-600">
                  Generate a crisp positioning brief with messaging, audience, and launch
                  cadence.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                System: You are a senior product marketer.
                <br />
                Goal: Launch Promptly for a SaaS audience.
                <br />
                Constraints: 500 words max, bullet points.
              </div>
              <Button variant="secondary">Use Template</Button>
            </Card>
            <div className="absolute -right-8 -top-8 hidden h-24 w-24 animate-float rounded-full bg-[color:var(--color-accent)/0.4] blur-2xl md:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeader
          title="Trusted by teams building with multiple AI platforms"
          subtitle="Switch models without rewriting prompts. Keep every prompt consistent, portable, and measurable."
          align="center"
        />
        <div className="mt-8">
          <PlatformLogoRow />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeader
          title="How Promptly Works"
          subtitle="A guided workflow that moves from strategy to production-ready prompts."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Select Platform",
              desc: "Pick OpenAI, Gemini, Midjourney, Claude, and more."
            },
            {
              title: "Define Inputs",
              desc: "Set goals, context, tone, and guardrails for consistency."
            },
            {
              title: "Generate & Export",
              desc: "Receive platform-optimized prompts and export instantly."
            }
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeader
          title="Popular Templates"
          subtitle="Start from proven structures and tailor them in minutes."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {templates.slice(0, 3).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
