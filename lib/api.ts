import { API_URL, TOKEN_KEY } from "./config";

export type PlatformAdmin = {
  email: string;
  name: string;
  role: string;
};

export type SubscriptionPayload = {
  id: string | null;
  plan: string | null;
  status: string;
  active: boolean;
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
  startedAt: string | null;
  expiresAt: string | null;
};

export type SchoolListItem = {
  id: string;
  name: string;
  shortName: string | null;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  logoUrl: string | null;
  /** Platform kill-switch — false means the school cannot sign in. */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  branches: number;
  users: number;
  students: number;
  employees: number;
  subscription: SubscriptionPayload;
};

export type SchoolDetail = {
  id: string;
  name: string;
  shortName: string | null;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string | null;
  website: string | null;
  motto: string | null;
  principal: string | null;
  academicSession: string | null;
  instituteNo: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  counts: {
    users: number;
    students: number;
    employees: number;
    branches: number;
    classes: number;
    feeInvoices: number;
  };
  branches: Array<{
    id: string;
    name: string;
    code: string;
    city: string | null;
    phone: string | null;
    status: string;
    isMain: boolean;
    createdAt: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    panel: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
  }>;
  subscriptions: SubscriptionPayload[];
  subscription: SubscriptionPayload;
};

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    // ignore
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status);
  }
  return json.data;
}

export const platformApi = {
  login: (email: string, password: string, remember = true) =>
    request<{ token: string; admin: PlatformAdmin }>("/platform/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
    }),

  me: () => request<{ admin: PlatformAdmin }>("/platform/auth/me"),

  logout: () =>
    request<{ loggedOut: boolean }>("/platform/auth/logout", { method: "POST" }),

  dashboard: () =>
    request<{
      stats: {
        totalSchools: number;
        totalStudents: number;
        totalEmployees: number;
        activeSubscriptions: number;
        trialSchools: number;
        expiredSchools: number;
        deactivatedSchools?: number;
      };
      recentSchools: SchoolListItem[];
    }>("/platform/dashboard"),

  schools: (q?: string) => {
    const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    return request<{ schools: SchoolListItem[]; total: number }>(`/platform/schools${qs}`);
  },

  school: (id: string) =>
    request<{ school: SchoolDetail }>(`/platform/schools/${id}`),

  setSchoolActive: (id: string, isActive: boolean) =>
    request<{ school: SchoolDetail }>(`/platform/schools/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),

  extendTrial: (id: string, days = 5) =>
    request<{ school: SchoolDetail }>(`/platform/schools/${id}/extend-trial`, {
      method: "POST",
      body: JSON.stringify({ days }),
    }),

  setPlan: (id: string, plan: "MONTHLY" | "YEARLY") =>
    request<{ school: SchoolDetail }>(`/platform/schools/${id}/set-plan`, {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
};
