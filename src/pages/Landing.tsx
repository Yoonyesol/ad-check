import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, FileText, ChevronRight } from "lucide-react";

/**
 * Landing Page - Minimalist Premium Version
 */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-white text-slate-900 scrollbar-hide select-none flex flex-col relative font-sans">
      {/* 100vh Hero Container */}
      <div className="min-h-screen flex flex-col">
        {/* Brand Header - Professional Branding */}
        <nav className="w-full px-8 py-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8" />
            <span className="text-3xl font-black text-[#203b6d] tracking-[-0.05em]">
              바른계약
            </span>
          </div>
        </nav>

        {/* Hero Section - Refined Typography & Centered Spacing */}
        <section className="relative flex-1 flex flex-col justify-center px-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-black text-blue-600 tracking-[0.2em] uppercase">
                  Legal Intelligence
                </span>
                <div className="w-12 h-[1px] bg-blue-100" />
              </div>

              <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-black leading-[1.15] tracking-tight text-slate-900">
                <span className="block sm:inline">가장 앞선</span>{" "}
                <span className="text-blue-600 break-keep inline-block">
                  인공지능 법률 비서
                </span>
              </h1>

              <p className="text-[19px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
                어렵고 복잡한 계약서, <br />
                이제 AI가 명확하게 요약해 드립니다.
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => navigate("/upload")}
                className="group flex items-center justify-between w-full max-w-[260px] bg-slate-900 px-8 py-5 rounded-none hover:bg-blue-600 transition-colors duration-300 shadow-xl"
              >
                <span className="text-[17px] font-bold tracking-tight text-white">
                  분석 시작하기
                </span>
                <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </button>

              <div className="space-y-2 pt-1">
                <p className="text-[12px] text-blue-600 font-bold flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  <span>회원가입 없이 무료로 즉시 이용 가능</span>
                </p>
                <p className="text-[12px] text-slate-400 font-medium flex items-center space-x-2">
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>업로드된 파일은 분석 후 영구 파기됩니다.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Subtle Background Elements - Positioned relative to centered hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -z-10 opacity-60" />
        </section>
      </div>

      {/* Feature Section - Clean Cards */}
      <section className="flex-1 bg-slate-50/50 px-8 py-20 space-y-12">
        <div className="space-y-3">
          <div className="w-8 h-1 bg-blue-600" />
          <h2 className="text-[28px] font-black tracking-tight text-slate-900">
            안심 계약 솔루션
          </h2>
          <p className="text-[14px] text-slate-500 font-semibold tracking-tight">
            바른계약이 제공하는 3가지 핵심 기술
          </p>
        </div>

        <div className="space-y-4">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 bg-[#203b6d] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold text-slate-900">
                  독소조항 정밀 감지
                </h3>
                <p className="text-[15px] text-slate-500 font-medium leading-relaxed break-keep">
                  수백 건의 판례 데이터를 바탕으로 <br />
                  당신에게 불리한 조항을{" "}
                  <span className="text-[#203b6d] font-bold">즉시</span>{" "}
                  찾아냅니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 bg-[#913b6d] flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold text-slate-900">
                  쉬운 일상어 요약
                </h3>
                <p className="text-[15px] text-slate-500 font-medium leading-relaxed break-keep">
                  어려운 법률 용어는 이제 그만. <br />
                  누구나 이해할 수 있는{" "}
                  <span className="text-[#913b6d] font-bold">
                    쉬운 말로 요약
                  </span>
                  합니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 bg-[#2b9fa4] flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold text-slate-900">
                  금융 수준의 보안 유지
                </h3>
                <p className="text-[15px] text-slate-500 font-medium leading-relaxed break-keep">
                  모든 업로드 파일은 보안 암호화하며 <br />
                  분석 완료 후 데이터를{" "}
                  <span className="text-[#2b9fa4] font-bold">영구 파기</span>
                  합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="pt-12 pb-6 flex flex-col items-center space-y-4">
          <div className="w-12 h-[1px] bg-slate-200" />
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[11px] font-black tracking-[0.4em] uppercase text-slate-900">
              Bareun Gye-yak
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-1">
              © 2026 Bareun Gye-yak. All rights reserved.
            </span>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Landing;
