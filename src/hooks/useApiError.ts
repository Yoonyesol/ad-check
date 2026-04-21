import axios from "axios";
import { useModalStore } from "../store/useModalStore";

export interface ErrorOverride {
  title?: string;
  message?: string;
}

export const useApiError = () => {
  const { showAlert } = useModalStore();

  const handleError = (
    error: unknown,
    overrides?: Record<number, ErrorOverride>,
  ) => {
    // Axios 에러 핸들링
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      // 사용자 정의 오버라이드가 있으면 최우선 적용
      if (overrides?.[status]) {
        showAlert({
          title: overrides[status].title || "오류 발생",
          message:
            overrides[status].message || "알 수 없는 오류가 발생했습니다.",
        });
        return;
      }

      if (status === 400) {
        const bodyCode = error.response.data?.statusCode;
        const serverMessage = error.response.data?.message;

        // 특정 에러 코드들에 대한 처리 (숫자 기반)
        if ([2001, 3001, 3003].includes(bodyCode)) {
          showAlert({
            title: "형식 오류",
            message: "올바른 PDF 파일이 아닙니다.",
            color: "rose",
          });
        } else if (bodyCode === 1000) {
          showAlert({
            title: "요청 오류",
            message: "잘못된 입력값입니다.",
            color: "rose",
          });
        } else if (bodyCode === 2002) {
          showAlert({
            title: "용량 초과",
            message: "PDF 파일 용량이 제한을 초과했습니다.",
            color: "rose",
          });
        } else if (bodyCode === 2003) {
          showAlert({
            title: "분석 오류",
            message: "PDF 처리 중 알 수 없는 오류가 발생했습니다.",
            color: "rose",
          });
        } else if (bodyCode === 2005) {
          showAlert({
            title: "페이지 초과",
            message: "PDF 페이지 수가 제한을 초과했습니다.",
            color: "rose",
          });
        } else if (bodyCode === 3002) {
          showAlert({
            title: "보안 오류",
            message: "비밀번호가 설정된 PDF는 분석할 수 없습니다.",
            color: "rose",
          });
        } else if (bodyCode === 3004) {
          showAlert({
            title: "파일 오류",
            message: "계약서 파일이 아닙니다.",
            color: "rose",
          });
        } else {
          showAlert({
            title: "형식 오류",
            message: serverMessage || "파일 형식이 올바르지 않습니다.",
            color: "rose",
          });
        }
      } else if (status === 401) {
        showAlert({
          title: "인증 오류",
          message:
            error.response.data?.message || "인증 토큰이 누락되었습니다.",
          color: "rose",
        });
      } else if (status === 404) {
        showAlert({
          title: "파일 없음",
          message:
            error.response.data?.message || "계약서가 없거나 만료되었습니다.",
          color: "rose",
        });
      } else if (status === 409) {
        showAlert({
          title: "분석 진행 중",
          message:
            error.response.data?.message || "분석이 아직 완료되지 않았습니다.",
          color: "rose",
        });
      } else if (status === 413) {
        showAlert({
          title: "용량 초과",
          message:
            error.response.data?.message || "파일 크기가 제한을 초과했습니다.",
          color: "rose",
        });
      } else if (status === 500) {
        showAlert({
          title: "서버 오류",
          message:
            error.response.data?.message ||
            "서버 내부 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
          color: "rose",
        });
      } else {
        // 그 외 상태 코드
        showAlert({
          title: "오류 발생",
          message:
            error.response.data?.message ||
            "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
          color: "rose",
        });
      }
    } else {
      // Axios 에러가 아닌 경우 (네트워크 오류 등)
      showAlert({
        title: "오류 발생",
        message:
          "서버와 통신 중 문제가 발생했습니다.\n네트워크 연결을 확인해주세요.",
      });
    }
  };

  return { handleError };
};
