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
        className="flex items-center justify-between px-4 py-3 bg-white
          border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          {open
            ? <ChevronDown size={16} className="text-gray-600" />
            : <ChevronRight size={16} className="text-gray-600" />}
          <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200
            px-2 py-0.5 rounded">SEC {number}</span>
          <span className="text-sm font-bold text-gray-800">{title}</span>
          <span className="text-[10px] text-[#48484a] font-medium">
            {fields.length} fields
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); copyAllFields(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold
            text-slate-700 bg-white border border-slate-200 rounded-lg
            hover:bg-slate-50 transition-colors"
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

