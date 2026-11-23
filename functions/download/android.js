// GET /download/android — the ZoLaiGPT for Android APK, served from this domain.
// The file lives in this repository's public GitHub release (Cloudflare Pages cannot
// host files over 25 MiB); this function streams it through so visitors only see
// zolaigptofficial.com and a clean file name. Update APK, FILE_NAME and SHA256 for
// each new app release (and the page that shows the checksum).
const APK = 'https://github.com/Piangpi1997/ZoLaiGPT-Official-Website/releases/download/android-v3.9.1/Zolai-GPT-next-debug.3.apk';
const FILE_NAME = 'ZoLaiGPT-3.9.1.apk';
const SHA256 = 'f9a5197b2d92d2f3a1e590c9541de12cc34278f3502fd40069dc1a8555e23fcc';

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  // Pass a Range header through so interrupted downloads can resume.
  const range = request.headers.get('range');
  let upstream;
  try {
    upstream = await fetch(APK, { redirect: 'follow', headers: range ? { range } : {} });
  } catch {
    upstream = null;
  }
  if (!upstream || (upstream.status !== 200 && upstream.status !== 206)) {
    return new Response('The download is unavailable right now. Please try again in a few minutes.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  const headers = new Headers({
    'content-type': 'application/vnd.android.package-archive',
    'content-disposition': `attachment; filename="${FILE_NAME}"`,
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex',
    'x-checksum-sha256': SHA256,
  });
  for (const name of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
}
