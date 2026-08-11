import { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../api';
import { Users, Plus, Save, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyClient = {
  client_name:'', iec_code:'', gstin:'', pan:'', ad_code:'',
  bank_account:'', drawback_account:'', ifsc_code:'', bank_name:'',
  state_of_origin:'', exporter_type:'', address_line1:'', address_line2:'',
  default_port_code:'',
};

const FIELDS = [
  { key:'client_name', label:'Client Name', required:true },
  { key:'iec_code', label:'IEC Code' }, { key:'gstin', label:'GSTIN' },
  { key:'pan', label:'PAN' }, { key:'ad_code', label:'AD Code' },
  { key:'bank_account', label:'Bank Account' }, { key:'drawback_account', label:'Drawback Account' },
  { key:'ifsc_code', label:'IFSC Code' }, { key:'bank_name', label:'Bank Name' },
  { key:'state_of_origin', label:'State of Origin' }, { key:'exporter_type', label:'Exporter Type' },
  { key:'default_port_code', label:'Default Port Code' },
  { key:'address_line1', label:'Address Line 1' }, { key:'address_line2', label:'Address Line 2' },
];

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null); // null or client object
  const [loading, setLoading] = useState(true);

  const fetchClients = () => {
    getClients().then(res => setClients(res.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchClients(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await updateClient(editing.id, editing);
        toast.success('Client updated');
      } else {
        await createClient(editing);
        toast.success('Client added');
      }
      setEditing(null); fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    try {
      await deleteClient(id);
      toast.success('Client deleted');
      fetchClients();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-blue-800" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Client Master</h1>
            <p className="text-sm text-gray-400">Save client details for auto-fill</p>
          </div>
        </div>
        <button onClick={() => setEditing({ ...emptyClient })}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Client List */}
      <div className="card-base overflow-hidden mb-4">
        <div className="grid grid-cols-[1fr_120px_160px_80px] gap-2 px-4 py-3
          bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider">
          <span>Name</span><span>IEC</span><span>GSTIN</span><span>Actions</span>
        </div>
        {clients.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No clients yet</div>
        ) : (
          <div className="divide-y">
            {clients.map((cl) => (
              <div key={cl.id} className="grid grid-cols-[1fr_120px_160px_80px] gap-2
                px-4 py-3 hover:bg-gray-50 items-center">
                <span className="text-sm font-bold text-gray-800">{cl.client_name}</span>
                <span className="text-xs font-mono text-gray-600">{cl.iec_code || '--'}</span>
                <span className="text-xs font-mono text-gray-600">{cl.gstin || '--'}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ ...cl })}
                    className="text-xs text-blue-700 font-bold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cl.id)}
                    className="text-xs text-red-600 hover:text-red-800">
                    <Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">
              {editing.id ? 'Edit Client' : 'Add New Client'}
            </h3>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FIELDS.map(({ key, label, required }) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider
                  block mb-0.5">{label} {required && '*'}</label>
                <input className="input-field text-sm" value={editing[key] || ''}
                  required={required}
                  onChange={(e) => setEditing(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={14} /> Save
            </button>
            <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}













// import React, { useState } from 'react';
// import {
//   Building2,
//   Plus,
//   Search,
//   Edit2,
//   Trash2,
//   X,
//   FileCheck2
// } from 'lucide-react';

// export function Clients({
//   clients = [],
//   onAddClient,
//   onUpdateClient,
//   onDeleteClient,
//   onStartExtractionForClient
// }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingClient, setEditingClient] = useState(null);

//   // Form State
//   const [name, setName] = useState('');
//   const [iec, setIec] = useState('');
//   const [gstin, setGstin] = useState('');
//   const [adCode, setAdCode] = useState('');
//   const [portOfRegistration, setPortOfRegistration] = useState('INKND1 (Deendayal Port Authority, Kandla)');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('Gujarat');
//   const [pincode, setPincode] = useState('');
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [ifsc, setIfsc] = useState('');

//   const openAddModal = () => {
//     setEditingClient(null);
//     setName('');
//     setIec('');
//     setGstin('');
//     setAdCode('');
//     setAddress('');
//     setCity('');
//     setPincode('');
//     setBankName('');
//     setAccountNumber('');
//     setIfsc('');
//     setShowModal(true);
//   };

//   const openEditModal = (client) => {
//     setEditingClient(client);
//     setName(client.name);
//     setIec(client.iec);
//     setGstin(client.gstin);
//     setAdCode(client.adCode || '');
//     setPortOfRegistration(client.portOfRegistration || 'INKND1 (Deendayal Port Authority, Kandla)');
//     setAddress(client.address || '');
//     setCity(client.city || '');
//     setState(client.state || 'Gujarat');
//     setPincode(client.pincode || '');
//     setBankName(client.bankName || '');
//     setAccountNumber(client.accountNumber || '');
//     setIfsc(client.ifsc || '');
//     setShowModal(true);
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     const record = {
//       id: editingClient ? editingClient.id : `client-${Date.now()}`,
//       name,
//       iec,
//       gstin,
//       adCode,
//       branchCode: '001',
//       portOfRegistration,
//       address,
//       city,
//       state,
//       pincode,
//       bankName,
//       accountNumber,
//       ifsc
//     };

//     if (editingClient) {
//       if (onUpdateClient) onUpdateClient(record);
//     } else {
//       if (onAddClient) onAddClient(record);
//     }
//     setShowModal(false);
//   };

//   const filtered = clients.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.iec.includes(searchTerm) ||
//       c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 pb-12">
//       {/* Top Header */}
//       <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
//             <Building2 className="w-5 h-5 text-blue-900" />
//             Client Master (Importer / Exporter Registry)
//           </h2>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Maintain verified IEC, GSTIN, AD Code & Bank details for instant checklist auto-filling
//           </p>
//         </div>

//         <button
//           onClick={openAddModal}
//           className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
//         >
//           <Plus className="w-4 h-4 text-teal-300" />
//           <span>Add New Client</span>
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="relative">
//         <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
//         <input
//           type="text"
//           placeholder="Filter client by company name, IEC code, GSTIN..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900"
//         />
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((c) => (
//           <div
//             key={c.id}
//             className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
//           >
//             <div className="space-y-3">
//               <div className="flex items-start justify-between gap-2">
//                 <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2">{c.name}</h3>
//                 <span className="bg-blue-100 text-blue-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
//                   {c.portOfRegistration ? c.portOfRegistration.split(' ')[0] : 'PORT'}
//                 </span>
//               </div>

//               <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-mono space-y-1">
//                 <div>
//                   <span className="text-slate-400 font-sans">IEC:</span>{' '}
//                   <span className="font-bold text-slate-900">{c.iec}</span>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 font-sans">GSTIN:</span>{' '}
//                   <span className="font-bold text-slate-900">{c.gstin}</span>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 font-sans">AD Code:</span>{' '}
//                   <span className="text-slate-800">{c.adCode || 'N/A'}</span>
//                 </div>
//               </div>

//               <div className="text-xs text-slate-600 space-y-1">
//                 <p className="line-clamp-2 text-slate-500">
//                   {c.address}, {c.city}, {c.state} - {c.pincode}
//                 </p>
//                 {c.bankName && <p className="font-bold text-slate-800">{c.bankName}</p>}
//                 {c.accountNumber && (
//                   <p className="font-mono text-[11px] text-slate-500">
//                     A/C: {c.accountNumber} | IFSC: {c.ifsc}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
//               <button
//                 onClick={() => onStartExtractionForClient && onStartExtractionForClient(c)}
//                 className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
//               >
//                 <FileCheck2 className="w-3.5 h-3.5" />
//                 <span>+ Extraction</span>
//               </button>

//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => openEditModal(c)}
//                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
//                   title="Edit Client"
//                 >
//                   <Edit2 className="w-3.5 h-3.5" />
//                 </button>
//                 <button
//                   onClick={() => onDeleteClient && onDeleteClient(c.id)}
//                   className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg transition-colors cursor-pointer"
//                   title="Delete Client"
//                 >
//                   <Trash2 className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add / Edit Client Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 border border-slate-200">
//             <div className="flex items-center justify-between pb-4 border-b border-slate-200">
//               <h3 className="font-bold text-slate-900 text-base">
//                 {editingClient ? 'Edit Client Record' : 'Add New Importer / Exporter Client'}
//               </h3>
//               <button onClick={() => setShowModal(false)} className="cursor-pointer">
//                 <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="space-y-4 text-xs">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="sm:col-span-2">
//                   <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
//                   <input
//                     type="text"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">IEC Code (10-Digit) *</label>
//                   <input
//                     type="text"
//                     required
//                     value={iec}
//                     onChange={(e) => setIec(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">GSTIN Number *</label>
//                   <input
//                     type="text"
//                     required
//                     value={gstin}
//                     onChange={(e) => setGstin(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">AD Bank Code</label>
//                   <input
//                     type="text"
//                     value={adCode}
//                     onChange={(e) => setAdCode(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">Port of Registration</label>
//                   <select
//                     value={portOfRegistration}
//                     onChange={(e) => setPortOfRegistration(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
//                   >
//                     <option value="INKND1 (Deendayal Port Authority, Kandla)">INKND1 (Kandla Port)</option>
//                     <option value="INMUN1 (Mundra Sea Port)">INMUN1 (Mundra Sea Port)</option>
//                     <option value="INNSA1 (Nhava Sheva JNPT)">INNSA1 (Nhava Sheva JNPT)</option>
//                     <option value="INMAA1 (Chennai Port)">INMAA1 (Chennai Port)</option>
//                     <option value="INDEL4 (ICD Tughlakabad)">INDEL4 (ICD Tughlakabad)</option>
//                   </select>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block font-bold text-slate-700 mb-1">Registered Address</label>
//                   <input
//                     type="text"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
//                   <input
//                     type="text"
//                     value={bankName}
//                     onChange={(e) => setBankName(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-bold text-slate-700 mb-1">Bank Account Number</label>
//                   <input
//                     type="text"
//                     value={accountNumber}
//                     onChange={(e) => setAccountNumber(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
//                   />
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-900 text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
//                 >
//                   Save Client Record
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
