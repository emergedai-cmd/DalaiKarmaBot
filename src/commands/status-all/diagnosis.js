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
exports.appendStatusAllDiagnosis = appendStatusAllDiagnosis;
var launchd_js_1 = require("../../daemon/launchd.js");
var ports_js_1 = require("../../infra/ports.js");
var restart_sentinel_js_1 = require("../../infra/restart-sentinel.js");
var format_js_1 = require("./format.js");
var gateway_js_1 = require("./gateway.js");
function appendStatusAllDiagnosis(params) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, muted, ok, warn, fail, emitCheck, _i, _a, line, status_1, issues_1, uniqueIssues, _b, _c, issue, lastErrClean, isTrivialLastErr, portOk, _d, _e, line, backend, okBackend, hasDns, label, eligible, missing, logPaths, _f, stderrTail, stdoutTail, _g, _h, line, _j, _k, line, _l, _m, issue, fixText, healthErr;
        var _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    lines = params.lines, muted = params.muted, ok = params.ok, warn = params.warn, fail = params.fail;
                    emitCheck = function (label, status) {
                        var icon = status === "ok" ? ok("✓") : status === "warn" ? warn("!") : fail("✗");
                        var colored = status === "ok" ? ok(label) : status === "warn" ? warn(label) : fail(label);
                        lines.push("".concat(icon, " ").concat(colored));
                    };
                    lines.push("");
                    lines.push(muted("Gateway connection details:"));
                    for (_i = 0, _a = (0, format_js_1.redactSecrets)(params.connectionDetailsForReport)
                        .split("\n")
                        .map(function (l) { return l.trimEnd(); }); _i < _a.length; _i++) {
                        line = _a[_i];
                        lines.push("  ".concat(muted(line)));
                    }
                    lines.push("");
                    if (params.snap) {
                        status_1 = !params.snap.exists ? "fail" : params.snap.valid ? "ok" : "warn";
                        emitCheck("Config: ".concat((_o = params.snap.path) !== null && _o !== void 0 ? _o : "(unknown)"), status_1);
                        issues_1 = __spreadArray(__spreadArray([], ((_p = params.snap.legacyIssues) !== null && _p !== void 0 ? _p : []), true), ((_q = params.snap.issues) !== null && _q !== void 0 ? _q : []), true);
                        uniqueIssues = issues_1.filter(function (issue, index) {
                            return issues_1.findIndex(function (x) { return x.path === issue.path && x.message === issue.message; }) === index;
                        });
                        for (_b = 0, _c = uniqueIssues.slice(0, 12); _b < _c.length; _b++) {
                            issue = _c[_b];
                            lines.push("  - ".concat(issue.path, ": ").concat(issue.message));
                        }
                        if (uniqueIssues.length > 12) {
                            lines.push("  ".concat(muted("\u2026 +".concat(uniqueIssues.length - 12, " more"))));
                        }
                    }
                    else {
                        emitCheck("Config: read failed", "warn");
                    }
                    if (params.remoteUrlMissing) {
                        lines.push("");
                        emitCheck("Gateway remote mode misconfigured (gateway.remote.url missing)", "warn");
                        lines.push("  ".concat(muted("Fix: set gateway.remote.url, or set gateway.mode=local.")));
                    }
                    if ((_r = params.sentinel) === null || _r === void 0 ? void 0 : _r.payload) {
                        emitCheck("Restart sentinel present", "warn");
                        lines.push("  ".concat(muted("".concat((0, restart_sentinel_js_1.summarizeRestartSentinel)(params.sentinel.payload), " \u00B7 ").concat((0, format_js_1.formatAge)(Date.now() - params.sentinel.payload.ts)))));
                    }
                    else {
                        emitCheck("Restart sentinel: none", "ok");
                    }
                    lastErrClean = (_t = (_s = params.lastErr) === null || _s === void 0 ? void 0 : _s.trim()) !== null && _t !== void 0 ? _t : "";
                    isTrivialLastErr = lastErrClean.length < 8 || lastErrClean === "}" || lastErrClean === "{";
                    if (lastErrClean && !isTrivialLastErr) {
                        lines.push("");
                        lines.push(muted("Gateway last log line:"));
                        lines.push("  ".concat(muted((0, format_js_1.redactSecrets)(lastErrClean))));
                    }
                    if (params.portUsage) {
                        portOk = params.portUsage.listeners.length === 0;
                        emitCheck("Port ".concat(params.port), portOk ? "ok" : "warn");
                        if (!portOk) {
                            for (_d = 0, _e = (0, ports_js_1.formatPortDiagnostics)(params.portUsage); _d < _e.length; _d++) {
                                line = _e[_d];
                                lines.push("  ".concat(muted(line)));
                            }
                        }
                    }
                    {
                        backend = (_u = params.tailscale.backendState) !== null && _u !== void 0 ? _u : "unknown";
                        okBackend = backend === "Running";
                        hasDns = Boolean(params.tailscale.dnsName);
                        label = params.tailscaleMode === "off"
                            ? "Tailscale: off \u00B7 ".concat(backend).concat(params.tailscale.dnsName ? " \u00B7 ".concat(params.tailscale.dnsName) : "")
                            : "Tailscale: ".concat(params.tailscaleMode, " \u00B7 ").concat(backend).concat(params.tailscale.dnsName ? " \u00B7 ".concat(params.tailscale.dnsName) : "");
                        emitCheck(label, okBackend && (params.tailscaleMode === "off" || hasDns) ? "ok" : "warn");
                        if (params.tailscale.error) {
                            lines.push("  ".concat(muted("error: ".concat(params.tailscale.error))));
                        }
                        if (params.tailscale.ips.length > 0) {
                            lines.push("  ".concat(muted("ips: ".concat(params.tailscale.ips.slice(0, 3).join(", ")).concat(params.tailscale.ips.length > 3 ? "…" : ""))));
                        }
                        if (params.tailscaleHttpsUrl) {
                            lines.push("  ".concat(muted("https: ".concat(params.tailscaleHttpsUrl))));
                        }
                    }
                    if (params.skillStatus) {
                        eligible = params.skillStatus.skills.filter(function (s) { return s.eligible; }).length;
                        missing = params.skillStatus.skills.filter(function (s) { return s.eligible && Object.values(s.missing).some(function (arr) { return arr.length; }); }).length;
                        emitCheck("Skills: ".concat(eligible, " eligible \u00B7 ").concat(missing, " missing \u00B7 ").concat(params.skillStatus.workspaceDir), missing === 0 ? "ok" : "warn");
                    }
                    params.progress.setLabel("Reading logs…");
                    logPaths = (function () {
                        try {
                            return (0, launchd_js_1.resolveGatewayLogPaths)(process.env);
                        }
                        catch (_a) {
                            return null;
                        }
                    })();
                    if (!logPaths) return [3 /*break*/, 2];
                    params.progress.setLabel("Reading logs…");
                    return [4 /*yield*/, Promise.all([
                            (0, gateway_js_1.readFileTailLines)(logPaths.stderrPath, 40).catch(function () { return []; }),
                            (0, gateway_js_1.readFileTailLines)(logPaths.stdoutPath, 40).catch(function () { return []; }),
                        ])];
                case 1:
                    _f = _v.sent(), stderrTail = _f[0], stdoutTail = _f[1];
                    if (stderrTail.length > 0 || stdoutTail.length > 0) {
                        lines.push("");
                        lines.push(muted("Gateway logs (tail, summarized): ".concat(logPaths.logDir)));
                        lines.push("  ".concat(muted("# stderr: ".concat(logPaths.stderrPath))));
                        for (_g = 0, _h = (0, gateway_js_1.summarizeLogTail)(stderrTail, { maxLines: 22 }).map(format_js_1.redactSecrets); _g < _h.length; _g++) {
                            line = _h[_g];
                            lines.push("  ".concat(muted(line)));
                        }
                        lines.push("  ".concat(muted("# stdout: ".concat(logPaths.stdoutPath))));
                        for (_j = 0, _k = (0, gateway_js_1.summarizeLogTail)(stdoutTail, { maxLines: 22 }).map(format_js_1.redactSecrets); _j < _k.length; _j++) {
                            line = _k[_j];
                            lines.push("  ".concat(muted(line)));
                        }
                    }
                    _v.label = 2;
                case 2:
                    params.progress.tick();
                    if (params.channelsStatus) {
                        emitCheck("Channel issues (".concat(params.channelIssues.length || "none", ")"), params.channelIssues.length === 0 ? "ok" : "warn");
                        for (_l = 0, _m = params.channelIssues.slice(0, 12); _l < _m.length; _l++) {
                            issue = _m[_l];
                            fixText = issue.fix ? " \u00B7 fix: ".concat(issue.fix) : "";
                            lines.push("  - ".concat(issue.channel, "[").concat(issue.accountId, "] ").concat(issue.kind, ": ").concat(issue.message).concat(fixText));
                        }
                        if (params.channelIssues.length > 12) {
                            lines.push("  ".concat(muted("\u2026 +".concat(params.channelIssues.length - 12, " more"))));
                        }
                    }
                    else {
                        emitCheck("Channel issues skipped (gateway ".concat(params.gatewayReachable ? "query failed" : "unreachable", ")"), "warn");
                    }
                    healthErr = (function () {
                        if (!params.health || typeof params.health !== "object") {
                            return "";
                        }
                        var record = params.health;
                        if (!("error" in record)) {
                            return "";
                        }
                        var value = record.error;
                        if (!value) {
                            return "";
                        }
                        if (typeof value === "string") {
                            return value;
                        }
                        try {
                            return JSON.stringify(value, null, 2);
                        }
                        catch (_a) {
                            return "[unserializable error]";
                        }
                    })();
                    if (healthErr) {
                        lines.push("");
                        lines.push(muted("Gateway health:"));
                        lines.push("  ".concat(muted((0, format_js_1.redactSecrets)(healthErr))));
                    }
                    lines.push("");
                    lines.push(muted("Pasteable debug report. Auth tokens redacted."));
                    lines.push("Troubleshooting: https://docs.openclaw.ai/troubleshooting");
                    lines.push("");
                    return [2 /*return*/];
            }
        });
    });
}
