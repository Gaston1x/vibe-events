const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("vibe:token");
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("No pudimos conectar con el servidor. Las cuentas aún no están disponibles en la demo pública; intenta más tarde.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo completar la solicitud.");
  }

  return data;
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function updatePreferences(payload) {
  return request("/auth/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAccount(payload) {
  return request("/auth/me", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}
