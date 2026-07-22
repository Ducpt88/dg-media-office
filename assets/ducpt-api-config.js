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
    url: "",         // vi du: "https://abcdefgh.supabase.co"
    anonKey: ""      // vi du: "eyJhbGciOiJIUzI1NiIs..."
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

/* ---------- 2. Passport API cu (danh sach dang ky khoa hoc) ---------- */
/* Thu tu uu tien:
   1. window.DUCPT_API_BASE do trang dat san truoc khi nap file nay
   2. localStorage "ducpt-api-base" — doi server ngay tren trinh duyet
   3. Mac dinh: dich vu Render "ducpt-passport-api" (khai bao trong render.yaml)
   Khi may chu chua song, cac trang tu roi ve che do luu tren may nhu truoc. */
(function () {
  var saved = "";
  try { saved = String(localStorage.getItem("ducpt-api-base") || "").trim(); } catch (e) {}
  var base = String(window.DUCPT_API_BASE || "").trim() || saved || "https://ducpt-passport-api.onrender.com";
  window.DUCPT_API_BASE = base.replace(/\/+$/, "");
})();
