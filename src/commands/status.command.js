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
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
var command_format_js_1 = require("../cli/command-format.js");
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var call_js_1 = require("../gateway/call.js");
var globals_js_1 = require("../globals.js");
var provider_usage_js_1 = require("../infra/provider-usage.js");
var update_channels_js_1 = require("../infra/update-channels.js");
var status_format_js_1 = require("../memory/status-format.js");
var audit_js_1 = require("../security/audit.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var health_js_1 = require("./health.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var status_all_js_1 = require("./status-all.js");
var format_js_1 = require("./status-all/format.js");
var status_daemon_js_1 = require("./status.daemon.js");
var status_format_js_2 = require("./status.format.js");
var status_gateway_probe_js_1 = require("./status.gateway-probe.js");
var status_scan_js_1 = require("./status.scan.js");
var status_update_js_1 = require("./status.update.js");
function statusCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var scan, cfg, osSummary, tailscaleMode, tailscaleDns, tailscaleHttpsUrl, update, gatewayConnection, remoteUrlMissing, gatewayMode, gatewayProbe, gatewayReachable, gatewaySelf, channelIssues, agentStatus, channels, summary, memory, memoryPlugin, securityAudit, usage, _a, health, _b, configChannel, channelInfo, _c, daemon_1, nodeDaemon_1, rich, muted, ok, warn, details, _i, _d, line, tableWidth, dashboard, gatewayValue, agentsValue, _e, daemon, nodeDaemon, daemonValue, nodeDaemonValue, defaults, defaultCtx, eventsValue, probesValue, heartbeatValue, storeLabel, memoryValue, updateAvailability, updateLine, channelLabel, gitLabel, overviewRows, fmtSummary, importantFindings, severityLabel, sevRank_1, sorted, shown, _f, shown_1, f, channelIssuesByChannel, rows, _loop_1, _g, _h, line, _j, _k, line, updateHint;
        var _this = this;
        var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    if (!(opts.all && !opts.json)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, status_all_js_1.statusAllCommand)(runtime, { timeoutMs: opts.timeoutMs })];
                case 1:
                    _x.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, (0, status_scan_js_1.scanStatus)({ json: opts.json, timeoutMs: opts.timeoutMs, all: opts.all }, runtime)];
                case 3:
                    scan = _x.sent();
                    cfg = scan.cfg, osSummary = scan.osSummary, tailscaleMode = scan.tailscaleMode, tailscaleDns = scan.tailscaleDns, tailscaleHttpsUrl = scan.tailscaleHttpsUrl, update = scan.update, gatewayConnection = scan.gatewayConnection, remoteUrlMissing = scan.remoteUrlMissing, gatewayMode = scan.gatewayMode, gatewayProbe = scan.gatewayProbe, gatewayReachable = scan.gatewayReachable, gatewaySelf = scan.gatewaySelf, channelIssues = scan.channelIssues, agentStatus = scan.agentStatus, channels = scan.channels, summary = scan.summary, memory = scan.memory, memoryPlugin = scan.memoryPlugin;
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                            label: "Running security audit…",
                            indeterminate: true,
                            enabled: opts.json !== true,
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                            config: cfg,
                                            deep: false,
                                            includeFilesystem: true,
                                            includeChannelSecurity: true,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 4:
                    securityAudit = _x.sent();
                    if (!opts.usage) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                            label: "Fetching usage snapshot…",
                            indeterminate: true,
                            enabled: opts.json !== true,
                        }, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({ timeoutMs: opts.timeoutMs })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 5:
                    _a = _x.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = undefined;
                    _x.label = 7;
                case 7:
                    usage = _a;
                    if (!opts.deep) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                            label: "Checking gateway health…",
                            indeterminate: true,
                            enabled: opts.json !== true,
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, call_js_1.callGateway)({
                                            method: "health",
                                            params: { probe: true },
                                            timeoutMs: opts.timeoutMs,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 8:
                    _b = _x.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = undefined;
                    _x.label = 10;
                case 10:
                    health = _b;
                    configChannel = (0, update_channels_js_1.normalizeUpdateChannel)((_l = cfg.update) === null || _l === void 0 ? void 0 : _l.channel);
                    channelInfo = (0, update_channels_js_1.resolveEffectiveUpdateChannel)({
                        configChannel: configChannel,
                        installKind: update.installKind,
                        git: update.git ? { tag: update.git.tag, branch: update.git.branch } : undefined,
                    });
                    if (!opts.json) return [3 /*break*/, 12];
                    return [4 /*yield*/, Promise.all([
                            (0, status_daemon_js_1.getDaemonStatusSummary)(),
                            (0, status_daemon_js_1.getNodeDaemonStatusSummary)(),
                        ])];
                case 11:
                    _c = _x.sent(), daemon_1 = _c[0], nodeDaemon_1 = _c[1];
                    runtime.log(JSON.stringify(__assign(__assign(__assign({}, summary), { os: osSummary, update: update, updateChannel: channelInfo.channel, updateChannelSource: channelInfo.source, memory: memory, memoryPlugin: memoryPlugin, gateway: {
                            mode: gatewayMode,
                            url: gatewayConnection.url,
                            urlSource: gatewayConnection.urlSource,
                            misconfigured: remoteUrlMissing,
                            reachable: gatewayReachable,
                            connectLatencyMs: (_m = gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.connectLatencyMs) !== null && _m !== void 0 ? _m : null,
                            self: gatewaySelf,
                            error: (_o = gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.error) !== null && _o !== void 0 ? _o : null,
                        }, gatewayService: daemon_1, nodeService: nodeDaemon_1, agents: agentStatus, securityAudit: securityAudit }), (health || usage ? { health: health, usage: usage } : {})), null, 2));
                    return [2 /*return*/];
                case 12:
                    rich = true;
                    muted = function (value) { return (rich ? theme_js_1.theme.muted(value) : value); };
                    ok = function (value) { return (rich ? theme_js_1.theme.success(value) : value); };
                    warn = function (value) { return (rich ? theme_js_1.theme.warn(value) : value); };
                    if (opts.verbose) {
                        details = (0, call_js_1.buildGatewayConnectionDetails)();
                        runtime.log((0, globals_js_1.info)("Gateway connection:"));
                        for (_i = 0, _d = details.message.split("\n"); _i < _d.length; _i++) {
                            line = _d[_i];
                            runtime.log("  ".concat(line));
                        }
                        runtime.log("");
                    }
                    tableWidth = Math.max(60, ((_p = process.stdout.columns) !== null && _p !== void 0 ? _p : 120) - 1);
                    dashboard = (function () {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var controlUiEnabled = (_c = (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.controlUi) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : true;
                        if (!controlUiEnabled) {
                            return "disabled";
                        }
                        var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                            port: (0, config_js_1.resolveGatewayPort)(cfg),
                            bind: (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.bind,
                            customBindHost: (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.customBindHost,
                            basePath: (_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.controlUi) === null || _g === void 0 ? void 0 : _g.basePath,
                        });
                        return links.httpUrl;
                    })();
                    gatewayValue = (function () {
                        var target = remoteUrlMissing
                            ? "fallback ".concat(gatewayConnection.url)
                            : "".concat(gatewayConnection.url).concat(gatewayConnection.urlSource ? " (".concat(gatewayConnection.urlSource, ")") : "");
                        var reach = remoteUrlMissing
                            ? warn("misconfigured (remote.url missing)")
                            : gatewayReachable
                                ? ok("reachable ".concat((0, status_format_js_2.formatDuration)(gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.connectLatencyMs)))
                                : warn((gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.error) ? "unreachable (".concat(gatewayProbe.error, ")") : "unreachable");
                        var auth = gatewayReachable && !remoteUrlMissing
                            ? " \u00B7 auth ".concat((0, format_js_1.formatGatewayAuthUsed)((0, status_gateway_probe_js_1.resolveGatewayProbeAuth)(cfg)))
                            : "";
                        var self = (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.host) || (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.version) || (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.platform)
                            ? [
                                (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.host) ? gatewaySelf.host : null,
                                (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.ip) ? "(".concat(gatewaySelf.ip, ")") : null,
                                (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.version) ? "app ".concat(gatewaySelf.version) : null,
                                (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.platform) ? gatewaySelf.platform : null,
                            ]
                                .filter(Boolean)
                                .join(" ")
                            : null;
                        var suffix = self ? " \u00B7 ".concat(self) : "";
                        return "".concat(gatewayMode, " \u00B7 ").concat(target, " \u00B7 ").concat(reach).concat(auth).concat(suffix);
                    })();
                    agentsValue = (function () {
                        var pending = agentStatus.bootstrapPendingCount > 0
                            ? "".concat(agentStatus.bootstrapPendingCount, " bootstrapping")
                            : "no bootstraps";
                        var def = agentStatus.agents.find(function (a) { return a.id === agentStatus.defaultId; });
                        var defActive = (def === null || def === void 0 ? void 0 : def.lastActiveAgeMs) != null ? (0, status_format_js_2.formatAge)(def.lastActiveAgeMs) : "unknown";
                        var defSuffix = def ? " \u00B7 default ".concat(def.id, " active ").concat(defActive) : "";
                        return "".concat(agentStatus.agents.length, " \u00B7 ").concat(pending, " \u00B7 sessions ").concat(agentStatus.totalSessions).concat(defSuffix);
                    })();
                    return [4 /*yield*/, Promise.all([
                            (0, status_daemon_js_1.getDaemonStatusSummary)(),
                            (0, status_daemon_js_1.getNodeDaemonStatusSummary)(),
                        ])];
                case 13:
                    _e = _x.sent(), daemon = _e[0], nodeDaemon = _e[1];
                    daemonValue = (function () {
                        if (daemon.installed === false) {
                            return "".concat(daemon.label, " not installed");
                        }
                        var installedPrefix = daemon.installed === true ? "installed · " : "";
                        return "".concat(daemon.label, " ").concat(installedPrefix).concat(daemon.loadedText).concat(daemon.runtimeShort ? " \u00B7 ".concat(daemon.runtimeShort) : "");
                    })();
                    nodeDaemonValue = (function () {
                        if (nodeDaemon.installed === false) {
                            return "".concat(nodeDaemon.label, " not installed");
                        }
                        var installedPrefix = nodeDaemon.installed === true ? "installed · " : "";
                        return "".concat(nodeDaemon.label, " ").concat(installedPrefix).concat(nodeDaemon.loadedText).concat(nodeDaemon.runtimeShort ? " \u00B7 ".concat(nodeDaemon.runtimeShort) : "");
                    })();
                    defaults = summary.sessions.defaults;
                    defaultCtx = defaults.contextTokens
                        ? " (".concat((0, status_format_js_2.formatKTokens)(defaults.contextTokens), " ctx)")
                        : "";
                    eventsValue = summary.queuedSystemEvents.length > 0 ? "".concat(summary.queuedSystemEvents.length, " queued") : "none";
                    probesValue = health ? ok("enabled") : muted("skipped (use --deep)");
                    heartbeatValue = (function () {
                        var parts = summary.heartbeat.agents
                            .map(function (agent) {
                            if (!agent.enabled || !agent.everyMs) {
                                return "disabled (".concat(agent.agentId, ")");
                            }
                            var everyLabel = agent.every;
                            return "".concat(everyLabel, " (").concat(agent.agentId, ")");
                        })
                            .filter(Boolean);
                        return parts.length > 0 ? parts.join(", ") : "disabled";
                    })();
                    storeLabel = summary.sessions.paths.length > 1
                        ? "".concat(summary.sessions.paths.length, " stores")
                        : ((_q = summary.sessions.paths[0]) !== null && _q !== void 0 ? _q : "unknown");
                    memoryValue = (function () {
                        var _a;
                        if (!memoryPlugin.enabled) {
                            var suffix = memoryPlugin.reason ? " (".concat(memoryPlugin.reason, ")") : "";
                            return muted("disabled".concat(suffix));
                        }
                        if (!memory) {
                            var slot = memoryPlugin.slot ? "plugin ".concat(memoryPlugin.slot) : "plugin";
                            return muted("enabled (".concat(slot, ") \u00B7 unavailable"));
                        }
                        var parts = [];
                        var dirtySuffix = memory.dirty ? " \u00B7 ".concat(warn("dirty")) : "";
                        parts.push("".concat(memory.files, " files \u00B7 ").concat(memory.chunks, " chunks").concat(dirtySuffix));
                        if ((_a = memory.sources) === null || _a === void 0 ? void 0 : _a.length) {
                            parts.push("sources ".concat(memory.sources.join(", ")));
                        }
                        if (memoryPlugin.slot) {
                            parts.push("plugin ".concat(memoryPlugin.slot));
                        }
                        var colorByTone = function (tone, text) {
                            return tone === "ok" ? ok(text) : tone === "warn" ? warn(text) : muted(text);
                        };
                        var vector = memory.vector;
                        if (vector) {
                            var state = (0, status_format_js_1.resolveMemoryVectorState)(vector);
                            var label = state.state === "disabled" ? "vector off" : "vector ".concat(state.state);
                            parts.push(colorByTone(state.tone, label));
                        }
                        var fts = memory.fts;
                        if (fts) {
                            var state = (0, status_format_js_1.resolveMemoryFtsState)(fts);
                            var label = state.state === "disabled" ? "fts off" : "fts ".concat(state.state);
                            parts.push(colorByTone(state.tone, label));
                        }
                        var cache = memory.cache;
                        if (cache) {
                            var summary_1 = (0, status_format_js_1.resolveMemoryCacheSummary)(cache);
                            parts.push(colorByTone(summary_1.tone, summary_1.text));
                        }
                        return parts.join(" · ");
                    })();
                    updateAvailability = (0, status_update_js_1.resolveUpdateAvailability)(update);
                    updateLine = (0, status_update_js_1.formatUpdateOneLiner)(update).replace(/^Update:\s*/i, "");
                    channelLabel = (0, update_channels_js_1.formatUpdateChannelLabel)({
                        channel: channelInfo.channel,
                        source: channelInfo.source,
                        gitTag: (_s = (_r = update.git) === null || _r === void 0 ? void 0 : _r.tag) !== null && _s !== void 0 ? _s : null,
                        gitBranch: (_u = (_t = update.git) === null || _t === void 0 ? void 0 : _t.branch) !== null && _u !== void 0 ? _u : null,
                    });
                    gitLabel = update.installKind === "git"
                        ? (function () {
                            var _a, _b, _c, _d;
                            var shortSha = ((_a = update.git) === null || _a === void 0 ? void 0 : _a.sha) ? update.git.sha.slice(0, 8) : null;
                            var branch = ((_b = update.git) === null || _b === void 0 ? void 0 : _b.branch) && update.git.branch !== "HEAD" ? update.git.branch : null;
                            var tag = (_d = (_c = update.git) === null || _c === void 0 ? void 0 : _c.tag) !== null && _d !== void 0 ? _d : null;
                            var parts = [
                                branch !== null && branch !== void 0 ? branch : (tag ? "detached" : "git"),
                                tag ? "tag ".concat(tag) : null,
                                shortSha ? "@ ".concat(shortSha) : null,
                            ].filter(Boolean);
                            return parts.join(" · ");
                        })()
                        : null;
                    overviewRows = __spreadArray(__spreadArray([
                        { Item: "Dashboard", Value: dashboard },
                        { Item: "OS", Value: "".concat(osSummary.label, " \u00B7 node ").concat(process.versions.node) },
                        {
                            Item: "Tailscale",
                            Value: tailscaleMode === "off"
                                ? muted("off")
                                : tailscaleDns && tailscaleHttpsUrl
                                    ? "".concat(tailscaleMode, " \u00B7 ").concat(tailscaleDns, " \u00B7 ").concat(tailscaleHttpsUrl)
                                    : warn("".concat(tailscaleMode, " \u00B7 magicdns unknown")),
                        },
                        { Item: "Channel", Value: channelLabel }
                    ], (gitLabel ? [{ Item: "Git", Value: gitLabel }] : []), true), [
                        {
                            Item: "Update",
                            Value: updateAvailability.available ? warn("available \u00B7 ".concat(updateLine)) : updateLine,
                        },
                        { Item: "Gateway", Value: gatewayValue },
                        { Item: "Gateway service", Value: daemonValue },
                        { Item: "Node service", Value: nodeDaemonValue },
                        { Item: "Agents", Value: agentsValue },
                        { Item: "Memory", Value: memoryValue },
                        { Item: "Probes", Value: probesValue },
                        { Item: "Events", Value: eventsValue },
                        { Item: "Heartbeat", Value: heartbeatValue },
                        {
                            Item: "Sessions",
                            Value: "".concat(summary.sessions.count, " active \u00B7 default ").concat((_v = defaults.model) !== null && _v !== void 0 ? _v : "unknown").concat(defaultCtx, " \u00B7 ").concat(storeLabel),
                        },
                    ], false);
                    runtime.log(theme_js_1.theme.heading("OpenClaw status"));
                    runtime.log("");
                    runtime.log(theme_js_1.theme.heading("Overview"));
                    runtime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Item", header: "Item", minWidth: 12 },
                            { key: "Value", header: "Value", flex: true, minWidth: 32 },
                        ],
                        rows: overviewRows,
                    }).trimEnd());
                    runtime.log("");
                    runtime.log(theme_js_1.theme.heading("Security audit"));
                    fmtSummary = function (value) {
                        var parts = [
                            theme_js_1.theme.error("".concat(value.critical, " critical")),
                            theme_js_1.theme.warn("".concat(value.warn, " warn")),
                            theme_js_1.theme.muted("".concat(value.info, " info")),
                        ];
                        return parts.join(" · ");
                    };
                    runtime.log(theme_js_1.theme.muted("Summary: ".concat(fmtSummary(securityAudit.summary))));
                    importantFindings = securityAudit.findings.filter(function (f) { return f.severity === "critical" || f.severity === "warn"; });
                    if (importantFindings.length === 0) {
                        runtime.log(theme_js_1.theme.muted("No critical or warn findings detected."));
                    }
                    else {
                        severityLabel = function (sev) {
                            if (sev === "critical") {
                                return theme_js_1.theme.error("CRITICAL");
                            }
                            if (sev === "warn") {
                                return theme_js_1.theme.warn("WARN");
                            }
                            return theme_js_1.theme.muted("INFO");
                        };
                        sevRank_1 = function (sev) {
                            return sev === "critical" ? 0 : sev === "warn" ? 1 : 2;
                        };
                        sorted = __spreadArray([], importantFindings, true).toSorted(function (a, b) { return sevRank_1(a.severity) - sevRank_1(b.severity); });
                        shown = sorted.slice(0, 6);
                        for (_f = 0, shown_1 = shown; _f < shown_1.length; _f++) {
                            f = shown_1[_f];
                            runtime.log("  ".concat(severityLabel(f.severity), " ").concat(f.title));
                            runtime.log("    ".concat((0, status_format_js_2.shortenText)(f.detail.replaceAll("\n", " "), 160)));
                            if ((_w = f.remediation) === null || _w === void 0 ? void 0 : _w.trim()) {
                                runtime.log("    ".concat(theme_js_1.theme.muted("Fix: ".concat(f.remediation.trim()))));
                            }
                        }
                        if (sorted.length > shown.length) {
                            runtime.log(theme_js_1.theme.muted("\u2026 +".concat(sorted.length - shown.length, " more")));
                        }
                    }
                    runtime.log(theme_js_1.theme.muted("Full report: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit"))));
                    runtime.log(theme_js_1.theme.muted("Deep probe: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep"))));
                    runtime.log("");
                    runtime.log(theme_js_1.theme.heading("Channels"));
                    channelIssuesByChannel = (function () {
                        var map = new Map();
                        for (var _i = 0, channelIssues_1 = channelIssues; _i < channelIssues_1.length; _i++) {
                            var issue = channelIssues_1[_i];
                            var key = issue.channel;
                            var list = map.get(key);
                            if (list) {
                                list.push(issue);
                            }
                            else {
                                map.set(key, [issue]);
                            }
                        }
                        return map;
                    })();
                    runtime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Channel", header: "Channel", minWidth: 10 },
                            { key: "Enabled", header: "Enabled", minWidth: 7 },
                            { key: "State", header: "State", minWidth: 8 },
                            { key: "Detail", header: "Detail", flex: true, minWidth: 24 },
                        ],
                        rows: channels.rows.map(function (row) {
                            var _a, _b, _c;
                            var issues = (_a = channelIssuesByChannel.get(row.id)) !== null && _a !== void 0 ? _a : [];
                            var effectiveState = row.state === "off" ? "off" : issues.length > 0 ? "warn" : row.state;
                            var issueSuffix = issues.length > 0
                                ? " \u00B7 ".concat(warn("gateway: ".concat((0, status_format_js_2.shortenText)((_c = (_b = issues[0]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "issue", 84))))
                                : "";
                            return {
                                Channel: row.label,
                                Enabled: row.enabled ? ok("ON") : muted("OFF"),
                                State: effectiveState === "ok"
                                    ? ok("OK")
                                    : effectiveState === "warn"
                                        ? warn("WARN")
                                        : effectiveState === "off"
                                            ? muted("OFF")
                                            : theme_js_1.theme.accentDim("SETUP"),
                                Detail: "".concat(row.detail).concat(issueSuffix),
                            };
                        }),
                    }).trimEnd());
                    runtime.log("");
                    runtime.log(theme_js_1.theme.heading("Sessions"));
                    runtime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Key", header: "Key", minWidth: 20, flex: true },
                            { key: "Kind", header: "Kind", minWidth: 6 },
                            { key: "Age", header: "Age", minWidth: 9 },
                            { key: "Model", header: "Model", minWidth: 14 },
                            { key: "Tokens", header: "Tokens", minWidth: 16 },
                        ],
                        rows: summary.sessions.recent.length > 0
                            ? summary.sessions.recent.map(function (sess) {
                                var _a;
                                return ({
                                    Key: (0, status_format_js_2.shortenText)(sess.key, 32),
                                    Kind: sess.kind,
                                    Age: sess.updatedAt ? (0, status_format_js_2.formatAge)(sess.age) : "no activity",
                                    Model: (_a = sess.model) !== null && _a !== void 0 ? _a : "unknown",
                                    Tokens: (0, status_format_js_2.formatTokensCompact)(sess),
                                });
                            })
                            : [
                                {
                                    Key: muted("no sessions yet"),
                                    Kind: "",
                                    Age: "",
                                    Model: "",
                                    Tokens: "",
                                },
                            ],
                    }).trimEnd());
                    if (summary.queuedSystemEvents.length > 0) {
                        runtime.log("");
                        runtime.log(theme_js_1.theme.heading("System events"));
                        runtime.log((0, table_js_1.renderTable)({
                            width: tableWidth,
                            columns: [{ key: "Event", header: "Event", flex: true, minWidth: 24 }],
                            rows: summary.queuedSystemEvents.slice(0, 5).map(function (event) { return ({
                                Event: event,
                            }); }),
                        }).trimEnd());
                        if (summary.queuedSystemEvents.length > 5) {
                            runtime.log(muted("\u2026 +".concat(summary.queuedSystemEvents.length - 5, " more")));
                        }
                    }
                    if (health) {
                        runtime.log("");
                        runtime.log(theme_js_1.theme.heading("Health"));
                        rows = [];
                        rows.push({
                            Item: "Gateway",
                            Status: ok("reachable"),
                            Detail: "".concat(health.durationMs, "ms"),
                        });
                        _loop_1 = function (line) {
                            var colon = line.indexOf(":");
                            if (colon === -1) {
                                return "continue";
                            }
                            var item = line.slice(0, colon).trim();
                            var detail = line.slice(colon + 1).trim();
                            var normalized = detail.toLowerCase();
                            var status_1 = (function () {
                                if (normalized.startsWith("ok")) {
                                    return ok("OK");
                                }
                                if (normalized.startsWith("failed")) {
                                    return warn("WARN");
                                }
                                if (normalized.startsWith("not configured")) {
                                    return muted("OFF");
                                }
                                if (normalized.startsWith("configured")) {
                                    return ok("OK");
                                }
                                if (normalized.startsWith("linked")) {
                                    return ok("LINKED");
                                }
                                if (normalized.startsWith("not linked")) {
                                    return warn("UNLINKED");
                                }
                                return warn("WARN");
                            })();
                            rows.push({ Item: item, Status: status_1, Detail: detail });
                        };
                        for (_g = 0, _h = (0, health_js_1.formatHealthChannelLines)(health, { accountMode: "all" }); _g < _h.length; _g++) {
                            line = _h[_g];
                            _loop_1(line);
                        }
                        runtime.log((0, table_js_1.renderTable)({
                            width: tableWidth,
                            columns: [
                                { key: "Item", header: "Item", minWidth: 10 },
                                { key: "Status", header: "Status", minWidth: 8 },
                                { key: "Detail", header: "Detail", flex: true, minWidth: 28 },
                            ],
                            rows: rows,
                        }).trimEnd());
                    }
                    if (usage) {
                        runtime.log("");
                        runtime.log(theme_js_1.theme.heading("Usage"));
                        for (_j = 0, _k = (0, provider_usage_js_1.formatUsageReportLines)(usage); _j < _k.length; _j++) {
                            line = _k[_j];
                            runtime.log(line);
                        }
                    }
                    runtime.log("");
                    runtime.log("FAQ: https://docs.openclaw.ai/faq");
                    runtime.log("Troubleshooting: https://docs.openclaw.ai/troubleshooting");
                    runtime.log("");
                    updateHint = (0, status_update_js_1.formatUpdateAvailableHint)(update);
                    if (updateHint) {
                        runtime.log(theme_js_1.theme.warn(updateHint));
                        runtime.log("");
                    }
                    runtime.log("Next steps:");
                    runtime.log("  Need to share?      ".concat((0, command_format_js_1.formatCliCommand)("openclaw status --all")));
                    runtime.log("  Need to debug live? ".concat((0, command_format_js_1.formatCliCommand)("openclaw logs --follow")));
                    if (gatewayReachable) {
                        runtime.log("  Need to test channels? ".concat((0, command_format_js_1.formatCliCommand)("openclaw status --deep")));
                    }
                    else {
                        runtime.log("  Fix reachability first: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway probe")));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
