/**
 * Form validation routines adhering strictly to Bangladesh 2.0 Civic-Intelligence schema
 */

export interface ValidationInput {
  ministry_id: string;
  title: string;
  existing_bottleneck: string;
  hidden_root_cause: string;
  physics_limit_fix: string;
  estimated_days_to_execute: number | '';
  projected_economic_roi_usd: number | '';
  identity_type: 'anonymous' | 'verified_expert';
  anonymous_handle: string;
  anonymous_passphrase: string;
  credential_badge: string;
}

export interface ValidationErrors {
  ministry_id?: string;
  title?: string;
  existing_bottleneck?: string;
  hidden_root_cause?: string;
  physics_limit_fix?: string;
  estimated_days_to_execute?: string;
  projected_economic_roi_usd?: string;
  anonymous_handle?: string;
  anonymous_passphrase?: string;
  credential_badge?: string;
}

export function validateProposalForm(
  data: Partial<ValidationInput>,
  step: number,
  locale: 'en' | 'bn' = 'en'
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  const isBn = locale === 'bn';

  if (step === 1) {
    if (!data.ministry_id || !data.ministry_id.trim()) {
      errors.ministry_id = isBn
        ? 'অনুগ্রহ করে একটি মন্ত্রণালয় বা খাত নির্বাচন করুন'
        : 'Please select a target ministry or sector';
    }
    if (!data.title || !data.title.trim()) {
      errors.title = isBn
        ? 'প্রস্তাবনার শিরোনাম প্রদান করা আবশ্যক'
        : 'Proposal title is required';
    } else if (data.title.trim().length < 15) {
      errors.title = isBn
        ? 'শিরোনাম কমপক্ষে ১৫ অক্ষরের হতে হবে'
        : 'Title must be at least 15 characters long';
    }
  }

  if (step === 2) {
    if (!data.existing_bottleneck || !data.existing_bottleneck.trim()) {
      errors.existing_bottleneck = isBn
        ? 'বিদ্যমান অচলাবস্থা বিস্তারিত ব্যাখ্যা করুন'
        : 'Existing bottleneck analysis is required';
    } else if (data.existing_bottleneck.trim().length < 30) {
      errors.existing_bottleneck = isBn
        ? 'অন্তত ৩০ অক্ষরে সুনির্দিষ্ট বিবরণ দিন'
        : 'Minimum 30 characters required for rigorous diagnosis';
    }

    if (!data.hidden_root_cause || !data.hidden_root_cause.trim()) {
      errors.hidden_root_cause = isBn
        ? 'লুকানো মূল কারণ ও প্রক্রিয়াগত ত্রুটি উল্লেখ করুন'
        : 'Hidden root cause breakdown is required';
    } else if (data.hidden_root_cause.trim().length < 30) {
      errors.hidden_root_cause = isBn
        ? 'অন্তত ৩০ অক্ষরে অভ্যন্তরীণ ত্রুটি ব্যাখ্যা করুন'
        : 'Minimum 30 characters required';
    }
  }

  if (step === 3) {
    if (!data.physics_limit_fix || !data.physics_limit_fix.trim()) {
      errors.physics_limit_fix = isBn
        ? 'পদার্থবিজ্ঞান ভিত্তিক সমাধান ব্যাখ্যা করুন'
        : 'First-principles engineering fix is required';
    } else if (data.physics_limit_fix.trim().length < 40) {
      errors.physics_limit_fix = isBn
        ? 'ন্যূনতম ৪০ অক্ষরে বাস্তবসম্মত সমাধান লিখুন'
        : 'Solution must be at least 40 characters';
    }

    const days = Number(data.estimated_days_to_execute);
    if (!days || isNaN(days) || days <= 0) {
      errors.estimated_days_to_execute = isBn
        ? 'বাস্তবায়নের দিন সংখ্যা ধনাত্মক সংখ্যা হতে হবে'
        : 'Execution timeline must be a valid positive number';
    } else if (days > 730) {
      errors.estimated_days_to_execute = isBn
        ? 'পদার্থবিজ্ঞান নিয়মে প্রাথমিক ফেজ সর্বোচ্চ ৭৩০ দিনের মধ্যে হতে হবে'
        : 'First-phase physics execution must be within 730 days (2 years)';
    }
  }

  if (step === 4) {
    const roi = Number(data.projected_economic_roi_usd);
    if (!roi || isNaN(roi) || roi <= 0) {
      errors.projected_economic_roi_usd = isBn
        ? 'অর্থনৈতিক প্রভাবের পরিমাণ মার্কিন ডলারে উল্লেখ করুন'
        : 'Projected economic ROI must be a valid positive number in USD';
    }

    if (data.identity_type === 'anonymous') {
      if (!data.anonymous_handle || !data.anonymous_handle.trim()) {
        errors.anonymous_handle = isBn
          ? 'বেনামী হ্যান্ডেল প্রয়োজন'
          : 'Anonymous handle is required';
      }
      if (!data.anonymous_passphrase || !data.anonymous_passphrase.trim()) {
        errors.anonymous_passphrase = isBn
          ? 'সিক্রেট পাসফ্রেজ খালি রাখা যাবে না'
          : 'Secret passphrase cannot be blank';
      }
    } else {
      if (!data.credential_badge || !data.credential_badge.trim()) {
        errors.credential_badge = isBn
          ? 'আপনার পেশাগত পদবী বা বিশেষজ্ঞ ক্ষেত্র উল্লেখ করুন'
          : 'Professional credential or domain badge is required';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCommentInput(content: string, stance: string, locale: 'en' | 'bn' = 'en'): { isValid: boolean; error?: string } {
  const isBn = locale === 'bn';
  if (!content || content.trim().length < 15) {
    return {
      isValid: false,
      error: isBn ? 'মন্তব্য বা চ্যালেঞ্জ কমপক্ষে ১৫ অক্ষরের হতে হবে' : 'Comment or critique must be at least 15 characters',
    };
  }
  const allowedStances = ['endorse', 'challenge', 'nuance', 'evidence_addition'];
  if (!allowedStances.includes(stance)) {
    return {
      isValid: false,
      error: isBn ? 'সঠিক অবস্থান (Stance) নির্বাচন করুন' : 'Please select a valid stance',
    };
  }
  return { isValid: true };
}
