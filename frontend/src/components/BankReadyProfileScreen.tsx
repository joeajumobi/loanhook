import { Share2, Download, CheckCircle2, TrendingUp, Shield, DollarSign, Calendar } from "lucide-react";
import { Progress } from "./ui/progress";

interface BankReadyProfileScreenProps {
  onNavigate?: (screen: string) => void;
}

export function BankReadyProfileScreen({ onNavigate }: BankReadyProfileScreenProps) {
  const profileData = {
    userName: "Alex Johnson",
    readinessScore: 72,
    stabilityScore: 85,
    savingsRatio: 28,
    affordabilityScore: 75,
    monthlyIncome: 4500,
    monthlyExpenses: 3200,
    savings: 8500,
    debt: 2800,
    employmentStability: "24 months",
    debtToIncome: 28,
    generatedDate: "March 5, 2026"
  };

  const strengths = [
    { label: "Stable Employment", icon: CheckCircle2 },
    { label: "Healthy Savings Buffer", icon: CheckCircle2 },
    { label: "Low Debt-to-Income", icon: CheckCircle2 },
    { label: "Consistent Income", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Bank-Ready Profile</h1>
        <p className="text-blue-100">Your shareable financial summary</p>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-xl">
              AJ
            </div>
            <div>
              <h2 className="text-xl text-gray-900">{profileData.userName}</h2>
              <p className="text-sm text-gray-500">Financial Profile</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Overall Loan Readiness</span>
              <span className="text-2xl text-green-600">{profileData.readinessScore}</span>
            </div>
            <Progress value={profileData.readinessScore} className="h-2" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Stability</span>
            </div>
            <div className="text-2xl text-gray-900 mb-1">{profileData.stabilityScore}</div>
            <Progress value={profileData.stabilityScore} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Savings Ratio</span>
            </div>
            <div className="text-2xl text-gray-900 mb-1">{profileData.savingsRatio}%</div>
            <Progress value={profileData.savingsRatio} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-600">Affordability</span>
            </div>
            <div className="text-2xl text-gray-900 mb-1">{profileData.affordabilityScore}</div>
            <Progress value={profileData.affordabilityScore} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-xs text-gray-600">Employment</span>
            </div>
            <div className="text-lg text-gray-900 mb-1">{profileData.employmentStability}</div>
            <p className="text-xs text-gray-500">stable tenure</p>
          </div>
        </div>
      </div>

      {/* Financial Snapshot */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Financial Snapshot</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Income</span>
            <span className="text-base text-gray-900">${profileData.monthlyIncome.toLocaleString()}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Expenses</span>
            <span className="text-base text-gray-900">${profileData.monthlyExpenses.toLocaleString()}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Savings</span>
            <span className="text-base text-green-600">${profileData.savings.toLocaleString()}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Debt</span>
            <span className="text-base text-gray-900">${profileData.debt.toLocaleString()}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Debt-to-Income Ratio</span>
            <span className="text-base text-green-600">{profileData.debtToIncome}%</span>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Financial Strengths</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {strengths.map((strength, index) => {
            const Icon = strength.icon;
            return (
              <div key={index} className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-900">{strength.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Badge */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg">Verified Profile</h3>
              <p className="text-sm text-blue-100">Generated on {profileData.generatedDate}</p>
            </div>
          </div>
          <p className="text-sm text-blue-50">
            This profile has been generated by LoanHook based on your connected financial accounts and reflects your current financial readiness.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-6 mb-6 space-y-3">
        <button className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Profile
        </button>
        <button className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {/* Disclaimer */}
      <div className="px-6 mb-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            This profile is for informational purposes only and does not constitute financial advice or a loan approval guarantee. 
            Lenders may use additional criteria in their evaluation process.
          </p>
        </div>
      </div>
      <div className="px-6 mb-6 mt-12">
        <div className="bg-gray-100 rounded-xl p-4  ">
          <p className="text-xs text-gray-600 leading-relaxed">
            @ Copyright 2024 LoanHook. All rights reserved. Jy'Mir Fuller & Jospeh Ajumobi | <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> | <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}
