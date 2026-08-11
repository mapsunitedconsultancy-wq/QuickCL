export const HSN_DATABASE = [
  {
    code: '39011010',
    description: 'Linear Low Density Polyethylene (LLDPE) Granules in primary forms',
    chapter: 'Chapter 39 (Plastics & Articles)',
    unit: 'KGS',
    bcd: 7.5,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '39012000',
    description: 'Polyethylene having a specific gravity of 0.94 or more (HDPE)',
    chapter: 'Chapter 39 (Plastics & Articles)',
    unit: 'KGS',
    bcd: 7.5,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '39021000',
    description: 'Polypropylene moulding granules in primary forms',
    chapter: 'Chapter 39 (Plastics & Articles)',
    unit: 'KGS',
    bcd: 7.5,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '39092090',
    description: 'Melamine resins in primary forms (other compounds)',
    chapter: 'Chapter 39 (Plastics & Articles)',
    unit: 'KGS',
    bcd: 10.0,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '61091000',
    description: 'T-shirts, singlets and other vests, knitted or crocheted of cotton',
    chapter: 'Chapter 61 (Apparel - Knitted)',
    unit: 'PCS',
    bcd: 20.0,
    sws: 10,
    igst: 12,
    policy: 'Free Export / Drawback 2.1%'
  },
  {
    code: '61102000',
    description: 'Jerseys, pullovers, cardigans, waistcoats of cotton, knitted',
    chapter: 'Chapter 61 (Apparel - Knitted)',
    unit: 'PCS',
    bcd: 20.0,
    sws: 10,
    igst: 12,
    policy: 'Free Export / Drawback 2.1%'
  },
  {
    code: '84713010',
    description: 'Personal computers (laptops, notebooks, palmtops)',
    chapter: 'Chapter 84 (Machinery & Computers)',
    unit: 'NOS',
    bcd: 0.0,
    sws: 0,
    igst: 18,
    policy: 'Restricted Import (Licence Required)'
  },
  {
    code: '85171300',
    description: 'Smartphones for cellular networks',
    chapter: 'Chapter 85 (Electrical & Electronics)',
    unit: 'NOS',
    bcd: 15.0,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '85044090',
    description: 'Static converters (Inverters, UPS systems, Power Supplies)',
    chapter: 'Chapter 85 (Electrical & Electronics)',
    unit: 'NOS',
    bcd: 10.0,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  },
  {
    code: '29022000',
    description: 'Benzene (Pure organic chemical compound)',
    chapter: 'Chapter 29 (Organic Chemicals)',
    unit: 'KGS',
    bcd: 2.5,
    sws: 10,
    igst: 18,
    policy: 'Free Import'
  }
];

export function searchHsnCodes(query = '') {
  if (!query) return HSN_DATABASE;
  const q = query.toLowerCase().trim();
  return HSN_DATABASE.filter(
    (item) =>
      item.code.includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.chapter.toLowerCase().includes(q)
  );
}
