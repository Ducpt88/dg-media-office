// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Skills Map Toolbar (Web Version)
// Matches the desktop Agent DBH Skills Map controls
// Only visible when admin is logged in
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  let toolbarBuilt = false;
  let autoMode = true;
  let ceoWalking = false;
  let statusPanelOpen = false;

  function buildToolbar() {
    if (toolbarBuilt) return;
    toolbarBuilt = true;

    // ═══ Top Toolbar (matches desktop app) ═══
    const toolbar = document.createElement('div');
    toolbar.id = 'skills-toolbar';
    toolbar.className = 'hidden';
    toolbar.innerHTML = `
      <div class="tb-left">
        <span class="tb-logo">🏢</span>
        <span class="tb-brand">DG M</span>
      </div>
      <div class="tb-center">
        <button class="tb-btn" id="tb-staff"><span class="tb-icon">👥</span> Nhân viên (<span id="tb-staff-count">19</span>)</button>
        <button class="tb-btn" id="tb-ceo-walk"><span class="tb-icon">🚶</span> CEO Đi thăm</button>
        <button class="tb-btn active" id="tb-auto"><span class="tb-icon">⚡</span> Auto ON</button>
        <button class="tb-btn" id="tb-gesture"><span class="tb-icon">🤌</span> Cử chỉ</button>
        <button class="tb-btn" id="tb-decor"><span class="tb-icon">🎨</span> Trang trí</button>
      </div>
      <div class="tb-right">
        <button class="tb-btn tb-icon-only" id="tb-fullscreen" title="Fullscreen"><span class="tb-icon">⛶</span></button>
      </div>
    `;

    // Insert after topbar
    const topbar = document.getElementById('topbar');
    topbar.parentNode.insertBefore(toolbar, topbar.nextSibling);

    // ═══ Status Panel (left side — matches desktop) ═══
    const statusPanel = document.createElement('div');
    statusPanel.id = 'status-panel';
    statusPanel.className = 'hidden';
    statusPanel.innerHTML = `
      <div class="sp-header">
        <span>📊 TRẠNG THÁI</span>
        <button class="sp-close" id="sp-close">✕</button>
      </div>
      <div class="sp-section">
        <div class="sp-row"><span class="sp-dot green"></span><span>Tổng nhân viên</span><span class="sp-val" id="sp-total">19</span></div>
        <div class="sp-row"><span class="sp-dot blue"></span><span>Đang hoạt động</span><span class="sp-val" id="sp-active">0</span></div>
        <div class="sp-row"><span class="sp-dot gold"></span><span>Trạng thái</span><span class="sp-val sp-online" id="sp-status">🟢 Online</span></div>
      </div>
      <div class="sp-section">
        <div class="sp-label">PHÒNG BAN</div>
        <div id="sp-departments"></div>
      </div>
      <div class="sp-section">
        <div class="sp-label">HOẠT ĐỘNG GẦN ĐÂY</div>
        <div id="sp-activity" class="sp-activity-list"></div>
      </div>
    `;
    document.getElementById('app').appendChild(statusPanel);

    // ═══ Gesture Panel ═══
    const gesturePanel = document.createElement('div');
    gesturePanel.id = 'gesture-panel';
    gesturePanel.className = 'floating-panel hidden';
    gesturePanel.innerHTML = `
      <div class="fp-header"><span>🤌 Cử chỉ hàng loạt</span><button class="fp-close" data-panel="gesture-panel">✕</button></div>
      <div class="gesture-grid">
        <button class="gest-btn" data-action="wave">👋<br><small>Vẫy tay</small></button>
        <button class="gest-btn" data-action="clap">👏<br><small>Vỗ tay</small></button>
        <button class="gest-btn" data-action="thumbsup">👍<br><small>Like</small></button>
        <button class="gest-btn" data-action="dance">💃<br><small>Nhảy</small></button>
        <button class="gest-btn" data-action="sit-all">💺<br><small>Tất cả ngồi</small></button>
        <button class="gest-btn" data-action="walk-random">🎲<br><small>Random walk</small></button>
        <button class="gest-btn" data-action="meeting">📋<br><small>Họp</small></button>
        <button class="gest-btn" data-action="break">☕<br><small>Giải lao</small></button>
      </div>
    `;
    document.body.appendChild(gesturePanel);

    // ═══ Events ═══
    document.getElementById('tb-staff').onclick = function() {
      statusPanel.classList.toggle('hidden');
      statusPanelOpen = !statusPanel.classList.contains('hidden');
      if (statusPanelOpen) refreshStatusPanel();
    };
    document.getElementById('sp-close').onclick = function() {
      statusPanel.classList.add('hidden');
      statusPanelOpen = false;
    };

    document.getElementById('tb-ceo-walk').onclick = function() {
      ceoWalking = !ceoWalking;
      this.classList.toggle('active', ceoWalking);
      if (window._officeChars) {
        const ceo = window._officeChars.find(c => c.role === 'CEO');
        if (ceo) {
          if (ceoWalking) {
            ceo.state = 'walk';
            const dims = { w: window.innerWidth, h: window.innerHeight * 0.7 };
            ceo.tx = 100 + Math.random() * (dims.w - 200);
            ceo.ty = 100 + Math.random() * (dims.h - 150);
            ceo.stateTimer = 0;
          } else {
            ceo.tx = ceo.deskX; ceo.ty = ceo.deskY;
            ceo.state = 'walk'; ceo.stateTimer = 0;
          }
        }
      }
    };

    document.getElementById('tb-auto').onclick = function() {
      autoMode = !autoMode;
      this.classList.toggle('active', autoMode);
      this.innerHTML = `<span class="tb-icon">⚡</span> Auto ${autoMode ? 'ON' : 'OFF'}`;
      window._autoMode = autoMode;
    };

    document.getElementById('tb-gesture').onclick = function() {
      gesturePanel.classList.toggle('hidden');
    };

    document.getElementById('tb-fullscreen').onclick = function() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    };

    // Close floating panels
    document.querySelectorAll('.fp-close').forEach(btn => {
      btn.onclick = function() { document.getElementById(this.dataset.panel).classList.add('hidden'); };
    });

    // Gesture buttons
    document.querySelectorAll('.gest-btn').forEach(btn => {
      btn.onclick = function() {
        const action = this.dataset.action;
        if (!window._officeChars) return;
        const chars = window._officeChars;
        const dims = { w: window.innerWidth, h: window.innerHeight * 0.7 };
        switch(action) {
          case 'sit-all': chars.forEach(c => { c.state = 'sit'; c.stateTimer = 0; }); break;
          case 'walk-random': chars.forEach(c => { c.tx = 50+Math.random()*(dims.w-100); c.ty = 80+Math.random()*(dims.h-100); c.state = 'walk'; c.stateTimer = 0; }); break;
          case 'meeting': chars.forEach(c => { c.tx = dims.w/2 + (Math.random()-0.5)*150; c.ty = dims.h/2 + (Math.random()-0.5)*100; c.state = 'walk'; c.stateTimer = 0; }); break;
          case 'break': chars.forEach(c => { c.state = 'drinking'; c.stateTimer = 0; }); break;
          case 'wave': case 'clap': case 'thumbsup': case 'dance':
            chars.forEach(c => { c.state = 'talking'; c.stateTimer = 0; }); break;
        }
        gesturePanel.classList.add('hidden');
      };
    });

    // Schedule, Video, Decor → show toast (future feature)
    ['tb-decor'].forEach(id => {
      document.getElementById(id).onclick = function() {
        showToolbarToast('🔜 Tính năng đang phát triển...');
      };
    });
  }

  function refreshStatusPanel() {
    if (!window._officeChars) return;
    const chars = window._officeChars;
    const active = chars.filter(c => ['sit','typing','drinking','pointing','talking'].includes(c.state)).length;
    document.getElementById('sp-total').textContent = chars.length;
    document.getElementById('sp-active').textContent = active;
    document.getElementById('tb-staff-count').textContent = chars.length;

    // Departments
    const depts = {};
    chars.forEach(c => {
      const dept = c.team || c.role;
      if (!depts[dept]) depts[dept] = [];
      depts[dept].push(c);
    });
    const deptEl = document.getElementById('sp-departments');
    deptEl.innerHTML = Object.entries(depts).map(([name, members]) =>
      `<div class="sp-dept"><span class="sp-dept-name">${name}</span><span class="sp-dept-count">${members.length}</span></div>`
    ).join('');

    // Activity log
    const actEl = document.getElementById('sp-activity');
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    const activities = chars.filter(c => c.state === 'typing').slice(0, 4).map(c =>
      `<div class="sp-act-item"><span class="sp-act-time">${time}</span> ${c.name} đang làm việc</div>`
    );
    if (activities.length === 0) activities.push(`<div class="sp-act-item"><span class="sp-act-time">${time}</span> Văn phòng đang yên tĩnh...</div>`);
    actEl.innerHTML = activities.join('');
  }

  function showToolbarToast(msg) {
    let toast = document.getElementById('admin-toast');
    if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; document.body.appendChild(toast); }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ═══ Show/hide based on admin state ═══
  function checkAdmin() {
    const isAdmin = localStorage.getItem('dg_admin') === 'true';
    const toolbar = document.getElementById('skills-toolbar');
    if (toolbar) {
      if (isAdmin) toolbar.classList.remove('hidden');
      else { toolbar.classList.add('hidden'); const sp = document.getElementById('status-panel'); if (sp) sp.classList.add('hidden'); }
    }
  }

  // Auto-refresh status
  setInterval(function() {
    if (statusPanelOpen) refreshStatusPanel();
    checkAdmin();
  }, 2000);

  // Init
  function init() { buildToolbar(); checkAdmin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
