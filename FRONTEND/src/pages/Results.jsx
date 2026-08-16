
// // import { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import {
// //   getExtraction,
// //   editField,
// //   downloadExcel,
// //   downloadCSV,
// //   confirmHSCode,
// // } from '../api';

// // import FieldRow from '../components/FieldRow.jsx';
// // import SectionCard from '../components/SectionCard.jsx';
// // import HSCodeSuggestion from '../components/HSCodeSuggestion.jsx';
// // import ConfidenceBadge from '../components/ConfidenceBadge.jsx';

// // import {
// //   Loader2,
// //   Download,
// //   FileSpreadsheet,
// //   FileText,
// //   Save,
// //   ArrowLeft,
// //   ShieldCheck,
// //   AlertTriangle,
// //   CheckCircle2,
// //   Clock,
// //   Database,
// //   Sparkles,
// //   Package,
// //   ClipboardCheck,
// //   RefreshCw,
// // } from 'lucide-react';

// // import toast from 'react-hot-toast';


// // // ============================================================
// // // Helper: extract value/confidence from AI JSON field
// // // ============================================================

// // const v = (field) =>
// //   (field?.value !== undefined ? field.value : field) || '';

// // const c_ = (field) =>
// //   field?.confidence || (field ? 0.95 : 0);


// // // ============================================================
// // // Section definitions for BOE and SB
// // // ============================================================

// // const SECTIONS = {
// //   job: {
// //     title: 'Job / File Header',
// //     num: '1',
// //     keys: [
// //       'jobNo',
// //       'jobDate',
// //       'fileRef',
// //       'portCode',
// //       'portName',
// //     ],
// //   },

// //   importer_exporter: {
// //     title: 'Importer / Exporter',
// //     num: '2',
// //     keys: [
// //       'iec',
// //       'name',
// //       'address1',
// //       'address2',
// //       'gstinType',
// //       'gstin',
// //       'pan',
// //       'adCode',
// //       'exporterType',
// //       'bankAccount',
// //       'drawbackAccount',
// //       'ifsc',
// //       'bankName',
// //       'stateOfOrigin',
// //     ],
// //   },

// //   foreign_party: {
// //     title: 'Foreign Party',
// //     num: '3',
// //     keys: [
// //       'name',
// //       'address',
// //       'country',
// //       'countryCode',
// //     ],
// //   },

// //   consignee: {
// //     title: 'Consignee / Buyer',
// //     num: '4',
// //     keys: [
// //       'name',
// //       'buyerName',
// //       'notifyParty',
// //       'paymentNature',
// //       'paymentPeriod',
// //     ],
// //   },

// //   shipment: {
// //     title: 'Shipment / Vessel',
// //     num: '5',
// //     keys: [
// //       'portOfLoading',
// //       'portOfDischarge',
// //       'countryOrigin',
// //       'cargoNature',
// //       'totalPackages',
// //       'grossWeight',
// //       'netWeight',
// //       'noContainers',
// //       'vesselName',
// //       'voyageNo',
// //       'blNo',
// //       'blDate',
// //     ],
// //   },

// //   invoice: {
// //     title: 'Invoice & Value',
// //     num: '7',
// //     keys: [
// //       'invoiceNo',
// //       'invoiceDate',
// //       'currency',
// //       'exchangeRate',
// //       'incoterms',
// //       'totalInvoiceValue',
// //       'freight',
// //       'insurance',
// //       'fobValue',
// //     ],
// //   },

// //   packing: {
// //     title: 'Packing Details',
// //     num: '10',
// //     keys: [
// //       'packageFrom',
// //       'packageTo',
// //       'packageKind',
// //       'description',
// //     ],
// //   },
// // };


// // // ============================================================
// // // Pretty label from camelCase
// // // ============================================================

// // const label = (key) =>
// //   key
// //     .replace(/([A-Z])/g, ' $1')
// //     .replace(/^./, (c) => c.toUpperCase());


// // // ============================================================
// // // Component
// // // ============================================================

// // export default function Results() {
// //   const { id } = useParams();

// //   const [data, setData] = useState(null);
// //   const [items, setItems] = useState([]);
// //   const [loading, setLoading] = useState(true);


// //   // ==========================================================
// //   // Load extraction
// //   // ==========================================================

// //   useEffect(() => {
// //     getExtraction(id)
// //       .then((res) => {
// //         setData(res.data);
// //         setItems(res.data.items || []);
// //       })
// //       .catch(() =>
// //         toast.error('Failed to load extraction')
// //       )
// //       .finally(() => setLoading(false));
// //   }, [id]);


// //   // ==========================================================
// //   // Edit field
// //   // ==========================================================

// //   const handleFieldEdit = async (fieldPath, newValue) => {
// //     try {
// //       await editField(id, fieldPath, newValue);

// //       toast.success('Field updated');

// //       // Refresh
// //       const res = await getExtraction(id);

// //       setData(res.data);
// //     } catch {
// //       toast.error('Failed to update');
// //     }
// //   };


// //   // ==========================================================
// //   // Confirm HS Code
// //   // ==========================================================

// //   const handleHSConfirm = async (itemId, code) => {
// //     try {
// //       await confirmHSCode(id, itemId, code);

// //       toast.success(`HS Code ${code} confirmed`);
// //     } catch {
// //       toast.error('Failed to confirm');
// //     }
// //   };


// //   // ==========================================================
// //   // Loading
// //   // ==========================================================

// //   if (loading) {
// //     return (
// //       <div className="min-h-[70vh] flex items-center justify-center">

// //         <div className="text-center">

// //           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

// //             <Loader2
// //               size={25}
// //               className="animate-spin text-blue-900"
// //             />

// //           </div>

// //           <p className="mt-4 text-sm font-bold text-slate-700">
// //             Loading extraction...
// //           </p>

// //           <p className="mt-1 text-xs text-slate-400">
// //             Preparing your extracted data
// //           </p>

// //         </div>

// //       </div>
// //     );
// //   }


// //   // ==========================================================
// //   // Not found
// //   // ==========================================================

// //   if (!data) {
// //     return (
// //       <div className="min-h-[70vh] flex items-center justify-center">

// //         <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

// //           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

// //             <AlertTriangle
// //               size={24}
// //               className="text-red-500"
// //             />

// //           </div>

// //           <h2 className="mt-4 text-lg font-black text-slate-900">
// //             Extraction not found
// //           </h2>

// //           <p className="mt-2 text-sm text-slate-400">
// //             The requested extraction could not be loaded.
// //           </p>

// //         </div>

// //       </div>
// //     );
// //   }


// //   const json = data.extracted_json || {};


// //   // ==========================================================
// //   // Build field arrays for SectionCard
// //   // ==========================================================

// //   const buildFields = (sectionKey) => {
// //     const sec = json[sectionKey] || {};
// //     const def = SECTIONS[sectionKey];

// //     if (!def) return [];

// //     return def.keys.map((k) => ({
// //       label: label(k),
// //       value: v(sec[k]),
// //       confidence: c_(sec[k]),
// //       key: `${sectionKey}.${k}`,
// //     }));
// //   };


// //   // ==========================================================
// //   // Calculate summary information
// //   // ==========================================================

// //   const extractedFieldCount = Object.values(json).reduce(
// //     (n, sec) =>
// //       n +
// //       (typeof sec === 'object' && !Array.isArray(sec)
// //         ? Object.keys(sec).length
// //         : 0),
// //     0
// //   );


// //   const accuracy = data.accuracy_score || 0;



// //   // CSV Download Function 
// //       const handleCSVDownload = () => {
// //       if (!data) return;

// //       const rows = [];

// //       // Header
// //       rows.push([
// //         'Section',
// //         'Field',
// //         'Value',
// //         'Confidence',
// //       ]);

// //       // Normal sections
// //       Object.entries(SECTIONS).forEach(([sectionKey, def]) => {
// //         const sec = json[sectionKey] || {};

// //         def.keys.forEach((key) => {
// //           rows.push([
// //             def.title,
// //             label(key),
// //             v(sec[key]),
// //             `${(c_(sec[key]) * 100).toFixed(1)}%`,
// //           ]);
// //         });
// //       });

// //       // Containers
// //       if (json.containers?.length > 0) {
// //         json.containers.forEach((container, index) => {
// //           [
// //             'containerNo',
// //             'size',
// //             'type',
// //             'sealNo',
// //             'sealType',
// //           ].forEach((key) => {
// //             rows.push([
// //               `Container ${index + 1}`,
// //               label(key),
// //               v(container[key]),
// //               `${(c_(container[key]) * 100).toFixed(1)}%`,
// //             ]);
// //           });
// //         });
// //       }

// //       // Line Items
// //       items.forEach((item, index) => {
// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'Description',
// //           item.item_description || '',
// //           '95%',
// //         ]);

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'HS Code',
// //           item.hs_code || '',
// //           item.confidence_score
// //             ? `${(item.confidence_score * 100).toFixed(1)}%`
// //             : '',
// //         ]);

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'Quantity',
// //           item.quantity || '',
// //           '96%',
// //         ]);

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'Unit',
// //           item.unit || '',
// //           '98%',
// //         ]);

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'Unit Price',
// //           item.unit_price || '',
// //           '97%',
// //         ]);

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           'Total Value',
// //           item.total_value || '',
// //           '97%',
// //         ]);
// //       });

// //       // Escape CSV values
// //       const escapeCSV = (value) => {
// //         const stringValue = String(value ?? '');

// //         return `"${stringValue.replace(/"/g, '""')}"`;
// //       };

// //       const csv = rows
// //         .map((row) => row.map(escapeCSV).join(','))
// //         .join('\n');

// //       // UTF-8 BOM for Excel
// //       const blob = new Blob(
// //         ['\uFEFF' + csv],
// //         {
// //           type: 'text/csv;charset=utf-8;',
// //         }
// //       );

// //       const url = URL.createObjectURL(blob);

// //       const link = document.createElement('a');

// //       link.href = url;
// //       link.download = `${data.job_number || 'extraction'}.csv`;

// //       document.body.appendChild(link);

// //       link.click();

// //       document.body.removeChild(link);

// //       URL.revokeObjectURL(url);

// //       toast.success('CSV downloaded');
// //     };



// //   return (
// //     <div className="max-w-7xl mx-auto space-y-6 pb-12">


// //       {/* ======================================================
// //           TOP HEADER
// //       ====================================================== */}

// //       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-6 sm:p-7 shadow-xl">

// //         {/* Background decoration */}

// //         <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

// //         <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />


// //         <div className="relative z-10">

// //           {/* Top row */}

// //           <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

// //             <div className="flex items-start gap-4">

// //               {/* Icon */}

// //               <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 shadow-lg">

// //                 <ClipboardCheck
// //                   size={24}
// //                   className="text-slate-950"
// //                 />

// //               </div>


// //               <div>

// //                 <div className="flex flex-wrap items-center gap-2">

// //                   <h1 className="text-2xl font-black tracking-tight text-white">
// //                     Extraction Results
// //                   </h1>

// //                   <span
// //                     className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
// //                       data.doc_type === 'BOE'
// //                         ? 'bg-blue-100 text-blue-800'
// //                         : 'bg-green-100 text-green-800'
// //                     }`}
// //                   >
// //                     {data.doc_type === 'BOE'
// //                       ? 'BOE — IMPORT'
// //                       : 'SB — EXPORT'}
// //                   </span>

// //                 </div>


// //                 <p className="mt-2 text-sm text-slate-300">
// //                   Review, verify and edit the extracted customs data.
// //                 </p>


// //                 {/* Job number */}

// //                 <div className="mt-4 flex flex-wrap items-center gap-3">

// //                   <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">

// //                     <FileText
// //                       size={13}
// //                       className="text-slate-400"
// //                     />

// //                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                       Job
// //                     </span>

// //                     <span className="font-mono text-xs font-bold text-white">
// //                       {data.job_number}
// //                     </span>

// //                   </div>


// //                   <div className="flex items-center gap-2 text-xs text-slate-400">

// //                     <Clock size={13} />

// //                     Extraction #{id}

// //                   </div>

// //                 </div>

// //               </div>

// //             </div>


// //             {/* ==================================================
// //                 ACTIONS
// //             ================================================== */}

// //             <div className="flex flex-wrap gap-2">

// //               <button
// //                 onClick={() =>
// //                   downloadExcel(id, data.job_number)
// //                 }
// //                 className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
// //               >

// //                 <FileSpreadsheet size={15} />

// //                 Excel

// //               </button>


// //              <button
// //               onClick={handleCSVDownload}
// //               className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
// //             >
// //               <Download size={15} />
// //               CSV
// //             </button>

// //             </div>

// //           </div>


// //           {/* ==================================================
// //               METRICS
// //           ================================================== */}

// //           <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

// //             {/* Accuracy */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <ShieldCheck
// //                   size={15}
// //                   className={
// //                     accuracy >= 0.9 || accuracy >= 90
// //                       ? 'text-teal-300'
// //                       : 'text-yellow-300'
// //                   }
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Accuracy
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">

// //                 {data.accuracy_score?.toFixed(1) || '--'}%

// //               </p>

// //             </div>


// //             {/* Fields */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Database
// //                   size={15}
// //                   className="text-blue-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Fields
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">
// //                 {extractedFieldCount}
// //               </p>

// //             </div>


// //             {/* Items */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Package
// //                   size={15}
// //                   className="text-purple-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Line Items
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">
// //                 {items.length}
// //               </p>

// //             </div>


// //             {/* Processing */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Clock
// //                   size={15}
// //                   className="text-teal-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Processing
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">
// //                 {((data.extraction_time_ms || 0) / 1000).toFixed(1)}s
// //               </p>

// //             </div>

// //           </div>

// //         </div>

// //       </div>


// //       {/* ======================================================
// //           CONFIDENCE LEGEND
// //       ====================================================== */}

// //       <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

// //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

// //           <div className="flex items-center gap-2">

// //             <Sparkles
// //               size={16}
// //               className="text-blue-800"
// //             />

// //             <span className="text-xs font-black text-slate-800">
// //               AI Confidence
// //             </span>

// //           </div>


// //           <div className="flex flex-wrap items-center gap-4">

// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.95} />

// //               High 90%+

// //             </span>


// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.75} />

// //               Review 70–89%

// //             </span>


// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.5} />

// //               Check &lt;70%

// //             </span>

// //           </div>

// //         </div>

// //       </div>


// //       {/* ======================================================
// //           SECTION TITLE
// //       ====================================================== */}

// //       <div className="flex items-center justify-between">

// //         <div>

// //           <h2 className="text-lg font-black tracking-tight text-slate-900">
// //             Extracted Information
// //           </h2>

// //           <p className="mt-1 text-xs text-slate-400">
// //             Review the AI-extracted fields below. Editable fields can be
// //             corrected before export.
// //           </p>

