import { useEffect } from "react";
import { Home, TrendingUp, Target, Calculator, FileText, Languages } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const setLanguage = (lang: 'en' | 'es') => {
  // Use a cookie that works for both localhost and your final domain
  document.cookie = `googtrans=/en/${lang}; path=/`;
  document.cookie = `googtrans=/en/${lang}; domain=.localhost; path=/`;
  
  // A refresh is necessary for the background engine to catch the cookie change
  window.location.reload();
};

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

  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate) {
        // Only init if the div is empty
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

    // Increase timeout slightly to 1s to ensure full DOM paint
    const timer = setTimeout(initTranslate, 1000);
    return () => clearTimeout(timer);
  }, [activeScreen]); // Added activeScreen dependency to re-check on nav

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl" />
          <span className="text-xl text-gray-900 font-bold">LoanHook</span>
        </div>
      </div>

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
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Language Toggle - Added min-width and relative positioning */}
      {/* Language Toggle */}
      <div className="mt-auto px-4 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 uppercase">Lang</span>
          </div>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setLanguage('en')}
              className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('es')}
              className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              ES
            </button>
          </div>
        </div>
        {/* Keep this hidden div so the Google script can still load in the background */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-900 mb-1 font-semibold">Need Help?</p>
          <p className="text-xs text-blue-700">Contact support team</p>
        </div>
      </div>
    </div>
  );
}