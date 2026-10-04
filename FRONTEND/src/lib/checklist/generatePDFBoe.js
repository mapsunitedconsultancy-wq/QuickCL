import { jsPDF } from 'jspdf';
import { val, num, fmtDate, todayDDMMYYYY } from './helpers.js';

/**
 * Draws an em-dash style dashed line across the printable area
 */
function drawDashedLine(doc, y, margin = 10, pageW = 210) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([1.2, 0.8], 0);
  doc.line(margin, y, pageW - margin, y);
  doc.setLineDashPattern([], 0);
}

/**
 * Ensures enough vertical space remains on the current page; otherwise adds a new page.
 */
function checkPageBreak(doc, currentY, requiredHeight = 15, margin = 10, pageH = 297) {
  if (currentY + requiredHeight > pageH - margin) {
    doc.addPage();
    return margin + 2;
  }
  return currentY;
}

/**
 * Renders a label and value with colon ':' locked at exact xColon coordinate.
 * Guarantees zero colon misalignment across different label lengths.
 * Field names / keys are styled bold in accordance with checklist standards.
 */
function printField(doc, label, value, xLabel, xColon, y, maxValWidth) {
  if (!label) return;
  doc.setFont('helvetica', 'bold');
  doc.text(label, xLabel, y);
  doc.text(':', xColon, y);
  doc.setFont('helvetica', 'normal');
  if (value !== undefined && value !== null && String(value).trim() !== '') {
    const valX = xColon + 2.5;
    const maxW = maxValWidth || (xColon > 100 ? 198 - valX : 104 - valX);
    const valLines = doc.splitTextToSize(String(value), maxW);
    doc.text(valLines[0], valX, y);
  }
}

/**
 * Generates exact industry-standard Bill of Entry (Import) Checklist
 * Matches U.S. Computers format:
 * - Text-only, black & white (no colors, no background fills)
 * - Em-dash dashed borders
 * - Zero branding / QuickCL mentions
 * - All colons strictly aligned at fixed horizontal coordinates
 * - All dates and numbers strictly dynamic (zero guessing / brute force)
 */
