import {
  Ministry,
  Proposal,
  ProposalComment,
  AnonymousNotification,
  BlueprintCommit,
  UserIdentityType,
  CommentStanceType
} from './types';
import {
  INITIAL_MINISTRIES,
  INITIAL_PROPOSALS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BLUEPRINT_COMMITS
} from './mockData';
import { estimateAiAlignmentScore } from './consensus';
import { generateCommitSha } from './crypto';

const STORAGE_KEY_PROPOSALS = 'bd2_proposals_v1';
const STORAGE_KEY_COMMENTS = 'bd2_comments_v1';
const STORAGE_KEY_NOTIFS = 'bd2_notifs_v1';
const STORAGE_KEY_COMMITS = 'bd2_commits_v1';
const STORAGE_KEY_SESSION = 'bd2_session_v1';

export interface UserSession {
  identityType: UserIdentityType;
  handleOrName: string;
  badge: string;
  secretPassphrase?: string;
  isLoggedIn: boolean;
}

class SovereignStore {
  private proposals: Proposal[] = [];
  private comments: Record<string, ProposalComment[]> = {};
  private notifications: AnonymousNotification[] = [];
  private commits: BlueprintCommit[] = [];
  private ministries: Ministry[] = INITIAL_MINISTRIES;
  private session: UserSession = {
    identityType: 'anonymous',
    handleOrName: 'Anon-BayBengal-409',
    badge: '[Anonymous Protocol ID: #8F2A-04]',
    secretPassphrase: 'sec_alpha_omega_99',
    isLoggedIn: true
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.proposals = INITIAL_PROPOSALS;
      this.comments = INITIAL_COMMENTS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.commits = INITIAL_BLUEPRINT_COMMITS;
      return;
    }

