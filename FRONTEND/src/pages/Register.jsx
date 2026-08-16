import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { updateProfile, checkEmailExists } from '../api/index.js';
import { useAuth } from '../context/AuthContext';

import {
  FileText,
  Loader2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login } = useAuth();
  const [initialChecked, setInitialChecked] = useState(false);

  // Registration Step states:
  // 1 = Email submission & OTP verification
  // 2 = Password configuration
  // 3 = Profile details configuration
  const [step, setStep] = useState(1);

  // Step 1 states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Step 2 states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 3 states
  const [profile, setProfile] = useState({
    firmName: '',
    phone: '+91 ', // Default Indian country code
    gstNumber: '',
    contactPerson: '', // capital letters name
    chaLicenceNo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-resume registration flow if details are incomplete on initial load
  useEffect(() => {
    if (!authLoading && !initialChecked) {
      setInitialChecked(true);
      if (user) {
        if (!user.firmName || !user.phone) {
          setStep(3);
        } else {
          navigate('/');
        }
      }
    }
  }, [user, authLoading, initialChecked]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Check if email is already registered in our database
      const checkRes = await checkEmailExists(email);
      if (checkRes.data && checkRes.data.exists) {
        throw new Error('This email address is already registered. Please log in instead.');
      }

      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Create a user in auth.users
        },
      });

      if (otpErr) throw otpErr;

      setOtpSent(true);
      setSuccessMsg('An 8-digit verification OTP code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send verification OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length !== 8) {
      setError('Please enter the 8-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: verifyErr } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (verifyErr) throw verifyErr;

      if (data.session) {
        localStorage.setItem('quickcl_token', data.session.access_token);
        setStep(2); // Move to Step 2 to set password
        setSuccessMsg('');
      } else {
        throw new Error('OTP verified successfully but session creation failed.');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: resendErr } = await supabase.auth.signInWithOtp({ email });
      if (resendErr) throw resendErr;
      alert('Verification OTP code resent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set password
  const handleSetPassword = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: passErr } = await supabase.auth.updateUser({
        password: password,
      });

      if (passErr) throw passErr;

      setStep(3); // Success, move to Step 3 for details
    } catch (err) {
      setError(err.message || 'Failed to save your password.');
    } finally {
      setLoading(false);
    }
  };

  const validateGST = (gst) => {
    const cleanGst = gst.trim().toUpperCase();
    if (cleanGst.length !== 15) {
      return 'GST number must be exactly 15 characters long.';
    }

    const stateCode = cleanGst.substring(0, 2);
    if (!/^\d{2}$/.test(stateCode)) {
      return 'The first 2 characters of GST must be a numeric state code (e.g., 24 for Gujarat).';
    }

    const pan = cleanGst.substring(2, 12);
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
      return 'Characters 3 to 12 must be a valid PAN format (5 letters, 4 digits, 1 letter).';
    }

    const entityCode = cleanGst.charAt(12);
    if (!/^[1-9A-Z]$/.test(entityCode)) {
      return 'Character 13 of GST must be a valid alphanumeric entity code.';
    }

    const indicator = cleanGst.charAt(13);
    if (indicator !== 'Z') {
      return 'Character 14 of the GST number must be the letter "Z".';
    }

    const checkDigit = cleanGst.charAt(14);
    if (!/^[0-9A-Z]$/.test(checkDigit)) {
      return 'The last character of the GST number must be an alphanumeric check digit.';
    }

    return null;
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.trim();
    if (!/^\+91\s\d{10}$/.test(cleanPhone)) {
      return 'Phone number must be in the format "+91 XXXXXXXXXX" with exactly 10 digits.';
    }
    return null;
  };

  const handleGSTChange = (val) => {
    const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15);
    updateProfileField('gstNumber', cleanVal);
  };

  const handlePhoneChange = (val) => {
    let cleanVal = val;
    if (!cleanVal.startsWith('+91 ')) {
      const digits = val.replace(/\D/g, '');
      if (digits.startsWith('91')) {
        cleanVal = '+91 ' + digits.substring(2, 12);
      } else {
        cleanVal = '+91 ' + digits.substring(0, 10);
      }
    } else {
      const rest = val.substring(4).replace(/\D/g, '');
      cleanVal = '+91 ' + rest.substring(0, 10);
    }
    updateProfileField('phone', cleanVal);
  };

  // Step 3: Complete profile details
  const handleCompleteProfile = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    if (!profile.firmName || !profile.phone || !profile.gstNumber || !profile.contactPerson) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    // Strict validation checks
    const gstError = validateGST(profile.gstNumber);
    if (gstError) {
      setError(gstError);
      setLoading(false);
      return;
    }

    const phoneError = validatePhone(profile.phone);
    if (phoneError) {
      setError(phoneError);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firmName: profile.firmName,
        phone: profile.phone.trim(),
        gstNumber: profile.gstNumber.trim().toUpperCase(),
        chaLicenceNo: profile.chaLicenceNo || null,
        contactPerson: profile.contactPerson.toUpperCase(), // capitalized contact details
      };

      const res = await updateProfile(payload);

      // Save complete session & navigate
      const token = localStorage.getItem('quickcl_token');
      login(token, res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileField = (key, val) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
  };

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
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-2xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400 shadow-lg">
                  <FileText size={22} className="text-slate-950" />
                </div>
                <div>
                  <div className="text-lg font-black tracking-tight">QuickCL</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    MAPS Tech & AI
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="my-auto py-12">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">
                  AI Customs Extraction Platform
                </div>

                <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight">
                  Digitize your <span className="text-teal-300">customs workflow.</span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Create your firm's workspace and start transforming shipping documents into structured, customs-ready information.
                </p>

                {/* Features */}
                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">
                      <CheckCircle2 size={15} className="text-teal-300" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        140+ fields extracted automatically
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Item descriptions, quantities, values, HS codes, party details, all 15 sections of the checklist
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">
                      <CheckCircle2 size={15} className="text-teal-300" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        14,000+ official ITC-HS codes
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Matched from the CBIC tariff database, never guessed or invented
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">
                      <CheckCircle2 size={15} className="text-teal-300" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        Software-agnostic output
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Copy-paste into any CHA software. No integration, no training required
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 mt-0.5">
                      <CheckCircle2 size={15} className="text-teal-300" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-teal-300">
                        Zero document retention
                      </span>
                      <span className="mt-1 block text-xs text-slate-300 leading-relaxed">
                        Your invoices are deleted immediately after processing. We are not a data business
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between border-t border-slate-700/60 pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={15} /> Secure account registration
                </div>
                <div className="text-xs text-slate-500">MAPS Tech & AI</div>
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
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-900">QuickCL</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  MAPS Tech & AI
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-black tracking-tight text-slate-900 py-4">

              Register

            </h2>

            <div className="mb-6">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                Step {step} of 3
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {step === 1
                  ? 'Verify your email'
                  : step === 2
                    ? 'Create password'
                    : 'Agency details'}
              </h2>
              <p className="mt-2 text-sm leading-5 text-slate-500">
                {step === 1
                  ? 'Verify your official email using an 8-digit OTP code.'
                  : step === 2
                    ? 'Secure your new account with a strong password.'
                    : 'Fill in your customs agency and primary contact details.'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <div>
                  <p className="text-xs font-bold text-red-800">Registration unsuccessful</p>
                  <p className="mt-1 text-xs leading-5 text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <p className="text-xs font-bold text-teal-800">Verify OTP Code</p>
                  <p className="mt-1 text-xs leading-5 text-teal-600">{successMsg}</p>
                </div>
              </div>
            )}

            {/* ==================== STEP 1 ==================== */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-3.5">
                  {!otpSent ? (
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ramesh@speedycustoms.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Enter 8-digit OTP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        placeholder="12345678"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all text-center tracking-[0.5em] font-mono focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                      />
                    </div>
                  )}
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send 8-digit OTP Code
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3.5">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Code
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    <div className="flex justify-between text-xs pt-1">
                      <button type="button" onClick={() => setOtpSent(false)} className="text-slate-500 hover:underline">
                        ← Edit Email
                      </button>
                      <button type="button" onClick={handleResendOtp} className="text-blue-800 font-bold hover:underline">
                        Resend OTP Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== STEP 2 ==================== */}
            {step === 2 && (
              <form onSubmit={handleSetPassword} className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Type your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl"
                >
                  {loading ? 'Saving...' : 'Save Password & Continue'}
                </button>
              </form>
            )}

            {/* ==================== STEP 3 ==================== */}
            {step === 3 && (
              <form onSubmit={handleCompleteProfile} className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Firm Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rishi Shipping Agency"
                    value={profile.firmName}
                    onChange={(e) => updateProfileField('firmName', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      GST Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="24AAAAA1111A1Z1"
                      value={profile.gstNumber}
                      onChange={(e) => handleGSTChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={profile.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Contact Person (CAPITAL LETTERS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="RAMESH KUMAR"
                    value={profile.contactPerson}
                    onChange={(e) => updateProfileField('contactPerson', e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5 uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    CHA Licence No. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="AARFD5233DCH002"
                    value={profile.chaLicenceNo}
                    onChange={(e) => updateProfileField('chaLicenceNo', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/10 transition-all hover:bg-blue-900 hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-400">
                Already registered?
                <Link to="/login" className="ml-1 font-bold text-blue-800 hover:text-blue-950 hover:underline">
                  Login
                </Link>
              </p>
            </div>

            {/* Secure Info footer */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={13} />
              Your information is securely stored
            </div>

          </div>
        </div>

        {/* Footer info */}
        <p className="mt-5 text-center text-[10px] text-slate-400">
          MapsUnited Consultancy Pvt. Ltd. · Gandhidham
        </p>

      </div>
    </div>
  );
}
