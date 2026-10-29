import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Bell,
  ChevronDown,
  GitCommit,
  Plus,
  FileText,
  KeyRound,
  LogOut,
  ListFilter,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { Locale, I18N } from '../lib/i18n';
import { UserSession, sovereignStore } from '../lib/store';

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  activeView: string;
  onNavigate: (view: string, param?: string) => void;
  session: UserSession;
  onOpenIdentityModal: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocale,
  onLocaleChange,
  activeView,
  onNavigate,
  session,
  onOpenIdentityModal,
  unreadCount
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isBn = currentLocale === 'bn';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handlePurgeSession = () => {
    sovereignStore.setSession({
      identityType: 'anonymous',
      handleOrName: `Anon-Padma-${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')}`,
      badge: '[Anonymous Protocol ID: #FRESH]',
      secretPassphrase: `sec_${Math.random().toString(36).substring(2, 10)}`,
      isLoggedIn: true
    });
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070D12] border-b border-slate-800 text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 h-16 items-center">
          
          {/* ============================================================== */}
          {/* ZONE 1: LEFT BRAND ANCHOR (col-span-3 or 4)                    */}
          {/* ============================================================== */}
          <div className="col-span-6 md:col-span-3 flex items-center gap-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Bangladesh 2.0 Sovereign Platform"
            >
              {/* Flag / Insignia Box */}
              <div className="w-8 h-8 rounded-sm bg-[#006A4E] border border-[#34D399] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                <span className="font-mono text-xs font-black text-white">২.০</span>
              </div>

              {/* Brand Title + Pulse Node + Monospace Sub-badge */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans">
                    BANGLADESH 2.0
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#006A4E] ring-2 ring-[#34D399]/40 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] font-bold uppercase">
                  SOVEREIGN CIVIC OS
                </span>
              </div>
            </button>
          </div>

          {/* ============================================================== */}
          {/* ZONE 2: CENTER PRIMARY NAVIGATION (col-span-5)                 */}
          {/* Minimal text links with subtle bottom-border indicators        */}
          {/* ============================================================== */}
          <nav className="hidden lg:flex col-span-4 items-center justify-center gap-6 h-full">
            <button
              onClick={() => handleNav('home')}
              className={`h-full inline-flex items-center text-xs font-semibold tracking-wide transition border-b-2 px-1 ${
                activeView === 'home'
                  ? 'text-white border-[#006A4E] font-bold'
                  : 'text-slate-400 hover:text-slate-100 border-transparent hover:border-slate-600'
              }`}
            >
              {isBn ? 'সংক্ষিপ্ত রূপরেখা' : 'Overview'}
            </button>

            <button
              onClick={() => handleNav('ministries')}
              className={`h-full inline-flex items-center text-xs font-semibold tracking-wide transition border-b-2 px-1 ${
                activeView === 'ministries'
                  ? 'text-white border-[#006A4E] font-bold'
                  : 'text-slate-400 hover:text-slate-100 border-transparent hover:border-slate-600'
              }`}
            >
              {isBn ? '২৪ মন্ত্রণালয়' : '24 Ministries'}
            </button>

            <button
              onClick={() => handleNav('blueprint')}
              className={`h-full inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide transition border-b-2 px-1 ${
                activeView === 'blueprint'
                  ? 'text-white border-[#006A4E] font-bold'
                  : 'text-slate-400 hover:text-slate-100 border-transparent hover:border-slate-600'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'মাস্টার ব্লুপ্রিন্ট' : 'Master Blueprint'}</span>
            </button>

            <button
              onClick={() => handleNav('synthesis')}
              className={`h-full inline-flex items-center text-xs font-semibold tracking-wide transition border-b-2 px-1 ${
                activeView === 'synthesis'
                  ? 'text-white border-[#006A4E] font-bold'
                  : 'text-slate-400 hover:text-slate-100 border-transparent hover:border-slate-600'
              }`}
            >
              {isBn ? 'এআই অ্যাসেম্বলি' : 'AI Assembly'}
            </button>
          </nav>

          {/* ============================================================== */}
          {/* ZONE 3: FAR-RIGHT UTILITY & IDENTITY HUB (col-span-5)          */}
          {/* Strict Order: 1. Button | 2. Bell | 3. Lang | 4. Profile Chip */}
          {/* ============================================================== */}
          <div className="col-span-6 md:col-span-9 lg:col-span-5 flex items-center justify-end gap-2.5 sm:gap-3">
            
            {/* 1. Primary Action Button (Neo-Brutalist rectangular) */}
            <button
              onClick={() => handleNav('new-proposal')}
              className="px-3 sm:px-4 py-2 rounded-sm bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-bold font-mono tracking-tight border-2 border-[#34D399]/40 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1.5 shrink-0"
              aria-label="Submit Proposal"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? '+ প্রস্তাবনা জমা' : '+ Submit Proposal'}</span>
            </button>

            {/* 2. Notification Bell (Icon-only with crisp crimson badge) */}
            <button
              onClick={() => handleNav('inbox')}
              className="relative p-2 rounded-sm border border-slate-800 bg-[#0D1620] hover:bg-slate-800 text-slate-300 hover:text-white transition focus:outline-none shadow-[1px_1px_0px_0px_#000]"
              aria-label={`Anonymous Inbox: ${unreadCount || 3} unread alerts`}
              title="Anonymous Notification Hub"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-sm text-[10px] font-mono font-bold bg-[#F42A41] text-white border border-[#070D12] shadow-sm leading-tight">
                {unreadCount > 0 ? unreadCount : 3}
              </span>
            </button>

            {/* 3. Language Switcher (Immediately to the left of profile) */}
            <div className="flex items-center border border-slate-800 rounded-sm bg-[#0D1620] p-0.5 shadow-[1px_1px_0px_0px_#000]">
              <button
                type="button"
                onClick={() => onLocaleChange('en')}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded-none transition ${
                  currentLocale === 'en'
                    ? 'bg-[#006A4E] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLocaleChange('bn')}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded-none transition ${
                  currentLocale === 'bn'
                    ? 'bg-[#006A4E] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to Bengali"
              >
                বাংলা
              </button>
            </div>

            {/* 4. User Profile Module (Google-standard Authenticated Chip) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-sm border border-slate-800 bg-[#0D1620] hover:border-slate-700 text-xs font-mono transition focus:outline-none shadow-[1px_1px_0px_0px_#000]"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                aria-label="User Account Menu"
              >
                {/* Circular Avatar / Glyph */}
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  {session.identityType === 'anonymous' ? (
                    <Fingerprint className="w-3.5 h-3.5 text-[#34D399]" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                  )}
                </div>

                {/* User Handle */}
                <span className="hidden sm:inline-block max-w-[120px] lg:max-w-[150px] truncate font-medium text-slate-200">
                  {session.handleOrName}
                </span>

                {/* Dropdown Chevron */}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0D1620] border-2 border-slate-800 rounded-sm shadow-[4px_4px_0px_0px_#000] py-2 z-50 text-xs font-mono">
                  {/* Active Identity Summary */}
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Active Session Profile
                    </span>
                    <span className="font-bold text-white block truncate text-[13px] mt-0.5">
                      {session.handleOrName}
                    </span>
                    <span className="text-[10px] text-[#34D399] flex items-center gap-1 mt-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                      {session.identityType === 'anonymous' ? 'Zero-Trace Cryptographic' : 'Verified Domain Insider'}
                    </span>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleNav('home');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>View My Submissions</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNav('blueprint');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2.5 transition"
                    >
                      <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                      <span>Audit Trail</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenIdentityModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2.5 transition"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Security Passphrase</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 pt-1">
                    <button
                      onClick={handlePurgeSession}
                      className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-[#F42A41] flex items-center gap-2.5 transition font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#F42A41]" />
                      <span>Sign Out / Purge Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-sm border border-slate-800 bg-[#0D1620] text-slate-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1620] border-b border-slate-800 px-4 pt-3 pb-4 space-y-2 text-xs font-mono">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left p-2.5 rounded-sm bg-slate-900 border border-slate-800 text-slate-200"
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('ministries')}
            className="w-full text-left p-2.5 rounded-sm bg-slate-900 border border-slate-800 text-slate-200"
          >
            24 Ministries
          </button>
          <button
            onClick={() => handleNav('blueprint')}
            className="w-full text-left p-2.5 rounded-sm bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-2"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Master Blueprint</span>
          </button>
          <button
            onClick={() => handleNav('synthesis')}
            className="w-full text-left p-2.5 rounded-sm bg-slate-900 border border-slate-800 text-slate-200"
          >
            AI Assembly
          </button>
        </div>
      )}
    </header>
  );
};
