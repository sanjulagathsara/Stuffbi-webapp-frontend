// src/utils/signedUrlCache.js
const cache = new Map(); // key -> { url, expiresAt }

export function getCachedSignedUrl(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.url;
}

export function setCachedSignedUrl(key, url, ttlMs) {
  cache.set(key, { url, expiresAt: Date.now() + ttlMs });
}
