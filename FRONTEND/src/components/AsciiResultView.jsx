import { useState, useMemo, useCallback } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to clean key labels
const formatLabel = (key) => {
    if (!key) return '';
    return String(key)
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s+/g, ' ')
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
};

// Helper to extract primitive values
const extractVal = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') {
        if ('value' in v) return extractVal(v.value);
        try {
            return JSON.stringify(v);
        } catch {
            return String(v);
        }
    }
    return String(v);
};

// Helper to generate a borderless table layout
function generateBorderlessTable(title, headers, rows) {
    if (!headers || headers.length === 0) return '';

    // Determine max width of each column
    const colWidths = headers.map((header) => {
        let maxW = header.length;
        rows.forEach((row) => {
            const valStr = String(row[header] ?? '');
            if (valStr.length > maxW) {
                maxW = valStr.length;
            }
        });
        return maxW;
    });

    const colGap = 4; // Spacing between columns
    const gapStr = ' '.repeat(colGap);

    let totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    if (headers.length === 2) {
        totalWidth += 3; // for ' : '
    } else {
        totalWidth += colGap * (headers.length - 1);
    }

    let out = '';

    // Title Banner
    if (title) {
        const doubleLine = '='.repeat(totalWidth);
        const padding = Math.max(0, Math.floor((totalWidth - title.length) / 2));
        out += `${doubleLine}\n`;
        out += `${' '.repeat(padding)}${title.toUpperCase()}\n`;
        out += `${doubleLine}\n`;
    }

    // Headers Row
    headers.forEach((header, i) => {
        const width = colWidths[i];
        const valStr = header.toUpperCase();
        if (i === headers.length - 1) {
            out += valStr;
        } else {
            const separator = (headers.length === 2) ? ' : ' : gapStr;
            out += valStr.padEnd(width) + separator;
        }
    });
    out += '\n';

    // Divider line
    out += '-'.repeat(totalWidth) + '\n';

    // Rows
    rows.forEach((row) => {
        headers.forEach((header, i) => {
            const width = colWidths[i];
            const valStr = String(row[header] ?? '');
            if (i === headers.length - 1) {
                out += valStr;
            } else {
                const separator = (headers.length === 2) ? ' : ' : gapStr;
                out += valStr.padEnd(width) + separator;
            }
        });
        out += '\n';
    });

    out += '-'.repeat(totalWidth) + '\n\n';
    return out;
}

// Main conversion function
export function convertJsonToAscii(json) {
    if (!json || typeof json !== 'object') {
        return String(json);
    }

    let out = '';
    const generalFields = [];
    const sections = [];
    const tablesList = [];

    Object.entries(json).forEach(([key, val]) => {
        if (val === null || val === undefined) return;
        if (['raw_extracted_text', 'overall_confidence', 'document_type'].includes(key)) return;

        if (key === 'tables' && Array.isArray(val)) {
            val.forEach((tableObj, tIdx) => {
                if (tableObj && typeof tableObj === 'object') {
                    const tableName = tableObj.table_name || `Table ${tIdx + 1}`;
                    const rows = tableObj.rows || [];
                    if (rows.length > 0) {
                        tablesList.push({ name: formatLabel(tableName), rows: rows });
                    }
                }
            });
        } else if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === 'object') {
                const isListOfTables = val[0].table_name !== undefined && val[0].rows !== undefined;
                if (isListOfTables) {
                    val.forEach((tableObj, tIdx) => {
                        const tableName = tableObj.table_name || `${formatLabel(key)} ${tIdx + 1}`;
                        const rows = tableObj.rows || [];
                        if (rows.length > 0) {
                            tablesList.push({ name: formatLabel(tableName), rows: rows });
                        }
                    });
                } else {
                    tablesList.push({ name: formatLabel(key), rows: val });
                }
            } else {
                generalFields.push({
                    'Field Name': formatLabel(key),
                    'Value': val.map(extractVal).join(', ')
                });
            }
        } else if (typeof val === 'object') {
            if ('value' in val) {
                generalFields.push({
                    'Field Name': formatLabel(key),
                    'Value': extractVal(val.value)
                });
            } else {
                // Nested section object
                const sectionRows = [];
                Object.entries(val).forEach(([subKey, subVal]) => {
                    const valueStr = extractVal(subVal);
                    if (valueStr.trim().length > 0) {
                        sectionRows.push({
                            'Field Name': formatLabel(subKey),
                            'Value': valueStr
                        });
                    }
                });
                if (sectionRows.length > 0) {
                    sections.push({ name: formatLabel(key), rows: sectionRows });
                }
            }
        } else {
            generalFields.push({
                'Field Name': formatLabel(key),
                'Value': String(val)
            });
        }
    });

    if (generalFields.length > 0) {
        out += generateBorderlessTable('General Information', ['Field Name', 'Value'], generalFields);
    }

    sections.forEach(section => {
        out += generateBorderlessTable(section.name, ['Field Name', 'Value'], section.rows);
    });

    tablesList.forEach(table => {
        const rows = table.rows || [];
        if (rows.length === 0) return;

        const headersSet = new Set();
        rows.forEach(row => {
            if (row && typeof row === 'object') {
                Object.keys(row).forEach(k => headersSet.add(k));
            }
        });
        const headers = Array.from(headersSet);
        if (headers.length === 0) return;

        const flatRows = rows.map(row => {
            const flatRow = {};
            headers.forEach(h => {
                flatRow[formatLabel(h)] = extractVal(row[h]);
            });
            return flatRow;
        });

        const labelHeaders = headers.map(h => formatLabel(h));
        out += generateBorderlessTable(table.name, labelHeaders, flatRows);
    });

    if (out.trim().length === 0) {
        out = JSON.stringify(json, null, 2);
    }

    return out;
}

