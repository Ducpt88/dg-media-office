(function simplifyDgSkillsMapPanel() {
  const ADMIN = /(\?|&)admin=1/.test(location.search);
  const HIDE_LABEL_PREFIXES = [
    "TEN",
    "ICON",
    "MAU SAC",
    "HINH DANG",
    "KICH CO",
    "NHANH CON",
    "NHAN VAT"
  ];

  function norm(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/Đ/g, "D")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function isLabelToHide(text) {
    const value = norm(text);
    return HIDE_LABEL_PREFIXES.some(prefix => value === prefix || value.startsWith(prefix + " "));
  }

  function hide(el) {
    if (el) el.classList.add("dg-hidden-admin-field");
  }

  function unhide(el) {
    if (el) el.classList.remove("dg-hidden-admin-field");
  }

  function cleanupNodePanel() {
    const canvasStage = document.querySelector("canvas") && document.querySelector("canvas").parentElement;
    if (canvasStage) {
      canvasStage.classList.add("dg-skills-map-stage", "dg-map-fit-stage");
      if (!canvasStage.dataset.dgResizeSent) {
        canvasStage.dataset.dgResizeSent = "1";
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
        setTimeout(() => window.dispatchEvent(new Event("resize")), 400);
      }
    }

    const title = [...document.querySelectorAll(".page-header__title, h1")].find(el => {
      const value = norm(el.textContent);
      return value.includes("SKILLS MAP") || value.includes("BAN DO DIEU KHIEN");
    });
    if (title) {
      const header = title.closest(".page-header") || title.parentElement;
      if (header) header.classList.add("dg-compact-skills-header");

      const stage = [...document.querySelectorAll("div")].find(el => {
        const style = el.getAttribute("style") || "";
        return style.includes("height: calc(100vh - 160px)") && el.querySelector("canvas");
      });
      if (stage) stage.classList.add("dg-skills-map-stage", "dg-map-fit-stage");
    }

    const orbitLabels = new Set([
      "TEAM LEADER",
      "D-GIN",
      "OPERATIONS TEAM",
      "BRAND STUDIO",
      "MONEY X3",
      "CONTENT SOCIAL",
      "PRODUCT CODE",
      "CODEX X5",
      "QA GATE",
      "FOUNDER"
    ]);
    [...document.querySelectorAll(".dg-skills-map-stage div")].forEach(el => {
      const value = norm(el.textContent);
      if (orbitLabels.has(value)) {
        hide(el.closest("div[style*='translate(-50%,-50%)']") || el.parentElement);
      }
    });

    const labels = [...document.querySelectorAll("div")].filter(el => {
      const value = norm(el.textContent);
      if (!value || value.length > 40) return false;
      return isLabelToHide(value);
    });

    labels.forEach(label => {
      const value = norm(label.textContent);
      const target = (value.startsWith("HINH DANG") || value.startsWith("KICH CO"))
        ? label.parentElement && label.parentElement.parentElement
        : label.parentElement;
      if (ADMIN) unhide(target);
      else hide(target);
    });

    [...document.querySelectorAll("button")].forEach(btn => {
      const value = norm(btn.textContent);
      if (ADMIN && (value === "XOA" || value.includes("XOA") || value.includes("SUA") || value.includes("LUU"))) {
        unhide(btn);
        return;
      }
      if (!ADMIN && (value.includes("THEM NHANH") || value === "XOA" || value.includes("XOA"))) {
        hide(btn);
      }
      if (!ADMIN && btn.getAttribute("title") && norm(btn.getAttribute("title")).includes("KHOA")) {
        hide(btn);
      }
    });

    [...document.querySelectorAll("div")].forEach(el => {
      const value = norm(el.textContent);
      if (value.includes("NODE DA KHOA") || value.includes("KHONG THE KEO")) {
        if (ADMIN) unhide(el);
        else hide(el);
      }
    });
  }

  const run = () => window.requestAnimationFrame(cleanupNodePanel);
  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", run);
  window.addEventListener("load", run);
  run();
})();

