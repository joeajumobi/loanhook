import { CheckCircle2, AlertTriangle, TrendingUp, Shield, DollarSign } from "lucide-react";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// We can keep the interface empty or remove it if not used elsewhere
interface LoanReadinessScreenProps {
  onNavigate?: (screen: string) => void;
}

export function LoanReadinessScreen({ onNavigate }: LoanReadinessScreenProps) {
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const readinessData = {
    score: 72,
    safeLoanAmount: 15000,
    maxAffordablePayment: 450,
    debtToIncome: 28,
    savingsBuffer: 6.5,
    approvalLikelihood: 75
  };

  const indicators = [
    {
      label: "Debt-to-Income Ratio",
      value: readinessData.debtToIncome,
      max: 100,
      status: "good",
      icon: TrendingUp,
      description: "28% - Healthy range (below 36%)",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Savings Buffer",
      value: (readinessData.savingsBuffer / 12) * 100,
      max: 100,
      status: "good",
      icon: Shield,
      description: "6.5 months of expenses saved",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Approval Likelihood",
      value: readinessData.approvalLikelihood,
      max: 100,
      status: "warning",
      icon: DollarSign,
      description: "75% - Good chance with major lenders",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Loan Readiness</h1>
        <p className="text-blue-100">Your borrowing capacity analysis</p>
      </div>

      {/* Safe Loan Amount */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm text-gray-600">Estimated Safe Loan Amount</h2>
              <p className="text-3xl text-gray-900">${readinessData.safeLoanAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-sm text-green-800">
              Based on your income and expenses, you can safely borrow up to this amount without financial strain.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Max monthly payment</span>
              <span className="text-gray-900">${readinessData.maxAffordablePayment}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Risk Indicators</h2>
        <div className="space-y-4">
          {indicators.map((indicator) => {
            const Icon = indicator.icon;
            return (
              <div key={indicator.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 ${indicator.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${indicator.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-900 mb-1">{indicator.label}</h3>
                    <p className={`text-xs ${indicator.color}`}>{indicator.description}</p>
                  </div>
                </div>
                <Progress value={indicator.value} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Readiness Factors */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Readiness Factors</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Stable Income Stream</p>
              <p className="text-xs text-gray-500 mt-1">Regular monthly income detected</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Healthy Savings Buffer</p>
              <p className="text-xs text-gray-500 mt-1">6+ months emergency fund</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Low Debt-to-Income</p>
              <p className="text-xs text-gray-500 mt-1">Well below the 36% threshold</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Limited Credit History</p>
              <p className="text-xs text-gray-500 mt-1">Building credit could improve rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-6 mb-6 space-y-3">
        {/* 3. Updated onClick to use navigate() */}
        <button 
          onClick={() => navigate('/improvement')}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white h-12 rounded-xl"
        >
          View Improvement Plan
        </button>
        <button 
          onClick={() => navigate('/simulator')}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 h-12 rounded-xl border border-gray-200"
        >
          Try Loan Scenarios
        </button>
      </div>

      <div className="px-6 mb-6 mt-12">
        <div className="bg-gray-100 rounded-xl p-4  ">
          <p className="text-xs text-gray-600 leading-relaxed">
            @ Copyright 2024 LoanHook. All rights reserved. Jy'Mir Fuller & Joseph Ajumobi | <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> | <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}