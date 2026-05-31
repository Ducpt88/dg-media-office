const statusEmojiLabels = {
  prepared: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‹Å“ Prepared",
  doing: "ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ Doing",
  local_done: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ Local Done",
  pending_review: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ…Â½ In Review",
  pending_reward: "ÃƒÂ¢Ã‚ÂÃ‚Â³ Payout Pending",
  rewarded: "ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° Paid"
};

const localizedStatusLabels = {
  vi: {
    prepared: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‹Å“ Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ chuÃƒÂ¡Ã‚ÂºÃ‚Â©n bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹",
    doing: "ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ Ãƒâ€žÃ‚Âang lÃƒÆ’Ã‚Â m",
    local_done: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ HoÃƒÆ’Ã‚Â n tÃƒÂ¡Ã‚ÂºÃ‚Â¥t local",
    pending_review: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ…Â½ Ãƒâ€žÃ‚Âang chÃƒÂ¡Ã‚Â»Ã‚Â duyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
    pending_reward: "ÃƒÂ¢Ã‚ÂÃ‚Â³ ChÃƒÂ¡Ã‚Â»Ã‚Â thanh toÃƒÆ’Ã‚Â¡n",
    rewarded: "ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ thanh toÃƒÆ’Ã‚Â¡n"
  },
  en: statusEmojiLabels
};

const projectText = {
  vi: {
    unknown: "khÃƒÆ’Ã‚Â´ng rÃƒÆ’Ã‚Âµ",
    manual: "thÃƒÂ¡Ã‚Â»Ã‚Â§ cÃƒÆ’Ã‚Â´ng",
    age: "tuÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢i",
    score: "Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã†â€™m",
    time: "thÃƒÂ¡Ã‚Â»Ã‚Âi gian",
    noMonitor: "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ monitor",
    claim: "claim",
    approved: "Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ duyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
    rewarded: "Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ trÃƒÂ¡Ã‚ÂºÃ‚Â£",
    marked: "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â¡nh dÃƒÂ¡Ã‚ÂºÃ‚Â¥u",
    watching: "Ãƒâ€žÃ‚Âang theo dÃƒÆ’Ã‚Âµi",
    inboxComment: "BÃƒÆ’Ã‚Â¬nh luÃƒÂ¡Ã‚ÂºÃ‚Â­n GitHub inbox",
    monitorComment: "BÃƒÆ’Ã‚Â¬nh luÃƒÂ¡Ã‚ÂºÃ‚Â­n monitor",
    approvalGates: "cÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng duyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
    files: "file",
    issue: "Issue",
    checkAgain: "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra lÃƒÂ¡Ã‚ÂºÃ‚Â¡i",
    checkInbox: "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra inbox",
    unmark: "BÃƒÂ¡Ã‚Â»Ã‚Â Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¡nh dÃƒÂ¡Ã‚ÂºÃ‚Â¥u",
    mark: "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â¡nh dÃƒÂ¡Ã‚ÂºÃ‚Â¥u",
    unwatch: "BÃƒÂ¡Ã‚Â»Ã‚Â theo dÃƒÆ’Ã‚Âµi",
    watch: "Theo dÃƒÆ’Ã‚Âµi",
    openFolder: "MÃƒÂ¡Ã‚Â»Ã…Â¸ thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c",
    noJobs: "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ workspace trong jobs/.",
    rewardedFallback: "Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ thanh toÃƒÆ’Ã‚Â¡n"
  },
  en: {
    unknown: "unknown",
    manual: "manual",
    age: "age",
    score: "score",
    time: "time",
    noMonitor: "No monitor",
    claim: "claim",
    approved: "approved",
    rewarded: "rewarded",
    marked: "Marked",
    watching: "Watching",
    inboxComment: "GitHub inbox comment",
    monitorComment: "Monitor comment",
    approvalGates: "approval gates",
    files: "files",
    issue: "Issue",
    checkAgain: "Check again",
    checkInbox: "Check inbox",
    unmark: "Unmark",
    mark: "Mark",
    unwatch: "Unwatch",
    watch: "Watch",
    openFolder: "Open folder",
    noJobs: "No workspace in jobs/.",
    rewardedFallback: "rewarded"
  }
};

const state = {
  dashboard: null,
  activeView: "overview",
  language: localStorage.getItem("app.language") || "vi",
  busy: false,
  logDrawerCollapsed: false,
  latestSnapshotOutput: "No snapshot loaded yet.",
  latestCommandOutput: "No command has run in this session.",
  activityLog: [],
  collapsedSchedules: {},
  collapsedJobs: {},
  collapsedMonitors: {},
  trends: [],
  trendsGeo: "",
  trendsVisibleCount: 8,
  threads: [],
  threadsQuery: "",
  threadsVisibleCount: 10,
  facebook: null,
  facebookKey: "",
  interest: null,
  youtube: [],
  filters: {
    results: { query: "", source: "all", minScore: 0, sort: "modified_desc", page: 1, pageSize: 5 },
    jobs: { query: "", status: "all", signal: "all", sort: "modified_desc", page: 1, pageSize: 10 },
    monitors: { query: "", status: "all", sort: "checked_desc", page: 1, pageSize: 10 },
    schedules: { query: "", type: "all", page: 1, pageSize: 10 },
    ledger: { query: "", status: "all", sort: "date_desc", page: 1, pageSize: 10 },
    references: { query: "", sort: "path_asc", page: 1, pageSize: 12 },
    rss: { geo: "VN", query: "", minTraffic: 0, topic: "all" },
    skills: { query: "", page: 1, pageSize: 6 }
  },
  agent: {
    sessionId: localStorage.getItem("agent.sessionId") || `local-${Date.now()}`,
    messages: JSON.parse(localStorage.getItem("agent.messages") || "[]"),
    events: [],
    toolResults: [],
    skills: [],
    config: null,
    running: false,
    startedAt: null,
    thinkingTimer: null,
    modalOpen: false,
    context: { estimatedTokens: 0, limit: 24000 }
  },
  stepStatus: {
    load: "idle",
    render: "idle",
    snapshot: "idle",
    verify: "idle"
  }
};

const translations = {
  vi: {
    brandTitle: "Job Status",
    brandSubtitle: "Theo dÃƒÆ’Ã‚Âµi cÃƒÂ¡Ã‚Â»Ã‚Â¥c bÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢",
    nav: {
      overview: "TÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng quan",
      jobs: "Jobs GitHub",
      schedules: "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ch chÃƒÂ¡Ã‚ÂºÃ‚Â¡y",
      rss: "Xu hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng RSS",
      threads: "TÃƒÆ’Ã‚Â¬m Threads",
      facebook: "Facebook Trend",
      youtube: "YouTube Trend",
      interest: "ChÃƒÂ¡Ã‚Â»Ã‚Â§ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â quan tÃƒÆ’Ã‚Â¢m",
      settings: "CÃƒÆ’Ã‚Â i Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â·t"
    },
    topbarEyebrow: "BÃƒÂ¡Ã‚ÂºÃ‚Â£ng trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i local",
    topbarTitle: "Codex Job Status",
    waiting: "Ãƒâ€žÃ‚Âang chÃƒÂ¡Ã‚Â»Ã‚Â dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u",
    refresh: "LÃƒÆ’Ã‚Â m mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi",
    openFolder: "MÃƒÂ¡Ã‚Â»Ã…Â¸ thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c",
    projectRoot: "ThÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c dÃƒÂ¡Ã‚Â»Ã‚Â± ÃƒÆ’Ã‚Â¡n",
    reading: "Ãƒâ€žÃ‚Âang Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc",
    idle: "SÃƒÂ¡Ã‚ÂºÃ‚Âµn sÃƒÆ’Ã‚Â ng",
    snapshot: "Snapshot",
    verify: "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra",
    noEvents: "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ sÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n phiÃƒÆ’Ã‚Âªn.",
    latestNoEvents: "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ sÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n.",
    synced: "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ng bÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢",
    logExpand: "MÃƒÂ¡Ã‚Â»Ã…Â¸ rÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng",
    logCollapse: "Thu gÃƒÂ¡Ã‚Â»Ã‚Ân",
    inspector: {
      workflow: "Quy trÃƒÆ’Ã‚Â¬nh",
      health: "SÃƒÂ¡Ã‚Â»Ã‚Â©c khÃƒÂ¡Ã‚Â»Ã‚Âe",
      projectSignals: "TÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u dÃƒÂ¡Ã‚Â»Ã‚Â± ÃƒÆ’Ã‚Â¡n",
      nextActions: "ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡c tiÃƒÂ¡Ã‚ÂºÃ‚Â¿p theo",
      statusQueue: "HÃƒÆ’Ã‚Â ng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â£i trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i",
      latestEvent: "SÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
      sessionTrace: "DÃƒÂ¡Ã‚ÂºÃ‚Â¥u vÃƒÂ¡Ã‚ÂºÃ‚Â¿t phiÃƒÆ’Ã‚Âªn"
    },
    metrics: {
      results: "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
      jobs: "Jobs",
      attention: "CÃƒÂ¡Ã‚ÂºÃ‚Â§n chÃƒÆ’Ã‚Âº ÃƒÆ’Ã‚Â½",
      monitors: "Monitors"
    },
    actions: {
      reviewResults: "Xem kÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
      openJobs: "MÃƒÂ¡Ã‚Â»Ã…Â¸ jobs",
      checkMonitors: "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra monitors"
    }
  },
  en: {
    brandTitle: "Job Status",
    brandSubtitle: "Read-only monitor",
    nav: {
      overview: "Overview",
      jobs: "Jobs GitHub",
      schedules: "Schedules",
      rss: "Trends RSS",
      threads: "Threads Search",
      facebook: "Facebook Trend",
      youtube: "YouTube Trend",
      interest: "Interest Topics",
      settings: "Settings"
    },
    topbarEyebrow: "Local status viewer",
    topbarTitle: "Codex Job Status",
    waiting: "Waiting for data",
    refresh: "Refresh",
    openFolder: "Open folder",
    projectRoot: "Project root",
    reading: "Reading",
    idle: "Idle",
    snapshot: "Snapshot",
    verify: "Verify",
    noEvents: "No session events yet.",
    latestNoEvents: "No events yet.",
    synced: "Synced",
    logExpand: "Expand",
    logCollapse: "Collapse",
    inspector: {
      workflow: "Workflow",
      health: "Health",
      projectSignals: "Project signals",
      nextActions: "Next actions",
      statusQueue: "Status queue",
      latestEvent: "Latest event",
      sessionTrace: "Session trace"
    },
    metrics: {
      results: "Results",
      jobs: "Jobs",
      attention: "Attention",
      monitors: "Monitors"
    },
    actions: {
      reviewResults: "Review results",
      openJobs: "Open jobs",
      checkMonitors: "Check monitors"
    }
  }
};

const exactTextTranslations = {
  vi: {
    "Job Status": "TrÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i job",
    "Read-only monitor": "Theo dÃƒÆ’Ã‚Âµi cÃƒÂ¡Ã‚Â»Ã‚Â¥c bÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢",
    "Codex Job Status": "TrÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i job Codex",
    "Local status viewer": "BÃƒÂ¡Ã‚ÂºÃ‚Â£ng trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i local",
    "Waiting for data": "Ãƒâ€žÃ‚Âang chÃƒÂ¡Ã‚Â»Ã‚Â dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u",
    "Project root": "ThÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c dÃƒÂ¡Ã‚Â»Ã‚Â± ÃƒÆ’Ã‚Â¡n",
    "Open folder": "MÃƒÂ¡Ã‚Â»Ã…Â¸ thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c",
    "Overview": "TÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng quan",
    "Jobs GitHub": "Jobs GitHub",
    "Schedules": "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ch chÃƒÂ¡Ã‚ÂºÃ‚Â¡y",
    "Trends RSS": "Xu hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng RSS",
    "Threads Search": "TÃƒÆ’Ã‚Â¬m Threads",
    "Facebook Trend": "Facebook Trend",
    "YouTube Trend": "YouTube Trend",
    "Settings": "CÃƒÆ’Ã‚Â i Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â·t",
    "Manager file": "File quÃƒÂ¡Ã‚ÂºÃ‚Â£n lÃƒÆ’Ã‚Â½",
    "Open file": "MÃƒÂ¡Ã‚Â»Ã…Â¸ file",
    "Job Title": "TiÃƒÆ’Ã‚Âªu Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â job",
    "Prepared": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ chuÃƒÂ¡Ã‚ÂºÃ‚Â©n bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹",
    "Doing": "Ãƒâ€žÃ‚Âang lÃƒÆ’Ã‚Â m",
    "Local done": "HoÃƒÆ’Ã‚Â n tÃƒÂ¡Ã‚ÂºÃ‚Â¥t local",
    "Pending review": "ChÃƒÂ¡Ã‚Â»Ã‚Â review",
    "Pending reward": "ChÃƒÂ¡Ã‚Â»Ã‚Â thÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã…Â¸ng",
    "Rewarded": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ nhÃƒÂ¡Ã‚ÂºÃ‚Â­n thÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã…Â¸ng",
    "Paid": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ trÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Received": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ nhÃƒÂ¡Ã‚ÂºÃ‚Â­n",
    "Complete": "HoÃƒÆ’Ã‚Â n tÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Pending": "Ãƒâ€žÃ‚Âang chÃƒÂ¡Ã‚Â»Ã‚Â",
    "Qualify": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â¡nh giÃƒÆ’Ã‚Â¡",
    "Score details": "Chi tiÃƒÂ¡Ã‚ÂºÃ‚Â¿t Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã†â€™m",
    "Actions": "Thao tÃƒÆ’Ã‚Â¡c",
    "Tool bridge": "CÃƒÂ¡Ã‚ÂºÃ‚Â§u nÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi tool",
    "Files": "File",
    "Workspace files": "File workspace",
    "Idle": "SÃƒÂ¡Ã‚ÂºÃ‚Âµn sÃƒÆ’Ã‚Â ng",
    "Copy session": "Sao chÃƒÆ’Ã‚Â©p phiÃƒÆ’Ã‚Âªn",
    "New": "TÃƒÂ¡Ã‚ÂºÃ‚Â¡o mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi",
    "Supported skills": "Skill hÃƒÂ¡Ã‚Â»Ã¢â‚¬â€ trÃƒÂ¡Ã‚Â»Ã‚Â£",
    "Skill library": "ThÃƒâ€ Ã‚Â° viÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n skill",
    "Context": "NgÃƒÂ¡Ã‚Â»Ã‚Â¯ cÃƒÂ¡Ã‚ÂºÃ‚Â£nh",
    "Send": "GÃƒÂ¡Ã‚Â»Ã‚Â­i",
    "Thinking": "Ãƒâ€žÃ‚Âang suy nghÃƒâ€žÃ‚Â©",
    "Agent steps": "CÃƒÆ’Ã‚Â¡c bÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc agent",
    "Open": "MÃƒÂ¡Ã‚Â»Ã…Â¸",
    "Close": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â³ng",
    "Show execution trace": "HiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n dÃƒÂ¡Ã‚ÂºÃ‚Â¥u vÃƒÂ¡Ã‚ÂºÃ‚Â¿t thÃƒÂ¡Ã‚Â»Ã‚Â±c thi",
    "Tools": "CÃƒÆ’Ã‚Â´ng cÃƒÂ¡Ã‚Â»Ã‚Â¥",
    "Calls and results": "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh gÃƒÂ¡Ã‚Â»Ã‚Âi vÃƒÆ’Ã‚Â  kÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Jobs": "Jobs",
    "Results": "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Commands": "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh",
    "Monitors": "Monitors",
    "Ledger": "SÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ tiÃƒÂ¡Ã‚Â»Ã‚Ân",
    "Search": "TÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m",
    "Status": "TrÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i",
    "Signal": "TÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u",
    "Sort": "SÃƒÂ¡Ã‚ÂºÃ‚Â¯p xÃƒÂ¡Ã‚ÂºÃ‚Â¿p",
    "Page size": "CÃƒÂ¡Ã‚Â»Ã‚Â¡ trang",
    "Source": "NguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n",
    "Query": "Truy vÃƒÂ¡Ã‚ÂºÃ‚Â¥n",
    "Limit": "GiÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi hÃƒÂ¡Ã‚ÂºÃ‚Â¡n",
    "Output JSON": "File JSON Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u ra",
    "Results file": "File kÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Copy": "Sao chÃƒÆ’Ã‚Â©p",
    "Executing...": "Ãƒâ€žÃ‚Âang chÃƒÂ¡Ã‚ÂºÃ‚Â¡y...",
    "Check GitHub inbox": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra inbox GitHub",
    "Run all monitors": "ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y tÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£ monitors",
    "All statuses": "TÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£ trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i",
    "All signals": "TÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£ tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u",
    "All sources": "TÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£ nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n",
    "All monitored jobs": "TÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£ job Ãƒâ€žÃ¢â‚¬Ëœang monitor",
    "Claimed": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ claim",
    "Approved": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ duyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
    "Needs attention": "CÃƒÂ¡Ã‚ÂºÃ‚Â§n chÃƒÆ’Ã‚Âº ÃƒÆ’Ã‚Â½",
    "Marked": "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¡nh dÃƒÂ¡Ã‚ÂºÃ‚Â¥u",
    "Watching": "Ãƒâ€žÃ‚Âang theo dÃƒÆ’Ã‚Âµi",
    "New comment": "BÃƒÆ’Ã‚Â¬nh luÃƒÂ¡Ã‚ÂºÃ‚Â­n mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi",
    "No monitor": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ monitor",
    "Newest updated": "CÃƒÂ¡Ã‚ÂºÃ‚Â­p nhÃƒÂ¡Ã‚ÂºÃ‚Â­t mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Newest file": "File mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Newest date": "NgÃƒÆ’Ã‚Â y mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Last checked": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra gÃƒÂ¡Ã‚ÂºÃ‚Â§n nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Attention first": "Ãƒâ€ Ã‚Â¯u tiÃƒÆ’Ã‚Âªn cÃƒÂ¡Ã‚ÂºÃ‚Â§n chÃƒÆ’Ã‚Âº ÃƒÆ’Ã‚Â½",
    "Highest budget": "NgÃƒÆ’Ã‚Â¢n sÃƒÆ’Ã‚Â¡ch cao nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Highest amount": "SÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ tiÃƒÂ¡Ã‚Â»Ã‚Ân cao nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Best score": "Ãƒâ€žÃ‚ÂiÃƒÂ¡Ã‚Â»Ã†â€™m tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœt nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Most candidates": "NhiÃƒÂ¡Ã‚Â»Ã‚Âu candidate nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Title A-Z": "TiÃƒÆ’Ã‚Âªu Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â A-Z",
    "Path A-Z": "Ãƒâ€žÃ‚ÂÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng dÃƒÂ¡Ã‚ÂºÃ‚Â«n A-Z",
    "Job A-Z": "Job A-Z",
    "Manual": "ThÃƒÂ¡Ã‚Â»Ã‚Â§ cÃƒÆ’Ã‚Â´ng",
    "All": "TÃƒÂ¡Ã‚ÂºÃ‚Â¥t cÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Default": "MÃƒÂ¡Ã‚ÂºÃ‚Â·c Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh",
    "All GitHub": "ToÃƒÆ’Ã‚Â n GitHub",
    "Run Search": "ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m",
    "Run Hunt": "ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y sÃƒâ€žÃ†â€™n job",
    "Run Ledger": "ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y sÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ tiÃƒÂ¡Ã‚Â»Ã‚Ân",
    "Run Monitor": "ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y monitor",
    "Search Results": "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£ tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m",
    "Hunt Results": "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£ sÃƒâ€žÃ†â€™n job",
    "Monitor Status": "TrÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i monitor",
    "Region": "Khu vÃƒÂ¡Ã‚Â»Ã‚Â±c",
    "Reload": "TÃƒÂ¡Ã‚ÂºÃ‚Â£i lÃƒÂ¡Ã‚ÂºÃ‚Â¡i",
    "Provider": "Provider",
    "Unknown": "ChÃƒâ€ Ã‚Â°a biÃƒÂ¡Ã‚ÂºÃ‚Â¿t",
    "OpenAI-compatible base URL": "Base URL tÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng thÃƒÆ’Ã‚Â­ch OpenAI",
    "Model": "Model",
    "API key": "API key",
    "Context limit": "GiÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi hÃƒÂ¡Ã‚ÂºÃ‚Â¡n ngÃƒÂ¡Ã‚Â»Ã‚Â¯ cÃƒÂ¡Ã‚ÂºÃ‚Â£nh",
    "Max loops": "SÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ vÃƒÆ’Ã‚Â²ng tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi Ãƒâ€žÃ¢â‚¬Ëœa",
    "Tool calls / round": "Tool call mÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i vÃƒÆ’Ã‚Â²ng",
    "Codex timeout ms": "Timeout Codex ms",
    "Enable agent search": "BÃƒÂ¡Ã‚ÂºÃ‚Â­t tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m cho agent",
    "Auto-create missing workflow skills into my-skills": "TÃƒÂ¡Ã‚Â»Ã‚Â± tÃƒÂ¡Ã‚ÂºÃ‚Â¡o workflow skill cÃƒÆ’Ã‚Â²n thiÃƒÂ¡Ã‚ÂºÃ‚Â¿u vÃƒÆ’Ã‚Â o my-skills",
    "Enable Codex CLI bridge": "BÃƒÂ¡Ã‚ÂºÃ‚Â­t cÃƒÂ¡Ã‚ÂºÃ‚Â§u nÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi Codex CLI",
    "Codex CLI command": "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh Codex CLI",
    "Save settings": "LÃƒâ€ Ã‚Â°u cÃƒÆ’Ã‚Â i Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â·t",
    "Clear API key": "XÃƒÆ’Ã‚Â³a API key",
    "Refresh": "LÃƒÆ’Ã‚Â m mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi",
    "Reset": "Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚ÂºÃ‚Â·t lÃƒÂ¡Ã‚ÂºÃ‚Â¡i",
    "Clear log": "XÃƒÆ’Ã‚Â³a log",
    "Collapse": "Thu gÃƒÂ¡Ã‚Â»Ã‚Ân",
    "Expand": "MÃƒÂ¡Ã‚Â»Ã…Â¸ rÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng",
    "Activity log": "NhÃƒÂ¡Ã‚ÂºÃ‚Â­t kÃƒÆ’Ã‚Â½ hoÃƒÂ¡Ã‚ÂºÃ‚Â¡t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng",
    "Session events": "SÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n phiÃƒÆ’Ã‚Âªn",
    "Latest snapshot": "Snapshot mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Create skill": "TÃƒÂ¡Ã‚ÂºÃ‚Â¡o skill",
    "Command": "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh",
    "Goal": "MÃƒÂ¡Ã‚Â»Ã‚Â¥c tiÃƒÆ’Ã‚Âªu",
    "Allowed tools": "Tool Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c phÃƒÆ’Ã‚Â©p",
    "Output format": "Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh dÃƒÂ¡Ã‚ÂºÃ‚Â¡ng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u ra",
    "References": "TÃƒÆ’Ã‚Â i liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u tham khÃƒÂ¡Ã‚ÂºÃ‚Â£o",
    "Filename or preview": "TÃƒÆ’Ã‚Âªn file hoÃƒÂ¡Ã‚ÂºÃ‚Â·c xem trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc",
    "Workflow": "Quy trÃƒÆ’Ã‚Â¬nh",
    "Health": "SÃƒÂ¡Ã‚Â»Ã‚Â©c khÃƒÂ¡Ã‚Â»Ã‚Âe",
    "Project signals": "TÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u dÃƒÂ¡Ã‚Â»Ã‚Â± ÃƒÆ’Ã‚Â¡n",
    "Next actions": "ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡c tiÃƒÂ¡Ã‚ÂºÃ‚Â¿p theo",
    "Status queue": "HÃƒÆ’Ã‚Â ng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â£i trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i",
    "Latest event": "SÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t",
    "Session trace": "DÃƒÂ¡Ã‚ÂºÃ‚Â¥u vÃƒÂ¡Ã‚ÂºÃ‚Â¿t phiÃƒÆ’Ã‚Âªn",
    "Review results": "Xem kÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£",
    "Open jobs": "MÃƒÂ¡Ã‚Â»Ã…Â¸ jobs",
    "Check monitors": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra monitors",
    "No events yet.": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ sÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n.",
    "No snapshot loaded yet.": "ChÃƒâ€ Ã‚Â°a tÃƒÂ¡Ã‚ÂºÃ‚Â£i snapshot.",
    "No command has run in this session.": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh nÃƒÆ’Ã‚Â o chÃƒÂ¡Ã‚ÂºÃ‚Â¡y trong phiÃƒÆ’Ã‚Âªn nÃƒÆ’Ã‚Â y.",
    "No session events yet.": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ sÃƒÂ¡Ã‚Â»Ã‚Â± kiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n phiÃƒÆ’Ã‚Âªn.",
    "No files in workspace": "KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ file trong workspace",
    "No active tracking signals": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u theo dÃƒÆ’Ã‚Âµi",
    "No overview data available": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng quan",
    "No red flags detected": "KhÃƒÆ’Ã‚Â´ng phÃƒÆ’Ã‚Â¡t hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n cÃƒÂ¡Ã‚ÂºÃ‚Â£nh bÃƒÆ’Ã‚Â¡o Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â",
    "No explicit positive signals listed": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u tÃƒÆ’Ã‚Â­ch cÃƒÂ¡Ã‚Â»Ã‚Â±c rÃƒÆ’Ã‚Âµ rÃƒÆ’Ã‚Â ng",
    "No description.": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ mÃƒÆ’Ã‚Â´ tÃƒÂ¡Ã‚ÂºÃ‚Â£.",
    "No work_plan.md found in workspace.": "KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚ÂºÃ‚Â¥y work_plan.md trong workspace.",
    "No bid.md found in workspace.": "KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚ÂºÃ‚Â¥y bid.md trong workspace.",
    "No delivery_checklist.md found in workspace.": "KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚ÂºÃ‚Â¥y delivery_checklist.md trong workspace.",
    "No activity_log.md found in workspace.": "KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚ÂºÃ‚Â¥y activity_log.md trong workspace.",
    "Open in VS Code": "MÃƒÂ¡Ã‚Â»Ã…Â¸ trong VS Code",
    "Open on GitHub": "MÃƒÂ¡Ã‚Â»Ã…Â¸ trÃƒÆ’Ã‚Âªn GitHub",
    "Check monitor": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra monitor",
    "Check again": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra lÃƒÂ¡Ã‚ÂºÃ‚Â¡i",
    "Check inbox": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra inbox",
    "Open JSON": "MÃƒÂ¡Ã‚Â»Ã…Â¸ JSON",
    "Open plist": "MÃƒÂ¡Ã‚Â»Ã…Â¸ plist",
    "Open job": "MÃƒÂ¡Ã‚Â»Ã…Â¸ job",
    "Open Stdout": "MÃƒÂ¡Ã‚Â»Ã…Â¸ Stdout",
    "Open Stderr": "MÃƒÂ¡Ã‚Â»Ã…Â¸ Stderr",
    "Agent Chat": "Agent Chat",
    "You": "BÃƒÂ¡Ã‚ÂºÃ‚Â¡n",
    "Agent": "Agent",
    "No agent steps yet.": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ bÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc agent.",
    "Copy tool trace": "Sao chÃƒÆ’Ã‚Â©p trace tool",
    "No skills loaded": "ChÃƒâ€ Ã‚Â°a tÃƒÂ¡Ã‚ÂºÃ‚Â£i skill"
  },
  en: {}
};

exactTextTranslations.en = Object.fromEntries(
  Object.entries(exactTextTranslations.vi).map(([en, vi]) => [vi, en])
);

