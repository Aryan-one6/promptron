import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { LandingPage } from "@/pages/LandingPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { PromptBuilderPage } from "@/pages/PromptBuilderPage";
import { TemplateDetailPage } from "@/pages/TemplateDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AdminPage } from "@/pages/AdminPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/builder" element={<PromptBuilderPage />} />
          <Route path="/templates/:id" element={<TemplateDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
