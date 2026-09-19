export default function ConfidenceBadge({ score, showLabel = false }) {
  const s = typeof score === 'number' ? score : 0;
  const pct = Math.round(s <= 1 ? s * 100 : s);

  if (pct >= 90) {
    return (
      <div className="inline-flex items-center gap-1.5 shrink-0">
        <span
          className="w-5 h-5 flex items-center justify-center rounded-full bg-[#34c759]/15 text-[#34c759] border border-[#34c759]/30 text-xs font-bold"
          title="High Confidence (>=90%)"
        >
          ✓
        </span>
        {showLabel && (
          <span className="text-xs font-semibold text-[#34c759]">
            {pct}%
          </span>
        )}
      </div>
    );
  }

  if (pct >= 70) {
    return (
      <div className="inline-flex items-center gap-1.5 shrink-0">
        <span
          className="w-5 h-5 flex items-center justify-center rounded-full bg-[#ff9500]/15 text-[#ff9500] border border-[#ff9500]/30 text-xs font-bold"
          title="Review Needed (70-89%)"
        >
          !
        </span>
        {showLabel && (
          <span className="text-xs font-semibold text-[#ff9500]">
            {pct}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 shrink-0">
      <span
        className="w-5 h-5 flex items-center justify-center rounded-full bg-[#ff3b30]/15 text-[#ff3b30] border border-[#ff3b30]/30 text-xs font-bold"
        title="Low Confidence (<70%)"
      >
        ✗
      </span>
      {showLabel && (
        <span className="text-xs font-semibold text-[#ff3b30]">
          {pct}%
        </span>
      )}
    </div>
  );
}
