import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  GitPullRequest,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
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

  // Live micro-clock tick simulation for economic momentum
  const [economicClockOffset, setEconomicClockOffset] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEconomicClockOffset((prev) => (prev + 34.5) % 1000);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const blitzDay = 142;
  const blitzTotalDays = 1095;
  const blitzPercent = ((blitzDay / blitzTotalDays) * 100).toFixed(1);

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-800 bg-gradient-to-b from-[#0B131B] via-[#101b26] to-[#0B131B]">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* North Star Eyebrow Tag */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006A4E]/15 border border-[#006A4E]/40 mb-4 shadow-[0_0_15px_rgba(0,106,78,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#006A4E] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#B8860B] font-bold">
              {t.hero_eyebrow}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {t.hero_headline}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.hero_subheadline}
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('new-proposal')}
              className="px-5 py-3 rounded-lg bg-[#006A4E] hover:bg-[#00543e] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#006A4E]/30 flex items-center gap-2 transition transform active:scale-95"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>{t.btn_submit_bottleneck}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('ministries')}
              className="px-5 py-3 rounded-lg bg-[#152232] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
            >
              <Layers className="w-4 h-4 text-[#B8860B]" />
              <span>{t.btn_explore_ministries}</span>
            </button>

            <button
              onClick={() => onNavigate('blueprint')}
              className="px-4 py-3 rounded-lg bg-transparent hover:bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 text-xs sm:text-sm font-mono flex items-center gap-1.5 transition"
            >
              <GitPullRequest className="w-4 h-4 text-slate-400" />
              <span>{t.btn_view_blueprint}</span>
            </button>
          </div>
        </div>

        {/* 3 Core Metric Cards (Trillion Dollar Clock, Blitz, PRs) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: 10-Year GDP Target ($1.05T) */}
          <div className="relative group bg-[#152232]/80 hover:bg-[#152232] border border-slate-700/80 hover:border-[#B8860B]/70 rounded-xl p-5 shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] to-[#F59E0B] rounded-t-xl" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#B8860B]" />
                {t.metric_target_title}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#B8860B]/20 text-[#F59E0B] border border-[#B8860B]/40 font-bold">
                2026-2035 Horizon
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
              <span className="text-slate-300 font-mono">
                {isBn ? formatNumberBn('24') : '24'} {isBn ? 'মন্ত্রণালয় সমন্বিত' : 'Sovereign Sectors'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Dynamic Projection</span>
              <span className="text-[#34D399] flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
                Active Model v2.4
              </span>
            </div>
          </div>

          {/* Card 2: 3-Year Cash Blitz Tracker */}
          <div className="relative group bg-[#152232]/80 hover:bg-[#152232] border border-slate-700/80 hover:border-[#006A4E] rounded-xl p-5 shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006A4E] to-[#34D399] rounded-t-xl" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                {t.metric_blitz_title}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#006A4E]/20 text-[#34D399] border border-[#006A4E]/40 font-bold">
                {blitzPercent}% Complete
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {isBn ? `${formatNumberBn(blitzDay)} / ${formatNumberBn(blitzTotalDays)} দিন` : `Day ${blitzDay} of ${blitzTotalDays}`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-[#006A4E] via-[#059669] to-[#34D399] h-2 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                style={{ width: `${blitzPercent}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 leading-snug">
              {t.metric_blitz_sub}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Physics Horizon</span>
              <span className="text-slate-200">
                {isBn ? `${formatNumberBn(blitzTotalDays - blitzDay)} দিন বাকি` : `${blitzTotalDays - blitzDay} Days Remaining`}
              </span>
            </div>
          </div>

          {/* Card 3: Open Citizen PRs & Merged Specs */}
          <div className="relative group bg-[#152232]/80 hover:bg-[#152232] border border-slate-700/80 hover:border-emerald-500 rounded-xl p-5 shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#059669] to-[#10B981] rounded-t-xl" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                {t.metric_prs_title}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-bold">
                Git Ratified
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {isBn ? `${formatNumberBn('1420')} টি স্পেক` : '1,420 Merged Specs'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                (+{totalProposalsCount} active)
              </span>
            </div>

            <div className="text-xs text-slate-400 leading-snug">
              {t.metric_prs_sub} • Zero rent-seeking
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Commit Protocol</span>
              <span className="text-emerald-400 font-mono font-semibold">
                sha-256 validated
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
