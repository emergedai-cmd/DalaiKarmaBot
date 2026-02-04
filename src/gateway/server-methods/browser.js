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
exports.browserHandlers = void 0;
var node_crypto_1 = require("node:crypto");
var control_service_js_1 = require("../../browser/control-service.js");
var dispatcher_js_1 = require("../../browser/routes/dispatcher.js");
var config_js_1 = require("../../config/config.js");
var store_js_1 = require("../../media/store.js");
var node_command_policy_js_1 = require("../node-command-policy.js");
var index_js_1 = require("../protocol/index.js");
var nodes_helpers_js_1 = require("./nodes.helpers.js");
function isBrowserNode(node) {
    var caps = Array.isArray(node.caps) ? node.caps : [];
    var commands = Array.isArray(node.commands) ? node.commands : [];
    return caps.includes("browser") || commands.includes("browser.proxy");
}
function normalizeNodeKey(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}
function resolveBrowserNode(nodes, query) {
    var _a;
    var q = query.trim();
    if (!q) {
        return null;
    }
    var qNorm = normalizeNodeKey(q);
    var matches = nodes.filter(function (node) {
        if (node.nodeId === q) {
            return true;
        }
        if (typeof node.remoteIp === "string" && node.remoteIp === q) {
            return true;
        }
        var name = typeof node.displayName === "string" ? node.displayName : "";
        if (name && normalizeNodeKey(name) === qNorm) {
            return true;
        }
        if (q.length >= 6 && node.nodeId.startsWith(q)) {
            return true;
        }
        return false;
    });
    if (matches.length === 1) {
        return (_a = matches[0]) !== null && _a !== void 0 ? _a : null;
    }
    if (matches.length === 0) {
        return null;
    }
    throw new Error("ambiguous node: ".concat(q, " (matches: ").concat(matches
        .map(function (node) { return node.displayName || node.remoteIp || node.nodeId; })
        .join(", "), ")"));
}
function resolveBrowserNodeTarget(params) {
    var _a, _b, _c, _d, _e, _f;
    var policy = (_b = (_a = params.cfg.gateway) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.browser;
    var mode = (_c = policy === null || policy === void 0 ? void 0 : policy.mode) !== null && _c !== void 0 ? _c : "auto";
    if (mode === "off") {
        return null;
    }
    var browserNodes = params.nodes.filter(function (node) { return isBrowserNode(node); });
    if (browserNodes.length === 0) {
        if ((_d = policy === null || policy === void 0 ? void 0 : policy.node) === null || _d === void 0 ? void 0 : _d.trim()) {
            throw new Error("No connected browser-capable nodes.");
        }
        return null;
    }
    var requested = ((_e = policy === null || policy === void 0 ? void 0 : policy.node) === null || _e === void 0 ? void 0 : _e.trim()) || "";
    if (requested) {
        var resolved = resolveBrowserNode(browserNodes, requested);
        if (!resolved) {
            throw new Error("Configured browser node not connected: ".concat(requested));
        }
        return resolved;
    }
    if (mode === "manual") {
        return null;
    }
    if (browserNodes.length === 1) {
        return (_f = browserNodes[0]) !== null && _f !== void 0 ? _f : null;
    }
    return null;
}
function persistProxyFiles(files) {
    return __awaiter(this, void 0, void 0, function () {
        var mapping, _i, files_1, file, buffer, saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!files || files.length === 0) {
                        return [2 /*return*/, new Map()];
                    }
                    mapping = new Map();
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                    file = files_1[_i];
                    buffer = Buffer.from(file.base64, "base64");
                    return [4 /*yield*/, (0, store_js_1.saveMediaBuffer)(buffer, file.mimeType, "browser", buffer.byteLength)];
                case 2:
                    saved = _a.sent();
                    mapping.set(file.path, saved.path);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, mapping];
            }
        });
    });
}
function applyProxyPaths(result, mapping) {
    if (!result || typeof result !== "object") {
        return;
    }
    var obj = result;
    if (typeof obj.path === "string" && mapping.has(obj.path)) {
        obj.path = mapping.get(obj.path);
    }
    if (typeof obj.imagePath === "string" && mapping.has(obj.imagePath)) {
        obj.imagePath = mapping.get(obj.imagePath);
    }
    var download = obj.download;
    if (download && typeof download === "object") {
        var d = download;
        if (typeof d.path === "string" && mapping.has(d.path)) {
            d.path = mapping.get(d.path);
        }
    }
}
exports.browserHandlers = {
    "browser.request": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var typed, methodRaw, path, query, body, timeoutMs, cfg, nodeTarget, allowlist, allowed, proxyParams, res, payload, proxy, mapping, ready, dispatcher, result, message, code;
        var _c, _d, _e;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    typed = params;
                    methodRaw = typeof typed.method === "string" ? typed.method.trim().toUpperCase() : "";
                    path = typeof typed.path === "string" ? typed.path.trim() : "";
                    query = typed.query && typeof typed.query === "object" ? typed.query : undefined;
                    body = typed.body;
                    timeoutMs = typeof typed.timeoutMs === "number" && Number.isFinite(typed.timeoutMs)
                        ? Math.max(1, Math.floor(typed.timeoutMs))
                        : undefined;
                    if (!methodRaw || !path) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "method and path are required"));
                        return [2 /*return*/];
                    }
                    if (methodRaw !== "GET" && methodRaw !== "POST" && methodRaw !== "DELETE") {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "method must be GET, POST, or DELETE"));
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    nodeTarget = null;
                    try {
                        nodeTarget = resolveBrowserNodeTarget({
                            cfg: cfg,
                            nodes: context.nodeRegistry.listConnected(),
                        });
                    }
                    catch (err) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, String(err)));
                        return [2 /*return*/];
                    }
                    if (!nodeTarget) return [3 /*break*/, 3];
                    allowlist = (0, node_command_policy_js_1.resolveNodeCommandAllowlist)(cfg, nodeTarget);
                    allowed = (0, node_command_policy_js_1.isNodeCommandAllowed)({
                        command: "browser.proxy",
                        declaredCommands: nodeTarget.commands,
                        allowlist: allowlist,
                    });
                    if (!allowed.ok) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "node command not allowed", {
                            details: { reason: allowed.reason, command: "browser.proxy" },
                        }));
                        return [2 /*return*/];
                    }
                    proxyParams = {
                        method: methodRaw,
                        path: path,
                        query: query,
                        body: body,
                        timeoutMs: timeoutMs,
                        profile: typeof (query === null || query === void 0 ? void 0 : query.profile) === "string" ? query.profile : undefined,
                    };
                    return [4 /*yield*/, context.nodeRegistry.invoke({
                            nodeId: nodeTarget.nodeId,
                            command: "browser.proxy",
                            params: proxyParams,
                            timeoutMs: timeoutMs,
                            idempotencyKey: node_crypto_1.default.randomUUID(),
                        })];
                case 1:
                    res = _f.sent();
                    if (!res.ok) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (_d = (_c = res.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "node invoke failed", {
                            details: { nodeError: (_e = res.error) !== null && _e !== void 0 ? _e : null },
                        }));
                        return [2 /*return*/];
                    }
                    payload = res.payloadJSON ? (0, nodes_helpers_js_1.safeParseJson)(res.payloadJSON) : res.payload;
                    proxy = payload && typeof payload === "object" ? payload : null;
                    if (!proxy || !("result" in proxy)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "browser proxy failed"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, persistProxyFiles(proxy.files)];
                case 2:
                    mapping = _f.sent();
                    applyProxyPaths(proxy.result, mapping);
                    respond(true, proxy.result);
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, control_service_js_1.startBrowserControlServiceFromConfig)()];
                case 4:
                    ready = _f.sent();
                    if (!ready) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "browser control is disabled"));
                        return [2 /*return*/];
                    }
                    try {
                        dispatcher = (0, dispatcher_js_1.createBrowserRouteDispatcher)((0, control_service_js_1.createBrowserControlContext)());
                    }
                    catch (err) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, String(err)));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, dispatcher.dispatch({
                            method: methodRaw,
                            path: path,
                            query: query,
                            body: body,
                        })];
                case 5:
                    result = _f.sent();
                    if (result.status >= 400) {
                        message = result.body && typeof result.body === "object" && "error" in result.body
                            ? String(result.body.error)
                            : "browser request failed (".concat(result.status, ")");
                        code = result.status >= 500 ? index_js_1.ErrorCodes.UNAVAILABLE : index_js_1.ErrorCodes.INVALID_REQUEST;
                        respond(false, undefined, (0, index_js_1.errorShape)(code, message, { details: result.body }));
                        return [2 /*return*/];
                    }
                    respond(true, result.body);
                    return [2 /*return*/];
            }
        });
    }); },
};
