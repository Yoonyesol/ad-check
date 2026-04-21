import { create } from 'zustand'

export type Tab = 'report' | 'community'
export type Verdict = 'safe' | 'warning' | 'unknown'

export interface Claim {
  id: string
  text: string
  verdict: Verdict
  evidence: string
  sources: { label: string; url: string }[]
}

export interface WantedCard {
  id: string
  thumbnail: string
  claim: string
  reporterComment: string
  votesTrue: number
  votesFake: number
  userVote?: 'true' | 'fake'
}

export interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  badge?: 'verifier' | 'reporter'
}

export type AnalysisStatus = 
  | 'idle' 
  | 'detecting' 
  | 'analyzing_transcript' 
  | 'analyzing_claims' 
  | 'verifying' 
  | 'complete'

interface CheckmateState {
  // Panel state
  isPanelOpen: boolean
  activeTab: Tab
  isResponseModalOpen: boolean
  
  // Warning popup state
  isWarningVisible: boolean
  warningCount: number
  
  // Analysis state
  analysisStatus: AnalysisStatus
  
  // Video info
  videoTitle: string
  channelName: string
  thumbnail: string
  
  // Report data
  trustScore: number
  overallVerdict: Verdict
  claims: Claim[]
  
  // Community data
  wantedCards: WantedCard[]
  chatMessages: ChatMessage[]
  
  // Per-video state mapping
  videoStates: Record<string, {
    status: AnalysisStatus
    verdict: Verdict
    trustScore: number
    warningCount: number
  }>
  currentVideoId: string | null
  
  // Actions
  openPanel: () => void
  closePanel: () => void
  setActiveTab: (tab: Tab) => void
  openResponseModal: () => void
  closeResponseModal: () => void
  voteOnCard: (cardId: string, vote: 'true' | 'fake') => void
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  showWarning: (count: number) => void
  closeWarning: () => void
  setAnalysisStatus: (status: AnalysisStatus) => void
  startAnalysis: () => void
  setCurrentVideo: (id: string, title: string, channel: string) => void
}

