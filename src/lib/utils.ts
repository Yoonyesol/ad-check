import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAnalysisText(text: string): string {
  if (!text) return "";

  // 1. 번호 및 주요 키워드 앞 줄바꿈 (특히, 추가)
  let formatted = text
    .trim()
    .replace(/([①-⑳]|\d+\.(?=[^0-9])|다만,|단,|따라서,|특히,)/g, "\n$1");

  // 2. 문장 끝 줄바꿈 - 법률 용어 약어(원. 부재료 등) 오작동 방지
  // 2글자 이상의 한글 뒤 마침표와 공백이 있고, 그 뒤에 새로운 내용이 올 때만 분리
  formatted = formatted.replace(/([가-힣]{2,}\.)\s+(?=[가-힣①-⑳\d])/g, "$1\n");

  // 3. 계층형 스타일 및 시각적 들여쓰기 적용
  let indentSize = ""; // 기본 들여쓰기
  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Level 1: ① 형태 (최상위)
      if (/^[①-⑳]/.test(line)) {
        indentSize = "    "; // 이 번호에 속한 다음 문장들의 들여쓰기
        return line;
      }
      // Level 2: 1. 형태 (중간)
      if (/^\d+\./.test(line)) {
        indentSize = "     "; // 이 번호에 속한 다음 문장들의 들여쓰기
        return "    " + line; // 번호 자체를 들여씀
      }
      // 일반 문장 (현재 단계의 들여쓰기 적용)
      return indentSize + line;
    })
    .join("\n");
}

export type AnalysisSegment = {
  type: "text" | "quote" | "law";
  content: string;
};

/**
 * 분석 텍스트를 파싱하여 강조 스타일링이 필요한 세그먼트로 분리합니다.
 * 1. '...' 형태의 따옴표 강조
 * 2. 가맹사업법, 동법 시행령 제13조 등 법령 조항 하이라이트
 */
export function parseAnalysisSegments(line: string): AnalysisSegment[] {
  if (!line) return [];

  // 법령 및 조항 정규표현식: [법이름]법/동법 (시행령/시행규칙 등) 제[숫자]조...
  // (?:\s+[가-힣]+)? 을 통해 시행령, 시행규칙, 시행규칙등 등 중간에 한 단어가 더 올수 있도록 처리함
  const lawRegex =
    /(?:[가-힣]+법|동법)(?:\s+[가-힣]+)?\s+제\d+조(?:제\d+항)*(?:제\d+호)*(?:제\d+목)*/g;
  // 따옴표 정규표현식: '...', ❛...❜, ‘...’, “...” 모두 지원
  const quoteRegex = /'[^']+'|❛[^❜]*❜|‘[^’]*’|“[^”]*”/g;

  // 전체 매칭 리스트 생성
  const matches: {
    start: number;
    end: number;
    type: "quote" | "law";
    content: string;
  }[] = [];

  let match;
  while ((match = lawRegex.exec(line)) !== null) {
    matches.push({
      start: match.index,
      end: lawRegex.lastIndex,
      type: "law",
      content: match[0],
    });
  }

  // lawRegex 리셋 (exec 사용 시 필요)
  lawRegex.lastIndex = 0;

  while ((match = quoteRegex.exec(line)) !== null) {
    matches.push({
      start: match.index,
      end: quoteRegex.lastIndex,
      type: "quote",
      content: match[0],
    });
  }

  // 겹치는 구간 처리 및 정렬 (시작 인덱스 기준)
  matches.sort((a, b) => a.start - b.start);

  const segments: AnalysisSegment[] = [];
  let lastIndex = 0;

  for (const m of matches) {
    if (m.start < lastIndex) continue; // 이미 처리된 구간은 건너뜀

    // 일반 텍스트 추가
    if (m.start > lastIndex) {
      segments.push({
        type: "text",
        content: line.substring(lastIndex, m.start),
      });
    }

    // 강조 세그먼트 추가
    segments.push({ type: m.type, content: m.content });
    lastIndex = m.end;
  }

  // 남은 텍스트 추가
  if (lastIndex < line.length) {
    segments.push({ type: "text", content: line.substring(lastIndex) });
  }

  return segments;
}
