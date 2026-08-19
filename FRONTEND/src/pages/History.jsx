// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getHistory } from '../api';
// import EmptyState from '../components/EmptyState';
// import { Clock, ArrowRight, Search, Filter } from 'lucide-react';

// export default function History() {
//   const navigate = useNavigate();
//   const [extractions, setExtractions] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [typeFilter, setTypeFilter] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchData = (p = 1, type = '') => {
//     setLoading(true);
//     getHistory(p, type)
//       .then((res) => {
//         setExtractions(res.data.extractions || []);
//         setTotal(res.data.total || 0);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchData(page, typeFilter); }, [page, typeFilter]);

//   const totalPages = Math.ceil(total / 20);

//   return (
//     <div className="max-w-5xl">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-black text-gray-900">Extraction History</h1>
//           <p className="text-sm text-gray-400">{total} total extractions</p>
//         </div>
//         <div className="flex gap-2">
//           {['', 'BOE', 'SB'].map((t) => (
//             <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
//               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
//                 ${typeFilter === t ? 'bg-blue-800 text-white' : 'bg-white border text-gray-600'}`}>
//               {t || 'All'}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="card-base overflow-hidden">
//         {/* Table header */}
//         <div className="grid grid-cols-[80px_1fr_100px_100px_80px_40px] gap-2 px-4 py-3
//           bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider">
//           <span>Type</span><span>Job Number</span><span>Date</span>
//           <span>Status</span><span>Score</span><span></span>
//         </div>

//         {loading ? (
//           <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
//         ) : extractions.length === 0 ? (
//           <EmptyState title="No extractions found" message="Try a different filter or start extracting"
//             action="New Extraction" onAction={() => navigate('/extract')} />
//         ) : (
//           <div className="divide-y">
//             {extractions.map((ext) => (
//               <div key={ext.id}
//                 className="grid grid-cols-[80px_1fr_100px_100px_80px_40px] gap-2 px-4 py-3
//                   hover:bg-blue-50 cursor-pointer items-center transition-colors"
//                 onClick={() => navigate(`/results/${ext.id}`)}>
//                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-center
//                   ${ext.doc_type === 'BOE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
//                   {ext.doc_type}
//                 </span>
//                 <span className="text-sm font-bold text-gray-800 truncate">{ext.job_number}</span>
//                 <span className="text-xs text-gray-400">
//                   {new Date(ext.created_at).toLocaleDateString('en-IN')}
//                 </span>
//                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-center
//                   ${ext.status === 'completed' ? 'bg-green-100 text-green-800' :
//                     ext.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                   {ext.status}
//                 </span>
//                 <span className="text-xs font-bold text-green-700">
//                   {ext.accuracy_score?.toFixed(1) || '--'}%
//                 </span>
//                 <ArrowRight size={14} className="text-gray-300" />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 px-4 py-3 border-t bg-gray-50">
//             <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
//               className="btn-secondary text-xs">Previous</button>
//             <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
//             <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
//               className="btn-secondary text-xs">Next</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../api';
import EmptyState from '../components/EmptyState';

