/*
  DUCPT Passport Signup Sheet Bridge

  Setup:
  1. Open Google Sheets > Extensions > Apps Script.
  2. Paste this file (replace everything).
  3. ADMIN_KEY below is REQUIRED. Paste the same key into
     ducpt.com/passport/ > Cai dat > "Admin key neu co".
     Empty ADMIN_KEY = the whole student list is public to anyone.
  4. Deploy > Manage deployments > edit the existing web app > New version > Deploy.
     Execute as: Me
     Who has access: Anyone
  5. Copy the /exec URL into assets/ducpt-sheet-config.js.

  The web app accepts public student signups, lists rows for Passport,
  stores Free/Premium access, and locks one Premium code to one email.

  2026-07-23 fixes (do NOT revert):
  - "not_paid" contained "paid" -> every free signup was stored as premium
    and every downgrade back to free was ignored. Status match is now exact.
  - studentSignup_ is a PUBLIC endpoint, so it can never grant premium;
    role/entitlement coming from the browser are dropped on signup.
  - list + upsertAccess now really require ADMIN_KEY.
  - entitlement lookup returns access fields only (no name/phone/note).
  - phone numbers keep their leading zero (columns forced to plain text).
*/

/* ID cua Google Sheet chua danh sach hoc vien.
   BAT BUOC giu lai khi dan de code moi — day la du an Apps Script DOC LAP,
   khong gan vao bang tinh, nen mat dong nay la getActiveSpreadsheet() tra ve null
   va toan bo cong dang ky chet ("Cannot read properties of null"). */
var SPREADSHEET_ID = "1krMiiuOqtG_zXy8nXIdbtOG0ULNPOqlD5m9xPgODFt4";

var SIGNUP_SHEET_NAME = "CourseSignups";
var CLAIM_SHEET_NAME = "PremiumCodeClaims";
var ADMIN_KEY = "ducpt-sheet-1bfae5ee0cdd5996ffff";
var PREMIUM_CODE_SECRET = "dg-cong-ty-1-nguoi-2026-vip-9f37ab2c";

var SIGNUP_HEADERS = [
  "createdAt", "updatedAt", "email", "name", "contact", "note",
  "course", "courseId", "courseIds", "source", "role", "accessPackage",
  "accessStatus", "funnelStage", "purchaseStatus", "status",
  "entitlement", "orderId", "paidAt", "claimId", "lastSeenAt",
  /* Khoa thiet bi chong chia se tai khoan (Founder 2026-07-23): 1 tai khoan Premium = 1 may.
     deviceId = ma may da gan; deviceLock = on/off; deviceBoundAt = luc gan. */
  "deviceId", "deviceLock", "deviceBoundAt"
];

var CLAIM_HEADERS = [
  "createdAt", "updatedAt", "codeHash", "code", "owner", "course",
  "courseId", "claimId", "status"
];

/* Noi dung khoa hoc (video/bai hoc) luu ngay tren Sheet -> them video la tu len trang khoa hoc,
   KHONG can token GitHub, khong can nhac "Luu tat ca". Moi khoa 1 hang, JSON {course,lessons} trong 1 o. */
var COURSE_SHEET_NAME = "CourseData";
var COURSE_HEADERS = ["courseKey", "json", "updatedAt"];

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = String(p.action || "list");
    if (action === "entitlement") return json_(getEntitlement_(p));
    /* Noi dung khoa hoc la CONG KHAI (trang khoa hoc ai cung xem) -> khong doi admin key. */
    if (action === "courseVideos") return json_(getCourseVideos_(p));
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
    if (action === "deleteSignup") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(deleteSignup_(body));
    }
    if (action === "releaseCode") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(releaseCode_(body));
    }
    if (action === "resetDevice") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(resetDevice_(body));
    }
    if (action === "setDeviceLock") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(setDeviceLock_(body));
    }
    if (action === "updateStudent") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(updateStudent_(body));
    }
    if (action === "saveCourseVideos") {
      requireAdminKey_(body.adminKey || body.key);
      return json_(saveCourseVideos_(body));
    }
    return json_({ ok: false, error: "UNKNOWN_ACTION" });
  } catch (err) {
    return json_({ ok: false, error: err.message || "SERVER_ERROR" });
  }
}

