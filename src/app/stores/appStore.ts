// src/app/stores/appStore.ts
import { create } from "zustand";

interface AppState {
  // ── 상태 ────────────────────────────────────────────────────────────────────
  region: "central" | "west";
  isNavExpanded: boolean;
  isUpdating: boolean;
  lastUpdated: string;
  dbLastUpdated: string;

  // ── 액션 ────────────────────────────────────────────────────────────────────
  setRegion: (region: "central" | "west") => void;
  setIsNavExpanded: (expanded: boolean) => void;
  setLastUpdated: (time: string) => void;
  setDbLastUpdated: (date: string) => void;
  handleUpdate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // ── 초기값 ──────────────────────────────────────────────────────────────────
  region: "central",
  isNavExpanded: false,
  isUpdating: false,
  lastUpdated: "",
  dbLastUpdated: "",

  // ── 액션 구현 ────────────────────────────────────────────────────────────────
  setRegion: (region) => set({ region }),
  setIsNavExpanded: (isNavExpanded) => set({ isNavExpanded }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  setDbLastUpdated: (dbLastUpdated) => set({ dbLastUpdated }),

  handleUpdate: async () => {
    set({ isUpdating: true });
    // 실제 API 연동 시 fetch 호출로 교체
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    set({ dbLastUpdated: `${year}-${month}-${day}`, isUpdating: false });
  },
}));
