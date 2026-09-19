import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../api";
import StatsCard from "../components/StatsCard";
import EmptyState from "../components/EmptyState";

import {
  Clock,
  ArrowRight,
  Search,
  Filter,
  FileText,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Scan,
  X,
} from "lucide-react";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [extractions, setExtractions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [counts, setCounts] = useState({
    boe: 0,
    sb: 0,
    image: 0,
    scanned: 0,
    all: 0,
  });

  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    avgAccuracy: 0,
  });

  // Debounce search term input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch extraction records
  const fetchData = useCallback(
    (p = 1, type = "", search = "", isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      getHistory(p, type, search)
        .then((res) => {
          const items = res.data.extractions || [];
          setExtractions(items);
          setTotal(res.data.total || 0);

          if (res.data.counts) {
            setCounts(res.data.counts);
          }

          if (res.data.stats) {
            setStats(res.data.stats);
          }
        })
        .catch((err) => {
          console.error("Failed to load history:", err);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    []
  );

  useEffect(() => {
    fetchData(page, typeFilter, debouncedSearch);
  }, [fetchData, page, typeFilter, debouncedSearch]);

  const handleManualRefresh = () => {
    fetchData(page, typeFilter, debouncedSearch, true);
  };

  const handleOpenExtraction = (ext) => {
    if (ext.result_type === "image") {
      navigate(`/image-results/${ext.id}`);
    } else if (ext.result_type === "scanned") {
      navigate(`/scanned-results/${ext.id}`);
    } else {
      navigate(`/results/${ext.id}`);
    }
  };

  const totalPages = Math.ceil(total / 20) || 1;

  const filterTabs = [
    { label: "All Records", value: "", count: counts.all },
    { label: "Bill of Entry (BOE)", value: "BOE", count: counts.boe },
    { label: "Shipping Bill (SB)", value: "SB", count: counts.sb },
    { label: "Scanned PDF", value: "SCANNED", count: counts.scanned },
    { label: "Images", value: "IMAGE", count: counts.image },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ================= HERO BANNER (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <Clock size={14} className="text-[#007aff]" strokeWidth={2.2} />
            Historical Audit Trail & Extraction Archive
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            Extraction History
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Review, inspect, and export your previous document extractions across
            Bills of Entry, Shipping Bills, and Vision OCR records.
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
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-3 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                strokeWidth={2.2}
                className={refreshing ? "animate-spin text-[#007aff]" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh Records"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS SUMMARY WIDGETS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={FileText}
          label="Total Extractions"
          value={counts.all ?? stats.total ?? total}
          color="blue"
          sub="All processed documents"
        />

        <StatsCard
          icon={TrendingUp}
          label="Bill of Entry (BOE)"
          value={counts.boe ?? 0}
          color="green"
          sub="Import customs filings"
        />

        <StatsCard
          icon={Award}
          label="Shipping Bill (SB)"
          value={counts.sb ?? 0}
          color="purple"
          sub="Export customs filings"
        />

        <StatsCard
          icon={Scan}
          label="Scanned & Images"
          value={(counts.scanned || 0) + (counts.image || 0)}
          color="gold"
          sub="Vision & OCR extractions"
        />
      </div>

      {/* ================= FILTER & SEARCH BAR ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Document Type Filter Tabs (Apple HIG Segmented Pills) */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = typeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setTypeFilter(tab.value);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-[0.97] ${
                    isActive
                      ? "bg-[#007aff] text-white shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
                      : "bg-[#f2f2f7] text-[#48484a] hover:text-[#1c1c1e] hover:bg-[#e5e5ea] border border-transparent"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[rgba(60,60,67,0.08)] text-[#1c1c1e]"
                    }`}
                  >
                    {tab.count ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input matching Dashboard */}
          <div className="relative w-full lg:w-72">
            <Search
              className="absolute left-3.5 top-3 text-[#636366]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search job number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-2.5 pl-9 pr-9 text-sm text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-[#636366] hover:text-[#1c1c1e] transition"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= EXTRACTIONS TABLE CARD ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Table Top Header */}
        <div className="flex flex-col gap-4 border-b border-[rgba(60,60,67,0.1)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1c1c1e]">
              <Clock className="text-[#007aff]" size={20} strokeWidth={2.2} />
              Extraction Records
            </h2>
            <p className="mt-0.5 text-xs text-[#48484a]">
              {total > 0
                ? `Showing ${extractions.length} of ${total} total records. Click any row to view complete results.`
                : "Manage and inspect previous extraction jobs."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 rounded-[12px] border border-[rgba(60,60,67,0.12)] bg-[#f2f2f7] px-3.5 py-2 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-95 disabled:opacity-50"
              title="Refresh table"
            >
              <RefreshCw
                size={13}
                strokeWidth={2.2}
                className={refreshing ? "animate-spin text-[#007aff]" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#007aff]/10 text-[#007aff] mb-3">
              <RefreshCw size={22} className="animate-spin" strokeWidth={2.2} />
            </div>
            <p className="text-sm font-semibold text-[#1c1c1e]">
              Loading extractions...
            </p>
            <p className="mt-1 text-xs text-[#636366]">
              Fetching your records from the server
            </p>
          </div>
        ) : extractions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={
                searchTerm || typeFilter
                  ? "No matching records"
                  : "No Extractions Found"
              }
              message={
                searchTerm || typeFilter
                  ? "No extractions matched your current filter or search criteria. Try clearing them to see all records."
                  : "Upload your first commercial invoice or shipping bill to generate customs-ready records."
              }
              action={
                searchTerm || typeFilter
                  ? "Clear All Filters"
                  : "Start New Extraction"
              }
              onAction={() => {
                if (searchTerm || typeFilter) {
                  setSearchTerm("");
                  setTypeFilter("");
                  setPage(1);
                } else {
                  navigate("/extract");
                }
              }}
            />
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                    <th className="px-6 py-3.5 text-left">Job Number</th>
                    <th className="px-6 py-3.5 text-left">Document Type</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-center">Accuracy</th>
                    <th className="px-6 py-3.5 text-center">Processed Date</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[rgba(60,60,67,0.06)]">
                  {extractions.map((ext) => (
                    <tr
                      key={`${ext.result_type || "pdf"}-${ext.id}`}
                      onClick={() => handleOpenExtraction(ext)}
                      className="cursor-pointer transition hover:bg-[#f9f9fb]/80"
                    >
                      {/* Job Number & Metadata */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1c1c1e]">
                          {ext.job_number || "Unnamed Extraction"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#636366]">
                          ID #{ext.id}
                          {ext.extraction_time_ms
                            ? ` • ${(ext.extraction_time_ms / 1000).toFixed(1)}s`
                            : ""}
                        </div>
                      </td>

                      {/* Document Type Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            ext.result_type === "scanned"
                              ? "bg-[#5856d6]/10 text-[#5856d6] border border-[#5856d6]/20"
                              : ext.doc_type === "BOE"
                              ? "bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20"
                              : ext.doc_type === "SB"
                              ? "bg-[#34c759]/10 text-[#28a745] border border-[#34c759]/20"
                              : ext.doc_type === "IMAGE" ||
                                ext.result_type === "image"
                              ? "bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20"
                              : "bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20"
                          }`}
                        >
                          {ext.result_type === "scanned"
                            ? `SCANNED ${ext.doc_type || "PDF"}`
                            : ext.doc_type || "PDF"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            ext.status === "completed"
                              ? "bg-[#34c759]/10 text-[#28a745] border border-[#34c759]/25"
                              : ext.status === "error"
                              ? "bg-[#ff3b30]/10 text-[#ff3b30] border border-[#ff3b30]/25"
                              : "bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/25"
                          }`}
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              ext.status === "completed"
                                ? "bg-[#34c759]"
                                : ext.status === "error"
                                ? "bg-[#ff3b30]"
                                : "bg-[#ff9500]"
                            }`}
                          />
                          {ext.status
                            ? ext.status.charAt(0).toUpperCase() +
                              ext.status.slice(1)
                            : "Completed"}
                        </span>
                      </td>

                      {/* Accuracy Score */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-semibold ${
                            (ext.accuracy_score || 0) >= 90
                              ? "text-[#34c759]"
                              : (ext.accuracy_score || 0) >= 75
                              ? "text-[#007aff]"
                              : "text-[#ff9500]"
                          }`}
                        >
                          {ext.accuracy_score != null
                            ? `${ext.accuracy_score.toFixed(1)}%`
                            : "--"}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 text-center">
                        <div className="text-xs text-[#1c1c1e] font-medium">
                          {new Date(ext.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-[11px] text-[#636366]">
                          {new Date(ext.created_at).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>

                      {/* Open Action Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenExtraction(ext);
                          }}
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

            {/* Mobile Card List (Below 768px - Responsive without horizontal scroll) */}
            <div className="divide-y divide-[rgba(60,60,67,0.08)] md:hidden">
              {extractions.map((ext) => (
                <div
                  key={`m-${ext.result_type || "pdf"}-${ext.id}`}
                  onClick={() => handleOpenExtraction(ext)}
                  className="p-5 transition active:bg-[#f9f9fb] cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm text-[#1c1c1e]">
                        {ext.job_number || "Unnamed Extraction"}
                      </div>
                      <div className="text-[11px] text-[#636366] mt-0.5">
                        ID #{ext.id} •{" "}
                        {new Date(ext.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenExtraction(ext);
                      }}
                      className="inline-flex items-center gap-1 rounded-[10px] bg-[#007aff] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-95 shrink-0"
                    >
                      Open
                      <ArrowRight size={12} strokeWidth={2.2} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[rgba(60,60,67,0.06)] text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
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
                        ? `SCANNED ${ext.doc_type || "PDF"}`
                        : ext.doc_type || "PDF"}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#48484a]">
                        Accuracy:{" "}
                        <strong className="text-[#1c1c1e]">
                          {ext.accuracy_score != null
                            ? `${ext.accuracy_score.toFixed(1)}%`
                            : "--"}
                        </strong>
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          ext.status === "completed"
                            ? "bg-[#34c759]/10 text-[#28a745]"
                            : ext.status === "error"
                            ? "bg-[#ff3b30]/10 text-[#ff3b30]"
                            : "bg-[#ff9500]/10 text-[#ff9500]"
                        }`}
                      >
                        {ext.status || "completed"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#48484a]">
                  Showing{" "}
                  <span className="font-semibold text-[#1c1c1e]">
                    {(page - 1) * 20 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#1c1c1e]">
                    {Math.min(page * 20, total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#1c1c1e]">{total}</span>{" "}
                  records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1.5 rounded-[12px] border border-[rgba(60,60,67,0.15)] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#f2f2f7] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} strokeWidth={2.2} />
                    Previous
                  </button>

                  <span className="px-2 text-xs font-semibold text-[#48484a]">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1.5 rounded-[12px] border border-[rgba(60,60,67,0.15)] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#f2f2f7] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
