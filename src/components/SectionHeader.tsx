import { cn } from "@promptly/ui";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeader({ title, subtitle, align = "left" }: Props) {
  return (
    <div className={cn("space-y-2", align === "center" && "text-center")}>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-600 md:text-base">{subtitle}</p> : null}
    </div>
  );
}
