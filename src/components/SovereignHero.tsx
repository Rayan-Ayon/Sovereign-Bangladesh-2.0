import React from 'react';
import {
  TrendingUp,
  Clock,
  GitPullRequest,
  ArrowRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { Locale, I18N } from '../lib/i18n';
import { formatNumberBn } from '../lib/crypto';

interface SovereignHeroProps {
  currentLocale: Locale;
  onNavigate: (view: string) => void;
  totalProposalsCount: number;
}

export const SovereignHero: React.FC<SovereignHeroProps> = ({
  currentLocale,
  onNavigate,
  totalProposalsCount
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const blitzDay = 142;
  const blitzTotalDays = 1095;
  const blitzPercent = ((blitzDay / blitzTotalDays) * 100).toFixed(1);

  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-18 border-b-2 border-slate-800 bg-[#070D12]">
      {/* Neo-brutalist Architectural Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#152232_1px,transparent_1px),linear-gradient(to_bottom,#152232_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* North Star Eyebrow Tag */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D1620] border-2 border-slate-800 mb-6 shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2 h-2 bg-[#006A4E] ring-2 ring-[#34D399]/40 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#B8860B] font-bold">
              {t.hero_eyebrow}
            </span>
          </div>

          {/* Clean 2-Line Impactful Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            <span className="block text-white">
              {isBn ? 'পদার্থবিজ্ঞান-সীমিত সংস্কার' : 'Physics-Limit Execution'}
            </span>
            <span className="block text-[#34D399] mt-1 sm:mt-2">
              {isBn ? 'সার্বভৌম এআই ডিজিটাল পাবলিক অবকাঠামো' : 'Sovereign AI Digital Public Rails'}
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.hero_subheadline}
          </p>

          {/* Horizontally Aligned Identical-Height Brutalist CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Primary Action */}
            <button
              onClick={() => onNavigate('new-proposal')}
              className="h-12 px-6 rounded-sm bg-[#006A4E] hover:bg-[#00543e] text-white text-xs sm:text-sm font-bold font-mono tracking-tight border-2 border-[#34D399] shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2.5"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>{isBn ? 'অচলাবস্থার তথ্য পেশ করুন (এনক্রিপ্টেড) →' : 'Submit Industry Bottleneck (Encrypted) →'}</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => onNavigate('ministries')}
              className="h-12 px-6 rounded-sm bg-[#0D1620] hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold font-mono tracking-tight border-2 border-slate-700 shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#B8860B]" />
              <span>{t.btn_explore_ministries}</span>
            </button>
          </div>
        </div>

        {/* 3 Neo-Brutalist Metric Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 10-Year GDP Target ($1.05T) */}
          <div className="relative bg-[#0D1620] border-2 border-slate-800 border-t-4 border-t-[#B8860B] rounded-sm p-6 shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#B8860B]" />
                {t.metric_target_title}
              </span>
              <span className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/40 font-bold">
                2026–2035 Horizon
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {isBn ? '$১,০৫০,০০০,০০০,০০০' : '$1,050,000,000,000'}
              </span>
              <span className="text-xs font-mono text-[#34D399] font-bold">
                (+$1.05T)
              </span>
            </div>

            <div className="text-xs text-slate-400 leading-snug">
              {t.metric_target_sub} •{' '}
              <span className="text-slate-300 font-mono font-semibold">
                {isBn ? formatNumberBn('24') : '24'} {isBn ? 'মন্ত্রণালয় সমন্বিত' : 'Sovereign Sectors'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Dynamic Projection</span>
              <span className="text-[#34D399] flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
                Active Model v2.4
              </span>
            </div>
          </div>

          {/* Card 2: 3-Year Cash Blitz Tracker */}
          <div className="relative bg-[#0D1620] border-2 border-slate-800 border-t-4 border-t-[#006A4E] rounded-sm p-6 shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#34D399]" />
                {t.metric_blitz_title}
              </span>
              <span className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-[#006A4E]/20 text-[#34D399] border border-[#006A4E] font-bold">
                {blitzPercent}% Complete
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {isBn ? `${formatNumberBn(blitzDay)} / ${formatNumberBn(blitzTotalDays)} দিন` : `Day ${blitzDay} of ${blitzTotalDays}`}
              </span>
            </div>

            {/* Brutalist Sharp Progress Bar */}
            <div className="w-full bg-[#070D12] h-2.5 mb-2 overflow-hidden border border-slate-800">
              <div
                className="bg-[#006A4E] border-r-2 border-[#34D399] h-full transition-all duration-700"
                style={{ width: `${blitzPercent}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 leading-snug">
              {t.metric_blitz_sub}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Physics Horizon</span>
              <span className="text-slate-200 font-bold">
                {isBn ? `${formatNumberBn(blitzTotalDays - blitzDay)} দিন বাকি` : `${blitzTotalDays - blitzDay} Days Remaining`}
              </span>
            </div>
          </div>

          {/* Card 3: Open Citizen PRs & Merged Specs */}
          <div className="relative bg-[#0D1620] border-2 border-slate-800 border-t-4 border-t-[#059669] rounded-sm p-6 shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                {t.metric_prs_title}
              </span>
              <span className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-bold">
                Git Ratified
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {isBn ? `${formatNumberBn('1420')} টি স্পেক` : '1,420 Merged Specs'}
              </span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                (+{totalProposalsCount} active)
              </span>
            </div>

            <div className="text-xs text-slate-400 leading-snug">
              {t.metric_prs_sub} • Zero rent-seeking
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Commit Protocol</span>
              <span className="text-emerald-400 font-mono font-bold">
                sha-256 validated
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
