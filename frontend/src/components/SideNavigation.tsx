import { useEffect } from "react";
import { 
  Home, 
  TrendingUp, 
  Target, 
  Calculator, 
  FileText, 
  Languages, 
  MessageCircle,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const setLanguage = (lang: 'en' | 'es') => {
  document.cookie = `googtrans=/en/${lang}; path=/`;
  document.cookie = `googtrans=/en/${lang}; domain=localhost; path=/`;
  window.location.reload();
};

interface SideNavigationProps {
  onLogout: () => void;
}

export function SideNavigation({ onLogout }: SideNavigationProps) {
  const location = useLocation();
  
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "readiness", label: "Readiness", icon: TrendingUp },
    { id: "simulator", label: "Simulator", icon: Calculator },
    { id: "improvement", label: "Improve", icon: Target },
    { id: "profile", label: "Profile", icon: FileText }
  ];

  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate) {
        const container = document.getElementById("google_translate_element");
        if (container && container.innerHTML === "") {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
        }
      }
    };

    const timer = setTimeout(initTranslate, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-10">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
            <div className="w-5 h-5 bg-white/20 rounded-full" />
          </div>
          <span className="text-xl text-gray-900 font-bold tracking-tight">LoanHook</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className={`w-5 h-5 ${location.pathname.includes(item.id) ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* AI Chat Button */}
        <NavLink
          to="/chat"
          className={({ isActive }) => 
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 hover:brightness-95'
            }`
          }
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-bold">AI Assistant</span>
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-red-500 hover:bg-red-50 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>

        {/* Language Switcher */}
        <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Language</span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setLanguage('en')}
              className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded shadow-sm hover:text-blue-600 transition-colors"
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('es')}
              className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded shadow-sm hover:text-blue-600 transition-colors"
            >
              ES
            </button>
          </div>
        </div>
        
        <div id="google_translate_element" style={{ display: 'none' }}></div>

        {/* Support Card */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
          <p className="text-xs text-blue-900 mb-0.5 font-bold uppercase tracking-tight">Need Help?</p>
          <p className="text-[11px] text-blue-600 font-medium">Contact support team</p>
        </div>
      </div>
    </div>
  );
}