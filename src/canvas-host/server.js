"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanvasHostHandler = createCanvasHostHandler;
exports.startCanvasHost = startCanvasHost;
var chokidar_1 = require("chokidar");
var fsSync = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_http_1 = require("node:http");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var ws_1 = require("ws");
var env_js_1 = require("../infra/env.js");
var fs_safe_js_1 = require("../infra/fs-safe.js");
var mime_js_1 = require("../media/mime.js");
var utils_js_1 = require("../utils.js");
var a2ui_js_1 = require("./a2ui.js");
function defaultIndexHTML() {
    return "<!doctype html>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>OpenClaw Canvas</title>\n<style>\n  html, body { height: 100%; margin: 0; background: #000; color: #fff; font: 16px/1.4 -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }\n  .wrap { min-height: 100%; display: grid; place-items: center; padding: 24px; }\n  .card { width: min(720px, 100%); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 18px 18px 14px; }\n  .title { display: flex; align-items: baseline; gap: 10px; }\n  h1 { margin: 0; font-size: 22px; letter-spacing: 0.2px; }\n  .sub { opacity: 0.75; font-size: 13px; }\n  .row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }\n  button { appearance: none; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.10); color: #fff; padding: 10px 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }\n  button:active { transform: translateY(1px); }\n  .ok { color: #24e08a; }\n  .bad { color: #ff5c5c; }\n  .log { margin-top: 14px; opacity: 0.85; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", monospace; white-space: pre-wrap; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; }\n</style>\n<div class=\"wrap\">\n  <div class=\"card\">\n    <div class=\"title\">\n      <h1>OpenClaw Canvas</h1>\n      <div class=\"sub\">Interactive test page (auto-reload enabled)</div>\n    </div>\n\n    <div class=\"row\">\n      <button id=\"btn-hello\">Hello</button>\n      <button id=\"btn-time\">Time</button>\n      <button id=\"btn-photo\">Photo</button>\n      <button id=\"btn-dalek\">Dalek</button>\n    </div>\n\n    <div id=\"status\" class=\"sub\" style=\"margin-top: 10px;\"></div>\n    <div id=\"log\" class=\"log\">Ready.</div>\n  </div>\n</div>\n<script>\n(() => {\n  const logEl = document.getElementById(\"log\");\n  const statusEl = document.getElementById(\"status\");\n  const log = (msg) => { logEl.textContent = String(msg); };\n\n  const hasIOS = () =>\n    !!(\n      window.webkit &&\n      window.webkit.messageHandlers &&\n      window.webkit.messageHandlers.openclawCanvasA2UIAction\n    );\n  const hasAndroid = () =>\n    !!(\n      (window.openclawCanvasA2UIAction &&\n        typeof window.openclawCanvasA2UIAction.postMessage === \"function\")\n    );\n  const hasHelper = () => typeof window.openclawSendUserAction === \"function\";\n  statusEl.innerHTML =\n    \"Bridge: \" +\n    (hasHelper() ? \"<span class='ok'>ready</span>\" : \"<span class='bad'>missing</span>\") +\n    \" \u00B7 iOS=\" + (hasIOS() ? \"yes\" : \"no\") +\n    \" \u00B7 Android=\" + (hasAndroid() ? \"yes\" : \"no\");\n\n  const onStatus = (ev) => {\n    const d = ev && ev.detail || {};\n    log(\"Action status: id=\" + (d.id || \"?\") + \" ok=\" + String(!!d.ok) + (d.error ? (\" error=\" + d.error) : \"\"));\n  };\n  window.addEventListener(\"openclaw:a2ui-action-status\", onStatus);\n\n  function send(name, sourceComponentId) {\n    if (!hasHelper()) {\n      log(\"No action bridge found. Ensure you're viewing this on an iOS/Android OpenClaw node canvas.\");\n      return;\n    }\n    const sendUserAction =\n      typeof window.openclawSendUserAction === \"function\"\n        ? window.openclawSendUserAction\n        : undefined;\n    const ok = sendUserAction({\n      name,\n      surfaceId: \"main\",\n      sourceComponentId,\n      context: { t: Date.now() },\n    });\n    log(ok ? (\"Sent action: \" + name) : (\"Failed to send action: \" + name));\n  }\n\n  document.getElementById(\"btn-hello\").onclick = () => send(\"hello\", \"demo.hello\");\n  document.getElementById(\"btn-time\").onclick = () => send(\"time\", \"demo.time\");\n  document.getElementById(\"btn-photo\").onclick = () => send(\"photo\", \"demo.photo\");\n  document.getElementById(\"btn-dalek\").onclick = () => send(\"dalek\", \"demo.dalek\");\n})();\n</script>\n";
}
function normalizeUrlPath(rawPath) {
    var decoded = decodeURIComponent(rawPath || "/");
    var normalized = node_path_1.default.posix.normalize(decoded);
    return normalized.startsWith("/") ? normalized : "/".concat(normalized);
}
function resolveFilePath(rootReal, urlPath) {
    return __awaiter(this, void 0, void 0, function () {
        var normalized, rel, tryOpen, candidate, st, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    normalized = normalizeUrlPath(urlPath);
                    rel = normalized.replace(/^\/+/, "");
                    if (rel.split("/").some(function (p) { return p === ".."; })) {
                        return [2 /*return*/, null];
                    }
                    tryOpen = function (relative) { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, fs_safe_js_1.openFileWithinRoot)({ rootDir: rootReal, relativePath: relative })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    err_1 = _a.sent();
                                    if (err_1 instanceof fs_safe_js_1.SafeOpenError) {
                                        return [2 /*return*/, null];
                                    }
                                    throw err_1;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!normalized.endsWith("/")) return [3 /*break*/, 2];
                    return [4 /*yield*/, tryOpen(node_path_1.default.posix.join(rel, "index.html"))];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    candidate = node_path_1.default.join(rootReal, rel);
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.lstat(candidate)];
                case 4:
                    st = _b.sent();
                    if (st.isSymbolicLink()) {
                        return [2 /*return*/, null];
                    }
                    if (!st.isDirectory()) return [3 /*break*/, 6];
                    return [4 /*yield*/, tryOpen(node_path_1.default.posix.join(rel, "index.html"))];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [3 /*break*/, 8];
                case 7:
                    _a = _b.sent();
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, tryOpen(rel)];
                case 9: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function isDisabledByEnv() {
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_CANVAS_HOST)) {
        return true;
    }
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_CANVAS_HOST)) {
        return true;
    }
    if (process.env.NODE_ENV === "test") {
        return true;
    }
    if (process.env.VITEST) {
        return true;
    }
    return false;
}
function normalizeBasePath(rawPath) {
    var trimmed = (rawPath !== null && rawPath !== void 0 ? rawPath : a2ui_js_1.CANVAS_HOST_PATH).trim();
    var normalized = normalizeUrlPath(trimmed || a2ui_js_1.CANVAS_HOST_PATH);
    if (normalized === "/") {
        return "/";
    }
    return normalized.replace(/\/+$/, "");
}
function prepareCanvasRoot(rootDir) {
    return __awaiter(this, void 0, void 0, function () {
        var rootReal, indexPath, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, utils_js_1.ensureDir)(rootDir)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.realpath(rootDir)];
                case 2:
                    rootReal = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 10]);
                    indexPath = node_path_1.default.join(rootReal, "index.html");
                    return [4 /*yield*/, promises_1.default.stat(indexPath)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 5:
                    _a = _c.sent();
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(rootReal, "index.html"), defaultIndexHTML(), "utf8")];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/, rootReal];
            }
        });
    });
}
function resolveDefaultCanvasRoot() {
    var candidates = [node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "canvas")];
    var existing = candidates.find(function (dir) {
        try {
            return fsSync.statSync(dir).isDirectory();
        }
        catch (_a) {
            return false;
        }
    });
    return existing !== null && existing !== void 0 ? existing : candidates[0];
}
function createCanvasHostHandler(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var basePath, rootDir, rootReal, liveReload, wss, sockets, debounce, broadcastReload, scheduleReload, watcherClosed, watcher, handleUpgrade, handleHttpRequest;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    basePath = normalizeBasePath(opts.basePath);
                    if (isDisabledByEnv() && opts.allowInTests !== true) {
                        return [2 /*return*/, {
                                rootDir: "",
                                basePath: basePath,
                                handleHttpRequest: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, false];
                                }); }); },
                                handleUpgrade: function () { return false; },
                                close: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); },
                            }];
                    }
                    rootDir = (0, utils_js_1.resolveUserPath)((_a = opts.rootDir) !== null && _a !== void 0 ? _a : resolveDefaultCanvasRoot());
                    return [4 /*yield*/, prepareCanvasRoot(rootDir)];
                case 1:
                    rootReal = _b.sent();
                    liveReload = opts.liveReload !== false;
                    wss = liveReload ? new ws_1.WebSocketServer({ noServer: true }) : null;
                    sockets = new Set();
                    if (wss) {
                        wss.on("connection", function (ws) {
                            sockets.add(ws);
                            ws.on("close", function () { return sockets.delete(ws); });
                        });
                    }
                    debounce = null;
                    broadcastReload = function () {
                        if (!liveReload) {
                            return;
                        }
                        for (var _i = 0, sockets_1 = sockets; _i < sockets_1.length; _i++) {
                            var ws = sockets_1[_i];
                            try {
                                ws.send("reload");
                            }
                            catch (_a) {
                                // ignore
                            }
                        }
                    };
                    scheduleReload = function () {
                        var _a;
                        if (debounce) {
                            clearTimeout(debounce);
                        }
                        debounce = setTimeout(function () {
                            debounce = null;
                            broadcastReload();
                        }, 75);
                        (_a = debounce.unref) === null || _a === void 0 ? void 0 : _a.call(debounce);
                    };
                    watcherClosed = false;
                    watcher = liveReload
                        ? chokidar_1.default.watch(rootReal, {
                            ignoreInitial: true,
                            awaitWriteFinish: { stabilityThreshold: 75, pollInterval: 10 },
                            usePolling: opts.allowInTests === true,
                            ignored: [
                                /(^|[\\/])\../, // dotfiles
                                /(^|[\\/])node_modules([\\/]|$)/,
                            ],
                        })
                        : null;
                    watcher === null || watcher === void 0 ? void 0 : watcher.on("all", function () { return scheduleReload(); });
                    watcher === null || watcher === void 0 ? void 0 : watcher.on("error", function (err) {
                        if (watcherClosed) {
                            return;
                        }
                        watcherClosed = true;
                        opts.runtime.error("canvasHost watcher error: ".concat(String(err), " (live reload disabled; consider canvasHost.liveReload=false or a smaller canvasHost.root)"));
                        void watcher.close().catch(function () { });
                    });
                    handleUpgrade = function (req, socket, head) {
                        var _a;
                        if (!wss) {
                            return false;
                        }
                        var url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://localhost");
                        if (url.pathname !== a2ui_js_1.CANVAS_WS_PATH) {
                            return false;
                        }
                        wss.handleUpgrade(req, socket, head, function (ws) {
                            wss.emit("connection", ws, req);
                        });
                        return true;
                    };
                    handleHttpRequest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var urlRaw, url, urlPath, opened, handle, realPath, data, lower, mime, _a, html, err_2;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    urlRaw = req.url;
                                    if (!urlRaw) {
                                        return [2 /*return*/, false];
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 11, , 12]);
                                    url = new URL(urlRaw, "http://localhost");
                                    if (url.pathname === a2ui_js_1.CANVAS_WS_PATH) {
                                        res.statusCode = liveReload ? 426 : 404;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end(liveReload ? "upgrade required" : "not found");
                                        return [2 /*return*/, true];
                                    }
                                    urlPath = url.pathname;
                                    if (basePath !== "/") {
                                        if (urlPath !== basePath && !urlPath.startsWith("".concat(basePath, "/"))) {
                                            return [2 /*return*/, false];
                                        }
                                        urlPath = urlPath === basePath ? "/" : urlPath.slice(basePath.length) || "/";
                                    }
                                    if (req.method !== "GET" && req.method !== "HEAD") {
                                        res.statusCode = 405;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Method Not Allowed");
                                        return [2 /*return*/, true];
                                    }
                                    return [4 /*yield*/, resolveFilePath(rootReal, urlPath)];
                                case 2:
                                    opened = _c.sent();
                                    if (!opened) {
                                        if (urlPath === "/" || urlPath.endsWith("/")) {
                                            res.statusCode = 404;
                                            res.setHeader("Content-Type", "text/html; charset=utf-8");
                                            res.end("<!doctype html><meta charset=\"utf-8\" /><title>OpenClaw Canvas</title><pre>Missing file.\nCreate ".concat(rootDir, "/index.html</pre>"));
                                            return [2 /*return*/, true];
                                        }
                                        res.statusCode = 404;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("not found");
                                        return [2 /*return*/, true];
                                    }
                                    handle = opened.handle, realPath = opened.realPath;
                                    data = void 0;
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, , 5, 7]);
                                    return [4 /*yield*/, handle.readFile()];
                                case 4:
                                    data = _c.sent();
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, handle.close().catch(function () { })];
                                case 6:
                                    _c.sent();
                                    return [7 /*endfinally*/];
                                case 7:
                                    lower = realPath.toLowerCase();
                                    if (!(lower.endsWith(".html") || lower.endsWith(".htm"))) return [3 /*break*/, 8];
                                    _a = "text/html";
                                    return [3 /*break*/, 10];
                                case 8: return [4 /*yield*/, (0, mime_js_1.detectMime)({ filePath: realPath })];
                                case 9:
                                    _a = ((_b = (_c.sent())) !== null && _b !== void 0 ? _b : "application/octet-stream");
                                    _c.label = 10;
                                case 10:
                                    mime = _a;
                                    res.setHeader("Cache-Control", "no-store");
                                    if (mime === "text/html") {
                                        html = data.toString("utf8");
                                        res.setHeader("Content-Type", "text/html; charset=utf-8");
                                        res.end(liveReload ? (0, a2ui_js_1.injectCanvasLiveReload)(html) : html);
                                        return [2 /*return*/, true];
                                    }
                                    res.setHeader("Content-Type", mime);
                                    res.end(data);
                                    return [2 /*return*/, true];
                                case 11:
                                    err_2 = _c.sent();
                                    opts.runtime.error("canvasHost request failed: ".concat(String(err_2)));
                                    res.statusCode = 500;
                                    res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                    res.end("error");
                                    return [2 /*return*/, true];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, {
                            rootDir: rootDir,
                            basePath: basePath,
                            handleHttpRequest: handleHttpRequest,
                            handleUpgrade: handleUpgrade,
                            close: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (debounce) {
                                                clearTimeout(debounce);
                                            }
                                            watcherClosed = true;
                                            return [4 /*yield*/, (watcher === null || watcher === void 0 ? void 0 : watcher.close().catch(function () { }))];
                                        case 1:
                                            _a.sent();
                                            if (!wss) return [3 /*break*/, 3];
                                            return [4 /*yield*/, new Promise(function (resolve) { return wss.close(function () { return resolve(); }); })];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
function startCanvasHost(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var handler, _a, ownsHandler, bindHost, server, listenPort, addr, boundPort;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (isDisabledByEnv() && opts.allowInTests !== true) {
                        return [2 /*return*/, { port: 0, rootDir: "", close: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); } }];
                    }
                    if (!((_b = opts.handler) !== null && _b !== void 0)) return [3 /*break*/, 1];
                    _a = _b;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, createCanvasHostHandler({
                        runtime: opts.runtime,
                        rootDir: opts.rootDir,
                        basePath: a2ui_js_1.CANVAS_HOST_PATH,
                        allowInTests: opts.allowInTests,
                        liveReload: opts.liveReload,
                    })];
                case 2:
                    _a = (_e.sent());
                    _e.label = 3;
                case 3:
                    handler = _a;
                    ownsHandler = (_c = opts.ownsHandler) !== null && _c !== void 0 ? _c : opts.handler === undefined;
                    bindHost = ((_d = opts.listenHost) === null || _d === void 0 ? void 0 : _d.trim()) || "0.0.0.0";
                    server = node_http_1.default.createServer(function (req, res) {
                        var _a;
                        if (String((_a = req.headers.upgrade) !== null && _a !== void 0 ? _a : "").toLowerCase() === "websocket") {
                            return;
                        }
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, a2ui_js_1.handleA2uiHttpRequest)(req, res)];
                                    case 1:
                                        if (_a.sent()) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, handler.handleHttpRequest(req, res)];
                                    case 2:
                                        if (_a.sent()) {
                                            return [2 /*return*/];
                                        }
                                        res.statusCode = 404;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Not Found");
                                        return [2 /*return*/];
                                }
                            });
                        }); })().catch(function (err) {
                            opts.runtime.error("canvasHost request failed: ".concat(String(err)));
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "text/plain; charset=utf-8");
                            res.end("error");
                        });
                    });
                    server.on("upgrade", function (req, socket, head) {
                        if (handler.handleUpgrade(req, socket, head)) {
                            return;
                        }
                        socket.destroy();
                    });
                    listenPort = typeof opts.port === "number" && Number.isFinite(opts.port) && opts.port > 0 ? opts.port : 0;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var onError = function (err) {
                                server.off("listening", onListening);
                                reject(err);
                            };
                            var onListening = function () {
                                server.off("error", onError);
                                resolve();
                            };
                            server.once("error", onError);
                            server.once("listening", onListening);
                            server.listen(listenPort, bindHost);
                        })];
                case 4:
                    _e.sent();
                    addr = server.address();
                    boundPort = typeof addr === "object" && addr ? addr.port : 0;
                    opts.runtime.log("canvas host listening on http://".concat(bindHost, ":").concat(boundPort, " (root ").concat(handler.rootDir, ")"));
                    return [2 /*return*/, {
                            port: boundPort,
                            rootDir: handler.rootDir,
                            close: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!ownsHandler) return [3 /*break*/, 2];
                                            return [4 /*yield*/, handler.close()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                return server.close(function (err) { return (err ? reject(err) : resolve()); });
                                            })];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
