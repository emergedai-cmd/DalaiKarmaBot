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
exports.formatHooksList = formatHooksList;
exports.formatHookInfo = formatHookInfo;
exports.formatHooksCheck = formatHooksCheck;
exports.enableHook = enableHook;
exports.disableHook = disableHook;
exports.registerHooksCli = registerHooksCli;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var io_js_1 = require("../config/io.js");
var hooks_status_js_1 = require("../hooks/hooks-status.js");
var install_js_1 = require("../hooks/install.js");
var installs_js_1 = require("../hooks/installs.js");
var workspace_js_1 = require("../hooks/workspace.js");
var archive_js_1 = require("../infra/archive.js");
var status_js_1 = require("../plugins/status.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
var command_format_js_1 = require("./command-format.js");
function mergeHookEntries(pluginEntries, workspaceEntries) {
    var merged = new Map();
    for (var _i = 0, pluginEntries_1 = pluginEntries; _i < pluginEntries_1.length; _i++) {
        var entry = pluginEntries_1[_i];
        merged.set(entry.hook.name, entry);
    }
    for (var _a = 0, workspaceEntries_1 = workspaceEntries; _a < workspaceEntries_1.length; _a++) {
        var entry = workspaceEntries_1[_a];
        merged.set(entry.hook.name, entry);
    }
    return Array.from(merged.values());
}
function buildHooksReport(config) {
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
    var workspaceEntries = (0, workspace_js_1.loadWorkspaceHookEntries)(workspaceDir, { config: config });
    var pluginReport = (0, status_js_1.buildPluginStatusReport)({ config: config, workspaceDir: workspaceDir });
    var pluginEntries = pluginReport.hooks.map(function (hook) { return hook.entry; });
    var entries = mergeHookEntries(pluginEntries, workspaceEntries);
    return (0, hooks_status_js_1.buildWorkspaceHookStatus)(workspaceDir, { config: config, entries: entries });
}
function formatHookStatus(hook) {
    if (hook.eligible) {
        return theme_js_1.theme.success("✓ ready");
    }
    if (hook.disabled) {
        return theme_js_1.theme.warn("⏸ disabled");
    }
    return theme_js_1.theme.error("✗ missing");
}
function formatHookName(hook) {
    var _a;
    var emoji = (_a = hook.emoji) !== null && _a !== void 0 ? _a : "🔗";
    return "".concat(emoji, " ").concat(theme_js_1.theme.command(hook.name));
}
function formatHookSource(hook) {
    var _a;
    if (!hook.managedByPlugin) {
        return hook.source;
    }
    return "plugin:".concat((_a = hook.pluginId) !== null && _a !== void 0 ? _a : "unknown");
}
function formatHookMissingSummary(hook) {
    var missing = [];
    if (hook.missing.bins.length > 0) {
        missing.push("bins: ".concat(hook.missing.bins.join(", ")));
    }
    if (hook.missing.anyBins.length > 0) {
        missing.push("anyBins: ".concat(hook.missing.anyBins.join(", ")));
    }
    if (hook.missing.env.length > 0) {
        missing.push("env: ".concat(hook.missing.env.join(", ")));
    }
    if (hook.missing.config.length > 0) {
        missing.push("config: ".concat(hook.missing.config.join(", ")));
    }
    if (hook.missing.os.length > 0) {
        missing.push("os: ".concat(hook.missing.os.join(", ")));
    }
    return missing.join("; ");
}
function readInstalledPackageVersion(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(dir, "package.json"), "utf-8")];
                case 1:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    return [2 /*return*/, typeof parsed.version === "string" ? parsed.version : undefined];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Format the hooks list output
 */
