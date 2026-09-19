export default function StatsCard({ icon: Icon, label, value, color = 'blue', sub }) {
  const colorStyles = {
    blue: {
      bg: 'bg-[#007aff]/10',
      text: 'text-[#007aff]',
      border: 'border-[#007aff]/20',
    },
    green: {
      bg: 'bg-[#34c759]/10',
      text: 'text-[#34c759]',
      border: 'border-[#34c759]/20',
    },
    gold: {
      bg: 'bg-[#ff9500]/10',
      text: 'text-[#ff9500]',
      border: 'border-[#ff9500]/20',
    },
    purple: {
      bg: 'bg-[#af52de]/10',
      text: 'text-[#af52de]',
      border: 'border-[#af52de]/20',
    },
    red: {
      bg: 'bg-[#ff3b30]/10',
      text: 'text-[#ff3b30]',
      border: 'border-[#ff3b30]/20',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[rgba(60,60,67,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] font-semibold text-[#48484a] uppercase tracking-[0.06em]">
          {label}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${style.bg} ${style.text}`}>
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight text-[#1c1c1e]">{value}</div>
      {sub && <p className="text-xs text-[#636366] mt-1.5 font-normal">{sub}</p>}
    </div>
  );
}

