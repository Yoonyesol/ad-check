import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) => {
  return (
    <div className="sticky top-0 w-full px-6 pt-3 pb-6 bg-white/30 backdrop-blur-md z-[100] select-none transition-all duration-300">
      <div className="relative flex items-center justify-between">
        {/* Background Grey Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 rounded-full z-0" />

        {/* Blue Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-600 rounded-full z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: "100%" }}
        />

        {/* Steps */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isUpcoming = stepNum > currentStep;

          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center justify-center group cursor-default"
            >
              {/* Indicator Container - Fixed height for alignment */}
              <div className="h-4 flex items-center justify-center relative">
                {/* Subtle Glimmer Halo for Active Step */}
                {isActive && (
                  <motion.div
                    className="absolute bg-blue-600/20 rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ width: "16px", height: "16px" }}
                  />
                )}

                <motion.div
                  initial={false}
                  animate={{
                    scale: 1,
                    backgroundColor:
                      isActive || isCompleted ? "#2563eb" : "#ffffff",
                    borderColor:
                      isActive || isCompleted ? "#2563eb" : "#e2e8f0",
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                    // Active & Completed: Size
                    (isActive || isCompleted) && "w-3 h-3 border-[2px]",
                    // Upcoming: Empty Circle
                    isUpcoming &&
                      "w-3.5 h-3.5 bg-white border-[2px] border-slate-200",
                  )}
                >
                  {/* Check Icon for Completed */}
                  {isCompleted && (
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={5} />
                  )}
                </motion.div>
              </div>

              {/* Label */}
              {labels && labels[index] && (
                <span
                  className={cn(
                    "absolute top-6 text-[9px] whitespace-nowrap transition-all duration-300",
                    isActive
                      ? "font-bold text-blue-600 translate-y-0 opacity-100"
                      : "font-medium text-slate-400 translate-y-0",
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
