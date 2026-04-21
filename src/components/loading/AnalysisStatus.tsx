import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import CommonButton from "../common/CommonButton";
import {
  LOADING_STEPS,
  ANALYSIS_CHECKLIST,
  SECONDARY_MESSAGES,
} from "../../constants/analysis";

interface AnalysisStatusProps {
  currentStepIndex: number;
  currentLoopIndex: number;
  isChecked: boolean;
  isCompleted: boolean;
  riskCount?: number;
  onViewResults?: () => void;
  isDebug?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

const GradualCheck = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
  </motion.div>
);

const ShimmerText = ({ text }: { text: string }) => (
  <div className="relative overflow-hidden group">
    <p className="text-xs font-bold relative z-10 text-slate-400 bg-clip-text">
      {text}
    </p>
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        repeat: Infinity,
        duration: 2.5,
        ease: "linear",
      }}
      className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
    />
  </div>
);

export const AnalysisStatus = ({
  currentStepIndex,
  currentLoopIndex,
  isChecked,
  isCompleted,
  riskCount = 0,
  onViewResults,
  isDebug,
  onPrev,
  onNext,
}: AnalysisStatusProps) => {
  return (
    <div className="flex flex-col items-center w-full space-y-1">
      <div className="text-center w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
              {/* Icon Section - Consolidated for perfect centering */}
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative z-30 flex items-center justify-center bg-white p-5 rounded-full shadow-2xl shadow-green-200"
                >
                  <CheckCircle2
                    className="w-24 h-24 text-green-500 fill-green-50"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>

              {/* Content Section (Total Center) */}
              <div className="flex flex-col items-center gap-6 mb-8 w-full">
                {/* Title with blue accent */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-[32px] font-black text-slate-900 tracking-tight leading-tight"
                >
                  계약서 <span className="text-[#2563eb]">분석 완료</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-bold text-gray-400 mt-1"
                >
                  주의가 필요한 항목
                </motion.p>

                {/* Large risk count */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="flex items-baseline space-x-1 -mt-4"
                >
                  <span className="text-[72px] font-black text-[#ef4444] leading-none">
                    {riskCount}
                  </span>
                  <span className="text-[32px] font-bold text-slate-400 leading-none">
                    개
                  </span>
                </motion.div>

                {/* Detailed explanation */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-slate-600 text-center leading-relaxed mt-4"
                >
                  전문 법률 AI가 계약서 내에서
                  <br />
                  집중적으로{" "}
                  <span className="font-bold text-[#ef4444]">
                    잠재적 위험이
                  </span>{" "}
                  될 수 있는{" "}
                  <span className="font-bold text-[#ef4444]">
                    {riskCount}개 항목
                  </span>
                  을
                  <br />
                  정밀하게 탐지하였습니다.
                </motion.p>
              </div>

              {/* Bottom Button Section */}
              <div className="w-full pb-2 flex justify-center mt-5">
                <CommonButton
                  label="상세 분석 결과 확인하기"
                  onClick={onViewResults}
                  variant="blue"
                  className="max-w-md w-full"
                  align="center"
                />
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 flex flex-col items-center w-full">
              {/* Step Title Area */}
              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-[28px] font-black text-[#203b6d] tracking-tight leading-tight"
                  >
                    {LOADING_STEPS[currentStepIndex]}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Status & Checklist Area (Animated as a block) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center space-y-3 w-full"
                >
                  {/* Secondary Status Message (Subtitle with Shimmer) */}
                  <div className="h-4 flex items-center justify-center">
                    <ShimmerText text={SECONDARY_MESSAGES[currentStepIndex]} />
                  </div>

                  {/* Checklist (Only for Step 3: Index 2) */}
                  <div className="h-10 flex items-center justify-center overflow-visible">
                    <AnimatePresence>
                      {currentStepIndex === 2 && (
                        <motion.div
                          key="checklist-root"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            delay: 0.1,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                              key={currentLoopIndex}
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -5, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center space-x-2 bg-slate-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-100 shadow-sm"
                            >
                              <div className="relative w-4 h-4 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                  {isChecked ? (
                                    <GradualCheck />
                                  ) : (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                      }}
                                    >
                                      <Loader2 className="w-3.5 h-3.5 text-slate-400" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <span className="text-xs font-black text-slate-600 whitespace-nowrap">
                                {ANALYSIS_CHECKLIST[currentLoopIndex]}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Debug Controls */}
      {isDebug && !isCompleted && (
        <div className="flex items-center space-x-6 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-600 rounded-full text-sm font-black transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREV</span>
          </button>
          <div className="flex space-x-1.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentStepIndex === idx
                    ? "bg-blue-600 scale-125"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            disabled={currentStepIndex === 4}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-full text-sm font-black transition-all shadow-md shadow-blue-100 active:scale-95"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
