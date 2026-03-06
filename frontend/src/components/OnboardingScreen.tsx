import { ChevronRight, Shield, TrendingUp, Target } from "lucide-react";
import { Button } from "./ui/button";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl mb-3 text-gray-900">Welcome to BorrowSmart</h1>
        <p className="text-gray-600 text-lg">
          Your personal guide to smart borrowing decisions
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg mb-2 text-gray-900">Know Your Readiness</h3>
          <p className="text-gray-600">
            Get a clear picture of whether you're ready to take on a loan and how much you can afford
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg mb-2 text-gray-900">Improve Your Position</h3>
          <p className="text-gray-600">
            Receive personalized recommendations to strengthen your financial readiness
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg mb-2 text-gray-900">Make Informed Decisions</h3>
          <p className="text-gray-600">
            Use our simulator to understand different loan scenarios before you apply
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-8 pt-6 space-y-3">
        <Button 
          onClick={onComplete}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl text-lg"
        >
          Get Started
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-center text-sm text-gray-500">
          Takes only 2 minutes to complete
        </p>
      </div>
    </div>
  );
}