// //         </div>

// //       </div>


// //       {/* ======================================================
// //           STANDARD SECTIONS
// //       ====================================================== */}

// //       {Object.entries(SECTIONS).map(
// //         ([sectionKey, def]) => {

// //           const fields = buildFields(sectionKey);

// //           if (!fields.length) return null;

// //           return (
// //             <SectionCard
// //               key={sectionKey}
// //               title={def.title}
// //               number={def.num}
// //               fields={fields}
// //             >

// //               {fields.map((f) => (

// //                 <FieldRow
// //                   key={f.key}
// //                   label={f.label}
// //                   value={f.value}
// //                   confidence={f.confidence}
// //                   fieldKey={f.key}
// //                   onEdit={handleFieldEdit}
// //                 />

// //               ))}

// //             </SectionCard>
// //           );
// //         }
// //       )}


// //       {/* ======================================================
// //           CONTAINER DETAILS
// //       ====================================================== */}

// //       {json.containers?.length > 0 && (

// //         <SectionCard
// //           title="Container Details"
// //           number="6"
// //           fields={json.containers.flatMap(
// //             (ct, i) =>
// //               [
// //                 'containerNo',
// //                 'size',
// //                 'type',
// //                 'sealNo',
// //                 'sealType',
// //               ].map((k) => ({
// //                 label: `Container ${i + 1}: ${label(k)}`,
// //                 value: v(ct[k]),
// //               }))
// //           )}
// //         >

// //           <div className="space-y-3">

// //             {json.containers.map((ct, i) => (

// //               <div
// //                 key={i}
// //                 className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
// //               >

// //                 {/* Container header */}

// //                 <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">

// //                   <div className="flex items-center gap-2">

// //                     <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">

// //                       <Package
// //                         size={14}
// //                         className="text-blue-800"
// //                       />

// //                     </div>

// //                     <span className="text-xs font-black text-slate-800">
// //                       Container {i + 1}
// //                     </span>

// //                   </div>

// //                   <span className="text-[10px] font-mono text-slate-400">
// //                     {v(ct.containerNo) || '--'}
// //                   </span>

// //                 </div>


// //                 <div className="divide-y divide-slate-100">

// //                   {[
// //                     'containerNo',
// //                     'size',
// //                     'type',
// //                     'sealNo',
// //                     'sealType',
// //                   ].map((k) => (

// //                     <FieldRow
// //                       key={`ct${i}_${k}`}
// //                       label={`Container ${i + 1}: ${label(k)}`}
// //                       value={v(ct[k])}
// //                       confidence={c_(ct[k])}
// //                     />

// //                   ))}

// //                 </div>

// //               </div>

// //             ))}

// //           </div>

// //         </SectionCard>

// //       )}


// //       {/* ======================================================
// //           LINE ITEMS — CRITICAL
// //       ====================================================== */}

// //       {items.length > 0 && (

// //         <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-sm">

// //           {/* Critical header */}

// //           <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 px-5 py-4">

// //             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

// //               <div className="flex items-start gap-3">

// //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-900">

// //                   <Package
// //                     size={17}
// //                     className="text-white"
// //                   />

// //                 </div>


// //                 <div>

// //                   <div className="flex flex-wrap items-center gap-2">

// //                     <span className="rounded-md bg-blue-900 px-2 py-1 text-[10px] font-black text-white">
// //                       SEC 8
// //                     </span>

// //                     <h2 className="text-sm font-black text-blue-950">
// //                       Line Items
// //                     </h2>

// //                     <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-200">
// //                       {items.length} item
// //                       {items.length !== 1 && 's'}
// //                     </span>

// //                     <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-black text-red-700">
// //                       CRITICAL
// //                     </span>

// //                   </div>

// //                   <p className="mt-1 text-[11px] text-slate-500">
// //                     Verify item descriptions, quantities, values and HS
// //                     classifications before final submission.
// //                   </p>

// //                 </div>

// //               </div>


// //               <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2">

// //                 <AlertTriangle
// //                   size={14}
// //                   className="text-orange-500"
// //                 />

// //                 <span className="text-[10px] font-bold text-slate-600">
// //                   HS verification required
// //                 </span>

// //               </div>

// //             </div>

// //           </div>


// //           {/* Line items */}

// //           <div>

// //             {items.map((item, idx) => (

// //               <div
// //                 key={item.id || idx}
// //                 className="border-b border-slate-200 last:border-0"
// //               >

// //                 {/* Item header */}

// //                 <div className="flex items-center justify-between bg-slate-50 px-5 py-3">

// //                   <div className="flex items-center gap-3">

// //                     <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-black text-blue-900">

// //                       {String(idx + 1).padStart(2, '0')}

// //                     </span>

// //                     <span className="text-xs font-black text-slate-700">
// //                       Item {idx + 1}
// //                     </span>

// //                   </div>


// //                   <ConfidenceBadge
// //                     score={item.confidence_score}
// //                     showLabel
// //                   />

// //                 </div>


// //                 {/* Item fields */}

// //                 <div className="divide-y divide-slate-100">

// //                   <FieldRow
// //                     label="Description"
// //                     value={item.item_description}
// //                     confidence={0.95}
// //                   />

// //                   <FieldRow
// //                     label="HS Code"
// //                     value={item.hs_code}
// //                     confidence={item.confidence_score}
// //                   />

// //                   <FieldRow
// //                     label="Quantity"
// //                     value={item.quantity}
// //                     confidence={0.96}
// //                   />

// //                   <FieldRow
// //                     label="Unit"
// //                     value={item.unit}
// //                     confidence={0.98}
// //                   />

// //                   <FieldRow
// //                     label="Unit Price"
// //                     value={item.unit_price}
// //                     confidence={0.97}
// //                   />

// //                   <FieldRow
// //                     label="Total Value"
// //                     value={item.total_value}
// //                     confidence={0.97}
// //                   />

// //                 </div>


// //                 {/* AI HS Suggestions */}

// //                 {item.ai_suggested_hs?.length > 0 && (

// //                   <div className="border-t border-blue-100 bg-blue-50/40">

// //                     <HSCodeSuggestion
// //                       suggestions={item.ai_suggested_hs}
// //                       itemId={item.id}
// //                       onConfirm={handleHSConfirm}
// //                     />

// //                   </div>

// //                 )}

// //               </div>

// //             ))}

// //           </div>

// //         </div>

// //       )}


// //       {/* ======================================================
// //           FINAL SUMMARY
// //       ====================================================== */}

// //       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

// //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

// //           <div className="flex items-center gap-3">

// //             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

// //               <CheckCircle2
// //                 size={19}
// //                 className="text-green-600"
// //               />

// //             </div>

// //             <div>

// //               <p className="text-sm font-black text-slate-800">
// //                 Extraction Complete
// //               </p>

// //               <p className="mt-0.5 text-xs text-slate-400">
// //                 {extractedFieldCount} fields extracted from{' '}
// //                 {data.doc_type}
// //               </p>

// //             </div>

// //           </div>


// //           <div className="flex items-center gap-5">

// //             <div className="text-right">

// //               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                 Processing Time
// //               </p>

// //               <p className="mt-0.5 text-sm font-black text-slate-800">
// //                 {(
// //                   (data.extraction_time_ms || 0) /
// //                   1000
// //                 ).toFixed(1)}
// //                 s
// //               </p>

// //             </div>


// //             <div className="h-8 w-px bg-slate-200" />


// //             <div className="text-right">

// //               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                 Accuracy
// //               </p>

// //               <p className="mt-0.5 text-sm font-black text-green-700">
// //                 {data.accuracy_score?.toFixed(1) || '--'}%
// //               </p>

// //             </div>

// //           </div>

// //         </div>

// //       </div>

// //     </div>
// //   );
// // }




// // import { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';

// // import {
// //   getExtraction,
// //   editField,
// //   downloadExcel,
// //   confirmHSCode,
// // } from '../api';

// // import FieldRow from '../components/FieldRow.jsx';
// // import SectionCard from '../components/SectionCard.jsx';
// // import HSCodeSuggestion from '../components/HSCodeSuggestion.jsx';
// // import ConfidenceBadge from '../components/ConfidenceBadge.jsx';

// // import {
// //   Loader2,
// //   Download,
// //   FileSpreadsheet,
// //   FileText,
// //   ShieldCheck,
// //   AlertTriangle,
// //   CheckCircle2,
// //   Clock,
// //   Database,
// //   Sparkles,
// //   Package,
// // } from 'lucide-react';

// // import toast from 'react-hot-toast';


// // // ============================================================
// // // HELPERS
// // // ============================================================

// // const v = (field) => {
// //   if (field === null || field === undefined) return '';

// //   if (
// //     typeof field === 'object' &&
// //     Object.prototype.hasOwnProperty.call(field, 'value')
// //   ) {
// //     return field.value ?? '';
// //   }

// //   return field ?? '';
// // };


// // const c_ = (field) => {
// //   if (field === null || field === undefined) return 0;

// //   if (
// //     typeof field === 'object' &&
// //     Object.prototype.hasOwnProperty.call(field, 'confidence')
// //   ) {
// //     return Number(field.confidence) || 0;
// //   }

// //   return field ? 0.95 : 0;
// // };


// // // Convert snake_case into readable label
// // const label = (key) =>
// //   key
// //     .replace(/_/g, ' ')
// //     .replace(/\b\w/g, (c) => c.toUpperCase());


// // // ============================================================
// // // ALL 147 FIELDS
// // // ============================================================

// // const SECTIONS = {

// //   // ==========================================================
// //   // 1. JOB HEADER — 6
// //   // ==========================================================

// //   job_header: {
// //     title: 'Job / File Header',
// //     num: '1',
// //     keys: [
// //       'job_number',
// //       'job_date',
// //       'file_reference',
// //       'cha_licence_no',
// //       'port_code',
// //       'port_name',
// //     ],
// //   },


// //   // ==========================================================
// //   // 2. IMPORTER / EXPORTER — 15
// //   // ==========================================================

// //   importer_exporter: {
// //     title: 'Importer / Exporter',
// //     num: '2',
// //     keys: [
// //       'iec',
// //       'name',
// //       'address1',
// //       'address2',
// //       'gstin_type',
// //       'gstin',
// //       'pan',
// //       'ad_code',
// //       'exporter_type',
// //       'branch_sr_no',
// //       'bank_account',
// //       'drawback_account',
// //       'ifsc',
// //       'bank_name',
// //       'state_of_origin',
// //     ],
// //   },


// //   // ==========================================================
// //   // 3. FOREIGN PARTY — 5
// //   // ==========================================================

// //   foreign_party: {
// //     title: 'Foreign Party',
// //     num: '3',
// //     keys: [
// //       'foreign_name',
// //       'foreign_address1',
// //       'foreign_address2',
// //       'foreign_country',
// //       'foreign_country_code',
// //     ],
// //   },


// //   // ==========================================================
// //   // 4. CONSIGNEE — 6
// //   // ==========================================================

// //   consignee: {
// //     title: 'Consignee / Buyer',
// //     num: '4',
// //     keys: [
// //       'consignee_name',
// //       'consignee_address',
// //       'buyer_name_address',
// //       'notify_party',
// //       'payment_nature',
// //       'payment_period',
// //     ],
// //   },


// //   // ==========================================================
// //   // 5. SHIPMENT — 21
// //   // ==========================================================

// //   shipment: {
// //     title: 'Shipment / Vessel',
// //     num: '5',
// //     keys: [
// //       'port_of_loading',
// //       'port_of_discharge',
// //       'country_origin',
// //       'country_consignment',
// //       'port_final_dest',
// //       'country_final_dest',
// //       'cargo_nature',
// //       'total_packages',
// //       'loose_packets',
// //       'gross_weight',
// //       'net_weight',
// //       'no_containers',
// //       'marks_numbers',
// //       'vessel_name',
// //       'voyage_no',
// //       'rotation_no',
// //       'igm_no',
// //       'igm_date',
// //       'line_no',
// //       'bl_no',
// //       'bl_date',
// //     ],
// //   },


// //   // ==========================================================
// //   // 7. INVOICE — 25
// //   // ==========================================================

// //   invoice: {
// //     title: 'Invoice & Value',
// //     num: '7',
// //     keys: [
// //       'invoice_no',
// //       'invoice_date',
// //       'currency',
// //       'exchange_rate',
// //       'incoterms',
// //       'total_invoice_value_fc',
// //       'freight',
// //       'insurance',
// //       'landing_charges',
// //       'cif_value_fc',
// //       'assessable_value_inr',
// //       'fob_value_inr',
// //       'schedule_code',
// //       'reward_claimed',
// //       'scheme_description',
// //       'pmv_per_unit_inr',
// //       'total_pmv_inr',
// //       'igst_payment_status',
// //       'igst_value',
// //       'comp_cess_amount',
// //       'district_of_origin',
// //       'state_code',
// //       'sqc_qty_unit',
// //       'pta_fta_preference',
// //       'terms_of_payment',
// //     ],
// //   },


// //   // ==========================================================
// //   // 10. PACKING — 4
// //   // ==========================================================

// //   packing: {
// //     title: 'Packing Details',
// //     num: '10',
// //     keys: [
// //       'package_from',
// //       'package_to',
// //       'package_kind',
// //       'packing_description',
// //     ],
// //   },


// //   // ==========================================================
// //   // 11. SCHEME — 6
// //   // ==========================================================

// //   scheme: {
// //     title: 'Scheme',
// //     num: '11',
// //     keys: [
// //       'scheme_type',
// //       'registration_no',
// //       'registration_date',
// //       'export_quantity',
// //       'import_quantity',
// //       'scheme_sr_no',
// //     ],
// //   },


// //   // ==========================================================
// //   // 12. DRAWBACK — 7
// //   // ==========================================================

// //   drawback: {
// //     title: 'Drawback',
// //     num: '12',
// //     keys: [
// //       'dbk_sr_no',
// //       'dbk_code',
// //       'custom_rate',
// //       'dbk_rate',
// //       'dbk_quantity',
// //       'dbk_unit',
// //       'dbk_amount_inr',
// //     ],
// //   },


// //   // ==========================================================
// //   // 13. RODTEP — 5
// //   // ==========================================================

// //   rodtep: {
// //     title: 'RODTEP',
// //     num: '13',
// //     keys: [
// //       'rodtep_rate',
// //       'rodtep_cap',
// //       'rodtep_quantity',
// //       'rodtep_unit',
// //       'rodtep_amount_inr',
// //     ],
// //   },


// //   // ==========================================================
// //   // 14. E-SANCHIT — 7
// //   // ==========================================================

