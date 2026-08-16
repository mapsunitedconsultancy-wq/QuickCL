import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { checkEmailExists } from '../api/index.js';

import {
  FileText,
  Loader2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password reset states
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'forgot-password'
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Detect recovery redirect on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'recovery') {
      setView('forgot-password');
      // Clean up URL so reloads don't get stuck in recovery mode
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Upon successful login, the onAuthStateChange in AuthContext handles fetching profile
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    }

    setLoading(false);
  };

  // Step 1: Send Password Reset Link to email
  const handleSendForgotPasswordLink = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Check if email is registered in our database first
      const checkRes = await checkEmailExists(email);
      if (!checkRes.data || !checkRes.data.exists) {
        throw new Error('This email address is not registered.');
      }

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetErr) throw resetErr;

      setSuccessMsg('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send password reset link. Make sure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set new password after link redirection
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: passErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passErr) throw passErr;

      // Navigate to home page/dashboard
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save your new password.');
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setView('login');
    setError('');
    setSuccessMsg('');
    setNewPassword('');
    setConfirmPassword('');
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
                    QuickCL
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    MAPS TECH & AI
                  </div>

                </div>

              </div>


              {/* Main content */}

              <div className="my-auto py-12">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">

                  Fast Customs Checklist Helper

                </div>


                <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight">

                  Make customs filing faster

                  <span className="text-teal-300">
                    {' '}and error-free.
                  </span>

                </h1>


                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">

                  Stop wasting hours typing declarations manually. Our helper tool reads your Commercial Invoices, Packing Lists, and AWB copies for you, preparing your checklists in seconds.

                </p>


                {/* Feature list */}

                <div className="mt-8 space-y-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        140+ Checklist fields captured instantly
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Automatically processes party details, quantities, item descriptions, values, and HS codes without manual typing
                      </span>
                    </div>

                  </div>


                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        14,000+ Verified HS codes
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Direct matching from the official CBIC database, guaranteeing accurate classification with zero guesswork
                      </span>
                    </div>

                  </div>


                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        Works with your existing CHA system
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Zero integration setup. Simply copy-paste data directly into whatever filing software you use
                      </span>
                    </div>

                  </div>


                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">

                      <CheckCircle2
                        size={15}
                        className="text-teal-300"
                      />

                    </div>

                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        Immediate document deletion
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Your invoices and files are wiped right after extraction. We prioritize privacy and are not a data business
                      </span>
                    </div>

                  </div>

                </div>

              </div>


              {/* Bottom */}

              <div className="flex items-center justify-between border-t border-slate-700/60 pt-5">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <ShieldCheck size={15} />

                  Secure document helper

                </div>

                <div className="text-xs text-slate-500">
                  MAPS TECH & AI
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
                  QuickCL
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  MAPS UNITED CONSULTANCY
                </div>

              </div>

            </div>


            {/* Heading */}

            <div className="mb-7">
              {view === 'login' ? (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Login
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Log in to your workspace to generate checklists and manage your customs entry profiles.
                  </p>
                </>
              ) : view === 'forgot' ? (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Forgot Password
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your email to receive an 8-digit OTP code to verify your identity.
                  </p>
                </>
              ) : view === 'forgot-otp' ? (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Verify OTP Code
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter the 8-digit OTP code sent to your email to continue resetting your password.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Create New Password
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Set a secure new password for your QuickCL account.
                  </p>
                </>
              )}
            </div>


            {/* Error */}

            {error && (

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <div>

                  <p className="text-xs font-bold text-red-800">
                    Error
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}

            {/* Success message */}
            {successMsg && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <p className="text-xs font-bold text-teal-800">Verification Sent</p>
                  <p className="mt-1 text-xs leading-5 text-teal-600">{successMsg}</p>
                </div>
              </div>
            )}


            {/* Form */}

            {view === 'login' && (
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

                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>

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
            )}

            {view === 'forgot' && (
              <form
                onSubmit={handleSendForgotPasswordLink}
                className="space-y-5"
              >
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

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={resetToLogin}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}

            {view === 'forgot-password' && (
              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Type password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl"
                >
                  {loading ? 'Saving...' : 'Save Password & Continue'}
                </button>
              </form>
            )}


            {/* Register */}

            {view === 'login' && (
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
            )}


            {/* Security note */}

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">

              <ShieldCheck size={13} />

              Gandhidham CHA Secure Login

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
//           <h2 className="text-2xl font-black text-slate-900">Sign In to QuickCL</h2>
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
