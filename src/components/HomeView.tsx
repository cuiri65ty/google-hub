import React, { useState, useEffect } from "react";
import { CloudRain, Sun, Flame, Wind, Eye, Video, Sparkles, Clock, Calendar } from "lucide-react";
import { FocusItem, YoutubeVideo, WeatherInfo } from "../types";

interface HomeViewProps {
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  onSelectVideo: (video: YoutubeVideo) => void;
  onQuickQuery: (query: string) => void;
  registeredItems: FocusItem[];
  setRegisteredItems: React.Dispatch<React.SetStateAction<FocusItem[]>>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentFocusId,
  setFocusedId,
  onSelectVideo,
  onQuickQuery,
  setRegisteredItems,
}) => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Keep digital clock live
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Standard recommended TV videos
  const recommendedVideos: YoutubeVideo[] = [
    { youtubeId: "EngW7tLk6V8", title: "Smart TV browser progressive features on Tizen", channel: "Galaxy Media Hub", views: "140K views", duration: "10:15" },
    { youtubeId: "9bZkp7q19f0", title: "Beautiful 4K UHD Deep Ocean Ambient Visuals", channel: "Relaxation Lounge", views: "1.2M views", duration: "12:00" },
    { youtubeId: "dQw4w9WgXcQ", title: "Google TV UI Design Guidelines & TV Remote UX", channel: "Material Devs", views: "340K views", duration: "8:42" },
  ];

  // Weather configuration values
  const weather: WeatherInfo = {
    temp: 24,
    condition: "آفتاب ملایم",
    icon: "sun",
    humidity: 40,
    wind: 12,
    location: "تهران، ایران",
  };

  // Register focusable elements on mount
  useEffect(() => {
    const items: FocusItem[] = [
      // Row 0 focus elements
      {
        id: "main-weather",
        section: "main",
        row: 0,
        col: 0,
        label: "Weather Widget",
        actionType: "action",
        actionData: { type: "weather-details" },
      },
      {
        id: "main-shortcut-tech",
        section: "main",
        row: 0,
        col: 1,
        label: "Google Tech Search",
        actionType: "action",
        actionData: { type: "quick-query", query: "جدیدترین اخبار تکنولوژی گوگل" },
      },
      {
        id: "main-shortcut-space",
        section: "main",
        row: 0,
        col: 2,
        label: "Google Space News",
        actionType: "action",
        actionData: { type: "quick-query", query: "تحولات کهکشان تلسکوپ جیمز وب" },
      },
      // Row 1 focus elements (Videos)
      {
        id: "main-video-0",
        section: "main",
        row: 1,
        col: 0,
        label: recommendedVideos[0].title,
        actionType: "play",
        actionData: recommendedVideos[0],
      },
      {
        id: "main-video-1",
        section: "main",
        row: 1,
        col: 1,
        label: recommendedVideos[1].title,
        actionType: "play",
        actionData: recommendedVideos[1],
      },
      {
        id: "main-video-2",
        section: "main",
        row: 1,
        col: 2,
        label: recommendedVideos[2].title,
        actionType: "play",
        actionData: recommendedVideos[2],
      },
    ];
    setRegisteredItems(items);
  }, [setRegisteredItems]);

  const handleFocusClick = (id: string, item: FocusItem) => {
    setFocusedId(id);
    if (item.actionType === "play") {
      onSelectVideo(item.actionData);
    } else if (item.actionType === "action" && item.actionData?.type === "quick-query") {
      onQuickQuery(item.actionData.query);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8 overflow-y-auto no-scrollbar scroll-smooth">
      {/* Top Welcome Panel & Digital Clock */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            خوش آمدید به <span className="font-extrabold text-white uppercase tracking-tight">گوگل تی‌وی تلوین</span>
          </h1>
          <p className="text-xs text-white/50">به کمک ریموت کنترل تلویزیون یا کیبورد، گزینه‌ها را حرکت دهید</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end border-r border-white/5 pr-5">
            <span className="text-3xl font-extrabold font-mono tracking-wider text-white">{time}</span>
            <span className="text-[9px] text-white/40 font-sans tracking-widest mt-1 uppercase">{date}</span>
          </div>
          <Clock className="w-8 h-8 text-white/40 max-sm:hidden" />
        </div>
      </div>

      {/* Row 0: Weather Widget and Smart AI Shortcuts */}
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {/* Weather Card */}
        <div
          id="main-weather"
          onClick={() => handleFocusClick("main-weather", {
            id: "main-weather",
            section: "main",
            row: 0,
            col: 0,
            label: "Weather Widget",
            actionType: "action"
          })}
          className={`col-span-1 rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden cursor-pointer ${
            currentFocusId === "main-weather"
              ? "bg-[#2D2D2D] border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)]"
              : "bg-[#1A1A1A] border-white/5 hover:border-white/10"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">پیش‌بینی آب و هوا</span>
              <span className="text-base font-bold text-white mt-1">{weather.location}</span>
            </div>
            <Sun className={`w-8 h-8 ${currentFocusId === "main-weather" ? "text-white animate-spin" : "text-white/60"}`} style={{ animationDuration: '12s' }} />
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold font-mono text-white">{weather.temp}°C</span>
            <span className="text-xs text-white/80 font-sans">{weather.condition}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 text-[11px] text-white/60 font-mono">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-white/40" />
              <span>باد: {weather.wind} km/h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-white/40" />
              <span>رطوبت: {weather.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Tech */}
        <div
          id="main-shortcut-tech"
          onClick={() => handleFocusClick("main-shortcut-tech", {
            id: "main-shortcut-tech",
            section: "main",
            row: 0,
            col: 1,
            label: "Google Tech Search",
            actionType: "action",
            actionData: { type: "quick-query", query: "جدیدترین اخبار تکنولوژی گوگل" }
          })}
          className={`col-span-1 rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between ${
            currentFocusId === "main-shortcut-tech"
              ? "bg-[#2D2D2D] border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)]"
              : "bg-[#1A1A1A] border-white/5 hover:border-white/10"
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">دستیار گوگل</span>
              <Flame className="w-5 h-5 text-white/60" />
            </div>
            <h3 className="text-base font-bold text-white leading-snug">جدیدترین اخبار تکنولوژی گوگل چیست؟</h3>
            <p className="text-xs text-white/60 mt-2 line-clamp-2">با زدن کلید اینتر، بلافاصله آخرین تحولات تکنولوژی‌های گوگل را با هوش مصنوعی مطالعه کنید.</p>
          </div>
          <div className="text-[10px] mt-4 font-mono text-white/40">فشار دهید تا جستجو شود &larr;</div>
        </div>

        {/* Quick Suggestion Space */}
        <div
          id="main-shortcut-space"
          onClick={() => handleFocusClick("main-shortcut-space", {
            id: "main-shortcut-space",
            section: "main",
            row: 0,
            col: 2,
            label: "Google Space News",
            actionType: "action",
            actionData: { type: "quick-query", query: "تحولات کهکشان تلسکوپ جیمز وب" }
          })}
          className={`col-span-1 rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between ${
            currentFocusId === "main-shortcut-space"
              ? "bg-[#2D2D2D] border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)]"
              : "bg-[#1A1A1A] border-white/5 hover:border-white/10"
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">کشف نجوم</span>
              <Sparkles className="w-5 h-5 text-white/60" />
            </div>
            <h3 className="text-base font-bold text-white leading-snug">تحولات کهکشان با تلسکوپ جیمز وب</h3>
            <p className="text-xs text-white/60 mt-2 line-clamp-2">آخرین تصاویر و اطلاعات ارسال شده از اعماق فضا به تلسکوپ‌های مدرن ناسا و گوگل.</p>
          </div>
          <div className="text-[10px] mt-4 font-mono text-white/40">فشار دهید تا جستجو شود &larr;</div>
        </div>
      </div>

      {/* Row 1: recommended YouTube grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-bold font-display text-white">ویدیوهای پیشنهادی YouTube</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {recommendedVideos.map((video, idx) => {
            const id = `main-video-${idx}`;
            const isFocused = currentFocusId === id;

            return (
              <div
                key={id}
                id={id}
                onClick={() => handleFocusClick(id, {
                  id,
                  section: "main",
                  row: 1,
                  col: idx,
                  label: video.title,
                  actionType: "play",
                  actionData: video
                })}
                className={`rounded-3xl overflow-hidden bg-[#1A1A1A] border transition-all duration-300 flex flex-col cursor-pointer ${
                  isFocused
                    ? "border-white scale-105 shadow-[0_0_35px_rgba(255,255,255,0.2)] -translate-y-1"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Simulated Thumbnail */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* YouTube Badge */}
                  <span className="absolute bottom-2.5 right-2.5 bg-black/90 text-[10px] font-mono py-0.5 px-2 rounded font-bold text-white">
                    {video.duration}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                      {video.title}
                    </h4>
                    <span className="text-[10px] text-white/40 font-mono mt-1">{video.channel}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-white/40 font-mono mt-2 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-white/30" /> {video.views}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded font-bold text-white/80">Play Link</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