// //   esanchit: {
// //     title: 'e-Sanchit',
// //     num: '14',
// //     keys: [
// //       'esanchit_doc_type',
// //       'esanchit_file_type',
// //       'esanchit_doc_ref',
// //       'esanchit_issue_date',
// //       'esanchit_irn',
// //       'esanchit_party_name',
// //       'esanchit_place',
// //     ],
// //   },


// //   // ==========================================================
// //   // 15. DECLARATIONS — 6
// //   // ==========================================================

// //   declarations: {
// //     title: 'Declarations',
// //     num: '15',
// //     keys: [
// //       'anti_dumping',
// //       'safeguard_duty',
// //       'svb',
// //       'related_party',
// //       'first_check',
// //       'second_check',
// //     ],
// //   },
// // };


// // // ============================================================
// // // LINE ITEM FIELDS — 17
// // // ============================================================

// // const LINE_ITEM_FIELDS = [
// //   'sr_no',
// //   'description',
// //   'hs_code',
// //   'ritc_code',
// //   'quantity',
// //   'unit',
// //   'unit_price_fc',
// //   'total_value_fc',
// //   'fob_value',
// //   'assessable_value_inr',
// //   'country_of_origin',
// //   'bcd_rate',
// //   'sws_rate',
// //   'igst_rate',
// //   'comp_cess_rate',
// //   'exemption_notif',
// //   'end_use_code',
// // ];


// // // ============================================================
// // // DUTY FIELDS — 6
// // // ============================================================

// // const DUTY_FIELDS = [
// //   'bcd_amount_inr',
// //   'sws_amount_inr',
// //   'igst_amount_inr',
// //   'comp_cess_inr',
// //   'total_duty',
// //   'assessment_method',
// // ];


// // // ============================================================
// // // CONTAINER FIELDS — 11
// // // ============================================================

// // const CONTAINER_FIELDS = [
// //   'container_no',
// //   'container_size',
// //   'container_type',
// //   'seal_no',
// //   'seal_type',
// //   'seal_date',
// //   'seal_device_id',
// //   'tare_weight',
// //   'container_gross_wt',
// //   'movement_doc_type',
// //   'movement_doc_no',
// // ];


// // // ============================================================
// // // COMPONENT
// // // ============================================================

// // export default function Results() {

// //   const { id } = useParams();

// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);


// //   // ==========================================================
// //   // LOAD EXTRACTION
// //   // ==========================================================

// //   useEffect(() => {

// //     getExtraction(id)
// //       .then((res) => {
// //         setData(res.data);
// //       })
// //       .catch(() => {
// //         toast.error('Failed to load extraction');
// //       })
// //       .finally(() => {
// //         setLoading(false);
// //       });

// //   }, [id]);


// //   // ==========================================================
// //   // EDIT FIELD
// //   // ==========================================================

// //   const handleFieldEdit = async (fieldPath, newValue) => {

// //     try {

// //       await editField(id, fieldPath, newValue);

// //       toast.success('Field updated');

// //       const res = await getExtraction(id);

// //       setData(res.data);

// //     } catch {

// //       toast.error('Failed to update');

// //     }

// //   };


// //   // ==========================================================
// //   // CONFIRM HS CODE
// //   // ==========================================================

// //   const handleHSConfirm = async (itemId, code) => {

// //     try {

// //       await confirmHSCode(id, itemId, code);

// //       toast.success(`HS Code ${code} confirmed`);

// //       const res = await getExtraction(id);

// //       setData(res.data);

// //     } catch {

// //       toast.error('Failed to confirm HS code');

// //     }

// //   };


// //   // ==========================================================
// //   // LOADING
// //   // ==========================================================

// //   if (loading) {

// //     return (
// //       <div className="flex min-h-[500px] items-center justify-center">

// //         <div className="text-center">

// //           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

// //             <Loader2
// //               size={25}
// //               className="animate-spin text-blue-900"
// //             />

// //           </div>

// //           <p className="mt-4 text-sm font-bold text-slate-700">
// //             Loading extraction...
// //           </p>

// //           <p className="mt-1 text-xs text-slate-400">
// //             Preparing your extracted data
// //           </p>

// //         </div>

// //       </div>
// //     );

// //   }


// //   // ==========================================================
// //   // NOT FOUND
// //   // ==========================================================

// //   if (!data) {

// //     return (
// //       <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

// //         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

// //           <AlertTriangle
// //             size={24}
// //             className="text-red-500"
// //           />

// //         </div>

// //         <h2 className="mt-4 text-lg font-black text-slate-900">
// //           Extraction not found
// //         </h2>

// //         <p className="mt-2 text-sm text-slate-400">
// //           The requested extraction could not be loaded.
// //         </p>

// //       </div>
// //     );

// //   }


// //   const json = data.extracted_json || {};

// //   const containers = Array.isArray(json.containers)
// //     ? json.containers
// //     : [];

// //   const lineItems = Array.isArray(json.line_items)
// //     ? json.line_items
// //     : [];


// //   // ==========================================================
// //   // BUILD STANDARD FIELDS
// //   // ==========================================================

// //   const buildFields = (sectionKey) => {

// //     const sec = json[sectionKey] || {};

// //     const def = SECTIONS[sectionKey];

// //     if (!def) return [];

// //     return def.keys.map((key) => ({

// //       label: label(key),

// //       value: v(sec[key]),

// //       confidence: c_(sec[key]),

// //       key: `${sectionKey}.${key}`,

// //     }));

// //   };


// //   // ==========================================================
// //   // FIELD COUNT
// //   //
// //   // Standard sections = 108
// //   // Containers and line items are dynamic.
// //   // ==========================================================

// //   const standardFieldCount = Object.values(SECTIONS)
// //     .reduce(
// //       (total, section) => total + section.keys.length,
// //       0
// //     );


// //   const containerFieldCount =
// //     containers.length * CONTAINER_FIELDS.length;


// //   const lineItemFieldCount =
// //     lineItems.length * LINE_ITEM_FIELDS.length;


// //   const dutyFieldCount =
// //     DUTY_FIELDS.length;


// //   const extractedFieldCount =
// //     standardFieldCount +
// //     containerFieldCount +
// //     lineItemFieldCount +
// //     dutyFieldCount;


// //   const accuracy = Number(data.accuracy_score) || 0;


// //   // ==========================================================
// //   // CSV DOWNLOAD
// //   // ALL AVAILABLE FIELDS
// //   // ==========================================================

// //   const handleCSVDownload = () => {

// //     if (!data) return;

// //     const rows = [];

// //     rows.push([
// //       'Section',
// //       'Field',
// //       'Value',
// //       'Confidence',
// //     ]);


// //     // --------------------------------------------------------
// //     // Standard sections
// //     // --------------------------------------------------------

// //     Object.entries(SECTIONS).forEach(
// //       ([sectionKey, def]) => {

// //         const sec = json[sectionKey] || {};

// //         def.keys.forEach((key) => {

// //           rows.push([
// //             def.title,
// //             label(key),
// //             v(sec[key]),
// //             `${(c_(sec[key]) * 100).toFixed(1)}%`,
// //           ]);

// //         });

// //       }
// //     );


// //     // --------------------------------------------------------
// //     // Containers
// //     // --------------------------------------------------------

// //     containers.forEach((container, index) => {

// //       CONTAINER_FIELDS.forEach((key) => {

// //         rows.push([
// //           `Container ${index + 1}`,
// //           label(key),
// //           v(container[key]),
// //           `${(c_(container[key]) * 100).toFixed(1)}%`,
// //         ]);

// //       });

// //     });


// //     // --------------------------------------------------------
// //     // Line Items
// //     // --------------------------------------------------------

// //     lineItems.forEach((item, index) => {

// //       LINE_ITEM_FIELDS.forEach((key) => {

// //         rows.push([
// //           `Line Item ${index + 1}`,
// //           label(key),
// //           v(item[key]),
// //           `${(c_(item[key]) * 100).toFixed(1)}%`,
// //         ]);

// //       });


// //       // HS suggestions
// //       const suggestions =
// //         item.hs_suggestions ||
// //         item.ai_suggested_hs ||
// //         [];

// //       if (suggestions.length) {

// //         suggestions.forEach((suggestion, suggestionIndex) => {

// //           rows.push([
// //             `Line Item ${index + 1}`,
// //             `HS Suggestion ${suggestionIndex + 1}`,
// //             suggestion.code ||
// //               suggestion.hs_code ||
// //               '',
// //             suggestion.confidence !== undefined
// //               ? `${(
// //                   Number(suggestion.confidence) * 100
// //                 ).toFixed(1)}%`
// //               : '',
// //           ]);

// //         });

// //       }

// //     });


// //     // --------------------------------------------------------
// //     // DUTY
// //     // --------------------------------------------------------

// //     const duty = json.duty || {};

// //     DUTY_FIELDS.forEach((key) => {

// //       rows.push([
// //         'Duty',
// //         label(key),
// //         v(duty[key]),
// //         `${(c_(duty[key]) * 100).toFixed(1)}%`,
// //       ]);

// //     });


// //     // --------------------------------------------------------
// //     // CSV ESCAPING
// //     // --------------------------------------------------------

// //     const escapeCSV = (value) => {

// //       const stringValue = String(value ?? '');

// //       return `"${stringValue.replace(/"/g, '""')}"`;

// //     };


// //     const csv = rows
// //       .map((row) =>
// //         row.map(escapeCSV).join(',')
// //       )
// //       .join('\n');


// //     const blob = new Blob(
// //       ['\uFEFF' + csv],
// //       {
// //         type: 'text/csv;charset=utf-8;',
// //       }
// //     );


// //     const url = URL.createObjectURL(blob);

// //     const link = document.createElement('a');

// //     link.href = url;

// //     link.download =
// //       `${v(json.job_header?.job_number) || 'extraction'}.csv`;

// //     document.body.appendChild(link);

// //     link.click();

// //     document.body.removeChild(link);

// //     URL.revokeObjectURL(url);

// //     toast.success('CSV downloaded');

// //   };


// //   // ==========================================================
// //   // RENDER
// //   // ==========================================================

// //   return (

// //     <div className="space-y-5">


// //       {/* ======================================================
// //           TOP HEADER
// //       ====================================================== */}

// //       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-6 shadow-xl sm:p-7">

// //         <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

// //         <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />


// //         <div className="relative z-10">


// //           {/* HEADER */}

// //           <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

// //             <div className="flex items-start gap-4">

// //               <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 shadow-lg sm:flex">

// //                 <FileText
// //                   size={24}
// //                   className="text-slate-950"
// //                 />

// //               </div>


// //               <div>

// //                 <div className="flex flex-wrap items-center gap-2">

// //                   <h1 className="text-2xl font-black tracking-tight text-white">
// //                     Extraction Results
// //                   </h1>

// //                   <span
// //                     className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
// //                       data.doc_type === 'BOE'
// //                         ? 'bg-blue-100 text-blue-800'
// //                         : 'bg-green-100 text-green-800'
// //                     }`}
// //                   >
// //                     {data.doc_type === 'BOE'
// //                       ? 'BOE — IMPORT'
// //                       : 'SB — EXPORT'}
// //                   </span>

// //                 </div>


// //                 <p className="mt-2 text-sm text-slate-300">
// //                   Review, verify and edit the extracted customs data.
// //                 </p>


// //                 <div className="mt-4 flex flex-wrap items-center gap-3">

// //                   <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">

// //                     <FileText
// //                       size={13}
// //                       className="text-slate-400"
// //                     />

// //                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                       Job
// //                     </span>

// //                     <span className="font-mono text-xs font-bold text-white">
// //                       {v(json.job_header?.job_number) || '--'}
// //                     </span>

// //                   </div>


// //                   <div className="flex items-center gap-2 text-xs text-slate-400">

// //                     <Clock size={13} />

// //                     Extraction #{id}

// //                   </div>

// //                 </div>

// //               </div>

// //             </div>


// //             {/* ACTIONS */}

// //             <div className="flex flex-wrap gap-2">

// //               <button
// //                 onClick={() =>
// //                   downloadExcel(
// //                     id,
// //                     v(json.job_header?.job_number)
// //                   )
// //                 }
// //                 className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
// //               >

// //                 <FileSpreadsheet size={15} />

// //                 Excel

// //               </button>


// //               <button
// //                 onClick={handleCSVDownload}
// //                 className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
// //               >

// //                 <Download size={15} />

// //                 CSV

// //               </button>

// //             </div>

// //           </div>


// //           {/* METRICS */}

// //           <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">


// //             {/* Accuracy */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <ShieldCheck
// //                   size={15}
// //                   className={
// //                     accuracy >= 0.9 || accuracy >= 90
// //                       ? 'text-teal-300'
// //                       : 'text-yellow-300'
// //                   }
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Accuracy
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">

// //                 {accuracy
// //                   ? `${accuracy.toFixed(1)}%`
// //                   : '--'}

// //               </p>

// //             </div>


// //             {/* Fields */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Database
// //                   size={15}
// //                   className="text-blue-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Schema Fields
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">

// //                 147

// //               </p>

// //               <p className="text-[9px] text-slate-400">
// //                 {extractedFieldCount} including repeated items
// //               </p>

// //             </div>


// //             {/* Items */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Package
// //                   size={15}
// //                   className="text-purple-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Line Items
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">
// //                 {lineItems.length}
// //               </p>

// //             </div>


// //             {/* Processing */}

// //             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

// //               <div className="flex items-center gap-2">

// //                 <Clock
// //                   size={15}
// //                   className="text-teal-300"
// //                 />

// //                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Processing
// //                 </span>

// //               </div>

// //               <p className="mt-1 text-lg font-black text-white">

// //                 {(
// //                   (data.extraction_time_ms || 0) / 1000
// //                 ).toFixed(1)}s

// //               </p>

// //             </div>

// //           </div>

// //         </div>

// //       </div>


// //       {/* ======================================================
// //           CONFIDENCE LEGEND
// //       ====================================================== */}

// //       <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

// //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

// //           <div className="flex items-center gap-2">

// //             <Sparkles
// //               size={16}
// //               className="text-blue-800"
// //             />

// //             <span className="text-xs font-black text-slate-800">
// //               AI Confidence
// //             </span>

// //           </div>


// //           <div className="flex flex-wrap items-center gap-4">

// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.95} />

// //               High 90%+

// //             </span>


// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.75} />

// //               Review 70–89%

// //             </span>


// //             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

// //               <ConfidenceBadge score={0.5} />

// //               Check &lt;70%

// //             </span>

// //           </div>

// //         </div>

// //       </div>


// //       {/* ======================================================
// //           SECTION TITLE
// //       ====================================================== */}

// //       <div>

// //         <h2 className="text-lg font-black tracking-tight text-slate-900">
// //           Extracted Information
// //         </h2>

// //         <p className="mt-1 text-xs text-slate-400">
// //           Review the AI-extracted customs fields below.
// //           Missing fields are shown as unavailable.
// //         </p>

