import CopyButton from './CopyButton';

export default function HSCodeSuggestion({ suggestions = [], onConfirm, itemId }) {
  if (!suggestions.length) return null;

  return (
    <div className="ml-44 mt-1 mb-2 bg-amber-50 border border-amber-200
      rounded-lg p-3">
      <p className="text-[10px] font-bold text-amber-800 mb-2 uppercase
        tracking-wider">AI Suggested HS Codes (select one):</p>
      <div className="space-y-1.5">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`font-mono font-bold px-2 py-0.5 rounded
              ${i === 0 ? 'bg-green-100 text-green-800' :
                i === 1 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'}`}>
              {s.code}
            </span>
            <span className="text-gray-600 flex-1 truncate">{s.desc || s.description}</span>
            <span className="text-[10px] font-bold text-gray-400">
              {Math.round((s.confidence || 0) * 100)}%
            </span>
            {s.bcd && <span className="text-[10px] text-blue-600">BCD:{s.bcd}</span>}
            {s.igst && <span className="text-[10px] text-purple-600">IGST:{s.igst}</span>}
            <CopyButton value={s.code} />
            <button
              onClick={() => onConfirm && onConfirm(itemId, s.code)}
              className="px-2 py-0.5 bg-blue-700 text-white rounded text-[10px]
                font-bold hover:bg-blue-800">
              {i === 0 ? 'Confirm' : 'Use'}
            </button>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-red-600 font-bold mt-2">
        ⚠ AI NEVER invents codes. These are from the official 12,000+ ITC-HS tariff database.
      </p>
    </div>
  );
}








// import React from 'react';
// import { Search, Check, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

// export function HSCodeSuggestion({
//   suggestions = [],
//   selectedCode,
//   onSelectCode,
//   onOpenLookup
// }) {
//   return (
//     <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Sparkles className="w-4 h-4 text-amber-500" />
//           <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
//             AI Recommended 8-Digit HSN Code Tariff Rates
//           </h4>
//         </div>

//         {onOpenLookup && (
//           <button
//             type="button"
//             onClick={onOpenLookup}
//             className="text-xs font-bold text-blue-900 hover:text-blue-800 flex items-center gap-1 underline"
//           >
//             <Search className="w-3.5 h-3.5" />
//             <span>Search Full ITC-HS Tariff Database</span>
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//         {suggestions.map((item) => {
//           const isSelected = selectedCode === item.code;
//           const totalDuty = (item.bcd * (1 + item.sws / 100) + item.igst).toFixed(1);

//           return (
//             <div
//               key={item.code}
//               onClick={() => onSelectCode && onSelectCode(item)}
//               className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
//                 isSelected
//                   ? 'bg-blue-900 text-white border-blue-900 shadow-md'
//                   : 'bg-white hover:border-blue-900 text-slate-900 border-slate-200'
//               }`}
//             >
//               <div>
//                 <div className="flex items-center justify-between">
//                   <span
//                     className={`font-mono font-black text-sm ${
//                       isSelected ? 'text-teal-300' : 'text-blue-950'
//                     }`}
//                   >
//                     {item.code}
//                   </span>
//                   {item.matchScore && (
//                     <span
//                       className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
//                         isSelected
//                           ? 'bg-blue-800 text-teal-300'
//                           : 'bg-emerald-100 text-emerald-800'
//                       }`}
//                     >
//                       {item.matchScore}% Match
//                     </span>
//                   )}
//                 </div>

//                 <p
//                   className={`text-xs font-medium line-clamp-2 mt-1 ${
//                     isSelected ? 'text-slate-200' : 'text-slate-700'
//                   }`}
//                 >
//                   {item.description}
//                 </p>
//               </div>

//               {/* Duty Rates Row */}
//               <div
//                 className={`p-2 rounded-lg text-[11px] font-mono grid grid-cols-3 gap-1 text-center border ${
//                   isSelected
//                     ? 'bg-blue-950 border-blue-800 text-slate-200'
//                     : 'bg-slate-50 border-slate-200 text-slate-800'
//                 }`}
//               >
//                 <div>
//                   <span className="block text-[9px] text-slate-400">BCD</span>
//                   <span className="font-bold">{item.bcd}%</span>
//                 </div>
//                 <div>
//                   <span className="block text-[9px] text-slate-400">SWS</span>
//                   <span className="font-bold">{item.sws}%</span>
//                 </div>
//                 <div>
//                   <span className="block text-[9px] text-slate-400">IGST</span>
//                   <span className="font-bold">{item.igst}%</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-1">
//                 <span
//                   className={`text-xs font-bold font-mono ${
//                     isSelected ? 'text-teal-300' : 'text-emerald-700'
//                   }`}
//                 >
//                   Total Duty: ~{totalDuty}%
//                 </span>

//                 <button
//                   type="button"
//                   className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
//                     isSelected
//                       ? 'bg-teal-400 text-slate-950'
//                       : 'bg-slate-100 text-slate-800 hover:bg-blue-900 hover:text-white'
//                   }`}
//                 >
//                   {isSelected ? (
//                     <>
//                       <Check className="w-3.5 h-3.5" />
//                       <span>Selected</span>
//                     </>
//                   ) : (
//                     <span>Confirm Code</span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
