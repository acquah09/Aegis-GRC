// src/lib/rate-limit.ts
import { LRUCache } from "lru-cache"

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (req: Request, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1])
        } else {
          tokenCount[0] += 1
          tokenCache.set(token, tokenCount)
        }
        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        const headers = new Headers()
        headers.set("X-RateLimit-Limit", limit.toString())
        headers.set(
          "X-RateLimit-Remaining",
          isRateLimited ? "0" : (limit - currentUsage).toString()
        )

        return isRateLimited ? reject() : resolve()
      }),
  }
}