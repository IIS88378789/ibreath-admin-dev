import { apiFetch } from "@/lib/apiClient";

// ---------- 共用型別 ----------

export interface BaseResponse {
  statuscode: number;
  message: string | null;
}

// ---------- 使用者列表 ----------

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  clinicname: string;
  rolename: string;
  jobTitle: string;
  status: boolean;
}

export interface UserListRequest {
  username?: string;
  roleid?: number;
  clinicid?: number;
  orderby?: number;
  desc?: boolean;
  page?: number;
  pagesize?: number;
}

export interface UserListResponse {
  userName: string;
  roleid: number;
  clinicid: number;
  orderby: number;
  desc: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  userCount: number;
  userList: UserListItem[];
  statuscode: number | null;
  message: string | null;
}

export async function fetchUserList(params: UserListRequest = {}): Promise<UserListResponse> {
  const query = new URLSearchParams();
  if (params.username !== undefined) query.set("username", params.username);
  if (params.roleid !== undefined) query.set("roleid", String(params.roleid));
  if (params.clinicid !== undefined) query.set("clinicid", String(params.clinicid));
  if (params.orderby !== undefined) query.set("orderby", String(params.orderby));
  if (params.desc !== undefined) query.set("desc", String(params.desc));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.pagesize !== undefined) query.set("pagesize", String(params.pagesize));
  const qs = query.toString();
  const res = await apiFetch(`/api/cms/getuserlist${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`使用者列表取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 使用者詳細 ----------

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  clinicId: number | null;
  jobTitle: string;
  status: boolean;
  statuscode?: number;
  message?: string | null;
}

export async function fetchUser(id: number): Promise<UserDetail> {
  const res = await apiFetch(`/api/cms/getuser?id=${id}`);
  if (!res.ok) throw new Error(`使用者資料取得失敗: ${res.status}`);
  return res.json();
}

// ---------- 啟用狀態切換 ----------

export async function toggleUserStatus(id: number): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/userstatuschange", {
    method: "PUT",
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`狀態切換失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "狀態切換失敗");
  return data;
}

// ---------- 新增使用者 ----------

export interface UserCreateRequest {
  username: string;
  email: string;
  jobtitle: string;
  clinicid: number | null;
  roleid: number;
}

export async function createUser(body: UserCreateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/usercreate", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`新增使用者失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "新增使用者失敗");
  return data;
}

// ---------- 修改使用者 ----------

export interface UserUpdateRequest {
  id: number;
  username: string;
  jobtitle: string;
}

export async function updateUser(body: UserUpdateRequest): Promise<BaseResponse> {
  const res = await apiFetch("/api/cms/userupdate", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`使用者更新失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "使用者更新失敗");
  return data;
}

// ---------- 刪除使用者 ----------

export async function deleteUser(id: number): Promise<BaseResponse> {
  const res = await apiFetch(`/api/cms/userdelete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`刪除使用者失敗: ${res.status}`);
  const data: BaseResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "刪除使用者失敗");
  return data;
}
