import { useState } from 'react';
import { buildUnifiedModel } from '../lib/output/unifiedModel.js';
import { generateShippingBillPDF } from '../lib/checklist/generatePDF.js';
import { generateBillOfEntryPDF } from '../lib/checklist/generatePDFBoe.js';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FileText, Loader2 } from 'lucide-react';

export default function GenerateChecklist({ data, docType }) {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  const rawDocType = String(
    docType ||
    data?.doc_type ||
    data?.docType ||
    data?.extraction_type ||
    data?.document_type ||
    data?.extracted_json?.doc_type ||
    data?.extracted_json?.document_type ||
    ''
  ).toUpperCase().trim();

  const isBoe =
    rawDocType === 'BOE' ||
    rawDocType.startsWith('BOE') ||
    rawDocType.includes('BILL OF ENTRY') ||
    rawDocType.includes('IMPORT') ||
    rawDocType.includes('ENTRY');
  const activeDocType = isBoe ? 'BOE' : 'SB';

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let savedCha = {};
      try {
        const s = localStorage.getItem('quickcl_cha_profile');
        if (s) savedCha = JSON.parse(s);
      } catch {
        savedCha = {};
      }

      // CHA details from the firm's profile
      const cha = {
        firmName: user?.firmName || user?.firm_name || savedCha.firmName || '',
        chaLicense: user?.chaLicense || user?.cha_license || savedCha.chaLicense || '',
        customHouse: user?.customsHouse || user?.customs_house || savedCha.customHouse || '',
        stateName: user?.stateName || user?.state_name || savedCha.stateName || 'GUJARAT',
        districtName: user?.districtName || user?.district_name || savedCha.districtName || 'KACHCHH',
        bankAccount: user?.bankAccount || user?.bank_account || savedCha.bankAccount || '',
        ifsc: user?.ifsc || user?.ifsc_code || savedCha.ifsc || '',
        bankName: user?.bankName || user?.bank_name || savedCha.bankName || '',
        jobNo: data?.job_number || data?.jobNumber || `JOB-${Date.now().toString().slice(-6)}`,
      };

      const model = buildUnifiedModel(data, cha, activeDocType);

      if (activeDocType === 'BOE') {
        generateBillOfEntryPDF(model);
        toast.success('Bill of Entry Checklist generated successfully');
      } else {
        generateShippingBillPDF(model);
        toast.success('Shipping Bill Checklist generated successfully');
      }
    } catch (err) {
      console.error('Checklist generation failed:', err);
      toast.error('Could not generate checklist. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="flex items-center gap-2 rounded-[14px] bg-[#34c759] hover:bg-[#28a745] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
      title={`Download ${activeDocType === 'BOE' ? 'Bill of Entry' : 'Shipping Bill'} Checklist PDF`}
    >
      {generating ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Generating Checklist...</span>
        </>
      ) : (
        <>
          <FileText size={15} strokeWidth={2.2} />
          <span>{activeDocType === 'BOE' ? 'BOE Checklist' : 'SB Checklist'}</span>
        </>
      )}
    </button>
  );
}
