// =====================================================================
// UMA TRAVELS — Lightweight in-memory rate limiter
// ---------------------------------------------------------------------
// NOTE: This is process-local. On multi-instance / serverless deployments
// each instance keeps its own counter, so it is a best-effort guard only.
// For strict limits, back this with Redis/Upstash or an edge rate limiter.
// The client IP header (x-forwarded-for) can be spoofed when not behind a
// trusted proxy — treat these limits as abuse mitigation, not security.
// =====================================================================

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Evict expired buckets once the map grows large, so a long-running instance
// does not leak memory as new client IPs appear. Expired entries are already
// treated as empty by isRateLimited(); this just reclaims their memory.
const SWEEP_THRESHOLD = 5_000;

function sweepExpired(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt < now) buckets.delete(key);
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Returns true when the caller has exceeded `limit` requests within
 * `windowMs` for the given `scope` (e.g. "booking", "places:autocomplete").
 */
export function isRateLimited(
  scope: string,
  ip: string,
  limit: number,
  windowMs: number
): boolean {
  const key = `${scope}:${ip}`;
  const now = Date.now();

  if (buckets.size >= SWEEP_THRESHOLD) sweepExpired(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}
