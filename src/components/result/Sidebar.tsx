import React from "react";
import { ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import type {
  ContractReportResponse,
  AnalysisResultItem,
} from "../../types/api";

interface SidebarProps {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  pdfNumPages: number;
  currentPage: number;
  analysisResult?: ContractReportResponse | null;
  onPageClick: (pageNum: number) => void;
}

const Sidebar = ({
  sidebarRef,
  pdfNumPages,
  currentPage,
  analysisResult,
  onPageClick,
}: SidebarProps) => {
  return (
    <div className="w-20 bg-slate-50 border-r border-slate-200 flex flex-col flex-none shadow-[inset_-4px_0_20px_rgba(0,0,0,0.02)] relative z-10 transition-all duration-300">
      {/* Sidebar Header */}
      <div className="flex flex-col items-center justify-center py-4 border-b border-slate-200/60">
        <span className="text-[10px] font-black text-[#203b6d] tracking-[0.1em] opacity-80">
          페이지 목록
        </span>
      </div>

      {/* Scroll Up Indicator */}
      <div className="h-8 flex items-center justify-center text-slate-300 pointer-events-none">
        <ChevronUp className="w-5 h-5 opacity-50" />
      </div>

      {/* Scrollable Area */}
      <div
        ref={sidebarRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-3"
      >
        <div className="space-y-4 py-4">
          {Array.from({ length: pdfNumPages }, (_, i) => i + 1).map(
            (pageNum) => {
              const hasClause = (analysisResult?.results || []).some(
                (r: AnalysisResultItem) =>
                  r.pageNumber === pageNum &&
                  r.tag !== "normal" &&
                  r.pageNumber > 0,
              );
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageClick(pageNum)}
                  data-active={isActive}
                  className={cn(
                    "w-full aspect-[3/4] flex flex-col items-center justify-center rounded-lg transition-all duration-300 relative group",
                    "bg-white border shadow-sm",
                    isActive
                      ? "border-[#203b6d] ring-2 ring-[#203b6d]/10 scale-105 z-10 shadow-md"
                      : hasClause
                        ? "border-rose-300 bg-rose-50/30 hover:border-rose-400"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md",
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "text-xl font-black leading-none",
                        isActive
                          ? "text-[#203b6d]"
                          : hasClause
                            ? "text-rose-600"
                            : "text-slate-400",
                      )}
                    >
                      {pageNum}
                    </span>
                  </div>

                  {/* Toxicity Indicator Badge */}
                  {hasClause && (
                    <div
                      className={cn(
                        "absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white z-20",
                        "bg-gradient-to-br from-rose-500 to-rose-600 shadow-[0_2px_8px_rgba(244,63,94,0.4)] border border-white/50",
                        "transition-all duration-300",
                        isActive ? "scale-100" : "group-hover:scale-110",
                      )}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Side Highlight Bar for Active */}
                  {isActive && (
                    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#203b6d] rounded-r-full shadow-[2px_0_8px_rgba(32,59,109,0.3)]" />
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="h-8 flex items-center justify-center text-slate-300 border-t border-slate-100/50">
        <ChevronDown className="w-5 h-5 opacity-50" />
      </div>
    </div>
  );
};

export default Sidebar;