function formatHooksList(report, opts) {
    var _a;
    var hooks = opts.eligible ? report.hooks.filter(function (h) { return h.eligible; }) : report.hooks;
    if (opts.json) {
        var jsonReport = {
            workspaceDir: report.workspaceDir,
            managedHooksDir: report.managedHooksDir,
            hooks: hooks.map(function (h) { return ({
                name: h.name,
                description: h.description,
                emoji: h.emoji,
                eligible: h.eligible,
                disabled: h.disabled,
                source: h.source,
                pluginId: h.pluginId,
                events: h.events,
                homepage: h.homepage,
                missing: h.missing,
                managedByPlugin: h.managedByPlugin,
            }); }),
        };
        return JSON.stringify(jsonReport, null, 2);
    }
    if (hooks.length === 0) {
        var message = opts.eligible
            ? "No eligible hooks found. Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw hooks list"), "` to see all hooks.")
            : "No hooks found.";
        return message;
    }
    var eligible = hooks.filter(function (h) { return h.eligible; });
    var tableWidth = Math.max(60, ((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 120) - 1);
    var rows = hooks.map(function (hook) {
        var missing = formatHookMissingSummary(hook);
        return {
            Status: formatHookStatus(hook),
            Hook: formatHookName(hook),
            Description: theme_js_1.theme.muted(hook.description),
            Source: formatHookSource(hook),
            Missing: missing ? theme_js_1.theme.warn(missing) : "",
        };
    });
    var columns = [
        { key: "Status", header: "Status", minWidth: 10 },
        { key: "Hook", header: "Hook", minWidth: 18, flex: true },
        { key: "Description", header: "Description", minWidth: 24, flex: true },
        { key: "Source", header: "Source", minWidth: 12, flex: true },
    ];
    if (opts.verbose) {
        columns.push({ key: "Missing", header: "Missing", minWidth: 18, flex: true });
    }
    var lines = [];
    lines.push("".concat(theme_js_1.theme.heading("Hooks"), " ").concat(theme_js_1.theme.muted("(".concat(eligible.length, "/").concat(hooks.length, " ready)"))));
    lines.push((0, table_js_1.renderTable)({
        width: tableWidth,
        columns: columns,
        rows: rows,
    }).trimEnd());
    return lines.join("\n");
}
/**
 * Format detailed info for a single hook
 */
