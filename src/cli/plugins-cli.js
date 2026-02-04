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
exports.registerPluginsCli = registerPluginsCli;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var archive_js_1 = require("../infra/archive.js");
var install_js_1 = require("../plugins/install.js");
var installs_js_1 = require("../plugins/installs.js");
var slots_js_1 = require("../plugins/slots.js");
var status_js_1 = require("../plugins/status.js");
var update_js_1 = require("../plugins/update.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
function formatPluginLine(plugin, verbose) {
    if (verbose === void 0) { verbose = false; }
    var status = plugin.status === "loaded"
        ? theme_js_1.theme.success("loaded")
        : plugin.status === "disabled"
            ? theme_js_1.theme.warn("disabled")
            : theme_js_1.theme.error("error");
    var name = theme_js_1.theme.command(plugin.name || plugin.id);
    var idSuffix = plugin.name && plugin.name !== plugin.id ? theme_js_1.theme.muted(" (".concat(plugin.id, ")")) : "";
    var desc = plugin.description
        ? theme_js_1.theme.muted(plugin.description.length > 60
            ? "".concat(plugin.description.slice(0, 57), "...")
            : plugin.description)
        : theme_js_1.theme.muted("(no description)");
    if (!verbose) {
        return "".concat(name).concat(idSuffix, " ").concat(status, " - ").concat(desc);
    }
    var parts = [
        "".concat(name).concat(idSuffix, " ").concat(status),
        "  source: ".concat(theme_js_1.theme.muted((0, utils_js_1.shortenHomeInString)(plugin.source))),
        "  origin: ".concat(plugin.origin),
    ];
    if (plugin.version) {
        parts.push("  version: ".concat(plugin.version));
    }
    if (plugin.providerIds.length > 0) {
        parts.push("  providers: ".concat(plugin.providerIds.join(", ")));
    }
    if (plugin.error) {
        parts.push(theme_js_1.theme.error("  error: ".concat(plugin.error)));
    }
    return parts.join("\n");
}
function applySlotSelectionForPlugin(config, pluginId) {
    var report = (0, status_js_1.buildPluginStatusReport)({ config: config });
    var plugin = report.plugins.find(function (entry) { return entry.id === pluginId; });
    if (!plugin) {
        return { config: config, warnings: [] };
    }
    var result = (0, slots_js_1.applyExclusiveSlotSelection)({
        config: config,
        selectedId: plugin.id,
        selectedKind: plugin.kind,
        registry: report,
    });
    return { config: result.config, warnings: result.warnings };
}
function logSlotWarnings(warnings) {
    if (warnings.length === 0) {
        return;
    }
    for (var _i = 0, warnings_1 = warnings; _i < warnings_1.length; _i++) {
        var warning = warnings_1[_i];
        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(warning));
    }
}
function registerPluginsCli(program) {
    var _this = this;
    var plugins = program
        .command("plugins")
        .description("Manage OpenClaw plugins/extensions")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/plugins", "docs.openclaw.ai/cli/plugins"), "\n");
    });
    plugins
        .command("list")
        .description("List discovered plugins")
        .option("--json", "Print JSON")
        .option("--enabled", "Only show enabled plugins", false)
        .option("--verbose", "Show detailed entries", false)
        .action(function (opts) {
        var _a;
        var report = (0, status_js_1.buildPluginStatusReport)();
        var list = opts.enabled
            ? report.plugins.filter(function (p) { return p.status === "loaded"; })
            : report.plugins;
        if (opts.json) {
            var payload = {
                workspaceDir: report.workspaceDir,
                plugins: list,
                diagnostics: report.diagnostics,
            };
            runtime_js_1.defaultRuntime.log(JSON.stringify(payload, null, 2));
            return;
        }
        if (list.length === 0) {
            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No plugins found."));
            return;
        }
        var loaded = list.filter(function (p) { return p.status === "loaded"; }).length;
        runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Plugins"), " ").concat(theme_js_1.theme.muted("(".concat(loaded, "/").concat(list.length, " loaded)"))));
        if (!opts.verbose) {
            var tableWidth = Math.max(60, ((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 120) - 1);
            var rows = list.map(function (plugin) {
                var _a;
                var desc = plugin.description ? theme_js_1.theme.muted(plugin.description) : "";
                var sourceLine = desc ? "".concat(plugin.source, "\n").concat(desc) : plugin.source;
                return {
                    Name: plugin.name || plugin.id,
                    ID: plugin.name && plugin.name !== plugin.id ? plugin.id : "",
                    Status: plugin.status === "loaded"
                        ? theme_js_1.theme.success("loaded")
                        : plugin.status === "disabled"
                            ? theme_js_1.theme.warn("disabled")
                            : theme_js_1.theme.error("error"),
                    Source: sourceLine,
                    Version: (_a = plugin.version) !== null && _a !== void 0 ? _a : "",
                };
            });
            runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                width: tableWidth,
                columns: [
                    { key: "Name", header: "Name", minWidth: 14, flex: true },
                    { key: "ID", header: "ID", minWidth: 10, flex: true },
                    { key: "Status", header: "Status", minWidth: 10 },
                    { key: "Source", header: "Source", minWidth: 26, flex: true },
                    { key: "Version", header: "Version", minWidth: 8 },
                ],
                rows: rows,
            }).trimEnd());
            return;
        }
        var lines = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var plugin = list_1[_i];
            lines.push(formatPluginLine(plugin, true));
            lines.push("");
        }
        runtime_js_1.defaultRuntime.log(lines.join("\n").trim());
    });
    plugins
        .command("info")
        .description("Show plugin details")
        .argument("<id>", "Plugin id")
        .option("--json", "Print JSON")
        .action(function (id, opts) {
        var _a, _b;
        var report = (0, status_js_1.buildPluginStatusReport)();
        var plugin = report.plugins.find(function (p) { return p.id === id || p.name === id; });
        if (!plugin) {
            runtime_js_1.defaultRuntime.error("Plugin not found: ".concat(id));
            process.exit(1);
        }
        var cfg = (0, config_js_1.loadConfig)();
        var install = (_b = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.installs) === null || _b === void 0 ? void 0 : _b[plugin.id];
        if (opts.json) {
            runtime_js_1.defaultRuntime.log(JSON.stringify(plugin, null, 2));
            return;
        }
        var lines = [];
        lines.push(theme_js_1.theme.heading(plugin.name || plugin.id));
        if (plugin.name && plugin.name !== plugin.id) {
            lines.push(theme_js_1.theme.muted("id: ".concat(plugin.id)));
        }
        if (plugin.description) {
            lines.push(plugin.description);
        }
        lines.push("");
        lines.push("".concat(theme_js_1.theme.muted("Status:"), " ").concat(plugin.status));
        lines.push("".concat(theme_js_1.theme.muted("Source:"), " ").concat((0, utils_js_1.shortenHomeInString)(plugin.source)));
        lines.push("".concat(theme_js_1.theme.muted("Origin:"), " ").concat(plugin.origin));
        if (plugin.version) {
            lines.push("".concat(theme_js_1.theme.muted("Version:"), " ").concat(plugin.version));
        }
        if (plugin.toolNames.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("Tools:"), " ").concat(plugin.toolNames.join(", ")));
        }
        if (plugin.hookNames.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("Hooks:"), " ").concat(plugin.hookNames.join(", ")));
        }
        if (plugin.gatewayMethods.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("Gateway methods:"), " ").concat(plugin.gatewayMethods.join(", ")));
        }
        if (plugin.providerIds.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("Providers:"), " ").concat(plugin.providerIds.join(", ")));
        }
        if (plugin.cliCommands.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("CLI commands:"), " ").concat(plugin.cliCommands.join(", ")));
        }
        if (plugin.services.length > 0) {
            lines.push("".concat(theme_js_1.theme.muted("Services:"), " ").concat(plugin.services.join(", ")));
        }
        if (plugin.error) {
            lines.push("".concat(theme_js_1.theme.error("Error:"), " ").concat(plugin.error));
        }
        if (install) {
            lines.push("");
            lines.push("".concat(theme_js_1.theme.muted("Install:"), " ").concat(install.source));
            if (install.spec) {
                lines.push("".concat(theme_js_1.theme.muted("Spec:"), " ").concat(install.spec));
            }
            if (install.sourcePath) {
                lines.push("".concat(theme_js_1.theme.muted("Source path:"), " ").concat((0, utils_js_1.shortenHomePath)(install.sourcePath)));
            }
            if (install.installPath) {
                lines.push("".concat(theme_js_1.theme.muted("Install path:"), " ").concat((0, utils_js_1.shortenHomePath)(install.installPath)));
            }
            if (install.version) {
                lines.push("".concat(theme_js_1.theme.muted("Recorded version:"), " ").concat(install.version));
            }
            if (install.installedAt) {
                lines.push("".concat(theme_js_1.theme.muted("Installed at:"), " ").concat(install.installedAt));
            }
        }
        runtime_js_1.defaultRuntime.log(lines.join("\n"));
    });
    plugins
        .command("enable")
        .description("Enable a plugin in config")
        .argument("<id>", "Plugin id")
        .action(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, next, slotResult;
        var _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    next = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { entries: __assign(__assign({}, (_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.entries), (_a = {}, _a[id] = __assign(__assign({}, (_d = (_c = cfg.plugins) === null || _c === void 0 ? void 0 : _c.entries) === null || _d === void 0 ? void 0 : _d[id]), { enabled: true }), _a)) }) });
                    slotResult = applySlotSelectionForPlugin(next, id);
                    next = slotResult.config;
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 1:
                    _e.sent();
                    logSlotWarnings(slotResult.warnings);
                    runtime_js_1.defaultRuntime.log("Enabled plugin \"".concat(id, "\". Restart the gateway to apply."));
                    return [2 /*return*/];
            }
        });
    }); });
    plugins
        .command("disable")
        .description("Disable a plugin in config")
        .argument("<id>", "Plugin id")
        .action(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, next;
        var _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    next = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { entries: __assign(__assign({}, (_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.entries), (_a = {}, _a[id] = __assign(__assign({}, (_d = (_c = cfg.plugins) === null || _c === void 0 ? void 0 : _c.entries) === null || _d === void 0 ? void 0 : _d[id]), { enabled: false }), _a)) }) });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 1:
                    _e.sent();
                    runtime_js_1.defaultRuntime.log("Disabled plugin \"".concat(id, "\". Restart the gateway to apply."));
                    return [2 /*return*/];
            }
        });
    }); });
    plugins
        .command("install")
        .description("Install a plugin (path, archive, or npm spec)")
        .argument("<path-or-spec>", "Path (.ts/.js/.zip/.tgz/.tar.gz) or an npm package spec")
        .option("-l, --link", "Link a local path instead of copying", false)
        .action(function (raw, opts) { return __awaiter(_this, void 0, void 0, function () {
        var resolved, cfg, existing, merged, probe, next_1, slotResult_1, result_1, next_2, source, slotResult_2, looksLikePath, result, next, slotResult;
        var _a, _b, _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    resolved = (0, utils_js_1.resolveUserPath)(raw);
                    cfg = (0, config_js_1.loadConfig)();
                    if (!node_fs_1.default.existsSync(resolved)) return [3 /*break*/, 6];
                    if (!opts.link) return [3 /*break*/, 3];
                    existing = (_f = (_e = (_d = cfg.plugins) === null || _d === void 0 ? void 0 : _d.load) === null || _e === void 0 ? void 0 : _e.paths) !== null && _f !== void 0 ? _f : [];
                    merged = Array.from(new Set(__spreadArray(__spreadArray([], existing, true), [resolved], false)));
                    return [4 /*yield*/, (0, install_js_1.installPluginFromPath)({ path: resolved, dryRun: true })];
                case 1:
                    probe = _s.sent();
                    if (!probe.ok) {
                        runtime_js_1.defaultRuntime.error(probe.error);
                        process.exit(1);
                    }
                    next_1 = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { load: __assign(__assign({}, (_g = cfg.plugins) === null || _g === void 0 ? void 0 : _g.load), { paths: merged }), entries: __assign(__assign({}, (_h = cfg.plugins) === null || _h === void 0 ? void 0 : _h.entries), (_a = {}, _a[probe.pluginId] = __assign(__assign({}, (_k = (_j = cfg.plugins) === null || _j === void 0 ? void 0 : _j.entries) === null || _k === void 0 ? void 0 : _k[probe.pluginId]), { enabled: true }), _a)) }) });
                    next_1 = (0, installs_js_1.recordPluginInstall)(next_1, {
                        pluginId: probe.pluginId,
                        source: "path",
                        sourcePath: resolved,
                        installPath: resolved,
                        version: probe.version,
                    });
                    slotResult_1 = applySlotSelectionForPlugin(next_1, probe.pluginId);
                    next_1 = slotResult_1.config;
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next_1)];
                case 2:
                    _s.sent();
                    logSlotWarnings(slotResult_1.warnings);
                    runtime_js_1.defaultRuntime.log("Linked plugin path: ".concat((0, utils_js_1.shortenHomePath)(resolved)));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load plugins.");
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, install_js_1.installPluginFromPath)({
                        path: resolved,
                        logger: {
                            info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                            warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                        },
                    })];
                case 4:
                    result_1 = _s.sent();
                    if (!result_1.ok) {
                        runtime_js_1.defaultRuntime.error(result_1.error);
                        process.exit(1);
                    }
                    next_2 = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { entries: __assign(__assign({}, (_l = cfg.plugins) === null || _l === void 0 ? void 0 : _l.entries), (_b = {}, _b[result_1.pluginId] = __assign(__assign({}, (_o = (_m = cfg.plugins) === null || _m === void 0 ? void 0 : _m.entries) === null || _o === void 0 ? void 0 : _o[result_1.pluginId]), { enabled: true }), _b)) }) });
                    source = (0, archive_js_1.resolveArchiveKind)(resolved) ? "archive" : "path";
                    next_2 = (0, installs_js_1.recordPluginInstall)(next_2, {
                        pluginId: result_1.pluginId,
                        source: source,
                        sourcePath: resolved,
                        installPath: result_1.targetDir,
                        version: result_1.version,
                    });
                    slotResult_2 = applySlotSelectionForPlugin(next_2, result_1.pluginId);
                    next_2 = slotResult_2.config;
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next_2)];
                case 5:
                    _s.sent();
                    logSlotWarnings(slotResult_2.warnings);
                    runtime_js_1.defaultRuntime.log("Installed plugin: ".concat(result_1.pluginId));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load plugins.");
                    return [2 /*return*/];
                case 6:
                    if (opts.link) {
                        runtime_js_1.defaultRuntime.error("`--link` requires a local path.");
                        process.exit(1);
                    }
                    looksLikePath = raw.startsWith(".") ||
                        raw.startsWith("~") ||
                        node_path_1.default.isAbsolute(raw) ||
                        raw.endsWith(".ts") ||
                        raw.endsWith(".js") ||
                        raw.endsWith(".mjs") ||
                        raw.endsWith(".cjs") ||
                        raw.endsWith(".tgz") ||
                        raw.endsWith(".tar.gz") ||
                        raw.endsWith(".tar") ||
                        raw.endsWith(".zip");
                    if (looksLikePath) {
                        runtime_js_1.defaultRuntime.error("Path not found: ".concat(resolved));
                        process.exit(1);
                    }
                    return [4 /*yield*/, (0, install_js_1.installPluginFromNpmSpec)({
                            spec: raw,
                            logger: {
                                info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                                warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                            },
                        })];
                case 7:
                    result = _s.sent();
                    if (!result.ok) {
                        runtime_js_1.defaultRuntime.error(result.error);
                        process.exit(1);
                    }
                    next = __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { entries: __assign(__assign({}, (_p = cfg.plugins) === null || _p === void 0 ? void 0 : _p.entries), (_c = {}, _c[result.pluginId] = __assign(__assign({}, (_r = (_q = cfg.plugins) === null || _q === void 0 ? void 0 : _q.entries) === null || _r === void 0 ? void 0 : _r[result.pluginId]), { enabled: true }), _c)) }) });
                    next = (0, installs_js_1.recordPluginInstall)(next, {
                        pluginId: result.pluginId,
                        source: "npm",
                        spec: raw,
                        installPath: result.targetDir,
                        version: result.version,
                    });
                    slotResult = applySlotSelectionForPlugin(next, result.pluginId);
                    next = slotResult.config;
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 8:
                    _s.sent();
                    logSlotWarnings(slotResult.warnings);
                    runtime_js_1.defaultRuntime.log("Installed plugin: ".concat(result.pluginId));
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load plugins.");
                    return [2 /*return*/];
            }
        });
    }); });
    plugins
        .command("update")
        .description("Update installed plugins (npm installs only)")
        .argument("[id]", "Plugin id (omit with --all)")
        .option("--all", "Update all tracked plugins", false)
        .option("--dry-run", "Show what would change without writing", false)
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, installs, targets, result, _i, _a, outcome;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    installs = (_c = (_b = cfg.plugins) === null || _b === void 0 ? void 0 : _b.installs) !== null && _c !== void 0 ? _c : {};
                    targets = opts.all ? Object.keys(installs) : id ? [id] : [];
                    if (targets.length === 0) {
                        if (opts.all) {
                            runtime_js_1.defaultRuntime.log("No npm-installed plugins to update.");
                            return [2 /*return*/];
                        }
                        runtime_js_1.defaultRuntime.error("Provide a plugin id or use --all.");
                        process.exit(1);
                    }
                    return [4 /*yield*/, (0, update_js_1.updateNpmInstalledPlugins)({
                            config: cfg,
                            pluginIds: targets,
                            dryRun: opts.dryRun,
                            logger: {
                                info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                                warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                            },
                        })];
                case 1:
                    result = _d.sent();
                    for (_i = 0, _a = result.outcomes; _i < _a.length; _i++) {
                        outcome = _a[_i];
                        if (outcome.status === "error") {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.error(outcome.message));
                            continue;
                        }
                        if (outcome.status === "skipped") {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(outcome.message));
                            continue;
                        }
                        runtime_js_1.defaultRuntime.log(outcome.message);
                    }
                    if (!(!opts.dryRun && result.changed)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(result.config)];
                case 2:
                    _d.sent();
                    runtime_js_1.defaultRuntime.log("Restart the gateway to load plugins.");
                    _d.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    plugins
        .command("doctor")
        .description("Report plugin load issues")
        .action(function () {
        var _a;
        var report = (0, status_js_1.buildPluginStatusReport)();
        var errors = report.plugins.filter(function (p) { return p.status === "error"; });
        var diags = report.diagnostics.filter(function (d) { return d.level === "error"; });
        if (errors.length === 0 && diags.length === 0) {
            runtime_js_1.defaultRuntime.log("No plugin issues detected.");
            return;
        }
        var lines = [];
        if (errors.length > 0) {
            lines.push(theme_js_1.theme.error("Plugin errors:"));
            for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                var entry = errors_1[_i];
                lines.push("- ".concat(entry.id, ": ").concat((_a = entry.error) !== null && _a !== void 0 ? _a : "failed to load", " (").concat(entry.source, ")"));
            }
        }
        if (diags.length > 0) {
            if (lines.length > 0) {
                lines.push("");
            }
            lines.push(theme_js_1.theme.warn("Diagnostics:"));
            for (var _b = 0, diags_1 = diags; _b < diags_1.length; _b++) {
                var diag = diags_1[_b];
                var target = diag.pluginId ? "".concat(diag.pluginId, ": ") : "";
                lines.push("- ".concat(target).concat(diag.message));
            }
        }
        var docs = (0, links_js_1.formatDocsLink)("/plugin", "docs.openclaw.ai/plugin");
        lines.push("");
        lines.push("".concat(theme_js_1.theme.muted("Docs:"), " ").concat(docs));
        runtime_js_1.defaultRuntime.log(lines.join("\n"));
    });
}
