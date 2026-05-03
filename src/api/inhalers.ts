import { apiFetch } from "@/lib/apiClient";

// ---------- 共用型別 ----------

export interface BaseResponse {
  statuscode: number;
  message: string | null;
}

// ---------- 吸入器分類列表 ----------

export interface InhalerCategoryItem {
  id: number;
  sort: number;
  name: string;
}

export async function fetchInhalerCategoryList(): Promise<InhalerCategoryItem[]> {
  const res = await apiFetch("/api/cms/getinhalergplist");
  if (!res.ok) throw new Error(`吸入器分類列表取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 吸入器分類新增 ----------

export interface InhalerCategoryCreateRequest {
  name: string;
  sort: number;
}

export async function createInhalerCategory(body: InhalerCategoryCreateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/inhalergpcreate", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`新增吸入器分類失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "新增吸入器分類失敗");
  return data;
}

// ---------- 吸入器分類修改 ----------

export interface InhalerCategoryUpdateRequest {
  id: number;
  name: string;
  sort: number;
}

export async function updateInhalerCategory(body: InhalerCategoryUpdateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/inhalergpupdate", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`吸入器分類更新失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "吸入器分類更新失敗");
  return data;
}

// ---------- 吸入器分類刪除 ----------

export async function deleteInhalerCategory(id: number): Promise<BaseResponse> {
  const res = await apiFetch(`/api/cms/inhalergpdelete/${id}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(`刪除吸入器分類失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "刪除吸入器分類失敗");
  return data;
}

// ---------- 吸入器類型列表 ----------

export interface InhalerTypeItem {
  id: number;
  sort: number;
  name: string;
  inhalergpid: number;
  inhalergpName: string;
}

export interface InhalerTypeListRequest {
  name?: string;
  inhalergpid?: number;
}

export async function fetchInhalerTypeList(params: InhalerTypeListRequest = {}): Promise<InhalerTypeItem[]> {
  const query = new URLSearchParams();
  if (params.name !== undefined) query.set("name", params.name);
  if (params.inhalergpid !== undefined) query.set("inhalergpid", String(params.inhalergpid));
  const qs = query.toString();
  const res = await apiFetch(`/api/cms/getinhalertypelist${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`吸入器類型列表取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 吸入器類型新增 ----------

export interface InhalerTypeCreateRequest {
  name: string;
  sort: number;
  Inhalergpid: number;
}

export async function createInhalerType(body: InhalerTypeCreateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/inhalertypecreate", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`新增吸入器失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "新增吸入器失敗");
  return data;
}

// ---------- 吸入器類型修改 ----------

export interface InhalerTypeUpdateRequest {
  id: number;
  name: string;
  sort: number;
  Inhalergpid: number;
}

export async function updateInhalerType(body: InhalerTypeUpdateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/inhalertypeupdate", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`吸入器更新失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "吸入器更新失敗");
  return data;
}

// ---------- 吸入器類型刪除 ----------

export async function deleteInhalerType(id: number): Promise<BaseResponse> {
  const res = await apiFetch(`/api/cms/inhalertypedelete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`刪除吸入器失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "刪除吸入器失敗");
  return data;
}