function studentSignup_(body) {
  /* Cong dang ky la endpoint CONG KHAI: khong bao gio tin quyen do trinh duyet gui len.
     Muon len Premium thi phai qua Passport (upsertAccess co ADMIN_KEY) hoac ma Premium. */
  var safe = {};
  for (var k in body) safe[k] = body[k];
  safe.role = "free";
  safe.accessPackage = "free";
  safe.accessStatus = "active";
  safe.entitlement = false;
  safe.purchaseStatus = "not_paid";
  safe.status = "free";
  safe.funnelStage = "free_not_paid";
  safe.orderId = "";
  safe.paidAt = "";
  safe.claimId = "";
  var record = normalizeSignup_(safe);
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

function releaseCode_(body) {
  /* Go 1 ma Premium khoi email da khoa -> ma tro lai trang thai moi, cap lai cho nguoi khac duoc.
     Truyen "code" (ma goc) hoac "codeHash". Chi admin goi duoc. */
  var codeHash = "";
  if (body.code) codeHash = sha256Hex_(String(body.code).trim().toUpperCase()).toLowerCase();
  else if (body.codeHash) codeHash = String(body.codeHash).toLowerCase();
  if (!codeHash) return { ok: false, error: "CODE_REQUIRED" };
  var sheet = sheet_(CLAIM_SHEET_NAME, CLAIM_HEADERS);
  var rows = objects_(sheet);
  var removed = 0;
  for (var i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i].codeHash || "").toLowerCase() === codeHash) { sheet.deleteRow(i + 2); removed++; }
  }
  return { ok: true, data: { removed: removed } };
}

function findStudentRows_(sheet, body) {
  /* Tra ve danh sach {row,index} khop email (+ course neu co). Dung chung cho reset/lock/update. */
  var email = normEmail_(body.email);
  if (!email) return { error: "EMAIL_REQUIRED" };
  var rows = objects_(sheet);
  var courseId = (body.courseId || body.course) ? normalizeCourseId_(body.courseId || body.course) : "";
  var hits = [];
  for (var i = 0; i < rows.length; i++) {
    if (normEmail_(rows[i].email) !== email) continue;
    if (courseId && normalizeCourseId_(rows[i].courseId || rows[i].course || "") !== courseId) continue;
    hits.push({ row: rows[i], index: i + 2 });
  }
  return { email: email, hits: hits };
}

function resetDevice_(body) {
  /* Go may da gan -> hoc vien dang nhap may moi la gan lai tu dau. Chi admin. */
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var f = findStudentRows_(sheet, body);
  if (f.error) return { ok: false, error: f.error };
  var n = 0;
  f.hits.forEach(function (h) {
    h.row.deviceId = "";
    h.row.deviceBoundAt = "";
    h.row.updatedAt = now_();
    updateObject_(sheet, SIGNUP_HEADERS, h.index, h.row);
    n++;
  });
  return { ok: true, data: { email: f.email, reset: n } };
}

function setDeviceLock_(body) {
  /* Bat/tat khoa thiet bi cho 1 hoc vien. lock: "on"/"off". Chi admin. */
  var lock = String(body.lock || body.deviceLock || "on").toLowerCase() === "off" ? "off" : "on";
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var f = findStudentRows_(sheet, body);
  if (f.error) return { ok: false, error: f.error };
  var n = 0;
  f.hits.forEach(function (h) {
    h.row.deviceLock = lock;
    /* Tat khoa thi xoa luon may da gan de khong con chan. */
    if (lock === "off") { h.row.deviceId = ""; h.row.deviceBoundAt = ""; }
    h.row.updatedAt = now_();
    updateObject_(sheet, SIGNUP_HEADERS, h.index, h.row);
    n++;
  });
  return { ok: true, data: { email: f.email, deviceLock: lock, updated: n } };
}