import {
  Clock,
  ArrowRight,
  Search,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export default function History() {
  const navigate = useNavigate();

  const [extractions, setExtractions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ boe: 0, sb: 0, image: 0, scanned: 0, all: 0 });

  const fetchData = (p = 1, type = '') => {
    setLoading(true);

    getHistory(p, type)
      .then((res) => {
        setExtractions(res.data.extractions || []);
        setTotal(res.data.total || 0);
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(page, typeFilter);
  }, [page, typeFilter]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">

            <Clock
              size={24}
              className="text-blue-900"
            />

          </div>

          <div>

            <div className="mb-1 flex items-center gap-2">

              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Extraction History
              </h1>

              <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-800 sm:inline-block">
                {total} RECORDS
              </span>

            </div>

            <p className="text-sm text-slate-400">
              View and manage your previous document extractions
            </p>

          </div>

        </div>


        {/* Total */}

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

          <FileText
            size={16}
            className="text-blue-800"
          />

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Extractions
            </p>

            <p className="text-sm font-black text-slate-900">
              {counts.all}
            </p>

          </div>

        </div>

      </div>


      {/* =========================================================
          FILTER BAR
      ========================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

              <Filter
                size={15}
                className="text-slate-600"
              />

            </div>

            <div>

              <p className="text-xs font-black text-slate-800">
                Filter Extractions
              </p>

              <p className="text-[10px] text-slate-400">
                Filter by document type
              </p>

            </div>

          </div>


          {/* Filters */}

          <div className="flex items-center gap-2">

            {[
              { label: 'All', value: '', count: counts.all },
              { label: 'BOE', value: 'BOE', count: counts.boe },
              { label: 'SB', value: 'SB', count: counts.sb },
              { label: 'Image', value: 'IMAGE', count: counts.image },
              { label: 'Scanned', value: 'SCANNED', count: counts.scanned || 0 },
            ].map((btn) => (

              <button
                key={btn.value}
                onClick={() => {
                  setTypeFilter(btn.value);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  typeFilter === btn.value
                    ? 'bg-blue-950 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >

                {btn.label} ({btn.count})

              </button>

            ))}

          </div>

        </div>

      </div>


      {/* =========================================================
          HISTORY TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

          <div>

            <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">

              

              Extraction Records

            </h2>

            <p className="mt-0.5 text-[11px] text-slate-400">

              Click any extraction to view its complete result

            </p>

          </div>


          <button
            onClick={() => fetchData(page, typeFilter)}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
            title="Refresh"
          >

            <RefreshCw
              size={14}
              className={loading ? 'animate-spin' : ''}
            />

          </button>

        </div>


        {/* Column Header */}

        <div className="hidden grid-cols-[90px_1fr_120px_120px_100px_40px] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 md:grid">

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Type
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Job Number
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Date
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Status
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Score
          </span>

          <span />

        </div>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        {loading ? (

          <div className="p-14 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

              <RefreshCw
                size={20}
                className="animate-spin text-blue-800"
              />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading extraction history...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching your latest records
            </p>

          </div>

        ) : extractions.length === 0 ? (

          <EmptyState
            title="No extractions found"
            message="Try a different filter or start extracting"
            action="New Extraction"
            onAction={() => navigate('/extract')}
          />

        ) : (

          <div className="divide-y divide-slate-100">

            {extractions.map((ext) => (

              <div
                key={ext.id}
                className="group cursor-pointer transition-colors hover:bg-blue-50/40"
                //onClick={() => navigate(`/results/${ext.id}`)}
                onClick={() =>
                  navigate(
                    ext.result_type === 'image'
                      ? `/image-results/${ext.id}`
                      : ext.result_type === 'scanned'
                      ? `/scanned-results/${ext.id}`
                      : `/results/${ext.id}`
                  )
                }
              >

                {/* Desktop Row */}

                <div className="hidden grid-cols-[90px_1fr_120px_120px_100px_40px] items-center gap-3 px-5 py-4 md:grid">

                  {/* Type */}

                  <div>

                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black ${
                        ext.result_type === 'scanned'
                          ? 'bg-teal-100 text-teal-800'
                          : ext.doc_type === 'BOE'
                          ? 'bg-blue-100 text-blue-800'
                          : ext.doc_type === 'IMAGE' || ext.doc_type === 'image'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ext.result_type === 'scanned' ? `SCANNED ${ext.doc_type}` : ext.doc_type}
                    </span>

                  </div>


                  {/* Job Number */}

                  <div className="min-w-0">

                    <p className="truncate text-sm font-black text-slate-800">

                      {ext.job_number}

                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Extraction #{ext.id}
                    </p>

                  </div>


                  {/* Date */}

                  <span className="text-xs font-medium text-slate-500">

                    {new Date(ext.created_at).toLocaleDateString(
                      'en-IN'
                    )}

                  </span>


                  {/* Status */}

                  <span
                    className={`inline-flex w-fit rounded-lg px-2.5 py-1 text-[10px] font-black ${
                      ext.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : ext.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >

                    {ext.status}

                  </span>


                  {/* Score */}

                  <span
                    className={`text-xs font-black ${
                      ext.accuracy_score != null
                        ? 'text-green-700'
                        : 'text-slate-400'
                    }`}
                  >

                    {ext.accuracy_score?.toFixed(1) || '--'}%

                  </span>


                  {/* Arrow */}

                  <ArrowRight
                    size={15}
                    className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-700"
                  />

                </div>


                {/* =================================================
                    MOBILE ROW
                ================================================= */}

                <div className="p-4 md:hidden">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black ${
                          ext.result_type === 'scanned'
                            ? 'bg-teal-100 text-teal-800'
                            : ext.doc_type === 'BOE'
                            ? 'bg-blue-100 text-blue-800'
                            : ext.doc_type === 'IMAGE' || ext.doc_type === 'image'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ext.result_type === 'scanned' ? `SCANNED ${ext.doc_type}` : ext.doc_type}
                      </span>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-black text-slate-800">
                          {ext.job_number}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {new Date(ext.created_at).toLocaleDateString(
                            'en-IN'
                          )}
                        </p>

                      </div>

                    </div>


                    <ArrowRight
                      size={15}
                      className="mt-1 shrink-0 text-slate-300"
                    />

                  </div>


                  <div className="mt-4 flex items-center justify-between">

                    <span
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-black ${
                        ext.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : ext.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ext.status}
                    </span>


                    <span className="text-xs font-black text-green-700">

                      {ext.accuracy_score?.toFixed(1) || '--'}%

                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =========================================================
            PAGINATION
        ========================================================= */}

        {totalPages > 1 && (

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-500">

              Page{' '}
              <span className="font-bold text-slate-800">
                {page}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-800">
                {totalPages}
              </span>

            </p>


            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={page <= 1}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft size={14} />

                Previous

              </button>


              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={page >= totalPages}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next

                <ChevronRight size={14} />

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


