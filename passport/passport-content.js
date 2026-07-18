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
    if (!document.getElementById("courseAdmin")?.dataset.coursePackager) courseStudioSection();

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

/* YouTube course manager - runs last and replaces the older local upload course panel. */
(() => {
  "use strict";

  const view = document.getElementById("courseAdmin");
  if (!view) return;
  view.dataset.coursePackager = "v2";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const seed = {
    course: {
      title: "Doanh nghiep mot nguoi",
      price: "Lien he",
      contact: "Zalo 0963249467",
      goal: "Khoa hoc giup hoc vien dong goi nang luc ca nhan thanh offer ro rang, tao noi dung keo khach, ban san pham dich vu so va van hanh gon bang AI.",
      cover: "/assets/hvd-horizontal.svg"
    },
    lessons: []
  };

  const style = document.createElement("style");
  style.textContent = `
    .ytc-grid{display:grid;grid-template-columns:340px minmax(0,1fr);gap:14px}
    .ytc-panel{padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--paper);box-shadow:0 8px 28px rgba(16,24,40,.04)}
    .ytc-form{display:grid;gap:10px}.ytc-form label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:900}
    .ytc-form input,.ytc-form textarea,.ytc-form select{padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit;width:100%;min-width:0}
    .ytc-form textarea{min-height:90px;resize:vertical}.ytc-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .ytc-import{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:12px 0}
    .ytc-lessons{display:grid;gap:10px}.ytc-lesson{display:grid;grid-template-columns:70px minmax(0,1fr) 120px;gap:12px;align-items:start;padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}
    .ytc-lesson.is-editing{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.08)}.ytc-lesson img{width:70px;aspect-ratio:16/9;border-radius:8px;object-fit:cover;background:#e2e8f0}
    .ytc-lesson b{display:block;margin-bottom:4px}.ytc-lesson span,.ytc-note{display:block;color:var(--muted);font-size:11px;line-height:1.5}.ytc-status{display:inline-flex;padding:4px 8px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:900}
    .ytc-guide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.ytc-guide div{padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}.ytc-guide b{display:block;margin-bottom:4px}
    @media(max-width:900px){.ytc-grid{grid-template-columns:1fr}.ytc-import,.ytc-lesson{grid-template-columns:1fr}.ytc-lesson img{width:100%}.ytc-guide{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  let data = JSON.parse(JSON.stringify(seed));
  let editingId = "";

  const emptyLesson = () => ({
    id: "",
    lessonNo: data.lessons.length + 1,
    sort: data.lessons.length + 1,
    youtubeUrl: "",
    youtubeId: "",
    title: "",
    description: "",
    thumbnail: "",
    duration: "",
    status: "draft"
  });

  async function load() {
    try {
      const res = await fetch("/api/passport/course-videos", { cache: "no-store" });
      const payload = await res.json();
      data = payload.ok ? payload.data : seed;
    } catch {
      data = JSON.parse(JSON.stringify(seed));
    }
    draw();
  }

  function draw() {
    const lesson = data.lessons.find((item) => item.id === editingId) || emptyLesson();
    const publishedCount = data.lessons.filter((item) => item.status === "published").length;
    view.innerHTML = `
      <div class="pc-tools">
        <div><h2 style="margin:0 0 4px">Quan ly khoa hoc YouTube</h2><div class="pc-hint">Dan link YouTube, dong bo tieu de/thumbnail, sua mo ta va xuat ban len trang /khoa-hoc/. Du lieu luu vao server JSON, khong day video len GitHub.</div></div>
        <div class="pc-right"><span class="pc-saved" data-saved></span><a class="btn" href="/khoa-hoc/" target="_blank" rel="noreferrer">Xem trang hoc</a><button class="btn primary" data-save-all type="button">Luu tat ca</button></div>
      </div>
      <div class="cs-metrics">
        <article class="card metric"><span>Tong bai</span><strong>${data.lessons.length}</strong><small>${publishedCount} dang hien</small></article>
        <article class="card metric"><span>Nguon video</span><strong>YouTube</strong><small>Unlisted de giam chi phi</small></article>
        <article class="card metric"><span>Mo ta</span><strong>Tu sua</strong><small>oEmbed khong tra mo ta day du</small></article>
        <article class="card metric"><span>Luu tru</span><strong>JSON</strong><small>passport/course-videos.json</small></article>
      </div>
      <div class="ytc-grid" style="margin-top:14px">
        <article class="ytc-panel ytc-form">
          <h3 style="margin:0">Thong tin khoa hoc</h3>
          <label>Ten khoa hoc<input data-course-field="title" value="${esc(data.course.title)}"></label>
          <label>Gia / CTA<input data-course-field="price" value="${esc(data.course.price)}"></label>
          <label>Lien he<input data-course-field="contact" value="${esc(data.course.contact)}"></label>
          <label>Link anh bia<input data-course-field="cover" value="${esc(data.course.cover)}"></label>
          <label>Muc tieu khoa hoc<textarea data-course-field="goal">${esc(data.course.goal)}</textarea></label>
        </article>
        <article class="ytc-panel">
          <h3 style="margin:0">Them video YouTube</h3>
          <div class="ytc-import"><input class="searchbox" data-youtube-url placeholder="Dan link YouTube vao day"><button class="btn primary" data-import-youtube type="button">Dong bo</button></div>
          <form class="ytc-form" data-lesson-form>
            <input type="hidden" name="id" value="${esc(lesson.id)}">
            <label>Link YouTube<input name="youtubeUrl" value="${esc(lesson.youtubeUrl)}" placeholder="https://www.youtube.com/watch?v=..."></label>
            <label>So buoi<input name="lessonNo" type="number" min="1" value="${esc(lesson.lessonNo)}"></label>
            <label>Thu tu sap xep<input name="sort" type="number" min="1" value="${esc(lesson.sort)}"></label>
            <label>Tieu de<input name="title" required value="${esc(lesson.title)}"></label>
            <label>Thoi luong hien thi<input name="duration" value="${esc(lesson.duration)}" placeholder="Vi du: 18:35 hoac de trong"></label>
            <label>Trang thai<select name="status"><option value="draft"${lesson.status==="draft"?" selected":""}>Draft - chua hien</option><option value="published"${lesson.status==="published"?" selected":""}>Published - hien cho hoc vien</option><option value="hidden"${lesson.status==="hidden"?" selected":""}>Hidden - tam an</option></select></label>
            <label>Thumbnail<input name="thumbnail" value="${esc(lesson.thumbnail)}"></label>
            <label>Mo ta bai hoc<textarea name="description" placeholder="Nhap outline, muc tieu, bai tap, link tai lieu...">${esc(lesson.description)}</textarea></label>
            <div class="ytc-actions"><button class="btn primary" type="submit">${lesson.id ? "Luu bai hoc" : "Them bai hoc"}</button><button class="btn" data-new-lesson type="button">Lam moi</button></div>
          </form>
        </article>
      </div>
      <article class="ytc-panel" style="margin-top:14px">
        <div class="pc-tools"><div><h3 style="margin:0">Danh sach bai hoc</h3><div class="pc-hint">Bai published se hien tren website hoc vien. Draft/hidden chi nam trong Passport.</div></div></div>
        <div class="ytc-lessons">${lessonListHtml()}</div>
      </article>
      <article class="ytc-panel" style="margin-top:14px">
        <h3 style="margin:0">Can gi khi them mot video khoa hoc?</h3>
        <div class="ytc-guide">
          <div><b>1. Link YouTube</b><span class="ytc-note">Nen de unlisted. Private se khong xem duoc khi nhung tren website.</span></div>
          <div><b>2. Tieu de</b><span class="ytc-note">Dong bo tu YouTube duoc, nhung van sua lai cho dung bai hoc.</span></div>
          <div><b>3. Mo ta / outline</b><span class="ytc-note">Nhap muc tieu, noi dung chinh, bai tap va link tai lieu kem theo.</span></div>
          <div><b>4. Trang thai</b><span class="ytc-note">Draft de soan, published de hoc vien hoc, hidden de tam an.</span></div>
        </div>
      </article>`;
    bind();
  }

  function lessonListHtml() {
    if (!data.lessons.length) return `<div class="cs-empty">Chua co bai hoc. Dan link YouTube va bam Dong bo de tao bai dau tien.</div>`;
    return data.lessons
      .slice()
      .sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999))
      .map((item) => `<div class="ytc-lesson ${item.id === editingId ? "is-editing" : ""}" data-lesson-id="${esc(item.id)}">
        <img src="${esc(item.thumbnail || (item.youtubeId ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` : ""))}" alt="">
        <div><b>${esc(item.lessonNo)}. ${esc(item.title)}</b><span>${esc(item.youtubeUrl || "Chua co link")}</span><span>${esc(item.description || "Chua co mo ta")}</span></div>
        <div class="ytc-actions"><span class="ytc-status">${esc(item.status)}</span><button class="btn" data-edit-lesson type="button">Sua</button><button class="btn delete" data-delete-lesson type="button">Xoa</button></div>
      </div>`).join("");
  }

  function bind() {
    view.querySelector("[data-save-all]").addEventListener("click", saveAll);
    view.querySelector("[data-import-youtube]").addEventListener("click", importYoutube);
    view.querySelector("[data-new-lesson]").addEventListener("click", () => { editingId = ""; draw(); });
    view.querySelector("[data-lesson-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      collectCourse();
      const rec = Object.fromEntries(new FormData(event.currentTarget).entries());
      const youtubeId = youtubeIdFromUrl(rec.youtubeUrl);
      const id = rec.id || `lesson-${Date.now()}`;
      const old = data.lessons.find((item) => item.id === id) || {};
      const next = {
        ...old,
        id,
        lessonNo: Number(rec.lessonNo) || data.lessons.length + 1,
        sort: Number(rec.sort) || Number(rec.lessonNo) || data.lessons.length + 1,
        youtubeUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : rec.youtubeUrl.trim(),
        youtubeId,
        title: rec.title.trim(),
        duration: rec.duration.trim(),
        status: rec.status,
        thumbnail: rec.thumbnail.trim() || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : ""),
        description: rec.description.trim(),
        updatedAt: new Date().toISOString()
      };
      const index = data.lessons.findIndex((item) => item.id === id);
      if (index >= 0) data.lessons[index] = next; else data.lessons.push(next);
      editingId = next.id;
      saveAll();
    });
    view.querySelectorAll("[data-edit-lesson]").forEach((button) => button.addEventListener("click", (event) => {
      editingId = event.target.closest("[data-lesson-id]").dataset.lessonId;
      draw();
    }));
    view.querySelectorAll("[data-delete-lesson]").forEach((button) => button.addEventListener("click", (event) => {
      if (!confirm("Xoa bai hoc nay?")) return;
      const id = event.target.closest("[data-lesson-id]").dataset.lessonId;
      data.lessons = data.lessons.filter((item) => item.id !== id);
      if (editingId === id) editingId = "";
      saveAll();
    }));
  }

  function collectCourse() {
    view.querySelectorAll("[data-course-field]").forEach((el) => {
      data.course[el.dataset.courseField] = el.value.trim();
    });
    data.course.updatedAt = new Date().toISOString();
  }

  async function importYoutube() {
    const input = view.querySelector("[data-youtube-url]");
    const youtubeUrl = input.value.trim();
    if (!youtubeUrl) return flash("Hay dan link YouTube truoc");
    flash("Dang dong bo YouTube...");
    try {
      const res = await fetch("/api/passport/course-videos/import-youtube", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ youtubeUrl })
      });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || "Khong dong bo duoc");
      const item = payload.data;
      const existing = data.lessons.find((lesson) => lesson.youtubeId === item.youtubeId);
      const next = {
        ...(existing || {}),
        ...item,
        id: existing?.id || item.id,
        lessonNo: existing?.lessonNo || data.lessons.length + 1,
        sort: existing?.sort || data.lessons.length + 1,
        duration: existing?.duration || "",
        description: existing?.description || "",
        status: existing?.status || "draft",
        updatedAt: new Date().toISOString()
      };
      if (existing) data.lessons[data.lessons.indexOf(existing)] = next; else data.lessons.push(next);
      editingId = next.id;
      input.value = "";
      draw();
      flash("Da dong bo tieu de va thumbnail");
    } catch (error) {
      flash(error.message || "Loi dong bo YouTube");
    }
  }

  async function saveAll() {
    collectCourse();
    data.lessons = data.lessons.sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999));
    try {
      const res = await fetch("/api/passport/course-videos/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || "Khong luu duoc");
      data = payload.data;
      draw();
      flash("Da luu len server");
    } catch (error) {
      flash(error.message || "Chua luu duoc");
    }
  }

  function youtubeIdFromUrl(value) {
    const text = String(value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
    try {
      const url = new URL(text);
      if (url.hostname.includes("youtu.be")) return cleanId(url.pathname.slice(1));
      if (url.pathname.startsWith("/shorts/")) return cleanId(url.pathname.split("/")[2]);
      if (url.pathname.startsWith("/embed/")) return cleanId(url.pathname.split("/")[2]);
      return cleanId(url.searchParams.get("v"));
    } catch {
      return "";
    }
  }

  function cleanId(value) {
    const match = String(value || "").match(/[A-Za-z0-9_-]{11}/);
    return match ? match[0] : "";
  }

  function flash(message) {
    const el = view.querySelector("[data-saved]");
    if (!el) return;
    el.textContent = message;
    setTimeout(() => { el.textContent = ""; }, 3500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else setTimeout(load, 10);
})();

/* One-person business course staging area */
(() => {
  "use strict";

  const view = document.getElementById("courseAdmin");
  if (!view) return;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const key = "ducpt_one_person_business_course_v2";
  const seed = {
    title: "Doanh nghiệp một người",
    price: "1.990.000đ",
    contact: "Nhập SĐT/Zalo của bạn",
    site: "",
    goal: "Giúp học viên đóng gói năng lực cá nhân thành offer rõ ràng, xây hệ nội dung kéo khách, bán khóa/dịch vụ số và vận hành gọn bằng công cụ AI.",
    cover: "/assets/hvd-horizontal.svg",
    lessons: [
      ["Tư liệu Pheme Studio - Voice to Text", "Video/tư liệu từ E:\\Videos Pheme Studio. Dùng để xem lại, bóc tách nội dung và chuyển thành outline bài học cho khóa Doanh nghiệp một người.", "Sẵn sàng"],
      ["Đóng gói offer và định giá", "Thiết kế gói học/tư vấn, bonus, bảo hành, khung giá và ưu đãi mở bán.", "Bản nháp"],
      ["Hệ thống nội dung kéo khách", "Lịch nội dung, hook, case study, lead magnet và kênh phân phối.", "Bản nháp"],
      ["Trang bán hàng và quy trình liên hệ", "Landing page, CTA, form liên hệ, script tư vấn và follow-up.", "Bản nháp"],
      ["Vận hành một mình bằng AI", "Quản lý file, lịch nhắc, khách hàng, báo cáo và tự động hóa công việc lặp lại.", "Bản nháp"]
    ].map((x, i) => ({ id: `l${i + 1}`, title: x[0], detail: x[1], status: x[2] }))
  };

  const style = document.createElement("style");
  style.textContent = `
    .opb-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:18px;margin-bottom:16px}
    .opb-panel{padding:18px;border:1px solid var(--line);border-radius:17px;background:var(--paper);box-shadow:0 8px 28px rgba(16,24,40,.04)}
    .opb-hero h2{margin:0 0 10px;font-size:30px;letter-spacing:-.04em}.opb-hero p{color:var(--muted);line-height:1.65}
    .opb-cover{position:relative;overflow:hidden;min-height:260px;border-radius:16px;background:#eef2ff;display:grid;place-items:center}.opb-cover img{width:100%;height:100%;min-height:260px;object-fit:cover}.opb-cover input{position:absolute;inset:auto 14px 14px auto;width:auto;max-width:220px;background:#fff}
    .opb-grid{display:grid;grid-template-columns:340px minmax(0,1fr);gap:14px}.opb-form{display:grid;gap:10px}.opb-form label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:900}.opb-form input,.opb-form textarea,.opb-form select{padding:10px 12px;border:1px solid var(--line);border-radius:11px;background:#fff;font:inherit;width:100%}.opb-form textarea{min-height:96px}
    .opb-price{display:inline-flex;margin:8px 0 12px;padding:8px 12px;border-radius:999px;color:#065f46;background:#ecfdf5;font-weight:900}
    .opb-lessons,.opb-assets{display:grid;gap:10px}.opb-lesson{display:grid;grid-template-columns:34px minmax(0,1fr) 135px;gap:10px;align-items:start;padding:12px;border:1px solid var(--line);border-radius:14px;background:#fff}.opb-num{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#2563eb,#7c3aed);font-weight:900}.opb-lesson h3{margin:0 0 4px;font-size:14px}.opb-lesson p{margin:0;color:var(--muted);font-size:12px}
    .opb-upload{margin-top:14px}.opb-upload-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px}.opb-assets{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}.opb-asset{overflow:hidden;border:1px solid var(--line);border-radius:14px;background:#fff}.opb-preview{height:135px;display:grid;place-items:center;background:#f1f5f9;color:#2563eb;font-weight:900}.opb-preview img,.opb-preview video{width:100%;height:100%;object-fit:cover}.opb-asset b{display:block;padding:10px 10px 2px;overflow-wrap:anywhere}.opb-asset span{display:block;padding:0 10px 10px;color:var(--muted);font-size:11px}
    .opb-derived{display:grid;gap:10px;margin-top:12px}.opb-derived-row{display:grid;grid-template-columns:88px minmax(0,1fr) 120px;gap:10px;align-items:center;padding:11px;border:1px solid var(--line);border-radius:14px;background:#fff}.opb-derived-row strong{display:block}.opb-derived-row span{color:var(--muted);font-size:11px}.opb-derived-row a{text-align:center}
    .opb-duration{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:900}.opb-guide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.opb-guide-item{padding:12px;border:1px solid var(--line);border-radius:14px;background:#fff}.opb-guide-item b{display:block;margin-bottom:4px}.opb-guide-item span{display:block;color:var(--muted);font-size:11px;line-height:1.5}
    @media(max-width:900px){.opb-hero,.opb-grid{grid-template-columns:1fr}.opb-lesson{grid-template-columns:34px minmax(0,1fr)}.opb-lesson select{grid-column:1/-1}}
  `;
  document.head.appendChild(style);

  let data = load();
  let assets = [];

  function load() {
    try { return { ...seed, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return { ...seed }; }
  }

  function save() {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function draw() {
    view.innerHTML = `
      <div class="opb-hero">
        <div class="opb-panel">
          <p class="pc-hint">Mục quản lý khóa học</p>
          <h2>${esc(data.title)}</h2>
          <span class="opb-price">${esc(data.price)}</span>
          <p>${esc(data.goal)}</p>
          <div class="pc-right"><button class="btn primary" data-opb-save type="button">Lưu khóa học</button><a class="btn" href="${esc(data.site || "#")}" target="_blank" rel="noreferrer">Website chính</a></div>
        </div>
        <div class="opb-cover"><img id="opbCover" src="${esc(data.cover)}" alt="Ảnh bìa khóa học"><input id="opbCoverInput" type="file" accept="image/*"></div>
      </div>
      <div class="opb-grid">
        <div class="opb-panel opb-form">
          <label>Tên khóa học<input data-opb-field="title" value="${esc(data.title)}"></label>
          <label>Giá khóa học<input data-opb-field="price" value="${esc(data.price)}"></label>
          <label>SĐT/Zalo liên hệ<input data-opb-field="contact" value="${esc(data.contact)}"></label>
          <label>Link website chính<input data-opb-field="site" value="${esc(data.site)}" placeholder="https://..."></label>
          <label>Mục tiêu khóa học<textarea data-opb-field="goal">${esc(data.goal)}</textarea></label>
        </div>
        <div class="opb-panel">
          <div class="pc-tools"><div><h2 style="margin:0">Lộ trình học</h2><div class="pc-hint">Sửa trực tiếp từng bài, đổi trạng thái rồi bấm Lưu khóa học.</div></div><button class="btn" data-opb-add type="button">+ Thêm bài</button></div>
          <div class="opb-lessons">${data.lessons.map((lesson, i) => lessonHtml(lesson, i)).join("")}</div>
        </div>
      </div>
      <div class="opb-panel opb-upload">
        <div class="opb-upload-head"><div><h2 style="margin:0">Danh sách buổi đã đưa lên website</h2><div class="pc-hint">Tự phân tích từ tên file trong passport/uploads, ưu tiên các file bắt đầu bằng buoi-01, buoi-02...</div></div><button class="btn" data-opb-refresh type="button">Làm mới</button></div>
        <div class="opb-derived" id="opbDerived"></div>
      </div>
      <div class="opb-panel opb-upload">
        <div class="opb-upload-head"><div><h2 style="margin:0">Tư liệu và video</h2><div class="pc-hint">File được upload vào thư mục passport/uploads để xem trước trên trang local.</div></div><input id="opbAssetInput" type="file" multiple accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip"></div>
        <div class="opb-assets" id="opbAssets"></div>
      </div>
      <div class="opb-panel opb-upload">
        <div class="pc-tools"><div><h2 style="margin:0">Xuất dữ liệu</h2><div class="pc-hint">Dùng JSON này để đưa thông tin khóa học lên website chính.</div></div><button class="btn" data-opb-export type="button">Xuất JSON</button></div>
        <textarea id="opbExport" style="width:100%;min-height:150px;border:1px solid var(--line);border-radius:12px;padding:12px"></textarea>
      </div>
      <div class="opb-panel opb-upload">
        <div class="opb-upload-head"><div><h2 style="margin:0">Can gi khi them mot video khoa hoc?</h2><div class="pc-hint">Checklist nay giup ban chuan bi du thong tin truoc khi dua video len website chinh.</div></div></div>
        <div class="opb-guide">
          <div class="opb-guide-item"><b>1. So buoi / thu tu</b><span>Dat ten file dang buoi-01-ten-bai.webm hoac buoi-02-ten-bai.mp4 de he thong tu sap xep.</span></div>
          <div class="opb-guide-item"><b>2. Tieu de bai hoc</b><span>Ten ngan, ro ket qua hoc vien nhan duoc sau khi xem video.</span></div>
          <div class="opb-guide-item"><b>3. Muc tieu video</b><span>Video nay giup hoc vien lam duoc gi: hieu khai niem, lam bai tap, tao offer, dung trang ban...</span></div>
          <div class="opb-guide-item"><b>4. Mo ta / outline</b><span>3-7 y chinh trong video de tao mo ta, muc luc va tai lieu di kem.</span></div>
          <div class="opb-guide-item"><b>5. Tai lieu di kem</b><span>PDF, prompt, template, checklist, file bai tap, link cong cu hoac vi du thuc hanh.</span></div>
          <div class="opb-guide-item"><b>6. Trang thai xuat ban</b><span>Ban nhap, can chinh, san sang, da public. De biet video nao con thieu.</span></div>
          <div class="opb-guide-item"><b>7. Anh thumbnail</b><span>Anh dai dien 16:9 giup danh sach khoa hoc de nhin va ban hang tot hon.</span></div>
          <div class="opb-guide-item"><b>8. Gia / CTA lien he</b><span>Neu video thuoc khoa tra phi, can gia khoa hoc va nut lien he/Zalo ro rang.</span></div>
        </div>
      </div>`;
    bind();
    loadAssets();
  }

  function lessonHtml(lesson, i) {
    return `<div class="opb-lesson" data-index="${i}">
      <div class="opb-num">${i + 1}</div>
      <div><h3 contenteditable="true" data-lesson-field="title">${esc(lesson.title)}</h3><p contenteditable="true" data-lesson-field="detail">${esc(lesson.detail)}</p></div>
      <select data-lesson-field="status">${["Sẵn sàng", "Cần video", "Cần tư liệu", "Bản nháp"].map((s) => `<option${s === lesson.status ? " selected" : ""}>${s}</option>`).join("")}</select>
    </div>`;
  }

  function bind() {
    view.querySelector("[data-opb-save]").addEventListener("click", collectAndSave);
    view.querySelector("[data-opb-add]").addEventListener("click", () => {
      data.lessons.push({ id: "l" + Date.now(), title: "Bài học mới", detail: "Nhập nội dung bài học.", status: "Bản nháp" });
      save(); draw();
    });
    view.querySelector("[data-opb-export]").addEventListener("click", () => {
      collect();
      document.getElementById("opbExport").value = JSON.stringify({ course: data, derivedLessons: deriveLessonsFromAssets(), assets: assets.map(withDuration) }, null, 2);
    });
    view.querySelector("[data-opb-refresh]").addEventListener("click", loadAssets);
    document.getElementById("opbCoverInput").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      data.cover = await toDataUrl(file);
      save(); draw();
    });
    document.getElementById("opbAssetInput").addEventListener("change", uploadAssets);
  }

  function collect() {
    view.querySelectorAll("[data-opb-field]").forEach((el) => data[el.dataset.opbField] = el.value.trim());
    view.querySelectorAll(".opb-lesson").forEach((row) => {
      const i = Number(row.dataset.index);
      row.querySelectorAll("[data-lesson-field]").forEach((el) => data.lessons[i][el.dataset.lessonField] = (el.value || el.textContent || "").trim());
    });
  }

  function collectAndSave() {
    collect(); save(); draw();
  }

  async function uploadAssets(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const box = document.getElementById("opbAssets");
    box.innerHTML = `<div class="opb-asset"><div class="opb-preview">Đang tải</div><b>Đang upload file</b><span>Vui lòng chờ...</span></div>`;
    for (const file of files) {
      const res = await fetch(`/api/passport/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
      const payload = await res.json();
      if (!payload.ok) alert(payload.error || "Upload lỗi");
    }
    e.target.value = "";
    loadAssets();
  }

  async function loadAssets() {
    try {
      const res = await fetch("/api/passport/assets");
      const payload = await res.json();
      assets = payload.ok ? payload.data : [];
    } catch {
      assets = [];
    }
    renderAssetsWithDuration();
    renderDerivedLessonsWithDuration();
  }

  function renderAssetsWithDuration() {
    const box = document.getElementById("opbAssets");
    if (!box) return;
    if (!assets.length) {
      box.innerHTML = `<div class="opb-asset"><div class="opb-preview">Chua co file</div><b>Tai video, anh hoac tai lieu len</b><span>Danh sach se hien o day.</span></div>`;
      return;
    }
    box.innerHTML = assets.map((asset, index) => `<div class="opb-asset"><div class="opb-preview">${previewWithDuration(asset, index)}</div><b>${esc(asset.name)}</b><span>${format(asset.size)} - ${esc(asset.type)}</span><span class="opb-duration" data-duration-text="${index}">${durationText(asset.url)}</span></div>`).join("");
    syncVideoDurations();
  }

  function renderDerivedLessonsWithDuration() {
    const box = document.getElementById("opbDerived");
    if (!box) return;
    const lessons = deriveLessonsFromAssets().map((lesson) => ({ ...lesson, duration: durationValue(lesson.url) }));
    if (!lessons.length) {
      box.innerHTML = `<div class="opb-derived-row"><strong>Chua co</strong><span>Dat ten file theo dang buoi-01-ten-bai.mp4 de he thong tu phan tich.</span><span></span></div>`;
      return;
    }
    box.innerHTML = lessons.map((lesson) => `
      <div class="opb-derived-row">
        <strong>Buoi ${lesson.number}</strong>
        <div><strong>${esc(lesson.title)}</strong><span>${esc(lesson.fileName)} - ${format(lesson.size)}</span><span class="opb-duration">${lesson.duration ? formatDuration(lesson.duration) : "Thoi luong: dong bo theo file goc"}</span></div>
        <a class="btn" href="${esc(lesson.url)}" target="_blank" rel="noreferrer">Xem</a>
      </div>
    `).join("");
  }

  function renderAssets() {
    const box = document.getElementById("opbAssets");
    if (!box) return;
    if (!assets.length) {
      box.innerHTML = `<div class="opb-asset"><div class="opb-preview">Chưa có file</div><b>Tải video, ảnh hoặc tài liệu lên</b><span>Danh sách sẽ hiện ở đây.</span></div>`;
      return;
    }
    box.innerHTML = assets.map((a) => `<div class="opb-asset"><div class="opb-preview">${preview(a)}</div><b>${esc(a.name)}</b><span>${format(a.size)} · ${esc(a.type)}</span></div>`).join("");
  }

  function deriveLessonsFromAssets() {
    return assets
      .map((asset) => {
        const match = String(asset.fileName || asset.name || "").match(/buoi[-_ ]?(\d{1,3})[-_ ]?(.*)\.(mp4|webm|mov|mkv)$/i);
        if (!match) return null;
        return {
          number: Number(match[1]),
          title: titleFromFile(match[2]) || asset.name,
          fileName: asset.fileName,
          url: asset.url,
          type: asset.type,
          size: asset.size
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.number - b.number);
  }

  function renderDerivedLessons() {
    const box = document.getElementById("opbDerived");
    if (!box) return;
    const lessons = deriveLessonsFromAssets();
    if (!lessons.length) {
      box.innerHTML = `<div class="opb-derived-row"><strong>Chưa có</strong><span>Đặt tên file theo dạng buoi-01-ten-bai.mp4 để hệ thống tự phân tích.</span><span></span></div>`;
      return;
    }
    box.innerHTML = lessons.map((lesson) => `
      <div class="opb-derived-row">
        <strong>Buổi ${lesson.number}</strong>
        <div><strong>${esc(lesson.title)}</strong><span>${esc(lesson.fileName)} · ${format(lesson.size)}</span></div>
        <a class="btn" href="${esc(lesson.url)}" target="_blank" rel="noreferrer">Xem</a>
      </div>
    `).join("");
  }

  function titleFromFile(value) {
    return String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function previewWithDuration(asset, index) {
    if ((asset.type || "").startsWith("image/")) return `<img src="${esc(asset.url)}" alt="${esc(asset.name)}">`;
    if ((asset.type || "").startsWith("video/")) return `<video src="${esc(asset.url)}" controls preload="metadata" data-video-index="${index}"></video>`;
    return "FILE";
  }

  function syncVideoDurations() {
    document.querySelectorAll("[data-video-index]").forEach((video) => {
      const index = Number(video.dataset.videoIndex);
      const asset = assets[index];
      if (!asset) return;
      const update = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        setDuration(asset.url, video.duration);
        const label = document.querySelector(`[data-duration-text="${index}"]`);
        if (label) label.textContent = formatDuration(video.duration);
        renderDerivedLessonsWithDuration();
      };
      video.addEventListener("loadedmetadata", update, { once: true });
      if (Number.isFinite(video.duration) && video.duration > 0) update();
    });
  }

  function durationValue(url) {
    try {
      const map = JSON.parse(sessionStorage.getItem("opb_video_durations_v1") || "{}");
      return Number(map[url]) || 0;
    } catch {
      return 0;
    }
  }

  function setDuration(url, seconds) {
    try {
      const map = JSON.parse(sessionStorage.getItem("opb_video_durations_v1") || "{}");
      map[url] = seconds;
      sessionStorage.setItem("opb_video_durations_v1", JSON.stringify(map));
    } catch {}
  }

  function durationText(url) {
    const seconds = durationValue(url);
    return seconds ? formatDuration(seconds) : "Thoi luong: dong bo theo file goc";
  }

  function withDuration(asset) {
    return { ...asset, duration: durationValue(asset.url), durationLabel: durationText(asset.url) };
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Math.round(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  }

  function preview(a) {
    if ((a.type || "").startsWith("image/")) return `<img src="${esc(a.url)}" alt="${esc(a.name)}">`;
    if ((a.type || "").startsWith("video/")) return `<video src="${esc(a.url)}" controls preload="metadata"></video>`;
    return "FILE";
  }

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function format(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, idx)).toFixed(idx ? 1 : 0)} ${units[idx]}`;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", draw);
  else setTimeout(draw, 0);
})();

/* Final course manager override: YouTube links + server JSON persistence. */
(() => {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const seed = { course: { title: "Doanh nghiệp một người", price: "Liên hệ", contact: "Zalo 0963249467", goal: "Khóa học giúp học viên đóng gói năng lực cá nhân thành offer rõ ràng, tạo nội dung kéo khách, bán sản phẩm dịch vụ số và vận hành gọn bằng AI.", cover: "/assets/hvd-horizontal.svg" }, lessons: [] };
  const githubDefaults = { owner: "Ducpt88", repo: "dg-media-office", branch: "main", path: "passport/course-videos.json" };
  const I = (p) => `<svg class="ytc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICO = {
    sync: I('<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/>'),
    save: I('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>'),
    eye: I('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
    edit: I('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    trash: I('<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>'),
    cloud: I('<path d="M17.5 19a4.5 4.5 0 0 0 0-9 7 7 0 0 0-13.6 2A4.5 4.5 0 0 0 6.5 19z"/>'),
    list: I('<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'),
    help: I('<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'),
  };
  let data = JSON.parse(JSON.stringify(seed));
  let legacyAssets = [];
  let editingId = "";
  let viewMode = "admin";

  function mountStyle() {
    if (document.getElementById("ytc-final-style")) return;
    const style = document.createElement("style");
    style.id = "ytc-final-style";
    style.textContent = ".ytc-grid{display:grid;grid-template-columns:340px minmax(0,1fr);gap:14px}.ytc-panel{padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--paper);box-shadow:0 8px 28px rgba(16,24,40,.04)}.ytc-form{display:grid;gap:10px}.ytc-form label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:900}.ytc-form input,.ytc-form textarea,.ytc-form select{padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit;width:100%;min-width:0}.ytc-form textarea{min-height:90px;resize:vertical}.ytc-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.ytc-import{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:12px 0}.ytc-view-switch{display:flex;gap:6px;padding:5px;border:1px solid var(--line);border-radius:12px;background:#f8fafc}.ytc-view-switch button{border:0;border-radius:9px;background:transparent;padding:8px 10px;color:var(--muted);font-weight:900;cursor:pointer}.ytc-view-switch button.is-active{background:#fff;color:#1d4ed8;box-shadow:0 1px 6px rgba(16,24,40,.08)}.ytc-lessons{display:grid;gap:10px}.ytc-lesson{display:grid;grid-template-columns:70px minmax(0,1fr) 120px;gap:12px;align-items:start;padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}.ytc-lesson.is-editing{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.08)}.ytc-lesson img{width:70px;aspect-ratio:16/9;border-radius:8px;object-fit:cover;background:#e2e8f0}.ytc-lesson b{display:block;margin-bottom:4px}.ytc-lesson span,.ytc-note{display:block;color:var(--muted);font-size:11px;line-height:1.5}.ytc-status{display:inline-flex;padding:4px 8px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:900}.ytc-preview-list{display:grid;gap:12px}.ytc-preview-card{display:grid;grid-template-columns:150px minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:14px;background:#fff}.ytc-preview-card img{width:150px;aspect-ratio:16/9;border-radius:10px;object-fit:cover;background:#e2e8f0}.ytc-preview-card p{margin:5px 0;color:var(--muted);font-size:12px;line-height:1.5}.ytc-asset-list{display:grid;gap:10px}.ytc-asset{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}.ytc-asset b{display:block;overflow-wrap:anywhere}.ytc-asset small{display:block;color:var(--muted);margin-top:4px}.ytc-guide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.ytc-guide div{padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}.ytc-guide b{display:block;margin-bottom:4px}@media(max-width:900px){.ytc-grid{grid-template-columns:1fr}.ytc-import,.ytc-lesson,.ytc-preview-card,.ytc-asset{grid-template-columns:1fr}.ytc-lesson img,.ytc-preview-card img{width:100%}.ytc-guide{grid-template-columns:1fr}}.ytc-steps{display:flex;gap:10px;align-items:stretch;flex-wrap:wrap;margin:14px 0 0;padding:14px 16px;border:1px solid #dbe7ff;border-radius:14px;background:linear-gradient(90deg,#f4f8ff,#faf7ff)}.ytc-step{display:flex;gap:10px;align-items:center;flex:1;min-width:180px}.ytc-step i{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-style:normal;font-weight:900;flex:none;box-shadow:0 6px 14px rgba(37,99,235,.3)}.ytc-step b{display:block;font-size:12.5px}.ytc-step span{display:block;color:var(--muted);font-size:11px}.ytc-steps>em{align-self:center;color:#93a6c9;font-style:normal;font-weight:900}.ytc-collapse{margin-top:14px;border:1px solid var(--line);border-radius:14px;background:var(--paper);overflow:hidden}.ytc-collapse>summary{display:flex;align-items:center;gap:8px;padding:14px 18px;cursor:pointer;font-weight:800;color:var(--ink);list-style:none}.ytc-collapse>summary::-webkit-details-marker{display:none}.ytc-collapse>summary:after{content:'▾';margin-left:auto;color:var(--muted);transition:.2s}.ytc-collapse[open]>summary:after{transform:rotate(180deg)}.ytc-collapse>.ytc-panel{border:0;border-top:1px solid var(--line);border-radius:0;box-shadow:none}.ytc-ic{width:15px;height:15px;vertical-align:-2.5px;margin-right:5px}.ytc-status.st-published{background:#ecfdf5;color:#047857}.ytc-status.st-hidden{background:#fff7ed;color:#c2410c}.ytc-status.st-draft{background:#f1f5f9;color:#475569}"
      + /* Bố cục giống hệt trang ngoài /khoa-hoc/#hoc-ngay: player ở giữa, cây chương bên phải */
      ".ca-layout{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:14px;align-items:start;margin-top:14px}"
      + ".ca-player{padding:0;overflow:hidden}.ca-frame{aspect-ratio:16/9;background:#0b1220;display:grid;place-items:center;color:#93a6c9;font-size:13px;text-align:center;padding:16px}.ca-frame iframe,.ca-frame video{width:100%;height:100%;border:0;display:block;background:#0b1220}"
      + ".ca-body{padding:16px 18px}.ca-eyebrow{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid #dbeafe;border-radius:999px;background:#eff6ff;color:#2563eb;font-size:10.5px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}"
      + ".ca-title{margin:10px 0 4px;font-size:19px;line-height:1.3}.ca-sub{margin:0;color:var(--muted);font-size:12.5px;line-height:1.55}"
      + ".ca-form{margin-top:14px;display:grid;gap:10px}.ca-form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ca-form label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:900}.ca-form input,.ca-form select,.ca-form textarea{padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:#fff;font:inherit;width:100%;min-width:0}.ca-form textarea{min-height:80px;resize:vertical}"
      + ".ca-curri{position:sticky;top:82px;max-height:calc(100vh - 112px);display:flex;flex-direction:column;overflow:hidden;padding:0}"
      + ".ca-curri-head{padding:14px 16px 12px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#f8fbff,#fff)}.ca-curri-head h3{margin:0;font-size:15px}.ca-curri-head p{margin:3px 0 0;color:var(--muted);font-size:11.5px}"
      + ".ca-list{overflow-y:auto;padding:10px}.ca-ch{border:1px solid var(--line);border-radius:12px;background:#fff;margin-bottom:8px;overflow:hidden}"
      + ".ca-ch-head{padding:10px 12px;background:linear-gradient(180deg,#f8fbff,#fff);border-bottom:1px solid var(--line)}.ca-ch-head b{display:block;font-size:12.5px;text-transform:uppercase}.ca-ch-head span{display:block;margin-top:4px;color:var(--muted);font-size:11px;font-variant-numeric:tabular-nums}.ca-ch-head span i{font-style:normal;color:var(--blue);font-weight:900}"
      + ".ca-row{display:grid;grid-template-columns:26px minmax(0,1fr);gap:3px 8px;padding:9px 12px;border-top:1px solid #f1f5f9;cursor:pointer;transition:background .15s}.ca-row:hover{background:#f8fbff}.ca-row.is-active{background:#eff6ff;box-shadow:inset 3px 0 0 #2563eb}"
      + ".ca-row .n{grid-column:1;grid-row:1;color:#98a2b3;font-size:12px;font-weight:900;font-variant-numeric:tabular-nums}.ca-row .t{grid-column:2;grid-row:1;font-size:13px;line-height:1.35}.ca-row .m{grid-column:2;grid-row:2;display:flex;gap:5px;flex-wrap:wrap;align-items:center}"
      + ".ca-tag{display:inline-flex;padding:2px 7px;border-radius:999px;font-size:9.5px;font-weight:900;background:#f1f5f9;color:#475467;white-space:nowrap}.ca-tag.free{background:#ecfdf5;color:#047857}.ca-tag.prem{background:#f4f0ff;color:#7c3aed}.ca-tag.pub{background:#eff6ff;color:#1d4ed8}.ca-tag.hid{background:#fff7ed;color:#c2410c}"
      + "@media(max-width:1080px){.ca-layout{grid-template-columns:1fr}.ca-curri{position:static;max-height:none;order:-1}.ca-list{max-height:420px}.ca-form-grid{grid-template-columns:1fr 1fr}}"
      + "@media(max-width:640px){.ca-form-grid{grid-template-columns:1fr}}"
      + ".ca-alert{margin:0 0 12px;padding:12px 14px;border-left:4px solid #dc2626;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:12.5px;line-height:1.6}.ca-alert code{background:#fff;padding:1px 5px;border-radius:5px}";
    document.head.appendChild(style);
  }

  async function load() {
    const view = document.getElementById("courseAdmin");
    if (!view) return;
    mountStyle();
    try {
      const res = await fetch("/passport/course-videos.json", { cache: "no-store" });
      data = await res.json();
    } catch {
      try {
        const res = await fetch("/api/passport/course-videos", { cache: "no-store" });
        const payload = await res.json();
        data = payload.ok ? payload.data : seed;
      } catch {
        data = JSON.parse(JSON.stringify(seed));
      }
    }
    try {
      const draft = JSON.parse(localStorage.getItem("ducpt_course_videos_draft_v1") || "null");
      if (draft && draft.course && (draft.course.updatedAt || "") > (data.course.updatedAt || "")) data = draft;
    } catch {}
    await loadLegacyAssets();
    watchPlayerBlocked();
    if (!editingId) {
      const first = data.lessons.slice().sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999)).find((x) => x.status === "published") || data.lessons[0];
      if (first) editingId = first.id;
    }
    draw();
  }

  function draw() {
    const view = document.getElementById("courseAdmin");
    if (!view) return;
    const lesson = data.lessons.find((item) => item.id === editingId) || emptyLesson();
    const publishedCount = data.lessons.filter((item) => item.status === "published").length;
    view.innerHTML = `
      <div class="pc-tools"><div><h2 style="margin:0 0 4px">Quản lý học viên & video khóa học</h2><div class="pc-hint">Dán link YouTube, sửa mô tả, sắp xếp bài học và xuất bản lên trang /khoa-hoc/. Trên ducpt.com, nút Lưu sẽ commit file JSON thẳng vào GitHub nếu không có API server.</div></div><div class="pc-right"><span class="pc-saved" data-saved></span><div class="ytc-view-switch"><button class="${viewMode==="admin"?"is-active":""}" data-view-mode="admin" type="button">${ICO.edit}Quản trị</button><button class="${viewMode==="student"?"is-active":""}" data-view-mode="student" type="button">${ICO.eye}Học viên</button></div><a class="btn" href="/khoa-hoc/" target="_blank" rel="noreferrer">${ICO.eye}Mở trang học</a><button class="btn primary" data-save-all type="button">${ICO.save}Lưu tất cả</button></div></div>
      <div class="ytc-steps"><div class="ytc-step"><i>1</i><div><b>Dán link YouTube</b><span>Video để chế độ Không công khai (unlisted)</span></div></div><em>→</em><div class="ytc-step"><i>2</i><div><b>Bấm Đồng bộ</b><span>Tự lấy tiêu đề + ảnh thumbnail</span></div></div><em>→</em><div class="ytc-step"><i>3</i><div><b>Sửa mô tả rồi Lưu tất cả</b><span>Bài "Đang hiển thị" sẽ lên trang học viên</span></div></div></div>
      <div class="cs-metrics"><article class="card metric"><span>${ICO.list}Tổng bài học</span><strong>${data.lessons.length}</strong><small>Trong khóa này</small></article><article class="card metric"><span>${ICO.eye}Đang hiển thị</span><strong>${publishedCount}</strong><small>Học viên thấy trên trang học</small></article><article class="card metric"><span>${ICO.edit}Nháp / tạm ẩn</span><strong>${data.lessons.length - publishedCount}</strong><small>Chỉ mình bạn thấy</small></article><article class="card metric"><span>${ICO.cloud}Lưu trữ</span><strong>${githubConfig().token ? "Đã kết nối" : "Chưa kết nối"}</strong><small>${githubConfig().token ? "Lưu thẳng lên website" : "Mở Cài đặt lưu trữ bên dưới"}</small></article></div>
      ${viewMode === "student" ? studentPreviewHtml() : adminEditorHtml(lesson)}
      ${legacyAssetsHtml()}
      <details class="ytc-collapse"${githubConfig().token ? "" : " open"}><summary>${ICO.cloud}Cài đặt lưu trữ (GitHub) — điền 1 lần là nút Lưu chạy thẳng trên website</summary><article class="ytc-panel ytc-form"><div class="pc-hint">Chỉ cần điền token trên trình duyệt của anh. Token nằm trong localStorage máy anh, không đưa vào repo. Cần quyền Contents: Read and write cho repo Ducpt88/dg-media-office.</div><label>GitHub token<input data-github-field="token" type="password" value="${esc(githubConfig().token)}" placeholder="github_pat_..."></label><div class="ytc-grid"><label>Owner<input data-github-field="owner" value="${esc(githubConfig().owner)}"></label><label>Repo<input data-github-field="repo" value="${esc(githubConfig().repo)}"></label></div><div class="ytc-grid"><label>Branch<input data-github-field="branch" value="${esc(githubConfig().branch)}"></label><label>File path<input data-github-field="path" value="${esc(githubConfig().path)}"></label></div><div class="ytc-actions"><button class="btn" data-save-github-config type="button">Lưu kết nối GitHub</button><button class="btn" data-test-github type="button">Kiểm tra kết nối</button></div></article></details>
      <details class="ytc-collapse"><summary>${ICO.help}Hướng dẫn nhanh: cần gì khi thêm một video?</summary><article class="ytc-panel"><div class="ytc-guide"><div><b>1. Link YouTube</b><span class="ytc-note">Nên để không công khai. Video riêng tư sẽ không xem được khi nhúng trên website.</span></div><div><b>2. Tiêu đề</b><span class="ytc-note">Có thể đồng bộ từ YouTube, nhưng vẫn nên sửa lại cho đúng bài học.</span></div><div><b>3. Mô tả / outline</b><span class="ytc-note">Nhập mục tiêu, nội dung chính, bài tập và link tài liệu kèm theo.</span></div><div><b>4. Trạng thái</b><span class="ytc-note">Draft để soạn, published để học viên học, hidden để tạm ẩn.</span></div></div></article></details>`;
    bind(view);
  }

  function emptyLesson() {
    const n = data.lessons.length + 1;
    return { id: "", lessonNo: n, sort: n, youtubeUrl: "", youtubeId: "", videoUrl: "", sourceType: "youtube", resourceUrl: "", title: "", description: "", thumbnail: "", duration: "", status: "draft" };
  }

  function playableUrl(lesson) {
    return String(lesson.videoUrl || lesson.publicUrl || lesson.storageUrl || lesson.assetUrl || "").trim();
  }

  function sourceLabel(lesson) {
    return lesson.youtubeId ? "YouTube" : playableUrl(lesson) ? "Video file/storage" : "Chưa gắn video";
  }

  function thumbFor(lesson) {
    return lesson.thumbnail || (lesson.youtubeId ? `https://i.ytimg.com/vi/${lesson.youtubeId}/hqdefault.jpg` : "") || data.course.cover || "/assets/course/doanh-nghiep-1-nguoi.png";
  }

  function titleFromAssetName(name) {
    return String(name || "Video khóa học")
      .replace(/\.[^.]+$/, "")
      .replace(/^\d{14}-/, "")
      .replace(/^(?:buoi|bai|lesson)[-_ ]?\d{1,3}[-_ ]?/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Video khóa học";
  }

  async function loadLegacyAssets() {
    if (!/^(localhost|127\.0\.0\.1)$/i.test(location.hostname) && !window.DUCPT_ADMIN_API) {
      legacyAssets = [];
      return;
    }
    try {
      const res = await fetch("/api/passport/assets", { cache: "no-store" });
      const payload = await res.json();
      legacyAssets = payload.ok ? payload.data.filter((item) => String(item.type || "").startsWith("video/")) : [];
    } catch {
      legacyAssets = [];
    }
  }

  function legacyAssetsHtml() {
    if (!legacyAssets.length) return "";
    return `<article class="ytc-panel" style="margin-top:14px"><div class="pc-tools"><div><h3 style="margin:0">Video đã tải lên trước đây</h3><div class="pc-hint">Các file này vẫn còn trong thư mục passport/uploads trên máy/server local. Chúng không bị xóa, chỉ không thể đưa nguyên file lớn lên GitHub Pages. Nếu muốn dùng trên website thật, hãy đưa video lên YouTube không công khai hoặc lưu lên storage rồi dán link vào bài học.</div></div><span class="ytc-status">${legacyAssets.length} file</span></div><div class="ytc-asset-list">${legacyAssets.map((asset) => `<div class="ytc-asset"><div><b>${esc(asset.name || asset.fileName)}</b><small>${esc(asset.fileName)} · ${formatBytes(asset.size)} · ${esc(asset.type || "video")}</small></div><div class="ytc-actions"><a class="btn" href="${esc(asset.url)}" target="_blank" rel="noreferrer">Xem file</a><button class="btn primary" data-use-asset type="button" data-asset-url="${esc(asset.url)}" data-asset-name="${esc(asset.name || asset.fileName)}" data-asset-type="${esc(asset.type || "video")}">Dùng làm bài học</button></div></div>`).join("")}</div></article>`;
  }

  function adminEditorHtml(lesson) {
    return `<div class="ca-layout">
      <section>
        <article class="ytc-panel ca-player">
          <div class="ca-frame" data-player>${playerHtml(lesson)}</div>
          <div class="ca-body">
            <div data-player-alert></div>
            <span class="ca-eyebrow">${lesson.id ? "Đang sửa bài" : "Bài học mới"}</span>
            <h3 class="ca-title">${esc(lesson.title || "Chọn một bài ở cột phải để xem và sửa")}</h3>
            <p class="ca-sub">${esc(lesson.objective || lesson.description || "Bấm vào một bài trong cây chương bên phải — video hiện ngay tại đây, sửa xong bấm Lưu bài học.")}</p>
            ${lesson.youtubeId ? `<p style="margin:8px 0 0"><a class="btn" href="https://www.youtube.com/watch?v=${esc(lesson.youtubeId)}" target="_blank" rel="noreferrer">${ICO.eye}Mở trên YouTube (nếu khung trên không phát được)</a></p>` : ""}
            <div class="ytc-import" style="margin-top:14px"><input class="searchbox" data-youtube-url placeholder="Dán link YouTube để tạo/đồng bộ bài mới"><button class="btn primary" data-import-youtube type="button">${ICO.sync}Đồng bộ</button></div>
            <div class="ytc-import"><input class="searchbox" data-upload-video type="file" accept="video/*"><button class="btn" data-upload-video-button type="button">Tải video lên</button></div>
            <form class="ca-form" data-lesson-form>
              <input type="hidden" name="id" value="${esc(lesson.id)}">
              <label>Tiêu đề bài học<input name="title" required value="${esc(lesson.title)}"></label>
              <div class="ca-form-grid">
                <label>Chương<select name="module">${moduleOptionsHtml(lesson.module)}</select></label>
                <label>Mã bài trong chương<input name="moduleNo" value="${esc(lesson.moduleNo || "")}" placeholder="Ví dụ 1.1"></label>
                <label>Quyền xem<select name="access"><option value="free"${lesson.access !== "premium" && lesson.access !== "hidden" ? " selected" : ""}>FREE — ai đăng ký cũng xem</option><option value="premium"${lesson.access === "premium" ? " selected" : ""}>PREMIUM — chỉ học viên trả phí</option><option value="hidden"${lesson.access === "hidden" ? " selected" : ""}>Ẩn khỏi khóa học</option></select></label>
              </div>
              <div class="ca-form-grid">
                <label>Trạng thái<select name="status"><option value="draft"${lesson.status === "draft" ? " selected" : ""}>Bản nháp</option><option value="published"${lesson.status === "published" ? " selected" : ""}>Đang hiển thị</option><option value="hidden"${lesson.status === "hidden" ? " selected" : ""}>Tạm ẩn</option></select></label>
                <label>Số buổi<input name="lessonNo" type="number" min="1" value="${esc(lesson.lessonNo)}"></label>
                <label>Thứ tự sắp xếp<input name="sort" type="number" min="1" value="${esc(lesson.sort)}"></label>
              </div>
              <div class="ca-form-grid">
                <label>Link YouTube<input name="youtubeUrl" value="${esc(lesson.youtubeUrl)}" placeholder="https://www.youtube.com/watch?v=..."></label>
                <label>Link video trực tiếp / storage<input name="videoUrl" value="${esc(lesson.videoUrl || "")}" placeholder="https://.../video.mp4"></label>
                <label>Thời lượng hiển thị<input name="duration" value="${esc(lesson.duration)}" placeholder="Ví dụ 18:35"></label>
              </div>
              <div class="ca-form-grid">
                <label>Thumbnail<input name="thumbnail" value="${esc(lesson.thumbnail)}" placeholder="Để trống = lấy thumbnail YouTube"></label>
                <label>Link tài liệu / bài tập<input name="resourceUrl" value="${esc(lesson.resourceUrl || "")}" placeholder="PDF, Notion, Drive..."></label>
                <label>Loại<input name="type" value="${esc(lesson.type || "")}" placeholder="clip / bài giảng"></label>
              </div>
              <label>Mục tiêu bài học<textarea name="objective" placeholder="Học xong bài này học viên làm được gì?">${esc(lesson.objective || "")}</textarea></label>
              <label>Mô tả / outline<textarea name="description" placeholder="Nội dung chính, bài tập, link tài liệu...">${esc(lesson.description)}</textarea></label>
              <div class="ytc-actions"><button class="btn primary" type="submit">${ICO.save}${lesson.id ? "Lưu bài học" : "Thêm bài học"}</button><button class="btn" data-new-lesson type="button">Bài mới</button>${lesson.id ? `<button class="btn delete" data-delete-lesson data-lesson-id="${esc(lesson.id)}" type="button">${ICO.trash}Xóa bài này</button>` : ""}</div>
            </form>
          </div>
        </article>
        <article class="ytc-panel ytc-form" style="margin-top:14px"><h3 style="margin:0">Thông tin khóa học</h3><label>Tên khóa học<input data-course-field="title" value="${esc(data.course.title)}"></label><label>Giá / CTA<input data-course-field="price" value="${esc(data.course.price)}"></label><label>Liên hệ<input data-course-field="contact" value="${esc(data.course.contact)}"></label><label>Link ảnh bìa<input data-course-field="cover" value="${esc(data.course.cover)}"></label><label>Mục tiêu khóa học<textarea data-course-field="goal">${esc(data.course.goal)}</textarea></label></article>
      </section>
      <aside class="ytc-panel ca-curri">
        <div class="ca-curri-head">
          <h3>Nội dung khóa học</h3>
          <p>Xếp đúng như trang ngoài — bấm một bài để xem video và sửa ngay</p>
          <span class="ytc-status" style="margin-top:8px">${data.lessons.length} bài · ${data.lessons.filter((x) => x.status === "published").length} đang hiển thị</span>
        </div>
        <div class="ca-list">${chapterListHtml()}</div>
      </aside>
    </div>`;
  }

  /* Cửa soát vé góc-nhìn-người-dùng-cuối: không hỏi "có thẻ iframe không" mà hỏi
     "khung video có thật sự phát được không". Trình duyệt bắn securitypolicyviolation
     khi CSP chặn nguồn video — bắt lấy và hiện cảnh báo đỏ ngay trên màn hình,
     thay vì để anh nhìn một ô đen im lặng. */
  function watchPlayerBlocked() {
    if (window.__ducptPlayerWatch) return;
    window.__ducptPlayerWatch = true;
    document.addEventListener("securitypolicyviolation", (event) => {
      if (!/frame-src|media-src|default-src/.test(event.violatedDirective || "")) return;
      const box = document.getElementById("courseAdmin")?.querySelector("[data-player-alert]");
      if (!box) return;
      box.innerHTML = `<div class="ca-alert">⚠ Khung video đang bị chặn — không xem được tại đây.<br>Nguồn bị chặn: <b>${esc(event.blockedURI)}</b> · Luật chặn: <b>${esc(event.violatedDirective)}</b><br>Cách xử lý: mở <code>passport/index.html</code>, thêm nguồn này vào dòng Content-Security-Policy. Trong lúc chờ, bấm nút "Mở trên YouTube" bên dưới để xem bài.</div>`;
    });
  }

  function playerHtml(lesson) {
    if (lesson.youtubeId) return `<iframe src="https://www.youtube-nocookie.com/embed/${esc(lesson.youtubeId)}?rel=0&modestbranding=1" title="${esc(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    const direct = playableUrl(lesson);
    if (direct) return `<video controls playsinline preload="metadata" poster="${esc(thumbFor(lesson))}" src="${esc(direct)}"></video>`;
    return "Chưa gắn video cho bài này — dán link YouTube ở ô bên dưới";
  }

  function moduleOptionsHtml(current) {
    const modules = Array.isArray(data.course.modules) ? data.course.modules : [];
    const options = modules.map((m) => `<option value="${esc(m.code)}"${current === m.code ? " selected" : ""}>${esc(m.code)} — ${esc(m.title)}</option>`).join("");
    return `${options}<option value="OFF"${!current || current === "OFF" ? " selected" : ""}>OFF — chưa xếp chương</option>`;
  }

  function durationSeconds(value) {
    const text = String(value || "").trim();
    if (!/^\d/.test(text)) return 0;
    const parts = text.split(":").map(Number);
    while (parts.length < 3) parts.unshift(0);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  function formatHMS(total) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }

  /* Cây chương giống hệt trang ngoài, nhưng hiện cả bài nháp/ẩn để anh nhìn thấy toàn bộ kho. */
  function chapterListHtml() {
    if (!data.lessons.length) return `<div class="cs-empty">Chưa có bài học. Dán link YouTube và bấm Đồng bộ để tạo bài đầu tiên.</div>`;
    const modules = Array.isArray(data.course.modules) ? data.course.modules : [];
    const sorted = data.lessons.slice().sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999));
    const groups = modules.map((m) => ({ code: m.code, title: m.title, items: sorted.filter((l) => l.module === m.code) }));
    const codes = modules.map((m) => m.code);
    const rest = sorted.filter((l) => !codes.includes(l.module));
    if (rest.length) groups.push({ code: "OFF", title: "Chưa xếp chương / để ngoài khóa", items: rest });
    return groups.filter((g) => g.items.length).map((group, gi) => {
      const total = group.items.reduce((sum, l) => sum + durationSeconds(l.duration), 0);
      const live = group.items.filter((l) => l.status === "published").length;
      const rows = group.items.map((item, i) => {
        const access = item.access === "premium" ? '<span class="ca-tag prem">💎 PREMIUM</span>' : item.access === "hidden" ? '<span class="ca-tag">Ẩn khỏi khóa</span>' : '<span class="ca-tag free">FREE</span>';
        const state = item.status === "published" ? '<span class="ca-tag pub">Đang hiển thị</span>' : item.status === "hidden" ? '<span class="ca-tag hid">Tạm ẩn</span>' : '<span class="ca-tag">Bản nháp</span>';
        return `<div class="ca-row${item.id === editingId ? " is-active" : ""}" data-lesson-id="${esc(item.id)}" data-select-lesson><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="t">${esc(item.title || "Bài chưa có tiêu đề")}</span><span class="m"><span class="ca-tag">${esc(item.duration || "—")}</span>${access}${state}</span></div>`;
      }).join("");
      return `<section class="ca-ch"><div class="ca-ch-head"><b>${gi + 1}. ${esc(group.title)}</b><span>Số lượng: <i>${group.items.length}</i> video · Thời lượng: <i>${formatHMS(total)}</i> · Đang hiển thị: <i>${live}</i></span></div>${rows}</section>`;
    }).join("");
  }

  function studentPreviewHtml() {
    const published = data.lessons.filter((item) => item.status === "published").sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999));
    const rows = published.length ? published.map((item, index) => {
      const no = item.lessonNo || index + 1;
      return `<div class="ytc-preview-card"><img src="${esc(thumbFor(item))}" alt=""><div><b>Buổi ${esc(no)}: ${esc(item.title || "Bài học chưa có tiêu đề")}</b><p>${esc(item.description || item.resourceUrl || "Mô tả bài học đang được cập nhật.")}</p><span class="ytc-status">${esc(item.duration || sourceLabel(item))}</span></div><a class="btn" href="/khoa-hoc/" target="_blank" rel="noreferrer">Xem như học viên</a></div>`;
    }).join("") : `<div class="cs-empty">Chưa có bài học published. Chuyển về Góc nhìn quản trị để xuất bản ít nhất một bài học.</div>`;
    return `<article class="ytc-panel" style="margin-top:14px"><div class="pc-tools"><div><h3 style="margin:0">Góc nhìn học viên</h3><div class="pc-hint">Đây là danh sách bài học học viên sẽ thấy trên trang /khoa-hoc/. Chỉ các bài published xuất hiện ở đây.</div></div><span class="ytc-status">${published.length} bài đang hiển thị</span></div><div class="ytc-preview-list">${rows}</div></article>`;
  }

  function lessonListHtml() {
    if (!data.lessons.length) return `<div class="cs-empty">Chưa có bài học. Dán link YouTube và bấm Đồng bộ để tạo bài đầu tiên.</div>`;
    return data.lessons.slice().sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999)).map((item) => `<div class="ytc-lesson ${item.id === editingId ? "is-editing" : ""}" data-lesson-id="${esc(item.id)}"><img src="${esc(thumbFor(item))}" alt=""><div><b>${esc(item.lessonNo)}. ${esc(item.title)}</b><span>${esc(item.youtubeUrl || item.videoUrl || "Chưa có link")}</span><span>${esc(item.description || item.resourceUrl || "Chưa có mô tả")}</span></div><div class="ytc-actions"><span class="ytc-status st-${esc(item.status || "draft")}">${esc(statusLabel(item.status))}</span><button class="btn" data-edit-lesson type="button">${ICO.edit}Sửa</button><button class="btn delete" data-delete-lesson type="button">${ICO.trash}Xóa</button></div></div>`).join("");
  }

  function statusLabel(status) {
    return status === "published" ? "Đang hiển thị" : status === "hidden" ? "Tạm ẩn" : "Bản nháp";
  }

  function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!value) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
    return `${(value / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  function bind(view) {
    view.querySelector("[data-save-all]").addEventListener("click", saveAll);
    view.querySelectorAll("[data-view-mode]").forEach((button) => button.addEventListener("click", () => { viewMode = button.dataset.viewMode; draw(); }));
    view.querySelector("[data-import-youtube]")?.addEventListener("click", importYoutube);
    view.querySelector("[data-upload-video-button]")?.addEventListener("click", () => view.querySelector("[data-upload-video]")?.click());
    view.querySelector("[data-upload-video]")?.addEventListener("change", uploadVideoFile);
    view.querySelector("[data-new-lesson]")?.addEventListener("click", () => { editingId = ""; draw(); });
    view.querySelectorAll("[data-use-asset]").forEach((button) => button.addEventListener("click", () => {
      const assetUrl = button.dataset.assetUrl || "";
      const assetName = button.dataset.assetName || "";
      const assetType = button.dataset.assetType || "video";
      const title = titleFromAssetName(assetName);
      const next = {
        ...emptyLesson(),
        id: `asset-${Date.now()}`,
        lessonNo: data.lessons.length + 1,
        sort: data.lessons.length + 1,
        title,
        videoUrl: assetUrl,
        sourceType: "direct",
        description: `Bài học tạo từ file đã upload (${assetType}). Hãy đổi sang link công khai nếu muốn học viên xem trên website live.`,
        thumbnail: data.course.cover || "",
        status: "draft",
        updatedAt: new Date().toISOString()
      };
      data.lessons.push(next);
      editingId = next.id;
      draw();
      flash("Đã đưa file upload vào bài học. Hãy kiểm tra link công khai rồi bấm Lưu tất cả.");
    }));
    view.querySelector("[data-save-github-config]").addEventListener("click", () => { saveGithubConfig(view); flash("Đã lưu kết nối GitHub trên trình duyệt này"); });
    view.querySelector("[data-test-github]").addEventListener("click", testGithubConnection);
    view.querySelector("[data-lesson-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      collectCourse(view);
      const rec = Object.fromEntries(new FormData(event.currentTarget).entries());
      const youtubeId = youtubeIdFromUrl(rec.youtubeUrl || rec.videoUrl || "");
      const directVideoUrl = youtubeId ? "" : String(rec.videoUrl || "").trim();
      const id = rec.id || `lesson-${Date.now()}`;
      const old = data.lessons.find((item) => item.id === id) || {};
      const next = { ...old, module: String(rec.module || old.module || "OFF"), moduleNo: String(rec.moduleNo || "").trim(), access: String(rec.access || old.access || "free"), objective: String(rec.objective || "").trim(), type: String(rec.type || old.type || "").trim(), id, lessonNo: Number(rec.lessonNo) || data.lessons.length + 1, sort: Number(rec.sort) || Number(rec.lessonNo) || data.lessons.length + 1, youtubeUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : String(rec.youtubeUrl || "").trim(), youtubeId, videoUrl: directVideoUrl, sourceType: youtubeId ? "youtube" : directVideoUrl ? "direct" : (old.sourceType || "youtube"), title: rec.title.trim(), duration: rec.duration.trim(), status: rec.status, thumbnail: rec.thumbnail.trim() || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : old.thumbnail || data.course.cover || ""), resourceUrl: String(rec.resourceUrl || old.resourceUrl || "").trim(), description: rec.description.trim(), updatedAt: new Date().toISOString() };
      const index = data.lessons.findIndex((item) => item.id === id);
      if (index >= 0) data.lessons[index] = next; else data.lessons.push(next);
      editingId = next.id;
      saveAll();
    });
    view.querySelectorAll("[data-edit-lesson]").forEach((button) => button.addEventListener("click", (event) => { editingId = event.target.closest("[data-lesson-id]").dataset.lessonId; draw(); }));
    view.querySelectorAll("[data-select-lesson]").forEach((row) => row.addEventListener("click", () => {
      editingId = row.dataset.lessonId;
      draw();
      document.getElementById("courseAdmin")?.querySelector(".ca-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    view.querySelectorAll("[data-delete-lesson]").forEach((button) => button.addEventListener("click", (event) => {
      if (!confirm("Xóa bài học này?")) return;
      const id = event.target.closest("[data-lesson-id]").dataset.lessonId;
      data.lessons = data.lessons.filter((item) => item.id !== id);
      if (editingId === id) editingId = "";
      saveAll();
    }));
  }

  function collectCourse(view) {
    view.querySelectorAll("[data-course-field]").forEach((el) => { data.course[el.dataset.courseField] = el.value.trim(); });
    data.course.updatedAt = new Date().toISOString();
  }

  async function importYoutube() {
    const view = document.getElementById("courseAdmin");
    const input = view.querySelector("[data-youtube-url]");
      const youtubeUrl = input.value.trim();
      if (!youtubeUrl) return flash("Hãy dán link YouTube trước");
      flash("Đang đồng bộ YouTube...");
      try {
        const res = await fetch("/api/passport/course-videos/import-youtube", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ youtubeUrl }) });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || "Không đồng bộ được");
      const item = payload.data;
      const existing = data.lessons.find((lesson) => lesson.youtubeId === item.youtubeId);
      const next = { ...(existing || {}), ...item, id: existing ? existing.id : item.id, lessonNo: existing ? existing.lessonNo : data.lessons.length + 1, sort: existing ? existing.sort : data.lessons.length + 1, videoUrl: existing?.videoUrl || "", sourceType: "youtube", resourceUrl: existing?.resourceUrl || "", duration: existing ? existing.duration : "", description: existing ? existing.description : "", status: existing ? existing.status : "draft", updatedAt: new Date().toISOString() };
      if (existing) data.lessons[data.lessons.indexOf(existing)] = next; else data.lessons.push(next);
      editingId = next.id;
      input.value = "";
      draw();
      flash("Đã đồng bộ tiêu đề và thumbnail");
    } catch (error) {
      const youtubeId = youtubeIdFromUrl(youtubeUrl);
      if (!youtubeId) return flash(error.message || "Lỗi đồng bộ YouTube");
      const existing = data.lessons.find((lesson) => lesson.youtubeId === youtubeId);
      const item = { id: `yt-${youtubeId}`, youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`, youtubeId, videoUrl: "", sourceType: "youtube", resourceUrl: existing?.resourceUrl || "", title: existing?.title || "Bài học mới", description: existing?.description || "", thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`, status: existing?.status || "draft" };
      const next = { ...(existing || {}), ...item, lessonNo: existing ? existing.lessonNo : data.lessons.length + 1, sort: existing ? existing.sort : data.lessons.length + 1, duration: existing ? existing.duration : "", updatedAt: new Date().toISOString() };
      if (existing) data.lessons[data.lessons.indexOf(existing)] = next; else data.lessons.push(next);
      editingId = next.id;
      input.value = "";
      draw();
      flash("Đã tạo bài từ link YouTube. Sửa tiêu đề nếu cần.");
    }
  }

  async function uploadVideoFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    flash("Đang tải video lên Passport local...");
    try {
      const res = await fetch(`/api/passport/upload?name=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file
      });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || "Không tải được video");
      const asset = payload.data;
      const next = {
        ...emptyLesson(),
        id: `asset-${Date.now()}`,
        lessonNo: data.lessons.length + 1,
        sort: data.lessons.length + 1,
        title: titleFromAssetName(asset.name || asset.fileName || file.name),
        videoUrl: asset.url,
        sourceType: "direct",
        description: "Bài học tạo từ file upload local. Để khách xem trên ducpt.com, hãy đổi sang link YouTube unlisted hoặc link storage công khai trước khi Published.",
        thumbnail: data.course.cover || "",
        status: "draft",
        updatedAt: new Date().toISOString()
      };
      data.lessons.push(next);
      editingId = next.id;
      event.target.value = "";
      draw();
      flash("Đã tải video và tạo bài học nháp. Kiểm tra link trước khi Published.");
    } catch (error) {
      flash((error && error.message) || "Không tải được video. Hãy chạy Passport upload server hoặc dùng link YouTube/storage.");
    }
  }

  async function saveAll() {
    const view = document.getElementById("courseAdmin");
    collectCourse(view);
    data.lessons = data.lessons.sort((a, b) => (Number(a.sort) || 999) - (Number(b.sort) || 999));
    try { localStorage.setItem("ducpt_course_videos_draft_v1", JSON.stringify(data)); } catch {}
    try {
      const res = await fetch("/api/passport/course-videos/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || "Không lưu được");
      data = payload.data;
      draw();
      flash("Đã lưu lên server");
    } catch (error) {
      try {
        await saveToGitHub();
        draw();
        flash("Đã commit lên GitHub. Website sẽ cập nhật sau khi Pages deploy.");
      } catch (githubError) {
        flash("Đã lưu nháp trên máy này · Để đăng lên website thật: mở mục Cài đặt lưu trữ bên dưới, điền token 1 lần");
      }
    }
  }

  function githubConfig() {
    try { return { ...githubDefaults, ...JSON.parse(localStorage.getItem("ducpt_github_course_config_v1") || "{}") }; }
    catch { return { ...githubDefaults }; }
  }

  function saveGithubConfig(view) {
    const cfg = githubConfig();
    view.querySelectorAll("[data-github-field]").forEach((el) => { cfg[el.dataset.githubField] = el.value.trim(); });
    localStorage.setItem("ducpt_github_course_config_v1", JSON.stringify(cfg));
  }

  async function testGithubConnection() {
    const view = document.getElementById("courseAdmin");
    saveGithubConfig(view);
    const cfg = githubConfig();
    if (!cfg.token) return flash("Can dien GitHub token truoc");
    const file = await githubFetchFile(cfg);
    flash(file.sha ? "Kết nối GitHub OK" : "Đã kết nối, file chưa có SHA");
  }

  async function saveToGitHub() {
    const view = document.getElementById("courseAdmin");
    saveGithubConfig(view);
    const cfg = githubConfig();
    if (!cfg.token) throw new Error("Website live cần GitHub token để lưu trực tiếp");
    const current = await githubFetchFile(cfg);
    const body = {
      message: `Update course videos ${new Date().toISOString()}`,
      content: base64EncodeUtf8(JSON.stringify(data, null, 2) + "\n"),
      branch: cfg.branch,
      committer: { name: "DUCPT Passport", email: "passport@ducpt.com" }
    };
    if (current.sha) body.sha = current.sha;
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split("/").map(encodeURIComponent).join("/")}`, {
      method: "PUT",
      headers: {
        "accept": "application/vnd.github+json",
        "authorization": `Bearer ${cfg.token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28"
      },
      body: JSON.stringify(body)
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.message || `GitHub save failed: ${res.status}`);
  }

  async function githubFetchFile(cfg) {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(cfg.branch)}`, {
      headers: {
        "accept": "application/vnd.github+json",
        "authorization": `Bearer ${cfg.token}`,
        "x-github-api-version": "2022-11-28"
      }
    });
    if (res.status === 404) return {};
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.message || `GitHub read failed: ${res.status}`);
    return payload;
  }

  function base64EncodeUtf8(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  function youtubeIdFromUrl(value) {
    const text = String(value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
    try {
      const url = new URL(text);
      if (url.hostname.includes("youtu.be")) return cleanId(url.pathname.slice(1));
      if (url.pathname.startsWith("/shorts/")) return cleanId(url.pathname.split("/")[2]);
      if (url.pathname.startsWith("/embed/")) return cleanId(url.pathname.split("/")[2]);
      return cleanId(url.searchParams.get("v"));
    } catch { return ""; }
  }

  function cleanId(value) {
    const match = String(value || "").match(/[A-Za-z0-9_-]{11}/);
    return match ? match[0] : "";
  }

  function flash(message) {
    const view = document.getElementById("courseAdmin");
    const el = view && view.querySelector("[data-saved]");
    if (!el) return;
    el.textContent = message;
    setTimeout(() => { el.textContent = ""; }, 3500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(load, 80));
  else setTimeout(load, 80);
})();
