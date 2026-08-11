import * as XLSX from 'xlsx';

export function exportJobToExcel(job) {
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['CUSTOMS CHECKLIST SUMMARY', ''],
    ['Job Number', job.jobNo],
    ['Job Date', job.jobDate],
    ['Checklist Type', job.type === 'BOE' ? 'Bill of Entry (Import)' : 'Shipping Bill (Export)'],
    ['Client Name', job.clientName],
    ['IEC Code', job.iec],
    ['GSTIN', job.gstin],
    ['Port Code', job.portCode],
    ['Verification Accuracy Score', `${job.accuracyScore.toFixed(1)}%`],
    ['Total Extracted Fields', job.totalFields],
    [''],
    ['SECTION WISE FIELDS SUMMARY', '']
  ];

  Object.entries(job.sections).forEach(([secKey, fields]) => {
    summaryData.push([secKey.toUpperCase(), `${fields.length} fields`]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Job Summary');

  // All Fields sheet
  const allFieldsRows = [
    ['Section', 'Field Label', 'Extracted Value', 'Source Document', 'Confidence Score %']
  ];

  Object.entries(job.sections).forEach(([secKey, fields]) => {
    fields.forEach((f) => {
      allFieldsRows.push([
        secKey.toUpperCase(),
        f.label,
        f.value,
        f.sourceDoc || 'OCR',
        `${f.confidence || 95}%`
      ]);
    });
  });

  const wsFields = XLSX.utils.aoa_to_sheet(allFieldsRows);
  XLSX.utils.book_append_sheet(wb, wsFields, 'All Extracted Fields');

  // Write Excel file
  const fileName = `${job.jobNo}_Checklist.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportJobToCsv(job) {
  let csv = `Section,Field Label,Extracted Value,Source Document,Confidence %\n`;

  Object.entries(job.sections).forEach(([secKey, fields]) => {
    fields.forEach((f) => {
      const cleanVal = String(f.value || '').replace(/"/g, '""');
      const cleanLabel = String(f.label || '').replace(/"/g, '""');
      csv += `"${secKey.toUpperCase()}","${cleanLabel}","${cleanVal}","${f.sourceDoc || 'OCR'}","${f.confidence || 95}%"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${job.jobNo}_Checklist.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
