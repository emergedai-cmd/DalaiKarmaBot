"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeoutMs = parseTimeoutMs;
exports.resolveTargets = resolveTargets;
exports.resolveProbeBudgetMs = resolveProbeBudgetMs;
exports.sanitizeSshTarget = sanitizeSshTarget;
exports.resolveAuthForTarget = resolveAuthForTarget;
exports.pickGatewaySelfPresence = pickGatewaySelfPresence;
exports.extractConfigSummary = extractConfigSummary;
exports.buildNetworkHints = buildNetworkHints;
exports.renderTargetHeader = renderTargetHeader;
exports.renderProbeSummaryLine = renderProbeSummaryLine;
var config_js_1 = require("../../config/config.js");
var tailnet_js_1 = require("../../infra/tailnet.js");
var theme_js_1 = require("../../terminal/theme.js");
function parseIntOrNull(value) {
    var s = typeof value === "string"
        ? value.trim()
        : typeof value === "number" || typeof value === "bigint"
            ? String(value)
            : "";
    if (!s) {
        return null;
    }
    var n = Number.parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
}
function parseTimeoutMs(raw, fallbackMs) {
    var value = typeof raw === "string"
        ? raw.trim()
        : typeof raw === "number" || typeof raw === "bigint"
            ? String(raw)
            : "";
    if (!value) {
        return fallbackMs;
    }
    var parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("invalid --timeout: ".concat(value));
    }
    return parsed;
}
function normalizeWsUrl(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    if (!trimmed.startsWith("ws://") && !trimmed.startsWith("wss://")) {
        return null;
    }
    return trimmed;
}
function resolveTargets(cfg, explicitUrl) {
    var _a, _b, _c, _d;
    var targets = [];
    var add = function (t) {
        if (!targets.some(function (x) { return x.url === t.url; })) {
            targets.push(t);
        }
    };
    var explicit = typeof explicitUrl === "string" ? normalizeWsUrl(explicitUrl) : null;
    if (explicit) {
        add({ id: "explicit", kind: "explicit", url: explicit, active: true });
    }
    var remoteUrl = typeof ((_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.remote) === null || _b === void 0 ? void 0 : _b.url) === "string" ? normalizeWsUrl(cfg.gateway.remote.url) : null;
    if (remoteUrl) {
        add({
            id: "configRemote",
            kind: "configRemote",
            url: remoteUrl,
            active: ((_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.mode) === "remote",
        });
    }
    var port = (0, config_js_1.resolveGatewayPort)(cfg);
    add({
        id: "localLoopback",
        kind: "localLoopback",
        url: "ws://127.0.0.1:".concat(port),
        active: ((_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.mode) !== "remote",
    });
    return targets;
}
function resolveProbeBudgetMs(overallMs, kind) {
    if (kind === "localLoopback") {
        return Math.min(800, overallMs);
    }
    if (kind === "sshTunnel") {
        return Math.min(2000, overallMs);
    }
    return Math.min(1500, overallMs);
}
function sanitizeSshTarget(value) {
    if (typeof value !== "string") {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    return trimmed.replace(/^ssh\\s+/, "");
}
function resolveAuthForTarget(cfg, target, overrides) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var tokenOverride = ((_a = overrides.token) === null || _a === void 0 ? void 0 : _a.trim()) ? overrides.token.trim() : undefined;
    var passwordOverride = ((_b = overrides.password) === null || _b === void 0 ? void 0 : _b.trim()) ? overrides.password.trim() : undefined;
    if (tokenOverride || passwordOverride) {
        return { token: tokenOverride, password: passwordOverride };
    }
    if (target.kind === "configRemote" || target.kind === "sshTunnel") {
        var token = typeof ((_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.remote) === null || _d === void 0 ? void 0 : _d.token) === "string" ? cfg.gateway.remote.token.trim() : "";
        var remotePassword = (_f = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.remote) === null || _f === void 0 ? void 0 : _f.password;
        var password = typeof remotePassword === "string" ? remotePassword.trim() : "";
        return {
            token: token.length > 0 ? token : undefined,
            password: password.length > 0 ? password : undefined,
        };
    }
    var envToken = ((_g = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _g === void 0 ? void 0 : _g.trim()) || "";
    var envPassword = ((_h = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _h === void 0 ? void 0 : _h.trim()) || "";
    var cfgToken = typeof ((_k = (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.auth) === null || _k === void 0 ? void 0 : _k.token) === "string" ? cfg.gateway.auth.token.trim() : "";
    var cfgPassword = typeof ((_m = (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.auth) === null || _m === void 0 ? void 0 : _m.password) === "string" ? cfg.gateway.auth.password.trim() : "";
    return {
        token: envToken || cfgToken || undefined,
        password: envPassword || cfgPassword || undefined,
    };
}
function pickGatewaySelfPresence(presence) {
    var _a, _b;
    if (!Array.isArray(presence)) {
        return null;
    }
    var entries = presence;
    var self = (_b = (_a = entries.find(function (e) { return e.mode === "gateway" && e.reason === "self"; })) !== null && _a !== void 0 ? _a : entries.find(function (e) { return typeof e.text === "string" && String(e.text).startsWith("Gateway:"); })) !== null && _b !== void 0 ? _b : null;
    if (!self) {
        return null;
    }
    return {
        host: typeof self.host === "string" ? self.host : undefined,
        ip: typeof self.ip === "string" ? self.ip : undefined,
        version: typeof self.version === "string" ? self.version : undefined,
        platform: typeof self.platform === "string" ? self.platform : undefined,
    };
}
function extractConfigSummary(snapshotUnknown) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var snap = snapshotUnknown;
    var path = typeof (snap === null || snap === void 0 ? void 0 : snap.path) === "string" ? snap.path : null;
    var exists = Boolean(snap === null || snap === void 0 ? void 0 : snap.exists);
    var valid = Boolean(snap === null || snap === void 0 ? void 0 : snap.valid);
    var issuesRaw = Array.isArray(snap === null || snap === void 0 ? void 0 : snap.issues) ? snap.issues : [];
    var legacyRaw = Array.isArray(snap === null || snap === void 0 ? void 0 : snap.legacyIssues) ? snap.legacyIssues : [];
    var cfg = ((_a = snap === null || snap === void 0 ? void 0 : snap.config) !== null && _a !== void 0 ? _a : {});
    var gateway = ((_b = cfg.gateway) !== null && _b !== void 0 ? _b : {});
    var discovery = ((_c = cfg.discovery) !== null && _c !== void 0 ? _c : {});
    var wideArea = ((_d = discovery.wideArea) !== null && _d !== void 0 ? _d : {});
    var remote = ((_e = gateway.remote) !== null && _e !== void 0 ? _e : {});
    var auth = ((_f = gateway.auth) !== null && _f !== void 0 ? _f : {});
    var controlUi = ((_g = gateway.controlUi) !== null && _g !== void 0 ? _g : {});
    var tailscale = ((_h = gateway.tailscale) !== null && _h !== void 0 ? _h : {});
    var authMode = typeof auth.mode === "string" ? auth.mode : null;
    var authTokenConfigured = typeof auth.token === "string" ? auth.token.trim().length > 0 : false;
    var authPasswordConfigured = typeof auth.password === "string" ? auth.password.trim().length > 0 : false;
    var remoteUrl = typeof remote.url === "string" ? normalizeWsUrl(remote.url) : null;
    var remoteTokenConfigured = typeof remote.token === "string" ? remote.token.trim().length > 0 : false;
    var remotePasswordConfigured = typeof remote.password === "string" ? String(remote.password).trim().length > 0 : false;
    var wideAreaEnabled = typeof wideArea.enabled === "boolean" ? wideArea.enabled : null;
    return {
        path: path,
        exists: exists,
        valid: valid,
        issues: issuesRaw
            .filter(function (i) {
            return Boolean(i && typeof i.path === "string" && typeof i.message === "string");
        })
            .map(function (i) { return ({ path: i.path, message: i.message }); }),
        legacyIssues: legacyRaw
            .filter(function (i) {
            return Boolean(i && typeof i.path === "string" && typeof i.message === "string");
        })
            .map(function (i) { return ({ path: i.path, message: i.message }); }),
        gateway: {
            mode: typeof gateway.mode === "string" ? gateway.mode : null,
            bind: typeof gateway.bind === "string" ? gateway.bind : null,
            port: parseIntOrNull(gateway.port),
            controlUiEnabled: typeof controlUi.enabled === "boolean" ? controlUi.enabled : null,
            controlUiBasePath: typeof controlUi.basePath === "string" ? controlUi.basePath : null,
            authMode: authMode,
            authTokenConfigured: authTokenConfigured,
            authPasswordConfigured: authPasswordConfigured,
            remoteUrl: remoteUrl,
            remoteTokenConfigured: remoteTokenConfigured,
            remotePasswordConfigured: remotePasswordConfigured,
            tailscaleMode: typeof tailscale.mode === "string" ? tailscale.mode : null,
        },
        discovery: { wideAreaEnabled: wideAreaEnabled },
    };
}
function buildNetworkHints(cfg) {
    var tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
    var port = (0, config_js_1.resolveGatewayPort)(cfg);
    return {
        localLoopbackUrl: "ws://127.0.0.1:".concat(port),
        localTailnetUrl: tailnetIPv4 ? "ws://".concat(tailnetIPv4, ":").concat(port) : null,
        tailnetIPv4: tailnetIPv4 !== null && tailnetIPv4 !== void 0 ? tailnetIPv4 : null,
    };
}
function renderTargetHeader(target, rich) {
    var kindLabel = target.kind === "localLoopback"
        ? "Local loopback"
        : target.kind === "sshTunnel"
            ? "Remote over SSH"
            : target.kind === "configRemote"
                ? target.active
                    ? "Remote (configured)"
                    : "Remote (configured, inactive)"
                : "URL (explicit)";
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, kindLabel), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, target.url));
}
function renderProbeSummaryLine(probe, rich) {
    if (probe.ok) {
        var latency = typeof probe.connectLatencyMs === "number" ? "".concat(probe.connectLatencyMs, "ms") : "unknown";
        return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "Connect: ok"), " (").concat(latency, ") \u00B7 ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "RPC: ok"));
    }
    var detail = probe.error ? " - ".concat(probe.error) : "";
    if (probe.connectLatencyMs != null) {
        var latency = typeof probe.connectLatencyMs === "number" ? "".concat(probe.connectLatencyMs, "ms") : "unknown";
        return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "Connect: ok"), " (").concat(latency, ") \u00B7 ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.error, "RPC: failed")).concat(detail);
    }
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.error, "Connect: failed")).concat(detail);
}
