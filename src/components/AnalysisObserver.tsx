import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useContractQueries } from "../hooks/useContractQueries";

const AnalysisObserver = () => {
  const navigate = useNavigate();
  const { contractId, accessToken, isAnalyzing, setIsAnalyzing } = useStore();
  const notifiedId = useRef<string | null>(null);

  // 분석 쿼리 (isAnalyzing이 true일 때만 활성화)
  const { analysisQuery } = useContractQueries(contractId, accessToken);
  const analysisStatus = analysisQuery.data?.status;

  useEffect(() => {
    // 분석이 완료되었고, 아직 이 contractId로 알림을 보낸 적이 없을 때만 처리
    if (isAnalyzing && analysisStatus === "COMPLETED" && notifiedId.current !== contractId) {
      setIsAnalyzing(false);
      notifiedId.current = contractId; // 알림 보냄 표시

      // 🔍 시스템 알림 발생
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("바른계약 - 분석 완료", {
          body: "계약서 분석이 완료되었습니다. 결과를 확인해보세요!",
          icon: "/logo.png",
        });

        notification.onclick = () => {
          window.focus();
          navigate("/result");
          notification.close();
        };
      }
    }

    // 분석이 시작되거나 contractId가 바뀌면 초기화
    if (!isAnalyzing || !contractId) {
      notifiedId.current = null;
    }
  }, [analysisStatus, isAnalyzing, contractId, navigate, setIsAnalyzing]);

  return null; // 화면에 보이지 않는 관찰자 역할만 수행
};

export default AnalysisObserver;
