import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Loader2, Play, CornerDownLeft, Globe, BadgeAlert, Plus } from "lucide-react";
import { FocusItem, YoutubeVideo, SearchResult } from "../types";

interface AssistantViewProps {
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  onSelectVideo: (video: YoutubeVideo) => void;
  registeredItems: FocusItem[];
  setRegisteredItems: React.Dispatch<React.SetStateAction<FocusItem[]>>;
  directSearchQuery?: string;
  clearDirectQuery?: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  currentFocusId,
  setFocusedId,
  onSelectVideo,
  setRegisteredItems,
  directSearchQuery,
  clearDirectQuery,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const presetQueries = [
    { text: "آب و هوای امروز تهران", label: "آب و هوا" },
    { text: "جدیدترین دستاوردهای هوش مصنوعی گوگل چیست؟", label: "هوش مصنوعی" },
    { text: "قیمت سهام شرکت‌های بزرگ فناوری جهان", label: "بازار بورس" },
    { text: "حقایق شگفت‌انگیز درمورد کهکشان راه شیری", label: "نجوم" },
  ];

  // Dynamically register focusable items depending on current results state
  useEffect(() => {
    const items: FocusItem[] = [
      // Row 0: Search input row
      { id: "ast-input-btn", section: "main", row: 0, col: 0, label: "Search input box", actionType: "input" },
      { id: "ast-submit-btn", section: "main", row: 0, col: 1, label: "Ask Gemini", actionType: "action" },
    ];

    // Row 1: Preset quick queries
    presetQueries.forEach((q, idx) => {
      items.push({
        id: `ast-preset-${idx}`,
        section: "main",
        row: 1,
        col: idx,
        label: q.label,
        actionType: "action",
        actionData: q.text,
      });
    });

    // Row 2: Suggested AI videos if results exist
    if (searchResult && searchResult.suggestedVideos.length > 0) {
      searchResult.suggestedVideos.forEach((v, idx) => {
        items.push({
          id: `ast-video-${idx}`,
          section: "main",
          row: 2,
          col: idx,
          label: v.title,
          actionType: "play",
          actionData: v,
        });
      });
    }

    setRegisteredItems(items);
  }, [searchResult, setRegisteredItems]);

