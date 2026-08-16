import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { upgradeUserPlan } from '../api/index.js';
import toast from 'react-hot-toast';
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Send,
  MessageSquare
} from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrLoadError, setQrLoadError] = useState(false);

  const planId = searchParams.get('plan') || 'pro';

  if (planId !== 'pro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-red-600 font-bold">Invalid Plan Selected</p>
        <button onClick={() => navigate('/pricing')} className="btn-secondary mt-4">
          Back to Pricing
        </button>
      </div>
    );
  }

  const handlePaymentConfirm = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter the Transaction ID / Ref No. for verification');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await upgradeUserPlan('pro');
      if (res.data) {
        // Update user context
        updateUser({
          plan: res.data.plan,
          extractionsUsed: res.data.extractionsUsed
        });

        toast.success('Payment Received! Plan upgraded to PRO successfully.', {
          duration: 4000
        });

        navigate('/pricing');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Upgrade failed. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="max-w-4xl mx-auto pb-12">
      {/* HEADER & BACK LINK */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/pricing')}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900">Checkout & Payment</h1>
          <p className="text-xs text-gray-400">Complete your transaction to activate your upgrade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* LEFT COLUMN: QR CODE DISPLAY */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="card-base p-6 bg-white flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-black text-gray-800 mb-1">UPI QR Code</h2>
            <p className="text-[11px] text-gray-400 mb-6">Scan and pay ₹4,000 using GPay, PhonePe, Paytm or BHIM</p>

            {/* QR Code Container */}
            <div className="w-64 h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden mb-6 p-2">
              {!qrLoadError ? (
                <img
                  src="/src/assets/payment_qr.jpeg"
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                  onError={() => setQrLoadError(true)}
                />
              ) : (
                <div className="flex flex-col items-center p-4">
                  <QrCode size={48} className="text-gray-300 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-gray-700">QR Code Placeholder</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                    To display your QR code here, place your QR code image file at:
                  </p>
                  <code className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono mt-2 select-all max-w-[220px] truncate">
                    FRONTEND/src/assets/payment_qr.png
                  </code>
                </div>
              )}
            </div>

            {/* UPI Details Card */}
            <div className="w-full rounded-xl bg-gray-50 border border-gray-100 p-4 text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Merchant Details</p>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payee Name:</span>
                  <span className="font-bold text-gray-800">MAPS Tech & AI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">UPI ID:</span>
                  <span className="font-bold text-blue-800 select-all">8160024858@upi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="font-black text-green-700">₹4,000 INR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIRMATION FORM */}
        <div className="md:col-span-5 flex flex-col gap-4">

          {/* Plan Invoice Card */}
          <div className="card-base p-5 bg-white">
            <h2 className="text-sm font-black text-gray-800 mb-3">Order Summary</h2>
            <div className="divide-y divide-gray-100">
              <div className="py-2.5 flex justify-between text-xs">
                <span className="text-gray-500 font-medium">QuickCL Pro Plan (120 Limit)</span>
                <span className="font-bold text-gray-800">₹4,000.00</span>
              </div>
              <div className="py-2.5 flex justify-between text-xs">
                <span className="text-gray-500 font-medium">Platform Fee & Taxes</span>
                <span className="font-bold text-gray-500">₹0.00</span>
              </div>
              <div className="py-3 flex justify-between text-sm font-black border-t border-gray-200">
                <span className="text-gray-800">Total Payable</span>
                <span className="text-blue-900">₹4,000.00</span>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <div className="card-base p-5 bg-white">
            <h2 className="text-sm font-black text-gray-800 mb-2">Confirm Payment</h2>
            <p className="text-[11px] text-gray-400 mb-4">
              Enter your transaction details below to verify and activate your Pro Plan instantly.
            </p>

            <form onSubmit={handlePaymentConfirm} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Transaction Ref ID / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 340912784589"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input-field placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Activating Plan...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Verify & Activate Plan
                    </>
                  )}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-black">Or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppConfirm}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Confirm on WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Quick Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-2.5 items-start">
            <CheckCircle2 size={16} className="text-blue-700 mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed text-gray-500">
              Your safety is our priority. Upgrades are protected under refund policies.
              The activation is instant upon entering a valid transaction verification number.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
