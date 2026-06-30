// Fetches the live GitHub star count at build time. We show the HONEST org
// total: the sum of stars across Metabuilder-Labs' own OSS repos (tokenjam +
// tokenjam-bench + tokenjam-website + any future own repo). Forks are excluded
// — the opentelemetry.io fork's stars are upstream's, not ours, so counting
// them would be misleading — and the `.github` meta repo is excluded too.
// Result is cached in module scope so a single build makes one API call no
// matter how many pages import this module. Falls back to null on failure.

const ORG = 'Metabuilder-Labs';
// The "Star it" CTA still points at the main repo (you can't star an org), even
// though the count shown is the org-wide own-repo total.
const REPO = 'metabuilder-labs/tokenjam';
export const REPO_URL = `https://github.com/${REPO}`;
// Non-fork repos we still don't want in the total (meta/infra repos).
const EXCLUDE_NAMES = new Set(['.github']);

let cached: { value: number | null; ts: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1h — fine for static builds

export async function getStarCount(): Promise<number | null> {
  const now = Date.now();
  if (cached && now - cached.ts < TTL_MS) return cached.value;
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) {
      cached = { value: cached?.value ?? null, ts: now };
      return cached.value;
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      cached = { value: cached?.value ?? null, ts: now };
      return cached.value;
    }
    let sum = 0;
    for (const repo of data) {
      if (repo?.fork) continue; // never count forks (upstream's stars, not ours)
      if (EXCLUDE_NAMES.has(repo?.name)) continue;
      if (typeof repo?.stargazers_count === 'number') sum += repo.stargazers_count;
    }
    cached = { value: sum, ts: now };
    return sum;
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

// The org repositories list — where the "Star us on GitHub" CTAs point, since the
// count shown is the org-wide own-repo total (you can't star an org, but this lists
// every repo to star).
export const ORG_REPOS_URL = `https://github.com/orgs/${ORG}/repositories`;
export function ghReposUrl(source: string): string {
  return `${ORG_REPOS_URL}?ref=tokenjam.dev/${source}`;
}
