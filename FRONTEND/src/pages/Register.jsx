// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { registerUser } from '../api';
// import { useAuth } from '../context/AuthContext';
// import { FileText, Loader2 } from 'lucide-react';

// export default function Register() {
//   const [form, setForm] = useState({
//     firmName: '', phone: '', email: '', password: '',
//     chaLicenceNo: '', gcardHolder: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     try {
//       const res = await registerUser(form);
//       login(res.data.token, res.data.user);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     }
//     setLoading(false);
//   };

//   const fields = [
//     { key: 'firmName', label: 'Firm Name', type: 'text', required: true, placeholder: 'Rishi Shipping Agency' },
//     { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+91 9876543210' },
//     { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'firm@email.com' },
//     { key: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Min 6 characters' },
//     { key: 'chaLicenceNo', label: 'CHA Licence No. (optional)', type: 'text', placeholder: 'AARFD5233DCH002' },
//     { key: 'gcardHolder', label: 'G-Card Holder (optional)', type: 'text', placeholder: 'Name of G-Card holder' },
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br
//       from-gray-50 to-blue-50 p-4">
//       <div className="w-full max-w-sm">
//         <div className="text-center mb-6">
//           <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center
//             justify-center mx-auto mb-3 shadow-lg">
//             <FileText size={24} className="text-white" />
//           </div>
//           <h1 className="text-2xl font-black text-gray-900">PDF TO CL</h1>
//           <p className="text-xs text-gray-400 mt-1">Register your CHA firm</p>
//         </div>

//         <div className="card-base p-7">
//           {error && <div className="bg-red-50 text-red-700 text-sm p-3
//             rounded-lg mb-4 border border-red-200">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-3">
//             {fields.map(({ key, label, type, required, placeholder }) => (
//               <div key={key}>
//                 <label className="text-[10px] font-bold text-gray-400 uppercase
//                   tracking-wider mb-0.5 block">{label}</label>
//                 <input type={type} required={required} placeholder={placeholder}
//                   className="input-field" value={form[key]}
//                   onChange={(e) => update(key, e.target.value)} />
//               </div>
//             ))}
//             <button type="submit" disabled={loading}
//               className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
//               {loading && <Loader2 size={16} className="animate-spin" />}
//               {loading ? 'Creating...' : 'Register'}
//             </button>
//           </form>
//           <p className="text-xs text-center mt-4 text-gray-400">
//             Already registered? <Link to="/login" className="text-blue-700 font-semibold">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

