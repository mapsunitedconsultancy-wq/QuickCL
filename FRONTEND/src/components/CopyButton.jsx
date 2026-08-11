// import { useState } from 'react';
// import { Copy, Check } from 'lucide-react';
// import toast from 'react-hot-toast';

// export default function CopyButton({ value }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(value);
//     setCopied(true);
//     toast.success('Copied!', { duration: 1000 });
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <button onClick={handleCopy}
//       className="w-7 h-7 flex items-center justify-center border rounded
//         hover:bg-blue-50 hover:border-blue-300 transition-colors">
//       {copied ? <Check size={14} className="text-green-600" />
//               : <Copy size={14} className="text-gray-400" />}
//     </button>
//   );
// }










import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyButton({ value, size = 'sm' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value || value === '--') return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      toast.success('Copied!', { duration: 800, style: { fontSize: '13px' } });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = String(value);
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      toast.success('Copied!', { duration: 800 });
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const sz = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  const iconSz = size === 'lg' ? 16 : 14;

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`${sz} flex items-center justify-center border border-gray-200
        rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all
        active:scale-95 flex-shrink-0 cursor-pointer`}
    >
      {copied
        ? <Check size={iconSz} className="text-green-600" />
        : <Copy size={iconSz} className="text-gray-400" />}
    </button>
  );
}






// import React, { useState } from 'react';
// import { Copy, Check } from 'lucide-react';

// export function CopyButton({
//   text,
//   label = 'Copy',
//   copiedLabel = 'Copied!',
//   className = '',
//   iconOnly = false,
//   size = 'sm'
// }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = (e) => {
//     e.stopPropagation();
//     if (!text) return;
//     navigator.clipboard.writeText(String(text));
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1600);
//   };

//   const baseClasses =
//     'inline-flex items-center gap-1 font-bold rounded-lg transition-all shadow-xs cursor-pointer select-none';

//   const sizeClasses =
//     size === 'xs'
//       ? 'px-2 py-1 text-[10px]'
//       : size === 'lg'
//       ? 'px-4 py-2 text-xs'
//       : 'px-2.5 py-1.5 text-xs';

//   const styleClasses = copied
//     ? 'bg-emerald-600 text-white border border-emerald-500'
//     : 'bg-blue-900 hover:bg-blue-800 text-white border border-blue-800';

//   return (
//     <button
//       type="button"
//       onClick={handleCopy}
//       title={copied ? 'Copied to clipboard' : `Copy "${text}"`}
//       className={`${baseClasses} ${sizeClasses} ${styleClasses} ${className}`}
//     >
//       {copied ? (
//         <>
//           <Check className="w-3.5 h-3.5 text-teal-200" />
//           {!iconOnly && <span>{copiedLabel}</span>}
//         </>
//       ) : (
//         <>
//           <Copy className="w-3.5 h-3.5" />
//           {!iconOnly && <span>{label}</span>}
//         </>
//       )}
//     </button>
//   );
// }