// //       </div>


// //       {/* ======================================================
// //           STANDARD SECTIONS
// //       ====================================================== */}

// //       {Object.entries(SECTIONS).map(
// //         ([sectionKey, def]) => {

// //           const fields = buildFields(sectionKey);

// //           if (!fields.length) return null;

// //           return (

// //             <SectionCard
// //               key={sectionKey}
// //               title={def.title}
// //               number={def.num}
// //               fields={fields}
// //             >

// //               {fields.map((field) => (

// //                 <FieldRow
// //                   key={field.key}
// //                   label={field.label}
// //                   value={field.value || '--'}
// //                   confidence={field.confidence}
// //                   fieldKey={field.key}
// //                   onEdit={handleFieldEdit}
// //                 />

// //               ))}

// //             </SectionCard>

// //           );

// //         }
// //       )}


// //       {/* ======================================================
// //           CONTAINER DETAILS — 11 FIELDS EACH
// //       ====================================================== */}

// //       <SectionCard
// //         title="Container Details"
// //         number="6"
// //         fields={containers.flatMap(
// //           (container, index) =>
// //             CONTAINER_FIELDS.map((key) => ({
// //               label: `Container ${index + 1}: ${label(key)}`,
// //               value: v(container[key]),
// //               confidence: c_(container[key]),
// //               key: `containers.${index}.${key}`,
// //             }))
// //         )}
// //       >

// //         {containers.length === 0 ? (

// //           <div className="p-5 text-center text-xs text-slate-400">
// //             No container information available.
// //           </div>

// //         ) : (

// //           <div className="space-y-3">

// //             {containers.map((container, index) => (

// //               <div
// //                 key={index}
// //                 className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
// //               >

// //                 <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">

// //                   <div className="flex items-center gap-2">

// //                     <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">

// //                       <Package
// //                         size={14}
// //                         className="text-blue-800"
// //                       />

// //                     </div>

// //                     <span className="text-xs font-black text-slate-800">
// //                       Container {index + 1}
// //                     </span>

// //                   </div>


// //                   <span className="font-mono text-[10px] text-slate-400">
// //                     {v(container.container_no) || '--'}
// //                   </span>

// //                 </div>


// //                 <div className="divide-y divide-slate-100">

// //                   {CONTAINER_FIELDS.map((key) => (

// //                     <FieldRow
// //                       key={`container-${index}-${key}`}
// //                       label={label(key)}
// //                       value={v(container[key]) || '--'}
// //                       confidence={c_(container[key])}
// //                       fieldKey={`containers.${index}.${key}`}
// //                       onEdit={handleFieldEdit}
// //                     />

// //                   ))}

// //                 </div>

// //               </div>

// //             ))}

// //           </div>

// //         )}

// //       </SectionCard>


// //       {/* ======================================================
// //           LINE ITEMS — 17 FIELDS EACH
// //       ====================================================== */}

// //       <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-sm">

// //         <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 px-5 py-4">

// //           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

// //             <div className="flex items-start gap-3">

// //               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-900">

// //                 <Package
// //                   size={17}
// //                   className="text-white"
// //                 />

// //               </div>


// //               <div>

// //                 <div className="flex flex-wrap items-center gap-2">

// //                   <span className="rounded-md bg-blue-900 px-2 py-1 text-[10px] font-black text-white">
// //                     SEC 8
// //                   </span>

// //                   <h2 className="text-sm font-black text-blue-950">
// //                     Line Items
// //                   </h2>

// //                   <span className="rounded-md border border-blue-200 bg-white px-2 py-1 text-[10px] font-bold text-blue-700">
// //                     {lineItems.length} item
// //                     {lineItems.length !== 1 && 's'}
// //                   </span>

// //                   <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-black text-red-700">
// //                     CRITICAL
// //                   </span>

// //                 </div>

// //                 <p className="mt-1 text-[11px] text-slate-500">
// //                   Verify descriptions, quantities, values and HS
// //                   classifications before final submission.
// //                 </p>

// //               </div>

// //             </div>


// //             <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2">

// //               <AlertTriangle
// //                 size={14}
// //                 className="text-orange-500"
// //               />

// //               <span className="text-[10px] font-bold text-slate-600">
// //                 HS verification required
// //               </span>

// //             </div>

// //           </div>

// //         </div>


// //         {lineItems.length === 0 ? (

// //           <div className="p-8 text-center text-xs text-slate-400">
// //             No line items available.
// //           </div>

// //         ) : (

// //           lineItems.map((item, index) => (

// //             <div
// //               key={item.id || index}
// //               className="border-b border-slate-200 last:border-0"
// //             >

// //               {/* Item header */}

// //               <div className="flex items-center justify-between bg-slate-50 px-5 py-3">

// //                 <div className="flex items-center gap-3">

// //                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-black text-blue-900">

// //                     {String(index + 1).padStart(2, '0')}

// //                   </span>

// //                   <span className="text-xs font-black text-slate-700">
// //                     Item {index + 1}
// //                   </span>

// //                 </div>


// //                 <ConfidenceBadge
// //                   score={c_(item.description)}
// //                   showLabel
// //                 />

// //               </div>


// //               {/* ALL 17 LINE ITEM FIELDS */}

// //               <div className="divide-y divide-slate-100">

// //                 {LINE_ITEM_FIELDS.map((key) => (

// //                   <FieldRow
// //                     key={`item-${index}-${key}`}
// //                     label={label(key)}
// //                     value={v(item[key]) || '--'}
// //                     confidence={c_(item[key])}
// //                     fieldKey={`line_items.${index}.${key}`}
// //                     onEdit={handleFieldEdit}
// //                   />

// //                 ))}

// //               </div>


// //               {/* ==================================================
// //                   SUPABASE / AI HS SUGGESTIONS
// //               ================================================== */}

// //               {(
// //                 item.hs_suggestions ||
// //                 item.ai_suggested_hs ||
// //                 item.suggestedHSCodes
// //               )?.length > 0 && (

// //                 <div className="border-t border-blue-100 bg-blue-50/40">

// //                   <div className="px-5 pt-4">

// //                     <div className="mb-3 flex items-center gap-2">

// //                       <Database
// //                         size={15}
// //                         className="text-blue-800"
// //                       />

// //                       <span className="text-xs font-black text-blue-950">
// //                         HS Code Suggestions
// //                       </span>

// //                       <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
// //                         Supabase
// //                       </span>

// //                     </div>

// //                   </div>


// //                   <HSCodeSuggestion
// //                     suggestions={
// //                       item.hs_suggestions ||
// //                       item.ai_suggested_hs ||
// //                       item.suggestedHSCodes
// //                     }
// //                     itemId={
// //                       item.id ||
// //                       item.sr_no?.value ||
// //                       index
// //                     }
// //                     onConfirm={handleHSConfirm}
// //                   />

// //                 </div>

// //               )}

// //             </div>

// //           ))

// //         )}

// //       </div>


// //       {/* ======================================================
// //           DUTY — 6 FIELDS
// //       ====================================================== */}

// //       <SectionCard
// //         title="Duty"
// //         number="9"
// //         fields={DUTY_FIELDS.map((key) => ({
// //           label: label(key),
// //           value: v(json.duty?.[key]),
// //           confidence: c_(json.duty?.[key]),
// //           key: `duty.${key}`,
// //         }))}
// //       >

// //         {DUTY_FIELDS.map((key) => (

// //           <FieldRow
// //             key={key}
// //             label={label(key)}
// //             value={v(json.duty?.[key]) || '--'}
// //             confidence={c_(json.duty?.[key])}
// //             fieldKey={`duty.${key}`}
// //             onEdit={handleFieldEdit}
// //           />

// //         ))}

// //       </SectionCard>


// //       {/* ======================================================
// //           FINAL SUMMARY
// //       ====================================================== */}

// //       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

// //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

// //           <div className="flex items-center gap-3">

// //             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

// //               <CheckCircle2
// //                 size={19}
// //                 className="text-green-600"
// //               />

// //             </div>


// //             <div>

// //               <p className="text-sm font-black text-slate-800">
// //                 Extraction Complete
// //               </p>

// //               <p className="mt-0.5 text-xs text-slate-400">

// //                 147-field customs extraction schema

// //                 {lineItems.length > 0 &&
// //                   ` • ${lineItems.length} line item${
// //                     lineItems.length !== 1 ? 's' : ''
// //                   }`}

// //                 {containers.length > 0 &&
// //                   ` • ${containers.length} container${
// //                     containers.length !== 1 ? 's' : ''
// //                   }`}

// //               </p>

// //             </div>

// //           </div>


// //           <div className="flex items-center gap-5">


// //             <div className="text-right">

// //               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                 Processing Time
// //               </p>

// //               <p className="mt-0.5 text-sm font-black text-slate-800">

// //                 {(
// //                   (data.extraction_time_ms || 0) /
// //                   1000
// //                 ).toFixed(1)}s

// //               </p>

// //             </div>


// //             <div className="h-8 w-px bg-slate-200" />


// //             <div className="text-right">

// //               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                 Accuracy
// //               </p>

// //               <p className="mt-0.5 text-sm font-black text-green-700">

// //                 {accuracy
// //                   ? `${accuracy.toFixed(1)}%`
// //                   : '--'}

// //               </p>

// //             </div>

// //           </div>

// //         </div>

// //       </div>

// //     </div>

// //   );

// // }









// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import {
//   getExtraction,
//   editField,
//   downloadExcel,
//   downloadCSV,
// } from '../api';

// import FieldRow from '../components/FieldRow.jsx';
// import SectionCard from '../components/SectionCard.jsx';
// import ConfidenceBadge from '../components/ConfidenceBadge.jsx';

// import {
//   Loader2,
//   Download,
//   FileSpreadsheet,
//   FileText,
//   ArrowLeft,
//   ShieldCheck,
//   AlertTriangle,
//   CheckCircle2,
//   Clock,
//   Database,
//   Sparkles,
//   Package,
//   ExternalLink,
//   Search,
//   ShieldAlert,
//   Info,
// } from 'lucide-react';

// import toast from 'react-hot-toast';


// // ============================================================
// // CONFIGURATION
// // ============================================================

// // Change this if your actual React route is different.
// const HS_LOOKUP_PATH = '/hs-lookup';

// // Official Indian Customs / Government references.
// const ICEGATE_TRADE_GUIDE =
//   'https://www.icegate.gov.in/Webappl/Trade-Guide-on-Imports';

// const CBIC_TARIFF =
//   'https://www.cbic.gov.in/entities/customs-tariff';


// // ============================================================
// // HELPERS
// // ============================================================

// const isObject = (value) =>
//   value !== null &&
//   typeof value === 'object' &&
//   !Array.isArray(value);


// // Gemini fields may be:
// //
// // { value: "...", confidence: 0.95 }
// //
// // or:
// //
// // "..."
// //

// const v = (field) => {
//   if (
//     field &&
//     typeof field === 'object' &&
//     Object.prototype.hasOwnProperty.call(field, 'value')
//   ) {
//     return field.value ?? '';
//   }

//   return field ?? '';
// };


// const confidence = (field) => {
//   if (
//     field &&
//     typeof field === 'object' &&
//     Object.prototype.hasOwnProperty.call(field, 'confidence')
//   ) {
//     const value = Number(field.confidence);

//     if (!Number.isNaN(value)) {
//       return value;
//     }
//   }

//   return field ? 0.95 : 0;
// };


// const safeString = (value) => {
//   if (value === null || value === undefined) return '';

//   if (typeof value === 'object') {
//     if (Object.prototype.hasOwnProperty.call(value, 'value')) {
//       return String(value.value ?? '');
//     }

//     return JSON.stringify(value);
//   }

//   return String(value);
// };


// // ============================================================
// // FIELD LABEL
// // ============================================================

// const label = (key) =>
//   String(key)
//     .replace(/_/g, ' ')
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/\s+/g, ' ')
//     .trim()
//     .replace(/^./, (c) => c.toUpperCase());


// // ============================================================
// // 147-FIELD SCHEMA
// //
// // These are the fields from your original 147-field table.
// // ============================================================

// const SECTIONS = {

//   job: {
//     title: 'Job / File Header',
//     number: '1',
//     fields: [
//       'job_number',
//       'job_date',
//       'file_reference',
//       'cha_licence_no',
//       'port_code',
//       'port_name',
//     ],
//   },


//   importer_exporter: {
//     title: 'Importer / Exporter',
//     number: '2',
//     fields: [
//       'iec',
//       'name',
//       'address1',
//       'address2',
//       'gstin_type',
//       'gstin',
//       'pan',
//       'ad_code',
//       'exporter_type',
//       'branch_sr_no',
//       'bank_account',
//       'drawback_account',
//       'ifsc',
//       'bank_name',
//       'state_of_origin',
//     ],
//   },


//   foreign_party: {
//     title: 'Foreign Party',
//     number: '3',
//     fields: [
//       'foreign_name',
//       'foreign_address1',
//       'foreign_address2',
//       'foreign_country',
//       'foreign_country_code',
//     ],
//   },


//   consignee: {
//     title: 'Consignee / Buyer',
//     number: '4',
//     fields: [
//       'consignee_name',
//       'consignee_address',
//       'buyer_name_address',
//       'notify_party',
//       'payment_nature',
//       'payment_period',
//     ],
//   },


//   shipment: {
//     title: 'Shipment',
//     number: '5',
//     fields: [
//       'port_of_loading',
//       'port_of_discharge',
//       'country_origin',
//       'country_consignment',
//       'port_final_dest',
//       'country_final_dest',
//       'cargo_nature',
//       'total_packages',
//       'loose_packets',
//       'gross_weight',
//       'net_weight',
//       'no_containers',
//       'marks_numbers',
//       'vessel_name',
//       'voyage_no',
//       'rotation_no',
//       'igm_no',
//       'igm_date',
//       'line_no',
//       'bl_no',
//       'bl_date',
//     ],
//   },


//   invoice: {
//     title: 'Invoice & Value',
//     number: '7',
//     fields: [
//       'invoice_no',
//       'invoice_date',
//       'currency',
//       'exchange_rate',
//       'incoterms',
//       'total_invoice_value_fc',
//       'freight',
//       'insurance',
//       'landing_charges',
//       'cif_value_fc',
//       'assessable_value_inr',
//       'fob_value_inr',
//       'schedule_code',
//       'reward_claimed',
//       'scheme_description',
//       'pmv_per_unit_inr',
//       'total_pmv_inr',
//       'igst_payment_status',
//       'igst_value',
//       'comp_cess_amount',
//       'district_of_origin',
//       'state_code',
//       'sqc_qty_unit',
//       'pta_fta_preference',
//       'terms_of_payment',
//     ],
//   },


