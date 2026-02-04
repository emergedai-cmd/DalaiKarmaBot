"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControlUiAvatarRequest = handleControlUiAvatarRequest;
exports.handleControlUiHttpRequest = handleControlUiHttpRequest;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var assistant_identity_js_1 = require("./assistant-identity.js");
var control_ui_shared_js_1 = require("./control-ui-shared.js");
var ROOT_PREFIX = "/";
function resolveControlUiRoot() {
    var here = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
    var execDir = (function () {
        try {
            return node_path_1.default.dirname(node_fs_1.default.realpathSync(process.execPath));
        }
        catch (_a) {
            return null;
        }
    })();
    var candidates = [
        // Packaged app: control-ui lives alongside the executable.
        execDir ? node_path_1.default.resolve(execDir, "control-ui") : null,
        // Running from dist: dist/gateway/control-ui.js -> dist/control-ui
        node_path_1.default.resolve(here, "../control-ui"),
        // Running from source: src/gateway/control-ui.ts -> dist/control-ui
        node_path_1.default.resolve(here, "../../dist/control-ui"),
        // Fallback to cwd (dev)
        node_path_1.default.resolve(process.cwd(), "dist", "control-ui"),
    ].filter(function (dir) { return Boolean(dir); });
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var dir = candidates_1[_i];
        if (node_fs_1.default.existsSync(node_path_1.default.join(dir, "index.html"))) {
            return dir;
        }
    }
    return null;
}
function contentTypeForExt(ext) {
    switch (ext) {
        case ".html":
            return "text/html; charset=utf-8";
        case ".js":
            return "application/javascript; charset=utf-8";
        case ".css":
            return "text/css; charset=utf-8";
        case ".json":
        case ".map":
            return "application/json; charset=utf-8";
        case ".svg":
            return "image/svg+xml";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".webp":
            return "image/webp";
        case ".ico":
            return "image/x-icon";
        case ".txt":
            return "text/plain; charset=utf-8";
        default:
            return "application/octet-stream";
    }
}
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(JSON.stringify(body));
}
function isValidAgentId(agentId) {
    return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(agentId);
}
function handleControlUiAvatarRequest(req, res, opts) {
    var _a;
    var urlRaw = req.url;
    if (!urlRaw) {
        return false;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
        return false;
    }
    var url = new URL(urlRaw, "http://localhost");
    var basePath = (0, control_ui_shared_js_1.normalizeControlUiBasePath)(opts.basePath);
    var pathname = url.pathname;
    var pathWithBase = basePath
        ? "".concat(basePath).concat(control_ui_shared_js_1.CONTROL_UI_AVATAR_PREFIX, "/")
        : "".concat(control_ui_shared_js_1.CONTROL_UI_AVATAR_PREFIX, "/");
    if (!pathname.startsWith(pathWithBase)) {
        return false;
    }
    var agentIdParts = pathname.slice(pathWithBase.length).split("/").filter(Boolean);
    var agentId = (_a = agentIdParts[0]) !== null && _a !== void 0 ? _a : "";
    if (agentIdParts.length !== 1 || !agentId || !isValidAgentId(agentId)) {
        respondNotFound(res);
        return true;
    }
    if (url.searchParams.get("meta") === "1") {
        var resolved_1 = opts.resolveAvatar(agentId);
        var avatarUrl = resolved_1.kind === "local"
            ? (0, control_ui_shared_js_1.buildControlUiAvatarUrl)(basePath, agentId)
            : resolved_1.kind === "remote" || resolved_1.kind === "data"
                ? resolved_1.url
                : null;
        sendJson(res, 200, { avatarUrl: avatarUrl });
        return true;
    }
    var resolved = opts.resolveAvatar(agentId);
    if (resolved.kind !== "local") {
        respondNotFound(res);
        return true;
    }
    if (req.method === "HEAD") {
        res.statusCode = 200;
        res.setHeader("Content-Type", contentTypeForExt(node_path_1.default.extname(resolved.filePath).toLowerCase()));
        res.setHeader("Cache-Control", "no-cache");
        res.end();
        return true;
    }
    serveFile(res, resolved.filePath);
    return true;
}
function respondNotFound(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not Found");
}
function serveFile(res, filePath) {
    var ext = node_path_1.default.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", contentTypeForExt(ext));
    // Static UI should never be cached aggressively while iterating; allow the
    // browser to revalidate.
    res.setHeader("Cache-Control", "no-cache");
    res.end(node_fs_1.default.readFileSync(filePath));
}
function injectControlUiConfig(html, opts) {
    var basePath = opts.basePath, assistantName = opts.assistantName, assistantAvatar = opts.assistantAvatar;
    var script = "<script>" +
        "window.__OPENCLAW_CONTROL_UI_BASE_PATH__=".concat(JSON.stringify(basePath), ";") +
        "window.__OPENCLAW_ASSISTANT_NAME__=".concat(JSON.stringify(assistantName !== null && assistantName !== void 0 ? assistantName : assistant_identity_js_1.DEFAULT_ASSISTANT_IDENTITY.name), ";") +
        "window.__OPENCLAW_ASSISTANT_AVATAR__=".concat(JSON.stringify(assistantAvatar !== null && assistantAvatar !== void 0 ? assistantAvatar : assistant_identity_js_1.DEFAULT_ASSISTANT_IDENTITY.avatar), ";") +
        "</script>";
    // Check if already injected
    if (html.includes("__OPENCLAW_ASSISTANT_NAME__")) {
        return html;
    }
    var headClose = html.indexOf("</head>");
    if (headClose !== -1) {
        return "".concat(html.slice(0, headClose)).concat(script).concat(html.slice(headClose));
    }
    return "".concat(script).concat(html);
}
function serveIndexHtml(res, indexPath, opts) {
    var _a;
    var basePath = opts.basePath, config = opts.config, agentId = opts.agentId;
    var identity = config
        ? (0, assistant_identity_js_1.resolveAssistantIdentity)({ cfg: config, agentId: agentId })
        : assistant_identity_js_1.DEFAULT_ASSISTANT_IDENTITY;
    var resolvedAgentId = typeof identity.agentId === "string"
        ? identity.agentId
        : agentId;
    var avatarValue = (_a = (0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
        avatar: identity.avatar,
        agentId: resolvedAgentId,
        basePath: basePath,
    })) !== null && _a !== void 0 ? _a : identity.avatar;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    var raw = node_fs_1.default.readFileSync(indexPath, "utf8");
    res.end(injectControlUiConfig(raw, {
        basePath: basePath,
        assistantName: identity.name,
        assistantAvatar: avatarValue,
    }));
}
function isSafeRelativePath(relPath) {
    if (!relPath) {
        return false;
    }
    var normalized = node_path_1.default.posix.normalize(relPath);
    if (normalized.startsWith("../") || normalized === "..") {
        return false;
    }
    if (normalized.includes("\0")) {
        return false;
    }
    return true;
}
function handleControlUiHttpRequest(req, res, opts) {
    var urlRaw = req.url;
    if (!urlRaw) {
        return false;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Method Not Allowed");
        return true;
    }
    var url = new URL(urlRaw, "http://localhost");
    var basePath = (0, control_ui_shared_js_1.normalizeControlUiBasePath)(opts === null || opts === void 0 ? void 0 : opts.basePath);
    var pathname = url.pathname;
    if (!basePath) {
        if (pathname === "/ui" || pathname.startsWith("/ui/")) {
            respondNotFound(res);
            return true;
        }
    }
    if (basePath) {
        if (pathname === basePath) {
            res.statusCode = 302;
            res.setHeader("Location", "".concat(basePath, "/").concat(url.search));
            res.end();
            return true;
        }
        if (!pathname.startsWith("".concat(basePath, "/"))) {
            return false;
        }
    }
    var root = resolveControlUiRoot();
    if (!root) {
        res.statusCode = 503;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.");
        return true;
    }
    var uiPath = basePath && pathname.startsWith("".concat(basePath, "/")) ? pathname.slice(basePath.length) : pathname;
    var rel = (function () {
        if (uiPath === ROOT_PREFIX) {
            return "";
        }
        var assetsIndex = uiPath.indexOf("/assets/");
        if (assetsIndex >= 0) {
            return uiPath.slice(assetsIndex + 1);
        }
        return uiPath.slice(1);
    })();
    var requested = rel && !rel.endsWith("/") ? rel : "".concat(rel, "index.html");
    var fileRel = requested || "index.html";
    if (!isSafeRelativePath(fileRel)) {
        respondNotFound(res);
        return true;
    }
    var filePath = node_path_1.default.join(root, fileRel);
    if (!filePath.startsWith(root)) {
        respondNotFound(res);
        return true;
    }
    if (node_fs_1.default.existsSync(filePath) && node_fs_1.default.statSync(filePath).isFile()) {
        if (node_path_1.default.basename(filePath) === "index.html") {
            serveIndexHtml(res, filePath, {
                basePath: basePath,
                config: opts === null || opts === void 0 ? void 0 : opts.config,
                agentId: opts === null || opts === void 0 ? void 0 : opts.agentId,
            });
            return true;
        }
        serveFile(res, filePath);
        return true;
    }
    // SPA fallback (client-side router): serve index.html for unknown paths.
    var indexPath = node_path_1.default.join(root, "index.html");
    if (node_fs_1.default.existsSync(indexPath)) {
        serveIndexHtml(res, indexPath, {
            basePath: basePath,
            config: opts === null || opts === void 0 ? void 0 : opts.config,
            agentId: opts === null || opts === void 0 ? void 0 : opts.agentId,
        });
        return true;
    }
    respondNotFound(res);
    return true;
}
