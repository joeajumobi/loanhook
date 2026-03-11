import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Clock,
  ArrowLeft,
  CheckCircle2
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
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-600 font-medium text-sm">
          Loading plan...
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="p-6 text-center text-gray-500">
        No applicant data available.
      </div>
    );
  }

  const monthlyExpenses = getMonthlyExpenses(applicant);
  const currentScore = getReadinessScore(applicant);

  const emergencyFundTarget = monthlyExpenses * 6;
  const emergencyProgress = Math.min(
    100,
    Math.round((applicant.savings / (emergencyFundTarget || 1)) * 100)
  );

  const debtPaydownProgress =
    applicant.debt === 0
      ? 100
      : Math.max(0, Math.min(100, Math.round((1 - applicant.debt / 5000) * 100)));

  const incomeTarget = applicant.income + 500;
  const incomeProgress = Math.min(
    100,
    Math.round((applicant.income / (incomeTarget || 1)) * 100)
  );

  const potentialScore = Math.min(100, currentScore + 20);

  const improvements = [
    {
      id: "savings",
      title: "Build Emergency Fund",
      description: "Increase savings to cover 6 months of expenses",
      priority: "high",
      impact: "+15 pts",
      currentProgress: emergencyProgress,
      targetAmount: `$${emergencyFundTarget.toLocaleString()}`,
      currentAmount: `$${applicant.savings.toLocaleString()}`,
      icon: PiggyBank,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBorder: "hover:border-blue-300",
      timeline: "3-6 months",
      steps: [
        "Set up automatic monthly savings transfers",
        "Reduce nonessential spending categories",
        "Save toward at least 6 months of expenses"
      ]
    },
    {
      id: "debt",
      title: "Reduce Debt",
      description: "Pay down existing debt to improve cash flow",
      priority: "medium",
      impact: "+8 pts",
      currentProgress: debtPaydownProgress,
      targetAmount: "$0",
      currentAmount: `$${applicant.debt.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBorder: "hover:border-purple-300",
      timeline: "6-12 months",
      steps: [
        "Pay above the minimum each month",
        "Avoid adding new revolving debt",
        "Prioritize high-interest balances first"
      ]
    },
    {
      id: "income",
      title: "Increase Income",
      description: "Boost monthly earnings through raises or side work",
      priority: "low",
      impact: "+12 pts",
      currentProgress: incomeProgress,
      targetAmount: `$${incomeTarget.toLocaleString()}/mo`,
      currentAmount: `$${applicant.income.toLocaleString()}/mo`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBorder: "hover:border-green-300",
      timeline: "Ongoing",
      steps: [
        "Explore side income opportunities",
        "Ask about promotion or added hours",
        "Invest in skills that increase earnings"
      ]
    }
  ];

  const toggleStep = (step: string) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 pt-6 pb-20 rounded-b-[2rem] shadow-md relative">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => onNavigate?.("dashboard")}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl text-white font-bold">Improvement Plan</h1>
            <p className="text-blue-100 text-[10px] uppercase tracking-widest opacity-80">
              Personalized Strategy
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 relative z-10 -mt-10">
        {/* SCORE COMPARISON CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Current
              </p>
              <p className="text-3xl font-black text-gray-900">{currentScore}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <Target className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">Potential</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Target
              </p>
              <p className="text-3xl font-black text-green-600">
                {potentialScore}
              </p>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-700 font-medium">
              Complete the priority actions below to boost your score.
            </p>
          </div>
        </div>

        {/* PRIORITY ACTIONS */}
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
          Priority Actions
        </h2>

        <div className="space-y-6">
          {improvements.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${item.hoverBorder} hover:shadow-lg`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div
                        className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900">
                            {item.title}
                          </h3>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      {item.impact}
                    </span>
                  </div>

                  {/* PROGRESS AREA */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
                      <span>Current: {item.currentAmount}</span>
                      <span className="text-gray-900">{item.currentProgress}%</span>
                    </div>

                    <Progress value={item.currentProgress} className="h-1.5" />

                    <div className="text-right mt-1.5">
                      <span className="text-[10px] text-gray-400">
                        Target: {item.targetAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Timeline: {item.timeline}</span>
                  </div>

                  {/* CHECKLIST STEPS */}
                  <div className="space-y-2 border-t border-gray-50 pt-4">
                    {item.steps.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleStep(step)}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group/step"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${
                            completedSteps.includes(step)
                              ? "text-green-500"
                              : "text-gray-200 group-hover/step:text-gray-300"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            completedSteps.includes(step)
                              ? "text-gray-400 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {step}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM TIP */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm">Strategic Focus</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Focus first on your <span className="text-white font-bold">Build Emergency Fund</span>{" "}
            goal. Lenders prioritize applicants with high liquidity as it drastically
            reduces default risk.
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-12 mb-6 text-center">
          <div className="bg-gray-100/50 rounded-xl p-4 inline-block w-full">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              © 2024 LoanHook • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}