import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import FraudNotifications from "./pages/FraudNotifications";
import DecisionPage from "./pages/DecisionPage";
import RuleHistory from "./pages/RuleHistory";
import GenuineTransactions from "./pages/GenuineTransactions";
import RuleCustomization from "./pages/RuleCustomization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<FraudNotifications />} />
            <Route path="/decision" element={<DecisionPage />} />
            <Route path="/rules" element={<RuleHistory />} />
            <Route path="/genuine" element={<GenuineTransactions />} />
            <Route path="/rule-builder" element={<RuleCustomization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
