export const SAMPLE_EXTRACTION_1 = {
  id: 'job-1001',
  jobNo: 'INKND1-BOE-882910',
  jobDate: '2026-07-28',
  type: 'BOE',
  clientId: 'client-00',
  clientName: 'Kutch Chemical & Petrochem Industries Pvt Ltd',
  iec: '2408019921',
  gstin: '24AAACK9912A1Z4',
  portCode: 'INKND1',
  portName: 'Deendayal Port Authority (Kandla Port)',
  status: 'In Review',
  accuracyScore: 96.4,
  totalFields: 132,
  greenCount: 122,
  amberCount: 8,
  redCount: 2,
  uploadedDocs: {
    commercialInvoice: { name: 'CI_KutchPetro_2026_9921.pdf', size: '1.4 MB', type: 'application/pdf' },
    packingList: { name: 'PL_KutchPetro_2026_9921.pdf', size: '890 KB', type: 'application/pdf' },
    billOfLading: { name: 'BL_KANDLA_MAEU9821034.pdf', size: '1.1 MB', type: 'application/pdf' }
  },
  sections: {
    headerInfo: [
      { key: 'jobNo', label: 'Job Number', value: 'INKND1-BOE-882910', sourceDoc: 'Inferred', confidence: 99 },
      { key: 'jobDate', label: 'Job Date', value: '2026-07-28', sourceDoc: 'Inferred', confidence: 99 },
      { key: 'chaLicence', label: 'CHA Licence No', value: '11/1892/KND', sourceDoc: 'Inferred', confidence: 98 },
      { key: 'portCode', label: 'Port Code', value: 'INKND1 (Kandla Port)', sourceDoc: 'Bill of Lading', confidence: 98 }
    ],
    sellerInfo: [
      { key: 'sellerName', label: 'Supplier Name', value: 'Gulf Petrochemicals FZE', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'sellerAddress', label: 'Supplier Address', value: 'Jebel Ali Free Zone, Plot 2910, Dubai, UAE', sourceDoc: 'Commercial Invoice', confidence: 95 },
      { key: 'sellerCountry', label: 'Country of Export', value: 'AE (United Arab Emirates)', sourceDoc: 'Certificate of Origin', confidence: 98 }
    ],
    buyerInfo: [
      { key: 'iec', label: 'IEC Code', value: '2408019921', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'importerName', label: 'Importer Name', value: 'Kutch Chemical & Petrochem Industries Pvt Ltd', sourceDoc: 'Commercial Invoice', confidence: 97 },
      { key: 'gstin', label: 'GSTIN', value: '24AAACK9912A1Z4', sourceDoc: 'Commercial Invoice', confidence: 96 },
      { key: 'address', label: 'Address', value: 'Plot 104, GIDC Industrial Estate, Sector 12, Gandhidham - 370201, Kutch, Gujarat', sourceDoc: 'Commercial Invoice', confidence: 95 }
    ],
    shippingInfo: [
      { key: 'vesselName', label: 'Vessel Name', value: 'MT KANDLA STAR', sourceDoc: 'Bill of Lading', confidence: 98 },
      { key: 'voyageNo', label: 'Voyage No', value: 'KD2026-08', sourceDoc: 'Bill of Lading', confidence: 97 },
      { key: 'portOfLoading', label: 'Port of Loading', value: 'AEJEA (Jebel Ali, Dubai)', sourceDoc: 'Bill of Lading', confidence: 98 },
      { key: 'blNumber', label: 'Bill of Lading No', value: 'MAEU9821034', sourceDoc: 'Bill of Lading', confidence: 99 },
      { key: 'blDate', label: 'BL Issue Date', value: '2026-07-20', sourceDoc: 'Bill of Lading', confidence: 97 },
      { key: 'containerNo', label: 'Container Numbers', value: 'MSKU4092184 / MSKU4092190', sourceDoc: 'Bill of Lading', confidence: 96 }
    ],
    itemDetails: [
      { key: 'invoiceNo', label: 'Invoice No', value: 'INV-KND-9921', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'invoiceDate', label: 'Invoice Date', value: '2026-07-18', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'currency', label: 'Currency', value: 'USD', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'itemDescription', label: 'Item Description', value: 'Linear Low Density Polyethylene (LLDPE) Granules Grade 1020', sourceDoc: 'Commercial Invoice', confidence: 96 },
      { key: 'hsnCode', label: '8-Digit HSN Code', value: '39011010', sourceDoc: 'Tariff Recommender', confidence: 98 },
      { key: 'quantity', label: 'Quantity & Unit', value: '25,000.00 KGS', sourceDoc: 'Commercial Invoice', confidence: 97 },
      { key: 'unitPrice', label: 'Unit Price', value: 'USD 1.50 / KG', sourceDoc: 'Commercial Invoice', confidence: 96 },
      { key: 'bcdRate', label: 'Basic Customs Duty (BCD)', value: '7.5%', sourceDoc: 'Tariff Schedule', confidence: 98 },
      { key: 'swsRate', label: 'Social Welfare Surcharge (SWS)', value: '10% on BCD', sourceDoc: 'Tariff Schedule', confidence: 98 },
      { key: 'igstRate', label: 'Integrated GST (IGST)', value: '18.0%', sourceDoc: 'Tariff Schedule', confidence: 98 }
    ],
    valuationInfo: [
      { key: 'invoiceVal', label: 'Total Invoice Value', value: 'USD 62,500.00', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'exchangeRate', label: 'Customs Exchange Rate', value: 'INR 83.50 / USD', sourceDoc: 'Inferred', confidence: 96 },
      { key: 'assessableValInr', label: 'Total Assessable Value (INR)', value: 'INR 5,218,750.00', sourceDoc: 'Inferred', confidence: 95 },
      { key: 'totalDutyPayable', label: 'Total Customs Duty Payable', value: 'INR 1,517,390.63', sourceDoc: 'Inferred', confidence: 95 }
    ]
  },
  auditTrail: [
    {
      id: 'log-1',
      timestamp: '14:32:10',
      user: 'Ramesh K. (Senior Typist)',
      fieldLabel: 'Supplier Address',
      oldValue: 'Jebel Ali, Dubai',
      newValue: 'Jebel Ali Free Zone, Plot 2910, Dubai, UAE'
    }
  ]
};

