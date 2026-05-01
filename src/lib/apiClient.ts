import { getToken, removeToken, removeUsername } from "@/lib/auth";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

export function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function checkAuthRedirect(response: Response): void {
  if (response.status === 401) {
    removeToken();
    removeUsername();
    window.location.href = "/login";
    throw new Error("未授權，請重新登入");
  }
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });
  checkAuthRedirect(response);
  return response;
}
