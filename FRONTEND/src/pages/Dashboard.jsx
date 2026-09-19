import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../api";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";

import {
  FileText,
  TrendingUp,
  Clock,
  Upload,
  ArrowRight,
  Search,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    avgAccuracy: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getHistory(1)
      .then((res) => {
        const items = res.data.extractions || [];

        setRecent(items.slice(0, 5));

        if (res.data.stats) {
          setStats(res.data.stats);
        } else {
          const total = res.data.total || 0;
          setStats({
            total,
            thisMonth: items.length,
            avgAccuracy: 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredExtractions = recent.filter((ext) => {
    const search = searchTerm.toLowerCase();

    return (
      ext.job_number?.toLowerCase().includes(search) ||
      ext.doc_type?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#34c759]/30 bg-[#34c759]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            Document Extraction Engine Active
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            Welcome back{user?.firmName ? `, ${user.firmName}` : ""}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Extract Commercial Invoices, Packing Lists, Bills of Lading and
            generate customs-ready data with high accuracy.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/extract")}
              className="flex items-center gap-2 rounded-[14px] bg-[#007aff] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98]"
            >
              <Upload size={16} strokeWidth={2.2} />
              Start New Extraction
            </button>

            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-3 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
            >
              View History
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS WIDGETS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={FileText}
          label="Total Extractions"
          value={stats.total}
          color="blue"
        />

        <StatsCard
          icon={TrendingUp}
          label="This Month"
          value={stats.thisMonth}
          color="green"
        />

        <StatsCard
          icon={Award}
          label="Avg Accuracy"
          value={`${stats.avgAccuracy}%`}
          color="gold"
        />

        <StatsCard
          icon={ShieldCheck}
          label="Plan"
          value={user?.plan?.toUpperCase() || "DEMO"}
          color="purple"
          sub={`${user?.extractionsUsed || 0} extractions used`}
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: RECENT EXTRACTIONS */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-[rgba(60,60,67,0.1)] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#1c1c1e]">
                  <Clock className="text-[#007aff]" size={20} strokeWidth={2.2} />
                  Recent Extractions
                </h2>
                <p className="mt-0.5 text-xs text-[#48484a]">
                  Open any extraction to view the complete results.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3.5 top-3 text-[#636366]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search extractions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-2 pl-9 pr-4 text-sm text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-sm text-[#48484a]">
                Loading recent extractions...
              </div>
            ) : filteredExtractions.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No Extractions Found"
                  message="Upload your first invoice to begin extracting data."
                  action="Start Extracting"
                  onAction={() => navigate("/extract")}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                      <th className="px-6 py-3.5 text-left">Job Number</th>
                      <th className="px-6 py-3.5 text-left">Type</th>
                      <th className="px-6 py-3.5 text-center">Accuracy</th>
                      <th className="px-6 py-3.5 text-center">Created</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[rgba(60,60,67,0.06)]">
                    {filteredExtractions.map((ext) => (
                      <tr
                        key={ext.id}
                        className="transition hover:bg-[#f9f9fb]/80"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#1c1c1e]">
                            {ext.job_number}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#636366]">
                            {new Date(ext.created_at).toLocaleString("en-IN")}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              ext.result_type === "scanned"
                                ? "bg-[#5856d6]/10 text-[#5856d6] border border-[#5856d6]/20"
                                : ext.doc_type === "BOE"
                                ? "bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20"
                                : ext.doc_type === "SB"
                                ? "bg-[#34c759]/10 text-[#28a745] border border-[#34c759]/20"
                                : "bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20"
                            }`}
                          >
                            {ext.result_type === "scanned"
                              ? `SCANNED ${ext.doc_type}`
                              : ext.doc_type}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-[#34c759]">
                            {ext.accuracy_score != null
                              ? `${ext.accuracy_score.toFixed(1)}%`
                              : "--"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center text-[#48484a]">
                          {new Date(ext.created_at).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                ext.result_type === "image"
                                  ? `/image-results/${ext.id}`
                                  : ext.result_type === "scanned"
                                  ? `/scanned-results/${ext.id}`
                                  : `/results/${ext.id}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#007aff] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-95"
                          >
                            Open
                            <ArrowRight size={13} strokeWidth={2.2} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: WORKSPACE OVERVIEW */}
        <div className="space-y-5">
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h3 className="mb-4 text-lg font-bold text-[#1c1c1e] tracking-tight">
              Workspace Overview
            </h3>

            <div className="space-y-3.5">
              <div className="rounded-[14px] border border-[rgba(60,60,67,0.08)] bg-[#f9f9fb] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#007aff]">
                  Current Plan
                </div>
                <div className="mt-1 text-2xl font-bold tracking-tight text-[#1c1c1e]">
                  {user?.plan?.toUpperCase() || "DEMO"}
                </div>
                <div className="mt-0.5 text-xs text-[#636366]">
                  {user?.extractionsUsed || 0} extractions used
                </div>
              </div>

              <div className="rounded-[14px] border border-[rgba(60,60,67,0.08)] bg-[#f9f9fb] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#34c759]">
                  Average Accuracy
                </div>
                <div className="mt-1 text-2xl font-bold tracking-tight text-[#1c1c1e]">
                  {stats.total > 0 && stats.avgAccuracy != null
                    ? `${stats.avgAccuracy}%`
                    : "--"}
                </div>
                <div className="mt-0.5 text-xs text-[#636366]">
                  Based on your latest extractions
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => navigate("/extract")}
                  className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#007aff] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98]"
                >
                  <Upload size={16} strokeWidth={2.2} />
                  Start New Extraction
                </button>

                <button
                  onClick={() => navigate("/history")}
                  className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.12)] bg-[#f2f2f7] px-4 py-3.5 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
                >
                  View Full History
                  <ArrowRight size={15} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
