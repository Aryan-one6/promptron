import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card } from "@promptly/ui";
import { api } from "@/lib/api";
import type { Template } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: template } = useQuery({
    queryKey: ["template", id],
    queryFn: () => api.get<Template>(`/templates/${id}`),
    enabled: Boolean(id)
  });

  if (!template) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center text-slate-600">
        Loading template...
      </div>
    );
  }

  const handleSave = async () => {
    await api.post(`/templates/${template.id}/save`);
    await queryClient.invalidateQueries({ queryKey: ["template", id] });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{template.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{template.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/builder?template=${template.id}`)}>
              Use this template
            </Button>
            {user ? (
              <Button variant="ghost" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Login to save</Button>
              </Link>
            )}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Template Overview</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">{template.category.name}</Badge>
            {template.models.map((model) => (
              <Badge key={model.model.id} variant="default">
                {model.model.platform.name}: {model.model.name}
              </Badge>
            ))}
            {template.tags.map((tag) => (
              <Badge key={tag.tag.id} variant="outline">
                {tag.tag.name}
              </Badge>
            ))}
          </div>
          <div className="mt-6 grid gap-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">Role/System</p>
              <p>{String((template.promptSchema as any)?.role || "")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Instructions</p>
              <p>{String((template.promptSchema as any)?.instructions || "")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Constraints</p>
              <p>{String((template.promptSchema as any)?.constraints || "")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Output Format</p>
              <p>{String((template.promptSchema as any)?.outputFormat || "")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
