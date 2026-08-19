-- ═══ TABLE 1: scanned_pdf_extractions (main scanned job records) ═══
CREATE TABLE IF NOT EXISTS public.scanned_pdf_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  job_number TEXT NOT NULL,
  job_date DATE DEFAULT CURRENT_DATE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('BOE','SB')),
  port_code TEXT,
  port_name TEXT,
  file_reference TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing','completed','review','error')),
  accuracy_score DECIMAL(5,2),
  extraction_time_ms INTEGER,
  raw_ocr_text JSONB,
  extracted_json JSONB NOT NULL,
  invoice_doc_url TEXT,
  packing_doc_url TEXT,
  bl_doc_url TEXT,
  coo_doc_url TEXT,
  licence_doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scanned_pdf_extractions ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "scanned_extractions_own" ON public.scanned_pdf_extractions FOR ALL USING (true);

-- ═══ TABLE 2: scanned_pdf_extraction_items (line items per scanned job) ═══
CREATE TABLE IF NOT EXISTS public.scanned_pdf_extraction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scanned_pdf_extraction_id UUID NOT NULL REFERENCES public.scanned_pdf_extractions(id) ON DELETE CASCADE,
  sr_no INTEGER NOT NULL,
  item_description TEXT NOT NULL,
  hs_code TEXT,
  ritc_code TEXT,
  quantity DECIMAL(15,3),
  unit TEXT,
  unit_price DECIMAL(15,4),
  total_value DECIMAL(15,2),
  fob_value DECIMAL(15,2),
  assessable_value_inr DECIMAL(15,2),
  country_of_origin TEXT,
  bcd_rate TEXT,
  sws_rate TEXT,
  igst_rate TEXT,
  comp_cess_rate TEXT,
  exemption_notification TEXT,
  end_use_code TEXT,
  confidence_score DECIMAL(3,2),
  ai_suggested_hs JSONB DEFAULT '[]',
  user_confirmed_hs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scanned_pdf_extraction_items ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "scanned_items_own" ON public.scanned_pdf_extraction_items FOR ALL USING (true);
