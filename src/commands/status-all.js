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
exports.statusAllCommand = statusAllCommand;
var skills_status_js_1 = require("../agents/skills-status.js");
var command_format_js_1 = require("../cli/command-format.js");
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var diagnostics_js_1 = require("../daemon/diagnostics.js");
var node_service_js_1 = require("../daemon/node-service.js");
var service_js_1 = require("../daemon/service.js");
var call_js_1 = require("../gateway/call.js");
var control_ui_shared_js_1 = require("../gateway/control-ui-shared.js");
var probe_js_1 = require("../gateway/probe.js");
var channels_status_issues_js_1 = require("../infra/channels-status-issues.js");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var os_summary_js_1 = require("../infra/os-summary.js");
var ports_js_1 = require("../infra/ports.js");
var restart_sentinel_js_1 = require("../infra/restart-sentinel.js");
var skills_remote_js_1 = require("../infra/skills-remote.js");
var tailscale_js_1 = require("../infra/tailscale.js");
var update_channels_js_1 = require("../infra/update-channels.js");
var update_check_js_1 = require("../infra/update-check.js");
var exec_js_1 = require("../process/exec.js");
var version_js_1 = require("../version.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var agents_js_1 = require("./status-all/agents.js");
var channels_js_1 = require("./status-all/channels.js");
var format_js_1 = require("./status-all/format.js");
var gateway_js_1 = require("./status-all/gateway.js");
var report_lines_js_1 = require("./status-all/report-lines.js");
function statusAllCommand(runtime, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, progress_js_1.withProgress)({ label: "Scanning status --all…", total: 11 }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                        var cfg, osSummary, snap, tailscaleMode, tailscale, tailscaleHttpsUrl, root, update, configChannel, channelInfo, channelLabel, gitLabel, connection, isRemoteMode, remoteUrlRaw, remoteUrlMissing, gatewayMode, resolveProbeAuth, localFallbackAuth, remoteAuth, probeAuth, gatewayProbe, gatewayReachable, gatewaySelf, readServiceSummary, daemon, nodeService, agentStatus, channels, connectionDetailsForReport, callOverrides, health, _a, channelsStatus, _b, channelIssues, sentinel, lastErr, port, portUsage, defaultWorkspace, skillStatus, controlUiEnabled, dashboard, updateLine, gatewayTarget, gatewayStatus, gatewayAuth, gatewaySelfLine, aliveThresholdMs, aliveAgents, overviewRows, lines;
                        var _this = this;
                        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
                        return __generator(this, function (_15) {
                            switch (_15.label) {
                                case 0:
                                    progress.setLabel("Loading config…");
                                    cfg = (0, config_js_1.loadConfig)();
                                    osSummary = (0, os_summary_js_1.resolveOsSummary)();
                                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)().catch(function () { return null; })];
                                case 1:
                                    snap = _15.sent();
                                    progress.tick();
                                    progress.setLabel("Checking Tailscale…");
                                    tailscaleMode = (_e = (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.tailscale) === null || _d === void 0 ? void 0 : _d.mode) !== null && _e !== void 0 ? _e : "off";
                                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                            var parsed, backendState, self_1, dnsNameRaw, dnsName, ips, err_1;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, (0, tailscale_js_1.readTailscaleStatusJson)(exec_js_1.runExec, {
                                                                timeoutMs: 1200,
                                                            })];
                                                    case 1:
                                                        parsed = _a.sent();
                                                        backendState = typeof parsed.BackendState === "string" ? parsed.BackendState : null;
                                                        self_1 = typeof parsed.Self === "object" && parsed.Self !== null
                                                            ? parsed.Self
                                                            : null;
                                                        dnsNameRaw = self_1 && typeof self_1.DNSName === "string" ? self_1.DNSName : null;
                                                        dnsName = dnsNameRaw ? dnsNameRaw.replace(/\.$/, "") : null;
                                                        ips = self_1 && Array.isArray(self_1.TailscaleIPs)
                                                            ? self_1.TailscaleIPs
                                                                .filter(function (v) { return typeof v === "string" && v.trim().length > 0; })
                                                                .map(function (v) { return v.trim(); })
                                                            : [];
                                                        return [2 /*return*/, { ok: true, backendState: backendState, dnsName: dnsName, ips: ips, error: null }];
                                                    case 2:
                                                        err_1 = _a.sent();
                                                        return [2 /*return*/, {
                                                                ok: false,
                                                                backendState: null,
                                                                dnsName: null,
                                                                ips: [],
                                                                error: String(err_1),
                                                            }];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); })()];
                                case 2:
                                    tailscale = _15.sent();
                                    tailscaleHttpsUrl = tailscaleMode !== "off" && tailscale.dnsName
                                        ? "https://".concat(tailscale.dnsName).concat((0, control_ui_shared_js_1.normalizeControlUiBasePath)((_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.controlUi) === null || _g === void 0 ? void 0 : _g.basePath))
                                        : null;
                                    progress.tick();
                                    progress.setLabel("Checking for updates…");
                                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                                            moduleUrl: import.meta.url,
                                            argv1: process.argv[1],
                                            cwd: process.cwd(),
                                        })];
                                case 3:
                                    root = _15.sent();
                                    return [4 /*yield*/, (0, update_check_js_1.checkUpdateStatus)({
                                            root: root,
                                            timeoutMs: 6500,
                                            fetchGit: true,
                                            includeRegistry: true,
                                        })];
                                case 4:
                                    update = _15.sent();
                                    configChannel = (0, update_channels_js_1.normalizeUpdateChannel)((_h = cfg.update) === null || _h === void 0 ? void 0 : _h.channel);
                                    channelInfo = (0, update_channels_js_1.resolveEffectiveUpdateChannel)({
                                        configChannel: configChannel,
                                        installKind: update.installKind,
                                        git: update.git ? { tag: update.git.tag, branch: update.git.branch } : undefined,
                                    });
                                    channelLabel = (0, update_channels_js_1.formatUpdateChannelLabel)({
                                        channel: channelInfo.channel,
                                        source: channelInfo.source,
                                        gitTag: (_k = (_j = update.git) === null || _j === void 0 ? void 0 : _j.tag) !== null && _k !== void 0 ? _k : null,
                                        gitBranch: (_m = (_l = update.git) === null || _l === void 0 ? void 0 : _l.branch) !== null && _m !== void 0 ? _m : null,
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
                                    progress.tick();
                                    progress.setLabel("Probing gateway…");
                                    connection = (0, call_js_1.buildGatewayConnectionDetails)({ config: cfg });
                                    isRemoteMode = ((_o = cfg.gateway) === null || _o === void 0 ? void 0 : _o.mode) === "remote";
                                    remoteUrlRaw = typeof ((_q = (_p = cfg.gateway) === null || _p === void 0 ? void 0 : _p.remote) === null || _q === void 0 ? void 0 : _q.url) === "string" ? cfg.gateway.remote.url.trim() : "";
                                    remoteUrlMissing = isRemoteMode && !remoteUrlRaw;
                                    gatewayMode = isRemoteMode ? "remote" : "local";
                                    resolveProbeAuth = function (mode) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        var authToken = (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
                                        var authPassword = (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.password;
                                        var remote = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.remote;
                                        var token = mode === "remote"
                                            ? typeof (remote === null || remote === void 0 ? void 0 : remote.token) === "string" && remote.token.trim()
                                                ? remote.token.trim()
                                                : undefined
                                            : ((_f = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _f === void 0 ? void 0 : _f.trim()) ||
                                                (typeof authToken === "string" && authToken.trim() ? authToken.trim() : undefined);
                                        var password = ((_g = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _g === void 0 ? void 0 : _g.trim()) ||
                                            (mode === "remote"
                                                ? typeof (remote === null || remote === void 0 ? void 0 : remote.password) === "string" && remote.password.trim()
                                                    ? remote.password.trim()
                                                    : undefined
                                                : typeof authPassword === "string" && authPassword.trim()
                                                    ? authPassword.trim()
                                                    : undefined);
                                        return { token: token, password: password };
                                    };
                                    localFallbackAuth = resolveProbeAuth("local");
                                    remoteAuth = resolveProbeAuth("remote");
                                    probeAuth = isRemoteMode && !remoteUrlMissing ? remoteAuth : localFallbackAuth;
                                    return [4 /*yield*/, (0, probe_js_1.probeGateway)({
                                            url: connection.url,
                                            auth: probeAuth,
                                            timeoutMs: Math.min(5000, (_r = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _r !== void 0 ? _r : 10000),
                                        }).catch(function () { return null; })];
                                case 5:
                                    gatewayProbe = _15.sent();
                                    gatewayReachable = (gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.ok) === true;
                                    gatewaySelf = (0, gateway_js_1.pickGatewaySelfPresence)((_s = gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.presence) !== null && _s !== void 0 ? _s : null);
                                    progress.tick();
                                    progress.setLabel("Checking services…");
                                    readServiceSummary = function (service) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, loaded, runtimeInfo, command, installed, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _c.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, Promise.all([
                                                            service.isLoaded({ env: process.env }).catch(function () { return false; }),
                                                            service.readRuntime(process.env).catch(function () { return undefined; }),
                                                            service.readCommand(process.env).catch(function () { return null; }),
                                                        ])];
                                                case 1:
                                                    _a = _c.sent(), loaded = _a[0], runtimeInfo = _a[1], command = _a[2];
                                                    installed = command != null;
                                                    return [2 /*return*/, {
                                                            label: service.label,
                                                            installed: installed,
                                                            loaded: loaded,
                                                            loadedText: loaded ? service.loadedText : service.notLoadedText,
                                                            runtime: runtimeInfo,
                                                        }];
                                                case 2:
                                                    _b = _c.sent();
                                                    return [2 /*return*/, null];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    return [4 /*yield*/, readServiceSummary((0, service_js_1.resolveGatewayService)())];
                                case 6:
                                    daemon = _15.sent();
                                    return [4 /*yield*/, readServiceSummary((0, node_service_js_1.resolveNodeService)())];
                                case 7:
                                    nodeService = _15.sent();
                                    progress.tick();
                                    progress.setLabel("Scanning agents…");
                                    return [4 /*yield*/, (0, agents_js_1.getAgentLocalStatuses)(cfg)];
                                case 8:
                                    agentStatus = _15.sent();
                                    progress.tick();
                                    progress.setLabel("Summarizing channels…");
                                    return [4 /*yield*/, (0, channels_js_1.buildChannelsTable)(cfg, { showSecrets: false })];
                                case 9:
                                    channels = _15.sent();
                                    progress.tick();
                                    connectionDetailsForReport = (function () {
                                        var _a, _b, _c;
                                        if (!remoteUrlMissing) {
                                            return connection.message;
                                        }
                                        var bindMode = (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.bind) !== null && _b !== void 0 ? _b : "loopback";
                                        var configPath = ((_c = snap === null || snap === void 0 ? void 0 : snap.path) === null || _c === void 0 ? void 0 : _c.trim()) ? snap.path.trim() : "(unknown config path)";
                                        return [
                                            "Gateway mode: remote",
                                            "Gateway target: (missing gateway.remote.url)",
                                            "Config: ".concat(configPath),
                                            "Bind: ".concat(bindMode),
                                            "Local fallback (used for probes): ".concat(connection.url),
                                            "Fix: set gateway.remote.url, or set gateway.mode=local.",
                                        ].join("\n");
                                    })();
                                    callOverrides = remoteUrlMissing
                                        ? {
                                            url: connection.url,
                                            token: localFallbackAuth.token,
                                            password: localFallbackAuth.password,
                                        }
                                        : {};
                                    progress.setLabel("Querying gateway…");
                                    if (!gatewayReachable) return [3 /*break*/, 11];
                                    return [4 /*yield*/, (0, call_js_1.callGateway)(__assign({ method: "health", timeoutMs: Math.min(8000, (_t = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _t !== void 0 ? _t : 10000) }, callOverrides)).catch(function (err) { return ({ error: String(err) }); })];
                                case 10:
                                    _a = _15.sent();
                                    return [3 /*break*/, 12];
                                case 11:
                                    _a = { error: (_u = gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.error) !== null && _u !== void 0 ? _u : "gateway unreachable" };
                                    _15.label = 12;
                                case 12:
                                    health = _a;
                                    if (!gatewayReachable) return [3 /*break*/, 14];
                                    return [4 /*yield*/, (0, call_js_1.callGateway)(__assign({ method: "channels.status", params: { probe: false, timeoutMs: (_v = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _v !== void 0 ? _v : 10000 }, timeoutMs: Math.min(8000, (_w = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _w !== void 0 ? _w : 10000) }, callOverrides)).catch(function () { return null; })];
                                case 13:
                                    _b = _15.sent();
                                    return [3 /*break*/, 15];
                                case 14:
                                    _b = null;
                                    _15.label = 15;
                                case 15:
                                    channelsStatus = _b;
                                    channelIssues = channelsStatus ? (0, channels_status_issues_js_1.collectChannelStatusIssues)(channelsStatus) : [];
                                    progress.tick();
                                    progress.setLabel("Checking local state…");
                                    return [4 /*yield*/, (0, restart_sentinel_js_1.readRestartSentinel)().catch(function () { return null; })];
                                case 16:
                                    sentinel = _15.sent();
                                    return [4 /*yield*/, (0, diagnostics_js_1.readLastGatewayErrorLine)(process.env).catch(function () { return null; })];
                                case 17:
                                    lastErr = _15.sent();
                                    port = (0, config_js_1.resolveGatewayPort)(cfg);
                                    return [4 /*yield*/, (0, ports_js_1.inspectPortUsage)(port).catch(function () { return null; })];
                                case 18:
                                    portUsage = _15.sent();
                                    progress.tick();
                                    defaultWorkspace = (_0 = (_y = (_x = agentStatus.agents.find(function (a) { return a.id === agentStatus.defaultId; })) === null || _x === void 0 ? void 0 : _x.workspaceDir) !== null && _y !== void 0 ? _y : (_z = agentStatus.agents[0]) === null || _z === void 0 ? void 0 : _z.workspaceDir) !== null && _0 !== void 0 ? _0 : null;
                                    skillStatus = defaultWorkspace != null
                                        ? (function () {
                                            try {
                                                return (0, skills_status_js_1.buildWorkspaceSkillStatus)(defaultWorkspace, {
                                                    config: cfg,
                                                    eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
                                                });
                                            }
                                            catch (_a) {
                                                return null;
                                            }
                                        })()
                                        : null;
                                    controlUiEnabled = (_3 = (_2 = (_1 = cfg.gateway) === null || _1 === void 0 ? void 0 : _1.controlUi) === null || _2 === void 0 ? void 0 : _2.enabled) !== null && _3 !== void 0 ? _3 : true;
                                    dashboard = controlUiEnabled
                                        ? (0, onboard_helpers_js_1.resolveControlUiLinks)({
                                            port: port,
                                            bind: (_4 = cfg.gateway) === null || _4 === void 0 ? void 0 : _4.bind,
                                            customBindHost: (_5 = cfg.gateway) === null || _5 === void 0 ? void 0 : _5.customBindHost,
                                            basePath: (_7 = (_6 = cfg.gateway) === null || _6 === void 0 ? void 0 : _6.controlUi) === null || _7 === void 0 ? void 0 : _7.basePath,
                                        }).httpUrl
                                        : null;
                                    updateLine = (function () {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                        if (update.installKind === "git" && update.git) {
                                            var parts_1 = [];
                                            parts_1.push(update.git.branch ? "git ".concat(update.git.branch) : "git");
                                            if (update.git.upstream) {
                                                parts_1.push("\u2194 ".concat(update.git.upstream));
                                            }
                                            if (update.git.dirty) {
                                                parts_1.push("dirty");
                                            }
                                            if (update.git.behind != null && update.git.ahead != null) {
                                                if (update.git.behind === 0 && update.git.ahead === 0) {
                                                    parts_1.push("up to date");
                                                }
                                                else if (update.git.behind > 0 && update.git.ahead === 0) {
                                                    parts_1.push("behind ".concat(update.git.behind));
                                                }
                                                else if (update.git.behind === 0 && update.git.ahead > 0) {
                                                    parts_1.push("ahead ".concat(update.git.ahead));
                                                }
                                                else {
                                                    parts_1.push("diverged (ahead ".concat(update.git.ahead, ", behind ").concat(update.git.behind, ")"));
                                                }
                                            }
                                            if (update.git.fetchOk === false) {
                                                parts_1.push("fetch failed");
                                            }
                                            var latest_1 = (_a = update.registry) === null || _a === void 0 ? void 0 : _a.latestVersion;
                                            if (latest_1) {
                                                var cmp = (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, latest_1);
                                                if (cmp === 0) {
                                                    parts_1.push("npm latest ".concat(latest_1));
                                                }
                                                else if (cmp != null && cmp < 0) {
                                                    parts_1.push("npm update ".concat(latest_1));
                                                }
                                                else {
                                                    parts_1.push("npm latest ".concat(latest_1, " (local newer)"));
                                                }
                                            }
                                            else if ((_b = update.registry) === null || _b === void 0 ? void 0 : _b.error) {
                                                parts_1.push("npm latest unknown");
                                            }
                                            if (((_c = update.deps) === null || _c === void 0 ? void 0 : _c.status) === "ok") {
                                                parts_1.push("deps ok");
                                            }
                                            if (((_d = update.deps) === null || _d === void 0 ? void 0 : _d.status) === "stale") {
                                                parts_1.push("deps stale");
                                            }
                                            if (((_e = update.deps) === null || _e === void 0 ? void 0 : _e.status) === "missing") {
                                                parts_1.push("deps missing");
                                            }
                                            return parts_1.join(" · ");
                                        }
                                        var parts = [];
                                        parts.push(update.packageManager !== "unknown" ? update.packageManager : "pkg");
                                        var latest = (_f = update.registry) === null || _f === void 0 ? void 0 : _f.latestVersion;
                                        if (latest) {
                                            var cmp = (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, latest);
                                            if (cmp === 0) {
                                                parts.push("npm latest ".concat(latest));
                                            }
                                            else if (cmp != null && cmp < 0) {
                                                parts.push("npm update ".concat(latest));
                                            }
                                            else {
                                                parts.push("npm latest ".concat(latest, " (local newer)"));
                                            }
                                        }
                                        else if ((_g = update.registry) === null || _g === void 0 ? void 0 : _g.error) {
                                            parts.push("npm latest unknown");
                                        }
                                        if (((_h = update.deps) === null || _h === void 0 ? void 0 : _h.status) === "ok") {
                                            parts.push("deps ok");
                                        }
                                        if (((_j = update.deps) === null || _j === void 0 ? void 0 : _j.status) === "stale") {
                                            parts.push("deps stale");
                                        }
                                        if (((_k = update.deps) === null || _k === void 0 ? void 0 : _k.status) === "missing") {
                                            parts.push("deps missing");
                                        }
                                        return parts.join(" · ");
                                    })();
                                    gatewayTarget = remoteUrlMissing ? "fallback ".concat(connection.url) : connection.url;
                                    gatewayStatus = gatewayReachable
                                        ? "reachable ".concat((0, format_js_1.formatDuration)(gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.connectLatencyMs))
                                        : (gatewayProbe === null || gatewayProbe === void 0 ? void 0 : gatewayProbe.error)
                                            ? "unreachable (".concat(gatewayProbe.error, ")")
                                            : "unreachable";
                                    gatewayAuth = gatewayReachable ? " \u00B7 auth ".concat((0, format_js_1.formatGatewayAuthUsed)(probeAuth)) : "";
                                    gatewaySelfLine = (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.host) || (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.ip) || (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.version) || (gatewaySelf === null || gatewaySelf === void 0 ? void 0 : gatewaySelf.platform)
                                        ? [
                                            gatewaySelf.host ? gatewaySelf.host : null,
                                            gatewaySelf.ip ? "(".concat(gatewaySelf.ip, ")") : null,
                                            gatewaySelf.version ? "app ".concat(gatewaySelf.version) : null,
                                            gatewaySelf.platform ? gatewaySelf.platform : null,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")
                                        : null;
                                    aliveThresholdMs = 10 * 60000;
                                    aliveAgents = agentStatus.agents.filter(function (a) { return a.lastActiveAgeMs != null && a.lastActiveAgeMs <= aliveThresholdMs; }).length;
                                    overviewRows = __spreadArray(__spreadArray([
                                        { Item: "Version", Value: version_js_1.VERSION },
                                        { Item: "OS", Value: osSummary.label },
                                        { Item: "Node", Value: process.versions.node },
                                        {
                                            Item: "Config",
                                            Value: ((_8 = snap === null || snap === void 0 ? void 0 : snap.path) === null || _8 === void 0 ? void 0 : _8.trim()) ? snap.path.trim() : "(unknown config path)",
                                        },
                                        dashboard
                                            ? { Item: "Dashboard", Value: dashboard }
                                            : { Item: "Dashboard", Value: "disabled" },
                                        {
                                            Item: "Tailscale",
                                            Value: tailscaleMode === "off"
                                                ? "off".concat(tailscale.backendState ? " \u00B7 ".concat(tailscale.backendState) : "").concat(tailscale.dnsName ? " \u00B7 ".concat(tailscale.dnsName) : "")
                                                : tailscale.dnsName && tailscaleHttpsUrl
                                                    ? "".concat(tailscaleMode, " \u00B7 ").concat((_9 = tailscale.backendState) !== null && _9 !== void 0 ? _9 : "unknown", " \u00B7 ").concat(tailscale.dnsName, " \u00B7 ").concat(tailscaleHttpsUrl)
                                                    : "".concat(tailscaleMode, " \u00B7 ").concat((_10 = tailscale.backendState) !== null && _10 !== void 0 ? _10 : "unknown", " \u00B7 magicdns unknown"),
                                        },
                                        { Item: "Channel", Value: channelLabel }
                                    ], (gitLabel ? [{ Item: "Git", Value: gitLabel }] : []), true), [
                                        { Item: "Update", Value: updateLine },
                                        {
                                            Item: "Gateway",
                                            Value: "".concat(gatewayMode).concat(remoteUrlMissing ? " (remote.url missing)" : "", " \u00B7 ").concat(gatewayTarget, " (").concat(connection.urlSource, ") \u00B7 ").concat(gatewayStatus).concat(gatewayAuth),
                                        },
                                        { Item: "Security", Value: "Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep")) },
                                        gatewaySelfLine
                                            ? { Item: "Gateway self", Value: gatewaySelfLine }
                                            : { Item: "Gateway self", Value: "unknown" },
                                        daemon
                                            ? {
                                                Item: "Gateway service",
                                                Value: !daemon.installed
                                                    ? "".concat(daemon.label, " not installed")
                                                    : "".concat(daemon.label, " ").concat(daemon.installed ? "installed · " : "").concat(daemon.loadedText).concat(((_11 = daemon.runtime) === null || _11 === void 0 ? void 0 : _11.status) ? " \u00B7 ".concat(daemon.runtime.status) : "").concat(((_12 = daemon.runtime) === null || _12 === void 0 ? void 0 : _12.pid) ? " (pid ".concat(daemon.runtime.pid, ")") : ""),
                                            }
                                            : { Item: "Gateway service", Value: "unknown" },
                                        nodeService
                                            ? {
                                                Item: "Node service",
                                                Value: !nodeService.installed
                                                    ? "".concat(nodeService.label, " not installed")
                                                    : "".concat(nodeService.label, " ").concat(nodeService.installed ? "installed · " : "").concat(nodeService.loadedText).concat(((_13 = nodeService.runtime) === null || _13 === void 0 ? void 0 : _13.status) ? " \u00B7 ".concat(nodeService.runtime.status) : "").concat(((_14 = nodeService.runtime) === null || _14 === void 0 ? void 0 : _14.pid) ? " (pid ".concat(nodeService.runtime.pid, ")") : ""),
                                            }
                                            : { Item: "Node service", Value: "unknown" },
                                        {
                                            Item: "Agents",
                                            Value: "".concat(agentStatus.agents.length, " total \u00B7 ").concat(agentStatus.bootstrapPendingCount, " bootstrapping \u00B7 ").concat(aliveAgents, " active \u00B7 ").concat(agentStatus.totalSessions, " sessions"),
                                        },
                                    ], false);
                                    return [4 /*yield*/, (0, report_lines_js_1.buildStatusAllReportLines)({
                                            progress: progress,
                                            overviewRows: overviewRows,
                                            channels: channels,
                                            channelIssues: channelIssues.map(function (issue) { return ({
                                                channel: issue.channel,
                                                message: issue.message,
                                            }); }),
                                            agentStatus: agentStatus,
                                            connectionDetailsForReport: connectionDetailsForReport,
                                            diagnosis: {
                                                snap: snap,
                                                remoteUrlMissing: remoteUrlMissing,
                                                sentinel: sentinel,
                                                lastErr: lastErr,
                                                port: port,
                                                portUsage: portUsage,
                                                tailscaleMode: tailscaleMode,
                                                tailscale: tailscale,
                                                tailscaleHttpsUrl: tailscaleHttpsUrl,
                                                skillStatus: skillStatus,
                                                channelsStatus: channelsStatus,
                                                channelIssues: channelIssues,
                                                gatewayReachable: gatewayReachable,
                                                health: health,
                                            },
                                        })];
                                case 19:
                                    lines = _15.sent();
                                    progress.setLabel("Rendering…");
                                    runtime.log(lines.join("\n"));
                                    progress.tick();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
