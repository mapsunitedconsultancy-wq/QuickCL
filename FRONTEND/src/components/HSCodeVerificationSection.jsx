import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

const ICEGATE_TRADE_GUIDE = 'https://www.icegate.gov.in/Webappl/Trade-Guide-on-Imports';
const CBIC_TARIFF = 'https://www.cbic.gov.in/entities/customs-tariff';

/**
 * Reusable HS / CTH Classification Verification Notice Component
 * Placed at every line item section across all extractions.
 * Informs the user whether the HS code was extracted or is missing/not present,
 * with direct lookup buttons for our internal ITC-HS engine, ICEGATE, and CBIC.
 */
export default function HSCodeVerificationSection({
  hsCode,
  description = '',
  itemIndex,
}) {
  const navigate = useNavigate();

  const rawCode = typeof hsCode === 'object' && hsCode !== null ? hsCode.value : hsCode;
  const isPresent = Boolean(rawCode && String(rawCode).trim() !== '' && String(rawCode).trim() !== '—');
  const codeStr = isPresent ? String(rawCode).trim() : '';
  const descStr = typeof description === 'object' && description !== null ? (description.value || '') : (description || '');

  const handleSearchLookup = () => {
    const query = codeStr || descStr || '';
    if (query) {
      navigate(`/hs-lookup?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/hs-lookup');
    }
  };

  return (
    <div
      className={`rounded-[16px] border p-4 sm:p-5 transition-all ${
        isPresent
          ? 'border-[rgba(60,60,67,0.12)] bg-[#fbfbfe]'
          : 'border-[#ff9500]/25 bg-[#ff9500]/8'
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${
              isPresent
                ? 'bg-[#34c759]/15 text-[#34c759]'
                : 'bg-[#ff9500]/15 text-[#ff9500]'
            }`}
          >
            {isPresent ? (
              <CheckCircle2 size={20} strokeWidth={2.2} />
            ) : (
              <ShieldAlert size={20} strokeWidth={2.2} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#1c1c1e] tracking-tight">
                HS / CTH Classification Verification Notice
              </h3>
              {itemIndex !== undefined && (
                <span className="text-[11px] font-semibold text-[#8e8e93]">
                  Line Item #{itemIndex + 1}
                </span>
              )}
              {isPresent ? (
                <span className="inline-flex items-center rounded-full bg-[#34c759]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#34c759]">
                  Extracted: {codeStr}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#ff9500]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ff9500]">
                  HS Code Missing — Action Required
                </span>
              )}
            </div>

            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#48484a]">
              {isPresent ? (
                <>
                  HS codes shown below were extracted verbatim from your uploaded documents. Prior to ICEGATE filing, verify classification and applicable duties using the official customs tariff schedule.
                </>
              ) : (
                <>
                  HS code for this line item was <strong className="text-[#1c1c1e] font-semibold">not extracted / not present</strong> in your uploaded documents. Prior to ICEGATE filing, verify classification and search for a valid 8-digit ITC-HS code using our lookup or the official customs tariff schedule.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSearchLookup}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#007aff] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-95"
          >
            <Search size={14} strokeWidth={2.2} /> HS Code Lookup
          </button>

          <a
            href={ICEGATE_TRADE_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[12px] border border-[rgba(60,60,67,0.15)] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#f2f2f7] active:scale-95"
          >
            ICEGATE <ExternalLink size={13} />
          </a>

          <a
            href={CBIC_TARIFF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[12px] border border-[rgba(60,60,67,0.15)] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#f2f2f7] active:scale-95"
          >
            CBIC Tariff <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
