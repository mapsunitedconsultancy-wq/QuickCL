import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  getExtraction,
  editField,
  downloadExcel,
  confirmHSCode,
} from '../api';

import FieldRow from '../components/FieldRow.jsx';
import HSCodeSuggestion from '../components/HSCodeSuggestion.jsx';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

// Official External Links
const HS_LOOKUP_PATH = '/hs-lookup';
const ICEGATE_TRADE_GUIDE = 'https://www.icegate.gov.in/Webappl/Trade-Guide-on-Imports';
const CBIC_TARIFF = 'https://www.cbic.gov.in/entities/customs-tariff';

// ============================================================
// Helpers
// ============================================================

const getValue = (field) => {
  if (field && typeof field === 'object' && Object.prototype.hasOwnProperty.call(field, 'value')) {
    return field.value;
  }
  return field ?? null;
};

const getConfidence = (field) => {
  if (field && typeof field === 'object' && Object.prototype.hasOwnProperty.call(field, 'confidence')) {
    const score = Number(field.confidence);
    if (!Number.isNaN(score)) {
      return Math.max(0, Math.min(1, score));
    }
  }
  return 0;
};

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const isFieldObject = (value) => {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'value') &&
    Object.prototype.hasOwnProperty.call(value, 'confidence')
  );
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

const SECTION_TITLES = {
  job: 'Job / File Header',
  importer_exporter: 'Importer / Exporter',
  foreign_party: 'Foreign Party',
  consignee: 'Consignee / Buyer',
  shipment: 'Shipment / Vessel',
  containers: 'Container Details',
  invoice: 'Invoice & Value',
  items: 'Line Items',
  packing: 'Packing Details',
  duty: 'Duty & Tax',
  scheme: 'Scheme Details',
  drawback: 'Drawback',
  rodtep: 'RoDTEP',
  esanchit: 'e-Sanchit',
  declarations: 'Declarations',
  licences: 'Licences',
  certificate: 'Certificate Information',
  additional: 'Additional Information',
};

// ============================================================
// Recursively collect scalar fields
// ============================================================

function collectFields(section) {
  const extracted = [];
  const missing = [];

  function walk(node, path = []) {
    if (node === null || node === undefined) return;
    if (Array.isArray(node)) return;

    if (isFieldObject(node)) {
      const value = getValue(node);
      const field = {
        key: path.join('.'),
        label: label(path[path.length - 1]),
        value: value,
        confidence: getConfidence(node),
      };

      if (hasValue(value)) extracted.push(field);
      else missing.push(field);
      return;
    }

    if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        walk(value, [...path, key]);
      }
      return;
    }

    const field = {
      key: path.join('.'),
      label: label(path[path.length - 1]),
      value: node,
      confidence: 1,
    };

    if (hasValue(node)) extracted.push(field);
    else missing.push(field);
  }

  walk(section);

  return { extracted, missing };
}

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
// Build CSV export
// ============================================================

function flattenForCSV(node, sectionName, rows, path = []) {
  if (node === null || node === undefined) return;

  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      flattenForCSV(item, sectionName, rows, [...path, String(index + 1)]);
    });
    return;
  }

  if (typeof node === 'object') {
    if (isFieldObject(node)) {
      const value = getValue(node);
      if (hasValue(value)) {
        rows.push({
          section: sectionName,
          field: path.map(label).join(' → '),
          value: displayValue(value),
          confidence: `${(getConfidence(node) * 100).toFixed(1)}%`,
        });
      }
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      flattenForCSV(value, sectionName, rows, [...path, key]);
    });
    return;
  }

  if (hasValue(node)) {
    rows.push({
      section: sectionName,
      field: path.map(label).join(' → '),
      value: displayValue(node),
      confidence: '100%',
    });
  }
}

// ============================================================
// Dynamic Section Card (Apple HIG)
// ============================================================