import {
  FileText,
  Loader2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    firmName: '',
    phone: '',
    email: '',
    password: '',
    chaLicenceNo: '',
    gcardHolder: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const update = (k, v) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await registerUser(form);

      login(res.data.token, res.data.user);

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed'
      );
    }

    setLoading(false);
  };

  const fields = [
    {
      key: 'firmName',
      label: 'Firm Name',
      type: 'text',
      required: true,
      placeholder: 'Rishi Shipping Agency',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '+91 9876543210',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'firm@email.com',
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Min 6 characters',
    },
    {
      key: 'chaLicenceNo',
      label: 'CHA Licence No. (optional)',
      type: 'text',
      placeholder: 'AARFD5233DCH002',
    },
    {
      key: 'gcardHolder',
      label: 'G-Card Holder (optional)',
      type: 'text',
      placeholder: 'Name of G-Card holder',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">

      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-30 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-30 -right-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl" />

      </div>


      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div className="relative z-10 w-full max-w-6xl">

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 lg:grid-cols-2">


          {/* =====================================================
              LEFT — BRAND / PRODUCT INFORMATION
          ===================================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-10 text-white lg:flex lg:flex-col">

            {/* Decorative elements */}

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-2xl" />

            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />


            <div className="relative z-10 flex h-full flex-col">

              {/* Logo */}

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400 shadow-lg">

                  <FileText
                    size={22}
                    className="text-slate-950"
                  />

                </div>

                <div>

                  <div className="text-lg font-black tracking-tight">
                    PDF TO CL
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    MAPS Tech & AI
                  </div>

                </div>

              </div>


              {/* Main Content */}

              <div className="my-auto py-12">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">

                  <Zap size={13} />

                  AI Customs Extraction Platform

                </div>


                <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight">

                  Digitize your

                  <span className="text-teal-300">
                    {' '}customs workflow.
                  </span>

                </h1>


                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">

                  Create your firm's workspace and start transforming
                  shipping documents into structured, customs-ready
                  information.

                </p>


                {/* Features */}

                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/10">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <span className="text-sm text-slate-300">
                      Extract data from shipping documents
                    </span>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/10">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <span className="text-sm text-slate-300">
                      Manage your firm's extraction history
                    </span>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/10">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <span className="text-sm text-slate-300">
                      AI-powered customs data processing
                    </span>

                  </div>

                </div>

              </div>


              {/* Bottom */}

              <div className="flex items-center justify-between border-t border-slate-700/60 pt-5">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <ShieldCheck size={15} />

                  Secure account registration

                </div>

                <div className="text-xs text-slate-500">
                  MAPS Tech & AI
                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              RIGHT — REGISTRATION FORM
          ===================================================== */}

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

            {/* Mobile Logo */}

            <div className="mb-7 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 shadow-md">

                <FileText
                  size={22}
                  className="text-white"
                />

              </div>

              <div>

                <div className="text-lg font-black tracking-tight text-slate-900">
                  PDF TO CL
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  MAPS Tech & AI
                </div>

              </div>

            </div>


            {/* Heading */}

            <div className="mb-6">

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800">

                <Sparkles size={12} />

                Create Workspace

              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">

                Register your CHA firm

              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">

                Create your account to start managing your customs
                document extraction workflow.

              </p>

            </div>


            {/* Error */}

            {error && (

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <div>

                  <p className="text-xs font-bold text-red-800">
                    Registration unsuccessful
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}


            {/* Registration Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >

              {fields.map(
                ({
                  key,
                  label,
                  type,
                  required,
                  placeholder,
                }) => (

                  <div key={key}>

                    <label className="mb-1.5 block text-xs font-bold text-slate-700">

                      {label}

                      {required && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}

                    </label>

                    <input
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) =>
                        update(key, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                    />

                  </div>

                )
              )}


              {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Creating Account...

                  </>
                ) : (
                  <>
                    Create Firm Account

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </>
                )}

              </button>

            </form>


            {/* Login */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">

              <p className="text-xs text-slate-400">

                Already registered?

                <Link
                  to="/login"
                  className="ml-1 font-bold text-blue-800 hover:text-blue-950 hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>


            {/* Security */}

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">

              <ShieldCheck size={13} />

              Your information is securely stored

            </div>

          </div>

        </div>


        {/* Footer */}

        <p className="mt-5 text-center text-[10px] text-slate-400">

          MapsUnited Consultancy Pvt. Ltd. · Gandhidham

        </p>

      </div>

    </div>
  );
}








// import React, { useState } from 'react';
// import { Building2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// export function Register({ onNavigateToLogin, onSuccess }) {
//   const { registerUser } = useAuth();
//   const [firmName, setFirmName] = useState('');
//   const [licenceNo, setLicenceNo] = useState('');
//   const [customsPort, setCustomsPort] = useState('INKND1 - Deendayal Port Authority, Kandla');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerUser({
//       name,
//       email,
//       firmName,
//       licenceNo
//     });
//     if (onSuccess) onSuccess();
//   };

//   return (
//     <div className="max-w-lg mx-auto my-8 space-y-6">
//       <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
//         <div className="text-center space-y-2">
//           <div className="w-12 h-12 bg-blue-900 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-md font-black text-xl">
//             <Building2 className="w-6 h-6" />
//           </div>
//           <h2 className="text-2xl font-black text-slate-900">Register CHA Agency</h2>
//           <p className="text-xs text-slate-500">
//             Set up your Customs House Agent agency workspace for multi-typist AI document extractions
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 text-xs">
//           <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
//               <ShieldCheck className="w-4 h-4 text-blue-900" />
//               Customs Agency Details
//             </h4>

//             <div>
//               <label className="block font-bold text-slate-700 mb-1">CHA Firm / Agency Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={firmName}
//                 onChange={(e) => setFirmName(e.target.value)}
//                 placeholder="e.g. Speedy Customs Logistics LLP"
//                 className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">CHA Licence Number *</label>
//                 <input
//                   type="text"
//                   required
//                   value={licenceNo}
//                   onChange={(e) => setLicenceNo(e.target.value)}
//                   placeholder="11/1892/KND"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-mono font-bold text-slate-900"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Default Customs Port</label>
//                 <select
//                   value={customsPort}
//                   onChange={(e) => setCustomsPort(e.target.value)}
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//                 >
//                   <option value="INKND1 - Deendayal Port Authority, Kandla">INKND1 (Kandla Port)</option>
//                   <option value="INMUN1 - Mundra Sea Port">INMUN1 (Mundra Sea Port)</option>
//                   <option value="INNSA1 - Nhava Sheva JNPT">INNSA1 (Nhava Sheva)</option>
//                   <option value="INMAA1 - Chennai Sea Port">INMAA1 (Chennai Sea Port)</option>
//                   <option value="INDEL4 - ICD Tughlakabad">INDEL4 (ICD Tughlakabad)</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
//               <UserCheck className="w-4 h-4 text-blue-900" />
//               Primary Admin Account
//             </h4>

//             <div>
//               <label className="block font-bold text-slate-700 mb-1">Admin Full Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Ramesh Kumar"
//                 className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="ramesh@speedycustoms.in"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 text-slate-900"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Password *</label>
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 text-slate-900"
//                 />
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
//           >
//             <span>Create Agency Account & Start Free Trial</span>
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </form>

//         <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
//           <span>Already registered? </span>
//           <button
//             type="button"
//             onClick={onNavigateToLogin}
//             className="font-bold text-blue-900 hover:underline"
//           >
//             Sign In Here
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }











