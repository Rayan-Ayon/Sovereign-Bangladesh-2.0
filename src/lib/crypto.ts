/**
 * Pure cryptographic and formatting utilities for Sovereign Bangladesh 2.0 platform
 */

export function generateAnonymousHandle(): string {
  const regions = ['BayBengal', 'Padma', 'Meghna', 'Jamuna', 'Karnaphuli', 'Sundarbans', 'Surma', 'Teesta'];
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];
  const randomHex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `Anon-${randomRegion}-${randomHex}`;
}

export function generatePassphrase(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = 'sec_';
  for (let i = 0; i < 16; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

export function generateCommitSha(): string {
  const hex = '0123456789abcdef';
  let sha = '';
  for (let i = 0; i < 7; i++) {
    sha += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return sha;
}

/**
 * Pure string hashing (works in both Node.js unit tests and Browser Web Crypto)
 */
export async function hashPassphrase(passphrase: string, salt: string): Promise<string> {
  const combined = passphrase + '::' + salt;
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const enc = new TextEncoder();
    const data = enc.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple deterministic FNV-1a 64-bit hash formatted as hex for non-webcrypto environments
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

export function formatDollar(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0';
  if (amount >= 1e12) {
    return `$${(amount / 1e12).toFixed(2)}T`;
  }
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatNumberBn(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}
