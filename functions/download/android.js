// GET, HEAD and POST /download/android — the newest ZoLaiGPT for Android APK,
// served from this domain. The file lives in this repository's public GitHub
// Releases (Cloudflare Pages cannot host files over 25 MiB); this function
// streams it through so visitors only see zolaigptofficial.com and a clean
// file name. Each app release is published there automatically (see
// _latest.js), so nothing here changes per version.
//
// Sign-in is enforced here, on the server: the file is only streamed for a
// visitor with a valid Firebase ID token for the ZOLAI GPT project (see
// _verify.js). The token arrives either as a ?token= query (GET/HEAD, e.g. a
// resumed download) or, normally, in the POST body sent by the website's
// download button — POST keeps the token out of the URL, the browser history
// and the server logs. Without a valid token the visitor is sent to the login
// page, which brings them back to the Android app page afterwards.
import { latestAndroid } from './_latest.js';
import { verifyFirebaseToken } from './_verify.js';

const LOGIN_URL = '/login/?next=' + encodeURIComponent('/apps/zolaigpt-android/');

// No (or invalid) sign-in: send the visitor to the login page. Never cache
// this redirect.
function redirectToLogin() {
  return new Response(null, {
    status: 302,
    headers: { location: LOGIN_URL, 'cache-control': 'no-store' },
  });
}

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD, POST' } });
  }

  const url = new URL(request.url);
  let token = url.searchParams.get('token') || null;
  if (!token && request.method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      try {
        const form = await request.formData();
        const field = form.get('token');
        if (typeof field === 'string') token = field;
      } catch {}
    }
    if (!token) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
    }
  }
  if (!token) return redirectToLogin();
  let uid = null;
  try {
    uid = await verifyFirebaseToken(token);
  } catch {
    return new Response('The sign-in check is unavailable right now. Please try again in a few minutes.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  if (!uid) return redirectToLogin();

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