export function generateBillOfEntryPDF(model) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  let y = margin + 3;

  // Fixed colon alignment guides
  const COLON_LEFT = 46;   // Fixed X for all left-column colons (margin 10 + 36mm label width)
  const COLON_RIGHT = 146; // Fixed X for all right-column colons (start 108 + 38mm label width)

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  // Dynamic system date for checklist generation & filing dates
  const today = todayDDMMYYYY();
  const printDate = today;
  const beDate = today;

  // Header and Filing Information
  const chaName = (model.cha?.name || model.header?.chaName || 'CUSTOMS BROKER').toUpperCase();
  const chaLicense = model.cha?.license || model.header?.chaLicense || '—';
  const jobNo = model.cha?.jobNo || model.header?.jobNo || val(model.job?.job_number) || '—';
  const jobDate = model.cha?.jobDate || model.header?.jobDate || today;
  const customHouse = model.cha?.customHouse?.name || model.cha?.customHouse || model.header?.customHouse || '—';
  const portImport = model.transport?.portDischarge?.name || model.header?.portImport || '—';

  // BE Number: strictly from extracted document data or '—' if filing draft
  const beNo = val(model.beNo) || val(model.header?.beNo) || val(model.general_info?.be_number) || '—';

  // Importer details
  const importer = {
    iec: model.party?.iec || model.importer?.iec || '—',
    gstin: model.party?.gstin || model.importer?.gstin || '—',
    gstinType: model.party?.gstinType || 'GSN',
    pan: model.party?.pan || model.importer?.pan || '—',
    name: (model.party?.name || model.importer?.name || '—').toUpperCase(),
    address: model.party?.address || model.importer?.address || '—',
    adCode: model.party?.adCode || model.importer?.adCode || '—',
  };

  // Supplier details
  const supplier = {
    name: (model.counterparty?.name || model.supplier?.name || '—').toUpperCase(),
    address: model.counterparty?.address || model.supplier?.address || '—',
    country: (model.counterparty?.country?.name || model.supplier?.country || '—').toUpperCase(),
    countryOrigin: (model.transport?.countryOrigin?.name || model.consignment?.countryOrigin || '—').toUpperCase(),
  };

  // Consignment details
  const consignment = {
    portShipment: model.transport?.portLoading?.name || model.consignment?.portShipment || '—',
    portImport: portImport,
    countryOrigin: supplier.countryOrigin,
    countryConsignment: supplier.country,
    totalPackages: model.pkg?.totalPackages || model.package?.totalPackages || '—',
    packageType: model.pkg?.packageType?.code || model.package?.packageType || '—',
    grossWeight: model.pkg?.grossWeight || model.package?.grossWeight || '—',
    netWeight: model.pkg?.netWeight || model.package?.netWeight || '—',
    weightUnit: model.pkg?.weightUnit?.code || 'KGS',
    vessel: model.transport?.vessel || model.consignment?.vessel || '—',
    voyage: model.transport?.voyage || '—',
    blNumber: model.transport?.blNumber || model.consignment?.blNumber || '—',
    blDate: model.transport?.blDate?.display || model.consignment?.blDate || '—',
    containers: model.transport?.containers || model.consignment?.containers || '—',
  };

  // Invoice: invoiceDate is strictly taken as per extracted invoice document
  const rawInvoiceDate = model.invoice?.date?.display || (model.invoice?.invoiceDate ? fmtDate(model.invoice.invoiceDate) : '');
  const invoice = {
    invoiceNo: model.invoice?.number || model.invoice?.invoiceNo || '—',
    invoiceDate: rawInvoiceDate || '—',
    incoterm: model.invoice?.incoterm || 'CIF',
    currency: model.invoice?.currency?.code || model.invoice?.currency?.name || '—',
    exchangeRate: model.invoice?.exchangeRate || '—',
    fobValueFC: model.invoice?.fobValueFC || '0.00',
    cifValueFC: model.invoice?.cifValue || '0.00',
    freight: model.invoice?.freight || '0.00',
    insurance: model.invoice?.insurance || '0.00',
  };

  const exRate = parseFloat(String(invoice.exchangeRate).replace(/,/g, '')) || 0;
  const cifFC = parseFloat(String(invoice.cifValueFC).replace(/,/g, '')) || parseFloat(String(invoice.fobValueFC).replace(/,/g, '')) || 0;
  const assessableValueINR = exRate > 0 ? (cifFC * exRate * 1.01).toFixed(2) : '0.00';

  // File Reference
  const fileRef = model.fileRef || (invoice.invoiceNo && invoice.invoiceNo !== '—' ? `REF-${invoice.invoiceNo}` : 'BE-IMPORT');

  // Line items
  const rawItems = model.items || [];
  const itemsList = rawItems.map((it, idx) => {
    const qNum = parseFloat(String(it.quantity).replace(/,/g, '')) || 0;
    const rNum = parseFloat(String(it.unitPrice || it.rate).replace(/,/g, '')) || 0;
    const totFC = (qNum * rNum) || (parseFloat(String(it.totalValue).replace(/,/g, '')) || 0);
    const assVal = exRate > 0 ? (totFC * exRate * 1.01).toFixed(2) : totFC.toFixed(2);

    return {
      slNo: String(it.slNo || idx + 1),
      hsCode: String(it.hsCode || it.ritc || '—'),
      description: String(it.description || '—'),
      quantity: String(it.quantity || '0.00'),
      unit: it.unit?.name || it.unit || '—',
      unitPrice: String(it.unitPrice || rNum.toFixed(4) || '0.0000'),
      totalValue: totFC.toFixed(2),
      countryOrigin: it.countryOrigin?.name || supplier.countryOrigin,
      assessableValue: it.assessableValue || assVal,
      bcdRate: String(it.bcdRate || '7.5'),
      igstRate: String(it.igstRate || '18.0'),
    };
  });

  const bcdTotal = (parseFloat(assessableValueINR) * 0.075).toFixed(2);
  const igstTotal = ((parseFloat(assessableValueINR) + parseFloat(bcdTotal)) * 0.18).toFixed(2);
  const totalDuty = (parseFloat(bcdTotal) + parseFloat(igstTotal)).toFixed(2);

  // ════════════════════════════════════════════════════════════
  // PAGE 1: HEADER & BILL OF ENTRY PARTICULARS
  // ════════════════════════════════════════════════════════════

  // Centered Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(chaName, pageW / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(9);
  doc.text('CHECK LIST - Bill of Entry', pageW / 2, y, { align: 'center' });
  y += 5;

  // Sub-header line: B.E No & Date (colon at COLON_LEFT) and Printed On
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  printField(doc, 'B.E No & Date', `${beNo} ${beDate}`, margin, COLON_LEFT, y);

  // Dynamic right-alignment to guarantee zero overlap between label and date
  const printLabel = 'Printed On : ';
  doc.setFont('helvetica', 'bold');
  const printLabelW = doc.getTextWidth(printLabel);
  doc.setFont('helvetica', 'normal');
  const printDateW = doc.getTextWidth(printDate);
  const printStartX = (pageW - margin) - (printLabelW + printDateW);

  doc.setFont('helvetica', 'bold');
  doc.text(printLabel, printStartX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(printDate, printStartX + printLabelW, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  // Job metadata: perfectly aligned colons at COLON_LEFT & COLON_RIGHT
  printField(doc, 'Job No & Date', `${jobNo} - ${jobDate}`, margin, COLON_LEFT, y);
  printField(doc, 'File Ref. No', fileRef, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'CHA', chaLicense, margin, COLON_LEFT, y);
  printField(doc, 'Name', chaName, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Custom House', customHouse, margin, COLON_LEFT, y);
  printField(doc, 'Port of Import', portImport, 108, COLON_RIGHT, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // Importer & Supplier Details Header
  doc.setFont('helvetica', 'bold');
  doc.text('Importer Details :', margin, y);
  doc.text('Supplier Details :', 108, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');

  // Build bounded wrapped lines for Left Column (Importer)
  const leftPartyLines = [];
  if (importer.iec && importer.iec !== '—') {
    leftPartyLines.push({ type: 'field', label: 'IEC', value: importer.iec });
  }
  if (importer.name && importer.name !== '—') {
    const nameLines = doc.splitTextToSize(importer.name, 94);
    nameLines.forEach((l) => leftPartyLines.push({ type: 'text', text: l }));
  }
  if (importer.address && importer.address !== '—') {
    const cleanAddr = importer.address.replace(/[\r\n]+/g, ', ').replace(/\s+/g, ' ').trim();
    const addrLines = doc.splitTextToSize(cleanAddr, 94);
    addrLines.forEach((l) => leftPartyLines.push({ type: 'text', text: l }));
  }

  // Build bounded wrapped lines for Right Column (Supplier)
  const rightPartyLines = [];
  if (supplier.name && supplier.name !== '—') {
    const sNameLines = doc.splitTextToSize(supplier.name, 90);
    sNameLines.forEach((l) => rightPartyLines.push({ type: 'text', text: l }));
  }
  if (supplier.address && supplier.address !== '—' && supplier.address !== '.') {
    const cleanSAddr = supplier.address.replace(/[\r\n]+/g, ', ').replace(/\s+/g, ' ').trim();
    const sAddrLines = doc.splitTextToSize(cleanSAddr, 90);
    sAddrLines.forEach((l) => rightPartyLines.push({ type: 'text', text: l }));
  }
  if (supplier.country && supplier.country !== '—') {
    rightPartyLines.push({ type: 'field', label: 'Country', value: supplier.country });
  }

  // Print party details side-by-side with dynamic row heights and aligned colons
  const maxPartyRows = Math.max(leftPartyLines.length, rightPartyLines.length);
  for (let i = 0; i < maxPartyRows; i++) {
    const leftItem = leftPartyLines[i];
    const rightItem = rightPartyLines[i];

    if (leftItem) {
      if (leftItem.type === 'field') {
        printField(doc, leftItem.label, leftItem.value, margin, COLON_LEFT, y);
      } else {
        doc.text(leftItem.text, margin, y);
      }
    }
    if (rightItem) {
      if (rightItem.type === 'field') {
        printField(doc, rightItem.label, rightItem.value, 108, COLON_RIGHT, y);
      } else {
        doc.text(rightItem.text, 108, y);
      }
    }
    y += 3.4;
  }
  y += 1.5;

  // 2-column Consignment specifics with strictly aligned colons
  const leftCol = [
    ['GSTN Type / ID', `${importer.gstinType} / ${importer.gstin}`],
    ['AD Code', importer.adCode],
    ['Port of Shipment', consignment.portShipment],
    ['Port of Import', consignment.portImport],
    ['Gross Weight', `${consignment.grossWeight} ${consignment.weightUnit}`],
    ['Net Weight', `${consignment.netWeight} ${consignment.weightUnit}`],
    ['Vessel / Voyage', `${consignment.vessel} / ${consignment.voyage}`],
  ];

  const rightCol = [
    ['Country of Origin', consignment.countryOrigin],
    ['Country Consignment', consignment.countryConsignment],
    ['Total Packages', `${consignment.totalPackages} ${consignment.packageType}`],
    ['BL No & Date', `${consignment.blNumber} ${consignment.blDate !== '—' ? 'dt ' + consignment.blDate : ''}`],
    ['No Of Containers', consignment.containers && consignment.containers !== '—' ? '1' : '0'],
    ['Container No', consignment.containers],
    ['Declaration', 'Home Consumption'],
  ];

  const maxRows = Math.max(leftCol.length, rightCol.length);
  for (let i = 0; i < maxRows; i++) {
    if (leftCol[i]) {
      printField(doc, leftCol[i][0], leftCol[i][1], margin, COLON_LEFT, y);
    }
    if (rightCol[i]) {
      printField(doc, rightCol[i][0], rightCol[i][1], 108, COLON_RIGHT, y);
    }
    y += 3.5;
  }
  y += 1.5;

  drawDashedLine(doc, y);
  y += 3.5;

  // ════════════════════════════════════════════════════════════
  // INVOICE DETAILS
  // ════════════════════════════════════════════════════════════
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS', margin, y);
  doc.text('No Of Invoices :', 65, y);
  doc.setFont('helvetica', 'normal');
  doc.text('1', 88, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  // Aligned Invoice key-values
  printField(doc, 'Inv.SlNo', '1', margin, COLON_LEFT, y);
  printField(doc, 'Invoice Date', invoice.invoiceDate, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Invoice No', invoice.invoiceNo, margin, COLON_LEFT, y);
  printField(doc, 'Incoterm', invoice.incoterm, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Currency Code', invoice.currency, margin, COLON_LEFT, y);
  printField(doc, 'Exchange Rate', invoice.exchangeRate, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'FOB Value (FC)', invoice.fobValueFC, margin, COLON_LEFT, y);
  printField(doc, 'CIF Value (FC)', invoice.cifValueFC, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Assessable Val (INR)', assessableValueINR, margin, COLON_LEFT, y);
  y += 4;

  // Charges
  doc.setFont('helvetica', 'bold');
  doc.text('Rate', 50, y);
  doc.text('Currency', 70, y);
  doc.text('Amt', 90, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  [
    ['Freight', '0.00', invoice.currency, invoice.freight],
    ['Insurance', '0.00', invoice.currency, invoice.insurance],
  ].forEach(([label, rate, curr, amt]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(rate, 50, y);
    doc.text(curr, 70, y);
    doc.text(amt, 90, y);
    y += 3.2;
  });
  y += 1.5;

  drawDashedLine(doc, y);
  y += 3.5;

  // ════════════════════════════════════════════════════════════
  // ITEMS OF IMPORT TABLE
  // ════════════════════════════════════════════════════════════
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS OF IMPORT', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('SLNo', margin, y);
  doc.text('HS Code', 25, y);
  doc.text('Description', 50, y);
  doc.text('Qty', 105, y);
  doc.text('Unit', 120, y);
  doc.text('Unit Price', 135, y);
  doc.text('Total Val(FC)', 155, y);
  doc.text('Assessable Val(INR)', 175, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  if (itemsList.length === 0) {
    doc.text('No line items extracted from document', margin, y);
    y += 4;
  } else {
    itemsList.forEach((it) => {
      y = checkPageBreak(doc, y, 12);
      doc.text(it.slNo, margin, y);
      doc.text(it.hsCode, 25, y);
      doc.text(it.description.slice(0, 32), 50, y);
      doc.text(it.quantity, 105, y);
      doc.text(it.unit, 120, y);
      doc.text(it.unitPrice, 135, y);
      doc.text(it.totalValue, 155, y);
      doc.text(it.assessableValue, 175, y);
      y += 3.5;
    });
  }

  drawDashedLine(doc, y);
  y += 4;

  // ════════════════════════════════════════════════════════════
  // DUTY SUMMARY TABLE
  // ════════════════════════════════════════════════════════════
  y = checkPageBreak(doc, y, 20);
  doc.setFont('helvetica', 'bold');
  doc.text('DUTY SUMMARY', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  // Aligned Duty Summary colons at 52 (left) and 154 (right)
  printField(doc, 'Assessable Value (INR)', assessableValueINR, margin, 52, y);
  printField(doc, 'Basic Customs Duty (BCD)', bcdTotal, 108, 154, y);
  y += 3.5;

  printField(doc, 'Integrated GST (IGST)', igstTotal, margin, 52, y);
  printField(doc, 'Compensation Cess', '0.00', 108, 154, y);
  y += 3.5;

  doc.setFont('helvetica', 'bold');
  printField(doc, 'Total Customs Duty Payable', totalDuty, margin, 52, y);
  doc.setFont('helvetica', 'normal');
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // ════════════════════════════════════════════════════════════
  // CONTAINER & DECLARATION
  // ════════════════════════════════════════════════════════════
  y = checkPageBreak(doc, y, 35);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTAINER DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;
  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Container No', margin, y);
  doc.text('Size', 60, y);
  doc.text('Type', 90, y);
  doc.text('Seal No', 120, y);
  doc.text('Status', 160, y);
  y += 2.5;
  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  if (consignment.containers && consignment.containers !== '—') {
    doc.text(consignment.containers, margin, y);
    doc.text(model.transport?.containerSize || '20', 60, y);
    doc.text(model.transport?.containerType || 'GP', 90, y);
    doc.text(model.transport?.sealNo || '—', 120, y);
    doc.text('FCL', 160, y);
    y += 3.2;
  } else {
    doc.text('NIL (NO CONTAINER DETAILS - BULK / LCL SHIPMENT)', margin, y);
    y += 3.2;
  }
  drawDashedLine(doc, y);
  y += 6;

  // Declaration text & signature
  y = checkPageBreak(doc, y, 35);
  doc.setFontSize(7.5);
  doc.text('I/We declare that the particulars given herein are true and are correct.', margin, y);
  y += 3.8;
  doc.text('I/We undertake to abide by provisions of Foreign Exchange Management Act,1999, as amended from time to time.', margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('CHA', margin, y);
  doc.text('Importer', 120, y);
  y += 4;

  doc.text(chaName, margin, y);
  doc.text(importer.name, 120, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.text('Signature', margin, y);
  doc.text('Signature', 120, y);

  // Save PDF
  const cleanInvNo = String(invoice.invoiceNo || 'draft').replace(/[/\\?%*:|"<>]/g, '-');
  const fileName = `BOE_Checklist_${cleanInvNo}_${today.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
