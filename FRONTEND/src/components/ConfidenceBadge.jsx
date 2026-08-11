// export default function ConfidenceBadge({ score }) {
//   if (score >= 0.9) return (
//     <span className="w-5 h-5 flex items-center justify-center rounded-full
//       bg-green-50 text-green-700 border border-green-400 text-xs font-black">
//       ✓
//     </span>
//   );
//   if (score >= 0.7) return (
//     <span className="w-5 h-5 flex items-center justify-center rounded-full
//       bg-orange-50 text-orange-700 border border-orange-400 text-xs font-black">
//       !
//     </span>
//   );
//   return (
//     <span className="w-5 h-5 flex items-center justify-center rounded-full
//       bg-red-50 text-red-700 border border-red-400 text-xs font-black">
//       ✗
//     </span>
//   );
// }






export default function ConfidenceBadge({ score, showLabel = false }) {
  const s = typeof score === 'number' ? score : 0;

  if (s >= 0.9) return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="w-5 h-5 flex items-center justify-center rounded-full
        bg-green-100 text-green-700 border-[1.5px] border-green-500
        text-[10px] font-black">✓</span>
      {showLabel && <span className="text-[10px] font-bold text-green-700">{Math.round(s*100)}%</span>}
    </div>
  );

  if (s >= 0.7) return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="w-5 h-5 flex items-center justify-center rounded-full
        bg-orange-100 text-orange-700 border-[1.5px] border-orange-500
        text-[10px] font-black">!</span>
      {showLabel && <span className="text-[10px] font-bold text-orange-700">{Math.round(s*100)}%</span>}
    </div>
  );

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="w-5 h-5 flex items-center justify-center rounded-full
        bg-red-100 text-red-700 border-[1.5px] border-red-500
        text-[10px] font-black">✗</span>
      {showLabel && <span className="text-[10px] font-bold text-red-700">{Math.round(s*100)}%</span>}
    </div>
  );
}










// import React from 'react';
// import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

// export function ConfidenceBadge({ score = 95, level }) {
//   // Normalize level if provided or compute from score
//   const computedLevel = level || (score >= 90 ? 'High' : score >= 70 ? 'Review' : 'Manual');

//   if (computedLevel === 'High' || score >= 90) {
//     return (
//       <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
//         <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
//         <span>{score}% High</span>
//       </span>
//     );
//   }

//   if (computedLevel === 'Review' || score >= 70) {
//     return (
//       <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
//         <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
//         <span>{score}% Review</span>
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
//       <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
//       <span>{score}% Manual</span>
//     </span>
//   );
// }
