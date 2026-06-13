import React, { useEffect } from "react";
import { Settings, Maximize2, MousePointer, AppWindow, Cpu, ShieldAlert, MonitorCheck } from "lucide-react";
import { FocusItem } from "../types";

interface SettingsViewProps {
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  cursorHidden: boolean;
  setCursorHidden: (b: boolean) => void;
  showVirtualRemote: boolean;
  setShowVirtualRemote: (b: boolean) => void;
  registeredItems: FocusItem[];
  setRegisteredItems: React.Dispatch<React.SetStateAction<FocusItem[]>>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentFocusId,
  setFocusedId,
  cursorHidden,
  setCursorHidden,
  showVirtualRemote,
  setShowVirtualRemote,
  setRegisteredItems,
  isFullscreen,
  toggleFullscreen,
}) => {

  // Register focusable items
  useEffect(() => {
    const items: FocusItem[] = [
      { id: "set-fullscreen", section: "main", row: 0, col: 0, label: "Fullscreen Mode", actionType: "action" },
      { id: "set-cursor", section: "main", row: 1, col: 0, label: "Hide Cursor Mode", actionType: "action" },
      { id: "set-remote", section: "main", row: 2, col: 0, label: "Virtual Remote Mode", actionType: "action" },
    ];
    setRegisteredItems(items);
  }, [setRegisteredItems]);

  const handleActionClick = (id: string) => {
    setFocusedId(id);
    if (id === "set-fullscreen") {
      toggleFullscreen();
    } else if (id === "set-cursor") {
      setCursorHidden(!cursorHidden);
    } else if (id === "set-remote") {
      setShowVirtualRemote(!showVirtualRemote);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-white/80 animate-spin" style={{ animationDuration: '40s' }} />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-display text-white">تنظیمات اصلی تلویزیون هوشمند</h2>
            <p className="text-xs text-white/50 font-sans">پیکربندی محیط ران‌تایم Samsung Tizen Smart Hub PWA</p>
          </div>
        </div>
        <span className="text-[9px] font-mono tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-white/85 uppercase">
          TIZEN SYSTEM CONTROL
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {/* Left column: Control list */}
        <div className="col-span-2 flex flex-col gap-4 font-sans">
          
          {/* Action Row 0: Fullscreen helper */}
          <div
            id="set-fullscreen"
            onClick={() => handleActionClick("set-fullscreen")}
            className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
              currentFocusId === "set-fullscreen"
                ? "bg-[#2D2D2D] border-white scale-102 shadow-[0_0_35px_rgba(255,255,255,0.22)] translate-x-1"
                : "bg-[#1A1A1A] border-white/5 hover:bg-[#1A1A1A]/80"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white font-display">اجرای تمام‌صفحه (Fullscreen Layout)</span>
                <p className="text-xs text-white/50 mt-1">با زدن کلید، مرورگر تلویزیون کاملا تمام صفحه (بافرز بدون حاشیه) فعال می‌شود.</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono py-1 px-3.5 rounded-full font-extrabold uppercase ${
              isFullscreen ? "bg-[#2ECC71]/20 text-[#2ECC71]" : "bg-white/10 text-white/60 animate-pulse"
            }`}>
              {isFullscreen ? "Active" : "Tap here"}
            </span>
          </div>

          {/* Action Row 1: Hide mouse cursor programmatically */}
          <div
            id="set-cursor"
            onClick={() => handleActionClick("set-cursor")}
            className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
              currentFocusId === "set-cursor"
                ? "bg-[#2D2D2D] border-white scale-102 shadow-[0_0_35px_rgba(255,255,255,0.22)] translate-x-1"
                : "bg-[#1A1A1A] border-white/5 hover:bg-[#1A1A1A]/80"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                <MousePointer className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white font-display">نادیده گرفتن نشانگر کنترل (Hide Hover Cursor)</span>
                <p className="text-xs text-white/50 mt-1">غیرفعال‌سازی نشانگر فیزیکی ماوس در کل صفحه برای رفتن به حالت فوکوس مطلق.</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono py-1 px-3.5 rounded-full font-extrabold uppercase ${
              cursorHidden ? "bg-[#2ECC71]/20 text-[#2ECC71]" : "bg-red-500/20 text-[#E74C3C]"
            }`}>
              {cursorHidden ? "پنهان شده" : "نمایان"}
            </span>
          </div>

          {/* Action Row 2: Show virtual remote panel */}
          <div
            id="set-remote"
            onClick={() => handleActionClick("set-remote")}
            className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
              currentFocusId === "set-remote"
                ? "bg-[#2D2D2D] border-white scale-102 shadow-[0_0_35px_rgba(255,255,255,0.22)] translate-x-1"
                : "bg-[#1A1A1A] border-white/5 hover:bg-[#1A1A1A]/80"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                <AppWindow className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white font-display">نمایش ریموت کنترل مجازی (Virtual Controller Overlay)</span>
                <p className="text-xs text-white/50 mt-1">نمایش شبیه‌ساز ریموت فیزیکی تلویزیون در گوشه صفحه برای تست آسان‌تر گزینه‌ها.</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono py-1 px-3.5 rounded-full font-extrabold uppercase ${
              showVirtualRemote ? "bg-[#2ECC71]/20 text-[#2ECC71]" : "bg-white/10 text-white/50"
            }`}>
              {showVirtualRemote ? "Showed" : "Hidden"}
            </span>
          </div>
        </div>

        {/* Right column: Specs list */}
        <div className="col-span-1 bg-[#1A1A1A] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 font-mono">
          <div className="flex items-center gap-2 text-white border-b border-white/5 pb-3">
            <Cpu className="w-5 h-5 text-white/70" />
            <span className="text-xs font-bold uppercase tracking-wide">Tizen Diagnostics</span>
          </div>

          <div className="flex flex-col gap-3 text-[11px] text-white/60">
            <div className="flex justify-between">
              <span>Platform</span>
              <span className="text-white">Samsung Tizen OS v6.x</span>
            </div>
            <div className="flex justify-between">
              <span>Web Engine</span>
              <span className="text-white">Chromium Blink (M85)</span>
            </div>
            <div className="flex justify-between">
              <span>Spatial Nav</span>
              <span className="text-[#2ECC71] font-bold">ACTIVE (2D KEY MATRIX)</span>
            </div>
            <div className="flex justify-between">
              <span>Mouse Bypass</span>
              <span className="text-[#2ECC71] font-bold">{cursorHidden ? "ON" : "OFF"}</span>
            </div>
            <div className="flex justify-between">
              <span>Screen Ratio</span>
              <span className="text-white">16:9 Landscape (Responsive)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 bg-black/40 p-3 rounded-lg flex items-start gap-2">
            <MonitorCheck className="w-4 h-4 text-[#2ECC71] shrink-0" />
            <p className="text-[9px] text-white/40 leading-relaxed font-sans">
              در زمان استفاده بر روی تلویزیون سامسونگ، اطمینان حاصل کنید که برنامه به صورت PWA به صفحه خانه نصب شده باشد تا مروگر نوار آدرس را نشان ندهد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
