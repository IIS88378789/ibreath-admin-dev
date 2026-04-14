import { create } from "zustand";

export interface InhalerCategory {
  id: number;
  name: string;
  order: number;
}

export interface Inhaler {
  id: number;
  order: number;
  name: string;
  category: string;
}

interface InhalerStore {
  categories: InhalerCategory[];
  inhalers: Inhaler[];
  addCategory: (cat: Omit<InhalerCategory, "id">) => void;
  updateCategory: (id: number, updates: Partial<InhalerCategory>) => void;
  deleteCategory: (id: number) => void;
  addInhaler: (inhaler: Omit<Inhaler, "id">) => void;
  updateInhaler: (id: number, updates: Partial<Inhaler>) => void;
  deleteInhaler: (id: number) => void;
}

const initialCategories: InhalerCategory[] = [
  { id: 1, name: "乾粉吸入器", order: 1 },
  { id: 2, name: "定量噴霧吸入器", order: 2 },
  { id: 3, name: "軟霧吸入器", order: 3 },
];

const initialInhalers: Inhaler[] = [
  { id: 1, order: 1, name: "使肺泰 Seretide", category: "乾粉吸入器" },
  { id: 2, order: 2, name: "肺舒坦 Foster", category: "定量噴霧吸入器" },
  { id: 3, order: 3, name: "潤娃易利達 Relvar", category: "乾粉吸入器" },
  { id: 4, order: 5, name: "吸必擴 Rapihaler", category: "定量噴霧吸入器" },
  { id: 5, order: 6, name: "舒利迭 Symbicort", category: "乾粉吸入器" },
  { id: 6, order: 7, name: "倍樂 Berodual", category: "軟霧吸入器" },
];

export const useInhalerStore = create<InhalerStore>((set, get) => ({
  categories: initialCategories,
  inhalers: initialInhalers,
  addCategory: (cat) => {
    const { categories } = get();
    const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
    set({ categories: [...categories, { ...cat, id: newId }] });
  },
  updateCategory: (id, updates) => {
    set({ categories: get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) });
  },
  deleteCategory: (id) => {
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },
  addInhaler: (inhaler) => {
    const { inhalers } = get();
    const newId = Math.max(0, ...inhalers.map((i) => i.id)) + 1;
    set({ inhalers: [...inhalers, { ...inhaler, id: newId }] });
  },
  updateInhaler: (id, updates) => {
    set({ inhalers: get().inhalers.map((i) => (i.id === id ? { ...i, ...updates } : i)) });
  },
  deleteInhaler: (id) => {
    set({ inhalers: get().inhalers.filter((i) => i.id !== id) });
  },
}));
