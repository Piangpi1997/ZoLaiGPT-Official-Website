// Firebase Auth for the ZoLaiGPT website.
// Uses the same Firebase project as the ZOLAI GPT Android app, so one account
// works on the website and in the app.
// The firebaseConfig below is public client configuration: the apiKey is a
// browser key that identifies the project, not a secret. Never put passwords,
// service-account keys or Admin SDK credentials in this file.
// If Firebase fails to load (offline, blocked CDN), this module simply does
// nothing — the site keeps working and the header shows a plain "Log in" link.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut,
  sendPasswordResetEmail, sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Firebase project: ZOLAI GPT (myapplication-8e3f3a00) — the same project the
// Android app uses. Web app "ai-studio-applet-webapp"; zolaigptofficial.com
// is in the project's authorized domains.
const firebaseConfig = {
  apiKey: 'AIzaSyDRo3HIpnVA_L3vI5WSm9UiYJFfvGuCy-E',
  authDomain: 'myapplication-8e3f3a00.firebaseapp.com',
  projectId: 'myapplication-8e3f3a00',
  storageBucket: 'myapplication-8e3f3a00.firebasestorage.app',
  messagingSenderId: '84612259794',
  appId: '1:84612259794:web:7771c5c8a94b7d3006320b'
};

let auth = null;
let authReadyPromise = null;
let currentUser = undefined; // undefined = not resolved yet, null = signed out

// Initialise Firebase once and start listening for the auth state. Returns the
// Auth object, or null when Firebase is unavailable (offline, blocked CDN).
function ensureAuth() {
  if (auth) return auth;
  if (!configReady()) return null;
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => { currentUser = user || null; resolve(currentUser); });
    });
  } catch {
    return null;
  }
  return auth;
}

// Resolves with the signed-in user, null when signed out, or undefined when
// the auth state could not be determined in time (Firebase unreachable).
function whenAuthReady(timeoutMs = 8000) {
  if (!ensureAuth()) return Promise.resolve(undefined);
  if (currentUser !== undefined) return Promise.resolve(currentUser);
  return Promise.race([
    authReadyPromise,
    new Promise((resolve) => setTimeout(() => resolve(undefined), timeoutMs)),
  ]);
}

// Page gate: send signed-out visitors to the login page (they come back here
// after signing in). Returns the user when signed in, or undefined when the
// state could not be verified — in that case the page is left usable rather
// than blocking everyone on a Firebase outage. This is a user-experience
// gate, not a security boundary: the pages are static files.
export async function guardPage(next) {
  const user = await whenAuthReady(8000);
  if (user) return user;
  if (user === undefined) return undefined;
  try {
    location.replace('/login/?next=' + encodeURIComponent(next || location.pathname));
  } catch {}
  return null;
}

function configReady() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('FIREBASE_');
}

function friendlyError(err) {
  const code = (err && err.code) || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is wrong. Check them and try again.';
    case 'auth/email-already-in-use':
      return 'That email already has an account. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'That email address does not look right.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes and try again.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before finishing.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in window is already open.';
    case 'auth/unauthorized-domain':
      return 'This website is not yet authorized for sign-in. Try again later.';
    case 'auth/network-request-failed':
      return 'Network problem. Check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return (err && err.message) ? err.message : 'Something went wrong. Try again.';
  }
}

function displayName(user) {
  if (user.displayName) return user.displayName.split(' ')[0];
  if (user.email) return user.email.split('@')[0];
  return 'Account';
}

function renderHeader(user) {
  const bar = document.querySelector('.header-actions');
  if (!bar) return;
  bar.querySelector('[data-auth-slot]')?.remove();
  const slot = document.createElement('span');
  slot.setAttribute('data-auth-slot', '');
  if (user) {
    const a = document.createElement('a');
    a.className = 'btn btn--sm header-auth';
    a.href = '/login/';
    a.textContent = displayName(user);
    slot.append(a);
  } else {
    const a = document.createElement('a');
    a.className = 'btn btn--sm header-auth';
    a.href = '/login/';
    a.textContent = 'Log in';
    slot.append(a);
  }
  const cta = bar.querySelector('.header-cta');
  if (cta) bar.insertBefore(slot, cta);
  else bar.prepend(slot);
}

