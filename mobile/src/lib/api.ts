// API client for the ZERIVE backend (Vercel serverless + Neon Postgres).
// Web is same-origin (relative /api); native uses the absolute production URL.

import { Platform } from 'react-native';

const BASE = Platform.OS === 'web' ? '' : 'https://zerive-app.vercel.app';

let authToken: string | null = null;
export function setApiToken(token: string | null) { authToken = token; }

async function req<T>(path: string, opts: { method?: string; body?: unknown; token?: string } = {}): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  const token = opts.token ?? authToken;
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`api ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface AuthResult {
  token: string;
  user: { id: string; phone: string; name: string | null };
  onboarded: boolean;
  hasReport: boolean;
}

export const api = {
  requestOtp: (phone: string) => req<{ ok: boolean }>('/auth/request-otp', { method: 'POST', body: { phone } }),
  verifyOtp: (phone: string, code: string, name?: string) =>
    req<AuthResult>('/auth/verify-otp', { method: 'POST', body: { phone, code, name } }),
  me: (token?: string) => req<any>('/me', { token }),
  saveProfile: (body: unknown, token?: string) => req<{ ok: boolean }>('/profile', { method: 'PUT', body, token }),
  report: (token?: string) => req<any>('/report', { token }),
  biomarkers: (token?: string) => req<{ markers: any[] }>('/biomarkers', { token }),
  plan: (token?: string) => req<{ plan: any[] }>('/plan', { token }),
  togglePlan: (stepId: string, token?: string) =>
    req<{ done: boolean }>('/plan/toggle', { method: 'POST', body: { stepId }, token }),
  documents: (token?: string) => req<{ documents: any[] }>('/documents', { token }),
  checkoutComplete: (body: unknown, token?: string) =>
    req<{ ok: boolean; checkups: number; score: number }>('/checkout/complete', { method: 'POST', body, token }),
  ai: (q: string, lang: string, token?: string) =>
    req<{ answer: string }>('/ai', { method: 'POST', body: { q, lang }, token }),
};
