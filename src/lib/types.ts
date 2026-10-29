export type UserIdentityType = 'anonymous' | 'verified_expert' | 'public_citizen';

export type ProposalStatusType =
  | 'draft'
  | 'submitted'
  | 'ai_scored'
  | 'community_review'
  | 'verified_approved'
  | 'committed_to_os'
  | 'rejected';

export type CommentStanceType = 'endorse' | 'challenge' | 'nuance' | 'evidence_addition';

export interface Profile {
  id: string;
  created_at: string;
  identity_type: UserIdentityType;
  auth_user_id?: string;
  display_name?: string;
  email?: string;
  organization?: string;
  verified_sector?: string;
  credential_badge?: string; // e.g., "Senior Marine Logistics Lead • 12y exp"
  anonymous_handle?: string; // e.g., "Anon-BayBengal-409"
  salt?: string;
  password_hash?: string;
  is_active: boolean;
  reputation_score: number;
}

export interface Ministry {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  target_10y_gdp_impact_usd: number;
  lead_vision_statement: string;
  icon_name: string;
  active_bottlenecks_count: number;
  open_prs_count: number;
  category: 'Infrastructure' | 'Economy' | 'Governance' | 'Human Capital' | 'Technology';
}

export interface Proposal {
  id: string;
  ministry_id: string;
  ministry_slug: string;
  author_id: string;
  author_identity_type: UserIdentityType;
  author_badge: string; // e.g., "[Verified: Senior Port Logistics Lead • 12y exp]" or "[Anonymous Protocol ID: #8F2A-04]"
  title: string;
  existing_bottleneck: string; // What is broken / who benefits
  hidden_root_cause: string; // Inside operational ground truth
  physics_limit_fix: string; // First-principles fix bounded by physical reality
  estimated_days_to_execute: number;
  projected_economic_roi_usd: number;
  status: ProposalStatusType;
  version: number;
  git_commit_sha?: string;
  ai_alignment_score: number; // 0.00 to 100.00
  ai_moderation_flag: boolean;
  ai_summary: string;
  upvotes_count: number;
  has_upvoted?: boolean;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalComment {
  id: string;
  proposal_id: string;
  author_id: string;
  author_badge: string;
  author_identity_type: UserIdentityType;
  parent_comment_id?: string;
  content: string;
  stance: CommentStanceType;
  technical_evidence_url?: string;
  helpful_votes: number;
  has_voted_helpful?: boolean;
  created_at: string;
}

export interface AnonymousNotification {
  id: string;
  recipient_handle: string;
  proposal_id: string;
  proposal_title: string;
  title: string;
  message: string;
  blueprint_section_reference: string;
  is_read: boolean;
  created_at: string;
}

export interface BlueprintCommit {
  sha: string;
  author: string;
  author_badge: string;
  message: string;
  ministry_slug: string;
  section: string;
  timestamp: string;
  lines_added: number;
  lines_removed: number;
  status: 'merged' | 'staged_for_review';
  spec_markdown: string;
}
