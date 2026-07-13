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
    .course-studio{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;margin-top:14px}
    .cs-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .cs-panel{min-width:0}.cs-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.cs-head h3{margin:0;font-size:15px}
    .cs-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:14px}
    .cs-form label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:800}
    .cs-form input,.cs-form select,.cs-form textarea{width:100%;min-width:0;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit}
    .cs-form textarea{min-height:76px;resize:vertical}.cs-wide{grid-column:1/-1}.cs-actions,.cs-actions-mini{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .cs-actions-mini .btn{padding:6px 9px;border-radius:8px;font-size:11px}.btn.delete{color:#b42318;border-color:#f0c2bd}
    .cs-table{display:grid;gap:7px;overflow:auto}.cs-row{display:grid;grid-template-columns:.55fr 1.4fr 1fr .55fr auto;gap:8px;align-items:center;min-width:720px;padding:9px;border:1px solid var(--line);border-radius:10px;background:#fff}
    .cs-row-head{color:var(--muted);font-weight:900;background:#f8fafc}.cs-row span{font-size:11px}.cs-row small,.lesson-card small{display:block;margin-top:3px;color:var(--muted);font-size:10px}.cs-row.is-selected{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.08)}
    .lesson-list{display:grid;gap:9px}.lesson-card{display:grid;gap:4px;padding:11px;border:1px solid var(--line);border-radius:10px;background:#fff}.lesson-card span{color:var(--muted);font-size:11px}
    .video-preview{display:grid;place-items:center;min-height:170px;margin:10px 0 14px;border:1px dashed #cbd5e1;border-radius:12px;color:var(--muted);background:#f8fafc;text-align:center}.video-preview video{width:100%;max-height:260px;border-radius:10px;background:#000}
    .student-access{margin-top:14px}.access-form{grid-template-columns:repeat(4,minmax(0,1fr))}.access-table .cs-row{grid-template-columns:1fr 1fr 1.4fr .75fr auto}
    .cs-course-checks{display:flex;flex-wrap:wrap;gap:8px}.cs-check{display:inline-flex!important;grid-template-columns:auto!important;align-items:center;gap:6px;padding:7px 9px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink)!important}.cs-check input{width:auto!important}
    .cs-empty{padding:14px;border:1px dashed #cbd5e1;border-radius:10px;color:var(--muted);background:#f8fafc;font-size:12px}
    @media(max-width:1100px){.course-studio{grid-template-columns:1fr}.cs-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.access-form{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:700px){.cs-form,.access-form{grid-template-columns:1fr}.cs-metrics{grid-template-columns:1fr 1fr}}
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

  const courseSeed = [
    { id: "c1", order: 1, categoryOrder: 1, name: "AI cho nguoi moi", category: "Nen tang", status: "draft", description: "Khung hoc AI co ban cho hoc vien moi." },
    { id: "c2", order: 2, categoryOrder: 2, name: "AI cho Creator", category: "Noi dung", status: "draft", description: "Ung dung AI vao san xuat noi dung." },
    { id: "c3", order: 3, categoryOrder: 3, name: "Automation thuc chien", category: "Automation", status: "draft", description: "Tu dong hoa cac workflow lap lai." },
  ];
  const lessonSeed = [
    { id: "l1", courseId: "c1", order: 1, title: "Bai 1 - Tong quan AI", videoUrl: "", videoFileName: "", duration: "12:00", status: "draft", note: "Tai video hoac dan link video bai hoc." },
  ];
  const accessSeed = [
    { id: "a1", name: "Hoc vien mau", contact: "Zalo/email", courseIds: ["c1"], status: "active", expiresAt: "", note: "Quyen hoc thu nghiem." },
  ];

  const byCourseOrder = (a, b) =>
    (Number(a.categoryOrder) || 999) - (Number(b.categoryOrder) || 999) ||
    String(a.category || "").localeCompare(String(b.category || "")) ||
    (Number(a.order) || 999) - (Number(b.order) || 999);
  const lessonStatusText = (s) => s === "published" ? "Da xuat ban" : s === "hidden" ? "An" : "Nhap";
  const accessStatusText = (s) => s === "active" ? "Dang mo" : s === "paused" ? "Tam khoa" : "Het han";

  function normalizeCourses(list) {
    return list.map((item, index) => ({
      id: item.id || uid(),
      order: Number(item.order || index + 1),
      categoryOrder: Number(item.categoryOrder || index + 1),
      name: item.name || "Khoa hoc moi",
      category: item.category || "Chua phan loai",
      status: item.status || "draft",
      description: item.description || "",
    }));
  }

  function courseStudioSection() {
    const section = document.getElementById("courseAdmin");
    if (!section) return;
    let courses = normalizeCourses(Store.load("ducpt_courses_v2", courseSeed));
    let lessons = Store.load("ducpt_lessons_v1", lessonSeed);
    let access = Store.load("ducpt_student_access_v1", accessSeed);
    let selectedCourseId = courses[0]?.id || "";
    let editingCourseId = "";
    let editingLessonId = "";
    let editingAccessId = "";
    let selectedPreviewUrl = "";

    const saveAll = () => {
      Store.save("ducpt_courses_v2", courses);
      Store.save("ducpt_lessons_v1", lessons);
      Store.save("ducpt_student_access_v1", access);
      window.dispatchEvent(new CustomEvent("ducpt:learning-updated"));
    };
    const courseName = (id) => courses.find((c) => c.id === id)?.name || "Chua chon";
    const sortedCourses = () => courses.slice().sort(byCourseOrder);
    const selectedCourseIds = (root) => Array.from(root.querySelectorAll("[data-course-check]:checked")).map((el) => el.value);
    const flash = (m) => {
      const el = section.querySelector("[data-saved]");
      if (!el) return;
      el.textContent = m;
      setTimeout(() => { el.textContent = ""; }, 2800);
    };

    function draw() {
      const totalVideos = lessons.filter((l) => l.videoUrl || l.videoFileName).length;
      const activeStudents = access.filter((x) => x.status === "active").length;
      const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
      if (selectedCourse && selectedCourse.id !== selectedCourseId) selectedCourseId = selectedCourse.id;
      const selectedLessons = lessons.filter((l) => l.courseId === selectedCourseId).sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
      const courseOptions = sortedCourses().map((c) => `<option value="${esc(c.id)}"${c.id === selectedCourseId ? " selected" : ""}>${esc(c.order)}. ${esc(c.name)}</option>`).join("");
      const courseChecks = (chosen = []) => sortedCourses().map((c) => `<label class="cs-check"><input type="checkbox" data-course-check value="${esc(c.id)}"${chosen.includes(c.id) ? " checked" : ""}>${esc(c.name)}</label>`).join("");
      const editingAccess = access.find((x) => x.id === editingAccessId);

      section.innerHTML = `
        <div class="pc-tools">
          <div><h2 style="margin:0 0 4px">Quan ly khoa hoc, video va quyen hoc vien</h2><div class="pc-hint">Sap xep bang so thu tu, tao bai hoc/video, cap quyen hoc theo tung hoc vien. Ban tinh hien luu tren trinh duyet; khi noi storage/backend co the day file video len server.</div></div>
          <div class="pc-right"><span class="pc-saved" data-saved></span><button class="btn primary" data-new-course type="button">+ Khoa hoc</button></div>
        </div>
        <div class="cs-metrics">
          <article class="card metric"><span>Tong khoa hoc</span><strong>${courses.length}</strong><small>${courses.filter((c) => c.status === "active").length} dang mo</small></article>
          <article class="card metric"><span>Bai hoc</span><strong>${lessons.length}</strong><small>${totalVideos} co video</small></article>
          <article class="card metric"><span>Hoc vien co quyen</span><strong>${activeStudents}</strong><small>Dang mo khoa hoc</small></article>
          <article class="card metric"><span>Danh muc</span><strong>${new Set(courses.map((c) => c.category)).size}</strong><small>Sap xep bang STT</small></article>
        </div>
        <div class="course-studio">
          <article class="card cs-panel">
            <div class="cs-head"><h3>Danh muc & khoa hoc</h3><button class="btn" data-new-course type="button">Them</button></div>
            <form class="cs-form" data-course-form>
              <input type="hidden" name="id">
              <label>STT danh muc<input name="categoryOrder" type="number" min="1"></label>
              <label>STT khoa<input name="order" type="number" min="1"></label>
              <label>Danh muc<input name="category" placeholder="Nen tang, Creator, Automation"></label>
              <label>Ten khoa hoc<input name="name" required placeholder="Ten khoa hoc"></label>
              <label>Trang thai<select name="status"><option value="draft">Ban nhap</option><option value="active">Dang mo</option><option value="hidden">An</option></select></label>
              <label class="cs-wide">Mo ta<textarea name="description" placeholder="Noi dung/chuan dau ra cua khoa hoc"></textarea></label>
              <div class="cs-actions"><button class="btn primary" type="submit">${editingCourseId ? "Luu khoa hoc" : "Tao khoa hoc"}</button><button class="btn" data-reset-course type="button">Lam moi</button></div>
            </form>
            <div class="cs-table">
              <div class="cs-row cs-row-head"><span>STT</span><span>Khoa hoc</span><span>Danh muc</span><span>Bai</span><span></span></div>
              ${sortedCourses().map((c) => `<div class="cs-row ${c.id === selectedCourseId ? "is-selected" : ""}" data-course-id="${esc(c.id)}"><span><b>${esc(c.categoryOrder)}.${esc(c.order)}</b></span><span>${esc(c.name)}<small>${esc(c.status === "active" ? "Dang mo" : c.status === "hidden" ? "An" : "Ban nhap")}</small></span><span>${esc(c.category)}</span><span>${lessons.filter((l) => l.courseId === c.id).length}</span><span class="cs-actions-mini"><button class="btn" data-edit-course type="button">Sua</button><button class="btn delete" data-del-course type="button">Xoa</button></span></div>`).join("") || `<div class="cs-empty">Chua co khoa hoc.</div>`}
            </div>
          </article>
          <article class="card cs-panel">
            <div class="cs-head"><h3>Bai hoc & video</h3><select class="searchbox" data-selected-course>${courseOptions}</select></div>
            <form class="cs-form" data-lesson-form>
              <input type="hidden" name="id">
              <label>STT bai<input name="order" type="number" min="1"></label>
              <label class="cs-wide">Tieu de bai hoc<input name="title" required placeholder="Bai 1 - Tieu de"></label>
              <label>Thoi luong<input name="duration" placeholder="12:00"></label>
              <label>Trang thai<select name="status"><option value="draft">Ban nhap</option><option value="published">Xuat ban</option><option value="hidden">An</option></select></label>
              <label class="cs-wide">Video URL<input name="videoUrl" placeholder="https://...mp4 / YouTube / Vimeo"></label>
              <label class="cs-wide">Tai/chon file video de xem thu<input name="videoFile" type="file" accept="video/*"><small data-file-name></small></label>
              <label class="cs-wide">Ghi chu / tai lieu<textarea name="note" placeholder="Link tai lieu, bai tap, ghi chu cho hoc vien"></textarea></label>
              <div class="cs-actions"><button class="btn primary" type="submit">${editingLessonId ? "Luu bai hoc" : "Them bai hoc"}</button><button class="btn" data-reset-lesson type="button">Lam moi</button></div>
            </form>
            <div class="video-preview" data-video-preview>${selectedPreviewUrl ? `<video controls src="${esc(selectedPreviewUrl)}"></video>` : `<span>Chon file video hoac dan Video URL de xem thu tai day.</span>`}</div>
            <div class="lesson-list">
              ${selectedLessons.map((l) => `<div class="lesson-card" data-lesson-id="${esc(l.id)}"><b>${esc(l.order)}. ${esc(l.title)}</b><span>${esc(courseName(l.courseId))} - ${esc(lessonStatusText(l.status))} - ${esc(l.duration || "Chua co thoi luong")}</span><small>${esc(l.videoFileName || l.videoUrl || "Chua gan video")}</small><div class="cs-actions-mini"><button class="btn" data-edit-lesson type="button">Sua</button><button class="btn delete" data-del-lesson type="button">Xoa</button></div></div>`).join("") || `<div class="cs-empty">Chua co bai hoc cho khoa nay.</div>`}
            </div>
          </article>
        </div>
        <article class="card student-access">
          <div class="cs-head"><h3>Quyen trong danh sach hoc vien</h3><button class="btn" data-new-access type="button">+ Hoc vien</button></div>
          <form class="cs-form access-form" data-access-form>
            <input type="hidden" name="id">
            <label>Hoc vien<input name="name" required placeholder="Ho ten"></label>
            <label>Lien he<input name="contact" placeholder="SDT, Zalo, email"></label>
            <label>Trang thai<select name="status"><option value="active">Dang mo</option><option value="paused">Tam khoa</option><option value="expired">Het han</option></select></label>
            <label>Het han<input name="expiresAt" type="date"></label>
            <label class="cs-wide">Ghi chu<input name="note" placeholder="Ghi chu CSKH / tien do / nhu cau rieng"></label>
            <div class="cs-wide cs-course-checks">${courseChecks(editingAccess ? (editingAccess.courseIds || []) : [selectedCourseId])}</div>
            <div class="cs-actions"><button class="btn primary" type="submit">${editingAccessId ? "Luu quyen hoc" : "Cap quyen hoc"}</button><button class="btn" data-reset-access type="button">Lam moi</button></div>
          </form>
          <div class="cs-table access-table">
            <div class="cs-row cs-row-head"><span>Hoc vien</span><span>Lien he</span><span>Khoa duoc hoc</span><span>Quyen</span><span></span></div>
            ${access.map((x) => `<div class="cs-row" data-access-id="${esc(x.id)}"><span>${esc(x.name)}</span><span>${esc(x.contact)}</span><span>${esc((x.courseIds || []).map(courseName).join(", ") || "Chua gan")}</span><span>${esc(accessStatusText(x.status))}${x.expiresAt ? `<small>Het han ${esc(x.expiresAt)}</small>` : ""}</span><span class="cs-actions-mini"><button class="btn" data-edit-access type="button">Sua</button><button class="btn delete" data-del-access type="button">Xoa</button></span></div>`).join("") || `<div class="cs-empty">Chua co hoc vien.</div>`}
          </div>
        </article>`;

      const courseForm = section.querySelector("[data-course-form]");
      const lessonForm = section.querySelector("[data-lesson-form]");
      const accessForm = section.querySelector("[data-access-form]");
      const editingCourse = courses.find((c) => c.id === editingCourseId);
      const editingLesson = lessons.find((l) => l.id === editingLessonId);
      if (courseForm) {
        courseForm.elements.id.value = editingCourse?.id || "";
        courseForm.elements.categoryOrder.value = editingCourse?.categoryOrder || 1;
        courseForm.elements.order.value = editingCourse?.order || Math.max(1, courses.length + 1);
        courseForm.elements.category.value = editingCourse?.category || "";
        courseForm.elements.name.value = editingCourse?.name || "";
        courseForm.elements.status.value = editingCourse?.status || "draft";
        courseForm.elements.description.value = editingCourse?.description || "";
      }
      if (lessonForm) {
        lessonForm.elements.id.value = editingLesson?.id || "";
        lessonForm.elements.order.value = editingLesson?.order || Math.max(1, selectedLessons.length + 1);
        lessonForm.elements.title.value = editingLesson?.title || "";
        lessonForm.elements.duration.value = editingLesson?.duration || "";
        lessonForm.elements.status.value = editingLesson?.status || "draft";
        lessonForm.elements.videoUrl.value = editingLesson?.videoUrl || "";
        lessonForm.elements.note.value = editingLesson?.note || "";
        const fileName = lessonForm.querySelector("[data-file-name]");
        if (fileName) fileName.textContent = editingLesson?.videoFileName ? `Dang chon: ${editingLesson.videoFileName}` : "";
      }
      if (accessForm) {
        accessForm.elements.id.value = editingAccess?.id || "";
        accessForm.elements.name.value = editingAccess?.name || "";
        accessForm.elements.contact.value = editingAccess?.contact || "";
        accessForm.elements.status.value = editingAccess?.status || "active";
        accessForm.elements.expiresAt.value = editingAccess?.expiresAt || "";
        accessForm.elements.note.value = editingAccess?.note || "";
      }
    }

    section.addEventListener("submit", (event) => {
      if (event.target.matches("[data-course-form]")) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        const rec = { id: data.id || uid(), order: Number(data.order) || 1, categoryOrder: Number(data.categoryOrder) || 1, name: data.name.trim(), category: data.category.trim() || "Chua phan loai", status: data.status, description: data.description.trim() };
        const idx = courses.findIndex((c) => c.id === rec.id);
        if (idx >= 0) courses[idx] = rec; else courses.push(rec);
        selectedCourseId = rec.id; editingCourseId = ""; saveAll(); draw(); flash("Da luu khoa hoc");
      }
      if (event.target.matches("[data-lesson-form]")) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        const file = event.target.elements.videoFile.files?.[0];
        const old = lessons.find((l) => l.id === data.id);
        const rec = { id: data.id || uid(), courseId: selectedCourseId, order: Number(data.order) || 1, title: data.title.trim(), duration: data.duration.trim(), status: data.status, videoUrl: data.videoUrl.trim(), videoFileName: file?.name || old?.videoFileName || "", note: data.note.trim() };
        const idx = lessons.findIndex((l) => l.id === rec.id);
        if (idx >= 0) lessons[idx] = rec; else lessons.push(rec);
        editingLessonId = ""; saveAll(); draw(); flash("Da luu bai hoc/video");
      }
      if (event.target.matches("[data-access-form]")) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        const rec = { id: data.id || uid(), name: data.name.trim(), contact: data.contact.trim(), status: data.status, expiresAt: data.expiresAt, note: data.note.trim(), courseIds: selectedCourseIds(event.target) };
        const idx = access.findIndex((x) => x.id === rec.id);
        if (idx >= 0) access[idx] = rec; else access.push(rec);
        editingAccessId = ""; saveAll(); draw(); flash("Da cap nhat quyen hoc vien");
      }
    });

    section.addEventListener("change", (event) => {
      if (event.target.matches("[data-selected-course]")) { selectedCourseId = event.target.value; editingLessonId = ""; draw(); }
      if (event.target.matches('input[name="videoFile"]')) {
        const file = event.target.files?.[0];
        if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
        selectedPreviewUrl = file ? URL.createObjectURL(file) : "";
        const name = section.querySelector("[data-file-name]");
        if (name) name.textContent = file ? `Dang chon: ${file.name}` : "";
        const preview = section.querySelector("[data-video-preview]");
        if (preview) preview.innerHTML = selectedPreviewUrl ? `<video controls src="${esc(selectedPreviewUrl)}"></video>` : `<span>Chon file video hoac dan Video URL de xem thu tai day.</span>`;
      }
    });

    section.addEventListener("click", (event) => {
      const courseRow = event.target.closest("[data-course-id]");
      const lessonRow = event.target.closest("[data-lesson-id]");
      const accessRow = event.target.closest("[data-access-id]");
      if (event.target.closest("[data-new-course]") || event.target.closest("[data-reset-course]")) { editingCourseId = ""; draw(); }
      else if (event.target.closest("[data-edit-course]") && courseRow) { editingCourseId = courseRow.dataset.courseId; selectedCourseId = editingCourseId; draw(); }
      else if (event.target.closest("[data-del-course]") && courseRow && confirm("Xoa khoa hoc nay va cac bai hoc lien quan?")) {
        courses = courses.filter((c) => c.id !== courseRow.dataset.courseId);
        lessons = lessons.filter((l) => l.courseId !== courseRow.dataset.courseId);
        access = access.map((x) => ({ ...x, courseIds: (x.courseIds || []).filter((id) => id !== courseRow.dataset.courseId) }));
        selectedCourseId = courses[0]?.id || ""; saveAll(); draw(); flash("Da xoa khoa hoc");
      }
      else if (courseRow && !event.target.closest("button")) { selectedCourseId = courseRow.dataset.courseId; draw(); }
      else if (event.target.closest("[data-reset-lesson]")) { editingLessonId = ""; draw(); }
      else if (event.target.closest("[data-edit-lesson]") && lessonRow) { editingLessonId = lessonRow.dataset.lessonId; selectedCourseId = lessons.find((l) => l.id === editingLessonId)?.courseId || selectedCourseId; draw(); }
      else if (event.target.closest("[data-del-lesson]") && lessonRow && confirm("Xoa bai hoc/video nay?")) { lessons = lessons.filter((l) => l.id !== lessonRow.dataset.lessonId); saveAll(); draw(); flash("Da xoa bai hoc"); }
      else if (event.target.closest("[data-new-access]") || event.target.closest("[data-reset-access]")) { editingAccessId = ""; draw(); }
      else if (event.target.closest("[data-edit-access]") && accessRow) { editingAccessId = accessRow.dataset.accessId; draw(); }
      else if (event.target.closest("[data-del-access]") && accessRow && confirm("Xoa quyen hoc vien nay?")) { access = access.filter((x) => x.id !== accessRow.dataset.accessId); saveAll(); draw(); flash("Da xoa quyen hoc"); }
    });

    draw();
    saveAll();
  }

  function learningDashboardSection() {
    const section = document.getElementById("learning");
    if (!section) return;
    const render = () => {
      const courses = normalizeCourses(Store.load("ducpt_courses_v2", courseSeed)).sort(byCourseOrder);
      const lessons = Store.load("ducpt_lessons_v1", lessonSeed);
      const access = Store.load("ducpt_student_access_v1", accessSeed);
      const activeAccess = access.filter((x) => x.status === "active");
      const publishedLessons = lessons.filter((l) => l.status === "published");
      section.innerHTML = `
        <h2 class="section-title">Hoc vien, khoa hoc va video</h2>
        <div class="learning-grid">
          <article class="card metric"><span>Hoc vien dang hoc</span><strong>${activeAccess.length}</strong><small>Tu bang cap quyen</small></article>
          <article class="card metric"><span>Khoa dang mo</span><strong>${courses.filter((c) => c.status === "active").length}</strong><small>${courses.length} tong khoa</small></article>
          <article class="card metric"><span>Video da gan</span><strong>${lessons.filter((l) => l.videoUrl || l.videoFileName).length}</strong><small>${publishedLessons.length} da xuat ban</small></article>
          <article class="card metric"><span>Bai hoc</span><strong>${lessons.length}</strong><small>Sap theo STT</small></article>
        </div>
        <div class="grid2">
          <article class="card"><h2>Tien do theo khoa hoc</h2><div class="cs-table learning-table">
            <div class="cs-row cs-row-head"><span>Khoa hoc</span><span>Hoc vien</span><span>Bai hoc</span><span>Video</span><span>Trang thai</span></div>
            ${courses.map((c) => {
              const courseLessons = lessons.filter((l) => l.courseId === c.id);
              const students = activeAccess.filter((x) => (x.courseIds || []).includes(c.id)).length;
              return `<div class="cs-row"><span>${esc(c.categoryOrder)}.${esc(c.order)} ${esc(c.name)}</span><span>${students}</span><span>${courseLessons.length}</span><span>${courseLessons.filter((l) => l.videoUrl || l.videoFileName).length}</span><span>${esc(c.status === "active" ? "Dang mo" : c.status === "hidden" ? "An" : "Ban nhap")}</span></div>`;
            }).join("")}
          </div></article>
          <article class="card"><h2>Video moi nhat</h2><div class="lesson-list">
            ${lessons.slice().sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)).slice(0, 8).map((l) => `<div class="lesson-card"><b>${esc(l.order)}. ${esc(l.title)}</b><span>${esc(courses.find((c) => c.id === l.courseId)?.name || "Chua gan khoa")} - ${esc(lessonStatusText(l.status))}</span><small>${esc(l.videoFileName || l.videoUrl || "Chua gan video")}</small></div>`).join("") || `<div class="cs-empty">Chua co video/bai hoc.</div>`}
          </div></article>
        </div>`;
    };
    window.addEventListener("ducpt:learning-updated", render);
    render();
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

    learningDashboardSection();
    courseStudioSection();

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
