import { apiFetch } from "@/lib/apiClient";

export interface LoginRequest {
  userid: string;
  password: string;
}

export interface LoginResponse {
  statuscode: number;
  message: string | null;
  accessToken: string;
  username: string;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await apiFetch("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`登入失敗: ${res.status} ${res.statusText}`);
  const data: LoginResponse = await res.json();
  if (data.statuscode !== 200) throw new Error(data.message || "登入失敗");
  return data;
}
