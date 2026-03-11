import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { getReadinessScore } from "../utils/financialMetrics";
import { useApplicantData } from "../hooks/useApplicantData"; 

interface ChatBotScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const QUICK_QUESTIONS = [
  "What's my loan readiness score?",
  "How can I improve my credit?",
  "What loan amount can I afford?",
  "Tips for reducing debt-to-income ratio"
];

export function ChatBotScreen({ onNavigate }: ChatBotScreenProps) {
  const { applicant, loading } = useApplicantData();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial message with the score from the hook
  useEffect(() => {
    if (applicant && messages.length === 0) {
      const score = getReadinessScore(applicant);
      setMessages([
        {
          id: "1",
          type: "bot",
          content: `Hello! I'm your BorrowSmart AI assistant. I see your current Loan Readiness Score is ${score}/100. How can I assist you today?`,
          timestamp: new Date(),
          suggestions: QUICK_QUESTIONS // Buttons are back!
        }
      ]);
    }
  }, [applicant, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (loading) return <div className="p-6">Loading AI Assistant...</div>;
  if (!applicant) return <div className="p-6">No profile found.</div>;

  const currentScore = getReadinessScore(applicant);
  const currentIncome = applicant.income;

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5001/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          userData: { 
            income: currentIncome, 
            readinessScore: currentScore 
          } 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.text || "Server Error");

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.text,
        timestamp: new Date(),
        suggestions: ["How can I improve?", "View my dashboard"] 
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I'm having trouble connecting to my services. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => handleSend(question);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900 font-bold">Financial AI Assistant</h1>
            <p className="text-sm text-gray-500">Get personalized insights and guidance</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-semibold mb-1">AI-Powered Financial Guidance</p>
            <p className="text-xs text-blue-700 italic">
              Ask me about your ${currentIncome.toLocaleString()} income or your {currentScore}/100 readiness score.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-40">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                message.type === "bot" ? "bg-gradient-to-br from-blue-600 to-teal-500" : "bg-white border border-gray-200"
              }`}>
                {message.type === "bot" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-gray-600" />}
              </div>
              <div className={`flex-1 max-w-2xl ${message.type === "user" ? "flex justify-end" : ""}`}>
                <div className={`rounded-2xl p-4 shadow-sm border ${
                  message.type === "bot" ? "bg-white border-gray-100" : "bg-blue-600 border-blue-500 text-white"
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  
                  {/* QUICK QUESTION BUTTONS UI */}
                  {message.suggestions && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickQuestion(suggestion)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                 <Bot className="w-5 h-5 text-white" />
               </div>
               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                 <div className="flex gap-1.5 italic text-xs text-blue-500 animate-pulse">BorrowSmart is typing...</div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-20">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your financial question..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping} className="h-12 px-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}