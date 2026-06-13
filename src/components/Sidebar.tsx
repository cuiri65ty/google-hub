import React from "react";
import { Tv, Sparkles, Youtube, Newspaper, Settings, Search } from "lucide-react";
import { PageType } from "../types";

interface SidebarProps {
  activePage: PageType;
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  onNavigate: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  currentFocusId,
  setFocusedId,
  onNavigate,
}) => {
  const menuItems = [
    { id: "sidebar-home", page: "home" as PageType, label: "Home", icon: Tv },
    { id: "sidebar-assistant", page: "assistant" as PageType, label: "Google AI", icon: Sparkles },
    { id: "sidebar-youtube", page: "youtube" as PageType, label: "YouTube TV", icon: Youtube },
    { id: "sidebar-news", page: "news" as PageType, label: "Google News", icon: Newspaper },
    { id: "sidebar-settings", page: "settings" as PageType, label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 max-lg:w-20 bg-[#0F0F0F] border-r border-white/5 flex flex-col justify-between py-8 px-4 transition-all duration-300">
      <div className="flex flex-col gap-10">
        {/* Google Hub Brand Header */}
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-red-650 flex items-center justify-center shadow-lg shadow-red-500/10">
            <span className="text-xs font-black font-display text-white">G</span>
          </div>
          <div className="flex flex-col max-lg:hidden">
            <span className="text-sm font-bold font-display tracking-tight text-[#F1F1F1]">Google TV</span>
            <span className="text-[9px] text-white/30 font-mono tracking-widest leading-none">TIZEN HUB</span>
          </div>
        </div>

        {/* Dynamic Nav Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isFocused = currentFocusId === item.id;
            const isActive = activePage === item.page;

            return (
              <button
                key={item.id}
                id={item.id}
                onClick={() => {
                  setFocusedId(item.id);
                  onNavigate(item.page);
                }}
                className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 outline-none text-left relative overflow-hidden ${
                  isFocused
                    ? "bg-white text-[#0F0F0F] font-bold scale-105 shadow-[0_0_30px_rgba(255,255,255,0.25)] translate-x-1"
                    : isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isFocused ? "scale-110" : "opacity-80"}`} />
                <span className="font-semibold text-sm max-lg:hidden font-display">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Indicator - Help */}
      <div className="px-3 py-4 max-lg:hidden flex flex-col gap-2 bg-[#1A1A1A] rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80">Remote Mode</span>
          <span className="text-[9px] text-white/40 font-sans">Active</span>
        </div>
        <p className="text-[10px] text-white/60 leading-relaxed font-sans">
          Use <b className="text-white">Arrows</b> to shift, <b className="text-white">Enter</b> to click, and <b className="text-white">Back</b> to return.
        </p>
      </div>
    </div>
  );
};
