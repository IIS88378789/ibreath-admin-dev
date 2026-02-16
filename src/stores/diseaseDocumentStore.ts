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
  {
    id: 3,
    name: "病人參與與個人資料蒐集、處理及利用同意書",
    disease: "氣喘",
    category: "同意書",
    fields: [
      { id: 1, name: "病患簽名", type: "文字輸入", description: "病患本人簽名" },
      { id: 2, name: "同意資料蒐集", type: "勾選框", description: "勾選表示同意個人資料之蒐集與利用" },
    ],
    content: "<h2>大臺中醫師公會 P4P 慢性病照護平台</h2><p>本同意書旨在告知您有關個人資料蒐集、處理及利用之相關事項。依據個人資料保護法，我們將妥善保管您的個人資料，並僅於醫療照護目的範圍內使用。</p><h3>一、蒐集目的</h3><p>為提供您完善的慢性病照護服務，需蒐集您的基本資料及健康相關資訊。</p><h3>二、資料類別</h3><ul><li>基本個人資料（姓名、出生日期、聯絡方式）</li><li>健康檢查及醫療紀錄</li><li>用藥紀錄</li></ul><h3>三、利用期間及地區</h3><p>於照護服務期間內，在中華民國境內合法使用。</p>",
    createdAt: "2025-03-01",
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
