import { create } from "zustand";

export interface FormField {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface DiseaseDocument {
  id: number;
  name: string;
  disease: string;
  category: "表單" | "同意書";
  fields: FormField[];
  content?: string; // rich text content for consent forms
  createdAt: string;
}

interface DiseaseDocumentStore {
  documents: DiseaseDocument[];
  addDocument: (doc: Omit<DiseaseDocument, "id" | "createdAt">) => void;
  updateDocument: (id: number, doc: Partial<DiseaseDocument>) => void;
  deleteDocument: (id: number) => void;
}

const initialDocuments: DiseaseDocument[] = [
  {
    id: 1,
    name: "氣喘評估表",
    disease: "氣喘",
    category: "表單",
    fields: [
      { id: 1, name: "症狀頻率", type: "單選", description: "過去一週的症狀發生頻率" },
      { id: 2, name: "用藥次數", type: "數字", description: "每日使用吸入器次數" },
    ],
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    name: "肺功能檢測紀錄",
    disease: "慢性阻塞性肺病",
    category: "表單",
    fields: [
      { id: 1, name: "FEV1", type: "數字", description: "第一秒用力呼氣量" },
      { id: 2, name: "FVC", type: "數字", description: "用力肺活量" },
      { id: 3, name: "檢測日期", type: "日期", description: "進行檢測的日期" },
    ],
    createdAt: "2025-02-05",
  },
];

export const useDiseaseDocumentStore = create<DiseaseDocumentStore>((set, get) => ({
  documents: initialDocuments,
  addDocument: (doc) => {
    const { documents } = get();
    const newId = Math.max(0, ...documents.map((d) => d.id)) + 1;
    set({
      documents: [
        ...documents,
        { ...doc, id: newId, createdAt: new Date().toISOString().slice(0, 10) },
      ],
    });
  },
  updateDocument: (id, updates) => {
    set({
      documents: get().documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    });
  },
  deleteDocument: (id) => {
    set({ documents: get().documents.filter((d) => d.id !== id) });
  },
}));
