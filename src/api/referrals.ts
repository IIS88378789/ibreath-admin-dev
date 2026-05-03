import { apiFetch } from "@/lib/apiClient";

// ---------- 共用型別 ----------

export interface BaseResponse {
  statuscode: number;
  message: string | null;
}

// ---------- 轉介診所列表 ----------

export interface ReferralListItem {
  id: number;
  name: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralListResponse {
  sname: string;
  referralList: ReferralListItem[];
  statuscode: number | null;
  message: string | null;
}

export async function fetchReferralList(sname?: string): Promise<ReferralListResponse> {
  const query = new URLSearchParams();
  if (sname) query.set("Sname", sname);
  const qs = query.toString();
  const res = await apiFetch(`/api/cms/GetReferralList${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`轉介診所列表取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 轉介診所新增 ----------

export interface ReferralCreateRequest {
  Name: string;
  sort: string;
}

export async function createReferral(body: ReferralCreateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/referralcreate", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`新增轉介診所失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "新增轉介診所失敗");
  return data;
}

// ---------- 轉介診所修改 ----------

export interface ReferralUpdateRequest {
  id: number;
  Name: string;
  sort: string;
}

export async function updateReferral(body: ReferralUpdateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/referralupdate", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`轉介診所更新失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "轉介診所更新失敗");
  return data;
}
