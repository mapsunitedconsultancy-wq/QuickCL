import { useState, useMemo, useEffect } from 'react';
import { buildUnifiedModel } from '../lib/output/unifiedModel.js';
import { generateShippingBillPDF } from '../lib/checklist/generatePDF.js';
import { generateBillOfEntryPDF } from '../lib/checklist/generatePDFBoe.js';
import { downloadICESShippingBill } from '../lib/output/icesShippingBill.js';
import { downloadICESBillOfEntry } from '../lib/output/icesBillOfEntry.js';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileCheck,
  Building2,
} from 'lucide-react';

export default function OutputActions({ data, docType: propDocType }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState('');

  // Determine initial document type:
  // Strictly checks explicit docType prop & DB column doc_type first
  const initialDocType = useMemo(() => {
    const raw = String(
      propDocType ||
      data?.doc_type ||
      data?.docType ||
      data?.extracted_json?.doc_type ||
      data?.document_type ||
      data?.extraction_type ||
      data?.extracted_json?.document_type ||
      'SB'
    ).toUpperCase().trim();

    const isSB = raw === 'SB' || raw.includes('EXPORT') || raw.includes('SHIPPING') || raw.startsWith('SB');
    return isSB ? 'SB' : 'BOE';
  }, [data, propDocType]);

  const [activeDocType, setActiveDocType] = useState(initialDocType);

  useEffect(() => {
    setActiveDocType(initialDocType);
  }, [initialDocType]);

  const savedCha = useMemo(() => {
    try {
      const s = localStorage.getItem('quickcl_cha_profile');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }, []);

  const cha = useMemo(
    () => ({
      firmName: user?.firmName || user?.firm_name || savedCha?.firmName || '',
      chaLicense: user?.chaLicense || user?.cha_license || savedCha?.chaLicense || '',
      customHouse: user?.customsHouse || user?.customs_house || savedCha?.customHouse || '',
      stateName: user?.stateName || user?.state_name || savedCha?.stateName || 'GUJARAT',
      districtName: user?.districtName || user?.district_name || savedCha?.districtName || 'KACHCHH',
      bankAccount: user?.bankAccount || user?.bank_account || savedCha?.bankAccount || '',
      ifsc: user?.ifsc || user?.ifsc_code || savedCha?.ifsc || '',
      bankName: user?.bankName || user?.bank_name || savedCha?.bankName || '',
      jobNo: data?.job_number || data?.jobNumber || `JOB${Date.now().toString().slice(-6)}`,
    }),
    [user, savedCha, data]
  );

  const model = useMemo(
    () => buildUnifiedModel(data, cha, activeDocType),
    [data, cha, activeDocType]
  );
  const missing = model.missingCodes || [];
  const hasMissing = missing.length > 0;

  const handleGenPDF = () => {
    setBusy('pdf');
    try {
      if (activeDocType === 'BOE') {
        generateBillOfEntryPDF(model);
        toast.success('Bill of Entry Checklist PDF downloaded');
      } else {
        generateShippingBillPDF(model);
        toast.success('Shipping Bill Checklist PDF downloaded');
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Check console for details.');
    } finally {
      setBusy('');
    }
  };

  const handleGenICES = () => {
    if (hasMissing) {
      toast.error(`Please resolve missing codes first: ${missing.join(', ')}`);
      return;
    }
    setBusy('ices');
    try {
      const ok =
        activeDocType === 'BOE'
          ? downloadICESBillOfEntry(model)
          : downloadICESShippingBill(model);
      if (ok) {
        toast.success(`ICEGATE .${activeDocType === 'BOE' ? 'be' : 'sb'} file downloaded`);
      }
    } catch (err) {
      console.error('ICEGATE export error:', err);
      toast.error('Failed to generate ICEGATE file.');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[rgba(60,60,67,0.08)] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 shadow-2xs">
            <FileCheck size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Checklist &amp; Customs Declaration Engine
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#007aff]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007aff] border border-[#007aff]/20">
                <CheckCircle2 size={11} />
                {activeDocType === 'BOE' ? 'Bill of Entry (Import)' : 'Shipping Bill (Export)'}
              </span>
            </div>
            <p className="text-xs text-[#48484a] mt-0.5">
              Verified against U.S. Computers / Visual IMPEX schema. Generates professional PDF checklist &amp; direct-import ICES 1.5 file.
            </p>
          </div>
        </div>

        {/* Declaration Type Toggle + CHA profile */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <div className="inline-flex rounded-[12px] bg-[#f2f2f7] p-1 border border-[rgba(60,60,67,0.1)]">
            <button
              type="button"
              onClick={() => setActiveDocType('SB')}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-bold transition-all ${
                activeDocType === 'SB'
                  ? 'bg-white text-[#1c1c1e] shadow-2xs'
                  : 'text-[#636366] hover:text-[#1c1c1e]'
              }`}
            >
              Shipping Bill (SB)
            </button>
            <button
              type="button"
              onClick={() => setActiveDocType('BOE')}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-bold transition-all ${
                activeDocType === 'BOE'
                  ? 'bg-white text-[#1c1c1e] shadow-2xs'
                  : 'text-[#636366] hover:text-[#1c1c1e]'
              }`}
            >
              Bill of Entry (BOE)
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(60,60,67,0.12)] bg-[#f9f9fb] px-3 py-1.5 text-[11px] font-medium text-[#636366]">
            <Building2 size={12} className="text-[#1c1c1e]" />
            CHA: <span className="font-semibold text-[#1c1c1e]">{cha.firmName || 'Default Firm'}</span>
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* PRIMARY: Checklist PDF */}
        <button
          type="button"
          onClick={handleGenPDF}
          disabled={busy === 'pdf'}
          className="flex-1 min-w-[220px] flex items-center justify-center gap-2 rounded-[14px] bg-[#34c759] hover:bg-[#28a745] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
        >
          {busy === 'pdf' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating PDF Checklist...</span>
            </>
          ) : (
            <>
              <FileText size={16} strokeWidth={2.2} />
              <span>
                Download {activeDocType === 'BOE' ? 'Bill of Entry' : 'Shipping Bill'} Checklist (PDF)
              </span>
            </>
          )}
        </button>

        {/* SECONDARY: ICES File */}
        <button
          type="button"
          onClick={handleGenICES}
          disabled={busy === 'ices' || hasMissing}
          title={hasMissing ? `Missing mandatory codes: ${missing.join(', ')}` : undefined}
          className={`flex-1 min-w-[220px] flex items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-xs sm:text-sm font-semibold transition active:scale-[0.98] ${
            hasMissing
              ? 'bg-[#f2f2f7] text-[#8e8e93] border border-[rgba(60,60,67,0.15)] cursor-not-allowed'
              : 'bg-[#007aff] hover:bg-[#0066d6] text-white shadow-sm cursor-pointer'
          }`}
        >
          {busy === 'ices' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating ICEGATE File...</span>
            </>
          ) : (
            <>
              <Download size={16} strokeWidth={2.2} />
              <span>
                Download ICEGATE File (.{activeDocType === 'BOE' ? 'be' : 'sb'})
              </span>
            </>
          )}
        </button>
      </div>

      {/* Warning if mandatory codes missing for ICES file */}
      {hasMissing && (
        <div className="mt-4 flex items-start gap-2.5 rounded-[14px] border border-[#ff9500]/25 bg-[#ff9500]/8 p-3.5 text-xs text-[#b25e00]">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#ff9500]" />
          <div>
            <span className="font-bold">Missing Customs / ICEGATE Codes for ICEGATE export:</span>{' '}
            <span>{missing.join(', ')}</span>.
            <span className="block mt-0.5 text-[#8a4b00]">
              Please fill in the missing codes above or via your profile to enable ICEGATE (.{activeDocType === 'BOE' ? 'be' : 'sb'}) export. (PDF checklist download is unaffected).
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