//   duty: {
//     title: 'Duty',
//     number: '9',
//     fields: [
//       'bcd_amount_inr',
//       'sws_amount_inr',
//       'igst_amount_inr',
//       'comp_cess_inr',
//       'total_duty',
//       'assessment_method',
//     ],
//   },


//   packing: {
//     title: 'Packing Details',
//     number: '10',
//     fields: [
//       'package_from',
//       'package_to',
//       'package_kind',
//       'packing_description',
//     ],
//   },


//   scheme: {
//     title: 'Scheme',
//     number: '11',
//     fields: [
//       'scheme_type',
//       'registration_no',
//       'registration_date',
//       'export_quantity',
//       'import_quantity',
//       'scheme_sr_no',
//     ],
//   },


//   drawback: {
//     title: 'Drawback',
//     number: '12',
//     fields: [
//       'dbk_sr_no',
//       'dbk_code',
//       'custom_rate',
//       'dbk_rate',
//       'dbk_quantity',
//       'dbk_unit',
//       'dbk_amount_inr',
//     ],
//   },


//   rodtep: {
//     title: 'RODTEP',
//     number: '13',
//     fields: [
//       'rodtep_rate',
//       'rodtep_cap',
//       'rodtep_quantity',
//       'rodtep_unit',
//       'rodtep_amount_inr',
//     ],
//   },


//   esanchit: {
//     title: 'e-Sanchit',
//     number: '14',
//     fields: [
//       'esanchit_doc_type',
//       'esanchit_file_type',
//       'esanchit_doc_ref',
//       'esanchit_issue_date',
//       'esanchit_irn',
//       'esanchit_party_name',
//       'esanchit_place',
//     ],
//   },


//   declarations: {
//     title: 'Declarations',
//     number: '15',
//     fields: [
//       'anti_dumping',
//       'safeguard_duty',
//       'svb',
//       'related_party',
//       'first_check',
//       'second_check',
//     ],
//   },
// };


// // ============================================================
// // CONTAINER FIELDS
// //
// // Your original table actually contains 11 container fields.
// // ============================================================

// const CONTAINER_FIELDS = [
//   'container_no',
//   'container_size',
//   'container_type',
//   'seal_no',
//   'seal_type',
//   'seal_date',
//   'seal_device_id',
//   'tare_weight',
//   'container_gross_wt',
//   'movement_doc_type',
//   'movement_doc_no',
// ];


// // ============================================================
// // LINE ITEM FIELDS
// //
// // 17 fields from your table.
// // ============================================================

// const LINE_ITEM_FIELDS = [
//   'sr_no',
//   'description',
//   'hs_code',
//   'ritc_code',
//   'quantity',
//   'unit',
//   'unit_price_fc',
//   'total_value_fc',
//   'fob_value',
//   'assessable_value_inr',
//   'country_of_origin',
//   'bcd_rate',
//   'sws_rate',
//   'igst_rate',
//   'comp_cess_rate',
//   'exemption_notif',
//   'end_use_code',
// ];


// // ============================================================
// // FIELD COUNTER
// // ============================================================

// const BASE_FIELD_COUNT = Object.values(SECTIONS).reduce(
//   (total, section) => total + section.fields.length,
//   0
// );


// // ============================================================
// // GET SECTION OBJECT
// //
// // Supports both:
// //
// // json.importer_exporter
// //
// // and, for compatibility:
// //
// // json.importerExporter
// // ============================================================

// const getSection = (json, key) => {
//   if (json?.[key]) {
//     return json[key];
//   }

//   const camelKey = key.replace(/_([a-z])/g, (_, c) =>
//     c.toUpperCase()
//   );

//   return json?.[camelKey] || {};
// };


// // ============================================================
// // COMPONENT
// // ============================================================

// export default function Results() {

//   const { id } = useParams();

//   const navigate = useNavigate();

//   const [data, setData] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);


//   // ==========================================================
//   // LOAD EXTRACTION
//   // ==========================================================

//   useEffect(() => {

//     let mounted = true;

//     setLoading(true);

//     getExtraction(id)
//       .then((res) => {

//         if (!mounted) return;

//         const result = res.data;

//         setData(result);

//       })
//       .catch((err) => {

//         console.error(err);

//         toast.error(
//           'Failed to load extraction'
//         );

//       })
//       .finally(() => {

//         if (mounted) {
//           setLoading(false);
//         }

//       });

//     return () => {
//       mounted = false;
//     };

//   }, [id]);


//   // ==========================================================
//   // EDIT FIELD
//   // ==========================================================

//   const handleFieldEdit = async (
//     fieldPath,
//     newValue
//   ) => {

//     try {

//       setSaving(true);

//       await editField(
//         id,
//         fieldPath,
//         newValue
//       );

//       toast.success(
//         'Field updated successfully'
//       );


//       const res =
//         await getExtraction(id);

//       setData(res.data);

//     } catch (err) {

//       console.error(err);

//       toast.error(
//         'Failed to update field'
//       );

//     } finally {

//       setSaving(false);

//     }

//   };


//   // ==========================================================
//   // LOADING
//   // ==========================================================

//   if (loading) {

//     return (

//       <div className="flex min-h-[70vh] items-center justify-center">

//         <div className="text-center">

//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

//             <Loader2
//               size={25}
//               className="animate-spin text-blue-900"
//             />

//           </div>

//           <p className="mt-4 text-sm font-bold text-slate-700">
//             Loading extraction...
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             Preparing your extracted customs data
//           </p>

//         </div>

//       </div>

//     );

//   }


//   // ==========================================================
//   // NOT FOUND
//   // ==========================================================

//   if (!data) {

//     return (

//       <div className="flex min-h-[70vh] items-center justify-center">

//         <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

//             <AlertTriangle
//               size={24}
//               className="text-red-500"
//             />

//           </div>

//           <h2 className="mt-4 text-lg font-black text-slate-900">
//             Extraction not found
//           </h2>

//           <p className="mt-2 text-sm text-slate-400">
//             The requested extraction could not be loaded.
//           </p>

//           <button
//             onClick={() => navigate(-1)}
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-900"
//           >

//             <ArrowLeft size={14} />

//             Go Back

//           </button>

//         </div>

//       </div>

//     );

//   }


//   // ==========================================================
//   // EXTRACTED JSON
//   // ==========================================================

//   const json =
//     data.extracted_json ||
//     data.extractedData ||
//     {};


//   // ==========================================================
//   // ITEMS
//   //
//   // Support:
//   // json.items
//   //
//   // and:
//   // json.line_items
//   // ==========================================================

//   const items =
//     Array.isArray(json.items)
//       ? json.items
//       : Array.isArray(json.line_items)
//         ? json.line_items
//         : Array.isArray(data.items)
//           ? data.items
//           : [];


//   // ==========================================================
//   // CONTAINERS
//   // ==========================================================

//   const containers =
//     Array.isArray(json.containers)
//       ? json.containers
//       : [];


//   // ==========================================================
//   // BUILD STANDARD SECTION FIELDS
//   // ==========================================================

//   const buildFields = (
//     sectionKey
//   ) => {

//     const section =
//       getSection(
//         json,
//         sectionKey
//       );

//     const definition =
//       SECTIONS[sectionKey];

//     if (!definition) {
//       return [];
//     }

//     return definition.fields.map(
//       (key) => ({

//         label: label(key),

//         value: v(
//           section?.[key]
//         ),

//         confidence: confidence(
//           section?.[key]
//         ),

//         key:
//           `${sectionKey}.${key}`,

//       })
//     );

//   };


//   // ==========================================================
//   // COUNT ACTUALLY DISPLAYABLE FIELDS
//   // ==========================================================

//   const extractedFieldCount =
//     BASE_FIELD_COUNT +
//     (
//       containers.length *
//       CONTAINER_FIELDS.length
//     ) +
//     (
//       items.length *
//       LINE_ITEM_FIELDS.length
//     );


//   // ==========================================================
//   // ACCURACY
//   // ==========================================================

//   let accuracy =
//     Number(
//       data.accuracy_score
//     );

//   if (
//     Number.isNaN(accuracy)
//   ) {

//     accuracy =
//       Number(
//         json.overall_confidence
//       ) * 100;

//   }

//   if (Number.isNaN(accuracy)) {
//     accuracy = 0;
//   }


//   // ==========================================================
//   // DOCUMENT TYPE
//   // ==========================================================

//   const documentType =
//     data.doc_type ||
//     json.document_type ||
//     'BOE';


//   // ==========================================================
//   // JOB NUMBER
//   // ==========================================================

//   const jobNumber =
//     data.job_number ||
//     data.jobNumber ||
//     v(
//       getSection(
//         json,
//         'job'
//       )?.job_number
//     ) ||
//     'Extraction';


//   // ==========================================================
//   // CSV DOWNLOAD
//   //
//   // Exports ALL displayed fields.
//   // ==========================================================

//   const handleCSVDownload = () => {

//     try {

//       const rows = [];


//       // Header

//       rows.push([
//         'Section',
//         'Record',
//         'Field',
//         'Value',
//         'Confidence',
//       ]);


//       // ------------------------------------------------------
//       // Standard sections
//       // ------------------------------------------------------

//       Object.entries(
//         SECTIONS
//       ).forEach(
//         ([
//           sectionKey,
//           definition
//         ]) => {

//           const section =
//             getSection(
//               json,
//               sectionKey
//             );


//           definition.fields.forEach(
//             (key) => {

//               rows.push([
//                 definition.title,
//                 '',
//                 label(key),
//                 safeString(
//                   section?.[key]
//                 ),
//                 `${(
//                   confidence(
//                     section?.[key]
//                   ) * 100
//                 ).toFixed(1)}%`,
//               ]);

//             }
//           );

//         }
//       );


//       // ------------------------------------------------------
//       // Containers
//       // ------------------------------------------------------

//       containers.forEach(
//         (container, index) => {

//           CONTAINER_FIELDS.forEach(
//             (key) => {

//               rows.push([
//                 'Container',
//                 `Container ${index + 1}`,
//                 label(key),
//                 safeString(
//                   container?.[key]
//                 ),
//                 `${(
//                   confidence(
//                     container?.[key]
//                   ) * 100
//                 ).toFixed(1)}%`,
//               ]);

//             }
//           );

//         }
//       );


//       // ------------------------------------------------------
//       // Line Items
//       // ------------------------------------------------------

//       items.forEach(
//         (item, index) => {

//           LINE_ITEM_FIELDS.forEach(
//             (key) => {

//               rows.push([
//                 'Line Item',
//                 `Item ${index + 1}`,
//                 label(key),
//                 safeString(
//                   item?.[key]
//                 ),
//                 `${(
//                   confidence(
//                     item?.[key]
//                   ) * 100
//                 ).toFixed(1)}%`,
//               ]);

//             }
//           );

//         }
//       );


//       // ------------------------------------------------------
//       // Escape CSV
//       // ------------------------------------------------------

//       const escapeCSV = (
//         value
//       ) => {

//         const stringValue =
//           String(
//             value ?? ''
//           );

//         return `"${stringValue.replace(
//           /"/g,
//           '""'
//         )}"`;

//       };


//       const csv =
//         rows
//           .map(
//             row =>
//               row
//                 .map(
//                   escapeCSV
//                 )
//                 .join(',')
//           )
//           .join('\n');


//       // Excel UTF-8 BOM

//       const blob =
//         new Blob(
//           [
//             '\uFEFF',
//             csv
//           ],
//           {
//             type:
//               'text/csv;charset=utf-8;',
//           }
//         );


//       const url =
//         URL.createObjectURL(
//           blob
//         );


//       const link =
//         document.createElement(
//           'a'
//         );

//       link.href = url;

//       link.download =
//         `${jobNumber}.csv`;


//       document.body.appendChild(
//         link
//       );

//       link.click();

//       document.body.removeChild(
//         link
//       );

//       URL.revokeObjectURL(
//         url
//       );


//       toast.success(
//         'Complete CSV downloaded'
//       );

//     } catch (err) {

//       console.error(err);

//       toast.error(
//         'CSV download failed'
//       );

//     }

//   };


//   // ==========================================================
//   // OPEN HS LOOKUP
//   // ==========================================================

//   const openHSLookup = (
//     item
//   ) => {

//     const description =
//       safeString(
//         item?.description
//       );

//     const hsCode =
//       safeString(
//         item?.hs_code
//       );


//     // We don't depend on query parameters,
//     // but they can be useful if your HSLookup
//     // page supports them.

//     const params =
//       new URLSearchParams();

//     if (hsCode) {
//       params.set(
//         'hs',
//         hsCode
//       );
//     }

//     if (description) {
//       params.set(
//         'q',
//         description
//       );
//     }


//     navigate(
//       `${HS_LOOKUP_PATH}?${params.toString()}`
//     );

//   };


//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (

//     <div className="space-y-5 pb-10">


//       {/* ======================================================
//           TOP HEADER
//       ====================================================== */}

//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-6 shadow-xl sm:p-7">

//         <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

//         <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />


//         <div className="relative z-10">

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

//             {/* LEFT */}

//             <div className="flex items-start gap-4">

//               <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 shadow-lg sm:flex">

//                 <FileText
//                   size={24}
//                   className="text-slate-950"
//                 />

//               </div>


//               <div>

//                 <div className="flex flex-wrap items-center gap-2">

//                   <h1 className="text-2xl font-black tracking-tight text-white">
//                     Extraction Results
//                   </h1>


//                   <span
//                     className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
//                       documentType === 'BOE'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-green-100 text-green-800'
//                     }`}
//                   >
//                     {documentType === 'BOE'
//                       ? 'BOE — IMPORT'
//                       : 'SB — EXPORT'}
//                   </span>

//                 </div>


//                 <p className="mt-2 text-sm text-slate-300">
//                   Review, verify and edit the extracted customs data.
//                 </p>


//                 <div className="mt-4 flex flex-wrap items-center gap-3">

//                   <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">

//                     <FileText
//                       size={13}
//                       className="text-slate-400"
//                     />

//                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                       Job
//                     </span>

//                     <span className="font-mono text-xs font-bold text-white">
//                       {jobNumber}
//                     </span>

//                   </div>


//                   <div className="flex items-center gap-2 text-xs text-slate-400">

//                     <Clock size={13} />

//                     Extraction #{id}

//                   </div>

//                 </div>

//               </div>

//             </div>


//             {/* ACTIONS */}

//             <div className="flex flex-wrap gap-2">

//               <button
//                 onClick={() =>
//                   downloadExcel(
//                     id,
//                     jobNumber
//                   )
//                 }
//                 className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
//               >

//                 <FileSpreadsheet size={15} />

//                 Excel

//               </button>


//               <button
//                 onClick={
//                   handleCSVDownload
//                 }
//                 className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20"
//               >

//                 <Download size={15} />

//                 CSV

//               </button>

//             </div>

//           </div>


