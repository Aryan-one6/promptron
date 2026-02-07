import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
  ToastProvider,
  useToast
} from "@promptly/ui";
import { api } from "@/lib/api";
import type { Category, Model, Platform, Template } from "@/lib/types";

const formSchema = z.object({
  platformId: z.string().min(1),
  modelId: z.string().min(1),
  useCase: z.string().min(1),
  goal: z.string().min(3),
  context: z.string().optional(),
  tone: z.string().optional(),
  audience: z.string().optional(),
  constraints: z.string().optional(),
  outputFormat: z.string().optional(),
  examples: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  "Platform",
  "Model",
  "Use Case",
  "Inputs",
  "Generate"
];

function BuilderContent() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || undefined;
  const [step, setStep] = React.useState(0);
  const [finalPrompt, setFinalPrompt] = React.useState<string | null>(null);
  const { push } = useToast();

  const { data: platforms = [] } = useQuery({
    queryKey: ["platforms"],
    queryFn: () => api.get<Platform[]>("/platforms")
  });

  const { data: models = [] } = useQuery({
    queryKey: ["models"],
    queryFn: () => api.get<Model[]>("/models")
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories")
  });

  const { data: template } = useQuery({
    queryKey: ["template", templateId],
    queryFn: () => api.get<Template>(`/templates/${templateId}`),
    enabled: Boolean(templateId)
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformId: "",
      modelId: "",
      useCase: "",
      goal: "",
      context: "",
      tone: "",
      audience: "",
      constraints: "",
      outputFormat: "",
      examples: ""
    }
  });

  React.useEffect(() => {
    if (template) {
      form.setValue("goal", template.title);
      form.setValue("context", String((template.promptSchema as any)?.context || ""));
      form.setValue(
        "constraints",
        String((template.promptSchema as any)?.constraints || "")
      );
      form.setValue(
        "outputFormat",
        String((template.promptSchema as any)?.outputFormat || "")
      );
    }
  }, [template, form]);

  const platformModels = form.watch("platformId")
    ? models.filter((model) => model.platform.id === form.watch("platformId"))
    : models;

  const goNext = async () => {
    if (step === 0) {
      await form.trigger("platformId");
      if (!form.getValues("platformId")) return;
    }
    if (step === 1) {
      await form.trigger("modelId");
      if (!form.getValues("modelId")) return;
    }
    if (step === 2) {
      await form.trigger("useCase");
      if (!form.getValues("useCase")) return;
    }
    if (step === 3) {
      await form.trigger(["goal"]);
      if (!form.getValues("goal")) return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleGenerate = form.handleSubmit(async (values) => {
    const payload = {
      platformId: values.platformId,
      modelId: values.modelId,
      templateId,
      inputs: {
        useCase: values.useCase,
        goal: values.goal,
        context: values.context,
        tone: values.tone,
        audience: values.audience,
        constraints: values.constraints,
        outputFormat: values.outputFormat,
        examples: values.examples
      }
    };

    const response = await api.post<{ finalPrompt: string }>("/generate", payload);
    setFinalPrompt(response.finalPrompt);
    push({ title: "Prompt generated", description: "Saved in your history." });
  });

  const exportPrompt = (ext: "txt" | "md") => {
    if (!finalPrompt) return;
    const blob = new Blob([finalPrompt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `promptly-prompt.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {steps.map((label, idx) => (
              <Badge key={label} variant={idx === step ? "accent" : "outline"}>
                Step {idx + 1}: {label}
              </Badge>
            ))}
          </div>

          <Card className="mt-6 p-6">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select Platform</h2>
                <Select
                  value={form.watch("platformId") || undefined}
                  onValueChange={(value) => {
                    form.setValue("platformId", value);
                    form.setValue("modelId", "");
                  }}
                >
                  <SelectTrigger aria-label="Select platform" />
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select Model</h2>
                <Select
                  value={form.watch("modelId") || undefined}
                  onValueChange={(value) => form.setValue("modelId", value)}
                >
                  <SelectTrigger aria-label="Select model" />
                  <SelectContent>
                    {platformModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select Use Case</h2>
                <Select
                  value={form.watch("useCase") || undefined}
                  onValueChange={(value) => form.setValue("useCase", value)}
                >
                  <SelectTrigger aria-label="Select use case" />
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Provide Inputs</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Goal</label>
                    <Input
                      value={form.watch("goal")}
                      onChange={(event) => form.setValue("goal", event.target.value)}
                      placeholder="Describe the outcome you want"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Context</label>
                    <Textarea
                      value={form.watch("context")}
                      onChange={(event) => form.setValue("context", event.target.value)}
                      placeholder="Provide relevant context and background"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Tone</label>
                      <Input
                        value={form.watch("tone")}
                        onChange={(event) => form.setValue("tone", event.target.value)}
                        placeholder="Confident, concise, friendly"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Audience</label>
                      <Input
                        value={form.watch("audience")}
                        onChange={(event) => form.setValue("audience", event.target.value)}
                        placeholder="Founders, marketers, students"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Constraints</label>
                    <Textarea
                      value={form.watch("constraints")}
                      onChange={(event) => form.setValue("constraints", event.target.value)}
                      placeholder="Word count, structure, do-not-do items"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Output format</label>
                    <Input
                      value={form.watch("outputFormat")}
                      onChange={(event) => form.setValue("outputFormat", event.target.value)}
                      placeholder="Markdown, JSON, bullet points"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Examples (optional)</label>
                    <Textarea
                      value={form.watch("examples")}
                      onChange={(event) => form.setValue("examples", event.target.value)}
                      placeholder="Paste example outputs to guide the model"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Generate Final Prompt</h2>
                <p className="text-sm text-slate-600">
                  Review your inputs and generate a platform-optimized prompt.
                </p>
                <Button onClick={handleGenerate}>Generate Prompt</Button>
                {finalPrompt ? (
                  <div className="mt-4 space-y-3">
                    <Textarea value={finalPrompt} readOnly className="min-h-[200px]" />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(finalPrompt);
                          push({ title: "Copied", description: "Prompt copied to clipboard." });
                        }}
                      >
                        Copy to clipboard
                      </Button>
                      <Button variant="ghost" onClick={() => exportPrompt("txt")}>
                        Export .txt
                      </Button>
                      <Button variant="ghost" onClick={() => exportPrompt("md")}>
                        Export .md
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={goNext}>Continue</Button>
              ) : null}
            </div>
          </Card>
        </div>

        <aside className="w-full max-w-sm space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Quality checklist</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Clear goal stated</li>
              <li>Defined constraints</li>
              <li>Output format selected</li>
              <li>Examples provided (optional)</li>
              <li>Tone & audience set</li>
            </ul>
          </Card>
          {template ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Template loaded</h3>
              <p className="mt-2 text-sm text-slate-600">{template.title}</p>
              <p className="mt-3 text-xs text-slate-500">Pre-filled from selected template.</p>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export function PromptBuilderPage() {
  return (
    <ToastProvider>
      <BuilderContent />
    </ToastProvider>
  );
}
