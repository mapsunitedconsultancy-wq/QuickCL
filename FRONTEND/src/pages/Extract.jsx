import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractDocuments, getClients } from '../api';
import UploadZone from '../components/UploadZone';
import {
  Loader2,
  Zap,
  AlertCircle,
  FileText,
  Package,
  Ship,
  FileCheck,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Extract() {
  const navigate = useNavigate();

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

  const handleExtract = async () => {
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

      setTimeout(
        () => setProgress('AI is extracting fields...'),
        5000
      );

      setTimeout(
        () => setProgress('Validating HS codes...'),
        12000
      );

      setTimeout(
        () => setProgress('Almost done...'),
        18000
      );

      const res = await extractDocuments(formData);

      toast.success(
        `Extracted ${
          res.data.extractedData?.items?.length || 0
        } items in ${(
          (res.data.extractionTimeMs || 0) / 1000
        ).toFixed(1)}s`
      );

      navigate(`/results/${res.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Extraction failed. Try again.'
      );

      toast.error('Extraction failed');
    }

    setLoading(false);
    setProgress('');
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded
                bg-blue-100 text-blue-800 uppercase tracking-wider"
            >
              AI DOCUMENT EXTRACTION
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            New Extraction
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Upload customs documents and extract structured
            declaration data automatically.
          </p>
        </div>

        <div
          className="hidden sm:flex items-center gap-2
            text-xs text-gray-400 bg-white border
            border-gray-200 rounded-lg px-3 py-2"
        >
          <Zap size={14} className="text-blue-700" />
          AI Powered
        </div>
      </div>

      {/* =====================================================
          DOCUMENT TYPE
      ====================================================== */}
      <div className="card-base p-5 mb-4">

        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg bg-blue-100
              text-blue-800 flex items-center justify-center"
          >
            <FileText size={16} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Document Type
            </h2>

            <p className="text-[11px] text-gray-400">
              Select the customs declaration you are preparing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* BOE */}
          <button
            type="button"
            onClick={() => setDocType('BOE')}
            className={`
              text-left p-4 rounded-xl border-2
              transition-all
              ${
                docType === 'BOE'
                  ? 'border-blue-700 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center gap-3">

              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center
                  justify-center text-xs font-black
                  ${
                    docType === 'BOE'
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                BOE
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">
                  Bill of Entry
                </p>

                <p className="text-[11px] text-gray-400">
                  Import declaration
                </p>
              </div>

              {docType === 'BOE' && (
                <CheckCircle2
                  size={18}
                  className="text-blue-700"
                />
              )}
            </div>
          </button>

          {/* SB */}
          <button
            type="button"
            onClick={() => setDocType('SB')}
            className={`
              text-left p-4 rounded-xl border-2
              transition-all
              ${
                docType === 'SB'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-200 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center gap-3">

              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center
                  justify-center text-xs font-black
                  ${
                    docType === 'SB'
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                SB
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">
                  Shipping Bill
                </p>

                <p className="text-[11px] text-gray-400">
                  Export declaration
                </p>
              </div>

              {docType === 'SB' && (
                <CheckCircle2
                  size={18}
                  className="text-green-700"
                />
              )}
            </div>
          </button>

        </div>
      </div>

      {/* =====================================================
          REQUIRED DOCUMENTS
      ====================================================== */}
      <div className="card-base p-5 mb-4">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">

            <div
              className="w-8 h-8 rounded-lg bg-blue-100
                text-blue-800 flex items-center justify-center"
            >
              <Package size={16} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Required Documents
              </h2>

              <p className="text-[11px] text-gray-400">
                Upload the documents required for extraction
              </p>
            </div>

          </div>

          <span
            className="text-[10px] font-bold px-2 py-1
              rounded bg-red-50 text-red-600"
          >
            REQUIRED
          </span>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <UploadZone
            label="Commercial Invoice"
            required
            file={files.invoice}
            onFileChange={setFile('invoice')}
          />

          <UploadZone
            label="Packing List"
            required
            file={files.packingList}
            onFileChange={setFile('packingList')}
          />

          <UploadZone
            label="Bill of Lading / AWB"
            required
            file={files.billOfLading}
            onFileChange={setFile('billOfLading')}
          />

        </div>
      </div>

      {/* =====================================================
          OPTIONAL DOCUMENTS
      ====================================================== */}
      <div className="card-base p-5 mb-4">

        <div className="flex items-center gap-2 mb-4">

          <div
            className="w-8 h-8 rounded-lg bg-gray-100
              text-gray-600 flex items-center justify-center"
          >
            <FileCheck size={16} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Supporting Documents
            </h2>

            <p className="text-[11px] text-gray-400">
              Optional documents can improve extraction accuracy
            </p>
          </div>

          <span
            className="ml-auto text-[10px] font-bold
              px-2 py-1 rounded bg-gray-100 text-gray-500"
          >
            OPTIONAL
          </span>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

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

      {/* =====================================================
          CLIENT SELECTION
      ====================================================== */}
      {clients.length > 0 && (
        <div className="card-base p-5 mb-4">

          <div className="flex items-center gap-2 mb-4">

            <div
              className="w-8 h-8 rounded-lg bg-purple-100
                text-purple-700 flex items-center justify-center"
            >
              <Building2 size={16} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Client Details
              </h2>

              <p className="text-[11px] text-gray-400">
                Select a saved client to automatically fill
                importer/exporter information
              </p>
            </div>

          </div>

          <select
            className="input-field"
            value={selectedClient}
            onChange={(e) =>
              setSelectedClient(e.target.value)
            }
          >
            <option value="">
              -- No client selected --
            </option>

            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.client_name} ({c.iec_code})
              </option>
            ))}
          </select>

        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div
          className="flex items-start gap-3 bg-red-50
            border border-red-200 text-red-700 text-sm
            p-4 rounded-xl mb-4"
        >
          <AlertCircle
            size={18}
            className="shrink-0 mt-0.5"
          />

          <div>
            <p className="font-bold">
              Extraction Error
            </p>

            <p className="text-xs mt-0.5">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EXTRACTION ACTION
      ====================================================== */}
      <div className="card-base p-5">

        <div
          className="flex flex-col sm:flex-row
            sm:items-center justify-between gap-4"
        >

          <div>
            <p className="text-sm font-bold text-gray-800">
              Ready to extract?
            </p>

            <p className="text-[11px] text-gray-400 mt-1">
              AI will read your documents, extract fields,
              and validate HS codes.
            </p>
          </div>

          <button
            onClick={handleExtract}
            disabled={loading}
            className="
              btn-primary
              min-w-[190px]
              py-3
              px-5
              text-sm
              flex
              items-center
              justify-center
              gap-2
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Zap size={17} />
                Start Extraction
                <ArrowRight size={15} />
              </>
            )}
          </button>

        </div>

        {/* Progress */}
        {loading && (
          <div
            className="mt-5 pt-4 border-t
              border-gray-100"
          >

            <div className="flex items-center gap-2 mb-2">

              <div
                className="w-2 h-2 rounded-full
                  bg-blue-700 animate-pulse"
              />

              <span
                className="text-xs font-semibold
                  text-blue-800"
              >
                {progress}
              </span>

            </div>

            <div
              className="h-1.5 bg-gray-100
                rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-blue-700
                  rounded-full animate-pulse"
                style={{ width: '70%' }}
              />
            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          FOOTER INFO
      ====================================================== */}
      <div className="flex items-center justify-center gap-2 mt-4">

        <ShieldCheck
          size={13}
          className="text-gray-400"
        />

        <p className="text-[10px] text-gray-400">
          Supports PDF ·
          Maximum 20 MB per file
        </p>

      </div>

    </div>
  );
}


