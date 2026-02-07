import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({
  children,
  requireAdmin
}: {
  children: JSX.Element;
  requireAdmin?: boolean;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
