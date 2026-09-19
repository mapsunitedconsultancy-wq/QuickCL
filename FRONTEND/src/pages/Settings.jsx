import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Building2,
  Phone,
  Mail,
  CreditCard,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Crown,
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  const info = [
    {
      icon: Building2,
      label: 'Firm Name',
      value: user?.firmName,
    },
    {
      icon: Mail,
      label: 'Email',
      value: user?.email,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: user?.phone,
    },
    {
      icon: FileText,
      label: 'GST Number',
      value: user?.gstNumber,
    },
    {
      icon: CreditCard,
      label: 'Plan',
      value: user?.plan?.toUpperCase() || 'DEMO',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ================= HERO (Apple HIG) ================= */}
      <div className="relative overflow-hidden rounded-[20px] bg-white p-7 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(60,60,67,0.12)]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1 text-xs font-semibold text-[#1c1c1e]">
            <SettingsIcon size={14} className="text-[#007aff]" strokeWidth={2.2} />
            Account & System Configuration
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1c1e]">
            Settings
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#48484a] leading-relaxed">
            Manage your registered firm profile, active subscription plan, and customs document extraction quota.
          </p>
        </div>
      </div>

      {/* ================= FIRM INFORMATION ================= */}
      <div className="overflow-hidden rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[rgba(60,60,67,0.1)] bg-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <Building2 size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Firm Information
              </h2>
              <p className="text-xs text-[#48484a]">
                Your registered Customs Brokerage / CHA account details
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full bg-[rgba(60,60,67,0.08)] text-[#48484a]">
            Verified
          </span>
        </div>

        <div className="divide-y divide-[rgba(60,60,67,0.06)]">
          {info.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#f9f9fb]"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#f2f2f7] text-[#48484a] flex items-center justify-center shrink-0">
                <Icon size={16} strokeWidth={2.2} />
              </div>

              <div className="w-32 sm:w-44 shrink-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#636366]">
                  {label}
                </p>
              </div>

              <p className="text-sm font-semibold text-[#1c1c1e] truncate flex-1">
                {value || '--'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PLAN + USAGE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Plan Card */}
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
                <Crown size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                  Subscription Tier
                </h2>
                <p className="text-xs text-[#48484a]">
                  Your active extraction package
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20">
              {user?.plan?.toUpperCase() || 'DEMO'}
            </span>
          </div>

          <div className="rounded-[16px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.1)] flex items-center justify-center shadow-2xs">
                <FileText size={18} className="text-[#007aff]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1c1c1e]">
                  QuickCL Engine
                </p>
                <p className="text-xs text-[#48484a]">
                  High-accuracy customs document extraction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Card */}
        <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <BarChart3 size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Usage Analytics
              </h2>
              <p className="text-xs text-[#48484a]">
                Total documents processed to date
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-4xl font-bold tracking-tight text-[#1c1c1e]">
              {user?.extractionsUsed || 0}
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1c1c1e]">
                Extractions utilized
              </p>
              <p className="text-xs text-[#636366] mt-0.5">
                Upgrades take effect immediately upon request
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACCOUNT STATUS ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shadow-2xs">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1c1e] tracking-tight">
                Account Status
              </h2>
              <p className="text-xs text-[#48484a]">
                Your QuickCL workspace is in good standing
              </p>
            </div>
          </div>

          <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#34c759]/15 text-[#28a745] border border-[#34c759]/30">
            <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            Active
          </span>
        </div>
      </div>

      {/* ================= SUPPORT ================= */}
      <div className="rounded-[20px] border border-[rgba(60,60,67,0.12)] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[12px] bg-white border border-[rgba(60,60,67,0.18)] text-[#1c1c1e] flex items-center justify-center shrink-0 shadow-2xs">
            <Phone size={18} strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-sm font-bold text-[#1c1c1e]">
              Need Help or Technical Support?
            </p>
            <p className="text-xs text-[#48484a] mt-1 leading-relaxed">
              Connect via WhatsApp at{' '}
              <strong className="text-[#1c1c1e]">+91 8160024858</strong> (Aman Dana · MAPS Tech & AI).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
