import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Trash2, Smile } from "lucide-react";
import { deleteContract } from "../api/contracts";
import { useStore } from "../store/useStore";
import { useModalStore } from "../store/useModalStore";
import StepIndicator from "../components/common/StepIndicator";
import { ANALYSIS_STEPS } from "../constants/analysis";
import CommonButton from "../components/common/CommonButton";

const AnalysisComplete = () => {
  const navigate = useNavigate();
  const { contractId, accessToken, resetAnalysisData } = useStore();
  const { showConfirm, showAlert } = useModalStore();

  const handleDestroy = async () => {
    if (!contractId || !accessToken) {
      showAlert({
        title: "오류",
        message: "삭제할 계약서 정보가 없습니다.",
        color: "rose",
      });
      return;
    }

    const deleteContractData = async () => {
      try {
        const res = await deleteContract(contractId, accessToken);
        if (res.statusCode === 0) {
          showAlert({
            title: "파기 완료",
            message: "데이터가 안전하게 파기되었습니다.",
            color: "emerald",
            onConfirm: () => {
              resetAnalysisData();
              navigate("/");
            },
          });
        }
      } catch (error) {
        showAlert({
          title: "오류",
          message: "삭제 중 오류가 발생했습니다.",
          color: "rose",
        });
      }
    };

    showConfirm({
      title: "분석을 종료하시겠습니까?",
      message:
        "정말로 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      confirmText: "삭제하기",
      cancelText: "취소하기",
      color: "rose",
      onConfirm: () => deleteContractData(),
      onCancel: () => {},
    });
  };

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <StepIndicator
        currentStep={5}
        totalSteps={ANALYSIS_STEPS.length}
        labels={ANALYSIS_STEPS}
      />
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-20%] w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-8 text-center pb-10">
          {/* Character / Hero Image Area */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative"
          >
            <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 border-4 border-white mb-4">
              {/* Placeholder for Character - Using Icon for now */}
              <ShieldCheck className="w-20 h-20 text-blue-600" />
            </div>
            <div className="absolute -bottom-2 right-0 bg-white p-2 rounded-full shadow-md">
              <span className="text-2xl">😊</span>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-slate-900 leading-normal">
              바른계약은 가맹점주님의
              <br />
              <span className="text-blue-600">공정한 시작</span>을 응원합니다.
            </h2>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-5 rounded-2xl w-full border border-slate-100 shadow-sm"
          >
            <div className="flex items-start space-x-3 text-left">
              <Trash2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">
                  개인정보 자동 파기 안내
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  업로드하신 계약서와 분석 리포트는 개인정보 보호를 위해
                  <br />
                  <span className="text-blue-600 font-bold">
                    자동으로 즉시 영구 삭제
                  </span>
                  됩니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full space-y-3"
          >
            {/* <button
              onClick={handleDestroy}
              className="w-full bg-white text-slate-600 border border-slate-200 py-4 text-lg  rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>지금 계약서 파기하기</span>
            </button> */}

            <CommonButton
              label="홈으로 돌아가기"
              onClick={() => navigate("/")}
              showChevron={true}
              align="between"
            />
          </motion.div>
        </div>
      </div>

      {/* Legal Disclaimer Footer (Fixed Bottom) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="relative z-10 w-full text-center pb-8 pt-4 px-6"
      >
        <p className="text-slate-400 text-[10px] leading-relaxed">
          본 분석 결과는 법적 효력이 없으므로,
          <br />
          중요한 결정 전에는 반드시 법률 전문가의 상담을 받으시길 권장드립니다.
        </p>
      </motion.div>
    </div>
  );
};

export default AnalysisComplete;
