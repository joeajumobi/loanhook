import { useState } from "react";
import { Calculator, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { Slider } from "./ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScenarioSimulatorScreenProps {
  onNavigate: (screen: string) => void;
}

export function ScenarioSimulatorScreen({ onNavigate }: ScenarioSimulatorScreenProps) {
  const [loanAmount, setLoanAmount] = useState([15000]);
  const [interestRate, setInterestRate] = useState([7.5]);
  const [loanTerm, setLoanTerm] = useState([36]);

  const monthlyIncome = 4500;
  const monthlyExpenses = 3200;
  const availableIncome = monthlyIncome - monthlyExpenses;

  // Calculate monthly payment
  const r = interestRate[0] / 100 / 12;
  const n = loanTerm[0];
  const monthlyPayment = (loanAmount[0] * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - loanAmount[0];

  // Calculate affordability metrics
  const paymentToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;
  const paymentToAvailableRatio = (monthlyPayment / availableIncome) * 100;

  const isAffordable = paymentToAvailableRatio < 50;
  const riskLevel = paymentToAvailableRatio < 30 ? "low" : paymentToAvailableRatio < 50 ? "medium" : "high";

  // Generate payment schedule data
  const generateSchedule = () => {
    const schedule = [];
    let remainingBalance = loanAmount[0];
    
    for (let month = 0; month <= Math.min(n, 36); month += 6) {
      const interestPayment = remainingBalance * r;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment * 6;
      
      schedule.push({
        month: month,
        balance: Math.max(0, remainingBalance),
        payment: monthlyPayment
      });
    }
    
    return schedule;
  };

  const scheduleData = generateSchedule();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "medium": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" };
      case "high": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const riskColors = getRiskColor(riskLevel);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl text-white mb-2">Loan Simulator</h1>
        <p className="text-blue-100">Explore different loan scenarios</p>
      </div>

      {/* Monthly Payment Display */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-4">
            <h2 className="text-sm text-gray-600 mb-2">Estimated Monthly Payment</h2>
            <p className="text-4xl text-gray-900">${monthlyPayment.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">per month for {loanTerm[0]} months</p>
          </div>
          
          <div className={`${riskColors.bg} ${riskColors.border} border rounded-xl p-4 flex items-center gap-3`}>
            {isAffordable ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm ${riskColors.text}`}>
                {isAffordable 
                  ? `This payment is within your budget (${paymentToAvailableRatio.toFixed(0)}% of available income)`
                  : `This payment may strain your budget (${paymentToAvailableRatio.toFixed(0)}% of available income)`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="px-6 mt-6 space-y-6">
        {/* Loan Amount */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-700">Loan Amount</label>
            <span className="text-lg text-gray-900">${loanAmount[0].toLocaleString()}</span>
          </div>
          <Slider
            value={loanAmount}
            onValueChange={setLoanAmount}
            min={1000}
            max={50000}
            step={1000}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$1,000</span>
            <span>$50,000</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-700">Interest Rate (APR)</label>
            <span className="text-lg text-gray-900">{interestRate[0].toFixed(1)}%</span>
          </div>
          <Slider
            value={interestRate}
            onValueChange={setInterestRate}
            min={3}
            max={25}
            step={0.5}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-700">Loan Term</label>
            <span className="text-lg text-gray-900">{loanTerm[0]} months</span>
          </div>
          <Slider
            value={loanTerm}
            onValueChange={setLoanTerm}
            min={6}
            max={60}
            step={6}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>6 mo</span>
            <span>60 mo</span>
          </div>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total to Repay</span>
            <span className="text-base text-gray-900">${totalPayment.toFixed(0)}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Interest</span>
            <span className="text-base text-gray-900">${totalInterest.toFixed(0)}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment-to-Income Ratio</span>
            <span className="text-base text-gray-900">{paymentToIncomeRatio.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Payment Schedule Chart */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Balance Over Time</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(0)}`, 'Balance']}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${riskColors.bg} rounded-lg flex items-center justify-center`}>
              <TrendingUp className={`w-5 h-5 ${riskColors.text}`} />
            </div>
            <div>
              <h3 className="text-sm text-gray-900">Risk Level</h3>
              <p className={`text-lg capitalize ${riskColors.text}`}>{riskLevel}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {riskLevel === "low" && "This loan amount is comfortable for your budget with plenty of room for unexpected expenses."}
            {riskLevel === "medium" && "This loan is manageable but leaves less buffer for emergencies. Consider building savings first."}
            {riskLevel === "high" && "This payment may be too high for your current income. Consider a smaller loan or longer term."}
          </p>
        </div>
      </div>
    </div>
  );
}
