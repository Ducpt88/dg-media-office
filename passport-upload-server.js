"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const net = require("net");
const tls = require("tls");

const ROOT = __dirname;
const DATA_DIR = process.env.PASSPORT_DATA_DIR || path.join(ROOT, "passport");
const UPLOAD_DIR = path.join(ROOT, "passport", "uploads");
const SIGNUP_FILE = path.join(DATA_DIR, "course-signups.json");
const COURSE_VIDEO_FILE = path.join(ROOT, "passport", "course-videos.json");
const PREMIUM_ACCESS_FILE = path.join(ROOT, "passport", "premium-access.json");
const PREMIUM_CODE_CLAIMS_FILE = path.join(DATA_DIR, "premium-code-claims.json");
const PREMIUM_CODE_SECRET = process.env.DUCPT_PREMIUM_CODE_SECRET || "";
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8890);

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
loadDotEnv(path.join(ROOT, ".env"));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  if (url.pathname.startsWith("/api/")) {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/passport/upload") {
    handleUpload(req, res, url);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/passport/assets") {
    sendJson(res, 200, { ok: true, data: listUploads() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/passport/course-signups") {
    sendJson(res, 200, { ok: true, data: readSignups() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/passport/course-entitlement") {
    sendJson(res, 200, { ok: true, data: findCourseEntitlement(url) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/passport/course-signups") {
    saveSignup(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/passport/premium-code/claim") {
    claimPremiumCode(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/customer/portal/login") {
    loginCustomerPortal(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/passport/course-videos") {
    sendJson(res, 200, { ok: true, data: readCourseVideos() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/passport/course-videos/save") {
    saveCourseVideos(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/passport/course-videos/import-youtube") {
    importYoutube(req, res).catch((error) => {
      sendJson(res, 500, { ok: false, error: error.message });
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/passport/database/status") {
    sendJson(res, 200, { ok: true, data: databaseStatus() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/passport/sync-supabase") {
    syncSupabase(res).catch((error) => {
      sendJson(res, 500, { ok: false, error: error.message });
    });
    return;
  }

  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Passport upload server running at http://${HOST}:${PORT}/passport/`);
});

function handleUpload(req, res, url) {
  const originalName = url.searchParams.get("name") || "asset";
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const fileName = `${stamp}-${safeName(originalName)}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const out = fs.createWriteStream(filePath);
  let size = 0;

  req.on("data", (chunk) => {
    size += chunk.length;
  });

  req.pipe(out);

  out.on("finish", () => {
    sendJson(res, 200, {
      ok: true,
      data: {
        name: originalName,
        fileName,
        type: req.headers["content-type"] || contentType(filePath),
        size,
        url: `/passport/uploads/${encodeURIComponent(fileName)}`,
        addedAt: new Date().toISOString()
      }
    });
  });

  out.on("error", (error) => {
    sendJson(res, 500, { ok: false, error: error.message });
  });
}

function listUploads() {
  return fs.readdirSync(UPLOAD_DIR)
    .map((fileName) => {
      const filePath = path.join(UPLOAD_DIR, fileName);
      const stat = safeStat(filePath);
      if (!stat || !stat.isFile()) return null;
      return {
        name: fileName.replace(/^\d{14}-/, ""),
        fileName,
        type: contentType(filePath),
        size: stat.size,
        url: `/passport/uploads/${encodeURIComponent(fileName)}`,
        addedAt: stat.birthtime.toISOString()
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const lessonA = lessonNumber(a.fileName);
      const lessonB = lessonNumber(b.fileName);
      if (lessonA && lessonB) return lessonA - lessonB;
      if (lessonA) return -1;
      if (lessonB) return 1;
      return b.addedAt.localeCompare(a.addedAt);
    });
}

function databaseStatus() {
  return {
    configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    url: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/\/(.{4}).+?(\..+)$/, "//$1...$2") : "",
    bucket: process.env.SUPABASE_COURSE_BUCKET || "course-videos",
    courseName: process.env.PASSPORT_COURSE_NAME || "Doanh nghiệp một người"
  };
}

async function syncSupabase(res) {
  const status = databaseStatus();
  if (!status.configured) {
    sendJson(res, 400, {
      ok: false,
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in deploy-repo/.env",
      data: status
    });
    return;
  }

  const assets = listUploads().filter((asset) => (asset.type || "").startsWith("video/"));
  const courseName = process.env.PASSPORT_COURSE_NAME || "Doanh nghiệp một người";
  const course = await getOrCreateCourse(courseName);
  const synced = [];

  for (const asset of assets) {
    const lessonNo = lessonNumber(asset.fileName) || synced.length + 1;
    const title = titleFromFile(asset.fileName);
    const storagePath = `${slugify(courseName)}/${asset.fileName}`;
    const localPath = path.join(UPLOAD_DIR, asset.fileName);
    await uploadToStorage(localPath, storagePath, asset.type);
    const lesson = await upsertLesson(course.id, lessonNo, title);
    await upsertAsset(course.id, lesson.id, asset, storagePath, title);
    synced.push({ lessonNo, title, storagePath, size: asset.size });
  }

  sendJson(res, 200, { ok: true, data: { course, synced } });
}

async function supabaseFetch(pathname, options = {}) {
  const url = `${process.env.SUPABASE_URL.replace(/\/+$/, "")}${pathname}`;
  const headers = {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    ...options.headers
  };
  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data && data.message ? data.message : `Supabase request failed: ${response.status}`);
  return data;
}

async function getOrCreateCourse(name) {
  const found = await supabaseFetch(`/rest/v1/courses?name=eq.${encodeURIComponent(name)}&select=id,name&limit=1`);
  if (Array.isArray(found) && found[0]) return found[0];
  const rows = await supabaseFetch("/rest/v1/courses", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=representation" },
    body: JSON.stringify([{ name, category: "Doanh nghiệp một người", lessons_count: 0, status: "draft", sort: 1 }])
  });
  return rows[0];
}

async function upsertLesson(courseId, lessonNo, title) {
  const rows = await supabaseFetch(`/rest/v1/course_lessons?on_conflict=course_id,lesson_no`, {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      course_id: courseId,
      lesson_no: lessonNo,
      sort: lessonNo,
      title,
      objective: "Đồng bộ từ Passport local",
      status: "draft"
    }])
  });
  return rows[0];
}

async function upsertAsset(courseId, lessonId, asset, storagePath, title) {
  const publicUrl = `${process.env.SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${process.env.SUPABASE_COURSE_BUCKET || "course-videos"}/${storagePath}`;
  const rows = await supabaseFetch(`/rest/v1/course_assets?on_conflict=course_id,storage_path`, {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{
      course_id: courseId,
      lesson_id: lessonId,
      asset_type: "video",
      title,
      file_name: asset.fileName,
      mime_type: asset.type,
      file_size: asset.size,
      storage_bucket: process.env.SUPABASE_COURSE_BUCKET || "course-videos",
      storage_path: storagePath,
      public_url: publicUrl,
      status: "draft"
    }])
  });
  return rows[0];
}

async function uploadToStorage(filePath, storagePath, mimeType) {
  const bucket = process.env.SUPABASE_COURSE_BUCKET || "course-videos";
  const stat = fs.statSync(filePath);
  await supabaseFetch(`/storage/v1/object/${bucket}/${storagePath}`, {
    method: "POST",
    headers: {
      "content-type": mimeType || "application/octet-stream",
      "content-length": String(stat.size),
      "x-upsert": "true"
    },
    body: fs.createReadStream(filePath),
    duplex: "half"
  });
}

function serveStatic(req, res, pathname) {
  const normalized = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const absolute = path.resolve(ROOT, normalized.replace(/^\/+/, ""));

  if (!absolute.startsWith(ROOT + path.sep) && absolute !== ROOT) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (isSensitiveStaticPath(absolute)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  let filePath = path.join(ROOT, "index.html");
  if (fs.existsSync(absolute)) {
    const stat = fs.statSync(absolute);
    if (stat.isFile()) filePath = absolute;
    if (stat.isDirectory() && fs.existsSync(path.join(absolute, "index.html"))) {
      filePath = path.join(absolute, "index.html");
    }
  }

  sendFile(req, res, filePath);
}

function isSensitiveStaticPath(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/").toLowerCase();
  const base = path.basename(rel);
  if (!rel || rel.startsWith("..")) return true;
  if (base === ".env" || base.startsWith(".env.")) return true;
  if (["passport-upload-server.js", "render.yaml", "package.json", "package-lock.json"].includes(base)) return true;
  if (rel.endsWith("/premium-code-claims.json") || rel.endsWith("/course-signups.json")) return true;
  return false;
}

function sendFile(req, res, filePath) {
  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  const headers = {
    "Content-Type": contentType(filePath),
    "Cache-Control": "no-store",
    "Accept-Ranges": "bytes"
  };

  if (!range) {
    res.writeHead(200, { ...headers, "Content-Length": stat.size });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const match = range.match(/bytes=(\d*)-(\d*)/);
  if (!match) {
    res.writeHead(416, headers);
    res.end();
    return;
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : stat.size - 1;
  if (start >= stat.size || end >= stat.size || start > end) {
    res.writeHead(416, { ...headers, "Content-Range": `bytes */${stat.size}` });
    res.end();
    return;
  }

  res.writeHead(206, {
    ...headers,
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".pdf": "application/pdf",
    ".zip": "application/zip"
  }[ext] || "application/octet-stream";
}

function sendJson(res, status, payload) {
  setCorsHeaders(res);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function setCorsHeaders(res) {
  const origin = process.env.CORS_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Vary", "Origin");
}

function saveSignup(req, res) {
  let text = "";
  req.on("data", (chunk) => {
    text += chunk;
    if (text.length > 1024 * 1024) {
      res.writeHead(413);
      res.end("Too large");
      req.destroy();
    }
  });
  req.on("end", () => {
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      sendJson(res, 400, { ok: false, error: "Invalid JSON" });
      return;
    }
    const now = new Date().toISOString();
    const courseId = normalizeCourseId(body.courseId || body.courseKey || body.course || "");
    const role = normalizeSignupRole(body);
    const accessPackage = normalizeAccessPackage(body.accessPackage || body.package || body.packageId || (role === "premium" ? "premium" : "free"));
    const record = {
      id: `signup-${Date.now()}`,
      course: String(body.course || "Doanh nghiệp một người").slice(0, 160),
      courseId,
      name: String(body.name || "").slice(0, 160),
      contact: String(body.contact || "").slice(0, 160),
      email: String(body.email || "").trim().toLowerCase().slice(0, 160),
      note: String(body.note || "").slice(0, 2000),
      role: role.slice(0, 40),
      source: String(body.source || "course-signup").slice(0, 80),
      funnelStage: String(body.funnelStage || "free_not_paid").slice(0, 80),
      purchaseStatus: String(body.purchaseStatus || "not_paid").slice(0, 80),
      nextEmailDay: Number(body.nextEmailDay || 0),
      nurturePlan: Array.isArray(body.nurturePlan) ? body.nurturePlan.slice(0, 12) : [],
      status: String(body.status || "free").slice(0, 40),
      entitlement: Boolean(role === "premium"),
      accessPackage,
      accessStatus: normalizeAccessStatus(body.accessStatus || body.entitlementStatus || ""),
      courseIds: normalizeCourseIds(body.courseIds || courseId),
      orderId: String(body.orderId || "").slice(0, 100),
      paidAt: String(body.paidAt || "").slice(0, 80),
      expiresAt: String(body.expiresAt || "").slice(0, 80),
      createdAt: now,
      updatedAt: now
    };
    if (!record.email && !record.contact) {
      sendJson(res, 400, { ok: false, error: "Missing email or contact" });
      return;
    }
    const rows = readSignups();
    const index = findSignupIndex(rows, record);
    if (index >= 0) {
      if (shouldBlockDuplicateSignup(record, rows[index])) {
        sendJson(res, 409, {
          ok: false,
          error: "EMAIL_ALREADY_REGISTERED",
          message: "Email nay da dang ky. Vui long dang nhap lai.",
          data: entitlementPayload(rows[index], courseId)
        });
        return;
      }
      const wasRegistered = Boolean(rows[index].registrationEmailSentAt);
      rows[index] = { ...rows[index], ...record, id: rows[index].id || record.id, createdAt: rows[index].createdAt || record.createdAt, updatedAt: now };
      fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2));
      sendSignupResponse(res, rows, index, !wasRegistered && isCourseStudentSignup(record));
      return;
    }
    rows.unshift(record);
    fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2));
    sendSignupResponse(res, rows, 0, isCourseStudentSignup(record));
  });
}

function isCourseStudentSignup(record) {
  const source = String(record && record.source || "");
  return Boolean(record && record.email && /^(course-student-form|course-signup|customer-portal-email-login)$/.test(source));
}

function shouldBlockDuplicateSignup(record, existing) {
  if (!record || !existing || !record.email) return false;
  const source = String(record.source || "");
  const publicSignup = /^(course-student-form|course-signup|supabase-auth-signup|register-page)$/i.test(source);
  if (!publicSignup) return false;
  return identityKeys(existing).includes(normalizeEntitlementKey(record.email));
}

async function sendSignupResponse(res, rows, index, shouldSendEmail) {
  const record = rows[index];
  let email = { skipped: true, reason: shouldSendEmail ? "smtp_not_configured" : "not_a_new_student_signup" };
  if (shouldSendEmail) {
    email = await sendRegistrationEmail(record);
    if (email.sent) {
      rows[index] = { ...record, registrationEmailSentAt: new Date().toISOString(), registrationEmailMessageId: email.messageId || "" };
      fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2));
    }
  }
  sendJson(res, 200, { ok: true, data: rows[index], email });
}

function readSignups() {
  try {
    return JSON.parse(fs.readFileSync(SIGNUP_FILE, "utf8"));
  } catch {
    return [];
  }
}

function claimPremiumCode(req, res) {
  readJsonBody(req, res, (body) => {
    const now = new Date().toISOString();
    const code = normalizePremiumCode(body.code);
    const owner = normalizeEntitlementKey(body.owner || body.email || body.contact || "");
    const courseId = normalizeCourseId(body.courseId || body.course || "doanh-nghiep-mot-nguoi") || "doanh-nghiep-mot-nguoi";
    const course = String(body.course || "Doanh nghiệp một người").slice(0, 160);
    if (!code) {
      sendJson(res, 400, { ok: false, error: "MISSING_CODE" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(owner)) {
      sendJson(res, 400, { ok: false, error: "OWNER_EMAIL_REQUIRED" });
      return;
    }
    if (!premiumCodeLooksValid(code)) {
      sendJson(res, 400, { ok: false, error: "INVALID_CODE" });
      return;
    }

    const claims = readPremiumCodeClaims();
    const codeHash = sha256(code);
    const existing = claims.find((item) => item.codeHash === codeHash);
    if (existing && existing.owner !== owner) {
      sendJson(res, 409, {
        ok: false,
        error: "CODE_ALREADY_USED",
        data: {
          owner: maskEmail(existing.owner),
          claimedAt: existing.claimedAt || "",
          courseId: existing.courseId || ""
        }
      });
      return;
    }

    const record = existing || {
      id: "pc-" + crypto.randomBytes(8).toString("hex"),
      codeHash,
      codePrefix: code.slice(0, 8),
      owner,
      courseId,
      course,
      claimedAt: now,
      createdAt: now
    };
    record.owner = owner;
    record.courseId = record.courseId || courseId;
    record.course = record.course || course;
    record.lastSeenAt = now;
    if (!existing) claims.unshift(record);
    fs.writeFileSync(PREMIUM_CODE_CLAIMS_FILE, JSON.stringify(claims.slice(0, 5000), null, 2), "utf8");
    upsertPremiumSignupForClaim({ owner, courseId, course, claimId: record.id, now });
    sendJson(res, 200, {
      ok: true,
      data: {
        role: "premium",
        entitlement: true,
        owner,
        courseId,
        course,
        claimId: record.id,
        firstClaim: !existing,
        claimedAt: record.claimedAt
      }
    });
  });
}

function normalizePremiumCode(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function premiumCodeLooksValid(code) {
  if (/^DGP-([A-Z0-9]{4,12})-([0-9A-F]{6})$/.test(code)) return verifySignedPremiumCode(code);
  return readLegacyPremiumCodeHashes().includes(sha256(code));
}

function verifySignedPremiumCode(code) {
  if (!PREMIUM_CODE_SECRET) return false;
  const match = code.match(/^DGP-([A-Z0-9]{4,12})-([0-9A-F]{6})$/);
  if (!match) return false;
  return sha256(`${match[1]}|${PREMIUM_CODE_SECRET}`).slice(0, 6).toUpperCase() === match[2];
}

function readLegacyPremiumCodeHashes() {
  try {
    const data = JSON.parse(fs.readFileSync(PREMIUM_ACCESS_FILE, "utf8"));
    return Array.isArray(data.premiumCodeHashes) ? data.premiumCodeHashes.map((x) => String(x).toLowerCase()) : [];
  } catch {
    return [];
  }
}

function readPremiumCodeClaims() {
  try {
    const data = JSON.parse(fs.readFileSync(PREMIUM_CODE_CLAIMS_FILE, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function upsertPremiumSignupForClaim({ owner, courseId, course, claimId, now }) {
  const rows = readSignups();
  const record = {
    id: "signup-" + sha256(owner).slice(0, 12),
    name: "",
    email: owner,
    contact: "",
    note: "Mo Premium bang ma dung 1 nguoi",
    course,
    courseId,
    courseIds: [courseId],
    role: "premium",
    status: "paid",
    entitlement: true,
    accessPackage: "premium",
    accessStatus: "active",
    purchaseStatus: "paid",
    source: "premium-code-claim",
    orderId: claimId,
    paidAt: now,
    createdAt: now,
    updatedAt: now
  };
  const index = findSignupIndex(rows, record);
  if (index >= 0) {
    rows[index] = {
      ...rows[index],
      ...record,
      id: rows[index].id || record.id,
      name: rows[index].name || record.name,
      createdAt: rows[index].createdAt || record.createdAt,
      updatedAt: now
    };
  } else {
    rows.unshift(record);
  }
  fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2), "utf8");
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function maskEmail(value) {
  const email = String(value || "");
  const parts = email.split("@");
  if (parts.length !== 2) return "";
  const name = parts[0];
  return `${name.slice(0, 2)}***@${parts[1]}`;
}

function smtpConfig() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const from = String(process.env.MAIL_FROM || process.env.SMTP_FROM || "").trim();
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "").trim();
  if (!host || !from) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: /^true|1|yes$/i.test(String(process.env.SMTP_SECURE || "")),
    starttls: !/^false|0|no$/i.test(String(process.env.SMTP_STARTTLS || "true")),
    user,
    pass,
    from,
    replyTo: String(process.env.MAIL_REPLY_TO || from).trim(),
    siteUrl: String(process.env.PUBLIC_SITE_URL || "https://ducpt.com").replace(/\/+$/, "")
  };
}

async function sendRegistrationEmail(record) {
  const cfg = smtpConfig();
  if (!cfg) return { sent: false, skipped: true, reason: "smtp_not_configured" };
  const to = String(record.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return { sent: false, skipped: true, reason: "invalid_email" };
  const name = String(record.name || "hoc vien").trim();
  const course = String(record.course || "khoa hoc DUCPT").trim();
  const courseUrl = cfg.siteUrl + "/khoa-hoc/";
  const subject = "Dang ky hoc thanh cong - DUCPT";
  const text = [
    `Chao ${name},`,
    "",
    `DUCPT da nhan dang ky cua ban cho khoa: ${course}.`,
    "",
    "Tai khoan cua ban hien la Free va co the vao hoc ngay cac bai FREE.",
    "Neu ban da thanh toan, DUCPT se kich hoat Premium cho dung khoa hoc sau khi doi soat.",
    "",
    `Vao hoc tai: ${courseUrl}`,
    "",
    "Cam on ban da dang ky,",
    "DUCPT"
  ].join("\n");
  const html = [
    `<p>Chao ${escapeHtml(name)},</p>`,
    `<p>DUCPT da nhan dang ky cua ban cho khoa: <b>${escapeHtml(course)}</b>.</p>`,
    `<p>Tai khoan cua ban hien la <b>Free</b> va co the vao hoc ngay cac bai <b>FREE</b>.</p>`,
    `<p>Neu ban da thanh toan, DUCPT se kich hoat <b>Premium</b> cho dung khoa hoc sau khi doi soat.</p>`,
    `<p><a href="${escapeHtml(courseUrl)}">Vao hoc ngay</a></p>`,
    `<p>Cam on ban da dang ky,<br>DUCPT</p>`
  ].join("");
  try {
    const messageId = await smtpSend(cfg, { to, subject, text, html });
    return { sent: true, messageId };
  } catch (error) {
    console.error("[mail] registration email failed:", error.message);
    return { sent: false, error: error.message };
  }
}

function encodeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function emailAddress(value) {
  const text = String(value || "").trim();
  const match = text.match(/<([^<>@\s]+@[^<>\s]+)>$/);
  return (match ? match[1] : text).replace(/[<>]/g, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function smtpSend(cfg, mail) {
  const messageId = `${Date.now()}.${crypto.randomBytes(8).toString("hex")}@ducpt.local`;
  const boundary = `ducpt-${crypto.randomBytes(12).toString("hex")}`;
  const fromAddress = emailAddress(cfg.from);
  const headers = [
    `From: ${encodeHeader(cfg.from)}`,
    `To: ${encodeHeader(mail.to)}`,
    `Reply-To: ${encodeHeader(cfg.replyTo)}`,
    `Subject: ${encodeHeader(mail.subject)}`,
    `Message-ID: <${messageId}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`
  ].join("\r\n");
  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    mail.text,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    mail.html,
    `--${boundary}--`,
    ""
  ].join("\r\n");
  const raw = `${headers}\r\n\r\n${body}`.replace(/\r?\n\./g, "\r\n..");
  await withSmtp(cfg, async (client) => {
    const local = "ducpt.local";
    await client.expect(220);
    await client.cmd(`EHLO ${local}`, 250);
    if (!cfg.secure && cfg.starttls && client.features.has("STARTTLS")) {
      await client.cmd("STARTTLS", 220);
      await client.upgrade();
      await client.cmd(`EHLO ${local}`, 250);
    }
    if (cfg.user || cfg.pass) {
      await client.cmd("AUTH LOGIN", 334);
      await client.cmd(Buffer.from(cfg.user, "utf8").toString("base64"), 334);
      await client.cmd(Buffer.from(cfg.pass, "utf8").toString("base64"), 235);
    }
    await client.cmd(`MAIL FROM:<${fromAddress}>`, 250);
    await client.cmd(`RCPT TO:<${emailAddress(mail.to)}>`, [250, 251]);
    await client.cmd("DATA", 354);
    await client.cmd(`${raw}\r\n.`, 250);
    await client.cmd("QUIT", 221).catch(() => {});
  });
  return messageId;
}

function withSmtp(cfg, run) {
  return new Promise((resolve, reject) => {
    const socket = cfg.secure ? tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host }) : net.connect({ host: cfg.host, port: cfg.port });
    const client = smtpClient(socket, cfg.host);
    client.setTimeout(20000, () => reject(new Error("SMTP timeout")));
    client.onError(reject);
    run(client).then(resolve, reject).finally(() => client.close());
  });
}

function smtpClient(socket, servername) {
  let conn = socket;
  let buffer = "";
  const waiters = [];
  const features = new Set();
  let errorHandler = () => {};
  function bind(next) {
    conn = next;
    conn.setEncoding("utf8");
    conn.on("data", (chunk) => {
      buffer += chunk;
      flush();
    });
    conn.on("error", (error) => errorHandler(error));
  }
  bind(socket);
  function flush() {
    while (waiters.length) {
      const lines = buffer.split(/\r?\n/);
      const completeIndex = lines.findIndex((line) => /^\d{3} /.test(line));
      if (completeIndex < 0) return;
      const responseLines = lines.slice(0, completeIndex + 1);
      buffer = lines.slice(completeIndex + 1).join("\r\n");
      responseLines.forEach((line) => {
        const item = line.slice(4).trim().toUpperCase();
        if (item) features.add(item.split(/\s+/)[0]);
      });
      waiters.shift()(responseLines);
    }
  }
  function expect(codes) {
    const allowed = Array.isArray(codes) ? codes : [codes];
    return new Promise((resolve, reject) => {
      waiters.push((lines) => {
        const code = Number(lines[lines.length - 1].slice(0, 3));
        if (allowed.includes(code)) resolve(lines);
        else reject(new Error(`SMTP ${code}: ${lines.join(" | ")}`));
      });
      flush();
    });
  }
  return {
    features,
    setTimeout(ms, fn) { conn.setTimeout(ms, fn); },
    onError(fn) { errorHandler = fn; },
    close() { try { conn.destroy(); } catch {} },
    expect,
    async cmd(command, codes) {
      conn.write(command + "\r\n");
      return expect(codes);
    },
    async upgrade() {
      await new Promise((resolve, reject) => {
        const secure = tls.connect({ socket: conn, servername }, resolve);
        secure.on("error", reject);
        bind(secure);
      });
    }
  };
}

function findCourseEntitlement(url) {
  const wanted = normalizeEntitlementKey(url.searchParams.get("email") || url.searchParams.get("contact") || "");
  const wantedCourse = normalizeCourseId(url.searchParams.get("courseId") || url.searchParams.get("course") || "");
  if (!wanted) return { role: "guest", entitlement: false, purchaseStatus: "not_found" };
  const rows = readSignups();
  const identityRows = rows.filter((item) => identityKeys(item).includes(wanted));
  const row = identityRows.find((item) => courseMatches(item, wantedCourse));
  if (!row) {
    return {
      role: "free",
      entitlement: false,
      purchaseStatus: identityRows.length ? "course_not_granted" : "not_found",
      courseId: wantedCourse,
      courseIds: []
    };
  }
  return entitlementPayload(row, wantedCourse);
}

function normalizeEntitlementKey(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeAccessPackage(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (["member", "membership", "premium", "paid", "full"].includes(raw)) return "premium";
  if (["free", "trial"].includes(raw)) return "free";
  return raw || "premium";
}

function normalizeAccessStatus(value) {
  const raw = String(value || "").trim().toLowerCase();
  return ["active", "paused", "expired"].includes(raw) ? raw : "active";
}

function normalizeCourseId(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  return raw.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeCourseIds(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(list.map(normalizeCourseId).filter(Boolean))].slice(0, 20);
}

function identityKeys(row) {
  return [row && row.email, row && row.contact].map(normalizeEntitlementKey).filter(Boolean);
}

function rowCourseKeys(row) {
  return [...new Set([
    ...normalizeCourseIds(row && (row.courseIds || row.courseId)),
    normalizeCourseId(row && row.course),
    normalizeCourseId(row && row.product)
  ].filter(Boolean))];
}

function courseMatches(row, wantedCourse) {
  if (!wantedCourse) return true;
  const keys = rowCourseKeys(row);
  return !keys.length || keys.includes(wantedCourse);
}

function findSignupIndex(rows, record) {
  const keys = identityKeys(record);
  if (!keys.length) return -1;
  return rows.findIndex((item) => identityKeys(item).some((key) => keys.includes(key)));
}

function hasPaidEntitlement(row) {
  const status = normalizeAccessStatus(row && row.accessStatus);
  if (status !== "active") return false;
  const expiresAt = String(row && row.expiresAt || "").trim();
  if (expiresAt && /^\d{4}-\d{2}-\d{2}/.test(expiresAt) && expiresAt < new Date().toISOString().slice(0, 10)) return false;
  if (normalizeAccessPackage(row && row.accessPackage) === "free") return false;
  return Boolean(row && (row.entitlement || row.role === "premium" || /paid|success|received|complete/i.test(String(row.purchaseStatus || row.status || ""))));
}

function normalizeSignupRole(body) {
  const active = normalizeAccessStatus(body.accessStatus || body.entitlementStatus || "") === "active";
  const pkg = normalizeAccessPackage(body.accessPackage || body.package || body.packageId || "");
  const paid = Boolean(body.entitlement || body.role === "premium" || /paid|success|received|complete/i.test(String(body.purchaseStatus || body.status || "")));
  return paid && active && pkg !== "free" ? "premium" : "free";
}

function entitlementPayload(row, wantedCourse) {
  const paid = hasPaidEntitlement(row);
  const courseIds = normalizeCourseIds(row.courseIds || row.courseId);
  const courseId = wantedCourse || courseIds[0] || normalizeCourseId(row.course || row.product || "");
  return {
    role: paid ? "premium" : "free",
    entitlement: paid,
    purchaseStatus: paid ? "paid" : String(row.purchaseStatus || row.status || "not_paid"),
    accessPackage: normalizeAccessPackage(row.accessPackage || row.package || ""),
    accessStatus: normalizeAccessStatus(row.accessStatus || ""),
    email: String(row.email || "").toLowerCase(),
    name: String(row.name || ""),
    contact: String(row.contact || ""),
    course: String(row.course || ""),
    courseId,
    courseIds: courseIds.length ? courseIds : (courseId ? [courseId] : []),
    updatedAt: row.updatedAt || row.createdAt || ""
  };
}

function loginCustomerPortal(req, res) {
  readJsonBody(req, res, (body) => {
    const now = new Date().toISOString();
    const email = String(body.email || body.contact || "").trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      sendJson(res, 400, { ok: false, error: "Email khong hop le" });
      return;
    }
    const rows = readSignups();
    let index = rows.findIndex((item) => identityKeys(item).includes(email));
    if (index < 0) {
      const courseId = normalizeCourseId(body.courseId || body.courseKey || body.course || "");
      const record = {
        id: `signup-${Date.now()}`,
        course: String(body.course || "DUCPT").slice(0, 160),
        courseId,
        name: String(body.name || "").slice(0, 160),
        contact: String(body.contact || "").slice(0, 160),
        email,
        note: String(body.note || "").slice(0, 2000),
        role: "free",
        source: "customer-portal-email-login",
        funnelStage: "free_not_paid",
        purchaseStatus: "not_paid",
        nextEmailDay: 0,
        nurturePlan: [],
        status: "free",
        entitlement: false,
        accessPackage: "free",
        accessStatus: "active",
        courseIds: courseId ? [courseId] : [],
        orderId: "",
        paidAt: "",
        expiresAt: "",
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now
      };
      rows.unshift(record);
      index = 0;
    } else {
      rows[index] = { ...rows[index], lastLoginAt: now };
    }
    fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2));
    const entitlement = entitlementPayload(rows[index]);
    sendJson(res, 200, {
      ok: true,
      ...entitlement,
      sessionToken: "portal-" + crypto.randomBytes(18).toString("hex"),
      customerName: entitlement.name || email.split("@")[0],
      productName: entitlement.course || (entitlement.entitlement ? "Khoa hoc DUCPT Premium" : "Tai khoan DUCPT Free"),
      productCount: entitlement.entitlement ? 1 : 0,
      progress: entitlement.entitlement ? 15 : 0,
      template: "custom",
      note: entitlement.entitlement ? "Tai khoan da duoc cap quyen hoc. Vao trang khoa hoc de xem bai da mo." : "Tai khoan Free da duoc tao. DUCPT se kich hoat Premium sau khi xac nhan thanh toan."
    });
  });
}

function readCourseVideos() {
  try {
    const data = JSON.parse(fs.readFileSync(COURSE_VIDEO_FILE, "utf8"));
    return normalizeCourseData(data);
  } catch {
    return normalizeCourseData(defaultCourseVideos());
  }
}

function saveCourseVideos(req, res) {
  readJsonBody(req, res, (body) => {
    const data = normalizeCourseData(body);
    fs.writeFileSync(COURSE_VIDEO_FILE, JSON.stringify(data, null, 2), "utf8");
    sendJson(res, 200, { ok: true, data });
  });
}

async function importYoutube(req, res) {
  const body = await readJsonBodyAsync(req);
  const youtubeUrl = String(body.youtubeUrl || body.url || "").trim();
  const youtubeId = youtubeIdFromUrl(youtubeUrl);
  if (!youtubeId) {
    sendJson(res, 400, { ok: false, error: "Invalid YouTube URL" });
    return;
  }

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`);
  const meta = response.ok ? await response.json() : {};
  sendJson(res, 200, {
    ok: true,
    data: {
      id: `yt-${youtubeId}`,
      youtubeUrl: watchUrl,
      youtubeId,
      title: String(meta.title || "Bài học mới").slice(0, 240),
      description: "",
      thumbnail: meta.thumbnail_url || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      author: meta.author_name || "",
      status: "draft"
    }
  });
}

function normalizeCourseData(input) {
  const seed = defaultCourseVideos();
  const course = { ...seed.course, ...(input && input.course ? input.course : {}) };
  const lessons = Array.isArray(input && input.lessons) ? input.lessons : seed.lessons;
  return {
    course: {
      title: String(course.title || seed.course.title).slice(0, 180),
      price: String(course.price || seed.course.price).slice(0, 80),
      contact: String(course.contact || seed.course.contact).slice(0, 160),
      goal: String(course.goal || seed.course.goal).slice(0, 2000),
      cover: String(course.cover || seed.course.cover).slice(0, 500),
      updatedAt: course.updatedAt || new Date().toISOString()
    },
    lessons: lessons.map((lesson, index) => normalizeLesson(lesson, index)).sort((a, b) => a.sort - b.sort),
    schemaVersion: Number((input && input.schemaVersion) || 2),
    accessModel: input && input.accessModel ? input.accessModel : seed.accessModel
  };
}

function normalizeLesson(lesson, index) {
  const rawDirect = String(lesson.videoUrl || lesson.publicUrl || lesson.storageUrl || lesson.assetUrl || "").trim();
  const youtubeId = youtubeIdFromUrl(lesson.youtubeUrl || lesson.url || "") || youtubeIdFromUrl(rawDirect) || String(lesson.youtubeId || "");
  const directVideoUrl = youtubeIdFromUrl(rawDirect) ? "" : rawDirect;
  const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : String(lesson.youtubeUrl || "").trim();
  return {
    id: String(lesson.id || `lesson-${Date.now()}-${index}`).slice(0, 80),
    lessonNo: Number(lesson.lessonNo || lesson.order || index + 1),
    sort: Number(lesson.sort || lesson.lessonNo || lesson.order || index + 1),
    module: String(lesson.module || "").slice(0, 40),
    moduleNo: String(lesson.moduleNo || "").slice(0, 40),
    youtubeUrl,
    youtubeId,
    videoUrl: directVideoUrl,
    sourceType: directVideoUrl ? "direct" : youtubeId ? "youtube" : String(lesson.sourceType || "youtube").slice(0, 24),
    title: String(lesson.title || "Bài học mới").slice(0, 240),
    description: String(lesson.description || lesson.note || "").slice(0, 4000),
    objective: String(lesson.objective || "").slice(0, 1200),
    learnPoints: Array.isArray(lesson.learnPoints) ? lesson.learnPoints.map((x) => String(x).slice(0, 300)).slice(0, 12) : [],
    resourceUrl: String(lesson.resourceUrl || lesson.materialUrl || lesson.noteUrl || "").slice(0, 500),
    thumbnail: String(lesson.thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "")).slice(0, 500),
    duration: String(lesson.duration || "").slice(0, 40),
    status: ["draft", "published", "hidden"].includes(lesson.status) ? lesson.status : "draft",
    access: ["free", "premium", "hidden"].includes(lesson.access) ? lesson.access : "free",
    type: String(lesson.type || "").slice(0, 80),
    orientation: String(lesson.orientation || "").slice(0, 30),
    updatedAt: lesson.updatedAt || new Date().toISOString()
  };
}

function defaultCourseVideos() {
  return {
    course: {
      title: "Doanh nghiệp một người",
      price: "Liên hệ",
      contact: "Zalo 0963249467",
      goal: "Khóa học giúp học viên đóng gói năng lực cá nhân thành offer rõ ràng, tạo nội dung kéo khách, bán sản phẩm dịch vụ số và vận hành gọn bằng AI.",
      cover: "/assets/hvd-horizontal.svg",
      updatedAt: new Date().toISOString()
    },
    lessons: [],
    accessModel: {
      free: "Xem ngay",
      premium: "Cần đăng ký học"
    }
  };
}

function youtubeIdFromUrl(value) {
  const text = String(value || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
  try {
    const url = new URL(text);
    if (url.hostname.includes("youtu.be")) return cleanYoutubeId(url.pathname.slice(1));
    if (url.pathname.startsWith("/shorts/")) return cleanYoutubeId(url.pathname.split("/")[2]);
    if (url.pathname.startsWith("/embed/")) return cleanYoutubeId(url.pathname.split("/")[2]);
    return cleanYoutubeId(url.searchParams.get("v"));
  } catch {
    return "";
  }
}

function cleanYoutubeId(value) {
  const match = String(value || "").match(/[A-Za-z0-9_-]{11}/);
  return match ? match[0] : "";
}

function readJsonBody(req, res, done) {
  let text = "";
  req.on("data", (chunk) => {
    text += chunk;
    if (text.length > 1024 * 1024) {
      res.writeHead(413);
      res.end("Too large");
      req.destroy();
    }
  });
  req.on("end", () => {
    try {
      done(text ? JSON.parse(text) : {});
    } catch {
      sendJson(res, 400, { ok: false, error: "Invalid JSON" });
    }
  });
}

function readJsonBodyAsync(req) {
  return new Promise((resolve, reject) => {
    let text = "";
    req.on("data", (chunk) => {
      text += chunk;
      if (text.length > 1024 * 1024) reject(new Error("Too large"));
    });
    req.on("end", () => {
      try {
        resolve(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function safeName(name) {
  const ext = path.extname(name).slice(0, 12);
  const base = path.basename(name, ext)
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90) || "asset";
  return `${base}${ext}`.toLowerCase();
}

function titleFromFile(fileName) {
  return String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/^(?:buoi|bai|lesson)[-_ ]?\d{1,3}[-_ ]?/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Video khóa học";
}

function slugify(value) {
  return String(value || "course")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase() || "course";
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [rawKey, ...rawValue] = trimmed.split("=");
    const key = rawKey.trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || process.env[key] !== undefined) continue;
    process.env[key] = rawValue.join("=").trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function lessonNumber(fileName) {
  const match = String(fileName || "").match(/(?:buoi|bai|lesson)[-_ ]?(\d{1,3})/i);
  return match ? Number(match[1]) : 0;
}
