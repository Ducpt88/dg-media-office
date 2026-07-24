/* ============================================================
   DUCPT — MA PREMIUM CO CHU KY (khong can may chu, khong can dang lai file)
   Founder tao ma ngay trong Passport. Trang khoa hoc TU KIEM bang chu ky bi mat,
   nen ma tao o may Founder van chay tren may hoc vien khac ma khong phai publish gi.

   Dinh dang ma:  DGP-XXXXXXXX-YYYYYY
     - XXXXXXXX : phan ngau nhien (8 ky tu)
     - YYYYYY   : 6 ky tu dau cua SHA-256(phan_ngau_nhien + "|" + SECRET)
   Chi ai biet SECRET moi tao duoc ma hop le -> Founder (va trang nay) biet.

   LUU Y: day la co che nhe cho lop hoc, khong phai bao mat ngan hang.
   Doi SECRET = vo hieu hoa TOAN BO ma cu cung mot luc.
   ============================================================ */
(function (g) {
  "use strict";
  var SECRET = "dg-cong-ty-1-nguoi-2026-vip-9f37ab2c";

  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (x) {
      return ("0" + x.toString(16)).slice(-2);
    }).join("");
  }
  function sig(base) {
    if (!(g.crypto && g.crypto.subtle)) return Promise.resolve("");
    return g.crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(String(base) + "|" + SECRET))
      .then(function (b) { return hex(b).slice(0, 6).toUpperCase(); });
  }
  function randBase() {
    var s = (Date.now().toString(36) + Math.random().toString(36).slice(2));
    return s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  }
  function make() {
    var base = randBase();
    return sig(base).then(function (s) { return "DGP-" + base + "-" + s; });
  }
  function verify(code) {
    var m = String(code || "").trim().toUpperCase().match(/^DGP-([A-Z0-9]{4,12})-([0-9A-F]{6})$/);
    if (!m) return Promise.resolve(false);
    return sig(m[1]).then(function (s) { return !!s && s === m[2]; });
  }
  g.DGPremiumCodes = { make: make, verify: verify };
})(window);
