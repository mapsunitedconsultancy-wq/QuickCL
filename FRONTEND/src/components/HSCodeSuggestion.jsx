import CopyButton from './CopyButton';
import { Tag, Check } from 'lucide-react';

export default function HSCodeSuggestion({ suggestions = [], onConfirm, itemId }) {
  if (!suggestions.length) return null;

  return (
    <div className="m-4 rounded-[14px] bg-white border border-[rgba(60,60,67,0.12)] p-4 space-y-3 shadow-2xs">
      <div className="flex items-center gap-2">
        <Tag size={15} className="text-[#1c1c1e]" strokeWidth={2.2} />
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#1c1c1e]">
          Suggested HS Codes (Select to confirm)
        </p>
      </div>

      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-[12px] bg-white border border-[rgba(60,60,67,0.12)] shadow-2xs"
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[8px] bg-white text-[#1c1c1e] border border-[rgba(60,60,67,0.18)] shadow-2xs">
                {s.code}
              </span>

              <span className="text-xs font-medium text-[#1c1c1e] line-clamp-1 max-w-md">
                {s.desc || s.description}
              </span>

              <span className="text-xs font-semibold text-[#48484a]">
                {Math.round((s.confidence || 0) * 100)}% Match
              </span>

              {s.bcd && (
                <span className="text-[11px] font-semibold text-[#48484a] bg-white border border-[rgba(60,60,67,0.12)] px-2 py-0.5 rounded-full">
                  BCD: {s.bcd}%
                </span>
              )}

              {s.igst && (
                <span className="text-[11px] font-semibold text-[#48484a] bg-white border border-[rgba(60,60,67,0.12)] px-2 py-0.5 rounded-full">
                  IGST: {s.igst}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <CopyButton value={s.code} />
              <button
                type="button"
                onClick={() => onConfirm && onConfirm(itemId, s.code)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white bg-[#1c1c1e] hover:bg-black transition active:scale-95 flex items-center gap-1 shadow-2xs"
              >
                <Check size={13} strokeWidth={2.4} />
                {i === 0 ? 'Confirm' : 'Use Code'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[#636366] font-medium">
        Tariff verification note: Suggestions are matched against the official ITC-HS tariff schedule.
      </p>
    </div>
  );
}
