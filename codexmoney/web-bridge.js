(function () {
  if (window.moneyDesk) return;
  let cachedDashboard = null;
  async function loadSnapshot() {
    const response = await fetch("./dashboard.json?ts=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Cannot load dashboard snapshot: ${response.status}`);
    const payload = await response.json();
    cachedDashboard = payload && payload.data ? payload.data : payload;
    return cachedDashboard;
  }
  function readOnly() {
    return Promise.reject(new Error("Public GitHub Pages view is read-only. Use the local Codex Money app for actions."));
  }
  function readManagerFile(payload) {
    const path = payload && payload.path;
    const files = cachedDashboard && cachedDashboard.manager && cachedDashboard.manager.files;
    const item = Array.isArray(files) ? files.find(file => file.path === path || file.name === path) : null;
    if (!item) return Promise.resolve({ ok: false, path, error: "File not included in public snapshot." });
    return Promise.resolve({ ok: true, path: item.path, content: item.content || "" });
  }
  window.moneyDesk = {
    loadDashboard: loadSnapshot,
    runMoneySearch: readOnly,
    runMoneyHunt: readOnly,
    runMoneyPrepare: readOnly,
    runMoneyLedger: readOnly,
    runMonitorOneShot: readOnly,
    openPath: readOnly,
    openVSCode: readOnly,
    openUrl: (url) => { window.open(url, "_blank", "noopener,noreferrer"); return Promise.resolve({ ok: true }); },
    runJobMonitor: readOnly,
    runAllMonitors: readOnly,
    updateJobTracking: readOnly,
    checkGithubInbox: readOnly,
    checkAllGithubInboxes: readOnly,
    getAgentConfig: () => Promise.resolve({ provider: "public", model: "snapshot", systemPrompt: "" }),
    saveAgentConfig: readOnly,
    listAgentSkills: () => Promise.resolve([]),
    createAgentSkill: readOnly,
    sendAgentMessage: readOnly,
    readJobFile: () => Promise.resolve({ ok: false, content: "Job file content is not included in the public snapshot." }),
    fetchTrends: readOnly,
    fetchThreads: readOnly,
    sendThreadsReport: readOnly,
    fetchFacebookTrends: readOnly,
    fetchYouTubeTrends: readOnly,
    analyzeTrendArchive: readOnly,
    runTrendArchive: readOnly,
    readManagerFile
  };
})();
