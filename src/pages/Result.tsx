import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";

// Components
import StepIndicator from "../components/common/StepIndicator";
import Sidebar from "../components/result/Sidebar";
import ToxicClauseDrawer from "../components/result/ToxicClauseDrawer";
import ZoomControls from "../components/result/ZoomControls";
import CompletionModal from "../components/result/CompletionModal";
import DocumentSkeleton from "../components/common/DocumentSkeleton";
import CommonButton from "../components/common/CommonButton";

// Hooks
import { useStore } from "../store/useStore";
import { useContractQueries } from "../hooks/useContractQueries";
import { useApiError } from "../hooks/useApiError";
import { usePdfScroll } from "../hooks/result/usePdfScroll";
import { useContractActions } from "../hooks/result/useContractActions";

// Types
import type { AnalysisResultItem } from "../types/api";
import { ANALYSIS_STEPS } from "../constants/analysis";

// Set worker correctly for Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Result = () => {
  const navigate = useNavigate();
  const { contractId, accessToken } = useStore();
  const { handleError } = useApiError();
  const { analysisQuery, highlightQuery } = useContractQueries(
    contractId,
    accessToken,
  );
  const analysisResult = analysisQuery.data;

  const { setIsAnalyzing } = useStore();

  // 분석 페이지가 아니므로 분석 중 상태 종료
  useEffect(() => {
    setIsAnalyzing(false);
  }, [setIsAnalyzing]);

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number>(368); // Mobile base width: 448 - 80 (sidebar)
  const [pdfScale, setPdfScale] = useState(1.0);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isFirstPageRendered, setIsFirstPageRendered] = useState(false);

  // Contract Actions Hook
  const {
    isDownloading,
    isDownloadingHighlight,
    downloadPDF,
    downloadHighlightedPDF,
    downloadBothFiles,
  } = useContractActions({ contractId, accessToken, handleError });

  // Get toxic clauses helper
  const getClausesForPage = useCallback(
    (pageNum: number): AnalysisResultItem[] => {
      if (!analysisResult?.results) return [];
      return (analysisResult.results || []).filter(
        (item) =>
          item.pageNumber === pageNum &&
          item.tag !== "normal" &&
          item.pageNumber > 0,
      );
    },
    [analysisResult],
  );

  // Scroll Synchronization Hook
  const { pdfContainerRef, handlePageClick } = usePdfScroll({
    pdfNumPages,
    pdfScale,
    onPageChange: setCurrentPage,
    onPageClickExtra: (pageNum) => {
      const clauses = getClausesForPage(pageNum);
      if (clauses.length > 0) {
        setSelectedPage(pageNum);
        setIsDrawerOpen(true);
      }
    },
  });

  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  // Resize Handler
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setPdfContainerWidth(container.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    const timer = setTimeout(updateWidth, 100);
    return () => {
      window.removeEventListener("resize", updateWidth);
      clearTimeout(timer);
    };
  }, [pdfContainerRef]);

  // Sidebar Scroll Helper
  useEffect(() => {
    const activeItem =
      sidebarScrollRef.current?.querySelector(`[data-active="true"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentPage]);

  const selectedClauses = useMemo(
    () => (selectedPage ? getClausesForPage(selectedPage) : []),
    [selectedPage, getClausesForPage],
  );

  // 백엔드에서 받아온 하이라이트 PDF Blob URL 생성
  const pdfUrl = useMemo(() => {
    if (highlightQuery.data) {
      return URL.createObjectURL(highlightQuery.data);
    }
    return ""; // Fallback
  }, [highlightQuery.data]);

  // Cleanup Blob URL
  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="h-full relative flex flex-col bg-white overflow-hidden">
      <StepIndicator
        currentStep={4}
        totalSteps={ANALYSIS_STEPS.length}
        labels={ANALYSIS_STEPS}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar
          sidebarRef={sidebarScrollRef}
          pdfNumPages={pdfNumPages}
          currentPage={currentPage}
          analysisResult={analysisResult}
          onPageClick={handlePageClick}
        />

        <div className="flex-1 relative min-h-0 bg-slate-100 overflow-hidden">
          <div
            ref={pdfContainerRef}
            className="absolute inset-0 overflow-auto px-4 py-8 scroll-smooth"
          >
            <div className="w-full flex flex-col items-center relative min-h-[calc(100vh-200px)]">
              <AnimatePresence mode="wait">
                {!isFirstPageRendered && (
                  <motion.div
                    key="pdf-skeleton-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 z-30 flex flex-col items-center pt-8 pb-12 bg-slate-100"
                  >
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="mb-6">
                        <DocumentSkeleton
                          width={
                            pdfContainerWidth
                              ? Math.max(pdfContainerWidth - 48, 300)
                              : 320
                          }
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full flex flex-col items-center px-4">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => {
                    setPdfNumPages(numPages);
                  }}
                  loading={null}
                  className="flex flex-col items-center w-full"
                >
                  {Array.from({ length: pdfNumPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <div
                        key={pageNumber}
                        data-page-number={pageNumber}
                        className="w-full flex justify-center cursor-pointer group"
                        onClick={() => handlePageClick(pageNumber)}
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={
                            pdfContainerWidth ? pdfContainerWidth - 48 : 320
                          }
                          scale={pdfScale}
                          onRenderSuccess={() => {
                            if (pageNumber === 1) setIsFirstPageRendered(true);
                          }}
                          className="mb-6 shadow-xl border border-slate-200/50 origin-center transition-all duration-300 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-blue-500/10 rounded-sm overflow-hidden"
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={null}
                        />
                      </div>
                    ),
                  )}
                </Document>
              </div>
            </div>
          </div>

          <ZoomControls
            onZoomIn={() => setPdfScale((prev) => Math.min(prev + 0.2, 3.0))}
            onZoomOut={() => setPdfScale((prev) => Math.max(prev - 0.2, 0.5))}
            onReset={() => setPdfScale(1.0)}
          />
        </div>
      </div>

      <div className="flex-none bg-white border-t border-slate-200 px-3 py-4 flex items-center space-x-1.5 z-20">
        <CommonButton
          label="파일 다운로드"
          onClick={downloadBothFiles}
          disabled={isDownloading || isDownloadingHighlight}
          variant="blue"
          icon={Download}
          className="flex-1 py-2.5 text-[14px] px-2"
          fullWidth={false}
          align="center"
        />

        <CommonButton
          label="완료"
          onClick={() => setIsCompleteModalOpen(true)}
          className="flex-[0.4] min-w-[70px] py-2.5 text-[15px] px-2"
          fullWidth={false}
          align="center"
        />
      </div>

      <CompletionModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={() => navigate("/complete")}
        onDownloadBoth={downloadBothFiles}
      />

      <ToxicClauseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedPage={selectedPage}
        selectedClauses={selectedClauses}
      />
    </div>
  );
};

export default Result;