const phraseTranslations = {
  vi: {
    "Search Results": "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£ tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m",
    "Hunt Results": "KÃƒÂ¡Ã‚ÂºÃ‚Â¿t quÃƒÂ¡Ã‚ÂºÃ‚Â£ sÃƒâ€žÃ†â€™n job",
    "Monitor Status": "TrÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i monitor",
    "Open folder": "MÃƒÂ¡Ã‚Â»Ã…Â¸ thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c",
    "Open file": "MÃƒÂ¡Ã‚Â»Ã…Â¸ file",
    "Open job": "MÃƒÂ¡Ã‚Â»Ã…Â¸ job",
    "Check inbox": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra inbox",
    "Check again": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra lÃƒÂ¡Ã‚ÂºÃ‚Â¡i",
    "Check now": "KiÃƒÂ¡Ã‚Â»Ã†â€™m tra ngay",
    "Pending review": "ChÃƒÂ¡Ã‚Â»Ã‚Â review",
    "Rewarded today": "ThÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã…Â¸ng hÃƒÆ’Ã‚Â´m nay",
    "Jobs by repo": "Jobs theo repo",
    "LaunchAgents": "LaunchAgents",
    "No monitor": "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ monitor",
    "No content": "KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ nÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢i dung",
    "Global Agent": "Agent toÃƒÆ’Ã‚Â n cÃƒÂ¡Ã‚Â»Ã‚Â¥c",
    "Monitor Agent": "Monitor Agent",
    "Calendar Agent": "Calendar Agent",
    "Interval Agent": "Interval Agent"
  },
  en: {}
};

phraseTranslations.en = Object.fromEntries(
  Object.entries(phraseTranslations.vi).map(([en, vi]) => [vi, en])
);

function t(path) {
  return path.split(".").reduce((value, key) => value && value[key], translations[state.language]) || path;
}

function setText(selector, value) {
  const el = $(selector);
  if (el) el.textContent = value;
}

function translateInlineText(value) {
  const text = String(value || "");
  const trimmed = text.trim();
  if (!trimmed) return value;
  const exact = exactTextTranslations[state.language] || {};
  if (exact[trimmed]) {
    const leading = text.match(/^\s*/)[0];
    const trailing = text.match(/\s*$/)[0];
    return `${leading}${exact[trimmed]}${trailing}`;
  }
  const phrases = phraseTranslations[state.language] || {};
  let translated = text;
  for (const [from, to] of Object.entries(phrases)) {
    translated = translated.replaceAll(from, to);
  }
  return translated;
}

function shouldSkipI18nNode(node) {
  const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  if (!parent) return true;
  return Boolean(parent.closest("script, style, code, pre, textarea, [data-i18n-skip], .language-switch"));
}

function localizeDom(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipI18nNode(node)) return NodeFilter.FILTER_REJECT;
      return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    node.nodeValue = translateInlineText(node.nodeValue);
  });

  $$("input[placeholder], textarea[placeholder], [title], [aria-label], [data-tooltip]").forEach((el) => {
    if (el.closest("script, style, code, pre, [data-i18n-skip], .language-switch")) return;
    ["placeholder", "title", "aria-label", "data-tooltip"].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      el.setAttribute(attr, translateInlineText(el.getAttribute(attr)));
    });
  });
}

function ensureLanguageSwitch() {
  if ($("#languageSwitch")) return;
  const actions = $(".topbar-actions");
  if (!actions) return;
  const switcher = document.createElement("div");
  switcher.id = "languageSwitch";
  switcher.className = "language-switch";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Language");
  switcher.innerHTML = `
    <button class="language-option" type="button" data-language="vi">VI</button>
    <button class="language-option" type="button" data-language="en">EN</button>
  `;
  actions.prepend(switcher);
}

function applyLanguage() {
  ensureLanguageSwitch();
  document.documentElement.lang = state.language;
  $$("[data-language]").forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  setText(".brand strong", t("brandTitle"));
  setText(".brand > div span", t("brandSubtitle"));
  Object.entries(t("nav")).forEach(([view, label]) => setText(`[data-view=\"${view}\"]`, label));
  setText(".topbar .eyebrow", t("topbarEyebrow"));
  setText(".topbar h1", t("topbarTitle"));
  setText("#refreshBtn", t("refresh"));
  setText("#openRoot", t("openFolder"));
  setText(".sidebar-footer span", t("projectRoot"));
  setText(".inspector-card:nth-child(1) .inspector-kicker", t("inspector.workflow"));
  setText(".inspector-card:nth-child(2) .inspector-kicker", t("inspector.health"));
  setText(".inspector-card:nth-child(2) .inspector-head strong", t("inspector.projectSignals"));
  setText(".inspector-card:nth-child(3) .inspector-kicker", t("inspector.nextActions"));
  setText(".inspector-card:nth-child(3) .inspector-head strong", t("inspector.statusQueue"));
  setText(".inspector-card:nth-child(4) .inspector-kicker", t("inspector.latestEvent"));
  setText(".inspector-card:nth-child(4) .inspector-head strong", t("inspector.sessionTrace"));
  setText('[data-view-link="results"]', t("actions.reviewResults"));
  setText('[data-view-link="jobs"]', t("actions.openJobs"));
  setText('[data-view-link="monitors"]', t("actions.checkMonitors"));
  if (!state.dashboard) setText("#lastSync", t("waiting"));
  const logToggle = $("#toggleLogs");
  if (logToggle) logToggle.textContent = state.logDrawerCollapsed ? t("logExpand") : t("logCollapse");
  renderInspector();
  renderActivityLog();
  localizeDom();
}

function setLanguage(language) {
  if (!translations[language]) return;
  state.language = language;
  localStorage.setItem("app.language", language);
  if (state.dashboard) {
    renderDashboard(state.dashboard);
  } else {
    applyLanguage();
  }
}

