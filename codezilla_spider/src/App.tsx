import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { InfiniteMemoryProvider } from "@/contexts/InfiniteMemoryContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import "./mobile-responsive.css";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ProfileSetup } from "./pages/ProfileSetup";
import { Dashboard } from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AIGeminiMedicineRecommendation } from "@/components/medicine-recommendation/AIGeminiMedicineRecommendation";
import { AIOpenAIMedicineRecommendation } from "@/components/medicine-recommendation/AIOpenAIMedicineRecommendation";
import { InfiniteMemoryDashboard } from "@/components/infinite-memory/InfiniteMemoryDashboard";
import { EnhancedMLPredictionsDashboard } from "@/components/ml-predictions/EnhancedMLPredictionsDashboard";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import RFIDDashboard from "@/components/rfid/RFIDDashboard";
import EchoMedAI from "./pages/EchoMedAI";
import { Profile } from "./pages/Profile";
import ProfileSimple from "./pages/ProfileSimple";
import Settings from "./pages/Settings";
import VoiceMedicineAssistant from "@/components/voice-assistant/VoiceMedicineAssistant";
import AuthDebugger from "@/components/auth/AuthDebugger";
import { SkinAnalysisDashboard } from "@/components/flask-integration/SkinAnalysisDashboard";
import { MarketplaceDashboard } from "@/components/marketplace/MarketplaceDashboard";
import { SupplierDashboard } from "@/components/marketplace/SupplierDashboard";
import { EnhancedMedicineAIDashboard } from "@/components/medicine-recommendation/EnhancedMedicineAIDashboard";
import { DiseaseDiagnosisModel } from "@/components/ml-models/DiseaseDiagnosisModel";
import { MentalHealthModel } from "@/components/ml-models/MentalHealthModel";
import { ReadmissionRiskModel } from "@/components/ml-models/ReadmissionRiskModel";
import { InsuranceCoverageModel } from "@/components/ml-models/InsuranceCoverageModel";
import { MedicalRecordsDashboard } from "@/components/medical-records/MedicalRecordsDashboard";
import { PatientProfile } from "@/components/medical-records/PatientProfile";
import { PrescriptionManager } from "@/components/medical-records/PrescriptionManager";
import UnifiedGeneChain from "@/components/genechain-assist/UnifiedGeneChain";
import { MobileTest } from "@/components/MobileTest";
import { FitnessDashboard } from "@/components/fitness/FitnessDashboard";
import { BmiCalculator } from "@/components/health/BmiCalculator";
import { PeriodTracker } from "@/components/health/PeriodTracker";
import { HealthAnalytics } from "@/components/health/HealthAnalytics";
import { MentalHealthDashboard } from "@/components/zenith/MentalHealthDashboard";
import { SpotifyIntegration } from "@/components/zenith/SpotifyIntegration";
import { AIWellnessPlanner } from "@/components/zenith/AIWellnessPlanner";
import { DroneDelivery } from "@/components/delivery/DroneDelivery";

const queryClient = new QueryClient();



const AppContent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const routes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-medicine-recommendation" element={<AIOpenAIMedicineRecommendation />} />
      <Route path="/infinite-memory" element={<InfiniteMemoryDashboard />} />
      <Route path="/ml-predictions" element={<EnhancedMLPredictionsDashboard />} />
      <Route path="/inventory" element={<InventoryDashboard />} />
      <Route path="/rfid" element={<RFIDDashboard />} />
      <Route path="/echomed-ai" element={<EchoMedAI />} />
      <Route path="/profile" element={<ProfileSimple />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/voice-medicine" element={<VoiceMedicineAssistant />} />
      <Route path="/skin-analysis" element={<SkinAnalysisDashboard />} />
      <Route path="/marketplace" element={<MarketplaceDashboard />} />
      <Route path="/supplier" element={<SupplierDashboard />} />
      <Route path="/enhanced-medicine-ai" element={<EnhancedMedicineAIDashboard />} />
      <Route path="/disease-diagnosis" element={<DiseaseDiagnosisModel />} />
      <Route path="/mental-health" element={<MentalHealthModel />} />
      <Route path="/readmission-risk" element={<ReadmissionRiskModel />} />
      <Route path="/insurance-coverage" element={<InsuranceCoverageModel />} />
      <Route path="/medical-records" element={<MedicalRecordsDashboard />} />
                      <Route path="/patient-profile" element={<PatientProfile />} />
              <Route path="/prescriptions" element={<PrescriptionManager />} />
                    <Route path="/genechain" element={<UnifiedGeneChain />} />
      <Route path="/medicine-recommendation" element={<EnhancedMedicineAIDashboard />} />
      <Route path="/fitness-dashboard" element={<FitnessDashboard />} />
      <Route path="/bmi-calculator" element={<BmiCalculator />} />
      <Route path="/period-tracker" element={<PeriodTracker />} />
      <Route path="/health-analytics" element={<HealthAnalytics />} />
      <Route path="/mental-health" element={<MentalHealthDashboard />} />
      <Route path="/spotify-integration" element={<SpotifyIntegration />} />
      <Route path="/ai-wellness-planner" element={<AIWellnessPlanner />} />
      <Route path="/drone-delivery" element={<DroneDelivery />} />
      <Route path="/mobile-test" element={<MobileTest />} />
      <Route path="/test" element={<AuthDebugger />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
  );

  if (isMobile) {
    return (
      <MobileLayout>
        {routes}
      </MobileLayout>
    );
  }

  return (
    <>
      <Header />
      {routes}
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BlockchainProvider>
            <InventoryProvider>
              <NotificationProvider>
                <InfiniteMemoryProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <AppContent />
                    </BrowserRouter>
                  </TooltipProvider>
                </InfiniteMemoryProvider>
              </NotificationProvider>
            </InventoryProvider>
          </BlockchainProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
