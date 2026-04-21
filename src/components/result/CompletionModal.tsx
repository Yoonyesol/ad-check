import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Download } from "lucide-react";
import CommonButton from "../common/CommonButton";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDownloadBoth: () => void;
}

const CompletionModal = ({
  isOpen,
  onClose,
  onConfirm,
  onDownloadBoth,
}: CompletionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-none shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-7 flex flex-col items-center text-center">
              <div className="p-4 bg-rose-50 rounded-none mb-6 border border-rose-100 shadow-sm">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                정말 완료하시겠습니까?
              </h3>

              <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 px-2 break-keep">
                다음 단계로 이동하면{" "}
                <span className="text-rose-600">
                  다시 현재 페이지로 돌아올 수 없으며
                </span>
                , 분석 결과를 다운로드할 수 없습니다.
              </p>

              {/* Internal Download Button */}
              <div className="w-full mb-8">
                <CommonButton
                  label="파일 다운로드"
                  onClick={onDownloadBoth}
                  variant="secondary"
                  icon={Download}
                  showChevron={true}
                />
              </div>

              {/* Final Action Buttons */}
              <div className="w-full flex gap-3">
                <CommonButton
                  label="취소"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 py-4 text-slate-500"
                  fullWidth={false}
                />
                <CommonButton
                  label="완료하기"
                  onClick={onConfirm}
                  className="flex-1 py-4 bg-slate-900"
                  fullWidth={false}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompletionModal;