export default function AsciiResultView({ jsonData }) {
    const [copied, setCopied] = useState(false);

    // Format the json on load/render
    const asciiText = useMemo(() => {
        return convertJsonToAscii(jsonData);
    }, [jsonData]);

    // Parse lines to apply custom bold styles to headings/banners
    const renderedLines = useMemo(() => {
        if (!asciiText) return null;
        const lines = asciiText.split('\n');
        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.length === 0) {
                return <div key={idx}>&nbsp;</div>;
            }

            // 1. Separator divider lines
            if (/^[=-]+$/.test(trimmed)) {
                return (
                    <div key={idx} className="text-slate-300 select-none opacity-80 font-normal">
                        {line}
                    </div>
                );
            }

            // 2. Title banners (sandwiched by === dividers)
            const prevLine = (lines[idx - 1] || '').trim();
            const nextLine = (lines[idx + 1] || '').trim();
            if (/^=+$/.test(prevLine) && /^=+$/.test(nextLine)) {
                return (
                    <div key={idx} className="font-extrabold text-slate-900 tracking-wider text-[12px]">
                        {line}
                    </div>
                );
            }

            // 3. Table Column Headers (followed by --- divider)
            if (/^-+$/.test(nextLine)) {
                const isHeader = prevLine === '' || /^=+$/.test(prevLine);
                if (isHeader) {
                    return (
                        <div key={idx} className="font-extrabold text-slate-800 text-[11.5px]">
                            {line}
                        </div>
                    );
                }
            }

            // Regular content line
            return (
                <div key={idx} className="text-slate-600 font-normal">
                    {line}
                </div>
            );
        });
    }, [asciiText]);

    const handleCopy = useCallback(() => {
        if (!asciiText) return;
        navigator.clipboard.writeText(asciiText);
        setCopied(true);
        toast.success('ASCII format copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    }, [asciiText]);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/60">
                        <FileText size={15} className="text-slate-600" />
                    </div>
                    <div>
                        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-500">
                            RAW EXTRACTED DATA (SKELETAL VIEW)
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-600" />
                            <span className="text-[11px] text-green-600">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} className="text-slate-500" />
                            <span className="text-[11px]">Copy Raw Data</span>
                        </>
                    )}
                </button>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-auto max-h-[700px] bg-gray-100">
                <pre className="text-xs font-mono leading-relaxed text-slate-800 whitespace-pre overflow-x-auto selection:bg-blue-100 selection:text-blue-900">
                    {renderedLines}
                </pre>
            </div>
        </section>
    );
}
