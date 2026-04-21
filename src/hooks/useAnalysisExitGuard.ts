import { useEffect, useRef } from "react";
import { useModalStore } from "../store/useModalStore";
import { useStore } from "../store/useStore";

interface UseAnalysisExitGuardProps {
  isCompleted: boolean;
  isError: boolean;
}

export const useAnalysisExitGuard = ({
  isCompleted,
  isError,
}: UseAnalysisExitGuardProps) => {
  const { resetAnalysisData } = useStore();
  const { showConfirm } = useModalStore();
  const isLeavingRef = useRef(false);
  const hasPushedRef = useRef(false);

  const handleAttemptExit = () => {
    showConfirm({
      title: "분석을 중단하시겠습니까?",
      message: "지금 페이지를 벗어나시면 분석이 중단될 수 있습니다.",
      confirmText: "계속 분석하기",
      cancelText: "페이지 이탈하기",
      onCancel: () => {
        isLeavingRef.current = true;
        resetAnalysisData();
        window.location.replace("/");
      },
    });
  };

  // Prevent back navigation
  useEffect(() => {
    if (isCompleted || isError) return;

    if (!hasPushedRef.current) {
      window.history.pushState(null, "", window.location.href);
      hasPushedRef.current = true;
    }

    const handlePopState = () => {
      if (isLeavingRef.current) return;
      window.history.pushState(null, "", window.location.href);
      handleAttemptExit();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isCompleted, isError]);

  // Prevent tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isCompleted && !isError && !isLeavingRef.current) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isCompleted, isError]);

  return { isLeavingRef };
};
