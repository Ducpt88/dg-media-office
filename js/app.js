// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Virtual Office (OPTIMIZED)
// 2-layer canvas: static BG (drawn once) + dynamic chars (24fps)
// Sprite caching: pre-render chars to offscreen canvas
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══ 2-Layer Canvas Setup ═══
  const bgCanvas = document.getElementById('bg-canvas');
  const charCanvas = document.getElementById('char-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const charCtx = charCanvas.getContext('2d');
  const bgImg = new Image();

  let chars = [];
  let dims = { w: 0, h: 0 };
  let t = 0;
  let bgLoaded = false;
  let bgDrawn = false;
  let lastDrawTime = 0;
  let loaderHidden = false;
  const FRAME_INTERVAL = 42; // ═══ 24fps — smooth enough, saves 20% vs 30fps ═══

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const el = document.getElementById('loader');
    if (el) el.classList.add('hidden');
  }

  // ═══ Sprite Cache ═══
  const _spriteCache = new Map();
  const MAX_CACHE = 250;

  function getSpriteKey(c, t) {
    let anim = 0;
    if (c.state === 'walk' || c.state === 'walkToRest') anim = Math.floor(c.walkPhase) % 4;
    else if (c.state === 'typing') anim = Math.floor(t / 10) % 2;
    else if (c.state === 'talking') anim = Math.floor(t / 12) % 2;
    return `${c.id}|${c.state}|${c.facingRight?1:0}|${anim}`;
  }

  function renderSprite(c, t) {
    const s = (c.scale || 1) * 1.8;
    const isCEO = c.role === 'CEO';
    const pw = Math.ceil(55 * s), ph = Math.ceil(75 * s);
    const w = pw * 2, h = ph * 2;
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    ctx.translate(pw, ph * 0.6);

    const isWalking = c.state === 'walk' || c.state === 'walkToRest';
    const isSitting = c.state === 'sit' || c.state === 'typing' || c.state === 'drinking' || c.state === 'pointing';
    const isTalking = c.state === 'talking';
    const bob = isWalking ? Math.abs(Math.sin(c.walkPhase * 2)) * 2.5 * s : 0;
    const armSwing = isWalking ? Math.sin(c.walkPhase * 2) * 15 : 0;
    const legSwing = isWalking ? Math.sin(c.walkPhase * 2) * 10 : 0;
    const typeArm = (c.state === 'typing') ? Math.sin(c.typingPhase * 6) * 3 : 0;
    const talkNod = isTalking ? Math.sin(t * 0.06) * 2 : 0;
    const drinkArm = (c.state === 'drinking') ? -15 + Math.sin(t * 0.04) * 3 : 0;
    const outlineW = isCEO ? 2.5 : 1.5;

    ctx.save();
    ctx.translate(0, -bob);
    if (!c.facingRight) ctx.scale(-1, 1);

    // CEO glow
    if (isCEO) { ctx.fillStyle = 'rgba(255,215,0,0.08)'; ctx.beginPath(); ctx.arc(0, 0, 35*s, 0, Math.PI*2); ctx.fill(); }

    // Shadow
    if (!isSitting) {
      ctx.beginPath(); ctx.ellipse(0, 20*s, 12*s, 4*s, 0, 0, Math.PI*2);
      ctx.fillStyle = isCEO ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.25)'; ctx.fill();
    }

    // Legs
    ctx.fillStyle = c.pants; ctx.lineWidth = outlineW;
    if (isSitting) {
      const tw = 4.5*s, tl = 8*s;
      ctx.fillRect(2*s, 6*s, tl, tw); ctx.fillRect(2*s, 1*s, tl, tw);
      ctx.fillRect(2*s+tl-tw, 6*s+tw, tw, 6*s); ctx.fillRect(2*s+tl-tw, 1*s+tw, tw, 6*s);
      ctx.fillStyle = isCEO ? '#111' : '#1a1a2e';
      ctx.fillRect(2*s+tl-tw-1*s, 6*s+tw+6*s, 6*s, 2.5*s);
      ctx.fillRect(2*s+tl-tw-1*s, 1*s+tw+6*s, 6*s, 2.5*s);
    } else {
      const legY = 10*s, legH = 10*s;
      const lx1 = -5*s + (isWalking ? -legSwing*0.35 : 0);
      ctx.fillRect(lx1, legY, 4.5*s, legH);
      const lx2 = 0.5*s + (isWalking ? legSwing*0.35 : 0);
      ctx.fillRect(lx2, legY, 4.5*s, legH);
      ctx.fillStyle = isCEO ? '#111' : '#1a1a2e';
      ctx.fillRect(lx1-1*s, legY+legH-1, 6.5*s, 2.5*s);
      ctx.fillRect(lx2-0.5*s, legY+legH-1, 6.5*s, 2.5*s);
    }

    // Body
    const bodyY = -4*s;
    ctx.fillStyle = c.shirt;
    ctx.beginPath();
    ctx.moveTo(-8.5*s, bodyY+14*s); ctx.lineTo(-7.5*s, bodyY);
    ctx.lineTo(7.5*s, bodyY); ctx.lineTo(8.5*s, bodyY+14*s);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = outlineW; ctx.stroke();
    ctx.fillStyle = c.accent; ctx.fillRect(-3*s, bodyY, 6*s, 3*s);

    // Arms (simplified — single fillRect per arm, no rotate)
    ctx.fillStyle = c.shirt;
    const armRotL = (isWalking ? armSwing : (c.state === 'drinking' ? drinkArm : typeArm));
    const armRotR = -(isWalking ? armSwing : typeArm);
    // Left arm
    ctx.save(); ctx.translate(-8.5*s, bodyY+2*s); ctx.rotate(armRotL * Math.PI / 180);
    ctx.fillRect(-2.5*s, 0, 4*s, 10*s);
    ctx.fillStyle = c.skin; ctx.fillRect(-2.5*s, 9*s, 4*s, 3.5*s);
    if (c.state === 'drinking') { ctx.fillStyle = '#8b4513'; ctx.fillRect(-3*s, 7*s, 5*s, 5*s); ctx.fillStyle = '#fff'; ctx.fillRect(-3*s, 7*s, 5*s, 1.5*s); }
    ctx.restore();
    // Right arm
    ctx.save(); ctx.fillStyle = c.shirt; ctx.translate(8.5*s, bodyY+2*s); ctx.rotate(armRotR * Math.PI / 180);
    ctx.fillRect(-1.5*s, 0, 4*s, 10*s);
    ctx.fillStyle = c.skin; ctx.fillRect(-1.5*s, 9*s, 4*s, 3.5*s);
    ctx.restore();

    // Head
    const headY = bodyY - 10*s + talkNod, headR = 9.5*s;
    ctx.fillStyle = c.skin; ctx.beginPath(); ctx.arc(0, headY, headR, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = outlineW; ctx.stroke();

    // Hair
    ctx.fillStyle = c.hair; ctx.beginPath();
    ctx.arc(0, headY-2*s, headR+1.5*s, Math.PI, 0); ctx.fill();
    if (c.gender === 'F') {
      ctx.fillRect(-10.5*s, headY-4*s, 4.5*s, 17*s);
      ctx.fillRect(6*s, headY-4*s, 4.5*s, 17*s);
      ctx.beginPath(); ctx.arc(0, headY-2*s, headR+2.5*s, Math.PI*1.1, Math.PI*-0.1); ctx.fill();
    } else { ctx.fillRect(-10.5*s, headY-6*s, 21*s, 6.5*s); }

    // Eyes
    ctx.fillStyle = '#111';
    const eyeY = headY + 1*s;
    const blink = Math.sin(t * 0.02 + (c.deskX || 0)) > 0.95;
    if (blink) {
      ctx.fillRect(-5.5*s, eyeY-0.5*s, 3.5*s, 1.2*s);
      ctx.fillRect(2*s, eyeY-0.5*s, 3.5*s, 1.2*s);
    } else {
      ctx.beginPath(); ctx.arc(-3.5*s, eyeY, 2*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(3.5*s, eyeY, 2*s, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-2.8*s, eyeY-0.6*s, 0.8*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(4.2*s, eyeY-0.6*s, 0.8*s, 0, Math.PI*2); ctx.fill();
    }

    // CEO sunglasses
    if (isCEO) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(-6*s, eyeY-2.5*s, 5*s, 4.5*s); ctx.fillRect(1*s, eyeY-2.5*s, 5*s, 4.5*s);
      ctx.fillRect(-1*s, eyeY-0.5*s, 2*s, 1*s);
    }

    // Mouth
    if (isTalking) {
      ctx.fillStyle = '#c0392b';
      const mo = Math.abs(Math.sin(t * 0.1)) * 2.5 * s;
      ctx.beginPath(); ctx.ellipse(0, headY+5*s, 2.5*s, mo, 0, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.arc(0, headY+3.5*s, 2.5*s, 0.1*Math.PI, 0.9*Math.PI); ctx.stroke();
    }

    // Glasses
    if (c.role === 'Accountant' || c.role === 'Tester') {
      ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(-3.5*s, eyeY, 3.5*s, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(3.5*s, eyeY, 3.5*s, 0, Math.PI*2); ctx.stroke();
    }

    // CEO vest
    if (isCEO) {
      ctx.fillStyle = '#ffd700'; ctx.fillRect(-2*s, bodyY+2*s, 4*s, 12*s);
      ctx.fillStyle = 'rgba(255,215,0,0.1)'; ctx.fillRect(-8.5*s, bodyY, 17*s, 14*s);
    }

    // YouTube team logo
    if (c.team === 'YouTube' || c.team === 'YouTube Content') {
      const ly = bodyY + 6*s, lw = 6*s, lh = 4*s;
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(-lw/2+1*s, ly-lh/2); ctx.lineTo(lw/2-1*s, ly-lh/2);
      ctx.lineTo(lw/2, ly); ctx.lineTo(lw/2-1*s, ly+lh/2);
      ctx.lineTo(-lw/2+1*s, ly+lh/2); ctx.lineTo(-lw/2, ly);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath();
      ctx.moveTo(-1.2*s, ly-1.5*s); ctx.lineTo(1.8*s, ly); ctx.lineTo(-1.2*s, ly+1.5*s);
      ctx.closePath(); ctx.fill();
    }

    // Talk bubble
    if (isTalking) {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      const bx = 12*s, by = headY-16*s;
      ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx+22*s, by); ctx.lineTo(bx+22*s, by+11*s);
      ctx.lineTo(bx+5*s, by+11*s); ctx.lineTo(bx+2*s, by+15*s);
      ctx.lineTo(bx+4*s, by+11*s); ctx.lineTo(bx, by+11*s);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#333'; ctx.font = `bold ${4.5*s}px Inter`;
      ctx.textAlign = 'left'; ctx.fillText(isCEO ? '📋 Check!' : '💬 ...', bx+2*s, by+8*s);
    }

    ctx.restore();
    return { canvas: cv, w, h, cx: pw, cy: ph * 0.6 };
  }

  function getCachedSprite(c, t) {
    const key = getSpriteKey(c, t);
    let sprite = _spriteCache.get(key);
    if (sprite) return sprite;
    sprite = renderSprite(c, t);
    _spriteCache.set(key, sprite);
    // Limit cache size
    if (_spriteCache.size > MAX_CACHE) {
      const iter = _spriteCache.keys();
      for (let i = 0; i < 30; i++) _spriteCache.delete(iter.next().value);
    }
    return sprite;
  }

  // ═══ Activity ticker ═══
  const ACTIVITIES = [
    '💻 Minh đang code tính năng mới', '☕ Vy đang pha cà phê',
    '📊 Linh đang review dự án', '🎨 Ngân đang thiết kế UI',
    '🎬 Hoàng Cường đang edit video', '📋 Đức (CEO) đang kiểm tra tiến độ',
    '🔧 Khoa đang fix bug', '📱 Thảo đang chạy marketing campaign',
    '🧪 Hùng đang test QA', '📁 Trường đang sắp xếp tư liệu',
    '👥 Mai (HR) đang phỏng vấn ứng viên', '📹 Tuấn đang quản lý kênh YouTube',
  ];

  // ═══ Background load ═══
  bgImg.onload = function() {
    bgLoaded = true;
    drawBackground();
    setTimeout(hideLoader, 800);
  };
  bgImg.onerror = function() {
    console.warn('[Office] BG failed');
    bgLoaded = false;
    drawBackground();
    setTimeout(hideLoader, 500);
  };
  // Set src AFTER handlers (prevents race condition)
  bgImg.src = 'assets/office-bg.png';
  // Handle already-cached images
  if (bgImg.complete && bgImg.naturalWidth > 0) {
    bgLoaded = true;
    setTimeout(function() { drawBackground(); hideLoader(); }, 300);
  }
  // FAILSAFE: always hide after 4s
  setTimeout(hideLoader, 4000);

  // ═══ Draw background ONCE ═══
  function drawBackground() {
    if (!dims.w) return;
    const dpr = window.devicePixelRatio || 1;
    bgCanvas.width = dims.w * dpr;
    bgCanvas.height = dims.h * dpr;
    bgCanvas.style.width = dims.w + 'px';
    bgCanvas.style.height = dims.h + 'px';
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (bgLoaded) {
      bgCtx.drawImage(bgImg, 0, 0, dims.w, dims.h);
    } else {
      const grad = bgCtx.createLinearGradient(0, 0, 0, dims.h);
      grad.addColorStop(0, '#0a0a1a'); grad.addColorStop(1, '#1a1a2e');
      bgCtx.fillStyle = grad; bgCtx.fillRect(0, 0, dims.w, dims.h);
    }

    // DG MEDIA HOLDING banner (static, drawn once with background)
    const bW = 360, bH = 36, bX = dims.w/2 - bW/2, bY = 8;
    bgCtx.fillStyle = 'rgba(255,215,0,0.08)'; bgCtx.fillRect(bX, bY, bW, bH);
    bgCtx.strokeStyle = 'rgba(255,215,0,0.25)'; bgCtx.lineWidth = 1; bgCtx.strokeRect(bX, bY, bW, bH);
    bgCtx.font = 'bold 14px Inter,sans-serif'; bgCtx.textAlign = 'center'; bgCtx.textBaseline = 'middle';
    bgCtx.fillStyle = 'rgba(255,215,0,0.8)'; bgCtx.fillText('♛  DG MEDIA HOLDING', dims.w/2, bY + bH/2);

    bgDrawn = true;
  }

  // ═══ Canvas resize ═══
  function resizeCanvas() {
    const wrap = document.getElementById('canvas-wrap');
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    charCanvas.width = w * dpr;
    charCanvas.height = h * dpr;
    charCanvas.style.width = w + 'px';
    charCanvas.style.height = h + 'px';
    charCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dims = { w, h };
    if (chars.length > 0) rescaleCharacters(chars, dims);
    else chars = initCharacters(dims);
    window._officeChars = chars; // Expose for admin panel
    // Redraw background on resize
    drawBackground();
    // Clear sprite cache on resize (scale changed)
    _spriteCache.clear();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ═══ Character AI (10fps) ═══
  setInterval(function() {
    if (document.hidden) return;
    updateCharacters(chars, dims);
  }, 100);

  // ═══ Stats (every 3s) ═══
  setInterval(function() {
    const w = chars.filter(c => c.state === 'typing' || c.state === 'sit' || c.state === 'drinking' || c.state === 'pointing').length;
    const m = chars.filter(c => c.state === 'walk' || c.state === 'talking').length;
    document.getElementById('working-count').textContent = w;
    document.getElementById('walking-count').textContent = m;
  }, 3000);

  // ═══ Clock (every 30s) ═══
  function updateClock() {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  updateClock(); setInterval(updateClock, 30000);

  // ═══ Ticker ═══
  function updateTicker() {
    const el = document.getElementById('ticker-content');
    el.innerHTML = [...ACTIVITIES].sort(() => Math.random() - 0.5)
      .map(a => `<span class="ticker-item">${a}</span>`).join('  •  ');
  }
  updateTicker(); setInterval(updateTicker, 25000);

  // ═══ Monitor drawing (simplified) ═══
  function drawMonitor(ctx, x, y, w, h, t, role) {
    ctx.fillStyle = 'rgba(10,15,30,0.9)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#55efc466'; ctx.fillRect(x+2, y+2, w*0.6, 2);
    ctx.fillStyle = '#74b9ff44'; ctx.fillRect(x+5, y+6, w*0.4, 2);
    if (Math.sin(t * 0.08) > 0) { ctx.fillStyle = '#55efc4'; ctx.fillRect(x+3, y+6, 1, 3); }
  }

  // ═══ MAIN DRAW LOOP — 24fps, chars only ═══
  let _sorted = [], _lastSort = 0;

  function draw(timestamp) {
    requestAnimationFrame(draw);
    if (timestamp && timestamp - lastDrawTime < FRAME_INTERVAL) return;
    lastDrawTime = timestamp || 0;
    if (document.hidden) return;
    t++;

    const { w, h } = dims;
    if (!w || !h) return;

    // ═══ PERF: Only clear & redraw character layer (NOT background) ═══
    charCtx.clearRect(0, 0, w, h);

    // Monitors (only typing chars)
    chars.forEach(c => {
      if (c.state === 'typing') {
        const monX = c.deskFace === 'left' ? c.deskX - 35 : c.deskX + 15;
        drawMonitor(charCtx, monX, c.deskY - 30, 20, 14, t, c.role);
      }
    });

    // ═══ PERF: Sprite-cached character drawing ═══
    // Sort every 20 frames
    if (t - _lastSort > 20 || _sorted.length !== chars.length) {
      _sorted = [...chars].sort((a, b) => a.y - b.y);
      _lastSort = t;
    }
    for (let i = 0; i < _sorted.length; i++) {
      const c = _sorted[i];
      const sprite = getCachedSprite(c, t);
      // drawImage of cached sprite — 1 call instead of ~50 draw calls!
      charCtx.drawImage(sprite.canvas, c.x - sprite.cx, c.y - sprite.cy);

      // Name labels (lightweight fillText only, no sprite needed)
      const s = (c.scale || 1) * 1.8;
      const isCEO = c.role === 'CEO';
      const nameSize = isCEO ? 12 : 10;
      charCtx.textAlign = 'center';
      charCtx.font = `bold ${nameSize}px Inter,sans-serif`;
      charCtx.fillStyle = 'rgba(0,0,0,0.7)'; charCtx.fillText(c.name, c.x+1, c.y+28*s+1);
      charCtx.fillStyle = isCEO ? '#ffd700' : 'rgba(255,230,120,0.95)'; charCtx.fillText(c.name, c.x, c.y+28*s);
      charCtx.font = `bold ${isCEO ? 9 : 8}px Inter`;
      charCtx.fillStyle = 'rgba(0,0,0,0.5)'; charCtx.fillText(c.role, c.x+1, c.y+38*s+1);
      charCtx.fillStyle = c.accent; charCtx.fillText(c.role, c.x, c.y+38*s);
    }
  }

  requestAnimationFrame(draw);
  console.log('[Office] 🏢 Virtual Office initialized (optimized: 2-layer + sprite cache)');
})();
