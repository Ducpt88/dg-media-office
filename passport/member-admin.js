/* ============================================================
   PASSPORT — DANH SACH THANH VIEN + CHINH QUYEN
   Founder yeu cau 2026-07-22: vao /passport/ la THAY DANH SACH LUON,
   khong phai dang nhap Supabase lan nua, va chinh duoc ai len Premium.

   Vi sao truoc day cu bat dang nhap lai:
     ban cu chi luu `access_token` (song 1 tieng), KHONG luu `refresh_token`.
     Het gio la token chet -> hien lai o dang nhap.
   Nay dung CHUNG phien voi ca website (DUCPTAuth, co refresh_token),
   nen dang nhap MOT lan la thoi.

   Vi sao khong bo han dang nhap duoc:
     /passport/ la duong dan cong khai. Danh sach nay chua email + SDT khach that.
     RLS cua Supabase bat buoc phai co phien admin moi doc duoc.
     Bo han xac thuc = ai vao link cung tai duoc toan bo data khach hang.
     Nen giai phap dung la: DANG NHAP MOT LAN, nho mai — khong phai hoi lai moi lan.
   ============================================================ */
(function () {
  "use strict";
  var Auth = window.DUCPTAuth;
  var cfg = (window.DUCPT_SUPABASE || {});
  var URL_SB = String(cfg.url || "").replace(/\/+$/, "");
  var KEY = String(cfg.anonKey || "");
  var PHIEN_CU = "ducpt-supabase-passport-session";   // ban cu, chi co access_token

  var $ = function (id) { return document.getElementById(id); };
  var thieuCotKhoa = false;
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c];
    });
  }
  /* Khoa hoc / clip ma thanh vien da dang ky. Chua co cot moi thi suy tu nguon. */
  function khoaDangKy(p) {
    if (p.signup_product) return p.signup_product;
    var s = String(p.source || "");
    if (/khoa-hoc|course/i.test(s)) return "Doanh nghiệp một người";
    if (/trang-chu|^\/$/.test(s)) return "Đăng ký từ trang chủ";
    if (/register-page|dang-ky/i.test(s)) return "Đăng ký từ trang Đăng ký";
    if (/passport-admin/i.test(s)) return "Tài khoản quản trị";
    return s || "—";
  }
  function ngay(s) {
    try { var d = new Date(s); if (isNaN(d)) return esc(s || "");
      return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) { return esc(s || ""); }
  }

  /* ---------- Lay token: uu tien phien dung chung, chap nhan ca phien cu ---------- */
  function layToken() {
    if (Auth && typeof Auth.token === "function") {
      return Auth.token().then(function (t) {
        if (t) return t;
        return tokenCu();
      });
    }
    return Promise.resolve(tokenCu());
  }
  function tokenCu() {
    try {
      var o = JSON.parse(localStorage.getItem(PHIEN_CU) || "null");
      return (o && o.access_token) || "";
    } catch (e) { return ""; }
  }

  /* ---------- Hien/an ---------- */
  function hienBang() { var g = $("supabaseGate"), p = $("supabasePanel"); if (g) g.style.display = "none"; if (p) p.style.display = ""; }
  function hienDangNhap(loi) {
    var g = $("supabaseGate"), p = $("supabasePanel");
    if (g) g.style.display = ""; if (p) p.style.display = "none";
    var st = $("supabaseStatus");
    if (st && loi) { st.textContent = loi; st.style.color = "#b42318"; }
  }

  /* ---------- Nap danh sach ---------- */
  var DS = [];
  var COT_DAY_DU = "id,email,full_name,contact,note,plan,role,created_at,source,signup_product,signup_product_key";
  var COT_TOI_THIEU = "id,email,full_name,contact,note,plan,role,created_at,source";
  var cot = COT_DAY_DU;

  function napDanhSach() {
    return layToken().then(function (token) {
      if (!token) { hienDangNhap(""); return; }
      var goiBang = function (ds) {
        return fetch(URL_SB + "/rest/v1/profiles?order=created_at.desc&select=" + ds, {
          headers: { apikey: KEY, Authorization: "Bearer " + token }
        });
      };
      /* Neu Founder chua chay add-signup-product.sql thi 2 cot moi chua ton tai,
         PostgREST tra 400. Khi do tu lui ve bo cot cu de bang VAN chay,
         chi mat rieng cot "Khoa dang ky". */
      return goiBang(cot).then(function (res) {
        if (res.status === 400 && cot === COT_DAY_DU) {
          cot = COT_TOI_THIEU;
          thieuCotKhoa = true;
          return goiBang(cot);
        }
        return res;
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && (data.message || data.hint)) || ("HTTP " + res.status));
          DS = Array.isArray(data) ? data : [];
          window.SUPABASE_PROFILES = DS;
          hienBang(); capNhatSo(); veBang();
          kiemTraQuyenAdmin(token);
        });
      });
    }).catch(function (err) {
      var m = String(err && err.message || "");
      if (/JWT|expired|invalid/i.test(m)) hienDangNhap("Phiên đã hết hạn, đăng nhập lại một lần nữa.");
      else hienDangNhap("Không tải được danh sách: " + m);
    });
  }

  /* Neu tai khoan dang dung CHUA phai admin thi RLS chi tra ve dung 1 dong cua chinh ho.
     Rat de nham la "chua ai dang ky". Bao thang ra man hinh kem cau lenh can chay. */
  function kiemTraQuyenAdmin(token) {
    fetch(URL_SB + "/rest/v1/rpc/my_access", {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: "{}"
    }).then(function (r) { return r.json(); }).then(function (rows) {
      var me = Array.isArray(rows) ? rows[0] : rows;
      var canhBao = $("adminWarn");
      if (me && me.role === "admin") { if (canhBao) canhBao.remove(); return; }
      if (canhBao) return;
      var panel = $("supabasePanel"); if (!panel) return;
      var emailToi = (me && me.email) || "email-cua-anh@example.com";
      var sql = "update public.profiles set role='admin', plan='premium'\nwhere email = '" + emailToi + "';";
      var ref = (URL_SB.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/i) || [])[1] || "";
      var sqlUrl = ref ? ("https://supabase.com/dashboard/project/" + ref + "/sql/new") : "https://supabase.com/dashboard";
      var box = document.createElement("article");
      box.id = "adminWarn"; box.className = "card";
      box.style.cssText = "margin-bottom:14px;border:2px solid #f59e0b;background:#fffbeb;padding:18px";
      box.innerHTML =
        '<b style="color:#92400e;display:block;margin-bottom:6px;font-size:15px">⚠ Còn 1 bước cuối để thấy TẤT CẢ học viên</b>'
        + '<p style="color:#92400e;font-size:12.5px;line-height:1.65;margin:0 0 12px">'
        + 'Data đăng ký <b>đã về đủ trong Supabase</b>, nhưng vì bảo mật, chỉ tài khoản Admin mới xem được danh sách người khác. '
        + 'Tài khoản <b>' + esc(emailToi) + '</b> của anh chưa phải Admin nên đang chỉ thấy 1 dòng. Làm 3 bước, 30 giây:</p>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">'
        +   '<a class="btn primary" id="btnMoSql" href="' + sqlUrl + '" target="_blank" rel="noopener" style="text-decoration:none">1 · Mở Supabase SQL Editor →</a>'
        +   '<button class="btn ghost" type="button" id="btnCopySql">2 · Copy câu lệnh</button>'
        + '</div>'
        + '<code id="sqlText" style="display:block;padding:11px;border-radius:8px;background:#1f2937;color:#e5e7eb;'
        + 'font-size:11.5px;line-height:1.6;overflow-x:auto;white-space:pre">' + esc(sql) + '</code>'
        + '<p style="color:#92400e;font-size:12px;margin:11px 0 0">3 · Dán vào ô SQL, bấm <b>Run</b>, quay lại đây bấm <b>↻ Tải lại</b> là thấy đủ danh sách và đổi được Premium.</p>';
      panel.insertBefore(box, panel.firstChild);
      var btnCopy = $("btnCopySql");
      if (btnCopy) btnCopy.addEventListener("click", function () {
        var xong = function () { btnCopy.textContent = "✓ Đã copy — dán vào SQL Editor"; setTimeout(function () { btnCopy.textContent = "2 · Copy câu lệnh"; }, 2500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(sql).then(xong, xong);
        else { var t = document.getElementById("sqlText"); var rg = document.createRange(); rg.selectNode(t); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(rg); try { document.execCommand("copy"); } catch (e) {} xong(); }
      });
    }).catch(function () {});
  }

  /* Chua chay add-signup-product.sql thi cot "Khoa dang ky" chi la suy doan tu nguon.
     Bao ro de Founder biet, khong de tuong da chinh xac. */
  function nhacChayScript() {
    if ($("nhacSql")) return;
    var panel = $("supabasePanel"); if (!panel) return;
    var box = document.createElement("article");
    box.id = "nhacSql"; box.className = "card";
    box.style.cssText = "margin-bottom:14px;border:1px solid #60a5fa;background:#eff6ff;padding:14px";
    box.innerHTML = '<b style="color:#1d4ed8;display:block;margin-bottom:6px">ℹ Cột “Khóa đăng ký” đang là suy đoán</b>'
      + '<p style="color:#1d4ed8;font-size:12px;line-height:1.6;margin:0">'
      + 'Database chưa có ô lưu khóa học nên cột này đang đoán theo trang mà họ đăng ký. '
      + 'Chạy file <b>supabase/add-signup-product.sql</b> trong <b>Supabase → SQL Editor</b> một lần '
      + 'là từ đó ghi đúng tên khóa học/clip thật.</p>';
    panel.insertBefore(box, panel.firstChild);
  }

  function capNhatSo() {
    var s = function (id, v) { var e = $(id); if (e) e.textContent = v; };
    s("supabaseCount", DS.length);
    s("supabafreeCount", DS.filter(function (p) { return p.plan === "free" && p.role !== "admin"; }).length);
    s("supabasePremiumCount", DS.filter(function (p) { return p.plan === "premium"; }).length);
    s("supabaseAdminCount", DS.filter(function (p) { return p.role === "admin"; }).length);
  }

  function veBang() {
    var rows = $("supabaseRows"); if (!rows) return;
    var oTim = $("supabaseSearch");
    var q = ((oTim && oTim.value) || "").trim().toLowerCase();
    var loc = DS.filter(function (p) {
      if (!q) return true;
      return [p.email, p.full_name, p.contact, p.note].map(function (v) { return String(v == null ? "" : v).toLowerCase(); }).join(" ").indexOf(q) >= 0;
    });
    if (!loc.length) {
      rows.innerHTML = '<div class="row"><span style="grid-column:1/-1;text-align:center;color:var(--muted)">'
        + (DS.length ? "Không có ai khớp từ khóa" : "Chưa có ai đăng ký") + '</span></div>';
      return;
    }
    if (thieuCotKhoa) nhacChayScript();
    rows.innerHTML = loc.map(function (p) {
      var laAdmin = p.role === "admin";
      var giaTri = laAdmin ? "admin" : (p.plan === "premium" ? "premium" : "free");
      return '<div class="row">'
        + '<span>' + esc(p.email || "") + '</span>'
        + '<span>' + esc(p.full_name || "") + '</span>'
        + '<span>' + esc(p.contact || "") + '</span>'
        + '<span><span class="khoa-tag">' + esc(khoaDangKy(p)) + '</span></span>'
        + '<span style="font-size:10px">' + esc(p.note || "") + '</span>'
        + '<span><select class="plan-select" data-uid="' + esc(p.id) + '" data-cu="' + giaTri + '">'
        +   '<option value="free"' + (giaTri === "free" ? " selected" : "") + '>FREE</option>'
        +   '<option value="premium"' + (giaTri === "premium" ? " selected" : "") + '>PREMIUM</option>'
        +   '<option value="admin"' + (giaTri === "admin" ? " selected" : "") + '>ADMIN</option>'
        +   '</select></span>'
        + '<span>' + ngay(p.created_at) + '</span>'
        + '</div>';
    }).join("");
  }

  /* ---------- Doi goi (Free / Premium / Admin) ---------- */
  function doiGoi(uid, chon, selectEl) {
    var than = chon === "admin" ? { role: "admin", plan: "premium" }
             : chon === "premium" ? { role: "member", plan: "premium" }
             : { role: "member", plan: "free" };
    var st = $("supabaseStatus");
    var bao = function (t, xau) {
      if (!st) return;
      st.textContent = t; st.style.color = xau ? "#b42318" : "#047857";
      st.style.display = "";
    };
    selectEl.disabled = true;
    bao("Đang cập nhật quyền...");
    return layToken().then(function (token) {
      if (!token) throw new Error("Chưa đăng nhập");
      return fetch(URL_SB + "/rest/v1/profiles?id=eq." + encodeURIComponent(uid), {
        method: "PATCH",
        headers: {
          apikey: KEY, Authorization: "Bearer " + token,
          "Content-Type": "application/json", Prefer: "return=representation"
        },
        body: JSON.stringify(than)
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && (data.message || data.hint)) || ("HTTP " + res.status));
          /* Doc lai tu PHIA KHO: khong tin ket qua tra ve suong, phai thay dung gia tri moi.
             RLS/trigger co the am tham chan ma van tra 200. */
          var moi = Array.isArray(data) ? data[0] : data;
          if (!moi || moi.plan !== than.plan || moi.role !== than.role) {
            throw new Error("Máy chủ không nhận thay đổi (kiểm tra tài khoản của anh đã là admin chưa)");
          }
          DS = DS.map(function (x) { return x.id === uid ? Object.assign({}, x, than) : x; });
          window.SUPABASE_PROFILES = DS;
          capNhatSo();
          selectEl.dataset.cu = chon;
          bao("Đã đổi quyền thành " + chon.toUpperCase() + ".");
        });
      });
    }).catch(function (err) {
      selectEl.value = selectEl.dataset.cu || "free";   // tra ve gia tri cu khi that bai
      bao("Chưa đổi được quyền: " + (err && err.message || ""), true);
    }).then(function () { selectEl.disabled = false; });
  }

  /* ---------- Noi su kien ---------- */
  function noiSuKien() {
    var rows = $("supabaseRows");
    if (rows) rows.addEventListener("change", function (e) {
      var sel = e.target.closest(".plan-select"); if (!sel) return;
      doiGoi(sel.dataset.uid, sel.value, sel);
    });
    var oTim = $("supabaseSearch"); if (oTim) oTim.addEventListener("input", veBang);
    var nutTai = $("supabaseRefresh"); if (nutTai) nutTai.addEventListener("click", function () { napDanhSach(); });
    var nutOut = $("supabaseLogout");
    if (nutOut) nutOut.addEventListener("click", function () {
      try { localStorage.removeItem(PHIEN_CU); } catch (e) {}
      var xong = function () { DS = []; hienDangNhap("Đã đăng xuất."); };
      if (Auth && Auth.dangXuat) Auth.dangXuat().then(xong); else xong();
    });
    var nutIn = $("supabaseLoginBtn");
    if (nutIn) nutIn.addEventListener("click", function () {
      var em = ($("supabaseEmail") || {}).value, pw = ($("supabasePassword") || {}).value;
      var st = $("supabaseStatus");
      if (!em || !pw) { if (st) { st.textContent = "Nhập email và mật khẩu."; st.style.color = "#b42318"; } return; }
      if (st) { st.textContent = "Đang đăng nhập..."; st.style.color = ""; }
      /* Dang nhap qua DUCPTAuth => phien dung CHUNG voi ca website, co refresh_token,
         nen lan sau vao thang khong phai dang nhap lai. */
      Auth.dangNhap({ email: em, password: pw }).then(function () {
        var o = $("supabasePassword"); if (o) o.value = "";
        return napDanhSach();
      }).catch(function (er) {
        var m = String(er && er.message || "");
        if (st) {
          st.style.color = "#b42318";
          if (/Invalid login|credential/i.test(m)) {
            /* Supabase tra cung mot loi cho "sai mat khau" va "chua co tai khoan".
               Mat khau quan tri cu cua trang Passport KHONG phai tai khoan Supabase. */
            st.innerHTML = 'Email này chưa có tài khoản Supabase, hoặc sai mật khẩu.<br>'
              + 'Mật khẩu cũ của trang Passport <b>không dùng được ở đây</b> — Supabase là hệ tài khoản riêng.<br>'
              + 'Bấm <b>“Tạo tài khoản quản trị”</b> bên dưới để tạo một lần.';
          } else st.textContent = m || "Đăng nhập thất bại";
        }
        hienNutTao();
      });
    });
    hienNutTao();
  }

  /* ---------- Tao tai khoan quan tri ngay tai cho ---------- */
  function hienNutTao() {
    if ($("btnTaoAdmin")) return;
    var gate = $("supabaseGate"); if (!gate) return;
    var card = gate.querySelector(".card") || gate;
    var box = document.createElement("div");
    box.id = "btnTaoAdmin";
    box.style.cssText = "margin-top:14px;padding-top:14px;border-top:1px solid var(--line)";
    box.innerHTML = '<button class="btn ghost" type="button" id="taoAdminBtn" style="width:100%">'
      + '+ Tạo tài khoản quản trị (dùng email &amp; mật khẩu điền ở trên)</button>'
      + '<div id="taoAdminKq" style="margin-top:10px;font-size:12px;line-height:1.6"></div>';
    card.appendChild(box);
    $("taoAdminBtn").addEventListener("click", taoAdmin);
  }

  function taoAdmin() {
    var em = String(($("supabaseEmail") || {}).value || "").trim().toLowerCase();
    var pw = String(($("supabasePassword") || {}).value || "");
    var kq = $("taoAdminKq");
    if (!em || pw.length < 6) {
      kq.style.color = "#b42318";
      kq.textContent = "Điền email và mật khẩu (ít nhất 6 ký tự) ở ô trên rồi bấm lại.";
      return;
    }
    kq.style.color = "var(--muted)"; kq.textContent = "Đang tạo tài khoản...";
    Auth.dangKy({ email: em, password: pw, hoTen: "Quản trị DUCPT", nguon: "passport-admin" })
      .then(function () { return napDanhSach(); })
      .then(function () {
        kq.style.color = "#047857";
        kq.innerHTML = '✅ Đã tạo và đăng nhập xong.<br>'
          + 'Còn <b>một bước cuối</b>: mở <b>Supabase → SQL Editor</b>, dán câu này rồi Run, xong bấm <b>↻ Tải lại</b>:'
          + '<code style="display:block;margin-top:8px;padding:10px;border-radius:8px;background:#1f2937;color:#e5e7eb;'
          + 'font-size:11.5px;white-space:pre;overflow-x:auto">'
          + "update public.profiles set role='admin', plan='premium'\nwhere email = '" + esc(em) + "';"
          + '</code>';
      })
      .catch(function (er) {
        var m = String(er && er.message || "");
        kq.style.color = "#b42318";
        if (/already registered|already been registered/i.test(m)) {
          kq.textContent = "Email này ĐÃ có tài khoản Supabase rồi — vậy là sai mật khẩu. "
            + "Đổi mật khẩu tại Supabase → Authentication → Users.";
        } else kq.textContent = "Chưa tạo được: " + m;
      });
  }

  function khoiDong() {
    if (!URL_SB || !KEY) { hienDangNhap("Chưa cấu hình Supabase."); return; }
    noiSuKien();
    napDanhSach();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiDong);
  else khoiDong();
})();
