import { motion } from "framer-motion";
import CommonButton from "./common/CommonButton";

interface AnalysisErrorProps {
  onHome: () => void;
  onRetry?: () => void;
}

const AnalysisError = ({ onHome, onRetry }: AnalysisErrorProps) => {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-30 flex items-center justify-center bg-white p-6 rounded-full shadow-2xl shadow-red-100"
      >
        <div className="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
      </motion.div>
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-slate-800">
          처리 중 오류가 발생했습니다
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          일시적인 서버 지연이나 네트워크 문제일 수 있습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex flex-col space-y-3 pt-4 w-full max-w-xs">
          {onRetry && (
            <CommonButton
              label="다시 시도하기"
              onClick={onRetry}
              variant="blue"
              className="py-3 text-sm"
            />
          )}
          <CommonButton
            label="홈으로 돌아가기"
            onClick={onHome}
            variant="outline"
            className="py-3 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisError;
