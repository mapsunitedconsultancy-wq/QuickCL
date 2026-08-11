import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../api";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";

import {
  FileText,
  TrendingUp,
  Target,
  Clock,
  Upload,
  ArrowRight,
  Search,
  ShieldCheck,
  Award,
  Zap,
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

        const total = res.data.total || 0;

        const avgAcc = items.length
          ? (
              items.reduce((s, e) => s + (e.accuracy_score || 0), 0) /
              items.length
            ).toFixed(1)
          : 0;

        setStats({
          total,
          thisMonth: items.length,
          avgAccuracy: avgAcc,
        });
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
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">

      {/* ================= HERO ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-8 shadow-xl border border-blue-800">

        <div className="relative z-10 max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300">

            <Zap size={14} />

            AI Document Extraction Engine Active

          </div>

          <h1 className="mt-5 text-4xl font-black text-white">

            Welcome back
            {user?.firmName ? `, ${user.firmName}` : ""}

          </h1>

          <p className="mt-3 text-sm text-slate-300 leading-6">

            Extract Commercial Invoices, Packing Lists, Bills of Lading and
            generate customs-ready data with high accuracy.

          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/extract")}
              className="flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-teal-300"
            >
              <Upload size={17} />

              Start New Extraction
            </button>

            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
            >
              View History
            </button>

          </div>

        </div>

      </div>

      {/* ================= STATS ================= */}

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* LEFT SIDE */}

        <div className="space-y-5 lg:col-span-2">

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">

                  <Clock className="text-blue-900" size={20} />

                  Recent Extractions

                </h2>

                <p className="mt-1 text-xs text-slate-500">

                  Open any extraction to view the complete results.

                </p>

              </div>

              <div className="relative w-full sm:w-64">

                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-900"
                />

              </div>

            </div>
              {loading ? (
              <div className="flex items-center justify-center py-16 text-sm text-slate-500">
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

                    <tr className="border-b bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">

                      <th className="px-6 py-4 text-left">
                        Job Number
                      </th>

                      <th className="px-6 py-4 text-left">
                        Type
                      </th>

                      <th className="px-6 py-4 text-center">
                        Accuracy
                      </th>

                      <th className="px-6 py-4 text-center">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredExtractions.map((ext) => (

                      <tr
                        key={ext.id}
                        className="transition hover:bg-blue-50/40"
                      >

                        <td className="px-6 py-4">

                          <div className="font-bold text-blue-900">

                            {ext.job_number}

                          </div>

                          <div className="mt-1 text-[11px] text-slate-500">

                            {new Date(ext.created_at).toLocaleString("en-IN")}

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              ext.doc_type === "BOE"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {ext.doc_type}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-center">

                          <span className="font-bold text-emerald-700">

                            {ext.accuracy_score?.toFixed(1)}%

                          </span>

                        </td>

                        <td className="px-6 py-4 text-center text-slate-500">

                          {new Date(ext.created_at).toLocaleDateString("en-IN")}

                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              navigate(`/results/${ext.id}`)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
                          >

                            Open

                            <ArrowRight size={14} />

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

        {/* ================= RIGHT PANEL ================= */}

        <div className="space-y-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-lg font-black text-slate-900">

              Workspace Overview

            </h3>

            <div className="space-y-4">

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">

                  Current Plan

                </div>

                <div className="mt-2 text-2xl font-black text-blue-900">

                  {user?.plan?.toUpperCase() || "DEMO"}

                </div>

                <div className="mt-1 text-xs text-slate-600">

                  {user?.extractionsUsed || 0} extractions used

                </div>

              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">

                  Average Accuracy

                </div>

                <div className="mt-2 text-3xl font-black text-emerald-700">

                  {stats.avgAccuracy}%

                </div>

                <div className="mt-1 text-xs text-slate-600">

                  Based on your latest extractions

                </div>

              </div>

              <button
                onClick={() => navigate("/extract")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 px-5 py-4 font-bold text-white transition hover:shadow-lg"
              >

                <Upload size={18} />

                Start New Extraction

              </button>

              <button
                onClick={() => navigate("/history")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
              >

                View Full History

                <ArrowRight size={16} />

              </button>

            </div>

          </div>

         </div>

      </div>

    </div>
  );
}