import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CityProvider } from "@/context/CityContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import HeatMap from "./pages/HeatMap";
import TreePlanner from "./pages/TreePlanner";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CityProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/heat-map" element={<HeatMap />} />
              <Route path="/tree-planner" element={<TreePlanner />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </CityProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
