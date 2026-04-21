export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ContractUploadResponse {
  contractId: string;
  accessToken: string;
  originalFileName: string;
  uploadedAt: string;
}

export interface ApiError {
  statusCode: number;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
}

export interface AnalysisResultItem {
  cid: string;
  pageNumber?: number;
  tag: string;
  tagName: string;
  text: string;
  aiAnalysis: string;
  negotiationScript: string;
  checkItem: string;
}

export interface ChecklistItem {
  title: string;
  content: string;
}

export interface ReportInfo {
  brandName: string;
  analysisDate: string;
}

export interface ContractReportResponse {
  contractId: string;
  pageNumber: number;
  status: "ANALYZING" | "COMPLETED";
  fileName: string;
  reportInfo: ReportInfo | null;
  results: AnalysisResultItem[];
  finalChecklist: ChecklistItem[];
}