export const useCheckmateStore = create<CheckmateState>((set) => ({
  // Initial state
  isPanelOpen: false,
  analysisStatus: 'idle',
  videoTitle: '',
  channelName: '',
  thumbnail: '',
  trustScore: 0,
  overallVerdict: 'unknown',
  activeTab: 'report',
  isResponseModalOpen: false,
  
  // Warning popup
  isWarningVisible: false,
  warningCount: 2,
  
  // Per-video storage
  videoStates: {},
  currentVideoId: '1',
  
  claims: [
    {
      id: '1',
      text: '"이 약만 먹으면 10kg 감량"',
      verdict: 'warning',
      evidence: '식약처 보도자료(23.05)에 따르면 해당 성분은 체중 감량 효과가 입증되지 않았으며, 오히려 부작용 사례가 보고되었습니다.',
      sources: [
        { label: '식약처 보도자료', url: '#' },
        { label: '관련 기사', url: '#' }
      ]
    },
    {
      id: '2',
      text: '"FDA 승인 제품"',
      verdict: 'warning',
      evidence: 'FDA 공식 데이터베이스에서 해당 제품의 승인 기록을 확인할 수 없습니다.',
      sources: [
        { label: 'FDA 검색', url: '#' }
      ]
    },
    {
      id: '3',
      text: '"부작용 없음"',
      verdict: 'unknown',
      evidence: '해당 주장에 대한 충분한 검증 자료가 부족합니다. 커뮤니티 검증이 필요합니다.',
      sources: []
    }
  ],
  
  wantedCards: [
    {
      id: '1',
      thumbnail: '/placeholder-wanted-1.jpg',
      claim: '"XX 코인 10배 수익 보장"',
      reporterComment: '사기 같아요. 투자 손실 발생',
      votesTrue: 12,
      votesFake: 85
    },
    {
      id: '2',
      thumbnail: '/placeholder-wanted-2.jpg',
      claim: '"무료 에어팟 증정 이벤트"',
      reporterComment: '개인정보 피싱 의심됩니다',
      votesTrue: 3,
      votesFake: 142
    }
  ],
  
  chatMessages: [
    {
      id: '1',
      username: '검증자K',
      message: '방금 광고 상품 직접 구매해서 확인했는데...',
      timestamp: new Date(),
      badge: 'verifier'
    },
    {
      id: '2',
      username: '모니터1',
      message: '이 제품, 다른 플랫폼에서도 말이 많더라요.',
      timestamp: new Date()
    },
    {
      id: '3',
      username: '팩트체커',
      message: '광고 이미지와 실제 제품을 수 페이 앞저히 다릅니다.',
      timestamp: new Date(),
      badge: 'verifier'
    },
    {
      id: '4',
      username: '소비자A',
      message: '저도 이거 당했는데 환불 요청 중이에요.',
      timestamp: new Date(),
      badge: 'reporter'
    }
  ],
  
  // Actions
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openResponseModal: () => set({ isResponseModalOpen: true }),
  closeResponseModal: () => set({ isResponseModalOpen: false }),
  voteOnCard: (cardId, vote) => set((state) => ({
    wantedCards: state.wantedCards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            userVote: vote,
            votesTrue: vote === 'true' ? card.votesTrue + 1 : card.votesTrue,
            votesFake: vote === 'fake' ? card.votesFake + 1 : card.votesFake
          }
        : card
    )
  })),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [
      ...state.chatMessages,
      { ...message, id: Date.now().toString(), timestamp: new Date() }
    ]
  })),
  showWarning: (count) => set({ isWarningVisible: true, warningCount: count }),
  closeWarning: () => set({ isWarningVisible: false }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setCurrentVideo: (id, title, channel) => set((state) => {
    const existing = state.videoStates[id];
    return {
      currentVideoId: id,
      videoTitle: title,
      channelName: channel,
      analysisStatus: existing?.status || 'idle',
      overallVerdict: existing?.verdict || 'unknown',
      trustScore: existing?.trustScore || 0,
      warningCount: existing?.warningCount || 0,
      isWarningVisible: false // Don't show popup again when just switching videos
    };
  }),
  startAnalysis: () => {
    const videoId = useCheckmateStore.getState().currentVideoId;
    if (!videoId) return;

    set({ analysisStatus: 'detecting' })
    setTimeout(() => {
      set({ analysisStatus: 'analyzing_transcript' })
      setTimeout(() => {
        set({ analysisStatus: 'analyzing_claims' })
        setTimeout(() => {
          set({ analysisStatus: 'verifying' })
          setTimeout(() => {
            let finalVerdict: Verdict = 'unknown';
            let finalScore = 50;
            let finalWarningCount = 0;
            let videoClaims: Claim[] = [];

            // Assign unique outcomes based on video ID
            if (videoId === '1') {
              finalVerdict = 'safe';
              finalScore = 98;
              videoClaims = [
                { id: 'v1-1', text: '김고은 본인 등판 여부', verdict: 'safe', evidence: '공식 채널의 비하인드 영상과 대조 결과, 배우 김고은이 직접 시구에 참여한 사실이 확인되었습니다.', sources: [{ label: 'MBC Sports 공식', url: '#' }] }
              ];
            } else if (videoId === '2') {
              finalVerdict = 'warning';
              finalScore = 15;
              finalWarningCount = 2;
              videoClaims = [
                { id: 'v2-1', text: '"일주일 10kg 감량" 주작 여부', verdict: 'warning', evidence: '의학적으로 일주일 10kg 감량은 불가능하며, 해당 약품은 식약처 미승인 성분을 포함하고 있습니다.', sources: [{ label: '식약처 자료', url: '#' }] }
              ];
            } else {
              finalVerdict = 'unknown';
              finalScore = 45;
              videoClaims = [
                { id: 'v3-1', text: '세금 전면 폐지 공약 확인', verdict: 'unknown', evidence: '정부의 공식 발표 자료에는 해당 내용이 없으나, 특정 커뮤니티에서 확산 중입니다. 추가 검증이 필요합니다.', sources: [] }
              ];
            }

            set((state) => ({ 
              analysisStatus: 'complete', 
              isWarningVisible: true, // Always show result popup on completion
              warningCount: finalWarningCount, 
              overallVerdict: finalVerdict,
              trustScore: finalScore,
              claims: videoClaims,
              videoStates: {
                ...state.videoStates,
                [videoId]: {
                  status: 'complete',
                  verdict: finalVerdict,
                  trustScore: finalScore,
                  warningCount: finalWarningCount
                }
              }
            }))
          }, 1500)
        }, 1200)
      }, 1000)
    }, 800)
  },
}))
