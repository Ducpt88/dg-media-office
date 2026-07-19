/* DUCPT — Phiên quản trị dùng chung cho toàn bộ trang public.
 *
 * Mục đích: đăng nhập một lần ở /passport/ thì đi ra ngoài website vẫn còn quyền
 * quản trị — có avatar góc phải, nhãn chế độ, nút về Passport và nút "Xem như học viên".
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
  var PREVIEW_KEY = "ducpt-admin-preview";   // đang bật "Xem như học viên" hay không

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

  function isPreviewingAsStudent() { return read(PREVIEW_KEY) === "1"; }

  /* Trang ngoài đọc vai qua ducpt-role. Có phiên quản trị thì đặt admin,
     bật "Xem như học viên" thì hạ xuống guest để nhìn đúng thứ khách thật nhìn. */
  function syncRole(session) {
    if (!session) return;
    if (isPreviewingAsStudent()) {
      if (read(ROLE_KEY) === "admin") write(ROLE_KEY, "guest");
      return;
    }
    write(ROLE_KEY, "admin");
    if (!read(MAIL_KEY) && session.email) write(MAIL_KEY, session.email);
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
      '.dgs-bar{position:fixed;top:0;left:0;right:0;z-index:99998;display:flex;align-items:center;gap:10px;padding:7px 16px;',
      'background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff;font:600 12px/1.4 -apple-system,BlinkMacSystemFont,"Be Vietnam Pro",sans-serif;',
      'box-shadow:0 2px 14px rgba(37,99,235,.34)}',
      '.dgs-bar.is-preview{background:linear-gradient(90deg,#b45309,#d97706)}',
      '.dgs-bar b{font-weight:900;letter-spacing:.06em;text-transform:uppercase;font-size:11px}',
      '.dgs-bar .dgs-where{opacity:.86;font-weight:500}',
      '.dgs-bar .dgs-sp{flex:1}',
      '.dgs-bar button,.dgs-bar a.dgs-act{border:1px solid rgba(255,255,255,.4);border-radius:8px;background:rgba(255,255,255,.14);',
      'color:#fff;padding:5px 11px;font:inherit;font-weight:700;cursor:pointer;text-decoration:none;white-space:nowrap}',
      '.dgs-bar button:hover,.dgs-bar a.dgs-act:hover{background:rgba(255,255,255,.28)}',
      '.dgs-avatar{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;flex:none;cursor:pointer;',
      'border:2px solid rgba(255,255,255,.7);background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:900;font-size:13px}',
      '.dgs-menu{position:fixed;top:46px;right:14px;z-index:99999;display:none;min-width:236px;padding:8px;border-radius:14px;',
      'background:#fff;color:#17213a;box-shadow:0 22px 60px rgba(15,23,42,.28);border:1px solid #e6eaf0}',
      '.dgs-menu.open{display:block}',
      '.dgs-menu .dgs-who{padding:10px 12px;border-bottom:1px solid #eef2f7;margin-bottom:6px}',
      '.dgs-menu .dgs-who b{display:block;font-size:13px}',
      '.dgs-menu .dgs-who span{display:block;color:#718096;font-size:11px;margin-top:2px;overflow-wrap:anywhere}',
      '.dgs-menu a,.dgs-menu button{display:block;width:100%;text-align:left;padding:9px 12px;border:0;border-radius:9px;',
      'background:transparent;color:#17213a;font:600 13px/1.3 inherit;cursor:pointer;text-decoration:none}',
      '.dgs-menu a:hover,.dgs-menu button:hover{background:#f1f5f9}',
      '.dgs-menu .danger{color:#b42318}',
      'body.dgs-on{padding-top:44px!important}',
      '@media(max-width:700px){.dgs-bar .dgs-where,.dgs-bar .dgs-full{display:none}.dgs-bar{padding:6px 10px;gap:7px}}'
    ].join("");
    var el = document.createElement("style");
    el.id = "ducpt-session-style";
    el.textContent = css;
    document.head.appendChild(el);
  }

  function render(session) {
    injectStyle();
    var preview = isPreviewingAsStudent();
    var target = editTarget();
    /* Giữ đúng chữ "Đ" như avatar trong Passport để hai nơi là một danh tính */
    var initial = (session.initial || "Đ").trim().charAt(0).toUpperCase() || "Đ";

    var bar = document.createElement("div");
    bar.className = "dgs-bar" + (preview ? " is-preview" : "");
    bar.innerHTML =
      '<b>' + (preview ? '👁 Đang xem như học viên' : '⚙ Chế độ quản trị') + '</b>' +
      '<span class="dgs-where dgs-full">' + (target ? 'Trang này sửa ở mục: ' + target.label : 'Trang public') + '</span>' +
      '<span class="dgs-sp"></span>' +
      (target ? '<a class="dgs-act dgs-full" href="/passport/#' + target.view + '">Sửa trang này</a>' : '') +
      '<button type="button" data-dgs-preview>' + (preview ? 'Quay lại quyền admin' : 'Xem như học viên') + '</button>' +
      '<div class="dgs-avatar" data-dgs-avatar title="Tài khoản quản trị">' + initial + '</div>';

    var menu = document.createElement("div");
    menu.className = "dgs-menu";
    menu.innerHTML =
      '<div class="dgs-who"><b>' + (session.name || 'Quản trị viên') + '</b><span>' + (session.email || 'Owner · DUCPT') + '</span></div>' +
      '<a href="/passport/">Về trang Passport</a>' +
      (target ? '<a href="/passport/#' + target.view + '">Sửa trang này (' + target.label + ')</a>' : '') +
      '<button type="button" data-dgs-preview>' + (preview ? 'Quay lại quyền admin' : 'Xem như học viên') + '</button>' +
      '<button type="button" class="danger" data-dgs-logout>Đăng xuất quản trị</button>';

    document.body.appendChild(bar);
    document.body.appendChild(menu);
    document.body.classList.add("dgs-on");

    bar.querySelector("[data-dgs-avatar]").addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", function () { menu.classList.remove("open"); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });

    Array.prototype.forEach.call(document.querySelectorAll("[data-dgs-preview]"), function (btn) {
      btn.addEventListener("click", function () {
        if (isPreviewingAsStudent()) { drop(PREVIEW_KEY); write(ROLE_KEY, "admin"); }
        else { write(PREVIEW_KEY, "1"); write(ROLE_KEY, "guest"); }
        location.reload();
      });
    });

    menu.querySelector("[data-dgs-logout]").addEventListener("click", function () {
      drop(SESSION_KEY); drop(PREVIEW_KEY); drop(ROLE_KEY);
      location.reload();
    });
  }

  function boot() {
    var session = readSession();
    if (!session) return;          // khách thường: không chèn gì, trang giữ nguyên như cũ
    syncRole(session);
    render(session);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
