import { Inbox } from 'lucide-react';

export default function EmptyState({ title, message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center
        justify-center mb-4">
        <Inbox size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-1">{title || 'No data yet'}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-4">{message}</p>
      {action && (
        <button onClick={onAction} className="btn-primary">{action}</button>
      )}
    </div>
  );
}







// import React from 'react';
// import { FileQuestion, Plus } from 'lucide-react';

// export function EmptyState({
//   title = 'No Data Available Yet',
//   message = 'Get started by creating your first document extraction job or searching records.',
//   icon: Icon = FileQuestion,
//   actionLabel,
//   onAction
// }) {
//   return (
//     <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-4 max-w-md mx-auto my-8">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto shadow-inner">
//         <Icon className="w-8 h-8 text-blue-900" />
//       </div>

//       <div className="space-y-1">
//         <h3 className="text-lg font-black text-slate-900">{title}</h3>
//         <p className="text-xs text-slate-500 max-w-sm mx-auto">{message}</p>
//       </div>

//       {actionLabel && onAction && (
//         <div className="pt-2">
//           <button
//             type="button"
//             onClick={onAction}
//             className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 shadow-md"
//           >
//             <Plus className="w-4 h-4 text-teal-300" />
//             <span>{actionLabel}</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
