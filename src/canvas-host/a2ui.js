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
exports.CANVAS_WS_PATH = exports.CANVAS_HOST_PATH = exports.A2UI_PATH = void 0;
exports.injectCanvasLiveReload = injectCanvasLiveReload;
exports.handleA2uiHttpRequest = handleA2uiHttpRequest;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var mime_js_1 = require("../media/mime.js");
exports.A2UI_PATH = "/__openclaw__/a2ui";
exports.CANVAS_HOST_PATH = "/__openclaw__/canvas";
exports.CANVAS_WS_PATH = "/__openclaw__/ws";
var cachedA2uiRootReal;
var resolvingA2uiRoot = null;
function resolveA2uiRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var here, candidates, _i, candidates_1, dir, indexPath, bundlePath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    here = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
                    candidates = [
                        // Running from source (bun) or dist (tsc + copied assets).
                        node_path_1.default.resolve(here, "a2ui"),
                        // Running from dist without copied assets (fallback to source).
                        node_path_1.default.resolve(here, "../../src/canvas-host/a2ui"),
                        // Running from repo root.
                        node_path_1.default.resolve(process.cwd(), "src/canvas-host/a2ui"),
                        node_path_1.default.resolve(process.cwd(), "dist/canvas-host/a2ui"),
                    ];
                    if (process.execPath) {
                        candidates.unshift(node_path_1.default.resolve(node_path_1.default.dirname(process.execPath), "a2ui"));
                    }
                    _i = 0, candidates_1 = candidates;
                    _b.label = 1;
                case 1:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 7];
                    dir = candidates_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    indexPath = node_path_1.default.join(dir, "index.html");
                    bundlePath = node_path_1.default.join(dir, "a2ui.bundle.js");
                    return [4 /*yield*/, promises_1.default.stat(indexPath)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.stat(bundlePath)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, dir];
                case 5:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, null];
            }
        });
    });
}
function resolveA2uiRootReal() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (cachedA2uiRootReal !== undefined) {
                return [2 /*return*/, cachedA2uiRootReal];
            }
            if (!resolvingA2uiRoot) {
                resolvingA2uiRoot = (function () { return __awaiter(_this, void 0, void 0, function () {
                    var root, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, resolveA2uiRoot()];
                            case 1:
                                root = _b.sent();
                                if (!root) return [3 /*break*/, 3];
                                return [4 /*yield*/, promises_1.default.realpath(root)];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = null;
                                _b.label = 4;
                            case 4:
                                cachedA2uiRootReal = _a;
                                return [2 /*return*/, cachedA2uiRootReal];
                        }
                    });
                }); })();
            }
            return [2 /*return*/, resolvingA2uiRoot];
        });
    });
}
function normalizeUrlPath(rawPath) {
    var decoded = decodeURIComponent(rawPath || "/");
    var normalized = node_path_1.default.posix.normalize(decoded);
    return normalized.startsWith("/") ? normalized : "/".concat(normalized);
}
function resolveA2uiFilePath(rootReal, urlPath) {
    return __awaiter(this, void 0, void 0, function () {
        var normalized, rel, candidate, st, _a, rootPrefix, lstat, real, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    normalized = normalizeUrlPath(urlPath);
                    rel = normalized.replace(/^\/+/, "");
                    if (rel.split("/").some(function (p) { return p === ".."; })) {
                        return [2 /*return*/, null];
                    }
                    candidate = node_path_1.default.join(rootReal, rel);
                    if (normalized.endsWith("/")) {
                        candidate = node_path_1.default.join(candidate, "index.html");
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.stat(candidate)];
                case 2:
                    st = _c.sent();
                    if (st.isDirectory()) {
                        candidate = node_path_1.default.join(candidate, "index.html");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 4:
                    rootPrefix = rootReal.endsWith(node_path_1.default.sep) ? rootReal : "".concat(rootReal).concat(node_path_1.default.sep);
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.lstat(candidate)];
                case 6:
                    lstat = _c.sent();
                    if (lstat.isSymbolicLink()) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, promises_1.default.realpath(candidate)];
                case 7:
                    real = _c.sent();
                    if (!real.startsWith(rootPrefix)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, real];
                case 8:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function injectCanvasLiveReload(html) {
    var snippet = "\n<script>\n(() => {\n  // Cross-platform action bridge helper.\n  // Works on:\n  // - iOS: window.webkit.messageHandlers.openclawCanvasA2UIAction.postMessage(...)\n  // - Android: window.openclawCanvasA2UIAction.postMessage(...)\n  const handlerNames = [\"openclawCanvasA2UIAction\"];\n  function postToNode(payload) {\n    try {\n      const raw = typeof payload === \"string\" ? payload : JSON.stringify(payload);\n      for (const name of handlerNames) {\n        const iosHandler = globalThis.webkit?.messageHandlers?.[name];\n        if (iosHandler && typeof iosHandler.postMessage === \"function\") {\n          iosHandler.postMessage(raw);\n          return true;\n        }\n        const androidHandler = globalThis[name];\n        if (androidHandler && typeof androidHandler.postMessage === \"function\") {\n          // Important: call as a method on the interface object (binding matters on Android WebView).\n          androidHandler.postMessage(raw);\n          return true;\n        }\n      }\n    } catch {}\n    return false;\n  }\n  function sendUserAction(userAction) {\n    const id =\n      (userAction && typeof userAction.id === \"string\" && userAction.id.trim()) ||\n      (globalThis.crypto?.randomUUID?.() ?? String(Date.now()));\n    const action = { ...userAction, id };\n    return postToNode({ userAction: action });\n  }\n  globalThis.OpenClaw = globalThis.OpenClaw ?? {};\n  globalThis.OpenClaw.postMessage = postToNode;\n  globalThis.OpenClaw.sendUserAction = sendUserAction;\n  globalThis.openclawPostMessage = postToNode;\n  globalThis.openclawSendUserAction = sendUserAction;\n\n  try {\n    const proto = location.protocol === \"https:\" ? \"wss\" : \"ws\";\n    const ws = new WebSocket(proto + \"://\" + location.host + ".concat(JSON.stringify(exports.CANVAS_WS_PATH), ");\n    ws.onmessage = (ev) => {\n      if (String(ev.data || \"\") === \"reload\") location.reload();\n    };\n  } catch {}\n})();\n</script>\n").trim();
    var idx = html.toLowerCase().lastIndexOf("</body>");
    if (idx >= 0) {
        return "".concat(html.slice(0, idx), "\n").concat(snippet, "\n").concat(html.slice(idx));
    }
    return "".concat(html, "\n").concat(snippet, "\n");
}
function handleA2uiHttpRequest(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var urlRaw, url, basePath, a2uiRootReal, rel, filePath, lower, mime, _a, html, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    urlRaw = req.url;
                    if (!urlRaw) {
                        return [2 /*return*/, false];
                    }
                    url = new URL(urlRaw, "http://localhost");
                    basePath = url.pathname === exports.A2UI_PATH || url.pathname.startsWith("".concat(exports.A2UI_PATH, "/")) ? exports.A2UI_PATH : undefined;
                    if (!basePath) {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "GET" && req.method !== "HEAD") {
                        res.statusCode = 405;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Method Not Allowed");
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, resolveA2uiRootReal()];
                case 1:
                    a2uiRootReal = _e.sent();
                    if (!a2uiRootReal) {
                        res.statusCode = 503;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("A2UI assets not found");
                        return [2 /*return*/, true];
                    }
                    rel = url.pathname.slice(basePath.length);
                    return [4 /*yield*/, resolveA2uiFilePath(a2uiRootReal, rel || "/")];
                case 2:
                    filePath = _e.sent();
                    if (!filePath) {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("not found");
                        return [2 /*return*/, true];
                    }
                    lower = filePath.toLowerCase();
                    if (!(lower.endsWith(".html") || lower.endsWith(".htm"))) return [3 /*break*/, 3];
                    _a = "text/html";
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, mime_js_1.detectMime)({ filePath: filePath })];
                case 4:
                    _a = ((_d = (_e.sent())) !== null && _d !== void 0 ? _d : "application/octet-stream");
                    _e.label = 5;
                case 5:
                    mime = _a;
                    res.setHeader("Cache-Control", "no-store");
                    if (!(mime === "text/html")) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8")];
                case 6:
                    html = _e.sent();
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    res.end(injectCanvasLiveReload(html));
                    return [2 /*return*/, true];
                case 7:
                    res.setHeader("Content-Type", mime);
                    _c = (_b = res).end;
                    return [4 /*yield*/, promises_1.default.readFile(filePath)];
                case 8:
                    _c.apply(_b, [_e.sent()]);
                    return [2 /*return*/, true];
            }
        });
    });
}