// import React, { useState } from 'react';
// import { Building2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// export function Register({ onNavigateToLogin, onSuccess }) {
//   const { registerUser } = useAuth();
//   const [firmName, setFirmName] = useState('');
//   const [licenceNo, setLicenceNo] = useState('');
//   const [customsPort, setCustomsPort] = useState('INKND1 - Deendayal Port Authority, Kandla');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerUser({
//       name,
//       email,
//       firmName,
//       licenceNo
//     });
//     if (onSuccess) onSuccess();
//   };

//   return (
//     <div className="max-w-lg mx-auto my-8 space-y-6">
//       <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
//         <div className="text-center space-y-2">
//           <div className="w-12 h-12 bg-blue-900 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-md font-black text-xl">
//             <Building2 className="w-6 h-6" />
//           </div>
//           <h2 className="text-2xl font-black text-slate-900">Register CHA Agency</h2>
//           <p className="text-xs text-slate-500">
//             Set up your Customs House Agent agency workspace for multi-typist AI document extractions
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 text-xs">
//           <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
//               <ShieldCheck className="w-4 h-4 text-blue-900" />
//               Customs Agency Details
//             </h4>

//             <div>
//               <label className="block font-bold text-slate-700 mb-1">CHA Firm / Agency Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={firmName}
//                 onChange={(e) => setFirmName(e.target.value)}
//                 placeholder="e.g. Speedy Customs Logistics LLP"
//                 className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">CHA Licence Number *</label>
//                 <input
//                   type="text"
//                   required
//                   value={licenceNo}
//                   onChange={(e) => setLicenceNo(e.target.value)}
//                   placeholder="11/1892/KND"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-mono font-bold text-slate-900"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Default Customs Port</label>
//                 <select
//                   value={customsPort}
//                   onChange={(e) => setCustomsPort(e.target.value)}
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//                 >
//                   <option value="INKND1 - Deendayal Port Authority, Kandla">INKND1 (Kandla Port)</option>
//                   <option value="INMUN1 - Mundra Sea Port">INMUN1 (Mundra Sea Port)</option>
//                   <option value="INNSA1 - Nhava Sheva JNPT">INNSA1 (Nhava Sheva)</option>
//                   <option value="INMAA1 - Chennai Sea Port">INMAA1 (Chennai Sea Port)</option>
//                   <option value="INDEL4 - ICD Tughlakabad">INDEL4 (ICD Tughlakabad)</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
//               <UserCheck className="w-4 h-4 text-blue-900" />
//               Primary Admin Account
//             </h4>

//             <div>
//               <label className="block font-bold text-slate-700 mb-1">Admin Full Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Ramesh Kumar"
//                 className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 font-bold text-slate-900"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="ramesh@speedycustoms.in"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 text-slate-900"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-slate-700 mb-1">Password *</label>
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full bg-white border border-slate-300 focus:border-blue-900 rounded-xl p-2.5 text-slate-900"
//                 />
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
//           >
//             <span>Create Agency Account & Start Free Trial</span>
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </form>

//         <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
//           <span>Already registered? </span>
//           <button
//             type="button"
//             onClick={onNavigateToLogin}
//             className="font-bold text-blue-900 hover:underline"
//           >
//             Sign In Here
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
