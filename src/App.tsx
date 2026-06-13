import { useState, useEffect } from "react";
import { Maximize2, Eye, EyeOff, Tv, Shield, Monitor, Key, Sparkles, RefreshCw, HelpCircle } from "lucide-react";

export default function App() {
  const [focusedIndex, setFocusedIndex] = useState<number>(0); // 0: Fullscreen, 1: Cursor occlusion
  const [cursorHidden, setCursorHidden] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("هیچ کلیدی روی ریموت کنترل افشانده نشده است");

  // Track browser window fullscreen state dynamically
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Force fully hide native cursor and block default pointer interactions
  useEffect(() => {
    if (cursorHidden) {
      document.body.style.cursor = "none";
      const style = document.createElement("style");
      style.id = "tizen-cursor-occlusion-payload";
      style.innerHTML = `
        * {
          cursor: none !important;
        }
        button:hover {
          /* Prevent cursor hover states from distracting the remote layout */
          background-color: inherit !important;
          color: inherit !important;
          transform: none !important;
          box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById("tizen-cursor-occlusion-payload");
        if (existing) existing.remove();
      };
    } else {
      document.body.style.cursor = "default";
      const existing = document.getElementById("tizen-cursor-occlusion-payload");
      if (existing) existing.remove();
    }
  }, [cursorHidden]);

  // Handle direct spatial keydown events representing actual TV controller hardware
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scroll behaviors for navigation keys (essential for Smart TV layouts)
      const keysToBlock = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter"];
      if (keysToBlock.includes(e.key)) {
        e.preventDefault();
      }

      setLastKeyPressed(`${e.key === " " ? "Space" : e.key} (کد دکمه: ${e.keyCode})`);

      switch (e.keyCode) {
        // UP Navigation (ArrowUp / Tizen Remote Up)
        case 38:
        // LEFT Navigation (ArrowLeft / Tizen Remote Left)
        case 37:
          setFocusedIndex(0); // Focus upper button
          break;

        // DOWN Navigation (ArrowDown / Tizen Remote Down)
        case 40:
        // RIGHT Navigation (ArrowRight / Tizen Remote Right)
        case 39:
          setFocusedIndex(1); // Focus lower button
          break;

        // Space/Enter (OK Key on Smart TV Remote)
        case 13:
        case 32:
          executeActiveOption(focusedIndex);
          break;

        // Tizen Back Button (10009) / Keyboard Backspace (8) / Escape (27)
        case 10009:
        case 8:
        case 27:
          setLastKeyPressed("کلید بازگشت تلویزیون (Tizen Return/Back Key - صادر شده)");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex]);

  // Execute the active option selected via remote OK/Enter button
  const executeActiveOption = (index: number) => {
    if (index === 0) {
      toggleFullscreen();
    } else if (index === 1) {
      setCursorHidden(prev => !prev);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("فعال‌سازی تمام‌صفحه با مشکل روبرو شد:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn("خروج از حالت تمام‌صفحه با مشکل روبرو شد:", err);
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#060606] text-white p-6 md:p-12 overflow-hidden relative font-sans flex-col justify-between select-none">
      
      {/* Upper Panel - Connection & Hardware Status */}
      <header className="flex justify-between items-center bg-[#0F0F0F] border border-white/5 p-5 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
            <Tv className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex flex-col text-right">
            <h1 className="text-md font-bold text-white tracking-wide">سامانه ناوبری فضایی ریموت کنترل تایزن (نسخه آزمایشی خالص)</h1>
            <p className="text-[11px] text-white/40">سخت‌افزار ریموت فیزیکی و کلیدهای ناوبری دو بعدی مستقیم متصل هستند</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase font-mono font-bold text-[#2ECC71] bg-[#2ECC71]/10 px-3 py-1.5 rounded-xl border border-[#2ECC71]/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping" />
            <span>اتصال مستقیم ریموت برقرار است</span>
          </div>
        </div>
      </header>

      {/* Main Structural Layout */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 my-6 overflow-hidden">
        
        {/* Left Section: Target test buttons with NO HOVER side-effects */}
        <section className="flex-1 flex flex-col justify-center items-center gap-5 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative">
          
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-white/20 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>TIZEN PRIMARY SCREEN CONTROL</span>
          </div>

          <div className="text-center mb-4 max-w-md">
            <h2 className="text-sm font-bold text-white/80 leading-relaxed mb-1">
              کنترل با دکمه‌های جهتی ریموت (بالا/پایین/چپ/راست) و دکمه تایید (OK)
            </h2>
            <p className="text-[11px] text-white/40 leading-relaxed">
              رویدادهای هاور ماوس به طور کامل لغو شده‌اند تا شبیه‌سازی رخ ندهد و تمرکز مطلق بر روی کلیدهای فیزیکی باشد.
            </p>
          </div>

          {/* Button 1: Fullscreen */}
          <button
            id="tizen-btn-fullscreen"
            onClick={() => {
              setFocusedIndex(0);
              executeActiveOption(0);
            }}
            className={`w-full max-w-md py-6 px-7 rounded-2xl border text-right transition-all duration-200 outline-none flex items-center justify-between ${
              focusedIndex === 0
                ? "bg-amber-500 text-black border-amber-400 scale-[1.03] shadow-[0_0_35px_rgba(245,158,11,0.35)]"
                : "bg-[#111111] text-white/70 border-white/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                focusedIndex === 0 ? "bg-black text-white" : "bg-white/5 text-white/80"
              }`}>
                <Maximize2 className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">۱. دکمه فعالسازی تمام‌صفحه (Fullscreen)</span>
                <span className={`text-[10px] mt-1 ${focusedIndex === 0 ? "text-black/60" : "text-white/40"}`}>
                  با فشرده شدن دکمه OK، قاب مرورگر و سربرگ‌های زاید ناپدید می‌شوند.
                </span>
              </div>
            </div>
            
            {focusedIndex === 0 && (
              <span className="bg-black text-white text-[9px] font-mono py-1 px-2.5 rounded-full font-extrabold">
                فوکوس ریموت
              </span>
            )}
          </button>

          {/* Button 2: Hide default OS mouse pointer */}
          <button
            id="tizen-btn-cursor"
            onClick={() => {
              setFocusedIndex(1);
              executeActiveOption(1);
            }}
            className={`w-full max-w-md py-6 px-7 rounded-2xl border text-right transition-all duration-200 outline-none flex items-center justify-between ${
              focusedIndex === 1
                ? "bg-amber-500 text-black border-amber-400 scale-[1.03] shadow-[0_0_35px_rgba(245,158,11,0.35)]"
                : "bg-[#111111] text-white/70 border-white/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                focusedIndex === 1 ? "bg-black text-white" : "bg-white/5 text-white/80"
              }`}>
                {cursorHidden ? <EyeOff className="w-5.5 h-5.5" /> : <Eye className="w-5.5 h-5.5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">۲. پنهان‌سازی دایمی نشانگر ماوس</span>
                <span className={`text-[10px] mt-1 ${focusedIndex === 1 ? "text-black/60" : "text-white/40"}`}>
                  با فعال کردن این گزینه، نشانگر ماوس پیش‌فرض سیستم کاملاً محو می‌شود.
                </span>
              </div>
            </div>

            {focusedIndex === 1 && (
              <span className="bg-black text-white text-[9px] font-mono py-1 px-2.5 rounded-full font-extrabold">
                فوکوس ریموت
              </span>
            )}
          </button>

        </section>

        {/* Right Section: Interactive HUD & Real-time Diagnosis */}
        <section className="w-full md:w-96 flex flex-col gap-4">
          
          <div className="bg-[#0F0F0F] border border-white/5 p-6 rounded-3xl text-right flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Key className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold font-display">نشانگر فرامین و عیب‌یاب زنده</span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-mono">
              <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-white font-bold">{focusedIndex === 0 ? "کلید تمام‌صفحه (۱)" : "کلید ماوس (۲)"}</span>
                <span className="text-white/40">فوکوس فعال فعلی:</span>
              </div>
              
              <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className={`text-[11px] font-bold ${isFullscreen ? "text-[#2ECC71]" : "text-amber-500"}`}>
                  {isFullscreen ? "فعال (Tizen Fullscreen)" : "غیر فعال"}
                </span>
                <span className="text-white/40">حالت تمام‌صفحه:</span>
              </div>

              <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className={`text-[11px] font-bold ${cursorHidden ? "text-red-400" : "text-[#2ECC71]"}`}>
                  {cursorHidden ? "کاملاً محو و مسدود" : "نمایان معمولی"}
                </span>
                <span className="text-white/40">نشانگر ماوس فیزیکی:</span>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/5 pt-3.5 mt-1">
                <span className="text-[10px] text-white/30">آخرین کلید فیزیکی ردیابی شده از کنترل:</span>
                <div className="text-center text-[11px] bg-[#141414] py-3 px-4 rounded-xl border border-amber-500/20 text-amber-400 font-extrabold font-mono leading-relaxed">
                  {lastKeyPressed}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-3xl flex flex-col gap-3 text-right">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 tracking-wide">
              <HelpCircle className="w-4 h-4 text-white/30" />
              <span>راهنمایی ناوبری ۱۰ فوت تلویزیون</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              کلیدهای بالا و پایین (یا چپ و راست) مستقیماً فوکوس را بازنشانی کرده و به دکمه مربوطه هدایت می‌کنند. دکمه Enter ریموت یا Space بار فیزیکی نقش دکمه کلیک تایید را دارد.
            </p>
          </div>

        </section>

      </main>

      {/* Footer System Status Panel */}
      <footer className="bg-[#0F0F0F] border border-white/5 px-6 py-4 rounded-2xl flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-2">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>پوسته آزمایش مستقیم کنترلر Tizen Web Engine v2.0 - ۱۰۰٪ مستقل از شبیه‌سازی دکوری</span>
        </span>
        <span className="font-mono text-[10px] text-white/30">
          Samsung Smart TV Remote Control Mapping: keycodes 37, 38, 39, 40, 13, 10009 active
        </span>
      </footer>

    </div>
  );
}
