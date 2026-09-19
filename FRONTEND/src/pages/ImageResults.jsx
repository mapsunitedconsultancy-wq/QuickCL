import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  getImageExtraction,
  editField,
  downloadExcel,
} from '../api';

import FieldRow from '../components/FieldRow.jsx';
import ConfidenceBadge from '../components/ConfidenceBadge.jsx';
import AsciiResultView from '../components/AsciiResultView.jsx';

import {
  Loader2,
  Download,
  FileSpreadsheet,
  FileText,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Package,
  ExternalLink,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const HS_LOOKUP_PATH = '/hs-lookup';
const ICEGATE_TRADE_GUIDE = 'https://www.icegate.gov.in/Webappl/Trade-Guide-on-Imports';
const CBIC_TARIFF = 'https://www.cbic.gov.in/entities/customs-tariff';

// ============================================================
// Helpers
// ============================================================

const getValue = (obj) =>
  obj && typeof obj === 'object' && 'value' in obj ? obj.value : obj ?? null;

const getConfidence = (obj) => {
  if (obj && typeof obj === 'object' && 'confidence' in obj) {
    const score = Number(obj.confidence);
    return !Number.isNaN(score) ? Math.max(0, Math.min(1, score)) : 0;
  }
  return 0;
};

const hasValue = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const label = (key) => {
  if (!key) return '';
  return String(key)
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

function displayValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// ============================================================
// Main Component (Apple HIG)
// ============================================================

export default function ImageResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getImageExtraction(id)
      .then((res) => {
        const extraction = res.data?.data || res.data;
        setData(extraction);
      })
      .catch((error) => {
        console.error('Image extraction load error:', error);
        toast.error('Failed to load image extraction');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const {
    fields,
    tables,
    accuracy,
    extractedFieldCount,
    processingTime,
  } = useMemo(() => {
    if (!data) {
      return {
        fields: [],
        tables: [],
        accuracy: 0,
        extractedFieldCount: 0,
        processingTime: '0.0',
      };
    }

    const json = data.extracted_json || data.extractedData || data.data || {};
    const parsedFields = [];
    let totalConfidence = 0;
    let confCount = 0;

    const fieldsSource = json.fields || json;

    Object.entries(fieldsSource).forEach(([key, val]) => {
      if (['raw_extracted_text', 'tables', 'overall_confidence'].includes(key)) return;
      if (!val || typeof val !== 'object' || Array.isArray(val)) return;

      const v = getValue(val);
      const c = getConfidence(val);

      if (hasValue(v)) {
        parsedFields.push({ key, label: label(key), value: v, confidence: c });
        totalConfidence += c;
        confCount++;
      }
    });

    const parsedTables = Array.isArray(json.tables) ? json.tables : [];
    let tableFieldCount = 0;

    parsedTables.forEach((table) => {
      table.rows?.forEach((row) => {
        Object.values(row).forEach((cell) => {
          if (hasValue(getValue(cell))) {
            tableFieldCount++;
            totalConfidence += getConfidence(cell);
            confCount++;
          }
        });
      });
    });

    const acc = confCount > 0 ? (totalConfidence / confCount) * 100 : 0;
    const time = (
      (data.extraction_time_ms || data.extractionTimeMs || 0) / 1000
    ).toFixed(1);

    return {
      fields: parsedFields,
      tables: parsedTables,
      accuracy: acc,
      extractedFieldCount: parsedFields.length + tableFieldCount,
      processingTime: time,
    };
  }, [data]);

  const handleCSVDownload = useCallback(() => {
    if (!data) return;
    const rows = [['Section', 'Field', 'Value']];
    const escapeCSV = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    fields.forEach((f) => {
      rows.push(['General Information', f.label, displayValue(f.value)]);
    });

    tables.forEach((table) => {
      const tableName = table.table_name || 'Table';
      table.rows?.forEach((row, rowIndex) => {
        const rowSection = `${tableName} (Row ${rowIndex + 1})`;
        Object.entries(row).forEach(([colKey, cellObj]) => {
          const val = getValue(cellObj);
          if (hasValue(val)) {
            rows.push([rowSection, label(colKey), displayValue(val)]);
          }
        });
      });
    });

    const csvString = rows.map((r) => r.map(escapeCSV).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-extraction-${id}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
    toast.success('CSV downloaded');
  }, [data, fields, tables, id]);

  const handleExcelDownload = useCallback(async () => {
    try {
      await downloadExcel(id, data?.job_number || data?.jobNumber);
      toast.success('Excel downloaded');
    } catch {
      toast.error('Failed to download Excel');
    }
  }, [id, data]);

  const handleFieldEdit = useCallback(
    async (fieldPath, newValue) => {
      try {
        await editField(id, fieldPath, newValue);
        toast.success('Field updated');

        const res = await getImageExtraction(id);
        const extraction = res.data?.data || res.data;
        setData(extraction);
      } catch (error) {
        console.error('Failed to update field:', error);
        toast.error('Failed to update field');
      }
    },
    [id]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#af52de]/10 text-[#af52de]">
            <Loader2 size={26} className="animate-spin" strokeWidth={2.2} />
          </div>
          <p className="mt-4 text-sm font-bold text-[#1c1c1e]">
            Loading image extraction...
          </p>
          <p className="mt-1 text-xs text-[#48484a]">
            Parsing vision OCR records
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-xl mx-auto my-12">
        <AlertTriangle size={32} className="mx-auto text-[#ff3b30]" strokeWidth={2.2} />
        <h2 className="mt-4 text-lg font-bold text-[#1c1c1e]">
          Image Extraction Not Found
        </h2>
        <p className="mt-1.5 text-sm text-[#48484a]">
          The requested image extraction could not be loaded or has expired.
        </p>
        <button
          onClick={() => navigate('/history')}
          className="mt-6 rounded-[14px] bg-[#007aff] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0066d6] transition active:scale-95"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20">
                  <ImageIcon size={13} className="mr-1.5" /> IMAGE OCR EXTRACTION
                </span>

                {(data.job_number || data.jobNumber) && (
                  <div className="flex items-center gap-2 rounded-full border border-[rgba(60,60,67,0.12)] bg-[#f9f9fb] px-3 py-1 text-xs font-medium text-[#1c1c1e]">
                    <FileText size={13} className="text-[#007aff]" />
                    <span className="text-[#48484a]">Job:</span>
                    <span className="font-mono font-bold">
                      {data.job_number || data.jobNumber}
                    </span>
                  </div>
                )}

                {(data.file_name || data.fileName) && (
                  <div className="flex items-center gap-2 rounded-full border border-[rgba(60,60,67,0.12)] bg-[#f9f9fb] px-3 py-1 text-xs font-medium text-[#1c1c1e]">
                    <span className="text-[#48484a]">File:</span>
                    <span className="font-mono font-semibold max-w-[200px] truncate">
                      {data.file_name || data.fileName}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-[#636366] px-1">
                  <Clock size={13} />
                  <span>ID #{id}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
                Image Extraction Results
              </h1>

              <p className="text-sm sm:text-base text-[#48484a] leading-relaxed max-w-3xl">
                Inspect all structured data fields and tables extracted from your uploaded image.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-4 py-2.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
              >
                <ArrowLeft size={14} strokeWidth={2.2} /> Back
              </button>

              <button
                onClick={handleExcelDownload}
                className="flex items-center gap-2 rounded-[14px] bg-[#34c759] hover:bg-[#28a745] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <FileSpreadsheet size={15} strokeWidth={2.2} /> Download Excel
              </button>

              <button
                onClick={handleCSVDownload}
                className="flex items-center gap-2 rounded-[14px] bg-[#007aff] hover:bg-[#0066d6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                <Download size={15} strokeWidth={2.2} /> Download CSV
              </button>
            </div>
          </div>

          {/* METRIC WIDGETS */}
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  Accuracy
                </span>
                <ShieldCheck
                  size={17}
                  strokeWidth={2.2}
                  className="text-[#1c1c1e]"
                />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {accuracy.toFixed(1)}%
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Extracted fields confidence
              </p>
            </div>

            <div className="rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  Data Points
                </span>
                <Database size={17} strokeWidth={2.2} className="text-[#1c1c1e]" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {extractedFieldCount}
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Fields & table cells mapped
              </p>
            </div>

            <div className="rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  Tables Detected
                </span>
                <Package size={17} strokeWidth={2.2} className="text-[#1c1c1e]" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {tables.length}
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Structured data grids
              </p>
            </div>

            <div className="rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  Processing Time
                </span>
                <Clock size={17} strokeWidth={2.2} className="text-[#1c1c1e]" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {processingTime}s
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Vision OCR latency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HS VERIFICATION NOTICE ================= */}
      <div className="rounded-[20px] border border-[#ff9500]/25 bg-[#ff9500]/8 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#ff9500]/15 text-[#ff9500]">
              <ShieldAlert size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1c1e] tracking-tight">
                Tariff Classification Notice
              </h3>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#48484a]">
                Fields and values were extracted from the document image. For regulatory customs filing, verify classifications using the Indian Customs ITC-HS tariff schedule.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => navigate(HS_LOOKUP_PATH)}
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

      {/* ================= CONFIDENCE LEGEND ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white px-6 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#48484a]">
            Confidence Legend
          </span>

          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-2 text-xs font-medium text-[#1c1c1e]">
              <ConfidenceBadge score={0.95} /> High Confidence (90%+)
            </span>

            <span className="flex items-center gap-2 text-xs font-medium text-[#1c1c1e]">
              <ConfidenceBadge score={0.75} /> Review Advised (70–89%)
            </span>

            <span className="flex items-center gap-2 text-xs font-medium text-[#1c1c1e]">
              <ConfidenceBadge score={0.5} /> Verify Carefully (&lt;70%)
            </span>
          </div>
        </div>
      </div>

      {/* ================= GENERAL FIELDS ================= */}
      {fields.length > 0 && (
        <section className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-4">
            <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
              General Extracted Information
            </h2>
            <p className="mt-0.5 text-xs text-[#48484a]">
              Dynamically mapped fields from document image.
            </p>
          </div>

          <div className="divide-y divide-[rgba(60,60,67,0.06)]">
            {fields.map((field) => (
              <FieldRow
                key={field.key}
                label={field.label}
                value={displayValue(field.value)}
                confidence={field.confidence}
                fieldKey={
                  data?.extracted_json?.fields ? `fields.${field.key}` : field.key
                }
                onEdit={handleFieldEdit}
              />
            ))}
          </div>
        </section>
      )}

      {/* ================= DYNAMIC TABLES ================= */}
      {tables.map((table, tIndex) => (
        <section
          key={tIndex}
          className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] shadow-2xs">
                <Database size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                  {table.table_name || `Extracted Table ${tIndex + 1}`}
                </h2>
                <p className="text-xs text-[#48484a]">
                  {table.rows?.length || 0} table row{table.rows?.length !== 1 && 's'} extracted
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y-4 divide-[rgba(60,60,67,0.06)]">
            {table.rows?.map((row, rIndex) => (
              <div key={rIndex} className="p-4 space-y-2">
                <div className="bg-white px-4 py-2 rounded-[10px] border border-[rgba(60,60,67,0.08)]">
                  <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#48484a]">
                    Row #{rIndex + 1}
                  </span>
                </div>

                <div className="divide-y divide-[rgba(60,60,67,0.06)] rounded-[12px] border border-[rgba(60,60,67,0.06)] overflow-hidden">
                  {Object.entries(row).map(([colKey, cellObj]) => {
                    const val = getValue(cellObj);
                    const conf = getConfidence(cellObj);
                    if (!hasValue(val)) return null;

                    return (
                      <FieldRow
                        key={colKey}
                        label={label(colKey)}
                        value={displayValue(val)}
                        confidence={conf || 0.9}
                        fieldKey={`tables.${tIndex}.rows.${rIndex}.${colKey}`}
                        onEdit={handleFieldEdit}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ================= RAW ASCII TABLE VIEW ================= */}
      <AsciiResultView
        jsonData={data.extracted_json || data.extractedData || data.data || {}}
      />

      {/* ================= FINAL SUMMARY ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] shadow-2xs">
              <CheckCircle2 size={20} strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Extraction Complete
              </p>
              <p className="mt-0.5 text-xs text-[#48484a]">
                {extractedFieldCount} dynamic fields and table cells mapped from image
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
              Overall Accuracy
            </p>
            <p
              className={`mt-0.5 text-base font-bold ${
                accuracy >= 90
                  ? 'text-[#34c759]'
                  : accuracy >= 75
                  ? 'text-[#007aff]'
                  : 'text-[#ff9500]'
              }`}
            >
              {accuracy.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
