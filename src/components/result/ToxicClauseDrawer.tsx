import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Quote,
  ShieldAlert,
  Lightbulb,
  FileText,
} from "lucide-react";
import { cn, formatAnalysisText, parseAnalysisSegments } from "../../lib/utils";
import type { AnalysisResultItem } from "../../types/api";

interface ToxicClauseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPage: number | null;
  selectedClauses: AnalysisResultItem[];
}

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  headerBg: string;
  borderColor: string;
  badge?: string;
}

const AccordionSection = memo(
  ({
    title,
    icon,
    isOpen,
    onToggle,
    children,
    headerBg,
    borderColor,
    badge,
  }: AccordionSectionProps) => {
    return (
      <div
        className={cn(
          "border relative bg-white rounded-sm shadow-sm overflow-hidden",
          borderColor,
        )}
      >
        <motion.button
          type="button"
          onClick={onToggle}
          whileTap={{ opacity: 0.96 }}
          className={cn(
            "w-full p-4 flex items-center justify-between text-left group relative z-10 select-none outline-none",
            headerBg,
          )}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-sm text-white group-hover:bg-white/20">
              {icon}
            </div>
            <span className="text-[15px] font-bold text-white uppercase tracking-tight block leading-tight">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {badge && (
              <div className="flex items-center gap-2 h-full">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[12px] font-bold text-white tracking-tight leading-none mb-[1px]">
                  {badge}
                </span>
              </div>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-white/70" />
            </motion.div>
          </div>
        </motion.button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-white"
        >
          <div className="p-6 border-t border-slate-100">{children}</div>
        </motion.div>
      </div>
    );
  },
);

AccordionSection.displayName = "AccordionSection";

const ToxicClauseDrawer = memo(
  ({
    isOpen,
    onClose,
    selectedPage,
    selectedClauses,
  }: ToxicClauseDrawerProps) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
      original: true,
      analysis: false,
      guide: false,
    });

    // Reset state during render when selectedPage changes
    const [prevPage, setPrevPage] = useState(selectedPage);
    if (selectedPage !== prevPage) {
      setPrevPage(selectedPage);
      setActiveTabIndex(0);
      setOpenSections({
        original: true,
        analysis: false,
        guide: false,
      });
    }

    // Handle section toggle
    const toggleSection = (section: string) => {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Handle all sections toggle
    const toggleAllSections = (open: boolean) => {
      setOpenSections({
        original: open,
        analysis: open,
        guide: open,
      });
    };

    // Handle tab change (위험 1, 위험 2...)
    const handleTabChange = (index: number) => {
      setActiveTabIndex(index);
      setOpenSections({
        original: true,
        analysis: false,
        guide: false,
      });
    };

    const activeClause = selectedClauses[activeTabIndex];

    const renderAnalysisContent = (text: string) => {
      if (!text) return null;
      return formatAnalysisText(text)
        .split("\n")
        .map((line, i) => {
          const segments = parseAnalysisSegments(line);
          return (
            <div key={i} className="min-h-[1.5em] whitespace-pre-wrap">
              {segments.map((seg: any, j: number) => {
                if (seg.type === "quote") {
                  return (
                    <span
                      key={j}
                      className="text-rose-600 underline font-semibold"
                    >
                      {seg.content}
                    </span>
                  );
                }
                if (seg.type === "law") {
                  return (
                    <span
                      key={j}
                      className="bg-[#fff3b0] text-[#1a305a] px-1 rounded-sm font-semibold mx-0.5"
                    >
                      {seg.content}
                    </span>
                  );
                }
                return seg.content;
              })}
            </div>
          );
        });
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-[92%] max-w-md bg-white shadow-[20px_0_60px_rgba(0,0,0,0.1)] z-[110] flex flex-col overflow-hidden"
            >
              {/* Header Area - Strictly non-moving */}
              <div className="flex-none bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-[#203b6d] tracking-tight">
                    {selectedPage}페이지 독소조항
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      총{" "}
                      <span className="text-rose-600 font-bold">
                        {selectedClauses.length}건
                      </span>
                      의 위험 요소
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-50 transition-colors border border-slate-100 rounded-sm"
                >
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Tabs Area */}
              {selectedClauses.length > 1 && (
                <div className="flex-none bg-slate-50 border-b border-slate-100 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex px-4 min-w-max gap-2 py-3">
                    {selectedClauses.map((clause, index) => (
                      <button
                        key={clause.cid}
                        onClick={() => handleTabChange(index)}
                        className={cn(
                          "px-6 py-2.5 text-[13px] font-bold transition-colors border rounded-sm",
                          activeTabIndex === index
                            ? "bg-[#203b6d] border-[#203b6d] text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300",
                        )}
                      >
                        위험 {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Area - Only this part scrolls and animates internally */}
              <div className="flex-1 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="p-6 pb-24 pt-4">
                  {!activeClause ? (
                    <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-sm">
                      <p className="text-[14px] text-slate-400 font-bold">
                        이 페이지에는 독소조항이 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div key={activeClause.cid} className="space-y-4">
                      {/* Control Bar */}
                      <div className="flex items-center justify-end gap-3 mb-2 px-2">
                        <button
                          onClick={() => toggleAllSections(true)}
                          className="text-[11px] font-bold text-slate-400 hover:text-[#203b6d] hover:underline transition-colors"
                        >
                          분석 내용 모두 열기
                        </button>
                        <div className="w-[1px] h-2 bg-slate-200" />
                        <button
                          onClick={() => toggleAllSections(false)}
                          className="text-[11px] font-bold text-slate-400 hover:text-[#203b6d] hover:underline transition-colors"
                        >
                          분석 내용 모두 닫기
                        </button>
                      </div>

                      {/* Section 1: Original Clause */}
                      <AccordionSection
                        title="원문 조항"
                        icon={<FileText className="w-5 h-5" />}
                        isOpen={openSections.original}
                        onToggle={() => toggleSection("original")}
                        headerBg="bg-slate-800"
                        borderColor="border-slate-200"
                      >
                        <div className="text-[14px] font-bold text-slate-900 leading-[1.6] tracking-tight">
                          {renderAnalysisContent(activeClause.text)}
                        </div>
                      </AccordionSection>

                      {/* Section 2: AI Analysis */}
                      <AccordionSection
                        title="AI 위험 분석"
                        icon={<ShieldAlert className="w-5 h-5" />}
                        isOpen={openSections.analysis}
                        onToggle={() => toggleSection("analysis")}
                        headerBg="bg-[#b71c1c]"
                        borderColor="border-red-100"
                        badge={activeClause.tagName}
                      >
                        <div className="text-[14px] text-slate-700 font-medium leading-[1.6] tracking-tight">
                          {renderAnalysisContent(activeClause.aiAnalysis)}
                        </div>
                      </AccordionSection>

                      {/* Section 3: Negotiation Guide */}
                      <AccordionSection
                        title="추천 협상 가이드"
                        icon={<Lightbulb className="w-5 h-5" />}
                        isOpen={openSections.guide}
                        onToggle={() => toggleSection("guide")}
                        headerBg="bg-[#1a305a]"
                        borderColor="border-blue-100"
                      >
                        <div className="relative pt-1">
                          <Quote className="absolute -top-3 -left-2 w-7 h-7 text-slate-100 rotate-180" />
                          <div className="text-[14px] text-[#203b6d] font-bold leading-[1.6] relative z-10 px-4 pt-3 pb-1">
                            {renderAnalysisContent(
                              activeClause.negotiationScript,
                            )}
                          </div>
                          <Quote className="absolute -bottom-5 -right-2 w-7 h-7 text-slate-100" />
                        </div>
                      </AccordionSection>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

ToxicClauseDrawer.displayName = "ToxicClauseDrawer";

export default ToxicClauseDrawer;
