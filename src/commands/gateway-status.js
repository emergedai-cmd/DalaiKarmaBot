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
exports.gatewayStatusCommand = gatewayStatusCommand;
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var probe_js_1 = require("../gateway/probe.js");
var bonjour_discovery_js_1 = require("../infra/bonjour-discovery.js");
var ssh_config_js_1 = require("../infra/ssh-config.js");
var ssh_tunnel_js_1 = require("../infra/ssh-tunnel.js");
var widearea_dns_js_1 = require("../infra/widearea-dns.js");
var theme_js_1 = require("../terminal/theme.js");
var helpers_js_1 = require("./gateway-status/helpers.js");
function gatewayStatusCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var startedAt, cfg, rich, overallTimeoutMs, wideAreaDomain, baseTargets, network, discoveryTimeoutMs, discoveryPromise, sshTarget, sshIdentity, remotePort, sshTunnelError, sshTunnelStarted, resolved, _a, discovery, probed, reachable, ok, multipleGateways, primary, warnings, _i, warnings_1, w, discoveryDomains, _b, probed_1, p, host, ip, platform, version, c, wideArea;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    startedAt = Date.now();
                    cfg = (0, config_js_1.loadConfig)();
                    rich = (0, theme_js_1.isRich)() && opts.json !== true;
                    overallTimeoutMs = (0, helpers_js_1.parseTimeoutMs)(opts.timeout, 3000);
                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({
                        configDomain: (_d = (_c = cfg.discovery) === null || _c === void 0 ? void 0 : _c.wideArea) === null || _d === void 0 ? void 0 : _d.domain,
                    });
                    baseTargets = (0, helpers_js_1.resolveTargets)(cfg, opts.url);
                    network = (0, helpers_js_1.buildNetworkHints)(cfg);
                    discoveryTimeoutMs = Math.min(1200, overallTimeoutMs);
                    discoveryPromise = (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                        timeoutMs: discoveryTimeoutMs,
                        wideAreaDomain: wideAreaDomain,
                    });
                    sshTarget = (_e = (0, helpers_js_1.sanitizeSshTarget)(opts.ssh)) !== null && _e !== void 0 ? _e : (0, helpers_js_1.sanitizeSshTarget)((_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.remote) === null || _g === void 0 ? void 0 : _g.sshTarget);
                    sshIdentity = (_h = (0, helpers_js_1.sanitizeSshTarget)(opts.sshIdentity)) !== null && _h !== void 0 ? _h : (0, helpers_js_1.sanitizeSshTarget)((_k = (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.remote) === null || _k === void 0 ? void 0 : _k.sshIdentity);
                    remotePort = (0, config_js_1.resolveGatewayPort)(cfg);
                    sshTunnelError = null;
                    sshTunnelStarted = false;
                    if (!sshTarget) {
                        sshTarget = inferSshTargetFromRemoteUrl((_m = (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.remote) === null || _m === void 0 ? void 0 : _m.url);
                    }
                    if (!sshTarget) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveSshTarget(sshTarget, sshIdentity, overallTimeoutMs)];
                case 1:
                    resolved = _v.sent();
                    if (resolved) {
                        sshTarget = resolved.target;
                        if (!sshIdentity && resolved.identity) {
                            sshIdentity = resolved.identity;
                        }
                    }
                    _v.label = 2;
                case 2: return [4 /*yield*/, (0, progress_js_1.withProgress)({
                        label: "Inspecting gateways…",
                        indeterminate: true,
                        enabled: opts.json !== true,
                    }, function () { return __awaiter(_this, void 0, void 0, function () {
                        var tryStartTunnel, discoveryTask, tunnelTask, _a, discovery, tunnelFirst, user_1, candidates, tunnel, _b, _c, tunnelTarget, targets, probed_2, _d;
                        var _this = this;
                        var _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    tryStartTunnel = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var tunnel_1, err_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!sshTarget) {
                                                        return [2 /*return*/, null];
                                                    }
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, (0, ssh_tunnel_js_1.startSshPortForward)({
                                                            target: sshTarget,
                                                            identity: sshIdentity !== null && sshIdentity !== void 0 ? sshIdentity : undefined,
                                                            localPortPreferred: remotePort,
                                                            remotePort: remotePort,
                                                            timeoutMs: Math.min(1500, overallTimeoutMs),
                                                        })];
                                                case 2:
                                                    tunnel_1 = _a.sent();
                                                    sshTunnelStarted = true;
                                                    return [2 /*return*/, tunnel_1];
                                                case 3:
                                                    err_1 = _a.sent();
                                                    sshTunnelError = err_1 instanceof Error ? err_1.message : String(err_1);
                                                    return [2 /*return*/, null];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    discoveryTask = discoveryPromise.catch(function () { return []; });
                                    tunnelTask = sshTarget ? tryStartTunnel() : Promise.resolve(null);
                                    return [4 /*yield*/, Promise.all([discoveryTask, tunnelTask])];
                                case 1:
                                    _a = _g.sent(), discovery = _a[0], tunnelFirst = _a[1];
                                    if (!sshTarget && opts.sshAuto) {
                                        user_1 = ((_e = process.env.USER) === null || _e === void 0 ? void 0 : _e.trim()) || "";
                                        candidates = discovery
                                            .map(function (b) {
                                            var host = b.tailnetDns || b.lanHost || b.host;
                                            if (!(host === null || host === void 0 ? void 0 : host.trim())) {
                                                return null;
                                            }
                                            var sshPort = typeof b.sshPort === "number" && b.sshPort > 0 ? b.sshPort : 22;
                                            var base = user_1 ? "".concat(user_1, "@").concat(host.trim()) : host.trim();
                                            return sshPort !== 22 ? "".concat(base, ":").concat(sshPort) : base;
                                        })
                                            .filter(function (candidate) {
                                            return Boolean(candidate && (0, ssh_tunnel_js_1.parseSshTarget)(candidate));
                                        });
                                        if (candidates.length > 0) {
                                            sshTarget = (_f = candidates[0]) !== null && _f !== void 0 ? _f : null;
                                        }
                                    }
                                    _b = tunnelFirst;
                                    if (_b) return [3 /*break*/, 5];
                                    if (!(sshTarget && !sshTunnelStarted && !sshTunnelError)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, tryStartTunnel()];
                                case 2:
                                    _c = _g.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    _c = null;
                                    _g.label = 4;
                                case 4:
                                    _b = (_c);
                                    _g.label = 5;
                                case 5:
                                    tunnel = _b;
                                    tunnelTarget = tunnel
                                        ? {
                                            id: "sshTunnel",
                                            kind: "sshTunnel",
                                            url: "ws://127.0.0.1:".concat(tunnel.localPort),
                                            active: true,
                                            tunnel: {
                                                kind: "ssh",
                                                target: sshTarget !== null && sshTarget !== void 0 ? sshTarget : "",
                                                localPort: tunnel.localPort,
                                                remotePort: remotePort,
                                                pid: tunnel.pid,
                                            },
                                        }
                                        : null;
                                    targets = tunnelTarget
                                        ? __spreadArray([tunnelTarget], baseTargets.filter(function (t) { return t.url !== tunnelTarget.url; }), true) : baseTargets;
                                    _g.label = 6;
                                case 6:
                                    _g.trys.push([6, , 8, 13]);
                                    return [4 /*yield*/, Promise.all(targets.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
                                            var auth, timeoutMs, probe, configSummary, self;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        auth = (0, helpers_js_1.resolveAuthForTarget)(cfg, target, {
                                                            token: typeof opts.token === "string" ? opts.token : undefined,
                                                            password: typeof opts.password === "string" ? opts.password : undefined,
                                                        });
                                                        timeoutMs = (0, helpers_js_1.resolveProbeBudgetMs)(overallTimeoutMs, target.kind);
                                                        return [4 /*yield*/, (0, probe_js_1.probeGateway)({
                                                                url: target.url,
                                                                auth: auth,
                                                                timeoutMs: timeoutMs,
                                                            })];
                                                    case 1:
                                                        probe = _a.sent();
                                                        configSummary = probe.configSnapshot
                                                            ? (0, helpers_js_1.extractConfigSummary)(probe.configSnapshot)
                                                            : null;
                                                        self = (0, helpers_js_1.pickGatewaySelfPresence)(probe.presence);
                                                        return [2 /*return*/, { target: target, probe: probe, configSummary: configSummary, self: self }];
                                                }
                                            });
                                        }); }))];
                                case 7:
                                    probed_2 = _g.sent();
                                    return [2 /*return*/, { discovery: discovery, probed: probed_2 }];
                                case 8:
                                    if (!tunnel) return [3 /*break*/, 12];
                                    _g.label = 9;
                                case 9:
                                    _g.trys.push([9, 11, , 12]);
                                    return [4 /*yield*/, tunnel.stop()];
                                case 10:
                                    _g.sent();
                                    return [3 /*break*/, 12];
                                case 11:
                                    _d = _g.sent();
                                    return [3 /*break*/, 12];
                                case 12: return [7 /*endfinally*/];
                                case 13: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 3:
                    _a = _v.sent(), discovery = _a.discovery, probed = _a.probed;
                    reachable = probed.filter(function (p) { return p.probe.ok; });
                    ok = reachable.length > 0;
                    multipleGateways = reachable.length > 1;
                    primary = (_r = (_q = (_p = (_o = reachable.find(function (p) { return p.target.kind === "explicit"; })) !== null && _o !== void 0 ? _o : reachable.find(function (p) { return p.target.kind === "sshTunnel"; })) !== null && _p !== void 0 ? _p : reachable.find(function (p) { return p.target.kind === "configRemote"; })) !== null && _q !== void 0 ? _q : reachable.find(function (p) { return p.target.kind === "localLoopback"; })) !== null && _r !== void 0 ? _r : null;
                    warnings = [];
                    if (sshTarget && !sshTunnelStarted) {
                        warnings.push({
                            code: "ssh_tunnel_failed",
                            message: sshTunnelError
                                ? "SSH tunnel failed: ".concat(String(sshTunnelError))
                                : "SSH tunnel failed to start; falling back to direct probes.",
                        });
                    }
                    if (multipleGateways) {
                        warnings.push({
                            code: "multiple_gateways",
                            message: "Unconventional setup: multiple reachable gateways detected. Usually one gateway per network is recommended unless you intentionally run isolated profiles, like a rescue bot (see docs: /gateway#multiple-gateways-same-host).",
                            targetIds: reachable.map(function (p) { return p.target.id; }),
                        });
                    }
                    if (opts.json) {
                        runtime.log(JSON.stringify({
                            ok: ok,
                            ts: Date.now(),
                            durationMs: Date.now() - startedAt,
                            timeoutMs: overallTimeoutMs,
                            primaryTargetId: (_s = primary === null || primary === void 0 ? void 0 : primary.target.id) !== null && _s !== void 0 ? _s : null,
                            warnings: warnings,
                            network: network,
                            discovery: {
                                timeoutMs: discoveryTimeoutMs,
                                count: discovery.length,
                                beacons: discovery.map(function (b) {
                                    var _a, _b, _c, _d, _e, _f, _g;
                                    return ({
                                        instanceName: b.instanceName,
                                        displayName: (_a = b.displayName) !== null && _a !== void 0 ? _a : null,
                                        domain: (_b = b.domain) !== null && _b !== void 0 ? _b : null,
                                        host: (_c = b.host) !== null && _c !== void 0 ? _c : null,
                                        lanHost: (_d = b.lanHost) !== null && _d !== void 0 ? _d : null,
                                        tailnetDns: (_e = b.tailnetDns) !== null && _e !== void 0 ? _e : null,
                                        gatewayPort: (_f = b.gatewayPort) !== null && _f !== void 0 ? _f : null,
                                        sshPort: (_g = b.sshPort) !== null && _g !== void 0 ? _g : null,
                                        wsUrl: (function () {
                                            var _a;
                                            var host = b.tailnetDns || b.lanHost || b.host;
                                            var port = (_a = b.gatewayPort) !== null && _a !== void 0 ? _a : 18789;
                                            return host ? "ws://".concat(host, ":").concat(port) : null;
                                        })(),
                                    });
                                }),
                            },
                            targets: probed.map(function (p) {
                                var _a;
                                return ({
                                    id: p.target.id,
                                    kind: p.target.kind,
                                    url: p.target.url,
                                    active: p.target.active,
                                    tunnel: (_a = p.target.tunnel) !== null && _a !== void 0 ? _a : null,
                                    connect: {
                                        ok: p.probe.ok,
                                        latencyMs: p.probe.connectLatencyMs,
                                        error: p.probe.error,
                                        close: p.probe.close,
                                    },
                                    self: p.self,
                                    config: p.configSummary,
                                    health: p.probe.health,
                                    summary: p.probe.status,
                                    presence: p.probe.presence,
                                });
                            }),
                        }, null, 2));
                        if (!ok) {
                            runtime.exit(1);
                        }
                        return [2 /*return*/];
                    }
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Gateway Status"));
                    runtime.log(ok
                        ? "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "Reachable"), ": yes")
                        : "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.error, "Reachable"), ": no"));
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Probe budget: ".concat(overallTimeoutMs, "ms")));
                    if (warnings.length > 0) {
                        runtime.log("");
                        runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, "Warning:"));
                        for (_i = 0, warnings_1 = warnings; _i < warnings_1.length; _i++) {
                            w = warnings_1[_i];
                            runtime.log("- ".concat(w.message));
                        }
                    }
                    runtime.log("");
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Discovery (this machine)"));
                    discoveryDomains = wideAreaDomain ? "local. + ".concat(wideAreaDomain) : "local.";
                    runtime.log(discovery.length > 0
                        ? "Found ".concat(discovery.length, " gateway(s) via Bonjour (").concat(discoveryDomains, ")")
                        : "Found 0 gateways via Bonjour (".concat(discoveryDomains, ")"));
                    if (discovery.length === 0) {
                        runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Tip: if the gateway is remote, mDNS won’t cross networks; use Wide-Area Bonjour (split DNS) or SSH tunnels."));
                    }
                    runtime.log("");
                    runtime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Targets"));
                    for (_b = 0, probed_1 = probed; _b < probed_1.length; _b++) {
                        p = probed_1[_b];
                        runtime.log((0, helpers_js_1.renderTargetHeader)(p.target, rich));
                        runtime.log("  ".concat((0, helpers_js_1.renderProbeSummaryLine)(p.probe, rich)));
                        if (((_t = p.target.tunnel) === null || _t === void 0 ? void 0 : _t.kind) === "ssh") {
                            runtime.log("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "ssh"), ": ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, p.target.tunnel.target)));
                        }
                        if (p.probe.ok && p.self) {
                            host = (_u = p.self.host) !== null && _u !== void 0 ? _u : "unknown";
                            ip = p.self.ip ? " (".concat(p.self.ip, ")") : "";
                            platform = p.self.platform ? " \u00B7 ".concat(p.self.platform) : "";
                            version = p.self.version ? " \u00B7 app ".concat(p.self.version) : "";
                            runtime.log("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, "Gateway"), ": ").concat(host).concat(ip).concat(platform).concat(version));
                        }
                        if (p.configSummary) {
                            c = p.configSummary;
                            wideArea = c.discovery.wideAreaEnabled === true
                                ? "enabled"
                                : c.discovery.wideAreaEnabled === false
                                    ? "disabled"
                                    : "unknown";
                            runtime.log("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, "Wide-area discovery"), ": ").concat(wideArea));
                        }
                        runtime.log("");
                    }
                    if (!ok) {
                        runtime.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function inferSshTargetFromRemoteUrl(rawUrl) {
    var _a;
    if (typeof rawUrl !== "string") {
        return null;
    }
    var trimmed = rawUrl.trim();
    if (!trimmed) {
        return null;
    }
    var host = null;
    try {
        host = new URL(trimmed).hostname || null;
    }
    catch (_b) {
        return null;
    }
    if (!host) {
        return null;
    }
    var user = ((_a = process.env.USER) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    return user ? "".concat(user, "@").concat(host) : host;
}
function buildSshTarget(input) {
    var _a, _b, _c, _d, _e;
    var host = (_b = (_a = input.host) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    if (!host) {
        return null;
    }
    var user = (_d = (_c = input.user) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    var base = user ? "".concat(user, "@").concat(host) : host;
    var port = (_e = input.port) !== null && _e !== void 0 ? _e : 22;
    if (port && port !== 22) {
        return "".concat(base, ":").concat(port);
    }
    return base;
}
function resolveSshTarget(rawTarget, identity, overallTimeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, config, target, identityFile;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    parsed = (0, ssh_tunnel_js_1.parseSshTarget)(rawTarget);
                    if (!parsed) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, (0, ssh_config_js_1.resolveSshConfig)(parsed, {
                            identity: identity !== null && identity !== void 0 ? identity : undefined,
                            timeoutMs: Math.min(800, overallTimeoutMs),
                        })];
                case 1:
                    config = _f.sent();
                    if (!config) {
                        return [2 /*return*/, { target: rawTarget, identity: identity !== null && identity !== void 0 ? identity : undefined }];
                    }
                    target = buildSshTarget({
                        user: (_a = config.user) !== null && _a !== void 0 ? _a : parsed.user,
                        host: (_b = config.host) !== null && _b !== void 0 ? _b : parsed.host,
                        port: (_c = config.port) !== null && _c !== void 0 ? _c : parsed.port,
                    });
                    if (!target) {
                        return [2 /*return*/, { target: rawTarget, identity: identity !== null && identity !== void 0 ? identity : undefined }];
                    }
                    identityFile = (_e = identity !== null && identity !== void 0 ? identity : (_d = config.identityFiles.find(function (entry) { return entry.trim().length > 0; })) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : undefined;
                    return [2 /*return*/, { target: target, identity: identityFile }];
            }
        });
    });
}