function updateStudent_(body) {
  /* Sua thong tin hoc vien (ten/SDT/ghi chu) ma KHONG dong toi quyen hoc. Chi admin. */
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var f = findStudentRows_(sheet, body);
  if (f.error) return { ok: false, error: f.error };
  if (!f.hits.length) return { ok: false, error: "STUDENT_NOT_FOUND" };
  var has = function (k) { return Object.prototype.hasOwnProperty.call(body, k); };
  var n = 0;
  f.hits.forEach(function (h) {
    if (has("name")) h.row.name = String(body.name || "");
    if (has("contact")) h.row.contact = String(body.contact || "");
    if (has("note")) h.row.note = String(body.note || "");
    h.row.updatedAt = now_();
    updateObject_(sheet, SIGNUP_HEADERS, h.index, h.row);
    n++;
  });
  return { ok: true, data: { email: f.email, updated: n, name: body.name, contact: body.contact } };
}

function deleteSignup_(body) {
  /* Xoa 1 hang dang ky (vi du hang kiem tra). Chi admin goi duoc. */
  var email = normEmail_(body.email);
  if (!email) return { ok: false, error: "EMAIL_REQUIRED" };
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var rows = objects_(sheet);
  var courseId = body.courseId || body.course ? normalizeCourseId_(body.courseId || body.course) : "";
  var removed = 0;
  for (var i = rows.length - 1; i >= 0; i--) {
    if (normEmail_(rows[i].email) !== email) continue;
    if (courseId && normalizeCourseId_(rows[i].courseId || rows[i].course || "") !== courseId) continue;
    sheet.deleteRow(i + 2);
    removed++;
  }
  return { ok: true, data: { email: email, removed: removed } };
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
    var course = String(body.course || "Doanh nghiệp một người");
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

    /* Founder yeu cau (2026-07-23): ai dung MA MOI thi thong tin phai day thang ve
       trang Tong quan Khach hang, ghi ro dung ma nao. Ghi note co ten ma + tag nguon rieng
       "premium-invite-code" de Passport loc/hien "Dung ma moi Premium". */
    upsertAccess_({
      email: owner,
      name: String(body.name || "").trim(),
      contact: String(body.contact || "").trim(),
      note: "Kich hoat bang MA MOI Premium: " + code,
      course: course,
      courseId: courseId,
      source: "premium-invite-code",
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
  var sheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
  var rows = objects_(sheet);
  var existing = findSignup_(rows, email, courseId);
  if (!existing) {
    return { ok: true, data: { email: email, courseId: courseId, role: "free", purchaseStatus: "not_paid" } };
  }
  /* Chi tra ve quyen hoc. KHONG tra ten/SDT/ghi chu: day la endpoint cong khai,
     biet email nguoi khac la doc duoc ho so ho. */
  var row = publicSignup_(existing.row);
  var isPremium = row.role === "premium";

  /* ---- Khoa thiet bi: 1 tai khoan Premium = 1 may ----
     Chi ap khi Premium va deviceLock != "off". Thiet bi goi len qua ?deviceId=. */
  var deviceBlocked = false;
  var deviceBound = false;
  var deviceLockOn = String(existing.row.deviceLock || "on").toLowerCase() !== "off";
  var reqDevice = String(p.deviceId || "").trim();
  if (isPremium && deviceLockOn && reqDevice) {
    var stored = String(existing.row.deviceId || "").trim();
    if (!stored) {
      /* May dau tien mo Premium -> gan may nay cho tai khoan. */
      existing.row.deviceId = reqDevice;
      existing.row.deviceBoundAt = now_();
      existing.row.updatedAt = now_();
      updateObject_(sheet, SIGNUP_HEADERS, existing.index, existing.row);
      deviceBound = true;
    } else if (stored === reqDevice) {
      deviceBound = true;
    } else {
      /* May khac dang dung cung tai khoan -> chan Premium tren may nay. */
      deviceBlocked = true;
    }
  }

  return {
    ok: true,
    data: {
      email: email,
      courseId: row.courseId || courseId,
      courseIds: row.courseIds || "",
      course: row.course || "",
      /* Bi chan thiet bi thi tra role "free" cho may nay -> khoa bai Premium. */
      role: (isPremium && !deviceBlocked) ? "premium" : "free",
      accessPackage: (isPremium && !deviceBlocked) ? (row.accessPackage || "premium") : (isPremium ? "premium" : (row.accessPackage || "free")),
      accessStatus: row.accessStatus || "active",
      purchaseStatus: row.purchaseStatus || "not_paid",
      entitlement: isPremium && !deviceBlocked,
      deviceLock: deviceLockOn ? "on" : "off",
      deviceBound: deviceBound,
      deviceBlocked: deviceBlocked
    }
  };
}

function listSignups_() {
  return objects_(sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS)).map(publicSignup_);
}

function getCourseVideos_(p) {
  /* Founder chot (2026-07-24): KHOA TOAN BO - phai dang nhap moi xem noi dung.
     - Khach la (khong co email hoc vien hop le): CHI tra course meta, lessons rong -> web hien "dang nhap de xem".
     - Hoc vien Free: hien bai, bai Free co video; bai Premium bi go youtubeId (khoa).
     - Hoc vien Premium + dung may da khoa: mo het video.
     Nho vay ID video Premium KHONG bao gio nam o cho cong khai. */
  var key = normalizeCourseId_(p.courseId || p.course || "doanh-nghiep-mot-nguoi");
  var full = null;
  var crows = objects_(sheet_(COURSE_SHEET_NAME, COURSE_HEADERS));
  for (var i = 0; i < crows.length; i++) {
    if (String(crows[i].courseKey || "") === key) {
      try { full = JSON.parse(crows[i].json || "null"); } catch (e) {}
      break;
    }
  }
  if (!full || !Array.isArray(full.lessons)) return { ok: true, data: null };
  var courseMeta = full.course || {};

  /* Xac dinh nguoi xem tu email hoc vien. */
  var email = normEmail_(p.email);
  var viewer = null;
  if (email) {
    var ssheet = sheet_(SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
    var srows = objects_(ssheet);
    var found = findSignup_(srows, email, key);
    if (found) viewer = { row: found.row, index: found.index, sheet: ssheet };
  }

  /* Khach la -> khoa het, chi tra meta de trang hien loi moi dang nhap. */
  if (!viewer) {
    return { ok: true, data: { course: courseMeta, lessons: [] }, requireLogin: true };
  }

  /* Da dang nhap -> tinh quyen Premium + khoa thiet bi (gan may dau, chan may khac). */
  var row = viewer.row;
  var isPrem = String(row.role || "").toLowerCase() === "premium" ||
    (String(row.accessPackage || "").toLowerCase() === "premium" && bool_(row.entitlement));
  var premiumOk = false, deviceBlocked = false;
  if (isPrem) {
    var lockOn = String(row.deviceLock || "on").toLowerCase() !== "off";
    var dev = String(p.deviceId || "").trim();
    if (!lockOn) { premiumOk = true; }
    else if (!dev) { premiumOk = false; }
    else {
      var stored = String(row.deviceId || "").trim();
      if (!stored) {
        row.deviceId = dev; row.deviceBoundAt = now_(); row.updatedAt = now_();
        updateObject_(viewer.sheet, SIGNUP_HEADERS, viewer.index, row);
        premiumOk = true;
      } else if (stored === dev) { premiumOk = true; }
      else { deviceBlocked = true; }
    }
  }

  var lessons = full.lessons.map(function (l) {
    var out = {}; for (var k in l) out[k] = l[k];
    var premLesson = String(l.access || "").toLowerCase() === "premium";
    if (premLesson && !premiumOk) {
      /* Go MOI dau moi video ra khoi du lieu tra ve -> khong lo ID video Premium. */
      out.youtubeId = ""; out.youtubeUrl = ""; out.videoUrl = ""; out.publicUrl = ""; out.storageUrl = ""; out.assetUrl = "";
      out.locked = true;
    }
    return out;
  });

  return { ok: true, data: { course: courseMeta, lessons: lessons }, premium: premiumOk, deviceBlocked: deviceBlocked };
}

function saveCourseVideos_(body) {
  /* Luu noi dung khoa hoc len Sheet. Chi admin. Passport goi ham nay moi khi sua/them video. */
  var payload = body.data || { course: body.course || {}, lessons: body.lessons || [] };
  if (!payload || !Array.isArray(payload.lessons)) return { ok: false, error: "NO_LESSONS" };
  var key = normalizeCourseId_(
    body.courseId ||
    (payload.course && (payload.course.courseId || payload.course.id || payload.course.slug)) ||
    (payload.course && payload.course.title) ||
    "doanh-nghiep-mot-nguoi"
  );
  var jsonStr = JSON.stringify(payload);
  if (jsonStr.length > 48000) return { ok: false, error: "COURSE_JSON_TOO_BIG" };
  var sheet = sheet_(COURSE_SHEET_NAME, COURSE_HEADERS);
  var rows = objects_(sheet);
  var stamp = now_();
  var rec = { courseKey: key, json: jsonStr, updatedAt: stamp };
  var found = false;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].courseKey || "") === key) { updateObject_(sheet, COURSE_HEADERS, i + 2, rec); found = true; break; }
  }
  if (!found) appendObject_(sheet, COURSE_HEADERS, rec);
  return { ok: true, data: { courseKey: key, lessons: payload.lessons.length, updatedAt: stamp } };
}

