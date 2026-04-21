"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Home,
  Menu,
  Search,
  Mic,
  Plus,
  Bell,
  Clapperboard,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Play,
  PlaySquare,
  Music2,
  Flame,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { useCheckmateStore } from "@/lib/store";
import { PixelOfficer, PixelCharacter } from "./pixel-character";
import { cn } from "@/lib/utils";
import { SidePanel } from "./side-panel";
import { ResponseModal } from "./response-modal";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_VIDEOS = [
  {
    id: "1",
    channel: "@mbcsports01",
    title: "시구하러 왔다가 잠실 뒤집은 김고은? 이수지!! 최근 가장 핫한 시구 현장 분석 ⚾️",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7uS6O9r9FfG1aYl0D4FjV6Q2Z0kM3z.png",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sports",
    likes: "13만",
    comments: "5,123",
    audio: "오리지널 사운드 - mbcsports01"
  },
  {
    id: "2",
    channel: "@health_tips",
    title: "이 약만 먹으면 일주일 만에 10kg 감량? 과장 광고의 진실을 파헤쳐 드립니다!",
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=health",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=health",
    likes: "8.2천",
    comments: "1,104",
    audio: "건강정보 - health_tips"
  },
  {
    id: "3",
    channel: "@news_flash",
    title: "충격! 내일부터 모든 세금이 0원? 가짜 뉴스의 온상지를 직접 찾아가봤습니다.",
    thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=news",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=news",
    likes: "452",
    comments: "89",
    audio: "속보 사운드 - news_flash"
  }
];

const HOME_GRID_VIDEOS = [
  { id: 'h1', title: '환콜이 10만 기념 Q&A | 악귀 들리고 바지 벗기고 문여는 교양없는 걔네 맞아요', channel: '간절력 개념냥이 ganher cat', views: '25만회', time: '1년 전', thumbnail: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7uS6O9r9FfG1aYl0D4FjV6Q2Z0kM3z.png', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cat' },
  { id: 'h2', title: '평범한 스펙으로 중소기업에서 대기업 가는 법, 이 3가지...', channel: '옆자리사수', views: '8.6천회', time: '6개월 전', thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=work', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=office' },
  { id: 'h3', title: '점점 평화를 찾아가고 있습니다♥', channel: '나렝아치 NaRengAchi', views: '3.8만회', time: '5시간 전', thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=peace', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dog' },
  { id: 'h4', title: '신형탁♥사야 일본에서 욕 먹는중?', channel: '엠빅뉴스', views: '120만회', time: '2일 전', thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=japan', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=news' },
];

const CATEGORIES = ["전체", "음악", "게임", "뉴스", "믹스", "반려동물", "요리", "최근에 업로드된 동영상"];

function AnalysisDashboard({ className, onClose }: { className?: string; onClose?: () => void }) {
  const { startAnalysis, analysisStatus, overallVerdict, openPanel } = useCheckmateStore();
  const statusMsg = useMemo(() => {
    switch (analysisStatus) {
      case "detecting": return "영상 감지 중...";
      case "analyzing_transcript": return "자막 분석 중...";
      case "analyzing_claims": return "주장 추출 중...";
      case "verifying": return "신뢰도 검증 중...";
      case "complete": return "수사 완료";
      default: return "";
    }
  }, [analysisStatus]);

  return (
    <div className={cn("bg-white p-5 rounded-[24px] border border-zinc-200 shadow-xl flex flex-col items-center gap-5 relative", className)}>
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}
      <button onClick={() => { openPanel(); onClose?.(); }} className="relative transition-all hover:scale-105 active:scale-95">
        <PixelCharacter size="lg" />
        {analysisStatus !== "idle" && (
          <div className="absolute -bottom-1 -right-1">
            <PixelOfficer size="sm" mood={analysisStatus === 'complete' ? (overallVerdict === 'warning' ? 'alert' : 'happy') : 'thinking'} />
          </div>
        )}
      </button>
      <div className="w-full flex flex-col gap-3">
        <button onClick={() => startAnalysis()} disabled={analysisStatus !== 'idle'} className={cn("w-full py-3.5 rounded-2xl text-[13px] font-bold transition-all", analysisStatus === 'idle' ? "bg-black text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-500")}>
          {analysisStatus === 'idle' ? "스캔하기" : analysisStatus === 'complete' ? "분석 완료" : "팩트체크 진행 중..."}
        </button>
        {analysisStatus !== 'idle' && (
          <div className="flex flex-col gap-2 px-1">
             <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600">
               {analysisStatus === 'complete' ? <CheckCircle2 className="w-3 h-3 text-blue-500" /> : <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
               <span>{statusMsg}</span>
             </div>
             <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: analysisStatus === 'complete' ? "100%" : "60%" }} className="h-full bg-blue-500" />
             </div>
          </div>
        )}
        {analysisStatus === 'complete' && <button onClick={() => { openPanel(); onClose?.(); }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-2xl text-[12px] font-bold">리포트 확인</button>}
      </div>
    </div>
  );
}