//           {/* METRICS */}

//           <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">


//             {/* Accuracy */}

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

//               <div className="flex items-center gap-2">

//                 <ShieldCheck
//                   size={15}
//                   className={
//                     accuracy >= 90
//                       ? 'text-teal-300'
//                       : 'text-yellow-300'
//                   }
//                 />

//                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Accuracy
//                 </span>

//               </div>


//               <p className="mt-1 text-lg font-black text-white">

//                 {accuracy
//                   ? `${accuracy.toFixed(1)}%`
//                   : '--'}

//               </p>

//             </div>


//             {/* Fields */}

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

//               <div className="flex items-center gap-2">

//                 <Database
//                   size={15}
//                   className="text-blue-300"
//                 />

//                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Fields
//                 </span>

//               </div>


//               <p className="mt-1 text-lg font-black text-white">
//                 {extractedFieldCount}
//               </p>

//             </div>


//             {/* Items */}

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

//               <div className="flex items-center gap-2">

//                 <Package
//                   size={15}
//                   className="text-purple-300"
//                 />

//                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Line Items
//                 </span>

//               </div>


//               <p className="mt-1 text-lg font-black text-white">
//                 {items.length}
//               </p>

//             </div>


//             {/* Processing */}

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">

//               <div className="flex items-center gap-2">

//                 <Clock
//                   size={15}
//                   className="text-teal-300"
//                 />

//                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Processing
//                 </span>

//               </div>


//               <p className="mt-1 text-lg font-black text-white">

//                 {(
//                   Number(
//                     data.extraction_time_ms
//                   ) || 0
//                 ) / 1000
//                   ? `${(
//                       (
//                         Number(
//                           data.extraction_time_ms
//                         ) || 0
//                       ) / 1000
//                     ).toFixed(1)}s`
//                   : '--'}

//               </p>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           SAVE INDICATOR
//       ====================================================== */}

//       {saving && (

//         <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-bold text-blue-800">

//           <Loader2
//             size={14}
//             className="animate-spin"
//           />

//           Saving field change...

//         </div>

//       )}


//       {/* ======================================================
//           CONFIDENCE LEGEND
//       ====================================================== */}

//       <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//           <div className="flex items-center gap-2">

//             <Sparkles
//               size={16}
//               className="text-blue-800"
//             />

//             <span className="text-xs font-black text-slate-800">
//               AI Confidence
//             </span>

//           </div>


//           <div className="flex flex-wrap items-center gap-4">

//             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

//               <ConfidenceBadge score={0.95} />

//               High 90%+

//             </span>


//             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

//               <ConfidenceBadge score={0.75} />

//               Review 70–89%

//             </span>


//             <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

//               <ConfidenceBadge score={0.5} />

//               Check &lt;70%

//             </span>

//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           HS VERIFICATION NOTICE
//       ====================================================== */}

//       <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">

//         <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

//           <div className="flex items-start gap-3">

//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">

//               <ShieldAlert
//                 size={19}
//                 className="text-amber-700"
//               />

//             </div>


//             <div>

//               <h3 className="text-sm font-black text-amber-950">
//                 HS / CTH codes require verification
//               </h3>


//               <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-900/70">

//                 HS codes shown below are the values extracted by Gemini
//                 from your documents. They are not automatically replaced
//                 or modified using the tariff database. For filing,
//                 verify the classification and applicable tariff details
//                 using the HS Code Lookup and official Indian Customs
//                 sources.

//               </p>

//             </div>

//           </div>


//           <div className="flex shrink-0 flex-wrap gap-2">

//             <button
//               onClick={() =>
//                 navigate(
//                   HS_LOOKUP_PATH
//                 )
//               }
//               className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-900"
//             >

//               <Search size={14} />

//               HS Code Lookup

//             </button>


//             <a
//               href={ICEGATE_TRADE_GUIDE}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-black text-amber-900 transition hover:bg-amber-100"
//             >

//               ICEGATE

//               <ExternalLink size={13} />

//             </a>


//             <a
//               href={CBIC_TARIFF}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-black text-amber-900 transition hover:bg-amber-100"
//             >

//               CBIC Tariff

//               <ExternalLink size={13} />

//             </a>

//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           SECTION TITLE
//       ====================================================== */}

//       <div>

//         <h2 className="text-lg font-black tracking-tight text-slate-900">
//           Extracted Information
//         </h2>

//         <p className="mt-1 text-xs text-slate-400">
//           Review the AI-extracted fields below. Values can be corrected
//           before exporting your customs data.
//         </p>

//       </div>


//       {/* ======================================================
//           STANDARD SECTIONS
//       ====================================================== */}

//       {Object.entries(
//         SECTIONS
//       ).map(
//         ([
//           sectionKey,
//           definition
//         ]) => {

//           const fields =
//             buildFields(
//               sectionKey
//             );


//           if (
//             !fields.length
//           ) {
//             return null;
//           }


//           return (

//             <SectionCard
//               key={sectionKey}
//               title={definition.title}
//               number={definition.number}
//               fields={fields}
//             >

//               {fields.map(
//                 (field) => (

//                   <FieldRow
//                     key={field.key}
//                     label={field.label}
//                     value={field.value}
//                     confidence={
//                       field.confidence
//                     }
//                     fieldKey={
//                       field.key
//                     }
//                     onEdit={
//                       handleFieldEdit
//                     }
//                   />

//                 )
//               )}

//             </SectionCard>

//           );

//         }
//       )}


//       {/* ======================================================
//           CONTAINERS
//       ====================================================== */}

//       <SectionCard
//         title="Container Details"
//         number="6"
//         fields={
//           containers.flatMap(
//             (container, index) =>
//               CONTAINER_FIELDS.map(
//                 (key) => ({

//                   label:
//                     `Container ${index + 1}: ${label(key)}`,

//                   value:
//                     v(
//                       container?.[key]
//                     ),

//                   confidence:
//                     confidence(
//                       container?.[key]
//                     ),

//                 })
//               )
//           )
//         }
//       >

//         {containers.length === 0 ? (

//           <div className="p-5 text-xs text-slate-400">
//             No container records were extracted.
//           </div>

//         ) : (

//           <div className="space-y-3">

//             {containers.map(
//               (container, index) => (

//                 <div
//                   key={index}
//                   className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
//                 >

//                   <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">

//                     <div className="flex items-center gap-2">

//                       <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">

//                         <Package
//                           size={14}
//                           className="text-blue-800"
//                         />

//                       </div>


//                       <span className="text-xs font-black text-slate-800">
//                         Container {index + 1}
//                       </span>

//                     </div>


//                     <span className="font-mono text-[10px] text-slate-400">

//                       {v(
//                         container?.container_no
//                       ) || '--'}

//                     </span>

//                   </div>


//                   <div className="divide-y divide-slate-100">

//                     {CONTAINER_FIELDS.map(
//                       (key) => (

//                         <FieldRow
//                           key={`${index}-${key}`}
//                           label={label(key)}
//                           value={v(
//                             container?.[key]
//                           )}
//                           confidence={confidence(
//                             container?.[key]
//                           )}
//                           fieldKey={`containers.${index}.${key}`}
//                           onEdit={handleFieldEdit}
//                         />

//                       )
//                     )}

//                   </div>

//                 </div>

//               )
//             )}

//           </div>

//         )}

//       </SectionCard>


//       {/* ======================================================
//           LINE ITEMS
//       ====================================================== */}

//       <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-sm">

//         <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 px-5 py-4">

//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-start gap-3">

//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-900">

//                 <Package
//                   size={17}
//                   className="text-white"
//                 />

//               </div>


//               <div>

//                 <div className="flex flex-wrap items-center gap-2">

//                   <span className="rounded-md bg-blue-900 px-2 py-1 text-[10px] font-black text-white">
//                     SEC 8
//                   </span>


//                   <h2 className="text-sm font-black text-blue-950">
//                     Line Items
//                   </h2>


//                   <span className="rounded-md border border-blue-200 bg-white px-2 py-1 text-[10px] font-bold text-blue-700">
//                     {items.length} item
//                     {items.length !== 1 && 's'}
//                   </span>

//                 </div>


//                 <p className="mt-1 text-[11px] text-slate-500">
//                   All 17 line-item fields extracted from the document
//                   are shown below.
//                 </p>

//               </div>

//             </div>


//             <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">

//               <Info
//                 size={14}
//                 className="text-amber-600"
//               />

//               <span className="text-[10px] font-bold text-amber-800">
//                 Verify HS codes separately
//               </span>

//             </div>

//           </div>

//         </div>


//         {items.length === 0 ? (

//           <div className="p-8 text-center">

//             <Package
//               size={25}
//               className="mx-auto text-slate-300"
//             />

//             <p className="mt-3 text-sm font-bold text-slate-600">
//               No line items extracted
//             </p>

//           </div>

//         ) : (

//           <div>

//             {items.map(
//               (item, index) => (

//                 <div
//                   key={
//                     item.id ||
//                     index
//                   }
//                   className="border-b border-slate-200 last:border-0"
//                 >

//                   {/* ITEM HEADER */}

//                   <div className="flex items-center justify-between bg-slate-50 px-5 py-3">

//                     <div className="flex items-center gap-3">

//                       <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-black text-blue-900">

//                         {String(
//                           index + 1
//                         ).padStart(
//                           2,
//                           '0'
//                         )}

//                       </span>


//                       <span className="text-xs font-black text-slate-700">
//                         Item {index + 1}
//                       </span>

//                     </div>


//                     <ConfidenceBadge
//                       score={
//                         confidence(
//                           item.description
//                         )
//                       }
//                       showLabel
//                     />

//                   </div>


//                   {/* ALL 17 LINE ITEM FIELDS */}

//                   <div className="divide-y divide-slate-100">

//                     {LINE_ITEM_FIELDS.map(
//                       (key) => {

//                         const value =
//                           v(
//                             item?.[key]
//                           );

//                         const fieldConfidence =
//                           confidence(
//                             item?.[key]
//                           );


//                         return (

//                           <FieldRow
//                             key={key}
//                             label={
//                               label(key)
//                             }
//                             value={
//                               value
//                             }
//                             confidence={
//                               fieldConfidence
//                             }
//                             fieldKey={`items.${index}.${key}`}
//                             onEdit={
//                               handleFieldEdit
//                             }
//                           />

//                         );

//                       }
//                     )}

//                   </div>


//                   {/* ==================================================
//                       HS VERIFICATION NOTICE
//                   ================================================== */}

//                   <div className="border-t border-amber-200 bg-amber-50/60 px-5 py-4">

//                     <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

//                       <div className="flex items-start gap-3">

//                         <ShieldAlert
//                           size={17}
//                           className="mt-0.5 shrink-0 text-amber-700"
//                         />


//                         <div>

//                           <p className="text-xs font-black text-amber-950">
//                             HS Code verification recommended
//                           </p>


//                           <p className="mt-1 text-[11px] leading-5 text-amber-900/70">

//                             Gemini extracted:

//                             <span className="mx-1 font-mono font-black text-amber-950">
//                               {v(
//                                 item?.hs_code
//                               ) || '--'}
//                             </span>

//                             Verify this code against your internal
//                             HS database before filing.

//                           </p>

//                         </div>

//                       </div>


//                       <div className="flex shrink-0 flex-wrap gap-2">

//                         <button
//                           onClick={() =>
//                             openHSLookup(
//                               item
//                             )
//                           }
//                           className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-[11px] font-black text-white transition hover:bg-blue-900"
//                         >

//                           <Search size={13} />

//                           Verify in HS Lookup

//                         </button>


//                         <a
//                           href={ICEGATE_TRADE_GUIDE}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-[11px] font-black text-amber-900 transition hover:bg-amber-100"
//                         >

//                           ICEGATE

//                           <ExternalLink
//                             size={12}
//                           />

//                         </a>

//                       </div>

//                     </div>

//                   </div>

//                 </div>

//               )
//             )}

//           </div>

//         )}

//       </div>


//       {/* ======================================================
//           FINAL SUMMARY
//       ====================================================== */}

//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div className="flex items-center gap-3">

//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

//               <CheckCircle2
//                 size={19}
//                 className="text-green-600"
//               />

//             </div>


//             <div>

//               <p className="text-sm font-black text-slate-800">
//                 Extraction Complete
//               </p>


//               <p className="mt-0.5 text-xs text-slate-400">

//                 {extractedFieldCount}
//                 {' '}
//                 fields displayed from
//                 {' '}
//                 {documentType}

//               </p>

//             </div>

//           </div>


//           <div className="flex items-center gap-5">

//             <div className="text-right">

//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                 Processing Time
//               </p>


//               <p className="mt-0.5 text-sm font-black text-slate-800">

//                 {(
//                   (
//                     Number(
//                       data.extraction_time_ms
//                     ) || 0
//                   ) / 1000
//                 ).toFixed(1)}

//                 s

//               </p>

//             </div>


//             <div className="h-8 w-px bg-slate-200" />


//             <div className="text-right">

//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                 Accuracy
//               </p>


//               <p className="mt-0.5 text-sm font-black text-green-700">

//                 {accuracy
//                   ? `${accuracy.toFixed(1)}%`
//                   : '--'}

//               </p>

//             </div>

//           </div>

//         </div>

//       </div>


//     </div>

//   );

// }
















import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    getExtraction,
    editField,
    downloadExcel,
    downloadCSV,
    confirmHSCode,
} from '../api';

import FieldRow from '../components/FieldRow.jsx';
import HSCodeSuggestion from '../components/HSCodeSuggestion.jsx';
import ConfidenceBadge from '../components/ConfidenceBadge.jsx';

import {
    Loader2,
    Download,
    FileSpreadsheet,
    FileText,
    ArrowLeft,
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Database,
    Package,
    ExternalLink,
    Search,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

import toast from 'react-hot-toast';


// LINKS

const HS_LOOKUP_PATH = '/hs-lookup';

const ICEGATE_TRADE_GUIDE =
    'https://www.icegate.gov.in/Webappl/Trade-Guide-on-Imports';

const CBIC_TARIFF =
    'https://www.cbic.gov.in/entities/customs-tariff';


// ============================================================
// Helpers
// ============================================================

const getValue = (field) => {

    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'value')
    ) {
        return field.value;
    }

    return field ?? null;
};


const getConfidence = (field) => {

    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'confidence')
    ) {

        const score =
            Number(field.confidence);

        if (!Number.isNaN(score)) {
            return Math.max(0, Math.min(1, score));
        }
    }

    return 0;
};


const hasValue = (value) => {

    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return true;
};


const isFieldObject = (value) => {

    return (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.hasOwnProperty.call(value, 'value') &&
        Object.prototype.hasOwnProperty.call(value, 'confidence')
    );
};


