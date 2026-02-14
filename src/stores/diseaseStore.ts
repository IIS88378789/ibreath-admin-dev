import { create } from "zustand";

export interface Disease {
  id: number;
  order: number;
  name: string;
  category: string;
}

interface DiseaseStore {
  diseases: Disease[];
  addDisease: (disease: Omit<Disease, "id">) => void;
  updateDisease: (id: number, updates: Partial<Disease>) => void;
  deleteDisease: (id: number) => void;
}

const initialDiseases: Disease[] = [
  { id: 1, order: 1, name: "氣喘", category: "氣喘" },
  { id: 2, order: 2, name: "慢性阻塞性肺病", category: "肺阻塞" },
  { id: 3, order: 3, name: "過敏性氣喘", category: "氣喘" },
  { id: 4, order: 4, name: "肺氣腫", category: "肺阻塞" },
  { id: 5, order: 5, name: "慢性支氣管炎", category: "肺阻塞" },
];

export const useDiseaseStore = create<DiseaseStore>((set, get) => ({
  diseases: initialDiseases,
  addDisease: (disease) => {
    const { diseases } = get();
    const newId = Math.max(0, ...diseases.map((d) => d.id)) + 1;
    set({ diseases: [...diseases, { ...disease, id: newId }] });
  },
  updateDisease: (id, updates) => {
    set({ diseases: get().diseases.map((d) => (d.id === id ? { ...d, ...updates } : d)) });
  },
  deleteDisease: (id) => {
    set({ diseases: get().diseases.filter((d) => d.id !== id) });
  },
}));
