import axios from "axios";
import type {
  ApiResponse,
  ContractReportResponse,
  ContractUploadResponse,
} from "../types/api";

const API_BASE_URL = "/api";

// 계약서 업로드
export const uploadContract = async (
  file: File,
): Promise<ContractUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);

  const response = await axios.post<ApiResponse<ContractUploadResponse>>(
    `${API_BASE_URL}/contracts/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

// 분석 보고서 다운로드
export const downloadReport = async (
  contractId: string,
  accessToken: string,
): Promise<Blob> => {
  const response = await axios.get(
    `${API_BASE_URL}/contracts/${contractId}/download/report`,
    {
      headers: {
        "X-ACCESS-TOKEN": accessToken,
      },
      responseType: "blob",
    },
  );

  return response.data;
};

// 하이라이트 보고서 다운로드
export const downloadHighlightedReport = async (
  contractId: string,
  accessToken: string,
): Promise<Blob> => {
  const response = await axios.get(
    `${API_BASE_URL}/contracts/${contractId}/download/highlight`,
    {
      headers: {
        "X-ACCESS-TOKEN": accessToken,
      },
      responseType: "blob",
    },
  );

  return response.data;
};

// 계약서 분석 보고서 조회
export const getContractReport = async (
  contractId: string,
  accessToken: string,
): Promise<ContractReportResponse> => {
  const response = await axios.get<ApiResponse<ContractReportResponse>>(
    `${API_BASE_URL}/contracts/${contractId}/report`,
    {
      headers: {
        "X-ACCESS-TOKEN": accessToken,
      },
    },
  );

  return response.data.data;
};

// 계약서 삭제
export const deleteContract = async (
  contractId: string,
  accessToken: string,
): Promise<ApiResponse<object>> => {
  const response = await axios.delete<ApiResponse<object>>(
    `${API_BASE_URL}/contracts/${contractId}`,
    {
      headers: {
        "X-ACCESS-TOKEN": accessToken,
      },
    },
  );

  return response.data;
};

// SSE 토큰 교환 (HttpOnly 쿠키 발급용)
export const exchangeSseToken = async (
  contractId: string,
  accessToken: string,
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/contracts/${contractId}/progress/token`,
    null,
    {
      headers: {
        "X-ACCESS-TOKEN": accessToken,
      },
    },
  );
};
