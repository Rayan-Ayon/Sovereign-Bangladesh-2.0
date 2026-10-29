import React, { useState } from 'react';
import {
  GitCommit,
  GitBranch,
  FileCode2,
  FolderTree,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { BlueprintCommit } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';

interface MasterBlueprintViewerProps {
  commits: BlueprintCommit[];
  currentLocale: Locale;
  activeCommitSha?: string;
  onNavigateToProposal?: (proposalId: string) => void;
}

export const MasterBlueprintViewer: React.FC<MasterBlueprintViewerProps> = ({
  commits,
  currentLocale,
  activeCommitSha,
  onNavigateToProposal
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [selectedSha, setSelectedSha] = useState<string>(
    activeCommitSha || commits[0]?.sha || 'a94f1b2'
  );
  const [copied, setCopied] = useState(false);

  const activeCommit = commits.find((c) => c.sha === selectedSha) || commits[0];

  const handleCopySha = (sha: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(sha);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-4 h-4 text-[#34D399]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#34D399] font-bold">
            Branch: main • Sovereign Git Rail BD-OS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {t.blueprint_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          {t.blueprint_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Commit History Log (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
            <span>{t.recent_commits}</span>
            <span className="text-[#34D399]">{commits.length} commits</span>
          </h3>

          <div className="space-y-2">
            {commits.map((c) => {
              const isSelected = c.sha === selectedSha;

              return (
                <div
                  key={c.sha}
                  onClick={() => setSelectedSha(c.sha)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#152232] border-[#006A4E] ring-1 ring-[#006A4E] shadow-md'
                      : 'bg-[#152232]/60 hover:bg-[#152232] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                    <span className="text-[#34D399] font-bold flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5" />
                      #{c.sha}
                    </span>
                    <span className="text-slate-400">
                      {new Date(c.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white line-clamp-2">
                    {c.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 truncate max-w-[150px]">
                      {c.section}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-[#34D399]">+{c.lines_added}</span>
                      <span className="text-[#F42A41]">-{c.lines_removed}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Code Directive & Markdown Spec Viewer (col-span-8) */}
        <div className="lg:col-span-8">
          {activeCommit ? (
            <div className="bg-[#152232] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Commit Meta Strip */}
              <div className="bg-[#0B131B] p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ratified
                  </span>
                  <span className="text-slate-200 font-bold">SHA: {activeCommit.sha}</span>
                  <button
                    onClick={() => handleCopySha(activeCommit.sha)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    title="Copy SHA"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-[#34D399]">Copied</span>}
                </div>

                <div className="text-slate-400">
                  Author: <span className="text-slate-200">{activeCommit.author}</span>
                </div>
              </div>

              {/* Directive Section Header */}
              <div className="p-6 border-b border-slate-800/80 bg-slate-900/40">
                <span className="text-xs font-mono uppercase tracking-wider text-[#B8860B] font-bold block mb-1">
                  {activeCommit.section}
                </span>
                <h2 className="text-lg font-bold text-white">
                  {activeCommit.message}
                </h2>
              </div>

              {/* Spec Document Body (Rendered Markdown Style) */}
              <div className="p-6 text-slate-200 font-sans leading-relaxed text-xs sm:text-sm space-y-4">
                <div className="bg-[#0B131B] border border-slate-800 rounded-lg p-5 font-mono text-xs whitespace-pre-line leading-relaxed text-slate-300 overflow-x-auto">
                  {activeCommit.spec_markdown}
                </div>

                <div className="p-4 rounded-lg bg-[#006A4E]/10 border border-[#006A4E]/30 text-xs text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Zero-Tamper Guarantee:</strong>
                    This operational directive is signed with the National Assembly root key. Any procedural deviation by bureaucratic agencies constitutes a direct violation of Sovereign Public Order.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#152232] rounded-xl border border-slate-800 text-slate-400 text-xs">
              Select a commit from the history rail to view its ratified directive.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
