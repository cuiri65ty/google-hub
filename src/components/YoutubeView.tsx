import React, { useState, useEffect } from "react";
import { Youtube, Search, ArrowRight, Video, Flame, Eye } from "lucide-react";
import { FocusItem, YoutubeVideo } from "../types";

interface YoutubeViewProps {
  currentFocusId: string;
  setFocusedId: (id: string) => void;
  onSelectVideo: (video: YoutubeVideo) => void;
  registeredItems: FocusItem[];
  setRegisteredItems: React.Dispatch<React.SetStateAction<FocusItem[]>>;
}

export const YoutubeView: React.FC<YoutubeViewProps> = ({
  currentFocusId,
  setFocusedId,
  onSelectVideo,
  setRegisteredItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("همه");

  const categories = ["همه", "موسیقی لوفای", "شگفتی‌های نجوم", "تکنولوژی و وب"];

  // Custom categorized list of YouTube public embed clips
  const videosDatabase: { [key: string]: YoutubeVideo[] } = {
    "همه": [
      { youtubeId: "dQw4w9WgXcQ", title: "NASA Hubble Deep Field Space Discovery High-Def", channel: "Hubble Space", views: "3.2M views", duration: "14:20" },
      { youtubeId: "EngW7tLk6V8", title: "Smart TV Spatial Focus & Tizen Engine Integration", channel: "Material Devs", views: "780K views", duration: "11:00" },
      { youtubeId: "9bZkp7q19f0", title: "Deep Sea Exploration & Mariana Trench Mysteries", channel: "Cinematic Nature", views: "2.4M views", duration: "25:12" },
      { youtubeId: "y9m9R6-M6bA", title: "Progressive Web Apps full screen standalone launchers", channel: "Web Chronology", views: "450K views", duration: "16:05" },
    ],
    "موسیقی لوفای": [
      { youtubeId: "dQw4w9WgXcQ", title: "Chilled Beats Study Low-Fi Ambient Stream", channel: "Cosmic Chills", views: "6.8M views", duration: "3:40:00" },
      { youtubeId: "9bZkp7q19f0", title: "Synthwave Neo Tokyo Ambient Music Soundtrack", channel: "Retro Records", views: "1.2M views", duration: "45:00" },
    ],
    "شگفتی‌های نجوم": [
      { youtubeId: "dQw4w9WgXcQ", title: "James Webb Telescope High Res Nebulas Revealed", channel: "Nasa Hubble", views: "4.5M views", duration: "18:00" },
      { youtubeId: "9bZkp7q19f0", title: "Traveling through Andromeda Galaxy 3D Visualizer", channel: "Science Odyssey", views: "900K views", duration: "13:25" },
    ],
    "تکنولوژی و وب": [
      { youtubeId: "EngW7tLk6V8", title: "Javascript ES2026 Core Engine Bindings inside Browser", channel: "JS Weekly", views: "190K views", duration: "9:42" },
      { youtubeId: "y9m9R6-M6bA", title: "Samsung Tizen Web Engine Architecture and Layouts", channel: "Tizen Engineers", views: "240K views", duration: "15:30" },
    ]
  };

  const activeVideos = videosDatabase[activeCategory] || videosDatabase["همه"];

  // Register focus items on mount / database state updates
  useEffect(() => {
    const items: FocusItem[] = [];

    // Row 0: Category chips navigation
    categories.forEach((cat, idx) => {
      items.push({
        id: `yt-cat-${idx}`,
        section: "main",
        row: 0,
        col: idx,
        label: cat,
        actionType: "action",
        actionData: cat,
      });
    });

    // Row 1 & 2: Grid of videos
    activeVideos.forEach((vid, idx) => {
      // Create rows of 3 columns
      const row = 1 + Math.floor(idx / 3);
      const col = idx % 3;

      items.push({
        id: `yt-video-${idx}`,
        section: "main",
        row: row,
        col: col,
        label: vid.title,
        actionType: "play",
        actionData: vid,
      });
    });

    setRegisteredItems(items);
  }, [activeCategory, setRegisteredItems]);

  const handleActionClick = (id: string, actionType: string, actionData?: any, colIdx?: number) => {
    setFocusedId(id);
    if (id.startsWith("yt-cat-")) {
      setActiveCategory(actionData);
    } else if (id.startsWith("yt-video-")) {
      onSelectVideo(actionData);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar scroll-smooth">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <Youtube className="w-8 h-8 text-white/80 animate-pulse" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-display text-white">یوتیوب برای تلویزیون‌های هوشمند</h2>
            <p className="text-xs text-white/50">یکپارچه‌سازی وب‌پلیر اصلی یوتیوب با مرورگر اختصاصی تایزن</p>
          </div>
        </div>
        <span className="text-[9px] font-mono tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-white/85">
          SPATIAL AUDIO SUPPORT
        </span>
      </div>

      {/* Row 0: Category Filter Chips */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {categories.map((cat, idx) => {
            const id = `yt-cat-${idx}`;
            const isFocused = currentFocusId === id;
            const isActive = activeCategory === cat;

            return (
              <button
                key={id}
                id={id}
                onClick={() => handleActionClick(id, "action", cat)}
                className={`py-3 px-5 rounded-full text-xs font-bold font-display transition-all duration-200 outline-none select-none border whitespace-nowrap ${
                  isFocused
                    ? "bg-white border-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : isActive
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-[#1A1A1A] border-white/5 text-white/50 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 1 / 2: Grid list of categories videos */}
      <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
        {activeVideos.map((video, idx) => {
          const id = `yt-video-${idx}`;
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
              {/* Simulated Thumbnail */}
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

              {/* Title & Channel details */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-1">
                <h4 className="text-xs font-bold text-slate-100 leading-relaxed font-sans line-clamp-2">
                  {video.title}
                </h4>
                <div className="flex justify-between items-center text-[9px] text-white/40 font-mono mt-2 pt-2 border-t border-white/5">
                  <span>{video.channel}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {video.views}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
