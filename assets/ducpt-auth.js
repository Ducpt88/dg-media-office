/* ============================================================
   DUCPT — TAI KHOAN CHUNG TOAN WEBSITE
   Dang ky/dang nhap MOT lan o bat ky trang nao -> dung chung ca ducpt.com.
   Chua tra phi thi bi gioi han quyen.

   Vi sao goi fetch thang thay vi nap thu vien Supabase tu CDN:
   trang chu co CSP `script-src 'self'` -> nap script CDN se bi chan.
   Supabase Auth (GoTrue) + PostgREST deu la REST thuan, fetch la du.

   Cach dung:
     DUCPTAuth.dangKy({email, password, hoTen, lienHe, ghiChu, nguon})
     DUCPTAuth.dangNhap({email, password})
     DUCPTAuth.dangXuat()
     await DUCPTAuth.quyen()        -> {daDangNhap, email, hoTen, plan, role, sanPham[]}
     await DUCPTAuth.duocXem('course:doanh-nghiep-mot-nguoi') -> true/false
     DUCPTAuth.khiDoi(cb)           -> lang nghe dang nhap/dang xuat (ca tab khac)
   ============================================================ */
(function (global) {
  "use strict";

  var KHOA_PHIEN = "ducpt-auth-session-v1";
  var SU_KIEN = "ducpt:auth-changed";

  /* ---------- Cau hinh ---------- */
  function cauHinh() {
    var c = global.DUCPT_SUPABASE || {};
    var url = String(c.url || "").replace(/\/+$/, "");
    var key = String(c.anonKey || "");
    return { url: url, anonKey: key, sanSang: !!(url && key) };
  }
  function sanSang() { return cauHinh().sanSang; }

  /* ---------- Phien luu o localStorage => dung chung moi trang cung ten mien ---------- */
  function docPhien() {
    try {
      var raw = JSON.parse(localStorage.getItem(KHOA_PHIEN) || "null");
      if (!raw || !raw.access_token) return null;
      return raw;
    } catch (e) { return null; }
  }
  function ghiPhien(p) {
    try {
      if (!p) localStorage.removeItem(KHOA_PHIEN);
      else localStorage.setItem(KHOA_PHIEN, JSON.stringify(p));
    } catch (e) {}
    boQuyenNho = null;
    try { global.dispatchEvent(new CustomEvent(SU_KIEN, { detail: { daDangNhap: !!p } })); } catch (e) {}
  }
  function chuanHoaPhien(data) {
    if (!data || !data.access_token) return null;
    var songGiay = Number(data.expires_in || 3600);
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || "",
      expires_at: Date.now() + songGiay * 1000,
      user: data.user || null
    };
  }

  /* ---------- Goi REST ---------- */
  function goi(duongDan, tuyChon) {
    var c = cauHinh();
    if (!c.sanSang) return Promise.reject(new Error("CHUA_CAU_HINH_SUPABASE"));
    tuyChon = tuyChon || {};
    var headers = Object.assign({
      "apikey": c.anonKey,
      "Content-Type": "application/json"
    }, tuyChon.headers || {});
    return fetch(c.url + duongDan, {
      method: tuyChon.method || "GET",
      headers: headers,
      body: tuyChon.body ? JSON.stringify(tuyChon.body) : undefined
    }).then(function (res) {
      return res.text().then(function (t) {
        var json = null;
        try { json = t ? JSON.parse(t) : null; } catch (e) { json = null; }
        if (!res.ok) {
          var msg = (json && (json.error_description || json.msg || json.message || json.error))
            || ("HTTP " + res.status);
          var err = new Error(msg);
          err.status = res.status;
          throw err;
        }
        return json;
      });
    });
  }

  /* ---------- Lam moi token khi sap het han ---------- */
  var dangLamMoi = null;
  function phienConHan() {
    var p = docPhien();
    if (!p) return Promise.resolve(null);
    if (Date.now() < Number(p.expires_at || 0) - 60000) return Promise.resolve(p);
    if (!p.refresh_token) { ghiPhien(null); return Promise.resolve(null); }
    if (dangLamMoi) return dangLamMoi;
    dangLamMoi = goi("/auth/v1/token?grant_type=refresh_token", {
      method: "POST", body: { refresh_token: p.refresh_token }
    }).then(function (data) {
      var moi = chuanHoaPhien(data);
      ghiPhien(moi);
      return moi;
    }).catch(function () {
      ghiPhien(null);   // refresh hong = phien chet, bat dang nhap lai
      return null;
    }).then(function (r) { dangLamMoi = null; return r; });
    return dangLamMoi;
  }

  function goiCoQuyen(duongDan, tuyChon) {
    return phienConHan().then(function (p) {
      if (!p) throw new Error("CHUA_DANG_NHAP");
      tuyChon = tuyChon || {};
      tuyChon.headers = Object.assign({ Authorization: "Bearer " + p.access_token }, tuyChon.headers || {});
      return goi(duongDan, tuyChon);
    });
  }

  /* ---------- Dang ky ---------- */
  function dangKy(tt) {
    tt = tt || {};
    var email = String(tt.email || "").trim().toLowerCase();
    var pass = String(tt.password || "");
    if (!email) return Promise.reject(new Error("Thieu email"));
    if (pass.length < 6) return Promise.reject(new Error("Mat khau can it nhat 6 ky tu"));
    return goi("/auth/v1/signup", {
      method: "POST",
      body: {
        email: email,
        password: pass,
        data: {
          full_name: String(tt.hoTen || "").trim(),
          contact: String(tt.lienHe || "").trim(),
          note: String(tt.ghiChu || "").trim(),
          source: String(tt.nguon || "web").trim()
        }
      }
    }).then(function (data) {
      // Neu du an bat "xac nhan email" thi chua co access_token -> bao trang thai cho.
      var p = chuanHoaPhien(data && data.access_token ? data : (data && data.session) || null);
      if (p) { ghiPhien(p); return { daDangNhap: true, canXacNhanEmail: false }; }
      return { daDangNhap: false, canXacNhanEmail: true };
    });
  }

  /* ---------- Dang nhap ---------- */
  function dangNhap(tt) {
    tt = tt || {};
    var email = String(tt.email || "").trim().toLowerCase();
    return goi("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email: email, password: String(tt.password || "") }
    }).then(function (data) {
      var p = chuanHoaPhien(data);
      if (!p) throw new Error("Dang nhap that bai");
      ghiPhien(p);
      return { daDangNhap: true };
    });
  }

  /* ---------- Dang xuat ---------- */
  function dangXuat() {
    var p = docPhien();
    ghiPhien(null);
    if (!p || !sanSang()) return Promise.resolve(true);
    return goi("/auth/v1/logout", {
      method: "POST",
      headers: { Authorization: "Bearer " + p.access_token }
    }).then(function () { return true; }).catch(function () { return true; });
  }

  /* ---------- Hoi "toi duoc xem gi" ---------- */
  var boQuyenNho = null;
  var KHACH = { daDangNhap: false, email: "", hoTen: "", plan: "guest", role: "guest", sanPham: [] };

  function quyen(epLayLai) {
    if (boQuyenNho && !epLayLai) return Promise.resolve(boQuyenNho);
    if (!sanSang()) return Promise.resolve(KHACH);
    return phienConHan().then(function (p) {
      if (!p) { boQuyenNho = KHACH; return KHACH; }
      return goiCoQuyen("/rest/v1/rpc/my_access", { method: "POST", body: {} })
        .then(function (rows) {
          var r = Array.isArray(rows) ? rows[0] : rows;
          if (!r) { boQuyenNho = KHACH; return KHACH; }
          boQuyenNho = {
            daDangNhap: true,
            userId: r.user_id || "",
            email: r.email || "",
            hoTen: r.full_name || "",
            plan: r.plan === "premium" ? "premium" : "free",
            role: r.role || "member",
            sanPham: Array.isArray(r.products) ? r.products : []
          };
          return boQuyenNho;
        })
        .catch(function () { boQuyenNho = KHACH; return KHACH; });
    });
  }

  /* ---------- Duoc xem san pham nay khong ---------- */
  function duocXem(maSanPham) {
    return quyen().then(function (q) {
      if (!q.daDangNhap) return false;
      if (q.role === "admin" || q.plan === "premium") return true;
      return q.sanPham.indexOf(String(maSanPham || "")) >= 0;
    });
  }

  /* ---------- Lang nghe thay doi (ke ca tu tab khac) ---------- */
  function khiDoi(cb) {
    if (typeof cb !== "function") return function () {};
    var f1 = function () { boQuyenNho = null; cb(); };
    var f2 = function (e) { if (e.key === KHOA_PHIEN) { boQuyenNho = null; cb(); } };
    global.addEventListener(SU_KIEN, f1);
    global.addEventListener("storage", f2);
    return function () {
      global.removeEventListener(SU_KIEN, f1);
      global.removeEventListener("storage", f2);
    };
  }

  global.DUCPTAuth = {
    sanSang: sanSang,
    cauHinh: cauHinh,
    dangKy: dangKy,
    dangNhap: dangNhap,
    dangXuat: dangXuat,
    quyen: quyen,
    duocXem: duocXem,
    khiDoi: khiDoi,
    coPhien: function () { return !!docPhien(); },
    KHOA_PHIEN: KHOA_PHIEN
  };
})(window);
