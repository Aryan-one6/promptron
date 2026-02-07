import { Link } from "react-router-dom";
import { Badge, Card, Button } from "@promptly/ui";
import type { Template } from "@/lib/types";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{template.description}</p>
        </div>
        {template.isFeatured ? <Badge variant="accent">Featured</Badge> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{template.category.name}</Badge>
        {template.models.slice(0, 2).map((model) => (
          <Badge key={model.model.id} variant="default">
            {model.model.platform.name}: {model.model.name}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {template.tags.slice(0, 3).map((tag) => (
          <Badge key={tag.tag.id} variant="outline">
            {tag.tag.name}
          </Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
        <span>Saved {template._count.savedBy} times</span>
        <Link to={`/templates/${template.id}`}>
          <Button variant="secondary" size="sm">
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
}
