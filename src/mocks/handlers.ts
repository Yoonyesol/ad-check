import { http, HttpResponse, delay } from "msw";
import { DUMMY_PDF_BASE64, MOCK_ANALYSIS_REPORT } from "./mockData";

const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// 분석 상태 추적을 위한 맵 (데모용)
const analysisStatusMap = new Map<string, number>();

export const handlers = [
  // SSE 토큰 교환 (SSE 연결 전 쿠키 발급)
  http.post(
    "/api/contracts/:contractId/progress/token",
    async ({ request, params }) => {
      const { contractId } = params as { contractId: string };
      const accessToken = request.headers.get("X-ACCESS-TOKEN");

      // 인증 토큰이 없거나 계약 ID가 에러인 경우
      if (!accessToken || contractId === "c_error_401") {
        return HttpResponse.json(
          { statusCode: 401, message: "인증 토큰이 누락되었습니다." },
          { status: 401 },
        );
      }

      // 404 Not Found 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          { statusCode: 404, message: "계약서를 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      // 500 Internal Server Error 시뮬레이션
      if (contractId === "c_error_500") {
        return HttpResponse.json(
          { statusCode: 500, message: "서버 내부 오류가 발생했습니다." },
          { status: 500 },
        );
      }

      // [CRITICAL FIX] 새 분석 시작 시 카운터 초기화 (메모리 상의 이전 상태 제거)
      analysisStatusMap.set(contractId, 0);

      return HttpResponse.json(
        { statusCode: 200, message: "SUCCESS", data: null },
        {
          status: 200,
          headers: {
            "Set-Cookie": `SSE-TOKEN=mock_sse_token_${contractId}; HttpOnly; Secure; SameSite=Strict; Path=/api/contracts/${contractId}/progress`,
          },
        },
      );
    },
  ),

  // 진행 상황 전달 API (텍스트 추출 중) - SSE Mock
  http.get(
    "/api/contracts/:contractId/progress/text-extraction",
    async ({ params }) => {
      const { contractId } = params as { contractId: string };

      // 404 에러 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          { statusCode: 404, message: "CONTRACT_NOT_FOUND", data: null },
          { status: 404 },
        );
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // 1. IN_PROGRESS 이벤트 송출
          const inProgressData = JSON.stringify({
            contractId,
            step: "TEXT_EXTRACTING",
            status: "IN_PROGRESS",
          });
          controller.enqueue(
            encoder.encode(
              `event: progress\nid: 1\ndata: ${inProgressData}\n\n`,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 2. DONE 이벤트 송출
          const doneData = JSON.stringify({
            contractId,
            step: "TEXT_EXTRACTING",
            status: "DONE",
          });
          controller.enqueue(
            encoder.encode(`event: progress\nid: 2\ndata: ${doneData}\n\n`),
          );

          controller.close();
        },
      });

      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    },
  ),

  // 진행 상황 전달 API (위험 조항 스캔 중) - SSE Mock
  http.get(
    "/api/contracts/:contractId/progress/category-scan",
    async ({ params }) => {
      const { contractId } = params as { contractId: string };

      // 404 에러 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          { statusCode: 404, message: "CONTRACT_NOT_FOUND", data: null },
          { status: 404 },
        );
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // 1. IN_PROGRESS 이벤트 송출 (id: 10)
          const inProgressData = JSON.stringify({
            contractId,
            step: "CATEGORY_SCAN",
            status: "IN_PROGRESS",
          });
          controller.enqueue(
            encoder.encode(
              `event: progress\nid: 10\ndata: ${inProgressData}\n\n`,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 3000));

          // 2. DONE 이벤트 송출 (id: 11)
          const doneData = JSON.stringify({
            contractId,
            step: "CATEGORY_SCAN",
            status: "DONE",
          });
          controller.enqueue(
            encoder.encode(`event: progress\nid: 11\ndata: ${doneData}\n\n`),
          );

          controller.close();
        },
      });

      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    },
  ),

  // 진행 상황 전달 API (독소 조항 분석 중) - SSE Mock
  http.get(
    "/api/contracts/:contractId/progress/toxic-analysis",
    async ({ params }) => {
      const { contractId } = params as { contractId: string };

      // 404 에러 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          { statusCode: 404, message: "CONTRACT_NOT_FOUND", data: null },
          { status: 404 },
        );
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // 1. IN_PROGRESS 이벤트 송출 (id: 20)
          const inProgressData = JSON.stringify({
            contractId,
            step: "TOXIC_ANALYZING",
            status: "IN_PROGRESS",
          });
          controller.enqueue(
            encoder.encode(
              `event: progress\nid: 20\ndata: ${inProgressData}\n\n`,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 5000));

          // 2. DONE 이벤트 송출 (id: 21)
          const doneData = JSON.stringify({
            contractId,
            step: "TOXIC_ANALYZING",
            status: "DONE",
          });
          controller.enqueue(
            encoder.encode(`event: progress\nid: 21\ndata: ${doneData}\n\n`),
          );

          controller.close();
        },
      });

      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    },
  ),

  // 진행 상황 전달 API (보고서 작성 중) - SSE Mock
  http.get(
    "/api/contracts/:contractId/progress/report-generation",
    async ({ params }) => {
      const { contractId } = params as { contractId: string };

      // 404 에러 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          { statusCode: 404, message: "CONTRACT_NOT_FOUND", data: null },
          { status: 404 },
        );
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // 1. IN_PROGRESS 이벤트 송출 (id: 30)
          const inProgressData = JSON.stringify({
            contractId,
            step: "REPORT_GENERATION",
            status: "IN_PROGRESS",
          });
          controller.enqueue(
            encoder.encode(
              `event: progress\nid: 30\ndata: ${inProgressData}\n\n`,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 3000));

          // 2. DONE 이벤트 송출 (id: 31)
          const doneData = JSON.stringify({
            contractId,
            step: "REPORT_GENERATION",
            status: "DONE",
          });
          controller.enqueue(
            encoder.encode(`event: progress\nid: 31\ndata: ${doneData}\n\n`),
          );

          // [CRITICAL FIX] SSE가 완료되면 폴링 핸들러도 즉시 완료 상태를 반환하도록 상태 강제 업데이트
          analysisStatusMap.set(contractId, 20); // 15 이상이면 COMPLETED 반환

          controller.close();
        },
      });

      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    },
  ),

  // 계약서 업로드
  http.post("/api/contracts/upload", async ({ request }) => {
    const data = await request.formData();
    const file = data.get("file") as File;
    const filename = data.get("filename") as string;

    if (!file) {
      return HttpResponse.json(
        {
          errorCode: "FILE_NOT_FOUND",
          message: "파일이 없습니다.",
          path: "/api/contracts/upload",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // 업로드 성공 시뮬레이션
    const checkName = filename || file.name;

    // 400 Bad Request 시뮬레이션 (상세 에러 코드 대응)
    const errorEntry = Object.entries({
      "1000": { errorCode: "INVALID_INPUT", message: "잘못된 입력값입니다." },
      "2001": {
        errorCode: "INVALID_FILE_TYPE",
        message: "PDF 파일만 업로드 가능합니다.",
      },
      "2002": {
        errorCode: "INVALID_FILE_SIZE",
        message: "PDF 파일 용량이 제한을 초과했습니다.",
      },
      "2003": {
        errorCode: "MALICIOUS_FILE_DETECTED",
        message: "PDF 처리 중 알 수 없는 오류가 발생했습니다.",
      },
      "2005": {
        errorCode: "PDF_TOO_MANY_PAGES",
        message: "PDF 페이지 수가 제한을 초과했습니다.",
      },
      "3001": {
        errorCode: "PDF_EMPTY_CONTENT",
        message: "PDF에서 추출된 텍스트가 없습니다.",
      },
      "3002": {
        errorCode: "PDF_PASSWORD_PROTECTED",
        message: "비밀번호가 설정된 PDF는 분석할 수 없습니다.",
      },
      "3003": {
        errorCode: "PDF_PARSE_FAILED",
        message: "PDF를 정상적으로 파싱할 수 없습니다.",
      },
      "3004": {
        errorCode: "PDF_NOT_CONTRACT",
        message: "계약서 파일이 아닙니다.",
      },
    }).find(([code]) => checkName.includes(code));

    if (errorEntry) {
      const [code, errorDetail] = errorEntry;
      return HttpResponse.json(
        {
          statusCode: parseInt(code),
          errorCode: errorDetail.errorCode,
          message: errorDetail.message,
          path: "/api/contracts/upload",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // 기본 400 에러 유지
    if (checkName.includes("400")) {
      return HttpResponse.json(
        {
          statusCode: 400,
          errorCode: "INVALID_FILE",
          message: "파일 형식이 올바르지 않거나 손상되었습니다.",
          path: "/api/contracts/upload",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    // 413 Payload Too Large 시뮬레이션
    if (checkName.includes("413")) {
      return HttpResponse.json(
        {
          statusCode: 413,
          errorCode: "FILE_TOO_LARGE",
          message: "파일 크기가 제한을 초과했습니다.",
          path: "/api/contracts/upload",
          timestamp: new Date().toISOString(),
        },
        { status: 413 },
      );
    }

    // 500 Internal Server Error 시뮬레이션
    if (checkName.includes("500")) {
      return HttpResponse.json(
        {
          statusCode: 500,
          errorCode: "SERVER_ERROR",
          message: "서버 내부 오류가 발생했습니다.",
          path: "/api/contracts/upload",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    return HttpResponse.json(
      {
        data: {
          contractId: `c_mock_${Math.random().toString(36).substring(2, 9)}`,
          accessToken: `at_mock_${Math.random().toString(36).substring(2, 9)}`,
          originalFileName: filename || file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  // 분석 보고서 다운로드
  http.get(
    "/api/contracts/:contractId/download/report",
    async ({ request, params }) => {
      const { contractId } = params;
      const accessToken = request.headers.get("X-ACCESS-TOKEN");

      if (!accessToken || contractId === "c_error_401") {
        return HttpResponse.json(
          {
            errorCode: "UNAUTHORIZED",
            message: "인증 토큰이 누락되었습니다.",
            path: `/api/contracts/${contractId}/download/report`,
            timestamp: new Date().toISOString(),
          },
          { status: 401 },
        );
      }

      // 404 Not Found 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          {
            errorCode: "CONTRACT_NOT_FOUND",
            message: "계약서가 없거나 만료되었습니다.",
            path: `/api/contracts/${contractId}/download/report`,
            timestamp: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      // 409 Conflict 시뮬레이션
      if (contractId === "c_error_409") {
        return HttpResponse.json(
          {
            errorCode: "ANALYSIS_NOT_COMPLETED",
            message: "분석이 완료되지 않았습니다.",
            path: `/api/contracts/${contractId}/download/report`,
            timestamp: new Date().toISOString(),
          },
          { status: 409 },
        );
      }

      // 500 Internal Server Error 시뮬레이션
      if (contractId === "c_error_500") {
        return HttpResponse.json(
          {
            errorCode: "INTERNAL_SERVER_ERROR",
            message:
              "서버 내부 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
            path: `/api/contracts/${contractId}/download/report`,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        );
      }

      const minimalPdf = base64ToUint8Array(DUMMY_PDF_BASE64);

      return new HttpResponse(minimalPdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="analysis_report_${contractId}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    },
  ),

  // 하이라이트 보고서 다운로드
  http.get(
    "/api/contracts/:contractId/download/highlight",
    async ({ request, params }) => {
      const { contractId } = params;
      const accessToken = request.headers.get("X-ACCESS-TOKEN");

      if (!accessToken || contractId === "c_error_401") {
        return HttpResponse.json(
          {
            errorCode: "UNAUTHORIZED",
            message: "인증 토큰이 누락되었습니다.",
            path: `/api/contracts/${contractId}/download/highlight`,
            timestamp: new Date().toISOString(),
          },
          { status: 401 },
        );
      }

      // 404 Not Found 시뮬레이션
      if (contractId === "c_error_404") {
        return HttpResponse.json(
          {
            errorCode: "CONTRACT_NOT_FOUND",
            message: "계약서가 없거나 만료되었습니다.",
            path: `/api/contracts/${contractId}/download/highlight`,
            timestamp: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      // 409 Conflict 시뮬레이션
      if (contractId === "c_error_409") {
        return HttpResponse.json(
          {
            errorCode: "ANALYSIS_NOT_COMPLETED",
            message: "분석이 완료되지 않았습니다.",
            path: `/api/contracts/${contractId}/download/highlight`,
            timestamp: new Date().toISOString(),
          },
          { status: 409 },
        );
      }

      // 500 Internal Server Error 시뮬레이션
      if (contractId === "c_error_500") {
        return HttpResponse.json(
          {
            errorCode: "INTERNAL_SERVER_ERROR",
            message:
              "서버 내부 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
            path: `/api/contracts/${contractId}/download/highlight`,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        );
      }

      const minimalPdf = base64ToUint8Array(DUMMY_PDF_BASE64);

      return new HttpResponse(minimalPdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="highlight_contract.pdf"; filename*=UTF-8''${encodeURIComponent("하이라이트_계약서_${contractId}.pdf")}`,
          "Cache-Control": "no-store",
        },
      });
    },
  ),

  // 분석 결과 조회
  http.get("/api/contracts/:contractId/report", async ({ request, params }) => {
    const { contractId } = params as { contractId: string };
    const accessToken = request.headers.get("X-ACCESS-TOKEN");

    // 네트워크 지연 시뮬레이션 (1초)
    await delay(1000);

    // 401 Unauthorized: 접근 토큰 오류
    if (contractId === "c_error_401" || !accessToken) {
      return HttpResponse.json(
        {
          errorCode: "UNAUTHORIZED",
          message: "인증 토큰이 누락되었습니다.",
          path: `/api/contracts/${contractId}/report`,
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }

    // 404 Not Found: 계약서 없음 / 만료
    if (contractId === "c_error_404") {
      return HttpResponse.json(
        {
          errorCode: "CONTRACT_NOT_FOUND",
          message: "계약서가 없거나 만료되었습니다.",
          path: `/api/contracts/${contractId}/report`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );
    }

    // 409 Conflict: 분석 미완료
    if (contractId === "c_error_409") {
      return HttpResponse.json(
        {
          errorCode: "ANALYSIS_NOT_COMPLETED",
          message: "분석이 완료되지 않았습니다.",
          path: `/api/contracts/${contractId}/report`,
          timestamp: new Date().toISOString(),
        },
        { status: 409 },
      );
    }

    // 500 Internal Server Error: 서버 내부 오류 발생
    if (contractId === "c_error_500") {
      return HttpResponse.json(
        {
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "서버 내부 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
          path: `/api/contracts/${contractId}/report`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    // 폴링 시뮬레이션: 20번째 요청부터 COMPLETED 반환 (SSE 흐름이 충분히 진행될 수 있도록 여유를 둠)
    const count = (analysisStatusMap.get(contractId) || 0) + 1;
    analysisStatusMap.set(contractId, count);

    if (count < 8) {
      return HttpResponse.json({
        statusCode: 200,
        message: "분석 중",
        data: {
          contractId,
          status: "ANALYZING",
          fileName: "2026_가맹계약서_원본.pdf",
          reportInfo: null,
          results: [],
          finalChecklist: [], // 초기값 빈 배열
        },
      });
    }

    return HttpResponse.json({
      statusCode: 200,
      message: "분석 완료",
      data: {
        contractId,
        ...MOCK_ANALYSIS_REPORT,
      },
    });
  }),

  // 계약서 즉시 삭제
  http.delete("/api/contracts/:contractId", async ({ request, params }) => {
    const { contractId } = params as { contractId: string };
    const accessToken = request.headers.get("X-ACCESS-TOKEN");

    // 400 Bad Request: 잘못된 삭제 요청
    if (contractId === "c_error_400" || !accessToken) {
      return HttpResponse.json(
        {
          errorCode: "UNAUTHORIZED",
          message: "인증 토큰이 누락되었습니다.",
          data: null,
        },
        { status: 400 },
      );
    }

    // 401 Unauthorized: 접근 토큰 오류
    if (contractId === "c_error_401" || !accessToken) {
      return HttpResponse.json(
        {
          errorCode: "UNAUTHORIZED",
          message: "인증 토큰이 누락되었습니다.",
          data: null,
        },
        { status: 401 },
      );
    }

    // 404 Not Found: 계약서 없음 / 만료
    if (contractId === "c_error_404") {
      return HttpResponse.json(
        {
          statusCode: "CONTRACT_NOT_FOUND",
          message: "계약서가 없거나 만료되었습니다.",
          data: null,
        },
        { status: 404 },
      );
    }

    // 500 Internal Server Error: 서버 내부 오류 발생
    if (contractId === "c_error_500") {
      return HttpResponse.json(
        {
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "서버 내부 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
          data: null,
        },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      statusCode: 0,
      message: "정상 처리 되었습니다.",
      data: {},
    });
  }),
];
