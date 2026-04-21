import { motion, AnimatePresence } from "framer-motion";
import {
  Hammer,
  MapPin,
  AlertTriangle,
  Shield,
  Megaphone,
  Info,
  Lightbulb,
} from "lucide-react";
import { TIPS } from "../../constants/analysis";
import { cn } from "../../lib/utils";

interface LegalTipsCarouselProps {
  currentTipIndex: number;
  setCurrentTipIndex: (index: number) => void;
  onTipClick: (index: number) => void;
}

const renderTipIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "Hammer":
      return <Hammer className={className} />;
    case "MapPin":
      return <MapPin className={className} />;
    case "AlertTriangle":
      return <AlertTriangle className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Megaphone":
      return <Megaphone className={className} />;
    case "Info":
      return <Info className={className} />;
    default:
      return <Lightbulb className={className} />;
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case "rose":
      return "bg-[#8e3e63] text-white border-transparent";
    case "emerald":
      return "bg-[#3a9691] text-white border-transparent";
    case "amber":
      return "bg-amber-100 text-amber-600 border-amber-200";
    case "blue":
      return "bg-blue-600 text-white border-transparent";
    case "indigo":
      return "bg-indigo-600 text-white border-transparent";
    case "slate":
      return "bg-slate-600 text-white border-transparent";
    default:
      return "bg-[#203b6d] text-white border-transparent";
  }
};

const getBadgeColorClass = (color: string) => {
  switch (color) {
    case "rose":
      return "bg-rose-50 text-rose-600 border-rose-200";
    case "emerald":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "amber":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "indigo":
      return "bg-indigo-50 text-indigo-600 border-indigo-200";
    case "slate":
      return "bg-slate-100 text-slate-600 border-slate-300";
    default:
      return "bg-blue-50 text-blue-600 border-blue-200";
  }
};

export const LegalTipsCarousel = ({
  currentTipIndex,
  setCurrentTipIndex,
  onTipClick,
}: LegalTipsCarouselProps) => {
  return (
    <div className="w-full pb-6 px-4">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          <span className="text-[11px] font-black text-[#203b6d] uppercase tracking-[0.2em]">
            가맹점주를 위한 꿀팁
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {TIPS.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTipIndex(index);
              }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === currentTipIndex
                  ? "bg-slate-600 w-4"
                  : "bg-slate-300 hover:bg-slate-400",
              )}
              aria-label={`팁 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>

      <div
        onClick={() => onTipClick(currentTipIndex)}
        className="relative h-40 bg-white border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden group cursor-pointer active:scale-[0.99] transition-all hover:border-slate-300"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 p-8 flex flex-col justify-center"
          >
            {/* TIP Badge */}
            {/* <div className="absolute top-3 right-3">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase border",
                  getBadgeColorClass(TIPS[currentTipIndex].color),
                )}
              >
                💡 TIP
              </span>
            </div> */}

            <div className="flex items-start space-x-5">
              <div
                className={cn(
                  "p-4 rounded-lg shadow-lg",
                  getColorClass(TIPS[currentTipIndex].color),
                )}
              >
                {renderTipIcon(TIPS[currentTipIndex].icon, "w-6 h-6")}
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-[17px] font-black text-[#203b6d] mb-1.5 break-keep">
                  {TIPS[currentTipIndex].title}
                </h4>
                <p className="text-[14px] text-slate-400 font-bold leading-relaxed line-clamp-2 break-keep">
                  {TIPS[currentTipIndex].content}
                </p>
                {/* <p className="text-[10px] text-slate-400 font-medium mt-2 line-clamp-1">
                  {TIPS[currentTipIndex].lawClause}
                </p> */}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
