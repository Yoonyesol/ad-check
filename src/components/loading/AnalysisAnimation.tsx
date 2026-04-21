import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Search,
  BrainCircuit,
  PenTool,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface AnalysisAnimationProps {
  currentStepIndex: number;
  isCompleted: boolean;
}

export const AnalysisAnimation = ({
  currentStepIndex,
  isCompleted,
}: AnalysisAnimationProps) => {
  const renderStepIcon = () => {
    switch (currentStepIndex) {
      case 0: // 문서 구조 파악 (Scan + Scanning Line Effect)
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 flex flex-col items-center justify-center"
          >
            <div className="relative">
              <Scan
                className="w-20 h-20 text-blue-600 drop-shadow-2xl"
                strokeWidth={2}
              />
              <motion.div
                animate={{
                  top: ["10%", "90%", "10%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] z-30"
              />
            </div>
          </motion.div>
        );
      case 1: // 위험 조항 스캔 (Search)
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [-15, 15, -10, 10, 0],
              y: [-10, 10, 10, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.3 },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute z-20"
          >
            <Search
              className="w-20 h-20 text-purple-600 drop-shadow-2xl"
              strokeWidth={2}
            />
          </motion.div>
        );
      case 2: // 법률 AI 분석
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 flex items-center justify-center"
          >
            <div className="relative">
              <BrainCircuit
                className="w-20 h-20 text-indigo-600 drop-shadow-2xl"
                strokeWidth={2}
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-indigo-400"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-dashed border-indigo-300/30 rounded-full"
              />
            </div>
          </motion.div>
        );
      case 3: // 보고서 작성 중
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-20 flex items-center justify-center"
          >
            <div className="relative">
              <PenTool
                className="w-20 h-20 text-emerald-600 drop-shadow-2xl"
                strokeWidth={2}
              />
              <motion.div
                animate={{
                  rotate: [-5, 5, -5],
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow-md"
              >
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute z-20"
          >
            <div className="relative">
              <FileText
                className="w-20 h-20 text-slate-600 drop-shadow-2xl"
                strokeWidth={2}
              />
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2 bg-blue-500 w-4 h-4 rounded-full shadow-lg"
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="analyzing-container"
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-30 scale-110">
              <div className="w-32 h-32 bg-white rounded-3xl border border-blue-100 shadow-inner flex items-center justify-center">
                <div className="w-20 h-2 bg-slate-100 rounded mb-20 ml-2" />
              </div>
            </div>
            {renderStepIcon()}
          </motion.div>
        ) : (
          <motion.div
            key="completed-icon"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-30 flex items-center justify-center bg-white p-4 rounded-full shadow-2xl shadow-green-200"
          >
            <CheckCircle2
              className="w-24 h-24 text-green-500 fill-green-50"
              strokeWidth={1.5}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
