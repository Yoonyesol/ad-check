import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  HelpCircle,
  Hammer,
  MapPin,
  AlertTriangle,
  Shield,
  Megaphone,
  Info,
  Lightbulb,
} from "lucide-react";
import { useModalStore } from "../../store/useModalStore";
import { cn } from "../../lib/utils";
import CommonButton from "./CommonButton";

const GlobalModal = () => {
  const { isOpen, options, closeModal } = useModalStore();

  const handleConfirm = () => {
    options.onConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    options.onCancel?.();
    closeModal();
  };

  const renderTipIcon = (iconName?: string, className?: string) => {
    const cls = className || "w-8 h-8";
    switch (iconName) {
      case "Hammer":
        return <Hammer className={cls} />;
      case "MapPin":
        return <MapPin className={cls} />;
      case "AlertTriangle":
        return <AlertTriangle className={cls} />;
      case "Shield":
        return <Shield className={cls} />;
      case "Megaphone":
        return <Megaphone className={cls} />;
      case "Info":
        return <Info className={cls} />;
      default:
        return <Lightbulb className={cls} />;
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case "rose":
        return "bg-rose-50 text-rose-600 border-rose-100/60";
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-100/60";
      case "amber":
        return "bg-amber-50 text-amber-600 border-amber-100/60";
      case "emerald":
        return "bg-emerald-50 text-emerald-600 border-emerald-100/60";
      case "indigo":
        return "bg-indigo-50 text-indigo-600 border-indigo-100/60";
      case "slate":
        return "bg-slate-50 text-slate-600 border-slate-100/60";
      default:
        return "bg-blue-50 text-blue-600 border-blue-100/60";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm max-h-[85vh] bg-white rounded-none shadow-2xl overflow-hidden border border-slate-200"
          >
            {options.type === "tip" ? (
              /* Legal Tip Modal Style */
              <div className="flex flex-col max-h-[85vh]">
                <div className="p-8 pt-8 pb-6 flex flex-col items-center text-center space-y-6 flex-shrink-0">
                  <div
                    className={`p-4 rounded-none border-2 ${getColorClass(options.color)}`}
                  >
                    {renderTipIcon(options.icon, "w-10 h-10")}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                      Legal Research
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {options.title}
                    </h3>
                  </div>

                  <div className="w-full bg-slate-50 rounded-none p-4 text-left border border-slate-100">
                    <span className="block text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">
                      관련 법령
                    </span>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {options.lawClause}
                    </p>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="px-8 overflow-y-auto flex-1">
                  <p className="text-[15px] text-slate-600 font-bold leading-relaxed text-left whitespace-pre-line break-keep py-2">
                    {options.message}
                  </p>
                </div>

                {/* Fixed Button */}
                <div className="p-8 pt-6 flex-shrink-0">
                  <CommonButton
                    label={
                      options.isCompleted
                        ? "분석 완료! 결과 확인하기"
                        : options.confirmText || "이해했어요"
                    }
                    onClick={handleConfirm}
                    variant={options.isCompleted ? "blue" : "primary"}
                    align="center"
                    className="py-4 text-lg"
                  />
                </div>
              </div>
            ) : (
              /* Original Alert/Confirm Style */
              <>
                <div className="p-7 pt-9 flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "p-4 rounded-none mb-6 border shadow-sm",
                      getColorClass(
                        options.color ||
                          (options.type === "confirm" ? "blue" : "rose"),
                      ),
                    )}
                  >
                    {options.type === "confirm" ? (
                      <HelpCircle className="w-8 h-8" />
                    ) : (
                      <AlertCircle className="w-8 h-8" />
                    )}
                  </div>

                  {options.title && (
                    <h3 className="text-[22px] font-black text-slate-900 mb-3 tracking-tight leading-tight">
                      {options.title}
                    </h3>
                  )}

                  <p className="text-[16px] text-slate-500 font-bold leading-relaxed whitespace-pre-wrap px-2 break-keep">
                    {options.message}
                  </p>
                </div>

                <div className="p-6 pt-2 flex gap-3">
                  {options.type === "confirm" && (
                    <CommonButton
                      label={options.cancelText || "취소"}
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 py-4 text-slate-500"
                      fullWidth={false}
                      align="center"
                    />
                  )}
                  <CommonButton
                    label={options.confirmText || "확인"}
                    onClick={handleConfirm}
                    variant={
                      options.color === "rose"
                        ? "primary"
                        : options.color === "blue"
                          ? "blue"
                          : "primary"
                    }
                    className={cn(
                      "flex-1 py-4",
                      options.color === "rose" &&
                        "bg-rose-600 hover:bg-rose-700 shadow-rose-200/40",
                    )}
                    fullWidth={false}
                    align="center"
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalModal;