function normalizeSignup_(body) {
  var stamp = now_();
  var email = normEmail_(body.email || body.owner);
  var course = String(body.course || body.product || "Doanh nghiệp một người");
  var courseId = normalizeCourseId_(body.courseId || body.course || body.product || "doanh-nghiep-mot-nguoi");
  var paid = bool_(body.entitlement) || String(body.role || "").toLowerCase() === "premium" ||
    paidStatus_(body.purchaseStatus) || paidStatus_(body.status);
  /* Ha quyen phai an TOAN BO: goi "free" hoac trang thai "paused" thi khong con la premium,
     neu khong hang se ket o trang thai nua voi (role=premium ma goi=free) va hoc vien van xem het bai. */
  if (String(body.accessPackage || "").toLowerCase() === "free") paid = false;
  if (String(body.accessStatus || "").toLowerCase() === "paused") paid = false;
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
    lastSeenAt: stamp,
    /* Khoa thiet bi: deviceId de trong (gan luc hoc vien mo Premium lan dau);
       deviceLock mac dinh "on" (chong chia se). merge_ chi ghi de khi co gia tri moi. */
    deviceId: String(body.deviceId || ""),
    /* De TRONG (khong phai "on") de merge_ KHONG ghi de trang thai admin da chinh.
       O tim quyen coi trong = "on" mac dinh. Chi setDeviceLock moi dat "on"/"off" that. */
    deviceLock: String(body.deviceLock || ""),
    deviceBoundAt: String(body.deviceBoundAt || "")
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
  /* Fail closed. Quen dat ADMIN_KEY thi khoa luon, khong mo toang danh sach khach hang. */
  if (!ADMIN_KEY) throw new Error("ADMIN_KEY_NOT_CONFIGURED");
  if (String(key || "") !== String(ADMIN_KEY)) throw new Error("ADMIN_KEY_REQUIRED");
}

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
  try { return JSON.parse(raw); } catch (err) { return {}; }
}

