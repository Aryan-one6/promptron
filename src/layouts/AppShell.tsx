import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-900">
      <NavBar />
      <main className="animate-fadeUp">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