    try {
      const savedProps = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      this.proposals = savedProps ? JSON.parse(savedProps) : INITIAL_PROPOSALS;

      const savedComments = localStorage.getItem(STORAGE_KEY_COMMENTS);
      this.comments = savedComments ? JSON.parse(savedComments) : INITIAL_COMMENTS;

      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : INITIAL_NOTIFICATIONS;

      const savedCommits = localStorage.getItem(STORAGE_KEY_COMMITS);
      this.commits = savedCommits ? JSON.parse(savedCommits) : INITIAL_BLUEPRINT_COMMITS;

      const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
      if (savedSession) {
        this.session = JSON.parse(savedSession);
      }
    } catch {
      this.proposals = INITIAL_PROPOSALS;
      this.comments = INITIAL_COMMENTS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.commits = INITIAL_BLUEPRINT_COMMITS;
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(this.proposals));
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(this.comments));
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEY_COMMITS, JSON.stringify(this.commits));
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(this.session));
    } catch {
      // Storage unavailable or quota exceeded
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getMinistries(): Ministry[] {
    return this.ministries;
  }

  public getMinistryBySlug(slug: string): Ministry | undefined {
    return this.ministries.find((m) => m.slug === slug);
  }

  public getProposals(): Proposal[] {
    return [...this.proposals];
  }

  public getProposalById(id: string): Proposal | undefined {
    return this.proposals.find((p) => p.id === id);
  }

  public getComments(proposalId: string): ProposalComment[] {
    return [...(this.comments[proposalId] || [])];
  }

  public getNotifications(handle?: string): AnonymousNotification[] {
    if (!handle) return [...this.notifications];
    return this.notifications.filter((n) => n.recipient_handle === handle);
  }

  public getCommits(): BlueprintCommit[] {
    return [...this.commits];
  }

  public getSession(): UserSession {
    return { ...this.session };
  }

  public setSession(session: UserSession) {
    this.session = session;
    this.persist();
  }

  public toggleUpvote(proposalId: string): boolean {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) return false;

    if (proposal.has_upvoted) {
      proposal.upvotes_count = Math.max(0, proposal.upvotes_count - 1);
      proposal.has_upvoted = false;
    } else {
      proposal.upvotes_count += 1;
      proposal.has_upvoted = true;
    }
    this.persist();
    return true;
  }

  public toggleCommentHelpful(proposalId: string, commentId: string): boolean {
    const commentsList = this.comments[proposalId];
    if (!commentsList) return false;
    const comment = commentsList.find((c) => c.id === commentId);
    if (!comment) return false;

    if (comment.has_voted_helpful) {
      comment.helpful_votes = Math.max(0, comment.helpful_votes - 1);
      comment.has_voted_helpful = false;
    } else {
      comment.helpful_votes += 1;
      comment.has_voted_helpful = true;
    }
    this.persist();
    return true;
  }

  public addComment(
    proposalId: string,
    content: string,
    stance: CommentStanceType,
    technicalEvidenceUrl?: string
  ): ProposalComment {
    const newComment: ProposalComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      proposal_id: proposalId,
      author_id: this.session.handleOrName,
      author_badge: this.session.badge,
      author_identity_type: this.session.identityType,
      content,
      stance,
      technical_evidence_url: technicalEvidenceUrl?.trim() || undefined,
      helpful_votes: 1,
      has_voted_helpful: true,
      created_at: new Date().toISOString()
    };

    if (!this.comments[proposalId]) {
      this.comments[proposalId] = [];
    }
    this.comments[proposalId].unshift(newComment);

    const prop = this.proposals.find((p) => p.id === proposalId);
    if (prop) {
      prop.comments_count += 1;
    }

    this.persist();
    return newComment;
  }

  public addProposal(input: {
    ministry_id: string;
    title: string;
    existing_bottleneck: string;
    hidden_root_cause: string;
    physics_limit_fix: string;
    estimated_days_to_execute: number;
    projected_economic_roi_usd: number;
    identity_type: UserIdentityType;
    anonymous_handle?: string;
    anonymous_passphrase?: string;
    credential_badge?: string;
  }): Proposal {
    const ministry = this.ministries.find((m) => m.id === input.ministry_id);
    const ministrySlug = ministry ? ministry.slug : 'ports-logistics';

    let badge = input.credential_badge || '[Verified Specialist]';
    if (input.identity_type === 'anonymous') {
      badge = `[Anonymous Protocol ID: #${input.anonymous_handle?.replace(/^Anon-.*-/, '') || '40A1'}]`;
    }

    const aiScore = estimateAiAlignmentScore(
      input.estimated_days_to_execute,
      input.projected_economic_roi_usd
    );

    const newProposal: Proposal = {
      id: `prop-${Date.now().toString(36)}`,
      ministry_id: input.ministry_id,
      ministry_slug: ministrySlug,
      author_id: input.anonymous_handle || input.credential_badge || 'user_anon',
      author_identity_type: input.identity_type,
      author_badge: badge,
      title: input.title,
      existing_bottleneck: input.existing_bottleneck,
      hidden_root_cause: input.hidden_root_cause,
      physics_limit_fix: input.physics_limit_fix,
      estimated_days_to_execute: input.estimated_days_to_execute,
      projected_economic_roi_usd: input.projected_economic_roi_usd,
      status: 'submitted',
      version: 1,
      ai_alignment_score: aiScore,
      ai_moderation_flag: false,
      ai_summary: `${input.title.slice(0, 110)}... Evaluated at ${input.estimated_days_to_execute}-day physics execution.`,
      upvotes_count: 1,
      has_upvoted: true,
      comments_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.proposals.unshift(newProposal);

    // If anonymous, create a confirmation alert in notifications
    if (input.anonymous_handle) {
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipient_handle: input.anonymous_handle,
        proposal_id: newProposal.id,
        proposal_title: newProposal.title,
        title: 'Diagnostic Staged for AI Vector Clustering',
        message: `Your structured submission has been hashed and staged with AI Alignment Score ${aiScore}%. Awaiting domain deliberation.`,
        blueprint_section_reference: `Sector ${ministry?.name_en || 'National Rails'}, Draft Submission`,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    this.persist();
    return newProposal;
  }

  public synthesizeAndCommit(proposalId: string): BlueprintCommit | null {
    const prop = this.proposals.find((p) => p.id === proposalId);
    if (!prop) return null;

    const commitSha = generateCommitSha();
    prop.status = 'committed_to_os';
    prop.git_commit_sha = commitSha;

    const newCommit: BlueprintCommit = {
      sha: commitSha,
      author: 'National Assembly AI Synthesis Engine',
      author_badge: '[Verified: Sovereign AI Orchestrator]',
      message: `ratify(${prop.ministry_slug}): ${prop.title.toLowerCase().slice(0, 65)}`,
      ministry_slug: prop.ministry_slug,
      section: `Chapter: ${prop.ministry_slug.toUpperCase()} • Section #OS-${commitSha}`,
      timestamp: new Date().toISOString(),
      lines_added: 85,
      lines_removed: 12,
      status: 'merged',
      spec_markdown: `# Operational Directive BD-2.0-${commitSha.toUpperCase()}
## Subject: ${prop.title}

### 1. Root Bottleneck Addressed
${prop.existing_bottleneck}

### 2. Operational Reality & Choke Points
${prop.hidden_root_cause}

### 3. Physics-Limit Engineering Solution (${prop.estimated_days_to_execute} Days)
${prop.physics_limit_fix}

### 4. Economic ROI & National Wealth Impact
- Estimated Direct ROI: $${(prop.projected_economic_roi_usd / 1e6).toFixed(1)}M USD
- State Branch: Merged to sovereign production branch`
    };

    this.commits.unshift(newCommit);

    // If author was anonymous, send notification
    this.notifications.unshift({
      id: `notif-commit-${Date.now()}`,
      recipient_handle: prop.author_id,
      proposal_id: prop.id,
      proposal_title: prop.title,
      title: 'PR Merged into Bangladesh 2.0 Sovereign OS',
      message: `Congratulations! Your proposal was synthesized and merged under commit #${commitSha}.`,
      blueprint_section_reference: newCommit.section,
      is_read: false,
      created_at: new Date().toISOString()
    });

    this.persist();
    return newCommit;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.persist();
    }
  }
}

export const sovereignStore = new SovereignStore();
