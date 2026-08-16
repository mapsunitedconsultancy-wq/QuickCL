
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import CopyButton from './CopyButton';
import ConfidenceBadge from './ConfidenceBadge';

export default function FieldRow({ label, value, confidence, onEdit, fieldKey }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(value || '');

  const display = value || '--';
  const conf = typeof confidence === 'number' ? confidence : (value ? 0.95 : 0);

  const handleSave = () => {
    if (onEdit && editVal !== value) {
      onEdit(fieldKey, editVal);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setEditVal(value || ''); setEditing(false); }
  };

  return (
    <div className="flex items-center gap-2 py-[7px] px-3 border-b border-gray-100
      last:border-0 hover:bg-blue-50/30 transition-colors group">

      {/* Label */}
      <span className="w-44 min-w-[11rem] text-xs font-semibold text-gray-500
        truncate" title={label}>
        {label}
      </span>

      {/* Value */}
      {editing ? (
        <div className="flex-1 flex gap-1.5">
          <input
            className="flex-1 px-2 py-1 border-2 border-blue-400 rounded
              text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button onClick={handleSave}
            className="px-2.5 py-1 bg-blue-700 text-white rounded text-xs font-bold
              hover:bg-blue-800">Save</button>
          <button onClick={() => { setEditVal(value || ''); setEditing(false); }}
            className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold
              hover:bg-gray-300">Esc</button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-1.5">
          <span className="flex-1 px-2.5 py-1 bg-gray-50 border border-gray-200
            rounded font-mono text-sm text-gray-800 whitespace-pre-wrap break-all"
            title={display}>
            {display}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
              justify-center text-gray-400 hover:text-blue-600 transition-all"
            title="Edit field">
            <Pencil size={12} />
          </button>
        </div>
      )}

      {/* Copy + Badge */}
      <CopyButton value={display} />
      <ConfidenceBadge score={conf} />
    </div>
  );
}









// import React from 'react';
// import { CopyButton } from './CopyButton';
// import { ConfidenceBadge } from './ConfidenceBadge';
// import { FileText, Edit3 } from 'lucide-react';

// export function FieldRow({
//   fieldKey,
//   label,
//   value = '',
//   sourceDoc = 'Commercial Invoice',
//   confidence = 95,
//   isEdited = false,
//   onChange
// }) {
//   return (
//     <div
//       className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
//         isEdited
//           ? 'bg-amber-50/40 border-amber-300'
//           : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/80'
//       }`}
//     >
//       {/* Label and Source Doc Tag */}
//       <div className="md:w-1/3 space-y-1">
//         <div className="flex items-center gap-1.5">
//           <label className="text-xs font-bold text-slate-800 tracking-tight">
//             {label}
//           </label>
//           {isEdited && (
//             <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5">
//               <Edit3 className="w-2.5 h-2.5" />
//               Edited
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
//           <FileText className="w-3 h-3 text-slate-400" />
//           <span>{sourceDoc}</span>
//         </div>
//       </div>

//       {/* Value Input */}
//       <div className="flex-1 min-w-0">
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange && onChange(fieldKey, e.target.value)}
//           className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all ${
//             isEdited ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
//           }`}
//         />
//       </div>

//       {/* Badge & Copy Action */}
//       <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
//         <ConfidenceBadge score={confidence} />
//         <CopyButton text={value} label="Copy" size="xs" />
//       </div>
//     </div>
//   );
// }
