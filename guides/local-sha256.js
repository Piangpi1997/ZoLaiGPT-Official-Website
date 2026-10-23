/* ZoLaiGPT preview: entirely local SHA-256 file check.
   File bytes are read by the user's browser only. There are NO fetch,
   XMLHttpRequest, upload, storage, analytics, or external script calls. */
(() => {
  'use strict';
  const fileInput = document.getElementById('local-hash-file');
  const button = document.getElementById('local-hash-run');
  const status = document.getElementById('local-hash-status');
  const result = document.getElementById('local-hash-output');
  const digestText = document.getElementById('local-hash-digest');
  const expected = document.getElementById('local-hash-expected')?.textContent?.trim().toLowerCase();
  if (!fileInput || !button || !status || !result || !digestText || !/^[0-9a-f]{64}$/.test(expected || '')) return;

  // The Web Crypto API uses an in-memory whole-file buffer in this simple demo.
  // Keep the limit low for older mobile handsets; desktop command examples below
  // the widget remain usable for larger files.
  const MAX_BYTES = 32 * 1024 * 1024;
  let busy = false;
  const writeStatus = (message, tone = '') => {
    status.textContent = message;
    status.dataset.tone = tone;
  };
  const reset = () => {
    result.hidden = true;
    digestText.textContent = '';
    writeStatus('Choose a ZIP stored on your device. Nothing will be uploaded.');
  };
  fileInput.addEventListener('change', reset);

  button.addEventListener('click', async () => {
    if (busy) return;
    reset();
    const file = fileInput.files?.[0];
    if (!file) {
      writeStatus('Please choose a file first.', 'error');
      fileInput.focus();
      return;
    }
    if (!file.size) {
      writeStatus('The selected file is empty.', 'error');
      return;
    }
    if (file.size > MAX_BYTES) {
      writeStatus('This on-device demo has a 32 MiB limit. Use one of the desktop SHA-256 commands below for larger files.', 'error');
      return;
    }
    if (!globalThis.isSecureContext || !globalThis.crypto?.subtle) {
      writeStatus('Local browser hashing is unavailable here. Open this page via HTTPS or use the desktop command examples below.', 'error');
      return;
    }
    busy = true;
    button.disabled = true;
    fileInput.disabled = true;
    writeStatus('Calculating SHA-256 on this device. The file is not uploaded.');
    try {
      const bytes = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      digestText.textContent = actual;
      result.hidden = false;
      if (actual === expected) {
        writeStatus('MATCH — the file bytes match the checksum printed on the download page. This does not prove the file is safe, official, or independently audited.', 'success');
      } else {
        writeStatus('MISMATCH — the file differs from the published checksum. Do not build or run it until the discrepancy is resolved.', 'error');
      }
    } catch {
      writeStatus('Could not read or hash the selected file. Try again or use the desktop commands below.', 'error');
      result.hidden = true;
    } finally {
      busy = false;
      button.disabled = false;
      fileInput.disabled = false;
    }
  });
})();
