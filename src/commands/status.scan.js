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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanStatus = scanStatus;
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var call_js_1 = require("../gateway/call.js");
var control_ui_shared_js_1 = require("../gateway/control-ui-shared.js");
var probe_js_1 = require("../gateway/probe.js");
var channels_status_issues_js_1 = require("../infra/channels-status-issues.js");
var os_summary_js_1 = require("../infra/os-summary.js");
var tailscale_js_1 = require("../infra/tailscale.js");
var exec_js_1 = require("../process/exec.js");
var channels_js_1 = require("./status-all/channels.js");
var status_agent_local_js_1 = require("./status.agent-local.js");
var status_gateway_probe_js_1 = require("./status.gateway-probe.js");
var status_summary_js_1 = require("./status.summary.js");
var status_update_js_1 = require("./status.update.js");
function resolveMemoryPluginStatus(cfg) {
    var _a, _b, _c;
    var pluginsEnabled = ((_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.enabled) !== false;
    if (!pluginsEnabled) {
        return { enabled: false, slot: null, reason: "plugins disabled" };
    }
    var raw = typeof ((_c = (_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.slots) === null || _c === void 0 ? void 0 : _c.memory) === "string" ? cfg.plugins.slots.memory.trim() : "";
    if (raw && raw.toLowerCase() === "none") {
        return { enabled: false, slot: null, reason: 'plugins.slots.memory="none"' };
    }
    return { enabled: true, slot: raw || "memory-core" };
}
function scanStatus(opts, _runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, progress_js_1.withProgress)({
                        label: "Scanning status…",
                        total: 10,
                        enabled: opts.json !== true,
                    }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                        var cfg, osSummary, tailscaleMode, tailscaleDns, _a, tailscaleHttpsUrl, updateTimeoutMs, update, agentStatus, gatewayConnection, isRemoteMode, remoteUrlRaw, remoteUrlMissing, gatewayMode, gatewayProbe, _b, gatewayReachable, gatewaySelf, channelsStatus, _c, channelIssues, channels, memoryPlugin, memory, summary;
                        var _this = this;
                        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0:
                                    progress.setLabel("Loading config…");
                                    cfg = (0, config_js_1.loadConfig)();
                                    osSummary = (0, os_summary_js_1.resolveOsSummary)();
                                    progress.tick();
                                    progress.setLabel("Checking Tailscale…");
                                    tailscaleMode = (_f = (_e = (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.tailscale) === null || _e === void 0 ? void 0 : _e.mode) !== null && _f !== void 0 ? _f : "off";
                                    if (!(tailscaleMode === "off")) return [3 /*break*/, 1];
                                    _a = null;
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, (0, tailscale_js_1.getTailnetHostname)(function (cmd, args) {
                                        return (0, exec_js_1.runExec)(cmd, args, { timeoutMs: 1200, maxBuffer: 200000 });
                                    }).catch(function () { return null; })];
                                case 2:
                                    _a = _r.sent();
                                    _r.label = 3;
                                case 3:
                                    tailscaleDns = _a;
                                    tailscaleHttpsUrl = tailscaleMode !== "off" && tailscaleDns
                                        ? "https://".concat(tailscaleDns).concat((0, control_ui_shared_js_1.normalizeControlUiBasePath)((_h = (_g = cfg.gateway) === null || _g === void 0 ? void 0 : _g.controlUi) === null || _h === void 0 ? void 0 : _h.basePath))
                                        : null;
                                    progress.tick();
                                    progress.setLabel("Checking for updates…");
                                    updateTimeoutMs = opts.all ? 6500 : 2500;
                                    return [4 /*yield*/, (0, status_update_js_1.getUpdateCheckResult)({
                                            timeoutMs: updateTimeoutMs,
                                            fetchGit: true,
                                            includeRegistry: true,
                                        })];
                                case 4:
                                    update = _r.sent();
                                    progress.tick();
                                    progress.setLabel("Resolving agents…");
                                    return [4 /*yield*/, (0, status_agent_local_js_1.getAgentLocalStatuses)()];
                                case 5:
                                    agentStatus = _r.sent();
                                    progress.tick();
                                    progress.setLabel("Probing gateway…");
                                    gatewayConnection = (0, call_js_1.buildGatewayConnectionDetails)();
                                    isRemoteMode = ((_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.mode) === "remote";
                                    remoteUrlRaw = typeof ((_l = (_k = cfg.gateway) === null || _k === void 0 ? void 0 : _k.remote) === null || _l === void 0 ? void 0 : _l.url) === "string" ? cfg.gateway.remote.url : "";
                                    remoteUrlMissing = isRemoteMode && !remoteUrlRaw.trim();
                                    gatewayMode = isRemoteMode ? "remote" : "local";
                                    if (!remoteUrlMissing) return [3 /*break*/, 6];
                                    _b = null;
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, (0, probe_js_1.probeGateway)({
                                        url: gatewayConnection.url,
                                        auth: (0, status_gateway_probe_js_1.resolveGatewayProbeAuth)(cfg),
                                        timeoutMs: Math.min(opts.all ? 5000 : 2500, (_m = opts.timeoutMs) !== null && _m !== void 0 ? _m : 10000),
                                    }).catch(function () { return null; })];
                                case 7:
                                    _b = _r.sent();
                                    _r.label = 8;
                                case 8:
                                    gatewayProbe = _b;
                                    gatewayReachable = (gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.ok) === true;
                                    gatewaySelf = (gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.presence)
                                        ? (0, status_gateway_probe_js_1.pickGatewaySelfPresence)(gatewayProbe.presence)
                                        : null;
                                    progress.tick();
                                    progress.setLabel("Querying channel status…");
                                    if (!gatewayReachable) return [3 /*break*/, 10];
                                    return [4 /*yield*/, (0, call_js_1.callGateway)({
                                            method: "channels.status",
                                            params: {
                                                probe: false,
                                                timeoutMs: Math.min(8000, (_o = opts.timeoutMs) !== null && _o !== void 0 ? _o : 10000),
                                            },
                                            timeoutMs: Math.min(opts.all ? 5000 : 2500, (_p = opts.timeoutMs) !== null && _p !== void 0 ? _p : 10000),
                                        }).catch(function () { return null; })];
                                case 9:
                                    _c = _r.sent();
                                    return [3 /*break*/, 11];
                                case 10:
                                    _c = null;
                                    _r.label = 11;
                                case 11:
                                    channelsStatus = _c;
                                    channelIssues = channelsStatus ? (0, channels_status_issues_js_1.collectChannelStatusIssues)(channelsStatus) : [];
                                    progress.tick();
                                    progress.setLabel("Summarizing channels…");
                                    return [4 /*yield*/, (0, channels_js_1.buildChannelsTable)(cfg, {
                                            // Show token previews in regular status; keep `status --all` redacted.
                                            // Set `OPENCLAW_SHOW_SECRETS=0` to force redaction.
                                            showSecrets: ((_q = process.env.OPENCLAW_SHOW_SECRETS) === null || _q === void 0 ? void 0 : _q.trim()) !== "0",
                                        })];
                                case 12:
                                    channels = _r.sent();
                                    progress.tick();
                                    progress.setLabel("Checking memory…");
                                    memoryPlugin = resolveMemoryPluginStatus(cfg);
                                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                            var agentId, MemoryIndexManager, manager, _a, status;
                                            var _b;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        if (!memoryPlugin.enabled) {
                                                            return [2 /*return*/, null];
                                                        }
                                                        if (memoryPlugin.slot !== "memory-core") {
                                                            return [2 /*return*/, null];
                                                        }
                                                        agentId = (_b = agentStatus.defaultId) !== null && _b !== void 0 ? _b : "main";
                                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../memory/manager.js"); })];
                                                    case 1:
                                                        MemoryIndexManager = (_c.sent()).MemoryIndexManager;
                                                        return [4 /*yield*/, MemoryIndexManager.get({ cfg: cfg, agentId: agentId }).catch(function () { return null; })];
                                                    case 2:
                                                        manager = _c.sent();
                                                        if (!manager) {
                                                            return [2 /*return*/, null];
                                                        }
                                                        _c.label = 3;
                                                    case 3:
                                                        _c.trys.push([3, 5, , 6]);
                                                        return [4 /*yield*/, manager.probeVectorAvailability()];
                                                    case 4:
                                                        _c.sent();
                                                        return [3 /*break*/, 6];
                                                    case 5:
                                                        _a = _c.sent();
                                                        return [3 /*break*/, 6];
                                                    case 6:
                                                        status = manager.status();
                                                        return [4 /*yield*/, manager.close().catch(function () { })];
                                                    case 7:
                                                        _c.sent();
                                                        return [2 /*return*/, __assign({ agentId: agentId }, status)];
                                                }
                                            });
                                        }); })()];
                                case 13:
                                    memory = _r.sent();
                                    progress.tick();
                                    progress.setLabel("Reading sessions…");
                                    return [4 /*yield*/, (0, status_summary_js_1.getStatusSummary)()];
                                case 14:
                                    summary = _r.sent();
                                    progress.tick();
                                    progress.setLabel("Rendering…");
                                    progress.tick();
                                    return [2 /*return*/, {
                                            cfg: cfg,
                                            osSummary: osSummary,
                                            tailscaleMode: tailscaleMode,
                                            tailscaleDns: tailscaleDns,
                                            tailscaleHttpsUrl: tailscaleHttpsUrl,
                                            update: update,
                                            gatewayConnection: gatewayConnection,
                                            remoteUrlMissing: remoteUrlMissing,
                                            gatewayMode: gatewayMode,
                                            gatewayProbe: gatewayProbe,
                                            gatewayReachable: gatewayReachable,
                                            gatewaySelf: gatewaySelf,
                                            channelIssues: channelIssues,
                                            agentStatus: agentStatus,
                                            channels: channels,
                                            summary: summary,
                                            memory: memory,
                                            memoryPlugin: memoryPlugin,
                                        }];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
