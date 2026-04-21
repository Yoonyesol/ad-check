import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  downloadHighlightedReport,
  exchangeSseToken,
  getContractReport,
} from "../api/contracts";
import { useStore } from "../store/useStore";

interface ProgressData {
  contractId: string;
  step:
    | "TEXT_EXTRACTING"
    | "TEXT_EXTRACTION"
    | "CATEGORY_SCAN"
    | "CATEGORY_SCANNING"
    | "TOXIC_ANALYSIS"
    | "TOXIC_ANALYZING"
    | "REPORT_GENERATING"
    | "REPORT_GENERATION";
  status: "IN_PROGRESS" | "DONE";
}

interface SSEOptions {
  enableSSE?: boolean;
  stage?:
    | "text-extraction"
    | "category-scan"
    | "toxic-analysis"
    | "report-generation";
}

export const useContractQueries = (
  contractId: string | null,
  accessToken: string | null,
  options: SSEOptions = {},
) => {
  const { enableSSE = false, stage } = options;
  const queryClient = useQueryClient();
  const { isHydrated, isAnalyzing } = useStore();
  const connectingRef = useRef<string | null>(null);
  const tokenExchangedRef = useRef<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  // 1. 분석 결과 리포트 가져오기
  const analysisQuery = useQuery({
    queryKey: ["analysisReport", contractId, accessToken],
    queryFn: async () => {
      if (!contractId || !accessToken) return null;
      return await getContractReport(contractId, accessToken);
    },
    enabled: isHydrated && !!contractId && !!accessToken && isAnalyzing,
    refetchInterval: (query) => {
      // 1. 분석 중이 아니면 폴링 중단
      if (!isAnalyzing) return false;
      // 2. 이미 완료(COMPLETED) 상태라면 폴링 중단
      if (query.state.data?.status === "COMPLETED") return false;
      // 3. 그 외에는 5초마다 폴링 (SSE가 지연되거나 끊겼을 때의 안전 장치)
      return 5000;
    },
    refetchIntervalInBackground: true,
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  // 2. SSE 연동 로직
  useEffect(() => {
    if (
      !enableSSE ||
      !isHydrated ||
      !isAnalyzing ||
      !contractId ||
      !accessToken
    ) {
      return;
    }

    if (
      analysisQuery.data?.status === "COMPLETED" ||
      connectingRef.current === `${contractId}-${stage}`
    ) {
      return;
    }

    let eventSource: EventSource | null = null;
    let isCancelled = false;

    const setupSSE = async () => {
      try {
        connectingRef.current = `${contractId}-${stage}`;

        // 1단계: 토큰 교환 (이미 했으면 건너뜀)
        if (tokenExchangedRef.current !== contractId) {
          await exchangeSseToken(contractId, accessToken);
          tokenExchangedRef.current = contractId;
        }

        if (isCancelled) return;

        // URL 결정: 특정 스테이지가 있으면 해당 경로로, 없으면 전체 경로로 연결
        const sseUrl = stage
          ? `/api/contracts/${contractId}/progress/${stage}`
          : `/api/contracts/${contractId}/progress`;

        eventSource = new EventSource(sseUrl);

        // progress 이벤트 수신 (사용자 정의 이벤트 이름이 'progress'인 경우)
        eventSource.addEventListener("progress", (event: MessageEvent) => {
          try {
            const data: ProgressData = JSON.parse(event.data);
            setProgressData(data);

            // 데이터가 DONE이면 캐시 무효화하여 최신 상태 가져오기
            if (data.status === "DONE") {
              queryClient.invalidateQueries({
                queryKey: ["analysisReport", contractId, accessToken],
              });
            }
          } catch {}
        });

        // 기본 메시지 수신 (기존 호환성 유지)
        eventSource.onmessage = (_event: MessageEvent) => {
          queryClient.invalidateQueries({
            queryKey: ["analysisReport", contractId, accessToken],
          });
        };

        eventSource.onerror = () => {
          eventSource?.close();
          connectingRef.current = null;
        };
      } catch {
        connectingRef.current = null;
      }
    };

    setupSSE();

    return () => {
      isCancelled = true;
      if (eventSource) {
        eventSource.close();
      }
      connectingRef.current = null;
    };
  }, [
    isHydrated,
    isAnalyzing,
    contractId,
    accessToken,
    queryClient,
    enableSSE,
    stage,
    analysisQuery.data?.status,
  ]);

  // 3. 하이라이트 PDF 파일 가져오기
  const highlightQuery = useQuery({
    queryKey: ["highlightedContract", contractId, accessToken],
    queryFn: () => {
      if (!contractId || !accessToken) throw new Error("Missing credentials");
      return downloadHighlightedReport(contractId, accessToken);
    },
    enabled:
      !!contractId &&
      !!accessToken &&
      analysisQuery.data?.status === "COMPLETED",
  });

  return { analysisQuery, highlightQuery, progressData };
};
