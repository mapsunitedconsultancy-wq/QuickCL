-- ═══ TABLE 1: users ═══
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  cha_licence_no TEXT,
  gcard_holder TEXT,
  phone TEXT NOT NULL,
  plan TEXT DEFAULT 'demo' CHECK (plan IN ('demo','starter','pro','enterprise')),
  extractions_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ TABLE 2: clients (Client Master) ═══
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  iec_code TEXT, gstin TEXT, pan TEXT, ad_code TEXT,
  bank_account TEXT, drawback_account TEXT, ifsc_code TEXT,
  bank_name TEXT, state_of_origin TEXT, exporter_type TEXT,
  address_line1 TEXT, address_line2 TEXT,
  default_port_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ TABLE 3: extractions (main job records) ═══
CREATE TABLE extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  job_number TEXT NOT NULL,
  job_date DATE DEFAULT CURRENT_DATE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('BOE','SB')),
  port_code TEXT, port_name TEXT, file_reference TEXT,
  status TEXT DEFAULT 'processing'
    CHECK (status IN ('processing','completed','review','error')),
  accuracy_score DECIMAL(5,2),
  extraction_time_ms INTEGER,
  raw_ocr_text JSONB,
  extracted_json JSONB NOT NULL,
  invoice_doc_url TEXT, packing_doc_url TEXT, bl_doc_url TEXT,
  coo_doc_url TEXT, licence_doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ TABLE 4: extraction_items (line items per job) ═══
CREATE TABLE extraction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_id UUID NOT NULL REFERENCES extractions(id) ON DELETE CASCADE,
  sr_no INTEGER NOT NULL,
  item_description TEXT NOT NULL,
  hs_code TEXT, ritc_code TEXT,
  quantity DECIMAL(15,3), unit TEXT,
  unit_price DECIMAL(15,4),
  total_value DECIMAL(15,2), fob_value DECIMAL(15,2),
  assessable_value_inr DECIMAL(15,2),
  country_of_origin TEXT,
  bcd_rate TEXT, sws_rate TEXT, igst_rate TEXT, comp_cess_rate TEXT,
  exemption_notification TEXT, end_use_code TEXT,
  confidence_score DECIMAL(3,2),
  ai_suggested_hs JSONB DEFAULT '[]',
  user_confirmed_hs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ TABLE 5: hs_codes (12,000+ tariff entries) ═══
CREATE TABLE hs_codes (
  id SERIAL PRIMARY KEY,
  hs_code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  chapter INTEGER, heading INTEGER,
  bcd_rate TEXT, sws_rate TEXT, igst_rate TEXT,
  comp_cess TEXT, unit TEXT, policy_condition TEXT,
  search_vector TSVECTOR
);


-- Full-text search index
CREATE INDEX idx_hs_search ON hs_codes USING GIN(search_vector);

-- Fuzzy search support
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_hs_trgm ON hs_codes USING GIN(description gin_trgm_ops);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION update_hs_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.hs_code,'') || ' ' || COALESCE(NEW.description,''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hs_search BEFORE INSERT OR UPDATE ON hs_codes
FOR EACH ROW EXECUTE FUNCTION update_hs_search_vector();

-- Fuzzy search function
CREATE OR REPLACE FUNCTION fuzzy_hs_search(search_term TEXT)
RETURNS TABLE (hs_code TEXT, description TEXT, bcd_rate TEXT,
  igst_rate TEXT, similarity REAL) AS $$
  SELECT hs_code, description, bcd_rate, igst_rate,
    similarity(description, search_term) AS sim
  FROM hs_codes WHERE similarity(description, search_term) > 0.1
  ORDER BY sim DESC LIMIT 10;
$$ LANGUAGE sql;

-- ═══ TABLE 6: extraction_history (audit log) ═══
CREATE TABLE extraction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_id UUID REFERENCES extractions(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  field_changed TEXT, old_value TEXT, new_value TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ROW LEVEL SECURITY ═══
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON users FOR ALL USING (true);
CREATE POLICY "clients_own" ON clients FOR ALL USING (true);
CREATE POLICY "extractions_own" ON extractions FOR ALL USING (true);
CREATE POLICY "items_own" ON extraction_items FOR ALL USING (true);
CREATE POLICY "history_own" ON extraction_history FOR ALL USING (true);



DROP TABLE IF EXISTS hs_codes;

CREATE TABLE hs_codes (
    id SERIAL PRIMARY KEY,

    hsn TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,

    chapter INTEGER,

    bcd_pct NUMERIC,
    sws_pct_of_bcd NUMERIC,
    igst_pct NUMERIC,
    cess_pct NUMERIC,

    igst_verification TEXT,
    bcd_verification TEXT,

    as_of DATE,

    search_vector TSVECTOR
);