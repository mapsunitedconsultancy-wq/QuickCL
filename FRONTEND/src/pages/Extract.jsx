import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractDocuments, getClients } from '../api';
import { useAuth } from '../context/AuthContext';
import UploadZone from '../components/uploadZone.jsx';
import {
  Loader2,
  AlertCircle,
  FileText,
  Package,
  FileCheck,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Extract() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [docType, setDocType] = useState('BOE');

  const [files, setFiles] = useState({
    invoice: null,
    packingList: null,
    billOfLading: null,
    coo: null,
    licence: null,
  });

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data || []))
      .catch(() => {});
  }, []);

  const setFile = (key) => (file) =>
    setFiles((p) => ({
      ...p,
      [key]: file,
    }));

  const currentPlan = (user?.plan || 'demo').toLowerCase();
  const extractionsUsed = user?.extractionsUsed || 0;

  let planLimit = 40;
  if (currentPlan === 'pro') {
    planLimit = 120;
  } else if (currentPlan === 'enterprise') {
    planLimit = Infinity;
  }

  const isLimitReached = extractionsUsed >= planLimit;

  const handleExtract = async () => {
    if (isLimitReached) {
      setError('Plan limit reached. Please upgrade to a higher plan.');
      toast.error('Limit reached. Please upgrade.');
      return;
    }

    if (!files.invoice) {
      setError('Commercial Invoice is required');
      return;
    }

    setLoading(true);
    setError('');
    setProgress('Uploading documents...');

    try {
      const formData = new FormData();

      formData.append('docType', docType);

      if (selectedClient) {
        formData.append('clientId', selectedClient);
      }

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      setProgress('Reading text with OCR...');

      setTimeout(() => setProgress('Extracting fields...'), 5000);
      setTimeout(() => setProgress('Validating HS codes...'), 12000);
      setTimeout(() => setProgress('Almost done...'), 18000);

      const res = await extractDocuments(formData);

      toast.success(
        `Extracted ${res.data.extractedData?.items?.length || 0} items in ${(
          (res.data.extractionTimeMs || 0) / 1000
        ).toFixed(1)}s`
      );

      navigate(`/results/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Extraction failed. Try again.');
      toast.error('Extraction failed');
    }

    setLoading(false);
    setProgress('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <FileText size={14} className="text-[#007aff]" strokeWidth={2.2} />
            PDF Extraction Engine
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            New PDF Extraction
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Upload your customs documents (Commercial Invoice, Packing List, Bill of Lading) to extract structured declaration data automatically.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-3 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
            >
              <Clock size={16} strokeWidth={2.2} />
              View Extraction History
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIMIT WARNING ================= */}
      {isLimitReached && (
        <div className="flex items-start gap-3 rounded-[16px] bg-[#ff9500]/10 border border-[#ff9500]/25 p-5 text-[#1c1c1e]">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-[#ff9500]" />
          <div>
            <p className="font-bold text-sm">
              {currentPlan === 'demo' ? 'Free' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan Limit Reached
            </p>
            <p className="text-xs text-[#48484a] mt-1 leading-relaxed">
              You have used all {extractionsUsed}/{planLimit} extractions allowed on your plan. To continue creating new document extractions, please upgrade to a higher plan.
            </p>
          </div>
        </div>
      )}

      {/* ================= SECTION 1: DOCUMENT TYPE ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
            <FileText size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Document Type
            </h2>
            <p className="text-xs text-[#48484a]">
              Select the customs declaration you are preparing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* BOE */}
          <button
            type="button"
            onClick={() => setDocType('BOE')}
            className={`text-left p-5 rounded-[16px] border-2 transition-all active:scale-[0.99] ${
              docType === 'BOE'
                ? 'border-[#007aff] bg-[#007aff]/5 ring-2 ring-[#007aff]/20'
                : 'border-[rgba(60,60,67,0.12)] bg-[#f9f9fb] hover:bg-white hover:border-[rgba(60,60,67,0.25)]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-xs font-bold transition-colors ${
                  docType === 'BOE'
                    ? 'bg-[#007aff] text-white shadow-sm'
                    : 'bg-[#f2f2f7] text-[#48484a]'
                }`}
              >
                BOE
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#1c1c1e]">
                  Bill of Entry
                </p>
                <p className="text-xs text-[#48484a] mt-0.5">
                  Import declaration
                </p>
              </div>

              {docType === 'BOE' && (
                <CheckCircle2 size={20} className="text-[#007aff]" strokeWidth={2.4} />
              )}
            </div>
          </button>

          {/* SB */}
          <button
            type="button"
            onClick={() => setDocType('SB')}
            className={`text-left p-5 rounded-[16px] border-2 transition-all active:scale-[0.99] ${
              docType === 'SB'
                ? 'border-[#34c759] bg-[#34c759]/5 ring-2 ring-[#34c759]/20'
                : 'border-[rgba(60,60,67,0.12)] bg-[#f9f9fb] hover:bg-white hover:border-[rgba(60,60,67,0.25)]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-xs font-bold transition-colors ${
                  docType === 'SB'
                    ? 'bg-[#34c759] text-white shadow-sm'
                    : 'bg-[#f2f2f7] text-[#48484a]'
                }`}
              >
                SB
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#1c1c1e]">
                  Shipping Bill
                </p>
                <p className="text-xs text-[#48484a] mt-0.5">
                  Export declaration
                </p>
              </div>

              {docType === 'SB' && (
                <CheckCircle2 size={20} className="text-[#34c759]" strokeWidth={2.4} />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ================= SECTION 2: REQUIRED DOCUMENTS ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <Package size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Required Documents
              </h2>
              <p className="text-xs text-[#48484a]">
                Upload the documents required for extraction
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30]">
            REQUIRED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UploadZone
            label="Commercial Invoice"
            required
            file={files.invoice}
            onFileChange={setFile('invoice')}
          />

          <UploadZone
            label="Packing List"
            file={files.packingList}
            onFileChange={setFile('packingList')}
          />

          <UploadZone
            label="Bill of Lading / AWB"
            file={files.billOfLading}
            onFileChange={setFile('billOfLading')}
          />
        </div>
      </div>

      {/* ================= SECTION 3: SUPPORTING DOCUMENTS ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <FileCheck size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Supporting Documents
              </h2>
              <p className="text-xs text-[#48484a]">
                Optional documents can improve extraction accuracy
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(60,60,67,0.08)] text-[#48484a]">
            OPTIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UploadZone
            label="Certificate of Origin (COO)"
            file={files.coo}
            onFileChange={setFile('coo')}
          />

          <UploadZone
            label="EPCG / DEEC Licence"
            file={files.licence}
            onFileChange={setFile('licence')}
          />
        </div>
      </div>

      {/* ================= SECTION 4: CLIENT SELECTION ================= */}
      {clients.length > 0 && (
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <Building2 size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Client Details
              </h2>
              <p className="text-xs text-[#48484a]">
                Select a saved client to automatically fill importer/exporter information
              </p>
            </div>
          </div>

          <select
            className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-3 px-4 text-sm text-[#1c1c1e] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">-- No client selected --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.client_name} ({c.iec_code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-start gap-3 rounded-[16px] bg-[#ff3b30]/10 border border-[#ff3b30]/25 p-5 text-[#1c1c1e]">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-[#ff3b30]" />
          <div>
            <p className="font-bold text-sm text-[#ff3b30]">Extraction Error</p>
            <p className="text-xs text-[#48484a] mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ================= EXTRACTION ACTION ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Ready to extract?
            </p>
            <p className="text-xs text-[#48484a] mt-1">
              We will read your documents, extract fields, and validate HS codes.
            </p>
          </div>

          <button
            onClick={handleExtract}
            disabled={loading || isLimitReached}
            className="min-w-[200px] rounded-[14px] bg-[#007aff] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" strokeWidth={2.2} />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                Start Extraction
                <ArrowRight size={16} strokeWidth={2.2} />
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="mt-6 pt-5 border-t border-[rgba(60,60,67,0.08)]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-2 h-2 rounded-full bg-[#007aff] animate-pulse" />
              <span className="text-xs font-semibold text-[#007aff]">
                {progress}
              </span>
            </div>

            <div className="h-2 bg-[#f2f2f7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007aff] rounded-full animate-pulse transition-all duration-300"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER INFO ================= */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <ShieldCheck size={14} className="text-[#636366]" />
        <p className="text-xs text-[#636366]">
          Supports PDF · Maximum 10 MB per file · Encrypted data transfer
        </p>
      </div>
    </div>
  );
}
