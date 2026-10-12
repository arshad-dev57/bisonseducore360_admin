"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, Mail, MapPin, Phone, Globe } from "lucide-react";
import { ApiError, platformApi, type SchoolDetail } from "@/lib/api";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="max-w-[65%] text-right text-[13px] font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}

export default function SchoolDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await platformApi.school(id);
        if (!cancelled) setSchool(res.school);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load school.");
          setSchool(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="py-16 text-center text-[13px] text-slate-500">Loading school…</p>;
  }

  if (error || !school) {
    return (
      <div className="space-y-4">
        <Link href="/schools" className="inline-flex items-center gap-1 text-[13px] text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to schools
        </Link>
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error || "School not found."}
        </p>
      </div>
    );
  }

  const counts = [
    { label: "Students", value: school.counts.students },
    { label: "Employees", value: school.counts.employees },
    { label: "Users", value: school.counts.users },
    { label: "Branches", value: school.counts.branches },
    { label: "Classes", value: school.counts.classes },
    { label: "Invoices", value: school.counts.feeInvoices },
  ];

  return (
    <div className="space-y-5">
      <Link href="/schools" className="inline-flex items-center gap-1 text-[13px] text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to schools
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">
          {school.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={school.logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-7 w-7" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight">{school.name}</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            {school.shortName ? `${school.shortName} · ` : ""}
            Owned by {school.ownerName}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {school.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {school.phone}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {school.city}, {school.country}
            </span>
            {school.website ? (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {school.website}
              </span>
            ) : null}
          </div>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
            school.subscription?.active
              ? school.subscription.isTrial
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {school.subscription?.status || "EXPIRED"}
          {school.subscription?.daysRemaining != null
            ? ` · ${school.subscription.daysRemaining}d left`
            : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
            <p className="text-[11px] text-slate-500">{c.label}</p>
            <p className="mt-0.5 text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-2 text-[15px] font-semibold">Profile</h2>
          <Row label="Principal" value={school.principal} />
          <Row label="Session" value={school.academicSession} />
          <Row label="Institute No" value={school.instituteNo} />
          <Row label="Motto" value={school.motto} />
          <Row label="Address" value={school.address} />
          <Row label="Registered" value={new Date(school.createdAt).toLocaleString()} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-2 text-[15px] font-semibold">Subscription</h2>
          <Row label="Plan" value={school.subscription?.plan} />
          <Row label="Status" value={school.subscription?.status} />
          <Row
            label="Started"
            value={
              school.subscription?.startedAt
                ? new Date(school.subscription.startedAt).toLocaleDateString()
                : "—"
            }
          />
          <Row
            label="Expires"
            value={
              school.subscription?.expiresAt
                ? new Date(school.subscription.expiresAt).toLocaleDateString()
                : "—"
            }
          />
          <Row label="Days left" value={school.subscription?.daysRemaining ?? 0} />
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="text-[15px] font-semibold">Branches</h2>
        </div>
        {school.branches.length === 0 ? (
          <p className="px-4 py-6 text-[13px] text-slate-500">No branches.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {school.branches.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div>
                  <p className="text-[14px] font-medium">
                    {b.name}{" "}
                    <span className="text-[12px] font-normal text-slate-400">({b.code})</span>
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {b.city || "—"} {b.isMain ? "· Main campus" : ""}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="text-[15px] font-semibold">Users</h2>
        </div>
        {school.users.length === 0 ? (
          <p className="px-4 py-6 text-[13px] text-slate-500">No users.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {school.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{u.name}</p>
                  <p className="truncate text-[12px] text-slate-500">
                    {u.email} · {u.role} · {u.panel}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
