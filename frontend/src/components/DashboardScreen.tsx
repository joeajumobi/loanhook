import { DollarSign, TrendingUp, TrendingDown, CreditCard, PiggyBank, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const financialData = {
    monthlyIncome: 4500,
    monthlyExpenses: 3200,
    savings: 8500,
    debt: 2800,
    readinessScore: 72
  };

  const expenseData = [
    { name: "Housing", value: 1200, color: "#3b82f6" },
    { name: "Food", value: 600, color: "#14b8a6" },
    { name: "Transport", value: 400, color: "#8b5cf6" },
    { name: "Utilities", value: 300, color: "#f59e0b" },
    { name: "Other", value: 700, color: "#6366f1" },
  ];

  const monthlyTrend = [
    { month: "Jan", income: 4200, expenses: 3100 },
    { month: "Feb", income: 4300, expenses: 3300 },
    { month: "Mar", income: 4500, expenses: 3200 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-green-500 to-teal-500";
    if (score >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Financial Snapshot</h1>
        <p className="text-blue-100">Your complete financial overview</p>
      </div>

      {/* Loan Readiness Score */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">Loan Readiness Score</h2>
            <button 
              onClick={() => onNavigate('readiness')}
              className="text-blue-600 text-sm hover:text-blue-700"
            >
              Details →
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(financialData.readinessScore)} flex items-center justify-center`}>
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl ${getScoreColor(financialData.readinessScore)}`}>
                    {financialData.readinessScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">out of 100</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className={`text-lg mb-1 ${getScoreColor(financialData.readinessScore)}`}>
                Good Position
              </p>
              <p className="text-sm text-gray-600">
                You're in a solid position to take on a loan. Review our recommendations to optimize further.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="text-2xl text-gray-900">${financialData.monthlyIncome.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">per month</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <div className="text-2xl text-gray-900">${financialData.monthlyExpenses.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">per month</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Savings</span>
          </div>
          <div className="text-2xl text-gray-900">${financialData.savings.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">+12% this month</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Debt</span>
          </div>
          <div className="text-2xl text-gray-900">${financialData.debt.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">total balance</div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Expense Breakdown</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {expenseData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm text-gray-900">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Income vs Expenses</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full" />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
