import { val, num, fmtDate, todayDDMMYYYY, items } from '../checklist/helpers.js';
import {
  PORTS,
  COUNTRIES,
  CURRENCIES,
  STATES,
  DISTRICTS,
  PACKAGE_TYPES,
  UNITS,
  resolve,
} from './directories.js';

// ICES date format: YYYYMMDD
export function icesDate(field) {
  const raw = val(field);
  if (!raw) return '';
  const parts = raw.includes('/') ? raw.split('/') : null;
  if (parts && parts.length === 3) return parts[2] + parts[1] + parts[0];
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10).replace(/-/g, '');
  return raw.replace(/[/-]/g, '');
}

/**
 * Builds the single Unified Output Model supporting both:
 * - Human-readable checklist PDF (.name and .display)
 * - Machine-readable ICES .sb / .be file (.code and .ices)
 */
export function buildUnifiedModel(data, cha = {}, docType = 'SB') {
  if (!data) data = {};

  // Extract nested json if wrapped in extracted_json or extractedData
  const ext = data.extracted_json || data.extractedData || {};

  // Merge so we can check both top-level and sub-sections
  const d = {
    ...ext,
    ...data,
    // Keep structured sections accessible
    general_info: data.general_info || ext.general_info || {},
    transport_details: data.transport_details || ext.transport_details || {},
    package_details: data.package_details || ext.package_details || {},
    invoice_details: data.invoice_details || ext.invoice_details || {},
    value_details: data.value_details || ext.value_details || {},
    additional_info: data.additional_info || ext.additional_info || {},
    job: data.job || ext.job || {},
    importer_exporter: data.importer_exporter || ext.importer_exporter || {},
    foreign_party: data.foreign_party || ext.foreign_party || {},
    consignee: data.consignee || ext.consignee || {},
    shipment: data.shipment || ext.shipment || {},
    invoice: data.invoice || ext.invoice || {},
    duty: data.duty || ext.duty || {},
    packing: data.packing || ext.packing || {},
  };

  const rawDocType = String(
    docType ||
    data.doc_type ||
    data.docType ||
    data.extraction_type ||
    data.document_type ||
    ext.doc_type ||
    ext.document_type ||
    ''
  ).toUpperCase().trim();

  const isBoe =
    rawDocType === 'BOE' ||
    rawDocType.startsWith('BOE') ||
    rawDocType.includes('BILL OF ENTRY') ||
    rawDocType.includes('IMPORT') ||
    rawDocType.includes('ENTRY');
  const normalizedDocType = isBoe ? 'BOE' : 'SB';

  const rawItems = items(data);

  // Extract exporter address helper
  const expAddr =
    val(d.general_info?.exporter_address) ||
    val(d.general_info?.importer_address) ||
    [val(d.importer_exporter?.address1), val(d.importer_exporter?.address2)]
      .filter(Boolean)
      .join(', ');

  // Extract foreign address helper
  const foreignAddr =
    val(d.general_info?.importer_address) ||
    val(d.general_info?.exporter_address) ||
    val(d.consignee?.consignee_address) ||
    [val(d.foreign_party?.foreign_address1), val(d.foreign_party?.foreign_address2)]
      .filter(Boolean)
      .join(', ');

  const model = {
    docType: normalizedDocType,
    generatedAt: new Date().toISOString(),
    systemDate: todayDDMMYYYY(),

    sbNo:
      val(d.general_info?.sb_number) ||
      val(d.general_info?.sb_no) ||
      val(d.job?.sb_number) ||
      val(data.sb_no) ||
      val(data.sb_number) ||
      '',
    beNo:
      val(d.general_info?.be_number) ||
      val(d.general_info?.be_no) ||
      val(d.job?.be_number) ||
      val(data.be_no) ||
      val(data.be_number) ||
      '',

    // ─── CHA / FILING PARTY (from profile / settings) ───
    cha: {
      name:
        cha.firmName ||
        val(d.general_info?.cha_name) ||
        val(d.job?.cha_name) ||
        '',
      license:
        cha.chaLicense ||
        val(d.general_info?.cha_license) ||
        val(d.job?.cha_licence_no) ||
        '',
      jobNo:
        cha.jobNo ||
        val(d.job?.job_number) ||
        data.job_number ||
        data.jobNumber ||
        '',
      jobDate:
        fmtDate(d.job?.job_date) ||
        todayDDMMYYYY(),
      customHouse: resolve(
        PORTS,
        cha.customHouse ||
        val(d.transport_details?.custom_house) ||
        val(d.job?.port_name) ||
        val(d.job?.port_code) ||
        val(d.transport_details?.port_of_loading) ||
        'MUNDRA',
        'INMUN1'
      ),
      state: resolve(
        STATES,
        cha.stateName ||
        val(d.importer_exporter?.state_of_origin) ||
        val(d.invoice?.state_code) ||
        'GUJARAT',
        '24'
      ),
      district: resolve(
        DISTRICTS,
        cha.districtName ||
        val(d.invoice?.district_of_origin) ||
        'KACHCHH',
        '449'
      ),
      bankAccount:
        cha.bankAccount ||
        val(d.importer_exporter?.bank_account) ||
        val(d.additional_info?.bank_account) ||
        '',
      ifsc:
        cha.ifsc ||
        val(d.importer_exporter?.ifsc) ||
        val(d.additional_info?.ifsc_code) ||
        '',
      bankName:
        cha.bankName ||
        val(d.importer_exporter?.bank_name) ||
        val(d.additional_info?.bank_name) ||
        '',
    },

    // ─── EXPORTER / IMPORTER (Party) ───
    party: {
      iec:
        val(d.general_info?.iec_code) ||
        val(d.importer_exporter?.iec) ||
        '',
      gstin:
        val(d.general_info?.gstin) ||
        val(d.importer_exporter?.gstin) ||
        '',
      gstinType: val(d.importer_exporter?.gstin_type) || 'GSN',
      pan:
        val(d.general_info?.pan_number) ||
        val(d.importer_exporter?.pan) ||
        '',
      name:
        normalizedDocType === 'BOE'
          ? (val(d.general_info?.importer_name) || val(d.importer_exporter?.name) || '')
          : (val(d.general_info?.exporter_name) || val(d.importer_exporter?.name) || ''),
      address: expAddr,
      adCode:
        val(d.general_info?.ad_code) ||
        val(d.importer_exporter?.ad_code) ||
        '',
      type:
        val(d.general_info?.exporter_type) ||
        val(d.importer_exporter?.exporter_type) ||
        'Manufacturer Exporter',
    },

    // ─── COUNTERPARTY (Consignee for export / Supplier for import) ───
    counterparty: {
      name:
        normalizedDocType === 'BOE'
          ? (val(d.general_info?.exporter_name) || val(d.foreign_party?.foreign_name) || 'OVERSEAS SUPPLIER')
          : (val(d.general_info?.importer_name) || val(d.consignee?.consignee_name) || val(d.foreign_party?.foreign_name) || 'TO THE ORDER OF'),
      address: foreignAddr,
      country: resolve(
        COUNTRIES,
        val(d.transport_details?.country_of_destination) ||
        val(d.transport_details?.country_of_origin) ||
        val(d.foreign_party?.foreign_country) ||
        val(d.shipment?.country_final_dest) ||
        val(d.shipment?.country_origin) ||
        'UNITED ARAB EMIRATES',
        'AE'
      ),
    },

    // ─── TRANSPORT (coded) ───
    transport: {
      portLoading: resolve(
        PORTS,
        val(d.transport_details?.port_of_loading) ||
        val(d.shipment?.port_of_loading) ||
        'MUNDRA',
        'INMUN1'
      ),
      portDischarge: resolve(
        PORTS,
        val(d.transport_details?.port_of_discharge) ||
        val(d.shipment?.port_of_discharge) ||
        'KHOR AL FAKKAN',
        'AEKLF'
      ),
      countryDischarge: resolve(
        COUNTRIES,
        val(d.transport_details?.country_of_destination) ||
        val(d.shipment?.country_final_dest) ||
        'UNITED ARAB EMIRATES',
        'AE'
      ),
      countryOrigin: resolve(
        COUNTRIES,
        val(d.transport_details?.country_of_origin) ||
        val(d.shipment?.country_origin) ||
        (normalizedDocType === 'BOE' ? 'CHINA' : 'INDIA'),
        normalizedDocType === 'BOE' ? 'CN' : 'IN'
      ),
      modeTransport: val(d.transport_details?.mode_of_transport) || val(d.shipment?.cargo_nature) || 'Sea',
      vessel: val(d.transport_details?.vessel_name) || val(d.shipment?.vessel_name) || '',
      voyage: val(d.transport_details?.voyage_number) || val(d.shipment?.voyage_no) || '',
      blNumber: val(d.transport_details?.bl_number) || val(d.shipment?.bl_no) || '',
      blDate: {
        display: fmtDate(d.transport_details?.bl_date || d.shipment?.bl_date),
        ices: icesDate(d.transport_details?.bl_date || d.shipment?.bl_date),
      },
      containers:
        val(d.transport_details?.container_numbers) ||
        (Array.isArray(d.containers) ? d.containers.map((c) => val(c.container_no)).filter(Boolean).join(', ') : '') ||
        val(d.shipment?.no_containers) ||
        '',
      natureOfCargo: 'C',
    },

    // ─── PACKAGE (coded) ───
    pkg: {
      totalPackages:
        val(d.package_details?.total_packages) ||
        val(d.shipment?.total_packages) ||
        '',
      packageType: resolve(
        PACKAGE_TYPES,
        val(d.package_details?.package_type) ||
        val(d.packing?.package_kind) ||
        'BAGS',
        'BGS'
      ),
      netWeight: num(d.package_details?.net_weight || d.shipment?.net_weight),
      grossWeight: num(d.package_details?.gross_weight || d.shipment?.gross_weight),
      weightUnit: resolve(
        UNITS,
        val(d.package_details?.net_weight_unit) ||
        val(d.invoice?.sqc_qty_unit) ||
        'KGS',
        'KGS'
      ),
      marks:
        val(d.package_details?.marks_and_numbers) ||
        val(d.shipment?.marks_numbers) ||
        val(d.packing?.packing_description) ||
        'N/M',
    },

    // ─── INVOICE (coded currency + ICES date) ───
    invoice: {
      slNo: '1',
      number:
        val(d.invoice_details?.invoice_number) ||
        val(d.invoice?.invoice_no) ||
        val(d.invoice?.invoice_number) ||
        val(d.general_info?.invoice_number) ||
        val(data.invoice_no) ||
        val(data.invoice_number) ||
        '',
      date: {
        display: fmtDate(
          d.invoice_details?.invoice_date ||
          d.invoice?.invoice_date ||
          d.general_info?.invoice_date ||
          data.invoice_date ||
          data.invoiceDate ||
          data.date
        ),
        ices: icesDate(
          d.invoice_details?.invoice_date ||
          d.invoice?.invoice_date ||
          d.general_info?.invoice_date ||
          data.invoice_date ||
          data.invoiceDate ||
          data.date
        ),
      },
      currency: resolve(
        CURRENCIES,
        val(d.value_details?.currency) ||
        val(d.invoice?.currency) ||
        'USD',
        'USD'
      ),
      exchangeRate: num(d.value_details?.exchange_rate || d.invoice?.exchange_rate, 4) || '84.0000',
      invoiceValueFC: num(d.value_details?.total_invoice_value || d.invoice?.total_invoice_value_fc),
      fobValueFC: num(d.value_details?.total_fob_value || d.invoice?.fob_value_inr || d.value_details?.total_invoice_value || d.invoice?.total_invoice_value_fc),
      cifValue: num(d.value_details?.cif_value || d.invoice?.cif_value_fc),
      incoterm:
        val(d.value_details?.incoterm) ||
        val(d.invoice?.incoterms) ||
        (normalizedDocType === 'BOE' ? 'CIF' : 'FOB'),
      paymentTerms:
        val(d.value_details?.terms_of_payment) ||
        val(d.invoice?.terms_of_payment) ||
        val(d.consignee?.payment_nature) ||
        'DP',
      freight: num(d.value_details?.freight || d.invoice?.freight) || '0.00',
      insurance: num(d.value_details?.insurance || d.invoice?.insurance) || '0.00',
      commission: '0.00',
      discount: '0.00',
    },

    // ─── LINE ITEMS (coded unit) ───
    items: rawItems.map((it, i) => {
      const ritc = val(it.ritc_code) || val(it.hs_code) || val(it.hsn_code) || '';
      const qty = num(it.quantity);
      const unitRes = resolve(UNITS, val(it.unit) || 'KGS', 'KGS');
      const rate = num(it.rate_per_unit || it.unit_price || it.unit_price_fc, 5);
      const valFC = num(it.value_fc || it.total_value || it.total_value_fc);

      return {
        slNo: val(it.sl_no) || val(it.sr_no) || String(i + 1),
        ritc,
        hsCode: ritc,
        description: val(it.description) || val(it.item_description) || '',
        quantity: qty,
        unit: unitRes,
        rate,
        unitPrice: num(it.unit_price || it.unit_price_fc || it.rate_per_unit, 4),
        valueFC: valFC,
        totalValue: valFC,
        fobInr: num(it.fob_inr || it.fob_value),
        pmv: num(it.pmv || it.pmv_per_unit_inr),
        totalPmv: num(it.total_pmv || it.total_pmv_inr),
        schemeCode: val(it.sch_cd) || val(it.scheme_code) || '50',
        scheme: val(it.scheme) || val(d.invoice?.scheme_description) || 'EPCG AND ADVANCE LICENSE',
        endUse: val(it.end_use) || val(it.end_use_code) || 'GNX100',
        reward: val(it.reward) || val(d.invoice?.reward_claimed) || 'Y',
        igstStatus: val(it.igst_pyt_sts) || val(d.invoice?.igst_payment_status) || 'LUT',
        igstVal: num(it.igst_val || d.invoice?.igst_value) || '0.00',
        igstAmt: num(it.igst_amt || it.igst_rate) || '0.00',
        // BOE specific
        countryOrigin: resolve(
          COUNTRIES,
          val(it.country_of_origin) || val(d.shipment?.country_origin) || 'CHINA',
          'CN'
        ),
        assessableValue: num(it.assessable_value || it.assessable_value_inr),
        bcdRate: val(it.bcd_rate) || '7.5',
        igstRate: val(it.igst_rate) || '18.0',
      };
    }),

    // ─── TOTALS ───
    totals: {
      qty:
        num(d.package_details?.total_quantity) ||
        num(rawItems.reduce((acc, it) => acc + (parseFloat(String(val(it.quantity)).replace(/,/g, '')) || 0), 0)),
      fob: num(d.value_details?.total_fob_value || d.invoice?.fob_value_inr),
      pmv: num(d.value_details?.total_pmv || d.invoice?.total_pmv_inr),
      igstVal: num(d.value_details?.total_igst_val || d.invoice?.igst_value) || '0.00',
      igstAmt: num(d.value_details?.total_igst_amt || d.duty?.igst_amount_inr) || '0.00',
    },

    // ─── RODTEP (sub-section for export) ───
    rodtep: rawItems.map((it, i) => ({
      invSl: '1',
      itemSl: val(it.sl_no) || val(it.sr_no) || String(i + 1),
      tariff: val(it.ritc_code) || val(it.hs_code) || '',
      rate: '0.8',
      qty: num(it.quantity),
      unit: resolve(UNITS, val(it.unit) || 'KGS', 'KGS'),
    })),

    // ─── IMPORT DUTY (BOE only) ───
    duty: {
      assessableValue: num(d.value_details?.cif_value || d.invoice?.assessable_value_inr || d.invoice?.cif_value_fc),
      bcd: num(d.value_details?.bcd || d.duty?.bcd_amount_inr) || '0.00',
      igst: num(d.value_details?.total_igst_amt || d.duty?.igst_amount_inr) || '0.00',
      compCess: num(d.value_details?.comp_cess || d.duty?.comp_cess_inr || d.invoice?.comp_cess_amount) || '0.00',
      totalDuty: num(d.value_details?.total_duty || d.duty?.total_duty) || '0.00',
    },

    // ─── ADDITIONAL ───
    additional: {
      scheme: val(d.additional_info?.scheme_description || d.invoice?.scheme_description),
      lutNumber: val(d.additional_info?.lut_number),
      lutDate: fmtDate(d.additional_info?.lut_date),
      remarks: val(d.additional_info?.remarks),
    },

    // ─── VALIDATION: which coded fields failed to resolve ───
    get missingCodes() {
      const missing = [];
      if (!this.transport.portDischarge.code) missing.push('Port of Discharge');
      if (!this.transport.countryDischarge.code) missing.push('Country of Destination');
      if (!this.cha.customHouse.code) missing.push('Custom House');
      if (!this.invoice.currency.code) missing.push('Currency');
      this.items.forEach((it, i) => {
        if (!it.unit.code) missing.push(`Item ${i + 1} Unit`);
      });
      return missing;
    },
  };

  return model;
}
