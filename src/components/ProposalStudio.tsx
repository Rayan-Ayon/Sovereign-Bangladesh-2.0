import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Send,
  Building2,
  Lock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Ministry, UserIdentityType } from '../lib/types';
import { Locale, I18N } from '../lib/i18n';
import { validateProposalForm, ValidationErrors } from '../lib/validation';
import { generateAnonymousHandle, generatePassphrase, hashPassphrase } from '../lib/crypto';
import { sovereignStore, UserSession } from '../lib/store';

interface ProposalStudioProps {
  ministries: Ministry[];
  currentLocale: Locale;
  session: UserSession;
  onSuccessViewProposal: (proposalId: string) => void;
  onCancel: () => void;
}

export const ProposalStudio: React.FC<ProposalStudioProps> = ({
  ministries,
  currentLocale,
  session,
  onSuccessViewProposal,
  onCancel
}) => {
  const t = I18N[currentLocale];
  const isBn = currentLocale === 'bn';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedProposalId, setSubmittedProposalId] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ministry_id: ministries[0]?.id || 'm-ports',
    title: '',
    existing_bottleneck: '',
    hidden_root_cause: '',
    physics_limit_fix: '',
    estimated_days_to_execute: 14 as number | '',
    projected_economic_roi_usd: 150000000 as number | '',
    identity_type: session.identityType as 'anonymous' | 'verified_expert',
    anonymous_handle: '',
    anonymous_passphrase: '',
    credential_badge: session.identityType === 'verified_expert' ? session.badge : 'Senior Marine Logistics Lead • 12y exp'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Initialize Anonymous credentials on mount
  useEffect(() => {
    const handle = session.identityType === 'anonymous' && session.handleOrName
      ? session.handleOrName
      : generateAnonymousHandle();
    const pass = session.secretPassphrase || generatePassphrase();

    setFormData((prev) => ({
      ...prev,
      anonymous_handle: handle,
      anonymous_passphrase: pass
    }));
  }, [session]);

  const handleNextStep = () => {
    const result = validateProposalForm(formData, currentStep, currentLocale);
    if (result.isValid) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      setErrors(result.errors);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateProposalForm(formData, 4, currentLocale);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // Simulate cryptographic hashing step
      const salt = 'bd2_slt_' + Math.random().toString(36).substring(2, 8);
      await hashPassphrase(formData.anonymous_passphrase, salt);

      const newProp = sovereignStore.addProposal({
        ministry_id: formData.ministry_id,
        title: formData.title.trim(),
        existing_bottleneck: formData.existing_bottleneck.trim(),
        hidden_root_cause: formData.hidden_root_cause.trim(),
        physics_limit_fix: formData.physics_limit_fix.trim(),
        estimated_days_to_execute: Number(formData.estimated_days_to_execute),
        projected_economic_roi_usd: Number(formData.projected_economic_roi_usd),
        identity_type: formData.identity_type as UserIdentityType,
        anonymous_handle: formData.anonymous_handle,
        anonymous_passphrase: formData.anonymous_passphrase,
        credential_badge: formData.credential_badge
      });

      // Update current store session if anonymous
      if (formData.identity_type === 'anonymous') {
        sovereignStore.setSession({
          identityType: 'anonymous',
          handleOrName: formData.anonymous_handle,
          badge: `[Anonymous Protocol ID: #${formData.anonymous_handle.replace(/^Anon-.*-/, '')}]`,
          secretPassphrase: formData.anonymous_passphrase,
          isLoggedIn: true
        });
      }

      setSubmittedProposalId(newProp.id);
    } catch (err: any) {
      setGeneralError(err?.message || 'Failed to submit proposal to sovereign OS.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedProposalId) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-[#152232] border border-[#006A4E] rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#006A4E] via-[#B8860B] to-[#059669]" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#006A4E]/20 border border-[#006A4E] flex items-center justify-center text-[#34D399] shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest font-mono text-[#B8860B] font-bold">
                PR Committed • SHA-256 Ingested
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t.success_title}
              </h2>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            {t.success_desc}
          </p>

          <div className="bg-[#0B131B] rounded-lg p-5 border border-slate-800 space-y-3 font-mono text-xs mb-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Proposal ID:</span>
              <span className="text-[#34D399] select-all font-bold">{submittedProposalId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Author Protocol ID:</span>
              <span className="text-slate-200">
                {formData.identity_type === 'anonymous' ? formData.anonymous_handle : formData.credential_badge}
              </span>
            </div>
            {formData.identity_type === 'anonymous' && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Anonymous Retrieval Passphrase:
                </span>
                <span className="text-white bg-slate-900 p-2.5 rounded border border-slate-700 select-all font-mono">
                  {formData.anonymous_passphrase}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Save this key now. It is required to view your anonymous feedback inbox at <strong>/inbox/anonymous</strong>.
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onSuccessViewProposal(submittedProposalId)}
              className="flex-1 bg-[#006A4E] hover:bg-[#00543e] text-white py-3 px-5 rounded-md font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <span>{t.view_live_proposal}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedProposalId(null);
                setCurrentStep(1);
                setFormData((prev) => ({
                  ...prev,
                  title: '',
                  existing_bottleneck: '',
                  hidden_root_cause: '',
                  physics_limit_fix: ''
                }));
              }}
              className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 py-3 px-5 rounded-md text-xs sm:text-sm font-medium transition"
            >
              {t.submit_another}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006A4E] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#B8860B] font-semibold">
            {t.studio_eyebrow}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {t.studio_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {t.studio_subtitle}
        </p>
      </div>

      {/* Step Progress Bar */}
      <nav aria-label="Proposal Progress" className="mb-8">
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {[
            { num: 1, title: t.step_1, icon: Building2 },
            { num: 2, title: t.step_2, icon: AlertTriangle },
            { num: 3, title: t.step_3, icon: Clock },
            { num: 4, title: t.step_4, icon: TrendingUp }
          ].map((step) => {
            const isPassed = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            const StepIcon = step.icon;

            return (
              <li key={step.num} className="flex flex-col">
                <div
                  className={`h-1.5 rounded-full mb-2 transition-all duration-300 ${
                    isPassed
                      ? 'bg-[#006A4E]'
                      : isCurrent
                      ? 'bg-[#B8860B] ring-2 ring-[#B8860B]/40'
                      : 'bg-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  disabled={step.num > currentStep}
                  className={`text-left p-2 rounded flex flex-col gap-1 transition ${
                    isCurrent
                      ? 'bg-[#152232] border border-slate-700'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <StepIcon
                      className={`w-3.5 h-3.5 ${
                        isPassed
                          ? 'text-[#34D399]'
                          : isCurrent
                          ? 'text-[#B8860B]'
                          : 'text-slate-500'
                      }`}
                    />
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage 0{step.num}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Error Alert */}
      {generalError && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/60 border border-[#F42A41] text-red-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F42A41] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">Execution Interrupted</h4>
            <p>{generalError}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[#152232] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* STAGE 1: MINISTRY ASSIGNMENT */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#34D399] font-bold">
                    {t.stage_01_label}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {t.step_1}
                  </h2>
                </div>

                {/* Ministry Select */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-slate-200">
                    {t.select_ministry_label} <span className="text-[#F42A41]">*</span>
                  </label>
                  <select
                    value={formData.ministry_id}
                    onChange={(e) => setFormData({ ...formData, ministry_id: e.target.value })}
                    className={`w-full bg-[#0B131B] border rounded-md px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E] transition ${
                      errors.ministry_id ? 'border-[#F42A41]' : 'border-slate-700'
                    }`}
                  >
                    <option value="">{t.select_ministry_placeholder}</option>
                    {ministries.map((m) => (
                      <option key={m.id} value={m.id}>
                        {isBn ? m.name_bn : m.name_en} — [10Y Impact: ${(m.target_10y_gdp_impact_usd / 1e9).toFixed(0)}B]
                      </option>
                    ))}
                  </select>
                  {errors.ministry_id && (
                    <p className="text-xs text-[#F42A41] mt-1.5 font-medium">{errors.ministry_id}</p>
                  )}
                </div>

                {/* Proposal Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-slate-200">
                    {t.proposal_title_label} <span className="text-[#F42A41]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t.proposal_title_placeholder}
                    className={`w-full bg-[#0B131B] border rounded-md px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#006A4E] transition ${
                      errors.title ? 'border-[#F42A41]' : 'border-slate-700'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    {errors.title ? (
                      <p className="text-xs text-[#F42A41] font-medium">{errors.title}</p>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Clear, verifiable, and executable subject line (min 15 chars).
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-500">
                      {formData.title.length}/255
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: DIAGNOSTIC GROUND TRUTH */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#34D399] font-bold">
                    {t.stage_02_label}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {t.step_2}
                  </h2>
                </div>

                {/* Existing Bottleneck */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                      {t.bottleneck_label} <span className="text-[#F42A41]">*</span>
                    </label>
                    <span className="text-xs font-mono text-slate-500">
                      {formData.existing_bottleneck.length} chars (min 30)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {t.bottleneck_hint}
                  </p>
                  <textarea
                    rows={4}
                    value={formData.existing_bottleneck}
                    onChange={(e) => setFormData({ ...formData, existing_bottleneck: e.target.value })}
                    placeholder={
                      isBn
                        ? "উদাহরণ: কাভার্ডভ্যান প্রবেশের ক্ষেত্রে গেটে ম্যানুয়াল কাগজের নথি যাচাইয়ে গড়ে ৩৬ ঘণ্টা সময় অপচয় হয়, যা সিন্ডিকেটের জন্য প্রতি ট্রাকে অতিরিক্ত ৪০০০ টাকা চাঁদাবাজির সুযোগ সৃষ্টি করে..."
                        : "e.g., Manual paper gate-passes cause 36-hour container dwell delays at the container terminal, forcing logistics forwarders to pay illicit speed-premiums to syndicate gate-clerks..."
                    }
                    className={`w-full bg-[#0B131B] border rounded-md p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E] leading-relaxed transition ${
                      errors.existing_bottleneck ? 'border-[#F42A41]' : 'border-slate-700'
                    }`}
                  />
                  {errors.existing_bottleneck && (
                    <p className="text-xs text-[#F42A41] mt-1 font-medium">{errors.existing_bottleneck}</p>
                  )}
                </div>

                {/* Hidden Root Cause */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                      {t.root_cause_label} <span className="text-[#F42A41]">*</span>
                    </label>
                    <span className="text-xs font-mono text-slate-500">
                      {formData.hidden_root_cause.length} chars (min 30)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {t.root_cause_hint}
                  </p>
                  <textarea
                    rows={4}
                    value={formData.hidden_root_cause}
                    onChange={(e) => setFormData({ ...formData, hidden_root_cause: e.target.value })}
                    placeholder={
                      isBn
                        ? "উদাহরণ: প্রধান কারণ হলো কাস্টমসের এএসওয়াইকুডা (ASYCUDA) সিস্টেমের সাথে বন্দর টার্মিনাল ডাটাবেজের সরাসরি কোনো এপিআই (API) সংযোগ নেই। ইচ্ছাকৃতভাবে এই ডেটা বিচ্ছিন্ন রাখা হয়েছে যাতে ফিজিক্যাল সাইনিং বজায় থাকে..."
                        : "e.g., The foundational root cause is the deliberate refusal to link the NBR ASYCUDA World SQL server with the port terminal TOS database via an encrypted API, forcing physical ink signatures..."
                    }
                    className={`w-full bg-[#0B131B] border rounded-md p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E] leading-relaxed transition ${
                      errors.hidden_root_cause ? 'border-[#F42A41]' : 'border-slate-700'
                    }`}
                  />
                  {errors.hidden_root_cause && (
                    <p className="text-xs text-[#F42A41] mt-1 font-medium">{errors.hidden_root_cause}</p>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 3: PHYSICS-LIMIT SOLUTION */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#34D399] font-bold">
                    {t.stage_03_label}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {t.step_3}
                  </h2>
                </div>

                {/* Physics Limit Advisory Card with Sovereign Green left-border */}
                <div className="border-l-4 border-l-[#006A4E] bg-[#0B131B] p-4 rounded-r-md border border-slate-800 flex gap-3.5">
                  <Sparkles className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
                      {t.physics_rule_title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.physics_rule_desc}
                    </p>
                  </div>
                </div>

                {/* Physics Limit Fix */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                      {t.physics_label} <span className="text-[#F42A41]">*</span>
                    </label>
                    <span className="text-xs font-mono text-slate-500">
                      {formData.physics_limit_fix.length} chars (min 40)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {t.physics_hint}
                  </p>
                  <textarea
                    rows={4}
                    value={formData.physics_limit_fix}
                    onChange={(e) => setFormData({ ...formData, physics_limit_fix: e.target.value })}
                    placeholder={
                      isBn
                        ? "উদাহরণ: বিদ্যমান অপটিক্যাল ফাইবার এবং আরএফআইডি (RFID) রিডার ব্যবহার করে ক্লাউড-গেটেড অটোমেশন চালু করা। সার্ভার কনফিগারেশন এবং ওসিআর (OCR) ক্যামেরা স্থাপনে প্রকৃত সময় লাগে মাত্র ৭ দিন..."
                        : "e.g., Mount automated RFID and OCR scanning cameras directly to existing gantries, pipe encrypted webhooks to the National Single Window, and auto-dispatch digital yard slots. Physical hardware installation takes exactly 7 days..."
                    }
                    className={`w-full bg-[#0B131B] border rounded-md p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E] leading-relaxed transition ${
                      errors.physics_limit_fix ? 'border-[#F42A41]' : 'border-slate-700'
                    }`}
                  />
                  {errors.physics_limit_fix && (
                    <p className="text-xs text-[#F42A41] mt-1 font-medium">{errors.physics_limit_fix}</p>
                  )}
                </div>

                {/* Estimated Days to Execute */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1 text-slate-200">
                    {t.days_label} <span className="text-[#F42A41]">*</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    {t.days_hint}
                  </p>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min={1}
                      max={730}
                      value={formData.estimated_days_to_execute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimated_days_to_execute: e.target.value === '' ? '' : parseInt(e.target.value, 10)
                        })
                      }
                      className={`w-full bg-[#0B131B] border rounded-md px-4 py-2.5 text-xs sm:text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#006A4E] transition ${
                        errors.estimated_days_to_execute ? 'border-[#F42A41]' : 'border-slate-700'
                      }`}
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-mono text-slate-400">
                      DAYS
                    </div>
                  </div>
                  {errors.estimated_days_to_execute && (
                    <p className="text-xs text-[#F42A41] mt-1.5 font-medium">{errors.estimated_days_to_execute}</p>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 4: ECONOMIC IMPACT & DUAL IDENTITY */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#34D399] font-bold">
                    {t.stage_04_label}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {t.step_4}
                  </h2>
                </div>

                {/* 10-Year Economic ROI */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1 text-slate-200">
                    {t.roi_label} <span className="text-[#F42A41]">*</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    {t.roi_hint}
                  </p>
                  <div className="relative max-w-md">
                    <div className="absolute left-3.5 top-2.5 text-sm font-mono text-[#34D399] font-bold">
                      $
                    </div>
                    <input
                      type="number"
                      min={1000}
                      step={1000000}
                      value={formData.projected_economic_roi_usd}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projected_economic_roi_usd: e.target.value === '' ? '' : parseFloat(e.target.value)
                        })
                      }
                      className={`w-full bg-[#0B131B] border rounded-md pl-8 pr-4 py-2.5 text-xs sm:text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#006A4E] transition ${
                        errors.projected_economic_roi_usd ? 'border-[#F42A41]' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {errors.projected_economic_roi_usd && (
                    <p className="text-xs text-[#F42A41] mt-1.5 font-medium">{errors.projected_economic_roi_usd}</p>
                  )}
                </div>

                {/* Dual Identity Selector */}
                <div className="pt-2">
                  <label className="block text-xs sm:text-sm font-semibold mb-3 text-slate-200">
                    {t.identity_selector_label} <span className="text-[#F42A41]">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option A: Anonymous */}
                    <div
                      onClick={() => setFormData({ ...formData, identity_type: 'anonymous' })}
                      className={`cursor-pointer rounded-lg p-4 border transition-all ${
                        formData.identity_type === 'anonymous'
                          ? 'border-[#006A4E] bg-[#006A4E]/10 ring-1 ring-[#006A4E]'
                          : 'border-slate-800 bg-[#0B131B]/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Fingerprint className="w-5 h-5 text-slate-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {t.identity_anon_title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.identity_anon_desc}
                      </p>
                    </div>

                    {/* Option B: Verified Industry Expert */}
                    <div
                      onClick={() => setFormData({ ...formData, identity_type: 'verified_expert' })}
                      className={`cursor-pointer rounded-lg p-4 border transition-all ${
                        formData.identity_type === 'verified_expert'
                          ? 'border-[#B8860B] bg-[#B8860B]/10 ring-1 ring-[#B8860B]'
                          : 'border-slate-800 bg-[#0B131B]/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {t.identity_verified_title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.identity_verified_desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conditional Credentials fields */}
                {formData.identity_type === 'anonymous' ? (
                  <div className="bg-[#0B131B] border border-dashed border-slate-700 rounded-lg p-4 space-y-3 font-mono">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                        {t.anon_handle_label}
                      </span>
                      <div className="text-xs font-bold text-[#34D399] bg-slate-900 px-3 py-2 rounded border border-slate-800">
                        {formData.anonymous_handle}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                        {t.anon_pass_label}
                      </span>
                      <div className="text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded border border-slate-800 select-all">
                        {formData.anonymous_passphrase}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B131B] border border-slate-800 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-200">
                        {t.verified_badge_label} <span className="text-[#F42A41]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.credential_badge}
                        onChange={(e) => setFormData({ ...formData, credential_badge: e.target.value })}
                        placeholder={t.verified_badge_placeholder}
                        className="w-full bg-[#152232] border border-slate-700 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#006A4E]"
                      />
                      {errors.credential_badge && (
                        <p className="text-xs text-[#F42A41] mt-1">{errors.credential_badge}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Wizard Footer Action Buttons */}
          <div className="bg-[#0B131B] px-6 sm:px-8 py-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.btn_prev}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-md bg-[#006A4E] hover:bg-[#00543e] text-white shadow transition"
                >
                  <span>{t.btn_next}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-md bg-[#006A4E] hover:bg-[#00543e] text-white shadow-lg shadow-[#006A4E]/30 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.btn_submit_spec}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400" />
        <span>{t.footer_audit}</span>
      </footer>
    </div>
  );
};
