import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, Select, SelectContent, SelectItem, SelectTrigger } from "@promptly/ui";
import { api } from "@/lib/api";
import type { Platform, Model, Category, Tag, Template } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<Tag[]>("/tags")
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.get<Template[]>("/templates?sort=newest")
  });

  const [platformForm, setPlatformForm] = React.useState({ name: "", slug: "" });
  const [modelForm, setModelForm] = React.useState({ platformId: "", name: "", slug: "" });
  const [categoryForm, setCategoryForm] = React.useState({ name: "", slug: "" });
  const [tagForm, setTagForm] = React.useState({ name: "", slug: "" });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center text-slate-600">
        Admin access required.
      </div>
    );
  }

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["platforms"] });
    queryClient.invalidateQueries({ queryKey: ["models"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    queryClient.invalidateQueries({ queryKey: ["templates"] });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-600">Manage platforms, models, and featured templates.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Platforms</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              placeholder="Platform name"
              value={platformForm.name}
              onChange={(event) => setPlatformForm({ ...platformForm, name: event.target.value })}
            />
            <Input
              placeholder="slug"
              value={platformForm.slug}
              onChange={(event) => setPlatformForm({ ...platformForm, slug: event.target.value })}
            />
            <Button
              onClick={async () => {
                await api.post("/admin/platforms", platformForm);
                setPlatformForm({ name: "", slug: "" });
                refresh();
              }}
            >
              Add platform
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Models</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Select
              value={modelForm.platformId || undefined}
              onValueChange={(value) => setModelForm({ ...modelForm, platformId: value })}
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
            <Input
              placeholder="Model name"
              value={modelForm.name}
              onChange={(event) => setModelForm({ ...modelForm, name: event.target.value })}
            />
            <Input
              placeholder="slug"
              value={modelForm.slug}
              onChange={(event) => setModelForm({ ...modelForm, slug: event.target.value })}
            />
            <Button
              onClick={async () => {
                await api.post("/admin/models", modelForm);
                setModelForm({ platformId: "", name: "", slug: "" });
                refresh();
              }}
            >
              Add model
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              placeholder="Category name"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
            />
            <Input
              placeholder="slug"
              value={categoryForm.slug}
              onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })}
            />
            <Button
              onClick={async () => {
                await api.post("/admin/categories", categoryForm);
                setCategoryForm({ name: "", slug: "" });
                refresh();
              }}
            >
              Add category
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              placeholder="Tag name"
              value={tagForm.name}
              onChange={(event) => setTagForm({ ...tagForm, name: event.target.value })}
            />
            <Input
              placeholder="slug"
              value={tagForm.slug}
              onChange={(event) => setTagForm({ ...tagForm, slug: event.target.value })}
            />
            <Button
              onClick={async () => {
                await api.post("/admin/tags", tagForm);
                setTagForm({ name: "", slug: "" });
                refresh();
              }}
            >
              Add tag
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold">Feature Templates</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <div key={template.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{template.title}</p>
                  <p className="text-xs text-slate-500">{template.category.name}</p>
                </div>
                <Button
                  variant={template.isFeatured ? "secondary" : "ghost"}
                  onClick={async () => {
                    await api.patch(
                      `/admin/templates/${template.id}/${template.isFeatured ? "unfeature" : "feature"}`
                    );
                    refresh();
                  }}
                >
                  {template.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
