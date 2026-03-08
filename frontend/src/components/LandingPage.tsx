import { useState, useEffect } from "react";
import { Shield, TrendingUp, Target, DollarSign, PieChart, CheckCircle, ArrowRight, Link2, BarChart3, Users } from "lucide-react";
import { Button } from "./ui/button";
import { LoanReadinessScreen } from "./LoanReadinessScreen";
import { ScenarioSimulatorScreen } from "./ScenarioSimulatorScreen";
import { ImprovementPlanScreen } from "./ImprovementPlanScreen";
import { BankReadyProfileScreen } from "./BankReadyProfileScreen";

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
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

export function LandingPage({ onGetStarted, onNavigateToLogin, onNavigateToSignup }: LandingPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(0);
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(60);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  const getAffordabilityRisk = () => {
    const payment = calculateMonthlyPayment();
    if (payment < 400) return { level: "Low Risk", color: "text-green-600", bg: "bg-green-100" };
    if (payment < 600) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "High Risk", color: "text-red-600", bg: "bg-red-100" };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-sm'
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
              <span className="text-xl font-semibold text-gray-900">BorrowSmart</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Log In
              </button>
              <button
                onClick={onNavigateToSignup}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 2 - Hero / Interactive Onboarding */}
      <section id="features" className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Feature Scroll Wheel */}
            <div className="order-2 lg:order-1">
              <div className="mb-12">
                <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6 font-bold">
                  Smart borrowing<br />starts here
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Get loan-ready with personalized insights and tools designed for first-time borrowers
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-6 mb-12">
                {features.map((feature, index) => {
                  const isActive = index === activeIndex;
                  
                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveIndex(index)}
                      className="w-full text-left group cursor-pointer transition-all duration-300"
                    >
                      <h2
                        className={`text-2xl lg:text-3xl mb-2 transition-all duration-300 font-bold ${
                          isActive 
                            ? 'text-blue-600' 
                            : 'text-gray-300 hover:text-gray-400'
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
                    onClick={() => setActiveIndex(index)}
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
                onClick={onGetStarted}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/30"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-gray-500 mt-4">Free to use • No credit card required</p>
            </div>

            {/* Right Side - iPhone Mockup */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
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
        </div>
      </section>

      {/* SECTION 3 - How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
              How BorrowSmart Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to understand your borrowing power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Link2 className="w-10 h-10 text-blue-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Step 1</span>
                <h3 className="text-2xl text-gray-900 font-bold mt-2">Connect Your Financial Snapshot</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Securely connect your accounts or enter basic financial data in minutes
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">Monthly Income</span>
                    <span className="text-sm font-semibold text-gray-900">$5,200</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">Monthly Expenses</span>
                    <span className="text-sm font-semibold text-gray-900">$3,400</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-10 h-10 text-teal-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Step 2</span>
                <h3 className="text-2xl text-gray-900 font-bold mt-2">Analyze Your Loan Readiness</h3>
              </div>
              <p className="text-gray-600 mb-6">
                BorrowSmart instantly calculates your financial readiness indicators
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
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
                      stroke="#14b8a6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.78)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">78</span>
                    <span className="text-xs text-gray-500">Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Step 3</span>
                <h3 className="text-2xl text-gray-900 font-bold mt-2">Improve and Borrow Smarter</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized recommendations to strengthen your approval chances
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700">Reduce debt by $2,000</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700">Build emergency fund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - Financial Readiness Dashboard Preview */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
              Your Financial Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track the metrics that matter to lenders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Loan Readiness Score */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 font-semibold">Readiness Score</h3>
              </div>
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="transform -rotate-90 w-28 h-28">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - scoreAnimation / 100)}`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{scoreAnimation}</span>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500">Good standing</p>
            </div>

            {/* Debt-to-Income Ratio */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-gray-900 font-semibold">Debt-to-Income</h3>
              </div>
              <p className="text-5xl text-teal-600 mb-2 font-bold">28%</p>
              <p className="text-sm text-gray-500 mb-4">Below 36% recommended</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[28%] bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
              </div>
            </div>

            {/* Savings Buffer */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-gray-900 font-semibold">Savings Buffer</h3>
              </div>
              <p className="text-5xl text-green-600 mb-2 font-bold">4.2</p>
              <p className="text-sm text-gray-500 mb-4">Months of expenses saved</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>
            </div>

            {/* Financial Strengths */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 font-semibold">Key Strengths</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Stable income</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Low debt ratio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Good savings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - Loan Scenario Simulator Preview */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4 font-bold">
              Test Loan Scenarios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Adjust parameters and see real-time updates on affordability
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Controls */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-gray-700 font-semibold">Loan Amount</label>
                    <span className="text-blue-600 font-bold">${loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$5K</span>
                    <span>$50K</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-gray-700 font-semibold">Interest Rate</label>
                    <span className="text-blue-600 font-bold">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold mb-3 block">Loan Term</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[36, 60, 84].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          loanTerm === term
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {term} mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Results */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <p className="text-sm text-gray-500 mb-2">Monthly Payment</p>
                  <p className="text-5xl font-bold text-gray-900 mb-4">
                    ${calculateMonthlyPayment()}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getAffordabilityRisk().bg}`}>
                    <div className={`w-2 h-2 rounded-full ${getAffordabilityRisk().color.replace('text', 'bg')}`}></div>
                    <span className={`text-sm font-semibold ${getAffordabilityRisk().color}`}>
                      {getAffordabilityRisk().level}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <p className="text-sm text-gray-700 font-semibold mb-3">Recommended Range</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Comfortable</span>
                      <span className="text-sm font-semibold text-green-600">$200 - $400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manageable</span>
                      <span className="text-sm font-semibold text-yellow-600">$400 - $600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Risky</span>
                      <span className="text-sm font-semibold text-red-600">$600+</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600 rounded-2xl p-6 text-white">
                  <p className="text-sm opacity-90 mb-2">Total Interest Paid</p>
                  <p className="text-3xl font-bold">
                    ${((calculateMonthlyPayment() * loanTerm) - loanAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - Call-To-Action */}
      <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl text-white mb-6 font-bold">
            Know Before You Borrow
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Understand your financial readiness and make smarter borrowing decisions with confidence
          </p>
          <Button
            onClick={onGetStarted}
            className="h-16 px-10 bg-white hover:bg-gray-50 text-blue-600 rounded-xl text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            Get Started
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <p className="text-blue-100 mt-6">
            Join thousands making smarter borrowing decisions
          </p>
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
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #14b8a6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #14b8a6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
