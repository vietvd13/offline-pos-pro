
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BranchManagement from "./pages/branches/BranchManagement";
import ProductManagement from "./pages/products/ProductManagement";
import PosTerminal from "./pages/pos/PosTerminal";
import UserManagement from "./pages/users/UserManagement";
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
          <Route path="/branches" element={<BranchManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/pos" element={<PosTerminal />} />
          <Route path="/users" element={<UserManagement />} />
          {/* Additional routes will be added here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
