(function seedDgCoreIntoSkillsMap() {
  const VERSION = "2026-07-10-dg-core-sync-v2";
  const force = new URLSearchParams(location.search).get("dgSeed") === "force";
  const today = new Date().toISOString().slice(0, 10);

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function mergeById(existing, seeded) {
    const map = new Map((Array.isArray(existing) ? existing : []).map(item => [String(item.id), item]));
    seeded.forEach(item => {
      const old = map.get(String(item.id));
      map.set(String(item.id), old ? { ...item, ...old } : item);
    });
    return [...map.values()];
  }

  function mergeTasks(existing, seeded) {
    const list = Array.isArray(existing) ? existing : [];
    const map = new Map(list.map(item => [String(item.id), item]));
    seeded.forEach(item => {
      const old = map.get(String(item.id));
      map.set(String(item.id), old ? {
        ...old,
        ...item,
        status: old.status || item.status,
        report: old.report || item.report
      } : item);
    });
    return [...map.values()];
  }

  const orgNodes = [
    {
      id: "dg-core-root",
      name: "DG Core",
      icon: "♛",
      color: "#ffd700",
      parentId: null,
      x: 550,
      y: 145,
      radius: 56,
      shape: "hexagon",
      status: "active",
      progress: 78,
      deadline: today,
      locked: true,
      notes: "Founder Office Operating AI. Dieu phoi task, agent, workflow, report va memory.",
      members: [
        { name: "D-Gin", emoji: "♛", role: "Founder Office Operating AI" },
        { name: "Ops Leader", emoji: "🧭", role: "Task dispatcher" }
      ]
    },
    {
      id: "dg-ops-kpi",
      name: "Ops KPI",
      icon: "⚡",
      color: "#38bdf8",
      parentId: "dg-core-root",
      x: 360,
      y: 260,
      radius: 44,
      shape: "circle",
      status: "active",
      progress: 62,
      deadline: today,
      notes: "Theo doi KPI ngay, viec ton, task treo, bao cao cuoi ngay.",
      members: [
        { name: "Operations Team", emoji: "⚡", role: "Daily Ops" },
        { name: "Ops Leader", emoji: "🧭", role: "Follow-up" }
      ]
    },
    {
      id: "dg-brand-video",
      name: "Brand Video",
      icon: "🎬",
      color: "#a78bfa",
      parentId: "dg-core-root",
      x: 715,
      y: 255,
      radius: 44,
      shape: "circle",
      status: "pending",
      progress: 48,
      deadline: today,
      notes: "Workflow video thuong hieu tu MONEY X3: brief, script, scene map, voice, render, QA, publish.",
      members: [
        { name: "Brand Studio", emoji: "🎬", role: "Video workflow" },
        { name: "MONEY X3", emoji: "🧩", role: "Render/source workflow" }
      ]
    },
    {
      id: "dg-website-post",
      name: "Website KPI",
      icon: "📝",
      color: "#22c55e",
      parentId: "dg-core-root",
      x: 475,
      y: 410,
      radius: 42,
      shape: "circle",
      status: "active",
      progress: 55,
      deadline: today,
      notes: "Agent kiem tra/dang bai website, gate SEO/content/asset, thuc chi tieu hang ngay.",
      members: [
        { name: "Content Social", emoji: "✍", role: "Content" },
        { name: "Product Code", emoji: "💻", role: "Website/API" }
      ]
    },
    {
      id: "dg-code-bridge",
      name: "Code Bridge",
      icon: "💻",
      color: "#2dd4bf",
      parentId: "dg-core-root",
      x: 650,
      y: 420,
      radius: 42,
      shape: "circle",
      status: "pending",
      progress: 35,
      deadline: today,
      notes: "Tong quan ket noi code: MONEY X5 Codex content worker, website tools, API/draft/publish, DG Core docs.",
      members: [
        { name: "Codex X5", emoji: "💻", role: "Write/check content" },
        { name: "Product Code", emoji: "🔧", role: "Integration" }
      ]
    },
    {
      id: "dg-video-editor",
      name: "Video Editor",
      icon: "🎞",
      color: "#f59e0b",
      parentId: "dg-core-root",
      x: 880,
      y: 250,
      radius: 42,
      shape: "circle",
      status: "active",
      progress: 40,
      deadline: today,
      notes: "Editor tong: 2 mang video (Thuong hieu + Triet ly). Publish package goi gon 4 nen tang: YouTube, Facebook, TikTok, Website. QA + Founder Office duyet roi moi dang.",
      members: [
        { name: "Video Editor", emoji: "🎞", role: "Publish 4 nen tang" },
        { name: "Brand Studio", emoji: "🎬", role: "Nguon video thuong hieu" }
      ]
    },
    {
      id: "dg-review-gate",
      name: "Review Gate",
      icon: "🛡",
      color: "#fb5a72",
      parentId: "dg-core-root",
      x: 850,
      y: 410,
      radius: 42,
      shape: "circle",
      status: "paused",
      progress: 30,
      deadline: today,
      notes: "Noi nao bi ket se day ve Waiting Review/Rework: thieu asset, chua QA, chua Founder Office OK, loi credential/API.",
      members: [
        { name: "QA Gate", emoji: "🛡", role: "Pass/fail" },
        { name: "Founder Office", emoji: "👑", role: "Final approval" }
      ]
    }
  ];

  orgNodes.forEach(node => {
    node.icon = "";
    node.members = [];
  });

  const staffKpiTasks = [
    { id: "dg-kpi-001", deadline: "08:15", assignee: "DG Core", owner: "DG Core", text: "[DG Core] Chia dau viec tu inbox: Website KPI, Brand Video, Code Bridge, QA Gate", status: "doing", target: 4, targetUnit: "workstreams" },
    { id: "dg-kpi-002", deadline: "08:45", assignee: "Operations Team", owner: "Operations Team", text: "[Ops] Lap checklist Google/KPI ngay: viec moi, viec treo, viec can duyet", status: "doing", target: 1, targetUnit: "daily sheet" },
    { id: "dg-kpi-003", deadline: "09:30", assignee: "Ops Leader", owner: "Ops Leader", text: "[Ops Leader] Go viec cho tung nhan su trong van phong Skills Map", status: "doing", target: 20, targetUnit: "nguoi/agent" },
    { id: "dg-kpi-004", deadline: "10:15", assignee: "Codex X5", owner: "Codex X5", text: "[Codex X5] Viet/sua/check content website theo Website Post KPI Workflow", status: "doing", target: 5, targetUnit: "bai/content" },
    { id: "dg-kpi-005", deadline: "10:45", assignee: "Product Code", owner: "Product Code", text: "[Product Code] Kiem tra ket noi MONEY X5 -> website draft/publish/API/content gate", status: "blocked", target: 3, targetUnit: "ket noi" },
    { id: "dg-kpi-006", deadline: "11:30", assignee: "Dev Bridge", owner: "Dev Bridge", text: "[Dev] Review loi code bridge, log loi credential/API, cap nhat noi dang ket", status: "doing", target: 1, targetUnit: "report" },
    { id: "dg-kpi-007", deadline: "13:30", assignee: "Brand Studio", owner: "Brand Studio", text: "[Brand Video] Chay workflow video thuong hieu tu MONEY X3: brief -> script -> scene", status: "pending", target: 1, targetUnit: "workflow" },
    { id: "dg-kpi-008", deadline: "14:30", assignee: "Asset Review", owner: "Asset Review", text: "[Intern] Gom asset/hinh/voice cho video va bai website, danh dau thieu asset", status: "pending", target: 10, targetUnit: "asset" },
    { id: "dg-kpi-009", deadline: "15:00", assignee: "Accounting Control", owner: "Accounting Control", text: "[Finance] Check chi phi tool/API/ads lien quan workflow hom nay", status: "pending", target: 1, targetUnit: "bang chi phi" },
    { id: "dg-kpi-010", deadline: "15:30", assignee: "Design Studio", owner: "Design Studio", text: "[Design] Thiet ke/kiem tra thumbnail, cover, hinh minh hoa cho bai va video", status: "pending", target: 6, targetUnit: "asset" },
    { id: "dg-kpi-011", deadline: "16:00", assignee: "Content SEO", owner: "Content SEO", text: "[Content] Soat title/meta/SEO va checklist dang bai website", status: "pending", target: 5, targetUnit: "bai" },
    { id: "dg-kpi-012", deadline: "16:30", assignee: "QA Gate", owner: "QA Gate", text: "[QA Gate] Check tat ca viec ket: SEO, asset, render, link, credential, Founder Office OK", status: "review", target: 6, targetUnit: "gate" },
    { id: "dg-kpi-013", deadline: "17:15", assignee: "Operations Team", owner: "Operations Team", text: "[Ops] Nhac viec treo, day nguoi phu trach cap nhat tien do va blocker", status: "pending", target: 100, targetUnit: "% cap nhat" },
    { id: "dg-kpi-014", deadline: "18:00", assignee: "Founder Office", owner: "Founder Office", text: "[Founder Office] Duyet viec P0/P1: noi nao cho phe duyet thi cham pass/fail", status: "pending", target: 1, targetUnit: "approval" },
    { id: "dg-kpi-015", deadline: "21:00", assignee: "Operations Team", owner: "Operations Team", text: "[Ops] Bao cao cuoi ngay: xong, ket, can duyet, ngay mai bu gi", status: "pending", target: 1, targetUnit: "daily report" }
  ];

  const deployDailyTasks = {
    date: today,
    tasks: staffKpiTasks
  };

  const officeTeams = [
    { name: "Founder Office / Core", color: "#ffd700", members: ["ceo", "pm_lead"] },
    { name: "Code & Website", color: "#2dd4bf", members: ["dev1", "dev2", "dev3", "dev4"] },
    { name: "Brand Video", color: "#a78bfa", members: ["mkt1", "design1", "yt3", "ytc_truong"] },
    { name: "Content / YouTube", color: "#fb5a72", members: ["yt1", "yt2", "yt4", "ytc_duc", "ytc_cuong"] },
    { name: "Ops / Finance / QA", color: "#f4b942", members: ["test1", "hr1", "intern1", "pm1", "acc1"] }
  ];

  const skillsMembers = {
    1: ["Founder Office", "D-Gin", "Ops Leader"],
    2: ["Operations Team", "QA Gate", "Daily Report"],
    3: ["Product Code", "Codex X5", "WordPress/API Bridge"],
    4: ["Brand Video Studio", "MONEY X3 Workflow", "Design/Render"],
    5: ["Finance Control", "MediaMart Registry", "Verba Hub Ops"]
  };

  const teamDailyOps = {
    members: [
      { id: 1, name: "Founder Office", role: "Founder Office Office", icon: "CEO", permission: "Owner", status: "online" },
      { id: 2, name: "DG Core", role: "AI Dispatcher", icon: "AI", permission: "Admin", status: "online" },
      { id: 3, name: "Operations Team", role: "Daily Ops / KPI", icon: "OPS", permission: "Manager", status: "busy" },
      { id: 4, name: "Brand Studio", role: "Brand Video Studio", icon: "BV", permission: "Editor", status: "online" },
      { id: 5, name: "Product Code", role: "Code / Integration", icon: "CODE", permission: "Editor", status: "busy" },
      { id: 6, name: "Codex X5", role: "Content Worker", icon: "X5", permission: "Worker", status: "online" },
      { id: 7, name: "QA Gate", role: "Review / Blocker Check", icon: "QA", permission: "Reviewer", status: "busy" },
      { id: 8, name: "Finance Control", role: "Finance Control", icon: "FIN", permission: "Reviewer", status: "away" },
      { id: 9, name: "Ops Leader", role: "Follow-up / Task Dispatch", icon: "TL", permission: "Manager", status: "online" },
      { id: 10, name: "Dev Bridge", role: "Developer / Code Bridge", icon: "DEV", permission: "Editor", status: "busy" },
      { id: 11, name: "Integration Dev", role: "Developer", icon: "DEV", permission: "Editor", status: "online" },
      { id: 12, name: "Product Dev", role: "Developer", icon: "DEV", permission: "Editor", status: "online" },
      { id: 13, name: "Project Manager A", role: "Project Manager", icon: "PM", permission: "Manager", status: "busy" },
      { id: 14, name: "Project Manager B", role: "Project Manager", icon: "PM", permission: "Manager", status: "online" },
      { id: 15, name: "People Ops", role: "HR / People Ops", icon: "HR", permission: "Reviewer", status: "online" },
      { id: 16, name: "Asset Review", role: "Intern / Asset Review", icon: "INT", permission: "Worker", status: "online" },
      { id: 17, name: "Design Studio", role: "Design / Thumbnail", icon: "DES", permission: "Editor", status: "online" },
      { id: 18, name: "Content SEO", role: "Content / SEO", icon: "CON", permission: "Editor", status: "online" },
      { id: 19, name: "Accounting Control", role: "Accounting / Cost Control", icon: "ACC", permission: "Reviewer", status: "away" },
      { id: 20, name: "Marketing Ops", role: "Marketing / Video", icon: "MKT", permission: "Editor", status: "online" },
      { id: 21, name: "Video Editor", role: "Publish Video 4 nen tang (Brand + Triet ly)", icon: "EDT", permission: "Editor", status: "online" }
    ],
    tasks: [
      { id: 9101, title: "Chia viec tu inbox va gan owner tung khau", ownerId: 2, priority: "P1", status: "doing", due: "08:15", dept: "DG Core" },
      { id: 9102, title: "Lap checklist Google/KPI ngay va map vao Skills Map", ownerId: 3, priority: "P1", status: "doing", due: "08:45", dept: "Operations Team" },
      { id: 9103, title: "Viet/sua/check content website theo KPI", ownerId: 6, priority: "P1", status: "doing", due: "10:15", dept: "Codex Content Worker" },
      { id: 9104, title: "Check code bridge: MONEY X5 -> website draft/publish/content gate", ownerId: 5, priority: "P0", status: "review", due: "10:45", dept: "Product Code" },
      { id: 9105, title: "Chay Brand Video workflow tu MONEY X3", ownerId: 4, priority: "P1", status: "todo", due: "13:30", dept: "Brand Video Studio" },
      { id: 9106, title: "Gom asset/hinh/voice, danh dau thieu asset", ownerId: 16, priority: "P1", status: "todo", due: "14:30", dept: "Intern / Asset" },
      { id: 9107, title: "Thiet ke/kiem tra thumbnail, cover, hinh minh hoa", ownerId: 17, priority: "P1", status: "todo", due: "15:30", dept: "Design" },
      { id: 9108, title: "Soat title/meta/SEO va checklist dang bai website", ownerId: 18, priority: "P1", status: "todo", due: "16:00", dept: "Content / SEO" },
      { id: 9109, title: "Soat buoc ket: asset, QA, Founder Office OK, API/credential", ownerId: 7, priority: "P0", status: "review", due: "16:30", dept: "QA Gate" },
      { id: 9110, title: "Bao cao cuoi ngay: xong, ket, can duyet, ngay mai bu gi", ownerId: 3, priority: "P1", status: "todo", due: "21:00", dept: "Operations Team" }
    ],
    reports: [
      {
        id: 9201,
        memberId: 3,
        date: today,
        done: "Da nap workflow DG Core vao Skills Map va tao task KPI mau.",
        blockers: "Can cap nhat status that trong ngay neu code/API hoac content bi ket.",
        next: "Theo doi task review va bao Founder Office cac viec P0."
      }
    ],
    messages: [
      { id: 9301, fromId: 2, toId: 5, text: "Product Code kiem tra tong quan code bridge va noi nao dang ket.", time: "09:00" },
      { id: 9302, fromId: 3, toId: 6, text: "Codex X5 nhan task content website, tra report pass/fail ve DG Core.", time: "09:15" },
      { id: 9303, fromId: 4, toId: 7, text: "Brand Video can QA Gate soat scene/voice/render truoc publish.", time: "10:00" }
    ]
  };

  const existingNodes = readJson("skillsmap_orgnodes_v2", []);
  const deletedNodeIds = new Set(readJson("skillsmap_deleted_orgnodes_v2", []).map(id => String(id)));
  if (force) {
    localStorage.removeItem("skillsmap_deleted_orgnodes_v2");
    deletedNodeIds.clear();
  }
  const aliveExistingNodes = existingNodes.filter(node => !deletedNodeIds.has(String(node.id)));
  const aliveSeedNodes = orgNodes.filter(node => !deletedNodeIds.has(String(node.id)));
  const nextNodes = force ? aliveSeedNodes : mergeById(aliveExistingNodes, aliveSeedNodes);
  writeJson("skillsmap_orgnodes_v2", nextNodes);

  const existingDeploy = readJson("deploy_daily_tasks", null);
  const deployMap = new Map(((existingDeploy && existingDeploy.date === today && Array.isArray(existingDeploy.tasks)) ? existingDeploy.tasks : []).map(task => [String(task.id || task.text), task]));
  deployDailyTasks.tasks.forEach(task => {
    const old = deployMap.get(String(task.id || task.text));
    deployMap.set(String(task.id || task.text), old ? {
      ...old,
      ...task,
      status: old.status || task.status,
      report: old.report || task.report,
      actual: old.actual || task.actual || 0
    } : task);
  });
  writeJson("deploy_daily_tasks", { date: today, tasks: [...deployMap.values()] });

  const existingTeams = readJson("office_teams_v1", []);
  writeJson("office_teams_v1", force ? officeTeams : mergeById(existingTeams.map((team, index) => ({ id: team.name || index, ...team })), officeTeams.map(team => ({ id: team.name, ...team }))).map(({ id, ...team }) => team));

  if (force || !localStorage.getItem("skillsmap_members")) {
    writeJson("skillsmap_members", skillsMembers);
  }

  const existingOps = readJson("team_daily_ops_v1", null);
  if (!existingOps || force) {
    writeJson("team_daily_ops_v1", teamDailyOps);
  } else {
    writeJson("team_daily_ops_v1", {
      members: mergeById(existingOps.members || [], teamDailyOps.members),
      tasks: mergeTasks(existingOps.tasks || [], teamDailyOps.tasks),
      reports: mergeById(existingOps.reports || [], teamDailyOps.reports),
      messages: mergeById(existingOps.messages || [], teamDailyOps.messages)
    });
  }

  localStorage.setItem("dg_core_seed_version", VERSION);
})();
