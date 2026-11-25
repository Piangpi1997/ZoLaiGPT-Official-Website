// Verify a Firebase ID token (RS256 JWT) against Google's public keys.
// No dependencies: uses the WebCrypto API available in Workers / Pages Functions.
// Only the Firebase project ZOLAI GPT (myapplication-8e3f3a00) is accepted.
const PROJECT_ID = 'myapplication-8e3f3a00';
const ISSUER = 'https://securetoken.google.com/' + PROJECT_ID;
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let cachedKeys = null;
let cachedAt = 0;

async function fetchKeys() {
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('JWKS fetch failed: ' + res.status);
  const jwks = await res.json();
  cachedKeys = Array.isArray(jwks.keys) ? jwks.keys : [];
  cachedAt = Date.now();
  return cachedKeys;
}

async function getKeys() {
  if (cachedKeys && Date.now() - cachedAt < 3600000) return cachedKeys;
  return fetchKeys();
}

function b64urlDecode(input) {
  let s = String(input).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function decodeJsonPart(part) {
  return JSON.parse(new TextDecoder().decode(b64urlDecode(part)));
}

async function verifySignature(headerB64, payloadB64, signatureB64, keys) {
  let header;
  try {
    header = decodeJsonPart(headerB64);
  } catch {
    return false;
  }
  const jwk = keys.find((k) => k && k.kid === header.kid);
  if (!jwk) return false;
  const key = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  const data = new TextEncoder().encode(headerB64 + '.' + payloadB64);
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlDecode(signatureB64), data);
}

// Returns the user's uid (payload.sub) when the token is a valid Firebase ID
// token for this project, otherwise null. Throws only when Google's key set
// cannot be fetched at all (the caller decides how to handle that outage).
export async function verifyFirebaseToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  let header, payload;
  try {
    header = decodeJsonPart(headerB64);
    payload = decodeJsonPart(payloadB64);
  } catch {
    return null;
  }
  if (header.alg !== 'RS256' || !header.kid) return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== PROJECT_ID) return null;
  if (payload.iss !== ISSUER) return null;
  if (!payload.sub || typeof payload.sub !== 'string') return null;
  if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
  if (typeof payload.iat === 'number' && payload.iat > now + 300) return null;
  let keys = await getKeys();
  let ok = false;
  try {
    ok = await verifySignature(headerB64, payloadB64, signatureB64, keys);
  } catch {
    ok = false;
  }
  if (!ok) {
    // The signing key may have rotated since our cache was filled: refetch once.
    cachedKeys = null;
    keys = await getKeys();
    try {
      ok = await verifySignature(headerB64, payloadB64, signatureB64, keys);
    } catch {
      ok = false;
    }
  }
  return ok ? payload.sub : null;
}
