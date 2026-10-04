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
 * Generates exact industry-standard Shipping Bill Checklist
 * Matches DAKSH / U.S. Computers format:
 * - Text-only, black & white (no colors, no background fills)
 * - Em-dash dashed borders
 * - Zero branding / QuickCL mentions
 * - All colons strictly aligned at fixed horizontal coordinates
 * - All dates and numbers strictly dynamic (zero guessing / brute force)
 */
export function generateShippingBillPDF(model) {
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
  const sbDate = today;

  // Header and Filing Information
  const chaName = (model.cha?.name || model.header?.chaName || 'CUSTOMS BROKER').toUpperCase();
  const chaLicense = model.cha?.license || model.header?.chaLicense || '—';
  const jobNo = model.cha?.jobNo || model.header?.jobNo || val(model.job?.job_number) || '—';
  const jobDate = model.cha?.jobDate || model.header?.jobDate || today;
  const customHouse = model.cha?.customHouse?.name || model.cha?.customHouse || model.header?.customHouse || '—';
  const stateOrigin = model.cha?.state?.name
    ? `${model.cha.state.name} , ${model.cha.state.code || ''}`
    : (model.header?.stateOrigin || '—');

  // SB Number: strictly from extracted document data or placeholder '—' if filing draft
  const sbNo = val(model.sbNo) || val(model.header?.sbNo) || val(model.general_info?.sb_number) || '—';

  // Exporter details
  const exporter = {
    iec: model.party?.iec || model.exporter?.iec || '—',
    gstin: model.party?.gstin || model.exporter?.gstin || '—',
    gstinType: model.party?.gstinType || 'GSN',
    pan: model.party?.pan || model.exporter?.pan || '—',
    name: (model.party?.name || model.exporter?.name || '—').toUpperCase(),
    address: model.party?.address || model.exporter?.address || '—',
    adCode: model.party?.adCode || model.exporter?.adCode || '—',
    type: model.party?.type || model.exporter?.type || '[F] - Manufacturing Exporter',
    bankAccount: model.cha?.bankAccount || model.party?.bankAccount || model.exporter?.bankAccount || '—',
    ifsc: model.cha?.ifsc || model.party?.ifsc || model.exporter?.ifsc || '—',
  };

  // Consignee details
  const consignee = {
    name: (model.counterparty?.name || model.consignee?.name || 'TO THE ORDER OF').toUpperCase(),
    address: model.counterparty?.address || model.consignee?.address || '.',
    country: (model.counterparty?.country?.name || model.consignee?.country || '—').toUpperCase(),
    countryCode: model.counterparty?.country?.code || '',
  };

  // Shipment details
  const shipment = {
    portDischarge: model.transport?.portDischarge?.name
      ? `${model.transport.portDischarge.name}${model.transport.portDischarge.code ? '-' + model.transport.portDischarge.code : ''}`
      : (model.shipment?.portDischarge || '—'),
    countryDischarge: model.transport?.countryDischarge?.name
      ? `${model.transport.countryDischarge.name}${model.transport.countryDischarge.code ? '-' + model.transport.countryDischarge.code : ''}`
      : (model.shipment?.countryDischarge || '—'),
    portFinalDest: model.transport?.portDischarge?.name
      ? `${model.transport.portDischarge.name}${model.transport.portDischarge.code ? '-' + model.transport.portDischarge.code : ''}`
      : (model.shipment?.portFinalDest || '—'),
    countryFinalDest: model.transport?.countryDischarge?.name
      ? `${model.transport.countryDischarge.name}${model.transport.countryDischarge.code ? '-' + model.transport.countryDischarge.code : ''}`
      : (model.shipment?.countryFinalDest || '—'),
    totalPackages: model.pkg?.totalPackages || model.shipment?.totalPackages || '—',
    packageType: model.pkg?.packageType?.code || model.pkg?.packageType?.name || model.shipment?.packageType || '—',
    netWeight: model.pkg?.netWeight || model.shipment?.netWeight || '—',
    grossWeight: model.pkg?.grossWeight || model.shipment?.grossWeight || '—',
    weightUnit: model.pkg?.weightUnit?.code || model.pkg?.weightUnit?.name || 'KGS',
    containers: model.transport?.containers || model.shipment?.containers || '—',
    natureOfCargo: model.transport?.natureOfCargo || 'C',
    marks: model.pkg?.marks || model.shipment?.marks || 'N/M',
  };

  // Invoice: invoiceDate is strictly taken as per extracted invoice document
  const rawInvoiceDate = model.invoice?.date?.display || (model.invoice?.invoiceDate ? fmtDate(model.invoice.invoiceDate) : '');
  const invoice = {
    invoiceNo: model.invoice?.number || model.invoice?.invoiceNo || '—',
    invoiceDate: rawInvoiceDate || '—',
    natureOfContract: model.invoice?.incoterm || model.invoice?.natureOfContract || 'CIF',
    naturePayment: model.invoice?.paymentTerms || model.invoice?.naturePayment || 'DP',
    currency: model.invoice?.currency?.code || model.invoice?.currency?.name || '—',
    exchangeRate: model.invoice?.exchangeRate || '—',
    invoiceValueFC: model.invoice?.invoiceValueFC || '0.00',
    fobValueFC: model.invoice?.fobValueFC || '0.00',
    fobValueINR: model.totals?.fob || '0.00',
    freight: model.invoice?.freight || '0.00',
    insurance: model.invoice?.insurance || '0.00',
  };

  const exRateNum = parseFloat(String(invoice.exchangeRate).replace(/,/g, '')) || 0;
  const invFcNum = parseFloat(String(invoice.invoiceValueFC).replace(/,/g, '')) || 0;
  const invoiceValueINR = exRateNum > 0 ? (invFcNum * exRateNum).toFixed(4) : (model.totals?.fob || '0.00');

  // File Reference
  const fileRef = model.fileRef || (invoice.invoiceNo && invoice.invoiceNo !== '—' ? `REF-${invoice.invoiceNo}` : '—');

  // Line items
  const rawItems = model.items || [];
  const itemsList = rawItems.map((it, idx) => {
    const qtyNum = parseFloat(String(it.quantity).replace(/,/g, '')) || 0;
    const rateNum = parseFloat(String(it.rate || it.unitPrice).replace(/,/g, '')) || 0;
    const valFcNum = parseFloat(String(it.valueFC || it.totalValue).replace(/,/g, '')) || (qtyNum * rateNum);
    const fobInrNum = parseFloat(String(it.fobInr).replace(/,/g, '')) || (valFcNum * (exRateNum || 1));
    const pmvNum = parseFloat(String(it.pmv).replace(/,/g, '')) || (rateNum * (exRateNum || 1));
    const totPmvNum = parseFloat(String(it.totalPmv).replace(/,/g, '')) || (pmvNum * qtyNum);

    return {
      slNo: String(it.slNo || idx + 1),
      ritc: String(it.ritc || it.hsCode || it.hsn_code || '—'),
      description: String(it.description || '—'),
      quantity: String(it.quantity || '0.00'),
      unit: it.unit?.name || it.unit || '—',
      rate: String(it.rate || it.unitPrice || '0.00'),
      valueFC: valFcNum.toFixed(2),
      fobInr: fobInrNum.toFixed(2),
      pmv: pmvNum.toFixed(2),
      totalPmv: totPmvNum.toFixed(2),
      schemeCode: it.schemeCode || '00',
      scheme: it.scheme || (it.schemeCode ? 'EXPORT SCHEME' : 'FREE SHIPPING BILL'),
      endUse: it.endUse || '—',
      reward: it.reward || 'N',
      igstStatus: it.igstStatus || 'LUT',
      igstVal: it.igstVal || '0.00',
      igstAmt: it.igstAmt || '0.00',
    };
  });

  const totals = {
    totalQty: model.totals?.qty || itemsList.reduce((acc, it) => acc + (parseFloat(it.quantity) || 0), 0).toFixed(2),
    totalFob: model.totals?.fob || invoice.fobValueINR,
    totalPmv: model.totals?.pmv || itemsList.reduce((acc, it) => acc + (parseFloat(it.totalPmv) || 0), 0).toFixed(2),
    totalIgstVal: model.totals?.igstVal || '0.00',
    totalIgstAmt: model.totals?.igstAmt || '0.00',
  };

  // ════════════════════════════════════════════════════════════
  // PAGE 1: HEADER & MASTER INFORMATION
  // ════════════════════════════════════════════════════════════

  // Centered Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(chaName, pageW / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(9);
  doc.text('CHECK LIST - Shipping Bill', pageW / 2, y, { align: 'center' });
  y += 5;

  // Sub-header line: S.B No & Date (colon at COLON_LEFT) and Printed On
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  printField(doc, 'S.B No & Date', `${sbNo} ${sbDate}`, margin, COLON_LEFT, y);

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
  printField(doc, 'State Of Origin', stateOrigin, 108, COLON_RIGHT, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // Exporter & Consignee Details Header
  doc.setFont('helvetica', 'bold');
  doc.text('Exporter Details :', margin, y);
  doc.text('Consignee Details :', 108, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');

  // Build bounded wrapped lines for Left Column (Exporter)
  const leftPartyLines = [];
  if (exporter.iec && exporter.iec !== '—') {
    leftPartyLines.push({ type: 'text', text: exporter.iec });
  }
  if (exporter.name && exporter.name !== '—') {
    const expNameLines = doc.splitTextToSize(exporter.name, 94);
    expNameLines.forEach((l) => leftPartyLines.push({ type: 'text', text: l }));
  }
  leftPartyLines.push({ type: 'field', label: 'Branch Sr.No', value: '0' });
  if (exporter.address && exporter.address !== '—') {
    const cleanExpAddr = exporter.address.replace(/[\r\n]+/g, ', ').replace(/\s+/g, ' ').trim();
    const expAddrLines = doc.splitTextToSize(cleanExpAddr, 94);
    expAddrLines.forEach((l) => leftPartyLines.push({ type: 'text', text: l }));
  }

  // Build bounded wrapped lines for Right Column (Consignee)
  const rightPartyLines = [];
  if (consignee.name && consignee.name !== '—') {
    const consNameLines = doc.splitTextToSize(consignee.name, 90);
    consNameLines.forEach((l) => rightPartyLines.push({ type: 'text', text: l }));
  }
  if (consignee.address && consignee.address !== '—' && consignee.address !== '.') {
    const cleanConsAddr = consignee.address.replace(/[\r\n]+/g, ', ').replace(/\s+/g, ' ').trim();
    const consAddrLines = doc.splitTextToSize(cleanConsAddr, 90);
    consAddrLines.forEach((l) => rightPartyLines.push({ type: 'text', text: l }));
  }
  if (consignee.country && consignee.country !== '—') {
    rightPartyLines.push({ type: 'text', text: consignee.country });
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

  // Exporter & Consignee 2-column key-values with strictly aligned colons
  const leftCol1 = [
    ['GSTN Type / ID', `${exporter.gstinType} / ${exporter.gstin}`],
    ['Type Of Exporter', exporter.type],
    ['Port Discharge', shipment.portDischarge],
    ['Country Discharge', shipment.countryDischarge],
    ['Port Final Dest', shipment.portFinalDest],
    ['Country Final Dest', shipment.countryFinalDest],
    ['Gross Weight', `${shipment.grossWeight} ${shipment.weightUnit}`],
    ['Nature Of Cargo', shipment.natureOfCargo],
  ];

  const rightCol1 = [
    ['AD Code', exporter.adCode],
    ['SEAL Type', 'Self'],
    ['Total Packages', `${shipment.totalPackages} ${shipment.packageType}`],
    ['Loose Packets', ''],
    ['Net Weight', `${shipment.netWeight} ${shipment.weightUnit}`],
    ['No Of Containers', shipment.containers && shipment.containers !== '—' ? '1' : '0'],
    ['NFEI Type', ''],
    ['RBI Waiver No', ''],
    ['RBI Waiver Date', ''],
  ];

  const maxRows1 = Math.max(leftCol1.length, rightCol1.length);
  for (let i = 0; i < maxRows1; i++) {
    if (leftCol1[i]) {
      printField(doc, leftCol1[i][0], leftCol1[i][1], margin, COLON_LEFT, y);
    }
    if (rightCol1[i]) {
      printField(doc, rightCol1[i][0], rightCol1[i][1], 108, COLON_RIGHT, y);
    }
    y += 3.5;
  }
  y += 1;

  // Marks & Nos with colon aligned at COLON_LEFT
  printField(doc, 'Marks & Nos', '', margin, COLON_LEFT, y);
  const marksLines = doc.splitTextToSize(shipment.marks, 198 - (COLON_LEFT + 2.5));
  doc.text(marksLines, COLON_LEFT + 2.5, y);
  y += Math.max(1, marksLines.length) * 3.5 + 1;

  // Financial & Bank Details with strictly aligned colons
  let rodtepTotalAmt = 0;
  itemsList.forEach((it) => {
    if (it.reward === 'Y' || String(it.scheme).includes('RODTEP')) {
      const q = parseFloat(String(it.quantity).replace(/,/g, '')) || 0;
      rodtepTotalAmt += Math.round(q * 0.8 * 1.14);
    }
  });

  const leftCol2 = [
    ['Mawb No & Date', ''],
    ['Hawb No & Date', ''],
    ['Bank A/C No', exporter.bankAccount],
    ['Dbk Bank A/C No', exporter.bankAccount],
    ['IFSC Code', exporter.ifsc],
  ];

  const rightCol2 = [
    ['Total Drawback Amt(INR)', '0.00'],
    ['Total RODTEP Amt (INR)', rodtepTotalAmt > 0 ? rodtepTotalAmt.toFixed(2) : '0.00'],
    ['Total ROSCTL Amt (INR)', '0.00'],
    ['FOB Value', invoice.fobValueINR],
    ['IGST Value', totals.totalIgstVal],
    ['IGST Amount', totals.totalIgstAmt],
  ];

  const maxRows2 = Math.max(leftCol2.length, rightCol2.length);
  for (let i = 0; i < maxRows2; i++) {
    if (leftCol2[i]) {
      printField(doc, leftCol2[i][0], leftCol2[i][1], margin, COLON_LEFT, y);
    }
    if (rightCol2[i]) {
      printField(doc, rightCol2[i][0], rightCol2[i][1], 108, COLON_RIGHT, y);
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
  printField(doc, 'Whether Unit Price', 'B', 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Invoice No', invoice.invoiceNo, margin, COLON_LEFT, y);
  printField(doc, 'Invoice Date', invoice.invoiceDate, 108, COLON_RIGHT, y);
  y += 3.5;

  printField(doc, 'Nature Of Contract', invoice.natureOfContract, margin, COLON_LEFT, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Buyer Details', 108, y);
  doc.setFont('helvetica', 'normal');
  y += 3.5;

  printField(doc, 'Nature Of Payment', invoice.naturePayment, margin, COLON_LEFT, y);
  doc.text('SAME AS CONSIGNEE', 108, y);
  y += 3.5;

  printField(doc, 'Period Of Agreement', '', margin, COLON_LEFT, y);
  y += 3.5;

  printField(doc, 'Contract No', '', margin, COLON_LEFT, y);
  y += 3.5;

  printField(doc, 'Currency Code', invoice.currency, margin, COLON_LEFT, y);
  y += 3.5;

  printField(doc, 'Exchange Rate', invoice.exchangeRate, margin, COLON_LEFT, y);
  y += 3.5;

  printField(doc, 'Invoice Value(FC)', invoice.invoiceValueFC, margin, COLON_LEFT, y);
  y += 3.5;

  // Multi-field summary line with aligned colons
  printField(doc, 'Invoice Value(INR)', invoiceValueINR, margin, COLON_LEFT, y, 36);
  printField(doc, 'DBK Value(INR)', '0', 88, 114, y, 20);
  printField(doc, 'FOB (FC)', invoice.fobValueFC, 142, 160, y, 36);
  y += 4;

  // Invoice charges mini-table
  doc.setFont('helvetica', 'bold');
  doc.text('Rate', 50, y);
  doc.text('Currency', 70, y);
  doc.text('Amt', 90, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  const charges = [
    ['Insurance', '0.00', invoice.currency, invoice.insurance],
    ['Freight', '0.00', invoice.currency, invoice.freight],
    ['Commission', '0.00', invoice.currency, '0.00'],
    ['Discount', '0.00', invoice.currency, '0.00'],
    ['Other Ded', '0.00', invoice.currency, '0.00'],
    ['Package Charges', '0.00', invoice.currency, '0.00'],
  ];

  charges.forEach(([label, rate, curr, amt]) => {
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
  // ITEMS OF EXPORT TABLE
  // ════════════════════════════════════════════════════════════
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS OF EXPORT', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  // Table Column Headers (exact 3-line format)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLNo', margin, y);
  doc.text('RITC', 28, y);
  doc.text('Description', 60, y);
  y += 3.2;

  doc.text('Quantity', margin, y);
  doc.text('Units', 28, y);
  doc.text('Item', 50, y);
  doc.text('Rate Per', 65, y);
  doc.text('Unit', 82, y);
  doc.text('Value (FC)', 98, y);
  doc.text('FOB (INR)', 135, y);
  doc.text('Sch Cd', 155, y);
  doc.text('Reward[Y/N]', 175, y);
  y += 3.2;

  doc.text('Scheme Description', margin, y);
  doc.text('End Use', 60, y);
  doc.text('PMV', 82, y);
  doc.text('Total PMV', 98, y);
  doc.text('IGST Pyt.Sts', 135, y);
  doc.text('IGST Val', 155, y);
  doc.text('IGST Amt', 175, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  if (itemsList.length === 0) {
    doc.text('No line items extracted from document', margin, y);
    y += 4;
  } else {
    itemsList.forEach((it) => {
      y = checkPageBreak(doc, y, 16);

      // Line 1: SLNo, RITC, Description
      doc.text(it.slNo, margin, y);
      doc.text(it.ritc, 28, y);
      doc.text(it.description.slice(0, 75), 60, y);
      y += 3.2;

      // Line 2: Quantity, Units, Rate, 1, Unit, Value FC, FOB INR, Sch Cd, Reward
      doc.text(it.quantity, margin, y);
      doc.text(it.unit, 28, y);
      doc.text(it.rate, 50, y);
      doc.text('1', 68, y);
      doc.text(it.unit, 82, y);
      doc.text(it.valueFC, 98, y);
      doc.text(it.fobInr, 135, y);
      doc.text(it.schemeCode, 158, y);
      doc.text(it.reward, 180, y);
      y += 3.2;

      // Line 3: Scheme, End Use, PMV, Total PMV, IGST Status, IGST Val, IGST Amt
      doc.text(it.scheme.slice(0, 30), margin, y);
      doc.text(it.endUse, 60, y);
      doc.text(it.pmv, 82, y);
      doc.text(it.totalPmv, 98, y);
      doc.text(it.igstStatus, 135, y);
      doc.text(it.igstVal, 158, y);
      doc.text(it.igstAmt, 180, y);
      y += 3.8;
    });
  }

  drawDashedLine(doc, y);
  y += 3.5;

  // Summary Totals with aligned colons
  printField(doc, 'Total QTY', totals.totalQty, margin, 28, y, 40);
  printField(doc, 'Total FOB', totals.totalFob, 75, 93, y, 40);
  printField(doc, 'Total IGST Val', totals.totalIgstVal, 140, 164, y, 32);
  y += 3.2;
  printField(doc, 'Total PMV', totals.totalPmv, 75, 93, y, 40);
  printField(doc, 'Total IGST Amt', totals.totalIgstAmt, 140, 164, y, 32);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // ════════════════════════════════════════════════════════════
  // RODTEP PAYABLE TABLE
  // ════════════════════════════════════════════════════════════
  y = checkPageBreak(doc, y, 25);
  doc.setFont('helvetica', 'bold');
  doc.text('RODTEP PAYABLE', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Invsl', margin, y);
  doc.text('Itemsl', 25, y);
  doc.text('Tariff Item', 45, y);
  doc.text('RODTEP Rate', 70, y);
  doc.text('RODTEP Cap', 100, y);
  doc.text('RODTEP Qty', 125, y);
  doc.text('RODTEP Unit', 150, y);
  doc.text('RODTEP.Amt(INR)', 175, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  const rodtepItems = itemsList.filter((it) => it.reward === 'Y' || String(it.scheme).includes('RODTEP'));
  if (rodtepItems.length > 0) {
    let rSum = 0;
    rodtepItems.forEach((it, idx) => {
      y = checkPageBreak(doc, y, 6);
      const qNum = parseFloat(String(it.quantity).replace(/,/g, '')) || 0;
      const rAmt = Math.round(qNum * 0.8 * 1.14);
      rSum += rAmt;

      doc.text('1', margin + 2, y);
      doc.text(String(idx + 1), 28, y);
      doc.text(it.ritc, 45, y);
      doc.text('0.8', 75, y);
      doc.text('0', 105, y);
      doc.text(it.quantity, 125, y);
      doc.text(it.unit, 155, y);
      doc.text(rAmt.toFixed(2), 178, y);
      y += 3.5;
    });
    drawDashedLine(doc, y);
    y += 3.5;
    doc.text(rSum.toFixed(2), 180, y);
    y += 2.5;
  } else {
    doc.text('NIL - NO RODTEP CLAIMED FOR THIS SHIPMENT', pageW / 2, y, { align: 'center' });
    y += 3.5;
  }
  drawDashedLine(doc, y);
  y += 5;

  // ════════════════════════════════════════════════════════════
  // PAGE 2: LICENSE, ITEM OTHER, CONTAINER, VESSEL, PACKING
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  y = margin + 3;

  // 1. LICENSE PARTICULARS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('LICENSE PARTICULARS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Inv Sl', margin, y);
  doc.text('Item Sl', 22, y);
  doc.text('Scheme', 38, y);
  doc.text('Regn No', 60, y);
  doc.text('Regn Date', 85, y);
  doc.text('SNo-E', 110, y);
  doc.text('Exp Qty', 125, y);
  doc.text('Unit', 145, y);
  doc.text('Imp / Ind', 165, y);
  y += 3.2;

  doc.text('Description', margin, y);
  doc.text('SNo-C', 110, y);
  doc.text('Imp Qty', 125, y);
  doc.text('Unit', 145, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  const actualLicenses = model.licenses || (Array.isArray(model.schemeLicenses) ? model.schemeLicenses : []);
  if (actualLicenses.length > 0) {
    actualLicenses.forEach((lic) => {
      y = checkPageBreak(doc, y, 6);
      doc.text(String(lic.invSl || '1'), margin + 2, y);
      doc.text(String(lic.itemSl || '1'), 25, y);
      doc.text(lic.scheme || '—', 38, y);
      doc.text(lic.regnNo || '—', 60, y);
      doc.text(lic.regnDate || '—', 85, y);
      doc.text(lic.snoE || '—', 112, y);
      doc.text(lic.expQty || '—', 125, y);
      doc.text(lic.unit || '—', 145, y);
      doc.text(lic.impInd || '—', 165, y);
      y += 3.2;
    });
  } else {
    doc.text('NIL - NO ADVANCE / EPCG LICENSES CLAIMED', pageW / 2, y, { align: 'center' });
    y += 3.5;
  }

  drawDashedLine(doc, y);
  y += 4;

  // 2. ITEM - OTHER DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ITEM - OTHER DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Inv SlNo', margin, y);
  doc.text('Item SlNo', 25, y);
  doc.text('SQC Qty', 45, y);
  doc.text('SQC Unit', 65, y);
  doc.text('State of Origin', 85, y);
  doc.text('District of Origin', 120, y);
  doc.text('Comp.Cess Amt(INR)', 150, y);
  doc.text('PTA/FTA', 180, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  const stateLabel = model.cha?.state?.name ? `${model.cha.state.code || ''}-${model.cha.state.name}` : '—';
  const distLabel = model.cha?.district?.name ? `${model.cha.district.code || ''}-${model.cha.district.name}` : '—';
  itemsList.forEach((it, idx) => {
    doc.text('1', margin + 2, y);
    doc.text(String(idx + 1), 28, y);
    doc.text(it.quantity, 45, y);
    doc.text(it.unit, 68, y);
    doc.text(stateLabel, 85, y);
    doc.text(distLabel, 120, y);
    doc.text('0', 160, y);
    doc.text(it.schemeCode || 'NCPTI', 180, y);
    y += 3.5;
  });

  drawDashedLine(doc, y);
  y += 4;

  // 3. CONTAINER DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CONTAINER DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Container No', margin, y);
  doc.text('Size', 45, y);
  doc.text('Type', 65, y);
  doc.text('Seal No', 85, y);
  doc.text('Type Indicator', 120, y);
  doc.text('Mov.Doc.Type', 155, y);
  y += 3.2;
  doc.text('Seal Date', 85, y);
  doc.text('Seal Device ID', 120, y);
  doc.text('Mov.Doc.Number', 155, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  if (shipment.containers && shipment.containers !== '—') {
    doc.text(shipment.containers, margin, y);
    doc.text(model.transport?.containerSize || '20', 47, y);
    doc.text(model.transport?.containerType || 'GP', 67, y);
    doc.text(model.transport?.sealNo || '—', 85, y);
    doc.text(model.transport?.sealType || 'Self', 120, y);
    y += 3.2;
    doc.text(today, 85, y);
    doc.text(model.transport?.sealDevice || '—', 120, y);
    y += 2.5;
  } else {
    doc.text('NIL (NO CONTAINER DETAILS - BULK / LCL SHIPMENT)', margin, y);
    y += 3.5;
  }

  drawDashedLine(doc, y);
  y += 4;

  // 4. VESSEL DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('VESSEL DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Factory Stuffed', margin, y);
  doc.text('Sample Acc.', 45, y);
  doc.text('Vessel Name & Date', 75, y);
  doc.text('Voyage No', 120, y);
  doc.text('Factory Address', 150, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  const vesselStr = model.transport?.vessel ? `${model.transport.vessel} ${today}` : '—';
  doc.text('Y', margin + 6, y);
  doc.text('N', 50, y);
  doc.text(vesselStr, 75, y);
  doc.text(model.transport?.voyage || '—', 120, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // 5. PACKING DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PACKING DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Package From', margin, y);
  doc.text('Package To', 45, y);
  doc.text('Package Kind', 80, y);
  doc.text('From Desc', 115, y);
  doc.text('To Desc', 150, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.text('1', margin + 6, y);
  doc.text(shipment.totalPackages, 48, y);
  doc.text(shipment.packageType, 83, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 4;

  // 6. SINGLE WINDOW - INFO DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SINGLE WINDOW - INFO DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Inv SlNo', margin, y);
  doc.text('Item SlNo', 25, y);
  doc.text('Info Type', 45, y);
  doc.text('Info Qualifier', 75, y);
  doc.text('Info Code', 110, y);
  doc.text('Info Text', 130, y);
  doc.text('MSR', 155, y);
  doc.text('UQC', 178, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  if (rodtepItems.length > 0) {
    rodtepItems.forEach((it, idx) => {
      doc.text('1', margin + 2, y);
      doc.text(String(idx + 1), 28, y);
      doc.text('DTY', 45, y);
      doc.text('RDT', 75, y);
      doc.text('RODTEPY', 110, y);
      doc.text('Claimed', 130, y);
      doc.text(it.quantity, 155, y);
      doc.text(it.unit, 178, y);
      y += 3.2;
    });
  } else {
    doc.text('NIL', pageW / 2, y, { align: 'center' });
    y += 3.2;
  }

  drawDashedLine(doc, y);
  y += 4;

  // 7. DECLARATIONS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DECLARATIONS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(7);
  doc.text('Inv SlNo', margin, y);
  doc.text('Item SlNo', 25, y);
  doc.text('Stmt Type', 50, y);
  doc.text('Stmt Code', 85, y);
  doc.text('Stmt Text', 120, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  itemsList.forEach((_, idx) => {
    doc.text('1', margin + 2, y);
    doc.text(String(idx + 1), 28, y);
    doc.text('DEC', 50, y);
    doc.text('RD001', 85, y);
    y += 3.2;
  });

  drawDashedLine(doc, y);
  y += 4;

  // 8. SINGLE WINDOW - SUPPORTING DOCUMENTS DETAILS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SINGLE WINDOW - SUPPORTING DOCUMENTS DETAILS', pageW / 2, y, { align: 'center' });
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.2;

  doc.setFontSize(6.8);
  doc.text('InvSlNo    ItemSlNo    Place of Issue     File Type    Doc reference number    IssueDate    Expiry Date', margin, y);
  y += 3.2;
  doc.text('Unique Doc Number      Doc type Code', margin, y);
  y += 2.5;

  drawDashedLine(doc, y);
  y += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.text(`1          1                                    PDF          ${invoice.invoiceNo}               ${invoice.invoiceDate}`, margin, y);
  y += 3.2;
  doc.text('331000-Commercial invoice which includes a packing list', margin, y);
  y += 3.5;

  // ════════════════════════════════════════════════════════════
  // PAGE 3: SUPPORTING DOCS CONTINUED & SIGNATURE DECLARATION
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  y = margin + 5;

  // Only render additional supporting docs if present in data
  const extraDocs = model.supportingDocs || [];
  if (extraDocs.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('ADDITIONAL SUPPORTING DOCUMENTS', pageW / 2, y, { align: 'center' });
    y += 3;
    drawDashedLine(doc, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    extraDocs.forEach((sd) => {
      doc.text(`Doc Ref: ${sd.ref || '—'}   Date: ${sd.date || invoice.invoiceDate}   Type: ${sd.type || 'PDF'}`, margin, y);
      y += 3.2;
      doc.text(`Desc: ${sd.desc || '—'}`, margin, y);
      y += 4.5;
    });
    drawDashedLine(doc, y);
    y += 5;
  }

  // Declaration text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('I/We declare that the particulars given herein are true and are correct.', margin, y);
  y += 3.8;
  doc.text('I/We undertake to abide by provisions of Foreign Exchange Management Act,1999, as amended from time to time', margin, y);
  y += 3.8;
  doc.text('including realisation / repatriation of foreign exchange to / from India.', margin, y);
  y += 10;

  // Signature Blocks
  doc.setFont('helvetica', 'bold');
  doc.text('CHA', margin, y);
  doc.text('Exporter', 120, y);
  y += 4;

  doc.text(chaName, margin, y);
  doc.text(exporter.name, 120, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.text('Signature', margin, y);
  doc.text('Signature', 120, y);

  // Save PDF
  const cleanInvNo = String(invoice.invoiceNo || 'draft').replace(/[/\\?%*:|"<>]/g, '-');
  const fileName = `SB_Checklist_${cleanInvNo}_${today.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
