/*
  DUCPT Passport Signup Sheet Bridge

  Setup:
  1. Open Google Sheets > Extensions > Apps Script.
  2. Paste this file.
  3. Optional: set ADMIN_KEY to a private phrase. Keep it empty for the fastest setup.
  4. Deploy > New deployment > Web app.
     Execute as: Me
     Who has access: Anyone
  5. Copy the /exec URL into assets/ducpt-sheet-config.js.

  The web app accepts public student signups, lists rows for Passport,
  stores Free/Premium access, and locks one Premium code to one email.
*/

var SIGNUP_SHEET_NAME = "CourseSignups";
var CLAIM_SHEET_NAME = "PremiumCodeClaims";
var ADMIN_KEY = "";
var PREMIUM_CODE_SECRET = PropertiesService.getScriptProperties().getProperty("PREMIUM_CODE_SECRET") || "";

var SIGNUP_HEADERS = [
  "createdAt", "updatedAt", "email", "name", "contact", "note",
  "course", "courseId", "courseIds", "source", "role", "accessPackage",
  "accessStatus", "funnelStage", "purchaseStatus", "status",
  "entitlement", "orderId", "paidAt", "claimId", "lastSeenAt"
];

var CLAIM_HEADERS = [
  "createdAt", "updatedAt", "codeHash", "code", "owner", "course",
  "courseId", "claimId", "status"
];

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = String(p.action || "list");
    if (action === "entitlement") return json_(getEntitlement_(p));
    requireAdminKey_(p.key || p.adminKey);
    if (action === "list") return json_({ ok: true, data: listSignups_() });
    return json_({ ok: false, error: "UNKNOWN_ACTION" });
  } catch (err) {
    return json_({ ok: false, error: err.message || "SERVER_ERROR" });
  }
}

function doPost(e) {
  try {
    var body = parseBody_(e);
    var action = String(body.action || "signup");
    if (action === "signup") return json_(studentSignup_(body));
    if (action === "claimPremiumCode") return json_(claimPremiumCode_(body));
    if (action === "upsertAccess") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(upsertAccess_(body));
    }
    return json_({ ok: false, error: "UNKNOWN_ACTION" });
  } catch (err) {
    return json_({ ok: false, error: err.message || "SERVER_ERROR" });
  }
}

function studentSignup_(body) {
  var record = normalizeSignup_(body);
  if (!record.email) return { ok: false, error: "EMAIL_REQUIRED" };
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var rows = objects_(sheet);
  var existing = findSignup_(rows, record.email, record.courseId);
  if (existing) {
    return { ok: false, error: "EMAIL_ALREADY_REGISTERED", data: publicSignup_(existing.row) };
  }
  appendObject_(sheet, SIGNUP_HEADERS, record);
  return { ok: true, data: publicSignup_(record) };
}

function upsertAccess_(body) {
  var record = normalizeSignup_(body);
  if (!record.email) return { ok: false, error: "EMAIL_REQUIRED" };
  record.updatedAt = now_();
  record.lastSeenAt = record.updatedAt;
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var rows = objects_(sheet);
  var existing = findSignup_(rows, record.email, record.courseId);
  if (existing) {
    updateObject_(sheet, SIGNUP_HEADERS, existing.index, merge_(existing.row, record));
  } else {
    appendObject_(sheet, SIGNUP_HEADERS, record);
  }
  return { ok: true, data: publicSignup_(record) };
}

function claimPremiumCode_(body) {
  var code = String(body.code || "").trim().toUpperCase();
  var owner = normEmail_(body.owner || body.email);
  if (!owner) return { ok: false, error: "EMAIL_REQUIRED" };
  if (!premiumCodeLooksValid_(code)) return { ok: false, error: "INVALID_PREMIUM_CODE" };

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var courseId = normalizeCourseId_(body.courseId || body.course || "doanh-nghiep-mot-nguoi");
    var course = String(body.course || "Doanh nghiá»‡p má»™t ngÆ°á»i");
    var codeHash = sha256Hex_(code).toLowerCase();
    var claimSheet = sheet_(CLAIM_SHEET_NAME, CLAIM_HEADERS);
    var claims = objects_(claimSheet);
    var existing = null;
    for (var i = 0; i < claims.length; i++) {
      if (String(claims[i].codeHash || "").toLowerCase() === codeHash) {
        existing = { row: claims[i], index: i + 2 };
        break;
      }
    }
    if (existing && normEmail_(existing.row.owner) !== owner) {
      return {
        ok: false,
        error: "CODE_ALREADY_USED",
        data: { owner: existing.row.owner || "", claimedAt: existing.row.createdAt || "" }
      };
    }

    var stamp = now_();
    var claimId = existing ? existing.row.claimId : ("PCLAIM-" + Date.now());
    var claim = {
      createdAt: existing ? existing.row.createdAt : stamp,
      updatedAt: stamp,
      codeHash: codeHash,
      code: code,
      owner: owner,
      course: course,
      courseId: courseId,
      claimId: claimId,
      status: "claimed"
    };
    if (existing) updateObject_(claimSheet, CLAIM_HEADERS, existing.index, claim);
    else appendObject_(claimSheet, CLAIM_HEADERS, claim);

    upsertAccess_({
      email: owner,
      name: body.name || "",
      contact: body.contact || "",
      note: "Premium code claim",
      course: course,
      courseId: courseId,
      source: "premium-code-claim",
      role: "premium",
      accessPackage: "premium",
      accessStatus: "active",
      funnelStage: "paid_student",
      purchaseStatus: "paid",
      status: "paid",
      entitlement: true,
      orderId: claimId,
      claimId: claimId,
      paidAt: stamp
    });

    return {
      ok: true,
      data: { role: "premium", owner: owner, email: owner, courseId: courseId, claimId: claimId, claimedAt: stamp }
    };
  } finally {
    lock.releaseLock();
  }
}

