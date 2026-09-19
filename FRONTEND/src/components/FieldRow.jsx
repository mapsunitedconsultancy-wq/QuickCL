import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import CopyButton from './CopyButton';
import ConfidenceBadge from './ConfidenceBadge';

export default function FieldRow({ label, value, confidence, onEdit, fieldKey }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(value || '');

  const display = value || '--';
  const conf = typeof confidence === 'number' ? confidence : value ? 0.95 : 0;

  const handleSave = () => {
    if (onEdit && editVal !== value) {
      onEdit(fieldKey, editVal);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditVal(value || '');
      setEditing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 px-5 transition-colors hover:bg-[#f9f9fb] group border-b border-[rgba(60,60,67,0.06)] last:border-0">
      {/* Label */}
      <div className="sm:w-60 shrink-0">
        <span
          className="text-xs font-semibold text-[#48484a] tracking-wide"
          title={label}
        >
          {label}
        </span>
      </div>

      {/* Value Container */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {editing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-1.5 bg-white border border-[#007aff] rounded-[10px] text-sm text-[#1c1c1e] font-mono outline-none shadow-sm focus:ring-2 focus:ring-[#007aff]/20"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-[#007aff] hover:bg-[#0066d6] text-white rounded-[10px] text-xs font-semibold transition active:scale-95"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditVal(value || '');
                setEditing(false);
              }}
              className="px-2.5 py-1.5 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[#1c1c1e] rounded-[10px] text-xs font-semibold transition active:scale-95"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="flex-1 px-3 py-1.5 bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)] rounded-[10px] font-mono text-sm font-medium text-[#1c1c1e] whitespace-pre-wrap break-all select-text"
              title={display}
            >
              {display}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-[8px] text-[#636366] hover:text-[#007aff] hover:bg-[#007aff]/10 transition-all active:scale-95"
              title="Edit field value"
            >
              <Pencil size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Copy + Confidence Badge */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <CopyButton value={display} />
        <ConfidenceBadge score={conf} showLabel />
      </div>
    </div>
  );
}
