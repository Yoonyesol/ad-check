import { create } from "zustand";

interface DrawerData {
  id: string;
  title: string;
  content: string;
  law: string;
  advice: string;
  negotiationScript: string;
}

interface DrawerStore {
  isOpen: boolean;
  data: DrawerData | null;
  openDrawer: (data: DrawerData) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  data: null,
  openDrawer: (data) => set({ isOpen: true, data }),
  closeDrawer: () => set({ isOpen: false }),
}));
