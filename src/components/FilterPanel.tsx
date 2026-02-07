import { Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger } from "@promptly/ui";
import type { Category, Platform, Model, Tag } from "@/lib/types";

export type FilterState = {
  search: string;
  platform: string;
  model: string;
  category: string;
  tags: string[];
  sort: string;
};

type Props = {
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  platforms: Platform[];
  models: Model[];
  categories: Category[];
  tags: Tag[];
};

export function FilterPanel({
  filters,
  setFilters,
  platforms,
  models,
  categories,
  tags
}: Props) {
  const platformValue = filters.platform || "all";
  const modelValue = filters.model || "all";
  const categoryValue = filters.category || "all";

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Search</label>
        <Input
          placeholder="Search templates"
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Platform</label>
        <Select
          value={platformValue}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              platform: value === "all" ? "" : value,
              model: ""
            })
          }
        >
          <SelectTrigger aria-label="Select platform" />
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.slug}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Model</label>
        <Select
          value={modelValue}
          onValueChange={(value) =>
            setFilters({ ...filters, model: value === "all" ? "" : value })
          }
        >
          <SelectTrigger aria-label="Select model" />
          <SelectContent>
            <SelectItem value="all">All models</SelectItem>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.slug}>
                {model.platform.name} - {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
        <Select
          value={categoryValue}
          onValueChange={(value) =>
            setFilters({ ...filters, category: value === "all" ? "" : value })
          }
        >
          <SelectTrigger aria-label="Select category" />
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase text-slate-500">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = filters.tags.includes(tag.slug);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  const nextTags = active
                    ? filters.tags.filter((slug) => slug !== tag.slug)
                    : [...filters.tags, tag.slug];
                  setFilters({ ...filters, tags: nextTags });
                }}
              >
                <Badge variant={active ? "accent" : "outline"}>{tag.name}</Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Sort</label>
        <Select
          value={filters.sort}
          onValueChange={(value) => setFilters({ ...filters, sort: value })}
        >
          <SelectTrigger aria-label="Sort" />
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="mostSaved">Most Saved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        onClick={() =>
          setFilters({ search: "", platform: "", model: "", category: "", tags: [], sort: "trending" })
        }
      >
        Reset filters
      </Button>
    </div>
  );
}
