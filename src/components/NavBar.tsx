import { Link, NavLink } from "react-router-dom";
import { Button } from "@promptly/ui";
import { useAuth } from "@/lib/auth";

const navItems = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Prompt Builder", to: "/builder" },
  { label: "Templates", to: "/marketplace?sort=trending" },
  { label: "Pricing", to: "/" }
];

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-2xl bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white">
            Promptly
          </span>
          <span className="hidden text-sm font-semibold text-slate-600 sm:inline">
            Prompt Generator Portal
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--color-primary)]"
                  : "transition hover:text-slate-900"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
