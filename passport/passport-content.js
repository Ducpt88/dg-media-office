/* ============================================================
   DUCPT Passport — Quản lý nội dung SỬA ĐƯỢC (lưu thật)
   Lát cắt 1: Sản phẩm. Sửa/thêm/xóa -> lưu localStorage -> reload không mất.
   Thiết kế store dạng adapter: sau này đổi sang Supabase chỉ cần sửa
   Store.load/Store.save, phần giao diện giữ nguyên.
   ============================================================ */
(() => {
  "use strict";

  // ---------- STORE adapter (hiện tại: localStorage) ----------
  const KEY = "ducpt_products_v1";
  const SEED = [
    { id: "p1", name: "Verba Studio",        priceLabel: "199K", status: "active", note: "Đang bán" },
    { id: "p2", name: "Brain Bot",           priceLabel: "299K", status: "active", note: "Đang bán" },
    { id: "p3", name: "Pinterest AutoPost",  priceLabel: "249K", status: "active", note: "Đang bán" },
    { id: "p4", name: "Giải pháp tùy chỉnh", priceLabel: "Liên hệ", status: "active", note: "Dịch vụ" },
  ];
  const Store = {
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(KEY) || "null");
        if (Array.isArray(raw) && raw.length) return raw;
      } catch {}
      // lần đầu: seed dữ liệu hiện tại rồi lưu
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED.slice();
    },
    save(list) { localStorage.setItem(KEY, JSON.stringify(list)); },
  };

  const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- STYLE (dùng biến màu sẵn có của admin) ----------
  const style = document.createElement("style");
  style.textContent = `
    #products .pc-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
    #products .pc-hint{color:var(--muted);font-size:12px}
    #products .pc-list{display:grid;gap:12px}
    #products .pc-item{display:grid;grid-template-columns:1.4fr .8fr .9fr auto;gap:12px;align-items:end;padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--paper)}
    #products .pc-item label{display:grid;gap:5px;font-size:11px;font-weight:800;color:var(--muted)}
    #products .pc-item input,#products .pc-item select{padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit;min-width:0}
    #products .pc-actions{display:flex;gap:8px}
    #products .pc-actions .delete{color:#b42318;border-color:#f0c2bd}
    #products .pc-saved{color:var(--green);font-size:12px;font-weight:800;min-height:16px}
    @media(max-width:820px){#products .pc-item{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  // ---------- RENDER ----------
  function mount() {
    const section = document.getElementById("products");
    if (!section) return;
    let list = Store.load();

    section.innerHTML = `
      <h2 class="section-title">Sản phẩm</h2>
      <div class="pc-tools">
        <div class="pc-hint">Sửa tên, giá, trạng thái rồi bấm <b>Lưu</b>. Dữ liệu được lưu lại — tải lại trang không mất.</div>
        <div style="display:flex;gap:10px;align-items:center">
          <span class="pc-saved" id="pcSaved"></span>
          <button class="btn primary" id="pcAdd" type="button">+ Thêm sản phẩm</button>
        </div>
      </div>
      <div class="pc-list" id="pcList"></div>`;

    const listEl = section.querySelector("#pcList");
    const savedEl = section.querySelector("#pcSaved");

    const flash = (msg) => { savedEl.textContent = msg; setTimeout(() => { savedEl.textContent = ""; }, 3000); };

    function draw() {
      listEl.innerHTML = list.map((p) => `
        <div class="pc-item card" data-id="${p.id}">
          <label>Tên sản phẩm<input data-f="name" value="${esc(p.name)}"></label>
          <label>Giá (hiển thị)<input data-f="priceLabel" value="${esc(p.priceLabel)}" placeholder="vd 199K hoặc Liên hệ"></label>
          <label>Trạng thái
            <select data-f="status">
              <option value="active"${p.status === "active" ? " selected" : ""}>Đang bán</option>
              <option value="draft"${p.status === "draft" ? " selected" : ""}>Nháp</option>
              <option value="hidden"${p.status === "hidden" ? " selected" : ""}>Ẩn</option>
            </select>
          </label>
          <div class="pc-actions">
            <button class="btn primary" data-save type="button">Lưu</button>
            <button class="btn delete" data-del type="button">Xóa</button>
          </div>
        </div>`).join("");
    }
    draw();

    // Lưu 1 sản phẩm
    listEl.addEventListener("click", (e) => {
      const row = e.target.closest(".pc-item"); if (!row) return;
      const id = row.dataset.id;
      const idx = list.findIndex((x) => x.id === id);

      if (e.target.closest("[data-save]") && idx >= 0) {
        row.querySelectorAll("[data-f]").forEach((el) => { list[idx][el.dataset.f] = el.value.trim(); });
        Store.save(list);
        flash("Đã lưu \"" + (list[idx].name || "sản phẩm") + "\"");
      }
      if (e.target.closest("[data-del]") && idx >= 0) {
        if (!confirm("Xóa sản phẩm \"" + (list[idx].name || "") + "\"?")) return;
        list.splice(idx, 1); Store.save(list); draw(); flash("Đã xóa");
      }
    });

    // Thêm sản phẩm
    section.querySelector("#pcAdd").addEventListener("click", () => {
      list.push({ id: uid(), name: "Sản phẩm mới", priceLabel: "", status: "draft", note: "" });
      Store.save(list); draw(); flash("Đã thêm — nhớ sửa tên/giá rồi Lưu");
      listEl.lastElementChild?.querySelector('[data-f="name"]')?.focus();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
