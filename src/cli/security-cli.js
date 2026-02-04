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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSecurityCli = registerSecurityCli;
var config_js_1 = require("../config/config.js");
var runtime_js_1 = require("../runtime.js");
var audit_js_1 = require("../security/audit.js");
var fix_js_1 = require("../security/fix.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
var command_format_js_1 = require("./command-format.js");
function formatSummary(summary) {
    var rich = (0, theme_js_1.isRich)();
    var c = summary.critical;
    var w = summary.warn;
    var i = summary.info;
    var parts = [];
    parts.push(rich ? theme_js_1.theme.error("".concat(c, " critical")) : "".concat(c, " critical"));
    parts.push(rich ? theme_js_1.theme.warn("".concat(w, " warn")) : "".concat(w, " warn"));
    parts.push(rich ? theme_js_1.theme.muted("".concat(i, " info")) : "".concat(i, " info"));
    return parts.join(" · ");
}
function registerSecurityCli(program) {
    var _this = this;
    var security = program
        .command("security")
        .description("Security tools (audit)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/security", "docs.openclaw.ai/cli/security"), "\n");
    });
    security
        .command("audit")
        .description("Audit config + local state for common security foot-guns")
        .option("--deep", "Attempt live Gateway probe (best-effort)", false)
        .option("--fix", "Apply safe fixes (tighten defaults + chmod state/config)", false)
        .option("--json", "Print JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var fixResult, _a, cfg, report, rich, heading, muted, lines, _i, _b, change, _c, _d, action, mode, command, _e, _f, err, bySeverity, render;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!opts.fix) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)().catch(function (_err) { return null; })];
                case 1:
                    _a = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _g.label = 3;
                case 3:
                    fixResult = _a;
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            deep: Boolean(opts.deep),
                            includeFilesystem: true,
                            includeChannelSecurity: true,
                        })];
                case 4:
                    report = _g.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(fixResult ? { fix: fixResult, report: report } : report, null, 2));
                        return [2 /*return*/];
                    }
                    rich = (0, theme_js_1.isRich)();
                    heading = function (text) { return (rich ? theme_js_1.theme.heading(text) : text); };
                    muted = function (text) { return (rich ? theme_js_1.theme.muted(text) : text); };
                    lines = [];
                    lines.push(heading("OpenClaw security audit"));
                    lines.push(muted("Summary: ".concat(formatSummary(report.summary))));
                    lines.push(muted("Run deeper: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep"))));
                    if (opts.fix) {
                        lines.push(muted("Fix: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --fix"))));
                        if (!fixResult) {
                            lines.push(muted("Fixes: failed to apply (unexpected error)"));
                        }
                        else if (fixResult.errors.length === 0 &&
                            fixResult.changes.length === 0 &&
                            fixResult.actions.every(function (a) { return !a.ok; })) {
                            lines.push(muted("Fixes: no changes applied"));
                        }
                        else {
                            lines.push("");
                            lines.push(heading("FIX"));
                            for (_i = 0, _b = fixResult.changes; _i < _b.length; _i++) {
                                change = _b[_i];
                                lines.push(muted("  ".concat((0, utils_js_1.shortenHomeInString)(change))));
                            }
                            for (_c = 0, _d = fixResult.actions; _c < _d.length; _c++) {
                                action = _d[_c];
                                if (action.kind === "chmod") {
                                    mode = action.mode.toString(8).padStart(3, "0");
                                    if (action.ok) {
                                        lines.push(muted("  chmod ".concat(mode, " ").concat((0, utils_js_1.shortenHomePath)(action.path))));
                                    }
                                    else if (action.skipped) {
                                        lines.push(muted("  skip chmod ".concat(mode, " ").concat((0, utils_js_1.shortenHomePath)(action.path), " (").concat(action.skipped, ")")));
                                    }
                                    else if (action.error) {
                                        lines.push(muted("  chmod ".concat(mode, " ").concat((0, utils_js_1.shortenHomePath)(action.path), " failed: ").concat(action.error)));
                                    }
                                    continue;
                                }
                                command = (0, utils_js_1.shortenHomeInString)(action.command);
                                if (action.ok) {
                                    lines.push(muted("  ".concat(command)));
                                }
                                else if (action.skipped) {
                                    lines.push(muted("  skip ".concat(command, " (").concat(action.skipped, ")")));
                                }
                                else if (action.error) {
                                    lines.push(muted("  ".concat(command, " failed: ").concat(action.error)));
                                }
                            }
                            if (fixResult.errors.length > 0) {
                                for (_e = 0, _f = fixResult.errors; _e < _f.length; _e++) {
                                    err = _f[_e];
                                    lines.push(muted("  error: ".concat((0, utils_js_1.shortenHomeInString)(err))));
                                }
                            }
                        }
                    }
                    bySeverity = function (sev) {
                        return report.findings.filter(function (f) { return f.severity === sev; });
                    };
                    render = function (sev) {
                        var _a;
                        var list = bySeverity(sev);
                        if (list.length === 0) {
                            return;
                        }
                        var label = sev === "critical"
                            ? rich
                                ? theme_js_1.theme.error("CRITICAL")
                                : "CRITICAL"
                            : sev === "warn"
                                ? rich
                                    ? theme_js_1.theme.warn("WARN")
                                    : "WARN"
                                : rich
                                    ? theme_js_1.theme.muted("INFO")
                                    : "INFO";
                        lines.push("");
                        lines.push(heading(label));
                        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                            var f = list_1[_i];
                            lines.push("".concat(theme_js_1.theme.muted(f.checkId), " ").concat(f.title));
                            lines.push("  ".concat(f.detail));
                            if ((_a = f.remediation) === null || _a === void 0 ? void 0 : _a.trim()) {
                                lines.push("  ".concat(muted("Fix: ".concat(f.remediation.trim()))));
                            }
                        }
                    };
                    render("critical");
                    render("warn");
                    render("info");
                    runtime_js_1.defaultRuntime.log(lines.join("\n"));
                    return [2 /*return*/];
            }
        });
    }); });
}
