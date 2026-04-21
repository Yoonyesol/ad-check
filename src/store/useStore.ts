import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";

const STORAGE_SECRET_KEY =
  import.meta.env.VITE_STORAGE_SECRET_KEY || "bareun-gyeyak-secure-key";

const encryptedSessionStorage = {
  getItem: (name: string): string | null => {
    const str = sessionStorage.getItem(name);
    if (!str) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(str, STORAGE_SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (error) {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        value,
        STORAGE_SECRET_KEY,
      ).toString();
      sessionStorage.setItem(name, encrypted);
    } catch (error) {}
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isAudio?: boolean;
  clauseId?: number;
}

interface AppState {
  file: File | null;
  setFile: (file: File | null) => void;

  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;

  contractId: string | null;
  setContractId: (id: string | null) => void;

  accessToken: string | null;
  setAccessToken: (token: string | null) => void;

  currentView: "home" | "analyzing" | "result" | "chat";
  setCurrentView: (view: "home" | "analyzing" | "result" | "chat") => void;

  hasTypedSummary: boolean;
  setHasTypedSummary: (typed: boolean) => void;

  pollingCount: number;
  setPollingCount: (count: number | ((prev: number) => number)) => void;

  isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;

  resetAnalysisData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      file: null,
      setFile: (file) =>
        set({
          file,
          hasTypedSummary: false,
          contractId: null,
          accessToken: null,
          pollingCount: 0,
        }),

      isAnalyzing: false,
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),

      contractId: null,
      setContractId: (contractId) => set({ contractId }),

      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),

      currentView: "home",
      setCurrentView: (view) => set({ currentView: view }),

      hasTypedSummary: false,
      setHasTypedSummary: (hasTypedSummary) => set({ hasTypedSummary }),

      pollingCount: 0,
      setPollingCount: (count) =>
        set((state) => ({
          pollingCount:
            typeof count === "function" ? count(state.pollingCount) : count,
        })),

      isHydrated: false,
      setIsHydrated: (isHydrated) => set({ isHydrated }),

      resetAnalysisData: () =>
        set({
          file: null,
          contractId: null,
          accessToken: null,
          isAnalyzing: false,
          hasTypedSummary: false,
          chatMessages: [],
          pollingCount: 0,
        }),
    }),
    {
      name: "analysis-storage",
      storage: createJSONStorage(() => encryptedSessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
      partialize: (state) => ({
        contractId: state.contractId,
        accessToken: state.accessToken,
        isAnalyzing: state.isAnalyzing,
        pollingCount: state.pollingCount,
      }),
    },
  ),
);
