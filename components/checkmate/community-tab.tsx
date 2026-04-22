"use client"

import { useState } from "react"
import { useCheckmateStore, type WantedCard as WantedCardType } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ThumbsUp, ThumbsDown, ExternalLink, Plus, Send, Award, AlertTriangle } from "lucide-react"

function VoteBar({ votesTrue, votesFake }: { votesTrue: number; votesFake: number }) {
  const total = votesTrue + votesFake
  const fakePercent = total > 0 ? (votesFake / total) * 100 : 50

  return (
    <div className="w-full h-3 bg-muted flex overflow-hidden pixel-border">
      <div 
        className="h-full bg-success transition-all duration-300" 
        style={{ width: `${100 - fakePercent}%` }} 
      />
      <div 
        className="h-full bg-destructive transition-all duration-300" 
        style={{ width: `${fakePercent}%` }} 
      />
    </div>
  )
}

function WantedCard({ card }: { card: WantedCardType }) {
  const { voteOnCard } = useCheckmateStore()
  const hasVoted = !!card.userVote

  return (
    <div className="p-3 border border-border bg-card pixel-border">
      <div className="flex gap-3 mb-3">
        {/* Thumbnail placeholder */}
        <div className="w-16 h-16 bg-muted flex items-center justify-center text-2xl pixel-border shrink-0">
          🎬
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate mb-1">
            {card.claim}
          </p>
          <p className="text-xs text-muted-foreground">
            제보: {`"${card.reporterComment}"`}
          </p>
        </div>
      </div>

      {/* Vote Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span className="text-success">👍 {card.votesTrue}</span>
          <span className="text-destructive">👎 {card.votesFake}</span>
        </div>
        <VoteBar votesTrue={card.votesTrue} votesFake={card.votesFake} />
      </div>

      {/* Vote Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => !hasVoted && voteOnCard(card.id, 'true')}
          disabled={hasVoted}
          className={cn(
            "flex-1 py-2 px-3 text-xs font-bold pixel-btn flex items-center justify-center gap-1 transition-all cursor-pointer disabled:cursor-default",
            hasVoted && card.userVote === 'true'
              ? "bg-success text-success-foreground"
              : hasVoted
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-success/20 text-success hover:bg-success/30 border border-success/30"
          )}
        >
          <ThumbsUp className="w-3 h-3" />
          참이다
        </button>
        <button
          onClick={() => !hasVoted && voteOnCard(card.id, 'fake')}
          disabled={hasVoted}
          className={cn(
            "flex-1 py-2 px-3 text-xs font-bold pixel-btn flex items-center justify-center gap-1 transition-all cursor-pointer disabled:cursor-default",
            hasVoted && card.userVote === 'fake'
              ? "bg-destructive text-destructive-foreground"
              : hasVoted
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
          )}
        >
          <ThumbsDown className="w-3 h-3" />
          거짓이다
        </button>
      </div>

      {/* Evidence Link */}
      <button className="w-full mt-2 py-1.5 px-3 text-xs text-primary bg-primary/10 border border-primary/20 pixel-btn flex items-center justify-center gap-1 hover:bg-primary/20 transition-all cursor-pointer">
        <ExternalLink className="w-3 h-3" />
        반박 근거 제출
      </button>
    </div>
  )
}

function ChatRoom() {
  const { chatMessages, addChatMessage } = useCheckmateStore()
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim()) {
      addChatMessage({
        username: "나",
        message: newMessage.trim()
      })
      setNewMessage("")
    }
  }

  const getBadgeStyle = (badge?: 'verifier' | 'reporter') => {
    if (badge === 'verifier') return 'bg-primary text-primary-foreground'
    if (badge === 'reporter') return 'bg-warning text-warning-foreground'
    return ''
  }

  return (
    <div className="border border-border bg-card pixel-border">
      <div className="p-2 border-b border-border bg-primary/10">
        <h4 className="text-sm font-bold flex items-center gap-2">
          💬 리뷰 채팅방 
          <span className="text-xs text-muted-foreground">({chatMessages.length}명 온라인)</span>
        </h4>
      </div>
      
      <div className="h-48 overflow-y-auto p-2 space-y-2">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <span className="font-bold text-foreground">
              {msg.badge && (
                <span className={cn("inline-block px-1 py-0.5 mr-1 text-[10px]", getBadgeStyle(msg.badge))}>
                  {msg.badge === 'verifier' ? <Award className="w-2 h-2 inline" /> : <AlertTriangle className="w-2 h-2 inline" />}
                </span>
              )}
              {msg.username}:
            </span>{" "}
            <span className="text-muted-foreground">{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="의견을 입력하세요..."
          className="flex-1 px-2 py-1 text-xs bg-input border border-border pixel-border focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="px-3 py-1 bg-primary text-primary-foreground pixel-btn cursor-pointer"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export function CommunityTab() {
  const { wantedCards } = useCheckmateStore()

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Voting Section */}
      <div>
        <h4 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
          🧐 판단 보류/수배 중
        </h4>
        <div className="space-y-3">
          {wantedCards.map((card) => (
            <WantedCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* Chat Room */}
      <ChatRoom />

      {/* Report Button */}
      <button className="w-full py-3 px-4 bg-warning text-warning-foreground font-bold pixel-btn flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
        <Plus className="w-5 h-5" />
        나도 허위 영상 제보하기
      </button>
    </div>
  )
}
