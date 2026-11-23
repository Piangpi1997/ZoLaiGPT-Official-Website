// GET /download/android — the newest ZoLaiGPT for Android APK, served from this domain.
// The file lives in this repository's public GitHub Releases (Cloudflare Pages cannot host
// files over 25 MiB); this function streams it through so visitors only see
// zolaigptofficial.com and a clean file name. Each app release is published there
// automatically (see _latest.js), so nothing here changes per version.
import { latestAndroid } from './_latest.js';

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  // Pass a Range header through so interrupted downloads can resume.
  const range = request.headers.get('range');
  const apk = await latestAndroid();
  let upstream;
  try {
    upstream = await fetch(apk.url, { redirect: 'follow', headers: range ? { range } : {} });
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
    'content-disposition': `attachment; filename="${apk.file}"`,
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex',
    'x-checksum-sha256': apk.sha256,
    'x-app-version': apk.version,
  });
  for (const name of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
}
