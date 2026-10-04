// ═══ PORT CODES (ICEGATE) — common for Gujarat exports ═══
export const PORTS = {
  'MUNDRA': 'INMUN1',
  'KANDLA': 'INIXY1',
  'DEENDAYAL': 'INIXY1',
  'NHAVA SHEVA': 'INNSA1',
  'JNPT': 'INNSA1',
  'PIPAVAV': 'INPAV1',
  'HAZIRA': 'INHZA1',
  'KHOR AL FAKKAN': 'AEKLF',
  'JEBEL ALI': 'AEJEA',
  'MOGADISHU': 'SOMGQ',
};

// ═══ COUNTRY CODES (ISO 2-letter, ICEGATE uses these) ═══
export const COUNTRIES = {
  'UNITED ARAB EMIRATES': 'AE',
  'U.A.E.': 'AE',
  'UAE': 'AE',
  'SOMALIA': 'SO',
  'SOMAALIA': 'SO',
  'UNITED STATES': 'US',
  'USA': 'US',
  'CHINA': 'CN',
  'SAUDI ARABIA': 'SA',
  'INDIA': 'IN',
  'SINGAPORE': 'SG',
  'KENYA': 'KE',
  'BANGLADESH': 'BD',
  'GERMANY': 'DE',
  'UNITED KINGDOM': 'GB',
  'UK': 'GB',
};

// ═══ CURRENCY CODES ═══
export const CURRENCIES = {
  'USD': 'USD', 'DOLLAR': 'USD', 'US DOLLAR': 'USD',
  'EUR': 'EUR', 'EURO': 'EUR',
  'GBP': 'GBP', 'POUND': 'GBP',
  'AED': 'AED', 'INR': 'INR', 'RUPEE': 'INR',
};

// ═══ STATE CODES (GST state codes) ═══
export const STATES = {
  'GUJARAT': '24',
  'MAHARASHTRA': '27',
  'RAJASTHAN': '08',
  'DELHI': '07',
  'MADHYA PRADESH': '23',
  'TAMIL NADU': '33',
  'KARNATAKA': '29',
  'UTTAR PRADESH': '09',
  'HARYANA': '06',
};

// ═══ DISTRICT CODES (Gujarat) ═══
export const DISTRICTS = {
  'KHEDA': '450',
  'KACHCHH': '449',
  'KUTCH': '449',
  'AHMEDABAD': '451',
  'GANDHINAGAR': '452',
  'RAJKOT': '455',
  'SURAT': '456',
  'VADODARA': '453',
};

// ═══ PACKAGE TYPE CODES ═══
export const PACKAGE_TYPES = {
  'BAGS': 'BGS', 'BAG': 'BGS', 'BGS': 'BGS',
  'CARTONS': 'CTN', 'CARTON': 'CTN', 'CTN': 'CTN',
  'BOXES': 'BOX', 'BOX': 'BOX',
  'DRUMS': 'DRM', 'PALLETS': 'PLT',
  'LOOSE': 'LOS', 'BALES': 'BAL',
};

// ═══ UNIT QUANTITY CODES (UQC) ═══
export const UNITS = {
  'KGS': 'KGS', 'KG': 'KGS', 'KILOGRAM': 'KGS', 'KILOGRAMS': 'KGS',
  'MTS': 'MTS', 'MT': 'MTS', 'TONNES': 'MTS', 'TON': 'MTS',
  'PCS': 'PCS', 'PIECES': 'PCS', 'NOS': 'NOS', 'NUMBERS': 'NOS',
  'LTR': 'LTR', 'LITRE': 'LTR', 'MTR': 'MTR', 'METER': 'MTR',
  'SET': 'SET', 'SETS': 'SET', 'SQM': 'SQM',
};

// ═══ RESOLVER — name → {name, code} ═══
export function resolve(dir, rawName, fallbackCode = '') {
  const name = (rawName || '').toString().trim().toUpperCase();
  if (!name) return { name: '', code: fallbackCode };

  // Direct match
  if (dir[name]) return { name: rawName.trim(), code: dir[name] };

  // Check if raw value already has a code embedded: "KHOR AL FAKKAN-AEKLF" or "INMUN1 - Customs, Mundra"
  const dashSplit = name.split(/[-–,]/);
  if (dashSplit.length >= 2) {
    const firstPart = dashSplit[0].trim();
    const lastPart = dashSplit[dashSplit.length - 1].trim();

    // Check if first part is code (e.g. INMUN1)
    if (Object.values(dir).includes(firstPart)) {
      return { name: lastPart || firstPart, code: firstPart };
    }
    // Check if last part is code (e.g. AEKLF)
    if (Object.values(dir).includes(lastPart)) {
      return { name: firstPart || lastPart, code: lastPart };
    }
    if (dir[firstPart]) return { name: firstPart, code: dir[firstPart] };
    if (dir[lastPart]) return { name: firstPart, code: dir[lastPart] };
    return { name: firstPart, code: lastPart };
  }

  // Partial match (name contains a known key)
  for (const [key, code] of Object.entries(dir)) {
    if (name.includes(key)) return { name: rawName.trim(), code };
  }

  // If the rawName itself is a valid code
  for (const code of Object.values(dir)) {
    if (name === code) return { name: rawName.trim(), code };
  }

  // No match — return name, fallback code
  return { name: rawName.trim(), code: fallbackCode };
}
