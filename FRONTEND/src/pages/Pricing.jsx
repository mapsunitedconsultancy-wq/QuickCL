import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  CreditCard,
  Building,
  HelpCircle
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

  const usagePercent = currentLimit === Infinity 
    ? 0 
    : Math.min(100, Math.round((extractionsUsed / currentLimit) * 100));

  const plans = [
    {
      id: 'demo',
      name: 'Free Plan',
      price: '₹0',
      period: 'forever',
      limit: '40 extractions',
      description: 'Perfect for exploring and trying out AI document extractions.',
      features: [
        '40 AI PDF or Image extractions',
        'Support for BOE & Shipping Bills',
        'Standard accuracy calculations',
        'Client Master database access',
        'Excel & CSV report downloads',
        'Standard whatsapp support'
      ],
      cta: currentPlan === 'demo' ? 'Your Current Plan' : 'Active Plan',
      isCurrent: currentPlan === 'demo',
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹4,000',
      period: 'month',
      limit: '120 extractions',
      description: 'For active logistics and custom brokers needing regular processing.',
      features: [
        '120 AI PDF or Image extractions',
        'Priority AI document parsing queue',
        'Fast response extraction speed',
        'Advanced error resilience',
        'Client Master database access',
        'Direct whatsapp upgrade help',
        'Full CSV/Excel sheet downloads'
      ],
      cta: currentPlan === 'pro' ? 'Your Current Plan' : 'Upgrade to Pro',
      isCurrent: currentPlan === 'pro',
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'Custom',
      period: 'yearly',
      limit: 'Unlimited extractions',
      description: 'Tailored for large CHA firms requiring absolute volume and customization.',
      features: [
        'Unlimited document extractions',
        'Dedicated server processing queue',
        'Custom schemas & fields matching',
        'Custom API integration support',
        '24/7 Dedicated SLA support agent',
        'CHA system automatic integration'
      ],
      cta: currentPlan === 'enterprise' ? 'Your Current Plan' : 'Contact Sales',
      isCurrent: currentPlan === 'enterprise',
      color: 'slate'
    }
  ];

  const handleAction = (planId) => {
    if (planId === 'pro') {
      navigate('/payment?plan=pro');
    } else if (planId === 'enterprise') {
      // Prefilled WhatsApp message
      const phoneNumber = '+918160024858';
      const text = `Hi Aman, I am interested in upgrading my QuickCL account to the Enterprise Plan. My registered email is: ${user?.email || 'N/A'}. Please guide me on the process.`;
      const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* HEADER */}
      <div className="flex flex-col items-center text-center mt-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
          <CreditCard size={24} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Pricing & Plans</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          Choose the plan that fits your business needs. Upgrade instantly to continue extracting customs documents.
        </p>
      </div>

      {/* DYNAMIC USAGE SUMMARY */}
      <div className="card-base p-6 mb-8 border-l-4 border-l-blue-600 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              Active Extraction Quota
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              You are currently on the{' '}
              <strong className="text-blue-900 font-bold uppercase">
                {currentPlan === 'demo' ? 'Free (Demo)' : currentPlan} Plan
              </strong>
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
              <span>Extractions Used: {extractionsUsed}</span>
              <span>Limit: {currentLimit === Infinity ? 'Unlimited' : currentLimit}</span>
            </div>
            {currentLimit === Infinity ? (
              <div className="h-2 rounded-full bg-blue-100 flex items-center">
                <div className="h-2 rounded-full bg-blue-600 w-full animate-pulse" />
              </div>
            ) : (
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    usagePercent > 85 ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PLAN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          let cardBorder = 'border-gray-200';
          let badgeColor = 'bg-gray-100 text-gray-800';
          let ctaClass = 'btn-secondary';

          if (plan.popular) {
            cardBorder = 'border-purple-500 shadow-md ring-1 ring-purple-500';
            badgeColor = 'bg-purple-100 text-purple-800';
            ctaClass = 'btn-primary bg-purple-700 hover:bg-purple-800 w-full';
          } else {
            ctaClass = 'btn-secondary w-full';
          }

          if (plan.isCurrent) {
            ctaClass = 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed w-full font-bold';
          }

          return (
            <div
              key={plan.id}
              className={`card-base flex flex-col p-6 relative bg-white transition-all hover:shadow-lg ${cardBorder}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-600 text-white shadow-sm flex items-center gap-1">
                  Most Popular
                </span>
              )}

              {/* Title & Price */}
              <div className="mb-5">
                <h3 className="text-lg font-black text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-xs text-gray-400">/ {plan.period}</span>
                </div>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 ${badgeColor}`}>
                  {plan.limit}
                </span>
              </div>

              {/* Action Button */}
              <div className="mb-6">
                <button
                  onClick={() => !plan.isCurrent && handleAction(plan.id)}
                  disabled={plan.isCurrent}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${ctaClass}`}
                >
                  {plan.isCurrent && <Check size={16} />}
                  {plan.cta}
                </button>
              </div>

              {/* Features List */}
              <div className="flex-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  What's Included
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <Check size={14} className="text-green-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUPPORT INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">Custom Payment Queries?</h3>
            <p className="text-xs text-blue-700 mt-1 max-w-2xl">
              If you wish to pay using other payment methods (Bank Transfer, Credit Card, GPay directly), 
              or if your organization requires invoice bills for tax filings, please reach out to us at{' '}
              <strong>+91 8160024858</strong> (Aman Dana). We'll set up your CHA system profile instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
