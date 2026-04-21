import { useState, useEffect } from "react";
import { useContractQueries } from "./useContractQueries";
import { ANALYSIS_CHECKLIST } from "../constants/analysis";

interface UseAnalysisProgressProps {
  contractId: string | null;
  accessToken: string | null;
  isCompleted: boolean;
}

export const useAnalysisProgress = ({
  contractId,
  accessToken,
  isCompleted: backendCompleted,
}: UseAnalysisProgressProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSseStage, setCurrentSseStage] = useState<
    "text-extraction" | "category-scan" | "toxic-analysis" | "report-generation"
  >("text-extraction");

  const [currentLoopIndex, setCurrentLoopIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [visualCompleted, setVisualCompleted] = useState(false);

  const { progressData } = useContractQueries(contractId, accessToken, {
    enableSSE: contractId !== "debug-loading", // Disable SSE in debug mode
    stage: currentSseStage,
  });

  const isDebug = contractId === "debug-loading";

  // SSE Step Transition Logic
  useEffect(() => {
    if (isDebug) return; // Skip SSE logic in debug mode

    if (progressData) {
      if (progressData.status === "DONE") {
        // Wait a bit if we are in a looping step to let animations finish a cycle
        const isLooping = currentStepIndex === 2;
        const delay = isLooping ? 800 : 0;

        const timer = setTimeout(() => {
          if (
            progressData.step === "TEXT_EXTRACTION" ||
            progressData.step === "TEXT_EXTRACTING"
          ) {
            setCurrentStepIndex(1);
            setCurrentSseStage("category-scan");
          } else if (
            progressData.step === "CATEGORY_SCAN" ||
            progressData.step === "CATEGORY_SCANNING"
          ) {
            setCurrentStepIndex(2);
            setCurrentSseStage("toxic-analysis");
          } else if (
            progressData.step === "TOXIC_ANALYSIS" ||
            progressData.step === "TOXIC_ANALYZING"
          ) {
            setCurrentStepIndex(3);
            setCurrentSseStage("report-generation");
          } else if (
            progressData.step === "REPORT_GENERATION" ||
            progressData.step === "REPORT_GENERATING"
          ) {
            setCurrentStepIndex(4);
          }
        }, delay);
        return () => clearTimeout(timer);
      } else if (progressData.status === "IN_PROGRESS") {
        if (
          (progressData.step === "CATEGORY_SCAN" ||
            progressData.step === "CATEGORY_SCANNING") &&
          currentStepIndex < 1
        ) {
          setCurrentStepIndex(1);
          setCurrentSseStage("category-scan");
        } else if (
          (progressData.step === "TOXIC_ANALYSIS" ||
            progressData.step === "TOXIC_ANALYZING") &&
          currentStepIndex < 2
        ) {
          setCurrentStepIndex(2);
          setCurrentSseStage("toxic-analysis");
        } else if (
          (progressData.step === "REPORT_GENERATION" ||
            progressData.step === "REPORT_GENERATING") &&
          currentStepIndex < 3
        ) {
          setCurrentStepIndex(3);
          setCurrentSseStage("report-generation");
        }
      }
    }
  }, [progressData, currentStepIndex, isDebug]);

  // Visual Completion Synchronization
  useEffect(() => {
    // If backend is done and we've reached the final step
    if (backendCompleted && currentStepIndex === 4) {
      // If we are NOT in the looping step (Case: quick analysis)
      // or if we ARE in the looping step and at least one item is checked
      if (
        !isChecked &&
        (completedIndices.length > 0 || currentStepIndex === 4)
      ) {
        setVisualCompleted(true);
      } else if (completedIndices.length === 0 && currentStepIndex !== 4) {
        // Just in case it's so fast that nothing happened, trigger one check
        setIsChecked(true);
      } else if (currentStepIndex === 4) {
        setVisualCompleted(true);
      }
    }
  }, [backendCompleted, currentStepIndex, isChecked, completedIndices]);

  // Fallback Logic
  useEffect(() => {
    if (backendCompleted && currentStepIndex < 4) {
      setCurrentStepIndex(4);
    }
  }, [backendCompleted, currentStepIndex]);

  // Reset checklist when entering a step that uses it
  useEffect(() => {
    if (currentStepIndex === 2) {
      setCurrentLoopIndex(0);
      setIsChecked(false);
      setCompletedIndices([]);
      setVisualCompleted(false);
    }
  }, [currentStepIndex]);

  // Checklist Loop Logic
  useEffect(() => {
    const isLoopingStep = currentStepIndex === 2;
    if (!isLoopingStep) return;

    if (isChecked) {
      // Snappy Completion: If backend is done, finish the check animation quickly
      if (backendCompleted) {
        const timer = setTimeout(() => {
          setIsChecked(false);
          setCompletedIndices((prev) => [
            ...new Set([...prev, currentLoopIndex]),
          ]);
          setVisualCompleted(true);
        }, 800); // Give time for the checkmark to be seen
        return () => clearTimeout(timer);
      }

      const timer = setTimeout(
        () => {
          setIsChecked(false);
          setCompletedIndices((prev) => [
            ...new Set([...prev, currentLoopIndex]),
          ]);
          setCurrentLoopIndex((prev) => (prev + 1) % ANALYSIS_CHECKLIST.length);
        },
        isDebug ? 3000 : 1500,
      );
      return () => clearTimeout(timer);
    } else {
      // If backend is already done, trigger the checkmark IMMEDIATELY (Snappy)
      if (backendCompleted) {
        setIsChecked(true);
        return;
      }

      const timer = setTimeout(
        () => {
          setIsChecked(true);
        },
        isDebug ? 4000 : 2000,
      );
      return () => clearTimeout(timer);
    }
  }, [
    isChecked,
    currentLoopIndex,
    currentStepIndex,
    isDebug,
    backendCompleted,
  ]);

  const goToNextStep = () => {
    if (currentStepIndex < 4) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return {
    currentStepIndex,
    setCurrentStepIndex,
    currentSseStage,
    currentLoopIndex,
    isChecked,
    completedIndices,
    visualCompleted:
      visualCompleted || (backendCompleted && currentStepIndex === 4),
    progressData,
    isDebug,
    goToNextStep,
    goToPrevStep,
  };
};
