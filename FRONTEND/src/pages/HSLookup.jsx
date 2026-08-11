// import { useState } from 'react';
// import { searchHSCodes } from '../api';
// import CopyButton from '../components/CopyButton';
// import { Search, Database, Loader2 } from 'lucide-react';

// export default function HSLookup() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [method, setMethod] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const handleSearch = async (e) => {
//     e?.preventDefault();

//     if (query.trim().length < 2) return;

//     setLoading(true);
//     setSearched(true);

//     try {
//       const res = await searchHSCodes(query.trim());

//       setResults(res.data.results || []);
//       setMethod(res.data.method || '');
//     } catch (err) {
//       console.error(err);
//       setResults([]);
//       setMethod('');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-7xl">

//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <Database size={24} className="text-blue-800" />

//         <div>
//           <h1 className="text-2xl font-black text-gray-900">
//             HS Code Lookup
//           </h1>

//           <p className="text-sm text-gray-400">
//             Search Indian Customs Tariff Database
//           </p>
//         </div>
//       </div>

//       {/* Search */}
//       <form
//         onSubmit={handleSearch}
//         className="flex gap-2 mb-6"
//       >
//         <div className="relative flex-1">

//           <Search
//             size={16}
//             className="absolute left-3 top-3 text-gray-400"
//           />

//           <input
//             type="text"
//             className="input-field pl-10"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search HSN (01011010) or product description..."
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn-primary flex items-center gap-2"
//         >
//           {loading ? (
//             <Loader2
//               size={16}
//               className="animate-spin"
//             />
//           ) : (
//             <Search size={16} />
//           )}

//           Search
//         </button>
//       </form>

//       {/* Search Method */}
//       {method && (
//         <p className="text-[10px] text-gray-400 mb-3">
//           Method:{' '}
//           <span className="font-bold">
//             {method}
//           </span>{' '}
//           · {results.length} result
//           {results.length !== 1 && 's'}
//         </p>
//       )}

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="card-base overflow-hidden">

//           {/* Header */}
//           <div
//             className="
//               grid
//               grid-cols-[120px_1fr_70px_70px_70px_70px_80px_40px]
//               gap-2
//               px-4
//               py-3
//               bg-gray-800
//               text-white
//               text-[10px]
//               font-bold
//               uppercase
//               tracking-wider
//             "
//           >
//             <span>HSN</span>
//             <span>Description</span>
//             <span>BCD</span>
//             <span>SWS</span>
//             <span>IGST</span>
//             <span>Cess</span>
//             <span>Chapter</span>
//             <span>Copy</span>
//           </div>

//           {/* Rows */}
//           <div className="divide-y max-h-[600px] overflow-y-auto">

//             {results.map((r, i) => (
//               <div
//                 key={i}
//                 className="
//                   grid
//                   grid-cols-[120px_1fr_70px_70px_70px_70px_80px_40px]
//                   gap-2
//                   px-4
//                   py-3
//                   hover:bg-blue-50
//                   items-start
//                 "
//               >
//                 {/* HSN */}
//                 <span className="font-mono font-bold text-blue-800">
//                   {r.hsn}
//                 </span>

//                 {/* Description */}
//                 <div>

//                   <p className="text-xs text-gray-800 leading-5">
//                     {r.description}
//                   </p>

//                   <p className="text-[10px] text-gray-400 mt-1">
//                     Updated : {r.as_of || '--'}
//                   </p>

//                 </div>

//                 {/* BCD */}
//                 <span className="text-xs font-semibold">
//                   {r.bcd_pct ?? '--'}%
//                 </span>

//                 {/* SWS */}
//                 <span className="text-xs font-semibold">
//                   {r.sws_pct_of_bcd ?? '--'}%
//                 </span>

//                 {/* IGST */}
//                 <span className="text-xs font-semibold text-purple-700">
//                   {r.igst_pct ?? '--'}%
//                 </span>

//                 {/* CESS */}
//                 <span className="text-xs font-semibold text-red-600">
//                   {r.cess_pct ?? '--'}%
//                 </span>

//                 {/* Chapter */}
//                 <span className="text-xs text-gray-500">
//                   {r.chapter}
//                 </span>

//                 {/* Copy */}
//                 <CopyButton value={r.hsn} />
//               </div>
//             ))}

