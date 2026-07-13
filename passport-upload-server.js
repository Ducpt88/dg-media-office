"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const UPLOAD_DIR = path.join(ROOT, "passport", "uploads");
const SIGNUP_FILE = path.join(ROOT, "passport", "course-signups.json");
const COURSE_VIDEO_FILE = path.join(ROOT, "passport", "course-videos.json");
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8890);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
loadDotEnv(path.join(ROOT, ".env"));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

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

  if (req.method === "POST" && url.pathname === "/api/passport/course-signups") {
    saveSignup(req, res);
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
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
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
    const record = {
      id: `signup-${Date.now()}`,
      course: String(body.course || "Doanh nghiệp một người").slice(0, 160),
      name: String(body.name || "").slice(0, 160),
      contact: String(body.contact || "").slice(0, 160),
      email: String(body.email || "").slice(0, 160),
      note: String(body.note || "").slice(0, 2000),
      status: "new",
      createdAt: new Date().toISOString()
    };
    if (!record.name || !record.contact) {
      sendJson(res, 400, { ok: false, error: "Missing name or contact" });
      return;
    }
    const rows = readSignups();
    rows.unshift(record);
    fs.writeFileSync(SIGNUP_FILE, JSON.stringify(rows.slice(0, 1000), null, 2));
    sendJson(res, 200, { ok: true, data: record });
  });
}

function readSignups() {
  try {
    return JSON.parse(fs.readFileSync(SIGNUP_FILE, "utf8"));
  } catch {
    return [];
  }
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
      title: String(meta.title || "Bai hoc moi").slice(0, 240),
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
    lessons: lessons.map((lesson, index) => normalizeLesson(lesson, index)).sort((a, b) => a.sort - b.sort)
  };
}

function normalizeLesson(lesson, index) {
  const youtubeId = youtubeIdFromUrl(lesson.youtubeUrl || lesson.url || "") || String(lesson.youtubeId || "");
  const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : String(lesson.youtubeUrl || "");
  return {
    id: String(lesson.id || `lesson-${Date.now()}-${index}`).slice(0, 80),
    lessonNo: Number(lesson.lessonNo || lesson.order || index + 1),
    sort: Number(lesson.sort || lesson.lessonNo || lesson.order || index + 1),
    youtubeUrl,
    youtubeId,
    title: String(lesson.title || "Bai hoc moi").slice(0, 240),
    description: String(lesson.description || lesson.note || "").slice(0, 4000),
    thumbnail: String(lesson.thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "")).slice(0, 500),
    duration: String(lesson.duration || "").slice(0, 40),
    status: ["draft", "published", "hidden"].includes(lesson.status) ? lesson.status : "draft",
    updatedAt: lesson.updatedAt || new Date().toISOString()
  };
}

function defaultCourseVideos() {
  return {
    course: {
      title: "Doanh nghiep mot nguoi",
      price: "Lien he",
      contact: "Zalo 0963249467",
      goal: "Khoa hoc giup hoc vien dong goi nang luc ca nhan thanh offer ro rang, tao noi dung keo khach, ban san pham dich vu so va van hanh gon bang AI.",
      cover: "/assets/hvd-horizontal.svg",
      updatedAt: new Date().toISOString()
    },
    lessons: []
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
