"use strict";
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
exports.parsePort = parsePort;
exports.parsePortFromArgs = parsePortFromArgs;
exports.pickProbeHostForBind = pickProbeHostForBind;
exports.filterDaemonEnv = filterDaemonEnv;
exports.safeDaemonEnv = safeDaemonEnv;
exports.normalizeListenerAddress = normalizeListenerAddress;
exports.formatRuntimeStatus = formatRuntimeStatus;
exports.renderRuntimeHints = renderRuntimeHints;
exports.renderGatewayServiceStartHints = renderGatewayServiceStartHints;
var constants_js_1 = require("../../daemon/constants.js");
var launchd_js_1 = require("../../daemon/launchd.js");
var logging_js_1 = require("../../logging.js");
var command_format_js_1 = require("../command-format.js");
function parsePort(raw) {
    if (raw === undefined || raw === null) {
        return null;
    }
    var value = typeof raw === "string"
        ? raw
        : typeof raw === "number" || typeof raw === "bigint"
            ? raw.toString()
            : null;
    if (value === null) {
        return null;
    }
    var parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}
function parsePortFromArgs(programArguments) {
    if (!(programArguments === null || programArguments === void 0 ? void 0 : programArguments.length)) {
        return null;
    }
    for (var i = 0; i < programArguments.length; i += 1) {
        var arg = programArguments[i];
        if (arg === "--port") {
            var next = programArguments[i + 1];
            var parsed = parsePort(next);
            if (parsed) {
                return parsed;
            }
        }
        if (arg === null || arg === void 0 ? void 0 : arg.startsWith("--port=")) {
            var parsed = parsePort(arg.split("=", 2)[1]);
            if (parsed) {
                return parsed;
            }
        }
    }
    return null;
}
function pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost) {
    if (bindMode === "custom" && (customBindHost === null || customBindHost === void 0 ? void 0 : customBindHost.trim())) {
        return customBindHost.trim();
    }
    if (bindMode === "tailnet") {
        return tailnetIPv4 !== null && tailnetIPv4 !== void 0 ? tailnetIPv4 : "127.0.0.1";
    }
    return "127.0.0.1";
}
var SAFE_DAEMON_ENV_KEYS = [
    "OPENCLAW_PROFILE",
    "OPENCLAW_STATE_DIR",
    "OPENCLAW_CONFIG_PATH",
    "OPENCLAW_GATEWAY_PORT",
    "OPENCLAW_NIX_MODE",
];
function filterDaemonEnv(env) {
    if (!env) {
        return {};
    }
    var filtered = {};
    for (var _i = 0, SAFE_DAEMON_ENV_KEYS_1 = SAFE_DAEMON_ENV_KEYS; _i < SAFE_DAEMON_ENV_KEYS_1.length; _i++) {
        var key = SAFE_DAEMON_ENV_KEYS_1[_i];
        var value = env[key];
        if (!(value === null || value === void 0 ? void 0 : value.trim())) {
            continue;
        }
        filtered[key] = value.trim();
    }
    return filtered;
}
function safeDaemonEnv(env) {
    var filtered = filterDaemonEnv(env);
    return Object.entries(filtered).map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, "=").concat(value);
    });
}
function normalizeListenerAddress(raw) {
    var value = raw.trim();
    if (!value) {
        return value;
    }
    value = value.replace(/^TCP\s+/i, "");
    value = value.replace(/\s+\(LISTEN\)\s*$/i, "");
    return value.trim();
}
function formatRuntimeStatus(runtime) {
    var _a;
    if (!runtime) {
        return null;
    }
    var status = (_a = runtime.status) !== null && _a !== void 0 ? _a : "unknown";
    var details = [];
    if (runtime.pid) {
        details.push("pid ".concat(runtime.pid));
    }
    if (runtime.state && runtime.state.toLowerCase() !== status) {
        details.push("state ".concat(runtime.state));
    }
    if (runtime.subState) {
        details.push("sub ".concat(runtime.subState));
    }
    if (runtime.lastExitStatus !== undefined) {
        details.push("last exit ".concat(runtime.lastExitStatus));
    }
    if (runtime.lastExitReason) {
        details.push("reason ".concat(runtime.lastExitReason));
    }
    if (runtime.lastRunResult) {
        details.push("last run ".concat(runtime.lastRunResult));
    }
    if (runtime.lastRunTime) {
        details.push("last run time ".concat(runtime.lastRunTime));
    }
    if (runtime.detail) {
        details.push(runtime.detail);
    }
    return details.length > 0 ? "".concat(status, " (").concat(details.join(", "), ")") : status;
}
function renderRuntimeHints(runtime, env) {
    if (env === void 0) { env = process.env; }
    if (!runtime) {
        return [];
    }
    var hints = [];
    var fileLog = (function () {
        try {
            return (0, logging_js_1.getResolvedLoggerSettings)().file;
        }
        catch (_a) {
            return null;
        }
    })();
    if (runtime.missingUnit) {
        hints.push("Service not installed. Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install", env)));
        if (fileLog) {
            hints.push("File logs: ".concat(fileLog));
        }
        return hints;
    }
    if (runtime.status === "stopped") {
        if (fileLog) {
            hints.push("File logs: ".concat(fileLog));
        }
        if (process.platform === "darwin") {
            var logs = (0, launchd_js_1.resolveGatewayLogPaths)(env);
            hints.push("Launchd stdout (if installed): ".concat(logs.stdoutPath));
            hints.push("Launchd stderr (if installed): ".concat(logs.stderrPath));
        }
        else if (process.platform === "linux") {
            var unit = (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
            hints.push("Logs: journalctl --user -u ".concat(unit, ".service -n 200 --no-pager"));
        }
        else if (process.platform === "win32") {
            var task = (0, constants_js_1.resolveGatewayWindowsTaskName)(env.OPENCLAW_PROFILE);
            hints.push("Logs: schtasks /Query /TN \"".concat(task, "\" /V /FO LIST"));
        }
    }
    return hints;
}
function renderGatewayServiceStartHints(env) {
    if (env === void 0) { env = process.env; }
    var base = [
        (0, command_format_js_1.formatCliCommand)("openclaw gateway install", env),
        (0, command_format_js_1.formatCliCommand)("openclaw gateway", env),
    ];
    var profile = env.OPENCLAW_PROFILE;
    switch (process.platform) {
        case "darwin": {
            var label = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(profile);
            return __spreadArray(__spreadArray([], base, true), ["launchctl bootstrap gui/$UID ~/Library/LaunchAgents/".concat(label, ".plist")], false);
        }
        case "linux": {
            var unit = (0, constants_js_1.resolveGatewaySystemdServiceName)(profile);
            return __spreadArray(__spreadArray([], base, true), ["systemctl --user start ".concat(unit, ".service")], false);
        }
        case "win32": {
            var task = (0, constants_js_1.resolveGatewayWindowsTaskName)(profile);
            return __spreadArray(__spreadArray([], base, true), ["schtasks /Run /TN \"".concat(task, "\"")], false);
        }
        default:
            return base;
    }
}
