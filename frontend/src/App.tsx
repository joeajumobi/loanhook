import { useState, useEffect } from "react";
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
import { BrowserRouter } from "react-router-dom";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<"landing" | "login" | "signup">("landing");
  const [activeScreen, setActiveScreen] = useState("dashboard");

  useEffect(() => {
    const initTranslate = () => {
      // If the Google script is loaded and the element exists but is empty
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    // Small delay to ensure the DOM element with id="google_translate_element" is actually there
    const timer = setTimeout(initTranslate, 500);
    return () => clearTimeout(timer);
  }, [activeScreen, isAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token?: string) => {
    if (token) localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setActiveScreen("dashboard");
  };

  // UPDATED: Now accepts and saves the token to prevent the landing page loop
  const handleSignup = (token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setIsAuthenticated(true);
    setActiveScreen("dashboard"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthScreen("landing");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-medium animate-pulse">Loading LoanHook...</div>
      </div>
    );
  }

  // Auth Flow
  if (!isAuthenticated) {
    if (authScreen === "login") {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToSignup={() => setAuthScreen("signup")}
        />
      );
    } else if (authScreen === "signup") {
      return (
        <SignupScreen
          onSignup={handleSignup} 
          onNavigateToLogin={() => setAuthScreen("login")}
        />
      );
    } else {
      return (
        <LandingPage
          onGetStarted={() => setAuthScreen("signup")}
          onNavigateToLogin={() => setAuthScreen("login")}
          onNavigateToSignup={() => setAuthScreen("signup")}
        />
      );
    }
  }

  // Main App Flow Switch Logic
  const renderContent = () => {
    switch (activeScreen) {
      case "onboarding":
        return <OnboardingScreen onNavigate={setActiveScreen} onComplete={() => setActiveScreen("dashboard")} />;
      case "dashboard":
        return <DashboardScreen onNavigate={setActiveScreen} />;
      case "readiness":
        return <LoanReadinessScreen onNavigate={setActiveScreen} />;
      case "improvement":
        return <ImprovementPlanScreen onNavigate={setActiveScreen} />;
      case "simulator":
        return <ScenarioSimulatorScreen onNavigate={setActiveScreen} />;
      case "profile":
        return <BankReadyProfileScreen onNavigate={setActiveScreen} />;
      default:
        return <DashboardScreen onNavigate={setActiveScreen} />;
    }
  };

  const isOnboarding = activeScreen === "onboarding";

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Hide Nav during Onboarding to prevent stacking/overlaps */}
        
        {!isOnboarding && (
          <div className="hidden md:flex md:w-64 md:fixed md:inset-y-0">
            <SideNavigation activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </div>
        )}
        
        <div className={isOnboarding ? "w-full" : "md:ml-64"}>
          <div className={`${isOnboarding ? "max-w-4xl" : "max-w-md md:max-w-none"} mx-auto relative p-4`}>
            
            {renderContent()}
            
            {!isOnboarding && (
              <button 
                onClick={handleLogout}
                className="mt-8 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Logout (Testing)
              </button>
            )}
          </div>
        </div>
        
        {!isOnboarding && (
          <div className="md:hidden">
            <BottomNavigation activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}