function sheet_(name, headers) {
  var ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  var current = sh.getRange(1, 1, 1, Math.max(headers.length, sh.getLastColumn())).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (current[i] !== headers[i]) sh.getRange(1, i + 1).setValue(headers[i]);
  }
  /* Ep toan bo cot ve dang VAN BAN. Neu khong, Sheets doc "0912345678" thanh so
     va nuot mat so 0 dau -> Founder goi lai khach hang sai so. */
  try { sh.getRange(1, 1, sh.getMaxRows(), headers.length).setNumberFormat("@"); } catch (e) {}
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
  /* KHONG dung appendRow: no tu doan kieu va an mat so 0 dau cua SDT ("0912..." -> 912...).
     Ep dinh dang VAN BAN len dung o dich TRUOC khi ghi, roi moi setValues. */
  var row = sh.getLastRow() + 1;
  writeRow_(sh, headers, row, obj);
}

function updateObject_(sh, headers, rowIndex, obj) {
  writeRow_(sh, headers, rowIndex, obj);
}

function writeRow_(sh, headers, row, obj) {
  var rng = sh.getRange(row, 1, 1, headers.length);
  rng.setNumberFormat("@");
  rng.setValues([headers.map(function (h) { return obj[h] == null ? "" : String(obj[h]); })]);
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
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
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
