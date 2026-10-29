import { ProposalComment, CommentStanceType } from './types';

export interface ConsensusBreakdown {
  total: number;
  endorseCount: number;
  challengeCount: number;
  nuanceCount: number;
  evidenceCount: number;
  endorsePercent: number;
  challengePercent: number;
  nuancePercent: number;
  evidencePercent: number;
  consensusScore: number; // 0 to 100
  evidenceRatio: number; // 0 to 1
  sentimentVerdict: 'High Consensus' | 'Active Deliberation' | 'Heavily Challenged' | 'Nascent Policy';
}

export function calculateConsensus(comments: ProposalComment[]): ConsensusBreakdown {
  const total = comments.length;
  if (total === 0) {
    return {
      total: 0,
      endorseCount: 0,
      challengeCount: 0,
      nuanceCount: 0,
      evidenceCount: 0,
      endorsePercent: 0,
      challengePercent: 0,
      nuancePercent: 0,
      evidencePercent: 0,
      consensusScore: 50,
      evidenceRatio: 0,
      sentimentVerdict: 'Nascent Policy',
    };
  }

  let endorseCount = 0;
  let challengeCount = 0;
  let nuanceCount = 0;
  let evidenceCount = 0;
  let totalHelpful = 0;

  for (const c of comments) {
    if (c.stance === 'endorse') endorseCount++;
    else if (c.stance === 'challenge') challengeCount++;
    else if (c.stance === 'nuance') nuanceCount++;
    else if (c.stance === 'evidence_addition') evidenceCount++;
    totalHelpful += c.helpful_votes;
  }

  const endorsePercent = Math.round((endorseCount / total) * 100);
  const challengePercent = Math.round((challengeCount / total) * 100);
  const nuancePercent = Math.round((nuanceCount / total) * 100);
  const evidencePercent = Math.round((evidenceCount / total) * 100);

  // Consensus formula: (endorse * 1.0 + evidence * 0.8 + nuance * 0.5) / total * 100 - (challenge * 0.4)
  let rawScore = (endorseCount * 1.0 + evidenceCount * 0.85 + nuanceCount * 0.5) / total * 100;
  if (challengeCount > endorseCount) {
    rawScore = Math.max(15, rawScore - 20);
  }
  const consensusScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  let sentimentVerdict: ConsensusBreakdown['sentimentVerdict'] = 'Active Deliberation';
  if (consensusScore >= 75 && evidenceCount >= 1) {
    sentimentVerdict = 'High Consensus';
  } else if (challengePercent > 45) {
    sentimentVerdict = 'Heavily Challenged';
  } else if (total < 3) {
    sentimentVerdict = 'Nascent Policy';
  }

  return {
    total,
    endorseCount,
    challengeCount,
    nuanceCount,
    evidenceCount,
    endorsePercent,
    challengePercent,
    nuancePercent,
    evidencePercent,
    consensusScore,
    evidenceRatio: evidenceCount / total,
    sentimentVerdict,
  };
}

export function estimateAiAlignmentScore(days: number, roiUsd: number): number {
  // Shorter days (closer to physics limits) and higher economic ROI yield higher alignment scores
  let base = 85.0;
  if (days <= 14) base += 8.0;
  else if (days <= 30) base += 5.5;
  else if (days <= 90) base += 2.0;
  else base -= 4.0;

  if (roiUsd >= 1e9) base += 5.0; // > $1B
  else if (roiUsd >= 1e8) base += 3.0; // > $100M
  else if (roiUsd >= 1e7) base += 1.0;

  return Math.min(99.4, Math.max(68.0, Number(base.toFixed(1))));
}
