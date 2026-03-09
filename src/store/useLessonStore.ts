import { create } from "zustand";

interface LessonStore {
  activeTopic: string | null;
  setActiveTopic: (topic: string | null) => void;
}

// creates the global store to manage the active lesson topic
export const useLessonStore = create<LessonStore>((set) => ({
  activeTopic: null,
  setActiveTopic: (topic) => set({ activeTopic: topic }),
}));