function initLoginPage() {
  const form = document.getElementById('auth-form');
  if (!form || !auth) return;
  const emailEl = document.getElementById('auth-email');
  const passEl = document.getElementById('auth-password');
  const submitBtn = document.getElementById('auth-submit');
  const googleBtn = document.getElementById('auth-google');
  const forgotBtn = document.getElementById('auth-forgot');
  const toggleLink = document.getElementById('auth-toggle');
  const statusEl = document.getElementById('auth-status');
  const titleEl = document.getElementById('auth-title');
  const signedInEl = document.getElementById('auth-signed-in');
  const signedOutEl = document.getElementById('auth-signed-out');
  const signedInEmail = document.getElementById('auth-signed-in-email');
  const signOutBtn = document.getElementById('auth-sign-out');
  let mode = 'signin'; // or 'signup'

  const setStatus = (msg, isError) => {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.hidden = !msg;
    statusEl.classList.toggle('is-error', !!isError);
  };
  const setBusy = (busy) => {
    submitBtn.disabled = busy;
    googleBtn.disabled = busy;
  };
  const nextUrl = () => {
    try {
      const next = new URLSearchParams(location.search).get('next');
      if (next && next.startsWith('/') && !next.startsWith('//')) return next;
    } catch {}
    return '/';
  };
  const goNext = () => { location.href = nextUrl(); };

  const showSignedIn = (user) => {
    signedOutEl.hidden = true;
    signedInEl.hidden = false;
    signedInEmail.textContent = user.email || displayName(user);
    // If the visitor arrived here to reach a gated page, point the button there.
    const next = nextUrl();
    const openBtn = signedInEl.querySelector('a.btn--primary');
    if (openBtn && next !== '/') {
      openBtn.href = next;
      openBtn.textContent = 'Continue';
    }
  };
  const showSignedOut = () => {
    signedInEl.hidden = true;
    signedOutEl.hidden = false;
  };

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    mode = mode === 'signin' ? 'signup' : 'signin';
    titleEl.textContent = mode === 'signin' ? 'Log in.' : 'Create an account.';
    submitBtn.textContent = mode === 'signin' ? 'Log in' : 'Create account';
    toggleLink.textContent = mode === 'signin'
      ? 'No account yet? Create one'
      : 'Already have an account? Log in';
    setStatus('');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const password = passEl.value;
    if (!email || !password) { setStatus('Enter your email and password.', true); return; }
    setBusy(true);
    setStatus(mode === 'signin' ? 'Logging in…' : 'Creating your account…');
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        goNext();
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        try { await sendEmailVerification(cred.user); } catch {}
        setStatus('Account created. A verification email was sent to ' + email + '.');
        setTimeout(goNext, 1500);
      }
    } catch (err) {
      setStatus(friendlyError(err), true);
    } finally {
      setBusy(false);
    }
  });

  googleBtn.addEventListener('click', async () => {
    setBusy(true);
    setStatus('Opening Google sign-in…');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      goNext();
    } catch (err) {
      setStatus(friendlyError(err), true);
    } finally {
      setBusy(false);
    }
  });

  forgotBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    if (!email) { setStatus('Enter your email above first, then use this link.', true); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('Password reset email sent to ' + email + '. Check your inbox.');
    } catch (err) {
      setStatus(friendlyError(err), true);
    }
  });

  signOutBtn.addEventListener('click', async () => {
    try { await signOut(auth); } catch {}
    showSignedOut();
    setStatus('Signed out.');
  });

  onAuthStateChanged(auth, (user) => {
    if (user) showSignedIn(user);
    else showSignedOut();
  });
}

export function initAuth() {
  // Always render a plain "Log in" link first so the header is complete
  // even if Firebase is unavailable.
  renderHeader(null);
  if (!ensureAuth()) return;
  onAuthStateChanged(auth, (user) => renderHeader(user));
  initLoginPage();
  initDownloadGate();
}

// The Android APK download needs a signed-in account. Intercept the download
// link: signed-in visitors download straight away, everyone else goes to the
// login page and comes back here afterwards. The signed-in user's Firebase ID
// token is POSTed to the download endpoint so the server can verify it —
// POST keeps the token out of the URL, the browser history and the server
// logs. If Firebase cannot be reached the click is left alone (fail open) and
// the server decides: no token means a redirect to the login page.
function initDownloadGate() {
  document.addEventListener('click', async (e) => {
    const a = e.target.closest
      ? e.target.closest('a[href="/download/android"], a[href^="/download/android?"]')
      : null;
    if (!a) return;
    e.preventDefault();
    const loginNext = '/login/?next=' + encodeURIComponent(location.pathname + location.search);
    const user = await whenAuthReady(5000);
    if (user === null) { location.href = loginNext; return; }
    if (!user) { location.href = a.href; return; }
    let token = null;
    try { token = await user.getIdToken(); } catch {}
    if (!token) { location.href = a.href; return; }
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = a.href;
    form.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token';
    input.value = token;
    form.append(input);
    document.body.append(form);
    form.submit();
  });
}
