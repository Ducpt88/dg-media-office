/* ============================================================
   DUCPT — GIAO DIEN TAI KHOAN CHUNG (chen vao moi trang)
   - Ve chip tai khoan tren nav khi da dang nhap.
   - Mo modal Dang ky / Dang nhap dung chung (Supabase).
   - Bac cau sang he phan quyen cu cua trang khoa hoc qua `ducpt-role`.

   Bat cu nut nao co cac thuoc tinh sau se duoc noi tu dong:
     [data-ducpt-signup]  -> mo tab Dang ky
     [data-ducpt-login]   -> mo tab Dang nhap
     [data-ducpt-logout]  -> dang xuat
   Ngoai ra tu nhan cac loi vao san co tren trang chu:
     [data-open-customer-login], a.nav-signup, a[href="/dang-ky/"]
   ============================================================ */
(function () {
  "use strict";
  if (!window.DUCPTAuth) return;
  if (window.__ducptAuthUiReady) return;
  window.__ducptAuthUiReady = true;

  var Auth = window.DUCPTAuth;

  /* ma san pham cua trang hien tai (de bac cau quyen dung khoa hoc dang mo) */
  function maSanPhamTrang() {
    var m = document.querySelector('meta[name="ducpt-product-key"]');
    if (m && m.content) return m.content.trim();
    if (/\/khoa-hoc\//.test(location.pathname)) return "course:doanh-nghiep-mot-nguoi";
    return "";
  }

  /* ---------- CSS ---------- */
  var css = ''
    + '.dab-modal,.dab-backdrop{position:fixed;inset:0;z-index:100000}'
    + '.dab-backdrop{background:rgba(8,12,20,.6);display:none}'
    + '.dab-backdrop.open{display:block}'
    + '.dab-modal{display:none;place-items:center;padding:20px;pointer-events:none}'
    + '.dab-modal.open{display:grid}'
    + '.dab-card{pointer-events:auto;width:min(430px,94vw);max-height:92vh;overflow:auto;background:#fff;color:#14213d;'
    + 'border-radius:18px;box-shadow:0 30px 80px rgba(8,12,20,.4);padding:22px;font-family:inherit}'
    + '.dab-card h3{margin:0 0 4px;font-size:22px}'
    + '.dab-sub{margin:0 0 14px;color:#667085;font-size:13px;line-height:1.5}'
    + '.dab-tabs{display:flex;gap:8px;margin:0 0 14px}'
    + '.dab-tabs button{flex:1;padding:9px;border:1px solid #e6eaf0;border-radius:10px;background:#f8fafc;'
    + 'font:inherit;font-weight:800;font-size:13px;color:#667085;cursor:pointer}'
    + '.dab-tabs button.on{background:#2563eb;border-color:#2563eb;color:#fff}'
    + '.dab-form{display:grid;gap:10px}'
    + '.dab-form label{display:grid;gap:5px;font-size:12px;font-weight:800;color:#667085}'
    + '.dab-form input{width:100%;padding:11px 12px;border:1px solid #dbe3ef;border-radius:11px;background:#f8fafc;'
    + 'color:#14213d;font:inherit;outline:0}'
    + '.dab-form input:focus{border-color:#2563eb;background:#fff}'
    + '.dab-go{margin-top:4px;padding:12px;border:0;border-radius:999px;background:#2563eb;color:#fff;'
    + 'font:inherit;font-weight:900;font-size:15px;cursor:pointer}'
    + '.dab-go:disabled{opacity:.6;cursor:default}'
    + '.dab-st{min-height:18px;font-size:12.5px;line-height:1.5;margin-top:2px}'
    + '.dab-close{float:right;width:32px;height:32px;border:1px solid #e6eaf0;border-radius:9px;background:#fff;'
    + 'color:#667085;font-size:17px;cursor:pointer;line-height:1}'
    + '.dab-note{margin-top:12px;padding:10px;border:1px solid #dbeafe;border-radius:11px;background:#eff6ff;'
    + 'color:#1d4ed8;font-size:12px;line-height:1.5}'
    + '.dab-chip{display:inline-flex;align-items:center;gap:9px;padding:5px 12px 5px 5px;border:1px solid #e6eaf0;'
    + 'border-radius:999px;background:#fff;cursor:pointer;font:inherit;color:#14213d}'
    + '.dab-chip .av{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;flex:none;'
    + 'background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:900;font-size:13px}'
    + '.dab-chip .tx{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15}'
    + '.dab-chip .tx b{font-size:13px;font-weight:800;white-space:nowrap}'
    + '.dab-chip .tx i{font-style:normal;font-size:10.5px;color:#667085;white-space:nowrap}'
    + '.dab-acct{position:relative;display:inline-block}'
    + '.dab-menu{position:absolute;right:0;top:calc(100% + 8px);min-width:230px;background:#fff;border:1px solid #e6eaf0;'
    + 'border-radius:13px;box-shadow:0 22px 60px rgba(15,23,42,.22);padding:8px;display:none;z-index:100001}'
    + '.dab-menu.open{display:block}'
    + '.dab-menu .who{padding:9px 11px;border-bottom:1px solid #eef2f7;margin-bottom:6px}'
    + '.dab-menu .who b{display:block;font-size:13px}.dab-menu .who span{display:block;color:#667085;font-size:11px;overflow-wrap:anywhere}'
    + '.dab-menu .state{padding:7px 11px;border-radius:9px;font-size:11.5px;font-weight:900;margin-bottom:6px}'
    + '.dab-menu .state.f{background:#f1f5f9;color:#475569}.dab-menu .state.p{background:#ecfdf5;color:#047857}'
    + '.dab-menu a,.dab-menu button{display:block;width:100%;text-align:left;padding:9px 11px;border:0;border-radius:9px;'
    + 'background:transparent;font:600 13px/1.3 inherit;cursor:pointer;text-decoration:none;color:#14213d}'
    + '.dab-menu a:hover,.dab-menu button:hover{background:#f4f6fb}'
    + '.dab-menu .out{color:#b42318}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- DOM modal ---------- */
  var bd = document.createElement("div"); bd.className = "dab-backdrop";
  var modal = document.createElement("div"); modal.className = "dab-modal";
  modal.innerHTML =
    '<div class="dab-card" role="dialog" aria-modal="true">'
    + '<button class="dab-close" type="button" aria-label="Đóng">×</button>'
    + '<h3 id="dabTitle">Tài khoản DUCPT</h3>'
    + '<p class="dab-sub" id="dabSub">Một tài khoản dùng chung cho toàn bộ ducpt.com.</p>'
    + '<div class="dab-tabs"><button type="button" data-tab="signup">Đăng ký</button>'
    + '<button type="button" data-tab="login">Đăng nhập</button></div>'
    + '<form class="dab-form" id="dabForm">'
    + '<label data-f="name">Họ tên<input name="name" autocomplete="name" placeholder="Tên của bạn"></label>'
    + '<label>Email<input name="email" type="email" required autocomplete="email" placeholder="email@example.com"></label>'
    + '<label>Mật khẩu<input name="password" type="password" required autocomplete="current-password" placeholder="Ít nhất 6 ký tự"></label>'
    + '<label data-f="contact">SĐT/Zalo<input name="contact" autocomplete="tel" placeholder="Số điện thoại hoặc Zalo"></label>'
    + '<label data-f="note">Mong muốn học<input name="note" placeholder="Bạn muốn đạt điều gì?"></label>'
    + '<button class="dab-go" type="submit">Đăng ký và vào học</button>'
    + '<div class="dab-st" id="dabStatus"></div>'
    + '</form>'
    + '<div class="dab-note" id="dabNote">Đăng ký Free là học được các bài miễn phí ngay. Bài Premium mở khi nâng cấp.</div>'
    + '</div>';
  function gan() {
    if (!document.body) { document.addEventListener("DOMContentLoaded", gan); return; }
    document.body.appendChild(bd); document.body.appendChild(modal);
  }
  gan();

  var tab = "signup";
  var form = modal.querySelector("#dabForm");
  var statusEl = modal.querySelector("#dabStatus");
  var titleEl = modal.querySelector("#dabTitle");
  var subEl = modal.querySelector("#dabSub");
  var noteEl = modal.querySelector("#dabNote");

  function apDungTab() {
    modal.querySelectorAll(".dab-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.tab === tab);
    });
    var laSignup = tab === "signup";
    modal.querySelectorAll('[data-f]').forEach(function (el) { el.style.display = laSignup ? "" : "none"; });
    form.password.setAttribute("autocomplete", laSignup ? "new-password" : "current-password");
    form.querySelector(".dab-go").textContent = laSignup ? "Đăng ký và vào học" : "Đăng nhập";
    titleEl.textContent = laSignup ? "Đăng ký tài khoản DUCPT" : "Đăng nhập DUCPT";
    subEl.textContent = laSignup
      ? "Một tài khoản dùng chung cho toàn bộ ducpt.com — khóa học, công cụ, mọi trang."
      : "Đăng nhập bằng tài khoản đã đăng ký ở bất kỳ trang nào.";
    noteEl.style.display = laSignup ? "" : "none";
    statusEl.textContent = "";
  }
  function moModal(loaiTab) {
    if (!Auth.sanSang()) {
      // Chua cau hinh Supabase: bao ro thay vi im lang
      alert("Hệ thống tài khoản chưa được kết nối máy chủ (Supabase). Vui lòng liên hệ quản trị.");
      return;
    }
    tab = loaiTab || "signup"; apDungTab();
    bd.classList.add("open"); modal.classList.add("open");
    setTimeout(function () { try { form.email.focus(); } catch (e) {} }, 60);
  }
  function dongModal() { bd.classList.remove("open"); modal.classList.remove("open"); }

  modal.querySelector(".dab-close").addEventListener("click", dongModal);
  bd.addEventListener("click", dongModal);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") dongModal(); });
  modal.querySelectorAll(".dab-tabs button").forEach(function (b) {
    b.addEventListener("click", function () { tab = b.dataset.tab; apDungTab(); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var go = form.querySelector(".dab-go");
    var d = Object.fromEntries(new FormData(form).entries());
    statusEl.style.color = "#475569";
    statusEl.textContent = tab === "signup" ? "Đang tạo tài khoản..." : "Đang đăng nhập...";
    go.disabled = true;
    var xong = function () { go.disabled = false; };
    var loi = function (er) {
      statusEl.style.color = "#b42318";
      statusEl.textContent = dichLoi(er && er.message);
      xong();
    };
    if (tab === "signup") {
      Auth.dangKy({ email: d.email, password: d.password, hoTen: d.name, lienHe: d.contact, ghiChu: d.note, nguon: nguonTrang() })
        .then(function (r) {
          if (r.canXacNhanEmail) {
            statusEl.style.color = "#047857";
            statusEl.textContent = "Đã tạo tài khoản. Kiểm tra email để xác nhận rồi đăng nhập.";
            xong(); return;
          }
          statusEl.style.color = "#047857";
          statusEl.textContent = "Đã đăng ký xong. Đang mở quyền học...";
          sauDangNhap();
        }).catch(loi);
    } else {
      Auth.dangNhap({ email: d.email, password: d.password })
        .then(function () {
          statusEl.style.color = "#047857";
          statusEl.textContent = "Đăng nhập thành công.";
          sauDangNhap();
        }).catch(loi);
    }
  });

  function dichLoi(msg) {
    msg = String(msg || "");
    if (/already registered|User already/i.test(msg)) return "Email này đã có tài khoản. Chuyển sang Đăng nhập nhé.";
    if (/Invalid login|invalid_grant|credential/i.test(msg)) return "Email hoặc mật khẩu chưa đúng.";
    if (/6 ký tự|at least 6|Password should/i.test(msg)) return "Mật khẩu cần ít nhất 6 ký tự.";
    if (/CHUA_CAU_HINH/i.test(msg)) return "Máy chủ tài khoản chưa kết nối. Liên hệ quản trị.";
    if (/Email not confirmed/i.test(msg)) return "Tài khoản chưa xác nhận email. Kiểm tra hộp thư.";
    return msg || "Có lỗi xảy ra, thử lại giúp mình.";
  }
  function nguonTrang() {
    if (/\/khoa-hoc\//.test(location.pathname)) return "khoa-hoc";
    if (location.pathname === "/" || /index\.html$/.test(location.pathname)) return "trang-chu";
    return location.pathname;
  }
  function sauDangNhap() {
    Auth.quyen(true).then(function (q) {
      capNhatNav(q); bacCauQuyen(q);
      setTimeout(function () { dongModal(); }, 500);
    });
  }

  /* ---------- Bac cau sang he phan quyen cu (ducpt-role) ---------- */
  function bacCauQuyen(q) {
    try {
      var role = "guest";
      if (q && q.daDangNhap) {
        if (q.role === "admin") role = "admin";
        else if (q.plan === "premium") role = "premium";
        else {
          var ma = maSanPhamTrang();
          role = (ma && q.sanPham.indexOf(ma) >= 0) ? "premium" : "free";
        }
      }
      if (role === "guest") { localStorage.removeItem("ducpt-role"); localStorage.removeItem("ducpt-email"); }
      else { localStorage.setItem("ducpt-role", role); if (q.email) localStorage.setItem("ducpt-email", q.email); }
      // danh thuc trang khoa hoc cap nhat UI
      window.dispatchEvent(new CustomEvent("ducpt:role-changed", { detail: { role: role } }));
      window.dispatchEvent(new StorageEvent("storage", { key: "ducpt-role" }));
    } catch (e) {}
  }

  /* ---------- Chip tai khoan tren nav ---------- */
  function timNav() {
    return document.querySelector("header nav .nav-inner") || document.querySelector("header nav") || document.querySelector("header");
  }
  function capNhatNav(q) {
    var nav = timNav(); if (!nav) return;
    var loginBtns = nav.querySelectorAll('.nav-login,[data-open-customer-login],.nav-signup,a.login,a.signup,a[href="/dang-ky/"],a[href="/dang-nhap/"]');
    var cu = document.getElementById("dabAcct"); if (cu) cu.remove();
    // Chip cu cua rieng trang khoa-hoc (id navAcct / class na-chip) — de khong hien 2 chip trung.
    var chipCuKhoaHoc = document.getElementById("navAcct") || document.querySelector(".na-chip");

    if (!q || !q.daDangNhap) {
      loginBtns.forEach(function (b) { b.style.display = ""; });
      return;
    }
    loginBtns.forEach(function (b) { b.style.display = "none"; });
    if (chipCuKhoaHoc) chipCuKhoaHoc.style.display = "none";

    var laP = q.plan === "premium" || q.role === "admin";
    var ten = q.hoTen || q.email || "Học viên";
    var wrap = document.createElement("div"); wrap.className = "dab-acct"; wrap.id = "dabAcct";
    wrap.innerHTML =
      '<button class="dab-chip" type="button" id="dabChip">'
      + '<span class="av">' + esc((ten[0] || "H").toUpperCase()) + '</span>'
      + '<span class="tx"><b>' + esc(ten) + '</b><i>' + (q.role === "admin" ? "Quản trị" : (laP ? "Premium" : "Tài khoản Free")) + '</i></span>'
      + '</button>'
      + '<div class="dab-menu" id="dabMenu">'
      + '<div class="who"><b>' + esc(ten) + '</b><span>' + esc(q.email || "") + '</span></div>'
      + '<div class="state ' + (laP ? "p" : "f") + '">' + (q.role === "admin" ? "🛠 QUẢN TRỊ" : (laP ? "💎 PREMIUM · mở toàn bộ" : "TÀI KHOẢN FREE")) + '</div>'
      + '<a href="/khoa-hoc/">Vào khu học</a>'
      + (laP ? "" : '<a href="https://zalo.me/0963249467">💎 Nâng cấp Premium</a>')
      + '<button type="button" class="out" data-ducpt-logout>Đăng xuất</button>'
      + '</div>';
    nav.appendChild(wrap);
    var chip = wrap.querySelector("#dabChip"), menu = wrap.querySelector("#dabMenu");
    chip.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
    document.addEventListener("click", function () { menu.classList.remove("open"); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
  }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]; }); }

  /* ---------- Noi cac loi vao ---------- */
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-ducpt-signup]");
    var l = e.target.closest("[data-ducpt-login]");
    var o = e.target.closest("[data-ducpt-logout]");
    // loi vao san co tren trang chu / dang-ky / dang-nhap
    var homeLogin = e.target.closest("[data-open-customer-login],a.nav-login,a[href='/dang-nhap/']");
    var homeSignup = e.target.closest("a.nav-signup,a[href='/dang-ky/']");
    // Trang khoa hoc dung anchor rieng (#dang-ky-hoc / #dang-nhap-hoc-vien).
    // Chi chiem khi la KHACH: nguoi da dang nhap van cuon xem chuong trinh nhu cu.
    if (!Auth.coPhien()) {
      homeLogin = homeLogin || e.target.closest("a[href$='#dang-nhap-hoc-vien']");
      homeSignup = homeSignup || e.target.closest("a[href$='#dang-ky-hoc']");
    }
    // stopImmediatePropagation: chan cac handler cu tren cung nut (vd modal portal cu o trang chu,
    // modal hoc vien cu o trang khoa hoc) de KHONG mo 2 hop cung luc.
    if (o) { e.preventDefault(); e.stopImmediatePropagation(); Auth.dangXuat().then(function () { Auth.quyen(true).then(function (q) { capNhatNav(q); bacCauQuyen(q); }); }); return; }
    // Chua cau hinh Supabase thi KHONG chiem: de flow cu chay, khong pha trang dang chay.
    if (s || homeSignup) { if (Auth.sanSang()) { e.preventDefault(); e.stopImmediatePropagation(); moModal("signup"); } return; }
    if (l || homeLogin) { if (Auth.sanSang()) { e.preventDefault(); e.stopImmediatePropagation(); moModal("login"); } return; }
  }, true);

  /* ---------- Khoi tao + dong bo da tab ---------- */
  function veLai() { Auth.quyen(true).then(function (q) { capNhatNav(q); bacCauQuyen(q); }); }
  Auth.khiDoi(veLai);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", veLai);
  else veLai();

  window.DUCPTAuthUI = { moModal: moModal, dongModal: dongModal, veLai: veLai };
})();
