import { apiFetch } from "@/lib/apiClient";

// ---------- 共用型別 ----------

export interface ClinicListItem {
  id: number;
  name: string;
  count: number;
}

export interface DiseasegroupItem {
  disabled: boolean;
  group: null;
  selected: boolean;
  text: string;
  value: string;
}

export interface SalesListItem {
  disabled: boolean;
  group: null;
  selected: boolean;
  text: string;
  value: string;
}

export interface ClinicDetail {
  id: number;
  isTcma: boolean;
  name: string;
  idNumber: string;
  saleId: number;
  reserveUrl: string | null;
  lineChannelId: string;
  lineChannelSecret: string;
  lineChannelToken: string;
  lineLoginId: string;
  lineLoginSecret: string;
  webHook: string;
  lineLoginCallBack: string;
  questionnaireURL: string;
  diseasegroupItems: DiseasegroupItem[];
  diseasegroupids: string[] | null;
  statuscode: number;
  message: string | null;
}

export interface ClinicCreateRequest {
  IsTcma: boolean;
  Name: string;
  IdNumber: string;
  SaleId: number;
  LineChannelId: string;
  LineChannelSecret: string;
  LineLoginId: string;
  LineLoginSecret: string;
  LineChannelToken: string;
  Diseasegroupids: string[];
}

export interface ClinicUpdateRequest {
  Id: number;
  IsTcma: boolean;
  Name: string;
  IdNumber: string;
  SaleId: number;
  LineChannelId: string;
  LineChannelSecret: string;
  LineLoginId: string;
  LineLoginSecret: string;
  LineChannelToken: string;
  Diseasegroupids: string[];
}

export interface BaseResponse {
  statuscode: number;
  message: string | null;
}

// ---------- 診所列表 ----------

export async function fetchClinicList(name?: string): Promise<ClinicListItem[]> {
  const params = name ? `?name=${encodeURIComponent(name)}` : "";
  const res = await apiFetch(`/api/cms/getcliniclist${params}`);
  if (!res.ok) throw new Error(`診所列表取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 診所詳細 ----------

export async function fetchClinic(id: number): Promise<ClinicDetail> {
  const res = await apiFetch(`/api/cms/getclinic?id=${id}`);
  if (!res.ok) throw new Error(`診所資料取得失敗: ${res.status}`);
  const data: ClinicDetail = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "診所資料取得失敗");
  return data;
}

// ---------- 新增診所 ----------

export async function createClinic(body: ClinicCreateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/cliniccreate", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`新增診所失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "新增診所失敗");
  return data;
}

// ---------- 編輯診所 ----------

export async function updateClinic(body: ClinicUpdateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/clinicupdate", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`診所更新失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "診所更新失敗");
  return data;
}

// ---------- 刪除診所 ----------

export async function deleteClinic(id: number): Promise<BaseResponse> {
  const res = await apiFetch(`/api/cms/ClinicDelete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`刪除診所失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "刪除診所失敗");
  return data;
}

// ---------- 業務組別選單 ----------

export async function fetchSalesList(): Promise<SalesListItem[]> {
  const res = await apiFetch("/api/cms/GetSalesList");
  if (!res.ok) throw new Error(`業務組別取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 疾病群組選單 ----------

export async function fetchDiseasesGroupList(): Promise<DiseasegroupItem[]> {
  const res = await apiFetch("/api/cms/GetDiseasesGroupList");
  if (!res.ok) throw new Error(`疾病群組取得失敗: ${res.status}`);
  const data: { id: number; name: string }[] = await res.json();
  return data.map((d) => ({
    value: String(d.id),
    text: d.name,
    selected: false,
    disabled: false,
    group: null,
  }));
}
