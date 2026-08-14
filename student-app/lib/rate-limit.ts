// In-memory token bucket rate limiting to prevent Vercel Hobby serverless depletion
interface TokenBucket {
  tokens: number
  lastRefill: number
}

const activeIPBuckets = new Map<string, TokenBucket>()

const MAX_TOKENS = 10
const REFILL_RATE_PER_MINUTE = 10
const ONE_MINUTE_MS = 60 * 1000

export function rateLimit(ip: string) {
  const now = Date.now()
  let bucket = activeIPBuckets.get(ip)

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now }
    activeIPBuckets.set(ip, bucket)
  } else {
    // Calculate refilled tokens based on time elapsed
    const elapsed = now - bucket.lastRefill
    const refilled = (elapsed / ONE_MINUTE_MS) * REFILL_RATE_PER_MINUTE
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refilled)
    bucket.lastRefill = now
  }

  // Check if we can consume a token
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return {
      success: true,
      limit: MAX_TOKENS,
      remaining: Math.floor(bucket.tokens),
      retryAfterSeconds: 0
    }
  }

  // Not enough tokens
  const nextRefillMs = ONE_MINUTE_MS - (now - bucket.lastRefill)
  const retryAfterSeconds = Math.max(1, Math.ceil(nextRefillMs / 1000))

  return {
    success: false,
    limit: MAX_TOKENS,
    remaining: 0,
    retryAfterSeconds
  }
}
