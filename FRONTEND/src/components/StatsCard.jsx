export default function StatsCard({ icon: Icon, label, value, color = 'blue', sub }) {
  const colors = {
    blue: 'border-l-blue-600 text-blue-800',
    green: 'border-l-green-600 text-green-800',
    gold: 'border-l-amber-500 text-amber-800',
    red: 'border-l-red-600 text-red-800',
    purple: 'border-l-purple-600 text-purple-800',
  };

  return (
    <div className={`card-base p-4 border-l-4 ${colors[color] || colors.blue}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={16} className="opacity-60" />}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black leading-tight">{value}</div>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