function getEntitlement_(p) {
  var email = normEmail_(p.email);
  var courseId = normalizeCourseId_(p.courseId || p.course || "doanh-nghiep-mot-nguoi");
  if (!email) return { ok: false, error: "EMAIL_REQUIRED" };
  var rows = objects_(sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS));
  var existing = findSignup_(rows, email, courseId);
  if (!existing) {
    return { ok: true, data: { email: email, courseId: courseId, role: "free", purchaseStatus: "not_paid" } };
  }
  return { ok: true, data: publicSignup_(existing.row) };
}

function listSignups_() {
  return objects_(sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS)).map(publicSignup_);
}

function normalizeSignup_(body) {
  var stamp = now_();
  var email = normEmail_(body.email || body.owner);
  var course = String(body.course || body.product || "Doanh nghiá»‡p má»™t ngÆ°á»i");
  var courseId = normalizeCourseId_(body.courseId || body.course || body.product || "doanh-nghiep-mot-nguoi");
  var paid = bool_(body.entitlement) || String(body.role || "").toLowerCase() === "premium" ||
    paidStatus_(body.purchaseStatus) || paidStatus_(body.status);
  return {
    createdAt: body.createdAt || stamp,
    updatedAt: body.updatedAt || stamp,
    email: email,
    name: String(body.name || body.full_name || ""),
    contact: String(body.contact || ""),
    note: String(body.note || ""),
    course: course,
    courseId: courseId,
    courseIds: Array.isArray(body.courseIds) ? body.courseIds.join(",") : String(body.courseIds || courseId),
    source: String(body.source || "course-signup"),
    role: paid ? "premium" : String(body.role || "free").toLowerCase(),
    accessPackage: paid ? String(body.accessPackage || "premium") : String(body.accessPackage || "free"),
    accessStatus: String(body.accessStatus || "active"),
    funnelStage: String(body.funnelStage || (paid ? "paid_student" : "free_not_paid")),
    purchaseStatus: String(body.purchaseStatus || (paid ? "paid" : "not_paid")),
    status: String(body.status || (paid ? "paid" : "free")),
    entitlement: paid ? "true" : "false",
    orderId: String(body.orderId || ""),
    paidAt: String(body.paidAt || ""),
    claimId: String(body.claimId || ""),
    lastSeenAt: stamp
  };
}

function publicSignup_(row) {
  var out = {};
  for (var i = 0; i < SIGNUP_HEADERS.length; i++) out[SIGNUP_HEADERS[i]] = row[SIGNUP_HEADERS[i]] || "";
  out.entitlement = bool_(out.entitlement);
  return out;
}

function findSignup_(rows, email, courseId) {
  var e = normEmail_(email);
  var c = normalizeCourseId_(courseId || "doanh-nghiep-mot-nguoi");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (normEmail_(row.email) === e && normalizeCourseId_(row.courseId || row.course || "doanh-nghiep-mot-nguoi") === c) {
      return { row: row, index: i + 2 };
    }
  }
  return null;
}

function requireAdminKey_(key) {
  if (!ADMIN_KEY) return;
  if (String(key || "") !== String(ADMIN_KEY)) throw new Error("ADMIN_KEY_REQUIRED");
}

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
  try { return JSON.parse(raw); } catch (err) { return {}; }
}

function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  var current = sh.getRange(1, 1, 1, Math.max(headers.length, sh.getLastColumn())).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (current[i] !== headers[i]) sh.getRange(1, i + 1).setValue(headers[i]);
  }
  return sh;
}

function objects_(sh) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(1, 1, last, sh.getLastColumn()).getValues();
  var headers = values.shift().map(String);
  return values.map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function appendObject_(sh, headers, obj) {
  sh.appendRow(headers.map(function (h) { return obj[h] == null ? "" : obj[h]; }));
}

function updateObject_(sh, headers, rowIndex, obj) {
  sh.getRange(rowIndex, 1, 1, headers.length).setValues([headers.map(function (h) { return obj[h] == null ? "" : obj[h]; })]);
}

function merge_(a, b) {
  var out = {};
  for (var k in a) out[k] = a[k];
  for (var j in b) {
    if (b[j] !== "" && b[j] != null) out[j] = b[j];
  }
  return out;
}

function premiumCodeLooksValid_(code) {
  var m = String(code || "").trim().toUpperCase().match(/^DGP-([A-Z0-9]{4,12})-([0-9A-F]{6})$/);
  if (!m) return false;
  return sha256Hex_(m[1] + "|" + PREMIUM_CODE_SECRET).slice(0, 6).toUpperCase() === m[2];
}

function sha256Hex_(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    var v = b < 0 ? b + 256 : b;
    return ("0" + v.toString(16)).slice(-2);
  }).join("");
}

function normalizeCourseId_(value) {
  return String(value || "").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Ä‘/g, "d")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "doanh-nghiep-mot-nguoi";
}

function normEmail_(value) {
  return String(value || "").trim().toLowerCase();
}

function bool_(value) {
  return value === true || String(value || "").toLowerCase() === "true" || String(value || "") === "1";
}

function paidStatus_(value) {
  return /^(paid|success|received|complete)$/i.test(String(value || "").trim());
}

function now_() {
  return new Date().toISOString();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
