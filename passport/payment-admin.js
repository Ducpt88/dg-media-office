(() => {
  const key = "ducpt_orders_v1";
  const seed = { orderId:"MANUAL-20260711-001", name:"Học viên chưa cập nhật tên", contact:"", product:"Khóa học 1", amount:3000000, currency:"VND", paymentSource:"manual", status:"paid", entitlement:true, createdAt:"2026-07-11T00:00:00+07:00" };
  let records = [];
  try { records = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  if (!records.some(item => item.orderId === seed.orderId)) records.push(seed);
  localStorage.setItem(key, JSON.stringify(records));
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
    if (rows) rows.innerHTML = learners.slice().reverse().map(x => `<div class="row"><span>${x.name || "Học viên"}</span><span>${x.contact || "Chưa cập nhật"}</span><span>${x.product || "Khóa học"}</span><span>${x.paymentSource === "app" ? "App" : "Xác nhận thực tế"}</span><span>${x.entitlement ? "Đã mở" : "Đang khóa"}</span></div>`).join("");
  };
  document.getElementById("paymentForm")?.addEventListener("submit", event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); const paid = data.status === "paid";
    records.push({...data, orderId:(data.paymentSource === "app" ? "APP-" : "MANUAL-") + Date.now(), amount:Number(data.amount), currency:data.currency === "USD" ? "USD" : "VND", entitlement:paid, createdAt:new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(records)); render();
    document.getElementById("paymentStatus").textContent = paid ? "Đã cộng doanh thu, thêm học viên và mở quyền học." : "Đã lưu chờ xác nhận.";
  });
  render();
})();