const pipelineSteps = [
  { key: "query", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ…Â½", label: "Query", detail: "GitHub, Reddit hoÃƒÂ¡Ã‚ÂºÃ‚Â·c batch mÃƒÂ¡Ã‚Â»Ã…Â¸ rÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng" },
  { key: "candidate", icon: "ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â²", label: "Candidate", detail: "Normalize thÃƒÆ’Ã‚Â nh dataclass Candidate" },
  { key: "score", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬Â ", label: "Score", detail: "Budget, positive signals, red flags" },
  { key: "results", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦", label: "Results", detail: "Ghi JSON vÃƒÆ’Ã‚Â o results/" },
  { key: "workspace", icon: "ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â°", label: "Workspace", detail: "Prepare jobs/<task>/" },
  { key: "gates", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂºÃ‚Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â", label: "Approval gates", detail: "DuyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t scope, payment, safety" },
  { key: "monitor", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¡", label: "Monitor", detail: "PR/issue approval vÃƒÆ’Ã‚Â  payout signals" },
  { key: "ledger", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Âµ", label: "Ledger", detail: "Ghi nhÃƒÂ¡Ã‚ÂºÃ‚Â­n payment Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ nhÃƒÂ¡Ã‚ÂºÃ‚Â­n" }
];

const runtimeSteps = [
  { key: "load", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¥", label: "Load data" },
  { key: "render", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬â€œÃ‚Â¥ÃƒÂ¯Ã‚Â¸Ã‚Â", label: "Render UI" },
  { key: "snapshot", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â ", label: "Snapshot" },
  { key: "verify", icon: "ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦", label: "Verify output" }
];

const viewLabels = {
  overview: "Overview",
  commands: "Commands",
  results: "Results",
  jobs: "Jobs",
  monitors: "Monitors",
  schedules: "Schedules",
  ledger: "Ledger",
  references: "References",
  rss: "RSS Trends",
  threads: "Threads Search",
  facebook: "Facebook Trend",
  youtube: "YouTube Trend",
  interest: "ChÃƒÂ¡Ã‚Â»Ã‚Â§ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â quan tÃƒÆ’Ã‚Â¢m",
  settings: "Settings"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "n/a";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function timeLabel(value = new Date()) {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function persistAgentSession() {
  localStorage.setItem("agent.sessionId", state.agent.sessionId);
  localStorage.setItem("agent.messages", JSON.stringify(state.agent.messages.slice(-80)));
}

function estimateTokens(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value || "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.ceil(Math.max(text.length / 4, words * 1.35));
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const html = [];
  let inCode = false;
  let code = [];
  let codeLang = "";
  let paragraph = [];
  let listType = "";
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    html.push(`<${tag}>${listItems.join("")}</${tag}>`);
    listItems = [];
    listType = "";
  };
  const flushFlow = () => {
    flushParagraph();
    flushList();
  };
  const pushCode = () => {
    const language = codeLang ? `<span class="code-lang">${escapeHtml(codeLang)}</span>` : "";
    html.push(`<pre class="chat-code">${language}<button class="copy-inline" data-copy-text="${escapeHtml(code.join("\n"))}">Copy</button><code>${escapeHtml(code.join("\n"))}</code></pre>`);
    code = [];
    codeLang = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        pushCode();
      } else {
        flushFlow();
        codeLang = trimmed.replace(/^```/, "").trim();
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    if (!trimmed) {
      flushFlow();
      continue;
    }
    if (/^\|.+\|$/.test(trimmed) && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1] || "")) {
      flushFlow();
      const headers = splitMarkdownTableRow(trimmed);
      index += 1;
      const rows = [];
      while (index + 1 < lines.length && /^\|.+\|$/.test(lines[index + 1].trim())) {
        index += 1;
        rows.push(splitMarkdownTableRow(lines[index].trim()));
      }
      html.push(`
        <div class="markdown-table-wrap">
          <table class="markdown-table">
            <thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead>
            <tbody>${rows.map((row) => `<tr>${headers.map((_, cellIndex) => `<td>${inlineMarkdown(row[cellIndex] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      `);
      continue;
    }
    if (/^#{1,6}\s+/.test(trimmed)) {
      flushFlow();
      const depth = (trimmed.match(/^#+/) || [""])[0].length;
      const level = Math.min(depth + 1, 6);
      html.push(`<h${level}>${inlineMarkdown(trimmed.replace(/^#{1,6}\s+/, ""))}</h${level}>`);
      continue;
    }
    if (/^[-*_]{3,}$/.test(trimmed)) {
      flushFlow();
      html.push("<hr>");
      continue;
    }
    if (/^>\s?/.test(trimmed)) {
      flushFlow();
      const quoteLines = [trimmed.replace(/^>\s?/, "")];
      while (index + 1 < lines.length && /^>\s?/.test(lines[index + 1].trim())) {
        index += 1;
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
      }
      html.push(`<blockquote>${quoteLines.map((value) => `<p>${inlineMarkdown(value)}</p>`).join("")}</blockquote>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextType = ordered ? "ol" : "ul";
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      const itemText = unordered ? unordered[1] : ordered[1];
      const task = itemText.match(/^\[( |x|X)\]\s+(.+)$/);
      if (task) {
        const checked = task[1].toLowerCase() === "x" ? " checked" : "";
        listItems.push(`<li class="task-list-item"><input type="checkbox" disabled${checked}> <span>${inlineMarkdown(task[2])}</span></li>`);
      } else {
        listItems.push(`<li>${inlineMarkdown(itemText)}</li>`);
      }
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  if (inCode) pushCode();
  flushFlow();
  return `<div class="markdown-body">${html.join("")}</div>`;
}

function splitMarkdownTableRow(row) {
  return row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function inlineMarkdown(value) {
  const html = escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)_(.*?)_(?=\s|$)/g, "$1<em>$2</em>")
    .replace(/(^|\s)\*(.*?)\*(?=\s|$)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" data-open-url="$2">$1</a>');

  // Auto-link raw URLs and GitHub issue/PR patterns, while avoiding already processed HTML tags/code blocks
  const tokenRegex = /(<a\b[^>]*>[\s\S]*?<\/a>|<code\b[^>]*>[\s\S]*?<\/code>|<pre\b[^>]*>[\s\S]*?<\/pre>|<[^>]+>)|(\bhttps?:\/\/[^\s<"'`()]+[^\s<"'`().,;:!?[\]])|(\b[a-zA-Z0-9\-]+\/[a-zA-Z0-9_\-\.]+#\d+\b)/gi;

  return html.replace(tokenRegex, (match, preserved, rawUrl, githubIssue) => {
    if (preserved) {
      return match;
    }
    if (rawUrl) {
      return `<a href="${rawUrl}" data-open-url="${rawUrl}">${rawUrl}</a>`;
    }
    if (githubIssue) {
      const parts = githubIssue.split('/');
      const owner = parts[0];
      const rest = parts[1].split('#');
      const repo = rest[0];
      const num = rest[1];
      const url = `https://github.com/${owner}/${repo}/issues/${num}`;
      return `<a href="${url}" data-open-url="${url}">${githubIssue}</a>`;
    }
    return match;
  });
}

function setBusy(busy) {
  state.busy = busy;
  $$("button").forEach((button) => {
    if (!["toggleLogs", "clearActivity"].includes(button.id)) button.disabled = busy;
  });
  document.body.classList.toggle("is-busy", busy);
  $("#logStatus").textContent = busy ? t("reading") : t("idle");
  renderInspector();
}

function switchResultsTab(tabName) {
  $$("[data-results-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.resultsTab === tabName);
  });
  $$(".results-tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `resultsTabContent_${tabName}`);
  });
}

function switchJobsGithubTab(tabName) {
  $$("[data-jobs-github-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.jobsGithubTab === tabName);
  });
  $$(".jobs-github-subpanel").forEach(panel => {
    panel.style.display = panel.id === `${tabName}SubPanel` ? "block" : "none";
  });
}

function setView(viewName, track = true) {
  const githubTabs = ["commands", "results", "jobs", "monitors", "ledger"];
  if (githubTabs.includes(viewName)) {
    switchJobsGithubTab(viewName);
    viewName = "jobs";
  }
  if (state.activeView === viewName) return;
  state.activeView = viewName;
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewName));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  renderInspector();
  if (track) addLog("view", `Opened ${viewName}`, "Screen switched from sidebar/navigation.");
  
  if (viewName === "rss") {
    fetchAndRenderTrends();
  } else if (viewName === "threads") {
    fetchAndRenderThreads(false);
  } else if (viewName === "facebook") {
    fetchAndRenderFacebook(false);
  } else if (viewName === "youtube") {
    fetchAndRenderYouTube(false);
  } else if (viewName === "interest") {
    fetchAndRenderInterest();
  }
}

function openAgentModal(prefill = "") {
  state.agent.modalOpen = true;
  const modal = $("#agentChatModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  $("#agentFab").setAttribute("aria-expanded", "true");
  document.body.classList.add("agent-modal-open");
  if (prefill) $("#agentInput").value = prefill;
  window.setTimeout(() => $("#agentInput").focus(), 0);
}

function closeAgentModal() {
  state.agent.modalOpen = false;
  const modal = $("#agentChatModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  $("#agentFab").setAttribute("aria-expanded", "false");
  document.body.classList.remove("agent-modal-open");
  $("#agentFab").focus();
}

const jobDetailState = {
  jobPath: "",
  activeTab: "overview",
  jobData: null,
  files: [],
  contentCache: {}
};

const managerFileState = {
  path: "",
  open: false
};

function managerFileTitle(filePath) {
  const name = String(filePath || "").split("/").pop() || "Manager file";
  return name
    .replace(/\.md$/i, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function openManagerFileModal(filePath) {
  managerFileState.path = filePath;
  managerFileState.open = true;

  const modal = $("#managerFileModal");
  const body = $("#managerFileBody");
  const openButton = $("#managerFileOpenPath");

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("agent-modal-open");

  $("#managerFilePath").textContent = filePath;
  $("#managerFileTitle").textContent = managerFileTitle(filePath);
  openButton.dataset.openPath = filePath;
  body.innerHTML = `<div class="chat-empty"><strong>Loading...</strong></div>`;

  try {
    const res = await window.moneyDesk.readManagerFile({ path: filePath });
    if (res && res.ok) {
      body.innerHTML = res.content ? markdownToHtml(res.content) : `<p class="empty">File is empty.</p>`;
      addLog("preview", "Opened manager state preview", filePath);
      return;
    }
    body.innerHTML = `<p class="empty">${escapeHtml(res && res.error ? res.error : "File not found")}</p>`;
  } catch (err) {
    body.innerHTML = `<p class="empty">${escapeHtml(err.message || "Unable to load file")}</p>`;
    addLog("error", "Manager state preview failed", err.message || filePath);
  }
}

function closeManagerFileModal() {
  managerFileState.open = false;
  const modal = $("#managerFileModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("agent-modal-open");
}

async function openJobModal(jobPath) {
  jobDetailState.jobPath = jobPath;
  jobDetailState.activeTab = "overview";
  jobDetailState.contentCache = {};
  
  const job = state.dashboard && state.dashboard.jobs ? state.dashboard.jobs.find(j => j.path === jobPath) : null;
  jobDetailState.jobData = job;
  
  const modal = $("#jobDetailModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("agent-modal-open");
  
  $("#jobDetailPath").textContent = jobPath;
  $("#jobDetailTitle").textContent = job ? job.title : jobPath.split("/").pop();
  
  const statusEl = $("#jobDetailStatus");
  statusEl.textContent = job ? (statusEmojiLabels[job.status.key] || job.status.label) : "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‹Å“ Prepared";
  statusEl.className = `job-state ${job ? job.status.key : "prepared"}`;
  
  const scoreEl = $("#jobDetailScore");
  scoreEl.textContent = job ? job.score : "n/a";
  scoreEl.className = `score-pill ${scoreClass(job ? job.score : 0)}`;
  
  $("#jobDetailBudget").textContent = job ? job.budgetLabel : "unknown";
  $("#jobDetailSource").textContent = job ? `${job.source} Ãƒâ€šÃ‚Â· age: ${job.duration ? job.duration.label : "n/a"}` : "manual";
  
  if (job) {
    jobDetailState.files = job.files || [];
    renderJobFiles();
    renderJobSignals();
    renderJobActions();
  }
  
  await selectJobTab("overview");
}

function closeJobModal() {
  const modal = $("#jobDetailModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("agent-modal-open");
}

function renderJobFiles() {
  const list = $("#jobDetailFiles");
  if (!list) return;
  const files = jobDetailState.files;
  if (!files || !files.length) {
    list.innerHTML = `<li class="muted">No files in workspace</li>`;
    return;
  }
  list.innerHTML = files.map(file => `<li><code>${escapeHtml(file)}</code></li>`).join("");
}

function renderJobSignals() {
  const el = $("#jobDetailSignals");
  if (!el) return;
  const job = jobDetailState.jobData;
  if (!job) {
    el.innerHTML = "";
    return;
  }
  const signals = [];
  if (job.signals) {
    if (job.signals.claimed) signals.push(`<span class="tracking-chip active">Claimed</span>`);
    if (job.signals.approved) signals.push(`<span class="tracking-chip active">Approved</span>`);
    if (job.signals.rewarded) signals.push(`<span class="tracking-chip active">Paid</span>`);
    if (job.signals.needsAttention) signals.push(`<span class="tracking-chip attention">Needs Attention</span>`);
  }
  if (job.tracking) {
    if (job.tracking.marked) signals.push(`<span class="tracking-chip">Marked</span>`);
    if (job.tracking.watching) signals.push(`<span class="tracking-chip">Watching</span>`);
  }
  el.innerHTML = signals.length ? signals.map(s => `<div style="display:flex;">${s}</div>`).join("") : `<span class="muted">No active tracking signals</span>`;
}

function renderJobActions() {
  const el = $("#jobDetailActions");
  if (!el) return;
  const job = jobDetailState.jobData;
  if (!job) {
    el.innerHTML = "";
    return;
  }
  
  el.innerHTML = `
    <button class="primary-button" type="button" id="jobDetailOpenVSCodeBtn">ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â» Open in VS Code</button>
    ${job.url ? `<button class="secondary-button" type="button" data-open-url="${escapeHtml(job.url)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ Open on GitHub</button>` : ""}
    ${job.hasMonitor ? `<button class="secondary-button" type="button" data-run-monitor="${escapeHtml(job.path)}">Check monitor</button>` : ""}
    ${job.hasMonitor ? `<button class="secondary-button" type="button" data-check-github-inbox="${escapeHtml(job.path)}">Check GitHub inbox</button>` : ""}
  `;
  
  const vsBtn = $("#jobDetailOpenVSCodeBtn");
  if (vsBtn) {
    vsBtn.addEventListener("click", () => {
      addLog("open", "Opening VS Code directly", job.path);
      if (window.moneyDesk.openVSCode) {
        window.moneyDesk.openVSCode(job.path);
      } else {
        window.moneyDesk.openPath(job.path);
      }
    });
  }
}

async function fetchJobFileSafe(file) {
  if (jobDetailState.contentCache[file]) return jobDetailState.contentCache[file];
  try {
    const res = await window.moneyDesk.readJobFile({ jobPath: jobDetailState.jobPath, file });
    if (res && res.ok) {
      jobDetailState.contentCache[file] = res.content || "";
      return res.content || "";
    }
  } catch (err) {
    console.error(`Failed to load ${file}:`, err);
  }
  return "";
}

async function selectJobTab(tabName) {
  jobDetailState.activeTab = tabName;
  $$("[data-job-tab]").forEach(btn => btn.classList.toggle("active", btn.dataset.jobTab === tabName));
  
  const body = $("#jobDetailBody");
  if (!body) return;
  body.innerHTML = `<div class="chat-empty"><strong>Loading...</strong></div>`;
  
  const job = jobDetailState.jobData;
  
  if (tabName === "overview") {
    if (!job) {
      body.innerHTML = `<p class="empty">No overview data available</p>`;
      return;
    }
    
    const redFlags = job.redFlags && job.redFlags.length 
      ? job.redFlags.map(f => `<li style="color: var(--error); font-weight: 700;">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â ${escapeHtml(f)}</li>`).join("") 
      : `<li>ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ No red flags detected</li>`;
      
    const reasons = job.reasons && job.reasons.length
      ? job.reasons.map(r => `<li>ÃƒÂ¢Ã…â€œÃ‚Â¨ ${escapeHtml(r)}</li>`).join("")
      : `<li>No explicit positive signals listed</li>`;
      
    let monitorHtml = "";
    if (job.hasMonitor) {
      const checkedAt = job.approval && job.approval.checkedAt ? formatDate(job.approval.checkedAt) : "n/a";
      monitorHtml = `
        <div style="margin-top: 18px; padding: 12px; background: var(--surface-container); border: 1px solid var(--line); border-radius: var(--radius);">
          <strong style="display:block; margin-bottom: 6px;">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¡ Monitor Status</strong>
          <p style="margin: 0; font-size: 13px;">Checked at: ${checkedAt}</p>
          <pre style="margin: 6px 0 0; background: var(--bg); padding: 8px; border-radius: 4px; overflow: auto; font-size: 12px;"><code>${escapeHtml(job.latestMonitorLine || "No logs captured yet")}</code></pre>
        </div>
      `;
    }
    
    body.innerHTML = `
      <div style="display: grid; gap: 16px; white-space: normal;">
        <div>
          <h3 style="margin-top:0;">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â Description</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${job.description ? escapeHtml(job.description) : "No description."}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">ÃƒÂ¢Ã…â€œÃ‚Â¨ Positive Signals</h3>
            <ul style="padding-left: 20px; display: grid; gap: 6px;">${reasons}</ul>
          </div>
          <div>
            <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â Risk Signals</h3>
            <ul style="padding-left: 20px; display: grid; gap: 6px;">${redFlags}</ul>
          </div>
        </div>
        ${monitorHtml}
      </div>
    `;
  } else if (tabName === "work_plan") {
    const plan = await fetchJobFileSafe("work_plan.md");
    body.innerHTML = plan ? markdownToHtml(plan) : `<p class="empty">No work_plan.md found in workspace.</p>`;
  } else if (tabName === "bid") {
    const bid = await fetchJobFileSafe("bid.md");
    body.innerHTML = bid ? markdownToHtml(bid) : `<p class="empty">No bid.md found in workspace.</p>`;
  } else if (tabName === "checklist") {
    const checklist = await fetchJobFileSafe("delivery_checklist.md");
    body.innerHTML = checklist ? markdownToHtml(checklist) : `<p class="empty">No delivery_checklist.md found in workspace.</p>`;
  } else if (tabName === "activity") {
    const log = await fetchJobFileSafe("activity_log.md");
    body.innerHTML = log ? markdownToHtml(log) : `<p class="empty">No activity_log.md found in workspace.</p>`;
  }
}

function metric(label, value, hint = "", action = "") {
  const clickableClass = action ? " clickable" : "";
  const actionAttr = action ? ` data-metric-action="${escapeHtml(action)}"` : "";
  const roleAttr = action ? ' role="button" tabindex="0"' : "";
  return `
    <div class="metric${clickableClass}"${actionAttr}${roleAttr}>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
    </div>
  `;
}

function moneySummary(values) {
  const entries = Object.entries(values || {});
  return entries.length
    ? entries.map(([currency, amount]) => `${currency} ${Number(amount).toLocaleString("en-US")}`).join(", ")
    : "0";
}

function searchable(value) {
  return String(value ?? "").toLowerCase();
}

function includesQuery(values, query) {
  const needle = searchable(query).trim();
  if (!needle) return true;
  return values.some((value) => searchable(value).includes(needle));
}

function paginate(scope, items) {
  const filter = state.filters[scope];
  const pageSize = Math.max(1, Number(filter.pageSize || 10));
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  filter.page = Math.min(Math.max(1, Number(filter.page || 1)), pages);
  const start = (filter.page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: filter.page,
    pageSize,
    pages,
    total: items.length,
    start: items.length ? start + 1 : 0,
    end: Math.min(start + pageSize, items.length)
  };
}

function renderPager(scope, pageData) {
  const disabledPrev = pageData.page <= 1 ? "disabled" : "";
  const disabledNext = pageData.page >= pageData.pages ? "disabled" : "";
  return `
    <div class="pager-summary">${pageData.start}-${pageData.end} of ${pageData.total}</div>
    <div class="pager-actions">
      <button class="secondary-button" type="button" data-page-scope="${scope}" data-page-action="first" data-page-total="${pageData.pages}" ${disabledPrev}>First</button>
      <button class="secondary-button" type="button" data-page-scope="${scope}" data-page-action="prev" data-page-total="${pageData.pages}" ${disabledPrev}>Prev</button>
      <span>Page ${pageData.page} / ${pageData.pages}</span>
      <button class="secondary-button" type="button" data-page-scope="${scope}" data-page-action="next" data-page-total="${pageData.pages}" ${disabledNext}>Next</button>
      <button class="secondary-button" type="button" data-page-scope="${scope}" data-page-action="last" data-page-total="${pageData.pages}" ${disabledNext}>Last</button>
    </div>
  `;
}

function setPager(scope, pageData) {
  const target = $(`#${scope}Pager`);
  if (target) target.innerHTML = renderPager(scope, pageData);
}

function sortByText(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, { sensitivity: "base" });
}

function sortByDateDesc(a, b) {
  return new Date(b || 0) - new Date(a || 0);
}

function sortResults(groups, sort) {
  const bestScore = (result) => Math.max(0, ...(result.filteredCandidates || []).map((candidate) => Number(candidate.score || 0)));
  const bestBudget = (result) => Math.max(0, ...(result.filteredCandidates || []).map((candidate) => Number(candidate.budget || 0)));
  return [...groups].sort((a, b) => {
    if (sort === "score_desc") return bestScore(b) - bestScore(a);
    if (sort === "budget_desc") return bestBudget(b) - bestBudget(a);
    if (sort === "count_desc") return b.filteredCandidates.length - a.filteredCandidates.length;
    if (sort === "path_asc") return sortByText(a.path, b.path);
    return sortByDateDesc(a.modifiedAt, b.modifiedAt);
  });
}

function sortJobs(jobs, sort) {
  const statusOrder = { pending_reward: 0, pending_review: 1, local_done: 2, doing: 3, rewarded: 4, prepared: 5 };
  return [...jobs].sort((a, b) => {
    if (sort === "status_asc") {
      const aKey = a.status && a.status.key ? a.status.key : "prepared";
      const bKey = b.status && b.status.key ? b.status.key : "prepared";
      return (statusOrder[aKey] ?? 9) - (statusOrder[bKey] ?? 9) || sortByDateDesc(a.modifiedAt, b.modifiedAt);
    }
    if (sort === "budget_desc") return Number(b.budget || 0) - Number(a.budget || 0);
    if (sort === "score_desc") return Number(b.score || 0) - Number(a.score || 0);
    if (sort === "title_asc") return sortByText(a.title, b.title);
    return sortByDateDesc(a.modifiedAt, b.modifiedAt);
  });
}

function sortMonitors(jobs, sort) {
  return [...jobs].sort((a, b) => {
    if (sort === "status_asc") return sortByText(a.status && a.status.label, b.status && b.status.label);
    if (sort === "attention_desc") return Number(Boolean(b.signals && b.signals.needsAttention)) - Number(Boolean(a.signals && a.signals.needsAttention));
    if (sort === "title_asc") return sortByText(a.title, b.title);
    return sortByDateDesc(a.approval && a.approval.checkedAt, b.approval && b.approval.checkedAt);
  });
}

function renderStats(data) {
  const totals = Object.entries(data.ledger.totals || {}).map(([currency, amount]) => `${currency} ${Number(amount).toLocaleString("en-US")}`).join(", ") || "0";
  const jobSummary = data.stats.jobSummary || {};
  $("#statStrip").innerHTML = [
    metric("ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ Result files", data.stats.resultFiles, `${data.stats.resultCandidates} candidates`, "goto-results"),
    metric("ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â° Jobs", data.stats.jobs, `${jobSummary.doing || 0} doing Ãƒâ€šÃ‚Â· ${jobSummary.localDone || 0} local done Ãƒâ€šÃ‚Â· ${jobSummary.repoCount || 0} repos`, "goto-jobs"),
    metric("ÃƒÂ¢Ã‚ÂÃ‚Â³ Pending reward", jobSummary.pendingReward || 0, `${moneySummary(jobSummary.pendingRewardByCurrency)} expected`, "goto-jobs-pending-reward"),
    metric("ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Rewarded today", moneySummary(jobSummary.rewardedTodayByCurrency), `${jobSummary.rewardedTodayJobs || 0} job(s)`, "goto-ledger-paid"),
    metric("ÃƒÂ¢Ã‚ÂÃ‚Â±ÃƒÂ¯Ã‚Â¸Ã‚Â Avg completion", jobSummary.avgCompletionLabel || "n/a", "approved/rewarded jobs", "goto-jobs-rewarded"),
    metric("ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¡ Monitors", data.stats.launchAgents, `${data.stats.monitoredJobs} active Ãƒâ€šÃ‚Â· ${data.stats.attentionJobs} attention`, "goto-monitors"),
    metric("ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…â€™ Tracking", data.stats.markedJobs || 0, `${data.stats.watchingJobs || 0} watching Ãƒâ€šÃ‚Â· ${data.stats.inboxCommentJobs || 0} inbox comments`, "goto-jobs-tracking"),
    metric("ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Âµ Ledger", totals, `${data.stats.ledgerRows} rows`, "goto-ledger")
  ].join("");
}

function renderPipeline(data) {
  const activeKeys = new Set(["query", "candidate", "score"]);
  if (data.stats.resultFiles > 0) activeKeys.add("results");
  if (data.stats.jobs > 0) {
    activeKeys.add("workspace");
    activeKeys.add("gates");
  }
  if (data.stats.monitoredJobs > 0 || data.stats.launchAgents > 0) activeKeys.add("monitor");
  if (data.stats.ledgerRows > 0) activeKeys.add("ledger");

  $("#pipeline").innerHTML = pipelineSteps.map((step, index) => `
    <div class="pipeline-step ${activeKeys.has(step.key) ? "active" : ""}">
      <span class="step-index">${String(index + 1).padStart(2, "0")} ${step.icon}</span>
      <div>
        <strong>${escapeHtml(step.label)}</strong>
        <p>${escapeHtml(step.detail)}</p>
      </div>
    </div>
  `).join("");
}

function scoreClass(score) {
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
}

function candidateRow(candidate) {
  const flags = candidate.redFlags.length ? candidate.redFlags.join(", ") : "No red flags";
  const searchMeta = [candidate.searchTopic ? `topic ${candidate.searchTopic}` : "", candidate.searchRepo ? `repo ${candidate.searchRepo}` : ""].filter(Boolean).join(" Ãƒâ€šÃ‚Â· ");
  return `
    <article class="candidate-row">
      <div class="score-pill ${scoreClass(candidate.score)}">${candidate.score}</div>
      <div class="row-main">
        <strong title="${escapeHtml(candidate.title)}">${escapeHtml(candidate.title)}</strong>
        <p>${escapeHtml(candidate.sourceFile || candidate.source)} Ãƒâ€šÃ‚Â· ${escapeHtml(candidate.budgetLabel)} Ãƒâ€šÃ‚Â· ${escapeHtml(flags)}</p>
        ${searchMeta ? `<p>${escapeHtml(searchMeta)}</p>` : ""}
      </div>
      <div class="row-actions">
        ${candidate.url ? `<button class="text-button" data-open-url="${escapeHtml(candidate.url)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ Open</button>` : ""}
      </div>
    </article>
  `;
}

function renderTopCandidates(data) {
  $("#topCandidates").innerHTML = data.topCandidates.length
    ? data.topCandidates.map(candidateRow).join("")
    : `<p class="empty">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ candidate. ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y Codex/CLI Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o results rÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“i refresh mÃƒÆ’Ã‚Â n hÃƒÆ’Ã‚Â¬nh nÃƒÆ’Ã‚Â y.</p>`;
}

function renderManagerState(data) {
  $("#managerState").innerHTML = data.managerState.map((file) => `
    <article class="file-tile ${file.exists ? "clickable" : ""}" ${file.exists ? `data-manager-preview-path="${escapeHtml(file.path)}" role="button" tabindex="0"` : ""}>
      <span class="file-state ${file.exists ? "ok" : "missing"}">${file.exists ? "ready" : "missing"}</span>
      <strong>${escapeHtml(file.path)}</strong>
      <p>${escapeHtml(file.preview || "No content")}</p>
    </article>
  `).join("");
}

function renderResults(data) {
  const filter = state.filters.results;
  const groups = data.results.map((result) => {
    const candidates = (result.candidates || []).filter((candidate) => {
      const sourceOk = filter.source === "all" || candidate.source === filter.source;
      const scoreOk = Number(candidate.score || 0) >= Number(filter.minScore || 0);
      const textOk = includesQuery([
        result.path,
        candidate.title,
        candidate.url,
        candidate.source,
        candidate.searchTopic,
        candidate.searchRepo,
        candidate.budgetLabel,
        ...(candidate.reasons || []),
        ...(candidate.redFlags || [])
      ], filter.query);
      return sourceOk && scoreOk && textOk;
    }).sort((a, b) => (b.score - a.score) || ((b.budget || 0) - (a.budget || 0)));
    return { ...result, filteredCandidates: candidates };
  }).filter((result) => result.filteredCandidates.length || includesQuery([result.path], filter.query));
  const sortedGroups = sortResults(groups, filter.sort);
  const pageData = paginate("results", sortedGroups);
  const resultHtml = pageData.items.map((result, index) => `
    <details class="result-group" ${index < 3 ? "open" : ""}>
      <summary>
        <div>
          <strong>${escapeHtml(result.path)}</strong>
          <p>${result.filteredCandidates.length}/${result.count} candidates Ãƒâ€šÃ‚Â· updated ${escapeHtml(formatDate(result.modifiedAt))}</p>
        </div>
        <span class="button-look" data-open-path="${escapeHtml(result.path)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¡ Open JSON</span>
      </summary>
      <div class="candidate-list">
        ${result.filteredCandidates.length ? result.filteredCandidates.slice(0, 8).map(candidateRow).join("") : `<p class="empty">File nÃƒÆ’Ã‚Â y chÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ candidate hÃƒÂ¡Ã‚Â»Ã‚Â£p lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡.</p>`}
      </div>
    </details>
  `).join("");
  $("#resultsList").innerHTML = resultHtml || `<p class="empty">KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y JSON trong results/.</p>`;
  setPager("results", pageData);
}

function jobCard(job) {
  const needsAttention = job.signals && job.signals.needsAttention;
  const rewarded = job.signals && job.signals.rewarded;
  const status = job.status || { key: "prepared", label: "Prepared" };
  const langText = projectText[state.language] || projectText.en;
  const statusLabel = (localizedStatusLabels[state.language] || statusEmojiLabels)[status.key] || status.label;
  const repoLabel = job.repo || job.source || langText.unknown;
  const budgetLabel = job.budgetLabel || langText.unknown;
  const ageLabel = job.duration && job.duration.label ? job.duration.label : "n/a";
  const signalText = job.hasMonitor
    ? `${langText.claim}=${Boolean(job.signals.claimed)} Â· ${langText.approved}=${Boolean(job.signals.approved)} Â· ${langText.rewarded}=${Boolean(job.signals.rewarded)}`
    : langText.noMonitor;
  const marked = Boolean(job.tracking && job.tracking.marked);
  const watching = Boolean(job.tracking && job.tracking.watching);
  const inboxNew = Boolean(job.githubInbox && job.githubInbox.newComment);
  const monitorNew = Boolean(job.signals && job.signals.newComment);
  const isCollapsed = state.collapsedJobs[job.path] !== false; // collapsed by default

  return `
    <article class="job-row ${rewarded ? "rewarded" : needsAttention || inboxNew || monitorNew ? "attention" : ""} ${marked ? "marked" : ""} ${isCollapsed ? "collapsed" : ""}" data-job-path="${escapeHtml(job.path)}">
      <header class="job-row-header clickable-job-header">
        <div class="job-meta">
          <span class="status-dot ${rewarded ? "done" : needsAttention || inboxNew || monitorNew ? "attention" : watching ? "watching" : job.hasMonitor ? "watching" : "idle"}"></span>
          <div>
            <strong>${escapeHtml(job.title)}</strong>
            <p>${escapeHtml(repoLabel)} Ã‚Â· ${escapeHtml(budgetLabel)} Ã‚Â· ${escapeHtml(langText.age)} ${escapeHtml(ageLabel)} Ã‚Â· ${escapeHtml(langText.score)} ${job.score}</p>
          </div>
        </div>
        <div class="job-header-right">
          <span class="job-state ${escapeHtml(status.key)}">${escapeHtml(statusLabel)}</span>
          <button class="job-toggle-btn" aria-label="Toggle details">${isCollapsed ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²"}</button>
        </div>
      </header>

      <div class="job-details-body">
        <div class="job-detail">
          <span>${escapeHtml(job.duration && job.duration.label ? `${langText.time} ${job.duration.label}` : `${langText.time} n/a`)}</span>
          <span>${escapeHtml(signalText)}</span>
          ${marked ? `<span class="tracking-chip">${escapeHtml(langText.marked)}</span>` : ""}
          ${watching ? `<span class="tracking-chip">${escapeHtml(langText.watching)}</span>` : ""}
          ${inboxNew ? `<span class="tracking-chip attention">${escapeHtml(langText.inboxComment)}</span>` : ""}
          ${monitorNew ? `<span class="tracking-chip attention">${escapeHtml(langText.monitorComment)}</span>` : ""}
          ${rewarded ? `<span>${escapeHtml(job.reward && job.reward.label ? job.reward.label : langText.rewardedFallback)}</span>` : ""}
          <span>${job.approvalGates} ${escapeHtml(langText.approvalGates)}</span>
          <span>${job.files.length} ${escapeHtml(langText.files)}</span>
        </div>
        
        <div class="job-actions">
          ${job.url ? `<button class="text-button" data-open-url="${escapeHtml(job.url)}">Ã°Å¸â€â€” ${escapeHtml(langText.issue)}</button>` : ""}
          ${job.hasMonitor ? `<button class="secondary-button" data-run-monitor="${escapeHtml(job.path)}">${escapeHtml(langText.checkAgain)}</button>` : ""}
          ${job.hasMonitor ? `<button class="secondary-button" data-check-github-inbox="${escapeHtml(job.path)}">${escapeHtml(langText.checkInbox)}</button>` : ""}
          <button class="secondary-button" data-toggle-tracking="${escapeHtml(job.path)}" data-tracking-field="marked">${escapeHtml(marked ? langText.unmark : langText.mark)}</button>
          <button class="secondary-button" data-toggle-tracking="${escapeHtml(job.path)}" data-tracking-field="watching">${escapeHtml(watching ? langText.unwatch : langText.watch)}</button>
          <button class="secondary-button" data-open-path="${escapeHtml(job.path)}">Ã°Å¸â€œâ€š ${escapeHtml(langText.openFolder)}</button>
        </div>
      </div>
    </article>
  `;
}

function renderJobs(data) {
  const filter = state.filters.jobs;
  const jobs = data.jobs.filter((job) => {
    const statusKey = job.status && job.status.key ? job.status.key : "prepared";
    const statusOk = filter.status === "all" || statusKey === filter.status;
    const signalOk = filter.signal === "all"
      || (filter.signal === "claimed" && job.signals && job.signals.claimed)
      || (filter.signal === "approved" && job.signals && job.signals.approved)
      || (filter.signal === "rewarded" && job.signals && job.signals.rewarded)
      || (filter.signal === "attention" && job.signals && job.signals.needsAttention)
      || (filter.signal === "marked" && job.tracking && job.tracking.marked)
      || (filter.signal === "watching" && job.tracking && job.tracking.watching)
      || (filter.signal === "new_comment" && (
        (job.signals && job.signals.newComment)
        || (job.githubInbox && job.githubInbox.newComment)
      ))
      || (filter.signal === "no_monitor" && !job.hasMonitor);
    const textOk = includesQuery([
      job.title,
      job.repo,
      job.path,
      job.repo,
      job.source,
      job.url,
      job.budgetLabel,
      statusKey,
      job.latestMonitorLine,
      job.tracking && job.tracking.marked ? "marked" : "",
      job.tracking && job.tracking.watching ? "watching" : "",
      job.githubInbox && job.githubInbox.subjectTitle
    ], filter.query);
    return statusOk && signalOk && textOk;
  });
  const pageData = paginate("jobs", sortJobs(jobs, filter.sort));
  const emptyJobsText = (projectText[state.language] || projectText.en).noJobs;
  $("#jobsList").innerHTML = pageData.items.length ? pageData.items.map(jobCard).join("") : `<p class="empty">${escapeHtml(emptyJobsText)}</p>`;
  setPager("jobs", pageData);
}

function renderMonitors(data) {
  const jobSummary = data.stats.jobSummary || {};
  const filter = state.filters.monitors;
  const launchAgents = data.launchAgents.filter((agent) => includesQuery([
    agent.label,
    agent.repo,
    agent.pr,
    agent.issue,
    agent.jobDir
  ], filter.query));
  const monitoredJobs = data.jobs.filter((job) => {
    if (!job.hasMonitor) return false;
    const statusKey = job.status && job.status.key ? job.status.key : "prepared";
    const statusOk = filter.status === "all"
      || statusKey === filter.status
      || (filter.status === "attention" && job.signals && job.signals.needsAttention);
    const textOk = includesQuery([
      job.title,
      job.path,
      job.latestMonitorLine,
      job.approval && job.approval.repo,
      job.approval && job.approval.pr && job.approval.pr.url,
      job.approval && job.approval.issue && job.approval.issue.url
    ], filter.query);
    return statusOk && textOk;
  });
  const pageData = paginate("monitors", sortMonitors(monitoredJobs, filter.sort));
  const launchHtml = launchAgents.map((agent) => {
    const formattedInterval = agent.interval >= 3600
      ? `${(agent.interval / 3600).toFixed(1).replace(/\.0$/, "")}h`
      : agent.interval >= 60
        ? `${Math.round(agent.interval / 60)}m`
        : `${agent.interval}s`;

    return `
      <article class="launch-agent-card" data-label="${escapeHtml(agent.label)}">
        <div class="agent-card-header">
          <div class="agent-card-title-area">
            <span class="agent-card-avatar">ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬</span>
            <div class="agent-card-title-meta">
              <strong>${escapeHtml(agent.repo || "Global Agent")}</strong>
              <code class="agent-card-plist" title="${escapeHtml(agent.label)}">${escapeHtml(agent.label)}</code>
            </div>
          </div>
          <div class="agent-pulse-wrapper" data-tooltip="Background Active">
            <span class="agent-pulse-dot"></span>
          </div>
        </div>
        <div class="agent-card-body">
          <div class="agent-card-meta-row">
            <span class="agent-meta-badge timing">
              <span class="badge-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬Â¢Ã¢â‚¬â„¢</span> Every ${formattedInterval} (${agent.interval}s)
            </span>
            ${agent.pr ? `
              <span class="agent-meta-badge pr">
                <span class="badge-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â€šÂ¬</span> PR #${escapeHtml(agent.pr)}
              </span>
            ` : ""}
            ${agent.issue ? `
              <span class="agent-meta-badge issue">
                <span class="badge-icon">ÃƒÂ°Ã…Â¸Ã‚ÂÃ…Â¾</span> Issue #${escapeHtml(agent.issue)}
              </span>
            ` : ""}
          </div>
        </div>
        <div class="agent-card-footer">
          <button class="secondary-button compact-btn" data-open-path="${escapeHtml(agent.path)}" title="Open plist file">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¾ Open plist</button>
          ${agent.jobDir ? `<button class="secondary-button compact-btn" data-open-path="${escapeHtml(agent.jobDir)}" title="Open job workspace directory">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¡ Open job</button>` : ""}
        </div>
      </article>
    `;
  }).join("");

  const jobHtml = pageData.items.map((job) => {
    const isCollapsed = state.collapsedMonitors[job.path] !== false; // collapsed by default
    const statusKey = job.status && job.status.key ? job.status.key : "prepared";
    return `
      <article class="monitor-row ${(job.githubInbox && job.githubInbox.newComment) || (job.signals && job.signals.newComment) ? "attention" : ""} ${isCollapsed ? "collapsed" : ""}" data-job-path="${escapeHtml(job.path)}">
        <header class="monitor-row-header clickable-monitor-header">
          <div class="monitor-header-main">
            <strong>${escapeHtml(job.title)}</strong>
            <span class="monitor-plist-label">${escapeHtml(job.repo)}</span>
          </div>
          <div class="monitor-header-right">
            <span class="job-state ${escapeHtml(statusKey)}">${escapeHtml(statusEmojiLabels[statusKey] || (job.status && job.status.label))}</span>
            <button class="monitor-toggle-btn" aria-label="Toggle details">${isCollapsed ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²"}</button>
          </div>
        </header>

        <div class="monitor-row-body">
          <div class="monitor-details">
            <p><strong>Log:</strong> ${escapeHtml(job.latestMonitorLine || "No monitor log line yet")}</p>
            <p><strong>Signals:</strong> ${escapeHtml(`claim=${Boolean(job.signals.claimed)} Ãƒâ€šÃ‚Â· approved=${Boolean(job.signals.approved)} Ãƒâ€šÃ‚Â· rewarded=${Boolean(job.signals.rewarded)}`)}</p>
            ${job.githubInbox && job.githubInbox.checkedAt ? `<p><strong>GitHub Inbox:</strong> ${escapeHtml(`${job.githubInbox.matched ? job.githubInbox.reason || "matched" : "no matching notification"} Ãƒâ€šÃ‚Â· ${job.githubInbox.latestUpdatedAt || "no update"}`)}</p>` : ""}
          </div>
          <div class="job-actions">
            <button class="secondary-button" data-run-monitor="${escapeHtml(job.path)}">Check now</button>
            <button class="secondary-button" data-check-github-inbox="${escapeHtml(job.path)}">Check inbox</button>
            <button class="secondary-button" data-open-path="${escapeHtml(job.path)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¡ Open job</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  $("#monitorList").innerHTML = `
    <h3>ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â  Reward workflow</h3>
    <div class="monitor-summary">
      ${metric("Doing", jobSummary.doing || 0, "monitor active", "goto-jobs-doing")}
      ${metric("Local done", jobSummary.localDone || 0, "awaiting external action", "goto-jobs-local-done")}
      ${metric("Pending review", jobSummary.pendingReview || 0, "claimed, not approved", "goto-jobs-pending-review")}
      ${metric("Pending reward", jobSummary.pendingReward || 0, "approved, not paid", "goto-jobs-pending-reward")}
      ${metric("Rewarded today", moneySummary(jobSummary.rewardedTodayByCurrency), `${jobSummary.rewardedTodayJobs || 0} job(s)`, "goto-ledger-paid")}
    </div>
    <h3>ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â® Jobs by repo</h3>
    <div class="repo-summary">
      ${(jobSummary.repoSummary || []).map((repo) => `
        <article class="repo-row">
          <strong>${escapeHtml(repo.repo)}</strong>
          <span>${repo.total} jobs</span>
          <small>${repo.doing} doing Ãƒâ€šÃ‚Â· ${repo.localDone || 0} local done Ãƒâ€šÃ‚Â· ${repo.pendingReview} review Ãƒâ€šÃ‚Â· ${repo.pendingReward} reward Ãƒâ€šÃ‚Â· ${repo.rewarded} paid</small>
        </article>
      `).join("") || `<p class="empty">KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ repo summary.</p>`}
    </div>
    <h3>ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ LaunchAgents</h3>
    <div class="launch-agents-grid">
      ${launchHtml || `<p class="empty">KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ launchd plist.</p>`}
    </div>
    <h3>ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â Job monitor status</h3>
    ${jobHtml || `<p class="empty">KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ job monitor status.</p>`}
  `;
  setPager("monitors", pageData);
}

function renderLedger(data) {
  const totals = Object.entries(data.ledger.totals || {});
  const totalHtml = totals.length
    ? totals.map(([currency, amount]) => metric(currency, Number(amount).toLocaleString("en-US"), "paid/received/complete")).join("")
    : metric("Total", "0", "No paid rows");

  const filter = state.filters.ledger;
  const filteredRows = data.ledger.rows.filter((row) => {
    const status = searchable(row.status);
    const statusOk = filter.status === "all" || status === filter.status;
    const textOk = includesQuery([row.date, row.job, row.amount, row.currency, row.status, row.notes], filter.query);
    return statusOk && textOk;
  }).sort((a, b) => {
    if (filter.sort === "amount_desc") return Number(b.amount || 0) - Number(a.amount || 0);
    if (filter.sort === "status_asc") return sortByText(a.status, b.status);
    if (filter.sort === "job_asc") return sortByText(a.job, b.job);
    return sortByDateDesc(a.date, b.date);
  });
  const pageData = paginate("ledger", filteredRows);
  const rows = pageData.items.map((row) => `
    <tr>
      <td>${escapeHtml(row.date)}</td>
      <td>${escapeHtml(row.job)}</td>
      <td>${escapeHtml(row.currency)} ${escapeHtml(row.amount)}</td>
      <td><span class="status-label">${escapeHtml(row.status)}</span></td>
      <td>${escapeHtml(row.notes)}</td>
    </tr>
  `).join("");

  $("#ledgerView").innerHTML = `
    <div class="stat-strip compact">${totalHtml}</div>
    <table>
      <thead><tr><th>Date</th><th>Job</th><th>Amount</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ payment row.</td></tr>`}</tbody>
    </table>
  `;
  setPager("ledger", pageData);
}

function renderReferences(data) {
  const filter = state.filters.references;
  const files = data.references
    .filter((file) => includesQuery([file.path, file.title, file.preview], filter.query))
    .sort((a, b) => filter.sort === "title_asc" ? sortByText(a.title, b.title) : sortByText(a.path, b.path));
  const pageData = paginate("references", files);
  $("#referencesList").innerHTML = pageData.items.map((file) => `
    <article class="file-tile">
      <span class="file-state ok">md</span>
      <strong>${escapeHtml(file.path)}</strong>
      <p>${escapeHtml(file.preview || file.title)}</p>
      <button class="text-button" data-open-path="${escapeHtml(file.path)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬â€œ Open</button>
    </article>
  `).join("") || `<p class="empty">KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ reference khÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºp filter.</p>`;
  setPager("references", pageData);
}

function getTrendCategory(item) {
  const text = `${item.title} ${item.description || ""} ${item.news ? item.news.map(n => n.title + " " + (n.snippet || "")).join(" ") : ""}`.toLowerCase();
  
  const sports = ["vs", "cup", "trÃƒÂ¡Ã‚ÂºÃ‚Â­n", "bÃƒÆ’Ã‚Â³ng Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¡", "soccer", "football", "tennis", "nba", "euro", "world cup", "fifa", "ngoÃƒÂ¡Ã‚ÂºÃ‚Â¡i hÃƒÂ¡Ã‚ÂºÃ‚Â¡ng", "cÃƒÂ¡Ã‚ÂºÃ‚Â§u thÃƒÂ¡Ã‚Â»Ã‚Â§", "v-league", "real madrid", "barcelona", "chelsea", "arsenal", "liverpool", "manchester", "mu ", "mc ", "clb", "vÃƒÆ’Ã‚Â´ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ch", "bÃƒÆ’Ã‚Â n thÃƒÂ¡Ã‚ÂºÃ‚Â¯ng", "gold cup", "athlete", "championship", "tournament", "olympics", "racing", "f1", "vÃƒÆ’Ã‚Âµ sÃƒâ€žÃ‚Â©", "mma", "ufc", "bÃƒÆ’Ã‚Â³ng rÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢", "bÃƒÆ’Ã‚Â³ng chuyÃƒÂ¡Ã‚Â»Ã‚Ân", "athletics", "sea games"];
  const entertainment = ["phim", "movie", "show", "drama", "diÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¦n viÃƒÆ’Ã‚Âªn", "ca sÃƒâ€žÃ‚Â©", "album", " mv ", "music", "nhÃƒÂ¡Ã‚ÂºÃ‚Â¡c", "concert", "blackpink", "bts", "rap", "netflix", "rÃƒÂ¡Ã‚ÂºÃ‚Â¡p", "oscars", "oscar", "kpop", "vpop", "showbiz", "hoÃƒÆ’Ã‚Â ng gia", "tÃƒÂ¡Ã‚ÂºÃ‚Â­p ", "tÃƒÂ¡Ã‚ÂºÃ‚Â­p bÃƒÆ’Ã‚Â³ng", "rap viÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t", "sao viÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t", "trÃƒÂ¡Ã‚ÂºÃ‚Â¥n thÃƒÆ’Ã‚Â nh", "sÃƒâ€ Ã‚Â¡n tÃƒÆ’Ã‚Â¹ng", "cinema", "hÃƒÆ’Ã‚Â¡t", "nghÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡ sÃƒâ€žÃ‚Â©", "tÃƒÂ¡Ã‚ÂºÃ‚Â­p phim", "trailer", "actor", "actress", "singer", "song", "celeb"];
  const tech = ["apple", "google", "microsoft", "openai", "chatgpt", " ai ", "ios", "android", "iphone", "samsung", "xiaomi", "oppo", "smartphone", "Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n thoÃƒÂ¡Ã‚ÂºÃ‚Â¡i", "laptop", "macbook", "chipset", "nvidia", "intel", "amd", "space", "nasa", "vÃƒâ€¦Ã‚Â© trÃƒÂ¡Ã‚Â»Ã‚Â¥", "tÃƒÆ’Ã‚Âªn lÃƒÂ¡Ã‚Â»Ã‚Â­a", "game", "gaming", "playstation", "xbox", "nintendo", "steam", "update", "windows", "software", "phÃƒÂ¡Ã‚ÂºÃ‚Â§n mÃƒÂ¡Ã‚Â»Ã‚Âm", "app ", "technology", "khoa hÃƒÂ¡Ã‚Â»Ã‚Âc", "robot", "cyber", "hack", "an ninh mÃƒÂ¡Ã‚ÂºÃ‚Â¡ng"];
  const finance = ["vÃƒÆ’Ã‚Â ng", "gold", " usd", "chÃƒÂ¡Ã‚Â»Ã‚Â©ng khoÃƒÆ’Ã‚Â¡n", "cÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ phiÃƒÂ¡Ã‚ÂºÃ‚Â¿u", "bitcoin", "crypto", "ngÃƒÆ’Ã‚Â¢n hÃƒÆ’Ã‚Â ng", "tÃƒÂ¡Ã‚Â»Ã‚Â· giÃƒÆ’Ã‚Â¡", "lÃƒÆ’Ã‚Â£i suÃƒÂ¡Ã‚ÂºÃ‚Â¥t", "giÃƒÆ’Ã‚Â¡ xÃƒâ€žÃ†â€™ng", "bÃƒÂ¡Ã‚ÂºÃ‚Â¥t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng sÃƒÂ¡Ã‚ÂºÃ‚Â£n", "bÃƒâ€žÃ¢â‚¬Ëœs", "doanh nghiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡p", "kinh tÃƒÂ¡Ã‚ÂºÃ‚Â¿", "finance", "stock", "shares", "invest", "fed ", "lÃƒÂ¡Ã‚ÂºÃ‚Â¡m phÃƒÆ’Ã‚Â¡t", "inflation", "doanh thu", "triÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â´", "bÃƒÂ¡Ã‚ÂºÃ‚Â£n ÃƒÆ’Ã‚Â¡n", "thuÃƒÂ¡Ã‚ÂºÃ‚Â¿", "oil ", "market"];
  const news = ["bÃƒÆ’Ã‚Â£o", "lÃƒâ€¦Ã‚Â©", "thÃƒÂ¡Ã‚Â»Ã‚Âi tiÃƒÂ¡Ã‚ÂºÃ‚Â¿t", "mÃƒâ€ Ã‚Â°a", "nÃƒÂ¡Ã‚ÂºÃ‚Â¯ng nÃƒÆ’Ã‚Â³ng", "tÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng thÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœng", "bÃƒÂ¡Ã‚ÂºÃ‚Â§u cÃƒÂ¡Ã‚Â»Ã‚Â­", "hÃƒÂ¡Ã‚Â»Ã‚Âp", "chÃƒÆ’Ã‚Â­nh phÃƒÂ¡Ã‚Â»Ã‚Â§", "quÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc hÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢i", "tai nÃƒÂ¡Ã‚ÂºÃ‚Â¡n", "chÃƒÆ’Ã‚Â¡y", "hÃƒÂ¡Ã‚Â»Ã‚Âa hoÃƒÂ¡Ã‚ÂºÃ‚Â¡n", "cÃƒÆ’Ã‚Â´ng an", "Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã‚Âu tra", "phÃƒÆ’Ã‚Â¡t biÃƒÂ¡Ã‚Â»Ã†â€™u", "thÃƒÂ¡Ã‚Â»Ã‚Â§ tÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng", "bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ bÃƒÂ¡Ã‚ÂºÃ‚Â¯t", "khÃƒÂ¡Ã‚Â»Ã…Â¸i tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ", "vi phÃƒÂ¡Ã‚ÂºÃ‚Â¡m", "xÃƒÂ¡Ã‚Â»Ã‚Â­ phÃƒÂ¡Ã‚ÂºÃ‚Â¡t", "phÃƒÂ¡Ã‚ÂºÃ‚Â¡t ", "tÃƒÆ’Ã‚Â²a ÃƒÆ’Ã‚Â¡n", "kÃƒÂ¡Ã‚ÂºÃ‚Â¿t ÃƒÆ’Ã‚Â¡n", "chiÃƒÂ¡Ã‚ÂºÃ‚Â¿n tranh", "xung Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t", "quÃƒÆ’Ã‚Â¢n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢i", "tÃƒÂ¡Ã‚ÂºÃ‚Â¥n cÃƒÆ’Ã‚Â´ng", "nÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ ", "earthquake", "Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â¥t", "tsunami", "sÃƒÆ’Ã‚Â³ng thÃƒÂ¡Ã‚ÂºÃ‚Â§n", "tornado", "lÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc xoÃƒÆ’Ã‚Â¡y", "flood", "typhoon", "hurricane", "president", "election", "parliament", "government", "minister", "police", "arrest", "investigate", "court", "trial"];
  const health = ["dÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ch bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh", "covid", "vaccine", "thuÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc", "bÃƒÆ’Ã‚Â¡c sÃƒâ€žÃ‚Â©", "bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh viÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n", "giÃƒÂ¡Ã‚ÂºÃ‚Â£m cÃƒÆ’Ã‚Â¢n", "sÃƒÂ¡Ã‚Â»Ã‚Â©c khÃƒÂ¡Ã‚Â»Ã‚Âe", "triÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u chÃƒÂ¡Ã‚Â»Ã‚Â©ng", "bÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh ", "virus", "vi khuÃƒÂ¡Ã‚ÂºÃ‚Â©n", "y tÃƒÂ¡Ã‚ÂºÃ‚Â¿", "sÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœt ", "ung thÃƒâ€ Ã‚Â°", "Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t quÃƒÂ¡Ã‚Â»Ã‚Âµ", "health", "disease", "medical", "doctor", "hospital", "symptom", "cancer", "stroke"];

  if (sports.some(w => text.includes(w))) return "sports";
  if (entertainment.some(w => text.includes(w))) return "entertainment";
  if (tech.some(w => text.includes(w))) return "tech";
  if (finance.some(w => text.includes(w))) return "finance";
  if (news.some(w => text.includes(w))) return "news";
  if (health.some(w => text.includes(w))) return "health";
  return "other";
}

async function fetchAndRenderTrends(force = false) {
  const geoSelect = $("#trendsGeo");
  if (!geoSelect) return;
  const geo = geoSelect.value || "VN";
  
  const queryInput = $("#trendsQuery");
  const query = queryInput ? queryInput.value.trim().toLowerCase() : "";
  
  const minTrafficSelect = $("#trendsMinTraffic");
  const minTraffic = minTrafficSelect ? Number(minTrafficSelect.value || 0) : 0;

  const topicSelect = $("#trendsTopic");
  const topic = topicSelect ? topicSelect.value : "all";
  
  $("#trendsList").innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã‚ÂÃ‚Â³</span><h3>Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i xu hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng...</h3><p>Ãƒâ€žÃ‚Âang lÃƒÂ¡Ã‚ÂºÃ‚Â¥y dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u RSS tÃƒÂ¡Ã‚Â»Ã‚Â« Google Trends (${geo})...</p></div>`;
  const chartRow = $("#trendsChartRow");
  if (chartRow) chartRow.style.display = "none";

  try {
    if (force || !state.trends || !state.trends.length || state.trendsGeo !== geo) {
      addLog("refresh", `Fetching Google Trends`, `Requesting daily trends RSS for geo=${geo}`);
      const trends = await window.moneyDesk.fetchTrends(geo);
      state.trends = trends || [];
      state.trendsGeo = geo;
    }
    
    const filtered = state.trends.filter(item => {
      const matchQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.news.some(n => n.title.toLowerCase().includes(query) || n.snippet.toLowerCase().includes(query));
      
      const trafficNum = Number(item.traffic.replace(/[^0-9]/g, "")) || 0;
      const matchTraffic = trafficNum >= minTraffic;

      const itemTopic = getTrendCategory(item);
      const matchTopic = topic === "all" || itemTopic === topic;
      
      return matchQuery && matchTraffic && matchTopic;
    });
    
    state.filteredTrendsCount = filtered.length;
    renderTrendsList(filtered.slice(0, state.trendsVisibleCount));
    updateLoadMoreButton("trends", filtered.length, state.trendsVisibleCount);
    renderTrendsChart(filtered);
    
    addLog("success", `Google Trends Loaded`, `Successfully parsed ${filtered.length}/${state.trends.length} daily trends for ${geo}`);
  } catch (err) {
    $("#trendsList").innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â£i xu hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng</h3><p>${escapeHtml(err.message)}</p></div>`;
    updateLoadMoreButton("trends", 0, 0);
    addLog("error", `Failed to fetch trends`, err.message);
  }
}

function updateLoadMoreButton(scope, total, visible) {
  const button = scope === "threads" ? $("#loadMoreThreadsBtn") : $("#loadMoreTrendsBtn");
  if (!button) return;
  const remaining = Math.max(0, Number(total || 0) - Number(visible || 0));
  button.style.display = remaining > 0 ? "inline-flex" : "none";
  button.textContent = remaining > 0
    ? `ÃƒÂ¢Ã‚Â¬Ã¢â‚¬Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â Load more (${remaining} cÃƒÆ’Ã‚Â²n lÃƒÂ¡Ã‚ÂºÃ‚Â¡i)`
    : "ÃƒÂ¢Ã‚Â¬Ã¢â‚¬Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â Load more";
}

function resetTrendsVisibleCount() {
  state.trendsVisibleCount = 8;
}

function loadMoreTrends() {
  state.trendsVisibleCount += 8;
  fetchAndRenderTrends(false);
}

function renderTrendsList(trends) {
  const container = $("#trendsList");
  if (!container) return;
  
  if (!trends || !trends.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y xu hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng nÃƒÆ’Ã‚Â o</h3><p>ThÃƒÂ¡Ã‚Â»Ã‚Â­ Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã‚Âu chÃƒÂ¡Ã‚Â»Ã¢â‚¬Â°nh bÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ lÃƒÂ¡Ã‚Â»Ã‚Âc tÃƒÂ¡Ã‚Â»Ã‚Â« khÃƒÆ’Ã‚Â³a hoÃƒÂ¡Ã‚ÂºÃ‚Â·c quÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc gia khÃƒÆ’Ã‚Â¡c.</p></div>`;
    return;
  }

  const topicLabels = {
    sports: "ÃƒÂ¢Ã…Â¡Ã‚Â½ ThÃƒÂ¡Ã‚Â»Ã†â€™ thao",
    entertainment: "ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â¬ GiÃƒÂ¡Ã‚ÂºÃ‚Â£i trÃƒÆ’Ã‚Â­",
    tech: "ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â» CÃƒÆ’Ã‚Â´ng nghÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡",
    finance: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‹â€  TÃƒÆ’Ã‚Â i chÃƒÆ’Ã‚Â­nh",
    news: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â° ThÃƒÂ¡Ã‚Â»Ã‚Âi sÃƒÂ¡Ã‚Â»Ã‚Â±",
    health: "ÃƒÂ°Ã…Â¸Ã‚Â©Ã‚Âº Y tÃƒÂ¡Ã‚ÂºÃ‚Â¿",
    other: "ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â KhÃƒÆ’Ã‚Â¡c"
  };
  
  container.innerHTML = trends.map((item, index) => {
    let newsHtml = "";
    if (item.news && item.news.length) {
      newsHtml = `
        <div class="trend-news-title">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â° Tin tÃƒÂ¡Ã‚Â»Ã‚Â©c liÃƒÆ’Ã‚Âªn quan</div>
        <ul class="trend-news-list">
          ${item.news.slice(0, 3).map(n => `
            <li class="trend-news-item">
              <a href="#" data-open-url="${escapeHtml(n.url)}">${escapeHtml(n.title)}</a>
              <span class="trend-news-source">${escapeHtml(n.source)}</span>
              ${n.snippet ? `<p class="trend-news-snippet">${escapeHtml(n.snippet)}</p>` : ""}
            </li>
          `).join("")}
        </ul>
      `;
    }

    const topic = getTrendCategory(item);
    const topicBadge = `<span class="trend-topic-badge topic-${topic}">${topicLabels[topic]}</span>`;
    const exploreUrl = (item.news && item.news.length) 
      ? item.news[0].url 
      : `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
    
    return `
      <article class="trend-card">
        <div class="trend-header">
          ${item.picture ? `<img class="trend-img" src="${escapeHtml(item.picture)}" alt="${escapeHtml(item.title)} thumbnail" onerror="this.style.display='none'">` : ""}
          <div class="trend-title-area">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <strong class="trend-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</strong>
              ${topicBadge}
            </div>
            <span class="trend-traffic">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â¥ ${escapeHtml(item.traffic)} searches</span>
          </div>
        </div>
        <div class="trend-body">
          <p class="trend-desc">${escapeHtml(item.description)}</p>
          ${newsHtml}
        </div>
        <div class="trend-footer">
          <button class="secondary-button compact-btn" data-open-url="${escapeHtml(exploreUrl)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ KhÃƒÆ’Ã‚Â¡m phÃƒÆ’Ã‚Â¡ chi tiÃƒÂ¡Ã‚ÂºÃ‚Â¿t</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderTrendsChart(trends) {
  const chartRow = $("#trendsChartRow");
  const svg = $("#trendsBarChart");
  if (!chartRow || !svg) return;
  
  if (!trends || !trends.length) {
    chartRow.style.display = "none";
    return;
  }
  
  chartRow.style.display = "block";
  
  const chartItems = trends
    .map(item => ({
      title: item.title,
      traffic: Number(item.traffic.replace(/[^0-9]/g, "")) || 0,
      trafficLabel: item.traffic
    }))
    .filter(item => item.traffic > 0)
    .slice(0, 8);
    
  if (!chartItems.length) {
    chartRow.style.display = "none";
    return;
  }
  
  const maxTraffic = Math.max(...chartItems.map(item => item.traffic), 5000);
  
  const width = 800;
  const height = 180;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  
  let svgHtml = "";
  
  const gridLevels = 3;
  for (let i = 0; i <= gridLevels; i++) {
    const yVal = Math.round((maxTraffic / gridLevels) * i);
    const yPos = height - paddingBottom - (chartH / gridLevels) * i;
    
    svgHtml += `<line class="chart-grid-line" x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" style="stroke: var(--line); stroke-dasharray: 4; stroke-width: 1;" />`;
    
    let label = yVal >= 1000000 
      ? `${(yVal / 1000000).toFixed(1).replace(/\.0$/, "")}M` 
      : yVal >= 1000 
        ? `${Math.round(yVal / 1000)}K` 
        : yVal;
    svgHtml += `<text class="chart-axis-text" x="${paddingLeft - 8}" y="${yPos + 4}" text-anchor="end" style="font-size: 10px; fill: var(--muted); font-weight: 700;">${label}</text>`;
  }
  
  const barCount = chartItems.length;
  const gap = 16;
  const barW = (chartW - (gap * (barCount - 1))) / barCount;
  
  svgHtml += `
    <defs>
      <linearGradient id="trendBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#ea580c" stop-opacity="0.8" />
      </linearGradient>
    </defs>
  `;
  
  chartItems.forEach((item, index) => {
    const xPos = paddingLeft + index * (barW + gap);
    const barH = (item.traffic / maxTraffic) * chartH;
    const yPos = height - paddingBottom - barH;
    
    svgHtml += `
      <rect 
        x="${xPos}" 
        y="${yPos}" 
        width="${barW}" 
        height="${barH}" 
        fill="url(#trendBarGrad)" 
        rx="4" 
        data-tooltip="<strong>${escapeHtml(item.title)}</strong><br>ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â¥ LÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£ng tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m: ${escapeHtml(item.trafficLabel)}" 
        style="transition: all 0.3s; cursor: pointer;" 
      />
    `;
    
    const truncatedLabel = item.title.length > 10 ? `${item.title.slice(0, 8)}...` : item.title;
    svgHtml += `
      <text 
        class="chart-axis-text" 
        x="${xPos + barW / 2}" 
        y="${height - paddingBottom + 16}" 
        text-anchor="middle" 
        style="font-size: 10px; fill: var(--text); font-weight: 700;"
      >
        ${escapeHtml(truncatedLabel)}
      </text>
    `;
  });
  
  svg.innerHTML = svgHtml;
}

function getThreadsRequest() {
  const query = ($("#threadsQuery")?.value || "AI").trim() || "AI";
  const selectedLimit = Number($("#threadsLimit")?.value || 10) || 10;
  const limit = Math.max(Number(state.threadsVisibleCount || 0), selectedLimit);
  const countrySelect = $("#threadsCountry");
  const country = countrySelect?.value || "";
  const countryLabel = countrySelect?.selectedOptions?.[0]?.textContent || "Global";
  return { query, limit, country, countryLabel };
}

function resetThreadsVisibleCount() {
  state.threadsVisibleCount = Number($("#threadsLimit")?.value || 10) || 10;
}

async function fetchAndRenderThreads(force = false) {
  const container = $("#threadsList");
  if (!container) return;
  const status = $("#threadsStatus");
  const request = getThreadsRequest();

  const cacheKey = `${request.country || "global"}:${request.query}:${request.limit}`;
  if (!force && state.threads.length && state.threadsQuery === cacheKey) {
    renderThreadsChart(state.threads);
    renderThreadsList(state.threads);
    updateThreadsLoadMoreButton(state.threads.length >= request.limit);
    return;
  }

  const scopeLabel = request.countryLabel || "Global";
  container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã‚ÂÃ‚Â³</span><h3>Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i Threads...</h3><p>Ãƒâ€žÃ‚Âang Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc Threads Search scope ${escapeHtml(scopeLabel)} cho query "${escapeHtml(request.query)}".</p></div>`;
  const chartRow = $("#threadsChartRow");
  if (chartRow) chartRow.style.display = "none";
  if (status) status.textContent = `Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i ${request.limit} post tÃƒÂ¡Ã‚Â»Ã‚Â« Threads Search...`;

  try {
    addLog("refresh", "Fetching Threads Search", `query=${request.query}, limit=${request.limit}`);
    const data = await window.moneyDesk.fetchThreads(request);
    state.threads = (data && data.items) || [];
    state.threadsQuery = cacheKey;
    renderThreadsChart(state.threads);
    renderThreadsList(state.threads);
    const queries = data && Array.isArray(data.queries) ? data.queries.join(", ") : request.query;
    if (status) status.textContent = `Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â£i ${state.threads.length}/${request.limit} post cho scope ${scopeLabel}. Queries: ${queries}`;
    updateThreadsLoadMoreButton(state.threads.length >= request.limit);
    addLog("success", "Threads Search loaded", `Parsed ${state.threads.length} post(s).`);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â£i Threads</h3><p>${escapeHtml(err.message)}</p></div>`;
    if (status) status.textContent = "KhÃƒÆ’Ã‚Â´ng tÃƒÂ¡Ã‚ÂºÃ‚Â£i Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c Threads Search.";
    if (chartRow) chartRow.style.display = "none";
    updateThreadsLoadMoreButton(false);
    addLog("error", "Failed to fetch Threads", err.message);
  }
}

function updateThreadsLoadMoreButton(canLoadMore) {
  const button = $("#loadMoreThreadsBtn");
  if (!button) return;
  button.style.display = canLoadMore ? "inline-flex" : "none";
  button.textContent = `ÃƒÂ¢Ã‚Â¬Ã¢â‚¬Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â Load more Threads (${Number(state.threadsVisibleCount || 10) + 10})`;
}

function loadMoreThreads() {
  state.threadsVisibleCount = Number(state.threadsVisibleCount || $("#threadsLimit")?.value || 10) + 10;
  fetchAndRenderThreads(true);
}

function renderThreadsChart(items) {
  const chartRow = $("#threadsChartRow");
  const svg = $("#threadsBarChart");
  if (!chartRow || !svg) return;

  const chartItems = (items || [])
    .map(item => ({
      title: `@${item.username || "thread"}`,
      value: Number(item.like_count || 0),
      replies: Number(item.reply_count || 0),
      query: item.source_query || "n/a"
    }))
    .filter(item => item.value > 0)
    .slice(0, 8);

  if (!chartItems.length) {
    chartRow.style.display = "none";
    svg.innerHTML = "";
    return;
  }

  chartRow.style.display = "block";

  const maxValue = Math.max(...chartItems.map(item => item.value), 10);
  const width = 800;
  const height = 180;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  let svgHtml = `
    <defs>
      <linearGradient id="threadsBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5" />
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0.84" />
      </linearGradient>
    </defs>
  `;

  const gridLevels = 3;
  for (let i = 0; i <= gridLevels; i++) {
    const yVal = Math.round((maxValue / gridLevels) * i);
    const yPos = height - paddingBottom - (chartH / gridLevels) * i;
    const label = yVal >= 1000 ? `${(yVal / 1000).toFixed(1).replace(/\.0$/, "")}K` : yVal;
    svgHtml += `<line class="chart-grid-line" x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" style="stroke: var(--line); stroke-dasharray: 4; stroke-width: 1;" />`;
    svgHtml += `<text class="chart-axis-text" x="${paddingLeft - 8}" y="${yPos + 4}" text-anchor="end" style="font-size: 10px; fill: var(--muted); font-weight: 700;">${label}</text>`;
  }

  const gap = 16;
  const barW = (chartW - (gap * (chartItems.length - 1))) / chartItems.length;
  chartItems.forEach((item, index) => {
    const xPos = paddingLeft + index * (barW + gap);
    const barH = (item.value / maxValue) * chartH;
    const yPos = height - paddingBottom - barH;
    const label = item.title.length > 12 ? `${item.title.slice(0, 10)}...` : item.title;
    svgHtml += `
      <rect
        x="${xPos}"
        y="${yPos}"
        width="${barW}"
        height="${barH}"
        fill="url(#threadsBarGrad)"
        rx="4"
        data-tooltip="<strong>${escapeHtml(item.title)}</strong><br>ÃƒÂ¢Ã‚ÂÃ‚Â¤ÃƒÂ¯Ã‚Â¸Ã‚Â Likes: ${item.value.toLocaleString()}<br>ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¬ Replies: ${item.replies.toLocaleString()}<br>Query: ${escapeHtml(item.query)}"
        style="transition: all 0.3s; cursor: pointer;"
      />
      <text
        class="chart-axis-text"
        x="${xPos + barW / 2}"
        y="${height - paddingBottom + 16}"
        text-anchor="middle"
        style="font-size: 10px; fill: var(--text); font-weight: 700;"
      >${escapeHtml(label)}</text>
    `;
  });

  svg.innerHTML = svgHtml;
}

function renderThreadsList(items) {
  const container = $("#threadsList");
  if (!container) return;

  if (!items || !items.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â</span><h3>ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ thread phÃƒÆ’Ã‚Â¹ hÃƒÂ¡Ã‚Â»Ã‚Â£p</h3><p>ThÃƒÂ¡Ã‚Â»Ã‚Â­ query khÃƒÆ’Ã‚Â¡c hoÃƒÂ¡Ã‚ÂºÃ‚Â·c kiÃƒÂ¡Ã‚Â»Ã†â€™m tra Threads cÃƒÆ’Ã‚Â³ Ãƒâ€žÃ¢â‚¬Ëœang yÃƒÆ’Ã‚Âªu cÃƒÂ¡Ã‚ÂºÃ‚Â§u Ãƒâ€žÃ¢â‚¬ËœÃƒâ€žÃ†â€™ng nhÃƒÂ¡Ã‚ÂºÃ‚Â­p hay khÃƒÆ’Ã‚Â´ng.</p></div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => {
    const text = String(item.text || "").replace(/\s+/g, " ").trim();
    const preview = text.length > 260 ? `${text.slice(0, 257).trim()}...` : text;
    const takenAt = item.taken_at ? formatDate(item.taken_at) : "n/a";
    const thumbnail = item.thumbnail
      ? `<img class="trend-img threads-thumb" src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.username || "Threads")} thumbnail" onerror="this.outerHTML='<div class=&quot;trend-img threads-thumb placeholder&quot; aria-hidden=&quot;true&quot;>ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Âµ</div>'">`
      : `<div class="trend-img threads-thumb placeholder" aria-hidden="true">ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Âµ</div>`;
    return `
      <article class="trend-card threads-card">
        <div class="trend-header">
          ${thumbnail}
          <div class="trend-title-area">
            <div class="threads-title-row">
              <strong class="trend-title">#${index + 1} @${escapeHtml(item.username || "unknown")}</strong>
              <span class="trend-topic-badge topic-tech">${escapeHtml(item.full_name || "Threads")}</span>
            </div>
            <span class="trend-traffic">ÃƒÂ¢Ã‚ÂÃ‚Â¤ÃƒÂ¯Ã‚Â¸Ã‚Â ${Number(item.like_count || 0).toLocaleString()} likes Ãƒâ€šÃ‚Â· ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¬ ${Number(item.reply_count || 0).toLocaleString()} replies Ãƒâ€šÃ‚Â· query: ${escapeHtml(item.source_query || "n/a")} Ãƒâ€šÃ‚Â· ${escapeHtml(takenAt)}</span>
          </div>
        </div>
        <div class="trend-body">
          <p class="trend-desc">${escapeHtml(preview)}</p>
        </div>
        <div class="trend-footer">
          <button class="secondary-button compact-btn" data-open-url="${escapeHtml(item.url)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ MÃƒÂ¡Ã‚Â»Ã…Â¸ thread</button>
        </div>
      </article>
    `;
  }).join("");
}

async function sendThreadsTelegram() {
  const button = $("#sendThreadsTelegramBtn");
  const status = $("#threadsStatus");
  const request = getThreadsRequest();
  if (button) button.disabled = true;
  if (status) status.textContent = `Ãƒâ€žÃ‚Âang gÃƒÂ¡Ã‚Â»Ã‚Â­i bÃƒÆ’Ã‚Â¡o cÃƒÆ’Ã‚Â¡o Threads "${request.query}" vÃƒÂ¡Ã‚Â»Ã‚Â Telegram...`;
  try {
    const result = await window.moneyDesk.sendThreadsReport(request);
    if (status) status.textContent = "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ gÃƒÂ¡Ã‚Â»Ã‚Â­i bÃƒÆ’Ã‚Â¡o cÃƒÆ’Ã‚Â¡o Threads vÃƒÂ¡Ã‚Â»Ã‚Â Telegram.";
    addLog("success", "Sent Threads Telegram report", result.stdout || "Telegram message sent.");
  } catch (err) {
    if (status) status.textContent = `GÃƒÂ¡Ã‚Â»Ã‚Â­i Telegram thÃƒÂ¡Ã‚ÂºÃ‚Â¥t bÃƒÂ¡Ã‚ÂºÃ‚Â¡i: ${err.message}`;
    addLog("error", "Threads Telegram failed", err.message);
  } finally {
    if (button) button.disabled = false;
  }
}

const defaultFacebookSources = [
  "https://www.facebook.com/AIDAILYONE",
  "https://www.facebook.com/groups/antigravityvn",
  "https://www.facebook.com/groups/852586990732832/",
  "https://www.facebook.com/groups/763209466258917/"
];

function getFacebookRequest() {
  const selectedSource = $("#facebookSource")?.value || "all";
  const sources = selectedSource === "all" ? defaultFacebookSources : [selectedSource];
  return {
    sources: sources.join("\n"),
    sourceList: sources,
    limit: Number($("#facebookLimit")?.value || 5) || 5,
    sort: $("#facebookSort")?.value || "newest",
    query: ($("#facebookQuery")?.value || "").trim().toLowerCase()
  };
}

async function fetchAndRenderFacebook(force = false) {
  const container = $("#facebookList");
  if (!container) return;
  const status = $("#facebookStatus");
  const sourceList = $("#facebookSourceList");
  const request = getFacebookRequest();
  const cacheKey = `${request.sources}:${request.limit}:${request.sort}`;

  if (!force && state.facebook && state.facebookKey === cacheKey) {
    renderFacebookSources(state.facebook.sources || []);
    renderFacebookList(state.facebook.items || [], request.query);
    return;
  }

  container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã‚ÂÃ‚Â³</span><h3>Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i Facebook...</h3><p>Ãƒâ€žÃ‚Âang Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc ${request.sourceList.length} nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n page/group Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ chÃƒÂ¡Ã‚Â»Ã¢â‚¬Â° Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh.</p></div>`;
  if (sourceList) sourceList.innerHTML = "";
  if (status) status.textContent = `Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi Ãƒâ€žÃ¢â‚¬Ëœa ${request.limit} bÃƒÆ’Ã‚Â i mÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n...`;

  try {
    addLog("refresh", "Fetching Facebook trends", `${request.sourceList.length} source(s), limit=${request.limit}`);
    const data = await window.moneyDesk.fetchFacebookTrends({
      sources: request.sources,
      limit: request.limit,
      sort: request.sort
    });
    state.facebook = data || { sources: [], items: [] };
    state.facebookKey = cacheKey;
    renderFacebookSources(state.facebook.sources || []);
    renderFacebookList(state.facebook.items || [], request.query);
    const blocked = (state.facebook.sources || []).filter(source => source.login_required).length;
    if (status) {
      status.textContent = `Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â£i ${(state.facebook.items || []).length} bÃƒÆ’Ã‚Â i. ${blocked ? `${blocked} nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n cÃƒÂ¡Ã‚ÂºÃ‚Â§n cookie Ãƒâ€žÃ¢â‚¬ËœÃƒâ€žÃ†â€™ng nhÃƒÂ¡Ã‚ÂºÃ‚Â­p Facebook.` : "CÃƒÆ’Ã‚Â¡c nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n public Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc xong."}`;
    }
    addLog("success", "Facebook trends loaded", `${(state.facebook.items || []).length} post(s), blocked=${blocked}`);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â£i Facebook</h3><p>${escapeHtml(err.message)}</p></div>`;
    if (status) status.textContent = "KhÃƒÆ’Ã‚Â´ng tÃƒÂ¡Ã‚ÂºÃ‚Â£i Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c Facebook trends.";
    addLog("error", "Failed to fetch Facebook trends", err.message);
  }
}

function renderFacebookSources(sources) {
  const container = $("#facebookSourceList");
  if (!container) return;
  if (!sources || !sources.length) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = sources.map((source) => {
    const count = Array.isArray(source.items) ? source.items.length : 0;
    const stateClass = count ? "ok" : source.login_required ? "blocked" : "empty";
    const stateLabel = count ? `${count} bÃƒÆ’Ã‚Â i` : source.login_required ? "CÃƒÂ¡Ã‚ÂºÃ‚Â§n cookie" : "ChÃƒâ€ Ã‚Â°a thÃƒÂ¡Ã‚ÂºÃ‚Â¥y bÃƒÆ’Ã‚Â i public";
    return `
      <button class="facebook-source-chip ${stateClass}" type="button" data-open-url="${escapeHtml(source.source_url)}" title="${escapeHtml(source.error || source.source_url)}">
        <strong>${escapeHtml(source.source || "Facebook")}</strong>
        <span>${escapeHtml(stateLabel)}</span>
      </button>
    `;
  }).join("");
}

function renderFacebookList(items, query = "") {
  const container = $("#facebookList");
  if (!container) return;
  const filtered = (items || []).filter((item) => {
    const haystack = `${item.source || ""} ${item.title || ""} ${item.text || ""}`.toLowerCase();
    return !query || haystack.includes(query);
  });

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â</span><h3>ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ bÃƒÆ’Ã‚Â i Facebook phÃƒÆ’Ã‚Â¹ hÃƒÂ¡Ã‚Â»Ã‚Â£p</h3><p>Facebook cÃƒÆ’Ã‚Â³ thÃƒÂ¡Ã‚Â»Ã†â€™ Ãƒâ€žÃ¢â‚¬Ëœang yÃƒÆ’Ã‚Âªu cÃƒÂ¡Ã‚ÂºÃ‚Â§u Ãƒâ€žÃ¢â‚¬ËœÃƒâ€žÃ†â€™ng nhÃƒÂ¡Ã‚ÂºÃ‚Â­p. CÃƒÆ’Ã‚Â³ thÃƒÂ¡Ã‚Â»Ã†â€™ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â·t FACEBOOK_COOKIE trong .env Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ fetch cÃƒÆ’Ã‚Â¡c nhÃƒÆ’Ã‚Â³m bÃƒÂ¡Ã‚ÂºÃ‚Â¡n cÃƒÆ’Ã‚Â³ quyÃƒÂ¡Ã‚Â»Ã‚Ân xem.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const text = String(item.text || "").replace(/\s+/g, " ").trim();
    const preview = text.length > 360 ? `${text.slice(0, 357).trim()}...` : text;
    return `
      <article class="trend-card facebook-card">
        <div class="trend-header">
          <div class="trend-img facebook-thumb" aria-hidden="true">f</div>
          <div class="trend-title-area">
            <div class="threads-title-row">
              <strong class="trend-title">#${index + 1} ${escapeHtml(item.source || "Facebook")}</strong>
              <span class="trend-topic-badge topic-tech">Score ${Number(item.score || 0).toLocaleString()}</span>
            </div>
            <span class="trend-traffic">${escapeHtml(formatDate(item.captured_at))}</span>
          </div>
        </div>
        <div class="trend-body">
          <p class="trend-desc">${escapeHtml(preview)}</p>
        </div>
        <div class="trend-footer">
          <button class="secondary-button compact-btn" data-open-url="${escapeHtml(item.url || item.source_url)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ MÃƒÂ¡Ã‚Â»Ã…Â¸ bÃƒÆ’Ã‚Â i</button>
          <button class="secondary-button compact-btn" data-open-url="${escapeHtml(item.source_url)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‹Å“ MÃƒÂ¡Ã‚Â»Ã…Â¸ nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n</button>
        </div>
      </article>
    `;
  }).join("");
}

function getYouTubeRequest() {
  return {
    region: $("#youtubeRegion")?.value || "VN",
    period: $("#youtubePeriod")?.value || "24h",
    topic: $("#youtubeTopic")?.value || "all",
    query: ($("#youtubeQuery")?.value || "").trim(),
    sort: $("#youtubeSort")?.value || "trend",
    minScore: Number($("#youtubeMinScore")?.value || 0) || 0,
    limit: Number($("#youtubeLimit")?.value || 12) || 12
  };
}

async function fetchAndRenderYouTube(force = false) {
  const container = $("#youtubeList");
  if (!container) return;
  const status = $("#youtubeStatus");
  const request = getYouTubeRequest();
  const cacheKey = `${request.region}:${request.period}:${request.topic}:${request.query}:${request.sort}:${request.minScore}:${request.limit}`;
  if (!force && state.youtubeKey === cacheKey && state.youtube.length) {
    renderYouTubeList(state.youtube);
    return;
  }
  container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã‚ÂÃ‚Â³</span><h3>Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i YouTube trend...</h3><p>Ãƒâ€žÃ‚Âang lÃƒÂ¡Ã‚ÂºÃ‚Â¥y title vÃƒÆ’Ã‚Â  thumbnail tÃƒÂ¡Ã‚Â»Ã‚Â« YouTube.</p></div>`;
  if (status) status.textContent = `Ãƒâ€žÃ‚Âang tÃƒÂ¡Ã‚ÂºÃ‚Â£i YouTube trend region=${request.region}, chÃƒÂ¡Ã‚Â»Ã‚Â§ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â=${request.topic}, thÃƒÂ¡Ã‚Â»Ã‚Âi gian=${request.period}...`;
  try {
    const data = await window.moneyDesk.fetchYouTubeTrends(request);
    state.youtube = data.items || [];
    state.youtubeKey = cacheKey;
    renderYouTubeList(state.youtube);
    if (status) status.textContent = `Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â£i ${state.youtube.length} video trong ${data.period || request.period}. ChÃƒÂ¡Ã‚Â»Ã‚Â§ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â: ${data.topic || request.topic}. Query: ${data.query || request.query || "default"}`;
    addLog("success", "Loaded YouTube trends", `${state.youtube.length} video(s), region=${request.region}, topic=${request.topic}, period=${request.period}`);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â£i YouTube trend</h3><p>${escapeHtml(err.message)}</p></div>`;
    if (status) status.textContent = `KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â£i YouTube trend: ${err.message}`;
    addLog("error", "YouTube trend failed", err.message);
  }
}

function renderYouTubeList(items) {
  const container = $("#youtubeList");
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â­</span><h3>ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ video</h3><p>ThÃƒÂ¡Ã‚Â»Ã‚Â­ region hoÃƒÂ¡Ã‚ÂºÃ‚Â·c query khÃƒÆ’Ã‚Â¡c.</p></div>`;
    return;
  }
  container.innerHTML = items.map((item, index) => {
    const hooks = (item.analysis?.hooks || []).map(hook => `<span>${escapeHtml(hook)}</span>`).join("");
    const analysis = item.analysis || {};
    const thumbSubjects = (analysis.thumbnail_subjects || []).map(subject => `<span>${escapeHtml(subject)}</span>`).join("");
    const attractionFactors = (analysis.attraction_factors || []).map(factor => `<li>${escapeHtml(factor)}</li>`).join("");
    const keywordChip = (keyword) => {
      const word = keyword.keyword || "";
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(word)}`;
      return `
        <button class="youtube-keyword-chip ${escapeHtml(keyword.type || "secondary")}" type="button" data-open-url="${escapeHtml(url)}" title="${escapeHtml(keyword.reason || "MÃƒÂ¡Ã‚Â»Ã…Â¸ keyword trÃƒÆ’Ã‚Âªn YouTube")}">
          <strong>${escapeHtml(word)}</strong>
          <span>${Number(keyword.predicted_volume || 0).toLocaleString()} Ãƒâ€šÃ‚Â· ${escapeHtml(keyword.volume_label || "n/a")}</span>
        </button>
      `;
    };
    const primaryKeywords = (analysis.primary_keywords || []).map(keywordChip).join("");
    const secondaryKeywords = (analysis.secondary_keywords || []).map(keywordChip).join("");
    const countriesInterest = (analysis.countries_interest || []).map(country => `<span>${escapeHtml(country)}</span>`).join("");
    const productSuggestions = (analysis.product_suggestions || []).map(product => `<li>${escapeHtml(product)}</li>`).join("");
    const creatorMonetization = (analysis.creator_monetization || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const hiddenInsights = (analysis.hidden_creator_insights || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const referenceSources = (analysis.likely_reference_sources || []).map(item => `<span>${escapeHtml(item)}</span>`).join("");
    const nicheReasons = (analysis.niche_reasons || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const nicheSteps = (analysis.niche_starting_steps || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const colorSwatches = (analysis.color_palette || []).map(color => `
      <div class="youtube-color-swatch">
        <span style="background:${escapeHtml(color.hex || "#94a3b8")}"></span>
        <strong>${escapeHtml(color.color || "mÃƒÆ’Ã‚Â u")}</strong>
        <small>${escapeHtml(color.role || "")} Ãƒâ€šÃ‚Â· ${Math.round(Number(color.share || 0) * 100)}%</small>
        <em>${escapeHtml(color.emotion || "")}</em>
      </div>
    `).join("");
    const colorAttractionFactors = (analysis.color_attraction_factors || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const colorReuseSteps = (analysis.color_reuse_steps || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const memorableTerms = (analysis.memorable_terms || []).map(item => `
      <span class="youtube-memory-chip ${String(item.group || "").includes("keyword") ? "keyword" : "note"}" title="${escapeHtml(item.reason || "")}">
        <strong>${escapeHtml(item.term || "")}</strong>
        <small>${escapeHtml(item.group || "")}</small>
      </span>
    `).join("");
    const channelRefs = (analysis.niche_reference_channels || []).map(ref => `
      <button class="youtube-channel-ref" type="button" data-open-url="${escapeHtml(ref.url || "")}" title="${escapeHtml(ref.reason || "MÃƒÂ¡Ã‚Â»Ã…Â¸ YouTube")}">
        <strong>${escapeHtml(ref.label || "Channel")}</strong>
        <span>${escapeHtml(ref.reason || "")}</span>
      </button>
    `).join("");
    return `
      <article class="youtube-card">
        <button class="youtube-thumb" type="button" data-open-url="${escapeHtml(item.url)}">
          <img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.title)} thumbnail">
          <span>${escapeHtml(item.duration || "YouTube")}</span>
        </button>
        <div class="youtube-content">
          <div class="youtube-rank">#${index + 1}</div>
          <h3><button class="youtube-title-button" type="button" data-open-url="${escapeHtml(item.url)}">${escapeHtml(item.title)}</button></h3>
          <div class="youtube-score-strip">
            <span class="overall">Overall ${Number(analysis.overall_score || 0)}/100 Ãƒâ€šÃ‚Â· ${escapeHtml(analysis.score_label || "")}</span>
            <span>Title ${Number(analysis.title_score || 0)}</span>
            <span>Thumbnail ${Number(analysis.thumbnail_score || 0)}</span>
            <span>TÃƒÆ’Ã‚Â¢m lÃƒÆ’Ã‚Â½ ${Number(analysis.psychology_score || 0)}</span>
          </div>
          <div class="youtube-meta">
            <span>${escapeHtml(item.channel || "Unknown channel")}</span>
            <span>${escapeHtml(item.views || "n/a")}</span>
            <span>${escapeHtml(item.published || "n/a")}</span>
          </div>
          <div class="youtube-hooks">${hooks}</div>
          <div class="youtube-analysis">
            <strong>TÃƒÂ¡Ã‚Â»Ã‚Â« cÃƒÂ¡Ã‚ÂºÃ‚Â§n ghi nhÃƒÂ¡Ã‚Â»Ã¢â‚¬Âº</strong>
            <div class="youtube-memory-row">${memorableTerms || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ highlight.</span>"}</div>
            <p>${escapeHtml(item.analysis?.memory_note || "")}</p>
            <strong>Title formula</strong>
            <p>${escapeHtml(item.analysis?.title_formula || "")}</p>
            <strong>Thumbnail formula</strong>
            <p>${escapeHtml(item.analysis?.thumbnail_formula || "")}</p>
            <strong>ChÃƒÂ¡Ã‚Â»Ã‚Â§ thÃƒÂ¡Ã‚Â»Ã†â€™ trong thumbnail</strong>
            <div class="youtube-subjects">${thumbSubjects}</div>
            <p>${escapeHtml(item.analysis?.subject_reason || "")}</p>
            <strong>CÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã‚Â©c chÃƒÂ¡Ã‚Â»Ã‚Â§ thÃƒÂ¡Ã‚Â»Ã†â€™</strong>
            <p>${escapeHtml(item.analysis?.subject_formula || "")}</p>
            <strong>VÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ trÃƒÆ’Ã‚Â­ & bÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ cÃƒÂ¡Ã‚Â»Ã‚Â¥c</strong>
            <p>${escapeHtml(item.analysis?.placement_reason || "")}</p>
            <strong>MÃƒÆ’Ã‚Â u sÃƒÂ¡Ã‚ÂºÃ‚Â¯c & tÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng phÃƒÂ¡Ã‚ÂºÃ‚Â£n</strong>
            <p>${escapeHtml(item.analysis?.color_strategy || "")}</p>
            <div class="youtube-color-grid">${colorSwatches || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c palette mÃƒÆ’Ã‚Â u.</span>"}</div>
            <strong>CÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã‚Â©c phÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi mÃƒÆ’Ã‚Â u</strong>
            <p>${escapeHtml(item.analysis?.color_formula || "")}</p>
            <strong>VÃƒÆ’Ã‚Â¬ sao dÃƒÆ’Ã‚Â¹ng mÃƒÆ’Ã‚Â u Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â³</strong>
            <p>${escapeHtml(item.analysis?.color_formula_reason || "")}</p>
            <strong>CÃƒÂ¡Ã‚ÂºÃ‚Â£m giÃƒÆ’Ã‚Â¡c mÃƒÆ’Ã‚Â u tÃƒÂ¡Ã‚ÂºÃ‚Â¡o ra</strong>
            <p>${escapeHtml(item.analysis?.color_emotional_effect || "")}</p>
            <strong>YÃƒÂ¡Ã‚ÂºÃ‚Â¿u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ khiÃƒÂ¡Ã‚ÂºÃ‚Â¿n mÃƒÆ’Ã‚Â u tÃƒÂ¡Ã‚ÂºÃ‚Â¡o sÃƒÂ¡Ã‚Â»Ã‚Â± thu hÃƒÆ’Ã‚Âºt</strong>
            <ul class="youtube-product-list">${colorAttractionFactors}</ul>
            <strong>CÃƒÆ’Ã‚Â¡ch ÃƒÆ’Ã‚Â¡p dÃƒÂ¡Ã‚Â»Ã‚Â¥ng lÃƒÂ¡Ã‚ÂºÃ‚Â¡i palette nÃƒÆ’Ã‚Â y</strong>
            <ol class="youtube-step-list">${colorReuseSteps}</ol>
            <strong>YÃƒÂ¡Ã‚ÂºÃ‚Â¿u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o sÃƒÂ¡Ã‚Â»Ã‚Â± thu hÃƒÆ’Ã‚Âºt</strong>
            <ul class="youtube-attraction-list">${attractionFactors}</ul>
            <strong>Keyword chÃƒÆ’Ã‚Â­nh</strong>
            <div class="youtube-keyword-row primary">${primaryKeywords || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u keyword chÃƒÆ’Ã‚Â­nh.</span>"}</div>
            <strong>Keyword phÃƒÂ¡Ã‚Â»Ã‚Â¥</strong>
            <div class="youtube-keyword-row">${secondaryKeywords || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u keyword phÃƒÂ¡Ã‚Â»Ã‚Â¥.</span>"}</div>
            <p>${escapeHtml(item.analysis?.keyword_note || "")}</p>
            <strong>YÃƒÂ¡Ã‚ÂºÃ‚Â¿u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ vÃƒâ€žÃ†â€™n hÃƒÆ’Ã‚Â³a</strong>
            <p>${escapeHtml(item.analysis?.cultural_factor || "")}</p>
            <strong>Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ tuÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢i quan tÃƒÆ’Ã‚Â¢m</strong>
            <p>${escapeHtml(item.analysis?.age_interest || "")}</p>
            <strong>QuÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc gia quan tÃƒÆ’Ã‚Â¢m</strong>
            <div class="youtube-country-row">${countriesInterest || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u quÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœc gia.</span>"}</div>
            <strong>TÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡p khÃƒÆ’Ã‚Â¡ch hÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â¿n</strong>
            <p>${escapeHtml(item.analysis?.target_customer || "")}</p>
            <strong>YÃƒÂ¡Ã‚ÂºÃ‚Â¿u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ marketing</strong>
            <p>${escapeHtml(item.analysis?.marketing_angle || "")}</p>
            <strong>Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã‚Â xuÃƒÂ¡Ã‚ÂºÃ‚Â¥t bÃƒÆ’Ã‚Â¡n sÃƒÂ¡Ã‚ÂºÃ‚Â£n phÃƒÂ¡Ã‚ÂºÃ‚Â©m</strong>
            <ul class="youtube-product-list">${productSuggestions}</ul>
            <p>${escapeHtml(item.analysis?.audience_note || "")}</p>
            <strong>CÃƒÆ’Ã‚Â¡ch kÃƒÆ’Ã‚Âªnh cÃƒÆ’Ã‚Â³ thÃƒÂ¡Ã‚Â»Ã†â€™ kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m tiÃƒÂ¡Ã‚Â»Ã‚Ân tÃƒÂ¡Ã‚Â»Ã‚Â« video</strong>
            <p>${escapeHtml(item.analysis?.creator_revenue_read || "")}</p>
            <ul class="youtube-product-list">${creatorMonetization}</ul>
            <strong>BÃƒÆ’Ã‚Â­ mÃƒÂ¡Ã‚ÂºÃ‚Â­t/insight ÃƒÆ’Ã‚Â­t thÃƒÂ¡Ã‚ÂºÃ‚Â¥y</strong>
            <ul class="youtube-product-list">${hiddenInsights}</ul>
            <strong>HÃƒÂ¡Ã‚Â»Ã‚Â cÃƒÆ’Ã‚Â³ thÃƒÂ¡Ã‚Â»Ã†â€™ tham khÃƒÂ¡Ã‚ÂºÃ‚Â£o tÃƒÂ¡Ã‚Â»Ã‚Â« Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¢u</strong>
            <div class="youtube-source-row">${referenceSources || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u nguÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n tham khÃƒÂ¡Ã‚ÂºÃ‚Â£o.</span>"}</div>
            <strong>ÃƒÆ’Ã‚Â tÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã…Â¸ng cÃƒÆ’Ã‚Â³ thÃƒÂ¡Ã‚Â»Ã†â€™ bÃƒÂ¡Ã‚ÂºÃ‚Â¯t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u tÃƒÂ¡Ã‚Â»Ã‚Â« Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¢u</strong>
            <p>${escapeHtml(item.analysis?.idea_origin || "")}</p>
            <p>${escapeHtml(item.analysis?.creator_strategy_note || "")}</p>
            <strong>CÃƒÆ’Ã‚Â³ nÃƒÆ’Ã‚Âªn lÃƒÆ’Ã‚Â m ngÃƒÆ’Ã‚Â¡ch nÃƒÆ’Ã‚Â y khÃƒÆ’Ã‚Â´ng?</strong>
            <div class="youtube-niche-verdict">
              <span>${Number(item.analysis?.niche_score || 0)}/100</span>
              <strong>${escapeHtml(item.analysis?.niche_verdict || "ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u")}</strong>
            </div>
            <ul class="youtube-product-list">${nicheReasons}</ul>
            <strong>BÃƒÂ¡Ã‚ÂºÃ‚Â¯t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u tÃƒÂ¡Ã‚Â»Ã‚Â« Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¢u Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ lÃƒÆ’Ã‚Â m ngÃƒÆ’Ã‚Â¡ch nÃƒÆ’Ã‚Â y</strong>
            <ol class="youtube-step-list">${nicheSteps}</ol>
            <strong>KÃƒÆ’Ã‚Âªnh liÃƒÆ’Ã‚Âªn quan Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ tham khÃƒÂ¡Ã‚ÂºÃ‚Â£o</strong>
            <div class="youtube-channel-grid">${channelRefs || "<span class=\"muted\">ChÃƒâ€ Ã‚Â°a Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â§ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u kÃƒÆ’Ã‚Âªnh tham khÃƒÂ¡Ã‚ÂºÃ‚Â£o.</span>"}</div>
            <strong>Deep thumbnail formula</strong>
            <p>${escapeHtml(item.analysis?.thumbnail_deep_formula || "")}</p>
            <strong>TÃƒÆ’Ã‚Â¢m lÃƒÆ’Ã‚Â½ hÃƒÂ¡Ã‚Â»Ã‚Âc</strong>
            <p>${escapeHtml(item.analysis?.title_note || "")}</p>
            <strong>LÃƒÆ’Ã‚Â½ do chÃƒÂ¡Ã‚ÂºÃ‚Â¥m Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã†â€™m</strong>
            <p>${escapeHtml(item.analysis?.score_reason || "")}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function fetchAndRenderInterest() {
  const status = $("#interestStatus");
  const period = $("#interestPeriod")?.value || "24h";
  if (status) status.textContent = `Ãƒâ€žÃ‚Âang phÃƒÆ’Ã‚Â¢n tÃƒÆ’Ã‚Â­ch dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ lÃƒâ€ Ã‚Â°u trong ${period}...`;
  try {
    const data = await window.moneyDesk.analyzeTrendArchive({ period });
    state.interest = data;
    renderInterest(data);
    if (status) status.textContent = `Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ phÃƒÆ’Ã‚Â¢n tÃƒÆ’Ã‚Â­ch ${data.records} record tÃƒÂ¡Ã‚Â»Ã‚Â« ${data.files} file lÃƒâ€ Ã‚Â°u trÃƒÂ¡Ã‚Â»Ã‚Â¯. CÃƒÂ¡Ã‚ÂºÃ‚Â­p nhÃƒÂ¡Ã‚ÂºÃ‚Â­t: ${formatDate(data.generatedAt)}`;
    addLog("success", "Analyzed trend archive", `${data.records} records, period=${period}`);
  } catch (err) {
    if (status) status.textContent = `KhÃƒÆ’Ã‚Â´ng thÃƒÂ¡Ã‚Â»Ã†â€™ phÃƒÆ’Ã‚Â¢n tÃƒÆ’Ã‚Â­ch dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u: ${err.message}`;
    ["#interestTopList", "#interestMoneyList", "#interestForecastList"].forEach((selector) => {
      const el = $(selector);
      if (el) el.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span><h3>KhÃƒÆ’Ã‚Â´ng cÃƒÆ’Ã‚Â³ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u</h3><p>${escapeHtml(err.message)}</p></div>`;
    });
    addLog("error", "Trend archive analysis failed", err.message);
  }
}

function renderInterest(data) {
  renderInterestCharts(data);
  renderTopicList("#interestTopList", data.topInterest || [], "interest");
  renderTopicList("#interestMoneyList", data.topMoney || [], "money");
  renderTopicList("#interestForecastList", data.forecast || [], "forecast");
}

function renderInterestCharts(data) {
  const topics = data.topics || [];
  renderInterestSourceDonut(data);
  renderInterestBarChart("#interestScoreChart", topics.slice(0, 6), "interestScore", ["#f97316", "#ea580c"], "Interest");
  renderInterestBarChart("#interestMoneyChart", data.topMoney || [], "money", ["#10b981", "#059669"], "Money");
  renderInterestBarChart("#interestForecastChart", data.forecast || [], "forecastScore", ["#4f46e5", "#2563eb"], "Forecast");
}

function renderInterestSourceDonut(data) {
  const svg = $("#interestSourceDonut");
  const legend = $("#interestSourceLegend");
  const count = $("#interestRecordCount");
  if (!svg || !legend) return;
  const rss = (data.topics || []).reduce((sum, topic) => sum + Number(topic.rssCount || 0), 0);
  const threads = (data.topics || []).reduce((sum, topic) => sum + Number(topic.threadsCount || 0), 0);
  const total = Math.max(0, rss + threads);
  if (count) count.textContent = String(data.records || total || 0);
  if (!total) {
    svg.innerHTML = "";
    legend.innerHTML = `<span class="muted">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u.</span>`;
    return;
  }
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const rssLength = (rss / total) * circumference;
  const threadsLength = circumference - rssLength;
  svg.innerHTML = `
    <circle cx="100" cy="100" r="${radius}" fill="none" stroke="var(--surface-container)" stroke-width="22" />
    <circle class="clickable-chart-segment" cx="100" cy="100" r="${radius}" fill="none" stroke="#f97316" stroke-width="22" stroke-dasharray="${rssLength} ${circumference - rssLength}" stroke-dashoffset="0" transform="rotate(-90 100 100)" data-interest-source="rss" data-tooltip="<strong>RSS</strong><br>${rss} tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u" tabindex="0" role="button" />
    <circle class="clickable-chart-segment" cx="100" cy="100" r="${radius}" fill="none" stroke="#4f46e5" stroke-width="22" stroke-dasharray="${threadsLength} ${circumference - threadsLength}" stroke-dashoffset="${-rssLength}" transform="rotate(-90 100 100)" data-interest-source="threads" data-tooltip="<strong>Threads</strong><br>${threads} tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u" tabindex="0" role="button" />
  `;
  legend.innerHTML = [
    `<div class="legend-item"><span class="legend-color" style="background:#f97316"></span><span>RSS</span><span class="legend-val">${rss}</span></div>`,
    `<div class="legend-item"><span class="legend-color" style="background:#4f46e5"></span><span>Threads</span><span class="legend-val">${threads}</span></div>`
  ].join("");
}

function renderInterestBarChart(selector, topics, key, gradient, label) {
  const svg = $(selector);
  if (!svg) return;
  const items = (topics || []).slice(0, 6).map(topic => ({
    topic: topic.topic,
    value: key === "money" ? Number(topic.monetization && topic.monetization.score || 0) : Number(topic[key] || 0),
    frequency: topic.frequency || 0
  })).filter(item => item.value > 0);
  if (!items.length) {
    svg.innerHTML = `<text x="200" y="95" text-anchor="middle" class="chart-axis-text">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u</text>`;
    return;
  }
  const width = 400;
  const height = 180;
  const paddingLeft = 42;
  const paddingRight = 12;
  const paddingTop = 18;
  const paddingBottom = 34;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const maxValue = Math.max(...items.map(item => item.value), 10);
  const gradId = `grad_${selector.replace(/[^a-z0-9]/gi, "")}`;
  let html = `
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${gradient[0]}" />
        <stop offset="100%" stop-color="${gradient[1]}" stop-opacity="0.85" />
      </linearGradient>
    </defs>
  `;
  for (let i = 0; i <= 3; i++) {
    const yVal = Math.round((maxValue / 3) * i);
    const yPos = height - paddingBottom - (chartH / 3) * i;
    const yLabel = yVal >= 1000 ? `${(yVal / 1000).toFixed(1).replace(/\.0$/, "")}K` : yVal;
    html += `<line class="chart-grid-line" x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" />`;
    html += `<text class="chart-axis-text" x="${paddingLeft - 8}" y="${yPos + 4}" text-anchor="end">${yLabel}</text>`;
  }
  const gap = 12;
  const barW = (chartW - gap * (items.length - 1)) / items.length;
  items.forEach((item, index) => {
    const x = paddingLeft + index * (barW + gap);
    const barH = (item.value / maxValue) * chartH;
    const y = height - paddingBottom - barH;
    const short = item.topic.length > 10 ? `${item.topic.slice(0, 8)}...` : item.topic;
    html += `
      <rect class="chart-bar clickable-chart-bar" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="url(#${gradId})" data-interest-topic="${escapeHtml(item.topic)}" data-tooltip="<strong>${escapeHtml(item.topic)}</strong><br>${label}: ${item.value.toLocaleString()}<br>TÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u: ${item.frequency}" tabindex="0" role="button" />
      <text class="chart-axis-text" x="${x + barW / 2}" y="${height - 12}" text-anchor="middle">${escapeHtml(short)}</text>
    `;
  });
  svg.innerHTML = html;
}

function renderTopicList(selector, topics, mode) {
  const container = $(selector);
  if (!container) return;
  if (!topics.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â­</span><h3>ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u lÃƒâ€ Ã‚Â°u</h3><p>BÃƒÂ¡Ã‚ÂºÃ‚Â¥m ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œLÃƒâ€ Ã‚Â°u dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u hÃƒÆ’Ã‚Â´m nayÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o snapshot RSS vÃƒÆ’Ã‚Â  Threads Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u tiÃƒÆ’Ã‚Âªn.</p></div>`;
    return;
  }
  container.innerHTML = topics.map((topic, index) => {
    const score = mode === "money" ? topic.monetization.score : mode === "forecast" ? topic.forecastScore : topic.interestScore;
    const label = mode === "money" ? topic.monetization.label : mode === "forecast" ? `Growth ${Math.round(topic.growth * 100)}%` : `${topic.frequency} tÃƒÆ’Ã‚Â­n hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u`;
    const examples = (topic.examples || []).slice(0, 2).map(example => `
      <li>
        ${example.url ? `<a href="#" data-open-url="${escapeHtml(example.url)}">${escapeHtml(example.title)}</a>` : escapeHtml(example.title)}
        <span>${escapeHtml(example.source)} Ãƒâ€šÃ‚Â· ${escapeHtml(formatDate(example.date))}</span>
      </li>
    `).join("");
    const ideas = topic.monetization && topic.monetization.ideas ? topic.monetization.ideas.slice(0, 2).join(" ") : "";
    return `
      <article class="topic-card" data-topic-card="${escapeHtml(topic.topic)}" data-topic-rss="${Number(topic.rssCount || 0)}" data-topic-threads="${Number(topic.threadsCount || 0)}">
        <div class="topic-rank">#${index + 1}</div>
        <div class="topic-main">
          <div class="topic-title-row">
            <strong>${escapeHtml(topic.topic)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
          <div class="topic-score">
            <span>Score ${Number(score || 0).toLocaleString()}</span>
            <span>RSS ${Number(topic.rssCount || 0)}</span>
            <span>Threads ${Number(topic.threadsCount || 0)}</span>
            <span>ÃƒÂ¢Ã‚ÂÃ‚Â¤ÃƒÂ¯Ã‚Â¸Ã‚Â ${Number(topic.totalLikes || 0).toLocaleString()}</span>
            <span>ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â¥ ${Number(topic.totalTraffic || 0).toLocaleString()}</span>
          </div>
          <div class="topic-keywords">${(topic.keywords || []).map(word => `<span>${escapeHtml(word)}</span>`).join("")}</div>
          ${ideas ? `<p class="topic-ideas">${escapeHtml(ideas)}</p>` : ""}
          <ul class="topic-examples">${examples}</ul>
        </div>
      </article>
    `;
  }).join("");
}

function clearTopicHighlights() {
  $$(".topic-card.highlight").forEach(card => card.classList.remove("highlight"));
}

function highlightTopicCards(predicate, detail) {
  clearTopicHighlights();
  const cards = $$(".topic-card").filter(predicate);
  cards.forEach(card => card.classList.add("highlight"));
  if (cards[0]) cards[0].scrollIntoView({ behavior: "smooth", block: "center" });
  if (detail) addLog("chart", "Selected interest chart item", detail);
}

function selectInterestTopic(topic) {
  const value = String(topic || "");
  highlightTopicCards(
    card => card.dataset.topicCard === value,
    `Topic: ${value}`
  );
}

function selectInterestSource(source) {
  const key = String(source || "");
  highlightTopicCards(
    card => Number(card.dataset[key === "rss" ? "topicRss" : "topicThreads"] || 0) > 0,
    `Source: ${key}`
  );
}

async function archiveTrendsNow() {
  const button = $("#archiveTrendsNowBtn");
  const status = $("#interestStatus");
  if (button) button.disabled = true;
  if (status) status.textContent = "Ãƒâ€žÃ‚Âang lÃƒâ€ Ã‚Â°u snapshot RSS vÃƒÆ’Ã‚Â  Threads hÃƒÆ’Ã‚Â´m nay...";
  try {
    const result = await window.moneyDesk.runTrendArchive();
    if (status) status.textContent = result.stdout || "Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ lÃƒâ€ Ã‚Â°u dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u hÃƒÆ’Ã‚Â´m nay.";
    await fetchAndRenderInterest();
  } catch (err) {
    if (status) status.textContent = `LÃƒâ€ Ã‚Â°u dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u thÃƒÂ¡Ã‚ÂºÃ‚Â¥t bÃƒÂ¡Ã‚ÂºÃ‚Â¡i: ${err.message}`;
  } finally {
    if (button) button.disabled = false;
  }
}

function renderSchedules(data) {
  const filter = state.filters.schedules;
  const launchAgents = (data.launchAgents || []).filter((agent) => {
    // Type filtering
    if (filter.type === "interval" && !agent.interval) return false;
    if (filter.type === "calendar" && !agent.calendar) return false;
    if (filter.type === "monitor" && agent.script !== "monitor_approval.py" && !agent.pr && !agent.issue) return false;

    // Text query filtering
    return includesQuery([
      agent.label,
      agent.script,
      agent.path,
      agent.repo,
      agent.pr,
      agent.issue,
      agent.jobDir,
      agent.outPath,
      agent.errPath
    ], filter.query);
  });

  const pageData = paginate("schedules", launchAgents);

  const html = pageData.items.map((agent) => {
    const triggerText = agent.calendar 
      ? `ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Â¦ ${agent.calendar}` 
      : agent.interval 
        ? `ÃƒÂ°Ã…Â¸Ã¢â‚¬Â¢Ã¢â‚¬â„¢ LÃƒÂ¡Ã‚ÂºÃ‚Â·p lÃƒÂ¡Ã‚ÂºÃ‚Â¡i mÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i ${agent.interval < 3600 ? `${agent.interval / 60} phÃƒÆ’Ã‚Âºt` : `${agent.interval / 3600} giÃƒÂ¡Ã‚Â»Ã‚Â`}` 
        : "ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬Å¾ ChÃƒÂ¡Ã‚ÂºÃ‚Â¡y mÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t lÃƒÂ¡Ã‚ÂºÃ‚Â§n / KhÃƒÆ’Ã‚Â´ng rÃƒÆ’Ã‚Âµ trigger";
    const fullCommand = agent.args && agent.args.length ? agent.args.join(" ") : `python3 ${agent.script || agent.label}`;
    
    let logHtml = "";
    if (agent.outPath || agent.errPath) {
      logHtml = `
        <div class="schedule-logs-section">
          <strong>ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â¾ NhÃƒÂ¡Ã‚ÂºÃ‚Â­t kÃƒÆ’Ã‚Â½ thÃƒÂ¡Ã‚Â»Ã‚Â±c thi (Logs)</strong>
          <div class="schedule-log-items">
            ${agent.outPath ? `
              <div class="log-file-item">
                <div class="log-file-meta">
                  <span class="file-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¾</span>
                  <div>
                    <strong>Stdout log</strong>
                    <span class="muted">${agent.outSize ? `${(agent.outSize / 1024).toFixed(2)} KB` : "TrÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœng"} Ãƒâ€šÃ‚Â· CÃƒÂ¡Ã‚ÂºÃ‚Â­p nhÃƒÂ¡Ã‚ÂºÃ‚Â­t: ${agent.outModified ? formatDate(agent.outModified) : "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³"}</span>
                  </div>
                </div>
                <button class="secondary-button" data-open-path="${escapeHtml(agent.outPath)}">Open Stdout</button>
              </div>
            ` : ""}
            ${agent.errPath ? `
              <div class="log-file-item">
                <div class="log-file-meta">
                  <span class="file-icon err">ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â</span>
                  <div>
                    <strong>Stderr log</strong>
                    <span class="muted">${agent.errSize ? `${(agent.errSize / 1024).toFixed(2)} KB` : "TrÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœng"} Ãƒâ€šÃ‚Â· CÃƒÂ¡Ã‚ÂºÃ‚Â­p nhÃƒÂ¡Ã‚ÂºÃ‚Â­t: ${agent.errModified ? formatDate(agent.errModified) : "ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³"}</span>
                  </div>
                </div>
                <button class="secondary-button" data-open-path="${escapeHtml(agent.errPath)}">Open Stderr</button>
              </div>
            ` : ""}
          </div>
        </div>
      `;
    }

    const isMonitor = agent.script === "monitor_approval.py" || agent.pr || agent.issue;
    const badgeClass = isMonitor ? "monitor" : agent.calendar ? "calendar" : "interval";
    const badgeLabel = isMonitor ? "Monitor Agent" : agent.calendar ? "Calendar Agent" : "Interval Agent";
    const isCollapsed = state.collapsedSchedules[agent.label] !== false;

    return `
      <article class="schedule-card ${isCollapsed ? "collapsed" : ""}" data-label="${escapeHtml(agent.label)}">
        <header class="schedule-card-header clickable-header">
          <div class="schedule-header-main">
            <span class="schedule-icon-dot ${badgeClass}"></span>
            <div>
              <h3>${escapeHtml(agent.script || agent.label)}</h3>
              <span class="schedule-plist-label">${escapeHtml(agent.label)}</span>
            </div>
          </div>
          <div class="schedule-header-right">
            <span class="schedule-type-badge ${badgeClass}">${badgeLabel}</span>
            <button class="schedule-toggle-btn" aria-label="Toggle details">${isCollapsed ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²"}</button>
          </div>
        </header>

        <div class="schedule-card-body">
          <div class="schedule-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Trigger</span>
              <strong class="meta-value">${escapeHtml(triggerText)}</strong>
            </div>
            ${agent.repo ? `
              <div class="meta-item">
                <span class="meta-label">Target Repository</span>
                <strong class="meta-value">${escapeHtml(agent.repo)}</strong>
              </div>
            ` : ""}
            ${agent.pr ? `
              <div class="meta-item">
                <span class="meta-label">PR / Issue</span>
                <strong class="meta-value">PR #${escapeHtml(agent.pr)} Ãƒâ€šÃ‚Â· Issue #${escapeHtml(agent.issue)}</strong>
              </div>
            ` : ""}
          </div>

          <div class="schedule-command-box">
            <span class="meta-label">LÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh thÃƒÂ¡Ã‚Â»Ã‚Â±c thi</span>
            <pre class="terminal compact-terminal"><code>${escapeHtml(fullCommand)}</code></pre>
          </div>

          ${logHtml}
        </div>

        <footer class="schedule-card-footer">
          <button class="secondary-button icon-button-left" data-open-path="${escapeHtml(agent.path)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¡ Xem file .plist</button>
          ${agent.jobDir ? `<button class="secondary-button" data-open-path="${escapeHtml(agent.jobDir)}">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Å¡ MÃƒÂ¡Ã‚Â»Ã…Â¸ thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c Job</button>` : ""}
        </footer>
      </article>
    `;
  }).join("");

  $("#schedulesList").innerHTML = html || `
    <div class="empty-state">
      <span class="empty-icon">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Â¦</span>
      <h3>KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y Schedule nÃƒÆ’Ã‚Â o</h3>
      <p>KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y LaunchAgent nÃƒÆ’Ã‚Â o khÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºp vÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi tÃƒÂ¡Ã‚Â»Ã‚Â« khÃƒÆ’Ã‚Â³a tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m hoÃƒÂ¡Ã‚ÂºÃ‚Â·c bÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ lÃƒÂ¡Ã‚Â»Ã‚Âc.</p>
    </div>
  `;
  setPager("schedules", pageData);
}

function renderDataScope(scope) {
  if (scope === "skills") {
    renderAgentSkills();
    return;
  }
  if (!state.dashboard) return;
  const renderers = {
    results: renderResults,
    jobs: renderJobs,
    monitors: renderMonitors,
    schedules: renderSchedules,
    ledger: renderLedger,
    references: renderReferences
  };
  if (renderers[scope]) renderers[scope](state.dashboard);
}

function resetFilters(scope) {
  const defaults = {
    results: { query: "", source: "all", minScore: 0, sort: "modified_desc", page: 1, pageSize: 5 },
    jobs: { query: "", status: "all", signal: "all", sort: "modified_desc", page: 1, pageSize: 10 },
    monitors: { query: "", status: "all", sort: "checked_desc", page: 1, pageSize: 10 },
    schedules: { query: "", type: "all", page: 1, pageSize: 10 },
    ledger: { query: "", status: "all", sort: "date_desc", page: 1, pageSize: 10 },
    references: { query: "", sort: "path_asc", page: 1, pageSize: 12 },
    skills: { query: "", page: 1, pageSize: 6 }
  };
  state.filters[scope] = { ...defaults[scope] };
  $$(`[data-filter-scope="${scope}"]`).forEach((input) => {
    const key = input.dataset.filterKey;
    if (key in state.filters[scope]) input.value = state.filters[scope][key];
  });
  renderDataScope(scope);
  addLog("filter", `Reset ${scope} filters`, "Search, filter, and pagination restored to defaults.");
}

function renderAgentMessages() {
  const messageHtml = state.agent.messages.map((message, index) => `
      <article class="chat-message ${escapeHtml(message.role)}">
        <header>
          <strong>${message.role === "user" ? "You" : "Agent"}</strong>
          <time>${escapeHtml(message.time || "")}</time>
          <button class="text-button" type="button" data-copy-message="${index}">Copy</button>
        </header>
        <div class="chat-bubble">${message.role === "assistant" ? markdownToHtml(message.content) : escapeHtml(message.content)}</div>
      </article>
    `).join("");
  const thinkingHtml = state.agent.running ? renderAgentThinkingMessage() : "";
  $("#agentMessages").innerHTML = messageHtml || thinkingHtml
    ? `${messageHtml}${thinkingHtml}`
    : `<div class="chat-empty">
        <strong>Agent Chat chÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ message.</strong>
        <p>DÃƒÆ’Ã‚Â¹ng ngÃƒÆ’Ã‚Â´n ngÃƒÂ¡Ã‚Â»Ã‚Â¯ tÃƒÂ¡Ã‚Â»Ã‚Â± nhiÃƒÆ’Ã‚Âªn hoÃƒÂ¡Ã‚ÂºÃ‚Â·c thÃƒÂ¡Ã‚Â»Ã‚Â­ skill nhÃƒâ€ Ã‚Â° <code>/tool-runtime-status</code>, <code>/tool-provider-check</code>, <code>/tool-release-qa</code>.</p>
      </div>`;
  const box = $("#agentMessages");
  box.scrollTop = box.scrollHeight;
  renderAgentContext();
}

function renderAgentThinkingMessage() {
  const latest = state.agent.events[state.agent.events.length - 1] || {};
  const elapsed = agentElapsedLabel();
  return `
    <article class="chat-message assistant thinking-message">
      <header>
        <strong>Agent</strong>
        <time>${escapeHtml(elapsed)}</time>
        <button class="text-button" type="button" data-open-thinking>Thinking</button>
      </header>
      <button class="chat-bubble thinking-bubble" type="button" data-open-thinking>
        <span class="thinking-dot"></span>
        <span>
          <strong>Thinking...</strong>
          <small>${escapeHtml(latest.title || "Preparing")}${latest.detail ? ` Ãƒâ€šÃ‚Â· ${escapeHtml(latest.detail)}` : ""}</small>
        </span>
      </button>
    </article>
  `;
}

function agentElapsedLabel() {
  if (!state.agent.startedAt) return "0s";
  const elapsed = Math.max(0, Math.round((Date.now() - state.agent.startedAt) / 1000));
  return elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${String(elapsed % 60).padStart(2, "0")}s`;
}

function setAgentRunState(running) {
  const label = running ? `Thinking ${agentElapsedLabel()}` : "Idle";
  $("#agentRunState").textContent = label;
  $("#agentRunState").className = `state-badge ${running ? "running" : "idle"}`;
}

function openAgentThinking() {
  const details = $("#agentThinking");
  if (details) {
    details.open = true;
    details.scrollIntoView({ block: "nearest" });
  }
}

function renderAgentTrace() {
  $("#agentSteps").innerHTML = state.agent.events.length
    ? state.agent.events.map((event, index) => `
      <li class="${escapeHtml(event.type)}">
        <span>${String(index + 1).padStart(2, "0")} Ãƒâ€šÃ‚Â· ${escapeHtml(new Date(event.time).toLocaleTimeString())} Ãƒâ€šÃ‚Â· ${escapeHtml(event.type)}</span>
        <strong>${escapeHtml(event.title)}</strong>
        ${event.detail ? `<p>${escapeHtml(event.detail)}</p>` : ""}
      </li>
    `).join("")
    : `<li class="empty-log">No agent steps yet.</li>`;
  const thinkingToggle = $("#agentThinkingToggle");
  const thinkingDetails = $("#agentThinking");
  if (thinkingToggle && thinkingDetails) {
    thinkingToggle.textContent = thinkingDetails.open ? "Close" : "Open";
  }

  $("#agentToolTrace").innerHTML = state.agent.toolResults.length
    ? state.agent.toolResults.map((tool, index) => `
      <details class="tool-card" open>
        <summary>
          <strong>${escapeHtml(tool.name || "tool")}</strong>
          <span class="state-badge ${tool.ok ? "done" : "error"}">${tool.ok ? "done" : "error"}</span>
        </summary>
        <label>Input</label>
        <pre>${escapeHtml(JSON.stringify(tool.args || {}, null, 2))}</pre>
        <label>${tool.ok ? "Result" : "Error"}</label>
        <pre>${escapeHtml(tool.ok ? JSON.stringify(tool.data, null, 2) : tool.error)}</pre>
        <button class="text-button" type="button" data-copy-tool="${index}">Copy tool trace</button>
      </details>
    `).join("")
    : `<p class="empty">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ tool call trong session nÃƒÆ’Ã‚Â y.</p>`;
}

function renderAgentContext() {
  const messageTokens = estimateTokens(state.agent.messages.map((message) => `${message.role}: ${message.content}`).join("\n"));
  const backendTokens = state.agent.context && state.agent.context.finalEstimatedTokens ? state.agent.context.finalEstimatedTokens : messageTokens;
  const limit = (state.agent.context && state.agent.context.limit) || (state.agent.config && state.agent.config.contextLimit) || 24000;
  const method = state.agent.context && state.agent.context.tokenMethod ? state.agent.context.tokenMethod : "local estimate";
  const value = Math.min(100, Math.round((backendTokens / Math.max(limit, 1)) * 100));
  $("#agentContextText").textContent = `${backendTokens.toLocaleString("en-US")} / ${Number(limit).toLocaleString("en-US")} tokens Ãƒâ€šÃ‚Â· ${method}`;
  $("#agentContextBar").value = value;
}

function renderAgentSkills() {
  const skills = state.agent.skills || [];
  $("#agentSkillChips").innerHTML = skills.slice(0, 8).map((skill) => `
    <button class="skill-chip" type="button" data-skill-command="${escapeHtml(skill.command)}">
      ${escapeHtml(skill.command || skill.title)}
    </button>
  `).join("") || `<span class="muted">No skills loaded</span>`;

  const filter = state.filters.skills;
  const filteredSkills = skills.filter((skill) => {
    return includesQuery([
      skill.command,
      skill.title,
      skill.tools,
      skill.group,
      skill.content
    ], filter.query);
  });

  const pageData = paginate("skills", filteredSkills);

  const grouped = pageData.items.reduce((acc, skill) => {
    acc[skill.group] = acc[skill.group] || [];
    acc[skill.group].push(skill);
    return acc;
  }, {});

  $("#skillLibrary").innerHTML = Object.entries(grouped).map(([group, items]) => `
    <div class="skill-group">
      <h3>${escapeHtml(group)}</h3>
      ${items.map((skill) => `
        <article class="skill-row">
          <div>
            <strong>${escapeHtml(skill.command || skill.title)}</strong>
            <p>${escapeHtml(skill.tools || skill.path)}</p>
          </div>
          ${skill.command ? `<button class="text-button" type="button" data-skill-command="${escapeHtml(skill.command)}">Use</button>` : ""}
        </article>
      `).join("")}
    </div>
  `).join("") || `<p class="empty">KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y skill nÃƒÆ’Ã‚Â o.</p>`;

  setPager("skills", pageData);
}

function fillAgentSettings(config) {
  state.agent.config = config;
  $("#agentBaseUrl").value = config.baseUrl || "";
  $("#agentModel").value = config.model || "";
  $("#agentContextLimit").value = config.contextLimit || 24000;
  $("#agentMaxLoops").value = config.maxLoops || 6;
  $("#agentMaxToolCalls").value = config.maxToolCallsPerRound || 4;
  $("#agentEnableSearch").checked = Boolean(config.enableSearch);
  $("#agentAutoCreateSkills").checked = Boolean(config.autoCreateSkills);
  $("#codexCliEnabled").checked = Boolean(config.codexCliEnabled);
  $("#codexCliCommand").value = config.codexCliCommand || "codex";
  $("#codexCliTimeout").value = config.codexCliTimeoutMs || 180000;
  $("#agentApiKey").value = "";
  $("#agentApiKeyHint").textContent = config.apiKeySet ? `API key saved (${config.apiKeyMasked}). Leave blank to keep it.` : "No API key configured.";
  $("#providerStatus").textContent = config.baseUrl && config.model && config.apiKeySet ? "Ready" : "Missing config";
  $("#providerStatus").className = `state-badge ${config.baseUrl && config.model && config.apiKeySet ? "done" : "error"}`;
  renderAgentContext();
}

async function loadAgentData() {
  try {
    const [config, skills] = await Promise.all([
      window.moneyDesk.getAgentConfig(),
      window.moneyDesk.listAgentSkills()
    ]);
    fillAgentSettings(config);
    state.agent.skills = skills;
    renderAgentSkills();
    renderAgentMessages();
    renderAgentTrace();
  } catch (error) {
    addLog("error", "Failed to load Agent Chat data", error.message);
  }
}

async function sendAgentMessage() {
  const input = $("#agentInput");
  const text = input.value.trim();
  if (!text || state.agent.running) return;
  state.agent.running = true;
  state.agent.startedAt = Date.now();
  $("#sendAgentBtn").disabled = true;
  setAgentRunState(true);
  state.agent.events = [
    { type: "thinking", title: "Queued", detail: "Dang gui message toi main process.", time: new Date().toISOString() },
    { type: "thinking", title: "Build context", detail: "Chuan bi history, dashboard, skills va config.", time: new Date().toISOString() },
    { type: "thinking", title: "Waiting for agent", detail: "Dang doi model hoac tool noi bo tra ket qua.", time: new Date().toISOString() }
  ];
  state.agent.toolResults = [];
  state.agent.messages.push({ role: "user", content: text, time: timeLabel() });
  input.value = "";
  persistAgentSession();
  openAgentThinking();
  window.clearInterval(state.agent.thinkingTimer);
  state.agent.thinkingTimer = window.setInterval(() => {
    if (!state.agent.running) return;
    setAgentRunState(true);
    renderAgentMessages();
  }, 1000);
  renderAgentMessages();
  renderAgentTrace();
  try {
    const result = await window.moneyDesk.sendAgentMessage({
      sessionId: state.agent.sessionId,
      message: text,
      history: state.agent.messages.slice(0, -1),
      context: { activeView: state.activeView }
    });
    state.agent.sessionId = result.sessionId || state.agent.sessionId;
    state.agent.events = result.events || [];
    state.agent.toolResults = result.toolResults || [];
    state.agent.context = result.context || state.agent.context;
    state.agent.messages.push({ role: "assistant", content: result.final || result.error || "No response.", time: timeLabel() });
    if (result.skillCreated && result.skillCreated.skill) {
      await refreshSkills();
      addLog("skill", "Agent created a skill", result.skillCreated.skill.command || result.skillCreated.skill.path);
    }
    addLog(result.ok ? "success" : "error", result.ok ? "Agent response completed" : "Agent response failed", result.error || `${state.agent.toolResults.length} tool call(s).`);
  } catch (error) {
    state.agent.messages.push({ role: "assistant", content: `LÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i Agent Chat: ${error.message}`, time: timeLabel() });
    state.agent.events.push({ type: "error", title: "IPC error", detail: error.message, time: new Date().toISOString() });
  } finally {
    state.agent.running = false;
    state.agent.startedAt = null;
    window.clearInterval(state.agent.thinkingTimer);
    state.agent.thinkingTimer = null;
    $("#sendAgentBtn").disabled = false;
    setAgentRunState(false);
    persistAgentSession();
    renderAgentMessages();
    renderAgentTrace();
  }
}

async function saveAgentSettings(clearApiKey = false) {
  const payload = {
    baseUrl: $("#agentBaseUrl").value.trim(),
    model: $("#agentModel").value.trim(),
    apiKey: $("#agentApiKey").value.trim(),
    clearApiKey,
    contextLimit: Number($("#agentContextLimit").value || 24000),
    maxLoops: Number($("#agentMaxLoops").value || 6),
    maxToolCallsPerRound: Number($("#agentMaxToolCalls").value || 4),
    enableSearch: $("#agentEnableSearch").checked,
    autoCreateSkills: $("#agentAutoCreateSkills").checked,
    codexCliEnabled: $("#codexCliEnabled").checked,
    codexCliCommand: $("#codexCliCommand").value.trim() || "codex",
    codexCliTimeoutMs: Number($("#codexCliTimeout").value || 180000)
  };
  const config = await window.moneyDesk.saveAgentConfig(payload);
  fillAgentSettings(config);
  addLog("settings", "Agent settings saved", clearApiKey ? "API key cleared." : "Provider/context/tool settings updated.");
}

async function refreshSkills() {
  state.agent.skills = await window.moneyDesk.listAgentSkills();
  renderAgentSkills();
}

function renderRunTracker() {
  $("#runTracker").innerHTML = runtimeSteps.map((step) => `
    <div class="tracker-step ${escapeHtml(state.stepStatus[step.key] || "idle")}">
      <span class="tracker-icon">${step.icon}</span>
      <div>
        <strong>${escapeHtml(step.label)}</strong>
        <small>${escapeHtml(state.stepStatus[step.key] || "idle")}</small>
      </div>
    </div>
  `).join("");
}

function getEventClickAttrs(entry) {
  let path = "";
  if (typeof entry.detail === "string") {
    const trimmed = entry.detail.trim();
    if (trimmed.startsWith(".manager/")) {
      return `data-manager-preview-path="${escapeHtml(trimmed)}" class="clickable" title="NhÃƒÂ¡Ã‚ÂºÃ‚Â¥n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ xem trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc: ${escapeHtml(trimmed)}"`;
    }
    if (trimmed.startsWith("jobs/") || trimmed.startsWith("results/") || trimmed.startsWith("launchd/") || trimmed.endsWith(".plist") || trimmed.endsWith(".json") || trimmed.endsWith(".md")) {
      path = trimmed;
    }
  }
  if (!path && typeof entry.title === "string") {
    const trimmed = entry.title.trim();
    if (trimmed.startsWith("jobs/") || trimmed.startsWith("results/")) {
      path = trimmed;
    }
  }

  if (path) {
    return `data-open-path="${escapeHtml(path)}" class="clickable" title="NhÃƒÂ¡Ã‚ÂºÃ‚Â¥n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ mÃƒÂ¡Ã‚Â»Ã…Â¸: ${escapeHtml(path)}"`;
  }

  // Handle views and navigation
  if (entry.type === "view" && typeof entry.title === "string") {
    const match = entry.title.match(/Opened\s+(\w+)/i);
    if (match) {
      const viewName = match[1].toLowerCase();
      const targetView = viewName === "references" ? "settings" : viewName;
      return `data-view-link="${escapeHtml(targetView)}" class="clickable" title="NhÃƒÂ¡Ã‚ÂºÃ‚Â¥n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ chuyÃƒÂ¡Ã‚Â»Ã†â€™n sang tab ${escapeHtml(targetView === "settings" ? "settings" : viewName)}"`;
    }
  }
  if (entry.type === "navigate" && typeof entry.title === "string") {
    const match = entry.title.match(/Clicked stat:\s+(\w+)/i);
    if (match) {
      const viewName = match[1].toLowerCase();
      const targetView = viewName === "references" ? "settings" : viewName;
      return `data-view-link="${escapeHtml(targetView)}" class="clickable" title="NhÃƒÂ¡Ã‚ÂºÃ‚Â¥n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ chuyÃƒÂ¡Ã‚Â»Ã†â€™n sang tab ${escapeHtml(targetView === "settings" ? "settings" : viewName)}"`;
    }
  }
  if (entry.type === "command" || (typeof entry.title === "string" && (entry.title.includes("finished") || entry.title.includes("failed")))) {
    return `data-view-link="commands" class="clickable" title="NhÃƒÂ¡Ã‚ÂºÃ‚Â¥n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ chuyÃƒÂ¡Ã‚Â»Ã†â€™n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â¿n tab Commands"`;
  }

  return "";
}

function renderActivityLog() {
  $("#activityLog").innerHTML = state.activityLog.length
    ? state.activityLog.map((entry) => {
        const clickAttrs = getEventClickAttrs(entry);
        const className = [entry.type, clickAttrs ? "clickable" : ""].filter(Boolean).join(" ");
        return `
          <li class="${escapeHtml(className)}" ${clickAttrs}>
            <time>${escapeHtml(entry.time)}</time>
            <div>
              <strong>${escapeHtml(entry.title)}</strong>
              ${entry.detail ? `<p>${escapeHtml(entry.detail)}</p>` : ""}
            </div>
          </li>
        `;
      }).join("")
    : `<li class="empty-log">${escapeHtml(t("noEvents"))}</li>`;
  $("#latestSnapshotOutput").textContent = state.latestSnapshotOutput;
  renderRunTracker();
  renderInspector();
  localizeDom($("#logDrawer"));
}

function formatCommandResult(result) {
  return [
    `$ ${result.command || "money_tool.py"}`,
    `exit=${result.exitCode}`,
    "",
    "STDOUT:",
    result.stdout || "(empty)",
    "",
    "STDERR:",
    result.stderr || "(empty)"
  ].join("\n");
}

function renderCommandOutput() {
  const output = $("#commandOutput");
  if (output) output.textContent = state.latestCommandOutput;
}

function addLog(type, title, detail = "") {
  const entry = { type, title, detail, time: timeLabel() };
  state.activityLog.unshift(entry);
  state.activityLog = state.activityLog.slice(0, 80);
  renderActivityLog();
}

function setStep(step, status) {
  state.stepStatus[step] = status;
  renderRunTracker();
}

function resetSnapshotSteps() {
  state.stepStatus = { load: "idle", render: "idle", snapshot: "idle", verify: "idle" };
  renderRunTracker();
}

function miniMetric(label, value, tone = "neutral", action = "") {
  const clickableClass = action ? " clickable" : "";
  const actionAttr = action ? ` data-metric-action="${escapeHtml(action)}"` : "";
  const roleAttr = action ? ' role="button" tabindex="0"' : "";
  return `
    <div class="mini-metric ${escapeHtml(tone)}${clickableClass}"${actionAttr}${roleAttr}>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderInspector() {
  const active = viewLabels[state.activeView] || state.activeView;
  const latest = state.activityLog[0];
  const data = state.dashboard;
  const snapshotState = state.stepStatus.snapshot || "idle";
  const verifyState = state.stepStatus.verify || "idle";

  $("#inspectorActiveView").textContent = active;
  $("#inspectorStatus").innerHTML = `
    <div class="status-stack">
      <span class="state-badge ${state.busy ? "running" : "idle"}">${state.busy ? t("reading") : t("idle")}</span>
      <span class="state-badge ${escapeHtml(snapshotState)}">${escapeHtml(t("snapshot"))} ${escapeHtml(snapshotState)}</span>
      <span class="state-badge ${escapeHtml(verifyState)}">${escapeHtml(t("verify"))} ${escapeHtml(verifyState)}</span>
    </div>
  `;

  $("#inspectorHealth").innerHTML = data ? [
    miniMetric(t("metrics.results"), data.stats.resultFiles, "primary", "goto-results"),
    miniMetric(t("metrics.jobs"), data.stats.jobs, "success", "goto-jobs"),
    miniMetric(t("metrics.attention"), data.stats.attentionJobs, data.stats.attentionJobs > 0 ? "warning" : "success", "goto-jobs-attention"),
    miniMetric(t("metrics.monitors"), data.stats.launchAgents, "primary", "goto-monitors")
  ].join("") : [
    miniMetric(t("metrics.results"), "n/a"),
    miniMetric(t("metrics.jobs"), "n/a"),
    miniMetric(t("metrics.attention"), "n/a"),
    miniMetric(t("metrics.monitors"), "n/a")
  ].join("");

  $("#inspectorLatestEvent").innerHTML = latest
    ? `<time>${escapeHtml(latest.time)}</time><strong>${escapeHtml(latest.title)}</strong><p>${escapeHtml(latest.detail || "")}</p>`
    : t("latestNoEvents");
}

const chartStatuses = [
  { key: "rewarded", label: "Paid", color: "var(--success)", hoverColor: "#059669", gradient: ["#0f9f6e", "#34d399"] },
  { key: "pending_reward", label: "Reward Pending", color: "var(--rose)", hoverColor: "#e11d48", gradient: ["#e11d48", "#f43f5e"] },
  { key: "pending_review", label: "In Review", color: "var(--amber)", hoverColor: "#d97706", gradient: ["#f59e0b", "#fbbf24"] },
  { key: "local_done", label: "Local Done", color: "#0ea5e9", hoverColor: "#0284c7", gradient: ["#0ea5e9", "#38bdf8"] },
  { key: "doing", label: "Doing", color: "var(--primary)", hoverColor: "#1d4ed8", gradient: ["#2563eb", "#60a5fa"] },
  { key: "prepared", label: "Prepared", color: "var(--muted)", hoverColor: "#4b5563", gradient: ["#626b7a", "#9ca3af"] }
];

function renderDashboardCharts(data) {
  const jobs = data.jobs || [];
  const totalJobs = jobs.length;
  
  // TÃƒÆ’Ã‚Â­nh toÃƒÆ’Ã‚Â¡n sÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ lÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£ng theo trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i
  const counts = {};
  chartStatuses.forEach(s => counts[s.key] = 0);
  jobs.forEach(job => {
    const key = job.status && job.status.key ? job.status.key : "prepared";
    if (counts[key] !== undefined) {
      counts[key]++;
    } else {
      counts.prepared++;
    }
  });

  // 1. VÃƒÂ¡Ã‚ÂºÃ‚Â½ biÃƒÂ¡Ã‚Â»Ã†â€™u Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ Donut
  const svgDonut = $("#statusDonutChart");
  const legendDonut = $("#statusChartLegend");
  const centerTotal = $("#donutTotalCount");

  if (centerTotal) centerTotal.textContent = totalJobs;

  if (totalJobs === 0) {
    if (svgDonut) svgDonut.innerHTML = `<circle cx="100" cy="100" r="70" fill="none" stroke="var(--line)" stroke-width="12" />`;
    if (legendDonut) legendDonut.innerHTML = `<div class="muted" style="padding: 10px;">ChÃƒâ€ Ã‚Â°a cÃƒÆ’Ã‚Â³ job nÃƒÆ’Ã‚Â o Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c tÃƒÂ¡Ã‚ÂºÃ‚Â¡o</div>`;
  } else {
    let currentAngle = 0;
    const r = 70;
    const circ = 2 * Math.PI * r;
    let donutHtml = "";
    let legendHtml = "";

    // VÃƒÂ¡Ã‚ÂºÃ‚Â½ cung nÃƒÂ¡Ã‚Â»Ã‚Ân trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc
    donutHtml += `<circle cx="100" cy="100" r="${r}" fill="none" stroke="var(--surface-container-high)" stroke-width="22" />`;

    chartStatuses.forEach((status) => {
      const count = counts[status.key];
      if (count === 0) return;

      const pct = count / totalJobs;
      const strokeLength = pct * circ;
      const strokeOffset = circ - strokeLength;
      const rotation = currentAngle;
      
      donutHtml += `
        <circle 
          class="donut-segment" 
          cx="100" 
          cy="100" 
          r="${r}" 
          fill="none" 
          stroke="${status.color}" 
          stroke-width="22" 
          stroke-dasharray="${strokeLength} ${strokeOffset}" 
          stroke-dashoffset="0"
          transform="rotate(${rotation} 100 100)"
          data-status-key="${status.key}"
          data-status-label="${status.label}"
          data-count="${count}"
          data-percent="${Math.round(pct * 100)}"
        />
      `;
      
      legendHtml += `
        <div class="legend-item" data-status-filter="${status.key}">
          <span class="legend-color" style="background: ${status.color};"></span>
          <span>${status.label}</span>
          <span class="legend-val">${count} (${Math.round(pct * 100)}%)</span>
        </div>
      `;

      currentAngle += pct * 360;
    });

    if (svgDonut) svgDonut.innerHTML = donutHtml;
    if (legendDonut) legendDonut.innerHTML = legendHtml;
  }

  // 2. VÃƒÂ¡Ã‚ÂºÃ‚Â½ biÃƒÂ¡Ã‚Â»Ã†â€™u Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ CÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t cho NgÃƒÆ’Ã‚Â¢n sÃƒÆ’Ã‚Â¡ch
  const budgetSums = {};
  chartStatuses.forEach(s => budgetSums[s.key] = 0);
  jobs.forEach(job => {
    const key = job.status && job.status.key ? job.status.key : "prepared";
    const budget = Number(job.budget || 0);
    if (budgetSums[key] !== undefined) {
      budgetSums[key] += budget;
    } else {
      budgetSums.prepared += budget;
    }
  });

  const svgBar = $("#budgetBarChart");
  const legendBar = $("#budgetChartLegend");
  const maxBudget = Math.max(...Object.values(budgetSums), 100);

  // KÃƒÆ’Ã‚Â­ch thÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc biÃƒÂ¡Ã‚Â»Ã†â€™u Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ cÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t
  const width = 400;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;
  
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  let barHtml = "";
  let barLegendHtml = "";

  // Ãƒâ€žÃ‚ÂÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng lÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi trÃƒÂ¡Ã‚Â»Ã‚Â¥c Y vÃƒÆ’Ã‚Â  sÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u
  const gridLevels = 3;
  for (let i = 0; i <= gridLevels; i++) {
    const yVal = Math.round((maxBudget / gridLevels) * i);
    const yPos = height - paddingBottom - (chartH / gridLevels) * i;
    
    // Ãƒâ€žÃ‚ÂÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng ngang
    barHtml += `<line class="chart-grid-line" x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" />`;
    // Label
    barHtml += `<text class="chart-axis-text" x="${paddingLeft - 8}" y="${yPos + 3}" text-anchor="end">$${yVal >= 1000 ? (yVal/1000).toFixed(1) + 'k' : yVal}</text>`;
  }

  // VÃƒÂ¡Ã‚ÂºÃ‚Â½ cÃƒÆ’Ã‚Â¡c CÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t
  const barCount = chartStatuses.length;
  const gap = 12;
  const barW = (chartW - (gap * (barCount - 1))) / barCount;

  // ThÃƒÆ’Ã‚Âªm Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh nghÃƒâ€žÃ‚Â©a Gradient mÃƒÆ’Ã‚Â u chuyÃƒÂ¡Ã‚Â»Ã†â€™n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢i cao cÃƒÂ¡Ã‚ÂºÃ‚Â¥p
  let defs = "<defs>";
  chartStatuses.forEach(status => {
    defs += `
      <linearGradient id="grad-${status.key}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${status.gradient[1]}" />
        <stop offset="100%" stop-color="${status.gradient[0]}" />
      </linearGradient>
    `;
  });
  defs += "</defs>";
  barHtml += defs;

  chartStatuses.forEach((status, idx) => {
    const sum = budgetSums[status.key];
    const barH = (sum / maxBudget) * chartH;
    const x = paddingLeft + idx * (barW + gap);
    const y = height - paddingBottom - barH;

    // Ãƒâ€žÃ‚ÂÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng vÃƒÂ¡Ã‚ÂºÃ‚Â½ cÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t bo trÃƒÆ’Ã‚Â²n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u
    const path = barH > 4 
      ? `M ${x},${y + 4} a 4,4 0 0 1 4,-4 h ${barW - 8} a 4,4 0 0 1 4,4 v ${barH - 4} h ${-barW} Z`
      : `M ${x},${height - paddingBottom} h ${barW} v ${-Math.max(barH, 1)} h ${-barW} Z`;

    barHtml += `
      <path 
        class="chart-bar" 
        d="${path}" 
        fill="url(#grad-${status.key})"
        data-status-key="${status.key}"
        data-status-label="${status.label}"
        data-budget="${sum}"
      />
    `;

    // NhÃƒÆ’Ã‚Â£n trÃƒÂ¡Ã‚Â»Ã‚Â¥c X ÃƒÂ¡Ã‚Â»Ã…Â¸ dÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi cÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t
    const labelX = x + barW / 2;
    const shortLabel = status.label.split(" ")[0]; // e.g. "Reward" thay vÃƒÆ’Ã‚Â¬ "Reward Pending"
    barHtml += `<text class="chart-axis-text" x="${labelX}" y="${height - 8}" text-anchor="middle">${shortLabel}</text>`;

    barLegendHtml += `
      <div class="legend-item" data-status-filter="${status.key}">
        <span class="legend-color" style="background: ${status.color};"></span>
        <span>${shortLabel}: <strong>$${sum.toLocaleString()}</strong></span>
      </div>
    `;
  });

  if (svgBar) svgBar.innerHTML = barHtml;
  if (legendBar) legendBar.innerHTML = barLegendHtml;

  // KhÃƒÂ¡Ã‚Â»Ã…Â¸i Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng cÃƒÆ’Ã‚Â¡c hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u ÃƒÂ¡Ã‚Â»Ã‚Â©ng di chuÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t vÃƒÆ’Ã‚Â  tooltip
  setupChartInteractivity();
}

function setupChartInteractivity() {
  const tooltip = $("#chartTooltip");
  if (!tooltip) return;

  const showTooltip = (text, targetEl, clientX, clientY) => {
    tooltip.innerHTML = text;
    tooltip.style.left = `${clientX + 15}px`;
    tooltip.style.top = `${clientY - 20}px`;
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";
  };

  const hideTooltip = () => {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateY(4px)";
  };

  // TÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng tÃƒÆ’Ã‚Â¡c donut chart
  $$(".donut-segment").forEach(slice => {
    const update = (e) => {
      const label = slice.dataset.statusLabel;
      const count = slice.dataset.count;
      const percent = slice.dataset.percent;
      showTooltip(`<strong>${label}</strong>: ${count} jobs (${percent}%)`, slice, e.clientX, e.clientY);
    };

    slice.addEventListener("mouseenter", update);
    slice.addEventListener("mousemove", update);
    slice.addEventListener("mouseleave", hideTooltip);
    
    slice.addEventListener("click", () => {
      const statusKey = slice.dataset.statusKey;
      navigateToStatusFilter(statusKey);
    });
  });

  // TÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng tÃƒÆ’Ã‚Â¡c bar chart
  $$(".chart-bar").forEach(bar => {
    const update = (e) => {
      const label = bar.dataset.statusLabel;
      const budget = Number(bar.dataset.budget);
      showTooltip(`<strong>NgÃƒÆ’Ã‚Â¢n sÃƒÆ’Ã‚Â¡ch ${label}</strong><br/>$${budget.toLocaleString("en-US")} USD`, bar, e.clientX, e.clientY);
    };

    bar.addEventListener("mouseenter", update);
    bar.addEventListener("mousemove", update);
    bar.addEventListener("mouseleave", hideTooltip);

    bar.addEventListener("click", () => {
      const statusKey = bar.dataset.statusKey;
      navigateToStatusFilter(statusKey);
    });
  });

  // TÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng tÃƒÆ’Ã‚Â¡c click vÃƒÆ’Ã‚Â o Legend Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ chuyÃƒÂ¡Ã‚Â»Ã†â€™n view vÃƒÆ’Ã‚Â  lÃƒÂ¡Ã‚Â»Ã‚Âc
  $$("[data-status-filter]").forEach(item => {
    item.addEventListener("click", () => {
      const statusKey = item.dataset.statusFilter;
      navigateToStatusFilter(statusKey);
    });
  });
}

function navigateToStatusFilter(statusKey) {
  // 1. ChuyÃƒÂ¡Ã‚Â»Ã†â€™n sang mÃƒÆ’Ã‚Â n hÃƒÆ’Ã‚Â¬nh Jobs
  setView("jobs");

  // 2. ChÃƒÂ¡Ã‚Â»Ã‚Ân trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i tÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng ÃƒÂ¡Ã‚Â»Ã‚Â©ng trÃƒÆ’Ã‚Âªn filter dropdown
  const selectStatus = $("#jobsStatus");
  if (selectStatus) {
    selectStatus.value = statusKey;
    
    // 3. CÃƒÂ¡Ã‚ÂºÃ‚Â­p nhÃƒÂ¡Ã‚ÂºÃ‚Â­t state filter
    state.filters.jobs.status = statusKey;
    state.filters.jobs.page = 1;
    
    // 4. Render lÃƒÂ¡Ã‚ÂºÃ‚Â¡i danh sÃƒÆ’Ã‚Â¡ch
    renderJobs(state.dashboard);
  }
}

function renderDashboard(data) {
  state.dashboard = data;
  $("#lastSync").textContent = `${t("synced")} ${formatDate(data.generatedAt)}`;
  state.latestSnapshotOutput = [
    `snapshot=${formatDate(data.generatedAt)}`,
    `results=${data.stats.resultFiles} files / ${data.stats.resultCandidates} candidates`,
    `jobs=${data.stats.jobs} total / ${data.stats.monitoredJobs} monitored / ${data.stats.attentionJobs} attention`,
    `launchAgents=${data.stats.launchAgents}`,
    `ledgerRows=${data.stats.ledgerRows}`
  ].join("\n");
  setStep("render", "done");
  setStep("snapshot", "done");
  renderStats(data);
  renderPipeline(data);
  renderDashboardCharts(data);
  renderTopCandidates(data);
  renderManagerState(data);
  renderResults(data);
  renderJobs(data);
  renderMonitors(data);
  renderLedger(data);
  renderReferences(data);
  renderSchedules(data);
  renderActivityLog();
  renderCommandOutput();
  applyLanguage();
  renderInspector();
  localizeDom();
}

async function refresh() {
  setBusy(true);
  resetSnapshotSteps();
  setStep("load", "running");
  addLog("refresh", "Refreshing status", "Reading local results, jobs, monitors, ledger and manager state.");
  try {
    const data = await window.moneyDesk.loadDashboard();
    renderDashboard(data);
    setStep("load", "done");
    setStep("verify", "done");
    addLog("success", "Status refreshed", `${data.stats.resultFiles} result files Ãƒâ€šÃ‚Â· ${data.stats.jobs} jobs Ãƒâ€šÃ‚Â· ${data.stats.launchAgents} monitors.`);
  } catch (error) {
    state.latestSnapshotOutput = `Failed to load status: ${error.message}`;
    setStep("load", "error");
    setStep("verify", "error");
    renderActivityLog();
    addLog("error", "Failed to load status", error.message);
  } finally {
    setBusy(false);
  }
}

async function runMonitor(jobPath) {
  setBusy(true);
  addLog("monitor", "Running monitor", jobPath);
  try {
    const result = await window.moneyDesk.runJobMonitor(jobPath);
    addLog("success", "Monitor finished", result.stdout || result.command);
    await refresh();
  } catch (error) {
    addLog("error", "Monitor failed", error.message);
  } finally {
    setBusy(false);
  }
}

async function runAllMonitors() {
  setBusy(true);
  addLog("monitor", "Running all monitors", "Checking every monitored job workspace.");
  try {
    const result = await window.moneyDesk.runAllMonitors();
    addLog(result.failed ? "error" : "success", "All monitors finished", `${result.ok}/${result.total} passed Ãƒâ€šÃ‚Â· ${result.failed} failed`);
    await refresh();
  } catch (error) {
    addLog("error", "Run all monitors failed", error.message);
  } finally {
    setBusy(false);
  }
}

async function toggleTracking(jobPath, field) {
  setBusy(true);
  addLog("tracking", `Updating ${field}`, jobPath);
  try {
    const result = await window.moneyDesk.updateJobTracking({ jobPath, field });
    const value = result.tracking && result.tracking[field] ? "on" : "off";
    addLog("success", `Tracking ${field} ${value}`, jobPath);
    await refresh();
  } catch (error) {
    addLog("error", "Tracking update failed", error.message);
  } finally {
    setBusy(false);
  }
}

async function checkGithubInbox(jobPath) {
  setBusy(true);
  addLog("github", "Checking GitHub inbox", jobPath);
  try {
    const result = await window.moneyDesk.checkGithubInbox(jobPath);
    const inbox = result.inbox || {};
    addLog(
      inbox.newComment ? "success" : "github",
      inbox.newComment ? "New GitHub comment notification" : "GitHub inbox checked",
      inbox.error || inbox.subjectTitle || (inbox.matched ? inbox.reason : "No matching notification")
    );
    await refresh();
  } catch (error) {
    addLog("error", "GitHub inbox check failed", error.message);
  } finally {
    setBusy(false);
  }
}

async function checkAllGithubInboxes() {
  setBusy(true);
  addLog("github", "Checking all GitHub inbox notifications", "Reading GitHub notifications through gh api.");
  try {
    const result = await window.moneyDesk.checkAllGithubInboxes();
    addLog(
      result.failed ? "error" : "success",
      "GitHub inbox check finished",
      `${result.ok}/${result.total} passed Ãƒâ€šÃ‚Â· ${result.newComments || 0} new comment notification(s)`
    );
    await refresh();
  } catch (error) {
    addLog("error", "GitHub inbox check failed", error.message);
  } finally {
    setBusy(false);
  }
}

function commandSearchPayload(prefix) {
  return {
    source: $(`#command${prefix}Source`).value,
    query: $(`#command${prefix}Query`).value.trim(),
    topics: $(`#command${prefix}Topics`).value.trim(),
    repos: $(`#command${prefix}Repos`).value.trim(),
    excludeRepos: $(`#command${prefix}ExcludeRepos`).value.trim(),
    perQueryLimit: Number($(`#command${prefix}PerQueryLimit`).value || 0),
    limit: Number($(`#command${prefix}Limit`).value || 10),
    minScore: Number($(`#command${prefix}MinScore`).value || 0),
    out: $(`#command${prefix}Out`).value.trim()
  };
}

const commandButtonSelectors = {
  "search": "#searchCommandForm button[type='submit']",
  "hunt": "#huntCommandForm button[type='submit']",
  "prepare": "#prepareCommandForm button[type='submit']",
  "ledger": "#ledgerCommandButton",
  "monitor one-shot": "#monitorOneShotForm button[type='submit']"
};

async function runMoneyCommand(label, runner) {
  setBusy(true);
  setView("commands", false);
  
  const resultsPanel = $("#commandResultsPanel");
  if (resultsPanel && ["search", "hunt", "prepare", "monitor one-shot"].includes(label)) {
    resultsPanel.style.display = "none";
  }
  
  // HiÃƒÂ¡Ã‚Â»Ã†â€™n thÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ trÃƒÂ¡Ã‚ÂºÃ‚Â¡ng thÃƒÆ’Ã‚Â¡i loading cho nÃƒÆ’Ã‚Âºt bÃƒÂ¡Ã‚ÂºÃ‚Â¥m kÃƒÆ’Ã‚Â­ch hoÃƒÂ¡Ã‚ÂºÃ‚Â¡t
  const btnSelector = commandButtonSelectors[label];
  const btn = btnSelector ? $(btnSelector) : null;
  let originalBtnHtml = "";
  if (btn) {
    originalBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Running...`;
  }

  // KhÃƒÂ¡Ã‚Â»Ã…Â¸i chÃƒÂ¡Ã‚ÂºÃ‚Â¡y thanh tiÃƒÂ¡Ã‚ÂºÃ‚Â¿n trÃƒÆ’Ã‚Â¬nh smooth simulated progress bar
  const progressContainer = $("#commandProgressContainer");
  const progressBar = $("#commandProgressBar");
  const progressText = $("#commandProgressText");
  const progressLabel = $("#commandProgressLabel");

  let progressVal = 0;
  let progressInterval = null;

  if (progressContainer && progressBar && progressText && progressLabel) {
    progressLabel.innerHTML = `ÃƒÂ¢Ã…Â¡Ã¢â€žÂ¢ÃƒÂ¯Ã‚Â¸Ã‚Â Running <strong>${label}</strong>...`;
    progressText.textContent = "0%";
    progressBar.style.width = "0%";
    progressBar.style.background = "linear-gradient(90deg, var(--primary), #818cf8)";
    progressContainer.style.display = "block";
    progressContainer.style.opacity = "1";
    progressContainer.style.transform = "translateY(0)";

    progressInterval = setInterval(() => {
      if (progressVal < 40) {
        progressVal += 4 + Math.random() * 2;
      } else if (progressVal < 75) {
        progressVal += 1.5 + Math.random() * 1.5;
      } else if (progressVal < 92) {
        progressVal += 0.4 + Math.random() * 0.4;
      } else if (progressVal < 96) {
        progressVal += 0.05;
      }
      
      const rounded = Math.min(96, Math.round(progressVal));
      progressText.textContent = `${rounded}%`;
      progressBar.style.width = `${rounded}%`;
    }, 100);
  }

  addLog("command", `Running ${label}`, "Executing allowlisted money_tool.py command.");
  state.latestCommandOutput = `Running ${label}...`;
  renderCommandOutput();
  try {
    const result = await runner();
    
    // Snaps to 100% on success
    if (progressInterval) clearInterval(progressInterval);
    if (progressText && progressBar && progressLabel) {
      progressText.textContent = "100%";
      progressBar.style.width = "100%";
      progressBar.style.background = "linear-gradient(90deg, var(--success), #34d399)";
      progressLabel.innerHTML = `ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° <strong>${label} completed successfully!</strong>`;
    }

    state.latestCommandOutput = formatCommandResult(result);
    addLog("success", `${label} finished`, result.stdout || result.command);
    await refresh();

    // TÃƒÂ¡Ã‚Â»Ã‚Â± Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng render vÃƒÆ’Ã‚Â  active sub-tab tÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng thÃƒÆ’Ã‚Â­ch dÃƒÂ¡Ã‚Â»Ã‚Â±a vÃƒÆ’Ã‚Â o loÃƒÂ¡Ã‚ÂºÃ‚Â¡i lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡nh chÃƒÂ¡Ã‚ÂºÃ‚Â¡y thÃƒÆ’Ã‚Â nh cÃƒÆ’Ã‚Â´ng
    if (["search", "hunt", "prepare", "monitor one-shot"].includes(label) && state.dashboard) {
      let isPanelVisible = false;
      
      if (label === "search" || label === "hunt") {
        const outInput = label === "search" ? $("#commandSearchOut") : $("#commandHuntOut");
        const outPath = outInput ? outInput.value.trim() : "results/current/money_results.json";
        const group = state.dashboard.results.find(r => r.path === outPath);
        const tabName = label;
        const countBadge = $(`#command${label === "search" ? "Search" : "Hunt"}TabCount`);
        const listEl = $(`#command${label === "search" ? "Search" : "Hunt"}List`);
        
        if (group && group.candidates && group.candidates.length > 0) {
          if (countBadge) countBadge.textContent = group.candidates.length;
          if (listEl) {
            listEl.innerHTML = group.candidates.map(candidateRow).join("");
          }
          switchResultsTab(tabName);
          isPanelVisible = true;
        }
      } else if (label === "prepare") {
        const latestJob = state.dashboard.jobs[0]; // jobs Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£c sort desc theo modifiedAt/createdAt
        const prepareDetailsEl = $("#commandPrepareDetails");
        
        if (latestJob && prepareDetailsEl) {
          prepareDetailsEl.innerHTML = jobCard(latestJob);
          switchResultsTab("prepare");
          isPanelVisible = true;
        }
      } else if (label === "monitor one-shot") {
        const jobDirVal = $("#commandMonitorJobDir").value.trim();
        const targetJob = state.dashboard.jobs.find(j => j.path === jobDirVal || j.name === jobDirVal.split("/").pop());
        const monitorDetailsEl = $("#commandMonitorDetails");
        
        if (targetJob && monitorDetailsEl) {
          monitorDetailsEl.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: 700; color: var(--muted); font-size: 13px;">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Â¹ Job Status Checked:</div>
            ${jobCard(targetJob)}
            ${targetJob.latestMonitorLine ? `
              <div style="margin-top: 14px;">
                <div style="font-weight: 700; color: var(--muted); font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â¸ Latest Monitor Log:</div>
                <pre class="command-output" style="min-height: auto; max-height: 160px; padding: 12px; font-size: 11px;">${escapeHtml(targetJob.latestMonitorLine)}</pre>
              </div>
            ` : ""}
          `;
          switchResultsTab("monitor");
          isPanelVisible = true;
        }
      }
      
      if (resultsPanel) {
        if (isPanelVisible) {
          resultsPanel.style.display = "block";
          resultsPanel.style.animation = "fadeIn 0.3s ease-out";
        } else {
          resultsPanel.style.display = "none";
        }
      }
    }
  } catch (error) {
    // Shows warning on error
    if (progressInterval) clearInterval(progressInterval);
    if (progressText && progressBar && progressLabel) {
      progressBar.style.background = "var(--rose)";
      progressText.textContent = "Error";
      progressLabel.innerHTML = `ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â <strong>${label} failed!</strong>`;
    }

    const result = error.result || null;
    state.latestCommandOutput = result ? formatCommandResult(result) : `${label} failed: ${error.message}`;
    addLog("error", `${label} failed`, error.message);
    renderCommandOutput();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnHtml;
    }
    
    // Gently fade out progress bar after completed
    setTimeout(() => {
      if (progressContainer) {
        progressContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        progressContainer.style.opacity = "0";
        progressContainer.style.transform = "translateY(-4px)";
        setTimeout(() => {
          progressContainer.style.display = "none";
          progressContainer.style.transition = ""; // reset
        }, 500);
      }
    }, 1800);

    setBusy(false);
  }
}

function handleMetricAction(action) {
  if (!state.dashboard) return;
  
  if (action === "goto-results") {
    state.filters.results.query = "";
    state.filters.results.source = "all";
    state.filters.results.minScore = 0;
    state.filters.results.page = 1;
    
    const queryInput = $("#resultsSearch");
    if (queryInput) queryInput.value = "";
    const sourceSelect = $("#resultsSource");
    if (sourceSelect) sourceSelect.value = "all";
    const minScoreInput = $("#resultsMinScore");
    if (minScoreInput) minScoreInput.value = 0;
    
    renderResults(state.dashboard);
    setView("results");
    if (queryInput) queryInput.focus();
    
  } else if (action === "goto-jobs") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "all";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "all";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    if (queryInput) queryInput.focus();
    
  } else if (action === "goto-jobs-doing") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "doing";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "doing";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-jobs-local-done") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "local_done";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "local_done";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-jobs-pending-review") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "pending_review";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "pending_review";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-jobs-pending-reward") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "pending_reward";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "pending_reward";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-ledger-paid") {
    state.filters.ledger.query = "";
    state.filters.ledger.status = "paid";
    state.filters.ledger.page = 1;
    
    const queryInput = $("#ledgerSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#ledgerStatus");
    if (statusSelect) statusSelect.value = "paid";
    
    renderLedger(state.dashboard);
    setView("ledger");
    
  } else if (action === "goto-jobs-rewarded") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "rewarded";
    state.filters.jobs.signal = "all";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "rewarded";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "all";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-monitors") {
    setView("monitors");
    
  } else if (action === "goto-jobs-attention") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "all";
    state.filters.jobs.signal = "attention";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "all";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "attention";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-jobs-tracking") {
    state.filters.jobs.query = "";
    state.filters.jobs.status = "all";
    state.filters.jobs.signal = "watching";
    state.filters.jobs.page = 1;
    
    const queryInput = $("#jobsSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#jobsStatus");
    if (statusSelect) statusSelect.value = "all";
    const signalSelect = $("#jobsSignal");
    if (signalSelect) signalSelect.value = "watching";
    
    renderJobs(state.dashboard);
    setView("jobs");
    
  } else if (action === "goto-ledger") {
    state.filters.ledger.query = "";
    state.filters.ledger.status = "all";
    state.filters.ledger.page = 1;
    
    const queryInput = $("#ledgerSearch");
    if (queryInput) queryInput.value = "";
    const statusSelect = $("#ledgerStatus");
    if (statusSelect) statusSelect.value = "all";
    
    renderLedger(state.dashboard);
    setView("ledger");
    if (queryInput) queryInput.focus();
  }
  
  addLog("navigate", `Clicked stat: ${action.replace("goto-", "")}`, `Switched tab and applied appropriate filter state.`);
}

function wireEvents() {
  ensureLanguageSwitch();
  $("#languageSwitch").addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (button) setLanguage(button.dataset.language);
  });
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$("[data-view-link]").forEach((button) => button.addEventListener("click", () => {
    setView(button.dataset.viewLink);
    if (button.closest("#agentChatModal")) closeAgentModal();
  }));
  $$("[data-results-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchResultsTab(btn.dataset.resultsTab));
  });
  $$("[data-jobs-github-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      switchJobsGithubTab(btn.dataset.jobsGithubTab);
    });
  });
  $$("[data-filter-scope]").forEach((input) => {
    const handler = () => {
      const scope = input.dataset.filterScope;
      const key = input.dataset.filterKey;
      if (!state.filters[scope]) return;
      const numeric = ["pageSize", "minScore"].includes(key);
      state.filters[scope][key] = numeric ? Number(input.value || 0) : input.value;
      state.filters[scope].page = 1;
      renderDataScope(scope);
    };
    input.addEventListener(input.tagName === "INPUT" && input.type === "search" ? "input" : "change", handler);
  });
  $("#refreshBtn").addEventListener("click", refresh);
  $("#runAllMonitors").addEventListener("click", runAllMonitors);
  $("#checkAllGithubInbox").addEventListener("click", checkAllGithubInboxes);
  
  const trendsGeoSelect = $("#trendsGeo");
  if (trendsGeoSelect) {
    trendsGeoSelect.addEventListener("change", () => {
      resetTrendsVisibleCount();
      fetchAndRenderTrends(true);
    });
  }
  const trendsTopicSelect = $("#trendsTopic");
  if (trendsTopicSelect) {
    trendsTopicSelect.addEventListener("change", () => {
      resetTrendsVisibleCount();
      fetchAndRenderTrends(false);
    });
  }
  const trendsQueryInput = $("#trendsQuery");
  if (trendsQueryInput) {
    trendsQueryInput.addEventListener("input", () => {
      resetTrendsVisibleCount();
      fetchAndRenderTrends(false);
    });
  }
  const trendsMinTrafficSelect = $("#trendsMinTraffic");
  if (trendsMinTrafficSelect) {
    trendsMinTrafficSelect.addEventListener("change", () => {
      resetTrendsVisibleCount();
      fetchAndRenderTrends(false);
    });
  }
  const refreshTrendsBtn = $("#refreshTrendsBtn");
  if (refreshTrendsBtn) {
    refreshTrendsBtn.addEventListener("click", () => {
      resetTrendsVisibleCount();
      fetchAndRenderTrends(true);
    });
  }
  const loadMoreTrendsBtn = $("#loadMoreTrendsBtn");
  if (loadMoreTrendsBtn) {
    loadMoreTrendsBtn.addEventListener("click", loadMoreTrends);
  }
  const resetTrendsFiltersBtn = $("#resetTrendsFiltersBtn");
  if (resetTrendsFiltersBtn) {
    resetTrendsFiltersBtn.addEventListener("click", () => {
      if ($("#trendsQuery")) $("#trendsQuery").value = "";
      if ($("#trendsMinTraffic")) $("#trendsMinTraffic").value = "0";
      if ($("#trendsTopic")) $("#trendsTopic").value = "all";
      resetTrendsVisibleCount();
      fetchAndRenderTrends(false);
    });
  }
  const refreshThreadsBtn = $("#refreshThreadsBtn");
  if (refreshThreadsBtn) {
    refreshThreadsBtn.addEventListener("click", () => {
      resetThreadsVisibleCount();
      fetchAndRenderThreads(true);
    });
  }
  const loadMoreThreadsBtn = $("#loadMoreThreadsBtn");
  if (loadMoreThreadsBtn) {
    loadMoreThreadsBtn.addEventListener("click", loadMoreThreads);
  }
  const sendThreadsTelegramBtn = $("#sendThreadsTelegramBtn");
  if (sendThreadsTelegramBtn) {
    sendThreadsTelegramBtn.addEventListener("click", sendThreadsTelegram);
  }
  const openThreadsSearchBtn = $("#openThreadsSearchBtn");
  if (openThreadsSearchBtn) {
    openThreadsSearchBtn.addEventListener("click", () => {
      const request = getThreadsRequest();
      const query = request.country ? request.countryLabel : request.query;
      const url = `https://www.threads.com/search?q=${encodeURIComponent(query)}&serp_type=default`;
      window.moneyDesk.openUrl(url);
    });
  }
  const threadsCountrySelect = $("#threadsCountry");
  if (threadsCountrySelect) {
    threadsCountrySelect.addEventListener("change", () => {
      resetThreadsVisibleCount();
      fetchAndRenderThreads(true);
    });
  }
  const threadsQueryInput = $("#threadsQuery");
  if (threadsQueryInput) {
    threadsQueryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        resetThreadsVisibleCount();
        fetchAndRenderThreads(true);
      }
    });
  }
  const threadsLimitSelect = $("#threadsLimit");
  if (threadsLimitSelect) {
    threadsLimitSelect.addEventListener("change", () => {
      resetThreadsVisibleCount();
      fetchAndRenderThreads(true);
    });
  }
  const refreshFacebookBtn = $("#refreshFacebookBtn");
  if (refreshFacebookBtn) {
    refreshFacebookBtn.addEventListener("click", () => fetchAndRenderFacebook(true));
  }
  ["#facebookSource", "#facebookSort", "#facebookLimit"].forEach((selector) => {
    const input = $(selector);
    if (input) input.addEventListener("change", () => fetchAndRenderFacebook(true));
  });
  const facebookQuery = $("#facebookQuery");
  if (facebookQuery) {
    facebookQuery.addEventListener("input", () => {
      if (state.facebook) renderFacebookList(state.facebook.items || [], facebookQuery.value.trim().toLowerCase());
    });
  }
  const openFacebookSourceBtn = $("#openFacebookSourceBtn");
  if (openFacebookSourceBtn) {
    openFacebookSourceBtn.addEventListener("click", () => {
      const selectedSource = $("#facebookSource")?.value || "all";
      window.moneyDesk.openUrl(selectedSource === "all" ? defaultFacebookSources[0] : selectedSource);
    });
  }
  const interestPeriodSelect = $("#interestPeriod");
  if (interestPeriodSelect) {
    interestPeriodSelect.addEventListener("change", fetchAndRenderInterest);
  }
  const refreshInterestBtn = $("#refreshInterestBtn");
  if (refreshInterestBtn) {
    refreshInterestBtn.addEventListener("click", fetchAndRenderInterest);
  }
  const archiveTrendsNowBtn = $("#archiveTrendsNowBtn");
  if (archiveTrendsNowBtn) {
    archiveTrendsNowBtn.addEventListener("click", archiveTrendsNow);
  }
  const refreshYoutubeBtn = $("#refreshYoutubeBtn");
  if (refreshYoutubeBtn) {
    refreshYoutubeBtn.addEventListener("click", () => fetchAndRenderYouTube(true));
  }
  ["#youtubeRegion", "#youtubePeriod", "#youtubeTopic", "#youtubeSort", "#youtubeMinScore", "#youtubeLimit"].forEach((selector) => {
    const input = $(selector);
    if (input) input.addEventListener("change", () => fetchAndRenderYouTube(true));
  });
  const youtubeQuery = $("#youtubeQuery");
  if (youtubeQuery) {
    youtubeQuery.addEventListener("keydown", (event) => {
      if (event.key === "Enter") fetchAndRenderYouTube(true);
    });
  }
  ["#interestSourceDonut", "#interestScoreChart", "#interestMoneyChart", "#interestForecastChart"].forEach((selector) => {
    const svg = $(selector);
    if (!svg) return;
    svg.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const topic = event.target.closest("[data-interest-topic]");
      const source = event.target.closest("[data-interest-source]");
      if (!topic && !source) return;
      event.preventDefault();
      if (topic) selectInterestTopic(topic.dataset.interestTopic);
      if (source) selectInterestSource(source.dataset.interestSource);
    });
  });
  $("#agentFab").addEventListener("click", () => openAgentModal());
  $$("[data-agent-close]").forEach((button) => button.addEventListener("click", closeAgentModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.agent.modalOpen) {
        closeAgentModal();
      } else if ($("#jobDetailModal").classList.contains("open")) {
        closeJobModal();
      } else if (managerFileState.open) {
        closeManagerFileModal();
      }
    }
  });
  $("#searchCommandForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runMoneyCommand("search", () => window.moneyDesk.runMoneySearch(commandSearchPayload("Search")));
  });
  $("#huntCommandForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runMoneyCommand("hunt", () => window.moneyDesk.runMoneyHunt(commandSearchPayload("Hunt")));
  });
  $("#prepareCommandForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runMoneyCommand("prepare", () => {
      const resultPath = $("#commandPrepareResultPath").value.trim();
      const index = Number($("#commandPrepareIndex").value || 1);

      if (state.dashboard && state.dashboard.results) {
        const resultGroup = state.dashboard.results.find(r => r.path === resultPath);
        if (resultGroup) {
          if (resultGroup.count === 0) {
            throw new Error(`The results file '${resultPath}' is empty. Please run a search or hunt first.`);
          }
          if (index < 1 || index > resultGroup.count) {
            throw new Error(`Selected candidate index ${index} is outside range 1..${resultGroup.count}.`);
          }
        }
      }

      return window.moneyDesk.runMoneyPrepare({
        resultPath,
        index
      });
    });
  });
  $("#ledgerCommandButton").addEventListener("click", () => {
    runMoneyCommand("ledger", () => window.moneyDesk.runMoneyLedger());
  });
  $("#monitorOneShotForm").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const repo = $("#commandMonitorRepo").value.trim();
    const prVal = $("#commandMonitorPr").value;
    const issueVal = $("#commandMonitorIssue").value;
    const jobDir = $("#commandMonitorJobDir").value.trim();
    const claimUrl = $("#commandMonitorClaimUrl").value.trim();

    runMoneyCommand("monitor one-shot", () => {
      // 1. Validate Repo format
      if (!repo) {
        throw new Error("Repository is required.");
      }
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
        throw new Error("Repository must look like 'owner/name' (e.g. 'octocat/Hello-World').");
      }

      // 2. Validate PR and Issue numbers
      const pr = Number(prVal || 0);
      const issue = Number(issueVal || 0);
      if (!prVal || !Number.isInteger(pr) || pr <= 0) {
        throw new Error("Pull Request must be a positive integer.");
      }
      if (!issueVal || !Number.isInteger(issue) || issue <= 0) {
        throw new Error("Issue must be a positive integer.");
      }

      // 3. Validate Job Dir
      if (!jobDir) {
        throw new Error("Job workspace directory is required (e.g. 'jobs/my-job').");
      }

      // 4. Validate Claim URL format if provided
      if (claimUrl && !/^https:\/\/algora\.io\/claims\/[A-Za-z0-9_-]+/.test(claimUrl)) {
        throw new Error("Claim URL must be a valid Algora claim URL (e.g. 'https://algora.io/claims/abc').");
      }

      // NÃƒÂ¡Ã‚ÂºÃ‚Â¿u pass qua mÃƒÂ¡Ã‚Â»Ã‚Âi validation, tiÃƒÂ¡Ã‚ÂºÃ‚Â¿n hÃƒÆ’Ã‚Â nh chÃƒÂ¡Ã‚ÂºÃ‚Â¡y IPC an toÃƒÆ’Ã‚Â n
      return window.moneyDesk.runMonitorOneShot({ repo, pr, issue, jobDir, claimUrl });
    });
  });
  $("#copyCommandOutput").addEventListener("click", async () => {
    await navigator.clipboard.writeText(state.latestCommandOutput);
    addLog("copy", "Copied command output", "Latest money_tool.py output copied.");
  });
  $("#agentComposer").addEventListener("submit", (event) => {
    event.preventDefault();
    sendAgentMessage();
  });
  $("#agentInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendAgentMessage();
    }
  });
  $("#newAgentSession").addEventListener("click", () => {
    state.agent.sessionId = `local-${Date.now()}`;
    state.agent.messages = [];
    state.agent.events = [];
    state.agent.toolResults = [];
    persistAgentSession();
    renderAgentMessages();
    renderAgentTrace();
    addLog("agent", "Started new Agent Chat session", state.agent.sessionId);
  });
  $("#agentThinkingToggle").addEventListener("click", () => {
    const details = $("#agentThinking");
    details.open = !details.open;
    renderAgentTrace();
  });
  $("#agentThinking").addEventListener("toggle", renderAgentTrace);
  $("#copyAgentSession").addEventListener("click", async () => {
    const text = state.agent.messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    addLog("copy", "Copied Agent Chat session", `${state.agent.messages.length} message(s).`);
  });
  $("#agentSettingsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveAgentSettings(false);
  });
  $("#clearAgentApiKey").addEventListener("click", () => saveAgentSettings(true));
  $("#reloadAgentSettings").addEventListener("click", loadAgentData);
  $("#refreshSkills").addEventListener("click", refreshSkills);
  $("#createSkillForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const result = await window.moneyDesk.createAgentSkill({
      command: $("#newSkillCommand").value.trim(),
      goal: $("#newSkillGoal").value.trim(),
      tools: $("#newSkillTools").value.trim(),
      output: $("#newSkillOutput").value.trim()
    });
    $("#newSkillCommand").value = "";
    $("#newSkillGoal").value = "";
    $("#newSkillTools").value = "";
    $("#newSkillOutput").value = "";
    await refreshSkills();
    addLog("skill", "Created Agent skill", result.skill ? result.skill.path : "my-skills");
  });
  $("#openRoot").addEventListener("click", () => {
    if (state.dashboard) window.moneyDesk.openPath(state.dashboard.rootDir);
  });
  $("#clearActivity").addEventListener("click", () => {
    state.activityLog = [];
    resetSnapshotSteps();
    renderActivityLog();
  });
  $("#toggleLogs").addEventListener("click", () => {
    state.logDrawerCollapsed = !state.logDrawerCollapsed;
    $("#logDrawer").classList.toggle("collapsed", state.logDrawerCollapsed);
    $("#toggleLogs").textContent = state.logDrawerCollapsed ? t("logExpand") : t("logCollapse");
    $("#toggleLogs").setAttribute("aria-expanded", String(!state.logDrawerCollapsed));
  });

  // Global Tooltip Hover Tracking
  const globalTooltip = $("#chartTooltip");
  if (globalTooltip) {
    document.body.addEventListener("mouseenter", (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (!target) return;
      
      const text = target.dataset.tooltip;
      globalTooltip.innerHTML = text;
      globalTooltip.style.opacity = "1";
      globalTooltip.style.transform = "translateY(0)";
      
      // Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh vÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ tooltip bÃƒÆ’Ã‚Â¡m sÃƒÆ’Ã‚Â¡t toÃƒÂ¡Ã‚ÂºÃ‚Â¡ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ chuÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t ngay lÃƒÂ¡Ã‚ÂºÃ‚Â­p tÃƒÂ¡Ã‚Â»Ã‚Â©c
      const x = e.clientX + 15;
      const y = e.clientY - 20;
      globalTooltip.style.left = `${x}px`;
      globalTooltip.style.top = `${y}px`;
    }, true);

    document.body.addEventListener("mousemove", (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (!target) return;
      
      const x = e.clientX + 15;
      const y = e.clientY - 20;
      globalTooltip.style.left = `${x}px`;
      globalTooltip.style.top = `${y}px`;
    }, true);

    document.body.addEventListener("mouseleave", (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (target) {
        globalTooltip.style.opacity = "0";
        globalTooltip.style.transform = "translateY(4px)";
      }
    }, true);
  }

  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const managerPreview = event.target.closest("[data-manager-preview-path]");
      if (managerPreview) {
        event.preventDefault();
        openManagerFileModal(managerPreview.dataset.managerPreviewPath);
        return;
      }
      const metricActionBtn = event.target.closest("[data-metric-action]");
      if (metricActionBtn) {
        event.preventDefault();
        handleMetricAction(metricActionBtn.dataset.metricAction);
      }
    }
  });

  document.body.addEventListener("click", (event) => {
    const scheduleHeader = event.target.closest(".schedule-card-header");
    if (scheduleHeader) {
      const isSecondaryBtn = event.target.closest("button") && !event.target.classList.contains("schedule-toggle-btn");
      if (!isSecondaryBtn) {
        const card = scheduleHeader.closest(".schedule-card");
        const label = card.dataset.label;
        state.collapsedSchedules[label] = state.collapsedSchedules[label] === false ? true : false;
        card.classList.toggle("collapsed", state.collapsedSchedules[label]);
        const caret = card.querySelector(".schedule-toggle-btn");
        if (caret) caret.textContent = state.collapsedSchedules[label] ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²";
        return;
      }
    }

    const jobHeader = event.target.closest(".job-row-header");
    if (jobHeader) {
      const isSecondaryBtn = event.target.closest("button") && !event.target.classList.contains("job-toggle-btn");
      if (!isSecondaryBtn) {
        const card = jobHeader.closest(".job-row");
        const path = card.dataset.jobPath;
        state.collapsedJobs[path] = state.collapsedJobs[path] === false ? true : false;
        card.classList.toggle("collapsed", state.collapsedJobs[path]);
        const caret = card.querySelector(".job-toggle-btn");
        if (caret) caret.textContent = state.collapsedJobs[path] ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²";
        return;
      }
    }

    const monitorHeader = event.target.closest(".monitor-row-header");
    if (monitorHeader) {
      const isSecondaryBtn = event.target.closest("button") && !event.target.classList.contains("monitor-toggle-btn");
      if (!isSecondaryBtn) {
        const card = monitorHeader.closest(".monitor-row");
        const path = card.dataset.jobPath;
        state.collapsedMonitors[path] = state.collapsedMonitors[path] === false ? true : false;
        card.classList.toggle("collapsed", state.collapsedMonitors[path]);
        const caret = card.querySelector(".monitor-toggle-btn");
        if (caret) caret.textContent = state.collapsedMonitors[path] ? "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¼" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â²";
        return;
      }
    }

    const managerPreview = event.target.closest("[data-manager-preview-path]");
    if (managerPreview) {
      openManagerFileModal(managerPreview.dataset.managerPreviewPath);
      return;
    }
    const metricActionBtn = event.target.closest("[data-metric-action]");
    if (metricActionBtn) {
      handleMetricAction(metricActionBtn.dataset.metricAction);
    }
    const interestTopic = event.target.closest("[data-interest-topic]");
    if (interestTopic) {
      selectInterestTopic(interestTopic.dataset.interestTopic);
      return;
    }
    const interestSource = event.target.closest("[data-interest-source]");
    if (interestSource) {
      selectInterestSource(interestSource.dataset.interestSource);
      return;
    }
    const viewLinkBtn = event.target.closest("[data-view-link]");
    if (viewLinkBtn) {
      setView(viewLinkBtn.dataset.viewLink);
      if (viewLinkBtn.closest("#agentChatModal")) closeAgentModal();
      return;
    }
    const pathButton = event.target.closest("[data-open-path]");
    if (pathButton) {
      const openPath = pathButton.dataset.openPath;
      if (openPath && (openPath.startsWith("jobs/") || openPath.includes("/jobs/"))) {
        openJobModal(openPath);
      } else {
        addLog("open", "Opening local path", openPath);
        window.moneyDesk.openPath(openPath);
      }
    }
    const jobCloseButton = event.target.closest("[data-job-close]");
    if (jobCloseButton) {
      closeJobModal();
    }
    const managerFileCloseButton = event.target.closest("[data-manager-file-close]");
    if (managerFileCloseButton) {
      closeManagerFileModal();
    }
    const jobTabButton = event.target.closest("[data-job-tab]");
    if (jobTabButton && jobTabButton.dataset.jobTab) {
      selectJobTab(jobTabButton.dataset.jobTab);
    }
    const urlButton = event.target.closest("[data-open-url]");
    if (urlButton) {
      event.preventDefault();
      addLog("open", "Opening external URL", urlButton.dataset.openUrl);
      window.moneyDesk.openUrl(urlButton.dataset.openUrl);
    }
    const skillButton = event.target.closest("[data-skill-command]");
    if (skillButton && skillButton.dataset.skillCommand) {
      openAgentModal(`${skillButton.dataset.skillCommand} `);
    }
    const copyMessage = event.target.closest("[data-copy-message]");
    if (copyMessage) {
      const message = state.agent.messages[Number(copyMessage.dataset.copyMessage)];
      if (message) navigator.clipboard.writeText(message.content);
    }
    const copyTool = event.target.closest("[data-copy-tool]");
    if (copyTool) {
      const tool = state.agent.toolResults[Number(copyTool.dataset.copyTool)];
      if (tool) navigator.clipboard.writeText(JSON.stringify(tool, null, 2));
    }
    const copyInline = event.target.closest("[data-copy-text]");
    if (copyInline) {
      navigator.clipboard.writeText(copyInline.dataset.copyText || "");
    }
    const openThinking = event.target.closest("[data-open-thinking]");
    if (openThinking) {
      openAgentThinking();
      renderAgentTrace();
    }
    const topicPreset = event.target.closest("[data-topic-preset]");
    if (topicPreset) {
      const prefix = topicPreset.dataset.topicPreset;
      const input = $(`#command${prefix}Topics`);
      if (input) input.value = topicPreset.dataset.presetValue || "default";
      addLog("filter", `Set ${prefix.toLowerCase()} topics`, input ? input.value : "");
    }
    const clearRepos = event.target.closest("[data-clear-repos]");
    if (clearRepos) {
      const prefix = clearRepos.dataset.clearRepos;
      const input = $(`#command${prefix}Repos`);
      if (input) input.value = "";
      addLog("filter", `Set ${prefix.toLowerCase()} repo scope`, "Searching across all GitHub repositories.");
    }
    const runMonitorButton = event.target.closest("[data-run-monitor]");
    if (runMonitorButton) {
      runMonitor(runMonitorButton.dataset.runMonitor);
    }
    const inboxButton = event.target.closest("[data-check-github-inbox]");
    if (inboxButton) {
      checkGithubInbox(inboxButton.dataset.checkGithubInbox);
    }
    const trackingButton = event.target.closest("[data-toggle-tracking]");
    if (trackingButton) {
      toggleTracking(trackingButton.dataset.toggleTracking, trackingButton.dataset.trackingField);
    }
    const resetButton = event.target.closest("[data-reset-filters]");
    if (resetButton) {
      resetFilters(resetButton.dataset.resetFilters);
    }
    const pageButton = event.target.closest("[data-page-scope]");
    if (pageButton) {
      const scope = pageButton.dataset.pageScope;
      const action = pageButton.dataset.pageAction;
      const filter = state.filters[scope];
      if (!filter) return;
      const pages = Number(pageButton.dataset.pageTotal || filter.page || 1);
      if (action === "first") filter.page = 1;
      if (action === "prev") filter.page = Math.max(1, Number(filter.page || 1) - 1);
      if (action === "next") filter.page = Math.min(pages, Number(filter.page || 1) + 1);
      if (action === "last") filter.page = pages;
      renderDataScope(scope);
    }
  });
}

wireEvents();
switchJobsGithubTab("jobs");
applyLanguage();
renderActivityLog();
renderCommandOutput();
loadAgentData();
refresh();
