// ═══════════════════════════════════════════════════════════
// DG MEDIA HOLDING — Admin Panel
// PIN-protected controls for character management
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  const ADMIN_PIN = '2024';  // PIN đăng nhập — đổi tùy ý
  let isAdmin = localStorage.getItem('dg_admin') === 'true';
  let selectedChar = null;

  // ═══ Build Admin UI ═══
  function buildAdminUI() {
    // Login button (bottom-right corner)
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
        <input type="password" id="pin-input" placeholder="Nhập PIN..." maxlength="10" autocomplete="off">
        <div class="dialog-actions">
          <button class="btn-cancel" onclick="document.getElementById('login-dialog').classList.add('hidden')">Hủy</button>
          <button class="btn-ok" id="pin-submit">Đăng nhập</button>
        </div>
        <div id="pin-error" class="dialog-error hidden">Sai PIN!</div>
      </div>
    `;
    document.body.appendChild(dialog);

    // Admin sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'admin-sidebar';
    sidebar.className = 'hidden';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-title">⚙️ ADMIN PANEL</span>
        <button class="sidebar-close" id="sidebar-close">✕</button>
      </div>
      <div class="sidebar-section">
        <div class="section-label">👥 NHÂN VIÊN</div>
        <div id="char-list" class="char-list"></div>
      </div>
      <div class="sidebar-section" id="char-controls" style="display:none">
        <div class="section-label">🎮 ĐIỀU KHIỂN: <span id="ctrl-name"></span></div>
        <div class="ctrl-group">
          <label>Trạng thái:</label>
          <select id="ctrl-state">
            <option value="sit">💺 Ngồi</option>
            <option value="typing">⌨️ Đang gõ</option>
            <option value="walk">🚶 Đi bộ</option>
            <option value="talking">💬 Nói chuyện</option>
            <option value="drinking">☕ Uống cà phê</option>
            <option value="idle">😴 Nghỉ</option>
          </select>
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
          <div class="btn-grid">
            <button class="ctrl-btn move-btn" data-dx="0" data-dy="-20">⬆️</button>
            <button class="ctrl-btn move-btn" data-dx="-20" data-dy="0">⬅️</button>
            <button class="ctrl-btn move-btn" data-dx="20" data-dy="0">➡️</button>
            <button class="ctrl-btn move-btn" data-dx="0" data-dy="20">⬇️</button>
          </div>
        </div>
        <div class="ctrl-group">
          <button class="ctrl-btn btn-reset" id="ctrl-reset">🔄 Về bàn</button>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="section-label">📢 THÔNG BÁO</div>
        <input type="text" id="announce-input" placeholder="Nhập thông báo..." maxlength="100">
        <button class="ctrl-btn btn-announce" id="announce-btn">📣 Gửi</button>
      </div>
      <div class="sidebar-footer">
        <button class="btn-logout" id="btn-logout">🚪 Đăng xuất</button>
      </div>
    `;
    document.body.appendChild(sidebar);

    // Admin toggle button (visible when logged in)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'admin-toggle-btn';
    toggleBtn.className = 'hidden';
    toggleBtn.innerHTML = '⚙️';
    toggleBtn.title = 'Mở Admin Panel';
    toggleBtn.onclick = function() { sidebar.classList.toggle('hidden'); refreshCharList(); };
    document.body.appendChild(toggleBtn);

    // Events
    document.getElementById('pin-submit').onclick = handleLogin;
    document.getElementById('pin-input').onkeydown = function(e) { if (e.key === 'Enter') handleLogin(); };
    document.getElementById('sidebar-close').onclick = function() { sidebar.classList.add('hidden'); };
    document.getElementById('btn-logout').onclick = handleLogout;
    document.getElementById('ctrl-state').onchange = handleStateChange;
    document.getElementById('ctrl-face-left').onclick = function() { if (selectedChar) { selectedChar.facingRight = false; } };
    document.getElementById('ctrl-face-right').onclick = function() { if (selectedChar) { selectedChar.facingRight = true; } };
    document.getElementById('ctrl-reset').onclick = handleReset;
    document.getElementById('announce-btn').onclick = handleAnnounce;

    document.querySelectorAll('.move-btn').forEach(btn => {
      btn.onclick = function() {
        if (!selectedChar) return;
        const dx = parseInt(this.dataset.dx);
        const dy = parseInt(this.dataset.dy);
        selectedChar.tx = selectedChar.x + dx;
        selectedChar.ty = selectedChar.y + dy;
        selectedChar.state = 'walk';
        selectedChar.stateTimer = 0;
      };
    });

    // Check if already logged in
    if (isAdmin) activateAdmin();
  }

  function showLoginDialog() {
    const d = document.getElementById('login-dialog');
    d.classList.remove('hidden');
    document.getElementById('pin-input').value = '';
    document.getElementById('pin-error').classList.add('hidden');
    setTimeout(() => document.getElementById('pin-input').focus(), 100);
  }

  function handleLogin() {
    const pin = document.getElementById('pin-input').value;
    if (pin === ADMIN_PIN) {
      localStorage.setItem('dg_admin', 'true');
      isAdmin = true;
      document.getElementById('login-dialog').classList.add('hidden');
      activateAdmin();
    } else {
      document.getElementById('pin-error').classList.remove('hidden');
      document.getElementById('pin-input').value = '';
      setTimeout(() => document.getElementById('pin-error').classList.add('hidden'), 2000);
    }
  }

  function handleLogout() {
    localStorage.removeItem('dg_admin');
    isAdmin = false;
    document.getElementById('admin-toggle-btn').classList.add('hidden');
    document.getElementById('admin-sidebar').classList.add('hidden');
    document.getElementById('admin-login-btn').style.display = '';
  }

  function activateAdmin() {
    document.getElementById('admin-login-btn').style.display = 'none';
    document.getElementById('admin-toggle-btn').classList.remove('hidden');
    showToast('✅ Đã đăng nhập Admin!');
  }

  // ═══ Character List ═══
  function refreshCharList() {
    if (typeof window._officeChars === 'undefined') return;
    const list = document.getElementById('char-list');
    const chars = window._officeChars;
    list.innerHTML = chars.map(c => {
      const stateIcon = { sit:'💺', typing:'⌨️', walk:'🚶', talking:'💬', drinking:'☕', idle:'😴', pointing:'👆', sleeping:'💤' }[c.state] || '❓';
      const isSelected = selectedChar && selectedChar.id === c.id;
      return `<div class="char-item ${isSelected ? 'selected' : ''}" data-id="${c.id}">
        <span class="char-icon">${stateIcon}</span>
        <div class="char-info">
          <div class="char-name">${c.name}</div>
          <div class="char-role">${c.role}</div>
        </div>
      </div>`;
    }).join('');

    list.querySelectorAll('.char-item').forEach(el => {
      el.onclick = function() {
        const id = this.dataset.id;
        selectedChar = chars.find(c => c.id === id);
        document.getElementById('char-controls').style.display = '';
        document.getElementById('ctrl-name').textContent = selectedChar.name;
        document.getElementById('ctrl-state').value = selectedChar.state === 'pointing' ? 'idle' : selectedChar.state;
        refreshCharList();
      };
    });
  }

  function handleStateChange() {
    if (!selectedChar) return;
    const state = document.getElementById('ctrl-state').value;
    selectedChar.state = state;
    selectedChar.stateTimer = 0;
    showToast(`${selectedChar.name} → ${state}`);
    refreshCharList();
  }

  function handleReset() {
    if (!selectedChar) return;
    selectedChar.tx = selectedChar.deskX;
    selectedChar.ty = selectedChar.deskY;
    selectedChar.state = 'walk';
    selectedChar.stateTimer = 0;
    showToast(`${selectedChar.name} → quay về bàn`);
  }

  // ═══ Announcement ═══
  function handleAnnounce() {
    const input = document.getElementById('announce-input');
    const msg = input.value.trim();
    if (!msg) return;
    showAnnouncement(msg);
    input.value = '';
  }

  function showAnnouncement(msg) {
    let banner = document.getElementById('announce-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'announce-banner';
      document.getElementById('app').appendChild(banner);
    }
    banner.textContent = '📢 ' + msg;
    banner.classList.remove('hidden');
    banner.classList.add('show');
    setTimeout(() => { banner.classList.remove('show'); banner.classList.add('hidden'); }, 8000);
  }

  // ═══ Toast ═══
  function showToast(msg) {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Auto-refresh char list every 2s when sidebar is open
  setInterval(function() {
    if (isAdmin && !document.getElementById('admin-sidebar').classList.contains('hidden')) {
      refreshCharList();
    }
  }, 2000);

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildAdminUI);
  } else {
    buildAdminUI();
  }
})();