export const SAMPLE_EXTRACTION_2 = {
  id: 'job-1002',
  jobNo: 'INMAA1-SB-409122',
  jobDate: '2026-07-29',
  type: 'SB',
  clientId: 'client-02',
  clientName: 'Tirupur TexCraft Global Exports Ltd',
  iec: '3209018890',
  gstin: '33AABCT9981G1Z3',
  portCode: 'INMAA1',
  portName: 'Chennai Sea Port',
  status: 'Verified',
  accuracyScore: 97.8,
  totalFields: 128,
  greenCount: 122,
  amberCount: 5,
  redCount: 1,
  uploadedDocs: {
    commercialInvoice: { name: 'EXP_INV_TTG_8810.pdf', size: '1.2 MB', type: 'application/pdf' },
    packingList: { name: 'EXP_PL_TTG_8810.pdf', size: '750 KB', type: 'application/pdf' },
    billOfLading: { name: 'EXP_BL_HAPAG_3310.pdf', size: '920 KB', type: 'application/pdf' }
  },
  sections: {
    headerInfo: [
      { key: 'jobNo', label: 'Job Number', value: 'INMAA1-SB-409122', sourceDoc: 'Inferred', confidence: 99 },
      { key: 'jobDate', label: 'Job Date', value: '2026-07-29', sourceDoc: 'Inferred', confidence: 99 },
      { key: 'chaLicence', label: 'CHA Licence No', value: '11/1892/MUM', sourceDoc: 'Inferred', confidence: 98 },
      { key: 'portCode', label: 'Port of Export Code', value: 'INMAA1 (Chennai)', sourceDoc: 'Bill of Lading', confidence: 98 }
    ],
    sellerInfo: [
      { key: 'exporterName', label: 'Exporter Name', value: 'Tirupur TexCraft Global Exports Ltd', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'iec', label: 'IEC Code', value: '3209018890', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'gstin', label: 'GSTIN', value: '33AABCT9981G1Z3', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'adCode', label: 'AD Bank Code', value: '02100881290 (State Bank of India)', sourceDoc: 'Commercial Invoice', confidence: 95 }
    ],
    buyerInfo: [
      { key: 'buyerName', label: 'Foreign Buyer Name', value: 'Hamburg Fashion Haus GmbH', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'buyerAddress', label: 'Buyer Address', value: 'Mönckebergstraße 18, 20095 Hamburg, Germany', sourceDoc: 'Commercial Invoice', confidence: 96 },
      { key: 'buyerCountry', label: 'Destination Country', value: 'DE (Germany)', sourceDoc: 'Bill of Lading', confidence: 99 }
    ],
    shippingInfo: [
      { key: 'vesselName', label: 'Vessel Name', value: 'HAPAG LLOYD EXPRESS', sourceDoc: 'Bill of Lading', confidence: 98 },
      { key: 'voyageNo', label: 'Voyage No', value: 'E4091', sourceDoc: 'Bill of Lading', confidence: 97 },
      { key: 'portOfLoading', label: 'Port of Loading', value: 'INMAA1 (Chennai)', sourceDoc: 'Bill of Lading', confidence: 99 },
      { key: 'portOfDischarge', label: 'Port of Discharge', value: 'DEHAM (Hamburg)', sourceDoc: 'Bill of Lading', confidence: 98 },
      { key: 'containerNo', label: 'Container Number', value: 'HLXU2091823', sourceDoc: 'Bill of Lading', confidence: 98 }
    ],
    itemDetails: [
      { key: 'invoiceNo', label: 'Export Invoice No', value: 'EXP-8810-2026', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'currency', label: 'Currency', value: 'EUR', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'itemDescription', label: 'Goods Description', value: '100% Combed Cotton Knitted T-Shirts for Men', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'hsnCode', label: '8-Digit HSN Code', value: '61091000', sourceDoc: 'Tariff Schedule', confidence: 99 },
      { key: 'quantity', label: 'Quantity & Unit', value: '12,000 PCS', sourceDoc: 'Commercial Invoice', confidence: 98 },
      { key: 'unitPrice', label: 'Unit Price', value: 'EUR 4.00 / PC', sourceDoc: 'Commercial Invoice', confidence: 98 }
    ],
    valuationInfo: [
      { key: 'totalInvoiceVal', label: 'Total Invoice Value', value: 'EUR 48,000.00', sourceDoc: 'Commercial Invoice', confidence: 99 },
      { key: 'exchangeRate', label: 'Exchange Rate', value: 'INR 90.20 / EUR', sourceDoc: 'Inferred', confidence: 95 },
      { key: 'fobValInr', label: 'Total FOB Value (INR)', value: 'INR 4,329,600.00', sourceDoc: 'Inferred', confidence: 97 },
      { key: 'drawbackAmount', label: 'Duty Drawback (DBK 2.1%)', value: 'INR 90,921.60', sourceDoc: 'Inferred', confidence: 95 },
      { key: 'rodtepAmount', label: 'RoDTEP Benefit (2.5%)', value: 'INR 108,240.00', sourceDoc: 'Inferred', confidence: 95 }
    ]
  },
  auditTrail: []
};