/* Admin node helper: add reliable edit/delete tools to the selected node panel. */
(function dgNodeAdminTools() {
  if (!/(\?|&)admin=1/.test(location.search)) return;
  const NODE_KEY = "skillsmap_orgnodes_v2";
  const DELETED_KEY = "skillsmap_deleted_orgnodes_v2";

  function norm(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function readNodes() {
    try {
      const value = JSON.parse(localStorage.getItem(NODE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeNodes(nodes) {
    localStorage.setItem(NODE_KEY, JSON.stringify(nodes));
    window.dispatchEvent(new Event("storage"));
  }

  function readDeletedIds() {
    try {
      const value = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
      return new Set((Array.isArray(value) ? value : []).map(id => String(id)));
    } catch {
      return new Set();
    }
  }

  function writeDeletedIds(ids) {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]));
  }

  function findSelectedPanel() {
    return [...document.querySelectorAll("div")].find(el => {
      if (el.id === "dg-ops-dock" || el.closest("#dg-ops-dock")) return false;
      const style = el.getAttribute("style") || "";
      return style.includes("position: absolute")
        && style.includes("left: 12px")
        && style.includes("width: 280px")
        && (el.querySelector("input") || el.querySelector("textarea"));
    }) || null;
  }

  function selectedName(panel) {
    const inputs = [...panel.querySelectorAll("input, textarea")].filter(input => {
      const type = (input.getAttribute("type") || "text").toLowerCase();
      return type !== "color" && type !== "range" && type !== "number" && String(input.value || "").trim();
    });
    const nodes = readNodes();
    const values = inputs.map(input => String(input.value || "").trim()).filter(Boolean);
    const exact = values.find(value => nodes.some(node => norm(node.name) === norm(value)));
    if (exact) return exact;
    return values[0] || "";
  }

  function findNodeByName(nameOrId) {
    const raw = String(nameOrId || "").trim();
    const nodes = readNodes();
    let index = nodes.findIndex(node => String(node.id) === raw);
    const wanted = norm(raw);
    if (index < 0) index = nodes.findIndex(node => norm(node.name) === wanted);
    if (index < 0) index = nodes.findIndex(node => norm(node.label || node.title || node.id) === wanted);
    return { nodes, index, node: index >= 0 ? nodes[index] : null };
  }

  function deleteNode(panel, explicitId) {
    const name = explicitId || selectedName(panel);
    if (!name) {
      alert("Chua nhan duoc ten node dang chon. Bam lai vao cham tron/node roi thu lai.");
      return;
    }
    const { nodes, index, node } = findNodeByName(name);
    if (!node || index < 0) {
      alert("Chua tim thay node trong bo nho map: " + name);
      return;
    }
    if (!confirm("Xoa node '" + (node.name || name) + "' khoi ban do?")) return;
    const removeIds = new Set([String(node.id)]);
    let changed = true;
    while (changed) {
      changed = false;
      nodes.forEach(item => {
        if (item && item.parentId != null && removeIds.has(String(item.parentId)) && !removeIds.has(String(item.id))) {
          removeIds.add(String(item.id));
          changed = true;
        }
      });
    }
    const deletedIds = readDeletedIds();
    removeIds.forEach(id => deletedIds.add(id));
    writeDeletedIds(deletedIds);
    writeNodes(nodes.filter(item => !removeIds.has(String(item.id))));
    location.reload();
  }

  function nodeOptionsHtml(panel) {
    const current = selectedName(panel);
    const nodes = readNodes();
    const currentNode = current ? findNodeByName(current).node : null;
    return '<select data-dg-node-select>'
      + '<option value="">-- Chon node/circle/square de xoa --</option>'
      + nodes.map(node => {
        const selected = currentNode && String(currentNode.id) === String(node.id) ? " selected" : "";
        const label = (node.name || node.label || node.title || node.id) + (node.locked ? " (seed)" : "");
        return '<option value="' + String(node.id).replace(/"/g, "&quot;") + '"' + selected + '>' + label.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])) + '</option>';
      }).join("")
      + '</select>';
  }

  function ensureTools() {
    const panel = findSelectedPanel();
    if (!panel || panel.querySelector(".dg-node-admin-tools")) return;
    const tools = document.createElement("div");
    tools.className = "dg-node-admin-tools";
    tools.innerHTML = nodeOptionsHtml(panel)
      + '<button type="button" data-dg-node-action="refresh">Lam moi sau khi sua</button>'
      + '<button type="button" class="danger" data-dg-node-action="delete">Xoa node dang chon</button>'
      + '<button type="button" class="danger" data-dg-node-action="delete-select">Xoa node trong danh sach</button>'
      + '<div class="hint">Node co chu (seed) la node mac dinh; xoa bang nut nay se ghi nho de lan sau khong moc lai. Mo ?dgSeed=force neu muon khoi phuc tat ca.</div>';
    tools.addEventListener("click", event => {
      const action = event.target && event.target.getAttribute("data-dg-node-action");
      if (action === "refresh") {
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => location.reload(), 80);
      }
      if (action === "delete") deleteNode(panel);
      if (action === "delete-select") {
        const select = tools.querySelector("[data-dg-node-select]");
        deleteNode(panel, select && select.value);
      }
    });
    panel.appendChild(tools);
  }

  new MutationObserver(ensureTools).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", ensureTools);
  window.addEventListener("load", ensureTools);
  setInterval(ensureTools, 1000);
  ensureTools();
})();

/* Admin map inventory: one reliable delete box for every saved map object. */
(function dgAdminMapInventory() {
  return; // UI da chot: khong hien hop "Rao soat map" noi tren ban do.
  if (!/(\?|&)admin=1/.test(location.search)) return;

  const NODE_KEY = "skillsmap_orgnodes_v2";
  const MEMBER_KEY = "skillsmap_members";
  const CHAR_POS_KEY = "skillsmap_char_positions";
  const DELETED_KEY = "skillsmap_deleted_orgnodes_v2";

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function nodeLabel(node) {
    const shape = node.shape ? " / " + node.shape : "";
    const seed = node.locked ? " / seed" : "";
    return (node.name || node.label || node.title || node.id) + shape + seed;
  }

  function readDeletedIds() {
    const ids = readJson(DELETED_KEY, []);
    return new Set((Array.isArray(ids) ? ids : []).map(id => String(id)));
  }

  function writeDeletedIds(ids) {
    writeJson(DELETED_KEY, [...ids]);
  }

  function collectOptions() {
    const nodes = readJson(NODE_KEY, []);
    const members = readJson(MEMBER_KEY, {});
    const positions = readJson(CHAR_POS_KEY, {});
    const options = [];

    if (Array.isArray(nodes)) {
      nodes
        .slice()
        .sort((a, b) => String(a.parentId || "").localeCompare(String(b.parentId || "")) || String(a.name || a.id).localeCompare(String(b.name || b.id)))
        .forEach(node => {
          options.push({ value: "node|" + String(node.id), label: "Node: " + nodeLabel(node) });
        });
    }

    if (members && typeof members === "object") {
      Object.entries(members).forEach(([nodeId, rows]) => {
        (Array.isArray(rows) ? rows : []).forEach((name, index) => {
          const owner = Array.isArray(nodes) ? nodes.find(node => String(node.id) === String(nodeId)) : null;
          options.push({
            value: "member|" + String(nodeId) + "|" + index,
            label: "Nhan su: " + name + (owner ? " @ " + (owner.name || owner.id) : "")
          });
        });
      });
    }

    if (positions && typeof positions === "object") {
      Object.keys(positions).forEach(id => {
        options.push({ value: "charpos|" + id, label: "Vi tri nhan vat: " + id + " (reset)" });
      });
    }

    return options;
  }

  function deleteNode(id) {
    const nodes = readJson(NODE_KEY, []);
    if (!Array.isArray(nodes)) return false;
    const node = nodes.find(item => String(item.id) === String(id));
    if (!node) return false;

    const removeIds = new Set([String(node.id)]);
    let changed = true;
    while (changed) {
      changed = false;
      nodes.forEach(item => {
        if (item && item.parentId != null && removeIds.has(String(item.parentId)) && !removeIds.has(String(item.id))) {
          removeIds.add(String(item.id));
          changed = true;
        }
      });
    }

    const deletedIds = readDeletedIds();
    removeIds.forEach(removeId => deletedIds.add(removeId));
    writeDeletedIds(deletedIds);
    writeJson(NODE_KEY, nodes.filter(item => !removeIds.has(String(item.id))));

    const members = readJson(MEMBER_KEY, {});
    if (members && typeof members === "object") {
      removeIds.forEach(removeId => delete members[removeId]);
      writeJson(MEMBER_KEY, members);
    }
    return true;
  }

  function deleteMember(nodeId, index) {
    const members = readJson(MEMBER_KEY, {});
    const rows = members && members[nodeId];
    if (!Array.isArray(rows) || !rows[index]) return false;
    rows.splice(index, 1);
    members[nodeId] = rows;
    writeJson(MEMBER_KEY, members);
    return true;
  }

  function resetCharPosition(id) {
    const positions = readJson(CHAR_POS_KEY, {});
    if (!positions || typeof positions !== "object" || !positions[id]) return false;
    delete positions[id];
    writeJson(CHAR_POS_KEY, positions);
    return true;
  }

  function render(host) {
    const options = collectOptions();
    host.innerHTML = '<div class="dg-admin-map-inventory-head">'
      + '<b>Rao soat map</b>'
      + '<button type="button" data-dg-inv="toggle" title="Thu gon">-</button>'
      + '</div>'
      + '<div class="dg-admin-map-inventory-body">'
      + '<select data-dg-inv-select>'
      + '<option value="">-- Chon node / nhan su / vi tri de xoa --</option>'
      + options.map(item => '<option value="' + esc(item.value) + '">' + esc(item.label) + '</option>').join("")
      + '</select>'
      + '<div class="dg-admin-map-inventory-actions">'
      + '<button type="button" data-dg-inv="refresh">Lam moi</button>'
      + '<button type="button" class="danger" data-dg-inv="delete">Xoa muc da chon</button>'
      + '</div>'
      + '<div class="hint">Node seed se duoc ghi vao tombstone nen reload khong hien lai. Vi tri nhan vat la reset ve mac dinh.</div>'
      + '</div>';
  }

  function ensure() {
    if (!document.body) return;
    let host = document.getElementById("dg-admin-map-inventory");
    if (!host) {
      host = document.createElement("div");
      host.id = "dg-admin-map-inventory";
      host.className = "dg-admin-map-inventory";
      host.addEventListener("click", event => {
        const action = event.target && event.target.getAttribute("data-dg-inv");
        if (!action) return;
        if (action === "toggle") {
          host.classList.toggle("is-collapsed");
          return;
        }
        if (action === "refresh") {
          render(host);
          return;
        }
        if (action === "delete") {
          const select = host.querySelector("[data-dg-inv-select]");
          const value = select && select.value;
          if (!value) {
            alert("Chon mot muc trong danh sach truoc.");
            return;
          }
          const parts = value.split("|");
          const label = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : value;
          if (!confirm("Xoa/reset muc nay khoi ban do?\n" + label)) return;
          let ok = false;
          if (parts[0] === "node") ok = deleteNode(parts[1]);
          if (parts[0] === "member") ok = deleteMember(parts[1], Number(parts[2]));
          if (parts[0] === "charpos") ok = resetCharPosition(parts[1]);
          if (!ok) {
            alert("Chua xoa duoc muc nay. Bam Lam moi roi thu lai.");
            render(host);
            return;
          }
          window.dispatchEvent(new Event("storage"));
          setTimeout(() => location.reload(), 80);
        }
      });
      document.body.appendChild(host);
    }
    if (!host.__dgRendered) {
      host.__dgRendered = "1";
      render(host);
    }
  }

  new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", ensure);
  window.addEventListener("load", ensure);
  setInterval(ensure, 2000);
  ensure();
})();

/* Admin top chrome: compact by default and let the founder hide/show the whole top band. */
(function dgAdminTopCollapse() {
  if (!/(\?|&)admin=1/.test(location.search)) return;
  const KEY = "dg-admin-map-top-collapsed";
  let lastState = null;

  function isCollapsed() {
    return localStorage.getItem(KEY) === "1";
  }

  function apply() {
    if (!document.body) return;
    const nextState = isCollapsed();
    const changed = lastState !== nextState;
    lastState = nextState;
    document.body.classList.toggle("dg-top-collapsed", nextState);
    const btn = document.getElementById("dg-top-collapse-toggle");
    if (btn) {
      const nextText = nextState ? "⌄" : "⌃";
      if (btn.textContent !== nextText) btn.textContent = nextText;
      btn.title = nextState ? "Hien lai thanh tren" : "An thanh tren";
    }
    if (changed) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
      setTimeout(() => window.dispatchEvent(new Event("resize")), 360);
    }
  }

  function ensure() {
    if (!document.body) return;
    let btn = document.getElementById("dg-top-collapse-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "dg-top-collapse-toggle";
      btn.className = "dg-top-collapse-toggle";
      btn.type = "button";
      btn.addEventListener("click", () => {
        localStorage.setItem(KEY, isCollapsed() ? "0" : "1");
        apply();
      });
      document.body.appendChild(btn);
    }
    apply();
  }

  new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", ensure);
  window.addEventListener("load", ensure);
  ensure();
})();

/* DG Ops Dock: tab nhiem vu ben phai, noi Task Board that (dg-app.py port 8790).
   Bam agent -> xem nhiem vu that; bam ⛶ -> toan man hinh giao viec/chi tieu tai cho. */
(function dgOpsDock() {
  // Dock hien ten phieu that + cho keo/giao viec -> CHI ban dieu khien (?admin=1).
  // Tren ban do trang chu (cong khai) tuyet doi khong duoc hien: lo ten website/du an.
  if (!/(\?|&)admin=1/.test(location.search)) return;

  // Uu tien server dang phuc vu trang nay (dg-app.py co the nhay cong khi 8790 bi chiem).
  // Neu trang duoc mo tu server tinh (vd python http.server:8792) thi lui ve 8790.
  let API = location.origin.startsWith("http") ? "" : "http://localhost:8790";
  let apiResolved = false;

  async function resolveApi() {
    if (apiResolved) return;
    for (const base of [API, "http://localhost:8790"]) {
      try {
        const r = await fetch(base + "/api/board", { cache: "no-store" });
        if (r.ok) { API = base; apiResolved = true; return; }
      } catch { /* thu base ke tiep */ }
    }
  }
  const AGENTS = [
    "Team Leader", "Founder Office", "Operations Team", "Content Social",
    "Brand Video Studio", "YouTube Studio", "Video Editor", "Product Code",
    "Finance Control", "Verba Hub Ops", "MediaMart Registry", "Codex Content Worker"
  ];
  const COLS = { "Inbox": "📥 Inbox", "Today": "🔥 Hôm nay", "This-Week": "📅 Tuần này",
    "Waiting-Review": "⏳ Chờ duyệt", "Done": "✅ Xong", "Backlog": "🗂️ Backlog" };
  let BOARD = null, currentAgent = "", full = false, apiOk = false;

  function esc(s) { return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function allTasks() { return BOARD ? Object.values(BOARD.columns).flat() : []; }
  function tasksOf(agent) {
    return allTasks().filter(t => ((t.dept || "") + " " + (t.owner || "")).toLowerCase().includes(agent.toLowerCase()));
  }

  async function loadBoard() {
    try {
      await resolveApi();
      const r = await fetch(API + "/api/board");
      BOARD = await r.json(); apiOk = true;
    } catch { apiOk = false; }
    renderDock();
  }

  function ensureDock() {
    if (document.getElementById("dg-ops-dock")) return;
    const btn = document.createElement("div");
    btn.id = "dg-ops-dock-toggle";
    btn.innerHTML = "📋 Nhiệm vụ";
    btn.title = "Mở tab nhiệm vụ (Task Board thật)";
    btn.addEventListener("click", () => {
      document.body.classList.toggle("dg-dock-open");
      loadBoard();
    });
    document.body.appendChild(btn);

    const dock = document.createElement("div");
    dock.id = "dg-ops-dock";
    document.body.appendChild(dock);
    renderDock();
  }

  function renderDock() {
    const dock = document.getElementById("dg-ops-dock");
    if (!dock) return;
    dock.classList.toggle("dg-full", full);
    dock.classList.toggle("dg-open", document.body && document.body.classList.contains("dg-dock-open"));

    let head = '<div class="dg-dock-head">' +
      '<b>' + (full ? "🗺️ Bố trí công việc · chỉ tiêu" : "📋 Nhiệm vụ") + "</b>" +
      '<span class="dg-dock-btns">' +
      '<button data-act="full" title="Toàn màn hình">' + (full ? "🗗 Thu lại" : "⛶ Toàn màn hình") + "</button>" +
      '<button data-act="close" title="Đóng">✕</button></span></div>';

    const editStrip = '<div class="dg-admin-edit-strip"><b>Dieu chinh ban do</b>'
      + '<span>Ban admin co quyen xem/sua nhiem vu. Keo nhan su tren map de bo tri, dung dock nay de giao viec va chuyen cot.</span>'
      + '<div class="dg-admin-edit-actions">'
      + '<button data-act="collapse-top">An/hien thanh tren</button>'
      + '<button data-act="fit-map">Can lai map</button>'
      + '</div></div>';

    if (!apiOk) {
      dock.innerHTML = head + editStrip + '<div class="dg-dock-hint">⚠️ Chưa kết nối Task Board.<br>Hãy chạy <b>DG-App.bat</b> (server port 8790) rồi bấm 🔄.<br><br><button data-act="reload">🔄 Thử lại</button></div>';
      bindDock(dock); return;
    }

    // Danh sach agent + so viec
    let agentsHtml = '<div class="dg-dock-agents">';
    for (const a of AGENTS) {
      const n = tasksOf(a).filter(t => t.col !== "Done").length;
      agentsHtml += '<div class="dg-dock-agent' + (a === currentAgent ? " sel" : "") + '" data-agent="' + esc(a) + '">' +
        esc(a) + (n ? ' <b>' + n + "</b>" : "") + "</div>";
    }
    agentsHtml += "</div>";

    // Nhiem vu cua agent dang chon (hoac tat ca)
    const list = currentAgent ? tasksOf(currentAgent) : allTasks();
    let tasksHtml = '<div class="dg-dock-tasks">';
    tasksHtml += '<div class="dg-dock-sub">' + (currentAgent ? "Việc của <b>" + esc(currentAgent) + "</b>" : "Tất cả việc") +
      ' · <span class="dg-link" data-act="all">xem tất cả</span> · <span class="dg-link" data-act="reload">🔄</span></div>';
    if (!list.length) tasksHtml += '<div class="dg-dock-hint">Chưa có việc. Bấm ➕ để giao việc' + (currentAgent ? " cho " + esc(currentAgent) : "") + ".</div>";
    for (const t of list) {
      const opts = Object.keys(COLS).map(c => '<option value="' + c + '"' + (c === t.col ? " selected" : "") + ">" + COLS[c] + "</option>").join("");
      tasksHtml += '<div class="dg-dock-task"><div class="tt">' + esc(t.title) + "</div>" +
        '<div class="tm">' + (t.priority ? '<span class="pr ' + t.priority + '">' + t.priority + "</span> " : "") +
        esc(t.owner || t.dept || "") + (t.deadline ? " · ⏰ " + esc(t.deadline) : "") + "</div>" +
        '<select data-move="' + esc(t.col) + "|" + esc(t.file) + '">' + opts + "</select></div>";
    }
    tasksHtml += "</div>";

    // Form giao viec (hien ro o che do full, gon o dock)
    const agentOpts = AGENTS.map(a => '<option' + (a === currentAgent ? " selected" : "") + ">" + a + "</option>").join("");
    const formHtml = '<div class="dg-dock-form"><div class="dg-dock-sub">➕ Giao việc mới' + (full ? " · đặt chỉ tiêu" : "") + "</div>" +
      '<input id="dg-f-title" placeholder="Tên việc / chỉ tiêu... (VD: Viết 5 bài website hôm nay)">' +
      '<div class="row"><select id="dg-f-agent"><option value="">— Team Leader tự phân —</option>' + agentOpts + "</select>" +
      '<select id="dg-f-prio"><option>P0</option><option selected>P1</option><option>P2</option><option>P3</option></select>' +
      '<input id="dg-f-dead" type="date"></div>' +
      (full ? '<textarea id="dg-f-input" placeholder="Đầu vào: link video/bài, yêu cầu, số lượng chỉ tiêu..."></textarea>' +
        '<textarea id="dg-f-output" placeholder="Output cần trả: draft URL, publish package, report..."></textarea>' : "") +
      '<label class="dg-dock-chk"><input type="checkbox" id="dg-f-worker" checked>' +
      '<span>🤖 Codex tự chạy ngay <em>(bắt việc trong 20 giây · hết tài khoản tự đổi sang Claude)</em></span></label>' +
      '<button data-act="new">Giao việc → Inbox</button></div>';

    dock.innerHTML = head + editStrip + agentsHtml + tasksHtml + formHtml;
    bindDock(dock);
  }

  function bindDock(dock) {
    dock.querySelectorAll("[data-act]").forEach(el => el.addEventListener("click", async e => {
      const act = el.getAttribute("data-act");
      if (act === "close") { document.body.classList.remove("dg-dock-open"); full = false; renderDock(); }
      if (act === "full") { full = !full; renderDock(); }
      if (act === "reload") loadBoard();
      if (act === "all") { currentAgent = ""; renderDock(); }
      if (act === "collapse-top") {
        const key = "dg-admin-map-top-collapsed";
        localStorage.setItem(key, localStorage.getItem(key) === "1" ? "0" : "1");
        document.body.classList.toggle("dg-top-collapsed", localStorage.getItem(key) === "1");
        window.dispatchEvent(new Event("resize"));
        setTimeout(() => window.dispatchEvent(new Event("resize")), 250);
      }
      if (act === "fit-map") {
        window.dispatchEvent(new Event("resize"));
        setTimeout(() => window.dispatchEvent(new Event("resize")), 250);
      }
      if (act === "new") {
        const title = (document.getElementById("dg-f-title") || {}).value || "";
        if (!title.trim()) { el.textContent = "⚠️ Nhập tên việc"; setTimeout(() => renderDock(), 1200); return; }
        const body = {
          title: title.trim(),
          dept: (document.getElementById("dg-f-agent") || {}).value || "",
          priority: (document.getElementById("dg-f-prio") || {}).value || "P1",
          deadline: (document.getElementById("dg-f-dead") || {}).value || "",
          input: (document.getElementById("dg-f-input") || {}).value || "",
          output: (document.getElementById("dg-f-output") || {}).value || "",
          review: true,
          worker: (document.getElementById("dg-f-worker") || {}).checked ? "codex" : ""
        };
        await fetch(API + "/api/new", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        loadBoard();
      }
    }));
    dock.querySelectorAll(".dg-dock-agent").forEach(el => el.addEventListener("click", () => {
      currentAgent = el.getAttribute("data-agent"); renderDock();
    }));
    dock.querySelectorAll("select[data-move]").forEach(sel => sel.addEventListener("change", async () => {
      const [col, file] = sel.getAttribute("data-move").split("|");
      await fetch(API + "/api/move", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ col, file, to: sel.value }) });
      loadBoard();
    }));
  }

  // Goi truc tiep (khong dung requestAnimationFrame: tab chay nen se khong fire)
  const run = () => { try { ensureDock(); } catch (e) { /* DOM chua san sang */ } };
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", run);
  window.addEventListener("load", run);
  setInterval(() => {
    run();
    if (document.body && document.body.classList.contains("dg-dock-open")) loadBoard();
  }, 15000);
  run(); loadBoard();
})();

