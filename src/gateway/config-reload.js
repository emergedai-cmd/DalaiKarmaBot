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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffConfigPaths = diffConfigPaths;
exports.resolveGatewayReloadSettings = resolveGatewayReloadSettings;
exports.buildGatewayReloadPlan = buildGatewayReloadPlan;
exports.startGatewayConfigReloader = startGatewayConfigReloader;
var chokidar_1 = require("chokidar");
var index_js_1 = require("../channels/plugins/index.js");
var runtime_js_1 = require("../plugins/runtime.js");
var DEFAULT_RELOAD_SETTINGS = {
    mode: "hybrid",
    debounceMs: 300,
};
var BASE_RELOAD_RULES = [
    { prefix: "gateway.remote", kind: "none" },
    { prefix: "gateway.reload", kind: "none" },
    { prefix: "hooks.gmail", kind: "hot", actions: ["restart-gmail-watcher"] },
    { prefix: "hooks", kind: "hot", actions: ["reload-hooks"] },
    {
        prefix: "agents.defaults.heartbeat",
        kind: "hot",
        actions: ["restart-heartbeat"],
    },
    { prefix: "agent.heartbeat", kind: "hot", actions: ["restart-heartbeat"] },
    { prefix: "cron", kind: "hot", actions: ["restart-cron"] },
    {
        prefix: "browser",
        kind: "hot",
        actions: ["restart-browser-control"],
    },
];
var BASE_RELOAD_RULES_TAIL = [
    { prefix: "identity", kind: "none" },
    { prefix: "wizard", kind: "none" },
    { prefix: "logging", kind: "none" },
    { prefix: "models", kind: "none" },
    { prefix: "agents", kind: "none" },
    { prefix: "tools", kind: "none" },
    { prefix: "bindings", kind: "none" },
    { prefix: "audio", kind: "none" },
    { prefix: "agent", kind: "none" },
    { prefix: "routing", kind: "none" },
    { prefix: "messages", kind: "none" },
    { prefix: "session", kind: "none" },
    { prefix: "talk", kind: "none" },
    { prefix: "skills", kind: "none" },
    { prefix: "plugins", kind: "restart" },
    { prefix: "ui", kind: "none" },
    { prefix: "gateway", kind: "restart" },
    { prefix: "discovery", kind: "restart" },
    { prefix: "canvasHost", kind: "restart" },
];
var cachedReloadRules = null;
var cachedRegistry = null;
function listReloadRules() {
    var registry = (0, runtime_js_1.getActivePluginRegistry)();
    if (registry !== cachedRegistry) {
        cachedReloadRules = null;
        cachedRegistry = registry;
    }
    if (cachedReloadRules) {
        return cachedReloadRules;
    }
    // Channel docking: plugins contribute hot reload/no-op prefixes here.
    var channelReloadRules = (0, index_js_1.listChannelPlugins)().flatMap(function (plugin) {
        var _a, _b, _c, _d;
        return __spreadArray(__spreadArray([], ((_b = (_a = plugin.reload) === null || _a === void 0 ? void 0 : _a.configPrefixes) !== null && _b !== void 0 ? _b : []).map(function (prefix) { return ({
            prefix: prefix,
            kind: "hot",
            actions: ["restart-channel:".concat(plugin.id)],
        }); }), true), ((_d = (_c = plugin.reload) === null || _c === void 0 ? void 0 : _c.noopPrefixes) !== null && _d !== void 0 ? _d : []).map(function (prefix) { return ({
            prefix: prefix,
            kind: "none",
        }); }), true);
    });
    var rules = __spreadArray(__spreadArray(__spreadArray([], BASE_RELOAD_RULES, true), channelReloadRules, true), BASE_RELOAD_RULES_TAIL, true);
    cachedReloadRules = rules;
    return rules;
}
function matchRule(path) {
    for (var _i = 0, _a = listReloadRules(); _i < _a.length; _i++) {
        var rule = _a[_i];
        if (path === rule.prefix || path.startsWith("".concat(rule.prefix, "."))) {
            return rule;
        }
    }
    return null;
}
function isPlainObject(value) {
    return Boolean(value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === "[object Object]");
}
function diffConfigPaths(prev, next, prefix) {
    if (prefix === void 0) { prefix = ""; }
    if (prev === next) {
        return [];
    }
    if (isPlainObject(prev) && isPlainObject(next)) {
        var keys = new Set(__spreadArray(__spreadArray([], Object.keys(prev), true), Object.keys(next), true));
        var paths = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var prevValue = prev[key];
            var nextValue = next[key];
            if (prevValue === undefined && nextValue === undefined) {
                continue;
            }
            var childPrefix = prefix ? "".concat(prefix, ".").concat(key) : key;
            var childPaths = diffConfigPaths(prevValue, nextValue, childPrefix);
            if (childPaths.length > 0) {
                paths.push.apply(paths, childPaths);
            }
        }
        return paths;
    }
    if (Array.isArray(prev) && Array.isArray(next)) {
        if (prev.length === next.length && prev.every(function (val, idx) { return val === next[idx]; })) {
            return [];
        }
    }
    return [prefix || "<root>"];
}
function resolveGatewayReloadSettings(cfg) {
    var _a, _b, _c, _d;
    var rawMode = (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.reload) === null || _b === void 0 ? void 0 : _b.mode;
    var mode = rawMode === "off" || rawMode === "restart" || rawMode === "hot" || rawMode === "hybrid"
        ? rawMode
        : DEFAULT_RELOAD_SETTINGS.mode;
    var debounceRaw = (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.reload) === null || _d === void 0 ? void 0 : _d.debounceMs;
    var debounceMs = typeof debounceRaw === "number" && Number.isFinite(debounceRaw)
        ? Math.max(0, Math.floor(debounceRaw))
        : DEFAULT_RELOAD_SETTINGS.debounceMs;
    return { mode: mode, debounceMs: debounceMs };
}
function buildGatewayReloadPlan(changedPaths) {
    var _a;
    var plan = {
        changedPaths: changedPaths,
        restartGateway: false,
        restartReasons: [],
        hotReasons: [],
        reloadHooks: false,
        restartGmailWatcher: false,
        restartBrowserControl: false,
        restartCron: false,
        restartHeartbeat: false,
        restartChannels: new Set(),
        noopPaths: [],
    };
    var applyAction = function (action) {
        if (action.startsWith("restart-channel:")) {
            var channel = action.slice("restart-channel:".length);
            plan.restartChannels.add(channel);
            return;
        }
        switch (action) {
            case "reload-hooks":
                plan.reloadHooks = true;
                break;
            case "restart-gmail-watcher":
                plan.restartGmailWatcher = true;
                break;
            case "restart-browser-control":
                plan.restartBrowserControl = true;
                break;
            case "restart-cron":
                plan.restartCron = true;
                break;
            case "restart-heartbeat":
                plan.restartHeartbeat = true;
                break;
            default:
                break;
        }
    };
    for (var _i = 0, changedPaths_1 = changedPaths; _i < changedPaths_1.length; _i++) {
        var path = changedPaths_1[_i];
        var rule = matchRule(path);
        if (!rule) {
            plan.restartGateway = true;
            plan.restartReasons.push(path);
            continue;
        }
        if (rule.kind === "restart") {
            plan.restartGateway = true;
            plan.restartReasons.push(path);
            continue;
        }
        if (rule.kind === "none") {
            plan.noopPaths.push(path);
            continue;
        }
        plan.hotReasons.push(path);
        for (var _b = 0, _c = (_a = rule.actions) !== null && _a !== void 0 ? _a : []; _b < _c.length; _b++) {
            var action = _c[_b];
            applyAction(action);
        }
    }
    if (plan.restartGmailWatcher) {
        plan.reloadHooks = true;
    }
    return plan;
}
function startGatewayConfigReloader(opts) {
    var _this = this;
    var currentConfig = opts.initialConfig;
    var settings = resolveGatewayReloadSettings(currentConfig);
    var debounceTimer = null;
    var pending = false;
    var running = false;
    var stopped = false;
    var restartQueued = false;
    var schedule = function () {
        if (stopped) {
            return;
        }
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        var wait = settings.debounceMs;
        debounceTimer = setTimeout(function () {
            void runReload();
        }, wait);
    };
    var runReload = function () { return __awaiter(_this, void 0, void 0, function () {
        var snapshot, issues, nextConfig, changedPaths, plan, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (stopped) {
                        return [2 /*return*/];
                    }
                    if (running) {
                        pending = true;
                        return [2 /*return*/];
                    }
                    running = true;
                    if (debounceTimer) {
                        clearTimeout(debounceTimer);
                        debounceTimer = null;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, opts.readSnapshot()];
                case 2:
                    snapshot = _a.sent();
                    if (!snapshot.valid) {
                        issues = snapshot.issues.map(function (issue) { return "".concat(issue.path, ": ").concat(issue.message); }).join(", ");
                        opts.log.warn("config reload skipped (invalid config): ".concat(issues));
                        return [2 /*return*/];
                    }
                    nextConfig = snapshot.config;
                    changedPaths = diffConfigPaths(currentConfig, nextConfig);
                    currentConfig = nextConfig;
                    settings = resolveGatewayReloadSettings(nextConfig);
                    if (changedPaths.length === 0) {
                        return [2 /*return*/];
                    }
                    opts.log.info("config change detected; evaluating reload (".concat(changedPaths.join(", "), ")"));
                    plan = buildGatewayReloadPlan(changedPaths);
                    if (settings.mode === "off") {
                        opts.log.info("config reload disabled (gateway.reload.mode=off)");
                        return [2 /*return*/];
                    }
                    if (settings.mode === "restart") {
                        if (!restartQueued) {
                            restartQueued = true;
                            opts.onRestart(plan, nextConfig);
                        }
                        return [2 /*return*/];
                    }
                    if (plan.restartGateway) {
                        if (settings.mode === "hot") {
                            opts.log.warn("config reload requires gateway restart; hot mode ignoring (".concat(plan.restartReasons.join(", "), ")"));
                            return [2 /*return*/];
                        }
                        if (!restartQueued) {
                            restartQueued = true;
                            opts.onRestart(plan, nextConfig);
                        }
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, opts.onHotReload(plan, nextConfig)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    opts.log.error("config reload failed: ".concat(String(err_1)));
                    return [3 /*break*/, 6];
                case 5:
                    running = false;
                    if (pending) {
                        pending = false;
                        schedule();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var watcher = chokidar_1.default.watch(opts.watchPath, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
        usePolling: Boolean(process.env.VITEST),
    });
    watcher.on("add", schedule);
    watcher.on("change", schedule);
    watcher.on("unlink", schedule);
    var watcherClosed = false;
    watcher.on("error", function (err) {
        if (watcherClosed) {
            return;
        }
        watcherClosed = true;
        opts.log.warn("config watcher error: ".concat(String(err)));
        void watcher.close().catch(function () { });
    });
    return {
        stop: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stopped = true;
                        if (debounceTimer) {
                            clearTimeout(debounceTimer);
                        }
                        debounceTimer = null;
                        watcherClosed = true;
                        return [4 /*yield*/, watcher.close().catch(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
}
