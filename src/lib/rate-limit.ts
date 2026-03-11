// In-memory rate limiter (no Redis needed for MVP)
// For production at scale: replace with Upstash Redis

const attempts = new Map<string, { count: number; resetAt: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now()
    const entry = attempts.get(identifier)

    // Clean expired entries periodically
    if (Math.random() < 0.01) cleanup()

    if (!entry || now > entry.resetAt) {
        attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
        return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 }
    }

    entry.count++

    if (entry.count > MAX_ATTEMPTS) {
        return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
    }

    return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, retryAfterMs: 0 }
}

export function resetRateLimit(identifier: string) {
    attempts.delete(identifier)
}

function cleanup() {
    const now = Date.now()
    for (const [key, entry] of attempts) {
        if (now > entry.resetAt) attempts.delete(key)
    }
}
