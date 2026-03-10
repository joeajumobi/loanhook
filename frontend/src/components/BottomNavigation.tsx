import { Home, TrendingUp, Target, Calculator, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

// 1. You can remove the Interface entirely if you aren't passing props anymore
// or just leave it empty.

export function BottomNavigation() { // 2. Remove { activeScreen, onNavigate }
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "readiness", label: "Readiness", icon: TrendingUp },
    { id: "simulator", label: "Simulator", icon: Calculator },
    { id: "improvement", label: "Improve", icon: Target },
    { id: "profile", label: "Profile", icon: FileText }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-safe z-50">
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
                    className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span 
                    className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
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