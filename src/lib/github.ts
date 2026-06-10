// Fetches the live GitHub star count at build time. The result is cached in
// module scope so a single build only makes one API call no matter how many
// pages import this module. Falls back to null on network/API failure; callers
// render gracefully without a count in that case.

const REPO = 'metabuilder-labs/tokenjam';
export const REPO_URL = `https://github.com/${REPO}`;

let cached: { value: number | null; ts: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1h — fine for static builds

export async function getStarCount(): Promise<number | null> {
  const now = Date.now();
  if (cached && now - cached.ts < TTL_MS) return cached.value;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) {
      cached = { value: cached?.value ?? null, ts: now };
      return cached.value;
    }
    const data = await res.json();
    const value = typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
    cached = { value, ts: now };
    return value;
  } catch {
    cached = { value: cached?.value ?? null, ts: now };
    return cached.value;
  }
}

export function formatStars(n: number | null): string {
  if (n === null || n === undefined) return '';
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

// Attach to every external GitHub link so we can later split traffic in analytics
// without depending on trackEvent labels alone (e.g. when the URL gets shared).
export function ghUrl(source: string): string {
  return `${REPO_URL}?ref=tokenjam.dev/${source}`;
}
