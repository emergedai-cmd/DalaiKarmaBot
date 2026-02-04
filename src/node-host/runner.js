"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNodeHost = runNodeHost;
exports.buildNodeInvokeResultParams = buildNodeInvokeResultParams;
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../browser/config.js");
var control_service_js_1 = require("../browser/control-service.js");
var dispatcher_js_1 = require("../browser/routes/dispatcher.js");
var config_js_2 = require("../config/config.js");
var client_js_1 = require("../gateway/client.js");
var device_identity_js_1 = require("../infra/device-identity.js");
var exec_approvals_js_1 = require("../infra/exec-approvals.js");
var exec_host_js_1 = require("../infra/exec-host.js");
var machine_name_js_1 = require("../infra/machine-name.js");
var path_env_js_1 = require("../infra/path-env.js");
var mime_js_1 = require("../media/mime.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var version_js_1 = require("../version.js");
var config_js_3 = require("./config.js");
function resolveExecSecurity(value) {
    return value === "deny" || value === "allowlist" || value === "full" ? value : "allowlist";
}
function resolveExecAsk(value) {
    return value === "off" || value === "on-miss" || value === "always" ? value : "on-miss";
}
var OUTPUT_CAP = 200000;
var OUTPUT_EVENT_TAIL = 20000;
var DEFAULT_NODE_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
var BROWSER_PROXY_MAX_FILE_BYTES = 10 * 1024 * 1024;
var execHostEnforced = ((_a = process.env.OPENCLAW_NODE_EXEC_HOST) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === "app";
var execHostFallbackAllowed = ((_b = process.env.OPENCLAW_NODE_EXEC_FALLBACK) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) !== "0";
var blockedEnvKeys = new Set([
    "NODE_OPTIONS",
    "PYTHONHOME",
    "PYTHONPATH",
    "PERL5LIB",
    "PERL5OPT",
    "RUBYOPT",
]);
var blockedEnvPrefixes = ["DYLD_", "LD_"];
var SkillBinsCache = /** @class */ (function () {
    function SkillBinsCache(fetch) {
        this.bins = new Set();
        this.lastRefresh = 0;
        this.ttlMs = 90000;
        this.fetch = fetch;
    }
    SkillBinsCache.prototype.current = function () {
        return __awaiter(this, arguments, void 0, function (force) {
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(force || Date.now() - this.lastRefresh > this.ttlMs)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refresh()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.bins];
                }
            });
        });
    };
    SkillBinsCache.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bins, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetch()];
                    case 1:
                        bins = _b.sent();
                        this.bins = new Set(bins);
                        this.lastRefresh = Date.now();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        if (!this.lastRefresh) {
                            this.bins = new Set();
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SkillBinsCache;
}());
function sanitizeEnv(overrides) {
    var _a;
    if (!overrides) {
        return undefined;
    }
    var merged = __assign({}, process.env);
    var basePath = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : DEFAULT_NODE_PATH;
    var _loop_1 = function (rawKey, value) {
        var key = rawKey.trim();
        if (!key) {
            return "continue";
        }
        var upper = key.toUpperCase();
        if (upper === "PATH") {
            var trimmed = value.trim();
            if (!trimmed) {
                return "continue";
            }
            if (!basePath || trimmed === basePath) {
                merged[key] = trimmed;
                return "continue";
            }
            var suffix = "".concat(node_path_1.default.delimiter).concat(basePath);
            if (trimmed.endsWith(suffix)) {
                merged[key] = trimmed;
            }
            return "continue";
        }
        if (blockedEnvKeys.has(upper)) {
            return "continue";
        }
        if (blockedEnvPrefixes.some(function (prefix) { return upper.startsWith(prefix); })) {
            return "continue";
        }
        merged[key] = value;
    };
    for (var _i = 0, _b = Object.entries(overrides); _i < _b.length; _i++) {
        var _c = _b[_i], rawKey = _c[0], value = _c[1];
        _loop_1(rawKey, value);
    }
    return merged;
}
function normalizeProfileAllowlist(raw) {
    return Array.isArray(raw) ? raw.map(function (entry) { return entry.trim(); }).filter(Boolean) : [];
}
function resolveBrowserProxyConfig() {
    var _a;
    var cfg = (0, config_js_2.loadConfig)();
    var proxy = (_a = cfg.nodeHost) === null || _a === void 0 ? void 0 : _a.browserProxy;
    var allowProfiles = normalizeProfileAllowlist(proxy === null || proxy === void 0 ? void 0 : proxy.allowProfiles);
    var enabled = (proxy === null || proxy === void 0 ? void 0 : proxy.enabled) !== false;
    return { enabled: enabled, allowProfiles: allowProfiles };
}
var browserControlReady = null;
function ensureBrowserControlService() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (browserControlReady) {
                return [2 /*return*/, browserControlReady];
            }
            browserControlReady = (function () { return __awaiter(_this, void 0, void 0, function () {
                var cfg, resolved, started;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cfg = (0, config_js_2.loadConfig)();
                            resolved = (0, config_js_1.resolveBrowserConfig)(cfg.browser, cfg);
                            if (!resolved.enabled) {
                                throw new Error("browser control disabled");
                            }
                            return [4 /*yield*/, (0, control_service_js_1.startBrowserControlServiceFromConfig)()];
                        case 1:
                            started = _a.sent();
                            if (!started) {
                                throw new Error("browser control disabled");
                            }
                            return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/, browserControlReady];
        });
    });
}
function withTimeout(promise, timeoutMs, label) {
    return __awaiter(this, void 0, void 0, function () {
        var resolved, timer, timeoutPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
                        ? Math.max(1, Math.floor(timeoutMs))
                        : undefined;
                    if (!!resolved) return [3 /*break*/, 2];
                    return [4 /*yield*/, promise];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    timeoutPromise = new Promise(function (_, reject) {
                        timer = setTimeout(function () {
                            reject(new Error("".concat(label !== null && label !== void 0 ? label : "request", " timed out")));
                        }, resolved);
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    return [4 /*yield*/, Promise.race([promise, timeoutPromise])];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    if (timer) {
                        clearTimeout(timer);
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function isProfileAllowed(params) {
    var allowProfiles = params.allowProfiles, profile = params.profile;
    if (!allowProfiles.length) {
        return true;
    }
    if (!profile) {
        return false;
    }
    return allowProfiles.includes(profile.trim());
}
function collectBrowserProxyPaths(payload) {
    var paths = new Set();
    var obj = typeof payload === "object" && payload !== null ? payload : null;
    if (!obj) {
        return [];
    }
    if (typeof obj.path === "string" && obj.path.trim()) {
        paths.add(obj.path.trim());
    }
    if (typeof obj.imagePath === "string" && obj.imagePath.trim()) {
        paths.add(obj.imagePath.trim());
    }
    var download = obj.download;
    if (download && typeof download === "object") {
        var dlPath = download.path;
        if (typeof dlPath === "string" && dlPath.trim()) {
            paths.add(dlPath.trim());
        }
    }
    return __spreadArray([], paths, true);
}
function readBrowserProxyFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, buffer, mimeType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.stat(filePath).catch(function () { return null; })];
                case 1:
                    stat = _a.sent();
                    if (!stat || !stat.isFile()) {
                        return [2 /*return*/, null];
                    }
                    if (stat.size > BROWSER_PROXY_MAX_FILE_BYTES) {
                        throw new Error("browser proxy file exceeds ".concat(Math.round(BROWSER_PROXY_MAX_FILE_BYTES / (1024 * 1024)), "MB"));
                    }
                    return [4 /*yield*/, promises_1.default.readFile(filePath)];
                case 2:
                    buffer = _a.sent();
                    return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: buffer, filePath: filePath })];
                case 3:
                    mimeType = _a.sent();
                    return [2 /*return*/, { path: filePath, base64: buffer.toString("base64"), mimeType: mimeType }];
            }
        });
    });
}
function formatCommand(argv) {
    return argv
        .map(function (arg) {
        var trimmed = arg.trim();
        if (!trimmed) {
            return '""';
        }
        var needsQuotes = /\s|"/.test(trimmed);
        if (!needsQuotes) {
            return trimmed;
        }
        return "\"".concat(trimmed.replace(/"/g, '\\"'), "\"");
    })
        .join(" ");
}
function truncateOutput(raw, maxChars) {
    if (raw.length <= maxChars) {
        return { text: raw, truncated: false };
    }
    return { text: "... (truncated) ".concat(raw.slice(raw.length - maxChars)), truncated: true };
}
function redactExecApprovals(file) {
    var _a, _b;
    var socketPath = (_b = (_a = file.socket) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.trim();
    return __assign(__assign({}, file), { socket: socketPath ? { path: socketPath } : undefined });
}
function requireExecApprovalsBaseHash(params, snapshot) {
    if (!snapshot.exists) {
        return;
    }
    if (!snapshot.hash) {
        throw new Error("INVALID_REQUEST: exec approvals base hash unavailable; reload and retry");
    }
    var baseHash = typeof params.baseHash === "string" ? params.baseHash.trim() : "";
    if (!baseHash) {
        throw new Error("INVALID_REQUEST: exec approvals base hash required; reload and retry");
    }
    if (baseHash !== snapshot.hash) {
        throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
    }
}
function runCommand(argv, cwd, env, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        var _a, _b;
                        var stdout = "";
                        var stderr = "";
                        var outputLen = 0;
                        var truncated = false;
                        var timedOut = false;
                        var settled = false;
                        var child = (0, node_child_process_1.spawn)(argv[0], argv.slice(1), {
                            cwd: cwd,
                            env: env,
                            stdio: ["ignore", "pipe", "pipe"],
                            windowsHide: true,
                        });
                        var onChunk = function (chunk, target) {
                            if (outputLen >= OUTPUT_CAP) {
                                truncated = true;
                                return;
                            }
                            var remaining = OUTPUT_CAP - outputLen;
                            var slice = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk;
                            var str = slice.toString("utf8");
                            outputLen += slice.length;
                            if (target === "stdout") {
                                stdout += str;
                            }
                            else {
                                stderr += str;
                            }
                            if (chunk.length > remaining) {
                                truncated = true;
                            }
                        };
                        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (chunk) { return onChunk(chunk, "stdout"); });
                        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", function (chunk) { return onChunk(chunk, "stderr"); });
                        var timer;
                        if (timeoutMs && timeoutMs > 0) {
                            timer = setTimeout(function () {
                                timedOut = true;
                                try {
                                    child.kill("SIGKILL");
                                }
                                catch (_a) {
                                    // ignore
                                }
                            }, timeoutMs);
                        }
                        var finalize = function (exitCode, error) {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            if (timer) {
                                clearTimeout(timer);
                            }
                            resolve({
                                exitCode: exitCode,
                                timedOut: timedOut,
                                success: exitCode === 0 && !timedOut && !error,
                                stdout: stdout,
                                stderr: stderr,
                                error: error !== null && error !== void 0 ? error : null,
                                truncated: truncated,
                            });
                        };
                        child.on("error", function (err) {
                            finalize(undefined, err.message);
                        });
                        child.on("exit", function (code) {
                            finalize(code === null ? undefined : code, null);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function resolveEnvPath(env) {
    var _a, _b, _c, _d;
    var raw = (_d = (_c = (_b = (_a = env === null || env === void 0 ? void 0 : env.PATH) !== null && _a !== void 0 ? _a : env === null || env === void 0 ? void 0 : env.Path) !== null && _b !== void 0 ? _b : process.env.PATH) !== null && _c !== void 0 ? _c : process.env.Path) !== null && _d !== void 0 ? _d : DEFAULT_NODE_PATH;
    return raw.split(node_path_1.default.delimiter).filter(Boolean);
}
function ensureNodePathEnv() {
    var _a, _b;
    (0, path_env_js_1.ensureOpenClawCliOnPath)({ pathEnv: (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "" });
    var current = (_b = process.env.PATH) !== null && _b !== void 0 ? _b : "";
    if (current.trim()) {
        return current;
    }
    process.env.PATH = DEFAULT_NODE_PATH;
    return DEFAULT_NODE_PATH;
}
function resolveExecutable(bin, env) {
    var _a, _b;
    if (bin.includes("/") || bin.includes("\\")) {
        return null;
    }
    var extensions = process.platform === "win32"
        ? ((_b = (_a = process.env.PATHEXT) !== null && _a !== void 0 ? _a : process.env.PathExt) !== null && _b !== void 0 ? _b : ".EXE;.CMD;.BAT;.COM")
            .split(";")
            .map(function (ext) { return ext.toLowerCase(); })
        : [""];
    for (var _i = 0, _c = resolveEnvPath(env); _i < _c.length; _i++) {
        var dir = _c[_i];
        for (var _d = 0, extensions_1 = extensions; _d < extensions_1.length; _d++) {
            var ext = extensions_1[_d];
            var candidate = node_path_1.default.join(dir, bin + ext);
            if (node_fs_1.default.existsSync(candidate)) {
                return candidate;
            }
        }
    }
    return null;
}
function handleSystemWhich(params, env) {
    return __awaiter(this, void 0, void 0, function () {
        var bins, found, _i, bins_1, bin, path_1;
        return __generator(this, function (_a) {
            bins = params.bins.map(function (bin) { return bin.trim(); }).filter(Boolean);
            found = {};
            for (_i = 0, bins_1 = bins; _i < bins_1.length; _i++) {
                bin = bins_1[_i];
                path_1 = resolveExecutable(bin, env);
                if (path_1) {
                    found[bin] = path_1;
                }
            }
            return [2 /*return*/, { bins: found }];
        });
    });
}
function buildExecEventPayload(payload) {
    if (!payload.output) {
        return payload;
    }
    var trimmed = payload.output.trim();
    if (!trimmed) {
        return payload;
    }
    var text = truncateOutput(trimmed, OUTPUT_EVENT_TAIL).text;
    return __assign(__assign({}, payload), { output: text });
}
function runViaMacAppExecHost(params) {
    return __awaiter(this, void 0, void 0, function () {
        var approvals, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    approvals = params.approvals, request = params.request;
                    return [4 /*yield*/, (0, exec_host_js_1.requestExecHostViaSocket)({
                            socketPath: approvals.socketPath,
                            token: approvals.token,
                            request: request,
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function runNodeHost(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var config, nodeId, displayName, _a, gateway, cfg, browserProxy, resolvedBrowser, browserProxyEnabled, isRemoteMode, token, password, host, port, scheme, url, pathEnv, client, skillBins;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, config_js_3.ensureNodeHostConfig)()];
                case 1:
                    config = _w.sent();
                    nodeId = ((_b = opts.nodeId) === null || _b === void 0 ? void 0 : _b.trim()) || config.nodeId;
                    if (nodeId !== config.nodeId) {
                        config.nodeId = nodeId;
                    }
                    _a = ((_c = opts.displayName) === null || _c === void 0 ? void 0 : _c.trim()) || config.displayName;
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, machine_name_js_1.getMachineDisplayName)()];
                case 2:
                    _a = (_w.sent());
                    _w.label = 3;
                case 3:
                    displayName = _a;
                    config.displayName = displayName;
                    gateway = {
                        host: opts.gatewayHost,
                        port: opts.gatewayPort,
                        tls: (_g = (_d = opts.gatewayTls) !== null && _d !== void 0 ? _d : (_f = (_e = (0, config_js_2.loadConfig)().gateway) === null || _e === void 0 ? void 0 : _e.tls) === null || _f === void 0 ? void 0 : _f.enabled) !== null && _g !== void 0 ? _g : false,
                        tlsFingerprint: opts.gatewayTlsFingerprint,
                    };
                    config.gateway = gateway;
                    return [4 /*yield*/, (0, config_js_3.saveNodeHostConfig)(config)];
                case 4:
                    _w.sent();
                    cfg = (0, config_js_2.loadConfig)();
                    browserProxy = resolveBrowserProxyConfig();
                    resolvedBrowser = (0, config_js_1.resolveBrowserConfig)(cfg.browser, cfg);
                    browserProxyEnabled = browserProxy.enabled && resolvedBrowser.enabled;
                    isRemoteMode = ((_h = cfg.gateway) === null || _h === void 0 ? void 0 : _h.mode) === "remote";
                    token = ((_j = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _j === void 0 ? void 0 : _j.trim()) ||
                        (isRemoteMode ? (_l = (_k = cfg.gateway) === null || _k === void 0 ? void 0 : _k.remote) === null || _l === void 0 ? void 0 : _l.token : (_o = (_m = cfg.gateway) === null || _m === void 0 ? void 0 : _m.auth) === null || _o === void 0 ? void 0 : _o.token);
                    password = ((_p = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _p === void 0 ? void 0 : _p.trim()) ||
                        (isRemoteMode ? (_r = (_q = cfg.gateway) === null || _q === void 0 ? void 0 : _q.remote) === null || _r === void 0 ? void 0 : _r.password : (_t = (_s = cfg.gateway) === null || _s === void 0 ? void 0 : _s.auth) === null || _t === void 0 ? void 0 : _t.password);
                    host = (_u = gateway.host) !== null && _u !== void 0 ? _u : "127.0.0.1";
                    port = (_v = gateway.port) !== null && _v !== void 0 ? _v : 18789;
                    scheme = gateway.tls ? "wss" : "ws";
                    url = "".concat(scheme, "://").concat(host, ":").concat(port);
                    pathEnv = ensureNodePathEnv();
                    // eslint-disable-next-line no-console
                    console.log("node host PATH: ".concat(pathEnv));
                    client = new client_js_1.GatewayClient({
                        url: url,
                        token: (token === null || token === void 0 ? void 0 : token.trim()) || undefined,
                        password: (password === null || password === void 0 ? void 0 : password.trim()) || undefined,
                        instanceId: nodeId,
                        clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                        clientDisplayName: displayName,
                        clientVersion: version_js_1.VERSION,
                        platform: process.platform,
                        mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                        role: "node",
                        scopes: [],
                        caps: __spreadArray(["system"], (browserProxyEnabled ? ["browser"] : []), true),
                        commands: __spreadArray([
                            "system.run",
                            "system.which",
                            "system.execApprovals.get",
                            "system.execApprovals.set"
                        ], (browserProxyEnabled ? ["browser.proxy"] : []), true),
                        pathEnv: pathEnv,
                        permissions: undefined,
                        deviceIdentity: (0, device_identity_js_1.loadOrCreateDeviceIdentity)(),
                        tlsFingerprint: gateway.tlsFingerprint,
                        onEvent: function (evt) {
                            if (evt.event !== "node.invoke.request") {
                                return;
                            }
                            var payload = coerceNodeInvokePayload(evt.payload);
                            if (!payload) {
                                return;
                            }
                            void handleInvoke(payload, client, skillBins);
                        },
                        onConnectError: function (err) {
                            // keep retrying (handled by GatewayClient)
                            // eslint-disable-next-line no-console
                            console.error("node host gateway connect failed: ".concat(err.message));
                        },
                        onClose: function (code, reason) {
                            // eslint-disable-next-line no-console
                            console.error("node host gateway closed (".concat(code, "): ").concat(reason));
                        },
                    });
                    skillBins = new SkillBinsCache(function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, bins;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.request("skills.bins", {})];
                                case 1:
                                    res = _a.sent();
                                    bins = Array.isArray(res === null || res === void 0 ? void 0 : res.bins) ? res.bins.map(function (bin) { return String(bin); }) : [];
                                    return [2 /*return*/, bins];
                            }
                        });
                    }); });
                    client.start();
                    return [4 /*yield*/, new Promise(function () { })];
                case 5:
                    _w.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleInvoke(frame, client, skillBins) {
    return __awaiter(this, void 0, void 0, function () {
        var command, snapshot, payload, err_1, message, code, params_1, snapshot, normalized, currentSocketPath, currentToken, socketPath, token, next, nextSnapshot, payload, err_2, params_2, env_1, payload, err_3, params_3, pathValue, proxyConfig, cfg_1, resolved, requestedProfile, allowedProfiles_1, profileToCheck, method, path_2, body, query, rawQuery, _i, _a, _b, key, value, dispatcher, response, message, result_1, obj, profiles, files, paths, loaded, payload, err_4, params, err_5, argv, rawCommand, cmdText, agentId, cfg, agentExec, configuredSecurity, configuredAsk, approvals, security, ask, autoAllowSkills, sessionKey, runId, env, safeBins, bins, _c, analysisOk, allowlistMatches, allowlistSatisfied, segments, allowlistEval, analysis, allowlistEval, useMacAppExec, approvalDecision_1, execRequest, response, reason, result_2, combined_1, requiresAsk, approvalDecision, approvedByAsk, _d, segments_1, segment, pattern, seen, _e, allowlistMatches_1, match, result, suffix, combined;
        var _this = this;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24;
        return __generator(this, function (_25) {
            switch (_25.label) {
                case 0:
                    command = String((_f = frame.command) !== null && _f !== void 0 ? _f : "");
                    if (!(command === "system.execApprovals.get")) return [3 /*break*/, 6];
                    _25.label = 1;
                case 1:
                    _25.trys.push([1, 3, , 5]);
                    (0, exec_approvals_js_1.ensureExecApprovals)();
                    snapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
                    payload = {
                        path: snapshot.path,
                        exists: snapshot.exists,
                        hash: snapshot.hash,
                        file: redactExecApprovals(snapshot.file),
                    };
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify(payload),
                        })];
                case 2:
                    _25.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _25.sent();
                    message = String(err_1);
                    code = message.toLowerCase().includes("timed out") ? "TIMEOUT" : "INVALID_REQUEST";
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: code, message: message },
                        })];
                case 4:
                    _25.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
                case 6:
                    if (!(command === "system.execApprovals.set")) return [3 /*break*/, 12];
                    _25.label = 7;
                case 7:
                    _25.trys.push([7, 9, , 11]);
                    params_1 = decodeParams(frame.paramsJSON);
                    if (!params_1.file || typeof params_1.file !== "object") {
                        throw new Error("INVALID_REQUEST: exec approvals file required");
                    }
                    (0, exec_approvals_js_1.ensureExecApprovals)();
                    snapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
                    requireExecApprovalsBaseHash(params_1, snapshot);
                    normalized = (0, exec_approvals_js_1.normalizeExecApprovals)(params_1.file);
                    currentSocketPath = (_h = (_g = snapshot.file.socket) === null || _g === void 0 ? void 0 : _g.path) === null || _h === void 0 ? void 0 : _h.trim();
                    currentToken = (_k = (_j = snapshot.file.socket) === null || _j === void 0 ? void 0 : _j.token) === null || _k === void 0 ? void 0 : _k.trim();
                    socketPath = (_p = (_o = (_m = (_l = normalized.socket) === null || _l === void 0 ? void 0 : _l.path) === null || _m === void 0 ? void 0 : _m.trim()) !== null && _o !== void 0 ? _o : currentSocketPath) !== null && _p !== void 0 ? _p : (0, exec_approvals_js_1.resolveExecApprovalsSocketPath)();
                    token = (_t = (_s = (_r = (_q = normalized.socket) === null || _q === void 0 ? void 0 : _q.token) === null || _r === void 0 ? void 0 : _r.trim()) !== null && _s !== void 0 ? _s : currentToken) !== null && _t !== void 0 ? _t : "";
                    next = __assign(__assign({}, normalized), { socket: {
                            path: socketPath,
                            token: token,
                        } });
                    (0, exec_approvals_js_1.saveExecApprovals)(next);
                    nextSnapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
                    payload = {
                        path: nextSnapshot.path,
                        exists: nextSnapshot.exists,
                        hash: nextSnapshot.hash,
                        file: redactExecApprovals(nextSnapshot.file),
                    };
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify(payload),
                        })];
                case 8:
                    _25.sent();
                    return [3 /*break*/, 11];
                case 9:
                    err_2 = _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "INVALID_REQUEST", message: String(err_2) },
                        })];
                case 10:
                    _25.sent();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
                case 12:
                    if (!(command === "system.which")) return [3 /*break*/, 19];
                    _25.label = 13;
                case 13:
                    _25.trys.push([13, 16, , 18]);
                    params_2 = decodeParams(frame.paramsJSON);
                    if (!Array.isArray(params_2.bins)) {
                        throw new Error("INVALID_REQUEST: bins required");
                    }
                    env_1 = sanitizeEnv(undefined);
                    return [4 /*yield*/, handleSystemWhich(params_2, env_1)];
                case 14:
                    payload = _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify(payload),
                        })];
                case 15:
                    _25.sent();
                    return [3 /*break*/, 18];
                case 16:
                    err_3 = _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "INVALID_REQUEST", message: String(err_3) },
                        })];
                case 17:
                    _25.sent();
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
                case 19:
                    if (!(command === "browser.proxy")) return [3 /*break*/, 29];
                    _25.label = 20;
                case 20:
                    _25.trys.push([20, 26, , 28]);
                    params_3 = decodeParams(frame.paramsJSON);
                    pathValue = typeof params_3.path === "string" ? params_3.path.trim() : "";
                    if (!pathValue) {
                        throw new Error("INVALID_REQUEST: path required");
                    }
                    proxyConfig = resolveBrowserProxyConfig();
                    if (!proxyConfig.enabled) {
                        throw new Error("UNAVAILABLE: node browser proxy disabled");
                    }
                    return [4 /*yield*/, ensureBrowserControlService()];
                case 21:
                    _25.sent();
                    cfg_1 = (0, config_js_2.loadConfig)();
                    resolved = (0, config_js_1.resolveBrowserConfig)(cfg_1.browser, cfg_1);
                    requestedProfile = typeof params_3.profile === "string" ? params_3.profile.trim() : "";
                    allowedProfiles_1 = proxyConfig.allowProfiles;
                    if (allowedProfiles_1.length > 0) {
                        if (pathValue !== "/profiles") {
                            profileToCheck = requestedProfile || resolved.defaultProfile;
                            if (!isProfileAllowed({ allowProfiles: allowedProfiles_1, profile: profileToCheck })) {
                                throw new Error("INVALID_REQUEST: browser profile not allowed");
                            }
                        }
                        else if (requestedProfile) {
                            if (!isProfileAllowed({ allowProfiles: allowedProfiles_1, profile: requestedProfile })) {
                                throw new Error("INVALID_REQUEST: browser profile not allowed");
                            }
                        }
                    }
                    method = typeof params_3.method === "string" ? params_3.method.toUpperCase() : "GET";
                    path_2 = pathValue.startsWith("/") ? pathValue : "/".concat(pathValue);
                    body = params_3.body;
                    query = {};
                    if (requestedProfile) {
                        query.profile = requestedProfile;
                    }
                    rawQuery = (_u = params_3.query) !== null && _u !== void 0 ? _u : {};
                    for (_i = 0, _a = Object.entries(rawQuery); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        if (value === undefined || value === null) {
                            continue;
                        }
                        query[key] = typeof value === "string" ? value : String(value);
                    }
                    dispatcher = (0, dispatcher_js_1.createBrowserRouteDispatcher)((0, control_service_js_1.createBrowserControlContext)());
                    return [4 /*yield*/, withTimeout(dispatcher.dispatch({
                            method: method === "DELETE" ? "DELETE" : method === "POST" ? "POST" : "GET",
                            path: path_2,
                            query: query,
                            body: body,
                        }), params_3.timeoutMs, "browser proxy request")];
                case 22:
                    response = _25.sent();
                    if (response.status >= 400) {
                        message = response.body && typeof response.body === "object" && "error" in response.body
                            ? String(response.body.error)
                            : "HTTP ".concat(response.status);
                        throw new Error(message);
                    }
                    result_1 = response.body;
                    if (allowedProfiles_1.length > 0 && path_2 === "/profiles") {
                        obj = typeof result_1 === "object" && result_1 !== null ? result_1 : {};
                        profiles = Array.isArray(obj.profiles) ? obj.profiles : [];
                        obj.profiles = profiles.filter(function (entry) {
                            if (!entry || typeof entry !== "object") {
                                return false;
                            }
                            var name = entry.name;
                            return typeof name === "string" && allowedProfiles_1.includes(name);
                        });
                    }
                    files = void 0;
                    paths = collectBrowserProxyPaths(result_1);
                    if (!(paths.length > 0)) return [3 /*break*/, 24];
                    return [4 /*yield*/, Promise.all(paths.map(function (p) { return __awaiter(_this, void 0, void 0, function () {
                            var file, err_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, readBrowserProxyFile(p)];
                                    case 1:
                                        file = _a.sent();
                                        if (!file) {
                                            throw new Error("file not found");
                                        }
                                        return [2 /*return*/, file];
                                    case 2:
                                        err_6 = _a.sent();
                                        throw new Error("browser proxy file read failed for ".concat(p, ": ").concat(String(err_6)), {
                                            cause: err_6,
                                        });
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 23:
                    loaded = _25.sent();
                    if (loaded.length > 0) {
                        files = loaded;
                    }
                    _25.label = 24;
                case 24:
                    payload = files ? { result: result_1, files: files } : { result: result_1 };
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify(payload),
                        })];
                case 25:
                    _25.sent();
                    return [3 /*break*/, 28];
                case 26:
                    err_4 = _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "INVALID_REQUEST", message: String(err_4) },
                        })];
                case 27:
                    _25.sent();
                    return [3 /*break*/, 28];
                case 28: return [2 /*return*/];
                case 29:
                    if (!(command !== "system.run")) return [3 /*break*/, 31];
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: "command not supported" },
                        })];
                case 30:
                    _25.sent();
                    return [2 /*return*/];
                case 31:
                    _25.trys.push([31, 32, , 34]);
                    params = decodeParams(frame.paramsJSON);
                    return [3 /*break*/, 34];
                case 32:
                    err_5 = _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "INVALID_REQUEST", message: String(err_5) },
                        })];
                case 33:
                    _25.sent();
                    return [2 /*return*/];
                case 34:
                    if (!(!Array.isArray(params.command) || params.command.length === 0)) return [3 /*break*/, 36];
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "INVALID_REQUEST", message: "command required" },
                        })];
                case 35:
                    _25.sent();
                    return [2 /*return*/];
                case 36:
                    argv = params.command.map(function (item) { return String(item); });
                    rawCommand = typeof params.rawCommand === "string" ? params.rawCommand.trim() : "";
                    cmdText = rawCommand || formatCommand(argv);
                    agentId = ((_v = params.agentId) === null || _v === void 0 ? void 0 : _v.trim()) || undefined;
                    cfg = (0, config_js_2.loadConfig)();
                    agentExec = agentId ? (_x = (_w = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _w === void 0 ? void 0 : _w.tools) === null || _x === void 0 ? void 0 : _x.exec : undefined;
                    configuredSecurity = resolveExecSecurity((_y = agentExec === null || agentExec === void 0 ? void 0 : agentExec.security) !== null && _y !== void 0 ? _y : (_0 = (_z = cfg.tools) === null || _z === void 0 ? void 0 : _z.exec) === null || _0 === void 0 ? void 0 : _0.security);
                    configuredAsk = resolveExecAsk((_1 = agentExec === null || agentExec === void 0 ? void 0 : agentExec.ask) !== null && _1 !== void 0 ? _1 : (_3 = (_2 = cfg.tools) === null || _2 === void 0 ? void 0 : _2.exec) === null || _3 === void 0 ? void 0 : _3.ask);
                    approvals = (0, exec_approvals_js_1.resolveExecApprovals)(agentId, {
                        security: configuredSecurity,
                        ask: configuredAsk,
                    });
                    security = approvals.agent.security;
                    ask = approvals.agent.ask;
                    autoAllowSkills = approvals.agent.autoAllowSkills;
                    sessionKey = ((_4 = params.sessionKey) === null || _4 === void 0 ? void 0 : _4.trim()) || "node";
                    runId = ((_5 = params.runId) === null || _5 === void 0 ? void 0 : _5.trim()) || node_crypto_1.default.randomUUID();
                    env = sanitizeEnv((_6 = params.env) !== null && _6 !== void 0 ? _6 : undefined);
                    safeBins = (0, exec_approvals_js_1.resolveSafeBins)((_7 = agentExec === null || agentExec === void 0 ? void 0 : agentExec.safeBins) !== null && _7 !== void 0 ? _7 : (_9 = (_8 = cfg.tools) === null || _8 === void 0 ? void 0 : _8.exec) === null || _9 === void 0 ? void 0 : _9.safeBins);
                    if (!autoAllowSkills) return [3 /*break*/, 38];
                    return [4 /*yield*/, skillBins.current()];
                case 37:
                    _c = _25.sent();
                    return [3 /*break*/, 39];
                case 38:
                    _c = new Set();
                    _25.label = 39;
                case 39:
                    bins = _c;
                    analysisOk = false;
                    allowlistMatches = [];
                    allowlistSatisfied = false;
                    segments = [];
                    if (rawCommand) {
                        allowlistEval = (0, exec_approvals_js_1.evaluateShellAllowlist)({
                            command: rawCommand,
                            allowlist: approvals.allowlist,
                            safeBins: safeBins,
                            cwd: (_10 = params.cwd) !== null && _10 !== void 0 ? _10 : undefined,
                            env: env,
                            skillBins: bins,
                            autoAllowSkills: autoAllowSkills,
                        });
                        analysisOk = allowlistEval.analysisOk;
                        allowlistMatches = allowlistEval.allowlistMatches;
                        allowlistSatisfied =
                            security === "allowlist" && analysisOk ? allowlistEval.allowlistSatisfied : false;
                        segments = allowlistEval.segments;
                    }
                    else {
                        analysis = (0, exec_approvals_js_1.analyzeArgvCommand)({ argv: argv, cwd: (_11 = params.cwd) !== null && _11 !== void 0 ? _11 : undefined, env: env });
                        allowlistEval = (0, exec_approvals_js_1.evaluateExecAllowlist)({
                            analysis: analysis,
                            allowlist: approvals.allowlist,
                            safeBins: safeBins,
                            cwd: (_12 = params.cwd) !== null && _12 !== void 0 ? _12 : undefined,
                            skillBins: bins,
                            autoAllowSkills: autoAllowSkills,
                        });
                        analysisOk = analysis.ok;
                        allowlistMatches = allowlistEval.allowlistMatches;
                        allowlistSatisfied =
                            security === "allowlist" && analysisOk ? allowlistEval.allowlistSatisfied : false;
                        segments = analysis.segments;
                    }
                    useMacAppExec = process.platform === "darwin";
                    if (!useMacAppExec) return [3 /*break*/, 50];
                    approvalDecision_1 = params.approvalDecision === "allow-once" || params.approvalDecision === "allow-always"
                        ? params.approvalDecision
                        : null;
                    execRequest = {
                        command: argv,
                        rawCommand: rawCommand || null,
                        cwd: (_13 = params.cwd) !== null && _13 !== void 0 ? _13 : null,
                        env: (_14 = params.env) !== null && _14 !== void 0 ? _14 : null,
                        timeoutMs: (_15 = params.timeoutMs) !== null && _15 !== void 0 ? _15 : null,
                        needsScreenRecording: (_16 = params.needsScreenRecording) !== null && _16 !== void 0 ? _16 : null,
                        agentId: agentId !== null && agentId !== void 0 ? agentId : null,
                        sessionKey: sessionKey !== null && sessionKey !== void 0 ? sessionKey : null,
                        approvalDecision: approvalDecision_1,
                    };
                    return [4 /*yield*/, runViaMacAppExecHost({ approvals: approvals, request: execRequest })];
                case 40:
                    response = _25.sent();
                    if (!!response) return [3 /*break*/, 44];
                    if (!(execHostEnforced || !execHostFallbackAllowed)) return [3 /*break*/, 43];
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: "companion-unavailable",
                        }))];
                case 41:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: {
                                code: "UNAVAILABLE",
                                message: "COMPANION_APP_UNAVAILABLE: macOS app exec host unreachable",
                            },
                        })];
                case 42:
                    _25.sent();
                    return [2 /*return*/];
                case 43: return [3 /*break*/, 50];
                case 44:
                    if (!!response.ok) return [3 /*break*/, 47];
                    reason = (_17 = response.error.reason) !== null && _17 !== void 0 ? _17 : "approval-required";
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: reason,
                        }))];
                case 45:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: response.error.message },
                        })];
                case 46:
                    _25.sent();
                    return [2 /*return*/];
                case 47:
                    result_2 = response.payload;
                    combined_1 = [result_2.stdout, result_2.stderr, result_2.error].filter(Boolean).join("\n");
                    return [4 /*yield*/, sendNodeEvent(client, "exec.finished", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            exitCode: result_2.exitCode,
                            timedOut: result_2.timedOut,
                            success: result_2.success,
                            output: combined_1,
                        }))];
                case 48:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify(result_2),
                        })];
                case 49:
                    _25.sent();
                    return [2 /*return*/];
                case 50:
                    if (!(security === "deny")) return [3 /*break*/, 53];
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: "security=deny",
                        }))];
                case 51:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: "SYSTEM_RUN_DISABLED: security=deny" },
                        })];
                case 52:
                    _25.sent();
                    return [2 /*return*/];
                case 53:
                    requiresAsk = (0, exec_approvals_js_1.requiresExecApproval)({
                        ask: ask,
                        security: security,
                        analysisOk: analysisOk,
                        allowlistSatisfied: allowlistSatisfied,
                    });
                    approvalDecision = params.approvalDecision === "allow-once" || params.approvalDecision === "allow-always"
                        ? params.approvalDecision
                        : null;
                    approvedByAsk = approvalDecision !== null || params.approved === true;
                    if (!(requiresAsk && !approvedByAsk)) return [3 /*break*/, 56];
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: "approval-required",
                        }))];
                case 54:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: "SYSTEM_RUN_DENIED: approval required" },
                        })];
                case 55:
                    _25.sent();
                    return [2 /*return*/];
                case 56:
                    if (approvalDecision === "allow-always" && security === "allowlist") {
                        if (analysisOk) {
                            for (_d = 0, segments_1 = segments; _d < segments_1.length; _d++) {
                                segment = segments_1[_d];
                                pattern = (_19 = (_18 = segment.resolution) === null || _18 === void 0 ? void 0 : _18.resolvedPath) !== null && _19 !== void 0 ? _19 : "";
                                if (pattern) {
                                    (0, exec_approvals_js_1.addAllowlistEntry)(approvals.file, agentId, pattern);
                                }
                            }
                        }
                    }
                    if (!(security === "allowlist" && (!analysisOk || !allowlistSatisfied) && !approvedByAsk)) return [3 /*break*/, 59];
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: "allowlist-miss",
                        }))];
                case 57:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: "SYSTEM_RUN_DENIED: allowlist miss" },
                        })];
                case 58:
                    _25.sent();
                    return [2 /*return*/];
                case 59:
                    if (allowlistMatches.length > 0) {
                        seen = new Set();
                        for (_e = 0, allowlistMatches_1 = allowlistMatches; _e < allowlistMatches_1.length; _e++) {
                            match = allowlistMatches_1[_e];
                            if (!(match === null || match === void 0 ? void 0 : match.pattern) || seen.has(match.pattern)) {
                                continue;
                            }
                            seen.add(match.pattern);
                            (0, exec_approvals_js_1.recordAllowlistUse)(approvals.file, agentId, match, cmdText, (_21 = (_20 = segments[0]) === null || _20 === void 0 ? void 0 : _20.resolution) === null || _21 === void 0 ? void 0 : _21.resolvedPath);
                        }
                    }
                    if (!(params.needsScreenRecording === true)) return [3 /*break*/, 62];
                    return [4 /*yield*/, sendNodeEvent(client, "exec.denied", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            reason: "permission:screenRecording",
                        }))];
                case 60:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: false,
                            error: { code: "UNAVAILABLE", message: "PERMISSION_MISSING: screenRecording" },
                        })];
                case 61:
                    _25.sent();
                    return [2 /*return*/];
                case 62: return [4 /*yield*/, runCommand(argv, ((_22 = params.cwd) === null || _22 === void 0 ? void 0 : _22.trim()) || undefined, env, (_23 = params.timeoutMs) !== null && _23 !== void 0 ? _23 : undefined)];
                case 63:
                    result = _25.sent();
                    if (result.truncated) {
                        suffix = "... (truncated)";
                        if (result.stderr.trim().length > 0) {
                            result.stderr = "".concat(result.stderr, "\n").concat(suffix);
                        }
                        else {
                            result.stdout = "".concat(result.stdout, "\n").concat(suffix);
                        }
                    }
                    combined = [result.stdout, result.stderr, result.error].filter(Boolean).join("\n");
                    return [4 /*yield*/, sendNodeEvent(client, "exec.finished", buildExecEventPayload({
                            sessionKey: sessionKey,
                            runId: runId,
                            host: "node",
                            command: cmdText,
                            exitCode: result.exitCode,
                            timedOut: result.timedOut,
                            success: result.success,
                            output: combined,
                        }))];
                case 64:
                    _25.sent();
                    return [4 /*yield*/, sendInvokeResult(client, frame, {
                            ok: true,
                            payloadJSON: JSON.stringify({
                                exitCode: result.exitCode,
                                timedOut: result.timedOut,
                                success: result.success,
                                stdout: result.stdout,
                                stderr: result.stderr,
                                error: (_24 = result.error) !== null && _24 !== void 0 ? _24 : null,
                            }),
                        })];
                case 65:
                    _25.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function decodeParams(raw) {
    if (!raw) {
        throw new Error("INVALID_REQUEST: paramsJSON required");
    }
    return JSON.parse(raw);
}
function coerceNodeInvokePayload(payload) {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    var obj = payload;
    var id = typeof obj.id === "string" ? obj.id.trim() : "";
    var nodeId = typeof obj.nodeId === "string" ? obj.nodeId.trim() : "";
    var command = typeof obj.command === "string" ? obj.command.trim() : "";
    if (!id || !nodeId || !command) {
        return null;
    }
    var paramsJSON = typeof obj.paramsJSON === "string"
        ? obj.paramsJSON
        : obj.params !== undefined
            ? JSON.stringify(obj.params)
            : null;
    var timeoutMs = typeof obj.timeoutMs === "number" ? obj.timeoutMs : null;
    var idempotencyKey = typeof obj.idempotencyKey === "string" ? obj.idempotencyKey : null;
    return {
        id: id,
        nodeId: nodeId,
        command: command,
        paramsJSON: paramsJSON,
        timeoutMs: timeoutMs,
        idempotencyKey: idempotencyKey,
    };
}
function sendInvokeResult(client, frame, result) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request("node.invoke.result", buildNodeInvokeResultParams(frame, result))];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function buildNodeInvokeResultParams(frame, result) {
    var params = {
        id: frame.id,
        nodeId: frame.nodeId,
        ok: result.ok,
    };
    if (result.payload !== undefined) {
        params.payload = result.payload;
    }
    if (typeof result.payloadJSON === "string") {
        params.payloadJSON = result.payloadJSON;
    }
    if (result.error) {
        params.error = result.error;
    }
    return params;
}
function sendNodeEvent(client, event, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request("node.event", {
                            event: event,
                            payloadJSON: payload ? JSON.stringify(payload) : null,
                        })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
