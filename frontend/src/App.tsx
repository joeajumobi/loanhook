import { useState } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { LoanReadinessScreen } from "./components/LoanReadinessScreen";
import { ImprovementPlanScreen } from "./components/ImprovementPlanScreen";
import { ScenarioSimulatorScreen } from "./components/ScenarioSimulatorScreen";
import { BankReadyProfileScreen } from "./components/BankReadyProfileScreen";
import { BottomNavigation } from "./components/BottomNavigation";

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto relative">
        {activeScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
        {activeScreen === "readiness" && <LoanReadinessScreen onNavigate={handleNavigate} />}
        {activeScreen === "improvement" && <ImprovementPlanScreen onNavigate={handleNavigate} />}
        {activeScreen === "simulator" && <ScenarioSimulatorScreen onNavigate={handleNavigate} />}
        {activeScreen === "profile" && <BankReadyProfileScreen onNavigate={handleNavigate} />}
        
        <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
