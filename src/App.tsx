import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import HeroPage from "./pages/admin/HeroPage";
import AboutPage from "./pages/admin/AboutPage";
import SkillsPage from "./pages/admin/SkillsPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import BlogPage from "./pages/admin/BlogPage";
import CertificationsPage from "./pages/admin/CertificationsPage";
import ExperiencePage from "./pages/admin/ExperiencePage";
import EducationPage from "./pages/admin/EducationPage";
import AIKnowledgePage from "./pages/admin/AIKnowledgePage";
import MessagesPage from "./pages/admin/MessagesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="ai-knowledge" element={<AIKnowledgePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
