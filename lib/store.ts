import { create } from "zustand";

export type Tab = "report" | "community";
export type Verdict = "safe" | "warning" | "unknown";

export interface Claim {
  id: string;
  text: string;
  verdict: Verdict;
  evidence: string;
  sources: { label: string; url: string }[];
}

export interface WantedCard {
  id: string;
  thumbnail: string;
  claim: string;
  reporterComment: string;
  votesTrue: number;
  votesFake: number;
  userVote?: "true" | "fake";
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  badge?: "verifier" | "reporter";
}

export type AnalysisStatus =
  | "idle"
  | "detecting"
  | "analyzing_transcript"
  | "analyzing_claims"
  | "verifying"
  | "complete";

interface CheckmateState {
  // Panel state
  isPanelOpen: boolean;
  activeTab: Tab;
  isResponseModalOpen: boolean;

  // Warning popup state
  isWarningVisible: boolean;
  warningCount: number;

  // Analysis state
  analysisStatus: AnalysisStatus;

  // Video info
  videoTitle: string;
  channelName: string;
  thumbnail: string;

  // Report data
  trustScore: number;
  overallVerdict: Verdict;
  claims: Claim[];

  // Community data
  wantedCards: WantedCard[];
  chatMessages: ChatMessage[];

  // Per-video state mapping
  videoStates: Record<
    string,
    {
      status: AnalysisStatus;
      verdict: Verdict;
      trustScore: number;
      warningCount: number;
    }
  >;
  currentVideoId: string | null;

  // Actions
  openPanel: () => void;
  closePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  openResponseModal: () => void;
  closeResponseModal: () => void;
  voteOnCard: (cardId: string, vote: "true" | "fake") => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  showWarning: (count: number) => void;
  closeWarning: () => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  startAnalysis: () => void;
  setCurrentVideo: (id: string, title: string, channel: string) => void;
}

