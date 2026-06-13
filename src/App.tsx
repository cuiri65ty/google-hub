import { useState, useEffect } from "react";
import { Maximize2, Eye, EyeOff, Tv, Keyboard, Monitor, CheckCircle, ArrowRight, CornerDownLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function App() {
  const [focusedIndex, setFocusedIndex] = useState<number>(0); // 0 corresponds to Button 1, 1 corresponds to Button 2
  const [cursorHidden, setCursorHidden] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("هیچ کلیدی فشرده نشده است");

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

  // Set body cursor styling dynamically
  useEffect(() => {
    if (cursorHidden) {
      document.body.style.cursor = "none";
      // Prevent child elements from showing normal cursor on hover
      const style = document.createElement("style");
      style.id = "tizen-cursor-override";
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById("tizen-cursor-override");
        if (existing) existing.remove();
      };
    } else {
      document.body.style.cursor = "default";
      const existing = document.getElementById("tizen-cursor-override");
      if (existing) existing.remove();
    }
  }, [cursorHidden]);

  // Monitor spatial keys and simulated controller events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(`${e.key} (Key_Code: ${e.keyCode})`);

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          setFocusedIndex(0); // Focus Button 1
          break;
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          setFocusedIndex(1); // Focus Button 2
          break;
        case "Tab":
          e.preventDefault();
          setFocusedIndex(prev => (prev === 0 ? 1 : 0)); // Toggle
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          triggerButtonAction(focusedIndex);
          break;
        default:
          // Escape / Backspace simulation for smart TV back key
          if (e.keyCode === 10009 || e.keyCode === 8 || e.key === "Backspace") {
            setLastKeyPressed("کلید بازگشت / Backspace");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex]);

  // Triggers action associated with the currently hovered/focused test button
  const triggerButtonAction = (index: number) => {
    if (index === 0) {
      toggleFullscreen();
    } else if (index === 1) {
      setCursorHidden(prev => !prev);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("استارت تمام‌صفحه با خطا مواجه شد:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn("خروج از تمام‌صفحه با خطا مواجه شد:", err);
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0A0A0A] text-white p-6 md:p-12 overflow-hidden relative font-sans flex-col justify-between">
      
      {/* Top Header - TV Info */}
      <header className="flex justify-between items-center bg-[#141414] border border-white/5 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <Tv className="w-8 h-8 text-white/90 animate-pulse" />
          <div className="flex flex-col text-right">
            <h1 className="text-lg font-bold font-display text-white">سامانه تست فوکوس دستی و تمام‌صفحه Samsung Tizen</h1>
            <p className="text-[11px] text-white/50">بدون نشانگر پیش‌فرض ماوس، مخصوص ریموت کنترل‌های هوشمند ۱۰ فوت</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white/80 bg-white/5 py-1 px-3 rounded-md border border-white/10">
          <span>TIZEN DEBUG MODE</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 my-6 overflow-hidden">
        
        {/* Left Side: The 2 Main Target Focus Buttons */}
        <section className="flex-1 flex flex-col justify-center items-center gap-6 bg-[#111] border border-white/5 rounded-3xl p-8 relative">
          
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] text-white/30 font-mono">
            <Monitor className="w-3.5 h-3.5" />
            <span>PRIMARY TEST TARGET AREA</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-md font-bold mb-1 text-white/80">تغییر فوکوس با کلیدهای جهتی بالا/پایین یا چپ/راست کیبورد</h2>
            <p className="text-xs text-white/40">فوکوس زرد رنگ نشان‌دهنده انتخاب فعال دوربردی است</p>
          </div>

          {/* BUTTON NO 1: Toggle Fullscreen */}
          <button
            id="test-btn-fullscreen"
            onClick={() => {
              setFocusedIndex(0);
              triggerButtonAction(0);
            }}
            className={`w-full max-w-md py-6 px-8 rounded-2xl border text-right transition-all duration-300 flex items-center justify-between outline-none cursor-none ${
              focusedIndex === 0
                ? "bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                : "bg-[#181818] text-white/80 border-white/5 hover:bg-[#202020] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                focusedIndex === 0 ? "bg-black text-white" : "bg-white/5 text-white/80"
              }`}>
                <Maximize2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-display">۱. کلید تغییر حالت تمام‌صفحه (Fullscreen)</span>
                <span className={`text-[10px] mt-1 ${focusedIndex === 0 ? "text-black/60" : "text-white/40"}`}>
                  با زدن این کلید، مرورگر تلویزیون وارد حالت بدون قاب و بنر می‌شود.
                </span>
              </div>
            </div>
            
            {/* Focus status indicator */}
            <div className="flex items-center gap-2">
              {focusedIndex === 0 && (
                <span className="bg-black text-white text-[9px] font-mono py-1 px-2.5 rounded-full font-bold uppercase tracking-wide">
                  FOCUS ACTIVE
                </span>
              )}
            </div>
          </button>

          {/* BUTTON NO 2: Toggle Mouse Cursor */}
          <button
            id="test-btn-cursor"
            onClick={() => {
              setFocusedIndex(1);
              triggerButtonAction(1);
            }}
            className={`w-full max-w-md py-6 px-8 rounded-2xl border text-right transition-all duration-300 flex items-center justify-between outline-none cursor-none ${
              focusedIndex === 1
                ? "bg-white text-black border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                : "bg-[#181818] text-white/80 border-white/5 hover:bg-[#202020] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                focusedIndex === 1 ? "bg-black text-white" : "bg-white/5 text-white/80"
              }`}>
                {cursorHidden ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-display">۲. فعال/غیرفعال‌سازی نشانگر ماوس</span>
                <span className={`text-[10px] mt-1 ${focusedIndex === 1 ? "text-black/60" : "text-white/40"}`}>
                  بای پس کردن نشانگر فیزیکی ماوس برای آزمایش فوکوس مطلق تلویزیونی.
                </span>
              </div>
            </div>

            {/* Focus status indicator */}
            <div className="flex items-center gap-2">
              {focusedIndex === 1 && (
                <span className="bg-black text-white text-[9px] font-mono py-1 px-2.5 rounded-full font-bold uppercase tracking-wide">
                  FOCUS ACTIVE
                </span>
              )}
            </div>
          </button>

        </section>

        {/* Right Side: Diagnostics & On-screen Controller Feedback */}
        <section className="w-full lg:w-96 flex flex-col gap-4">
          
          {/* Active Diagnostic Stats */}
          <div className="bg-[#141414] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 text-right">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Keyboard className="w-5 h-5 text-white/70" />
              <span className="text-xs font-bold font-display">وضعیت لحظه‌ای و تشخیص خطا</span>
            </div>

            <div className="flex flex-col gap-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{focusedIndex === 0 ? "کلید تمام‌صفحه (۱)" : "کلید ماوس (۲)"}</span>
                <span className="text-white/50">آیتم فعال فوکوس</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-[11px] font-bold ${isFullscreen ? "text-[#2ECC71]" : "text-white/60"}`}>
                  {isFullscreen ? "فعال (FULL)" : "غیر فعال (WINDOW)"}
                </span>
                <span className="text-white/50">حالت تمام‌صفحه</span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-[11px] font-bold ${cursorHidden ? "text-red-400" : "text-[#2ECC71]"}`}>
                  {cursorHidden ? "کامل مخفی شده (OFF)" : "نمایان (ON)"}
                </span>
                <span className="text-white/50">نشانگر ماوس پیش‌فرض</span>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3 mt-1 align-right text-right">
                <span className="text-[10px] text-white/40">آخرین کلید فشرده شده در صفحه:</span>
                <span className="text-right text-[11px] bg-black py-2 px-3 rounded-lg border border-white/5 text-yellow-400 font-bold font-mono">
                  {lastKeyPressed}
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Universal TV Remote Hub */}
          <div className="bg-[#111] border border-white/5 p-5 rounded-3xl flex flex-col gap-3">
            <span className="text-[10px] font-bold text-white/40 tracking-wider text-center uppercase">TIZEN VIRTUAL CONTROLLER</span>
            
            {/* Visual D-Pad Buttons */}
            <div className="flex flex-col items-center py-2">
              <button
                onClick={() => setFocusedIndex(0)}
                className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 my-1">
                <button
                  onClick={() => setFocusedIndex(0)}
                  className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => triggerButtonAction(focusedIndex)}
                  className="w-12 h-12 rounded-full bg-white text-black font-extrabold flex items-center justify-center hover:bg-white/90 active:scale-95 transform text-xs"
                >
                  OK
                </button>

                <button
                  onClick={() => setFocusedIndex(1)}
                  className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setFocusedIndex(1)}
                className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* Footer Instructions */}
      <footer className="bg-[#141414] border border-white/5 px-6 py-4.5 rounded-2xl flex flex-col md:flex-row justify-between items-center text-xs text-white/50 gap-2">
        <span className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
          <span>سیستم بای‌پاس ماوس و هندلر فوکوس فضایی تایزن نسخه آزمایشی ۲.۰</span>
        </span>
        <span className="font-mono text-[10px]">
          کلیدهای جهتی بالا/پایین روی کیبورد کارهای زرد رنگ ریموت را شبیه‌سازی می‌کنند
        </span>
      </footer>

    </div>
  );
}
