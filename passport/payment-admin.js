(() => {
  const key = "ducpt_orders_v1";
  const seed = { orderId:"MANUAL-20260711-001", name:"Học viên chưa cập nhật tên", contact:"", product:"Khóa học 1", amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", entitlement:true, createdAt:"2026-07-11T00:00:00+07:00" };
  let records = [];
  try { records = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  if (!records.some(item => item.orderId === seed.orderId)) records.push(seed);
  localStorage.setItem(key, JSON.stringify(records));
  let editingOrderId = "";
  const form = document.getElementById("paymentForm");
  const style = document.createElement("style");
  style.textContent = `
    #paymentForm{padding:20px!important}#paymentForm .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 22px}
    #paymentForm label{display:grid;grid-template-columns:150px minmax(0,1fr);align-items:center;gap:12px;font-size:13px;font-weight:700}
    #paymentForm .searchbox{width:100%;min-width:0}#paymentForm>button{margin-top:18px!important}#paymentStatus{display:inline-block;margin:18px 0 0 12px;color:var(--green);font-size:12px}
    #customerRows .row,.view#customers .headrow{grid-template-columns:1.1fr 1.15fr 1.1fr .9fr .7fr .8fr}.customer-actions{display:flex!important;gap:6px;padding:7px!important}
    .customer-actions button{padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;font-weight:700;cursor:pointer}.customer-actions .delete{color:#b42318}
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
  const money = (value, currency = "VND") => new Intl.NumberFormat(currency === "USD" ? "en-US" : "vi-VN", { style:"currency", currency }).format(Number(value) || 0);
  const render = () => {
    const paid = records.filter(item => /paid|success/i.test(item.status || ""));
    const learners = records.filter(item => item.entitlement || /paid|success/i.test(item.status || ""));
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    set("paidMetric", paid.length); set("customerMetric", new Set(learners.map(x => x.contact || x.name).filter(Boolean)).size);
    set("newCustomerMetric", learners.length); set("activeCustomerMetric", learners.length);
    const totals = paid.reduce((sum, item) => { const currency = item.currency || "VND"; sum[currency] = (sum[currency] || 0) + Number(item.amount || 0); return sum; }, {});
    const revenue = document.querySelector('[data-kpi="revenue"]'); if (revenue) revenue.textContent = ["VND", "USD"].filter(currency => totals[currency]).map(currency => money(totals[currency], currency)).join(" · ") || money(0, "VND");
    const rows = document.getElementById("customerRows");
    const header = rows?.previousElementSibling; if (header && !header.querySelector('[data-actions-head]')) header.insertAdjacentHTML("beforeend", '<span data-actions-head>Thao tác</span>');
    if (rows) rows.innerHTML = learners.slice().reverse().map(x => `<div class="row"><span>${x.name || "Học viên"}</span><span>${x.contact || "Chưa cập nhật"}</span><span>${x.product || "Khóa học"}</span><span>${x.paymentSource === "app" ? "App" : "Xác nhận thực tế"}</span><span>${x.entitlement ? "Đã mở" : "Đang khóa"}</span><span class="customer-actions"><button type="button" data-edit="${x.orderId}">Sửa</button><button type="button" class="delete" data-delete="${x.orderId}">Xóa</button></span></div>`).join("");
  };
  form?.addEventListener("submit", event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); const paid = data.status === "paid";
    const normalized = {...data, amount:Number(data.amount), currency:data.currency === "USD" ? "USD" : "VND", entitlement:paid};
    if (editingOrderId) { const index = records.findIndex(item => item.orderId === editingOrderId); if (index >= 0) records[index] = {...records[index], ...normalized, updatedAt:new Date().toISOString()}; }
    else records.push({...normalized, orderId:(data.paymentSource === "app" ? "APP-" : "MANUAL-") + Date.now(), createdAt:new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(records)); render();
    document.getElementById("paymentStatus").textContent = editingOrderId ? "Đã cập nhật thông tin học viên." : paid ? "Đã cộng doanh thu, thêm học viên và mở quyền học." : "Đã lưu chờ xác nhận.";
    editingOrderId = ""; event.currentTarget.querySelector('button[type="submit"]').textContent = "Lưu thanh toán & cập nhật học viên"; event.currentTarget.reset();
  });
  document.getElementById("customerRows")?.addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]"); const remove = event.target.closest("[data-delete]");
    if (edit) { const item = records.find(x => x.orderId === edit.dataset.edit); if (!item) return; editingOrderId = item.orderId; ["name","contact","product","amount","currency","paymentSource","status"].forEach(name => { const field=form.elements[name]; if(field) field.value=item[name] ?? ""; }); form.querySelector('button[type="submit"]').textContent="Lưu thay đổi"; form.scrollIntoView({behavior:"smooth",block:"start"}); }
    if (remove && confirm("Xóa học viên và giao dịch này?")) { records = records.filter(x => x.orderId !== remove.dataset.delete); localStorage.setItem(key, JSON.stringify(records)); if(editingOrderId===remove.dataset.delete) editingOrderId=""; render(); }
  });
  render();
})();
