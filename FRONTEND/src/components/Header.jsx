import React from 'react';
import {
  FileText,
  PlusCircle,
  LayoutDashboard,
  Image as ImageIcon,
  Search,
  Building2,
  History,
  Settings,
  User,
  ShieldCheck,
  Sparkles,
  FileCheck2
} from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  activeJob,
  firmProfile,
  currentUser,
  onOpenAuth,
  onNewExtraction
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Top Banner / Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            CHA Licence: <span className="text-white font-mono">{firmProfile.chaLicenceNo}</span>
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Default Port:{' '}
            <span className="text-slate-200 font-mono">{firmProfile.customsHousePort}</span>
          </span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-emerald-400 font-medium">
            <Sparkles className="w-3 h-3" />
            Gemini OCR & Tariff AI Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-400">
            Plan: <span className="text-amber-300 font-semibold">{firmProfile.plan}</span> (
            {firmProfile.monthlyExtractionsUsed}/{firmProfile.monthlyLimit} jobs)
          </div>
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-200">
              <User className="w-3 h-3 text-blue-400" />
              <span>{currentUser.name}</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-blue-300 hover:text-white font-medium hover:underline transition-colors"
            >
              Sign In (Firm Acc)
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">PDF to CL</h1>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 font-mono">
                  v2.6 INDIA CHA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Customs Document Extraction & Checklist Generator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={onNewExtraction}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'new-extraction'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-blue-900 hover:bg-blue-100/60 font-bold'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            New Extraction
          </button>

          <button
          onClick={() => setActiveTab('image-extraction')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'image-extraction'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-blue-900 hover:bg-blue-100/60 font-bold'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
          Image Extraction
        </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'results'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Results Workspace
            {activeJob && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('hsn-lookup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hsn-lookup'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            HSN Code Tariff
          </button>

          <button
            onClick={() => setActiveTab('client-master')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'client-master'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Client Master
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}
