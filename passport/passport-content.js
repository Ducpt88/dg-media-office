/* ============================================================
   DUCPT Passport — Quản lý nội dung SỬA ĐƯỢC (lưu thật)
   Biến các mục tĩnh (Sản phẩm, Dịch vụ, Công cụ AI, Khóa học, Về chúng tôi)
   thành form sửa/thêm/xóa được, LƯU vào localStorage -> reload không mất.
   Store dạng adapter: sau nâng cấp Supabase chỉ đổi Store.load/save.
   ============================================================ */
(() => {
  "use strict";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const uid = () => "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Store adapter — hiện tại localStorage; sau đổi sang Supabase tại đây.
  const Store = {
    load(key, seed) {
      try { const r = JSON.parse(localStorage.getItem(key) || "null"); if (r != null) return r; } catch {}
      localStorage.setItem(key, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    },
    save(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  };

  // ---------- CSS chung ----------
  const style = document.createElement("style");
  style.textContent = `
    .pc-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 14px;flex-wrap:wrap}
    .pc-hint{color:var(--muted);font-size:12px;max-width:640px}
    .pc-right{display:flex;gap:10px;align-items:center}
    .pc-saved{color:var(--green);font-size:12px;font-weight:800;min-height:16px}
    .pc-list{display:grid;gap:12px}
    .pc-item{display:grid;gap:12px;align-items:end;padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--paper)}
    .pc-item label{display:grid;gap:5px;font-size:11px;font-weight:800;color:var(--muted)}
    .pc-item input,.pc-item select,.pc-item textarea{padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit;min-width:0;width:100%}
    .pc-item textarea{min-height:90px;resize:vertical}
    .pc-actions{display:flex;gap:8px}
    .pc-actions .delete{color:#b42318;border-color:#f0c2bd}
    @media(max-width:820px){.pc-item{grid-template-columns:1fr !important}}
  `;
  document.head.appendChild(style);

  // ---------- Editor cho danh sách (nhiều dòng) ----------
  function listSection(cfg) {
    const section = document.getElementById(cfg.viewId);
    if (!section) return;
    let list = Store.load(cfg.storeKey, cfg.seed);
    const cols = cfg.fields.map(() => "minmax(0,1fr)").join(" ") + " auto";

    section.innerHTML = `
      <div class="pc-tools">
        <div><h2 style="margin:0 0 4px">${esc(cfg.title)}</h2><div class="pc-hint">${esc(cfg.hint)}</div></div>
        <div class="pc-right"><span class="pc-saved" data-saved></span>
          <button class="btn primary" data-add type="button">+ Thêm</button></div>
      </div>
      <div class="pc-list" data-list></div>`;
    const listEl = section.querySelector("[data-list]");
    const savedEl = section.querySelector("[data-saved]");
    const flash = (m) => { savedEl.textContent = m; setTimeout(() => savedEl.textContent = "", 3000); };

    const fieldHtml = (f, v) => {
      if (f.type === "select")
        return `<label>${esc(f.label)}<select data-f="${f.f}">${f.options.map(o => `<option value="${esc(o.v)}"${v === o.v ? " selected" : ""}>${esc(o.t)}</option>`).join("")}</select></label>`;
      if (f.type === "number")
        return `<label>${esc(f.label)}<input type="number" min="0" data-f="${f.f}" value="${esc(v)}"></label>`;
      return `<label>${esc(f.label)}<input data-f="${f.f}" value="${esc(v)}" placeholder="${esc(f.ph || "")}"></label>`;
    };
    function draw() {
      listEl.innerHTML = list.map((rec) => `
        <div class="pc-item" data-id="${rec.id}" style="grid-template-columns:${cols}">
          ${cfg.fields.map(f => fieldHtml(f, rec[f.f])).join("")}
          <div class="pc-actions">
            <button class="btn primary" data-save type="button">Lưu</button>
            <button class="btn delete" data-del type="button">Xóa</button>
          </div>
        </div>`).join("");
    }
    draw();

    listEl.addEventListener("click", (e) => {
      const row = e.target.closest(".pc-item"); if (!row) return;
      const idx = list.findIndex((x) => x.id === row.dataset.id); if (idx < 0) return;
      if (e.target.closest("[data-save]")) {
        row.querySelectorAll("[data-f]").forEach((el) => list[idx][el.dataset.f] = el.value.trim());
        Store.save(cfg.storeKey, list); flash("Đã lưu");
      }
      if (e.target.closest("[data-del]")) {
        if (!confirm("Xóa dòng này?")) return;
        list.splice(idx, 1); Store.save(cfg.storeKey, list); draw(); flash("Đã xóa");
      }
    });
    section.querySelector("[data-add]").addEventListener("click", () => {
      const rec = { id: uid() }; cfg.fields.forEach(f => rec[f.f] = f.default != null ? f.default : "");
      list.push(rec); Store.save(cfg.storeKey, list); draw(); flash("Đã thêm — sửa rồi bấm Lưu");
      listEl.lastElementChild?.querySelector("[data-f]")?.focus();
    });
  }

  // ---------- Editor 1 bản ghi (Về chúng tôi) ----------
  function recordSection(cfg) {
    const section = document.getElementById(cfg.viewId); if (!section) return;
    let rec = Store.load(cfg.storeKey, cfg.seed);
    section.innerHTML = `
      <div class="pc-tools"><div><h2 style="margin:0 0 4px">${esc(cfg.title)}</h2>
        <div class="pc-hint">${esc(cfg.hint)}</div></div>
        <div class="pc-right"><span class="pc-saved" data-saved></span>
          <button class="btn primary" data-save type="button">Lưu</button></div></div>
      <div class="pc-item" style="grid-template-columns:1fr">
        ${cfg.fields.map(f => f.type === "textarea"
          ? `<label>${esc(f.label)}<textarea data-f="${f.f}">${esc(rec[f.f])}</textarea></label>`
          : `<label>${esc(f.label)}<input data-f="${f.f}" value="${esc(rec[f.f])}"></label>`).join("")}
      </div>`;
    const savedEl = section.querySelector("[data-saved]");
    section.querySelector("[data-save]").addEventListener("click", () => {
      section.querySelectorAll("[data-f]").forEach((el) => rec[el.dataset.f] = el.value);
      Store.save(cfg.storeKey, rec);
      savedEl.textContent = "Đã lưu"; setTimeout(() => savedEl.textContent = "", 3000);
    });
  }

  const ST = { draft: { v: "draft", t: "Nháp" }, active: { v: "active", t: "Đang bán" } };

  function mount() {
    listSection({
      viewId: "products", title: "Sản phẩm", storeKey: "ducpt_products_v1",
      hint: "Sửa tên, giá, trạng thái rồi bấm Lưu. Dữ liệu được lưu lại — tải lại trang không mất.",
      fields: [
        { f: "name", label: "Tên sản phẩm" },
        { f: "priceLabel", label: "Giá (hiển thị)", ph: "vd 199K hoặc Liên hệ" },
        { f: "status", label: "Trạng thái", type: "select", default: "active",
          options: [{ v: "active", t: "Đang bán" }, { v: "draft", t: "Nháp" }, { v: "hidden", t: "Ẩn" }] },
      ],
      seed: [
        { id: "p1", name: "Verba Studio", priceLabel: "199K", status: "active" },
        { id: "p2", name: "Brain Bot", priceLabel: "299K", status: "active" },
        { id: "p3", name: "Pinterest AutoPost", priceLabel: "249K", status: "active" },
        { id: "p4", name: "Giải pháp tùy chỉnh", priceLabel: "Liên hệ", status: "active" },
      ],
    });

    listSection({
      viewId: "servicesAdmin", title: "Dịch vụ đào tạo", storeKey: "ducpt_services_v1",
      hint: "Quản lý gói đào tạo, workshop, tư vấn. Sửa rồi bấm Lưu.",
      fields: [
        { f: "name", label: "Dịch vụ" },
        { f: "audience", label: "Đối tượng" },
        { f: "content", label: "Nội dung" },
        { f: "status", label: "Trạng thái", type: "select", default: "draft",
          options: [{ v: "draft", t: "Bản nháp" }, { v: "active", t: "Đang bán" }] },
      ],
      seed: [
        { id: "s1", name: "Đào tạo AI doanh nghiệp", audience: "Team", content: "Workshop + tài liệu", status: "draft" },
        { id: "s2", name: "Kèm workflow AI 1:1", audience: "Cá nhân", content: "Tư vấn + setup", status: "draft" },
      ],
    });

    listSection({
      viewId: "toolsAdmin", title: "Công cụ AI", storeKey: "ducpt_tools_v1",
      hint: "Quản lý Verba Studio, Brain Bot, AutoPost... Sửa rồi bấm Lưu.",
      fields: [
        { f: "name", label: "Công cụ" },
        { f: "status", label: "Trạng thái", type: "select", default: "draft",
          options: [{ v: "live", t: "Live" }, { v: "draft", t: "Nháp" }, { v: "setup", t: "Setup" }] },
        { f: "note", label: "Ghi chú" },
      ],
      seed: [
        { id: "t1", name: "Verba Studio", status: "live", note: "Landing + checkout" },
        { id: "t2", name: "Knowledge Brain Bot", status: "live", note: "Trang sản phẩm" },
        { id: "t3", name: "Pinterest AutoPost", status: "draft", note: "Chờ mô tả chi tiết" },
        { id: "t4", name: "API tích hợp", status: "setup", note: "Chờ backend" },
      ],
    });

    listSection({
      viewId: "courseAdmin", title: "Quản lý khóa học", storeKey: "ducpt_courses_v1",
      hint: "Tạo/sửa khóa học. Sửa rồi bấm Lưu.",
      fields: [
        { f: "name", label: "Khóa học" },
        { f: "category", label: "Danh mục" },
        { f: "lessons", label: "Số bài", type: "number", default: 0 },
        { f: "status", label: "Trạng thái", type: "select", default: "draft",
          options: [{ v: "draft", t: "Bản nháp" }, { v: "active", t: "Đang mở" }] },
      ],
      seed: [
        { id: "c1", name: "AI cho người mới", category: "Nền tảng", lessons: 0, status: "draft" },
        { id: "c2", name: "AI cho Creator", category: "Nội dung", lessons: 0, status: "draft" },
        { id: "c3", name: "Automation thực chiến", category: "Automation", lessons: 0, status: "draft" },
      ],
    });

    recordSection({
      viewId: "aboutAdmin", title: "Về chúng tôi", storeKey: "ducpt_about_v1",
      hint: "Nội dung giới thiệu và kênh liên hệ. Sửa rồi bấm Lưu.",
      fields: [
        { f: "intro", label: "Giới thiệu DUCPT", type: "textarea" },
        { f: "contact", label: "Kênh liên hệ (Zalo, YouTube, Email, Facebook)" },
      ],
      seed: { intro: "DUCPT — Hoàng Văn Đức: sản phẩm & giải pháp AI cho người Việt.", contact: "Zalo · YouTube · Email · Facebook" },
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
