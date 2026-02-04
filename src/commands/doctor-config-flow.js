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
exports.loadAndMaybeMigrateDoctorConfig = loadAndMaybeMigrateDoctorConfig;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var plugin_auto_enable_js_1 = require("../config/plugin-auto-enable.js");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
var doctor_legacy_config_js_1 = require("./doctor-legacy-config.js");
var doctor_state_migrations_js_1 = require("./doctor-state-migrations.js");
function isRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeIssuePath(path) {
    return path.filter(function (part) { return typeof part !== "symbol"; });
}
function isUnrecognizedKeysIssue(issue) {
    return issue.code === "unrecognized_keys";
}
function formatPath(parts) {
    if (parts.length === 0) {
        return "<root>";
    }
    var out = "";
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (typeof part === "number") {
            out += "[".concat(part, "]");
            continue;
        }
        out = out ? "".concat(out, ".").concat(part) : part;
    }
    return out || "<root>";
}
function resolvePathTarget(root, path) {
    var current = root;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var part = path_1[_i];
        if (typeof part === "number") {
            if (!Array.isArray(current)) {
                return null;
            }
            if (part < 0 || part >= current.length) {
                return null;
            }
            current = current[part];
            continue;
        }
        if (!current || typeof current !== "object" || Array.isArray(current)) {
            return null;
        }
        var record = current;
        if (!(part in record)) {
            return null;
        }
        current = record[part];
    }
    return current;
}
function stripUnknownConfigKeys(config) {
    var parsed = config_js_1.OpenClawSchema.safeParse(config);
    if (parsed.success) {
        return { config: config, removed: [] };
    }
    var next = structuredClone(config);
    var removed = [];
    for (var _i = 0, _a = parsed.error.issues; _i < _a.length; _i++) {
        var issue = _a[_i];
        if (!isUnrecognizedKeysIssue(issue)) {
            continue;
        }
        var path_2 = normalizeIssuePath(issue.path);
        var target = resolvePathTarget(next, path_2);
        if (!target || typeof target !== "object" || Array.isArray(target)) {
            continue;
        }
        var record = target;
        for (var _b = 0, _c = issue.keys; _b < _c.length; _b++) {
            var key = _c[_b];
            if (typeof key !== "string") {
                continue;
            }
            if (!(key in record)) {
                continue;
            }
            delete record[key];
            removed.push(formatPath(__spreadArray(__spreadArray([], path_2, true), [key], false)));
        }
    }
    return { config: next, removed: removed };
}
function noteOpencodeProviderOverrides(cfg) {
    var _a;
    var providers = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers;
    if (!providers) {
        return;
    }
    // 2026-01-10: warn when OpenCode Zen overrides mask built-in routing/costs (8a194b4abc360c6098f157956bb9322576b44d51, 2d105d16f8a099276114173836d46b46cdfbdbae).
    var overrides = [];
    if (providers.opencode) {
        overrides.push("opencode");
    }
    if (providers["opencode-zen"]) {
        overrides.push("opencode-zen");
    }
    if (overrides.length === 0) {
        return;
    }
    var lines = overrides.flatMap(function (id) {
        var providerEntry = providers[id];
        var api = isRecord(providerEntry) && typeof providerEntry.api === "string"
            ? providerEntry.api
            : undefined;
        return [
            "- models.providers.".concat(id, " is set; this overrides the built-in OpenCode Zen catalog."),
            api ? "- models.providers.".concat(id, ".api=").concat(api) : null,
        ].filter(function (line) { return Boolean(line); });
    });
    lines.push("- Remove these entries to restore per-model API routing + costs (then re-run onboarding if needed).");
    (0, note_js_1.note)(lines.join("\n"), "OpenCode Zen");
}
function maybeMigrateLegacyConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var changes, home, targetDir, targetPath, _a, legacyCandidates, legacyPath, _i, legacyCandidates_1, candidate, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    changes = [];
                    home = (0, utils_js_1.resolveHomeDir)();
                    if (!home) {
                        return [2 /*return*/, changes];
                    }
                    targetDir = node_path_1.default.join(home, ".openclaw");
                    targetPath = node_path_1.default.join(targetDir, "openclaw.json");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.access(targetPath)];
                case 2:
                    _d.sent();
                    return [2 /*return*/, changes];
                case 3:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 4:
                    legacyCandidates = [
                        node_path_1.default.join(home, ".clawdbot", "clawdbot.json"),
                        node_path_1.default.join(home, ".moltbot", "moltbot.json"),
                        node_path_1.default.join(home, ".moldbot", "moldbot.json"),
                    ];
                    legacyPath = null;
                    _i = 0, legacyCandidates_1 = legacyCandidates;
                    _d.label = 5;
                case 5:
                    if (!(_i < legacyCandidates_1.length)) return [3 /*break*/, 10];
                    candidate = legacyCandidates_1[_i];
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.access(candidate)];
                case 7:
                    _d.sent();
                    legacyPath = candidate;
                    return [3 /*break*/, 10];
                case 8:
                    _b = _d.sent();
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10:
                    if (!legacyPath) {
                        return [2 /*return*/, changes];
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(targetDir, { recursive: true })];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12:
                    _d.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, promises_1.default.copyFile(legacyPath, targetPath, promises_1.default.constants.COPYFILE_EXCL)];
                case 13:
                    _d.sent();
                    changes.push("Migrated legacy config: ".concat(legacyPath, " -> ").concat(targetPath));
                    return [3 /*break*/, 15];
                case 14:
                    _c = _d.sent();
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/, changes];
            }
        });
    });
}
function loadAndMaybeMigrateDoctorConfig(params) {
    return __awaiter(this, void 0, void 0, function () {
        var shouldRepair, stateDirResult, legacyConfigChanges, snapshot, baseCfg, cfg, candidate, pendingChanges, shouldWriteConfig, fixHints, warnings, lines, _a, migrated, changes, normalized, autoEnable, unknown, lines, shouldApply;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    shouldRepair = params.options.repair === true || params.options.yes === true;
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyStateDir)({ env: process.env })];
                case 1:
                    stateDirResult = _e.sent();
                    if (stateDirResult.changes.length > 0) {
                        (0, note_js_1.note)(stateDirResult.changes.map(function (entry) { return "- ".concat(entry); }).join("\n"), "Doctor changes");
                    }
                    if (stateDirResult.warnings.length > 0) {
                        (0, note_js_1.note)(stateDirResult.warnings.map(function (entry) { return "- ".concat(entry); }).join("\n"), "Doctor warnings");
                    }
                    return [4 /*yield*/, maybeMigrateLegacyConfig()];
                case 2:
                    legacyConfigChanges = _e.sent();
                    if (legacyConfigChanges.length > 0) {
                        (0, note_js_1.note)(legacyConfigChanges.map(function (entry) { return "- ".concat(entry); }).join("\n"), "Doctor changes");
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 3:
                    snapshot = _e.sent();
                    baseCfg = (_b = snapshot.config) !== null && _b !== void 0 ? _b : {};
                    cfg = baseCfg;
                    candidate = structuredClone(baseCfg);
                    pendingChanges = false;
                    shouldWriteConfig = false;
                    fixHints = [];
                    if (snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) {
                        (0, note_js_1.note)("Config invalid; doctor will run with best-effort config.", "Config");
                    }
                    warnings = (_c = snapshot.warnings) !== null && _c !== void 0 ? _c : [];
                    if (warnings.length > 0) {
                        lines = warnings.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); }).join("\n");
                        (0, note_js_1.note)(lines, "Config warnings");
                    }
                    if (snapshot.legacyIssues.length > 0) {
                        (0, note_js_1.note)(snapshot.legacyIssues.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); }).join("\n"), "Legacy config keys detected");
                        _a = (0, config_js_1.migrateLegacyConfig)(snapshot.parsed), migrated = _a.config, changes = _a.changes;
                        if (changes.length > 0) {
                            (0, note_js_1.note)(changes.join("\n"), "Doctor changes");
                        }
                        if (migrated) {
                            candidate = migrated;
                            pendingChanges = pendingChanges || changes.length > 0;
                        }
                        if (shouldRepair) {
                            // Legacy migration (2026-01-02, commit: 16420e5b) — normalize per-provider allowlists; move WhatsApp gating into channels.whatsapp.allowFrom.
                            if (migrated) {
                                cfg = migrated;
                            }
                        }
                        else {
                            fixHints.push("Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"), "\" to apply legacy migrations."));
                        }
                    }
                    normalized = (0, doctor_legacy_config_js_1.normalizeLegacyConfigValues)(candidate);
                    if (normalized.changes.length > 0) {
                        (0, note_js_1.note)(normalized.changes.join("\n"), "Doctor changes");
                        candidate = normalized.config;
                        pendingChanges = true;
                        if (shouldRepair) {
                            cfg = normalized.config;
                        }
                        else {
                            fixHints.push("Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"), "\" to apply these changes."));
                        }
                    }
                    autoEnable = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({ config: candidate, env: process.env });
                    if (autoEnable.changes.length > 0) {
                        (0, note_js_1.note)(autoEnable.changes.join("\n"), "Doctor changes");
                        candidate = autoEnable.config;
                        pendingChanges = true;
                        if (shouldRepair) {
                            cfg = autoEnable.config;
                        }
                        else {
                            fixHints.push("Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"), "\" to apply these changes."));
                        }
                    }
                    unknown = stripUnknownConfigKeys(candidate);
                    if (unknown.removed.length > 0) {
                        lines = unknown.removed.map(function (path) { return "- ".concat(path); }).join("\n");
                        candidate = unknown.config;
                        pendingChanges = true;
                        if (shouldRepair) {
                            cfg = unknown.config;
                            (0, note_js_1.note)(lines, "Doctor changes");
                        }
                        else {
                            (0, note_js_1.note)(lines, "Unknown config keys");
                            fixHints.push('Run "openclaw doctor --fix" to remove these keys.');
                        }
                    }
                    if (!(!shouldRepair && pendingChanges)) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.confirm({
                            message: "Apply recommended config repairs now?",
                            initialValue: true,
                        })];
                case 4:
                    shouldApply = _e.sent();
                    if (shouldApply) {
                        cfg = candidate;
                        shouldWriteConfig = true;
                    }
                    else if (fixHints.length > 0) {
                        (0, note_js_1.note)(fixHints.join("\n"), "Doctor");
                    }
                    _e.label = 5;
                case 5:
                    noteOpencodeProviderOverrides(cfg);
                    return [2 /*return*/, { cfg: cfg, path: (_d = snapshot.path) !== null && _d !== void 0 ? _d : config_js_1.CONFIG_PATH, shouldWriteConfig: shouldWriteConfig }];
            }
        });
    });
}
