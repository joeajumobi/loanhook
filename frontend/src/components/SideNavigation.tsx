import { Home, TrendingUp, Target, Calculator, FileText } from "lucide-react";

interface SideNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function SideNavigation({ activeScreen, onNavigate }: SideNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "readiness", label: "Readiness", icon: TrendingUp },
    { id: "simulator", label: "Simulator", icon: Calculator },
    { id: "improvement", label: "Improve", icon: Target },
    { id: "profile", label: "Profile", icon: FileText }
  ];

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-10">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl" />
          <span className="text-xl text-gray-900">LoanHook</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-900 mb-1">Need Help?</p>
          <p className="text-xs text-blue-700">Contact our support team</p>
        </div>
      </div>
    </div>
  );
}
