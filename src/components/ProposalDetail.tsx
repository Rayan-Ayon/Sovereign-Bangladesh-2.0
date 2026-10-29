import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Clock,
  TrendingUp,
  ThumbsUp,
  Sparkles,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Send,
  ArrowLeft,
  Share2,
  FileCode2,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { Proposal, ProposalComment, CommentStanceType, Ministry } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { formatDollar, formatNumberBn } from '../lib/crypto';
import { calculateConsensus } from '../lib/consensus';
import { validateCommentInput } from '../lib/validation';
import { UserSession } from '../lib/store';

interface ProposalDetailProps {
  proposal: Proposal;
  comments: ProposalComment[];
  ministry?: Ministry;
  currentLocale: Locale;
  session: UserSession;
  onBack: () => void;
  onToggleUpvote: (id: string) => void;
  onToggleCommentHelpful: (proposalId: string, commentId: string) => void;
  onAddComment: (proposalId: string, content: string, stance: CommentStanceType, evidenceUrl?: string) => void;
  onSynthesizeToOS: (proposalId: string) => void;
  onNavigateToBlueprint: (sha?: string) => void;
}

export const ProposalDetail: React.FC<ProposalDetailProps> = ({
  proposal,
  comments,
  ministry,
  currentLocale,
  session,
  onBack,
  onToggleUpvote,
  onToggleCommentHelpful,
  onAddComment,
  onSynthesizeToOS,
  onNavigateToBlueprint
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<{
    bottleneck: boolean;
    rootCause: boolean;
    physicsFix: boolean;
  }>({
    bottleneck: true,
    rootCause: true,
    physicsFix: true
  });

  // Stance filter state
  const [selectedStanceFilter, setSelectedStanceFilter] = useState<string>('all');

  // New comment form state
  const [commentContent, setCommentContent] = useState('');
  const [commentStance, setCommentStance] = useState<CommentStanceType>('nuance');
  const [commentEvidenceUrl, setCommentEvidenceUrl] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  // Compute live deliberation consensus breakdown
  const consensus = useMemo(() => calculateConsensus(comments), [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    if (selectedStanceFilter === 'all') return comments;
    return comments.filter((c) => c.stance === selectedStanceFilter);
  }, [comments, selectedStanceFilter]);

  // Milestone Stages Definition
  const milestones = [
    { id: 'submitted', label: t.milestone_submitted },
    { id: 'ai_scored', label: t.milestone_scored },
    { id: 'community_review', label: t.milestone_debate },
    { id: 'verified_approved', label: t.milestone_verified },
    { id: 'committed_to_os', label: t.milestone_committed }
  ];

  const getMilestoneIndex = (status: string) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'ai_scored':
        return 1;
      case 'community_review':
        return 2;
      case 'verified_approved':
        return 3;
      case 'committed_to_os':
        return 4;
      default:
        return 1;
    }
  };

  const currentMilestoneIndex = getMilestoneIndex(proposal.status);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCommentInput(commentContent, commentStance, currentLocale);
    if (!validation.isValid) {
      setCommentError(validation.error || 'Invalid comment input');
      return;
    }

    setCommentError(null);
    onAddComment(proposal.id, commentContent.trim(), commentStance, commentEvidenceUrl.trim());
    setCommentContent('');
    setCommentEvidenceUrl('');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  const stancePills: { id: CommentStanceType; label: string; color: string; count: number }[] = [
    { id: 'endorse', label: t.stance_endorse, color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', count: consensus.endorseCount },
    { id: 'challenge', label: t.stance_challenge, color: 'text-[#F42A41] border-red-900 bg-red-950/40', count: consensus.challengeCount },
    { id: 'nuance', label: t.stance_nuance, color: 'text-[#B8860B] border-amber-900 bg-amber-950/40', count: consensus.nuanceCount },
    { id: 'evidence_addition', label: t.stance_evidence, color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40', count: consensus.evidenceCount }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'তালিকায় ফিরে যান' : 'Back to Deliberation Stream'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#152232] border border-slate-700 text-xs text-slate-300 hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopiedShare ? 'Link Copied!' : 'Share PR'}</span>
          </button>

          {proposal.git_commit_sha ? (
            <button
              onClick={() => onNavigateToBlueprint(proposal.git_commit_sha)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/70 border border-emerald-700 text-xs font-mono text-emerald-300 hover:bg-emerald-900 transition"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Commit #{proposal.git_commit_sha}</span>
            </button>
          ) : (
            <button
              onClick={() => onSynthesizeToOS(proposal.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-bold transition shadow-sm"
              title="State Assembly review action to commit proposal to live OS"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Synthesize to OS</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split-Pane Container (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN (60% / col-span-7): IMMUTABLE SPECIFICATION           */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Block */}
          <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm p-6 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-none bg-[#070D12] border border-slate-800 text-[#34D399]">
                {isBn ? ministry?.name_bn : ministry?.name_en}
              </span>

              {/* Author Badge */}
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded border flex items-center gap-1.5 ${
                  proposal.author_identity_type === 'verified_expert'
                    ? 'bg-[#006A4E]/15 border-[#006A4E] text-[#34D399]'
                    : 'bg-slate-800 border-dashed border-slate-600 text-slate-300'
                }`}
              >
                {proposal.author_identity_type === 'verified_expert' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                ) : (
                  <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{proposal.author_badge}</span>
              </span>

              <span className="text-xs text-slate-400 font-mono ml-auto">
                v{proposal.version}.0
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {proposal.title}
            </h1>

            {/* Live Milestone Progress Tracker */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-3">
                Sovereign Milestone Verification Pipeline
              </span>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {milestones.map((ms, idx) => {
                  const isDone = idx < currentMilestoneIndex || (idx === currentMilestoneIndex && proposal.status === 'committed_to_os');
                  const isActive = idx === currentMilestoneIndex && proposal.status !== 'committed_to_os';

                  return (
                    <div key={ms.id} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-mono mb-1.5 transition-all ${
                          isDone
                            ? 'bg-[#006A4E] text-white shadow-sm ring-1 ring-[#34D399]/40'
                            : isActive
                            ? 'bg-[#B8860B] text-white animate-pulse ring-2 ring-[#B8860B]/60'
                            : 'bg-slate-800 border border-slate-700 text-slate-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-semibold truncate max-w-full ${
                        isDone || isActive ? 'text-slate-200' : 'text-slate-500'
                      }`}>
                        {ms.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Physics & ROI Metric Chips */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[140px] bg-[#0B131B] border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  PHYSICS DEPLOYMENT LIMIT
                </span>
                <span className="text-base font-mono font-bold text-[#34D399] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {isBn ? `${formatNumberBn(proposal.estimated_days_to_execute)} দিন` : `${proposal.estimated_days_to_execute} Days`}
                </span>
              </div>

              <div className="flex-1 min-w-[140px] bg-[#0B131B] border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  10Y PROJECTED ROI
                </span>
                <span className="text-base font-mono font-bold text-[#B8860B] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {formatDollar(proposal.projected_economic_roi_usd)}
                </span>
              </div>

              <div className="flex-1 min-w-[140px] bg-[#0B131B] border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  $1T ALIGNMENT SCORE
                </span>
                <span className="text-base font-mono font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B8860B]" />
                  {proposal.ai_alignment_score}%
                </span>
              </div>
            </div>

            {/* Upvote & Endorsement Row */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onToggleUpvote(proposal.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition ${
                  proposal.has_upvoted
                    ? 'bg-[#006A4E] text-white shadow-md shadow-[#006A4E]/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{t.btn_upvote} ({isBn ? formatNumberBn(proposal.upvotes_count) : proposal.upvotes_count})</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                Created: {new Date(proposal.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Structured Policy Accordions */}
          <div className="space-y-4">
            
            {/* 1. Existing Bottleneck Accordion */}
            <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm overflow-hidden shadow-[3px_3px_0px_0px_#000]">
              <button
                type="button"
                onClick={() => setOpenSections((prev) => ({ ...prev, bottleneck: !prev.bottleneck }))}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-none bg-[#F42A41]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Section 01
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {t.accordion_bottleneck}
                  </h3>
                </div>
                {openSections.bottleneck ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.bottleneck && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-slate-800 pt-3">
                  <p className="whitespace-pre-line">{proposal.existing_bottleneck}</p>
                </div>
              )}
            </div>

            {/* 2. Hidden Operational Ground Truth Accordion */}
            <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm overflow-hidden shadow-[3px_3px_0px_0px_#000]">
              <button
                type="button"
                onClick={() => setOpenSections((prev) => ({ ...prev, rootCause: !prev.rootCause }))}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-none bg-[#B8860B]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Section 02
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {t.accordion_root_cause}
                  </h3>
                </div>
                {openSections.rootCause ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.rootCause && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-slate-800 pt-3">
                  <p className="whitespace-pre-line">{proposal.hidden_root_cause}</p>
                </div>
              )}
            </div>

            {/* 3. Physics-Limit Engineering Solution (Left border-4 in Sovereign Green) */}
            <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm overflow-hidden shadow-[3px_3px_0px_0px_#000] border-l-4 border-l-[#006A4E]">
              <button
                type="button"
                onClick={() => setOpenSections((prev) => ({ ...prev, physicsFix: !prev.physicsFix }))}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-none bg-[#34D399]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#34D399] font-bold">
                    Section 03 • First-Principles Fix
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {t.accordion_physics}
                  </h3>
                </div>
                {openSections.physicsFix ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.physicsFix && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-slate-800 pt-3">
                  <p className="whitespace-pre-line">{proposal.physics_limit_fix}</p>
                  
                  <div className="mt-4 p-3 bg-[#070D12] border border-slate-800 rounded-sm flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Civil & Technical Engineering Ceiling:</span>
                    <span className="text-[#34D399] font-bold">
                      {isBn ? `${formatNumberBn(proposal.estimated_days_to_execute)} ক্যালেন্ডার দিন` : `${proposal.estimated_days_to_execute} Calendar Days`}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN (40% / col-span-5): STANCE-DRIVEN DELIBERATION       */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Consensus Meter Card */}
          <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                {t.consensus_meter_title}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                consensus.sentimentVerdict === 'High Consensus'
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : consensus.sentimentVerdict === 'Heavily Challenged'
                  ? 'bg-red-950/60 border-red-800 text-red-300'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300'
              }`}>
                {consensus.sentimentVerdict}
              </span>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-slate-400">{t.consensus_score_label}</span>
              <span className="text-2xl font-mono font-bold text-white">
                {consensus.consensusScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>

            {/* Multi-Segment Stacked Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 flex overflow-hidden border border-slate-800 mb-4">
              <div
                style={{ width: `${consensus.endorsePercent}%` }}
                className="bg-[#059669] h-full"
                title={`Endorse: ${consensus.endorsePercent}%`}
              />
              <div
                style={{ width: `${consensus.evidencePercent}%` }}
                className="bg-cyan-500 h-full"
                title={`Evidence: ${consensus.evidencePercent}%`}
              />
              <div
                style={{ width: `${consensus.nuancePercent}%` }}
                className="bg-[#B8860B] h-full"
                title={`Nuance: ${consensus.nuancePercent}%`}
              />
              <div
                style={{ width: `${consensus.challengePercent}%` }}
                className="bg-[#F42A41] h-full"
                title={`Challenge: ${consensus.challengePercent}%`}
              />
            </div>

            {/* Breakdown Legend Chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#0B131B] border border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  {t.stance_endorse}
                </span>
                <span className="text-white font-bold">{consensus.endorseCount}</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#0B131B] border border-slate-800">
                <span className="flex items-center gap-1.5 text-[#F42A41]">
                  <span className="w-2 h-2 rounded-full bg-[#F42A41]" />
                  {t.stance_challenge}
                </span>
                <span className="text-white font-bold">{consensus.challengeCount}</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#0B131B] border border-slate-800">
                <span className="flex items-center gap-1.5 text-[#B8860B]">
                  <span className="w-2 h-2 rounded-full bg-[#B8860B]" />
                  {t.stance_nuance}
                </span>
                <span className="text-white font-bold">{consensus.nuanceCount}</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#0B131B] border border-slate-800">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  {t.stance_evidence}
                </span>
                <span className="text-white font-bold">{consensus.evidenceCount}</span>
              </div>
            </div>
          </div>

          {/* Stance Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
            <button
              onClick={() => setSelectedStanceFilter('all')}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
                selectedStanceFilter === 'all'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-[#152232] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.stance_all} ({comments.length})
            </button>
            {stancePills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedStanceFilter(pill.id)}
                className={`px-2.5 py-1.5 rounded-md transition whitespace-nowrap border ${
                  selectedStanceFilter === pill.id
                    ? `${pill.color} font-bold ring-1 ring-current`
                    : 'bg-[#152232] text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {pill.label} ({pill.count})
              </button>
            ))}
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredComments.length === 0 ? (
              <div className="text-center py-8 bg-[#152232]/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
                No arguments under this stance yet. Be the first to record a technical review below.
              </div>
            ) : (
              filteredComments.map((comment) => {
                const stanceConfig = stancePills.find((p) => p.id === comment.stance);

                return (
                  <div
                    key={comment.id}
                    className="bg-[#0D1620] border border-slate-800 rounded-sm p-4 shadow-[2px_2px_0px_0px_#000] space-y-2.5"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {comment.author_identity_type === 'verified_expert' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                        ) : (
                          <Fingerprint className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] font-mono text-slate-300 font-medium">
                          {comment.author_badge}
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${stanceConfig?.color || 'text-slate-400'}`}>
                        {stanceConfig?.label || comment.stance}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {comment.content}
                    </p>

                    {/* Technical Evidence URL */}
                    {comment.technical_evidence_url && (
                      <div className="pt-1">
                        <a
                          href={comment.technical_evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline bg-[#0B131B] px-2.5 py-1 rounded border border-slate-800 truncate max-w-full"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{comment.technical_evidence_url}</span>
                        </a>
                      </div>
                    )}

                    {/* Footer / Helpful Votes */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => onToggleCommentHelpful(proposal.id, comment.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition ${
                          comment.has_voted_helpful
                            ? 'bg-[#006A4E]/30 text-[#34D399] font-bold'
                            : 'hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{t.btn_helpful} ({comment.helpful_votes})</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Stance Submission Form */}
          <div className="bg-[#0D1620] border-2 border-slate-800 rounded-sm p-5 shadow-[4px_4px_0px_0px_#000]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#34D399]" />
              {t.post_comment_title}
            </h4>

            <form onSubmit={handlePostComment} className="space-y-3">
              {/* Mandatory Stance Selector */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Select Stance <span className="text-[#F42A41]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {stancePills.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setCommentStance(pill.id)}
                      className={`px-3 py-2 rounded-sm text-xs font-mono font-medium border-2 text-left transition ${
                        commentStance === pill.id
                          ? `${pill.color} font-bold shadow-[2px_2px_0px_0px_#000]`
                          : 'bg-[#070D12] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Argument Content */}
              <div>
                <textarea
                  rows={3}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={t.post_comment_placeholder}
                  className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              {/* Optional Technical Evidence URL */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  {t.evidence_url_label}
                </label>
                <input
                  type="url"
                  value={commentEvidenceUrl}
                  onChange={(e) => setCommentEvidenceUrl(e.target.value)}
                  placeholder="https://bpdb.gov.bd/grid-specs/substation-40"
                  className="w-full bg-[#070D12] border-2 border-slate-800 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              {commentError && (
                <p className="text-xs text-[#F42A41] font-mono font-medium">{commentError}</p>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-slate-500">
                  Posting as: <strong className="text-slate-300">{session.handleOrName}</strong>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#006A4E] hover:bg-[#00543e] text-white text-xs font-mono font-bold transition flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.btn_post_stance}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
