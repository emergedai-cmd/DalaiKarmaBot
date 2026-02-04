"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGatewayRuntimeSummary = formatGatewayRuntimeSummary;
exports.buildGatewayRuntimeHints = buildGatewayRuntimeHints;
var command_format_js_1 = require("../cli/command-format.js");
var constants_js_1 = require("../daemon/constants.js");
var launchd_js_1 = require("../daemon/launchd.js");
var systemd_hints_js_1 = require("../daemon/systemd-hints.js");
var wsl_js_1 = require("../infra/wsl.js");
var logging_js_1 = require("../logging.js");
function formatGatewayRuntimeSummary(runtime) {
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
function buildGatewayRuntimeHints(runtime, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var hints = [];
    if (!runtime) {
        return hints;
    }
    var platform = (_a = options.platform) !== null && _a !== void 0 ? _a : process.platform;
    var env = (_b = options.env) !== null && _b !== void 0 ? _b : process.env;
    var fileLog = (function () {
        try {
            return (0, logging_js_1.getResolvedLoggerSettings)().file;
        }
        catch (_a) {
            return null;
        }
    })();
    if (platform === "linux" && (0, systemd_hints_js_1.isSystemdUnavailableDetail)(runtime.detail)) {
        hints.push.apply(hints, (0, systemd_hints_js_1.renderSystemdUnavailableHints)({ wsl: (0, wsl_js_1.isWSLEnv)() }));
        if (fileLog) {
            hints.push("File logs: ".concat(fileLog));
        }
        return hints;
    }
    if (runtime.cachedLabel && platform === "darwin") {
        var label = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(env.OPENCLAW_PROFILE);
        hints.push("LaunchAgent label cached but plist missing. Clear with: launchctl bootout gui/$UID/".concat(label));
        hints.push("Then reinstall: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install", env)));
    }
    if (runtime.missingUnit) {
        hints.push("Service not installed. Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install", env)));
        if (fileLog) {
            hints.push("File logs: ".concat(fileLog));
        }
        return hints;
    }
    if (runtime.status === "stopped") {
        hints.push("Service is loaded but not running (likely exited immediately).");
        if (fileLog) {
            hints.push("File logs: ".concat(fileLog));
        }
        if (platform === "darwin") {
            var logs = (0, launchd_js_1.resolveGatewayLogPaths)(env);
            hints.push("Launchd stdout (if installed): ".concat(logs.stdoutPath));
            hints.push("Launchd stderr (if installed): ".concat(logs.stderrPath));
        }
        else if (platform === "linux") {
            var unit = (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
            hints.push("Logs: journalctl --user -u ".concat(unit, ".service -n 200 --no-pager"));
        }
        else if (platform === "win32") {
            var task = (0, constants_js_1.resolveGatewayWindowsTaskName)(env.OPENCLAW_PROFILE);
            hints.push("Logs: schtasks /Query /TN \"".concat(task, "\" /V /FO LIST"));
        }
    }
    return hints;
}
