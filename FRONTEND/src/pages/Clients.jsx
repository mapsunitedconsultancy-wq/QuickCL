import { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../api';
import {
  Users,
  Plus,
  Save,
  X,
  Trash2,
  Building2,
  Search,
  CheckCircle2,
  Edit2,
  Building,
  CreditCard,
  MapPin,
  Anchor,
} from 'lucide-react';
import toast from 'react-hot-toast';

const emptyClient = {
  client_name: '',
  iec_code: '',
  gstin: '',
  pan: '',
  ad_code: '',
  bank_account: '',
  drawback_account: '',
  ifsc_code: '',
  bank_name: '',
  state_of_origin: '',
  exporter_type: '',
  address_line1: '',
  address_line2: '',
  default_port_code: '',
};

const FIELDS = [
  { key: 'client_name', label: 'Client Name', required: true, placeholder: 'e.g. Reliance Industries Ltd' },
  { key: 'iec_code', label: 'IEC Code', required: true, placeholder: '10-digit IEC code' },
  { key: 'gstin', label: 'GSTIN', placeholder: '15-digit GST identification' },
  { key: 'pan', label: 'PAN', placeholder: '10-digit PAN' },
  { key: 'ad_code', label: 'Authorized Dealer (AD) Code', placeholder: 'e.g. 0210045' },
  { key: 'bank_name', label: 'Bank Name', placeholder: 'e.g. State Bank of India' },
  { key: 'bank_account', label: 'Bank Account Number', placeholder: 'Account number' },
  { key: 'drawback_account', label: 'Drawback Account Number', placeholder: 'Customs drawback A/C' },
  { key: 'ifsc_code', label: 'IFSC Code', placeholder: 'e.g. SBIN0001234' },
  { key: 'default_port_code', label: 'Default Port Code', placeholder: 'e.g. INNSA1, INBOM1' },
  { key: 'state_of_origin', label: 'State of Origin', placeholder: 'e.g. Maharashtra, Gujarat' },
  { key: 'exporter_type', label: 'Exporter Type', placeholder: 'e.g. Manufacturer / Merchant' },
  { key: 'address_line1', label: 'Address Line 1', placeholder: 'Street address / premises' },
  { key: 'address_line2', label: 'Address Line 2', placeholder: 'City, State, Pincode' },
];

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null); // null or client object
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = () => {
    setLoading(true);
    getClients()
      .then((res) => setClients(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!editing.client_name?.trim()) {
      toast.error('Client Name is required');
      return;
    }

    try {
      if (editing.id) {
        await updateClient(editing.id, editing);
        toast.success('Client profile updated');
      } else {
        await createClient(editing);
        toast.success('New client added successfully');
      }
      setEditing(null);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save client');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name || 'this client'}"?`)) return;
    try {
      await deleteClient(id);
      toast.success('Client deleted');
      fetchClients();
    } catch {
      toast.error('Failed to delete client');
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.client_name?.toLowerCase().includes(q) ||
      c.iec_code?.toLowerCase().includes(q) ||
      c.gstin?.toLowerCase().includes(q) ||
      c.pan?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ================= HERO BANNER (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
                <Users size={14} className="text-[#007aff]" strokeWidth={2.2} />
                Client Master Directory
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
                Client Master
              </h1>

              <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
                Save client master profiles with verified IEC, GSTIN, AD codes, and bank accounts for automatic autofill across document extractions.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing({ ...emptyClient });
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-[14px] bg-[#007aff] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98] shrink-0 self-start sm:self-center"
            >
              <Plus size={16} strokeWidth={2.4} />
              Add New Client
            </button>
          </div>
        </div>
      </div>

      {/* ================= EDIT / CREATE FORM MODAL CARD ================= */}
      {editing && (
        <div className="rounded-[20px] border border-[#007aff]/30 bg-white p-7 shadow-[0_4px_24px_rgba(0,122,255,0.08)] ring-2 ring-[#007aff]/15 transition-all">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(60,60,67,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#007aff]/10 text-[#007aff] flex items-center justify-center">
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                  {editing.id ? 'Edit Client Profile' : 'Add New Client Profile'}
                </h2>
                <p className="text-xs text-[#48484a]">
                  All fields saved here will automatically populate during document extractions
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditing(null)}
              className="w-8 h-8 rounded-full bg-[#f2f2f7] hover:bg-[#e5e5ea] flex items-center justify-center text-[#48484a] hover:text-[#1c1c1e] transition active:scale-95"
              title="Close form"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIELDS.map(({ key, label: fieldLabel, required, placeholder }) => (
                <div key={key}>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a] block mb-1.5">
                    {fieldLabel} {required && <span className="text-[#ff3b30]">*</span>}
                  </label>
                  <input
                    type="text"
                    required={required}
                    placeholder={placeholder}
                    className="w-full rounded-[12px] bg-[#f2f2f7] border border-transparent py-2.5 px-3.5 text-sm font-medium text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
                    value={editing[key] || ''}
                    onChange={(e) =>
                      setEditing((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[rgba(60,60,67,0.08)]">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-[14px] bg-[#007aff] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0066d6] active:scale-[0.98]"
              >
                <Save size={16} strokeWidth={2.2} />
                {editing.id ? 'Save Client Changes' : 'Create Client Profile'}
              </button>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-3 text-sm font-semibold text-[#1c1c1e] transition hover:bg-[#e5e5ea] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SEARCH & STATS BAR ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3.5 top-3 text-[#636366]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search clients by name, IEC, GSTIN, PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-2.5 pl-9 pr-4 text-sm text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
            />
          </div>

          <span className="text-xs font-semibold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-3 py-1.5 rounded-full self-start sm:self-center">
            {filteredClients.length} registered client{filteredClients.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* ================= CLIENT LIST TABLE ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Registered Clients
            </h2>
            <p className="mt-0.5 text-xs text-[#48484a]">
              Profiles available for auto-fill in document extractions
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-[#48484a]">
            Loading client directory...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f2f2f7] text-[#636366] mb-4">
              <Building2 size={26} strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-[#1c1c1e]">
              {searchTerm ? 'No Matching Clients Found' : 'No Clients Saved Yet'}
            </h3>
            <p className="mt-1 text-xs text-[#48484a] max-w-sm mx-auto">
              {searchTerm
                ? 'Try searching with different terms or clear your search input.'
                : 'Save your first client to enable 1-click auto-fill for all commercial invoices.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setEditing({ ...emptyClient })}
                className="mt-5 rounded-[14px] bg-[#007aff] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0066d6] transition active:scale-95"
              >
                + Add First Client
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(60,60,67,0.1)] bg-[#f9f9fb] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#48484a]">
                    <th className="px-6 py-3.5">Client & Address</th>
                    <th className="px-6 py-3.5">IEC Code</th>
                    <th className="px-6 py-3.5">GSTIN / PAN</th>
                    <th className="px-6 py-3.5">Bank / Port Details</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[rgba(60,60,67,0.06)]">
                  {filteredClients.map((cl) => (
                    <tr key={cl.id} className="transition-colors hover:bg-[#f9f9fb]">
                      {/* Name & Address */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#1c1c1e]">
                          {cl.client_name}
                        </div>
                        <div className="text-xs text-[#48484a] mt-0.5 max-w-xs truncate">
                          {[cl.address_line1, cl.address_line2].filter(Boolean).join(', ') || 'No address saved'}
                        </div>
                      </td>

                      {/* IEC */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-1 rounded-[8px]">
                          {cl.iec_code || '--'}
                        </span>
                      </td>

                      {/* GSTIN / PAN */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-semibold text-[#1c1c1e]">
                          {cl.gstin || '--'}
                        </div>
                        {cl.pan && (
                          <div className="font-mono text-[11px] text-[#636366] mt-0.5">
                            PAN: {cl.pan}
                          </div>
                        )}
                      </td>

                      {/* Bank & Port */}
                      <td className="px-6 py-4 text-xs">
                        <div className="text-[#1c1c1e] font-medium">
                          {cl.bank_name || 'Bank Not Specified'}
                        </div>
                        <div className="text-[#636366] text-[11px] mt-0.5">
                          {cl.default_port_code ? `Port: ${cl.default_port_code}` : ''}
                          {cl.ad_code ? ` • AD: ${cl.ad_code}` : ''}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditing({ ...cl });
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[rgba(60,60,67,0.15)] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] hover:bg-[#f2f2f7] transition active:scale-95 shadow-2xs"
                          >
                            <Edit2 size={12} strokeWidth={2.2} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(cl.id, cl.client_name)}
                            className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[#ff3b30] hover:bg-[#ff3b30]/10 border border-transparent hover:border-[#ff3b30]/20 transition active:scale-95"
                            title="Delete client"
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (below 768px) */}
            <div className="divide-y divide-[rgba(60,60,67,0.08)] md:hidden">
              {filteredClients.map((cl) => (
                <div key={cl.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#1c1c1e]">
                        {cl.client_name}
                      </h3>
                      <p className="text-xs text-[#48484a] mt-0.5">
                        {[cl.address_line1, cl.address_line2].filter(Boolean).join(', ') || 'No address specified'}
                      </p>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-2 py-0.5 rounded-[8px] shrink-0">
                      {cl.iec_code || '--'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-[10px] bg-[#f9f9fb] p-2.5 border border-[rgba(60,60,67,0.06)]">
                      <span className="text-[10px] font-semibold text-[#636366] block">GSTIN</span>
                      <span className="font-mono font-semibold text-[#1c1c1e] mt-0.5 block truncate">{cl.gstin || '--'}</span>
                    </div>

                    <div className="rounded-[10px] bg-[#f9f9fb] p-2.5 border border-[rgba(60,60,67,0.06)]">
                      <span className="text-[10px] font-semibold text-[#636366] block">Default Port</span>
                      <span className="font-semibold text-[#1c1c1e] mt-0.5 block">{cl.default_port_code || '--'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(60,60,67,0.06)]">
                    <button
                      onClick={() => {
                        setEditing({ ...cl });
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 rounded-[10px] border border-[rgba(60,60,67,0.15)] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] hover:bg-[#f2f2f7] transition"
                    >
                      <Edit2 size={12} strokeWidth={2.2} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cl.id, cl.client_name)}
                      className="inline-flex items-center gap-1 rounded-[10px] text-[#ff3b30] hover:bg-[#ff3b30]/10 px-3 py-1.5 text-xs font-semibold transition"
                    >
                      <Trash2 size={13} strokeWidth={2} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
