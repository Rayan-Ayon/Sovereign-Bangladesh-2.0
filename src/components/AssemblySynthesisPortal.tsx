import React, { useState } from 'react';
import {
  Cpu,
  GitPullRequest,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCode2,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Proposal, Ministry } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { formatDollar, formatNumberBn } from '../lib/crypto';
import { sovereignStore } from '../lib/store';

interface AssemblySynthesisPortalProps {
  proposals: Proposal[];
  ministries: Ministry[];
  currentLocale: Locale;
  onSynthesizeProposal: (proposalId: string) => void;
  onNavigateToBlueprint: (sha: string) => void;
  onSelectProposal: (proposalId: string) => void;
}

export const AssemblySynthesisPortal: React.FC<AssemblySynthesisPortalProps> = ({
  proposals,
  ministries,
  currentLocale,
  onSynthesizeProposal,
  onNavigateToBlueprint,
  onSelectProposal
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [synthesizingId, setSynthesizingId] = useState<string | null>(null);
  const [lastCommittedSha, setLastCommittedSha] = useState<string | null>(null);

  const eligibleProposals = proposals.filter((p) => p.status !== 'committed_to_os');
  const committedProposals = proposals.filter((p) => p.status === 'committed_to_os');

  const handleSynthesize = (id: string) => {
    setSynthesizingId(id);
    setTimeout(() => {
      const commit = sovereignStore.synthesizeAndCommit(id);
      if (commit) {
        setLastCommittedSha(commit.sha);
      }
      setSynthesizingId(null);
    }, 800);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-4 h-4 text-[#B8860B]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#B8860B] font-bold">
            State Systems Architect & AI Synthesis Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {t.synthesis_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          {t.synthesis_subtitle}
        </p>
      </div>

      {/* Success Notification Banner if commit occurred */}
      {lastCommittedSha && (
        <div className="mb-6 p-4 rounded-sm bg-emerald-950/80 border-2 border-emerald-600 text-emerald-200 flex items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                Specification Successfully Ratified & Merged!
              </h4>
              <p className="text-xs text-emerald-300 font-mono">
                Git Commit SHA: <strong>#{lastCommittedSha}</strong> has been written to the master blueprint.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToBlueprint(lastCommittedSha)}
            className="px-3.5 py-1.5 rounded-sm bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-mono font-bold shrink-0 transition border-2 border-emerald-500 shadow-[1px_1px_0px_0px_#000] cursor-pointer"
          >
            Inspect Commit →
          </button>
        </div>
      )}

      {/* Grid of Eligible Proposals */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2 font-mono">
            <GitPullRequest className="w-4 h-4 text-[#34D399]" />
            <span>Specifications Staged for National Ratification ({eligibleProposals.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Clicking synthesize bundles the citizen's 4-part physics diagnosis into an immutable Markdown legislation directive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {eligibleProposals.map((prop) => {
            const isProcessing = synthesizingId === prop.id;
            const ministry = ministries.find((m) => m.id === prop.ministry_id || m.slug === prop.ministry_slug);

            return (
              <div
                key={prop.id}
                className="bg-[#0D1620] border-2 border-slate-800 hover:border-slate-700 rounded-sm p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#070D12] border border-slate-700 text-[#34D399]">
                      {isBn ? ministry?.name_bn : ministry?.name_en}
                    </span>
                    <span className="text-xs font-mono text-[#B8860B] font-bold">
                      {prop.ai_alignment_score}% AI Score
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProposal(prop.id)}
                    className="text-sm sm:text-base font-bold text-white hover:text-[#34D399] transition cursor-pointer line-clamp-2"
                  >
                    {prop.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {prop.physics_limit_fix}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                      {prop.estimated_days_to_execute}d physics limit
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#B8860B]" />
                      {formatDollar(prop.projected_economic_roi_usd)} ROI
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProposal(prop.id)}
                    className="text-xs font-mono text-slate-400 hover:text-white transition"
                  >
                    Review Deliberation ({prop.comments_count})
                  </button>

                  <button
                    onClick={() => handleSynthesize(prop.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-sm bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-bold font-mono transition flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{t.btn_synthesize_commit}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Committed Section */}
        {committedProposals.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-slate-800">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ratified Specifications Merged to OS ({committedProposals.length})</span>
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {committedProposals.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigateToBlueprint(p.git_commit_sha || '')}
                  className="p-3 bg-[#0D1620] hover:bg-slate-900 border-2 border-emerald-900/80 rounded-sm cursor-pointer transition flex items-center justify-between shadow-[2px_2px_0px_0px_#000]"
                >
                  <div className="truncate mr-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                      #{p.git_commit_sha}
                    </span>
                    <span className="text-xs text-slate-200 truncate block">
                      {p.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
