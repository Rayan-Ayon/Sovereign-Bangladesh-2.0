import React, { useState, useMemo } from 'react';
import {
  Ship,
  GraduationCap,
  FileSpreadsheet,
  Zap,
  Database,
  CircleDollarSign,
  Shirt,
  HeartPulse,
  Sprout,
  Cpu,
  Scale,
  Radio,
  CheckSquare,
  Waves,
  Award,
  ShieldAlert,
  Train,
  PlaneTakeoff,
  Anchor,
  Building,
  ShieldCheck,
  Sparkles,
  Gem,
  BookOpen,
  Search,
  ArrowRight,
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Ministry } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { formatDollar, formatNumberBn } from '../lib/crypto';

interface MinistryMatrixProps {
  ministries: Ministry[];
  currentLocale: Locale;
  onSelectMinistry: (slug: string) => void;
  selectedMinistrySlug?: string | null;
}

// Icon mapper
const ICON_MAP: Record<string, React.ElementType> = {
  Ship,
  GraduationCap,
  FileSpreadsheet,
  Zap,
  Database,
  CircleDollarSign,
  Shirt,
  HeartPulse,
  Sprout,
  Cpu,
  Scale,
  Radio,
  CheckSquare,
  Waves,
  Award,
  ShieldAlert,
  Train,
  PlaneTakeoff,
  Anchor,
  Building,
  ShieldCheck,
  Sparkles,
  Gem,
  BookOpen
};

export const MinistryMatrix: React.FC<MinistryMatrixProps> = ({
  ministries,
  currentLocale,
  onSelectMinistry,
  selectedMinistrySlug
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'All', label: t.filter_all },
    { id: 'Infrastructure', label: t.filter_infrastructure },
    { id: 'Economy', label: t.filter_economy },
    { id: 'Governance', label: t.filter_governance },
    { id: 'Human Capital', label: t.filter_human_capital },
    { id: 'Technology', label: t.filter_tech }
  ];

  const filteredMinistries = useMemo(() => {
    return ministries.filter((m) => {
      const matchesCategory =
        activeCategory === 'All' || m.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name_en.toLowerCase().includes(q) ||
        m.name_bn.toLowerCase().includes(q) ||
        m.lead_vision_statement.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [ministries, activeCategory, searchQuery]);

  return (
    <section className="py-12 bg-[#0B131B] border-b border-slate-800" id="ministry-matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#B8860B]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#B8860B] font-bold">
                24 Sovereign Domains • $1.49T Total Modelled Capacity
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              {t.matrix_heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {t.matrix_subheading}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "মন্ত্রণালয় বা খাত খুঁজুন..." : "Filter ministries or keywords..."}
              className="w-full bg-[#152232] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#006A4E]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-[#006A4E] text-white shadow-sm ring-1 ring-[#006A4E]'
                  : 'bg-[#152232] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
          {selectedMinistrySlug && (
            <button
              onClick={() => onSelectMinistry('')}
              className="px-2.5 py-1 rounded text-[11px] font-mono text-[#F42A41] hover:bg-red-950/40 border border-red-900/60 ml-auto whitespace-nowrap"
            >
              Reset Sector Filter
            </button>
          )}
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMinistries.map((ministry) => {
            const IconComponent = ICON_MAP[ministry.icon_name] || Building;
            const isSelected = selectedMinistrySlug === ministry.slug;

            return (
              <div
                key={ministry.id}
                onClick={() => onSelectMinistry(isSelected ? '' : ministry.slug)}
                className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#152232] border-[#006A4E] ring-2 ring-[#006A4E]/50 shadow-lg shadow-[#006A4E]/20'
                    : 'bg-[#152232]/80 hover:bg-[#152232] border-slate-800 hover:border-slate-700 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Row: Icon + Category Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0B131B] border border-slate-700/80 flex items-center justify-center text-[#34D399] group-hover:border-[#006A4E] transition">
                      <IconComponent className="w-4 h-4 text-[#34D399]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {ministry.category}
                    </span>
                  </div>

                  {/* Ministry Name */}
                  <h3 className="text-sm font-bold text-white group-hover:text-[#34D399] transition line-clamp-2">
                    {isBn ? ministry.name_bn : ministry.name_en}
                  </h3>

                  {/* Vision Statement */}
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ministry.lead_vision_statement}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{t.stat_gdp_impact}:</span>
                    <span className="font-mono font-bold text-[#B8860B]">
                      {formatDollar(ministry.target_10y_gdp_impact_usd)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#F42A41]" />
                      {isBn ? `${formatNumberBn(ministry.active_bottlenecks_count)} জট` : `${ministry.active_bottlenecks_count} Bottlenecks`}
                    </span>
                    <span className="flex items-center gap-1 text-[#34D399]">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      {isBn ? `${formatNumberBn(ministry.open_prs_count)} স্পেক` : `${ministry.open_prs_count} PRs`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