const label = (key) => {

    if (!key) return '';

    return String(key)
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s+/g, ' ')
        .replace(/^./, c => c.toUpperCase())
        .trim();
};


// ============================================================
// Section names
// ============================================================

const SECTION_TITLES = {

    job:
        'Job / File Header',

    importer_exporter:
        'Importer / Exporter',

    foreign_party:
        'Foreign Party',

    consignee:
        'Consignee / Buyer',

    shipment:
        'Shipment / Vessel',

    containers:
        'Container Details',

    invoice:
        'Invoice & Value',

    items:
        'Line Items',

    packing:
        'Packing Details',

    duty:
        'Duty & Tax',

    scheme:
        'Scheme Details',

    drawback:
        'Drawback',

    rodtep:
        'RoDTEP',

    esanchit:
        'e-Sanchit',

    declarations:
        'Declarations',

    licences:
        'Licences',

    certificate:
        'Certificate Information',

    additional:
        'Additional Information',

};


// ============================================================
// Recursively collect scalar fields
// ============================================================

function collectFields(section) {

    const extracted = [];
    const missing = [];

    function walk(node, path = []) {

        if (
            node === null ||
            node === undefined
        ) {
            return;
        }


        // -----------------------------------------------
        // Arrays
        // -----------------------------------------------

        if (Array.isArray(node)) {

            return;
        }


        // -----------------------------------------------
        // Standard field:
        //
        // {
        //   value,
        //   confidence
        // }
        // -----------------------------------------------

        if (isFieldObject(node)) {

            const value =
                getValue(node);

            const field = {

                key:
                    path.join('.'),

                label:
                    label(
                        path[path.length - 1]
                    ),

                value:
                    value,

                confidence:
                    getConfidence(node)

            };


            if (hasValue(value)) {

                extracted.push(field);

            } else {

                missing.push(field);

            }

            return;
        }


        // -----------------------------------------------
        // Object
        // -----------------------------------------------

        if (
            typeof node === 'object'
        ) {

            for (
                const [key, value]
                of Object.entries(node)
            ) {

                walk(
                    value,
                    [...path, key]
                );

            }

            return;
        }


        // -----------------------------------------------
        // Primitive fallback
        // -----------------------------------------------

        const field = {

            key:
                path.join('.'),

            label:
                label(
                    path[path.length - 1]
                ),

            value:
                node,

            confidence:
                1

        };


        if (hasValue(node)) {
            extracted.push(field);
        } else {
            missing.push(field);
        }
    }


    walk(section);

    return {
        extracted,
        missing
    };
}


// ============================================================
// Format display value
// ============================================================

function displayValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return '';
    }


    if (typeof value === 'object') {

        try {

            return JSON.stringify(
                value,
                null,
                2
            );

        } catch {

            return String(value);

        }
    }


    return String(value);
}


// ============================================================
// Build CSV
// ============================================================

function flattenForCSV(
    node,
    sectionName,
    rows,
    path = []
) {

    if (
        node === null ||
        node === undefined
    ) {
        return;
    }


    if (Array.isArray(node)) {

        node.forEach(
            (item, index) => {

                flattenForCSV(
                    item,
                    sectionName,
                    rows,
                    [...path, String(index + 1)]
                );

            }
        );

        return;
    }


    if (
        typeof node === 'object'
    ) {

        if (isFieldObject(node)) {

            const value =
                getValue(node);

            if (hasValue(value)) {

                rows.push({

                    section:
                        sectionName,

                    field:
                        path
                            .map(label)
                            .join(' → '),

                    value:
                        displayValue(value),

                    confidence:
                        `${(
                            getConfidence(node) * 100
                        ).toFixed(1)}%`

                });

            }

            return;
        }


        Object.entries(node)
            .forEach(
                ([key, value]) => {

                    flattenForCSV(
                        value,
                        sectionName,
                        rows,
                        [...path, key]
                    );

                }
            );

        return;
    }


    if (hasValue(node)) {

        rows.push({

            section:
                sectionName,

            field:
                path
                    .map(label)
                    .join(' → '),

            value:
                displayValue(node),

            confidence:
                '100%'

        });

    }
}


// ============================================================
// Section Card
// ============================================================

