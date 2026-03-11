import {
  Share2,
  Download,
  CheckCircle2,
  TrendingUp,
  Shield,
  DollarSign,
  Calendar
} from "lucide-react";
import { Progress } from "./ui/progress";
import { useApplicantData } from "../hooks/useApplicantData";
import {
  getReadinessScore,
  getStabilityScore,
  getSavingsRatio,
  getAffordabilityScore,
  getMonthlyExpenses,
  getDebtToIncome
} from "../utils/financialMetrics";

interface BankReadyProfileProps {
  onNavigate?: (screen: string) => void;
}

export function BankReadyProfileScreen({ onNavigate }: BankReadyProfileProps) {
  const { applicant, loading } = useApplicantData();

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!applicant) {
    return <div className="p-6">No applicant data available.</div>;
  }

  const storedUser = localStorage.getItem("user");
  let parsedUser: { fullName?: string; name?: string } | null = null;

  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    parsedUser = null;
  }

  const userName =
    parsedUser?.fullName ||
    parsedUser?.name ||
    applicant.name ||
    "LoanHook User";

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileData = {
    userName,
    readinessScore: getReadinessScore(applicant),
    stabilityScore: getStabilityScore(applicant),
    savingsRatio: getSavingsRatio(applicant),
    affordabilityScore: getAffordabilityScore(applicant),
    monthlyIncome: applicant.income,
    monthlyExpenses: getMonthlyExpenses(applicant),
    savings: applicant.savings,
    debt: applicant.debt,
    employmentStability: "Active profile",
    debtToIncome: getDebtToIncome(applicant),
    generatedDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  };

  const formattedReadinessScore = Math.round(profileData.readinessScore);
  const formattedStabilityScore = Math.round(profileData.stabilityScore);
  const formattedSavingsRatio = Math.round(profileData.savingsRatio);
  const formattedAffordabilityScore = Math.round(profileData.affordabilityScore);
  const formattedDebtToIncome = Math.round(profileData.debtToIncome);

  const strengths = [
    profileData.monthlyIncome > 0 ? "Stable Income" : null,
    profileData.savings > 0 ? "Healthy Savings Buffer" : null,
    profileData.debtToIncome <= 36 ? "Low Debt-to-Income" : "Manageable Debt Ratio",
    profileData.affordabilityScore >= 25 ? "Positive Cash Flow" : "Budget Needs Optimization"
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Bank-Ready Profile</h1>
        <p className="text-blue-100">Your shareable financial summary</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-xl">
              {initials}
            </div>
            <div>
              <h2 className="text-xl text-gray-900">{profileData.userName}</h2>
              <p className="text-sm text-gray-500">Financial Profile</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Overall Loan Readiness</span>
              <span className="text-2xl text-green-600">{formattedReadinessScore}</span>
            </div>
            <Progress value={profileData.readinessScore} className="h-2" />
          </div>
        </div>
      </div>

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
            <div className="text-2xl text-gray-900 mb-1">{formattedStabilityScore}</div>
            <Progress value={profileData.stabilityScore} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Savings Ratio</span>
            </div>
            <div className="text-2xl text-gray-900 mb-1">{formattedSavingsRatio}%</div>
            <Progress value={profileData.savingsRatio} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-600">Affordability</span>
            </div>
            <div className="text-2xl text-gray-900 mb-1">{formattedAffordabilityScore}</div>
            <Progress value={profileData.affordabilityScore} className="h-1.5" />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-xs text-gray-600">Generated</span>
            </div>
            <div className="text-lg text-gray-900 mb-1">{profileData.generatedDate}</div>
            <p className="text-xs text-gray-500">latest snapshot</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Financial Snapshot</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Income</span>
            <span className="text-base text-gray-900">
              ${profileData.monthlyIncome.toLocaleString()}
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Expenses</span>
            <span className="text-base text-gray-900">
              ${profileData.monthlyExpenses.toLocaleString()}
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Savings</span>
            <span className="text-base text-green-600">
              ${profileData.savings.toLocaleString()}
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Debt</span>
            <span className="text-base text-gray-900">
              ${profileData.debt.toLocaleString()}
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Debt-to-Income Ratio</span>
            <span className="text-base text-green-600">{formattedDebtToIncome}%</span>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Financial Strengths</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {strengths.map((strength, index) => (
            <div key={index} className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-900">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg">Verified Profile</h3>
              <p className="text-sm text-blue-100">
                Generated on {profileData.generatedDate}
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-50">
            This profile reflects your current dashboard data and financial
            readiness metrics inside LoanHook.
          </p>
        </div>
      </div>

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

      <div className="px-6 mb-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            This profile is for informational purposes only and does not
            constitute financial advice or a loan approval guarantee.
          </p>
        </div>
      </div>

      <div className="px-6 mb-6 mt-12">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            © Copyright 2024 LoanHook. All rights reserved. Jy'Mir Fuller & Joseph
            Ajumobi |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}