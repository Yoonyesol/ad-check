import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronRight, FileText, ChevronLeft } from "lucide-react";
import { useContract } from "../hooks/useContract";
import StepIndicator from "../components/common/StepIndicator";
import CommonButton from "../components/common/CommonButton";
import { motion, AnimatePresence } from "framer-motion";
import DocumentSkeleton from "../components/common/DocumentSkeleton";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ANALYSIS_STEPS } from "../constants/analysis";

// Set worker correctly for Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Preview = () => {
  const { file, handleUpload } = useContract();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isPageRendered, setIsPageRendered] = useState(false);

  useEffect(() => {
    if (!file) {
      navigate("/");
    }
  }, [file, navigate]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleNext = () => {
    if (pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const startAnalysis = async () => {
    await handleUpload();
  };

  // Calculate dimensions to fit within container
  const paddingX = 32;
  const paddingY = 40; // Reduced for centered feel
  const availableWidth = containerWidth ? containerWidth - paddingX : 300;
  const availableHeight = containerHeight ? containerHeight - paddingY : 500;

  // A4 ratio (1 : 1.414)
  const a4Ratio = 1 / 1.414;

  // Calculate based on height first
  let finalHeight = availableHeight;
  let finalWidth = availableHeight * a4Ratio;

  // If height-based width is too wide, scale down based on width instead
  if (finalWidth > availableWidth) {
    finalWidth = availableWidth;
    finalHeight = availableWidth / a4Ratio;
  }

  return (
    <div className="h-full relative flex flex-col overflow-hidden bg-white">
      <StepIndicator
        currentStep={2}
        totalSteps={ANALYSIS_STEPS.length}
        labels={ANALYSIS_STEPS}
      />
      {/* PDF Viewer Area - Shared flex space */}
      <div
        className="flex-1 shrink-0 flex items-center justify-center px-4 overflow-hidden"
        ref={(el) => {
          if (el) {
            if (el.clientWidth !== containerWidth)
              setContainerWidth(el.clientWidth);
            if (el.clientHeight !== containerHeight)
              setContainerHeight(el.clientHeight);
          }
        }}
      >
        {file ? (
          <div
            className="relative shadow-xl rounded-none overflow-hidden border border-slate-200 bg-white"
            style={{
              width: finalWidth,
              height: finalHeight,
            }}
          >
            <AnimatePresence>
              {!isPageRendered && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10"
                >
                  <DocumentSkeleton width={finalWidth} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{ opacity: isPageRendered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className={
                isPageRendered ? "relative z-0" : "absolute inset-0 invisible"
              }
            >
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
                error={
                  <div className="flex flex-col items-center justify-center p-8 text-red-500 text-center">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <span>PDF를 불러올 수 없습니다.</span>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={finalWidth}
                  onRenderSuccess={() => setIsPageRendered(true)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={null}
                />
              </Document>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <FileText className="w-12 h-12 mb-2 opacity-20" />
            <p>파일이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Bottom Controls Layer - Static flow */}
      <div className="z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        {/* Compact Navigation Bar */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200/60">
            <button
              onClick={handlePrev}
              disabled={pageNumber <= 1}
              className="p-1 text-slate-500 disabled:opacity-20 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-black font-mono text-slate-700 min-w-[36px] text-center">
              {pageNumber} <span className="text-slate-300 mx-0.5">/</span>{" "}
              {numPages || "-"}
            </span>
            <button
              onClick={handleNext}
              disabled={pageNumber >= numPages}
              className="p-1 text-slate-500 disabled:opacity-20 hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <CommonButton
            label="이전"
            onClick={() => navigate("/upload")}
            variant="outline"
            className="flex-1 py-3"
            fullWidth={false}
          />
          <CommonButton
            label="이대로 분석하기"
            onClick={startAnalysis}
            align="center"
            className="flex-[3] py-3 text-lg"
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
