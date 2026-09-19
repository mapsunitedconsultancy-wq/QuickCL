import { useState } from 'react';
import { searchHSCodes } from '../api';
import CopyButton from '../components/CopyButton';
import {
  Search,
  Database,
  Loader2,
  FileSearch,
  ShieldCheck,
  Hash,
  Info,
  ArrowRight,
} from 'lucide-react';

export default function HSLookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();

    if (query.trim().length < 2) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await searchHSCodes(query.trim());
      setResults(res.data.results || []);
      setMethod(res.data.method || '');
    } catch (err) {
      console.error(err);
      setResults([]);
      setMethod('');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <Database size={14} className="text-[#007aff]" strokeWidth={2.2} />
            Indian Customs Tariff Database (ITC-HS)
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            HS Code Lookup
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Search India's Customs Tariff Schedule by HSN code or product description to rapidly identify duty rates, BCD, SWS, IGST, and cess.
          </p>
        </div>
      </div>

      {/* ================= SEARCH CARD ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#007aff]/10 text-[#007aff] flex items-center justify-center">
            <FileSearch size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Search Customs Tariff
            </h2>
            <p className="text-xs text-[#48484a]">
              Enter an HSN code or describe the product you are classifying
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636366]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search HSN code (e.g. 01011010) or product description (e.g. Cotton, Pumps)..."
              className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-3 pl-11 pr-4 text-sm text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="flex items-center justify-center gap-2 rounded-[14px] bg-[#007aff] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" strokeWidth={2.2} />
                Searching...
              </>
            ) : (
              <>
                <Search size={16} strokeWidth={2.2} />
                Search Tariff
              </>
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#636366]">
          <Info size={14} className="shrink-0" />
          <span>
            Minimum 2 characters required. Searches across 12,000+ official Indian Customs tariff entries.
          </span>
        </div>
      </div>

      {/* ================= SEARCH METHOD & STATS ================= */}
      {method && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[rgba(60,60,67,0.12)] bg-white px-5 py-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-[#48484a]">
            <ShieldCheck size={16} className="text-[#34c759]" strokeWidth={2.2} />
            <span>
              Search method: <strong className="text-[#1c1c1e]">{method}</strong>
            </span>
          </div>

          <span className="text-xs font-semibold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-0.5 rounded-full">
            {results.length} result{results.length !== 1 && 's'} found
          </span>
        </div>
      )}

      {/* ================= RESULTS TABLE ================= */}
      {results.length > 0 && (
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] px-6 py-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-[#1c1c1e] tracking-tight">
                <Hash size={18} className="text-[#007aff]" strokeWidth={2.2} />
                Matching Tariff Classifications
              </h2>
              <p className="mt-0.5 text-xs text-[#48484a]">
                Official Customs tariff classifications and duty schedules
              </p>
            </div>

            <span className="text-xs font-bold text-[#007aff] bg-[#007aff]/10 px-3 py-1 rounded-full self-start sm:self-center">
              {results.length} MATCH{results.length !== 1 && 'ES'}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  <th className="px-6 py-3.5">HSN Code</th>
                  <th className="px-6 py-3.5">Goods Description</th>
                  <th className="px-4 py-3.5 text-center">BCD</th>
                  <th className="px-4 py-3.5 text-center">SWS</th>
                  <th className="px-4 py-3.5 text-center">IGST</th>
                  <th className="px-4 py-3.5 text-center">Cess</th>
                  <th className="px-4 py-3.5 text-center">Chapter</th>
                  <th className="px-4 py-3.5 text-center">Copy</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[rgba(60,60,67,0.06)]">
                {results.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-[#f9f9fb]">
                    {/* HSN */}
                    <td className="px-6 py-4 align-top">
                      <span className="font-mono text-xs font-bold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-1 rounded-[8px]">
                        {r.hsn}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="max-w-md px-6 py-4 align-top">
                      <p className="text-xs font-semibold leading-relaxed text-[#1c1c1e]">
                        {r.description}
                      </p>
                      <p className="mt-1 text-[11px] text-[#636366]">
                        Tariff as of: {r.as_of || 'Current Schedule'}
                      </p>
                    </td>

                    {/* BCD */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className="text-xs font-bold text-[#1c1c1e]">
                        {r.bcd_pct != null ? `${r.bcd_pct}%` : '--'}
                      </span>
                    </td>

                    {/* SWS */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className="text-xs font-semibold text-[#48484a]">
                        {r.sws_pct_of_bcd != null ? `${r.sws_pct_of_bcd}%` : '--'}
                      </span>
                    </td>

                    {/* IGST */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className="inline-flex rounded-full bg-[#af52de]/10 border border-[#af52de]/20 px-2 py-0.5 text-xs font-semibold text-[#af52de]">
                        {r.igst_pct != null ? `${r.igst_pct}%` : '--'}
                      </span>
                    </td>

                    {/* Cess */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className="inline-flex rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/20 px-2 py-0.5 text-xs font-semibold text-[#ff3b30]">
                        {r.cess_pct != null ? `${r.cess_pct}%` : '--'}
                      </span>
                    </td>

                    {/* Chapter */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className="text-xs font-semibold text-[#48484a]">
                        {r.chapter || '--'}
                      </span>
                    </td>

                    {/* Copy */}
                    <td className="px-4 py-4 text-center align-top">
                      <CopyButton value={r.hsn} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table (below 768px) */}
          <div className="divide-y divide-[rgba(60,60,67,0.08)] md:hidden">
            {results.map((r, i) => (
              <div key={i} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-1 rounded-[8px]">
                      {r.hsn}
                    </span>
                    <p className="mt-2.5 text-xs font-semibold leading-relaxed text-[#1c1c1e]">
                      {r.description}
                    </p>
                  </div>
                  <CopyButton value={r.hsn} />
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="rounded-[10px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.06)] p-2">
                    <p className="text-[10px] font-semibold text-[#636366]">BCD</p>
                    <p className="mt-0.5 text-xs font-bold text-[#1c1c1e]">{r.bcd_pct ?? '--'}%</p>
                  </div>
                  <div className="rounded-[10px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.06)] p-2">
                    <p className="text-[10px] font-semibold text-[#636366]">SWS</p>
                    <p className="mt-0.5 text-xs font-bold text-[#1c1c1e]">{r.sws_pct_of_bcd ?? '--'}%</p>
                  </div>
                  <div className="rounded-[10px] bg-[#af52de]/10 border border-[#af52de]/20 p-2">
                    <p className="text-[10px] font-semibold text-[#af52de]">IGST</p>
                    <p className="mt-0.5 text-xs font-bold text-[#af52de]">{r.igst_pct ?? '--'}%</p>
                  </div>
                  <div className="rounded-[10px] bg-[#ff3b30]/10 border border-[#ff3b30]/20 p-2">
                    <p className="text-[10px] font-semibold text-[#ff3b30]">Cess</p>
                    <p className="mt-0.5 text-xs font-bold text-[#ff3b30]">{r.cess_pct ?? '--'}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#636366] pt-1">
                  <span>Chapter: {r.chapter || '--'}</span>
                  <span>Updated: {r.as_of || 'Current'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= NO RESULTS ================= */}
      {searched && !loading && results.length === 0 && (
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f2f2f7] text-[#636366] mb-4">
            <Database size={24} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-bold text-[#1c1c1e]">
            No Matching HS Codes Found
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#48484a]">
            No tariff classification matched "{query}". Try searching using broader keywords or the first 4 digits of the chapter.
          </p>
        </div>
      )}

      {/* ================= INITIAL GUIDANCE CARDS ================= */}
      {!searched && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#007aff]/10 text-[#007aff]">
              <Search size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-sm font-bold text-[#1c1c1e]">
              Search by HSN Code
            </h3>
            <p className="mt-1 text-xs text-[#48484a] leading-relaxed">
              Enter the first 4, 6 or complete 8-digit HSN code to retrieve exact official duty rates.
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#34c759]/10 text-[#34c759]">
              <FileSearch size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-sm font-bold text-[#1c1c1e]">
              Search by Product
            </h3>
            <p className="mt-1 text-xs text-[#48484a] leading-relaxed">
              Type product keywords (e.g. Cotton, Machinery, Plastic) to find all matching classifications.
            </p>
          </div>

          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#af52de]/10 text-[#af52de]">
              <ShieldCheck size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-sm font-bold text-[#1c1c1e]">
              Full Duty Breakdown
            </h3>
            <p className="mt-1 text-xs text-[#48484a] leading-relaxed">
              View comprehensive breakdowns of Basic Customs Duty (BCD), SWS, IGST, and GST Cess.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
