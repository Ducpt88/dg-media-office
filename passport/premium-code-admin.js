/* ============================================================
   PASSPORT — QUAN LY MA PREMIUM (Founder tu tao, tu cam)
   Gan mot the "Ma Premium" vao trang Khach hang. Tao ma cho tung nguoi tra phi,
   xem danh sach, copy, danh dau da dung, xoa. Ma luu o localStorage may Founder
   (danh sach de Founder nho ai duoc ma nao); ban than ma van chay tren may hoc vien
   nho chu ky (assets/ducpt-premium-codes.js) — khong can may chu, khong can dang lai file.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "ducpt_premium_codes_v1";
  var $ = function (id) { return document.getElementById(id); };
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c];
    });
  }
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function ngay(s) { try { var d = new Date(s); return isNaN(d) ? "" : d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }

  var css = ''
    + '#pcodeCard .pc-new{display:flex;gap:10px;flex-wrap:wrap;align-items:end;margin-bottom:14px}'
    + '#pcodeCard .pc-new label{display:grid;gap:5px;font-size:12px;font-weight:800;color:var(--muted,#667085);flex:1;min-width:200px}'
    + '#pcodeCard .pc-new input{padding:10px 12px;border:1px solid var(--line,#e6eaf0);border-radius:10px;font:inherit;background:#fff}'
    + '#pcodeCard .pc-mk{padding:11px 18px;border:0;border-radius:10px;background:#7c3aed;color:#fff;font:inherit;font-weight:900;cursor:pointer;white-space:nowrap}'
    + '#pcodeCard .pc-mk:disabled{opacity:.6;cursor:default}'
    + '#pcodeCard table{width:100%;border-collapse:collapse;font-size:13px}'
    + '#pcodeCard th,#pcodeCard td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line,#eef2f7);vertical-align:middle}'
    + '#pcodeCard th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#667085)}'
    + '#pcodeCard .pc-code{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:800;font-size:14px;color:#4c1d95;letter-spacing:.5px}'
    + '#pcodeCard .pc-code.used{text-decoration:line-through;color:#9ca3af}'
    + '#pcodeCard .pc-act button{margin-right:6px;padding:6px 10px;border:1px solid var(--line,#e6eaf0);border-radius:8px;background:#fff;font:inherit;font-size:12px;font-weight:700;cursor:pointer}'
    + '#pcodeCard .pc-act .del{color:#b42318}'
    + '#pcodeCard .pc-empty{padding:16px;text-align:center;color:var(--muted,#667085)}'
    + '#pcodeCard .pc-note{font-size:12px;color:var(--muted,#667085);margin:2px 0 14px;line-height:1.6}';
  var stEl = document.createElement("style"); stEl.textContent = css; document.head.appendChild(stEl);

  function ve() {
    var body = $("pcodeBody"); if (!body) return;
    var ds = load();
    $("pcodeCount") && ($("pcodeCount").textContent = ds.length);
    if (!ds.length) { body.innerHTML = '<div class="pc-empty">Chưa tạo mã nào. Điền tên người trả phí rồi bấm <b>Tạo mã mới</b>.</div>'; return; }
    body.innerHTML = ''
      + '<table><thead><tr><th>Mã Premium</th><th>Cấp cho</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr></thead><tbody>'
      + ds.map(function (r, i) {
          return '<tr>'
            + '<td><span class="pc-code' + (r.used ? " used" : "") + '">' + esc(r.code) + '</span></td>'
            + '<td>' + esc(r.name || "—") + (r.note ? '<br><small style="color:var(--muted,#667085)">' + esc(r.note) + '</small>' : "") + '</td>'
            + '<td>' + esc(ngay(r.createdAt)) + '</td>'
            + '<td>' + (r.used ? "Đã dùng" : "Còn hiệu lực") + '</td>'
            + '<td class="pc-act" data-i="' + i + '">'
            +   '<button data-copy>Copy</button>'
            +   '<button data-used>' + (r.used ? "Bỏ đánh dấu" : "Đã dùng") + '</button>'
            +   '<button class="del" data-del>Xóa</button>'
            + '</td></tr>';
        }).join("")
      + '</tbody></table>';
  }

  function taoMa() {
    var btn = $("pcodeMake"); if (btn) btn.disabled = true;
    var name = String(($("pcodeName") || {}).value || "").trim();
    var note = String(($("pcodeNote") || {}).value || "").trim();
    var st = $("pcodeStatus");
    if (!window.DGPremiumCodes || !window.DGPremiumCodes.make) {
      if (st) { st.style.color = "#b42318"; st.textContent = "Chưa nạp bộ tạo mã. Tải lại trang."; }
      if (btn) btn.disabled = false; return;
    }
    window.DGPremiumCodes.make().then(function (code) {
      if (!code) throw new Error("Không tạo được mã (trình duyệt cũ?)");
      var ds = load();
      ds.unshift({ code: code, name: name, note: note, used: false, createdAt: new Date().toISOString() });
      save(ds); ve();
      if ($("pcodeName")) $("pcodeName").value = "";
      if ($("pcodeNote")) $("pcodeNote").value = "";
      if (st) { st.style.color = "#047857"; st.textContent = "Đã tạo mã: " + code + " — bấm Copy để gửi cho học viên."; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () {
        if (st) st.textContent = "Đã tạo & copy mã: " + code + " — dán gửi cho học viên.";
      }, function () {});
    }).catch(function (e) {
      if (st) { st.style.color = "#b42318"; st.textContent = "Lỗi: " + (e && e.message || e); }
    }).then(function () { if (btn) btn.disabled = false; });
  }

  function noiSuKien() {
    var mk = $("pcodeMake"); if (mk) mk.addEventListener("click", taoMa);
    var body = $("pcodeBody");
    if (body) body.addEventListener("click", function (e) {
      var cell = e.target.closest(".pc-act"); if (!cell) return;
      var i = Number(cell.dataset.i); var ds = load(); if (!ds[i]) return;
      if (e.target.closest("[data-copy]")) {
        var code = ds[i].code;
        var ok = function () { var st = $("pcodeStatus"); if (st) { st.style.color = "#047857"; st.textContent = "Đã copy: " + code; } };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, ok); else ok();
      } else if (e.target.closest("[data-used]")) {
        ds[i].used = !ds[i].used; save(ds); ve();
      } else if (e.target.closest("[data-del]")) {
        if (confirm("Xóa mã này khỏi danh sách? (Học viên đã nhận mã vẫn còn dùng được — muốn chặn hẳn phải đổi mã bí mật.)")) { ds.splice(i, 1); save(ds); ve(); }
      }
    });
  }

  function gan() {
    var view = $("customers") || document.querySelector('.view#customers') || document.querySelector(".view.active") || document.body;
    if (!view || $("pcodeCard")) return;
    var card = document.createElement("article");
    card.className = "card"; card.id = "pcodeCard";
    card.style.cssText = "margin-top:16px;padding:20px";
    card.innerHTML = ''
      + '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px">'
      +   '<h3 style="margin:0">🔑 Mã Premium — tạo & cấp cho người đã trả phí</h3>'
      +   '<span style="font-size:12px;color:var(--muted,#667085)">Đã tạo: <b id="pcodeCount">0</b></span>'
      + '</div>'
      + '<p class="pc-note">Bấm <b>Tạo mã mới</b> là ra một mã riêng. Gửi mã cho học viên đã trả phí; khi họ nhập <b>email + mã</b>, máy chủ sẽ khóa mã cho đúng email đầu tiên dùng. Người khác nhập lại mã đó sẽ bị chặn — <b>không cần Supabase, không cần SQL</b>. Danh sách này chỉ lưu trên máy anh để nhớ ai nhận mã nào.</p>'
      + '<div class="pc-new">'
      +   '<label>Cấp cho (tên/Zalo)<input id="pcodeName" placeholder="VD: Anh Tuấn 0987..."></label>'
      +   '<label>Ghi chú<input id="pcodeNote" placeholder="VD: mua gói khóa học 21/7"></label>'
      +   '<button class="pc-mk" id="pcodeMake" type="button">+ Tạo mã mới</button>'
      + '</div>'
      + '<div id="pcodeStatus" style="min-height:18px;font-size:12.5px;font-weight:700;margin-bottom:12px"></div>'
      + '<div id="pcodeBody"></div>';
    view.appendChild(card);
    noiSuKien(); ve();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", gan);
  else gan();
})();
