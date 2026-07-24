/* ============================================================
   DUCPT — KHAI BAO DIA CHI MAY CHU, MOT NOI DUY NHAT
   Sua o day la ca website doi theo. Dung de moi trang tu ghep chuoi.
   ============================================================ */

/* ---------- 1. Supabase: tai khoan chung toan website ---------- */
/* DAN 2 GIA TRI NAY VAO LA CHAY.
   Lay tai: Supabase Dashboard > Project Settings > Data API
     - Project URL   -> url
     - anon public   -> anonKey   (KHOA CONG KHAI, nhung o day la AN TOAN vi da co RLS bao ve)
   TUYET DOI KHONG dan service_role key vao day — no bo qua moi RLS. */
(function () {
  var mac_dinh = {
    url: "https://nfvewetbgdfmfajaqxev.supabase.co",   // project "ducpt"
    anonKey: "sb_publishable_bXANL2mh7qL74dnGCc1UWg_CiZk0URc"   // publishable key (cong khai, RLS bao ve)
  };
  /* Cho phep doi nhanh tren trinh duyet (dung khi test), khong phai dang lai web */
  var deTest = null;
  try { deTest = JSON.parse(localStorage.getItem("ducpt-supabase-config") || "null"); } catch (e) {}
  var c = window.DUCPT_SUPABASE || deTest || mac_dinh;
  window.DUCPT_SUPABASE = {
    url: String(c.url || "").replace(/\/+$/, ""),
    anonKey: String(c.anonKey || "")
  };
})();

/* ---------- 2. Passport API (dang ky khoa hoc, quyen hoc vien, video) ---------- */
/* Thu tu uu tien khi chon dia chi may chu:
     1. window.DUCPT_API_BASE do trang dat san truoc khi nap file nay
     2. localStorage "ducpt-api-base"  — ep cung mot dia chi, dung khi test
     3. localStorage "ducpt-api-base-live" — dia chi lan truoc do duoc THAT SU
     4. Danh sach du phong ben duoi, thu lan luot

   VI SAO KHONG CHI DUNG MOT DIA CHI:
   may chu passport vua tra API vua phuc vu file HTML. Neu chi kiem tra "HTTP 200"
   thi mot trang HTML bao loi cung tra 200 → web tuong may chu con song trong khi
   no da chet. Vi vay bat buoc phai DOC DUOC JSON hop le moi tinh la song. */
(function () {
  var DU_PHONG = [
    "https://vancouver-altered-less-forum.trycloudflare.com", // duong ham tam — CO THE CHET BAT CU LUC NAO
    "https://ducpt-passport-api.onrender.com"                 // dia chi co dinh khi da dua len Render
  ];
  var ep = "", luuSong = "";
  try { ep = String(localStorage.getItem("ducpt-api-base") || "").trim(); } catch (e) {}
  try { luuSong = String(localStorage.getItem("ducpt-api-base-live") || "").trim(); } catch (e) {}

  function chuan(u) { return String(u || "").trim().replace(/\/+$/, ""); }

  var uuTien = [chuan(window.DUCPT_API_BASE), chuan(ep), chuan(luuSong)]
    .concat(DU_PHONG.map(chuan))
    .filter(function (u, i, arr) { return u && arr.indexOf(u) === i; });

  /* Dat ngay mot dia chi de cac trang cu dung duoc lien (dong bo, khong doi) */
  window.DUCPT_API_BASE = uuTien[0] || "";

  /* Goi mot dia chi va doi HOI JSON that, khong chap nhan HTML tra 200 */
  function thu(base) {
    var duong = ["/api/passport/health", "/api/passport/course-signups"];
    return duong.reduce(function (chuoi, d) {
      return chuoi.then(function (xong) {
        if (xong) return xong;
        return fetch(base + d, { method: "GET", cache: "no-store", headers: { accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) return null;
            var ct = String(r.headers.get("content-type") || "");
            if (ct.indexOf("json") < 0) return null;   // tra HTML = may chu khong con lam API
            return r.json().then(function (j) {
              if (!j || typeof j !== "object" || !("ok" in j)) return null;
              return { base: base, duong: d, health: d.indexOf("health") >= 0 ? j : null };
            });
          })
          .catch(function () { return null; });
      });
    }, Promise.resolve(null));
  }

  var API = {
    base: window.DUCPT_API_BASE,
    trangThai: "dang-do",   // dang-do | song | chet
    health: null,
    ungVien: uuTien
  };
  window.DUCPT_API = API;

  function bao(trangThai) {
    API.trangThai = trangThai;
    try { window.dispatchEvent(new CustomEvent("ducpt:api-status", { detail: API })); } catch (e) {}
  }

  API.sanSang = uuTien.reduce(function (chuoi, base) {
    return chuoi.then(function (xong) { return xong || thu(base); });
  }, Promise.resolve(null)).then(function (ket) {
    if (!ket) {
      bao("chet");
      cheBienBao();
      return null;
    }
    API.base = ket.base;
    API.health = ket.health;
    window.DUCPT_API_BASE = ket.base;
    try { localStorage.setItem("ducpt-api-base-live", ket.base); } catch (e) {}
    bao("song");
    return ket;
  });

  /* Khong duoc chet im lang: may chu tat thi phai HIEN RA cho nguoi dung thay,
     thay vi lang le roi ve luu tren trinh duyet roi tuong la da luu that. */
  function cheBienBao() {
    if (document.getElementById("ducpt-api-down-banner")) return;
    function ve() {
      if (document.getElementById("ducpt-api-down-banner")) return;
      var b = document.createElement("div");
      b.id = "ducpt-api-down-banner";
      b.setAttribute("role", "status");
      b.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#7f1d1d;color:#fff;"
        + "font:600 13px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:10px 14px;display:flex;gap:10px;"
        + "align-items:center;justify-content:center;flex-wrap:wrap;box-shadow:0 -2px 12px rgba(0,0,0,.35)";
      b.innerHTML = '<span>⚠ Máy chủ dữ liệu đang không kết nối được. '
        + 'Đăng ký / mở khóa học lúc này <b>chỉ lưu tạm trên máy anh</b>, chưa lên hệ thống.</span>'
        + '<button type="button" style="background:#fff;color:#7f1d1d;border:0;border-radius:8px;padding:5px 12px;'
        + 'font-weight:800;cursor:pointer">Thử lại</button>';
      b.querySelector("button").addEventListener("click", function () { location.reload(); });
      document.body.appendChild(b);
    }
    if (document.body) ve();
    else document.addEventListener("DOMContentLoaded", ve, { once: true });
  }
})();
