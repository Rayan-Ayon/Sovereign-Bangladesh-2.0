import React, { useState } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  X,
  Sparkles,
  Lock,
  Check,
  RefreshCw
} from 'lucide-react';
import { UserSession } from '../lib/store';
import { generateAnonymousHandle, generatePassphrase } from '../lib/crypto';
import { Locale, I18N } from '../lib/i18n';

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
  currentLocale: Locale;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onUpdateSession,
  currentLocale
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'anonymous' | 'verified_expert'>(
    currentSession.identityType === 'anonymous' ? 'anonymous' : 'verified_expert'
  );

  const [anonHandle, setAnonHandle] = useState(
    currentSession.identityType === 'anonymous' ? currentSession.handleOrName : generateAnonymousHandle()
  );
  const [anonPass, setAnonPass] = useState(
    currentSession.secretPassphrase || generatePassphrase()
  );

  const [verifiedBadge, setVerifiedBadge] = useState(
    currentSession.identityType === 'verified_expert'
      ? currentSession.handleOrName
      : 'Senior Maritime Logistics Lead • 12y exp'
  );
  const [verifiedSector, setVerifiedSector] = useState('Ports & Maritime Logistics');

  const handleRegenerateAnon = () => {
    setAnonHandle(generateAnonymousHandle());
    setAnonPass(generatePassphrase());
  };

  const handleSaveAnonymous = () => {
    onUpdateSession({
      identityType: 'anonymous',
      handleOrName: anonHandle,
      badge: `[Anonymous Protocol ID: #${anonHandle.replace(/^Anon-.*-/, '')}]`,
      secretPassphrase: anonPass,
      isLoggedIn: true
    });
    onClose();
  };

  const handleSaveVerified = () => {
    onUpdateSession({
      identityType: 'verified_expert',
      handleOrName: verifiedBadge,
      badge: `[Verified: ${verifiedBadge}]`,
      isLoggedIn: true
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-modal-title"
    >
      <div className="bg-[#0D1620] border-2 border-slate-700 rounded-sm w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_0px_#000] relative">
        {/* Top Header */}
        <div className="p-5 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#B8860B]" />
            <h2 id="identity-modal-title" className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Sovereign Identity Protocol
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-2 bg-[#070D12] p-1.5 rounded-sm border-2 border-slate-800 mb-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab('anonymous')}
              className={`py-2 px-3 rounded-sm font-bold transition flex items-center justify-center gap-1.5 border-2 ${
                activeTab === 'anonymous'
                  ? 'bg-[#006A4E] text-white border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Cryptographic Anonymous</span>
            </button>

            <button
              onClick={() => setActiveTab('verified_expert')}
              className={`py-2 px-3 rounded-sm font-bold transition flex items-center justify-center gap-1.5 border-2 ${
                activeTab === 'verified_expert'
                  ? 'bg-[#B8860B] text-white border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Domain Insider</span>
            </button>
          </div>

          {/* Anonymous Tab Content */}
          {activeTab === 'anonymous' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Zero-trace protocol. No email, phone number, or KYC required. You are identified solely by a randomized regional hash and secret passphrase.
              </p>

              <div className="bg-[#070D12] border-2 border-slate-800 rounded-sm p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Protocol Handle
                  </span>
                  <button
                    onClick={handleRegenerateAnon}
                    className="text-[10px] text-slate-400 hover:text-[#34D399] flex items-center gap-1 transition"
                    title="Generate new random handle"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-[#34D399] bg-[#0D1620] px-3 py-2 rounded-sm border-2 border-slate-800">
                  {anonHandle}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Secret Passphrase
                  </span>
                  <div className="text-xs text-slate-200 bg-[#0D1620] px-3 py-2 rounded-sm border-2 border-slate-800 select-all font-mono">
                    {anonPass}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Keep this key safe to retrieve alerts from <strong>/inbox/anonymous</strong>.
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveAnonymous}
                className="w-full mt-4 py-2.5 px-4 rounded-sm bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-mono font-bold transition border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Assume Cryptographic Anonymous Handle</span>
              </button>
            </div>
          )}

          {/* Verified Expert Tab Content */}
          {activeTab === 'verified_expert' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Industry specialist badge. Your credentials appear beside your policy proposals and counter-evidence in deliberations.
              </p>

              <div>
                <label className="block text-xs font-mono text-slate-200 mb-1">
                  Designation / Credential Badge
                </label>
                <input
                  type="text"
                  value={verifiedBadge}
                  onChange={(e) => setVerifiedBadge(e.target.value)}
                  placeholder="e.g., Senior Port Logistics Lead • 12y exp"
                  className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-200 mb-1">
                  Sector Domain
                </label>
                <input
                  type="text"
                  value={verifiedSector}
                  onChange={(e) => setVerifiedSector(e.target.value)}
                  placeholder="e.g., Ports, Maritime & Trade Logistics"
                  className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              <div className="p-3 bg-[#006A4E]/15 border-2 border-[#006A4E]/40 rounded-sm text-xs text-slate-300 flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#B8860B] shrink-0" />
                <span>Preview: <strong>[Verified: {verifiedBadge}]</strong></span>
              </div>

              <button
                onClick={handleSaveVerified}
                className="w-full mt-4 py-2.5 px-4 rounded-sm bg-[#B8860B] hover:bg-[#996e08] text-white text-xs font-mono font-bold transition border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Authenticate as Verified Domain Insider</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
