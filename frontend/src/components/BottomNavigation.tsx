import { Home, TrendingUp, Target, Calculator, FileText, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";

export function BottomNavigation() {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "readiness", label: "Score", icon: TrendingUp }, // Shortened label for fit
    { id: "simulator", label: "Sim", icon: Calculator },    // Shortened label for fit
    { id: "chat", label: "AI Chat", icon: MessageSquare },  // New Chat Link
    { id: "improvement", label: "Improve", icon: Target },
    { id: "profile", label: "Profile", icon: FileText }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-safe z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span 
                    className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}