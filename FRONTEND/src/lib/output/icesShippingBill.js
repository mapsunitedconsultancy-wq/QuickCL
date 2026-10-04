const P = '|'; // ICES delimiter

export function generateICESShippingBill(model) {
  const L = [];

  // ═══ SB_HEADER ═══
  L.push([
    'SB',
    model.cha.license,
    model.cha.customHouse.code,
    model.generatedAt.slice(0, 10).replace(/-/g, ''),
    '1',
  ].join(P));

  // ═══ SB_MASTER (exporter + shipment) ═══
  L.push([
    'MASTER',
    model.party.iec,
    '0', // branch sr no
    model.cha.customHouse.code,
    model.party.gstinType,
    model.party.gstin,
    model.party.name,
    model.party.address,
    model.party.adCode,
    model.party.type,
    model.counterparty.name,
    model.counterparty.address,
    model.counterparty.country.code, // ← .code not .name
    model.transport.portDischarge.code, // ← AEKLF
    model.transport.countryDischarge.code, // ← AE
    model.transport.portDischarge.code, // final dest
    model.transport.countryDischarge.code,
    model.pkg.totalPackages,
    model.pkg.packageType.code, // ← BGS
    model.pkg.netWeight,
    model.pkg.weightUnit.code, // ← KGS
    model.pkg.grossWeight,
    model.pkg.weightUnit.code,
    model.transport.natureOfCargo, // C
    model.cha.state.code, // ← 24
    'SELF', // seal type
    model.pkg.marks,
  ].join(P));

  // ═══ SB_INVOICE ═══
  L.push([
    'INVOICE',
    model.invoice.slNo,
    model.invoice.number,
    model.invoice.date.ices, // ← YYYYMMDD
    model.invoice.currency.code, // ← USD
    model.invoice.exchangeRate,
    model.invoice.invoiceValueFC,
    model.invoice.fobValueFC,
    model.invoice.incoterm,
    model.invoice.paymentTerms,
  ].join(P));

  // ═══ SB_INVOICE_TERMS ═══
  [
    ['FREIGHT', model.invoice.freight],
    ['INSURANCE', model.invoice.insurance],
    ['COMMISSION', model.invoice.commission],
    ['DISCOUNT', model.invoice.discount],
  ].forEach(([t, amt]) => {
    L.push([
      'TERM',
      model.invoice.slNo,
      t,
      model.invoice.currency.code,
      amt,
    ].join(P));
  });

  // ═══ SB_ITEM (one per line) ═══
  model.items.forEach((it) => {
    L.push([
      'ITEM',
      model.invoice.slNo,
      it.slNo,
      it.ritc, // RITC/HS code as-is
      it.description,
      it.quantity,
      it.unit.code, // ← KGS
      it.rate,
      '1', // rate per
      it.unit.code,
      it.valueFC,
      it.fobInr,
      it.schemeCode,
      it.scheme,
      it.endUse,
      it.reward,
      it.pmv,
      it.totalPmv,
      it.igstStatus,
      it.igstVal,
      it.igstAmt,
    ].join(P));

    // SB_ITEM_QTY (state/district of origin)
    L.push([
      'ITEMQTY',
      model.invoice.slNo,
      it.slNo,
      it.quantity,
      it.unit.code,
      model.cha.state.code, // ← 24
      model.cha.district.code, // ← 449/450
      '0', // comp cess
      'NCPTI',
    ].join(P));

    // SB_ITEM_RODTEP
    L.push([
      'RODTEP',
      model.invoice.slNo,
      it.slNo,
      it.ritc,
      '0.8',
      '0',
      it.quantity,
      it.unit.code,
    ].join(P));
  });

  // ═══ SB_CONTAINER ═══
  if (model.transport.containers) {
    model.transport.containers
      .split(/[,;\s]+/)
      .filter(Boolean)
      .forEach((c) => {
        L.push(['CONTAINER', c.trim(), '20', 'GP', '', 'BTSL'].join(P));
      });
  }

  // ═══ SB_TRAILER ═══
  L.push(['TRAILER', String(L.length + 1), '1'].join(P));

  return L.join('\n');
}

export function downloadICESShippingBill(model) {
  // Block download if mandatory codes are missing
  if (model.missingCodes && model.missingCodes.length > 0) {
    alert(
      'Cannot generate .sb file — missing codes for: ' +
        model.missingCodes.join(', ') +
        '. Please fix these fields first.'
    );
    return false;
  }

  const content = generateICESShippingBill(model);
  const blob = new Blob([content], { type: 'text/plain;charset=ascii' });
  const cleanInv = String(model.invoice.number || 'draft').replace(/[/\\?%*:|"<>]/g, '-');
  const fname = `SB_${cleanInv}_${model.generatedAt.slice(0, 10)}.sb`;
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