function formatHookInfo(report, hookName, opts) {
    var _a, _b;
    var hook = report.hooks.find(function (h) { return h.name === hookName || h.hookKey === hookName; });
    if (!hook) {
        if (opts.json) {
            return JSON.stringify({ error: "not found", hook: hookName }, null, 2);
        }
        return "Hook \"".concat(hookName, "\" not found. Run `").concat((0, command_format_js_1.formatCliCommand)("openclaw hooks list"), "` to see available hooks.");
    }
    if (opts.json) {
        return JSON.stringify(hook, null, 2);
    }
    var lines = [];
    var emoji = (_a = hook.emoji) !== null && _a !== void 0 ? _a : "🔗";
    var status = hook.eligible
        ? theme_js_1.theme.success("✓ Ready")
        : hook.disabled
            ? theme_js_1.theme.warn("⏸ Disabled")
            : theme_js_1.theme.error("✗ Missing requirements");
    lines.push("".concat(emoji, " ").concat(theme_js_1.theme.heading(hook.name), " ").concat(status));
    lines.push("");
    lines.push(hook.description);
    lines.push("");
    // Details
    lines.push(theme_js_1.theme.heading("Details:"));
    if (hook.managedByPlugin) {
        lines.push("".concat(theme_js_1.theme.muted("  Source:"), " ").concat(hook.source, " (").concat((_b = hook.pluginId) !== null && _b !== void 0 ? _b : "unknown", ")"));
    }
    else {
        lines.push("".concat(theme_js_1.theme.muted("  Source:"), " ").concat(hook.source));
    }
    lines.push("".concat(theme_js_1.theme.muted("  Path:"), " ").concat((0, utils_js_1.shortenHomePath)(hook.filePath)));
    lines.push("".concat(theme_js_1.theme.muted("  Handler:"), " ").concat((0, utils_js_1.shortenHomePath)(hook.handlerPath)));
    if (hook.homepage) {
        lines.push("".concat(theme_js_1.theme.muted("  Homepage:"), " ").concat(hook.homepage));
    }
    if (hook.events.length > 0) {
        lines.push("".concat(theme_js_1.theme.muted("  Events:"), " ").concat(hook.events.join(", ")));
    }
    if (hook.managedByPlugin) {
        lines.push(theme_js_1.theme.muted("  Managed by plugin; enable/disable via hooks CLI not available."));
    }
    // Requirements
    var hasRequirements = hook.requirements.bins.length > 0 ||
        hook.requirements.anyBins.length > 0 ||
        hook.requirements.env.length > 0 ||
        hook.requirements.config.length > 0 ||
        hook.requirements.os.length > 0;
    if (hasRequirements) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Requirements:"));
        if (hook.requirements.bins.length > 0) {
            var binsStatus = hook.requirements.bins.map(function (bin) {
                var missing = hook.missing.bins.includes(bin);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(bin)) : theme_js_1.theme.success("\u2713 ".concat(bin));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Binaries:"), " ").concat(binsStatus.join(", ")));
        }
        if (hook.requirements.anyBins.length > 0) {
            var anyBinsStatus = hook.missing.anyBins.length > 0
                ? theme_js_1.theme.error("\u2717 (any of: ".concat(hook.requirements.anyBins.join(", "), ")"))
                : theme_js_1.theme.success("\u2713 (any of: ".concat(hook.requirements.anyBins.join(", "), ")"));
            lines.push("".concat(theme_js_1.theme.muted("  Any binary:"), " ").concat(anyBinsStatus));
        }
        if (hook.requirements.env.length > 0) {
            var envStatus = hook.requirements.env.map(function (env) {
                var missing = hook.missing.env.includes(env);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(env)) : theme_js_1.theme.success("\u2713 ".concat(env));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Environment:"), " ").concat(envStatus.join(", ")));
        }
        if (hook.requirements.config.length > 0) {
            var configStatus = hook.configChecks.map(function (check) {
                return check.satisfied ? theme_js_1.theme.success("\u2713 ".concat(check.path)) : theme_js_1.theme.error("\u2717 ".concat(check.path));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Config:"), " ").concat(configStatus.join(", ")));
        }
        if (hook.requirements.os.length > 0) {
            var osStatus = hook.missing.os.length > 0
                ? theme_js_1.theme.error("\u2717 (".concat(hook.requirements.os.join(", "), ")"))
                : theme_js_1.theme.success("\u2713 (".concat(hook.requirements.os.join(", "), ")"));
            lines.push("".concat(theme_js_1.theme.muted("  OS:"), " ").concat(osStatus));
        }
    }
    return lines.join("\n");
}
/**
 * Format check output
 */
function formatHooksCheck(report, opts) {
    var _a;
    if (opts.json) {
        var eligible_1 = report.hooks.filter(function (h) { return h.eligible; });
        var notEligible_2 = report.hooks.filter(function (h) { return !h.eligible; });
        return JSON.stringify({
            total: report.hooks.length,
            eligible: eligible_1.length,
            notEligible: notEligible_2.length,
            hooks: {
                eligible: eligible_1.map(function (h) { return h.name; }),
                notEligible: notEligible_2.map(function (h) { return ({
                    name: h.name,
                    missing: h.missing,
                }); }),
            },
        }, null, 2);
    }
    var eligible = report.hooks.filter(function (h) { return h.eligible; });
    var notEligible = report.hooks.filter(function (h) { return !h.eligible; });
    var lines = [];
    lines.push(theme_js_1.theme.heading("Hooks Status"));
    lines.push("");
    lines.push("".concat(theme_js_1.theme.muted("Total hooks:"), " ").concat(report.hooks.length));
    lines.push("".concat(theme_js_1.theme.success("Ready:"), " ").concat(eligible.length));
    lines.push("".concat(theme_js_1.theme.warn("Not ready:"), " ").concat(notEligible.length));
    if (notEligible.length > 0) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Hooks not ready:"));
        for (var _i = 0, notEligible_1 = notEligible; _i < notEligible_1.length; _i++) {
            var hook = notEligible_1[_i];
            var reasons = [];
            if (hook.disabled) {
                reasons.push("disabled");
            }
            if (hook.missing.bins.length > 0) {
                reasons.push("bins: ".concat(hook.missing.bins.join(", ")));
            }
            if (hook.missing.anyBins.length > 0) {
                reasons.push("anyBins: ".concat(hook.missing.anyBins.join(", ")));
            }
            if (hook.missing.env.length > 0) {
                reasons.push("env: ".concat(hook.missing.env.join(", ")));
            }
            if (hook.missing.config.length > 0) {
                reasons.push("config: ".concat(hook.missing.config.join(", ")));
            }
            if (hook.missing.os.length > 0) {
                reasons.push("os: ".concat(hook.missing.os.join(", ")));
            }
            lines.push("  ".concat((_a = hook.emoji) !== null && _a !== void 0 ? _a : "🔗", " ").concat(hook.name, " - ").concat(reasons.join("; ")));
        }
    }
    return lines.join("\n");
}
function enableHook(hookName) {
    return __awaiter(this, void 0, void 0, function () {
        var config, report, hook, entries, nextConfig;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    config = (0, io_js_1.loadConfig)();
                    report = buildHooksReport(config);
                    hook = report.hooks.find(function (h) { return h.name === hookName; });
                    if (!hook) {
                        throw new Error("Hook \"".concat(hookName, "\" not found"));
                    }
                    if (hook.managedByPlugin) {
                        throw new Error("Hook \"".concat(hookName, "\" is managed by plugin \"").concat((_a = hook.pluginId) !== null && _a !== void 0 ? _a : "unknown", "\" and cannot be enabled/disabled."));
                    }
                    if (!hook.eligible) {
                        throw new Error("Hook \"".concat(hookName, "\" is not eligible (missing requirements)"));
                    }
                    entries = __assign({}, (_c = (_b = config.hooks) === null || _b === void 0 ? void 0 : _b.internal) === null || _c === void 0 ? void 0 : _c.entries);
                    entries[hookName] = __assign(__assign({}, entries[hookName]), { enabled: true });
                    nextConfig = __assign(__assign({}, config), { hooks: __assign(__assign({}, config.hooks), { internal: __assign(__assign({}, (_d = config.hooks) === null || _d === void 0 ? void 0 : _d.internal), { enabled: true, entries: entries }) }) });
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(nextConfig)];
                case 1:
                    _f.sent();
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.success("✓"), " Enabled hook: ").concat((_e = hook.emoji) !== null && _e !== void 0 ? _e : "🔗", " ").concat(theme_js_1.theme.command(hookName)));
                    return [2 /*return*/];
            }
        });
    });
}
function disableHook(hookName) {
    return __awaiter(this, void 0, void 0, function () {
        var config, report, hook, entries, nextConfig;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    config = (0, io_js_1.loadConfig)();
                    report = buildHooksReport(config);
                    hook = report.hooks.find(function (h) { return h.name === hookName; });
                    if (!hook) {
                        throw new Error("Hook \"".concat(hookName, "\" not found"));
                    }
                    if (hook.managedByPlugin) {
                        throw new Error("Hook \"".concat(hookName, "\" is managed by plugin \"").concat((_a = hook.pluginId) !== null && _a !== void 0 ? _a : "unknown", "\" and cannot be enabled/disabled."));
                    }
                    entries = __assign({}, (_c = (_b = config.hooks) === null || _b === void 0 ? void 0 : _b.internal) === null || _c === void 0 ? void 0 : _c.entries);
                    entries[hookName] = __assign(__assign({}, entries[hookName]), { enabled: false });
                    nextConfig = __assign(__assign({}, config), { hooks: __assign(__assign({}, config.hooks), { internal: __assign(__assign({}, (_d = config.hooks) === null || _d === void 0 ? void 0 : _d.internal), { entries: entries }) }) });
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(nextConfig)];
                case 1:
                    _f.sent();
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.warn("⏸"), " Disabled hook: ").concat((_e = hook.emoji) !== null && _e !== void 0 ? _e : "🔗", " ").concat(theme_js_1.theme.command(hookName)));
                    return [2 /*return*/];
            }
        });
    });
}
function registerHooksCli(program) {
    var _this = this;
    var hooks = program
        .command("hooks")
        .description("Manage internal agent hooks")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/hooks", "docs.openclaw.ai/cli/hooks"), "\n");
    });
    hooks
        .command("list")
        .description("List all hooks")
        .option("--eligible", "Show only eligible hooks", false)
        .option("--json", "Output as JSON", false)
        .option("-v, --verbose", "Show more details including missing requirements", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, report;
        return __generator(this, function (_a) {
            try {
                config = (0, io_js_1.loadConfig)();
                report = buildHooksReport(config);
                runtime_js_1.defaultRuntime.log(formatHooksList(report, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err instanceof Error ? err.message : String(err)));
                process.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    hooks
        .command("info <name>")
        .description("Show detailed information about a hook")
        .option("--json", "Output as JSON", false)
        .action(function (name, opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, report;
        return __generator(this, function (_a) {
            try {
                config = (0, io_js_1.loadConfig)();
                report = buildHooksReport(config);
                runtime_js_1.defaultRuntime.log(formatHookInfo(report, name, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err instanceof Error ? err.message : String(err)));
                process.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    hooks
        .command("check")
        .description("Check hooks eligibility status")
        .option("--json", "Output as JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, report;
        return __generator(this, function (_a) {
            try {
                config = (0, io_js_1.loadConfig)();
                report = buildHooksReport(config);
                runtime_js_1.defaultRuntime.log(formatHooksCheck(report, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err instanceof Error ? err.message : String(err)));
                process.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    hooks
        .command("enable <name>")
        .description("Enable a hook")
        .action(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, enableHook(name)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    hooks
        .command("disable <name>")
        .description("Disable a hook")
        .action(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, disableHook(name)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err_2 instanceof Error ? err_2.message : String(err_2)));
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    hooks
        .command("install")
        .description("Install a hook pack (path, archive, or npm spec)")
        .argument("<path-or-spec>", "Path to a hook pack or npm package spec")
        .option("-l, --link", "Link a local path instead of copying", false)
        .action(function (raw, opts) { return __awaiter(_this, void 0, void 0, function () {
        var resolved, cfg, stat, existing, merged, probe, next_1, _i, _a, hookName, result_1, next_2, _b, _c, hookName, source, looksLikePath, result, next, _d, _e, hookName;
        var _f, _g, _h;
        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        return __generator(this, function (_15) {
            switch (_15.label) {
                case 0:
                    resolved = (0, utils_js_1.resolveUserPath)(raw);
                    cfg = (0, io_js_1.loadConfig)();
                    if (!node_fs_1.default.existsSync(resolved)) return [3 /*break*/, 6];
                    if (!opts.link) return [3 /*break*/, 3];
                    stat = node_fs_1.default.statSync(resolved);
                    if (!stat.isDirectory()) {
                        runtime_js_1.defaultRuntime.error("Linked hook paths must be directories.");
                        process.exit(1);
                    }
                    existing = (_m = (_l = (_k = (_j = cfg.hooks) === null || _j === void 0 ? void 0 : _j.internal) === null || _k === void 0 ? void 0 : _k.load) === null || _l === void 0 ? void 0 : _l.extraDirs) !== null && _m !== void 0 ? _m : [];
                    merged = Array.from(new Set(__spreadArray(__spreadArray([], existing, true), [resolved], false)));
                    return [4 /*yield*/, (0, install_js_1.installHooksFromPath)({ path: resolved, dryRun: true })];
                case 1:
                    probe = _15.sent();
                    if (!probe.ok) {
                        runtime_js_1.defaultRuntime.error(probe.error);
                        process.exit(1);
                    }
                    next_1 = __assign(__assign({}, cfg), { hooks: __assign(__assign({}, cfg.hooks), { internal: __assign(__assign({}, (_o = cfg.hooks) === null || _o === void 0 ? void 0 : _o.internal), { enabled: true, load: __assign(__assign({}, (_q = (_p = cfg.hooks) === null || _p === void 0 ? void 0 : _p.internal) === null || _q === void 0 ? void 0 : _q.load), { extraDirs: merged }) }) }) });
                    for (_i = 0, _a = probe.hooks; _i < _a.length; _i++) {
                        hookName = _a[_i];
                        next_1 = __assign(__assign({}, next_1), { hooks: __assign(__assign({}, next_1.hooks), { internal: __assign(__assign({}, (_r = next_1.hooks) === null || _r === void 0 ? void 0 : _r.internal), { entries: __assign(__assign({}, (_t = (_s = next_1.hooks) === null || _s === void 0 ? void 0 : _s.internal) === null || _t === void 0 ? void 0 : _t.entries), (_f = {}, _f[hookName] = __assign(__assign({}, (_w = (_v = (_u = next_1.hooks) === null || _u === void 0 ? void 0 : _u.internal) === null || _v === void 0 ? void 0 : _v.entries) === null || _w === void 0 ? void 0 : _w[hookName]), { enabled: true }), _f)) }) }) });
                    }
                    next_1 = (0, installs_js_1.recordHookInstall)(next_1, {
                        hookId: probe.hookPackId,
                        source: "path",
                        sourcePath: resolved,
                        installPath: resolved,
                        version: probe.version,
                        hooks: probe.hooks,
                    });
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(next_1)];
                case 2:
                    _15.sent();
                    runtime_js_1.defaultRuntime.log("Linked hook path: ".concat((0, utils_js_1.shortenHomePath)(resolved)));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load hooks.");
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, install_js_1.installHooksFromPath)({
                        path: resolved,
                        logger: {
                            info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                            warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                        },
                    })];
                case 4:
                    result_1 = _15.sent();
                    if (!result_1.ok) {
                        runtime_js_1.defaultRuntime.error(result_1.error);
                        process.exit(1);
                    }
                    next_2 = __assign(__assign({}, cfg), { hooks: __assign(__assign({}, cfg.hooks), { internal: __assign(__assign({}, (_x = cfg.hooks) === null || _x === void 0 ? void 0 : _x.internal), { enabled: true, entries: __assign({}, (_z = (_y = cfg.hooks) === null || _y === void 0 ? void 0 : _y.internal) === null || _z === void 0 ? void 0 : _z.entries) }) }) });
                    for (_b = 0, _c = result_1.hooks; _b < _c.length; _b++) {
                        hookName = _c[_b];
                        next_2 = __assign(__assign({}, next_2), { hooks: __assign(__assign({}, next_2.hooks), { internal: __assign(__assign({}, (_0 = next_2.hooks) === null || _0 === void 0 ? void 0 : _0.internal), { entries: __assign(__assign({}, (_2 = (_1 = next_2.hooks) === null || _1 === void 0 ? void 0 : _1.internal) === null || _2 === void 0 ? void 0 : _2.entries), (_g = {}, _g[hookName] = __assign(__assign({}, (_5 = (_4 = (_3 = next_2.hooks) === null || _3 === void 0 ? void 0 : _3.internal) === null || _4 === void 0 ? void 0 : _4.entries) === null || _5 === void 0 ? void 0 : _5[hookName]), { enabled: true }), _g)) }) }) });
                    }
                    source = (0, archive_js_1.resolveArchiveKind)(resolved) ? "archive" : "path";
                    next_2 = (0, installs_js_1.recordHookInstall)(next_2, {
                        hookId: result_1.hookPackId,
                        source: source,
                        sourcePath: resolved,
                        installPath: result_1.targetDir,
                        version: result_1.version,
                        hooks: result_1.hooks,
                    });
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(next_2)];
                case 5:
                    _15.sent();
                    runtime_js_1.defaultRuntime.log("Installed hooks: ".concat(result_1.hooks.join(", ")));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load hooks.");
                    return [2 /*return*/];
                case 6:
                    if (opts.link) {
                        runtime_js_1.defaultRuntime.error("`--link` requires a local path.");
                        process.exit(1);
                    }
                    looksLikePath = raw.startsWith(".") ||
                        raw.startsWith("~") ||
                        node_path_1.default.isAbsolute(raw) ||
                        raw.endsWith(".zip") ||
                        raw.endsWith(".tgz") ||
                        raw.endsWith(".tar.gz") ||
                        raw.endsWith(".tar");
                    if (looksLikePath) {
                        runtime_js_1.defaultRuntime.error("Path not found: ".concat(resolved));
                        process.exit(1);
                    }
                    return [4 /*yield*/, (0, install_js_1.installHooksFromNpmSpec)({
                            spec: raw,
                            logger: {
                                info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                                warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                            },
                        })];
                case 7:
                    result = _15.sent();
                    if (!result.ok) {
                        runtime_js_1.defaultRuntime.error(result.error);
                        process.exit(1);
                    }
                    next = __assign(__assign({}, cfg), { hooks: __assign(__assign({}, cfg.hooks), { internal: __assign(__assign({}, (_6 = cfg.hooks) === null || _6 === void 0 ? void 0 : _6.internal), { enabled: true, entries: __assign({}, (_8 = (_7 = cfg.hooks) === null || _7 === void 0 ? void 0 : _7.internal) === null || _8 === void 0 ? void 0 : _8.entries) }) }) });
                    for (_d = 0, _e = result.hooks; _d < _e.length; _d++) {
                        hookName = _e[_d];
                        next = __assign(__assign({}, next), { hooks: __assign(__assign({}, next.hooks), { internal: __assign(__assign({}, (_9 = next.hooks) === null || _9 === void 0 ? void 0 : _9.internal), { entries: __assign(__assign({}, (_11 = (_10 = next.hooks) === null || _10 === void 0 ? void 0 : _10.internal) === null || _11 === void 0 ? void 0 : _11.entries), (_h = {}, _h[hookName] = __assign(__assign({}, (_14 = (_13 = (_12 = next.hooks) === null || _12 === void 0 ? void 0 : _12.internal) === null || _13 === void 0 ? void 0 : _13.entries) === null || _14 === void 0 ? void 0 : _14[hookName]), { enabled: true }), _h)) }) }) });
                    }
                    next = (0, installs_js_1.recordHookInstall)(next, {
                        hookId: result.hookPackId,
                        source: "npm",
                        spec: raw,
                        installPath: result.targetDir,
                        version: result.version,
                        hooks: result.hooks,
                    });
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(next)];
                case 8:
                    _15.sent();
                    runtime_js_1.defaultRuntime.log("Installed hooks: ".concat(result.hooks.join(", ")));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load hooks.");
                    return [2 /*return*/];
            }
        });
    }); });
    hooks
        .command("update")
        .description("Update installed hooks (npm installs only)")
        .argument("[id]", "Hook pack id (omit with --all)")
        .option("--all", "Update all tracked hooks", false)
        .option("--dry-run", "Show what would change without writing", false)
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, installs, targets, nextCfg, updatedCount, _i, targets_1, hookId, record, installPath, currentVersion, probe, nextVersion_1, currentLabel_1, result, nextVersion, _a, currentLabel, nextLabel;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cfg = (0, io_js_1.loadConfig)();
                    installs = (_d = (_c = (_b = cfg.hooks) === null || _b === void 0 ? void 0 : _b.internal) === null || _c === void 0 ? void 0 : _c.installs) !== null && _d !== void 0 ? _d : {};
                    targets = opts.all ? Object.keys(installs) : id ? [id] : [];
                    if (targets.length === 0) {
                        runtime_js_1.defaultRuntime.error("Provide a hook id or use --all.");
                        process.exit(1);
                    }
                    nextCfg = cfg;
                    updatedCount = 0;
                    _i = 0, targets_1 = targets;
                    _h.label = 1;
                case 1:
                    if (!(_i < targets_1.length)) return [3 /*break*/, 10];
                    hookId = targets_1[_i];
                    record = installs[hookId];
                    if (!record) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("No install record for \"".concat(hookId, "\".")));
                        return [3 /*break*/, 9];
                    }
                    if (record.source !== "npm") {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Skipping \"".concat(hookId, "\" (source: ").concat(record.source, ").")));
                        return [3 /*break*/, 9];
                    }
                    if (!record.spec) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Skipping \"".concat(hookId, "\" (missing npm spec).")));
                        return [3 /*break*/, 9];
                    }
                    installPath = void 0;
                    try {
                        installPath = (_e = record.installPath) !== null && _e !== void 0 ? _e : (0, install_js_1.resolveHookInstallDir)(hookId);
                    }
                    catch (err) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.error("Invalid install path for \"".concat(hookId, "\": ").concat(String(err))));
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, readInstalledPackageVersion(installPath)];
                case 2:
                    currentVersion = _h.sent();
                    if (!opts.dryRun) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, install_js_1.installHooksFromNpmSpec)({
                            spec: record.spec,
                            mode: "update",
                            dryRun: true,
                            expectedHookPackId: hookId,
                            logger: {
                                info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                                warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                            },
                        })];
                case 3:
                    probe = _h.sent();
                    if (!probe.ok) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.error("Failed to check ".concat(hookId, ": ").concat(probe.error)));
                        return [3 /*break*/, 9];
                    }
                    nextVersion_1 = (_f = probe.version) !== null && _f !== void 0 ? _f : "unknown";
                    currentLabel_1 = currentVersion !== null && currentVersion !== void 0 ? currentVersion : "unknown";
                    if (currentVersion && probe.version && currentVersion === probe.version) {
                        runtime_js_1.defaultRuntime.log("".concat(hookId, " is up to date (").concat(currentLabel_1, ")."));
                    }
                    else {
                        runtime_js_1.defaultRuntime.log("Would update ".concat(hookId, ": ").concat(currentLabel_1, " \u2192 ").concat(nextVersion_1, "."));
                    }
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, (0, install_js_1.installHooksFromNpmSpec)({
                        spec: record.spec,
                        mode: "update",
                        expectedHookPackId: hookId,
                        logger: {
                            info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                            warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                        },
                    })];
                case 5:
                    result = _h.sent();
                    if (!result.ok) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.error("Failed to update ".concat(hookId, ": ").concat(result.error)));
                        return [3 /*break*/, 9];
                    }
                    if (!((_g = result.version) !== null && _g !== void 0)) return [3 /*break*/, 6];
                    _a = _g;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, readInstalledPackageVersion(result.targetDir)];
                case 7:
                    _a = (_h.sent());
                    _h.label = 8;
                case 8:
                    nextVersion = _a;
                    nextCfg = (0, installs_js_1.recordHookInstall)(nextCfg, {
                        hookId: hookId,
                        source: "npm",
                        spec: record.spec,
                        installPath: result.targetDir,
                        version: nextVersion,
                        hooks: result.hooks,
                    });
                    updatedCount += 1;
                    currentLabel = currentVersion !== null && currentVersion !== void 0 ? currentVersion : "unknown";
                    nextLabel = nextVersion !== null && nextVersion !== void 0 ? nextVersion : "unknown";
                    if (currentVersion && nextVersion && currentVersion === nextVersion) {
                        runtime_js_1.defaultRuntime.log("".concat(hookId, " already at ").concat(currentLabel, "."));
                    }
                    else {
                        runtime_js_1.defaultRuntime.log("Updated ".concat(hookId, ": ").concat(currentLabel, " \u2192 ").concat(nextLabel, "."));
                    }
                    _h.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10:
                    if (!(updatedCount > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, io_js_1.writeConfigFile)(nextCfg)];
                case 11:
                    _h.sent();
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load hooks.");
                    _h.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); });
    hooks.action(function () { return __awaiter(_this, void 0, void 0, function () {
        var config, report;
        return __generator(this, function (_a) {
            try {
                config = (0, io_js_1.loadConfig)();
                report = buildHooksReport(config);
                runtime_js_1.defaultRuntime.log(formatHooksList(report, {}));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error("".concat(theme_js_1.theme.error("Error:"), " ").concat(err instanceof Error ? err.message : String(err)));
                process.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
}
