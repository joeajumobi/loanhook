import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Shield,
  DollarSign
} from "lucide-react";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";
import { useApplicantData } from "../hooks/useApplicantData";
import {
  getReadinessScore,
  getSafeLoanAmount,
  getMaxAffordablePayment,
  getDebtToIncome,
  getSavingsBufferMonths,
  getApprovalLikelihood
} from "../utils/financialMetrics";

interface ScreenProps {
  onNavigate?: (screen: string) => void;
}

export function LoanReadinessScreen({ onNavigate }: ScreenProps) {
  const navigate = useNavigate();
  const { applicant, loading } = useApplicantData();

  if (loading) {
    return <div className="p-6">Loading loan readiness...</div>;
  }

  if (!applicant) {
    return <div className="p-6">No applicant data available.</div>;
  }

  const readinessData = {
    score: getReadinessScore(applicant),
    safeLoanAmount: getSafeLoanAmount(applicant),
    maxAffordablePayment: getMaxAffordablePayment(applicant),
    debtToIncome: getDebtToIncome(applicant),
    savingsBuffer: getSavingsBufferMonths(applicant),
    approvalLikelihood: getApprovalLikelihood(applicant)
  };

  const formattedDebtToIncome = Math.round(readinessData.debtToIncome);
  const formattedSavingsBuffer = readinessData.savingsBuffer.toFixed(1);
  const formattedApprovalLikelihood = Math.round(readinessData.approvalLikelihood);

  const indicators = [
    {
      label: "Debt-to-Income Ratio",
      value: readinessData.debtToIncome,
      icon: TrendingUp,
      description: `${formattedDebtToIncome}% - ${
        readinessData.debtToIncome <= 36 ? "Healthy range" : "Needs improvement"
      }`,
      color:
        readinessData.debtToIncome <= 36 ? "text-green-600" : "text-yellow-600",
      bgColor:
        readinessData.debtToIncome <= 36 ? "bg-green-100" : "bg-yellow-100"
    },
    {
      label: "Savings Buffer",
      value: Math.min((readinessData.savingsBuffer / 12) * 100, 100),
      icon: Shield,
      description: `${formattedSavingsBuffer} months of expenses saved`,
      color:
        readinessData.savingsBuffer >= 3 ? "text-green-600" : "text-yellow-600",
      bgColor:
        readinessData.savingsBuffer >= 3 ? "bg-green-100" : "bg-yellow-100"
    },
    {
      label: "Approval Likelihood",
      value: readinessData.approvalLikelihood,
      icon: DollarSign,
      description: `${formattedApprovalLikelihood}% - estimated chance with current profile`,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Loan Readiness</h1>
        <p className="text-blue-100">Your borrowing capacity analysis</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm text-gray-600">Estimated Safe Loan Amount</h2>
              <p className="text-3xl text-gray-900">
                ${readinessData.safeLoanAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-sm text-green-800">
              Based on your current income, debt, and expenses, this is a safer
              borrowing range to avoid financial strain.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Max monthly payment</span>
              <span className="text-gray-900">
                ${readinessData.maxAffordablePayment}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

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

      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Readiness Factors</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Stable Income Stream</p>
              <p className="text-xs text-gray-500 mt-1">
                Monthly income: ${applicant.income.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            {readinessData.savingsBuffer >= 3 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-900">Savings Buffer</p>
              <p className="text-xs text-gray-500 mt-1">
                {formattedSavingsBuffer} months of expenses saved
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            {readinessData.debtToIncome <= 36 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-900">Debt-to-Income</p>
              <p className="text-xs text-gray-500 mt-1">
                {formattedDebtToIncome}% compared to income
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Potential Improvements</p>
              <p className="text-xs text-gray-500 mt-1">
                Lower debt and higher savings can improve terms
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 mb-6 space-y-3">
        <button
          onClick={() => navigate("/improvement")}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white h-12 rounded-xl"
        >
          View Improvement Plan
        </button>
        <button
          onClick={() => navigate("/simulator")}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 h-12 rounded-xl border border-gray-200"
        >
          Try Loan Scenarios
        </button>
      </div>

      <div className="px-6 mb-6 mt-12">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            © Copyright 2024 LoanHook. All rights reserved. Jy'Mir Fuller &
            Joseph Ajumobi |{" "}
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