import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { LandingPage } from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { LoanReadinessScreen } from "./components/LoanReadinessScreen";
import { ImprovementPlanScreen } from "./components/ImprovementPlanScreen";
import { ScenarioSimulatorScreen } from "./components/ScenarioSimulatorScreen";
import { BankReadyProfileScreen } from "./components/BankReadyProfileScreen";
import { ChatBotScreen } from "./components/ChatBotScreen"; 
import { BottomNavigation } from "./components/BottomNavigation";
import { SideNavigation } from "./components/SideNavigation";

const pageVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

// --- AUTHENTICATED LAYOUT ---
function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-x-hidden">
      {!isOnboarding && (
        <div className="hidden md:flex md:w-64 md:fixed md:inset-y-0 z-20">
          <SideNavigation onLogout={onLogout} />
        </div>
      )}

      <main className={`flex-1 transition-all duration-300 ${!isOnboarding ? "md:ml-64" : "w-full"} pb-20 md:pb-0`}>
        <div className={`${isOnboarding ? "max-w-none p-0" : "max-w-7xl p-4 md:p-8"} mx-auto`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Routes location={location}>
                <Route path="/onboarding" element={
                  <OnboardingScreen 
                    onComplete={() => navigate("/dashboard")} 
                    onNavigateToLogin={() => navigate("/login")}
                    onNavigateToSignup={() => navigate("/signup")}
                  />
                } />
                {/* FIX: Removed the onNavigate prop to match your new DashboardScreen signature */}
                <Route path="/dashboard" element={<DashboardScreen />} />
                
                <Route path="/readiness" element={<LoanReadinessScreen />} />
                <Route path="/improvement" element={<ImprovementPlanScreen />} />
                <Route path="/simulator" element={<ScenarioSimulatorScreen />} />
                <Route path="/profile" element={<BankReadyProfileScreen />} />
                <Route path="/chat" element={<ChatBotScreen onNavigate={(screen) => navigate(`/${screen}`)} />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!isOnboarding && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}

// --- MAIN APP ENTRY ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleLogin = (token?: string) => {
    localStorage.setItem("token", token || "demo-token");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      setIsAuthenticated(false);
      setIsLoggingOut(false);
    }, 1800);
  };

  if (isLoading || isLoggingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {isLoggingOut ? "Signing out" : "LoanHook"}
            </h2>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
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
            <Route path="/" element={<LandingWrapper onLogin={handleLogin} />} />
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupScreen onSignup={() => handleLogin()} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function LandingWrapper({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  return (
    <LandingPage 
      onGetStarted={() => navigate("/signup")} 
      onNavigateToLogin={() => navigate("/login")} 
      onNavigateToSignup={() => navigate("/signup")} 
    />
  );
}