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
      icon: CreditCard,
      label: 'Plan',
      value: user?.plan?.toUpperCase() || 'DEMO',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-10">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div
            className="w-10 h-10 rounded-xl bg-blue-100
              text-blue-800 flex items-center justify-center"
          >
            <SettingsIcon size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Settings
            </h1>

            <p className="text-sm text-gray-400 mt-0.5">
              Manage your firm information and account usage
            </p>
          </div>

        </div>

        <div
          className="hidden sm:flex items-center gap-2
            text-[10px] font-bold uppercase tracking-wider
            text-gray-400 bg-white border border-gray-200
            rounded-lg px-3 py-2"
        >
          <ShieldCheck size={13} />
          Account
        </div>

      </div>


      {/* =====================================================
          FIRM INFORMATION
      ====================================================== */}
      <div className="card-base overflow-hidden mb-4">

        <div
          className="px-5 py-4 border-b border-gray-200
            flex items-center gap-3"
        >

          <div
            className="w-8 h-8 rounded-lg bg-blue-100
              text-blue-800 flex items-center justify-center"
          >
            <Building2 size={16} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Firm Information
            </h2>

            <p className="text-[11px] text-gray-400">
              Your registered CHA account details
            </p>
          </div>

        </div>


        <div className="divide-y divide-gray-100">

          {info.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4
                px-5 py-4 hover:bg-gray-50 transition-colors"
            >

              <div
                className="w-9 h-9 rounded-lg bg-gray-100
                  text-gray-500 flex items-center justify-center
                  shrink-0"
              >
                <Icon size={16} />
              </div>

              <div className="w-28 sm:w-36 shrink-0">
                <p
                  className="text-[10px] font-bold
                    uppercase tracking-wider text-gray-400"
                >
                  {label}
                </p>
              </div>

              <p className="text-sm font-bold text-gray-800 truncate">
                {value || '--'}
              </p>

            </div>
          ))}

        </div>

      </div>


      {/* =====================================================
          PLAN + USAGE
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* Plan */}
        <div className="card-base p-5">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div
                className="w-9 h-9 rounded-lg bg-purple-100
                  text-purple-700 flex items-center justify-center"
              >
                <CreditCard size={17} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Current Plan
                </h2>

                <p className="text-[11px] text-gray-400">
                  Your active extraction plan
                </p>
              </div>

            </div>

            <span
              className="text-[10px] font-black px-2.5 py-1
                rounded-full bg-purple-100 text-purple-800"
            >
              {user?.plan?.toUpperCase() || 'DEMO'}
            </span>

          </div>


          <div
            className="rounded-xl bg-gray-50
              border border-gray-100 p-4"
          >

            <div className="flex items-center gap-3">

              <div
                className="w-10 h-10 rounded-lg
                  bg-white border border-gray-200
                  flex items-center justify-center"
              >
                <FileText
                  size={18}
                  className="text-blue-700"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  PDF TO CL
                </p>

                <p className="text-[11px] text-gray-400">
                  AI customs document extraction
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Usage */}
        <div className="card-base p-5">

          <div className="flex items-center gap-3 mb-5">

            <div
              className="w-9 h-9 rounded-lg bg-green-100
                text-green-700 flex items-center justify-center"
            >
              <BarChart3 size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Usage
              </h2>

              <p className="text-[11px] text-gray-400">
                Your extraction activity
              </p>
            </div>

          </div>


          <div className="flex items-center gap-4">

            <div
              className="text-4xl font-black
                text-blue-800"
            >
              {user?.extractionsUsed || 0}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700">
                Extractions used
              </p>

              <p className="text-[11px] text-gray-400 mt-0.5">
                Contact support for plan upgrades
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACCOUNT STATUS
      ====================================================== */}
      <div className="card-base p-5 mb-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className="w-9 h-9 rounded-lg bg-green-100
                text-green-700 flex items-center justify-center"
            >
              <ShieldCheck size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Account Status
              </h2>

              <p className="text-[11px] text-gray-400">
                Your PDF TO CL account is active
              </p>
            </div>

          </div>

          <span
            className="flex items-center gap-1.5
              text-[10px] font-bold uppercase
              px-2.5 py-1 rounded-full
              bg-green-100 text-green-700"
          >
            <span
              className="w-1.5 h-1.5 rounded-full
                bg-green-600"
            />
            Active
          </span>

        </div>

      </div>


      {/* =====================================================
          SUPPORT
      ====================================================== */}
      <div
        className="bg-blue-50 border border-blue-200
          rounded-xl p-5"
      >

        <div className="flex items-start gap-3">

          <div
            className="w-9 h-9 rounded-lg bg-white
              border border-blue-200 text-blue-800
              flex items-center justify-center shrink-0"
          >
            <Phone size={16} />
          </div>

          <div>

            <p className="text-sm font-bold text-blue-900">
              Need help?
            </p>

            <p className="text-xs text-blue-700 mt-1">
              WhatsApp{' '}
              <strong>+91 8160024858</strong>
              {' · '}
              Aman Dana
              {' · '}
              MAPS Tech & AI
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}