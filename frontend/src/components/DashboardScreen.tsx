import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, CreditCard, PiggyBank } from "lucide-react";
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

interface Applicant {
  applicantId: number;
  name: string;
  income: number;
  savings: number;
  housing: number;
  food: number;
  transport: number;
  utilities: number;
  other: number;
  debt: number;
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5001/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch dashboard data");
        }

        setApplicant(data);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [navigate]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!applicant) {
    return <div className="p-6">No applicant data available.</div>;
  }

  const monthlyExpenses =
    applicant.housing +
    applicant.food +
    applicant.transport +
    applicant.utilities +
    applicant.other;

  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        50 +
          applicant.savings / 200 -
          applicant.debt / 500 -
          monthlyExpenses / 1000
      )
    )
  );

  const financialData = {
    monthlyIncome: applicant.income,
    monthlyExpenses,
    savings: applicant.savings,
    debt: applicant.debt,
    readinessScore
  };

  const expenseData = [
    { name: "Housing", value: applicant.housing, color: "#3b82f6" },
    { name: "Food", value: applicant.food, color: "#14b8a6" },
    { name: "Transport", value: applicant.transport, color: "#8b5cf6" },
    { name: "Utilities", value: applicant.utilities, color: "#f59e0b" },
    { name: "Other", value: applicant.other, color: "#6366f1" }
  ];

  const monthlyTrend = [
    {
      month: "Jan",
      income: Math.round(applicant.income * 0.9),
      expenses: Math.round(monthlyExpenses * 0.95)
    },
    {
      month: "Feb",
      income: Math.round(applicant.income * 0.95),
      expenses: Math.round(monthlyExpenses * 1.05)
    },
    {
      month: "Mar",
      income: applicant.income,
      expenses: monthlyExpenses
    }
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
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-16 rounded-b-3xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl text-white mb-2 font-bold">
            Financial Snapshot
          </h1>
          <p className="text-blue-100 text-lg">
            Your complete financial overview
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900 font-semibold">
              Loan Readiness Score
            </h2>
            <button
              onClick={() => navigate("/readiness")}
              className="text-blue-600 text-sm hover:underline font-medium"
            >
              Details →
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div
              className={`w-32 h-32 flex-shrink-0 rounded-full bg-gradient-to-br ${getScoreGradient(
                financialData.readinessScore
              )} flex items-center justify-center`}
            >
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(
                      financialData.readinessScore
                    )}`}
                  >
                    {financialData.readinessScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    Score
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p
                className={`text-lg mb-1 font-bold ${getScoreColor(
                  financialData.readinessScore
                )}`}
              >
                {financialData.readinessScore >= 70
                  ? "Good Position"
                  : financialData.readinessScore >= 50
                  ? "Fair Position"
                  : "Needs Improvement"}
              </p>
              <p className="text-sm text-gray-600">
                You're in a solid position to take on a loan. Review our
                recommendations to optimize further.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Income</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${financialData.monthlyIncome.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Expenses
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${financialData.monthlyExpenses.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Savings
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${financialData.savings.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Debt</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${financialData.debt.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown
          </h2>

          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {expenseData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Income vs Expenses
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar
                  dataKey="income"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-6 mt-12">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-600 leading-relaxed text-center">
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