export function MockYoutube() {
  const { setCurrentVideo, openPanel, closePanel, analysisStatus, overallVerdict } = useCheckmateStore();
  const [isSidebarWide, setIsSidebarWide] = useState(true);
  const [view, setView] = useState<'home' | 'shorts' | 'watch'>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    // 다른 영상/화면 이동 시 열려있던 서랍(패널) 및 모달 닫기
    closePanel();
    setIsMobileModalOpen(false);
    
    if (view === 'shorts') {
      const v = MOCK_VIDEOS[currentIndex];
      if (v) setCurrentVideo(v.id, v.title, v.channel);
    } else if (view === 'watch' && selectedVideo) {
      setCurrentVideo(selectedVideo.id, selectedVideo.title, selectedVideo.channel);
    }
  }, [currentIndex, view, selectedVideo, setCurrentVideo, closePanel]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (view !== 'shorts') return;
    if (e.deltaY > 50 && currentIndex < MOCK_VIDEOS.length - 1) setCurrentIndex(prev => prev + 1);
    else if (e.deltaY < -50 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex, view]);

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden relative">
      
      <header className="h-14 bg-white flex items-center justify-between px-4 border-b sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarWide(!isSidebarWide)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><Menu className="w-6 h-6" /></button>
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
             <ShieldCheck className="text-red-600 w-7 h-7 mr-1" />
             <span className="font-bold text-xl tracking-tighter">CheckTube v2</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-[600px] bg-zinc-50 border rounded-full px-4 py-1.5 focus-within:bg-white focus-within:shadow-inner transition-all">
          <input className="flex-1 bg-transparent outline-none" placeholder="검색" />
          <Search className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-bold hover:bg-zinc-50"><Plus className="w-4 h-4" />만들기</button>
          <Bell className="w-6 h-6 text-zinc-700" />
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">D</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        <aside className={cn("bg-white border-r h-full overflow-y-auto transition-all duration-300", view === 'watch' ? "w-0 -translate-x-full" : isSidebarWide ? "w-60 px-3" : "w-[72px]")}>
          <div className="py-2 space-y-1">
            <SidebarButton icon={Home} label="홈" active={view === 'home'} isWide={isSidebarWide} onClick={() => setView('home')} />
            <SidebarButton icon={PlaySquare} label="Shorts" active={view === 'shorts'} isWide={isSidebarWide} onClick={() => setView('shorts')} />
          </div>
        </aside>

        <main className={cn("flex-1 overflow-y-auto bg-white transition-all", view === 'watch' ? "ml-0" : "")}>
          {view === 'home' && (
            <div className="p-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
                {CATEGORIES.map(cat => <button key={cat} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap", cat === '전체' ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200")}>{cat}</button>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {HOME_GRID_VIDEOS.map(v => (
                  <div key={v.id} className="cursor-pointer group" onClick={() => { setSelectedVideo(v); setView('watch'); }}>
                    <div className="aspect-video bg-zinc-100 rounded-xl overflow-hidden mb-3 relative"><img src={v.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" /></div>
                    <div className="flex gap-3"><img src={v.avatar} className="w-9 h-9 rounded-full shrink-0" alt="" /><div><h3 className="text-sm font-bold line-clamp-2 leading-relaxed">{v.title}</h3><p className="text-xs text-zinc-600 mt-1">{v.channel}</p></div></div>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6 font-bold text-xl"><Flame className="text-red-500" />Shorts</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
                  {MOCK_VIDEOS.map(v => (
                    <div key={v.id} className="cursor-pointer" onClick={() => { setView('shorts'); setCurrentIndex(MOCK_VIDEOS.indexOf(v)); }}>
                      <div className="aspect-[9/16] bg-zinc-100 rounded-xl overflow-hidden mb-2"><img src={v.thumbnail} className="w-full h-full object-cover" alt="" /></div>
                      <p className="text-sm font-bold line-clamp-2 leading-tight">{v.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'shorts' && (
            <div onWheel={handleWheel} className="h-full overflow-hidden bg-white relative">
               <div className="h-full transition-transform duration-500 ease-out flex flex-col items-center" style={{ transform: `translateY(-${currentIndex * 100}%)` }}>
                  {MOCK_VIDEOS.map(v => (
                    <section key={v.id} className="h-full w-full flex items-center justify-center shrink-0">
                       <div className="flex items-end gap-3 px-4">
                          <div className="relative w-[340px] h-[580px] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                             <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                             <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                               <div className="flex items-center gap-2 mb-1">
                                 <img src={v.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="" />
                                 <span className="font-bold text-sm">{v.channel}</span>
                                 <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold ml-1">구독</button>
                               </div>
                               <h3 className="text-sm font-medium line-clamp-2 leading-snug">{v.title}</h3>
                               <div className="flex items-center gap-1.5 text-xs text-zinc-200"><Music2 className="w-3 h-3" />{v.audio}</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-4 pb-4">
                             <div className="lg:hidden">
                                <ShortsAction icon={ShieldCheck} label="팩트체크" onClick={() => setIsMobileModalOpen(true)} />
                             </div>
                             <ShortsAction icon={ThumbsUp} label={v.likes} />
                             <ShortsAction icon={ThumbsDown} label="싫어요" />
                             <ShortsAction icon={MessageSquare} label={v.comments} />
                             <ShortsAction icon={Share2} label="공유" />
                          </div>
                       </div>
                    </section>
                  ))}
               </div>
               <div className="fixed top-24 right-10 z-50 hidden lg:block"><AnalysisDashboard className="w-60" /></div>
            </div>
          )}

          {view === 'watch' && (
            <div className="p-6 flex flex-col lg:flex-row gap-6 max-w-[1500px] mx-auto">
               <div className="flex-1 space-y-4">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg"><img src={selectedVideo?.thumbnail} className="w-full h-full object-cover opacity-80" alt="" /><div className="absolute inset-0 flex items-center justify-center"><Play className="w-16 h-16 text-white fill-current drop-shadow-md" /></div></div>
                  <h1 className="text-xl font-bold">{selectedVideo?.title}</h1>
                  <div className="flex items-center justify-between border-b pb-4"><div className="flex items-center gap-3"><img src={selectedVideo?.avatar} className="w-10 h-10 rounded-full" alt="" /><div><p className="font-bold text-sm">{selectedVideo?.channel}</p><p className="text-xs text-zinc-500">구독자 25만명</p></div><button className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold ml-2">구독</button></div></div>
                  <div className="bg-zinc-100 p-4 rounded-xl text-sm leading-relaxed"><p className="font-bold mb-1">조회수 100만회 • 1년 전</p><p>Checkmate로 가짜뉴스를 판별해 보세요.</p></div>
               </div>
               <div className="w-full lg:w-[360px] flex flex-col gap-4">
                  <AnalysisDashboard />
                  <div className="space-y-3">
                    {HOME_GRID_VIDEOS.map(v => (
                      <div key={v.id} className="flex gap-2 cursor-pointer group" onClick={() => setSelectedVideo(v)}>
                        <div className="w-40 aspect-video bg-zinc-100 rounded-lg overflow-hidden shrink-0"><img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" /></div>
                        <div><h4 className="text-xs font-bold line-clamp-2 leading-tight">{v.title}</h4><p className="text-[10px] text-zinc-500 mt-1">{v.channel}</p></div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      <SidePanel /><ResponseModal />
      <AnimatePresence>
        {isMobileModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileModalOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
               <AnalysisDashboard className="w-[85vw] max-w-[320px]" onClose={() => setIsMobileModalOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarButton({ icon: Icon, label, active, isWide, onClick }: { icon: any; label: string; active: boolean; isWide: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex transition-colors items-center", isWide ? "flex-row gap-6 px-3 py-2.5 rounded-xl text-sm" : "flex-col gap-1 py-4 text-[10px]", active ? "bg-zinc-100 font-bold text-black" : "text-zinc-600 hover:bg-zinc-100")}>
      <Icon className={cn("w-6 h-6", active ? "text-black fill-black/10" : "text-zinc-700")} />
      <span>{label}</span>
    </button>
  );
}

function ShortsAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center text-zinc-800 transition-colors"><Icon className="w-6 h-6" /></div>
      <span className="text-zinc-700 text-xs font-bold group-hover:text-black">{label}</span>
    </div>
  );
}
