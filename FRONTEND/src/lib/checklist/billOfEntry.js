import { val, num, fmtDate, items } from './helpers.js';
import { buildUnifiedModel } from '../output/unifiedModel.js';

/**
 * Builds a structured Bill of Entry checklist model from extracted data.
 */
export function buildBillOfEntryModel(data, cha = {}) {
  const unified = buildUnifiedModel(data, cha, 'BOE');

  return {
    docType: 'BILL OF ENTRY',
    docSubtitle: 'Import Declaration — Checklist',

    header: {
      chaName: unified.cha.name,
      chaLicense: unified.cha.license,
      jobNo: unified.cha.jobNo,
      jobDate: unified.cha.jobDate,
      customHouse: unified.cha.customHouse.name,
      portImport: unified.transport.portDischarge.name,
    },

    // IMPORTER (left)
    importer: {
      iec: unified.party.iec,
      gstin: unified.party.gstin,
      pan: unified.party.pan,
      name: unified.party.name,
      address: unified.party.address,
      adCode: unified.party.adCode,
    },

    // SUPPLIER / EXPORTER (right)
    supplier: {
      name: unified.counterparty.name,
      address: unified.counterparty.address,
      country: unified.counterparty.country.name,
    },

    // CONSIGNMENT
    consignment: {
      countryOrigin: unified.transport.countryOrigin.name,
      countryConsignment: unified.transport.countryOrigin.name,
      portShipment: unified.transport.portLoading.name,
      portImport: unified.transport.portDischarge.name,
      modeTransport: unified.transport.modeTransport || 'Sea',
      vessel: unified.transport.vessel,
      blNumber: unified.transport.blNumber,
      blDate: unified.transport.blDate.display,
      containers: unified.transport.containers,
    },

    // INVOICE
    invoice: {
      invoiceNo: unified.invoice.number,
      invoiceDate: unified.invoice.date.display,
      currency: unified.invoice.currency.name,
      exchangeRate: unified.invoice.exchangeRate,
      incoterm: unified.invoice.incoterm || 'CIF',
      fobValue: unified.invoice.fobValueFC,
      freight: unified.invoice.freight,
      insurance: unified.invoice.insurance,
      cifValue: unified.invoice.cifValue,
    },

    // PACKAGE
    package: {
      totalPackages: unified.pkg.totalPackages,
      packageType: unified.pkg.packageType.name,
      grossWeight: unified.pkg.grossWeight,
      netWeight: unified.pkg.netWeight,
      marks: unified.pkg.marks,
    },

    // ITEMS OF IMPORT
    items: unified.items.map((it) => ({
      slNo: it.slNo,
      hsCode: it.ritc,
      description: it.description,
      quantity: it.quantity,
      unit: it.unit.name,
      unitPrice: it.unitPrice,
      totalValue: it.totalValue,
      countryOrigin: it.countryOrigin.name,
      assessableValue: it.assessableValue,
      bcdRate: it.bcdRate,
      igstRate: it.igstRate,
    })),

    // DUTY SUMMARY
    duty: {
      assessableValue: unified.duty.assessableValue,
      bcd: unified.duty.bcd,
      igst: unified.duty.igst,
      compCess: unified.duty.compCess,
      totalDuty: unified.duty.totalDuty,
    },
  };
}