  // Execute Search query via Express API endpoint
  const handleQuerySearch = async (queryToSearch: string) => {
    if (!queryToSearch || queryToSearch.trim() === "") return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSearch }),
      });
      if (!res.ok) throw new Error("مشکل در دریافت پاسخ از سرور هاب گوگل");
      const data: SearchResult = await res.json();
      setSearchResult(data);
    } catch (e: any) {
      console.error(e);
      setErrorMsg("اتصال به سرور برقرار نشد، بررسی کنید که کلید API در پنل تنظیمات ثبت شده باشد.");
    } finally {
      setLoading(false);
    }
  };

  // Listen for direct queries requested from Home dashboard shortcuts
  useEffect(() => {
    if (directSearchQuery) {
      setInputText(directSearchQuery);
      handleQuerySearch(directSearchQuery);
      if (clearDirectQuery) clearDirectQuery();
    }
  }, [directSearchQuery]);

  // Handle Enter click on focused element
  const handleActionClick = (id: string, actionType: string, actionData?: any) => {
    setFocusedId(id);
    if (actionType === "input") {
      inputRef.current?.focus();
    } else if (id === "ast-submit-btn") {
      handleQuerySearch(inputText);
    } else if (id.startsWith("ast-preset-")) {
      setInputText(actionData);
      handleQuerySearch(actionData);
    } else if (id.startsWith("ast-video-")) {
      onSelectVideo(actionData);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth">
      {/* Assistant Logo & Search Row */}
      <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center animate-tv-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">دستیار صوتی و متنی Google TV</h2>
            <p className="text-xs text-white/50">عبارت خود را جستجو کنید تا دستیار گوگل با جستجوی زنده پاسخ دهد</p>
          </div>
        </div>

        {/* Input spatial fields */}
        <div className="flex gap-4 max-sm:flex-col">
          {/* Spatial Input Border box */}
          <div
            onClick={() => handleActionClick("ast-input-btn", "input")}
            className={`flex-1 flex items-center gap-3 bg-black px-5 py-3.5 rounded-xl border transition-all duration-300 ${
              currentFocusId === "ast-input-btn"
                ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "border-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              placeholder="جستجو به کمک دستیار هوشمند گوگل..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleQuerySearch(inputText);
                }
              }}
              className="flex-1 bg-transparent border-none text-white placeholder-white/30 text-sm outline-none cursor-none p-0 focus:ring-0"
            />
            <span className="text-[9px] font-mono font-bold text-white/45 bg-white/5 py-1 px-2 rounded flex items-center gap-1 max-sm:hidden">
              <CornerDownLeft className="w-3 h-3" /> ENTER
            </span>
          </div>

          <button
            id="ast-submit-btn"
            onClick={() => handleActionClick("ast-submit-btn", "action")}
            className={`px-8 py-3.5 rounded-xl font-bold font-display text-sm transition-all duration-300 flex items-center justify-center gap-2 outline-none border ${
              currentFocusId === "ast-submit-btn"
                ? "bg-white text-black border-white scale-105 shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                : "bg-white/5 text-white/80 border-white/5 hover:bg-white/10"
            }`}
          >
            <span>بپرسید</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: Preset Quick suggestions */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-white/50 font-display">پیشنهادهای خودکار جستجو:</span>
        <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
          {presetQueries.map((q, idx) => {
            const id = `ast-preset-${idx}`;
            const isFocused = currentFocusId === id;

            return (
              <button
                key={id}
                id={id}
                onClick={() => handleActionClick(id, "action", q.text)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold text-center transition-all duration-200 outline-none truncate font-display ${
                  isFocused
                    ? "bg-white text-[#0F0F0F] border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : "bg-[#1A1A1A] border-white/5 text-white/70 hover:bg-white/5"
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Panel */}
      <div className="flex-1 flex flex-col justify-center min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-white font-display animate-pulse">در حال انجام جستجو در گوگل...</span>
              <span className="text-[10px] text-white/30 font-mono">Connecting with Live Google Search Grounding</span>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-6 flex items-start gap-4">
            <BadgeAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-red-300">خطا در موتور جستجوی هوشمند</span>
              <p className="text-xs text-red-400 font-sans leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        ) : searchResult ? (
          <div className="flex flex-col gap-6 animate-fade-in duration-300">
            {/* Grounding Synthesizer Answer */}
            <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/70 uppercase">
                  <Globe className="w-4 h-4" />
                  <span>Google Search Grounding Active</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest bg-white/5 px-2.5 py-1 rounded-full text-white/50 uppercase">
                  Category: {searchResult.searchCategory}
                </span>
              </div>
              
              <h1 className="text-lg font-bold text-white font-sans leading-relaxed tracking-wide">
                {searchResult.answer}
              </h1>

              {/* Dynamic Fact Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6 max-sm:grid-cols-1 font-sans">
                {searchResult.facts.map((fact, idx) => (
                  <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono font-extrabold text-white/40">FACT KEY {idx+1}</span>
                    <p className="text-xs text-white/70 antialiased leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Videos associated with search */}
            {searchResult.suggestedVideos.length > 0 && (
              <div className="flex flex-col gap-4">
                <span className="text-xs text-white/40 font-mono tracking-widest uppercase">محتوای ویدیویی مرتبط در یوتیوب:</span>
                <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
                  {searchResult.suggestedVideos.map((video, idx) => {
                    const id = `ast-video-${idx}`;
                    const isFocused = currentFocusId === id;

                    return (
                      <div
                        key={id}
                        id={id}
                        onClick={() => handleActionClick(id, "play", video)}
                        className={`rounded-3xl overflow-hidden bg-[#1A1A1A] border transition-all duration-300 flex flex-col cursor-pointer ${
                          isFocused
                            ? "border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)] -translate-y-1"
                            : "border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="relative aspect-video bg-black">
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/90 text-[10px] font-mono py-0.5 px-2 rounded font-bold text-white">
                            {video.duration}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col justify-between flex-1 gap-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {video.title}
                          </h4>
                          <span className="text-[10px] text-white/40 font-mono">{video.channel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-1.5 bg-[#1A1A1A]/10 rounded-3xl border border-dashed border-white/5">
            <Sparkles className="w-8 h-8 text-white/40" />
            <span className="text-sm font-bold text-white/60 font-display">موتور دستیار آماده بکار است</span>
            <span className="text-xs text-white/30 font-mono">Ask standard prompts or enter custom queries above</span>
          </div>
        )}
      </div>
    </div>
  );
};
