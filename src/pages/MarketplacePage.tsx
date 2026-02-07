import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger, Button } from "@promptly/ui";
import { api } from "@/lib/api";
import type { Category, Model, Platform, Tag, Template } from "@/lib/types";
import { FilterPanel, type FilterState } from "@/components/FilterPanel";
import { TemplateCard } from "@/components/TemplateCard";

const defaultFilters: FilterState = {
  search: "",
  platform: "",
  model: "",
  category: "",
  tags: [],
  sort: "trending"
};

export function MarketplacePage() {
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters);

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

  const queryString = React.useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.platform) params.set("platform", filters.platform);
    if (filters.model) params.set("model", filters.model);
    if (filters.category) params.set("category", filters.category);
    if (filters.tags.length) params.set("tags", filters.tags.join(","));
    if (filters.sort) params.set("sort", filters.sort);
    return params.toString();
  }, [filters]);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["templates", queryString],
    queryFn: () => api.get<Template[]>(`/templates?${queryString}`)
  });

  const filteredModels = filters.platform
    ? models.filter((model) => model.platform.slug === filters.platform)
    : models;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Prompt Marketplace</h1>
          <p className="mt-2 text-sm text-slate-600">
            Discover templates for every platform and use case.
          </p>
        </div>
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Filters</Button>
            </DrawerTrigger>
            <DrawerContent side="right">
              <DrawerTitle className="text-lg font-semibold">Filters</DrawerTitle>
              <div className="mt-6">
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  platforms={platforms}
                  models={filteredModels}
                  categories={categories}
                  tags={tags}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              platforms={platforms}
              models={filteredModels}
              categories={categories}
              tags={tags}
            />
          </div>
        </div>

        <div>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
          {!isLoading && templates.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">No templates match your filters.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
