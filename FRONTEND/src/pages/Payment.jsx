import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import QrCodephoto from '../assets/payment_qr.jpeg';
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  MessageSquare,
  CreditCard,
  Building,
} from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrLoadError, setQrLoadError] = useState(false);

  const planId = searchParams.get('plan') || 'pro';

  if (planId !== 'pro') {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[#ff3b30] font-bold text-base">Invalid Plan Selected</p>
          <p className="text-xs text-[#48484a] mt-1.5">Please select a valid subscription tier.</p>
          <button
            onClick={() => navigate('/pricing')}
            className="mt-6 rounded-[14px] border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] px-5 py-2.5 text-xs font-semibold text-[#1c1c1e] hover:bg-[#e5e5ea] transition"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentConfirm = (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter the Transaction ID / Ref No. for verification');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.error(
        'Automatic instant verification is currently unavailable. Please click "Confirm on WhatsApp" below to submit your payment details for manual activation.',
        { duration: 6000 }
      );
    }, 1200);
  };

  const handleWhatsAppConfirm = () => {
    const phoneNumber = '+918160024858';
    const text = `Hi Aman, I have completed the payment of ₹4,000 for the QuickCL Pro Plan. 
Registered Email: ${user?.email || 'N/A'}
Transaction Ref ID: ${transactionId || 'Not Entered yet'}
Please approve my upgrade.`;

    const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ================= HEADER & BACK ================= */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/pricing')}
          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[rgba(60,60,67,0.15)] bg-white text-[#1c1c1e] hover:bg-[#f2f2f7] transition active:scale-95 shadow-2xs"
          title="Back to pricing"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c1e]">
            Checkout & Payment
          </h1>
          <p className="text-xs text-[#48484a]">
            Complete your transaction to activate your QuickCL Pro upgrade
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: QR CODE DISPLAY ================= */}
        <div className="md:col-span-7 space-y-4">
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
            <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
              Instant UPI QR Code
            </h2>
            <p className="text-xs text-[#48484a] mt-1 mb-6">
              Scan & pay ₹4,000 using Google Pay, PhonePe, Paytm, or BHIM
            </p>

            {/* QR Code Frame */}
            <div className="w-64 h-64 border-2 border-dashed border-[rgba(60,60,67,0.18)] rounded-[20px] flex flex-col items-center justify-center bg-[#f9f9fb] relative overflow-hidden mb-6 p-2 shadow-2xs">
              {!qrLoadError ? (
                <img
                  src={QrCodephoto}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain rounded-[14px]"
                  onError={() => setQrLoadError(true)}
                />
              ) : (
                <div className="flex flex-col items-center p-4">
                  <QrCode size={48} className="text-[#636366] mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-[#1c1c1e]">QR Code Not Loaded</p>
                  <p className="text-[10px] text-[#636366] mt-1 max-w-[200px]">
                    Pay directly to UPI ID: 8160024858@upi
                  </p>
                </div>
              )}
            </div>

            {/* Merchant Details Card */}
            <div className="w-full rounded-[16px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)] p-4 text-left space-y-2.5">
              <p className="text-[10px] font-semibold text-[#48484a] uppercase tracking-[0.06em]">
                Merchant Verification Details
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#48484a]">Payee Account:</span>
                  <span className="font-semibold text-[#1c1c1e]">MAPS Tech & AI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#48484a]">UPI ID:</span>
                  <span className="font-mono font-bold text-[#007aff] select-all">
                    8160024858@upi
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[rgba(60,60,67,0.06)]">
                  <span className="text-[#48484a]">Amount Payable:</span>
                  <span className="font-bold text-sm text-[#34c759]">₹4,000 INR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CONFIRMATION FORM ================= */}
        <div className="md:col-span-5 space-y-4">
          {/* Order Summary Card */}
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-bold text-[#1c1c1e] tracking-tight mb-3">
              Order Summary
            </h2>
            <div className="divide-y divide-[rgba(60,60,67,0.06)] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#48484a]">QuickCL Pro Plan (120 Quota)</span>
                <span className="font-semibold text-[#1c1c1e]">₹4,000.00</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#48484a]">Taxes & Fees</span>
                <span className="font-semibold text-[#34c759]">₹0.00</span>
              </div>
              <div className="py-3 flex justify-between text-sm font-bold border-t border-[rgba(60,60,67,0.12)]">
                <span className="text-[#1c1c1e]">Total Payable</span>
                <span className="text-[#007aff]">₹4,000.00</span>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-bold text-[#1c1c1e] tracking-tight mb-1">
              Confirm Payment
            </h2>
            <p className="text-xs text-[#48484a] mb-4">
              Enter the transaction UTR number from your payment app.
            </p>

            <form onSubmit={handlePaymentConfirm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#48484a] uppercase tracking-[0.06em] mb-1.5">
                  Transaction Ref ID / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 340912784589"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-[14px] bg-[#f2f2f7] border border-transparent py-3 px-4 text-sm text-[#1c1c1e] placeholder-[#636366] outline-none transition focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/15"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-[14px] bg-[#007aff] hover:bg-[#0066d6] text-white font-semibold text-xs transition active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying Transaction...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} strokeWidth={2.2} />
                      Verify & Activate Plan
                    </>
                  )}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[rgba(60,60,67,0.12)]"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-[#636366] uppercase font-bold">
                    Or
                  </span>
                  <div className="flex-grow border-t border-[rgba(60,60,67,0.12)]"></div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppConfirm}
                  className="w-full py-3 rounded-[14px] bg-[#34c759] hover:bg-[#28a745] text-white font-semibold text-xs transition active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} strokeWidth={2.2} />
                  Confirm on WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Assurance Notice */}
          <div className="rounded-[16px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)] p-4 flex gap-3 items-start">
            <CheckCircle2 size={18} className="text-[#34c759] mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed text-[#48484a]">
              Upgrades are processed securely. In case of any payment question, our team verifies and activates your quota within minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
