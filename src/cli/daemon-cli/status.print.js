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
Object.defineProperty(exports, "__esModule", { value: true });
exports.printDaemonStatus = printDaemonStatus;
var onboard_helpers_js_1 = require("../../commands/onboard-helpers.js");
var constants_js_1 = require("../../daemon/constants.js");
var inspect_js_1 = require("../../daemon/inspect.js");
var launchd_js_1 = require("../../daemon/launchd.js");
var systemd_hints_js_1 = require("../../daemon/systemd-hints.js");
var wsl_js_1 = require("../../infra/wsl.js");
var logging_js_1 = require("../../logging.js");
var runtime_js_1 = require("../../runtime.js");
var theme_js_1 = require("../../terminal/theme.js");
var utils_js_1 = require("../../utils.js");
var command_format_js_1 = require("../command-format.js");
var shared_js_1 = require("./shared.js");
var status_gather_js_1 = require("./status.gather.js");
function sanitizeDaemonStatusForJson(status) {
    var command = status.service.command;
    if (!(command === null || command === void 0 ? void 0 : command.environment)) {
        return status;
    }
    var safeEnv = (0, shared_js_1.filterDaemonEnv)(command.environment);
    var nextCommand = __assign(__assign({}, command), { environment: Object.keys(safeEnv).length > 0 ? safeEnv : undefined });
    return __assign(__assign({}, status), { service: __assign(__assign({}, status.service), { command: nextCommand }) });
}
function printDaemonStatus(status, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
    if (opts.json) {
        var sanitized = sanitizeDaemonStatusForJson(status);
        runtime_js_1.defaultRuntime.log(JSON.stringify(sanitized, null, 2));
        return;
    }
    var rich = (0, theme_js_1.isRich)();
    var label = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, value); };
    var accent = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, value); };
    var infoText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, value); };
    var okText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, value); };
    var warnText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, value); };
    var errorText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, value); };
    var spacer = function () { return runtime_js_1.defaultRuntime.log(""); };
    var service = status.service, rpc = status.rpc, extraServices = status.extraServices;
    var serviceStatus = service.loaded
        ? okText(service.loadedText)
        : warnText(service.notLoadedText);
    runtime_js_1.defaultRuntime.log("".concat(label("Service:"), " ").concat(accent(service.label), " (").concat(serviceStatus, ")"));
    try {
        var logFile = (0, logging_js_1.getResolvedLoggerSettings)().file;
        runtime_js_1.defaultRuntime.log("".concat(label("File logs:"), " ").concat(infoText((0, utils_js_1.shortenHomePath)(logFile))));
    }
    catch (_10) {
        // ignore missing config/log resolution
    }
    if ((_b = (_a = service.command) === null || _a === void 0 ? void 0 : _a.programArguments) === null || _b === void 0 ? void 0 : _b.length) {
        runtime_js_1.defaultRuntime.log("".concat(label("Command:"), " ").concat(infoText(service.command.programArguments.join(" "))));
    }
    if ((_c = service.command) === null || _c === void 0 ? void 0 : _c.sourcePath) {
        runtime_js_1.defaultRuntime.log("".concat(label("Service file:"), " ").concat(infoText((0, utils_js_1.shortenHomePath)(service.command.sourcePath))));
    }
    if ((_d = service.command) === null || _d === void 0 ? void 0 : _d.workingDirectory) {
        runtime_js_1.defaultRuntime.log("".concat(label("Working dir:"), " ").concat(infoText((0, utils_js_1.shortenHomePath)(service.command.workingDirectory))));
    }
    var daemonEnvLines = (0, shared_js_1.safeDaemonEnv)((_e = service.command) === null || _e === void 0 ? void 0 : _e.environment);
    if (daemonEnvLines.length > 0) {
        runtime_js_1.defaultRuntime.log("".concat(label("Service env:"), " ").concat(daemonEnvLines.join(" ")));
    }
    spacer();
    if ((_f = service.configAudit) === null || _f === void 0 ? void 0 : _f.issues.length) {
        runtime_js_1.defaultRuntime.error(warnText("Service config looks out of date or non-standard."));
        for (var _i = 0, _11 = service.configAudit.issues; _i < _11.length; _i++) {
            var issue = _11[_i];
            var detail = issue.detail ? " (".concat(issue.detail, ")") : "";
            runtime_js_1.defaultRuntime.error("".concat(warnText("Service config issue:"), " ").concat(issue.message).concat(detail));
        }
        runtime_js_1.defaultRuntime.error(warnText("Recommendation: run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "\" (or \"").concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --repair"), "\").")));
    }
    if (status.config) {
        var cliCfg = "".concat((0, utils_js_1.shortenHomePath)(status.config.cli.path)).concat(status.config.cli.exists ? "" : " (missing)").concat(status.config.cli.valid ? "" : " (invalid)");
        runtime_js_1.defaultRuntime.log("".concat(label("Config (cli):"), " ").concat(infoText(cliCfg)));
        if (!status.config.cli.valid && ((_g = status.config.cli.issues) === null || _g === void 0 ? void 0 : _g.length)) {
            for (var _12 = 0, _13 = status.config.cli.issues.slice(0, 5); _12 < _13.length; _12++) {
                var issue = _13[_12];
                runtime_js_1.defaultRuntime.error("".concat(errorText("Config issue:"), " ").concat(issue.path || "<root>", ": ").concat(issue.message));
            }
        }
        if (status.config.daemon) {
            var daemonCfg = "".concat((0, utils_js_1.shortenHomePath)(status.config.daemon.path)).concat(status.config.daemon.exists ? "" : " (missing)").concat(status.config.daemon.valid ? "" : " (invalid)");
            runtime_js_1.defaultRuntime.log("".concat(label("Config (service):"), " ").concat(infoText(daemonCfg)));
            if (!status.config.daemon.valid && ((_h = status.config.daemon.issues) === null || _h === void 0 ? void 0 : _h.length)) {
                for (var _14 = 0, _15 = status.config.daemon.issues.slice(0, 5); _14 < _15.length; _14++) {
                    var issue = _15[_14];
                    runtime_js_1.defaultRuntime.error("".concat(errorText("Service config issue:"), " ").concat(issue.path || "<root>", ": ").concat(issue.message));
                }
            }
        }
        if (status.config.mismatch) {
            runtime_js_1.defaultRuntime.error(errorText("Root cause: CLI and service are using different config paths (likely a profile/state-dir mismatch)."));
            runtime_js_1.defaultRuntime.error(errorText("Fix: rerun `".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install --force"), "` from the same --profile / OPENCLAW_STATE_DIR you expect.")));
        }
        spacer();
    }
    if (status.gateway) {
        var bindHost = (_j = status.gateway.bindHost) !== null && _j !== void 0 ? _j : "n/a";
        runtime_js_1.defaultRuntime.log("".concat(label("Gateway:"), " bind=").concat(infoText(status.gateway.bindMode), " (").concat(infoText(bindHost), "), port=").concat(infoText(String(status.gateway.port)), " (").concat(infoText(status.gateway.portSource), ")"));
        runtime_js_1.defaultRuntime.log("".concat(label("Probe target:"), " ").concat(infoText(status.gateway.probeUrl)));
        var controlUiEnabled = (_o = (_m = (_l = (_k = status.config) === null || _k === void 0 ? void 0 : _k.daemon) === null || _l === void 0 ? void 0 : _l.controlUi) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true;
        if (!controlUiEnabled) {
            runtime_js_1.defaultRuntime.log("".concat(label("Dashboard:"), " ").concat(warnText("disabled")));
        }
        else {
            var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                port: status.gateway.port,
                bind: status.gateway.bindMode,
                customBindHost: status.gateway.customBindHost,
                basePath: (_r = (_q = (_p = status.config) === null || _p === void 0 ? void 0 : _p.daemon) === null || _q === void 0 ? void 0 : _q.controlUi) === null || _r === void 0 ? void 0 : _r.basePath,
            });
            runtime_js_1.defaultRuntime.log("".concat(label("Dashboard:"), " ").concat(infoText(links.httpUrl)));
        }
        if (status.gateway.probeNote) {
            runtime_js_1.defaultRuntime.log("".concat(label("Probe note:"), " ").concat(infoText(status.gateway.probeNote)));
        }
        spacer();
    }
    var runtimeLine = (0, shared_js_1.formatRuntimeStatus)(service.runtime);
    if (runtimeLine) {
        var runtimeStatus = (_t = (_s = service.runtime) === null || _s === void 0 ? void 0 : _s.status) !== null && _t !== void 0 ? _t : "unknown";
        var runtimeColor = runtimeStatus === "running"
            ? theme_js_1.theme.success
            : runtimeStatus === "stopped"
                ? theme_js_1.theme.error
                : runtimeStatus === "unknown"
                    ? theme_js_1.theme.muted
                    : theme_js_1.theme.warn;
        runtime_js_1.defaultRuntime.log("".concat(label("Runtime:"), " ").concat((0, theme_js_1.colorize)(rich, runtimeColor, runtimeLine)));
    }
    if (rpc && !rpc.ok && service.loaded && ((_u = service.runtime) === null || _u === void 0 ? void 0 : _u.status) === "running") {
        runtime_js_1.defaultRuntime.log(warnText("Warm-up: launch agents can take a few seconds. Try again shortly."));
    }
    if (rpc) {
        if (rpc.ok) {
            runtime_js_1.defaultRuntime.log("".concat(label("RPC probe:"), " ").concat(okText("ok")));
        }
        else {
            runtime_js_1.defaultRuntime.error("".concat(label("RPC probe:"), " ").concat(errorText("failed")));
            if (rpc.url) {
                runtime_js_1.defaultRuntime.error("".concat(label("RPC target:"), " ").concat(rpc.url));
            }
            var lines = String((_v = rpc.error) !== null && _v !== void 0 ? _v : "unknown")
                .split(/\r?\n/)
                .filter(Boolean);
            for (var _16 = 0, _17 = lines.slice(0, 12); _16 < _17.length; _16++) {
                var line = _17[_16];
                runtime_js_1.defaultRuntime.error("  ".concat(errorText(line)));
            }
        }
        spacer();
    }
    var systemdUnavailable = process.platform === "linux" && (0, systemd_hints_js_1.isSystemdUnavailableDetail)((_w = service.runtime) === null || _w === void 0 ? void 0 : _w.detail);
    if (systemdUnavailable) {
        runtime_js_1.defaultRuntime.error(errorText("systemd user services unavailable."));
        for (var _18 = 0, _19 = (0, systemd_hints_js_1.renderSystemdUnavailableHints)({ wsl: (0, wsl_js_1.isWSLEnv)() }); _18 < _19.length; _18++) {
            var hint = _19[_18];
            runtime_js_1.defaultRuntime.error(errorText(hint));
        }
        spacer();
    }
    if ((_x = service.runtime) === null || _x === void 0 ? void 0 : _x.missingUnit) {
        runtime_js_1.defaultRuntime.error(errorText("Service unit not found."));
        for (var _20 = 0, _21 = (0, shared_js_1.renderRuntimeHints)(service.runtime); _20 < _21.length; _20++) {
            var hint = _21[_20];
            runtime_js_1.defaultRuntime.error(errorText(hint));
        }
    }
    else if (service.loaded && ((_y = service.runtime) === null || _y === void 0 ? void 0 : _y.status) === "stopped") {
        runtime_js_1.defaultRuntime.error(errorText("Service is loaded but not running (likely exited immediately)."));
        for (var _22 = 0, _23 = (0, shared_js_1.renderRuntimeHints)(service.runtime, ((_0 = (_z = service.command) === null || _z === void 0 ? void 0 : _z.environment) !== null && _0 !== void 0 ? _0 : process.env)); _22 < _23.length; _22++) {
            var hint = _23[_22];
            runtime_js_1.defaultRuntime.error(errorText(hint));
        }
        spacer();
    }
    if ((_1 = service.runtime) === null || _1 === void 0 ? void 0 : _1.cachedLabel) {
        var env = ((_3 = (_2 = service.command) === null || _2 === void 0 ? void 0 : _2.environment) !== null && _3 !== void 0 ? _3 : process.env);
        var labelValue = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(env.OPENCLAW_PROFILE);
        runtime_js_1.defaultRuntime.error(errorText("LaunchAgent label cached but plist missing. Clear with: launchctl bootout gui/$UID/".concat(labelValue)));
        runtime_js_1.defaultRuntime.error(errorText("Then reinstall: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install"))));
        spacer();
    }
    for (var _24 = 0, _25 = (0, status_gather_js_1.renderPortDiagnosticsForCli)(status, rpc === null || rpc === void 0 ? void 0 : rpc.ok); _24 < _25.length; _24++) {
        var line = _25[_24];
        runtime_js_1.defaultRuntime.error(errorText(line));
    }
    if (status.port) {
        var addrs = (0, status_gather_js_1.resolvePortListeningAddresses)(status);
        if (addrs.length > 0) {
            runtime_js_1.defaultRuntime.log("".concat(label("Listening:"), " ").concat(infoText(addrs.join(", "))));
        }
    }
    if (status.portCli && status.portCli.port !== ((_4 = status.port) === null || _4 === void 0 ? void 0 : _4.port)) {
        runtime_js_1.defaultRuntime.log("".concat(label("Note:"), " CLI config resolves gateway port=").concat(status.portCli.port, " (").concat(status.portCli.status, ")."));
    }
    if (service.loaded &&
        ((_5 = service.runtime) === null || _5 === void 0 ? void 0 : _5.status) === "running" &&
        status.port &&
        status.port.status !== "busy") {
        runtime_js_1.defaultRuntime.error(errorText("Gateway port ".concat(status.port.port, " is not listening (service appears running).")));
        if (status.lastError) {
            runtime_js_1.defaultRuntime.error("".concat(errorText("Last gateway error:"), " ").concat(status.lastError));
        }
        if (process.platform === "linux") {
            var env = ((_7 = (_6 = service.command) === null || _6 === void 0 ? void 0 : _6.environment) !== null && _7 !== void 0 ? _7 : process.env);
            var unit = (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
            runtime_js_1.defaultRuntime.error(errorText("Logs: journalctl --user -u ".concat(unit, ".service -n 200 --no-pager")));
        }
        else if (process.platform === "darwin") {
            var logs = (0, launchd_js_1.resolveGatewayLogPaths)(((_9 = (_8 = service.command) === null || _8 === void 0 ? void 0 : _8.environment) !== null && _9 !== void 0 ? _9 : process.env));
            runtime_js_1.defaultRuntime.error("".concat(errorText("Logs:"), " ").concat((0, utils_js_1.shortenHomePath)(logs.stdoutPath)));
            runtime_js_1.defaultRuntime.error("".concat(errorText("Errors:"), " ").concat((0, utils_js_1.shortenHomePath)(logs.stderrPath)));
        }
        spacer();
    }
    if (extraServices.length > 0) {
        runtime_js_1.defaultRuntime.error(errorText("Other gateway-like services detected (best effort):"));
        for (var _26 = 0, extraServices_1 = extraServices; _26 < extraServices_1.length; _26++) {
            var svc = extraServices_1[_26];
            runtime_js_1.defaultRuntime.error("- ".concat(errorText(svc.label), " (").concat(svc.scope, ", ").concat(svc.detail, ")"));
        }
        for (var _27 = 0, _28 = (0, inspect_js_1.renderGatewayServiceCleanupHints)(); _27 < _28.length; _27++) {
            var hint = _28[_27];
            runtime_js_1.defaultRuntime.error("".concat(errorText("Cleanup hint:"), " ").concat(hint));
        }
        spacer();
    }
    if (extraServices.length > 0) {
        runtime_js_1.defaultRuntime.error(errorText("Recommendation: run a single gateway per machine for most setups. One gateway supports multiple agents (see docs: /gateway#multiple-gateways-same-host)."));
        runtime_js_1.defaultRuntime.error(errorText("If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host)."));
        spacer();
    }
    runtime_js_1.defaultRuntime.log("".concat(label("Troubles:"), " run ").concat((0, command_format_js_1.formatCliCommand)("openclaw status")));
    runtime_js_1.defaultRuntime.log("".concat(label("Troubleshooting:"), " https://docs.openclaw.ai/troubleshooting"));
}
