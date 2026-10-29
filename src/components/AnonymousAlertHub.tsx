import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Bell,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import { AnonymousNotification } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { sovereignStore, UserSession } from '../lib/store';

interface AnonymousAlertHubProps {
  notifications: AnonymousNotification[];
  currentLocale: Locale;
  session: UserSession;
  onSelectProposal: (proposalId: string) => void;
  onNavigateToBlueprint: () => void;
}

export const AnonymousAlertHub: React.FC<AnonymousAlertHubProps> = ({
  notifications,
  currentLocale,
  session,
  onSelectProposal,
  onNavigateToBlueprint
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [inputHandle, setInputHandle] = useState(
    session.identityType === 'anonymous' ? session.handleOrName : 'Anon-BayBengal-409'
  );
  const [inputPassphrase, setInputPassphrase] = useState(session.secretPassphrase || '');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const filteredNotifs = notifications.filter(
    (n) => !inputHandle || n.recipient_handle.toLowerCase() === inputHandle.toLowerCase()
  );

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHandle.trim()) {
      setAuthError('Please enter an anonymous handle');
      return;
    }
    if (!inputPassphrase.trim()) {
      setAuthError('Secret passphrase is required');
      return;
    }

    setAuthError(null);
    setIsUnlocked(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-3.5 h-3.5 text-[#B8860B]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#B8860B] font-bold">
            Zero-Trace Cryptographic Inbox Protocol
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {t.inbox_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {t.inbox_subtitle}
        </p>
      </div>

      {/* Decryption Auth Gate */}
      <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm p-6 shadow-[4px_4px_0px_0px_#000] mb-8">
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#34D399]" />
              Cryptographic Session Keys
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Zero PII stored on servers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Anonymous Protocol Handle
              </label>
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                placeholder={t.inbox_handle_placeholder}
                className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm px-3 py-2 text-xs font-mono text-[#34D399] focus:outline-none focus:border-[#006A4E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Secret Passphrase
              </label>
              <input
                type="password"
                value={inputPassphrase}
                onChange={(e) => setInputPassphrase(e.target.value)}
                placeholder={t.inbox_pass_placeholder}
                className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#006A4E]"
              />
            </div>
          </div>

          {authError && (
            <p className="text-xs text-[#F42A41] font-mono font-medium">{authError}</p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-mono font-bold rounded-sm border-2 border-slate-900 transition flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{t.btn_unlock_inbox}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Stream */}
      {isUnlocked && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Bell className="w-4 h-4 text-[#34D399]" />
              <span>{t.notifications_found}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Handle: <strong className="text-[#34D399]">{inputHandle}</strong>
            </span>
          </div>

          {filteredNotifs.length === 0 ? (
            <div className="bg-[#0D1620] border-2 border-dashed border-slate-800 rounded-sm p-8 text-center text-xs font-mono text-slate-400">
              {t.no_notifications}
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`bg-[#0D1620] border-2 rounded-sm p-5 shadow-[3px_3px_0px_0px_#000] transition-all ${
                  notif.is_read ? 'border-slate-800 opacity-90' : 'border-[#006A4E]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-sm bg-[#006A4E]/20 border border-[#006A4E] flex items-center justify-center text-[#34D399]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {notif.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        Proposal: <strong className="text-slate-200">{notif.proposal_title}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2 pl-9">
                  {notif.message}
                </p>

                {/* Blueprint Chapter Reference */}
                <div className="mt-3.5 pl-9 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="p-2 rounded-sm bg-[#070D12] border border-slate-800 text-[11px] text-slate-400">
                    <span className="text-[#B8860B] font-bold">Ratified Spec: </span>
                    <span>{notif.blueprint_section_reference}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProposal(notif.proposal_id)}
                      className="px-3 py-1.5 rounded-sm bg-[#070D12] hover:bg-slate-800 border-2 border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                    >
                      <span>Deliberation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={onNavigateToBlueprint}
                      className="px-3 py-1.5 rounded-sm bg-[#006A4E]/20 hover:bg-[#006A4E]/30 border-2 border-[#006A4E] text-[#34D399] text-xs font-mono font-bold flex items-center gap-1 transition shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                    >
                      <FileCode2 className="w-3 h-3" />
                      <span>Blueprint</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