//           </div>
//         </div>
//       )}

//       {/* No Results */}
//       {searched && !loading && results.length === 0 && (
//         <div className="text-center py-16 text-gray-400">

//           <p className="text-lg font-bold">
//             No matching HS Codes found
//           </p>

//           <p className="text-sm mt-2">
//             Try searching using a product description or the first few digits of an HSN.
//           </p>

//         </div>
//       )}

//     </div>
//   );
// }











import { useState } from 'react';
import { searchHSCodes } from '../api';
import CopyButton from '../components/CopyButton';

import {
  Search,
  Database,
  Loader2,
  ShieldCheck,
  Sparkles,
  FileSearch,
  Hash,
  Info,
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
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">

      {/* =========================================================
          HEADER / HERO
      ========================================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-7 sm:p-8 shadow-xl border border-blue-800">

        {/* Decorative background */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">

            <Sparkles size={13} />

            Indian Customs Tariff Database

          </div>

          {/* Title */}

          <div className="mt-4 flex items-start gap-4">

            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 shadow-lg">

              <Database
                size={24}
                className="text-slate-950"
              />

            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">

                HS Code Lookup

              </h1>

              <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-6 text-slate-300">

                Search India's Customs Tariff Database by HSN code or
                product description and quickly identify applicable
                duty rates.

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          SEARCH CARD
      ========================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">

        <div className="mb-4 flex items-center gap-2">

          <FileSearch
            size={18}
            className="text-blue-900"
          />

          <div>

            <h2 className="text-sm font-black text-slate-900">
              Search Customs Tariff
            </h2>

            <p className="text-xs text-slate-500">
              Enter an HSN code or describe the product you're looking for.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search HSN (01011010) or product description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
            />

          </div>


          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-6 py-3.5 text-sm font-black text-white shadow-md transition-all hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Searching...

              </>
            ) : (
              <>
                <Search size={17} />

                Search

              </>
            )}

          </button>

        </form>


        {/* Search helper */}

        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">

          <Info size={12} />

          <span>
            Minimum 2 characters required. You can search using an HSN
            code or product description.
          </span>

        </div>

      </div>


      {/* =========================================================
          SEARCH INFORMATION
      ========================================================= */}

      {method && (

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={15}
              className="text-blue-800"
            />

            <span className="text-xs text-slate-600">

              Search method:

              <span className="ml-1 font-bold text-blue-900">
                {method}
              </span>

            </span>

          </div>

          <span className="text-xs font-bold text-slate-500">

            {results.length} result
            {results.length !== 1 && 's'}

          </span>

        </div>

      )}


      {/* =========================================================
          RESULTS
      ========================================================= */}

      {results.length > 0 && (

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Results Header */}

          <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">

                <Hash
                  size={17}
                  className="text-blue-900"
                />

                Matching HS Codes

              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">

                Customs tariff classification and applicable duty rates

              </p>

            </div>

            <div className="rounded-lg bg-blue-100 px-3 py-1.5 text-[10px] font-bold text-blue-900">

              {results.length} MATCH
              {results.length !== 1 && 'ES'}

            </div>

          </div>


          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full border-collapse text-left">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">

                  <th className="px-5 py-3">
                    HSN
                  </th>

                  <th className="px-5 py-3">
                    Description
                  </th>

                  <th className="px-3 py-3 text-center">
                    BCD
                  </th>

                  <th className="px-3 py-3 text-center">
                    SWS
                  </th>

                  <th className="px-3 py-3 text-center">
                    IGST
                  </th>

                  <th className="px-3 py-3 text-center">
                    Cess
                  </th>

                  <th className="px-3 py-3 text-center">
                    Chapter
                  </th>

                  <th className="px-4 py-3 text-center">
                    Copy
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {results.map((r, i) => (

                  <tr
                    key={i}
                    className="transition-colors hover:bg-blue-50/40"
                  >

                    {/* HSN */}

                    <td className="px-5 py-4 align-top">

                      <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 font-mono text-xs font-black text-blue-900">

                        {r.hsn}

                      </span>

                    </td>


                    {/* Description */}

                    <td className="max-w-md px-5 py-4 align-top">

                      <p className="text-xs font-semibold leading-5 text-slate-800">

                        {r.description}

                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">

                        Updated: {r.as_of || '--'}

                      </p>

                    </td>


                    {/* BCD */}

                    <td className="px-3 py-4 text-center align-top">

                      <span className="text-xs font-bold text-slate-700">

                        {r.bcd_pct ?? '--'}%

                      </span>

                    </td>


                    {/* SWS */}

                    <td className="px-3 py-4 text-center align-top">

                      <span className="text-xs font-bold text-slate-700">

                        {r.sws_pct_of_bcd ?? '--'}%

                      </span>

                    </td>


                    {/* IGST */}

                    <td className="px-3 py-4 text-center align-top">

                      <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-bold text-purple-700">

                        {r.igst_pct ?? '--'}%

                      </span>

                    </td>


                    {/* CESS */}

                    <td className="px-3 py-4 text-center align-top">

                      <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600">

                        {r.cess_pct ?? '--'}%

                      </span>

                    </td>


                    {/* Chapter */}

                    <td className="px-3 py-4 text-center align-top">

                      <span className="text-xs font-semibold text-slate-500">

                        {r.chapter}

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


          {/* =====================================================
              MOBILE RESULTS
          ===================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">

            {results.map((r, i) => (

              <div
                key={i}
                className="p-5 transition-colors hover:bg-blue-50/30"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 font-mono text-xs font-black text-blue-900">

                      {r.hsn}

                    </span>

                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-800">

                      {r.description}

                    </p>

                  </div>

                  <CopyButton value={r.hsn} />

                </div>


                <div className="mt-4 grid grid-cols-2 gap-2">

                  <div className="rounded-lg bg-slate-50 p-3">

                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      BCD
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-800">
                      {r.bcd_pct ?? '--'}%
                    </p>

                  </div>


                  <div className="rounded-lg bg-slate-50 p-3">

                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      SWS
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-800">
                      {r.sws_pct_of_bcd ?? '--'}%
                    </p>

                  </div>


                  <div className="rounded-lg bg-purple-50 p-3">

                    <p className="text-[9px] font-bold uppercase text-purple-400">
                      IGST
                    </p>

                    <p className="mt-1 text-xs font-bold text-purple-700">
                      {r.igst_pct ?? '--'}%
                    </p>

                  </div>


                  <div className="rounded-lg bg-red-50 p-3">

                    <p className="text-[9px] font-bold uppercase text-red-400">
                      Cess
                    </p>

                    <p className="mt-1 text-xs font-bold text-red-600">
                      {r.cess_pct ?? '--'}%
                    </p>

                  </div>

                </div>


                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">

                  <span>
                    Chapter: {r.chapter}
                  </span>

                  <span>
                    Updated: {r.as_of || '--'}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* =========================================================
          NO RESULTS
      ========================================================= */}

      {searched &&
        !loading &&
        results.length === 0 && (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

              <Database
                size={24}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-black text-slate-900">

              No matching HS Codes found

            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

              Try searching using a product description or the first
              few digits of an HSN code.

            </p>

          </div>

        )}


      {/* =========================================================
          INITIAL STATE
      ========================================================= */}

      {!searched && (

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

              <Search
                size={17}
                className="text-blue-800"
              />

            </div>

            <h3 className="text-sm font-black text-slate-900">
              Search by HSN
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter the first few digits or a complete 8-digit HSN code.
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">

              <FileSearch
                size={17}
                className="text-teal-700"
              />

            </div>

            <h3 className="text-sm font-black text-slate-900">
              Search by Product
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Describe the product and find matching tariff classifications.
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">

              <ShieldCheck
                size={17}
                className="text-purple-700"
              />

            </div>

            <h3 className="text-sm font-black text-slate-900">
              Duty Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              View BCD, SWS, IGST and Cess rates for matching codes.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}






// import React, { useState } from 'react';
// import {
//   Search,
//   Copy,
//   Check,
//   ShieldCheck,
//   Plus,
//   Trash2,
//   ClipboardCheck
// } from 'lucide-react';
// import { HSN_DATABASE, searchHsnCodes } from '../data/hsnData';

// export function HSLookup({ initialQuery = '' }) {
//   const [searchTerm, setSearchTerm] = useState(initialQuery);
//   const [selectedChapter, setSelectedChapter] = useState('all');
//   const [copiedCode, setCopiedCode] = useState(null);
//   const [copiedFormat, setCopiedFormat] = useState(null);

//   // Multi-HSN Scratchpad state
//   const [scratchpad, setScratchpad] = useState([]);
//   const [scratchpadCopied, setScratchpadCopied] = useState(null);

//   const filteredHsn = searchHsnCodes(searchTerm).filter((item) => {
//     if (selectedChapter === 'all') return true;
//     return item.chapter.includes(selectedChapter);
//   });

//   const handleCopyCode = (code) => {
//     navigator.clipboard.writeText(code);
//     setCopiedCode(code);
//     setCopiedFormat('code');
//     setTimeout(() => {
//       setCopiedCode(null);
//       setCopiedFormat(null);
//     }, 1500);
//   };

//   const handleCopyTabDelimited = (item) => {
//     const text = `${item.code}\t${item.description}\t${item.unit}\t${item.bcd}%\t${item.sws}%\t${item.igst}%`;
//     navigator.clipboard.writeText(text);
//     setCopiedCode(item.code);
//     setCopiedFormat('tab');
//     setTimeout(() => {
//       setCopiedCode(null);
//       setCopiedFormat(null);
//     }, 1500);
//   };

//   const addToScratchpad = (item) => {
//     if (!scratchpad.some((s) => s.code === item.code)) {
//       setScratchpad([...scratchpad, item]);
//     }
//   };

//   const removeFromScratchpad = (code) => {
//     setScratchpad(scratchpad.filter((s) => s.code !== code));
//   };

//   const copyScratchpadCodes = (separator) => {
//     let text = '';
//     if (separator === 'comma') {
//       text = scratchpad.map((s) => s.code).join(', ');
//     } else if (separator === 'newline') {
//       text = scratchpad.map((s) => s.code).join('\n');
//     } else {
//       text = scratchpad
//         .map((s) => `${s.code}\t${s.description}\t${s.bcd}%\t${s.igst}%`)
//         .join('\n');
//     }
//     navigator.clipboard.writeText(text);
//     setScratchpadCopied(separator);
//     setTimeout(() => setScratchpadCopied(null), 1500);
//   };

//   return (
//     <div className="space-y-6 pb-12">
//       {/* Header */}
//       <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded font-mono mb-2">
//               <ShieldCheck className="w-3.5 h-3.5" />
//               Indian Customs Tariff Schedule 2026-27 (ITC-HS)
//             </div>
//             <h2 className="text-xl font-black text-slate-900">
//               8-Digit HSN Code & Duty Rate Lookup
//             </h2>
//             <p className="text-xs text-slate-500">
//               Search Basic Customs Duty (BCD), Social Welfare Surcharge (SWS), and IGST % rates with instant 1-click copy-paste for Customs software
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
//               {filteredHsn.length} HSN Entries
//             </span>
//           </div>
//         </div>

//         {/* Search & Filter Bar */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
//           <div className="md:col-span-2 relative">
//             <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
//             <input
//               type="text"
//               placeholder="Type 8-digit HSN code or description (e.g. 39011010, Polyethylene, Cotton, Laptops)..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-semibold text-slate-900"
//             />
//           </div>

//           <div>
//             <select
//               value={selectedChapter}
//               onChange={(e) => setSelectedChapter(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 text-xs font-semibold text-slate-900"
//             >
//               <option value="all">All Chapters</option>
//               <option value="39">Chapter 39 - Plastics</option>
//               <option value="61">Chapter 61 - Apparel (Knitted)</option>
//               <option value="85">Chapter 85 - Electrical & Electronics</option>
//               <option value="84">Chapter 84 - Machinery & Computers</option>
//               <option value="29">Chapter 29 - Organic Chemicals</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Multi-HSN Scratchpad / Quick Paste Pad */}
//       {scratchpad.length > 0 && (
//         <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-800 space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ClipboardCheck className="w-5 h-5 text-teal-400" />
//               <div>
//                 <h3 className="font-bold text-sm">
//                   Multi-HSN Quick Paste Clipboard ({scratchpad.length} items saved)
//                 </h3>
//                 <p className="text-[11px] text-slate-300">
//                   Collect multiple HS codes for rapid multi-line item copy pasting
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() => setScratchpad([])}
//               className="text-xs font-bold text-rose-300 hover:text-rose-200 underline"
//             >
//               Clear All
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {scratchpad.map((item) => (
//               <span
//                 key={item.code}
//                 className="bg-slate-800 border border-slate-700 text-white text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-2"
//               >
//                 <span className="font-bold text-teal-300">{item.code}</span>
//                 <span className="text-[10px] text-slate-300 truncate max-w-[150px]">
//                   {item.description}
//                 </span>
//                 <button
//                   onClick={() => removeFromScratchpad(item.code)}
//                   className="text-slate-400 hover:text-rose-400 font-bold ml-1"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>

//           <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
//             <button
//               onClick={() => copyScratchpadCodes('comma')}
//               className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
//             >
//               {scratchpadCopied === 'comma' ? (
//                 <Check className="w-3.5 h-3.5" />
//               ) : (
//                 <Copy className="w-3.5 h-3.5" />
//               )}
//               <span>Copy Comma Separated ({scratchpad.map((s) => s.code).join(', ')})</span>
//             </button>

//             <button
//               onClick={() => copyScratchpadCodes('newline')}
//               className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700"
//             >
//               {scratchpadCopied === 'newline' ? (
//                 <Check className="w-3.5 h-3.5" />
//               ) : (
//                 <Copy className="w-3.5 h-3.5" />
//               )}
//               <span>Copy One-Per-Line</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Results Table */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-xs">
//             <thead>
//               <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
//                 <th className="py-3.5 px-4">HSN Code (8-Digit)</th>
//                 <th className="py-3.5 px-4">Tariff Goods Description</th>
//                 <th className="py-3.5 px-4 text-center">Unit</th>
//                 <th className="py-3.5 px-4 text-center">BCD %</th>
//                 <th className="py-3.5 px-4 text-center">SWS %</th>
//                 <th className="py-3.5 px-4 text-center">IGST %</th>
//                 <th className="py-3.5 px-4 text-center">Total Duty %</th>
//                 <th className="py-3.5 px-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {filteredHsn.map((item) => {
//                 const totalEffectiveDuty = (item.bcd * (1 + item.sws / 100) + item.igst).toFixed(
//                   1
//                 );
//                 const isSavedToPad = scratchpad.some((s) => s.code === item.code);

//                 return (
//                   <tr key={item.code} className="hover:bg-blue-50/40 transition-colors">
//                     <td className="py-3.5 px-4 font-mono font-black text-blue-950 text-sm">
//                       {item.code}
//                     </td>
//                     <td className="py-3.5 px-4">
//                       <p className="font-bold text-slate-900">{item.description}</p>
//                       <p className="text-[10px] text-slate-400 font-mono">{item.chapter}</p>
//                     </td>
//                     <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
//                       {item.unit}
//                     </td>
//                     <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
//                       {item.bcd}%
//                     </td>
//                     <td className="py-3.5 px-4 text-center font-mono text-slate-600">
//                       {item.sws}%
//                     </td>
//                     <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
//                       {item.igst}%
//                     </td>
//                     <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-700 bg-emerald-50/50">
//                       ~{totalEffectiveDuty}%
//                     </td>
//                     <td className="py-3.5 px-4 text-right">
//                       <div className="flex items-center justify-end gap-1.5">
//                         <button
//                           onClick={() => handleCopyCode(item.code)}
//                           className="bg-blue-900 hover:bg-blue-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs cursor-pointer"
//                         >
//                           {copiedCode === item.code && copiedFormat === 'code' ? (
//                             <>
//                               <Check className="w-3.5 h-3.5 text-teal-300" />
//                               <span>Copied</span>
//                             </>
//                           ) : (
//                             <>
//                               <Copy className="w-3.5 h-3.5" />
//                               <span>Copy Code</span>
//                             </>
//                           )}
//                         </button>

//                         <button
//                           onClick={() => addToScratchpad(item)}
//                           disabled={isSavedToPad}
//                           className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
//                             isSavedToPad
//                               ? 'bg-teal-100 text-teal-900 border border-teal-300'
//                               : 'bg-slate-100 hover:bg-blue-100 text-blue-900'
//                           }`}
//                         >
//                           <Plus className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
