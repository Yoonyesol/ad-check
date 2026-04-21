import { create } from "zustand";

type ModalType = "alert" | "confirm" | "tip";

interface ModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: ModalType;
  // Tip specific
  icon?: string;
  color?: string;
  lawClause?: string;
  isCompleted?: boolean;
}

interface ModalState {
  isOpen: boolean;
  options: ModalOptions;
  showAlert: (options: Omit<ModalOptions, "type">) => void;
  showConfirm: (options: Omit<ModalOptions, "type">) => void;
  showTip: (options: Omit<ModalOptions, "type">) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  options: {
    message: "",
    type: "alert",
  },
  showAlert: (options) =>
    set({
      isOpen: true,
      options: { ...options, type: "alert" },
    }),
  showConfirm: (options) =>
    set({
      isOpen: true,
      options: { ...options, type: "confirm" },
    }),
  showTip: (options) =>
    set({
      isOpen: true,
      options: { ...options, type: "tip" },
    }),
  closeModal: () => set({ isOpen: false }),
}));
