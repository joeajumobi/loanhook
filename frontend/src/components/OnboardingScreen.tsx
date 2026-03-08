import { useState, useRef, useEffect } from "react";
import { Shield, TrendingUp, Target, DollarSign, PieChart, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { LoanReadinessScreen } from "./LoanReadinessScreen";
import { ScenarioSimulatorScreen } from "./ScenarioSimulatorScreen";
import { ImprovementPlanScreen } from "./ImprovementPlanScreen";
import { BankReadyProfileScreen } from "./BankReadyProfileScreen";

interface OnboardingScreenProps {
  onComplete: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const features = [
  {
    id: "readiness",
    headline: "Know Your Loan Readiness",
    subtext: "See if you're financially prepared to take on a loan before applying.",
    screen: "readiness"
  },
  {
    id: "scenarios",
    headline: "Test Loan Scenarios",
    subtext: "Adjust loan amounts, terms, and interest rates to see what you can safely afford.",
    screen: "simulator"
  },
  {
    id: "improvement",
    headline: "Improve Your Approval Odds",
    subtext: "Get personalized steps to strengthen your financial profile.",
    screen: "improvement"
  },
  {
    id: "snapshot",
    headline: "See Your Financial Snapshot",
    subtext: "View your financial strengths and key metrics in one clear profile.",
    screen: "profile"
  }
];

export function OnboardingScreen({ onComplete, onNavigateToLogin, onNavigateToSignup }: OnboardingScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageScrollRef = useRef<HTMLDivElement>(null);

  // Handle navbar scroll effect
  useEffect(() => {
    const handlePageScroll = () => {
      if (pageScrollRef.current) {
        setScrolled(pageScrollRef.current.scrollTop > 50);
      }
    };

    const container = pageScrollRef.current;
    if (container) {
      container.addEventListener('scroll', handlePageScroll);
      return () => container.removeEventListener('scroll', handlePageScroll);
    }
  }, []);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        setScoreAnimation(current);
        if (current >= 78) clearInterval(interval);
      }, 20);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
  };

  const renderScreen = () => {
    const activeScreen = features[activeIndex].screen;
    const dummyNavigate = () => {};
    
    switch (activeScreen) {
      case "readiness":
        return <LoanReadinessScreen onNavigate={dummyNavigate} />;
      case "simulator":
        return <ScenarioSimulatorScreen onNavigate={dummyNavigate} />;
      case "improvement":
        return <ImprovementPlanScreen onNavigate={dummyNavigate} />;
      case "profile":
        return <BankReadyProfileScreen onNavigate={dummyNavigate} />;
      default:
        return null;
    }
  };

  return (
    <div ref={pageScrollRef} className="h-screen overflow-y-auto bg-white">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-gray-900">BorrowSmart</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onNavigateToSignup}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="hidden md:flex h-screen">
          {/* Left Side - Feature Scroll Wheel */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-xl">
              <div className="mb-16">
                <h1 className="text-5xl lg:text-6xl text-gray-900 mb-4">
                  Smart borrowing<br />starts here
                </h1>
                <p className="text-xl text-gray-600">
                  Get loan-ready with personalized insights and tools
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-6 mb-12">
                {features.map((feature, index) => {
                  const isActive = index === activeIndex;
                  
                  return (
                    <button
                      key={feature.id}
                      onClick={() => scrollToIndex(index)}
                      className="w-full text-left group cursor-pointer transition-all duration-300"
                    >
                      <h2
                        className={`text-2xl lg:text-3xl mb-2 transition-all duration-300 ${
                          isActive 
                            ? 'text-blue-600 font-bold' 
                            : 'text-gray-400 font-semibold hover:text-gray-500'
                        }`}
                      >
                        {feature.headline}
                      </h2>
                      <p
                        className={`text-base lg:text-lg transition-all duration-300 ${
                          isActive 
                            ? 'text-gray-600' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        {feature.subtext}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mb-10">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-12 bg-blue-600'
                        : 'w-8 bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={onComplete}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl text-lg"
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Right Side - iPhone Mockup */}
          <div className="w-1/2 flex items-center justify-center p-8 lg:p-16">
            <div className="relative">
              {/* iPhone Frame */}
              <div className="relative w-80 h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-20"></div>
                
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Screen Content with Transition */}
                  <div
                    key={activeIndex}
                    className="absolute inset-0 animate-fadeSlide"
                    style={{
                      transform: 'scale(0.95)',
                      transformOrigin: 'top center'
                    }}
                  >
                    {renderScreen()}
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>

              {/* Shadow */}
              <div className="absolute inset-0 bg-blue-600/10 rounded-[3rem] blur-3xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden min-h-screen flex flex-col px-6 pt-12">
          <div className="mb-12">
            <h1 className="text-4xl text-gray-900 mb-4">
              Smart borrowing<br />starts here
            </h1>
            <p className="text-lg text-gray-600">
              Get loan-ready with personalized insights and tools
            </p>
          </div>

          <div className="flex-1 space-y-4 pb-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-xl mb-2 text-gray-900 font-semibold">{feature.headline}</h3>
                <p className="text-gray-600">{feature.subtext}</p>
              </div>
            ))}
          </div>

          <div className="pb-8 pt-4">
            <Button
              onClick={onComplete}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl text-lg"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Interactive Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Everything you need to get loan-ready
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive tools and personalized insights to help you make smart borrowing decisions
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Readiness Score Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-3">Loan Readiness Score</h3>
              <p className="text-gray-600 mb-6">
                See your current readiness level and what impacts your score
              </p>
              {/* Animated Score Gauge */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - scoreAnimation / 100)}`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl text-gray-900">{scoreAnimation}</span>
                </div>
              </div>
            </div>

            {/* Scenario Simulator Card */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-3">Interactive Simulator</h3>
              <p className="text-gray-600 mb-6">
                Test different loan amounts and terms to find what works for you
              </p>
              {/* Slider Demo */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Loan Amount</span>
                    <span className="text-teal-600 font-semibold">$25,000</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Monthly Payment</span>
                    <span className="text-teal-600 font-semibold">$512</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Plan Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-3">Personalized Plan</h3>
              <p className="text-gray-600 mb-6">
                Get actionable steps to improve your loan approval chances
              </p>
              {/* Action Items */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Reduce credit card balance by $2,000</span>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Build 3-month emergency fund</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Metrics Dashboard Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl text-gray-900 mb-3">Your Financial Dashboard</h3>
              <p className="text-lg text-gray-600">
                Track key metrics that lenders care about
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Debt-to-Income Ratio */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-gray-900">Debt-to-Income</h4>
                </div>
                <p className="text-4xl text-blue-600 mb-2">28%</p>
                <p className="text-sm text-gray-500">Below 36% recommended</p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[28%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
              </div>

              {/* Savings Buffer */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="text-gray-900">Savings Buffer</h4>
                </div>
                <p className="text-4xl text-teal-600 mb-2">4.2 mo</p>
                <p className="text-sm text-gray-500">3+ months recommended</p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
                </div>
              </div>

              {/* Credit Utilization */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-gray-900">Credit Utilization</h4>
                </div>
                <p className="text-4xl text-green-600 mb-2">22%</p>
                <p className="text-sm text-gray-500">Below 30% recommended</p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[22%] bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(0.95) translateY(0);
          }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
