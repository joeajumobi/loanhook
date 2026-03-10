import { useState } from "react";
import { Calculator, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { Slider } from "./ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

interface LoanSuggestion {
  title: string;
  rate: string;
  term: string;
  reason: string;
  link?: string; 
}

interface ScenarioSimulatorProps {
  onNavigate?: (screen: string) => void;
}

export function ScenarioSimulatorScreen({ onNavigate }: ScenarioSimulatorProps) {
  const navigate = useNavigate();

  // --- STATE ---
  const [loanAmount, setLoanAmount] = useState([15000]);
  const [interestRate, setInterestRate] = useState([7.5]);
  const [loanTerm, setLoanTerm] = useState([36]);
  const [loanType, setLoanType] = useState<"Car" | "Mortgage" | "Student">("Car");
  const [suggestions, setSuggestions] = useState<LoanSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- CALCULATIONS ---
  const monthlyIncome = 4500;
  const monthlyExpenses = 3200;
  const availableIncome = monthlyIncome - monthlyExpenses;

  const r = interestRate[0] / 100 / 12;
  const n = loanTerm[0];
  const monthlyPayment = (loanAmount[0] * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const paymentToAvailableRatio = (monthlyPayment / availableIncome) * 100;

  const isAffordable = paymentToAvailableRatio < 50;
  const riskLevel = paymentToAvailableRatio < 30 ? "low" : paymentToAvailableRatio < 50 ? "medium" : "high";

  // --- AI LOGIC ---
  const getAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          income: monthlyIncome, 
          score: 72, 
          loanType: loanType 
        })
      });
      
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        throw new Error("AI returned invalid data format");
      }
    } catch (error: any) {
      console.error("AI Fetch Error:", error);
      setSuggestions([{
        title: "Connection Issue",
        rate: "Error",
        term: "0",
        reason: `Backend unreachable. Error: ${error.message}`,
        link: "#"
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateSchedule = () => {
    const schedule = [];
    let remainingBalance = loanAmount[0];
    for (let month = 0; month <= n; month += Math.max(1, Math.floor(n / 10))) {
      const factor = Math.pow(1 + r, month);
      const balance = loanAmount[0] * (Math.pow(1 + r, n) - factor) / (Math.pow(1 + r, n) - 1);
      schedule.push({ month: month, balance: Math.max(0, balance) });
    }
    return schedule;
  };

  const riskColors = {
    low: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
    high: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" }
  }[riskLevel];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - ORIGINAL COLORS */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg">
        <h1 className="text-3xl text-white mb-2 font-bold tracking-tight">Loan Simulator</h1>
        <p className="text-blue-100">Explore and AI-optimize your loans</p>
      </div>

      {/* Payment Display */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Monthly Payment</h2>
            <p className="text-5xl text-gray-900 font-bold">${monthlyPayment.toFixed(0)}</p>
          </div>
          <div className={`${riskColors.bg} ${riskColors.border} border-2 rounded-2xl p-4 flex items-center justify-center gap-3`}>
            {isAffordable ? <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />}
            <p className={`text-sm font-bold ${riskColors.text}`}>
              {isAffordable ? `Healthy Choice: ${paymentToAvailableRatio.toFixed(0)}% of buffer` : `High Risk: ${paymentToAvailableRatio.toFixed(0)}% of buffer`}
            </p>
          </div>
        </div>
      </div>

      {/* Loan Type Selector */}
      <div className="px-6 mt-10">
        <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-2xl">
          {(["Car", "Mortgage", "Student"] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setLoanType(type); setSuggestions([]); }}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all ${
                loanType === type ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 mt-8 space-y-5">
        {[ 
          { label: "Loan Amount", val: loanAmount, set: setLoanAmount, min: 1000, max: 100000, step: 1000, unit: "$" },
          { label: "Interest Rate", val: interestRate, set: setInterestRate, min: 1, max: 25, step: 0.1, unit: "%" },
          { label: "Loan Term", val: loanTerm, set: setLoanTerm, min: 6, max: 72, step: 6, unit: "mo" }
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</label>
              <span className="text-xl text-blue-600 font-bold">{s.unit === "$" ? `$${s.val[0].toLocaleString()}` : `${s.val[0]}${s.unit}`}</span>
            </div>
            <Slider value={s.val} onValueChange={s.set} min={s.min} max={s.max} step={s.step} />
          </div>
        ))}
      </div>

      {/* AI SUGGESTIONS SECTION - ENHANCED CARD UI */}
      <div className="px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Suggestions</h2>
          </div>
          <button 
            onClick={getAiSuggestions}
            disabled={isAiLoading}
            className="text-xs bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 transition-all"
          >
            {isAiLoading ? "Consulting..." : "Get Expert Advice"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.map((loan, idx) => (
            <div key={`${idx}-${loan.title}`} className="group relative bg-white border border-blue-100 hover:border-blue-400 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-t-[32px]" />
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-gray-900 text-xl leading-tight">{loan.title}</h4>
                  <div className="bg-blue-50 px-3 py-1 rounded-full shrink-0">
                    <span className="text-blue-600 font-bold text-xs">{loan.rate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  <span>{loan.term} Term</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 mb-6">
                  <p className="text-sm text-gray-600 leading-relaxed italic font-medium">"{loan.reason}"</p>
                </div>
              </div>
              
              {loan.link && (
                <a 
                  href={loan.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-all"
                >
                  View Loan Details <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}

          {suggestions.length === 0 && !isAiLoading && (
            <div className="col-span-full py-16 border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-gray-300">
              <Calculator className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-[0.2em]">AI Insights Pending</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Schedule Chart */}
      <div className="px-6 mt-12">
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">Repayment Trajectory</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateSchedule()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(v: any) => [`$${Math.round(v).toLocaleString()}`, 'Balance']} 
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={6} 
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="px-6 mt-16 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">
          © 2026 LoanHook • Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}