function DynamicSection({ sectionKey, section, number, onEdit }) {
  const { extracted } = useMemo(() => collectFields(section), [section]);

  if (extracted.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Section Header */}
      <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white border border-[rgba(60,60,67,0.18)] text-xs font-bold text-[#1c1c1e] shadow-2xs">
              {number}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1c1c1e] tracking-tight">
                {SECTION_TITLES[sectionKey] || label(sectionKey)}
              </h2>
              <p className="text-[11px] text-[#48484a]">
                {extracted.length} field{extracted.length !== 1 && 's'} extracted
              </p>
            </div>
          </div>

          <span className="self-start sm:self-center text-[10px] font-semibold text-[#48484a] bg-white border border-[rgba(60,60,67,0.15)] px-2.5 py-0.5 rounded-full">
            {extracted.length} POPULATED
          </span>
        </div>
      </div>

      {/* Field Rows */}
      <div className="divide-y divide-[rgba(60,60,67,0.06)]">
        {extracted.map((field) => (
          <FieldRow
            key={field.key}
            label={field.label}
            value={displayValue(field.value)}
            confidence={field.confidence}
            fieldKey={sectionKey ? `${sectionKey}.${field.key}` : field.key}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Main Results Page
// ============================================================

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load extraction
  useEffect(() => {
    getExtraction(id)
      .then((res) => {
        const extraction = res.data;
        setData(extraction);
        setItems(extraction.items || extraction.extraction_items || []);
      })
      .catch(() => toast.error('Failed to load extraction'))
      .finally(() => setLoading(false));
  }, [id]);

  // Derived Calculations
  const {
    json,
    accuracy,
    extractedFieldCount,
    missingFieldCount,
    standardSections,
    allMissingFields,
  } = useMemo(() => {
    if (!data) {
      return {
        json: {},
        accuracy: 0,
        extractedFieldCount: 0,
        missingFieldCount: 0,
        standardSections: [],
        allMissingFields: [],
      };
    }

    const jsonVal = data.extracted_json || data.extractedData || {};
    const acc =
      Number(
        data.accuracy_score ??
          data.accuracyPercent ??
          Number(data.accuracy || 0) * 100
      ) || 0;

    let extCount = 0;
    let missCount = 0;
    const sections = [];
    const missingGroups = [];

    Object.entries(jsonVal).forEach(([key, section]) => {
      if (key === 'overall_confidence' || key === 'document_type') return;

      const result = collectFields(section);
      extCount += result.extracted.length;
      missCount += result.missing.length;

      if (
        key !== 'items' &&
        key !== 'line_items' &&
        key !== 'containers' &&
        !Array.isArray(section) &&
        section &&
        typeof section === 'object'
      ) {
        sections.push([key, section]);
        if (result.missing.length > 0) {
          missingGroups.push({
            sectionTitle: SECTION_TITLES[key] || label(key),
            fields: result.missing,
          });
        }
      }
    });

    return {
      json: jsonVal,
      accuracy: acc,
      extractedFieldCount: extCount,
      missingFieldCount: missCount,
      standardSections: sections,
      allMissingFields: missingGroups,
    };
  }, [data]);

  // Event Handlers
  const handleFieldEdit = useCallback(
    async (fieldPath, newValue) => {
      try {
        await editField(id, fieldPath, newValue);
        toast.success('Field updated successfully');
        const res = await getExtraction(id);
        setData(res.data);
        setItems(res.data.items || res.data.extraction_items || []);
      } catch {
        toast.error('Failed to update field');
      }
    },
    [id]
  );

  const handleHSConfirm = useCallback(
    async (itemId, code) => {
      try {
        await confirmHSCode(id, itemId, code);
        toast.success(`HS Code ${code} confirmed`);
      } catch {
        toast.error('Failed to confirm HS code');
      }
    },
    [id]
  );

  const handleCSVDownload = useCallback(() => {
    if (!data) return;
    const rows = [];
    const jsonVal = data.extracted_json || data.extractedData || {};

    Object.entries(jsonVal).forEach(([sectionKey, section]) => {
      if (sectionKey === 'overall_confidence' || sectionKey === 'document_type') return;
      flattenForCSV(
        section,
        SECTION_TITLES[sectionKey] || label(sectionKey),
        rows,
        []
      );
    });

    items.forEach((item, index) => {
      const itemSection = `Line Item ${index + 1}`;
      Object.entries(item).forEach(([key, value]) => {
        if (['id', 'extraction_id', 'created_at', 'updated_at'].includes(key)) return;
        if (value === null || value === undefined || value === '') return;

        rows.push({
          section: itemSection,
          field: label(key),
          value: displayValue(getValue(value)),
          confidence: isFieldObject(value)
            ? `${(getConfidence(value) * 100).toFixed(1)}%`
            : '',
        });
      });
    });

    const header = ['Section', 'Field', 'Value'];
    const escapeCSV = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [header, ...rows.map((row) => [row.section, row.field, row.value])]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.job_number || data.jobNumber || 'extraction'}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
    toast.success('CSV downloaded');
  }, [data, items]);

  const handleExcelDownload = useCallback(async () => {
    try {
      await downloadExcel(id, data?.job_number || data?.jobNumber);
      toast.success('Excel downloaded');
    } catch {
      toast.error('Failed to download Excel');
    }
  }, [id, data]);

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#007aff]/10 text-[#007aff]">
            <Loader2 size={26} className="animate-spin" strokeWidth={2.2} />
          </div>
          <p className="mt-4 text-sm font-bold text-[#1c1c1e]">
            Loading extraction results...
          </p>
          <p className="mt-1 text-xs text-[#48484a]">
            Preparing structured customs declaration data
          </p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!data) {
    return (
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-xl mx-auto my-12">
        <AlertTriangle size={32} className="mx-auto text-[#ff3b30]" strokeWidth={2.2} />
        <h2 className="mt-4 text-lg font-bold text-[#1c1c1e]">
          Extraction Not Found
        </h2>
        <p className="mt-1.5 text-sm text-[#48484a]">
          The requested extraction could not be loaded or has been removed.
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
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white text-[#1c1c1e] border border-[rgba(60,60,67,0.15)] shadow-2xs">
                  {data.doc_type === 'BOE'
                    ? 'BOE — IMPORT DECLARATION'
                    : data.doc_type === 'SB'
                    ? 'SB — EXPORT DECLARATION'
                    : data.doc_type || 'DOCUMENT'}
                </span>

                <div className="flex items-center gap-2 rounded-full border border-[rgba(60,60,67,0.12)] bg-white px-3 py-1 text-xs font-medium text-[#1c1c1e]">
                  <FileText size={13} className="text-[#1c1c1e]" />
                  <span className="text-[#48484a]">Job:</span>
                  <span className="font-mono font-bold">
                    {data.job_number || data.jobNumber || '--'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#636366] px-1">
                  <Clock size={13} />
                  <span>ID #{id}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
                Extraction Results
              </h1>

              <p className="text-sm sm:text-base text-[#48484a] leading-relaxed max-w-3xl">
                Review and inspect all structured information extracted from your customs documents. Verify tariff classifications and download declarations.
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

          {/* METRIC WIDGETS ROW */}
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
                  Extracted
                </span>
                <Database size={17} strokeWidth={2.2} className="text-[#1c1c1e]" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {extractedFieldCount}
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Populated document fields
              </p>
            </div>

            <div className="rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                  Not Extracted
                </span>
                <AlertTriangle size={17} strokeWidth={2.2} className="text-[#ff9500]" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
                {missingFieldCount}
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Unpopulated or optional
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
                {((data.extraction_time_ms || data.extractionTimeMs || 0) / 1000).toFixed(1)}s
              </p>
              <p className="mt-1 text-[11px] text-[#636366]">
                Total end-to-end extraction
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
                HS / CTH Classification Verification Notice
              </h3>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#48484a]">
                HS codes shown below were extracted verbatim from your uploaded documents. Prior to ICEGATE filing, verify classification and applicable duties using the official customs tariff schedule.
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

      {/* ================= EXTRACTION REVIEW LEGEND ================= */}
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

      {/* ================= STANDARD EXTRACTED SECTIONS ================= */}
      <div className="space-y-5">
        <div className="pt-2">
          <h2 className="text-xl font-bold tracking-tight text-[#1c1c1e]">
            Extracted Declaration Sections
          </h2>
          <p className="mt-1 text-xs text-[#48484a]">
            Fields populated directly from the parsed customs documentation.
          </p>
        </div>

        <div className="space-y-4">
          {standardSections.map(([sectionKey, section], index) => (
            <DynamicSection
              key={sectionKey}
              sectionKey={sectionKey}
              section={section}
              number={index + 1}
              onEdit={handleFieldEdit}
            />
          ))}
        </div>
      </div>

      {/* ================= CONTAINERS (IF PRESENT) ================= */}
      {Array.isArray(json.containers) && json.containers.length > 0 && (
        <section className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e]">
                <Package size={17} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1c1c1e] tracking-tight">
                  Container Details
                </h2>
                <p className="text-[11px] text-[#48484a]">
                  {json.containers.length} container{json.containers.length !== 1 && 's'} declared
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {json.containers.map((container, index) => {
              const result = collectFields(container);
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-[16px] border border-[rgba(60,60,67,0.1)] bg-white"
                >
                  <div className="bg-white px-5 py-3 border-b border-[rgba(60,60,67,0.08)]">
                    <span className="text-xs font-bold text-[#1c1c1e]">
                      Container {index + 1}
                    </span>
                  </div>

                  {result.extracted.length > 0 && (
                    <div className="divide-y divide-[rgba(60,60,67,0.06)]">
                      {result.extracted.map((field) => (
                        <FieldRow
                          key={field.key}
                          label={field.label}
                          value={displayValue(field.value)}
                          confidence={field.confidence}
                          fieldKey={`containers.${index}.${field.key}`}
                          onEdit={handleFieldEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= LINE ITEMS / PRODUCT DETAILS ================= */}
      {items.length > 0 && (
        <section className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {/* Section Header */}
          <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] shadow-2xs">
                <Package size={20} strokeWidth={2.2} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                    Product Line Items
                  </h2>

                  <span className="rounded-full bg-white border border-[rgba(60,60,67,0.15)] px-2.5 py-0.5 text-xs font-bold text-[#1c1c1e]">
                    {items.length} item{items.length !== 1 && 's'}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#48484a]">
                  Review product descriptions, quantities, unit prices, total values, and HS classifications.
                </p>
              </div>
            </div>
          </div>

          {/* Line Items List */}
          <div className="divide-y divide-[rgba(60,60,67,0.1)]">
            {items.map((item, index) => {
              const description = getValue(item.item_description || item.description);
              const hsCode = getValue(item.hs_code);

              return (
                <div key={item.id || index} className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(60,60,67,0.08)]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white border border-[rgba(60,60,67,0.18)] text-xs font-bold text-[#1c1c1e]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold text-[#1c1c1e]">
                        Item #{index + 1}
                      </span>
                    </div>

                    <ConfidenceBadge
                      score={
                        getConfidence(item.confidence_score) ||
                        Number(item.confidence_score) ||
                        0
                      }
                      showLabel
                    />
                  </div>

                  {/* Item Fields */}
                  <div className="divide-y divide-[rgba(60,60,67,0.06)] rounded-[14px] border border-[rgba(60,60,67,0.08)] overflow-hidden">
                    {hasValue(description) && (
                      <FieldRow
                        label="Description"
                        value={displayValue(description)}
                        confidence={
                          getConfidence(item.item_description || item.description) || 0.95
                        }
                        fieldKey={`items.${item.id}.item_description`}
                        onEdit={handleFieldEdit}
                      />
                    )}

                    {hasValue(hsCode) && (
                      <div className="bg-white">
                        <FieldRow
                          label="HS Code"
                          value={displayValue(hsCode)}
                          confidence={
                            getConfidence(item.hs_code) ||
                            Number(item.confidence_score) ||
                            0
                          }
                          fieldKey={`items.${item.id}.hs_code`}
                          onEdit={handleFieldEdit}
                        />

                        {/* HS Notice Callout */}
                        <div className="m-4 rounded-[14px] border border-[rgba(60,60,67,0.12)] bg-white p-4 shadow-2xs">
                          <div className="flex items-start gap-3">
                            <Search
                              size={18}
                              strokeWidth={2.2}
                              className="mt-0.5 shrink-0 text-[#1c1c1e]"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#1c1c1e]">
                                Verify Extracted HS Code
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[#48484a]">
                                The code shown above is directly extracted from the invoice. Verify classification against the 8-digit Indian Customs ITC-HS schedule.
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => navigate('/hs-lookup')}
                                  className="flex items-center gap-1.5 rounded-[10px] bg-[#007aff] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0066d6] active:scale-95"
                                >
                                  <Search size={13} strokeWidth={2.2} /> Search ITC-HS
                                </button>
                                <a
                                  href={ICEGATE_TRADE_GUIDE}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 rounded-[10px] border border-[rgba(60,60,67,0.15)] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] transition hover:bg-[#f2f2f7] active:scale-95"
                                >
                                  <ExternalLink size={13} /> Official Tariff Guide
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {[
                      ['Quantity', item.quantity, 'quantity'],
                      ['Unit', item.unit, 'unit'],
                      ['Unit Price', item.unit_price, 'unit_price'],
                      ['Total Value', item.total_value, 'total_value'],
                    ].map(([fieldLabel, fieldValue, colName]) => {
                      if (!hasValue(getValue(fieldValue))) return null;
                      return (
                        <FieldRow
                          key={fieldLabel}
                          label={fieldLabel}
                          value={displayValue(getValue(fieldValue))}
                          confidence={getConfidence(fieldValue) || 0.95}
                          fieldKey={`items.${item.id}.${colName}`}
                          onEdit={handleFieldEdit}
                        />
                      );
                    })}
                  </div>

                  {/* AI Suggested HS Codes */}
                  {Array.isArray(item.ai_suggested_hs) && item.ai_suggested_hs.length > 0 && (
                    <HSCodeSuggestion
                      suggestions={item.ai_suggested_hs}
                      itemId={item.id}
                      onConfirm={handleHSConfirm}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= NO ITEMS STATE ================= */}
      {items.length === 0 && (
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-[#636366]" />
            <div>
              <p className="text-sm font-bold text-[#1c1c1e]">
                No Line Items Extracted
              </p>
              <p className="mt-0.5 text-xs text-[#48484a]">
                No product line-item rows were detected in the source documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= RAW ASCII TABLE VIEW ================= */}
      <AsciiResultView jsonData={data.extracted_json || data.extractedData || {}} />

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
                {extractedFieldCount} fields extracted from{' '}
                {data.doc_type || json.document_type || 'document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                Processing Time
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#1c1c1e]">
                {((data.extraction_time_ms || data.extractionTimeMs || 0) / 1000).toFixed(1)}s
              </p>
            </div>

            <div className="h-8 w-px bg-[rgba(60,60,67,0.12)]" />

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                Accuracy
              </p>
              <p
                className={`mt-0.5 text-sm font-bold ${
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

      {/* ================= MISSING FIELDS GROUP ================= */}
      {missingFieldCount > 0 && (
        <div className="rounded-[20px] border border-[#ff9500]/25 bg-[#ff9500]/8 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#ff9500]" />
            <div className="w-full">
              <p className="text-sm font-bold text-[#1c1c1e]">
                {missingFieldCount} fields were not found in source documents
              </p>
              <p className="mt-1 text-xs text-[#48484a]">
                These declaration fields were not detected in the uploaded PDFs:
              </p>

              <div className="mt-4 space-y-3">
                {allMissingFields.map((group) => (
                  <div
                    key={group.sectionTitle}
                    className="border-t border-[#ff9500]/15 pt-3 first:border-0 first:pt-0"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1c1c1e] mb-2">
                      {group.sectionTitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.fields.map((field) => (
                        <span
                          key={field.key}
                          className="rounded-[8px] bg-white border border-[rgba(60,60,67,0.12)] px-2.5 py-1 text-xs font-medium text-[#48484a]"
                        >
                          {field.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
