/* DUCPT — Phiên quản trị dùng chung cho toàn bộ trang public.
 *
 * Mục đích: đăng nhập một lần ở /passport/ thì đi ra ngoài website vẫn còn quyền
 * quản trị — có avatar góc phải, nhãn chế độ, nút về Passport và menu đổi quyền Admin/Học viên.
 *
 * GIỚI HẠN PHẢI BIẾT: đây là website tĩnh, vai nằm trong localStorage của trình duyệt.
 * Lớp này là TẤM RÈM che, KHÔNG PHẢI Ổ KHÓA — người biết mở DevTools vẫn tự đặt được vai.
 * Khóa thật chỉ có khi đấu đăng nhập máy chủ (Supabase), lúc đó thay hàm readSession().
 */
(function () {
  "use strict";
  if (window.__ducptSessionReady) return;
  window.__ducptSessionReady = true;

  var SESSION_KEY = "ducpt-admin-session";   // phiên quản trị, dùng localStorage để đi được sang tab khác
  var ROLE_KEY = "ducpt-role";               // vai dùng chung với /khoa-hoc/
  var MAIL_KEY = "ducpt-email";
  var VIEW_MODE_KEY = "ducpt-admin-view-mode"; // admin | student
  var EMAIL_LEADS_KEY = "ducpt-email-leads-v1";
  var STUDENT_PROFILE_KEY = "ducpt-student-profile-v1";
  var PREVIEW_KEY = "ducpt-admin-preview";   // legacy key, giữ để migrate từ bản cũ

  /* Trang nào sửa ở mục nào trong Passport — để nút "Sửa trang này" nhảy đúng chỗ */
  var EDIT_MAP = [
    [/^\/khoa-hoc/, "courseAdmin", "Quản lý khóa học"],
    [/^\/bai-viet/, "content", "Bài viết"],
    [/^\/dich-vu/, "servicesAdmin", "Dịch vụ đào tạo"],
    [/^\/cong-cu-ai/, "toolsAdmin", "Công cụ AI"],
    [/^\/ve-chung-toi/, "aboutAdmin", "Về chúng tôi"],
    [/^\/dang-ky|^\/dang-nhap/, "customers", "Khách hàng"],
    [/^\/$|^\/index/, "overview", "Tổng quan"]
  ];

  function read(key) { try { return localStorage.getItem(key) || ""; } catch (e) { return ""; } }
  function write(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function drop(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function readSession() {
    var raw = read(SESSION_KEY);
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (!s || s.role !== "owner" || !s.expiresAt) return null;
      if (Date.now() > Number(s.expiresAt)) { drop(SESSION_KEY); return null; }
      return s;
    } catch (e) { return null; }
  }

  function normalizeViewMode(value) { return value === "student" ? "student" : "admin"; }
  function readViewMode() {
    var mode = "";
    try { mode = localStorage.getItem(VIEW_MODE_KEY) || ""; } catch (e) {}
    if (mode === "student" || mode === "admin") return mode;
    if (read(PREVIEW_KEY) === "1") {
      write(VIEW_MODE_KEY, "student");
      drop(PREVIEW_KEY);
      return "student";
    }
    return "admin";
  }
  function writeViewMode(mode) {
    var next = normalizeViewMode(mode);
    write(VIEW_MODE_KEY, next);
    drop(PREVIEW_KEY);
    return next;
  }
  function isPreviewingAsStudent() { return readViewMode() === "student"; }
  function readEmailLeads() {
    try {
      var raw = read(EMAIL_LEADS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function writeEmailLeads(list) {
    try { write(EMAIL_LEADS_KEY, JSON.stringify((list || []).slice(0, 200))); } catch (e) {}
  }
  function currentStudentRole() {
    try {
      var profile = JSON.parse(read(STUDENT_PROFILE_KEY) || "null");
      if (profile && profile.role === "premium") return "premium";
    } catch (e) {}
    if (read(ROLE_KEY) === "premium" || read("ducpt-premium-code-ok") === "1") return "premium";
    return "free";
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char];
    });
  }
  function readStudentProfile() {
    try {
      var profile = JSON.parse(read(STUDENT_PROFILE_KEY) || "null");
      return profile && typeof profile === "object" ? profile : null;
    } catch (e) { return null; }
  }
  function sessionIdentity(session) {
    var profile = readViewMode() === "student" ? readStudentProfile() : null;
    var name = profile && profile.name ? profile.name : (session.name || "Quản trị viên");
    var email = profile && profile.email ? profile.email : (readViewMode() === "student" ? (read(MAIL_KEY) || session.email || "Học viên") : (session.email || "Owner · DUCPT"));
    var initialSource = profile && (profile.name || profile.email) ? (profile.name || profile.email) : (session.initial || session.name || "Đ");
    return {
      name: name,
      email: email,
      initial: String(initialSource || "Đ").trim().charAt(0).toUpperCase() || "Đ"
    };
  }
  function recordEmailLead(input) {
    var data = typeof input === "string" ? { email: input } : (input || {});
    var email = String(data.email || data.contact || "").trim().toLowerCase();
    if (!email) return null;
    var now = new Date().toISOString();
    var list = readEmailLeads();
    var entry = null;
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].email || "").toLowerCase() === email) { entry = list[i]; break; }
    }
    var source = String(data.source || "unknown").trim() || "unknown";
    var name = String(data.name || "").trim();
    var role = String(data.role || "").trim();
    var contact = String(data.contact || "").trim();
    var note = String(data.note || "").trim();
    var course = String(data.course || "").trim();
    var funnelStage = String(data.funnelStage || "").trim();
    var purchaseStatus = String(data.purchaseStatus || "").trim();
    var nurturePlan = Array.isArray(data.nurturePlan) ? data.nurturePlan.slice(0, 12) : null;
    if (!entry) {
      entry = {
        email: email,
        name: name,
        contact: contact,
        note: note,
        course: course,
        role: role,
        source: source,
        sources: [source],
        funnelStage: funnelStage || "lead",
        purchaseStatus: purchaseStatus || "",
        nextEmailDay: Number(data.nextEmailDay || 0),
        nurturePlan: nurturePlan || [],
        firstSeenAt: now,
        lastSeenAt: now,
        count: 1
      };
      list.unshift(entry);
    } else {
      entry.count = Number(entry.count || 0) + 1;
      entry.lastSeenAt = now;
      if (name) entry.name = name;
      if (role) entry.role = role;
      if (contact) entry.contact = contact;
      if (note) entry.note = note;
      if (course) entry.course = course;
      if (funnelStage) entry.funnelStage = funnelStage;
      if (purchaseStatus) entry.purchaseStatus = purchaseStatus;
      if (nurturePlan) entry.nurturePlan = nurturePlan;
      if (data.nextEmailDay != null) entry.nextEmailDay = Number(data.nextEmailDay || 0);
      var sources = Array.isArray(entry.sources) ? entry.sources.slice() : [];
      if (sources.indexOf(source) < 0) sources.unshift(source);
      entry.sources = sources.slice(0, 8);
      if (!entry.firstSeenAt) entry.firstSeenAt = now;
      entry.source = source;
    }
    writeEmailLeads(list);
    if (!read(MAIL_KEY)) write(MAIL_KEY, email);
    return entry;
  }
  function clearSession() { drop(SESSION_KEY); drop(PREVIEW_KEY); drop(VIEW_MODE_KEY); drop(ROLE_KEY); }

  window.DUCPTAdminSession = window.DUCPTAdminSession || {
    get: readSession,
    getViewMode: readViewMode,
    isPreview: isPreviewingAsStudent,
    setViewMode: writeViewMode,
    recordEmailLead: recordEmailLead,
    listEmailLeads: readEmailLeads,
    logout: function () { clearSession(); location.reload(); }
  };

  /* Trang ngoài đọc vai qua ducpt-role. Có phiên quản trị thì đặt admin,
     còn chế độ học viên thì dùng quyền học viên thật đã lưu: Premium vẫn là Premium. */
  function syncRole(session) {
    if (!session) return;
    var mode = readViewMode();
    var role = mode === "student" ? currentStudentRole() : "admin";
    write(ROLE_KEY, role);
    if (session.email) write(MAIL_KEY, session.email);
    recordEmailLead({
      email: session.email || "",
      name: session.name || "",
      role: role,
      funnelStage: role === "premium" ? "paid_student" : "",
      purchaseStatus: role === "premium" ? "paid" : "",
      source: "admin-session"
    });
  }

  function editTarget() {
    var path = location.pathname;
    for (var i = 0; i < EDIT_MAP.length; i++) {
      if (EDIT_MAP[i][0].test(path)) return { view: EDIT_MAP[i][1], label: EDIT_MAP[i][2] };
    }
    return null;
  }

  function injectStyle() {
    if (document.getElementById("ducpt-session-style")) return;
    var css = [
      '.dgs-avatar{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;flex:none;cursor:pointer;',
      'border:2px solid rgba(255,255,255,.7);background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:900;font-size:13px}',
      '.dgs-menu{position:fixed;top:64px;right:18px;z-index:99999;display:none;min-width:236px;padding:8px;border-radius:14px;',
      'background:#fff;color:#17213a;box-shadow:0 22px 60px rgba(15,23,42,.28);border:1px solid #e6eaf0}',
      '.dgs-menu.open{display:block}',
      '.dgs-mode-now{padding:8px 12px;margin-bottom:6px;border-radius:9px;background:#eff6ff;color:#1d4ed8;font-size:11.5px;font-weight:900}',
      '.dgs-menu .dgs-who{padding:10px 12px;border-bottom:1px solid #eef2f7;margin-bottom:6px}',
      '.dgs-menu .dgs-who b{display:block;font-size:13px}',
      '.dgs-menu .dgs-who span{display:block;color:#718096;font-size:11px;margin-top:2px;overflow-wrap:anywhere}',
      '.dgs-menu a,.dgs-menu button{display:block;width:100%;text-align:left;padding:9px 12px;border:0;border-radius:9px;',
      'background:transparent;color:#17213a;font:600 13px/1.3 inherit;cursor:pointer;text-decoration:none}',
      '.dgs-menu a:hover,.dgs-menu button:hover{background:#f1f5f9}',
      '.dgs-menu button.on{background:#eff6ff;color:#1d4ed8}',
      '.dgs-menu .danger{color:#b42318}',
      '.dgs-float{position:fixed;top:14px;right:14px;z-index:99998;display:grid;place-items:center;width:42px;height:42px;',
      'border-radius:50%;border:2px solid #fff;cursor:pointer;background:linear-gradient(135deg,#1d4ed8,#7c3aed);',
      'color:#fff;font-weight:900;font-size:16px;box-shadow:0 10px 26px rgba(37,99,235,.4)}',
      '.dgs-chip.is-student{border-color:#fcd34d;background:#fffbeb}',
      '.dgs-chip.is-student .dgs-chip-av{background:linear-gradient(135deg,#b45309,#d97706)}',
      '.dgs-chip.is-student .dgs-chip-txt i{color:#b45309;font-weight:800}',
      /* Chip tài khoản thay cho nút Đăng nhập trong header */
      '.dgs-chip{display:inline-flex;align-items:center;gap:9px;padding:6px 14px 6px 6px;border:1px solid #e6eaf0;border-radius:999px;',
      'background:#fff;color:#17213a;cursor:pointer;font:inherit;box-shadow:0 4px 14px rgba(16,24,40,.07)}',
      '.dgs-chip:hover{border-color:#c7d2fe;box-shadow:0 6px 18px rgba(37,99,235,.14)}',
      '.dgs-chip-av{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;flex:none;',
      'background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:900;font-size:13px}',
      '.dgs-chip-txt{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15}',
      '.dgs-chip-txt b{font-size:13px;font-weight:800;white-space:nowrap}',
      '.dgs-chip-txt i{font-style:normal;font-size:10.5px;color:#718096;white-space:nowrap}',
      '@media(max-width:820px){.dgs-chip{padding:5px}.dgs-chip-txt{display:none}}',
      '.dgs-linked-panel{max-width:860px;margin:40px auto;padding:28px;border:1px solid #e6eaf0;border-radius:24px;',
      'background:#fff;color:#17213a;box-shadow:0 22px 70px rgba(15,23,42,.16)}',
      '.dgs-linked-panel small{display:inline-flex;margin-bottom:8px;color:#2563eb;font-weight:900;text-transform:uppercase;letter-spacing:.08em}',
      '.dgs-linked-panel h1{margin:0 0 8px;font-size:clamp(30px,4vw,46px);line-height:1.05;color:#17213a}',
      '.dgs-linked-panel p{margin:0 0 14px;color:#64748b}',
      '.dgs-linked-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}',
      '.dgs-linked-actions a,.dgs-linked-actions button{border:0;border-radius:999px;padding:11px 16px;font:700 14px/1.2 inherit;',
      'text-decoration:none;cursor:pointer;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff}',
      '.dgs-linked-actions .secondary{background:#eef2ff;color:#1e3a8a}',
      '@media(max-width:820px){.dgs-float{width:38px;height:38px;font-size:14px}}'
    ].join("");
    var el = document.createElement("style");
    el.id = "ducpt-session-style";
    el.textContent = css;
    document.head.appendChild(el);
  }

  function render(session) {
    injectStyle();
    var mode = readViewMode();
    var studentRole = currentStudentRole();
    var target = editTarget();
    var identity = sessionIdentity(session);
    /* Giữ đúng chữ "Đ" như avatar trong Passport để hai nơi là một danh tính */
    var initial = identity.initial;
    var modeLabel = mode === "student" ? "👤 Chế độ học viên " + (studentRole === "premium" ? "Premium" : "Free") : "⚙ Chế độ quản trị";

    /* Thanh quản trị đã bỏ theo yêu cầu Founder — mọi thứ dồn vào menu này,
       mở bằng chip tài khoản trên nav (hoặc avatar nổi nếu trang không có nav). */
    var menu = document.createElement("div");
    menu.className = "dgs-menu";
    menu.innerHTML =
      '<div class="dgs-who"><b>' + esc(identity.name) + '</b><span>' + esc(identity.email) + '</span></div>' +
      '<div class="dgs-mode-now">' + modeLabel + '</div>' +
      '<button type="button" data-dgs-mode="admin" class="' + (mode === "admin" ? "on" : "") + '">Quyền Admin</button>' +
      '<button type="button" data-dgs-mode="student" class="' + (mode === "student" ? "on" : "") + '">Quyền học viên ' + (studentRole === "premium" ? "Premium" : "Free") + '</button>' +
      '<a href="/passport/">Về trang Passport</a>' +
      (target ? '<a href="/passport/#' + target.view + '">Sửa trang này (' + target.label + ')</a>' : '') +
      '<button type="button" class="danger" data-dgs-logout>Đăng xuất quản trị</button>';

    document.body.appendChild(menu);
    render.menu = menu;

    document.addEventListener("click", function () { menu.classList.remove("open"); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });

    Array.prototype.forEach.call(document.querySelectorAll("[data-dgs-mode]"), function (btn) {
      btn.addEventListener("click", function () {
        var nextMode = btn.getAttribute("data-dgs-mode") === "student" ? "student" : "admin";
        writeViewMode(nextMode);
        write(ROLE_KEY, nextMode === "student" ? currentStudentRole() : "admin");
        location.reload();
      });
    });

    menu.querySelector("[data-dgs-logout]").addEventListener("click", function () {
      drop(SESSION_KEY); drop(PREVIEW_KEY); drop(VIEW_MODE_KEY); drop(ROLE_KEY);
      location.reload();
    });
    return menu;
  }

  /* Đăng nhập rồi mà nav vẫn mời "Đăng nhập / Đăng ký học" là mâu thuẫn ngay trước mắt.
     Thay hai nút đó trong header bằng chip tài khoản, bấm mở đúng menu của avatar.
     CTA bán hàng nằm trong NỘI DUNG trang thì giữ nguyên — admin cần thấy trang y như khách. */
  var LOGIN_TEXT = /^(đăng nhập|đăng ký học|đăng ký miễn phí|đăng ký ngay)$/i;

  function removeLegacyCourseAccountChip() {
    Array.prototype.forEach.call(document.querySelectorAll("#navAcct,.nav-acct,.na-chip"), function (el) {
      var root = el.closest && el.closest("#navAcct,.nav-acct");
      (root || el).remove();
    });
    if (!document.getElementById("dgs-hide-legacy-course-chip")) {
      var el = document.createElement("style");
      el.id = "dgs-hide-legacy-course-chip";
      el.textContent = "#navAcct,.nav-acct,.na-chip{display:none!important}";
      document.head.appendChild(el);
    }
  }

  function removePublicAuthAccountChip() {
    Array.prototype.forEach.call(document.querySelectorAll("#dabAcct,.dab-acct,.dab-chip"), function (el) {
      var root = el.closest && el.closest("#dabAcct,.dab-acct");
      (root || el).remove();
    });
  }

  function swapNavLogin(session, menu) {
    var nodes = document.querySelectorAll("header a, header button, nav a, nav button, .top a, .top button");
    var hidden = [];
    var host = document.querySelector("header .nav, .header .nav, nav.nav, header nav, nav");
    var stale = document.getElementById("dgsAccountChip");
    if (stale) stale.remove();
    var staleFloat = document.querySelector(".dgs-float");
    if (staleFloat) staleFloat.remove();
    removePublicAuthAccountChip();
    removeLegacyCourseAccountChip();
    Array.prototype.forEach.call(nodes, function (el) {
      var txt = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!LOGIN_TEXT.test(txt) && !el.hasAttribute("data-open-customer-login")) return;
      if (!host) host = el.parentNode;
      el.style.display = "none";
      hidden.push(el);
    });
    /* Thanh quan tri da bo. Chip la LOI VAO DUY NHAT cua menu, nen trang nao khong co
       nut dang nhap trong nav thi van phai co mot avatar noi goc phai de bam duoc. */
    if (!host) {
      var float = document.createElement("button");
      float.type = "button";
      float.className = "dgs-float";
      float.title = "Tai khoan quan tri";
      float.textContent = session.initial || "Đ";
      float.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
      document.body.appendChild(float);
      return 0;
    }

    var chip = document.createElement("button");
    chip.type = "button";
    chip.id = "dgsAccountChip";
    chip.className = "dgs-chip";
    chip.style.display = "inline-flex";
    var studentMode = readViewMode() === "student";
    var studentRole = currentStudentRole();
    var identity = sessionIdentity(session);
    var subtitle = studentMode ? (studentRole === "premium" ? "Học viên Premium" : "Học viên Free") : "Quản trị · đã đăng nhập";
    if (studentMode) chip.className = "dgs-chip is-student";
    chip.innerHTML = '<span class="dgs-chip-av">' + esc(identity.initial) + '</span>' +
      '<span class="dgs-chip-txt"><b>' + esc(identity.name) + '</b><i>' + subtitle + '</i></span>';
    chip.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      menu.classList.toggle("open");
    });
    host.appendChild(chip);
    return hidden.length;
  }

  function refreshStudentModeLabels() {
    if (readViewMode() !== "student") return;
    var role = currentStudentRole();
    var label = role === "premium" ? "Premium" : "Free";
    var mode = document.querySelector(".dgs-mode-now");
    if (mode) mode.textContent = "👤 Chế độ học viên " + label;
    var btn = document.querySelector('[data-dgs-mode="student"]');
    if (btn) btn.textContent = "Quyền học viên " + label;
    var chipSub = document.querySelector(".dgs-chip-txt i");
    if (chipSub) chipSub.textContent = "Học viên " + label;
  }

  function replaceAuthPrompt(session) {
    if (!session) return;
    var path = location.pathname;
    if (!/^\/dang-nhap\/?$|^\/dang-ky\/?$/i.test(path)) return;
    var target = document.getElementById("loginView") || document.querySelector("main.register");
    if (!target) return;
    var email = session.email || "Owner · DUCPT";
    var isLoginPage = /^\/dang-nhap/i.test(path);
    var title = isLoginPage ? "Anh đang đăng nhập bằng tài khoản quản trị" : "Tài khoản Admin đã được liên kết";
    var desc = isLoginPage
      ? "Không cần đăng nhập hoặc đăng ký lại. Phiên Admin từ Passport đang dùng chung trên website này."
      : "Trang đăng ký chỉ dành cho khách mới. Với tài khoản Admin, anh có thể về Passport hoặc mở website ở chế độ quản trị.";
    target.classList.remove("hidden");
    target.innerHTML =
      '<article class="dgs-linked-panel">' +
        '<small>DUCPT Admin linked</small>' +
        '<h1>' + title + '</h1>' +
        '<p><b>Tài khoản:</b> ' + email + '</p>' +
        '<p>' + desc + '</p>' +
        '<div class="dgs-linked-actions">' +
          '<a href="/passport/">Về Passport</a>' +
          '<a class="secondary" href="/">Mở website</a>' +
          '<button class="secondary" type="button" data-dgs-logout-inline>Đăng xuất Admin</button>' +
        '</div>' +
      '</article>';
    var portal = document.getElementById("portalView");
    if (portal) portal.classList.remove("open");
    var logout = target.querySelector("[data-dgs-logout-inline]");
    if (logout) logout.addEventListener("click", function () { clearSession(); location.reload(); });
  }

  /* Da co tai khoan Supabase (dang nhap tren website) thi day la TAI KHOAN DUY NHAT.
     He phien cu nhuong han — khong ve chip thu hai, tranh mot nguoi hien hai chip. */
  function hasSupabaseSession() {
    try {
      var raw = localStorage.getItem("ducpt-auth-session-v1");
      if (!raw) return false;
      var s = JSON.parse(raw);
      return !!(s && s.access_token);
    } catch (e) { return false; }
  }

  function boot() {
    if (hasSupabaseSession()) return;   // nhuong cho tai khoan Supabase — chi mot chip duy nhat
    var session = readSession();
    if (!session) return;          // khách thường: không chèn gì, trang giữ nguyên như cũ
    syncRole(session);
    var menu = render(session);
    swapNavLogin(session, menu);
    replaceAuthPrompt(session);
    try { window.dispatchEvent(new CustomEvent("ducpt:admin-session-ready", { detail: { session: session, preview: isPreviewingAsStudent(), viewMode: readViewMode() } })); } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("ducpt:role-changed", refreshStudentModeLabels);
})();
