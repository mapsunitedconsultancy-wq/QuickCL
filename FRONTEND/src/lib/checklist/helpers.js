// Safely extract value from {value, confidence} or plain string
export function val(field, fallback = '') {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'string') return field.trim() || fallback;
  if (typeof field === 'number') return String(field);
  if (typeof field === 'object' && 'value' in field) {
    const v = field.value;
    if (v === null || v === undefined) return fallback;
    return String(v).trim() || fallback;
  }
  return fallback;
}

// Format a number with commas (Indian style optional)
export function num(field, decimals = 2) {
  const raw = val(field);
  if (!raw) return '';
  const n = parseFloat(String(raw).replace(/,/g, ''));
  if (isNaN(n)) return raw;
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Format date to DD/MM/YYYY
export function fmtDate(field) {
  const raw = val(field);
  if (!raw) return '';
  // If already DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const dd = ddmmyyyy[1].padStart(2, '0');
    const mm = ddmmyyyy[2].padStart(2, '0');
    const yyyy = ddmmyyyy[3];
    return `${dd}/${mm}/${yyyy}`;
  }
  // If YYYY-MM-DD or YYYY/MM/DD
  const yyyymmdd = raw.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (yyyymmdd) {
    const yyyy = yyyymmdd[1];
    const mm = yyyymmdd[2].padStart(2, '0');
    const dd = yyyymmdd[3].padStart(2, '0');
    return `${dd}/${mm}/${yyyy}`;
  }
  // If YYYYMMDD
  if (/^\d{8}$/.test(raw)) {
    const yyyy = raw.slice(0, 4);
    const mm = raw.slice(4, 6);
    const dd = raw.slice(6, 8);
    return `${dd}/${mm}/${yyyy}`;
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Current system date formatted as DD/MM/YYYY
export function todayDDMMYYYY() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Get line items array safely from any data structure
export function items(data) {
  if (!data) return [];
  if (Array.isArray(data?.line_items) && data.line_items.length > 0) return data.line_items;
  if (Array.isArray(data?.items) && data.items.length > 0) return data.items;
  if (Array.isArray(data?.extraction_items) && data.extraction_items.length > 0) return data.extraction_items;
  if (Array.isArray(data?.extracted_json?.line_items) && data.extracted_json.line_items.length > 0) return data.extracted_json.line_items;
  if (Array.isArray(data?.extracted_json?.items) && data.extracted_json.items.length > 0) return data.extracted_json.items;
  if (Array.isArray(data?.extractedData?.line_items) && data.extractedData.line_items.length > 0) return data.extractedData.line_items;
  if (Array.isArray(data?.extractedData?.items) && data.extractedData.items.length > 0) return data.extractedData.items;
  return [];
}