export const INITIAL_CLIENTS = [
  {
    id: 'client-00',
    name: 'Kutch Chemical & Petrochem Industries Pvt Ltd',
    iec: '2408019921',
    gstin: '24AAACK9912A1Z4',
    adCode: '0210088',
    branchCode: '001',
    portOfRegistration: 'INKND1 (Deendayal Port Authority, Kandla)',
    address: 'Plot 104, GIDC Industrial Estate, Sector 12',
    city: 'Gandhidham',
    state: 'Gujarat (Kutch)',
    pincode: '370201',
    bankName: 'State Bank of India, Main Branch Gandhidham',
    accountNumber: '382901182390',
    ifsc: 'SBIN0000382'
  },
  {
    id: 'client-01',
    name: 'Astra Polymer Solutions India Pvt Ltd',
    iec: '0308012345',
    gstin: '27AAACA1234H1Z0',
    adCode: '0210012',
    branchCode: '001',
    portOfRegistration: 'INKND1 (Deendayal Port Authority, Kandla)',
    address: 'Plot C-14, MIDC Industrial Area, TTC Area',
    city: 'Gandhidham Branch',
    state: 'Gujarat',
    pincode: '370201',
    bankName: 'HDFC Bank Ltd, Gandhidham Branch',
    accountNumber: '50200012901823',
    ifsc: 'HDFC0000060'
  },
  {
    id: 'client-02',
    name: 'Tirupur TexCraft Global Exports Ltd',
    iec: '3209018890',
    gstin: '33AABCT9981G1Z3',
    adCode: '02100881290',
    branchCode: '002',
    portOfRegistration: 'INMAA1 (Chennai)',
    address: '144/2 Avinashi Road, Near Rayapuram Flyover',
    city: 'Tirupur',
    state: 'Tamil Nadu',
    pincode: '641602',
    bankName: 'State Bank of India, Commercial Branch',
    accountNumber: '331008821901',
    ifsc: 'SBIN0000921'
  },
  {
    id: 'client-03',
    name: 'Synergy Electronics Manufacturing Pvt Ltd',
    iec: '0512098432',
    gstin: '07AABCS9912E1Z8',
    adCode: '0330092',
    branchCode: '001',
    portOfRegistration: 'INDEL4 (ICD Tughlakabad)',
    address: 'Phase-II Industrial Area, Okhla',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    bankName: 'ICICI Bank Ltd',
    accountNumber: '000705001290',
    ifsc: 'ICIC0000007'
  }
];
