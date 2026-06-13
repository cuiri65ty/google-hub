import { useState, useEffect } from "react";
import { useTvNavigation } from "./hooks/useTvNavigation";
import { Sidebar } from "./components/Sidebar";
import { HomeView } from "./components/HomeView";
import { AssistantView } from "./components/AssistantView";
import { YoutubeView } from "./components/YoutubeView";
import { NewsView } from "./components/NewsView";
import { SettingsView } from "./components/SettingsView";
import { FocusItem, PageType, YoutubeVideo, SearchResult } from "./types";
import { Youtube, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, ArrowLeft, Maximize2, Sparkles, Tv } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState<PageType>("home");
  const [viewRegisteredItems, setViewRegisteredItems] = useState<FocusItem[]>([]);
  const [cursorHidden, setCursorHidden] = useState<boolean>(true);
  const [showVirtualRemote, setShowVirtualRemote] = useState<boolean>(true);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState<boolean>(false);
  const [activeVideo, setActiveVideo] = useState<YoutubeVideo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Directly forward query from Home Shortcuts to Assistant View
  const [directQuery, setDirectQuery] = useState<string | undefined>(undefined);

  // Permanent sidebar focus items
  const permanentSidebarItems: FocusItem[] = [
    { id: "sidebar-home", section: "sidebar", row: 0, col: 0, label: "Home", actionType: "navigate", actionData: "home" },
    { id: "sidebar-assistant", section: "sidebar", row: 1, col: 0, label: "Google AI", actionType: "navigate", actionData: "assistant" },
    { id: "sidebar-youtube", section: "sidebar", row: 2, col: 0, label: "YouTube TV", actionType: "navigate", actionData: "youtube" },
    { id: "sidebar-news", section: "sidebar", row: 3, col: 0, label: "Google News", actionType: "navigate", actionData: "news" },
    { id: "sidebar-settings", section: "sidebar", row: 4, col: 0, label: "Settings", actionType: "navigate", actionData: "settings" },
  ];

  // Active list of all focusable targets on viewport screen
  let focusList: FocusItem[] = [];
  if (videoPlayerOpen) {
    focusList = [{ id: "player-close-btn", section: "main", row: 0, col: 0, label: "Close player", actionType: "action" }];
  } else {
    focusList = [...permanentSidebarItems, ...viewRegisteredItems];
  }

  // Handle media player closing
  const closePlayer = () => {
    setVideoPlayerOpen(false);
    setActiveVideo(null);
    // Return focus cleanly to the active video card/trigger
    if (activePage === "home") {
      setFocusedId("main-video-0");
    } else if (activePage === "youtube") {
      setFocusedId("yt-video-0");
    } else if (activePage === "assistant") {
      setFocusedId("ast-video-0");
    }
  };

  // Central trigger router for spatial navigation clicks on non-standard actions
  const handleExecuteAction = (item: FocusItem) => {
    if (item.actionType === "play") {
      setActiveVideo(item.actionData);
      setVideoPlayerOpen(true);
      setFocusedId("player-close-btn");
    } else if (item.actionType === "action" && item.id === "player-close-btn") {
      closePlayer();
    }
  };

  // Initialize helper navigation hook
  const {
    currentFocusId,
    setFocusedId,
    moveFocus,
    triggerEnter,
    triggerBack
  } = useTvNavigation(
    activePage,
    setActivePage,
    focusList,
    handleExecuteAction,
    videoPlayerOpen,
    closePlayer
  );

  // Monitor cursor hidden status changes
  useEffect(() => {
    if (cursorHidden) {
      document.body.classList.add("cursor-hidden");
    } else {
      document.body.classList.remove("cursor-hidden");
    }
  }, [cursorHidden]);

  // Handle Fullscreen events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn("Fullscreen exit failed:", err);
      });
    }
  };

  // Kick off quick query search from recommendation shortcuts
  const handleShortcutQueryTrigger = (query: string) => {
    setDirectQuery(query);
    setActivePage("assistant");
  };

  return (
    <div className="flex h-screen w-screen bg-[#0F0F0F] text-[#F1F1F1] overflow-hidden relative font-sans">
      
      {/* Standalone Fullscreen Prompt Banner if not activated inside standalone browser */}
      {!isFullscreen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#1A1A1A] text-[11px] font-bold font-mono px-4 py-2 rounded-full border border-white/10 shadow-xl shadow-black/80 backdrop-blur-md flex items-center gap-2 max-sm:hidden animate-bounce">
          <Maximize2 className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>F11 key or Settings &rarr; Fullscreen for authentic border-free TV view</span>
        </div>
      )}

      {/* Main Framework: Sidebar + Core View Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Spatial Focus Sidebar */}
        <Sidebar
          activePage={activePage}
          currentFocusId={currentFocusId}
          setFocusedId={setFocusedId}
          onNavigate={setActivePage}
        />

        {/* Central Content View */}
        <main className="flex-1 flex flex-col p-8 bg-[#0F0F0F] border-r border-white/5 overflow-hidden relative">
          
          {/* Active Router views */}
          {activePage === "home" && (
            <HomeView
              currentFocusId={currentFocusId}
              setFocusedId={setFocusedId}
              onSelectVideo={(video) => {
                setActiveVideo(video);
                setVideoPlayerOpen(true);
                setFocusedId("player-close-btn");
              }}
              onQuickQuery={handleShortcutQueryTrigger}
              registeredItems={viewRegisteredItems}
              setRegisteredItems={setViewRegisteredItems}
            />
          )}

          {activePage === "assistant" && (
            <AssistantView
              currentFocusId={currentFocusId}
              setFocusedId={setFocusedId}
              onSelectVideo={(video) => {
                setActiveVideo(video);
                setVideoPlayerOpen(true);
                setFocusedId("player-close-btn");
              }}
              registeredItems={viewRegisteredItems}
              setRegisteredItems={setViewRegisteredItems}
              directSearchQuery={directQuery}
              clearDirectQuery={() => setDirectQuery(undefined)}
            />
          )}

          {activePage === "youtube" && (
            <YoutubeView
              currentFocusId={currentFocusId}
              setFocusedId={setFocusedId}
              onSelectVideo={(video) => {
                setActiveVideo(video);
                setVideoPlayerOpen(true);
                setFocusedId("player-close-btn");
              }}
              registeredItems={viewRegisteredItems}
              setRegisteredItems={setViewRegisteredItems}
            />
          )}

          {activePage === "news" && (
            <NewsView
              currentFocusId={currentFocusId}
              setFocusedId={setFocusedId}
              registeredItems={viewRegisteredItems}
              setRegisteredItems={setViewRegisteredItems}
            />
          )}

          {activePage === "settings" && (
            <SettingsView
              currentFocusId={currentFocusId}
              setFocusedId={setFocusedId}
              cursorHidden={cursorHidden}
              setCursorHidden={setCursorHidden}
              showVirtualRemote={showVirtualRemote}
              setShowVirtualRemote={setShowVirtualRemote}
              registeredItems={viewRegisteredItems}
              setRegisteredItems={setViewRegisteredItems}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />
          )}
        </main>
      </div>

      {/* Embedded 10-foot Landscape UI Media player lightbox */}
      {videoPlayerOpen && activeVideo && (
        <div className="absolute inset-0 z-50 bg-[#0F0F0F] flex flex-col justify-between p-6 animate-fade-in animate-duration-200">
          
          {/* Close Panel Header */}
          <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-white/80 animate-pulse animate-duration-1000" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white font-display">{activeVideo.title}</span>
                <span className="text-[9px] text-[#A0A0A0] font-mono mt-0.5">{activeVideo.channel} &bull; Now streaming in Tizen Web Player</span>
              </div>
            </div>
            
            <button
              id="player-close-btn"
              onClick={closePlayer}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 outline-none flex items-center gap-2 border font-display ${
                currentFocusId === "player-close-btn"
                  ? "bg-white border-white text-black scale-102 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  : "bg-white/5 border-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>برگشت / Close Media</span>
            </button>
          </div>

          {/* IFrame embedding core YouTube feed */}
          <div className="flex-1 my-4 bg-black rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl shadow-black">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover border-none"
            />
          </div>

          <div className="flex justify-between text-[9px] text-white/40 font-mono px-3">
            <span>Tizen Standalone PWA Media Player Layer v1.0</span>
            <span>PRESS BACKSPACE KEY TO CLOSE MEDIA AND RETURN TO PORTAL</span>
          </div>
        </div>
      )}

      {/* Floating On-Screen Virtual Remote Control Overlay for quick PC testing */}
      {showVirtualRemote && (
        <div className="fixed bottom-6 right-6 z-40 bg-[#1A1A1A]/95 p-4 rounded-3xl border border-white/5 backdrop-blur-md flex flex-col gap-3 shadow-2xl shadow-black/80 select-none max-lg:hidden w-44">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 font-display">
              <Tv className="w-3.5 h-3.5 text-white" />
              <span>Tizen Remote</span>
            </div>
            <button
              onClick={() => setShowVirtualRemote(false)}
              className="text-[9px] text-white/40 hover:text-white/60 bg-black/65 py-0.5 px-1.5 rounded"
            >
              Hide
            </button>
          </div>

          {/* 5-Way Navigation Pad */}
          <div className="flex flex-col items-center py-2">
            
            {/* UP button */}
            <button
               onClick={() => moveFocus("UP")}
              className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80 pointer-events-auto"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* LEFT / OK / RIGHT row */}
            <div className="flex items-center gap-4 my-2">
              <button
                onClick={() => moveFocus("LEFT")}
                className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80 pointer-events-auto"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* OK / ENTER */}
              <button
                onClick={triggerEnter}
                className="w-12 h-12 rounded-full bg-white border border-white flex items-center justify-center text-black shadow-lg shadow-white/10 hover:bg-white/90 active:scale-95 pointer-events-auto text-xs font-bold font-display"
              >
                OK
              </button>

              <button
                onClick={() => moveFocus("RIGHT")}
                className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80 pointer-events-auto"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* DOWN button */}
            <button
              onClick={() => moveFocus("DOWN")}
              className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-95 text-white/80 pointer-events-auto"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Dedicated Back key simulated */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={triggerBack}
              className="py-2 rounded-xl bg-black border border-white/10 text-[10px] text-center font-bold text-white/80 hover:bg-white/5 transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="bg-black/30 border border-white/10 p-1.5 rounded-xl flex flex-col justify-center items-center text-[8px] text-white/40 text-center uppercase tracking-wider">
              <span>Keyboard</span>
              <span className="font-bold text-[9px] text-white/60">Arrows</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
