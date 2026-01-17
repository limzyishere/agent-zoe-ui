const API_URL = import.meta.env.VITE_API_URL;

export const TOKEN_KEY = "auth_token";

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/property/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);

  return true;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
