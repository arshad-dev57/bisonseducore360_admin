"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Briefcase,
  BadgeCheck,
  Hourglass,
  Ban,
} from "lucide-react";
import { platformApi, type SchoolListItem, ApiError } from "@/lib/api";

type Stats = {
  totalSchools: number;
  totalStudents: number;
  totalEmployees: number;
  activeSubscriptions: number;
  trialSchools: number;
  expiredSchools: number;
  deactivatedSchools?: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<SchoolListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await platformApi.dashboard();
        if (cancelled) return;
        setStats(data.stats);
        setRecent(data.recentSchools);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: "Registered schools", value: stats?.totalSchools, Icon: Building2, tone: "bg-indigo-50 text-indigo-700" },
    { label: "Students (all)", value: stats?.totalStudents, Icon: GraduationCap, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Employees (all)", value: stats?.totalEmployees, Icon: Briefcase, tone: "bg-sky-50 text-sky-700" },
    { label: "Active plans", value: stats?.activeSubscriptions, Icon: BadgeCheck, tone: "bg-violet-50 text-violet-700" },
    { label: "On trial", value: stats?.trialSchools, Icon: Hourglass, tone: "bg-amber-50 text-amber-700" },
    { label: "Expired", value: stats?.expiredSchools, Icon: Ban, tone: "bg-rose-50 text-rose-700" },
    { label: "Deactivated", value: stats?.deactivatedSchools ?? 0, Icon: Ban, tone: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[14px] text-slate-500">
          Overview of schools registered on BisonsEduCore360.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map(({ label, value, Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[12px] text-slate-500">{label}</p>
                <p className="text-xl font-bold">{loading ? "…" : value ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="text-[15px] font-semibold">Recent schools</h2>
          <Link href="/schools" className="text-[13px] font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <p className="px-4 py-8 text-center text-[13px] text-slate-500">Loading…</p>
          ) : recent.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-slate-500">No schools registered yet.</p>
          ) : (
            recent.map((s) => (
              <Link
                key={s.id}
                href={`/schools/${s.id}`}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 sm:px-5"
              >
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-[12px] font-bold text-indigo-700">
                  {s.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    s.name.slice(0, 2).toUpperCase()
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{s.name}</p>
                  <p className="truncate text-[12px] text-slate-500">
                    {s.city}, {s.country} · {s.ownerName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    s.subscription?.active
                      ? s.subscription.isTrial
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {s.subscription?.status || "EXPIRED"}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
