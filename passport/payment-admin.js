(() => {
  const key = "ducpt_orders_v1";
  const leadKey = "ducpt-email-leads-v1";
  const signupInboxKey = "ducpt_course_signup_inbox_v1";
  const studentProfileKey = "ducpt-student-profile-v1";
  const registerKey = "ducpt_registrations_v1";
  const apiUrl = path => String(window.DUCPT_API_BASE || "").replace(/\/+$/, "") + path;
  const defaultCourseId = "doanh-nghiep-mot-nguoi";
  const defaultCourseTitle = "Doanh nghiệp một người";
  const normalizeCourseId = value => String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  const courseIdFrom = item => normalizeCourseId(item && (item.courseId || (Array.isArray(item.courseIds) && item.courseIds[0]) || item.product || item.course || defaultCourseId)) || defaultCourseId;
  const seed = { orderId:"MANUAL-20260711-001", name:"Học viên chưa cập nhật tên", contact:"", product:defaultCourseTitle, courseId:defaultCourseId, courseIds:[defaultCourseId], amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", accessPackage:"premium", accessStatus:"active", entitlement:true, createdAt:"2026-07-11T00:00:00+07:00" };
  let records = [];
  let remoteSignups = [];
  let courseCatalog = [{ id:defaultCourseId, title:defaultCourseTitle }];
  try { records = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  records = records.map((item, index) => {
    const courseId = courseIdFrom(item);
    return {
      ...item,
      orderId:item.orderId || `LEGACY-${item.createdAt || Date.now()}-${index}`,
      product:item.product === "Khóa học 1" ? defaultCourseTitle : (item.product || defaultCourseTitle),
      courseId,
      courseIds:Array.isArray(item.courseIds) && item.courseIds.length ? item.courseIds.map(normalizeCourseId).filter(Boolean) : [courseId],
      accessPackage:item.accessPackage || (item.entitlement ? "premium" : "free"),
      accessStatus:item.accessStatus || "active"
    };
  });
  if (!records.some(item => item.orderId === seed.orderId)) records.push(seed);
  localStorage.setItem(key, JSON.stringify(records));
  let editingOrderId = "";
  const form = document.getElementById("paymentForm");
  const style = document.createElement("style");
  style.textContent = `
    #paymentForm{padding:20px!important}#paymentForm .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 22px}
    #paymentForm label{display:grid;grid-template-columns:150px minmax(0,1fr);align-items:center;gap:12px;font-size:13px;font-weight:700}
    #paymentForm .searchbox{width:100%;min-width:0}#paymentForm>button{margin-top:18px!important}#paymentStatus{display:inline-block;margin:18px 0 0 12px;color:var(--green);font-size:12px}
    #customerRows small{display:block;color:var(--muted);font-size:11px;margin-top:3px}
    #customerRows .access-select{width:auto;min-width:116px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;padding:4px 20px 4px 0;color:var(--ink);font:inherit;font-size:11px;font-weight:700;cursor:pointer}
    #customerRows .access-select:focus{outline:0;border-bottom-color:var(--blue)}
    #customerRows .row,#customerRowsHead{grid-template-columns:1.1fr 1.15fr 1.1fr .9fr .7fr}.customer-actions{display:flex!important;gap:6px;padding:7px!important}
    .customer-actions button{padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;font-weight:700;cursor:pointer}.customer-actions .delete{color:#b42318}
    .signup-inbox-alert{position:fixed;right:18px;bottom:18px;z-index:80;display:none;align-items:center;gap:10px;max-width:min(360px,calc(100vw - 36px));padding:12px 14px;border:1px solid #dbeafe;border-radius:12px;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.18);cursor:pointer;text-align:left}
    .signup-inbox-alert.show{display:flex}.signup-inbox-alert b{display:block;font-size:13px}.signup-inbox-alert em{font-style:normal;color:#2563eb}.signup-inbox-alert span{display:block;color:var(--muted);font-size:11px}.signup-inbox-alert i{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:#eff6ff;color:#2563eb;font-style:normal;font-weight:900;flex:none}
    .signup-inbox-panel{margin:14px 0}.signup-inbox-panel .head{margin-bottom:10px}.signup-inbox-list{display:grid;gap:8px}.signup-inbox-item{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fbfdff}.signup-inbox-item b{display:block;font-size:13px}.signup-inbox-item span{display:block;margin-top:2px;color:var(--muted);font-size:11px}.signup-inbox-item button{padding:7px 10px;border:1px solid #dbeafe;border-radius:9px;background:#eff6ff;color:#1d4ed8;font-weight:800;cursor:pointer}.signup-inbox-note{margin-top:9px;color:#92400e;font-size:11px}
    @media(max-width:900px){#paymentForm .grid2{grid-template-columns:1fr}#paymentForm label{grid-template-columns:135px minmax(0,1fr)}}
  `;
  document.head.appendChild(style);
  const amountInput = document.querySelector('#paymentForm [name="amount"]');
  if (amountInput) {
    const label = amountInput.closest("label");
    const currencyLabel = document.createElement("label");
    currencyLabel.innerHTML = 'Tiền tệ<select class="searchbox" name="currency"><option value="VND" selected>VND — Việt Nam đồng</option><option value="USD">USD — Đô la Mỹ</option></select>';
    label.insertAdjacentElement("afterend", currencyLabel);
    label.firstChild.textContent = "Số tiền ";
  }
  const contactInput = document.querySelector('#paymentForm [name="contact"]');
  if (contactInput && !document.querySelector('#paymentForm [name="email"]')) {
    const emailLabel = document.createElement("label");
    emailLabel.innerHTML = 'Email học viên<input class="searchbox" name="email" type="email" autocomplete="email" required placeholder="email@example.com">';
    contactInput.closest("label").insertAdjacentElement("afterend", emailLabel);
  }
  if (contactInput && !document.querySelector('#paymentForm [name="accessPackage"]')) {
    const pkgLabel = document.createElement("label");
    pkgLabel.innerHTML = 'Gói quyền học<select class="searchbox" name="accessPackage"><option value="premium" selected>Premium / Member - mở bài trả phí</option><option value="free">Free - chỉ xem bài Free</option></select>';
    contactInput.closest("label").insertAdjacentElement("afterend", pkgLabel);
  }
  const productInput = document.querySelector('#paymentForm [name="product"]');
  if (productInput && productInput.value === "Khóa học 1") productInput.value = defaultCourseTitle;
  if (productInput && !document.querySelector('#paymentForm [name="courseId"]')) {
    const courseIdLabel = document.createElement("label");
    courseIdLabel.innerHTML = 'Mã khóa học<input class="searchbox" name="courseId" required value="doanh-nghiep-mot-nguoi" placeholder="doanh-nghiep-mot-nguoi">';
    productInput.closest("label").insertAdjacentElement("afterend", courseIdLabel);
  }
  if (contactInput && !document.querySelector('#paymentForm [name="accessStatus"]')) {
    const accessLabel = document.createElement("label");
    accessLabel.innerHTML = 'Trạng thái quyền<select class="searchbox" name="accessStatus"><option value="active" selected>Đang mở</option><option value="paused">Tạm khóa</option><option value="expired">Hết hạn</option></select>';
    contactInput.closest("label").insertAdjacentElement("afterend", accessLabel);
  }
  const money = (value, currency = "VND") => new Intl.NumberFormat(currency === "USD" ? "en-US" : "vi-VN", { style:"currency", currency }).format(Number(value) || 0);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
  const readLeads = () => { try { const list = JSON.parse(localStorage.getItem(leadKey) || "[]"); return Array.isArray(list) ? list : []; } catch { return []; } };
  const readJsonList = storageKey => { try { const list = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(list) ? list : []; } catch { return []; } };
  const readCurrentStudentRows = () => {
    const rows = [];
    try {
      const profile = JSON.parse(localStorage.getItem(studentProfileKey) || "null");
      if (profile && profile.email) rows.push({ ...profile, source:"student-profile", status:"free", purchaseStatus:profile.purchaseStatus || "not_paid", role:profile.role || "free" });
    } catch {}
    try {
      const email = String(localStorage.getItem("ducpt-email") || "").trim().toLowerCase();
      const role = String(localStorage.getItem("ducpt-role") || "free").trim().toLowerCase();
      const hasAdminSession = !!JSON.parse(localStorage.getItem("ducpt-admin-session") || "null");
      if (email && !hasAdminSession) rows.push({ email, name:"Học viên", source:"current-student-email", status:"free", purchaseStatus:"not_paid", role:role === "premium" ? "premium" : "free" });
    } catch {}
    return rows;
  };
  const readSignupInbox = () => {
    const rows = readJsonList(signupInboxKey);
    readCurrentStudentRows().forEach(item => rows.unshift(item));
    readJsonList(registerKey).forEach(item => rows.push({ ...item, course:item.interest || item.course || defaultCourseTitle, source:item.source || "register-page", status:item.status || "free", purchaseStatus:item.purchaseStatus || "not_paid" }));
    return rows;
  };
  const addCourseOption = item => {
    const title = String(item?.title || item?.name || item?.course || item?.product || "").trim();
    const id = normalizeCourseId(item?.id || item?.courseId || item?.slug || title || defaultCourseId) || defaultCourseId;
    if (!title) return;
    const exists = courseCatalog.some(course => course.id === id || course.title.toLowerCase() === title.toLowerCase());
    if (!exists) courseCatalog.push({ id, title });
  };
  const selectedCourseOption = () => {
    const field = form?.elements?.product;
    return field && field.tagName === "SELECT" ? field.selectedOptions[0] : null;
  };
  const syncSelectedCourseId = () => {
    const option = selectedCourseOption();
    const courseId = form?.elements?.courseId;
    if (courseId && option?.dataset?.courseId) courseId.value = option.dataset.courseId;
  };
  const refreshCourseSelect = (selectedTitle = "", selectedId = "") => {
    if (!form?.elements?.product) return;
    let field = form.elements.product;
    if (field.tagName !== "SELECT") {
      const select = document.createElement("select");
      select.className = field.className || "searchbox";
      select.name = field.name;
      select.required = field.required;
      selectedTitle = selectedTitle || field.value;
      field.replaceWith(select);
      field = select;
    }
    addCourseOption({ title:selectedTitle || defaultCourseTitle, id:selectedId || selectedTitle || defaultCourseId });
    const currentTitle = selectedTitle || field.value || defaultCourseTitle;
    const currentId = normalizeCourseId(selectedId || currentTitle || defaultCourseId);
    courseCatalog.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    field.innerHTML = courseCatalog.map(course => `<option value="${esc(course.title)}" data-course-id="${esc(course.id)}"${course.id === currentId || course.title === currentTitle ? " selected" : ""}>${esc(course.title)}</option>`).join("");
    if (![...field.options].some(option => option.selected) && field.options[0]) field.options[0].selected = true;
    syncSelectedCourseId();
  };
  const collectCourseCatalog = () => {
    addCourseOption({ id:defaultCourseId, title:defaultCourseTitle });
    try {
      const list = JSON.parse(localStorage.getItem("ducpt_courses_v2") || "[]");
      if (Array.isArray(list)) list.filter(course => course?.status !== "hidden").forEach(course => addCourseOption({ id:course.courseId || course.slug || course.name || course.title || course.id, title:course.name || course.title }));
    } catch {}
    records.forEach(addCourseOption);
    readLeads().forEach(addCourseOption);
    remoteSignups.forEach(addCourseOption);
    refreshCourseSelect();
  };
  const loadCourseCatalog = async () => {
    collectCourseCatalog();
    try {
      const response = await fetch("/passport/course-videos.json", { cache:"no-store" });
      const body = await response.json();
      const data = body?.ok ? body.data : body;
      if (data?.course) addCourseOption({ id:data.course.id || data.course.slug || data.course.courseId || data.course.title, title:data.course.title || data.course.name });
    } catch {}
    refreshCourseSelect();
  };
  form?.addEventListener("change", event => {
    if (event.target && event.target.name === "product") syncSelectedCourseId();
  });
  const paidStatus = item => /paid|success|received|complete/i.test(item.status || "");
  const identityOf = item => String(item.email || item.contact || item.name || "").trim().toLowerCase();
  const leadKeyOf = item => `${identityOf(item)}|${courseIdFrom(item)}`;
  const isSystemLead = item => /^(admin-session|admin-student-access)$/i.test(String(item.source || ""));
  const isFreeSignup = item => !paidStatus(item) && !item.entitlement && item.role !== "premium" && !/paid|success|premium/i.test(item.purchaseStatus || "");
  const normalizeSignupRow = item => {
    const courseId = courseIdFrom(item);
    return {
      ...item,
      orderId:item.orderId || item.id || "",
      product:item.product || item.course || defaultCourseTitle,
      course:item.course || item.product || defaultCourseTitle,
      courseId,
      courseIds:Array.isArray(item.courseIds) && item.courseIds.length ? item.courseIds.map(normalizeCourseId).filter(Boolean) : [courseId],
      source:item.source || "course-signup-server",
      remoteSignup:true
    };
  };
  const readAllLeads = () => {
    const seen = new Set();
    return readLeads().concat(readSignupInbox()).concat(remoteSignups.filter(isFreeSignup)).map(normalizeSignupRow).filter(item => {
      const key = leadKeyOf(item);
      if (!identityOf(item) || seen.has(key) || isSystemLead(item)) return false;
      seen.add(key);
      return true;
    });
  };
  const renderSignupInboxPanel = leads => {
    const view = document.getElementById("customers");
    if (!view) return;
    let panel = document.getElementById("signupInboxPanel");
    if (!leads.length) {
      if (panel) panel.remove();
      return;
    }
    if (!panel) {
      panel = document.createElement("article");
      panel.id = "signupInboxPanel";
      panel.className = "card signup-inbox-panel";
      const metrics = view.querySelector(".metrics");
      if (metrics) metrics.insertAdjacentElement("beforebegin", panel);
      else view.appendChild(panel);
    }
    panel.innerHTML = `<div class="head"><div><h2>Đăng ký mới từ website</h2><p>Danh sách học viên Free vừa đăng ký, bấm "Điền form" để nâng Premium hoặc chỉnh quyền.</p></div><span class="badge">${leads.length} lead</span></div>`+
      `<div class="signup-inbox-list">${leads.slice(0,8).map(item => {
        const key = esc(identityOf(item));
        return `<div class="signup-inbox-item"><div><b>${esc(item.name || "Lead Free")}</b><span>${esc(item.email || item.contact || "Chưa có email")} · ${esc(item.course || item.product || defaultCourseTitle)} · ${esc(item.source || "course-signup")}</span></div><button type="button" data-fill-lead="${key}">Điền form</button></div>`;
      }).join("")}</div><div class="signup-inbox-note">Live API hiện chưa nối server chung, nên hộp này đọc các đăng ký đã lưu trên trình duyệt/domain hiện tại.</div>`;
  };
  const showSignupInboxAlert = count => {
    let node = document.getElementById("signupInboxAlert");
    if (!count) {
      if (node) node.remove();
      return;
    }
    if (!node) {
      node = document.createElement("button");
      node.type = "button";
      node.id = "signupInboxAlert";
      node.className = "signup-inbox-alert";
      node.innerHTML = '<i>!</i><div><b>Đăng ký mới: <em data-count>0</em></b><span>Bấm để xem danh sách đăng ký.</span></div>';
      node.addEventListener("click", () => {
        const btn = document.querySelector('[data-view="customers"]');
        if (btn) btn.click();
        const panel = document.getElementById("signupInboxPanel") || document.getElementById("customerRows");
        panel?.scrollIntoView({ behavior:"smooth", block:"start" });
      });
      document.body.appendChild(node);
    }
    const countNode = node.querySelector("[data-count]");
    if (countNode) countNode.textContent = String(count);
    node.classList.add("show");
  };
  const loadRemoteSignups = async (options = {}) => {
    const statusNode = document.getElementById("paymentStatus");
    try {
      const response = await fetch(apiUrl("/api/passport/course-signups"), { cache:"no-store" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.ok || !Array.isArray(body.data)) throw new Error(body.error || `HTTP ${response.status}`);
      remoteSignups = body.data.map(normalizeSignupRow);
      collectCourseCatalog();
      render();
      showSignupInboxAlert(readAllLeads().filter(item => item.source !== "passport-payment-admin").length);
      if (!options.silent && statusNode) statusNode.textContent = `Đã nạp ${remoteSignups.length} học viên đăng ký từ server.`;
    } catch (error) {
      if (!options.silent && statusNode) statusNode.textContent = "Chưa nạp được danh sách đăng ký từ server: " + (error.message || "");
    }
  };
  const syncCourseEntitlement = async record => {
    if (!paidStatus(record)) return { ok:true, skipped:true, reason:"not_paid" };
    const email = String(record.email || "").trim().toLowerCase();
    if (!email) return { ok:false, skipped:true, reason:"missing_email" };
    const active = (record.accessStatus || "active") === "active";
    const premium = active && (record.accessPackage || "premium") !== "free";
    const courseId = courseIdFrom(record);
    const payload = {
      course:record.product || defaultCourseTitle,
      courseId,
      courseIds:[courseId],
      name:record.name || "",
      email,
      contact:record.contact || "",
      note:"Cấp quyền từ Passport thanh toán",
      role:premium ? "premium" : "free",
      source:"passport-payment-admin",
      funnelStage:premium ? "paid_student" : "paid_no_course_access",
      purchaseStatus:"paid",
      status:"paid",
      entitlement:premium,
      accessPackage:record.accessPackage || "premium",
      accessStatus:record.accessStatus || "active",
      orderId:record.orderId || "",
      paidAt:record.updatedAt || record.createdAt || new Date().toISOString()
    };
    const response = await fetch(apiUrl("/api/passport/course-signups"), {
      method:"POST",
      cache:"no-store",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) throw new Error(body.error || `Course entitlement HTTP ${response.status}`);
    return body;
  };
  const syncFingerprint = item => [
    item.orderId || "",
    item.product || "",
    item.courseId || courseIdFrom(item),
    item.email || "",
    item.accessPackage || "premium",
    item.accessStatus || "active",
    Number(item.amount || 0).toFixed(2),
    item.currency || "VND",
    item.status || "",
    item.name || "",
    item.contact || ""
  ].join("|");
  const financeEndpoint = () => {
    const raw = String(window.DUCPT_LOCAL_FINANCE_API || "http://127.0.0.1:8790/api/finance-revenue").trim();
    return /\/api\/finance-revenue\/?$/i.test(raw) ? raw : raw.replace(/\/$/, "") + "/api/finance-revenue";
  };
  const pushRevenueToDGOffice = async record => {
    if (!paidStatus(record)) return { ok:true, skipped:true, reason:"not_paid" };
    const payload = {
      source:"ducpt-passport",
      site:"ducpt.com",
      url:location.href.split("#")[0],
      orderId:record.orderId,
      product:record.product || "Khóa học DUCPT",
      courseId:courseIdFrom(record),
      amount:Number(record.amount || 0),
      currency:record.currency === "USD" ? "USD" : "VND",
      status:record.status || "paid",
      paymentSource:record.paymentSource || "manual",
      name:record.name || "",
      email:String(record.email || "").trim().toLowerCase(),
      contact:record.contact || "",
      customers:1,
      licenses:record.entitlement ? 1 : 0,
      orders:1,
      revenueTrusted:true,
      createdAt:record.createdAt || "",
      updatedAt:record.updatedAt || "",
      note:"Passport payment sync"
    };
    const response = await fetch(financeEndpoint(), {
      method:"POST",
      mode:"cors",
      cache:"no-store",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) throw new Error(body.error || `DG Office HTTP ${response.status}`);
    return body;
  };
  let syncInFlight = false;
  const syncPaidRecordsToDGOffice = async (options = {}) => {
    if (syncInFlight) return;
    const statusNode = document.getElementById("paymentStatus");
    const targets = records.filter(item => paidStatus(item) && (!item.dgOfficeSyncedAt || item.dgOfficeSyncError || item.dgOfficeSyncFingerprint !== syncFingerprint(item)));
    if (!targets.length) return;
    syncInFlight = true;
    let ok = 0;
    let failed = 0;
    if (!options.silent && statusNode) statusNode.textContent = `Đang đẩy ${targets.length} dòng tiền cũ sang DG Office 8790...`;
    for (const target of targets) {
      try {
        const result = await pushRevenueToDGOffice(target);
        const patched = {
          ...target,
          dgOfficeSyncedAt:new Date().toISOString(),
          dgOfficeLedger:result.ledger?.path || target.dgOfficeLedger || "",
          dgOfficeSyncError:"",
          dgOfficeSyncFingerprint:syncFingerprint(target)
        };
        records = records.map(item => item.orderId === patched.orderId ? patched : item);
        ok += 1;
      } catch (error) {
        const patched = {
          ...target,
          dgOfficeSyncError:error.message || "Không gọi được DG Office",
          dgOfficeSyncFingerprint:syncFingerprint(target)
        };
        records = records.map(item => item.orderId === patched.orderId ? patched : item);
        failed += 1;
      }
      localStorage.setItem(key, JSON.stringify(records));
    }
    syncInFlight = false;
    if (statusNode && (!options.silent || failed)) {
      statusNode.textContent = failed ? `Đã đẩy ${ok} dòng, ${failed} dòng chưa sang được DG Office 8790.` : `Đã đẩy ${ok} dòng tiền sang DG Office 8790.`;
    }
  };
  let entitlementSyncInFlight = false;
  const syncCourseEntitlements = async (options = {}) => {
    if (entitlementSyncInFlight) return;
    const statusNode = document.getElementById("paymentStatus");
    const targets = records.filter(item => paidStatus(item) && item.email && (!item.courseEntitlementSyncedAt || item.courseEntitlementError || item.courseEntitlementFingerprint !== syncFingerprint(item)));
    if (!targets.length) return;
    entitlementSyncInFlight = true;
    let ok = 0, failed = 0;
    if (!options.silent && statusNode) statusNode.textContent = `Đang đồng bộ quyền học cho ${targets.length} học viên...`;
    for (const target of targets) {
      try {
        await syncCourseEntitlement(target);
        const patched = {...target, courseEntitlementSyncedAt:new Date().toISOString(), courseEntitlementError:"", courseEntitlementFingerprint:syncFingerprint(target)};
        records = records.map(item => item.orderId === patched.orderId ? patched : item);
        ok += 1;
      } catch (error) {
        const patched = {...target, courseEntitlementError:error.message || "Không đồng bộ được quyền học", courseEntitlementFingerprint:syncFingerprint(target)};
        records = records.map(item => item.orderId === patched.orderId ? patched : item);
        failed += 1;
      }
      localStorage.setItem(key, JSON.stringify(records));
    }
    entitlementSyncInFlight = false;
    if (statusNode && (!options.silent || failed)) statusNode.textContent = failed ? `Đã mở ${ok} quyền, ${failed} dòng chưa đồng bộ được.` : `Đã đồng bộ ${ok} quyền học.`;
  };
  const render = () => {
    const paid = records.filter(item => /paid|success/i.test(item.status || ""));
    const paidKeys = new Set(paid.flatMap(item => [item.email, item.contact].map(x => String(x || "").trim().toLowerCase()).filter(Boolean)));
    const freeLeads = readAllLeads().filter(item => {
      const k = String(item.email || item.contact || item.name || "").trim().toLowerCase();
      return k && !paidKeys.has(k) && !/paid|success|premium/i.test(item.purchaseStatus || item.status || "");
    });
    const learners = records.filter(item => item.entitlement || /paid|success/i.test(item.status || ""));
    const activeLearners = learners.filter(item => item.entitlement && (item.accessStatus || "active") === "active");
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    set("paidMetric", paid.length); set("customerMetric", new Set([...learners.map(x => x.contact || x.name), ...freeLeads.map(x => x.email || x.contact || x.name)].filter(Boolean)).size);
    set("newCustomerMetric", learners.length + freeLeads.length); set("activeCustomerMetric", activeLearners.length);
    const totals = paid.reduce((sum, item) => { const currency = item.currency || "VND"; sum[currency] = (sum[currency] || 0) + Number(item.amount || 0); return sum; }, {});
    let fx = { usdToVnd: 25000, baseCurrency: "VND" }; try { fx = Object.assign(fx, JSON.parse(localStorage.getItem("ducpt_settings_v1") || "{}")); } catch {}
    const rate = Number(fx.usdToVnd) > 0 ? Number(fx.usdToVnd) : 25000;
    const totalVnd = (totals.VND || 0) + (totals.USD || 0) * rate;
    const revenueText = fx.baseCurrency === "USD" ? money(totalVnd / rate, "USD") : money(totalVnd, "VND");
    const revenue = document.querySelector('[data-kpi="revenue"]'); if (revenue) revenue.textContent = revenueText;
    const pendingCount = records.filter(item => !/paid|success/i.test(item.status || "")).length;
    const setAll = (sel, value) => document.querySelectorAll(sel).forEach(node => { node.textContent = value; });
    setAll('[data-cockpit="revenue"]', revenueText);
    setAll('[data-cockpit="paid"]', paid.length);
    setAll('[data-cockpit="pending"]', pendingCount);
    setAll('[data-cockpit="customers"]', new Set([...learners.map(x => x.contact || x.name), ...freeLeads.map(x => x.email || x.contact || x.name)].filter(Boolean)).size);
    setAll('[data-cockpit="learners"]', activeLearners.length);
    const rows = document.getElementById("customerRows");
    const header = rows?.previousElementSibling; header?.querySelector('[data-actions-head]')?.remove();
    const paidRows = learners.slice().reverse().map(x => `<div class="row"><span>${esc(x.name || "Học viên")}</span><span>${esc(x.email || x.contact || "Chưa cập nhật")}</span><span>${esc(x.product || defaultCourseTitle)}<small>${esc(courseIdFrom(x))}</small></span><span>${x.paymentSource === "app" ? "App" : "Xác nhận thực tế"}</span><span><select class="access-select" data-access-package="${esc(x.orderId)}"><option value="free"${x.entitlement ? "" : " selected"}>Free</option><option value="premium"${x.entitlement ? " selected" : ""}>Premium</option></select></span></div>`);
    const leadRows = freeLeads.map(x => {
      const plan = Array.isArray(x.nurturePlan) ? x.nurturePlan : [];
      const next = plan.find(step => Number(step.day) >= Number(x.nextEmailDay || 0)) || plan[0] || {};
      const key = String(x.email || x.contact || x.name || "").trim().toLowerCase();
      return `<div class="row"><span>${esc(x.name || "Lead Free")}</span><span>${esc(x.email || x.contact || "Chưa cập nhật")}</span><span>${esc(x.course || defaultCourseTitle)}<small>${esc(normalizeCourseId(x.course || defaultCourseId) || defaultCourseId)}</small></span><span>${esc(x.source || "Course")}</span><span><select class="access-select" data-upgrade-lead-select="${esc(key)}"><option value="free" selected>Free</option><option value="premium">Premium</option></select></span></div>`;
    });
    if (rows) rows.innerHTML = paidRows.concat(leadRows).join("") || '<div class="row"><span>Chưa có học viên/lead</span><span>—</span><span>—</span><span>—</span><span>—</span></div>';
    renderSignupInboxPanel(freeLeads);
    showSignupInboxAlert(freeLeads.length);
  };
  form?.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = event.currentTarget.querySelector('button[type="submit"]');
    const statusNode = document.getElementById("paymentStatus");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const paid = data.status === "paid";
    const wasEditing = Boolean(editingOrderId);
    const active = (data.accessStatus || "active") === "active";
    const premium = paid && active && (data.accessPackage || "premium") !== "free";
    const selectedOption = selectedCourseOption();
    const courseId = normalizeCourseId(data.courseId || selectedOption?.dataset?.courseId || data.product || defaultCourseId) || defaultCourseId;
    const normalized = {...data, product:data.product || defaultCourseTitle, courseId, courseIds:[courseId], email:String(data.email || "").trim().toLowerCase(), amount:Number(data.amount), currency:data.currency === "USD" ? "USD" : "VND", role:premium ? "premium" : "free", entitlement:premium, accessPackage:data.accessPackage || "premium", accessStatus:data.accessStatus || "active"};
    let savedRecord = null;
    if (submitButton) submitButton.disabled = true;
    try {
      if (editingOrderId) {
        const index = records.findIndex(item => item.orderId === editingOrderId);
        if (index >= 0) {
          savedRecord = {...records[index], ...normalized, updatedAt:new Date().toISOString()};
          records[index] = savedRecord;
        }
      } else {
        savedRecord = {...normalized, orderId:(data.paymentSource === "app" ? "APP-" : "MANUAL-") + Date.now(), createdAt:new Date().toISOString()};
        records.push(savedRecord);
      }
      localStorage.setItem(key, JSON.stringify(records)); render();
      if (statusNode) statusNode.textContent = paid ? "Đã lưu Passport. Đang mở quyền Premium cho học viên..." : "Đã lưu chờ xác nhận.";
      if (paid && savedRecord) {
        try {
          await syncCourseEntitlement(savedRecord);
          savedRecord.courseEntitlementSyncedAt = new Date().toISOString();
          savedRecord.courseEntitlementError = "";
          savedRecord.courseEntitlementFingerprint = syncFingerprint(savedRecord);
          records = records.map(item => item.orderId === savedRecord.orderId ? {...item, ...savedRecord} : item);
          localStorage.setItem(key, JSON.stringify(records));
          if (statusNode) statusNode.textContent = "Đã mở quyền Premium. Đang đẩy về DG Office 8790...";
        } catch (error) {
          savedRecord.courseEntitlementError = error.message || "Không mở được quyền Premium";
          records = records.map(item => item.orderId === savedRecord.orderId ? {...item, ...savedRecord} : item);
          localStorage.setItem(key, JSON.stringify(records));
          if (statusNode) statusNode.textContent = "Đã lưu thanh toán, nhưng chưa mở được quyền Premium: " + savedRecord.courseEntitlementError;
        }
        try {
          const result = await pushRevenueToDGOffice(savedRecord);
          savedRecord.dgOfficeSyncedAt = new Date().toISOString();
          savedRecord.dgOfficeLedger = result.ledger?.path || "";
          savedRecord.dgOfficeSyncError = "";
          savedRecord.dgOfficeSyncFingerprint = syncFingerprint(savedRecord);
          records = records.map(item => item.orderId === savedRecord.orderId ? {...item, ...savedRecord} : item);
          localStorage.setItem(key, JSON.stringify(records));
          if (statusNode) statusNode.textContent = result.ledger?.replaced ? "Đã mở Premium và cập nhật ledger DG Office 8790." : "Đã mở Premium và đẩy doanh thu vào DG Office 8790.";
        } catch (error) {
          savedRecord.dgOfficeSyncError = error.message || "Không gọi được DG Office";
          records = records.map(item => item.orderId === savedRecord.orderId ? {...item, ...savedRecord} : item);
          localStorage.setItem(key, JSON.stringify(records));
          if (statusNode) statusNode.textContent = "Đã lưu Passport, nhưng DG Office 8790 chưa nhận: " + savedRecord.dgOfficeSyncError;
        }
      } else if (statusNode && wasEditing) {
        statusNode.textContent = "Đã cập nhật thông tin học viên.";
      }
    } finally {
      editingOrderId = "";
      if (submitButton) {
        submitButton.textContent = "Lưu thanh toán & cập nhật học viên";
        submitButton.disabled = false;
      }
      event.currentTarget.reset();
      refreshCourseSelect(defaultCourseTitle, defaultCourseId);
      if (event.currentTarget.elements.courseId) event.currentTarget.elements.courseId.value = defaultCourseId;
      if (event.currentTarget.elements.accessPackage) event.currentTarget.elements.accessPackage.value = "premium";
      if (event.currentTarget.elements.accessStatus) event.currentTarget.elements.accessStatus.value = "active";
    }
  });
  const fillPaymentForm = item => {
    if (!form || !item) return;
    const courseId = courseIdFrom(item);
    const data = {
      name:item.name || "",
      contact:item.contact || "",
      email:String(item.email || "").trim().toLowerCase(),
      product:item.product || item.course || defaultCourseTitle,
      courseId,
      amount:item.amount ?? 3000000,
      currency:item.currency || "VND",
      paymentSource:item.paymentSource || "manual",
      status:item.status || "paid",
      accessPackage:item.accessPackage || "premium",
      accessStatus:item.accessStatus || "active"
    };
    refreshCourseSelect(data.product, courseId);
    Object.entries(data).forEach(([name, value]) => { const field = form.elements[name]; if (field) field.value = value; });
    syncSelectedCourseId();
    form.querySelector('button[type="submit"]').textContent = item.orderId ? "Lưu thay đổi" : "Lưu & mở Premium cho học viên";
    form.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  const updateCourseAccess = async (orderId, patch) => {
    const statusNode = document.getElementById("paymentStatus");
    const item = records.find(x => x.orderId === orderId);
    if (!item) return;
    const courseId = courseIdFrom({ ...item, ...patch });
    const next = { ...item, ...patch, courseId, courseIds:[courseId], updatedAt:new Date().toISOString() };
    records = records.map(x => x.orderId === orderId ? next : x);
    localStorage.setItem(key, JSON.stringify(records));
    render();
    if (statusNode) statusNode.textContent = next.entitlement ? "Đang mở Premium cho đúng khóa..." : "Đang khóa quyền học...";
    try {
      await syncCourseEntitlement(next);
      records = records.map(x => x.orderId === orderId ? { ...next, courseEntitlementSyncedAt:new Date().toISOString(), courseEntitlementError:"", courseEntitlementFingerprint:syncFingerprint(next) } : x);
      localStorage.setItem(key, JSON.stringify(records));
      if (statusNode) statusNode.textContent = next.entitlement ? "Đã mở Premium cho khóa này." : "Đã khóa quyền học cho khóa này.";
    } catch (error) {
      records = records.map(x => x.orderId === orderId ? { ...next, courseEntitlementError:error.message || "Không đồng bộ được quyền học" } : x);
      localStorage.setItem(key, JSON.stringify(records));
      if (statusNode) statusNode.textContent = "Đã lưu local, nhưng chưa đồng bộ được quyền học: " + (error.message || "");
    }
    render();
  };
  document.getElementById("customers")?.addEventListener("click", async event => {
    const edit = event.target.closest("[data-edit]");
    const remove = event.target.closest("[data-delete]");
    const open = event.target.closest("[data-open]");
    const pause = event.target.closest("[data-pause]");
    const upgrade = event.target.closest("[data-upgrade-lead]");
    const fillLead = event.target.closest("[data-fill-lead]");
    if (edit) { const item = records.find(x => x.orderId === edit.dataset.edit); if (!item) return; editingOrderId = item.orderId; fillPaymentForm(item); return; }
    if (open) { await updateCourseAccess(open.dataset.open, { status:"paid", purchaseStatus:"paid", accessPackage:"premium", accessStatus:"active", role:"premium", entitlement:true }); return; }
    if (pause) { await updateCourseAccess(pause.dataset.pause, { accessStatus:"paused", accessPackage:"premium", role:"free", entitlement:false }); return; }
    if (upgrade) {
      const leadKeyValue = String(upgrade.dataset.upgradeLead || "").trim().toLowerCase();
      const lead = readAllLeads().find(x => [x.email, x.contact, x.name].map(v => String(v || "").trim().toLowerCase()).includes(leadKeyValue));
      editingOrderId = "";
      fillPaymentForm({ name:lead?.name || "", contact:lead?.contact || "", email:lead?.email || "", product:lead?.course || defaultCourseTitle, courseId:normalizeCourseId(lead?.course || defaultCourseId) || defaultCourseId, amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", accessPackage:"premium", accessStatus:"active" });
      const statusNode = document.getElementById("paymentStatus");
      if (statusNode) statusNode.textContent = "Kiểm tra email, khóa học và số tiền rồi bấm Lưu để nâng Premium.";
      return;
    }
    if (fillLead) {
      const leadKeyValue = String(fillLead.dataset.fillLead || "").trim().toLowerCase();
      const lead = readAllLeads().find(x => [x.email, x.contact, x.name].map(v => String(v || "").trim().toLowerCase()).includes(leadKeyValue));
      fillPaymentForm({ name:lead?.name || "", contact:lead?.contact || "", email:lead?.email || "", product:lead?.course || defaultCourseTitle, courseId:normalizeCourseId(lead?.courseId || lead?.course || defaultCourseId) || defaultCourseId, amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", accessPackage:"premium", accessStatus:"active" });
      const statusNode = document.getElementById("paymentStatus");
      if (statusNode) statusNode.textContent = "Đã điền thông tin đăng ký mới. Kiểm tra rồi bấm Lưu để mở Premium.";
      return;
    }
    if (remove && confirm("Xóa học viên và giao dịch này?")) { records = records.filter(x => x.orderId !== remove.dataset.delete); localStorage.setItem(key, JSON.stringify(records)); if(editingOrderId===remove.dataset.delete) editingOrderId=""; render(); }
  });
  document.getElementById("customerRows")?.addEventListener("change", async event => {
    const select = event.target.closest("[data-access-package]");
    const leadSelect = event.target.closest("[data-upgrade-lead-select]");
    if (select) {
      const orderId = select.dataset.accessPackage;
      if (select.value === "premium") {
        await updateCourseAccess(orderId, { status:"paid", purchaseStatus:"paid", accessPackage:"premium", accessStatus:"active", role:"premium", entitlement:true });
      } else {
        await updateCourseAccess(orderId, { accessPackage:"free", accessStatus:"paused", role:"free", entitlement:false });
      }
      return;
    }
    if (leadSelect && leadSelect.value === "premium") {
      const leadKeyValue = String(leadSelect.dataset.upgradeLeadSelect || "").trim().toLowerCase();
      const lead = readAllLeads().find(x => [x.email, x.contact, x.name].map(v => String(v || "").trim().toLowerCase()).includes(leadKeyValue));
      fillPaymentForm({ name:lead?.name || "", contact:lead?.contact || "", email:lead?.email || "", product:lead?.course || defaultCourseTitle, courseId:normalizeCourseId(lead?.course || defaultCourseId) || defaultCourseId, amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", accessPackage:"premium", accessStatus:"active" });
      const statusNode = document.getElementById("paymentStatus");
      if (statusNode) statusNode.textContent = "Lead đang là Free. Kiểm tra thanh toán rồi bấm Lưu để mở Premium.";
      leadSelect.value = "free";
    }
  });
  const reloadLocalRecords = () => {
    let next = [];
    try { next = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
    records = (Array.isArray(next) ? next : []).map((item, index) => {
      const courseId = courseIdFrom(item);
      return {
        ...item,
        orderId:item.orderId || `LEGACY-${item.createdAt || Date.now()}-${index}`,
        product:item.product === "Khóa học 1" ? defaultCourseTitle : (item.product || defaultCourseTitle),
        courseId,
        courseIds:Array.isArray(item.courseIds) && item.courseIds.length ? item.courseIds.map(normalizeCourseId).filter(Boolean) : [courseId],
        accessPackage:item.accessPackage || (item.entitlement ? "premium" : "free"),
        accessStatus:item.accessStatus || "active"
      };
    });
    if (!records.some(item => item.orderId === seed.orderId)) {
      records.push(seed);
      try { localStorage.setItem(key, JSON.stringify(records)); } catch {}
    }
  };
  const refreshCustomerRows = () => {
    reloadLocalRecords();
    collectCourseCatalog();
    render();
  };
  window.addEventListener("storage", event => {
    if ([key, leadKey, signupInboxKey, studentProfileKey, registerKey, "ducpt_courses_v2"].includes(event.key)) refreshCustomerRows();
  });
  window.addEventListener("focus", refreshCustomerRows);
  window.addEventListener("pageshow", refreshCustomerRows);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshCustomerRows(); });
  window.addEventListener("ducpt:settings", render);
  document.getElementById("cockpitRefresh")?.addEventListener("click", () => { loadRemoteSignups(); render(); syncCourseEntitlements(); syncPaidRecordsToDGOffice(); });
  loadCourseCatalog();
  render();
  setTimeout(() => loadRemoteSignups({silent:true}), 250);
  setTimeout(() => syncCourseEntitlements({silent:true}), 500);
  setTimeout(() => syncPaidRecordsToDGOffice({silent:true}), 800);
})();
