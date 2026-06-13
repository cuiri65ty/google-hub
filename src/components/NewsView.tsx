import React, { useEffect } from "react";
import { Newspaper, Globe, Sparkles, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { FocusItem, NewsArticle } from "../types";

interface NewsViewProps {
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  registeredItems: FocusItem[];
  setRegisteredItems: React.Dispatch<React.SetStateAction<FocusItem[]>>;
}

export const NewsView: React.FC<NewsViewProps> = ({
  currentFocusId,
  setFocusedId,
  setRegisteredItems,
}) => {
  
  const todayDate = new Date().toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const featuredStory: NewsArticle = {
    id: "news-featured",
    title: "گوگل مدل هوشمند اندروید تی‌وی Tizen-Ready را با معماری وب پر سرعت معرفی کرد",
    source: "Google Developers Blog",
    time: "۲ ساعت قبل",
    category: "پلتفرم‌های هوشمند",
    summary: "گوگل اعلام کرد که هسته بهینه‌سازی شده موتور مرورگر کرومیوم در نسخه جدید تلویزیون‌های هوشمند، بارگذاری برنامه‌های PWA تمام‌صفحه را تا دو برابر سریع‌تر انجام می‌دهد. این تصمیم با هدف ورود گسترده‌تر اپلیکیشن‌های مستقل به خانه‌ها انجام گرفته است."
  };

  const secondaryNews: NewsArticle[] = [
    {
      id: "news-item-0",
      title: "سامسونگ سیستم‌عامل تایزن را برای یکپارچگی بهتر بازطراحی می‌کند",
      source: "Tizen Portal",
      time: "۴ ساعت قبل",
      category: "تکنولوژی",
      summary: "یکپارچگی برنامه‌های هیبریدی با پلتفرم‌های ابری و سرعت رندرینگ بالا کلید تغییرات جدید تایزن ۶.۵ است. برنامه‌های وب راندمان بهتری روی نمایشگر دارند."
    },
    {
      id: "news-item-1",
      title: "افزایش محبوبیت تلویزیون‌های بدون فریم و با مصرف انرژی بهینه",
      source: "Smart Screen Tech",
      time: "دیروز",
      category: "صنایع",
      summary: "آمارها نشان می‌دهند تقاضا برای رزولوشن ۴کا پایدار با تکیه بر ویژگی‌های ابری و پردازش گرافیکی وب افزایش داشته است."
    },
    {
      id: "news-item-2",
      title: "معرفی موتورهای رفرنس وب برای رابط کاربری بدون ریموت ماوس",
      source: "W3C Smart TV Working Group",
      time: "۲ روز پیش",
      category: "استاندارد وب",
      summary: "استانداردهای جدید جابجایی فضایی (Spatial Navigation) اجازه می‌دهند بدون اشاره‌گر ماوس، کاربر به راحتی بین پیوندها روی تلویزیون جابجا شود."
    }
  ];

  // Dynamic registration for spatial focus grid
  useEffect(() => {
    const items: FocusItem[] = [
      // Row 0: Highlighted/Featured News
      {
        id: "news-featured",
        section: "main",
        row: 0,
        col: 0,
        label: featuredStory.title,
        actionType: "action",
      }
    ];

    // Row 1: Sub news grid
    secondaryNews.forEach((news, idx) => {
      items.push({
        id: `news-item-${idx}`,
        section: "main",
        row: 1,
        col: idx,
        label: news.title,
        actionType: "action",
      });
    });

    setRegisteredItems(items);
  }, [setRegisteredItems]);

  const handleActionClick = (id: string) => {
    setFocusedId(id);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth">
      {/* Top Title Bar */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-white/80" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-display text-white">گوگل نیوز (Google News)</h2>
            <p className="text-xs text-white/50">آخرین وقایع فناوری و پلتفرم‌های هوشمند رسانه‌ای جهان</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-white/80 bg-white/10 py-1.5 px-3 rounded-lg border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-white/70" />
          <span>بروزرسانی: {todayDate}</span>
        </div>
      </div>

      {/* Row 0: Featured editorial Headline Article */}
      <div
        id="news-featured"
        onClick={() => handleActionClick("news-featured")}
        className={`rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col gap-4 cursor-pointer ${
          currentFocusId === "news-featured"
            ? "bg-[#2D2D2D] border-white scale-102 shadow-[0_0_45px_rgba(255,255,255,0.25)]"
            : "bg-[#1A1A1A] border-white/5 hover:border-white/10"
        }`}
      >
        {/* Glow effect */}
        {currentFocusId === "news-featured" && (
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white" />
        )}

        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[10px] tracking-widest font-bold text-white uppercase bg-black/80 px-2.5 py-0.5 rounded border border-white/10">
            {featuredStory.category}
          </span>
          <span className="text-white/50 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-white/60 animate-bounce" /> {featuredStory.time}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h1 className="text-xl font-black text-[#F1F1F1] font-sans leading-relaxed">
            {featuredStory.title}
          </h1>
          <span className="text-[10px] text-white/50 font-mono italic font-bold">منبع: {featuredStory.source}</span>
          <p className="text-xs text-white/70 leading-relaxed max-w-4xl mt-1 antialiased font-sans">
            {featuredStory.summary}
          </p>
        </div>

        <div className="flex justify-end mt-2">
          <span className="text-[10px] font-mono tracking-wider text-white/60 flex items-center bg-black/40 py-1.5 px-3.5 rounded-full border border-white/5">
            برای مطالعه جزئیات بیشتر کلیک کنید <ChevronRight className="w-3 h-3 text-white" />
          </span>
        </div>
      </div>

      {/* Row 1: Secondary elements list */}
      <div className="flex flex-col gap-4">
        <span className="text-xs text-white/40 font-mono tracking-widest uppercase">سایر خبرهای برجسته:</span>
        <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
          {secondaryNews.map((news, idx) => {
            const id = `news-item-${idx}`;
            const isFocused = currentFocusId === id;

            return (
              <div
                key={id}
                id={id}
                onClick={() => handleActionClick(id)}
                className={`rounded-3xl @container bg-[#1A1A1A] p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isFocused
                    ? "border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)] -translate-y-1"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40 border-b border-white/5 pb-2">
                    <span className="text-white/60 font-bold uppercase">{news.category}</span>
                    <span>{news.time}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-relaxed font-sans">
                    {news.title}
                  </h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-sans line-clamp-3 antialiased">
                    {news.summary}
                  </p>
                </div>
                <div className="text-[9px] font-mono text-white/40 mt-4 font-semibold italic">
                  منبع: {news.source}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
