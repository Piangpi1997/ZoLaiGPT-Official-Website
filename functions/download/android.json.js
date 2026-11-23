// GET /download/android.json — version and SHA-256 of the APK that /download/android serves,
// so the app page always shows the checksum of the file people actually get.
import { latestAndroid } from './_latest.js';

export async function onRequest() {
  const { version, versionCode, file, sha256, size, certificateSha256, notes } = await latestAndroid();
  return new Response(JSON.stringify({ version, versionCode, file, sha256, size, certificateSha256, notes, url: '/download/android' }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-robots-tag': 'noindex' },
  });
}
