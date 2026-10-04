const P = '|';

export function generateICESBillOfEntry(model) {
  const L = [];

  // ═══ BE_HEADER ═══
  L.push([
    'BE',
    model.cha.license,
    model.cha.customHouse.code,
    model.generatedAt.slice(0, 10).replace(/-/g, ''),
    '1',
  ].join(P));

  // ═══ BE_MASTER (importer + consignment) ═══
  L.push([
    'MASTER',
    model.party.iec,
    model.party.gstinType,
    model.party.gstin,
    model.party.name,
    model.party.address,
    model.party.adCode,
    model.counterparty.name, // supplier
    model.counterparty.address,
    model.transport.countryOrigin.code, // ← country of origin code
    model.transport.portLoading.code, // port of shipment
    model.transport.portDischarge.code, // port of import
    model.transport.vessel,
    model.transport.blNumber,
    model.transport.blDate.ices,
    model.pkg.totalPackages,
    model.pkg.packageType.code,
    model.pkg.grossWeight,
    model.pkg.weightUnit.code,
    model.pkg.netWeight,
    model.pkg.weightUnit.code,
  ].join(P));

  // ═══ BE_INVOICE ═══
  L.push([
    'INVOICE',
    '1',
    model.invoice.number,
    model.invoice.date.ices,
    model.invoice.currency.code,
    model.invoice.exchangeRate,
    model.invoice.incoterm, // CIF typical for imports
    model.invoice.fobValueFC,
    model.invoice.freight,
    model.invoice.insurance,
  ].join(P));

  // ═══ BE_ITEM (one per line) ═══
  model.items.forEach((it) => {
    L.push([
      'ITEM',
      '1',
      it.slNo,
      it.ritc, // HS code
      it.description,
      it.quantity,
      it.unit.code,
      it.unitPrice,
      it.totalValue,
      it.countryOrigin.code, // ← origin per item
    ].join(P));
  });

  // ═══ BE_DUTY ═══
  L.push([
    'DUTY',
    model.duty.assessableValue,
    model.duty.bcd,
    model.duty.igst,
    model.duty.compCess,
    model.duty.totalDuty,
  ].join(P));

  // ═══ BE_CONTAINER ═══
  if (model.transport.containers) {
    model.transport.containers
      .split(/[,;\s]+/)
      .filter(Boolean)
      .forEach((c) => {
        L.push(['CONTAINER', c.trim(), '20', 'GP'].join(P));
      });
  }

  // ═══ BE_TRAILER ═══
  L.push(['TRAILER', String(L.length + 1), '1'].join(P));

  return L.join('\n');
}

export function downloadICESBillOfEntry(model) {
  if (model.missingCodes && model.missingCodes.length > 0) {
    alert(
      'Cannot generate .be file — missing codes for: ' +
        model.missingCodes.join(', ') +
        '. Fix these first.'
    );
    return false;
  }

  const content = generateICESBillOfEntry(model);
  const blob = new Blob([content], { type: 'text/plain;charset=ascii' });
  const cleanInv = String(model.invoice.number || 'draft').replace(/[/\\?%*:|"<>]/g, '-');
  const fname = `BE_${cleanInv}_${model.generatedAt.slice(0, 10)}.be`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fname;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
  return true;
}
