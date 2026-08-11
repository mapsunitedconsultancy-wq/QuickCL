import { useState } from 'react';
import { ChevronDown, ChevronRight, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SectionCard({ title, number, children, fields = [] }) {
  const [open, setOpen] = useState(true);

  const copyAllFields = () => {
    if (!fields.length) return;
    const text = fields
      .map((f) => `${f.label}\t${f.value || '--'}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`All ${title} fields copied!`, { duration: 1200 });
  };

  return (
    <div className="card-base mb-3 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50
          border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          {open
            ? <ChevronDown size={16} className="text-gray-400" />
            : <ChevronRight size={16} className="text-gray-400" />}
          <span className="text-[10px] font-bold text-blue-800 bg-blue-100
            px-2 py-0.5 rounded">SEC {number}</span>
          <span className="text-sm font-bold text-gray-800">{title}</span>
          <span className="text-[10px] text-gray-400 font-medium">
            {fields.length} fields
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); copyAllFields(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold
            text-blue-700 bg-blue-50 border border-blue-200 rounded-lg
            hover:bg-blue-100 transition-colors"
          title="Copy all fields in this section"
        >
          <ClipboardList size={13} /> Copy All
        </button>
      </div>

      {/* Fields */}
      {open && <div className="divide-y divide-gray-100">{children}</div>}
    </div>
  );
}








// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, FolderCheck } from 'lucide-react';

// export function SectionCard({
//   title,
//   icon: Icon = FolderCheck,
//   fieldCount = 0,
//   defaultExpanded = true,
//   children,
//   headerAction
// }) {
//   const [isExpanded, setIsExpanded] = useState(defaultExpanded);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
//       {/* Section Header */}
//       <div
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="p-4 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between cursor-pointer select-none"
//       >
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg bg-blue-900/10 text-blue-900 flex items-center justify-center font-bold">
//             <Icon className="w-4 h-4 text-blue-900" />
//           </div>
//           <div>
//             <h3 className="font-extrabold text-slate-900 text-sm">{title}</h3>
//             {fieldCount > 0 && (
//               <span className="text-[10px] font-mono text-slate-500 font-semibold">
//                 {fieldCount} extracted fields
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           {headerAction && <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>}
//           <button className="text-slate-400 hover:text-slate-700 p-1">
//             {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* Section Body */}
//       {isExpanded && <div className="p-4 sm:p-6 space-y-3">{children}</div>}
//     </div>
//   );
// }
