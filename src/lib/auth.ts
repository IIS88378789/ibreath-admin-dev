const TOKEN_KEY = "ibreath_admin_token";
const USERNAME_KEY = "ibreath_admin_username";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function removeUsername(): void {
  localStorage.removeItem(USERNAME_KEY);
}

export function logout(): void {
  removeToken();
  removeUsername();
}
