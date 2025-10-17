import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NCM from "./pages/NCM";
import CST from "./pages/CST";
import Aliquotas from "./pages/Aliquotas";
import Regimes from "./pages/Regimes";
import Simulador from "./pages/Simulador";
import Fontes from "./pages/Fontes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ncm" element={<NCM />} />
          <Route path="/cst" element={<CST />} />
          <Route path="/aliquotas" element={<Aliquotas />} />
          <Route path="/regimes" element={<Regimes />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/fontes" element={<Fontes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
