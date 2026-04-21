"use client"

import { useCheckmateStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, FileText, Users, Play } from "lucide-react"
import { PixelCharacter } from "./pixel-character"
import { ReportTab } from "./report-tab"
import { CommunityTab } from "./community-tab"
import { ResponseModal } from "./response-modal"

export function SidePanel() {
  const { 
    isPanelOpen, 
    closePanel, 
    activeTab, 
    setActiveTab,
    videoTitle,
    channelName,
    overallVerdict
  } = useCheckmateStore()

  if (!isPanelOpen) return null

  const characterMood = overallVerdict === 'warning' ? 'alert' : overallVerdict === 'safe' ? 'happy' : 'thinking'

  return (
    <>
      <div className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-full max-w-sm bg-background border-l-2 border-primary shadow-2xl z-[60] flex flex-col font-pixel">
        {/* Header */}
        <div className="p-3 border-b border-border bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PixelCharacter mood={characterMood} size="sm" />
            <span className="font-bold text-lg text-foreground">Checkmate</span>
          </div>
          <button
            onClick={closePanel}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors pixel-btn bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Info */}
        <div className="p-3 border-b border-border bg-muted/50 flex items-center gap-3">
          <div className="w-16 h-12 bg-muted pixel-border flex items-center justify-center shrink-0">
            <Play className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{videoTitle}</p>
            <p className="text-xs text-muted-foreground">{channelName}</p>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('report')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all",
              activeTab === 'report'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            📊 리포트
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all",
              activeTab === 'community'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="w-4 h-4" />
            🤝 커뮤니티
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'report' ? <ReportTab /> : <CommunityTab />}
        </div>
      </div>

      <ResponseModal />
    </>
  )
}
