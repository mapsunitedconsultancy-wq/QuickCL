import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Clock,
  Search,
  Users,
  Settings,
  LogOut,
  FileText,
  Image as ImageIcon,
  CreditCard,
  Scan,
  ShieldCheck,
} from 'lucide-react';

const navGroups = [
  {
    title: 'EXTRACTION ENGINES',
    links: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/extract', icon: FileText, label: 'PDF Extraction' },
      { to: '/image-extract', icon: ImageIcon, label: 'Image Extraction' },
      { to: '/scanned-extract', icon: Scan, label: 'Scanned PDF Extraction' },
    ],
  },
  {
    title: 'RECORDS & REGISTRIES',
    links: [
      { to: '/history', icon: Clock, label: 'Extraction History' },
      { to: '/hs-lookup', icon: Search, label: 'HS Code Lookup' },
      { to: '/clients', icon: Users, label: 'Client Master' },
    ],
  },
  {
    title: 'ACCOUNT & BILLING',
    links: [
      { to: '/pricing', icon: CreditCard, label: 'Pricing & Plans' },
      { to: '/settings', icon: Settings, label: 'Account Settings' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-[rgba(60,60,67,0.12)] flex flex-col h-screen sticky top-0 shrink-0 select-none z-20">
      {/* ================= BRAND HEADER ================= */}
      <div className="px-5 py-4 border-b border-[rgba(60,60,67,0.1)] bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#007aff] to-[#0051a8] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,122,255,0.25)] shrink-0">
              <FileText size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-[#1c1c1e] tracking-tight leading-tight">
                  QuickCL
                </h1>
                <span className="text-[10px] font-mono font-bold text-[#007aff] bg-[#007aff]/10 border border-[#007aff]/20 px-1.5 py-0.5 rounded-[5px]">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] font-semibold text-[#636366] tracking-wide uppercase mt-0.5">
                MAPS TECH & AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION GROUPS ================= */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 pt-1 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#636366]">
                {group.title}
              </span>
            </div>

            {group.links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#007aff] text-white shadow-[0_2px_8px_rgba(0,122,255,0.25)]'
                      : 'text-[#48484a] hover:text-[#1c1c1e] hover:bg-[#f2f2f7]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      strokeWidth={2.2}
                      className={isActive ? 'text-white' : 'text-[#636366]'}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ================= USER + LOGOUT FOOTER ================= */}
      <div className="p-3 border-t border-[rgba(60,60,67,0.1)] bg-white">
        <div className="rounded-[14px] bg-[#f9f9fb] border border-[rgba(60,60,67,0.08)] p-3 space-y-2.5">
          {/* User Details */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-[#007aff]/10 border border-[#007aff]/20 text-[#007aff] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.firmName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1c1c1e] truncate leading-tight">
                {user?.firmName || 'CHA Workspace'}
              </p>
              <p className="text-[11px] text-[#636366] truncate mt-0.5">
                {user?.email || 'Logged in'}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 rounded-[10px] py-1.5 px-3 text-xs font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 border border-transparent hover:border-[#ff3b30]/20 transition-all active:scale-[0.98]"
            title="Sign out of firm workspace"
          >
            <LogOut size={13} strokeWidth={2.2} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
