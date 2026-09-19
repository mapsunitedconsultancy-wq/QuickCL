import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyButton({ value, size = 'sm' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e?.stopPropagation();
    if (!value || value === '--') return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      toast.success('Copied to clipboard!', { duration: 900 });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const el = document.createElement('textarea');
      el.value = String(value);
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      toast.success('Copied!', { duration: 900 });
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const sz = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  const iconSz = size === 'lg' ? 15 : 13;

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`${sz} flex items-center justify-center border border-[rgba(60,60,67,0.12)] bg-[#f9f9fb]
        rounded-[8px] text-[#48484a] hover:bg-white hover:text-[#007aff] hover:border-[#007aff]/30 transition-all
        active:scale-95 shrink-0 cursor-pointer shadow-2xs`}
    >
      {copied ? (
        <Check size={iconSz} className="text-[#34c759]" strokeWidth={2.4} />
      ) : (
        <Copy size={iconSz} strokeWidth={2} />
      )}
    </button>
  );
}
