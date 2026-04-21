import { useState } from "react";
import { downloadHighlightedReport, downloadReport } from "../../api/contracts";

interface UseContractActionsProps {
  contractId: string | null;
  accessToken: string | null;
  handleError: (error: unknown) => void;
}

export const useContractActions = ({
  contractId,
  accessToken,
  handleError,
}: UseContractActionsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingHighlight, setIsDownloadingHighlight] = useState(false);

  const downloadPDF = async () => {
    if (!contractId || !accessToken || isDownloading) return;
    setIsDownloading(true);

    try {
      const blob = await downloadReport(contractId, accessToken);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI_계약_분석_리포트_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadHighlightedPDF = async () => {
    if (!contractId || !accessToken || isDownloadingHighlight) return;
    setIsDownloadingHighlight(true);

    try {
      const blob = await downloadHighlightedReport(contractId, accessToken);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `하이라이트_계약서_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDownloadingHighlight(false);
    }
  };

  const downloadBothFiles = async () => {
    if (!contractId || !accessToken || isDownloading || isDownloadingHighlight)
      return;
    setIsDownloading(true);
    setIsDownloadingHighlight(true);

    try {
      // Download report first
      const reportBlob = await downloadReport(contractId, accessToken);
      const reportUrl = window.URL.createObjectURL(reportBlob);
      const reportLink = document.createElement("a");
      reportLink.href = reportUrl;
      reportLink.download = `AI_계약_분석_리포트_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(reportLink);
      reportLink.click();
      window.URL.revokeObjectURL(reportUrl);
      document.body.removeChild(reportLink);

      // Small delay to avoid download conflicts
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Download highlighted contract
      const highlightBlob = await downloadHighlightedReport(
        contractId,
        accessToken,
      );
      const highlightUrl = window.URL.createObjectURL(highlightBlob);
      const highlightLink = document.createElement("a");
      highlightLink.href = highlightUrl;
      highlightLink.download = `하이라이트_계약서_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(highlightLink);
      highlightLink.click();
      window.URL.revokeObjectURL(highlightUrl);
      document.body.removeChild(highlightLink);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDownloading(false);
      setIsDownloadingHighlight(false);
    }
  };

  return {
    isDownloading,
    isDownloadingHighlight,
    downloadPDF,
    downloadHighlightedPDF,
    downloadBothFiles,
  };
};
