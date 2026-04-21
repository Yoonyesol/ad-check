"use client"

import { useCheckmateStore, type Verdict } from "@/lib/store"
import { AlertTriangle, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function WarningPopup() {
  const { 
    isWarningVisible, 
    warningCount, 
    closeWarning, 
    openPanel, 
    overallVerdict,
    setActiveTab 
  } = useCheckmateStore()

  if (!isWarningVisible) return null

  const config = {
    safe: {
      color: "text-blue-500",
      bg: "bg-blue-50",
      icon: ShieldCheck,
      title: "검증된 신뢰 정보",
      desc: "Checkmate 분석 결과, 신뢰할 수 있는 사실로 확인되었습니다. 안심하고 시청하세요.",
      btnText: "상세 리포트 보기",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    warning: {
      color: "text-red-500",
      bg: "bg-red-50",
      icon: AlertTriangle,
      title: "허위/과장 정보 주의",
      desc: `이 영상에서 ${warningCount}건의 허위 의심 문장이 발견되었습니다. 시청에 유의하시기 바랍니다.`,
      btnText: "판단 근거 보기",
      btnClass: "bg-red-600 hover:bg-red-700 text-white"
    },
    unknown: {
      color: "text-amber-500",
      bg: "bg-amber-50",
      icon: HelpCircle,
      title: "판단 보류 안내",
      desc: "확보된 데이터만으로는 AI 판독이 어렵습니다. 커뮤니티 수배를 통해 유저들과 함께 검증해 보세요.",
      btnText: "커뮤니티 수배 게시판 이동",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-white"
    }
  }

  const { color, bg, icon: Icon, title, desc, btnText, btnClass } = config[overallVerdict]

  const handleAction = () => {
    closeWarning()
    if (overallVerdict === 'unknown') {
      setActiveTab('community')
    } else {
      setActiveTab('report')
    }
    openPanel()
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center font-pixel">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeWarning}
      />
      
      {/* Popup Content */}
      <div className={cn(
        "relative w-full max-w-sm mx-4 bg-white border-4 p-8 animate-in zoom-in-95 duration-300 shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
        overallVerdict === 'safe' ? "border-blue-600" : overallVerdict === 'warning' ? "border-red-600" : "border-amber-500"
      )}>
        <div className="flex flex-col items-center text-center">
          <div className={cn("mb-6 p-4 rounded-full", bg)}>
            <Icon className={cn("w-16 h-16", color)} strokeWidth={2.5} />
          </div>
          
          <h2 className={cn("text-2xl font-black mb-3", color)}>
            {title}
          </h2>
          
          <p className="text-zinc-600 text-sm leading-relaxed mb-8">
            {desc}
          </p>

          <button
            onClick={handleAction}
            className={cn(
              "w-full py-4 text-lg font-black flex items-center justify-center gap-3 transition-all active:translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none",
              btnClass
            )}
          >
            {btnText}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
