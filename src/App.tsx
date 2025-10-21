import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import InteractiveMap from "./pages/InteractiveMap";
import ReportHazard from "./pages/ReportHazard";
import Analytics from "./pages/Analytics";
import SocialMonitor from "./pages/SocialMonitor";
import ReportsReview from "./pages/ReportsReview";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/map" element={<InteractiveMap />} />
                    <Route path="/report" element={<ReportHazard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/social" element={<SocialMonitor />} />
                    <Route path="/reports" element={<ReportsReview />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};



export default App;
