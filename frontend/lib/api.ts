const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const buildApiUrl = (path: string) =>
  `${API_URL}/${path.replace(/^\/+/, "")}`;

// ─── Server-side fetch (SSR / SSG) ──────────────────────────────────────────
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Next.js cache options
    next: options.next as NextFetchRequestConfig,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Client-side fetch (with auth token) ────────────────────────────────────
export async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    const stored = localStorage.getItem("accessToken");
    if (stored) headers["Authorization"] = `Bearer ${stored}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return data;
}

// ─── SSR Product Fetchers ────────────────────────────────────────────────────
export async function getProductsSSR(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return serverFetch(`/api/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
}

export async function getProductSSR(id: string) {
  return serverFetch(`/api/products/${id}`, {
    next: { revalidate: 300 }, // cache 5 min
  });
}

export async function getFeaturedProductsSSR() {
  return serverFetch("/api/products/featured", {
    next: { revalidate: 120 },
  });
}

export async function getCategoriesSSR() {
  return serverFetch("/api/products/categories", {
    next: { revalidate: 3600 }, // cache 1 hour
  });
}

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};
