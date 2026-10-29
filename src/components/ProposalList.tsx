import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Fingerprint,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Proposal, Ministry } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { formatDollar, formatNumberBn } from '../lib/crypto';

interface ProposalListProps {
  proposals: Proposal[];
  ministries: Ministry[];
  currentLocale: Locale;
  onSelectProposal: (proposalId: string) => void;
  onToggleUpvote: (proposalId: string) => void;
  selectedMinistrySlug?: string | null;
  onClearMinistryFilter?: () => void;
  onCreateNewClick: () => void;
}

export const ProposalList: React.FC<ProposalListProps> = ({
  proposals,
  ministries,
  currentLocale,
  onSelectProposal,
  onToggleUpvote,
  selectedMinistrySlug,
  onClearMinistryFilter,
  onCreateNewClick
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'upvotes' | 'roi' | 'days' | 'newest'>('upvotes');

  const filteredProposals = useMemo(() => {
    let list = proposals.filter((p) => {
      const matchMinistry =
        !selectedMinistrySlug || p.ministry_slug === selectedMinistrySlug;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'committed' && p.status === 'committed_to_os') ||
        (statusFilter === 'approved' && p.status === 'verified_approved') ||
        (statusFilter === 'review' && p.status === 'community_review');
      return matchMinistry && matchStatus;
    });

    list.sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes_count - a.upvotes_count;
      if (sortBy === 'roi') return b.projected_economic_roi_usd - a.projected_economic_roi_usd;
      if (sortBy === 'days') return a.estimated_days_to_execute - b.estimated_days_to_execute;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [proposals, selectedMinistrySlug, statusFilter, sortBy]);

  const activeMinistry = ministries.find((m) => m.slug === selectedMinistrySlug);

  return (
    <section className="py-12 bg-[#070D12]" id="proposals-feed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#006A4E] ring-2 ring-[#34D399]/40 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#34D399] font-bold">
                {isBn ? 'সক্রিয় নীতি সংস্কার তালিকা' : 'Active Structural Policy Stream'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              {activeMinistry
                ? (isBn ? `${activeMinistry.name_bn} প্রস্তাবনাসমূহ` : `${activeMinistry.name_en} Proposals`)
                : (isBn ? 'সকল নাগরিক সংস্কার প্রস্তাবনা' : 'Deliberation Registry')}
            </h2>
            {selectedMinistrySlug && (
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Filtering by: <strong className="text-white">{activeMinistry?.name_en}</strong></span>
                <button
                  onClick={onClearMinistryFilter}
                  className="text-[#F42A41] hover:underline font-bold text-[11px]"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Controls: Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Tabs */}
            <div className="flex items-center border border-slate-800 rounded-sm p-0.5 bg-[#0D1620] text-xs font-mono">
              {[
                { id: 'all', label: isBn ? 'সকল' : 'All' },
                { id: 'committed', label: isBn ? 'ওএসে যুক্ত' : 'Committed' },
                { id: 'approved', label: isBn ? 'অনুমোদিত' : 'Approved' },
                { id: 'review', label: isBn ? 'বিতর্কমান' : 'In Debate' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-3 py-1 rounded-none font-bold transition ${
                    statusFilter === s.id
                      ? 'bg-[#006A4E] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0D1620] border border-slate-800 text-xs font-mono text-slate-200 rounded-sm px-3 py-1.5 focus:outline-none focus:border-[#006A4E]"
            >
              <option value="upvotes">{isBn ? 'সর্বোচ্চ ভোট' : 'Most Upvoted'}</option>
              <option value="roi">{isBn ? 'সর্বোচ্চ ডলার ROI' : 'Highest ROI ($)'}</option>
              <option value="days">{isBn ? 'দ্রুততম পদার্থবিজ্ঞান দিন' : 'Fastest Physics Days'}</option>
              <option value="newest">{isBn ? 'সর্বশেষ' : 'Newest'}</option>
            </select>

            <button
              onClick={onCreateNewClick}
              className="bg-[#006A4E] hover:bg-[#00543e] text-white px-3.5 py-1.5 rounded-sm text-xs font-bold font-mono tracking-tight border border-[#34D399]/40 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1.5"
            >
              <span>{isBn ? '+ নতুন স্পেক' : '+ Submit'}</span>
            </button>
          </div>
        </div>

        {/* Proposals Stream */}
        {filteredProposals.length === 0 ? (
          <div className="text-center py-16 bg-[#0D1620] rounded-sm border-2 border-dashed border-slate-800 mt-6">
            <p className="text-slate-400 text-xs font-mono">
              {isBn ? 'এই খাতের জন্য কোনো প্রস্তাবনা পাওয়া যায়নি।' : 'No proposals found matching the selected filter criteria.'}
            </p>
            <button
              onClick={onCreateNewClick}
              className="mt-4 px-4 py-2 bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-bold font-mono rounded-sm shadow-[2px_2px_0px_0px_#000]"
            >
              {isBn ? 'প্রথম সংস্কার প্রস্তাবনা জমা দিন' : 'Draft First Specification for this Sector'}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredProposals.map((prop) => {
              const ministry = ministries.find((m) => m.id === prop.ministry_id || m.slug === prop.ministry_slug);

              return (
                <div
                  key={prop.id}
                  className="bg-[#0D1620] hover:bg-[#121c28] border-2 border-slate-800 hover:border-slate-700 rounded-sm p-5 shadow-[3px_3px_0px_0px_#000] transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 group"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onSelectProposal(prop.id)}
                  >
                    {/* Top Row: Ministry + Identity Tag + Live Status */}
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#070D12] border border-slate-800 text-[#34D399]">
                        {isBn ? ministry?.name_bn : ministry?.name_en}
                      </span>

                      {/* Identity Chip */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-none border flex items-center gap-1.5 ${
                          prop.author_identity_type === 'verified_expert'
                            ? 'bg-[#006A4E]/15 border-[#006A4E] text-[#34D399]'
                            : 'bg-[#070D12] border-dashed border-slate-700 text-slate-300'
                        }`}
                      >
                        {prop.author_identity_type === 'verified_expert' ? (
                          <ShieldCheck className="w-3 h-3 text-[#B8860B]" />
                        ) : (
                          <Fingerprint className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{prop.author_badge}</span>
                      </span>

                      {/* Status Tag */}
                      {prop.status === 'committed_to_os' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-700 text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          OS Merged #{prop.git_commit_sha}
                        </span>
                      )}
                      {prop.status === 'verified_approved' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#006A4E]/25 border border-[#006A4E] text-[#34D399]">
                          Assembly Approved
                        </span>
                      )}
                      {prop.status === 'community_review' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-amber-950/60 border border-amber-800 text-amber-300">
                          Active Debate
                        </span>
                      )}
                    </div>

                    {/* Proposal Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#34D399] transition tracking-tight">
                      {prop.title}
                    </h3>

                    {/* Bottleneck Summary */}
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed font-normal">
                      <span className="text-[#F42A41] font-semibold font-mono">[Choke Point] </span>
                      {prop.existing_bottleneck}
                    </p>

                    {/* Physics & ROI Badges */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="px-2 py-1 rounded-none bg-[#070D12] border border-slate-800 text-[#34D399] flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                        {isBn ? `${formatNumberBn(prop.estimated_days_to_execute)} দিন পদার্থবিজ্ঞান সীমা` : `${prop.estimated_days_to_execute}-Day Physics Limit`}
                      </span>

                      <span className="px-2 py-1 rounded-none bg-[#070D12] border border-slate-800 text-[#B8860B] flex items-center gap-1.5 font-bold">
                        <TrendingUp className="w-3.5 h-3.5 text-[#B8860B]" />
                        {formatDollar(prop.projected_economic_roi_usd)} ROI
                      </span>

                      <span className="px-2 py-1 rounded-none bg-[#070D12] border border-slate-800 text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#B8860B]" />
                        AI Alignment: <strong className="text-white">{prop.ai_alignment_score}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Voting and Discussion Counter */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleUpvote(prop.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono font-bold border transition ${
                        prop.has_upvoted
                          ? 'bg-[#006A4E] text-white border-[#34D399] shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-[#070D12] hover:bg-slate-800 text-slate-300 border-slate-800 shadow-[1px_1px_0px_0px_#000]'
                      }`}
                      aria-label="Upvote proposal"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isBn ? formatNumberBn(prop.upvotes_count) : prop.upvotes_count}</span>
                    </button>

                    <button
                      onClick={() => onSelectProposal(prop.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-sm bg-[#070D12] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition shadow-[1px_1px_0px_0px_#000]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isBn ? formatNumberBn(prop.comments_count) : prop.comments_count}</span>
                    </button>

                    <button
                      onClick={() => onSelectProposal(prop.id)}
                      className="hidden md:flex items-center gap-1 text-[11px] text-[#34D399] hover:underline font-mono mt-1 font-bold"
                    >
                      <span>Deliberate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
