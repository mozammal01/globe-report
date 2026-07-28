import "server-only";
import { headers } from "next/headers";

// Simple in-memory fixed-window limiter. Good enough for a single-instance
// deployment to blunt casual abuse (email-bombing, scripted spam); it does
// NOT coordinate across multiple server instances — see docs/DEPLOYMENT.md
// for the production caveat and the suggested upgrade path (Redis/Upstash).
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the map doesn't grow unbounded from one-off IPs.
  if (Math.random() < 0.01) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  return forwardedFor ? forwardedFor.split(",")[0]!.trim() : "unknown";
}
