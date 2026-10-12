"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ApiError, platformApi, type SchoolListItem } from "@/lib/api";

export default function SchoolsPage() {
  const [q, setQ] = useState("");
  const [schools, setSchools] = useState<SchoolListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await platformApi.schools(q);
        if (!cancelled) setSchools(res.schools);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load schools.");
          setSchools([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schools</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            All institutions registered on your main app.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, city…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[14px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(180px,1.4fr)_140px_120px_100px_100px_110px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-[12px] font-medium text-slate-500 md:grid">
          <span>School</span>
          <span>Owner</span>
          <span>City</span>
          <span>Students</span>
          <span>Users</span>
          <span>Status</span>
        </div>

        {loading ? (
          <p className="px-4 py-10 text-center text-[13px] text-slate-500">Loading schools…</p>
        ) : schools.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-slate-500">No schools found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {schools.map((s) => (
              <Link
                key={s.id}
                href={`/schools/${s.id}`}
                className="grid gap-2 px-4 py-3 transition hover:bg-slate-50 md:grid-cols-[minmax(180px,1.4fr)_140px_120px_100px_100px_110px] md:items-center md:gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold">{s.name}</p>
                  <p className="truncate text-[12px] text-slate-500">{s.email}</p>
                </div>
                <p className="truncate text-[13px] text-slate-700">{s.ownerName}</p>
                <p className="truncate text-[13px] text-slate-700">
                  {s.city}
                  <span className="text-slate-400">, {s.country}</span>
                </p>
                <p className="text-[13px] font-medium">{s.students}</p>
                <p className="text-[13px] font-medium">{s.users}</p>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
