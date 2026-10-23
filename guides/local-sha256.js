/* ZoLaiGPT learning tool: all file hashing happens in this browser.
   No network calls, uploads, cookies or local storage. 32 MiB safety cap for phones. */
(() => {
  'use strict';
  const fileInput = document.getElementById('local-hash-file');
  const expectedInput = document.getElementById('local-hash-expected');
  const button = document.getElementById('local-hash-run');
  const status = document.getElementById('local-hash-status');
  const result = document.getElementById('local-hash-output');
  const digestText = document.getElementById('local-hash-digest');
  if (!fileInput || !expectedInput || !button || !status || !result || !digestText) return;
  const MAX_BYTES = 32 * 1024 * 1024;
  let busy = false;
  const setStatus = (message, tone = '') => {
    status.textContent = message;
    status.dataset.tone = tone;
  };
  function reset() {
    result.hidden = true;
    digestText.textContent = '';
    setStatus('Choose a file. Processing stays on your device.');
  }
  fileInput.addEventListener('change', reset);
  expectedInput.addEventListener('input', () => {
    if (result.hidden) return;
    setStatus('Reference checksum changed. Calculate again to compare.', '');
  });
  button.addEventListener('click', async () => {
    if (busy) return;
    reset();
    const file = fileInput.files?.[0];
    if (!file) { setStatus('Choose a file first.', 'error'); fileInput.focus(); return; }
    if (!file.size) { setStatus('The selected file is empty.', 'error'); return; }
    if (file.size > MAX_BYTES) {
      setStatus('This tool supports files up to 32 MiB. Use the desktop commands below for larger files.', 'error');
      return;
    }
    const expected = expectedInput.value.trim().toLowerCase().replace(/\s+/g, '');
    if (expected && !/^[0-9a-f]{64}$/.test(expected)) {
      setStatus('The optional reference must be exactly 64 hexadecimal characters.', 'error');
      expectedInput.focus();
      return;
    }
    if (!globalThis.isSecureContext || !globalThis.crypto?.subtle) {
      setStatus('Web Crypto is unavailable. Use HTTPS or a desktop hashing command.', 'error');
      return;
    }
    busy = true;
    button.disabled = true;
    fileInput.disabled = true;
    setStatus('Calculating SHA-256 locally. Your file is not uploaded.');
    try {
      const bytes = await file.arrayBuffer();
      const hashed = await crypto.subtle.digest('SHA-256', bytes);
      const actual = [...new Uint8Array(hashed)].map(b => b.toString(16).padStart(2, '0')).join('');
      digestText.textContent = actual;
      result.hidden = false;
      if (!expected) setStatus('SHA-256 calculated. Compare it with a reference from a trusted publisher.', 'success');
      else if (actual === expected) setStatus('MATCH: file bytes agree with the reference. This does not prove the file is safe.', 'success');
      else setStatus('MISMATCH: file bytes differ. Do not trust or run the download until investigated.', 'error');
    } catch {
      result.hidden = true;
      setStatus('Could not read or hash the file. Try again or use desktop commands.', 'error');
    } finally {
      busy = false;
      button.disabled = false;
      fileInput.disabled = false;
    }
  });
})();
