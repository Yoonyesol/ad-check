import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import { useDrawerStore } from "../store/useDrawerStore";

const RiskDetailDrawer = () => {
  const { isOpen, data, closeDrawer } = useDrawerStore();

  return (
    <AnimatePresence>
      {isOpen && data && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black z-[200] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-slate-100 rounded-t-[32px] z-[210] max-h-[85vh] overflow-hidden flex flex-col shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.3)]"
          >
            <div className="bg-white px-6 pt-6 pb-4 rounded-t-[32px] flex-none relative">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
              <button
                onClick={closeDrawer}
                className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-400 rotate-45" />
              </button>
              <div className="mt-2">
                <span className="inline-block bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-md mb-2 shadow-sm">
                  위험
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{data.title}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-100">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-bold text-slate-500">내 계약서 조항</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-orange-50/30 opacity-50"></div>
                  <p className="relative text-[15px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                    <span className="bg-yellow-200 box-decoration-clone px-1 rounded-sm">
                      {data.content}
                    </span>
                  </p>
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold">
                      {data.law}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold text-blue-600">AI 변호사 조언</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 relative">
                  <div className="flex items-start space-x-4">
                    <div className="flex-none -ml-2 -mt-2">
                      <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-white shadow-md overflow-hidden relative">
                        <img
                          src="/advisor.png"
                          alt="AI Advisor"
                          className="w-full h-full object-cover transform scale-110 translate-y-1"
                        />
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute top-4 -left-2 w-3 h-3 bg-blue-50 transform rotate-45 border-l border-b border-blue-100"></div>
                      <div className="bg-blue-50 p-3.5 rounded-xl rounded-tl-none text-sm text-slate-700 leading-relaxed border border-blue-100">
                        <p className="font-bold text-blue-900 mb-1">사장님, 이거 주의하세요!</p>
                        {data.advice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Negotiation Guide (Using negotiationScript) */}
              {data.negotiationScript && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-green-600">협상 가이드</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 relative">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-[14px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                        {data.negotiationScript}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RiskDetailDrawer;
