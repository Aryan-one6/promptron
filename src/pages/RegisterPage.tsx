import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "@promptly/ui";
import { useAuth } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    await registerUser(values);
    navigate("/dashboard");
  });

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10 sm:px-6">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Join Promptly to save and manage prompts.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <Input {...form.register("name")} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <Input {...form.register("email")} placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <Input type="password" {...form.register("password")} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)]">Login</Link>
        </p>
      </Card>
    </div>
  );
}
