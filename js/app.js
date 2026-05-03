// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Virtual Office App (Web Version)
// Main entry point — canvas rendering + UI updates
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  const canvas = document.getElementById('office-canvas');
  const ctx = canvas.getContext('2d');
  const bgImg = new Image();
  bgImg.src = 'assets/office-bg.png';

  let chars = [];
  let dims = { w: 0, h: 0 };
  let t = 0;
  let bgLoaded = false;
  let lastDrawTime = 0;
  const FRAME_INTERVAL = 33; // ~30fps

  // ═══ Activity messages for the ticker ═══
  const ACTIVITIES = [
    '💻 Minh đang code tính năng mới',
    '☕ Vy đang pha cà phê',
    '📊 Linh đang review dự án',
    '🎨 Ngân đang thiết kế UI',
    '🎬 Hoàng Cường đang edit video',
    '📋 Đức (CEO) đang kiểm tra tiến độ',
    '🔧 Khoa đang fix bug',
    '📱 Thảo đang chạy marketing campaign',
    '🧪 Hùng đang test QA',
    '📁 Trường đang sắp xếp tư liệu',
    '👥 Mai (HR) đang phỏng vấn ứng viên',
    '📹 Tuấn đang quản lý kênh YouTube',
  ];

  // ═══ Background load ═══
  bgImg.onload = function() {
    bgLoaded = true;
    console.log('[Office] ✅ Background loaded');
    // Hide loader after bg loaded
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2200);
  };
  bgImg.onerror = function() {
    console.warn('[Office] ⚠️ Background image not found, using dark fallback');
    bgLoaded = false;
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2200);
  };

  // ═══ Canvas resize ═══
  function resizeCanvas() {
    const wrap = document.getElementById('canvas-wrap');
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dims = { w, h };
    if (chars.length > 0) rescaleCharacters(chars, dims);
    else chars = initCharacters(dims);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ═══ Character AI update (10fps) ═══
  setInterval(function() {
    if (document.hidden) return;
    updateCharacters(chars, dims);
  }, 100);

  // ═══ Stats update (every 2s) ═══
  setInterval(function() {
    const working = chars.filter(c => c.state === 'typing' || c.state === 'sit' || c.state === 'drinking' || c.state === 'pointing').length;
    const walking = chars.filter(c => c.state === 'walk' || c.state === 'talking').length;
    document.getElementById('working-count').textContent = working;
    document.getElementById('walking-count').textContent = walking;
    document.getElementById('worker-count').textContent = chars.length;
  }, 2000);

  // ═══ Clock update ═══
  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
      now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 30000);

  // ═══ Ticker ═══
  function updateTicker() {
    const el = document.getElementById('ticker-content');
    const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
    el.innerHTML = shuffled.map(a =>
      `<span class="ticker-item">${a}</span>`
    ).join('  •  ');
  }
  updateTicker();
  setInterval(updateTicker, 25000);

  // ═══ Draw banner ═══
  function drawBanner(ctx, w) {
    const bW = 360, bH = 36, bX = w/2 - bW/2, bY = 8;
    ctx.fillStyle = 'rgba(255,215,0,0.08)'; ctx.fillRect(bX, bY, bW, bH);
    ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1; ctx.strokeRect(bX, bY, bW, bH);
    ctx.font = 'bold 14px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,215,0,0.8)'; ctx.fillText('♛  DG MEDIA HOLDING', w/2, bY + bH/2);
  }

  // ═══ Draw monitor content ═══
  function drawMonitor(ctx, x, y, w, h, t, role) {
    ctx.fillStyle = 'rgba(10,15,30,0.9)'; ctx.fillRect(x, y, w, h);
    if (role === 'Developer' || role === 'Intern') {
      ctx.fillStyle = '#55efc466'; ctx.fillRect(x+2, y+2, w*0.6, 2);
      ctx.fillStyle = '#74b9ff44'; ctx.fillRect(x+5, y+6, w*0.4, 2);
      ctx.fillStyle = '#a29bfe44'; ctx.fillRect(x+2, y+10, w*0.7, 2);
      if (Math.sin(t * 0.08) > 0) { ctx.fillStyle = '#55efc4'; ctx.fillRect(x+3, y+6, 1, 3); }
    } else if (role === 'Designer') {
      ctx.fillStyle = '#a29bfe22'; ctx.fillRect(x+2, y+2, w*0.3, h-4);
      ctx.fillStyle = '#fd79a822'; ctx.fillRect(x+w*0.35, y+2, w*0.6, h-4);
    } else {
      ctx.fillStyle = '#74b9ff22'; ctx.fillRect(x+2, y+2, w-4, h-4);
    }
  }

  // ═══ Main draw loop (30fps) ═══
  function draw(timestamp) {
    requestAnimationFrame(draw);

    // Frame rate limiting
    if (timestamp && timestamp - lastDrawTime < FRAME_INTERVAL) return;
    lastDrawTime = timestamp || 0;
    if (document.hidden) return;

    t++;
    const { w, h } = dims;
    if (!w || !h) return;

    // Clear + background
    ctx.clearRect(0, 0, w, h);
    if (bgLoaded) {
      ctx.drawImage(bgImg, 0, 0, w, h);
    } else {
      // Fallback dark gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a0a1a'); grad.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    }

    // Banner
    drawBanner(ctx, w);

    // Monitors (only typing chars)
    chars.forEach(c => {
      if (c.state === 'typing') {
        const monX = c.deskFace === 'left' ? c.deskX - 35 : c.deskX + 15;
        drawMonitor(ctx, monX, c.deskY - 30, 20, 14, t, c.role);
      }
    });

    // Characters
    drawAllCharacters(ctx, chars, t);
  }

  requestAnimationFrame(draw);
  console.log('[Office] 🏢 Virtual Office initialized');
})();
