// Which Android APK /download/android serves. Each app release publishes, in this
// repository's GitHub Releases, the APK plus android-latest.json
// ({version, versionCode, file, url, sha256, size, certificateSha256, notes}). The newest release wins;
// if it cannot be read, the last hand-published build below is used.
const REPO = 'Piangpi1997/ZoLaiGPT-Official-Website';
const RELEASES = `https://github.com/${REPO}/releases/download/`;

export const FALLBACK = {
  version: '3.9.2',
  versionCode: 22,
  file: 'ZoLaiGPT-3.9.2.apk',
  url: `${RELEASES}android-v3.9.2/ZoLaiGPT-3.9.2.apk`,
  sha256: 'af52edeba2f2e47fd3a911a824772068eb05485e1e049e43922d098b25bb2a84',
  size: 171995846,
  certificateSha256: '7effb8c75aa96e6ebe76f4565a14f68a285f82fe2d6f56ed4252f4ddab44211b',
  notes: 'Release 3.9.2 (liquid glass bars) and publish every app version to the website automatically',
};

export async function latestAndroid() {
  try {
    const res = await fetch(`https://github.com/${REPO}/releases/latest/download/android-latest.json`, {
      redirect: 'follow',
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!res.ok) return FALLBACK;
    const j = await res.json();
    // Only accept files from this repository's own releases, with a real checksum.
    if (typeof j?.url !== 'string' || !j.url.startsWith(RELEASES) || !/^[0-9a-f]{64}$/.test(j?.sha256 || '')) return FALLBACK;
    const version = String(j.version || '').replace(/[^\w.-]/g, '');
    return {
      version,
      versionCode: Number(j.versionCode) || 0,
      notes: typeof j.notes === 'string' ? j.notes.slice(0, 400) : undefined,
      file: String(j.file || `ZoLaiGPT-${version}.apk`).replace(/[^\w.-]/g, ''),
      url: j.url,
      sha256: j.sha256,
      size: Number(j.size) || undefined,
      certificateSha256: typeof j.certificateSha256 === 'string' ? j.certificateSha256.replace(/[^0-9a-fA-F:]/g, '') : undefined,
    };
  } catch {
    return FALLBACK;
  }
}
