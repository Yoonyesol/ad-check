import { useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { useStore } from "../store/useStore";
import { useModalStore } from "../store/useModalStore";
import { uploadContract } from "../api/contracts";
import { useApiError } from "./useApiError";

export const useContract = () => {
  const navigate = useNavigate();
  const { file, setFile, setContractId, setAccessToken } = useStore();
  const { showAlert } = useModalStore();
  const { handleError } = useApiError();

  const validateFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    if (file.type !== "application/pdf" && !fileName.endsWith(".pdf")) {
      showAlert({
        title: "형식 오류",
        message: "PDF 형식의 파일만 업로드 가능합니다.",
        color: "rose",
      });
      return false;
    }
    return true;
  };

  const validateSize = (file: File) => {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      showAlert({
        title: "용량 초과",
        message: "파일 용량이 너무 큽니다.\n최대 50MB까지 업로드 가능합니다.",
        color: "rose",
      });
      return false;
    }
    return true;
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;

    // 비밀번호 설정 여부 확인
    try {
      const data = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data });
      await loadingTask.promise;

      // 성공적으로 열리면 스토어에 저장
      setFile(selectedFile);
    } catch (error: any) {
      // PDF.js에서 비밀번호가 필요한 경우 PasswordException(또는 에러 코드 1)을 던짐
      if (error.name === "PasswordException" || error.code === 1) {
        showAlert({
          title: "보안 오류",
          message: "비밀번호가 설정된 PDF는 분석할 수 없습니다.",
          color: "rose",
        });
        return;
      }
      // 그 외의 로딩 에러는 일반 형식 오류로 처리
      showAlert({
        title: "형식 오류",
        message: "PDF 파일을 불러오는 중 오류가 발생했습니다.",
        color: "rose",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showAlert({ message: "파일이 존재하지 않습니다." });
      return;
    }

    if (!validateSize(file)) return;

    try {
      // 분석 로딩 페이지로 먼저 이동
      navigate("/analysis-loading");

      // API 요청
      const response = await uploadContract(file);

      // 성공 시 스토어에 저장
      setContractId(response.contractId);
      setAccessToken(response.accessToken);
    } catch (error) {
      handleError(error);
      navigate("/"); // 실패 시 홈으로 복귀
    }
  };

  return {
    file,
    handleFileSelect,
    handleUpload,
  };
};
