"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDiscoverTimeoutMs = parseDiscoverTimeoutMs;
exports.pickBeaconHost = pickBeaconHost;
exports.pickGatewayPort = pickGatewayPort;
exports.dedupeBeacons = dedupeBeacons;
exports.renderBeaconLines = renderBeaconLines;
var theme_js_1 = require("../../terminal/theme.js");
function parseDiscoverTimeoutMs(raw, fallbackMs) {
    if (raw === undefined || raw === null) {
        return fallbackMs;
    }
    var value = typeof raw === "string"
        ? raw.trim()
        : typeof raw === "number" || typeof raw === "bigint"
            ? String(raw)
            : null;
    if (value === null) {
        throw new Error("invalid --timeout");
    }
    if (!value) {
        return fallbackMs;
    }
    var parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("invalid --timeout: ".concat(value));
    }
    return parsed;
}
function pickBeaconHost(beacon) {
    var host = beacon.tailnetDns || beacon.lanHost || beacon.host;
    return (host === null || host === void 0 ? void 0 : host.trim()) ? host.trim() : null;
}
function pickGatewayPort(beacon) {
    var _a;
    var port = (_a = beacon.gatewayPort) !== null && _a !== void 0 ? _a : 18789;
    return port > 0 ? port : 18789;
}
function dedupeBeacons(beacons) {
    var _a, _b, _c, _d, _e, _f;
    var out = [];
    var seen = new Set();
    for (var _i = 0, beacons_1 = beacons; _i < beacons_1.length; _i++) {
        var b = beacons_1[_i];
        var host = (_a = pickBeaconHost(b)) !== null && _a !== void 0 ? _a : "";
        var key = [
            (_b = b.domain) !== null && _b !== void 0 ? _b : "",
            (_c = b.instanceName) !== null && _c !== void 0 ? _c : "",
            (_d = b.displayName) !== null && _d !== void 0 ? _d : "",
            host,
            String((_e = b.port) !== null && _e !== void 0 ? _e : ""),
            String((_f = b.gatewayPort) !== null && _f !== void 0 ? _f : ""),
        ].join("|");
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        out.push(b);
    }
    return out;
}
function renderBeaconLines(beacon, rich) {
    var nameRaw = (beacon.displayName || beacon.instanceName || "Gateway").trim();
    var domainRaw = (beacon.domain || "local.").trim();
    var title = (0, theme_js_1.colorize)(rich, theme_js_1.theme.accentBright, nameRaw);
    var domain = (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, domainRaw);
    var host = pickBeaconHost(beacon);
    var gatewayPort = pickGatewayPort(beacon);
    var scheme = beacon.gatewayTls ? "wss" : "ws";
    var wsUrl = host ? "".concat(scheme, "://").concat(host, ":").concat(gatewayPort) : null;
    var lines = ["- ".concat(title, " ").concat(domain)];
    if (beacon.tailnetDns) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, "tailnet"), ": ").concat(beacon.tailnetDns));
    }
    if (beacon.lanHost) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, "lan"), ": ").concat(beacon.lanHost));
    }
    if (beacon.host) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.info, "host"), ": ").concat(beacon.host));
    }
    if (wsUrl) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "ws"), ": ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, wsUrl)));
    }
    if (beacon.role) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "role"), ": ").concat(beacon.role));
    }
    if (beacon.transport) {
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "transport"), ": ").concat(beacon.transport));
    }
    if (beacon.gatewayTls) {
        var fingerprint = beacon.gatewayTlsFingerprintSha256
            ? "sha256 ".concat(beacon.gatewayTlsFingerprintSha256)
            : "enabled";
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "tls"), ": ").concat(fingerprint));
    }
    if (typeof beacon.sshPort === "number" && beacon.sshPort > 0 && host) {
        var ssh = "ssh -N -L 18789:127.0.0.1:18789 <user>@".concat(host, " -p ").concat(beacon.sshPort);
        lines.push("  ".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "ssh"), ": ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, ssh)));
    }
    return lines;
}
