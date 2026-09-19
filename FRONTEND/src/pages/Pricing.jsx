import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  CreditCard,
  Building,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentPlan = (user?.plan || 'demo').toLowerCase();
  const extractionsUsed = user?.extractionsUsed || 0;

  // Determine current limit based on plan
  let currentLimit = 40;
  if (currentPlan === 'pro') {
    currentLimit = 120;
  } else if (currentPlan === 'enterprise') {
    currentLimit = Infinity;
  }

  const usagePercent =
    currentLimit === Infinity
      ? 0
      : Math.min(100, Math.round((extractionsUsed / currentLimit) * 100));

  const plans = [
    {
      id: 'demo',
      name: 'Free Plan',
      price: '₹0',
      period: 'forever',
      limit: '40 extractions',
      description: 'Perfect for exploring and testing AI customs document extractions.',
      features: [
        '40 AI PDF or Image extractions',
        'Support for BOE & Shipping Bills',
        'Standard accuracy calculations',
        'Client Master database access',
        'Excel & CSV report downloads',
        'Standard community support',
      ],
      cta: currentPlan === 'demo' ? 'Current Plan' : 'Active Plan',
      isCurrent: currentPlan === 'demo',
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹4,000',
      period: 'month',
      limit: '120 extractions',
      description: 'For active logistics and custom brokers needing regular volume.',
      features: [
        '120 AI PDF or Image extractions',
        'Priority AI document parsing queue',
        'Fast response extraction speed',
        'Advanced error resilience',
        'Client Master database access',
        'Direct WhatsApp upgrade help',
        'Full CSV & Excel sheet downloads',
      ],
      cta: currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      isCurrent: currentPlan === 'pro',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'Custom',
      period: 'yearly',
      limit: 'Unlimited extractions',
      description: 'Tailored for large CHA firms requiring high volume and custom integration.',
      features: [
        'Unlimited document extractions',
        'Dedicated server processing queue',
        'Custom schemas & fields matching',
        'Custom API integration support',
        '24/7 Dedicated SLA support agent',
        'CHA system automated workflow',
      ],
      cta: currentPlan === 'enterprise' ? 'Current Plan' : 'Contact Sales',
      isCurrent: currentPlan === 'enterprise',
    },
  ];

  const handleAction = (planId) => {
    if (planId === 'pro') {
      navigate('/payment?plan=pro');
    } else if (planId === 'enterprise') {
      const phoneNumber = '+918160024858';
      const text = `Hi Aman, I am interested in upgrading my QuickCL account to the Enterprise Plan. My registered email is: ${
        user?.email || 'N/A'
      }. Please guide me on the process.`;
      const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#007aff]/8 to-[#af52de]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <CreditCard size={14} className="text-[#007aff]" strokeWidth={2.2} />
            Pricing & Subscription Tiers
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            Transparent, Scale-Ready Plans
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Choose the plan that fits your customs brokerage needs. Upgrade instantly to unlock higher limits and priority document processing.
          </p>
        </div>
      </div>

      {/* ================= ACTIVE USAGE CARD ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1c1c1e] tracking-tight">
                Active Extraction Quota
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full bg-[#007aff]/10 text-[#007aff]">
                {currentPlan === 'demo' ? 'Free Plan' : `${currentPlan.toUpperCase()} Plan`}
              </span>
            </div>
            <p className="text-xs text-[#48484a] mt-1">
              Live consumption tracked across all PDF, Image, and Scanned extractions.
            </p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold text-[#48484a] mb-2">
              <span>Used: <strong className="text-[#1c1c1e]">{extractionsUsed}</strong></span>
              <span>Limit: <strong className="text-[#1c1c1e]">{currentLimit === Infinity ? 'Unlimited' : currentLimit}</strong></span>
            </div>

            {currentLimit === Infinity ? (
              <div className="h-2 rounded-full bg-[#34c759]/20 overflow-hidden">
                <div className="h-2 rounded-full bg-[#34c759] w-full animate-pulse" />
              </div>
            ) : (
              <div className="w-full bg-[#f2f2f7] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    usagePercent > 85 ? 'bg-[#ff3b30]' : 'bg-[#007aff]'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PLAN CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          return (
            <div
              key={plan.id}
              className={`rounded-[20px] flex flex-col p-6 relative bg-white transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] border ${
                plan.popular
                  ? 'border-[#007aff] shadow-[0_2px_16px_rgba(0,122,255,0.12)] ring-2 ring-[#007aff]/20'
                  : 'border-[rgba(60,60,67,0.12)] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.06em] px-3.5 py-1 rounded-full bg-[#007aff] text-white shadow-sm">
                  Most Popular
                </span>
              )}

              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1c1c1e] tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#48484a] mt-1 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#636366]">/ {plan.period}</span>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      plan.popular
                        ? 'bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/20'
                        : 'bg-[#f2f2f7] text-[#48484a]'
                    }`}
                  >
                    {plan.limit}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mb-6">
                <button
                  onClick={() => !plan.isCurrent && handleAction(plan.id)}
                  disabled={plan.isCurrent}
                  className={`w-full py-3 rounded-[14px] text-xs font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                    plan.isCurrent
                      ? 'bg-[#f2f2f7] text-[#636366] border border-[rgba(60,60,67,0.12)] cursor-not-allowed'
                      : plan.popular
                      ? 'bg-[#007aff] hover:bg-[#0066d6] text-white shadow-sm'
                      : 'border border-[rgba(60,60,67,0.15)] bg-[#f2f2f7] text-[#1c1c1e] hover:bg-[#e5e5ea]'
                  }`}
                >
                  {plan.isCurrent && <Check size={14} strokeWidth={2.4} />}
                  {plan.cta}
                </button>
              </div>

              {/* Features List */}
              <div className="flex-1 pt-2 border-t border-[rgba(60,60,67,0.06)]">
                <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-[0.06em] mb-3.5">
                  What's Included
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#1c1c1e]">
                      <div className="w-4 h-4 rounded-full bg-[#34c759]/15 text-[#34c759] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} strokeWidth={2.6} />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SUPPORT INFO ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[14px] bg-[#007aff]/10 text-[#007aff] flex items-center justify-center shrink-0">
            <HelpCircle size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1c1c1e] tracking-tight">
              Enterprise & Custom Billing Questions?
            </h3>
            <p className="text-xs text-[#48484a] mt-1 leading-relaxed max-w-3xl">
              If your organization requires direct bank wire transfer, custom GST tax invoicing, or dedicated high-volume API throughput, reach out to our team at{' '}
              <strong className="text-[#1c1c1e]">+91 8160024858</strong> (Aman Dana). We'll configure your account immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
