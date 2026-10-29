import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAnonymousHandle, generateCommitSha, formatDollar, formatNumberBn, hashPassphrase } from './crypto';
import { validateProposalForm, validateCommentInput } from './validation';
import { calculateConsensus, estimateAiAlignmentScore } from './consensus';
import { ProposalComment } from './types';

test('crypto: anonymous handle format conforms to Anon-[Region]-[HEX]', () => {
  const handle = generateAnonymousHandle();
  assert.match(handle, /^Anon-[A-Za-z]+-[0-9A-F]{4}$/);
});

test('crypto: commit SHA is 7-char lowercase hex', () => {
  const sha = generateCommitSha();
  assert.equal(sha.length, 7);
  assert.match(sha, /^[0-9a-f]{7}$/);
});

test('crypto: formatDollar produces readable financial metrics', () => {
  assert.equal(formatDollar(1050000000000), '$1.05T');
  assert.equal(formatDollar(85000000000), '$85.0B');
  assert.equal(formatDollar(50000000), '$50.0M');
  assert.equal(formatDollar(5000), '$5,000');
});

test('crypto: formatNumberBn converts Arabic digits to Bengali numerals', () => {
  assert.equal(formatNumberBn(1095), '১০৯৫');
  assert.equal(formatNumberBn(2035), '২০৩৫');
  assert.equal(formatNumberBn('142'), '১৪২');
});

test('crypto: hashPassphrase creates deterministic hash for identical inputs', async () => {
  const h1 = await hashPassphrase('secret_key_123', 'salt_abc');
  const h2 = await hashPassphrase('secret_key_123', 'salt_abc');
  const h3 = await hashPassphrase('different_key', 'salt_abc');
  assert.equal(h1, h2);
  assert.notEqual(h1, h3);
  assert.ok(h1.length >= 16);
});

test('validation: Stage 1 requires ministry and title of length >= 15', () => {
  const bad = validateProposalForm({ ministry_id: '', title: 'Too short' }, 1, 'en');
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.ministry_id);
  assert.ok(bad.errors.title);

  const good = validateProposalForm(
    { ministry_id: 'm-1', title: 'Starlink Yard Automation for Chattogram Port' },
    1,
    'en'
  );
  assert.equal(good.isValid, true);
  assert.equal(Object.keys(good.errors).length, 0);
});

test('validation: Stage 3 enforces 10-day physics limits and max 730 days', () => {
  const invalidDays = validateProposalForm(
    {
      physics_limit_fix: 'Mount automated RFID scanners and high-speed OCR cameras at all 12 terminal gantries directly.',
      estimated_days_to_execute: 1000,
    },
    3,
    'en'
  );
  assert.equal(invalidDays.isValid, false);
  assert.ok(invalidDays.errors.estimated_days_to_execute);

  const validDays = validateProposalForm(
    {
      physics_limit_fix: 'Mount automated RFID scanners and high-speed OCR cameras at all 12 terminal gantries directly.',
      estimated_days_to_execute: 14,
    },
    3,
    'en'
  );
  assert.equal(validDays.isValid, true);
});

test('validation: comments require stance and min 15 chars', () => {
  const invalid = validateCommentInput('No', 'endorse', 'en');
  assert.equal(invalid.isValid, false);

  const invalidStance = validateCommentInput('This is a sufficiently long critique of the plan', 'invalid_stance', 'en');
  assert.equal(invalidStance.isValid, false);

  const valid = validateCommentInput('The power grid at Bogura cannot support 33kV transformers within 14 days without BPDB pre-allocation.', 'challenge', 'en');
  assert.equal(valid.isValid, true);
});

test('consensus: computes stance breakdown and consensus score', () => {
  const mockComments: ProposalComment[] = [
    {
      id: 'c1',
      proposal_id: 'p1',
      author_id: 'a1',
      author_badge: '[Verified: Electrical Engineer]',
      author_identity_type: 'verified_expert',
      content: 'Approved design specifications verified against national grid standards.',
      stance: 'endorse',
      helpful_votes: 12,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c2',
      proposal_id: 'p1',
      author_id: 'a2',
      author_badge: '[Verified: Port Officer]',
      author_identity_type: 'verified_expert',
      content: 'Independent field telemetry confirms substation capacity exists.',
      stance: 'evidence_addition',
      technical_evidence_url: 'https://bpdb.gov.bd/grid-specs',
      helpful_votes: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c3',
      proposal_id: 'p1',
      author_id: 'a3',
      author_badge: '[Anonymous Protocol ID: #8F2A-04]',
      author_identity_type: 'anonymous',
      content: 'Customs union might initiate union strikes if physical signoffs are eliminated overnight.',
      stance: 'challenge',
      helpful_votes: 4,
      created_at: new Date().toISOString(),
    },
  ];

  const breakdown = calculateConsensus(mockComments);
  assert.equal(breakdown.total, 3);
  assert.equal(breakdown.endorseCount, 1);
  assert.equal(breakdown.evidenceCount, 1);
  assert.equal(breakdown.challengeCount, 1);
  assert.ok(breakdown.consensusScore > 50);
});

test('consensus: estimateAiAlignmentScore scales with physical velocity and economic ROI', () => {
  const fastHighImpact = estimateAiAlignmentScore(14, 1500000000);
  const slowLowImpact = estimateAiAlignmentScore(365, 100000);
  assert.ok(fastHighImpact > slowLowImpact);
  assert.ok(fastHighImpact >= 90);
});
