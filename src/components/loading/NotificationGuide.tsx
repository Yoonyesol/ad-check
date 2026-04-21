import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

interface NotificationGuideProps {
  isCompleted: boolean;
  isError: boolean;
}

export const NotificationGuide = ({
  isCompleted,
  isError,
}: NotificationGuideProps) => {
  if (isCompleted || isError || Notification.permission === "granted") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8 px-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Megaphone className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-black text-slate-900 leading-snug">
            분석 완료 알림 받기
          </p>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5">
            잠시 다른 일을 보셔도 알려드려요
          </p>
        </div>
        <button
          onClick={() => Notification.requestPermission()}
          className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl shadow-sm hover:bg-black transition-colors"
        >
          허용
        </button>
      </div>
    </motion.div>
  );
};
