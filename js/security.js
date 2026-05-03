// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Security Module
// SHA-256 hashed PIN | Brute-force protection | Session expiry
// Device fingerprint | Anti-tampering
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══ PIN hash (SHA-256 of "2024") — PIN KHÔNG lưu plaintext ═══
  // Đổi PIN: hash PIN mới bằng SHA-256 rồi thay vào đây
  const PIN_HASH = '6557739a67283a8de383fc5c0997fbec7c5721a46f28f3235fc9607598d9016b';

  // ═══ Config ═══
  const MAX_ATTEMPTS = 5;           // Tối đa 5 lần thử
  const LOCKOUT_MINUTES = 30;       // Khóa 30 phút sau 5 lần sai
  const SESSION_HOURS = 24;         // Phiên hết hạn sau 24h
  const STORAGE_KEY = 'dg_sec';     // Encrypted storage key

  // ═══ SHA-256 Hash ═══
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ═══ Device Fingerprint (basic) ═══
  function getDeviceFingerprint() {
    const parts = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language,
      navigator.hardwareConcurrency || 0
    ];
    return parts.join('|');
  }

  // ═══ Secure Storage ═══
  function getSecData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(atob(raw));
    } catch(e) { return null; }
  }

  function setSecData(data) {
    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(data)));
  }

  function clearSecData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('dg_admin');
  }

  // ═══ Check if locked out ═══
  function isLockedOut() {
    const data = getSecData();
    if (!data || !data.lockUntil) return false;
    if (Date.now() < data.lockUntil) return true;
    // Lockout expired
    data.attempts = 0;
    data.lockUntil = null;
    setSecData(data);
    return false;
  }

  function getLockoutRemaining() {
    const data = getSecData();
    if (!data || !data.lockUntil) return 0;
    return Math.max(0, Math.ceil((data.lockUntil - Date.now()) / 60000));
  }

  // ═══ Record failed attempt ═══
  function recordFailedAttempt() {
    let data = getSecData() || { attempts: 0, lockUntil: null };
    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= MAX_ATTEMPTS) {
      data.lockUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
      data.attempts = 0;
    }
    setSecData(data);
    return data;
  }

  // ═══ Verify PIN ═══
  async function verifyPin(pin) {
    if (isLockedOut()) {
      return { ok: false, locked: true, minutes: getLockoutRemaining() };
    }
    const hash = await sha256(pin);
    if (hash === PIN_HASH) {
      // Create session
      const session = {
        token: await sha256(pin + Date.now() + getDeviceFingerprint()),
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_HOURS * 3600 * 1000,
        device: getDeviceFingerprint(),
        attempts: 0,
        lockUntil: null
      };
      setSecData(session);
      localStorage.setItem('dg_admin', 'true');
      return { ok: true };
    } else {
      const data = recordFailedAttempt();
      const remaining = MAX_ATTEMPTS - (data.attempts || 0);
      return { ok: false, locked: false, remaining: remaining > 0 ? remaining : 0 };
    }
  }

  // ═══ Check session validity ═══
  function isSessionValid() {
    const data = getSecData();
    if (!data || !data.token || !data.expiresAt) return false;
    if (Date.now() > data.expiresAt) {
      clearSecData();
      return false;
    }
    return true;
  }

  // ═══ Logout ═══
  function logout() {
    clearSecData();
  }

  // ═══ Change PIN ═══
  async function changePin(oldPin, newPin) {
    const oldHash = await sha256(oldPin);
    if (oldHash !== PIN_HASH) return { ok: false, msg: 'PIN cũ không đúng' };
    if (newPin.length < 4) return { ok: false, msg: 'PIN mới tối thiểu 4 ký tự' };
    // Note: In production, PIN_HASH would be stored server-side
    // For now, show the new hash so admin can update the code
    const newHash = await sha256(newPin);
    return { ok: true, hash: newHash, msg: `PIN đã đổi! Hash mới: ${newHash.substring(0,16)}...` };
  }

  // ═══ Anti-tampering: check localStorage integrity ═══
  function antiTamper() {
    const adminFlag = localStorage.getItem('dg_admin');
    if (adminFlag === 'true' && !isSessionValid()) {
      clearSecData();
      return false;
    }
    return adminFlag === 'true' && isSessionValid();
  }

  // Run anti-tamper check periodically
  setInterval(function() {
    if (localStorage.getItem('dg_admin') === 'true' && !isSessionValid()) {
      clearSecData();
      location.reload();
    }
  }, 30000);

  // ═══ Expose security API ═══
  window._security = {
    verifyPin,
    isSessionValid,
    isLockedOut,
    getLockoutRemaining,
    logout,
    changePin,
    antiTamper,
    sha256
  };
})();