function DynamicSection({
    sectionKey,
    section,
    number,
    onEdit
}) {

    const {
        extracted,
        missing
    } =
        useMemo(
            () =>
                collectFields(section),
            [section]
        );


    const [
        showMissing,
        setShowMissing
    ] =
        useState(false);


    if (
        extracted.length === 0 &&
        missing.length === 0
    ) {
        return null;
    }


    return (

        <section
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

            {/* Header */}

            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-xs font-black text-white">

                            {number}

                        </div>

                        <div>

                            <h2 className="text-sm font-black text-slate-900">

                                {SECTION_TITLES[
                                    sectionKey
                                ] || label(sectionKey)}

                            </h2>

                            <p className="mt-0.5 text-[10px] text-slate-400">

                                {extracted.length} extracted

                                {missing.length > 0 &&
                                    ` • ${missing.length} not found`}

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Extracted fields */}

            {extracted.length > 0 && (

                <div className="divide-y divide-slate-100">

                    {extracted.map(
                        field => (

                            <FieldRow
                                key={
                                    field.key
                                }

                                label={
                                    field.label
                                }

                                value={
                                    displayValue(
                                        field.value
                                    )
                                }

                                confidence={
                                    field.confidence
                                }

                                fieldKey={
                                    field.key
                                }

                                onEdit={
                                    onEdit
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* Missing fields */}

            {missing.length > 0 && (

                <div className="border-t border-orange-100">

                    <button
                        type="button"
                        onClick={() =>
                            setShowMissing(
                                previous =>
                                    !previous
                            )
                        }
                        className="flex w-full items-center justify-between bg-orange-50/70 px-5 py-3 text-left transition hover:bg-orange-50"
                    >

                        <div className="flex items-center gap-2">

                            <AlertTriangle
                                size={14}
                                className="text-orange-500"
                            />

                            <span className="text-xs font-black text-orange-800">

                                Fields not extracted

                            </span>

                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">

                                {missing.length}

                            </span>

                        </div>


                        {showMissing
                            ? <ChevronUp size={15} />
                            : <ChevronDown size={15} />
                        }

                    </button>


                    {showMissing && (

                        <div className="bg-orange-50/30 px-5 py-4">

                            <p className="mb-3 text-[11px] text-slate-500">

                                These fields were not found in the
                                uploaded documents. They are not
                                counted against the extraction
                                accuracy.

                            </p>


                            <div className="flex flex-wrap gap-2">

                                {missing.map(
                                    field => (

                                        <span
                                            key={
                                                field.key
                                            }
                                            className="rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500"
                                        >

                                            {field.label}

                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </section>
    );
}


// ============================================================
// Results Component
// ============================================================

export default function Results() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    const [
        data,
        setData
    ] =
        useState(null);


    const [
        items,
        setItems
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    // ========================================================
    // Load extraction
    // ========================================================

    useEffect(() => {

        getExtraction(id)

            .then(res => {

                const extraction =
                    res.data;

                setData(
                    extraction
                );

                setItems(
                    extraction.items ||
                    extraction.extraction_items ||
                    []
                );

            })

            .catch(() => {

                toast.error(
                    'Failed to load extraction'
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, [id]);


    // ========================================================
    // Edit field
    // ========================================================

    const handleFieldEdit =
        async (
            fieldPath,
            newValue
        ) => {

            try {

                await editField(
                    id,
                    fieldPath,
                    newValue
                );


                toast.success(
                    'Field updated'
                );


                const res =
                    await getExtraction(id);


                setData(
                    res.data
                );


                setItems(
                    res.data.items ||
                    res.data.extraction_items ||
                    []
                );

            } catch {

                toast.error(
                    'Failed to update field'
                );

            }
        };


    // ========================================================
    // HS confirm
    // ========================================================

    const handleHSConfirm =
        async (
            itemId,
            code
        ) => {

            try {

                await confirmHSCode(
                    id,
                    itemId,
                    code
                );


                toast.success(
                    `HS Code ${code} confirmed`
                );

            } catch {

                toast.error(
                    'Failed to confirm HS code'
                );

            }
        };


    // ========================================================
    // CSV
    // ========================================================

    const handleCSVDownload =
        () => {

            if (!data) {
                return;
            }


            const rows = [];


            const json =
                data.extracted_json ||
                data.extractedData ||
                {};


            Object.entries(
                json
            ).forEach(
                ([sectionKey, section]) => {

                    if (
                        sectionKey ===
                        'overall_confidence'
                    ) {
                        return;
                    }

                    if (
                        sectionKey ===
                        'document_type'
                    ) {
                        return;
                    }


                    flattenForCSV(
                        section,
                        SECTION_TITLES[
                            sectionKey
                        ] ||
                        label(
                            sectionKey
                        ),
                        rows,
                        []
                    );

                }
            );


            // ------------------------------------------------
            // Line items
            // ------------------------------------------------

            items.forEach(
                (item, index) => {

                    const itemSection =
                        `Line Item ${index + 1}`;


                    Object.entries(
                        item
                    ).forEach(
                        ([key, value]) => {

                            if (
                                [
                                    'id',
                                    'extraction_id',
                                    'created_at',
                                    'updated_at'
                                ].includes(key)
                            ) {
                                return;
                            }


                            if (
                                value === null ||
                                value === undefined ||
                                value === ''
                            ) {
                                return;
                            }


                            rows.push({

                                section:
                                    itemSection,

                                field:
                                    label(key),

                                value:
                                    displayValue(
                                        getValue(
                                            value
                                        )
                                    ),

                                confidence:
                                    isFieldObject(
                                        value
                                    )
                                        ? `${(
                                            getConfidence(
                                                value
                                            ) * 100
                                        ).toFixed(1)}%`
                                        : ''

                            });

                        }
                    );

                }
            );


            const header = [
                'Section',
                'Field',
                'Value',
                'Confidence'
            ];


            const escapeCSV =
                value => {

                    const str =
                        String(
                            value ??
                            ''
                        );

                    return `"${str.replace(
                        /"/g,
                        '""'
                    )}"`;

                };


            const csv =
                [
                    header,
                    ...rows.map(
                        row => [
                            row.section,
                            row.field,
                            row.value,
                            row.confidence
                        ]
                    )
                ]
                    .map(
                        row =>
                            row
                                .map(
                                    escapeCSV
                                )
                                .join(',')
                    )
                    .join('\n');


            const blob =
                new Blob(
                    [
                        '\uFEFF' +
                        csv
                    ],
                    {
                        type:
                            'text/csv;charset=utf-8;'
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    'a'
                );


            link.href =
                url;

            link.download =
                `${
                    data.job_number ||
                    data.jobNumber ||
                    'extraction'
                }.csv`;


            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            URL.revokeObjectURL(
                url
            );


            toast.success(
                'CSV downloaded'
            );
        };

    const handleExcelDownload = async () => {
        try {
            await downloadExcel(
                id,
                data.job_number ||
                data.jobNumber
            );
            toast.success(
                'Excel downloaded'
            );
        } catch (err) {
            toast.error(
                'Failed to download Excel'
            );
        }
    };


    // ========================================================
    // Loading
    // ========================================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

                        <Loader2
                            size={25}
                            className="animate-spin text-blue-900"
                        />

                    </div>


                    <p className="mt-4 text-sm font-bold text-slate-700">

                        Loading extraction...

                    </p>


                    <p className="mt-1 text-xs text-slate-400">

                        Preparing your extracted data

                    </p>

                </div>

            </div>

        );
    }


    // ========================================================
    // Not found
    // ========================================================

    if (!data) {

        return (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <AlertTriangle
                    size={25}
                    className="mx-auto text-red-500"
                />

                <h2 className="mt-4 text-lg font-black text-slate-900">

                    Extraction not found

                </h2>

                <p className="mt-2 text-sm text-slate-400">

                    The requested extraction could not be loaded.

                </p>

            </div>

        );
    }


    // ========================================================
    // JSON
    // ========================================================

    const json =
        data.extracted_json ||
        data.extractedData ||
        {};


    // ========================================================
    // Accuracy
    // ========================================================

    const accuracy =
        Number(
            data.accuracy_score ??
            data.accuracyPercent ??
            (
                Number(
                    data.accuracy || 0
                ) * 100
            )
        ) || 0;


    // ========================================================
    // Count extracted fields
    // ========================================================

    let extractedFieldCount = 0;
    let missingFieldCount = 0;


    Object.entries(
        json
    ).forEach(
        ([key, section]) => {

            if (
                key === 'overall_confidence' ||
                key === 'document_type'
            ) {
                return;
            }


            const result =
                collectFields(
                    section
                );


            extractedFieldCount +=
                result.extracted.length;

            missingFieldCount +=
                result.missing.length;

        }
    );


    // ========================================================
    // Standard sections
    //
    // We exclude arrays here because containers and items
    // have dedicated UI below.
    // ========================================================

    const standardSections =
        Object.entries(
            json
        ).filter(
            ([key, value]) => {

                if (
                    key ===
                    'overall_confidence'
                ) {
                    return false;
                }

                if (
                    key ===
                    'document_type'
                ) {
                    return false;
                }

                if (
                    key ===
                    'items'
                ) {
                    return false;
                }

                if (
                    key ===
                    'line_items'
                ) {
                    return false;
                }

                if (
                    key ===
                    'containers'
                ) {
                    return false;
                }

                if (
                    Array.isArray(
                        value
                    )
                ) {
                    return false;
                }

                return (
                    value &&
                    typeof value ===
                        'object'
                );

            }
        );


    return (

        <div className="space-y-5 pb-10">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-6 shadow-xl sm:p-7">

                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />


                <div className="relative z-10">


                    {/* Top */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400 shadow-lg sm:flex">

                                <FileText
                                    size={24}
                                    className="text-slate-950"
                                />

                            </div>


                            <div>

                                <div className="flex flex-wrap items-center gap-2">

                                    <h1 className="text-2xl font-black tracking-tight text-white">

                                        Extraction Results

                                    </h1>


                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                                            data.doc_type ===
                                            'BOE'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}
                                    >

                                        {data.doc_type ===
                                        'BOE'
                                            ? 'BOE — IMPORT'
                                            : 'SB — EXPORT'}

                                    </span>

                                </div>


                                <p className="mt-2 text-sm text-slate-300">

                                    Review the information extracted
                                    from your customs documents.

                                </p>


                                <div className="mt-4 flex flex-wrap items-center gap-3">

                                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">

                                        <FileText
                                            size={13}
                                            className="text-slate-400"
                                        />

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                            Job

                                        </span>


                                        <span className="font-mono text-xs font-bold text-white">

                                            {
                                                data.job_number ||
                                                data.jobNumber ||
                                                '--'
                                            }

                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 text-xs text-slate-400">

                                        <Clock
                                            size={13}
                                        />

                                        Extraction #{id}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Actions */}

                        <div className="flex flex-wrap gap-2">

                            <button
                                onClick={() =>
                                    navigate(-1)
                                }
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >

                                <ArrowLeft
                                    size={15}
                                />

                                Back

                            </button>


                            <button
                                onClick={
                                    handleExcelDownload
                                }
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >

                                <FileSpreadsheet
                                    size={15}
                                />

                                Excel

                            </button>


                            <button
                                onClick={
                                    handleCSVDownload
                                }
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >

                                <Download
                                    size={15}
                                />

                                CSV

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        METRICS
                    ================================================= */}

                    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">


                        {/* Accuracy */}

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                            <div className="flex items-center gap-2">

                                <ShieldCheck
                                    size={15}
                                    className={
                                        accuracy >= 90
                                            ? 'text-teal-300'
                                            : 'text-yellow-300'
                                    }
                                />

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                    Accuracy

                                </span>

                            </div>


                            <p className="mt-1 text-lg font-black text-white">

                                {accuracy.toFixed(1)}%

                            </p>


                            <p className="mt-1 text-[9px] text-slate-400">

                                Extracted fields only

                            </p>

                        </div>


                        {/* Extracted */}

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                            <div className="flex items-center gap-2">

                                <Database
                                    size={15}
                                    className="text-blue-300"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                    Extracted

                                </span>

                            </div>


                            <p className="mt-1 text-lg font-black text-white">

                                {
                                    extractedFieldCount
                                }

                            </p>

                        </div>


                        {/* Missing */}

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                            <div className="flex items-center gap-2">

                                <AlertTriangle
                                    size={15}
                                    className="text-orange-300"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                    Not Found

                                </span>

                            </div>


                            <p className="mt-1 text-lg font-black text-white">

                                {
                                    missingFieldCount
                                }

                            </p>

                        </div>


                        {/* Processing */}

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">

                            <div className="flex items-center gap-2">

                                <Clock
                                    size={15}
                                    className="text-teal-300"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                    Processing

                                </span>

                            </div>


                            <p className="mt-1 text-lg font-black text-white">

                                {(
                                    (
                                        data.extraction_time_ms ||
                                        data.extractionTimeMs ||
                                        0
                                    ) / 1000
                                ).toFixed(1)}s

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ======================================================
                    HS VERIFICATION NOTICE
                ====================================================== */}

                <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">

                    <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">

                                <ShieldAlert
                                    size={19}
                                    className="text-amber-700"
                                />

                            </div>


                            <div>

                                <h3 className="text-sm font-black text-amber-950">
                                    HS / CTH codes require verification
                                </h3>


                                <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-900/70">

                                    HS codes shown below are the values extracted by AI
                                    from your documents. They are not automatically replaced
                                    or modified using the tariff database. For filing,
                                    verify the classification and applicable tariff details
                                    using the HS Code Lookup and official Indian Customs
                                    sources.

                                </p>

                            </div>

                        </div>


                        <div className="flex shrink-0 flex-wrap gap-2">

                            <button
                                onClick={() =>
                                    navigate(
                                        HS_LOOKUP_PATH
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-900"
                            >

                                <Search size={14} />

                                HS Code Lookup

                            </button>


                            <a
                                href={ICEGATE_TRADE_GUIDE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-black text-amber-900 transition hover:bg-amber-100"
                            >

                                ICEGATE

                                <ExternalLink size={13} />

                            </a>


                            <a
                                href={CBIC_TARIFF}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-black text-amber-900 transition hover:bg-amber-100"
                            >

                                CBIC Tariff

                                <ExternalLink size={13} />

                            </a>

                        </div>

                    </div>

                </div>



          

            {/* =================================================
                EXTRACTION REVIEW LEGEND
                ================================================= */}

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800">
                                Extraction Status
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">

                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                <ConfidenceBadge score={0.95} />
                                High 90%+
                            </span>

                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                <ConfidenceBadge score={0.75} />
                                    Review 70–89%
                            </span>

                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                <ConfidenceBadge score={0.5} />
                                    Verify  &lt;70%
                            </span>

                        </div>
                    </div>
                </div>


            {/* =================================================
                EXTRACTED INFORMATION
            ================================================= */}

            <div>

                <h2 className="text-lg font-black tracking-tight text-slate-900">

                    Extracted Information

                </h2>


                <p className="mt-1 text-xs text-slate-400">

                    Only information actually found in the uploaded
                    documents is displayed as extracted.

                </p>

            </div>


            {/* =================================================
                STANDARD SECTIONS
            ================================================= */}

            <div className="space-y-4">

                {standardSections.map(
                    ([sectionKey, section], index) => (

                        <DynamicSection
                            key={
                                sectionKey
                            }

                            sectionKey={
                                sectionKey
                            }

                            section={
                                section
                            }

                            number={
                                index + 1
                            }

                            onEdit={
                                handleFieldEdit
                            }
                        />

                    )
                )}

            </div>


            {/* =================================================
                CONTAINERS
            ================================================= */}

            {Array.isArray(
                json.containers
            ) &&
                json.containers.length > 0 && (

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">

                                    <Package
                                        size={15}
                                        className="text-blue-800"
                                    />

                                </div>


                                <div>

                                    <h2 className="text-sm font-black text-slate-900">

                                        Container Details

                                    </h2>


                                    <p className="mt-0.5 text-[10px] text-slate-400">

                                        {
                                            json.containers.length
                                        } container
                                        {json.containers.length !== 1 &&
                                            's'}

                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="space-y-3 p-4">

                            {json.containers.map(
                                (container, index) => {

                                    const result =
                                        collectFields(
                                            container
                                        );


                                    return (

                                        <div
                                            key={
                                                index
                                            }
                                            className="overflow-hidden rounded-xl border border-slate-200"
                                        >

                                            <div className="bg-slate-50 px-4 py-3">

                                                <span className="text-xs font-black text-slate-800">

                                                    Container {
                                                        index + 1
                                                    }

                                                </span>

                                            </div>


                                            {result.extracted.length > 0 && (

                                                <div className="divide-y divide-slate-100">

                                                    {result.extracted.map(
                                                        field => (

                                                            <FieldRow
                                                                key={
                                                                    field.key
                                                                }
                                                                label={
                                                                    field.label
                                                                }
                                                                value={
                                                                    displayValue(
                                                                        field.value
                                                                    )
                                                                }
                                                                confidence={
                                                                    field.confidence
                                                                }
                                                            />

                                                        )
                                                    )}

                                                </div>

                                            )}


                                            {result.missing.length > 0 && (

                                                <div className="border-t border-orange-100 bg-orange-50/40 px-4 py-3">

                                                    <p className="text-[10px] font-black text-orange-800">

                                                        Not extracted:

                                                    </p>


                                                    <p className="mt-1 text-[10px] text-slate-500">

                                                        {
                                                            result.missing
                                                                .map(
                                                                    f =>
                                                                        f.label
                                                                )
                                                                .join(
                                                                    ', '
                                                                )
                                                        }

                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}


            {/* =================================================
                LINE ITEMS
            ================================================= */}

            {items.length > 0 && (

                <section className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-sm">

                    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 px-5 py-4">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-900">

                                <Package
                                    size={17}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <div className="flex flex-wrap items-center gap-2">

                                    <span className="rounded-md bg-blue-900 px-2 py-1 text-[10px] font-black text-white">

                                        LINE ITEMS

                                    </span>


                                    <h2 className="text-sm font-black text-blue-950">

                                        Product Details

                                    </h2>


                                    <span className="rounded-md border border-blue-200 bg-white px-2 py-1 text-[10px] font-bold text-blue-700">

                                        {items.length} item
                                        {items.length !== 1 &&
                                            's'}

                                    </span>

                                </div>


                                <p className="mt-1 text-[11px] text-slate-500">

                                    Review product descriptions,
                                    quantities, values and HS codes.

                                </p>

                            </div>

                        </div>

                    </div>


                    <div>

                        {items.map(
                            (item, index) => {

                                const description =
                                    getValue(
                                        item.item_description ||
                                        item.description
                                    );


                                const hsCode =
                                    getValue(
                                        item.hs_code
                                    );


                                return (

                                    <div
                                        key={
                                            item.id ||
                                            index
                                        }
                                        className="border-b border-slate-200 last:border-0"
                                    >

                                        {/* Item header */}

                                        <div className="flex items-center justify-between bg-slate-50 px-5 py-3">

                                            <div className="flex items-center gap-3">

                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-black text-blue-900">

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}

                                                </span>


                                                <span className="text-xs font-black text-slate-700">

                                                    Item {
                                                        index + 1
                                                    }

                                                </span>

                                            </div>


                                            <ConfidenceBadge
                                                score={
                                                    getConfidence(
                                                        item.confidence_score
                                                    ) ||
                                                    Number(
                                                        item.confidence_score
                                                    ) ||
                                                    0
                                                }
                                                showLabel
                                            />

                                        </div>


                                        {/* Fields */}

                                        <div className="divide-y divide-slate-100">


                                            {hasValue(
                                                description
                                            ) && (

                                                <FieldRow
                                                    label="Description"
                                                    value={
                                                        displayValue(
                                                            description
                                                        )
                                                    }
                                                    confidence={
                                                        getConfidence(
                                                            item.item_description ||
                                                            item.description
                                                        ) ||
                                                        0.95
                                                    }
                                                />

                                            )}


                                            {/* HS CODE */}

                                            {hasValue(
                                                hsCode
                                            ) && (

                                                <div className="border-b border-slate-100">

                                                    <FieldRow
                                                        label="HS Code"
                                                        value={
                                                            displayValue(
                                                                hsCode
                                                            )
                                                        }
                                                        confidence={
                                                            getConfidence(
                                                                item.hs_code
                                                            ) ||
                                                            Number(
                                                                item.confidence_score
                                                            ) ||
                                                            0
                                                        }
                                                    />


                                                    {/* HS verification notice */}

                                                    <div className="mx-5 mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

                                                        <div className="flex items-start gap-3">

                                                            <Search
                                                                size={17}
                                                                className="mt-0.5 shrink-0 text-blue-700"
                                                            />


                                                            <div className="flex-1">

                                                                <p className="text-xs font-black text-blue-950">

                                                                    Verify this HS Code

                                                                </p>


                                                                <p className="mt-1 text-[11px] leading-5 text-slate-600">

                                                                    The HS Code shown above
                                                                    was extracted from your
                                                                    document. It has not been
                                                                    automatically classified by
                                                                    the system.

                                                                    Verify the code and product
                                                                    description using the HS Code
                                                                    Lookup before final submission.

                                                                </p>


                                                                <div className="mt-3 flex flex-wrap gap-2">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                '/hs-lookup'
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-[10px] font-black text-white transition hover:bg-blue-800"
                                                                    >

                                                                        <Search
                                                                            size={13}
                                                                        />

                                                                        Open HS Code Lookup

                                                                    </button>


                                                                    <a
                                                                        href={ICEGATE_TRADE_GUIDE}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-700 transition hover:bg-slate-50"
                                                                    >

                                                                        <ExternalLink
                                                                            size={13}
                                                                        />

                                                                        Verify on ICEGATE

                                                                    </a>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {[
                                                [
                                                    'Quantity',
                                                    item.quantity
                                                ],

                                                [
                                                    'Unit',
                                                    item.unit
                                                ],

                                                [
                                                    'Unit Price',
                                                    item.unit_price
                                                ],

                                                [
                                                    'Total Value',
                                                    item.total_value
                                                ]

                                            ].map(
                                                ([fieldLabel, fieldValue]) => {

                                                    if (
                                                        !hasValue(
                                                            getValue(
                                                                fieldValue
                                                            )
                                                        )
                                                    ) {
                                                        return null;
                                                    }


                                                    return (

                                                        <FieldRow
                                                            key={
                                                                fieldLabel
                                                            }
                                                            label={
                                                                fieldLabel
                                                            }
                                                            value={
                                                                displayValue(
                                                                    getValue(
                                                                        fieldValue
                                                                    )
                                                                )
                                                            }
                                                            confidence={
                                                                getConfidence(
                                                                    fieldValue
                                                                ) ||
                                                                0.95
                                                            }
                                                        />

                                                    );

                                                }
                                            )}

                                        </div>


                                        {/* AI suggestions */}

                                        {Array.isArray(
                                            item.ai_suggested_hs
                                        ) &&
                                            item.ai_suggested_hs.length > 0 && (

                                                <div className="border-t border-blue-100 bg-blue-50/40">

                                                    <HSCodeSuggestion
                                                        suggestions={
                                                            item.ai_suggested_hs
                                                        }
                                                        itemId={
                                                            item.id
                                                        }
                                                        onConfirm={
                                                            handleHSConfirm
                                                        }
                                                    />

                                                </div>

                                            )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                NO ITEMS
            ================================================= */}

            {items.length === 0 && (

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <Package
                            size={18}
                            className="text-slate-400"
                        />

                        <div>

                            <p className="text-xs font-black text-slate-700">

                                No line items extracted

                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">

                                No product line-item data was returned
                                by the extraction engine.

                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                FINAL SUMMARY
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

                            <CheckCircle2
                                size={19}
                                className="text-green-600"
                            />

                        </div>


                        <div>

                            <p className="text-sm font-black text-slate-800">

                                Extraction Complete

                            </p>


                            <p className="mt-0.5 text-xs text-slate-400">

                                {
                                    extractedFieldCount
                                } fields extracted from{' '}

                                {
                                    data.doc_type ||
                                    json.document_type ||
                                    'document'
                                }

                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-5">

                        <div className="text-right">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                Processing Time

                            </p>


                            <p className="mt-0.5 text-sm font-black text-slate-800">

                                {(
                                    (
                                        data.extraction_time_ms ||
                                        data.extractionTimeMs ||
                                        0
                                    ) / 1000
                                ).toFixed(1)}s

                            </p>

                        </div>


                        <div className="h-8 w-px bg-slate-200" />


                        <div className="text-right">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                                Accuracy

                            </p>


                            <p
                                className={`mt-0.5 text-sm font-black ${
                                    accuracy >= 90
                                        ? 'text-green-700'
                                        : accuracy >= 70
                                            ? 'text-yellow-700'
                                            : 'text-red-700'
                                }`}
                            >

                                {accuracy.toFixed(1)}%

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                MISSING FIELD EXPLANATION
            ================================================= */}

            {missingFieldCount > 0 && (

                <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">

                    <div className="flex items-start gap-3">

                        <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0 text-orange-600"
                        />


                        <div>

                            <p className="text-xs font-black text-orange-900">

                                {missingFieldCount} fields were not extracted

                            </p>


                            <p className="mt-1 text-[11px] leading-5 text-slate-600">

                                These fields were not found in the
                                uploaded documents. They are displayed
                                separately.

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}