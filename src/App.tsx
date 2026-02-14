import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ClinicsPage from "./pages/ClinicsPage";
import UsersPage from "./pages/UsersPage";
import InhalersPage from "./pages/InhalersPage";
import ReferralsPage from "./pages/ReferralsPage";
import DiseasesPage from "./pages/DiseasesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/clinics" replace />} />
          <Route element={<AdminLayout />}>
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/inhalers" element={<InhalersPage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
