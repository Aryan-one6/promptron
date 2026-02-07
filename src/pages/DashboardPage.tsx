import { useQuery } from "@tanstack/react-query";
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from "@promptly/ui";
import { api } from "@/lib/api";
import type { Template } from "@/lib/types";
import { TemplateCard } from "@/components/TemplateCard";
import { Link } from "react-router-dom";

type GeneratedPrompt = {
  id: string;
  finalPrompt: string;
  createdAt: string;
  platform: { name: string };
  model: { name: string };
};

export function DashboardPage() {
  const { data: myTemplates = [] } = useQuery({
    queryKey: ["my-templates"],
    queryFn: () => api.get<Template[]>("/me/templates")
  });

  const { data: savedTemplates = [] } = useQuery({
    queryKey: ["saved-templates"],
    queryFn: () => api.get<Template[]>("/me/saved")
  });

  const { data: generated = [] } = useQuery({
    queryKey: ["generated-prompts"],
    queryFn: () => api.get<GeneratedPrompt[]>("/me/generated")
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Your Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage templates and track your generated prompts.
          </p>
        </div>
        <Link to="/builder">
          <Button>Create new prompt</Button>
        </Link>
      </div>

      <Tabs defaultValue="my" className="mt-8">
        <TabsList>
          <TabsTrigger value="my">My templates</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="generated">Generated</TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {myTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {savedTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated">
          <div className="mt-6 grid gap-4">
            {generated.map((prompt) => (
              <Card key={prompt.id} className="p-5">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>
                    {prompt.platform.name} · {prompt.model.name}
                  </span>
                  <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">
                  {prompt.finalPrompt}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
