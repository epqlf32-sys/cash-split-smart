import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplitProvider } from "@/context/SplitContext";
import Index from "./pages/Index.tsx";
import AddItem from "./pages/AddItem.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SplitProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SplitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
