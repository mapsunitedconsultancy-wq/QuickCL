import { val, num, fmtDate, items } from './helpers.js';
import { buildUnifiedModel } from '../output/unifiedModel.js';

/**
 * Builds a structured Shipping Bill checklist model from extracted data.
 * Leverages buildUnifiedModel while maintaining exact structure expected by SB checklist views.
 */
export function buildShippingBillModel(data, cha = {}) {
  const unified = buildUnifiedModel(data, cha, 'SB');

  return {
    docType: 'SHIPPING BILL',
    docSubtitle: 'Export Declaration — Checklist',

    // ─── HEADER ───
    header: {
      chaName: unified.cha.name,
      chaLicense: unified.cha.license,
      jobNo: unified.cha.jobNo,
      jobDate: unified.cha.jobDate,
      customHouse: unified.cha.customHouse.name,
      portLoading: unified.transport.portLoading.name,
      stateOrigin: unified.cha.state.name,
    },

    // ─── EXPORTER (left column) ───
    exporter: {
      iec: unified.party.iec,
      gstin: unified.party.gstin,
      pan: unified.party.pan,
      name: unified.party.name,
      address: unified.party.address,
      adCode: unified.party.adCode,
      type: unified.party.type,
      bankAccount: unified.cha.bankAccount,
      ifsc: unified.cha.ifsc,
      bankName: unified.cha.bankName,
    },

    // ─── CONSIGNEE (right column) ───
    consignee: {
      name: unified.counterparty.name,
      address: unified.counterparty.address,
      country: unified.counterparty.country.name,
    },

    // ─── SHIPMENT ───
    shipment: {
      portDischarge: unified.transport.portDischarge.name,
      countryDischarge: unified.transport.countryDischarge.name,
      portFinalDest: unified.transport.portDischarge.name,
      countryFinalDest: unified.transport.countryDischarge.name,
      totalPackages: unified.pkg.totalPackages,
      packageType: unified.pkg.packageType.name,
      netWeight: unified.pkg.netWeight,
      grossWeight: unified.pkg.grossWeight,
      netWeightUnit: unified.pkg.weightUnit.name,
      containers: unified.transport.containers,
      natureOfCargo: 'C - Container Cargo',
      marks: unified.pkg.marks,
    },

    // ─── INVOICE ───
    invoice: {
      slNo: '1',
      invoiceNo: unified.invoice.number,
      invoiceDate: unified.invoice.date.display,
      natureOfContract: unified.invoice.incoterm,
      naturePayment: unified.invoice.paymentTerms,
      currency: unified.invoice.currency.name,
      exchangeRate: unified.invoice.exchangeRate,
      invoiceValueFC: unified.invoice.invoiceValueFC,
      fobValueFC: unified.invoice.fobValueFC,
      freight: unified.invoice.freight,
      insurance: unified.invoice.insurance,
      commission: unified.invoice.commission,
      discount: unified.invoice.discount,
    },

    // ─── ITEMS OF EXPORT ───
    items: unified.items.map((it) => ({
      slNo: it.slNo,
      ritc: it.ritc,
      description: it.description,
      quantity: it.quantity,
      unit: it.unit.name,
      rate: it.rate,
      valueFC: it.valueFC,
      fobInr: it.fobInr,
      pmv: it.pmv,
      totalPmv: it.totalPmv,
      schemeCode: it.schemeCode,
      scheme: it.scheme,
      endUse: it.endUse,
      reward: it.reward,
      igstStatus: it.igstStatus,
      igstVal: it.igstVal,
      igstAmt: it.igstAmt,
    })),

    // ─── TOTALS ───
    totals: {
      totalQty: unified.totals.qty,
      totalFob: unified.totals.fob,
      totalPmv: unified.totals.pmv,
      totalIgstVal: unified.totals.igstVal,
      totalIgstAmt: unified.totals.igstAmt,
    },

    // ─── RODTEP (sub-section) ───
    rodtep: unified.rodtep.map((r) => ({
      invSl: r.invSl,
      itemSl: r.itemSl,
      tariff: r.tariff,
      rate: r.rate,
      qty: r.qty,
      unit: r.unit.name,
    })),

    // ─── ADDITIONAL ───
    additional: {
      scheme: unified.additional.scheme,
      lutNumber: unified.additional.lutNumber,
      lutDate: unified.additional.lutDate,
      remarks: unified.additional.remarks,
    },
  };
}
