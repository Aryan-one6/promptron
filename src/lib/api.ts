const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type ApiOptions = RequestInit & { json?: unknown };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    body: json ? JSON.stringify(json) : undefined,
    ...rest
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(payload.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, json?: unknown) =>
    apiFetch<T>(path, { method: "POST", json }),
  patch: <T>(path: string, json?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", json }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" })
};
