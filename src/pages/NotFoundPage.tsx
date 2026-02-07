import { Link } from "react-router-dom";
import { Button } from "@promptly/ui";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">
        The page you are looking for doesn’t exist. Let’s get you back to Promptly.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