/* ===== CHE DO TRANG CHU (chi xem, chay nen) =====
   Khong co ?admin=1 -> ban do chi HIEN THI: khong click/keo duoc gi, an het nut dieu khien,
   bang HOAT DONG noi chung chung (khong lo ten website/du an).
   Ban thao tac/day du: nut Van hanh quay ve tong quan ban do quan tri. */
(function dgPublicHomeMode() {
  const ADMIN = /(\?|&)admin=1/.test(location.search);
  window.__dgIsAdminMap = ADMIN;
  if (ADMIN) return;

  const SENSITIVE = /\[.+?\]|website|web\s*kpi|money\s*x\d|codex|seo|api|credential|verba|ducpt|pinterest|x4|wordpress|checkout/i;
  // Chu thay the nam trong CSS (.dg-generic-doing/.dg-generic-done ::after)
  const HIDE_BTN = /^(KEO NV VAO GHE|CEO DI THAM|AUTO|CU CHI|LICH DANG BAI|KHO VIDEO|TRANG TRI|NHAN VIEN( \(\d+\))?)$/;

  function norm(text) {
    return String(text || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toUpperCase();
  }

  function apply() {
    if (!document.body) return;
    document.body.classList.add("dg-public-view");

    [...document.querySelectorAll("button")].forEach(btn => {
      if (HIDE_BTN.test(norm(btn.textContent))) btn.classList.add("dg-hidden-admin-field");
    });

    // Che dong nhay cam bang CSS, KHONG ghi de textContent.
    // Ly do: nhung node nay do React quan ly; sua thang DOM lam React mat dau node,
    // ném NotFoundError (removeChild) roi go sach cay -> ban do trang tinh.
    [...document.querySelectorAll("div, span, li, p")].forEach(el => {
      const t = el.textContent || "";
      if (t.length > 220 || !SENSITIVE.test(t)) return;
      const hasMatchingChild = [...el.children].some(c => SENSITIVE.test(c.textContent || ""));
      if (hasMatchingChild) return; // chi xu ly phan tu sau nhat
      el.classList.add(/xong|da |hoan|done|✔/i.test(t) ? "dg-generic-done" : "dg-generic-doing");
    });
  }

  // KHONG dung requestAnimationFrame: tab chay nen khong fire -> chu nhay cam se lo ra.
  // Dung setTimeout gom nhip: React ve xong luc nao thi che ngay luc do.
  let pending = 0;
  const schedule = () => {
    if (pending) return;
    pending = setTimeout(() => { pending = 0; apply(); }, 60);
  };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", apply);
  setInterval(apply, 3000);   // luoi an toan: co gi lot thi vong sau che not
  apply();
})();

/* Real public activity board: read the actual DG Task Board and file update time.
   This intentionally avoids rotating sample hours or guessing progress. */
(function dgRealActivityBoard() {
  // LENH FOUNDER (2026-07-11, dot cuoi): trang ngoai phai dung NGUYEN bang HOAT DONG
  // goc cua app (giong het Ban do dieu khien) — KHONG thay bang tu che nua.
  // Tat toan bo ham nay + go class an bang goc neu con sot tu ban cache cu.
  document.querySelectorAll(".dg-native-activity-hidden")
    .forEach(el => el.classList.remove("dg-native-activity-hidden"));
  const _old = document.getElementById("dg-live-activity");
  if (_old) _old.remove();
  return;

  /* eslint-disable no-unreachable */
  const ADMIN = /(\?|&)admin=1/.test(location.search);
  if (ADMIN) return;
  window.__dgRealActivityBoardActive = true;

  const REFRESH_MS = 30000;
  const STATUS_LABEL = {
    doing: "Đang làm",
    running: "Đang làm",
    active: "Đang làm",
    review: "Chờ duyệt",
    blocked: "Đang kẹt",
    error: "Lỗi",
    failed: "Lỗi",
    pending: "Chờ chạy",
    todo: "Chờ chạy",
    wait: "Chờ chạy",
    done: "Xong",
    sent: "Xong"
  };
  const STATUS_CLASS = {
    doing: "run",
    running: "run",
    active: "run",
    review: "review",
    blocked: "blocked",
    error: "blocked",
    failed: "blocked",
    pending: "wait",
    todo: "wait",
    wait: "wait",
    done: "done",
    sent: "done"
  };
  let boardTasks = [];
  let loadedAt = null;
  let loading = false;

  function esc(value) {
    return String(value || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function cleanTitle(value) {
    return String(value || "")
      .replace(/\[[^\]]+\]\s*/g, "")
      .replace(/\b(MONEY\s*X\d|Codex\s*X\d|Codex|API|credential|WordPress|checkout|website|web\s*kpi|SEO|Verba|ducpt|Pinterest|X4|newsglobail(\.com)?|tecatool|navyago)\b/gi, "")
      .replace(/\blenh chuan\b\s*/gi, "")
      .replace(/\s*[-:>]+\s*/g, " ")
      .replace(/[\/|]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[,.\s]+|[,.\s]+$/g, "")
      .trim();
  }

  function boardStatus(col) {
    if (col === "Today") return "doing";
    if (col === "Waiting-Review") return "review";
    if (col === "Done") return "done";
    if (col === "This-Week") return "pending";
    if (col === "Backlog") return "wait";
    return "pending";
  }

  function progressValue(task) {
    const raw = Number(task.progress ?? task.actual);
    if (Number.isFinite(raw) && raw >= 0) return Math.min(100, Math.round(raw));
    return null;
  }

  function formatUpdate(value) {
    if (!value) return "chưa cập nhật";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "chưa cập nhật";
    return date.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
  }

  /** Bang HOAT DONG goc do React ve ra. Chi de AN di, tuyet doi khong ghi de. */
  function findNativePanel() {
    return [...document.querySelectorAll("div")].find(el => {
      if (el.closest("#dg-live-activity")) return false;
      const text = (el.innerText || el.textContent || "").toUpperCase();
      const rect = el.getBoundingClientRect();
      return rect.left <= 80 && rect.top > 120 && rect.width >= 180 && /HOAT|HOẠT/.test(text);
    }) || null;
  }

  /** Node cua rieng minh: React khong biet den no nen ghi innerHTML thoai mai, khong vo cay. */
  function ensurePanel() {
    if (!document.body) return null;
    const native = findNativePanel();
    if (native) native.classList.add("dg-native-activity-hidden");
    let host = document.getElementById("dg-live-activity");
    if (!host) {
      host = document.createElement("div");
      host.id = "dg-live-activity";
      host.className = "dg-live-host";
      (document.querySelector(".dg-skills-map-stage") || document.body).appendChild(host);
    }
    return host;
  }

  async function loadBoard() {
    if (loading) return;
    loading = true;
    try {
      // /api/board da tra kem updatedAt cho tung phieu -> khong con goi HEAD tung file (19 request / 30 giay)
      const response = await fetch("/api/board", { cache: "no-store" });
      const data = response.ok ? await response.json() : { columns: {} };
      const columns = data.columns || {};
      const tasks = Object.entries(columns).flatMap(([col, rows]) => (rows || []).map(task => ({ ...task, col })));
      const enriched = tasks.map(task => ({
        id: task.file || task.title,
        title: cleanTitle(task.title2 || task.title || task.file),
        owner: cleanTitle(task.owner || task.dept || ""),
        status: String(task.status || boardStatus(task.col)).toLowerCase(),
        col: task.col,
        deadline: task.deadline || "",
        progress: progressValue(task),
        updatedAt: task.updatedAt || task.lastUpdated || ""
      }));
      const rank = { doing: 0, running: 0, active: 0, review: 1, blocked: 2, error: 2, failed: 2, pending: 3, todo: 3, wait: 3, done: 4 };
      boardTasks = enriched
        .filter(task => task.title)
        .sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9)
          || String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
          || String(a.deadline || "").localeCompare(String(b.deadline || "")));
      loadedAt = new Date();
    } catch {
      boardTasks = [];
      loadedAt = new Date();
    } finally {
      loading = false;
      render();
    }
  }

  function render() {
    const host = ensurePanel();
    if (!host) return;
    const loadedLabel = loadedAt ? loadedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "dang tai";
    if (!boardTasks.length) {
      host.innerHTML = '<div class="dg-live-board">'
        + '<div class="dg-live-board-head"><b>HOẠT ĐỘNG</b><span>Cập nhật: ' + esc(loadedLabel) + '</span></div>'
        + '<div class="dg-live-empty">He thong dang o che do hien thi chung.</div>'
        + '</div>';
      return;
    }
    // LENH FOUNDER 2026-07-11 (dot cuoi): trang ngoai dung BANG GOP 4 dong
    // (Dang chay / Cho duyet / Cho chay / Da xong + so muc), KHONG dung danh sach chi tiet.
    const counts = boardTasks.reduce((acc, task) => {
      const key = STATUS_CLASS[task.status] || "wait";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const lanes = [
      { cls: "run", status: "Đang chạy", title: "Vận hành hệ thống", count: counts.run || 0, progress: 82 },
      { cls: "review", status: "Chờ duyệt", title: "Kiểm tra chất lượng", count: counts.review || 0, progress: 64 },
      { cls: "wait", status: "Chờ chạy", title: "Hàng đợi tự động", count: counts.wait || 0, progress: 38 },
      { cls: "done", status: "Đã xong", title: "Bàn giao kết quả", count: counts.done || 0, progress: 100 }
    ].filter(lane => lane.count > 0);
    const visibleLanes = lanes.length ? lanes : [
      { cls: "run", status: "Online", title: "Nhân viên auto đang trực", count: boardTasks.length, progress: 76 }
    ];
    const rows = visibleLanes.map(lane => {
      const progressStyle = "--dg-progress: " + lane.progress + "%; --dg-progress-opacity: .9;";
      return '<div class="dg-live-task ' + lane.cls + '" style="' + progressStyle + '">'
        + '<span class="st">' + esc(lane.status) + '</span>'
        + '<span class="tt">' + esc(lane.title) + '</span>'
        + '<span class="pg">' + esc(lane.count + " mục") + '</span>'
        + '</div>';
    }).join("");
    host.innerHTML = '<div class="dg-live-board">'
      + '<div class="dg-live-board-head"><b>HOẠT ĐỘNG</b><span>Cập nhật bảng: ' + esc(loadedLabel) + '</span></div>'
      + '<div class="dg-live-table">'
      + '<div class="dg-live-table-header"><span>Trạng thái</span><span>Khu vực</span><span>Số mục</span></div>'
      + rows
      + '</div></div>';
  }

  document.addEventListener("DOMContentLoaded", () => { render(); loadBoard(); });
  window.addEventListener("load", () => { render(); loadBoard(); });
  window.addEventListener("storage", loadBoard);
  new MutationObserver(records => {
    const onlyOwnPanel = records.length && records.every(record => {
      const target = record.target && record.target.nodeType === 1 ? record.target : record.target && record.target.parentElement;
      return target && target.closest && target.closest("#dg-live-activity");
    });
    if (!onlyOwnPanel) render();   // khong dung rAF: tab chay nen se khong fire
  }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(loadBoard, REFRESH_MS);
  render();
  loadBoard();
})();

/* Nut VAN HANH: quay ve tong quan ban do van hanh.
   Nut HTML that (khong phai hinh ve canvas) nen luon bam duoc. */
(function dgVanHanhButton() {
  const ADMIN = /(\?|&)admin=1/.test(location.search);

  function inOffice() {
    try { return window.parent !== window && window.parent.document.getElementById("nav"); } catch (e) { return false; }
  }

  // LENH FOUNDER 2026-07-11: trong vo DG Office, ban do admin KHONG co nut Van hanh
  // (sidebar da lo dieu huong). Nhung ban do mo MOT MINH (khong iframe) thi BAT BUOC
  // co nut ve bang dieu khien — khong duoc de Founder ket o ban do tran.
  function ensureBtn() {
    if (!document.body) return;
    let btn = document.getElementById("dg-vanhanh-btn");
    if (ADMIN && inOffice()) { if (btn) btn.remove(); return; }
    if (!btn) {
      btn = document.createElement("div");
      btn.id = "dg-vanhanh-btn";
      btn.innerHTML = ADMIN ? "🏢 Về bảng điều khiển" : "🏭 Vận hành";
      btn.title = "Về bảng điều khiển DG Office (sidebar đầy đủ)";
      btn.addEventListener("click", () => {
        // Trong vo: doi muc tai cho (giu sidebar). Dung ngoai: quay VE vo DG Office.
        if (inOffice()) { window.parent.location.hash = "#vanhanh"; return; }
        window.location.href = ADMIN ? "../dg-office.html" : "../dg-office.html#vanhanh";
      });
    }
    if (btn.parentElement !== document.body) document.body.appendChild(btn);
  }
  new MutationObserver(() => ensureBtn()).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", ensureBtn);
  window.addEventListener("load", ensureBtn);
  ensureBtn();
})();

/* Sidebar thu gon: an menu de xem toan man hinh, van giu tong quan o goc trai duoi. */
(function dgCollapsibleSidebar() {
  const KEY = "dg-sidebar-collapsed";
  let miniTick = 0;
  let boardStats = { total: "…", active: "…", status: "Online" };

  function isCollapsed() {
    return localStorage.getItem(KEY) !== "0"; // mac dinh: thu gon
  }

  function setCollapsed(v) {
    localStorage.setItem(KEY, v ? "1" : "0");
    apply();
  }

  function apply() {
    if (document.body) {
      document.body.classList.toggle("dg-sidebar-collapsed", isCollapsed());
    }
  }

  async function loadBoardStats() {
    try {
      const response = await fetch("/api/board", { cache: "no-store" });
      if (!response.ok) throw new Error("board api");
      const data = await response.json();
      const columns = data.columns || {};
      const rows = Object.values(columns).flat();
      const active = rows.filter(item => item.col !== "Done" && item.col !== "Backlog").length;
      boardStats = { total: String(rows.length), active: String(active), status: "Online" };
    } catch {
      const vals = [...document.querySelectorAll(".sidebar__stat-value")]
        .map(el => el.textContent.trim());
      boardStats = { total: vals[0] || "0", active: vals[1] || "0", status: "Offline" };
    }
    ensureUI();
  }

  function readStats() {
    return boardStats;
  }

  function ensureUI() {
    if (!document.body) return;

    let chip = document.getElementById("dg-mini-overview");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "dg-mini-overview";
      chip.className = "dg-mini-overview";
      chip.title = "Tong quan trang thai co dinh";
      chip.addEventListener("click", event => event.preventDefault());
      document.body.appendChild(chip);
    }
    const s = readStats();
    const html = "☰&nbsp; Task <b>" + s.total + "</b> · Hoạt động <b>" + s.active +
      "</b> · <span class=\"dot\"></span> " + s.status;
    chip.style.setProperty("--dg-mini-progress", String(Math.round(((miniTick % 12) + 1) / 12 * 100)));
    if (chip.__dgLast !== html) {
      chip.__dgLast = html;
      chip.innerHTML = html;
    }

    const sb = document.querySelector(".sidebar");
    if (sb && !sb.querySelector("#dg-sidebar-collapse-btn")) {
      const btn = document.createElement("button");
      btn.id = "dg-sidebar-collapse-btn";
      btn.className = "dg-sidebar-collapse-btn";
      btn.textContent = "⮜ Thu gọn — xem toàn màn hình";
      btn.addEventListener("click", () => setCollapsed(true));
      sb.insertBefore(btn, sb.firstChild);
    }

    apply();
  }

  const run = () => window.requestAnimationFrame(ensureUI);
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", run);
  window.addEventListener("load", run);
  setInterval(() => { miniTick += 1; ensureUI(); }, 1000);
  setInterval(ensureUI, 2000);
  setInterval(loadBoardStats, 30000);
  run();
  loadBoardStats();
})();

/* Vat ly van phong v2: nhan vat RE VONG QUA ban ghe (khong dam thang roi ket o mep),
   khong dung tren ban, khong chong hinh. Bundle goi window.__dgPushOut moi khung hinh / moi nhan vat. */
(function dgOfficePhysics() {
  const HW = 52, TOP = 36, BOT = 16, M = 14;   // hop dac quanh ban + le an toan khi re vong
  const DESK_DEFAULTS = [
    [100, 350], [110, 455], [140, 400], [315, 335], [315, 480], [400, 155], [420, 335], [420, 480],
    [500, 570], [550, 155], [570, 570], [640, 570], [680, 335], [680, 480], [785, 335], [785, 480],
    [970, 420], [980, 310], [1020, 365], [1020, 470]
  ];
  let desks = DESK_DEFAULTS, deskStamp = 0;
  const allChars = [];

  function refreshDesks() {
    const now = Date.now();
    if (now - deskStamp < 2000) return;
    deskStamp = now;
    const list = DESK_DEFAULTS.slice();
    try {
      const saved = JSON.parse(localStorage.getItem("skillsmap_char_positions") || "{}");
      for (const k in saved) { const o = saved[k]; if (o && o.x != null) list.push([o.x, o.y]); }
    } catch (e) { /* dung mac dinh */ }
    desks = list;
  }

  const inBox = (x, y, dx, dy, m) =>
    x > dx - HW - m && x < dx + HW + m && y > dy - TOP - m && y < dy + BOT + m;

  function ownDesk(ch, dx, dy) {
    return Math.abs((ch.deskX ?? -9e3) - dx) < 2 && Math.abs((ch.deskY ?? -9e3) - dy) < 2;
  }

  /* Doan duong (x1,y1)->(x2,y2) co cham hop ban nao khong? (do bang cach lay mau moi 8px) */
  function firstBlock(ch, x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.min(48, Math.ceil(dist / 8));
    for (let i = 1; i <= steps; i++) {
      const px = x1 + (x2 - x1) * i / steps, py = y1 + (y2 - y1) * i / steps;
      for (const [dx, dy] of desks) {
        if (ownDesk(ch, dx, dy)) continue;
        if (inBox(px, py, dx, dy, 2)) return [dx, dy];
      }
    }
    return null;
  }

  window.__dgPushOut = function (ch) {
    if (!ch || ch.x == null) return;
    if (!ch.__dgReg) { ch.__dgReg = 1; allChars.push(ch); }
    refreshDesks();

    // ---- A. Dieu huong re vong: dich xa + duong thang bi ban chan -> ghe qua goc hop
    if (ch.tx != null) {
      // bundle vua doi dich (khong phai goc minh dat) -> quen lo trinh cu
      if (ch.__dgCorner && (ch.tx !== ch.__dgCorner.x || ch.ty !== ch.__dgCorner.y)) {
        ch.__dgCorner = null; ch.__dgFinal = null;
      }
      if (ch.__dgCorner) {
        // dang di toi goc: toi noi (hoac duong toi dich cuoi da thong) thi tra lai dich cuoi
        const dc = Math.hypot(ch.x - ch.__dgCorner.x, ch.y - ch.__dgCorner.y);
        if (dc < 14 || !firstBlock(ch, ch.x, ch.y, ch.__dgFinal.x, ch.__dgFinal.y)) {
          ch.tx = ch.__dgFinal.x; ch.ty = ch.__dgFinal.y;
          ch.__dgCorner = null; ch.__dgFinal = null;
        }
      } else if (Math.hypot(ch.tx - ch.x, ch.ty - ch.y) > 16) {
        // dich cuoi nam NGAY TREN ban nguoi khac -> huy dich, dung lai cho hop le
        let dichTrenBan = false;
        for (const [dx, dy] of desks) {
          if (!ownDesk(ch, dx, dy) && inBox(ch.tx, ch.ty, dx, dy, 0)) { dichTrenBan = true; break; }
        }
        if (dichTrenBan) { ch.tx = ch.x; ch.ty = ch.y; return; }
        const hit = firstBlock(ch, ch.x, ch.y, ch.tx, ch.ty);
        if (hit) {
          const [dx, dy] = hit;
          const cs = [
            { x: dx - HW - M, y: dy - TOP - M }, { x: dx + HW + M, y: dy - TOP - M },
            { x: dx - HW - M, y: dy + BOT + M }, { x: dx + HW + M, y: dy + BOT + M }
          ];
          let best = null, bestCost = 1e9;
          for (const c of cs) {
            if (Math.hypot(c.x - ch.x, c.y - ch.y) < 16) continue;   // goc dang dung roi — phai chon goc KE TIEP
            if (firstBlock(ch, ch.x, ch.y, c.x, c.y)) continue;   // goc nay cung bi chan
            const cost = Math.hypot(c.x - ch.x, c.y - ch.y) + Math.hypot(ch.tx - c.x, ch.ty - c.y);
            if (cost < bestCost) { bestCost = cost; best = c; }
          }
          if (best) {
            ch.__dgFinal = { x: ch.tx, y: ch.ty };
            ch.__dgCorner = best;
            ch.tx = best.x; ch.ty = best.y;
          }
        }
      }
    }

    // ---- B. Luoi an toan: lo lot vao hop ban (khong phai ban minh) thi truot ra mep
    for (const [dx, dy] of desks) {
      if (ownDesk(ch, dx, dy)) continue;
      const ox = ch.x - dx, oy = ch.y - dy;
      if (ox > -HW && ox < HW && oy > -TOP && oy < BOT) {
        const pushX = ox >= 0 ? HW - ox : -HW - ox;
        const pushY = oy >= 0 ? BOT - oy : -TOP - oy;
        if (Math.abs(pushX) < Math.abs(pushY)) ch.x += pushX; else ch.y += pushY;
        if (ch.tx != null && inBox(ch.tx, ch.ty, dx, dy, 0) && !ch.__dgCorner) {
          ch.tx = ch.x; ch.ty = ch.y;   // dich nam tren ban -> huy
        }
      }
    }

    // ---- C. Khong chong hinh: hai nguoi < 22px thi tach dan
    for (const other of allChars) {
      if (other === ch || other.x == null) continue;
      const sx = ch.x - other.x, sy = ch.y - other.y;
      const d2 = sx * sx + sy * sy;
      if (d2 > 0.01 && d2 < 484) {
        const d = Math.sqrt(d2);
        ch.x += (sx / d) * 0.8;
        ch.y += (sy / d) * 0.4;
      }
    }
  };
})();
