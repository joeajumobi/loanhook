import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { LoanReadinessScreen } from "./components/LoanReadinessScreen";
import { ImprovementPlanScreen } from "./components/ImprovementPlanScreen";
import { ScenarioSimulatorScreen } from "./components/ScenarioSimulatorScreen";
import { BankReadyProfileScreen } from "./components/BankReadyProfileScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { SideNavigation } from "./components/SideNavigation";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {!isOnboarding && (
        <div className="hidden md:flex md:w-64 md:fixed md:inset-y-0">
          <SideNavigation />
        </div>
      )}

      <main className={`flex-1 ${!isOnboarding ? "md:ml-64" : "w-full"} pb-20 md:pb-0`}>
        <div className={`${isOnboarding ? "max-w-4xl" : "max-w-7xl"} mx-auto p-4`}>
          <Routes>
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/readiness" element={<LoanReadinessScreen />} />
            <Route path="/improvement" element={<ImprovementPlanScreen />} />
            <Route path="/simulator" element={<ScenarioSimulatorScreen />} />
            <Route path="/profile" element={<BankReadyProfileScreen />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {!isOnboarding && (
            <button
              onClick={onLogout}
              className="mt-8 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
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
    localStorage.removeItem("user");
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
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<AuthenticatedApp onLogout={handleLogout} />} />
        ) : (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupScreen onSignup={handleSignup} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}