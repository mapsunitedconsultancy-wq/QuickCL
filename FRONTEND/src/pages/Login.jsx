// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../api';
// import { useAuth } from '../context/AuthContext';
// import { FileText, Loader2 } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     try {
//       const res = await loginUser({ email, password });
//       login(res.data.token, res.data.user);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed. Check your credentials.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br
//       from-gray-50 to-blue-50 p-4">
//       <div className="w-full max-w-sm">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center
//             justify-center mx-auto mb-3 shadow-lg">
//             <FileText size={24} className="text-white" />
//           </div>
//           <h1 className="text-2xl font-black text-gray-900">PDF TO CL</h1>
//           <p className="text-xs text-gray-400 mt-1">MAPS Tech & AI</p>
//         </div>

//         {/* Form */}
//         <div className="card-base p-7">
//           <h2 className="text-lg font-bold mb-1">Welcome back</h2>
//           <p className="text-sm text-gray-400 mb-5">Login to your CHA account</p>

//           {error && (
//             <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4
//               border border-red-200">{error}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
//               <input type="email" required className="input-field"
//                 placeholder="you@firm.com" value={email}
//                 onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-gray-500 mb-1 block">Password</label>
//               <input type="password" required className="input-field"
//                 placeholder="Your password" value={password}
//                 onChange={(e) => setPassword(e.target.value)} />
//             </div>
//             <button type="submit" disabled={loading}
//               className="btn-primary w-full flex items-center justify-center gap-2">
//               {loading && <Loader2 size={16} className="animate-spin" />}
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           <p className="text-xs text-center mt-5 text-gray-400">
//             New firm? <Link to="/register" className="text-blue-700 font-semibold">Register here</Link>
//           </p>
//         </div>

//         <p className="text-[10px] text-gray-300 text-center mt-4">
//           MapsUnited Consultancy Pvt. Ltd. · Gandhidham
//         </p>
//       </div>
//     </div>
//   );
// }
















import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await loginUser({ email, password });

      login(res.data.token, res.data.user);

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Login failed. Check your credentials.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">

      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl" />

      </div>


      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div className="relative z-10 w-full max-w-5xl">

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 lg:grid-cols-2">


          {/* =====================================================
              LEFT — BRAND / PRODUCT INFORMATION
          ===================================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-10 text-white lg:flex lg:flex-col">

            {/* Decorative circles */}

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


              {/* Main content */}

              <div className="my-auto py-12">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">

                  <Zap size={13} />

                  AI Customs Extraction Platform

                </div>


                <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight">

                  Turn shipping documents into

                  <span className="text-teal-300">
                    {' '}customs-ready data.
                  </span>

                </h1>


                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">

                  Extract critical information from Commercial Invoices,
                  Packing Lists and Bills of Lading with an intelligent
                  document processing workflow.

                </p>


                {/* Feature list */}

                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/10">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <span className="text-sm text-slate-300">
                      Automated document extraction
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
                      Customs-ready structured data
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
                      AI-powered accuracy validation
                    </span>

                  </div>

                </div>

              </div>


              {/* Bottom */}

              <div className="flex items-center justify-between border-t border-slate-700/60 pt-5">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <ShieldCheck size={15} />

                  Secure document processing

                </div>

                <div className="text-xs text-slate-500">
                  MAPS Tech & AI
                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              RIGHT — LOGIN FORM
          ===================================================== */}

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center gap-3 lg:hidden">

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

            <div className="mb-7">

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800">

                <Sparkles size={12} />

                Customs Workspace

              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">

                Welcome back

              </h2>

              <p className="mt-2 text-sm text-slate-500">

                Login to your CHA account and continue your document
                extraction workflow.

              </p>

            </div>


            {/* Error */}

            {error && (

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <div>

                  <p className="text-xs font-bold text-red-800">
                    Login unsuccessful
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-xs font-bold text-slate-700">

                  Email Address

                </label>

                <input
                  type="email"
                  required
                  placeholder="you@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                />

              </div>


              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-xs font-bold text-slate-700">

                    Password

                  </label>

                </div>

                <input
                  type="password"
                  required
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                />

              </div>


              {/* Login button */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Logging in...

                  </>
                ) : (
                  <>
                    Login to Workspace

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </>
                )}

              </button>

            </form>


            {/* Register */}

            <div className="mt-7 border-t border-slate-100 pt-6 text-center">

              <p className="text-xs text-slate-400">

                New firm?

                <Link
                  to="/register"
                  className="ml-1 font-bold text-blue-800 hover:text-blue-950 hover:underline"
                >
                  Register here
                </Link>

              </p>

            </div>


            {/* Security note */}

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">

              <ShieldCheck size={13} />

              Your account is protected with secure authentication

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
// import { LogIn, ShieldCheck, User, Sparkles, Building2, Lock, Mail } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// export function Login({ onNavigateToRegister, onSuccess }) {
//   const { loginGoogle, loginDemo, loginWithEmail } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGoogleSubmit = async () => {
//     setLoading(true);
//     try {
//       await loginGoogle();
//       if (onSuccess) onSuccess();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDemoSubmit = () => {
//     loginDemo();
//     if (onSuccess) onSuccess();
//   };

//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     if (!email) return;
//     loginWithEmail(email, password);
//     if (onSuccess) onSuccess();
//   };

//   return (
//     <div className="max-w-md mx-auto my-10 space-y-6">
//       <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
//         <div className="text-center space-y-2">
//           <div className="w-14 h-14 bg-blue-900 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-md font-black text-2xl">
//             CL
//           </div>
//           <h2 className="text-2xl font-black text-slate-900">Sign In to PDF to CL</h2>
//           <p className="text-xs text-slate-500">
//             India Customs Agent AI platform for 1-click BOE & SB checklist extractions
//           </p>
//         </div>

//         {/* Quick Demo Sign In */}
//         <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl space-y-2 text-center">
//           <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded">
//             Instant Test Drive
//           </span>
//           <p className="text-xs text-slate-600 font-medium">
//             No password required. Sign in as Ramesh K. (Senior Customs Typist).
//           </p>
//           <button
//             type="button"
//             onClick={handleDemoSubmit}
//             className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
//           >
//             <User className="w-4 h-4 text-teal-300" />
//             <span>Sign In as Senior CHA Typist</span>
//           </button>
//         </div>

//         <div className="relative flex items-center">
//           <div className="flex-grow border-t border-slate-200"></div>
//           <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-mono font-bold">
//             Or Sign In with Email
//           </span>
//           <div className="flex-grow border-t border-slate-200"></div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
//           <div>
//             <label className="block font-bold text-slate-700 mb-1">Work Email</label>
//             <div className="relative">
//               <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="typist@chafirm.in"
//                 className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block font-bold text-slate-700 mb-1">Password</label>
//             <div className="relative">
//               <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
//           >
//             <LogIn className="w-4 h-4 text-teal-300" />
//             <span>Sign In with Credentials</span>
//           </button>
//         </form>

//         {/* Google SSO */}
//         <button
//           type="button"
//           onClick={handleGoogleSubmit}
//           disabled={loading}
//           className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-2"
//         >
//           <Sparkles className="w-4 h-4 text-amber-500" />
//           <span>Continue with Google OAuth SSO</span>
//         </button>

//         {/* Register link */}
//         <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
//           <span>New CHA Firm / Agency? </span>
//           <button
//             type="button"
//             onClick={onNavigateToRegister}
//             className="font-bold text-blue-900 hover:underline"
//           >
//             Register Firm Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