export const useCheckmateStore = create<CheckmateState>((set) => ({
  // Initial state
  isPanelOpen: false,
  analysisStatus: "idle",
  videoTitle: "",
  channelName: "",
  thumbnail: "",
  trustScore: 0,
  overallVerdict: "unknown",
  activeTab: "report",
  isResponseModalOpen: false,

  // Warning popup
  isWarningVisible: false,
  warningCount: 2,

  // Per-video storage
  videoStates: {},
  currentVideoId: "1",

  claims: [
    {
      id: "1",
      text: '"이 약만 먹으면 10kg 감량"',
      verdict: "warning",
      evidence:
        "식약처 보도자료(23.05)에 따르면 해당 성분은 체중 감량 효과가 입증되지 않았으며, 오히려 부작용 사례가 보고되었습니다.",
      sources: [
        { label: "식약처 보도자료", url: "#" },
        { label: "관련 기사", url: "#" },
      ],
    },
    {
      id: "2",
      text: '"FDA 승인 제품"',
      verdict: "warning",
      evidence:
        "FDA 공식 데이터베이스에서 해당 제품의 승인 기록을 확인할 수 없습니다.",
      sources: [{ label: "FDA 검색", url: "#" }],
    },
    {
      id: "3",
      text: '"부작용 없음"',
      verdict: "unknown",
      evidence:
        "해당 주장에 대한 충분한 검증 자료가 부족합니다. 커뮤니티 검증이 필요합니다.",
      sources: [],
    },
  ],

  wantedCards: [
    {
      id: "1",
      thumbnail: "/placeholder-wanted-1.jpg",
      claim: '"XX 코인 10배 수익 보장"',
      reporterComment: "사기 같아요. 투자 손실 발생",
      votesTrue: 12,
      votesFake: 85,
    },
    {
      id: "2",
      thumbnail: "/placeholder-wanted-2.jpg",
      claim: '"무료 에어팟 증정 이벤트"',
      reporterComment: "개인정보 피싱 의심됩니다",
      votesTrue: 3,
      votesFake: 142,
    },
  ],

  chatMessages: [
    {
      id: "1",
      username: "검증자K",
      message: "방금 광고 상품 직접 구매해서 확인했는데...",
      timestamp: new Date(),
      badge: "verifier",
    },
    {
      id: "2",
      username: "모니터1",
      message: "이 제품, 다른 플랫폼에서도 말이 많더라요.",
      timestamp: new Date(),
    },
    {
      id: "3",
      username: "팩트체커",
      message: "광고 이미지와 실제 제품을 수 페이 앞저히 다릅니다.",
      timestamp: new Date(),
      badge: "verifier",
    },
    {
      id: "4",
      username: "소비자A",
      message: "저도 이거 당했는데 환불 요청 중이에요.",
      timestamp: new Date(),
      badge: "reporter",
    },
  ],

  // Actions
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openResponseModal: () => set({ isResponseModalOpen: true }),
  closeResponseModal: () => set({ isResponseModalOpen: false }),
  voteOnCard: (cardId, vote) =>
    set((state) => ({
      wantedCards: state.wantedCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              userVote: vote,
              votesTrue: vote === "true" ? card.votesTrue + 1 : card.votesTrue,
              votesFake: vote === "fake" ? card.votesFake + 1 : card.votesFake,
            }
          : card,
      ),
    })),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ],
    })),
  showWarning: (count) => set({ isWarningVisible: true, warningCount: count }),
  closeWarning: () => set({ isWarningVisible: false }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setCurrentVideo: (id, title, channel) =>
    set((state) => {
      const existing = state.videoStates[id];
      return {
        currentVideoId: id,
        videoTitle: title,
        channelName: channel,
        analysisStatus: existing?.status || "idle",
        overallVerdict: existing?.verdict || "unknown",
        trustScore: existing?.trustScore || 0,
        warningCount: existing?.warningCount || 0,
        isWarningVisible: false, // Don't show popup again when just switching videos
      };
    }),
  startAnalysis: () => {
    const videoId = useCheckmateStore.getState().currentVideoId;
    if (!videoId) return;

    set({ analysisStatus: "detecting" });
    setTimeout(() => {
      set({ analysisStatus: "analyzing_transcript" });
      setTimeout(() => {
        set({ analysisStatus: "analyzing_claims" });
        setTimeout(() => {
          set({ analysisStatus: "verifying" });
          setTimeout(() => {
            let finalVerdict: Verdict = "unknown";
            let finalScore = 50;
            let finalWarningCount = 0;
            let videoClaims: Claim[] = [];

            // Assign unique outcomes based on video ID
            if (['1', 'h1', 'h3'].includes(videoId)) {
              finalVerdict = 'safe';
              finalScore = 98;
              videoClaims = [
                { id: 'v1-1', text: '영상 내 주요 사실 정보 일치율', verdict: 'safe', evidence: '영상에서 주장하는 내용이 여러 신뢰할 수 있는 소스와 교차 검증 결과 사실로 확인되었습니다.', sources: [{ label: '검증된 기사', url: '#' }] }
              ];
            } else if (['2', 'h2', 'h4'].includes(videoId)) {
              finalVerdict = 'warning';
              finalScore = 15;
              finalWarningCount = 2;
              videoClaims = [
                { id: 'v2-1', text: '"단 며칠 만에 엄청난 기적을...", 허위 광고 주의', verdict: 'warning', evidence: '사실과 다르게 과장된 효과를 홍보하고 있으며, 공식 기관의 승인을 받지 않은 내용이 포함되었습니다.', sources: [{ label: '소비자 고발 센터 자료', url: '#' }] }
              ];
            } else {
              finalVerdict = 'unknown';
              finalScore = 45;
              videoClaims = [
                { id: 'v3-1', text: '일부 확산 중인 이슈 확인 필요', verdict: 'unknown', evidence: '명확한 공식 데이터를 찾을 수 없어 AI 판단이 어렵습니다. 커뮤니티 투표가 필요합니다.', sources: [] }
              ];
            }

            set((state) => ({
              analysisStatus: "complete",
              isWarningVisible: true, // Always show result popup on completion
              warningCount: finalWarningCount,
              overallVerdict: finalVerdict,
              trustScore: finalScore,
              claims: videoClaims,
              videoStates: {
                ...state.videoStates,
                [videoId]: {
                  status: "complete",
                  verdict: finalVerdict,
                  trustScore: finalScore,
                  warningCount: finalWarningCount,
                },
              },
            }));
          }, 1500);
        }, 1200);
      }, 1000);
    }, 800);
  },
}));
