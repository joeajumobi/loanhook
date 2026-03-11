import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PiggyBank, 
  ArrowRight, 
  Zap, 
  Target 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useApplicantData } from "../hooks/useApplicantData";
import { getMonthlyExpenses, getReadinessScore } from "../utils/financialMetrics";

export function DashboardScreen() {
  const navigate = useNavigate();
  const { applicant, loading } = useApplicantData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-600 font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  if (!applicant) {
    return <div className="p-6 text-center text-gray-500">No applicant data available.</div>;
  }

  // Logic Calculations
  const monthlyExpenses = getMonthlyExpenses(applicant);
  const readinessScore = getReadinessScore(applicant);
  const availableIncome = applicant.income - monthlyExpenses;
  
  // Prevent division by zero errors
  const savingsRate = applicant.income > 0 
    ? ((availableIncome / applicant.income) * 100).toFixed(0) 
    : "0";
  const debtToIncomeRatio = applicant.income > 0 
    ? ((applicant.debt / applicant.income) * 100).toFixed(0) 
    : "0";

  const expenseData = [
    { name: "Housing", value: applicant.housing, color: "#3b82f6" },
    { name: "Food", value: applicant.food, color: "#14b8a6" },
    { name: "Transport", value: applicant.transport, color: "#8b5cf6" },
    { name: "Utilities", value: applicant.utilities, color: "#f59e0b" },
    { name: "Other", value: applicant.other, color: "#6366f1" }
  ];

  const monthlyTrend = [
    { month: "Jan", income: Math.round(applicant.income * 0.9), expenses: Math.round(monthlyExpenses * 0.95) },
    { month: "Feb", income: Math.round(applicant.income * 0.95), expenses: Math.round(monthlyExpenses * 1.05) },
    { month: "Mar", income: applicant.income, expenses: monthlyExpenses }
  ];

  // UI Helpers
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* Header - Tightened padding to prevent overlap */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 px-6 md:px-12 pt-10 pb-11 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-2xl md:text-3xl text-white mb-1 font-bold">Welcome Back!</h1>
          <p className="text-blue-100 text-sm md:text-base opacity-90">Here's your financial snapshot</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Featured Readiness Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${getScoreGradient(readinessScore)} p-1.5 shadow-xl`}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(readinessScore)}`}>
                      {readinessScore}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Score</div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 w-36 h-36 rounded-full bg-gradient-to-br ${getScoreGradient(readinessScore)} opacity-20 animate-ping`} />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Loan Readiness Score</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Your current score is <span className={`font-bold ${getScoreColor(readinessScore)}`}>{readinessScore}</span>. 
                You're in a {readinessScore >= 70 ? 'strong' : 'fair'} position to take on a loan.
              </p>
              <button 
                onClick={() => navigate('/readiness')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm"
              >
                View Full Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid with Requested Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          
          {/* Monthly Income Card */}
          <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-green-300 transition-all duration-300 cursor-default">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Monthly Income</div>
            <div className="text-2xl font-bold text-gray-900">${applicant.income.toLocaleString()}</div>
            <div className="text-xs mt-2 font-bold text-green-600">Steady income ✓</div>
          </div>

          {/* Monthly Expenses Card */}
          <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-300 transition-all duration-300 cursor-default">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Monthly Expenses</div>
            <div className="text-2xl font-bold text-gray-900">${monthlyExpenses.toLocaleString()}</div>
            <div className="text-xs mt-2 font-medium text-gray-400">{((monthlyExpenses / applicant.income) * 100).toFixed(0)}% of income</div>
          </div>

          {/* Total Savings Card */}
          <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-default">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Total Savings</div>
            <div className="text-2xl font-bold text-gray-900">${applicant.savings.toLocaleString()}</div>
            <div className="text-xs mt-2 font-bold text-blue-600">+{savingsRate}% savings rate</div>
          </div>

          {/* Total Debt Card */}
          <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-purple-300 transition-all duration-300 cursor-default">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Total Debt</div>
            <div className="text-2xl font-bold text-gray-900">${applicant.debt.toLocaleString()}</div>
            <div className="text-xs mt-2 font-medium text-gray-400">{debtToIncomeRatio}% debt ratio</div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => navigate('/simulator')} className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 hover:scale-[1.02] transition-all text-left shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform"><Zap className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-base">Loan Simulator</div>
                <div className="text-xs text-white/80">Check affordability</div>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/improvement')} className="group bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-5 hover:scale-[1.02] transition-all text-left shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Target className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-base">Improvement Plan</div>
                <div className="text-xs text-white/80">Boost your score</div>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/profile')} className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5 hover:scale-[1.02] transition-all text-left shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform"><DollarSign className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-base">Bank Profile</div>
                <div className="text-xs text-white/80">View financial data</div>
              </div>
            </div>
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Expense Breakdown</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expenseData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-gray-600">{item.name}: ${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Income vs Expenses Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                  <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-teal-500 rounded-sm"></div><span className="text-xs text-gray-500">Income</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><span className="text-xs text-gray-500">Expenses</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}