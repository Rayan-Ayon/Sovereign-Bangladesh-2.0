import React, { useState } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Globe,
  GitPullRequest,
  Building2,
  FileCode2,
  Bell,
  Menu,
  X,
  PlusCircle,
  Cpu
} from 'lucide-react';
import { Locale, I18N } from '../lib/i18n';
import { UserSession } from '../lib/store';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = I18N[currentLocale];

  const navItems = [
    { id: 'home', label: t.nav_home },
    { id: 'ministries', label: t.nav_ministries },
    { id: 'new-proposal', label: t.nav_submit, icon: PlusCircle, isPrimary: true },
    { id: 'blueprint', label: t.nav_blueprint, icon: FileCode2 },
    { id: 'inbox', label: t.nav_inbox, icon: Bell, badge: unreadCount },
    { id: 'synthesis', label: t.nav_synthesis, icon: Cpu }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B131B]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Bangladesh 2.0 Sovereign Platform"
            >
              <div className="w-8 h-8 rounded-md bg-[#006A4E] border border-[#34D399]/40 flex items-center justify-center text-white shadow-[0_0_12px_rgba(0,106,78,0.4)] transition-transform group-hover:scale-105">
                <span className="font-mono text-sm font-black tracking-wider text-white">২.০</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-base font-sans">
                    {t.brand_title}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] font-semibold uppercase">
                  {t.brand_sub}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    item.isPrimary
                      ? 'bg-[#006A4E] hover:bg-[#00543e] text-white shadow-sm ring-1 ring-[#34D399]/30 mr-1'
                      : isActive
                      ? 'bg-[#152232] text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#F42A41] text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Session Identity + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Identity Badge Button */}
            <button
              onClick={onOpenIdentityModal}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition ${
                session.identityType === 'anonymous'
                  ? 'bg-slate-800/50 border-dashed border-slate-600 text-slate-300 hover:border-slate-400'
                  : 'bg-[#006A4E]/15 border-[#006A4E] text-[#34D399] hover:bg-[#006A4E]/25'
              }`}
              title="Click to switch or inspect cryptographic identity"
            >
              {session.identityType === 'anonymous' ? (
                <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
              )}
              <span className="truncate max-w-[130px] sm:max-w-[160px]">
                {session.handleOrName}
              </span>
            </button>

            {/* Language Switcher Toggle */}
            <div className="flex items-center border border-slate-700 rounded-md p-0.5 bg-[#152232]">
              <button
                type="button"
                onClick={() => onLocaleChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
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
                className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                  currentLocale === 'bn'
                    ? 'bg-[#006A4E] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to Bengali"
              >
                বাংলা
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#152232] border-b border-slate-800 px-4 pt-3 pb-4 space-y-2">
          {/* Identity for Mobile */}
          <div className="pb-2 border-b border-slate-700">
            <button
              onClick={() => {
                onOpenIdentityModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                {session.identityType === 'anonymous' ? (
                  <Fingerprint className="w-4 h-4 text-slate-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                )}
                <span className="text-slate-200 truncate">{session.handleOrName}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase">Change</span>
            </button>
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold transition flex items-center justify-between ${
                  item.isPrimary
                    ? 'bg-[#006A4E] text-white'
                    : isActive
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#F42A41] text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
