import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useModalStore } from "../store/useModalStore";
import { useContractQueries } from "../hooks/useContractQueries";
import AnalysisError from "../components/AnalysisError";
import StepIndicator from "../components/common/StepIndicator";
import { TIPS, ANALYSIS_STEPS } from "../constants/analysis";

// Hooks
import { useAnalysisProgress } from "../hooks/useAnalysisProgress";
import { useAnalysisExitGuard } from "../hooks/useAnalysisExitGuard";

// Components
import { AnalysisAnimation } from "../components/loading/AnalysisAnimation";
import { AnalysisStatus } from "../components/loading/AnalysisStatus";
import { NotificationGuide } from "../components/loading/NotificationGuide";
import { LegalTipsCarousel } from "../components/loading/LegalTipsCarousel";

const AnalysisLoading = () => {
  const navigate = useNavigate();
  const { setIsAnalyzing, contractId, accessToken } = useStore();
  const { isOpen: isGlobalModalOpen, showTip } = useModalStore();

  const searchParams = new URLSearchParams(window.location.search);
  const isMockMode = searchParams.get("mock") === "true";

  // 1. Core Data Queries
  const { analysisQuery } = useContractQueries(contractId, accessToken);
  const analysisStatus = isMockMode ? "ANALYZING" : analysisQuery.data?.status;
  const isCompleted = !isMockMode && analysisStatus === "COMPLETED";
  const isError = !isMockMode && analysisQuery.isError;

  // 2. Custom Hooks for Logic
  const {
    currentStepIndex,
    currentLoopIndex,
    isChecked,
    isDebug,
    goToNextStep,
    goToPrevStep,
    visualCompleted,
  } = useAnalysisProgress({
    contractId,
    accessToken,
    isCompleted,
  });

  const riskCount = isMockMode
    ? 5
    : (analysisQuery.data?.results || []).filter(
        (item) =>
          item.tag !== "normal" && item.pageNumber && item.pageNumber > 0,
      ).length;

  useAnalysisExitGuard({ isCompleted: visualCompleted, isError });

  // 3. Tip Carousel State
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    setIsAnalyzing(true);
    const tipInterval = setInterval(() => {
      if (!isGlobalModalOpen) {
        setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
      }
    }, 6000);
    return () => clearInterval(tipInterval);
  }, [setIsAnalyzing, isGlobalModalOpen]);

  // 4. Navigation to Result logic updated to manual
  const handleViewResults = () => {
    navigate("/result");
  };

  const handleTipClick = (index: number) => {
    const tip = TIPS[index];
    showTip({
      title: tip.title,
      message: tip.detailContent,
      icon: tip.icon,
      color: tip.color,
      lawClause: tip.lawClause,
      isCompleted: visualCompleted,
    });
  };

  if (isError) {
    return (
      <AnalysisError
        onHome={() => navigate("/")}
        onRetry={() => analysisQuery.refetch()}
      />
    );
  }

  return (
    <div className="h-full w-full relative flex flex-col items-center overflow-y-auto scrollbar-hide">
      {/* Step Indicator (Global App Progress) */}
      <StepIndicator
        currentStep={3}
        totalSteps={ANALYSIS_STEPS.length}
        labels={ANALYSIS_STEPS}
      />

      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full flex-1 px-6 flex flex-col justify-between items-center py-12">
        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {!visualCompleted && (
            <AnalysisAnimation
              currentStepIndex={currentStepIndex}
              isCompleted={visualCompleted}
            />
          )}

          <AnalysisStatus
            currentStepIndex={currentStepIndex}
            currentLoopIndex={currentLoopIndex}
            isChecked={isChecked}
            isCompleted={visualCompleted}
            riskCount={riskCount}
            onViewResults={handleViewResults}
            isDebug={isDebug}
            onPrev={goToPrevStep}
            onNext={goToNextStep}
          />
        </div>

        {/* Action / Information Guides */}
        <div className="w-full space-y-4">
          <NotificationGuide isCompleted={visualCompleted} isError={isError} />

          {!visualCompleted && (
            <LegalTipsCarousel
              currentTipIndex={currentTipIndex}
              setCurrentTipIndex={setCurrentTipIndex}
              onTipClick={handleTipClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
