import {
  Target,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Clock
} from "lucide-react";
import { Progress } from "./ui/progress";
import { useApplicantData } from "../hooks/useApplicantData";
import {
  getReadinessScore,
  getMonthlyExpenses
} from "../utils/financialMetrics";

interface ImprovementPlanProps {
  onNavigate?: (screen: string) => void;
}

export function ImprovementPlanScreen({ onNavigate }: ImprovementPlanProps) {
  const { applicant, loading } = useApplicantData();

  if (loading) {
    return <div className="p-6">Loading improvement plan...</div>;
  }

  if (!applicant) {
    return <div className="p-6">No applicant data available.</div>;
  }

  const monthlyExpenses = getMonthlyExpenses(applicant);
  const currentScore = getReadinessScore(applicant);

  const emergencyFundTarget = monthlyExpenses * 6;
  const emergencyProgress = Math.min(
    100,
    Math.round((applicant.savings / emergencyFundTarget) * 100)
  );

  const debtPaydownProgress =
    applicant.debt === 0
      ? 100
      : Math.max(0, Math.min(100, Math.round((1 - applicant.debt / 5000) * 100)));

  const incomeTarget = applicant.income + 500;
  const incomeProgress = Math.min(
    100,
    Math.round((applicant.income / incomeTarget) * 100)
  );

  const potentialScore = Math.min(100, currentScore + 20);

  const improvements = [
    {
      id: 1,
      title: "Build Emergency Fund",
      description: "Increase savings to cover 6 months of expenses",
      priority: "high",
      impact: "+15 points",
      currentProgress: emergencyProgress,
      targetAmount: `$${emergencyFundTarget.toLocaleString()}`,
      currentAmount: `$${applicant.savings.toLocaleString()}`,
      icon: PiggyBank,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      timeline: "3-6 months",
      steps: [
        "Set up automatic monthly savings transfers",
        "Reduce nonessential spending categories",
        "Save toward at least 6 months of expenses"
      ]
    },
    {
      id: 2,
      title: "Reduce Credit Card Balance",
      description: "Pay down existing debt to improve cash flow",
      priority: "medium",
      impact: "+8 points",
      currentProgress: debtPaydownProgress,
      targetAmount: "$0",
      currentAmount: `$${applicant.debt.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      timeline: "6-12 months",
      steps: [
        "Pay above the minimum each month",
        "Avoid adding new revolving debt",
        "Prioritize high-interest balances first"
      ]
    },
    {
      id: 3,
      title: "Increase Income",
      description: "Boost monthly earnings through side work or raises",
      priority: "low",
      impact: "+12 points",
      currentProgress: incomeProgress,
      targetAmount: `$${incomeTarget.toLocaleString()}/mo`,
      currentAmount: `$${applicant.income.toLocaleString()}/mo`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      timeline: "Ongoing",
      steps: [
        "Explore side income opportunities",
        "Ask about promotion or added hours",
        "Invest in skills that increase earnings"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Improvement Plan</h1>
        <p className="text-blue-100">Personalized steps to boost readiness</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm text-gray-600">Current Score</h2>
              <p className="text-3xl text-gray-900">{currentScore}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-400 mb-1">→</div>
              <p className="text-xs text-gray-500">with actions</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm text-gray-600">Potential Score</h2>
              <p className="text-3xl text-green-600">{potentialScore}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-gray-700">
              Complete the actions below to improve your score and strengthen
              your loan profile.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Priority Actions</h2>
        <div className="space-y-4">
          {improvements.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base text-gray-900">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{item.impact}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900">{item.currentProgress}%</span>
                  </div>
                  <Progress value={item.currentProgress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{item.currentAmount}</span>
                    <span>{item.targetAmount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Timeline: {item.timeline}</span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-gray-700">Action Steps:</p>
                  {item.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-gray-600">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg">Pro Tip</h3>
          </div>
          <p className="text-sm text-blue-50">
            Focus first on your savings and debt. Those two areas usually have
            the biggest impact on loan readiness.
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