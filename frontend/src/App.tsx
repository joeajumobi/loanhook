import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { LoanReadinessScreen } from "./components/LoanReadinessScreen";
import { ImprovementPlanScreen } from "./components/ImprovementPlanScreen";
import { ScenarioSimulatorScreen } from "./components/ScenarioSimulatorScreen";
import { BankReadyProfileScreen } from "./components/BankReadyProfileScreen";
import { ChatBotScreen } from "./components/ChatBotScreen"; // 1. IMPORT CHATBOT
import { BottomNavigation } from "./components/BottomNavigation";
import { SideNavigation } from "./components/SideNavigation";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

// --- AUTHENTICATED LAYOUT ---
function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {!isOnboarding && (
        <div className="hidden md:flex md:w-64 md:fixed md:inset-y-0">
          <SideNavigation />
        </div>
      )}

      <main className={`flex-1 ${!isOnboarding ? "md:ml-64" : "w-full"} pb-20 md:pb-0`}>
        <div className={`${isOnboarding ? "max-w-none p-0" : "max-w-7xl p-4"} mx-auto`}>
          <Routes>
            <Route path="/onboarding" element={
              <OnboardingScreen 
                onComplete={() => navigate("/dashboard")} 
                onNavigateToLogin={() => navigate("/login")}
                onNavigateToSignup={() => navigate("/signup")}
              />
            } />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/readiness" element={<LoanReadinessScreen />} />
            <Route path="/improvement" element={<ImprovementPlanScreen />} />
            <Route path="/simulator" element={<ScenarioSimulatorScreen />} />
            <Route path="/profile" element={<BankReadyProfileScreen />} />
            
            {/* 2. ADD CHAT ROUTE */}
            <Route path="/chat" element={
              <ChatBotScreen onNavigate={(screen) => navigate(`/${screen}`)} />
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {!isOnboarding && (
            <button 
              onClick={onLogout}
              className="mt-8 ml-4 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Logout (Testing)
            </button>
          )}
        </div>
      </main>

      {!isOnboarding && (
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}

// --- ROUTE MANAGER ---
function AppRoutes({ 
  isAuthenticated, 
  handleLogin, 
  handleSignup, 
  handleLogout 
}: any) {
  const navigate = useNavigate();

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<AuthenticatedApp onLogout={handleLogout} />} />
      ) : (
        <>
          <Route path="/" element={
            <LandingPage 
              onGetStarted={() => navigate("/signup")} 
              onNavigateToLogin={() => navigate("/login")} 
              onNavigateToSignup={() => navigate("/signup")} 
            />
          } />
          <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupScreen onSignup={handleSignup} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

// --- MAIN APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleLogin = (token?: string) => {
    if (token) localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleSignup = (token?: string) => {
    if (token) localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-medium animate-pulse text-lg">LoanHook...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}