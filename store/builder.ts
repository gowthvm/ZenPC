import { create } from 'zustand';

export type Part = Record<string, any>;
export type SelectedParts = Record<string, Part | undefined>;

interface BuilderState {
  selected: SelectedParts;
  setPart: (category: string, part: Part) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  selected: {},
  setPart: (category, part) => set((state) => ({
    selected: { ...state.selected, [category]: part },
  })),
  reset: () => set({ selected: {} }),
}));
