// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Full Admin Panel v2
// Multi-device adaptive | Full character + office management
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // PIN is SHA-256 hashed in security.js — NEVER stored in plaintext
  let isAdmin = (window._security && window._security.isSessionValid()) || localStorage.getItem('dg_admin') === 'true';
  let selectedChar = null;
  let adminTab = 'chars'; // chars | office | settings

  // ═══ State icons ═══
  const STATE_ICONS = { sit:'💺', typing:'⌨️', walk:'🚶', talking:'💬', drinking:'☕', idle:'😴', pointing:'👆', sleeping:'💤', walkToRest:'🏠' };
  const STATE_NAMES = { sit:'Ngồi', typing:'Đang gõ', walk:'Đi bộ', talking:'Nói chuyện', drinking:'Cà phê', idle:'Nghỉ', pointing:'Chỉ đạo', sleeping:'Ngủ' };

  // ═══ Build Admin UI ═══
  function buildAdminUI() {
    // Floating login button
    const loginBtn = document.createElement('button');
    loginBtn.id = 'admin-login-btn';
    loginBtn.innerHTML = '🔐';
    loginBtn.title = 'Admin Login';
    loginBtn.onclick = showLoginDialog;
    document.body.appendChild(loginBtn);

    // Login dialog
    const dialog = document.createElement('div');
    dialog.id = 'login-dialog';
    dialog.className = 'admin-dialog hidden';
    dialog.innerHTML = `
      <div class="dialog-box">
        <div class="dialog-title">🔐 ĐĂNG NHẬP ADMIN</div>
        <div class="dialog-subtitle">DG Media Holding Management</div>
        <input type="password" id="pin-input" placeholder="Nhập PIN..." maxlength="10" autocomplete="off" inputmode="numeric">
        <div class="dialog-actions">
          <button class="btn-cancel" onclick="document.getElementById('login-dialog').classList.add('hidden')">Hủy</button>
          <button class="btn-ok" id="pin-submit">Đăng nhập</button>
        </div>
        <div id="pin-error" class="dialog-error hidden">❌ Sai PIN!</div>
      </div>
    `;
    document.body.appendChild(dialog);

    // Admin sidebar (full-featured)
    const sidebar = document.createElement('div');
    sidebar.id = 'admin-sidebar';
    sidebar.className = 'hidden';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sh-left">
          <span class="sidebar-crown">♛</span>
          <div>
            <div class="sidebar-title">ADMIN PANEL</div>
            <div class="sidebar-device" id="device-info"></div>
          </div>
        </div>
        <button class="sidebar-close" id="sidebar-close">✕</button>
      </div>

      <!-- Tab navigation -->
      <div class="admin-tabs">
        <button class="tab-btn active" data-tab="chars">👥 Nhân viên</button>
        <button class="tab-btn" data-tab="office">🏢 Văn phòng</button>
        <button class="tab-btn" data-tab="settings">⚙️ Cài đặt</button>
      </div>

      <!-- TAB: Characters -->
      <div class="tab-content" id="tab-chars">
        <div class="sidebar-section">
          <div class="section-header">
            <span class="section-label">DANH SÁCH NHÂN VIÊN</span>
            <span class="char-count" id="char-count-badge">19</span>
          </div>
          <div class="search-box">
            <input type="text" id="char-search" placeholder="🔍 Tìm nhân viên...">
          </div>
          <div id="char-list" class="char-list"></div>
        </div>
        <div class="sidebar-section" id="char-controls" style="display:none">
          <div class="section-label">🎮 ĐIỀU KHIỂN: <span id="ctrl-name" class="ctrl-name-highlight"></span></div>
          <div class="ctrl-group">
            <label>Trạng thái:</label>
            <div class="state-grid" id="state-grid"></div>
          </div>
          <div class="ctrl-group">
            <label>Hướng nhìn:</label>
            <div class="btn-row">
              <button class="ctrl-btn" id="ctrl-face-left">⬅️ Trái</button>
              <button class="ctrl-btn" id="ctrl-face-right">➡️ Phải</button>
            </div>
          </div>
          <div class="ctrl-group">
            <label>Di chuyển:</label>
            <div class="dpad">
              <button class="dpad-btn dpad-up" data-dx="0" data-dy="-25">▲</button>
              <button class="dpad-btn dpad-left" data-dx="-25" data-dy="0">◄</button>
              <button class="dpad-btn dpad-center" id="ctrl-reset">🏠</button>
              <button class="dpad-btn dpad-right" data-dx="25" data-dy="0">►</button>
              <button class="dpad-btn dpad-down" data-dx="0" data-dy="25">▼</button>
            </div>
          </div>
          <div class="ctrl-quick-actions">
            <button class="ctrl-btn qact" id="ctrl-all-sit">📌 Tất cả ngồi</button>
            <button class="ctrl-btn qact" id="ctrl-all-walk">🎲 Random walk</button>
          </div>
        </div>
      </div>

      <!-- TAB: Office -->
      <div class="tab-content hidden" id="tab-office">
        <div class="sidebar-section">
          <div class="section-label">📢 THÔNG BÁO VĂN PHÒNG</div>
          <textarea id="announce-input" placeholder="Nhập thông báo..." maxlength="200" rows="2"></textarea>
          <button class="ctrl-btn btn-announce" id="announce-btn">📣 Gửi thông báo</button>
        </div>
        <div class="sidebar-section">
          <div class="section-label">📊 THỐNG KÊ</div>
          <div class="stats-grid" id="office-stats"></div>
        </div>
        <div class="sidebar-section">
          <div class="section-label">⏰ LỊCH LÀM VIỆC</div>
          <div class="schedule-info">
            <div class="sched-row"><span>Ca sáng:</span><span class="sched-val">08:00 — 12:00</span></div>
            <div class="sched-row"><span>Ca chiều:</span><span class="sched-val">13:30 — 17:30</span></div>
            <div class="sched-row"><span>Ca tối:</span><span class="sched-val">19:00 — 22:00</span></div>
          </div>
        </div>
      </div>

      <!-- TAB: Settings -->
      <div class="tab-content hidden" id="tab-settings">
        <div class="sidebar-section">
          <div class="section-label">🎨 HIỂN THỊ</div>
          <div class="setting-row">
            <span>FPS hiển thị</span>
            <select id="set-fps"><option value="20">20 fps</option><option value="24" selected>24 fps</option><option value="30">30 fps</option></select>
          </div>
          <div class="setting-row">
            <span>Chất lượng</span>
            <select id="set-quality"><option value="low">Thấp</option><option value="medium">Trung bình</option><option value="high" selected>Cao</option></select>
          </div>
          <div class="setting-row">
            <span>Tên nhân vật</span>
            <label class="toggle"><input type="checkbox" id="set-names" checked><span class="slider"></span></label>
          </div>
          <div class="setting-row">
            <span>Hiệu ứng</span>
            <label class="toggle"><input type="checkbox" id="set-effects" checked><span class="slider"></span></label>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="section-label">🔑 BẢO MẬT</div>
          <div class="setting-row">
            <span>Đổi PIN</span>
            <button class="ctrl-btn btn-sm" id="change-pin-btn">Đổi</button>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="section-label">📱 THIẾT BỊ</div>
          <div id="device-details" class="device-details"></div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="btn-logout" id="btn-logout">🚪 Đăng xuất</button>
        <div class="footer-ver">DG Office Admin v2.0</div>
      </div>
    `;
    document.body.appendChild(sidebar);

    // Admin toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'admin-toggle-btn';
    toggleBtn.className = 'hidden';
    toggleBtn.innerHTML = '⚙️';
    toggleBtn.onclick = function() { sidebar.classList.toggle('hidden'); if (!sidebar.classList.contains('hidden')) refreshAll(); };
    document.body.appendChild(toggleBtn);

    // Build state grid buttons
    buildStateGrid();

    // ═══ Events ═══
    document.getElementById('pin-submit').onclick = handleLogin;
    document.getElementById('pin-input').onkeydown = function(e) { if (e.key === 'Enter') handleLogin(); };
    document.getElementById('sidebar-close').onclick = function() { sidebar.classList.add('hidden'); };
    document.getElementById('btn-logout').onclick = handleLogout;
    document.getElementById('ctrl-face-left').onclick = function() { if (selectedChar) selectedChar.facingRight = false; };
    document.getElementById('ctrl-face-right').onclick = function() { if (selectedChar) selectedChar.facingRight = true; };
    document.getElementById('ctrl-reset').onclick = handleReset;
    document.getElementById('announce-btn').onclick = handleAnnounce;
    document.getElementById('ctrl-all-sit').onclick = function() { allCharsAction('sit'); };
    document.getElementById('ctrl-all-walk').onclick = function() { randomWalkAll(); };
    document.getElementById('char-search').oninput = function() { refreshCharList(); };

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        this.classList.add('active');
        document.getElementById('tab-' + this.dataset.tab).classList.remove('hidden');
        adminTab = this.dataset.tab;
        if (adminTab === 'office') refreshStats();
        if (adminTab === 'settings') refreshDeviceInfo();
      };
    });

    // D-pad
    document.querySelectorAll('.dpad-btn[data-dx]').forEach(btn => {
      btn.onclick = function() {
        if (!selectedChar) return;
        selectedChar.tx = selectedChar.x + parseInt(this.dataset.dx);
        selectedChar.ty = selectedChar.y + parseInt(this.dataset.dy);
        selectedChar.state = 'walk';
        selectedChar.stateTimer = 0;
      };
      // Long press for continuous movement
      let interval;
      btn.onmousedown = btn.ontouchstart = function(e) {
        e.preventDefault();
        const dx = parseInt(this.dataset.dx), dy = parseInt(this.dataset.dy);
        interval = setInterval(function() {
          if (!selectedChar) return;
          selectedChar.tx = selectedChar.x + dx;
          selectedChar.ty = selectedChar.y + dy;
          selectedChar.state = 'walk';
          selectedChar.stateTimer = 0;
        }, 150);
      };
      btn.onmouseup = btn.ontouchend = btn.onmouseleave = function() { clearInterval(interval); };
    });

    // Settings
    document.getElementById('set-fps').onchange = function() {
      if (window._setFPS) window._setFPS(parseInt(this.value));
    };

    if (isAdmin) activateAdmin();
  }

  function buildStateGrid() {
    const grid = document.getElementById('state-grid');
    const states = ['sit','typing','walk','talking','drinking','idle','pointing'];
    grid.innerHTML = states.map(s =>
      `<button class="state-btn" data-state="${s}">${STATE_ICONS[s]||'❓'}<br><small>${STATE_NAMES[s]||s}</small></button>`
    ).join('');
    grid.querySelectorAll('.state-btn').forEach(btn => {
      btn.onclick = function() {
        if (!selectedChar) return;
        selectedChar.state = this.dataset.state;
        selectedChar.stateTimer = 0;
        grid.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        showToast(`${selectedChar.name} → ${STATE_NAMES[this.dataset.state]}`);
      };
    });
  }

  // ═══ Login (uses security.js SHA-256 module) ═══
  function showLoginDialog() {
    if (window._security && window._security.isLockedOut()) {
      const mins = window._security.getLockoutRemaining();
      showToast(`🔒 Đã khóa! Thử lại sau ${mins} phút`);
      return;
    }
    document.getElementById('login-dialog').classList.remove('hidden');
    document.getElementById('pin-input').value = '';
    document.getElementById('pin-error').classList.add('hidden');
    setTimeout(() => document.getElementById('pin-input').focus(), 100);
  }

  async function handleLogin() {
    const pin = document.getElementById('pin-input').value;
    if (!pin) return;

    if (window._security) {
      // ═══ Secure login with SHA-256 ═══
      const result = await window._security.verifyPin(pin);
      if (result.ok) {
        isAdmin = true;
        document.getElementById('login-dialog').classList.add('hidden');
        activateAdmin();
      } else if (result.locked) {
        document.getElementById('pin-error').textContent = `🔒 Đã khóa ${result.minutes} phút!`;
        document.getElementById('pin-error').classList.remove('hidden');
        document.getElementById('pin-input').value = '';
      } else {
        document.getElementById('pin-error').textContent = `❌ Sai PIN! Còn ${result.remaining} lần thử`;
        document.getElementById('pin-error').classList.remove('hidden');
        document.getElementById('pin-input').value = '';
        setTimeout(() => document.getElementById('pin-error').classList.add('hidden'), 3000);
      }
    } else {
      // Fallback (no security module)
      document.getElementById('pin-error').textContent = '❌ Lỗi bảo mật';
      document.getElementById('pin-error').classList.remove('hidden');
    }
  }

  function handleLogout() {
    if (window._security) window._security.logout();
    localStorage.removeItem('dg_admin');
    isAdmin = false;
    selectedChar = null;
    document.getElementById('admin-toggle-btn').classList.add('hidden');
    document.getElementById('admin-sidebar').classList.add('hidden');
    document.getElementById('admin-login-btn').style.display = '';
    showToast('🚪 Đã đăng xuất');
  }

  function activateAdmin() {
    document.getElementById('admin-login-btn').style.display = 'none';
    document.getElementById('admin-toggle-btn').classList.remove('hidden');
    showToast('✅ Xin chào Admin!');
    refreshDeviceInfo();
  }

  // ═══ Character List ═══
  function refreshCharList() {
    if (typeof window._officeChars === 'undefined') return;
    const chars = window._officeChars;
    const search = (document.getElementById('char-search').value || '').toLowerCase();
    const filtered = search ? chars.filter(c => c.name.toLowerCase().includes(search) || c.role.toLowerCase().includes(search)) : chars;

    document.getElementById('char-count-badge').textContent = chars.length;
    const list = document.getElementById('char-list');
    list.innerHTML = filtered.map(c => {
      const icon = STATE_ICONS[c.state] || '❓';
      const sel = selectedChar && selectedChar.id === c.id;
      return `<div class="char-item ${sel ? 'selected' : ''}" data-id="${c.id}">
        <span class="char-icon">${icon}</span>
        <div class="char-info">
          <div class="char-name">${c.name}</div>
          <div class="char-role">${c.role}${c.team ? ' • ' + c.team : ''}</div>
        </div>
        <span class="char-state-tag">${STATE_NAMES[c.state] || c.state}</span>
      </div>`;
    }).join('');

    list.querySelectorAll('.char-item').forEach(el => {
      el.onclick = function() {
        selectedChar = chars.find(c => c.id === this.dataset.id);
        document.getElementById('char-controls').style.display = '';
        document.getElementById('ctrl-name').textContent = selectedChar.name;
        // Highlight active state btn
        document.querySelectorAll('.state-btn').forEach(b => b.classList.toggle('active', b.dataset.state === selectedChar.state));
        refreshCharList();
      };
    });
  }

  // ═══ Controls ═══
  function handleReset() {
    if (!selectedChar) return;
    selectedChar.tx = selectedChar.deskX;
    selectedChar.ty = selectedChar.deskY;
    selectedChar.state = 'walk';
    selectedChar.stateTimer = 0;
    showToast(`${selectedChar.name} → quay về bàn`);
  }

  function allCharsAction(state) {
    if (!window._officeChars) return;
    window._officeChars.forEach(c => { c.state = state; c.stateTimer = 0; });
    showToast(`Tất cả → ${STATE_NAMES[state]}`);
    refreshCharList();
  }

  function randomWalkAll() {
    if (!window._officeChars) return;
    const dims = { w: window.innerWidth, h: window.innerHeight * 0.7 };
    window._officeChars.forEach(c => {
      c.tx = 50 + Math.random() * (dims.w - 100);
      c.ty = 80 + Math.random() * (dims.h - 100);
      c.state = 'walk';
      c.stateTimer = 0;
    });
    showToast('🎲 Random walk!');
    refreshCharList();
  }

  // ═══ Office Stats ═══
  function refreshStats() {
    if (!window._officeChars) return;
    const chars = window._officeChars;
    const working = chars.filter(c => ['sit','typing','drinking','pointing'].includes(c.state)).length;
    const walking = chars.filter(c => c.state === 'walk' || c.state === 'talking').length;
    const idle = chars.filter(c => c.state === 'idle' || c.state === 'sleeping').length;
    const el = document.getElementById('office-stats');
    el.innerHTML = `
      <div class="stat-card"><div class="stat-num">${chars.length}</div><div class="stat-lbl">Tổng NV</div></div>
      <div class="stat-card working"><div class="stat-num">${working}</div><div class="stat-lbl">Đang làm</div></div>
      <div class="stat-card moving"><div class="stat-num">${walking}</div><div class="stat-lbl">Di chuyển</div></div>
      <div class="stat-card resting"><div class="stat-num">${idle}</div><div class="stat-lbl">Nghỉ ngơi</div></div>
    `;
  }

  // ═══ Announcement ═══
  function handleAnnounce() {
    const input = document.getElementById('announce-input');
    const msg = input.value.trim();
    if (!msg) return;
    showAnnouncement(msg);
    input.value = '';
    showToast('📢 Đã gửi thông báo');
  }

  function showAnnouncement(msg) {
    let banner = document.getElementById('announce-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'announce-banner';
      document.getElementById('app').appendChild(banner);
    }
    banner.textContent = '📢 ' + msg;
    banner.className = 'show';
    setTimeout(() => { banner.className = 'hidden'; }, 8000);
  }

  // ═══ Device Info ═══
  function refreshDeviceInfo() {
    const d = window._device || {};
    const info = document.getElementById('device-info');
    if (info) info.textContent = `${d.screenType || 'unknown'} • ${d.orientation || ''}`;

    const details = document.getElementById('device-details');
    if (details) {
      details.innerHTML = `
        <div class="dd-row"><span>Loại:</span><span>${d.screenType || 'N/A'}</span></div>
        <div class="dd-row"><span>Hướng:</span><span>${d.orientation || 'N/A'}</span></div>
        <div class="dd-row"><span>Cảm ứng:</span><span>${d.isTouchDevice ? '✅ Có' : '❌ Không'}</span></div>
        <div class="dd-row"><span>HĐH:</span><span>${d.isIOS ? '🍎 iOS' : d.isAndroid ? '🤖 Android' : '🖥️ Desktop'}</span></div>
        <div class="dd-row"><span>Hiệu năng:</span><span>${{low:'🔴 Thấp',medium:'🟡 TB',high:'🟢 Cao'}[d.performanceLevel] || 'N/A'}</span></div>
        <div class="dd-row"><span>DPR:</span><span>${d.dpr}x</span></div>
        <div class="dd-row"><span>Màn hình:</span><span>${window.innerWidth}×${window.innerHeight}</span></div>
        <div class="dd-row"><span>CPU cores:</span><span>${navigator.hardwareConcurrency || '?'}</span></div>
      `;
    }
  }

  // ═══ Refresh all ═══
  function refreshAll() {
    refreshCharList();
    refreshStats();
    refreshDeviceInfo();
  }

  // ═══ Toast ═══
  function showToast(msg) {
    let toast = document.getElementById('admin-toast');
    if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; document.body.appendChild(toast); }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Auto-refresh
  setInterval(function() {
    if (isAdmin && !document.getElementById('admin-sidebar').classList.contains('hidden')) {
      refreshCharList();
      if (adminTab === 'office') refreshStats();
    }
  }, 2000);

  // Init
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildAdminUI);
  else buildAdminUI();
})();
