"use client";

import { clientFetch } from "./api";
import type { AuthResponse, User } from "@/types";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveAuth(accessToken: string, refreshToken: string, user: User) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const data = await clientFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveAuth(data.accessToken, data.refreshToken, data.user);
  return data;
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await clientFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveAuth(data.accessToken, data.refreshToken, data.user);
  return data;
}

export async function logoutUser() {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  try {
    await clientFetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } catch (_) {}
  clearAuth();
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) return null;
  try {
    const data = await clientFetch<{ accessToken: string; refreshToken: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    clearAuth();
    return null;
  }
}
