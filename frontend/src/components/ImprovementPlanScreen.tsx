import { Target, TrendingUp, CreditCard, PiggyBank, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "./ui/progress";

interface ImprovementPlanScreenProps {
  onNavigate?: (screen: string) => void;
}

export function ImprovementPlanScreen({ onNavigate }: ImprovementPlanScreenProps) {
  const improvements = [
    {
      id: 1,
      title: "Build Emergency Fund",
      description: "Increase savings to cover 6 months of expenses",
      priority: "high",
      impact: "+15 points",
      currentProgress: 65,
      targetAmount: "$13,500",
      currentAmount: "$8,500",
      icon: PiggyBank,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      timeline: "3-6 months",
      steps: [
        "Set up automatic transfers of $500/month",
        "Redirect 20% of bonuses to savings",
        "Review and reduce discretionary spending"
      ]
    },
    {
      id: 2,
      title: "Reduce Credit Card Balance",
      description: "Pay down existing credit card debt",
      priority: "medium",
      impact: "+8 points",
      currentProgress: 40,
      targetAmount: "$0",
      currentAmount: "$2,800",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      timeline: "6-12 months",
      steps: [
        "Pay $350/month (above minimum)",
        "Consider balance transfer to 0% APR card",
        "Avoid new charges until paid off"
      ]
    },
    {
      id: 3,
      title: "Increase Income",
      description: "Boost monthly earnings through side work or raise",
      priority: "low",
      impact: "+12 points",
      currentProgress: 20,
      targetAmount: "$5,000/mo",
      currentAmount: "$4,500/mo",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      timeline: "Ongoing",
      steps: [
        "Discuss raise/promotion with employer",
        "Explore freelance opportunities in your field",
        "Develop new marketable skills"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Improvement Plan</h1>
        <p className="text-blue-100">Personalized steps to boost readiness</p>
      </div>

      {/* Score Projection */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm text-gray-600">Current Score</h2>
              <p className="text-3xl text-gray-900">72</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-400 mb-1">→</div>
              <p className="text-xs text-gray-500">with actions</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm text-gray-600">Potential Score</h2>
              <p className="text-3xl text-green-600">92</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-gray-700">
              Complete all actions below to improve your score by <span className="text-green-600">+20 points</span> and unlock better loan terms.
            </p>
          </div>
        </div>
      </div>

      {/* Improvement Actions */}
      <div className="px-6 mt-6">
        <h2 className="text-lg text-gray-900 mb-4">Priority Actions</h2>
        <div className="space-y-4">
          {improvements.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                {/* Header */}
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

                {/* Progress */}
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

                {/* Timeline */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Timeline: {item.timeline}</span>
                </div>

                {/* Steps */}
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

      {/* Quick Tips */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg">Pro Tip</h3>
          </div>
          <p className="text-sm text-blue-50">
            Focus on the high-priority items first. Even small progress on your emergency fund can significantly improve your loan readiness score within a few months.
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
