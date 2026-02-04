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
exports.updateStatusCommand = updateStatusCommand;
exports.updateCommand = updateCommand;
exports.updateWizardCommand = updateWizardCommand;
exports.registerUpdateCli = registerUpdateCli;
var prompts_1 = require("@clack/prompts");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var status_update_js_1 = require("../commands/status.update.js");
var config_js_1 = require("../config/config.js");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var restart_sentinel_js_1 = require("../infra/restart-sentinel.js");
var runtime_guard_js_1 = require("../infra/runtime-guard.js");
var update_channels_js_1 = require("../infra/update-channels.js");
var update_check_js_1 = require("../infra/update-check.js");
var update_global_js_1 = require("../infra/update-global.js");
var update_runner_js_1 = require("../infra/update-runner.js");
var update_js_1 = require("../plugins/update.js");
var exec_js_1 = require("../process/exec.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var cli_name_js_1 = require("./cli-name.js");
var command_format_js_1 = require("./command-format.js");
var help_format_js_1 = require("./help-format.js");
var STEP_LABELS = {
    "clean check": "Working directory is clean",
    "upstream check": "Upstream branch exists",
    "git fetch": "Fetching latest changes",
    "git rebase": "Rebasing onto target commit",
    "git rev-parse @{upstream}": "Resolving upstream commit",
    "git rev-list": "Enumerating candidate commits",
    "git clone": "Cloning git checkout",
    "preflight worktree": "Preparing preflight worktree",
    "preflight cleanup": "Cleaning preflight worktree",
    "deps install": "Installing dependencies",
    build: "Building",
    "ui:build": "Building UI",
    "openclaw doctor": "Running doctor checks",
    "git rev-parse HEAD (after)": "Verifying update",
    "global update": "Updating via package manager",
    "global install": "Installing global package",
};
var UPDATE_QUIPS = [
    "Leveled up! New skills unlocked. You're welcome.",
    "Fresh code, same lobster. Miss me?",
    "Back and better. Did you even notice I was gone?",
    "Update complete. I learned some new tricks while I was out.",
    "Upgraded! Now with 23% more sass.",
    "I've evolved. Try to keep up.",
    "New version, who dis? Oh right, still me but shinier.",
    "Patched, polished, and ready to pinch. Let's go.",
    "The lobster has molted. Harder shell, sharper claws.",
    "Update done! Check the changelog or just trust me, it's good.",
    "Reborn from the boiling waters of npm. Stronger now.",
    "I went away and came back smarter. You should try it sometime.",
    "Update complete. The bugs feared me, so they left.",
    "New version installed. Old version sends its regards.",
    "Firmware fresh. Brain wrinkles: increased.",
    "I've seen things you wouldn't believe. Anyway, I'm updated.",
    "Back online. The changelog is long but our friendship is longer.",
    "Upgraded! Peter fixed stuff. Blame him if it breaks.",
    "Molting complete. Please don't look at my soft shell phase.",
    "Version bump! Same chaos energy, fewer crashes (probably).",
];
var MAX_LOG_CHARS = 8000;
var DEFAULT_PACKAGE_NAME = "openclaw";
var CORE_PACKAGE_NAMES = new Set([DEFAULT_PACKAGE_NAME]);
var CLI_NAME = (0, cli_name_js_1.resolveCliName)();
var OPENCLAW_REPO_URL = "https://github.com/openclaw/openclaw.git";
var DEFAULT_GIT_DIR = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw");
function normalizeTag(value) {
    if (!value) {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    if (trimmed.startsWith("openclaw@")) {
        return trimmed.slice("openclaw@".length);
    }
    if (trimmed.startsWith("".concat(DEFAULT_PACKAGE_NAME, "@"))) {
        return trimmed.slice("".concat(DEFAULT_PACKAGE_NAME, "@").length);
    }
    return trimmed;
}
function pickUpdateQuip() {
    var _a;
    return (_a = UPDATE_QUIPS[Math.floor(Math.random() * UPDATE_QUIPS.length)]) !== null && _a !== void 0 ? _a : "Update complete.";
}
function normalizeVersionTag(tag) {
    var trimmed = tag.trim();
    if (!trimmed) {
        return null;
    }
    var cleaned = trimmed.startsWith("v") ? trimmed.slice(1) : trimmed;
    return (0, runtime_guard_js_1.parseSemver)(cleaned) ? cleaned : null;
}
function readPackageVersion(root) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(root, "package.json"), "utf-8")];
                case 1:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    return [2 /*return*/, typeof parsed.version === "string" ? parsed.version : null];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveTargetVersion(tag, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var direct, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    direct = normalizeVersionTag(tag);
                    if (direct) {
                        return [2 /*return*/, direct];
                    }
                    return [4 /*yield*/, (0, update_check_js_1.fetchNpmTagVersion)({ tag: tag, timeoutMs: timeoutMs })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, (_a = res.version) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function isGitCheckout(root) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(node_path_1.default.join(root, ".git"))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readPackageName(root) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, name_1, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(root, "package.json"), "utf-8")];
                case 1:
                    raw = _c.sent();
                    parsed = JSON.parse(raw);
                    name_1 = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.name) === null || _b === void 0 ? void 0 : _b.trim();
                    return [2 /*return*/, name_1 ? name_1 : null];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function isCorePackage(root) {
    return __awaiter(this, void 0, void 0, function () {
        var name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readPackageName(root)];
                case 1:
                    name = _a.sent();
                    return [2 /*return*/, Boolean(name && CORE_PACKAGE_NAMES.has(name))];
            }
        });
    });
}
function pathExists(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(targetPath)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function isEmptyDir(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readdir(targetPath)];
                case 1:
                    entries = _b.sent();
                    return [2 /*return*/, entries.length === 0];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveGitInstallDir() {
    var _a;
    var override = (_a = process.env.OPENCLAW_GIT_DIR) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        return node_path_1.default.resolve(override);
    }
    return resolveDefaultGitDir();
}
function resolveDefaultGitDir() {
    return DEFAULT_GIT_DIR;
}
function resolveNodeRunner() {
    var base = node_path_1.default.basename(process.execPath).toLowerCase();
    if (base === "node" || base === "node.exe") {
        return process.execPath;
    }
    return "node";
}
function runUpdateStep(params) {
    return __awaiter(this, void 0, void 0, function () {
        var command, started, res, durationMs, stderrTail;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    command = params.argv.join(" ");
                    (_b = (_a = params.progress) === null || _a === void 0 ? void 0 : _a.onStepStart) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        name: params.name,
                        command: command,
                        index: 0,
                        total: 0,
                    });
                    started = Date.now();
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(params.argv, {
                            cwd: params.cwd,
                            timeoutMs: params.timeoutMs,
                        })];
                case 1:
                    res = _f.sent();
                    durationMs = Date.now() - started;
                    stderrTail = (0, restart_sentinel_js_1.trimLogTail)(res.stderr, MAX_LOG_CHARS);
                    (_d = (_c = params.progress) === null || _c === void 0 ? void 0 : _c.onStepComplete) === null || _d === void 0 ? void 0 : _d.call(_c, {
                        name: params.name,
                        command: command,
                        index: 0,
                        total: 0,
                        durationMs: durationMs,
                        exitCode: res.code,
                        stderrTail: stderrTail,
                    });
                    return [2 /*return*/, {
                            name: params.name,
                            command: command,
                            cwd: (_e = params.cwd) !== null && _e !== void 0 ? _e : process.cwd(),
                            durationMs: durationMs,
                            exitCode: res.code,
                            stdoutTail: (0, restart_sentinel_js_1.trimLogTail)(res.stdout, MAX_LOG_CHARS),
                            stderrTail: stderrTail,
                        }];
            }
        });
    });
}
function ensureGitCheckout(params) {
    return __awaiter(this, void 0, void 0, function () {
        var dirExists, empty;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pathExists(params.dir)];
                case 1:
                    dirExists = _a.sent();
                    if (!!dirExists) return [3 /*break*/, 3];
                    return [4 /*yield*/, runUpdateStep({
                            name: "git clone",
                            argv: ["git", "clone", OPENCLAW_REPO_URL, params.dir],
                            timeoutMs: params.timeoutMs,
                            progress: params.progress,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: return [4 /*yield*/, isGitCheckout(params.dir)];
                case 4:
                    if (!!(_a.sent())) return [3 /*break*/, 7];
                    return [4 /*yield*/, isEmptyDir(params.dir)];
                case 5:
                    empty = _a.sent();
                    if (!empty) {
                        throw new Error("OPENCLAW_GIT_DIR points at a non-git directory: ".concat(params.dir, ". Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout."));
                    }
                    return [4 /*yield*/, runUpdateStep({
                            name: "git clone",
                            argv: ["git", "clone", OPENCLAW_REPO_URL, params.dir],
                            cwd: params.dir,
                            timeoutMs: params.timeoutMs,
                            progress: params.progress,
                        })];
                case 6: return [2 /*return*/, _a.sent()];
                case 7: return [4 /*yield*/, isCorePackage(params.dir)];
                case 8:
                    if (!(_a.sent())) {
                        throw new Error("OPENCLAW_GIT_DIR does not look like a core checkout: ".concat(params.dir, "."));
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function resolveGlobalManager(params) {
    return __awaiter(this, void 0, void 0, function () {
        var runCommand, detected, byPresence;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runCommand = function (argv, options) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, options)];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/, { stdout: res.stdout, stderr: res.stderr, code: res.code }];
                            }
                        });
                    }); };
                    if (!(params.installKind === "package")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, update_global_js_1.detectGlobalInstallManagerForRoot)(runCommand, params.root, params.timeoutMs)];
                case 1:
                    detected = _a.sent();
                    if (detected) {
                        return [2 /*return*/, detected];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, (0, update_global_js_1.detectGlobalInstallManagerByPresence)(runCommand, params.timeoutMs)];
                case 3:
                    byPresence = _a.sent();
                    return [2 /*return*/, byPresence !== null && byPresence !== void 0 ? byPresence : "npm"];
            }
        });
    });
}
function formatGitStatusLine(params) {
    var shortSha = params.sha ? params.sha.slice(0, 8) : null;
    var branch = params.branch && params.branch !== "HEAD" ? params.branch : null;
    var tag = params.tag;
    var parts = [
        branch !== null && branch !== void 0 ? branch : (tag ? "detached" : "git"),
        tag ? "tag ".concat(tag) : null,
        shortSha ? "@ ".concat(shortSha) : null,
    ].filter(Boolean);
    return parts.join(" · ");
}
function updateStatusCommand(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, root, configSnapshot, configChannel, update, channelInfo, channelLabel, gitLabel, updateAvailability, updateLine, tableWidth, installLabel, rows, updateHint;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    timeoutMs = opts.timeout ? Number.parseInt(opts.timeout, 10) * 1000 : undefined;
                    if (timeoutMs !== undefined && (Number.isNaN(timeoutMs) || timeoutMs <= 0)) {
                        runtime_js_1.defaultRuntime.error("--timeout must be a positive integer (seconds)");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 1:
                    root = (_a = (_q.sent())) !== null && _a !== void 0 ? _a : process.cwd();
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 2:
                    configSnapshot = _q.sent();
                    configChannel = configSnapshot.valid
                        ? (0, update_channels_js_1.normalizeUpdateChannel)((_b = configSnapshot.config.update) === null || _b === void 0 ? void 0 : _b.channel)
                        : null;
                    return [4 /*yield*/, (0, update_check_js_1.checkUpdateStatus)({
                            root: root,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 3500,
                            fetchGit: true,
                            includeRegistry: true,
                        })];
                case 3:
                    update = _q.sent();
                    channelInfo = (0, update_channels_js_1.resolveEffectiveUpdateChannel)({
                        configChannel: configChannel,
                        installKind: update.installKind,
                        git: update.git ? { tag: update.git.tag, branch: update.git.branch } : undefined,
                    });
                    channelLabel = (0, update_channels_js_1.formatUpdateChannelLabel)({
                        channel: channelInfo.channel,
                        source: channelInfo.source,
                        gitTag: (_d = (_c = update.git) === null || _c === void 0 ? void 0 : _c.tag) !== null && _d !== void 0 ? _d : null,
                        gitBranch: (_f = (_e = update.git) === null || _e === void 0 ? void 0 : _e.branch) !== null && _f !== void 0 ? _f : null,
                    });
                    gitLabel = update.installKind === "git"
                        ? formatGitStatusLine({
                            branch: (_h = (_g = update.git) === null || _g === void 0 ? void 0 : _g.branch) !== null && _h !== void 0 ? _h : null,
                            tag: (_k = (_j = update.git) === null || _j === void 0 ? void 0 : _j.tag) !== null && _k !== void 0 ? _k : null,
                            sha: (_m = (_l = update.git) === null || _l === void 0 ? void 0 : _l.sha) !== null && _m !== void 0 ? _m : null,
                        })
                        : null;
                    updateAvailability = (0, status_update_js_1.resolveUpdateAvailability)(update);
                    updateLine = (0, status_update_js_1.formatUpdateOneLiner)(update).replace(/^Update:\s*/i, "");
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify({
                            update: update,
                            channel: {
                                value: channelInfo.channel,
                                source: channelInfo.source,
                                label: channelLabel,
                                config: configChannel,
                            },
                            availability: updateAvailability,
                        }, null, 2));
                        return [2 /*return*/];
                    }
                    tableWidth = Math.max(60, ((_o = process.stdout.columns) !== null && _o !== void 0 ? _o : 120) - 1);
                    installLabel = update.installKind === "git"
                        ? "git (".concat((_p = update.root) !== null && _p !== void 0 ? _p : "unknown", ")")
                        : update.installKind === "package"
                            ? update.packageManager
                            : "unknown";
                    rows = __spreadArray(__spreadArray([
                        { Item: "Install", Value: installLabel },
                        { Item: "Channel", Value: channelLabel }
                    ], (gitLabel ? [{ Item: "Git", Value: gitLabel }] : []), true), [
                        {
                            Item: "Update",
                            Value: updateAvailability.available ? theme_js_1.theme.warn("available \u00B7 ".concat(updateLine)) : updateLine,
                        },
                    ], false);
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("OpenClaw update status"));
                    runtime_js_1.defaultRuntime.log("");
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Item", header: "Item", minWidth: 10 },
                            { key: "Value", header: "Value", flex: true, minWidth: 24 },
                        ],
                        rows: rows,
                    }).trimEnd());
                    runtime_js_1.defaultRuntime.log("");
                    updateHint = (0, status_update_js_1.formatUpdateAvailableHint)(update);
                    if (updateHint) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(updateHint));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getStepLabel(step) {
    var _a;
    return (_a = STEP_LABELS[step.name]) !== null && _a !== void 0 ? _a : step.name;
}
function createUpdateProgress(enabled) {
    if (!enabled) {
        return {
            progress: {},
            stop: function () { },
        };
    }
    var currentSpinner = null;
    var progress = {
        onStepStart: function (step) {
            currentSpinner = (0, prompts_1.spinner)();
            currentSpinner.start(theme_js_1.theme.accent(getStepLabel(step)));
        },
        onStepComplete: function (step) {
            if (!currentSpinner) {
                return;
            }
            var label = getStepLabel(step);
            var duration = theme_js_1.theme.muted("(".concat(formatDuration(step.durationMs), ")"));
            var icon = step.exitCode === 0 ? theme_js_1.theme.success("\u2713") : theme_js_1.theme.error("\u2717");
            currentSpinner.stop("".concat(icon, " ").concat(label, " ").concat(duration));
            currentSpinner = null;
            if (step.exitCode !== 0 && step.stderrTail) {
                var lines = step.stderrTail.split("\n").slice(-10);
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    if (line.trim()) {
                        runtime_js_1.defaultRuntime.log("    ".concat(theme_js_1.theme.error(line)));
                    }
                }
            }
        },
    };
    return {
        progress: progress,
        stop: function () {
            if (currentSpinner) {
                currentSpinner.stop();
                currentSpinner = null;
            }
        },
    };
}
function formatDuration(ms) {
    if (ms < 1000) {
        return "".concat(ms, "ms");
    }
    var seconds = (ms / 1000).toFixed(1);
    return "".concat(seconds, "s");
}
function formatStepStatus(exitCode) {
    if (exitCode === 0) {
        return theme_js_1.theme.success("\u2713");
    }
    if (exitCode === null) {
        return theme_js_1.theme.warn("?");
    }
    return theme_js_1.theme.error("\u2717");
}
var selectStyled = function (params) {
    return (0, prompts_1.select)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
function printResult(result, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (opts.json) {
        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
        return;
    }
    var statusColor = result.status === "ok" ? theme_js_1.theme.success : result.status === "skipped" ? theme_js_1.theme.warn : theme_js_1.theme.error;
    runtime_js_1.defaultRuntime.log("");
    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Update Result:"), " ").concat(statusColor(result.status.toUpperCase())));
    if (result.root) {
        runtime_js_1.defaultRuntime.log("  Root: ".concat(theme_js_1.theme.muted(result.root)));
    }
    if (result.reason) {
        runtime_js_1.defaultRuntime.log("  Reason: ".concat(theme_js_1.theme.muted(result.reason)));
    }
    if (((_a = result.before) === null || _a === void 0 ? void 0 : _a.version) || ((_b = result.before) === null || _b === void 0 ? void 0 : _b.sha)) {
        var before = (_e = (_c = result.before.version) !== null && _c !== void 0 ? _c : (_d = result.before.sha) === null || _d === void 0 ? void 0 : _d.slice(0, 8)) !== null && _e !== void 0 ? _e : "";
        runtime_js_1.defaultRuntime.log("  Before: ".concat(theme_js_1.theme.muted(before)));
    }
    if (((_f = result.after) === null || _f === void 0 ? void 0 : _f.version) || ((_g = result.after) === null || _g === void 0 ? void 0 : _g.sha)) {
        var after = (_k = (_h = result.after.version) !== null && _h !== void 0 ? _h : (_j = result.after.sha) === null || _j === void 0 ? void 0 : _j.slice(0, 8)) !== null && _k !== void 0 ? _k : "";
        runtime_js_1.defaultRuntime.log("  After: ".concat(theme_js_1.theme.muted(after)));
    }
    if (!opts.hideSteps && result.steps.length > 0) {
        runtime_js_1.defaultRuntime.log("");
        runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Steps:"));
        for (var _i = 0, _l = result.steps; _i < _l.length; _i++) {
            var step = _l[_i];
            var status_1 = formatStepStatus(step.exitCode);
            var duration = theme_js_1.theme.muted("(".concat(formatDuration(step.durationMs), ")"));
            runtime_js_1.defaultRuntime.log("  ".concat(status_1, " ").concat(step.name, " ").concat(duration));
            if (step.exitCode !== 0 && step.stderrTail) {
                var lines = step.stderrTail.split("\n").slice(0, 5);
                for (var _m = 0, lines_2 = lines; _m < lines_2.length; _m++) {
                    var line = lines_2[_m];
                    if (line.trim()) {
                        runtime_js_1.defaultRuntime.log("      ".concat(theme_js_1.theme.error(line)));
                    }
                }
            }
        }
    }
    runtime_js_1.defaultRuntime.log("");
    runtime_js_1.defaultRuntime.log("Total time: ".concat(theme_js_1.theme.muted(formatDuration(result.durationMs))));
}
function updateCommand(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, shouldRestart, root, updateStatus, configSnapshot, activeConfig, storedChannel, requestedChannel, issues, installKind, switchToGit, switchToPackage, updateInstallKind, defaultChannel, channel, explicitTag, tag, currentVersion, _a, fallbackToLatest_1, targetVersion, _b, cmp, needsConfirm, targetLabel, message, ok, next, showProgress, _c, progress, stop, startedAt, result, manager, runCommand, pkgRoot, packageName, _d, beforeVersion, _e, updateStep, steps, afterVersion, entryPath, doctorStep, failedStep, updateRoot, cloneStep, _f, updateResult, steps, manager, installStep, failedStep, pluginLogger, syncResult, pluginConfig, npmResult, summarizeList, _i, _g, warning, _h, _j, error, updated, unchanged, failed, skipped, parts, _k, _l, outcome, runDaemonRestart, restarted, doctorCommand, interactiveDoctor, err_1, err_2;
        var _this = this;
        var _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    process.noDeprecation = true;
                    process.env.NODE_NO_WARNINGS = "1";
                    timeoutMs = opts.timeout ? Number.parseInt(opts.timeout, 10) * 1000 : undefined;
                    shouldRestart = opts.restart !== false;
                    if (timeoutMs !== undefined && (Number.isNaN(timeoutMs) || timeoutMs <= 0)) {
                        runtime_js_1.defaultRuntime.error("--timeout must be a positive integer (seconds)");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 1:
                    root = (_m = (_r.sent())) !== null && _m !== void 0 ? _m : process.cwd();
                    return [4 /*yield*/, (0, update_check_js_1.checkUpdateStatus)({
                            root: root,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 3500,
                            fetchGit: false,
                            includeRegistry: false,
                        })];
                case 2:
                    updateStatus = _r.sent();
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 3:
                    configSnapshot = _r.sent();
                    activeConfig = configSnapshot.valid ? configSnapshot.config : null;
                    storedChannel = configSnapshot.valid
                        ? (0, update_channels_js_1.normalizeUpdateChannel)((_o = configSnapshot.config.update) === null || _o === void 0 ? void 0 : _o.channel)
                        : null;
                    requestedChannel = (0, update_channels_js_1.normalizeUpdateChannel)(opts.channel);
                    if (opts.channel && !requestedChannel) {
                        runtime_js_1.defaultRuntime.error("--channel must be \"stable\", \"beta\", or \"dev\" (got \"".concat(opts.channel, "\")"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (opts.channel && !configSnapshot.valid) {
                        issues = configSnapshot.issues.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); });
                        runtime_js_1.defaultRuntime.error(__spreadArray(["Config is invalid; cannot set update channel."], issues, true).join("\n"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    installKind = updateStatus.installKind;
                    switchToGit = requestedChannel === "dev" && installKind !== "git";
                    switchToPackage = requestedChannel !== null && requestedChannel !== "dev" && installKind === "git";
                    updateInstallKind = switchToGit ? "git" : switchToPackage ? "package" : installKind;
                    defaultChannel = updateInstallKind === "git" ? update_channels_js_1.DEFAULT_GIT_CHANNEL : update_channels_js_1.DEFAULT_PACKAGE_CHANNEL;
                    channel = (_p = requestedChannel !== null && requestedChannel !== void 0 ? requestedChannel : storedChannel) !== null && _p !== void 0 ? _p : defaultChannel;
                    explicitTag = normalizeTag(opts.tag);
                    tag = explicitTag !== null && explicitTag !== void 0 ? explicitTag : (0, update_channels_js_1.channelToNpmTag)(channel);
                    if (!(updateInstallKind !== "git")) return [3 /*break*/, 13];
                    if (!switchToPackage) return [3 /*break*/, 4];
                    _a = null;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, readPackageVersion(root)];
                case 5:
                    _a = _r.sent();
                    _r.label = 6;
                case 6:
                    currentVersion = _a;
                    fallbackToLatest_1 = false;
                    if (!explicitTag) return [3 /*break*/, 8];
                    return [4 /*yield*/, resolveTargetVersion(tag, timeoutMs)];
                case 7:
                    _b = _r.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, update_check_js_1.resolveNpmChannelTag)({ channel: channel, timeoutMs: timeoutMs }).then(function (resolved) {
                        tag = resolved.tag;
                        fallbackToLatest_1 = channel === "beta" && resolved.tag === "latest";
                        return resolved.version;
                    })];
                case 9:
                    _b = _r.sent();
                    _r.label = 10;
                case 10:
                    targetVersion = _b;
                    cmp = currentVersion && targetVersion ? (0, update_check_js_1.compareSemverStrings)(currentVersion, targetVersion) : null;
                    needsConfirm = !fallbackToLatest_1 &&
                        currentVersion != null &&
                        (targetVersion == null || (cmp != null && cmp > 0));
                    if (!(needsConfirm && !opts.yes)) return [3 /*break*/, 12];
                    if (!process.stdin.isTTY || opts.json) {
                        runtime_js_1.defaultRuntime.error([
                            "Downgrade confirmation required.",
                            "Downgrading can break configuration. Re-run in a TTY to confirm.",
                        ].join("\n"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    targetLabel = targetVersion !== null && targetVersion !== void 0 ? targetVersion : "".concat(tag, " (unknown)");
                    message = "Downgrading from ".concat(currentVersion, " to ").concat(targetLabel, " can break configuration. Continue?");
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: (0, prompt_style_js_1.stylePromptMessage)(message),
                            initialValue: false,
                        })];
                case 11:
                    ok = _r.sent();
                    if ((0, prompts_1.isCancel)(ok) || !ok) {
                        if (!opts.json) {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Update cancelled."));
                        }
                        runtime_js_1.defaultRuntime.exit(0);
                        return [2 /*return*/];
                    }
                    _r.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (opts.tag && !opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Note: --tag applies to npm installs only; git updates ignore it."));
                    }
                    _r.label = 14;
                case 14:
                    if (!(requestedChannel && configSnapshot.valid)) return [3 /*break*/, 16];
                    next = __assign(__assign({}, configSnapshot.config), { update: __assign(__assign({}, configSnapshot.config.update), { channel: requestedChannel }) });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 15:
                    _r.sent();
                    activeConfig = next;
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Update channel set to ".concat(requestedChannel, ".")));
                    }
                    _r.label = 16;
                case 16:
                    showProgress = !opts.json && process.stdout.isTTY;
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Updating OpenClaw..."));
                        runtime_js_1.defaultRuntime.log("");
                    }
                    _c = createUpdateProgress(showProgress), progress = _c.progress, stop = _c.stop;
                    startedAt = Date.now();
                    if (!switchToPackage) return [3 /*break*/, 33];
                    return [4 /*yield*/, resolveGlobalManager({
                            root: root,
                            installKind: installKind,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                        })];
                case 17:
                    manager = _r.sent();
                    runCommand = function (argv, options) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, options)];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/, { stdout: res.stdout, stderr: res.stderr, code: res.code }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_global_js_1.resolveGlobalPackageRoot)(manager, runCommand, timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000)];
                case 18:
                    pkgRoot = _r.sent();
                    if (!pkgRoot) return [3 /*break*/, 20];
                    return [4 /*yield*/, readPackageName(pkgRoot)];
                case 19:
                    _d = _r.sent();
                    return [3 /*break*/, 22];
                case 20: return [4 /*yield*/, readPackageName(root)];
                case 21:
                    _d = _r.sent();
                    _r.label = 22;
                case 22:
                    packageName = (_q = (_d)) !== null && _q !== void 0 ? _q : DEFAULT_PACKAGE_NAME;
                    if (!pkgRoot) return [3 /*break*/, 24];
                    return [4 /*yield*/, readPackageVersion(pkgRoot)];
                case 23:
                    _e = _r.sent();
                    return [3 /*break*/, 25];
                case 24:
                    _e = null;
                    _r.label = 25;
                case 25:
                    beforeVersion = _e;
                    if (!pkgRoot) return [3 /*break*/, 27];
                    return [4 /*yield*/, (0, update_global_js_1.cleanupGlobalRenameDirs)({
                            globalRoot: node_path_1.default.dirname(pkgRoot),
                            packageName: packageName,
                        })];
                case 26:
                    _r.sent();
                    _r.label = 27;
                case 27: return [4 /*yield*/, runUpdateStep({
                        name: "global update",
                        argv: (0, update_global_js_1.globalInstallArgs)(manager, "".concat(packageName, "@").concat(tag)),
                        timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                        progress: progress,
                    })];
                case 28:
                    updateStep = _r.sent();
                    steps = [updateStep];
                    afterVersion = beforeVersion;
                    if (!pkgRoot) return [3 /*break*/, 32];
                    return [4 /*yield*/, readPackageVersion(pkgRoot)];
                case 29:
                    afterVersion = _r.sent();
                    entryPath = node_path_1.default.join(pkgRoot, "dist", "entry.js");
                    return [4 /*yield*/, pathExists(entryPath)];
                case 30:
                    if (!_r.sent()) return [3 /*break*/, 32];
                    return [4 /*yield*/, runUpdateStep({
                            name: "".concat(CLI_NAME, " doctor"),
                            argv: [resolveNodeRunner(), entryPath, "doctor", "--non-interactive"],
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                            progress: progress,
                        })];
                case 31:
                    doctorStep = _r.sent();
                    steps.push(doctorStep);
                    _r.label = 32;
                case 32:
                    failedStep = steps.find(function (step) { return step.exitCode !== 0; });
                    result = {
                        status: failedStep ? "error" : "ok",
                        mode: manager,
                        root: pkgRoot !== null && pkgRoot !== void 0 ? pkgRoot : root,
                        reason: failedStep ? failedStep.name : undefined,
                        before: { version: beforeVersion },
                        after: { version: afterVersion },
                        steps: steps,
                        durationMs: Date.now() - startedAt,
                    };
                    return [3 /*break*/, 41];
                case 33:
                    updateRoot = switchToGit ? resolveGitInstallDir() : root;
                    if (!switchToGit) return [3 /*break*/, 35];
                    return [4 /*yield*/, ensureGitCheckout({
                            dir: updateRoot,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                            progress: progress,
                        })];
                case 34:
                    _f = _r.sent();
                    return [3 /*break*/, 36];
                case 35:
                    _f = null;
                    _r.label = 36;
                case 36:
                    cloneStep = _f;
                    if (cloneStep && cloneStep.exitCode !== 0) {
                        result = {
                            status: "error",
                            mode: "git",
                            root: updateRoot,
                            reason: cloneStep.name,
                            steps: [cloneStep],
                            durationMs: Date.now() - startedAt,
                        };
                        stop();
                        printResult(result, __assign(__assign({}, opts), { hideSteps: showProgress }));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: updateRoot,
                            argv1: switchToGit ? undefined : process.argv[1],
                            timeoutMs: timeoutMs,
                            progress: progress,
                            channel: channel,
                            tag: tag,
                        })];
                case 37:
                    updateResult = _r.sent();
                    steps = __spreadArray(__spreadArray([], (cloneStep ? [cloneStep] : []), true), updateResult.steps, true);
                    if (!(switchToGit && updateResult.status === "ok")) return [3 /*break*/, 40];
                    return [4 /*yield*/, resolveGlobalManager({
                            root: root,
                            installKind: installKind,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                        })];
                case 38:
                    manager = _r.sent();
                    return [4 /*yield*/, runUpdateStep({
                            name: "global install",
                            argv: (0, update_global_js_1.globalInstallArgs)(manager, updateRoot),
                            cwd: updateRoot,
                            timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20 * 60000,
                            progress: progress,
                        })];
                case 39:
                    installStep = _r.sent();
                    steps.push(installStep);
                    failedStep = [installStep].find(function (step) { return step.exitCode !== 0; });
                    result = __assign(__assign({}, updateResult), { status: updateResult.status === "ok" && !failedStep ? "ok" : "error", steps: steps, durationMs: Date.now() - startedAt });
                    return [3 /*break*/, 41];
                case 40:
                    result = __assign(__assign({}, updateResult), { steps: steps, durationMs: Date.now() - startedAt });
                    _r.label = 41;
                case 41:
                    stop();
                    printResult(result, __assign(__assign({}, opts), { hideSteps: showProgress }));
                    if (result.status === "error") {
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (result.status === "skipped") {
                        if (result.reason === "dirty") {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Skipped: working directory has uncommitted changes. Commit or stash them first."));
                        }
                        if (result.reason === "not-git-install") {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Skipped: this OpenClaw install isn't a git checkout, and the package manager couldn't be detected. Update via your package manager, then run `".concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw doctor"), CLI_NAME), "` and `").concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw gateway restart"), CLI_NAME), "`.")));
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Examples: `".concat((0, cli_name_js_1.replaceCliName)("npm i -g openclaw@latest", CLI_NAME), "` or `").concat((0, cli_name_js_1.replaceCliName)("pnpm add -g openclaw@latest", CLI_NAME), "`")));
                        }
                        runtime_js_1.defaultRuntime.exit(0);
                        return [2 /*return*/];
                    }
                    if (!activeConfig) return [3 /*break*/, 46];
                    pluginLogger = opts.json
                        ? {}
                        : {
                            info: function (msg) { return runtime_js_1.defaultRuntime.log(msg); },
                            warn: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(msg)); },
                            error: function (msg) { return runtime_js_1.defaultRuntime.log(theme_js_1.theme.error(msg)); },
                        };
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log("");
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Updating plugins..."));
                    }
                    return [4 /*yield*/, (0, update_js_1.syncPluginsForUpdateChannel)({
                            config: activeConfig,
                            channel: channel,
                            workspaceDir: root,
                            logger: pluginLogger,
                        })];
                case 42:
                    syncResult = _r.sent();
                    pluginConfig = syncResult.config;
                    return [4 /*yield*/, (0, update_js_1.updateNpmInstalledPlugins)({
                            config: pluginConfig,
                            skipIds: new Set(syncResult.summary.switchedToNpm),
                            logger: pluginLogger,
                        })];
                case 43:
                    npmResult = _r.sent();
                    pluginConfig = npmResult.config;
                    if (!(syncResult.changed || npmResult.changed)) return [3 /*break*/, 45];
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(pluginConfig)];
                case 44:
                    _r.sent();
                    _r.label = 45;
                case 45:
                    if (!opts.json) {
                        summarizeList = function (list) {
                            if (list.length <= 6) {
                                return list.join(", ");
                            }
                            return "".concat(list.slice(0, 6).join(", "), " +").concat(list.length - 6, " more");
                        };
                        if (syncResult.summary.switchedToBundled.length > 0) {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Switched to bundled plugins: ".concat(summarizeList(syncResult.summary.switchedToBundled), ".")));
                        }
                        if (syncResult.summary.switchedToNpm.length > 0) {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Restored npm plugins: ".concat(summarizeList(syncResult.summary.switchedToNpm), ".")));
                        }
                        for (_i = 0, _g = syncResult.summary.warnings; _i < _g.length; _i++) {
                            warning = _g[_i];
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn(warning));
                        }
                        for (_h = 0, _j = syncResult.summary.errors; _h < _j.length; _h++) {
                            error = _j[_h];
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.error(error));
                        }
                        updated = npmResult.outcomes.filter(function (entry) { return entry.status === "updated"; }).length;
                        unchanged = npmResult.outcomes.filter(function (entry) { return entry.status === "unchanged"; }).length;
                        failed = npmResult.outcomes.filter(function (entry) { return entry.status === "error"; }).length;
                        skipped = npmResult.outcomes.filter(function (entry) { return entry.status === "skipped"; }).length;
                        if (npmResult.outcomes.length === 0) {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No plugin updates needed."));
                        }
                        else {
                            parts = ["".concat(updated, " updated"), "".concat(unchanged, " unchanged")];
                            if (failed > 0) {
                                parts.push("".concat(failed, " failed"));
                            }
                            if (skipped > 0) {
                                parts.push("".concat(skipped, " skipped"));
                            }
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("npm plugins: ".concat(parts.join(", "), ".")));
                        }
                        for (_k = 0, _l = npmResult.outcomes; _k < _l.length; _k++) {
                            outcome = _l[_k];
                            if (outcome.status !== "error") {
                                continue;
                            }
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.error(outcome.message));
                        }
                    }
                    return [3 /*break*/, 47];
                case 46:
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Skipping plugin updates: config is invalid."));
                    }
                    _r.label = 47;
                case 47:
                    if (!shouldRestart) return [3 /*break*/, 59];
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log("");
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Restarting service..."));
                    }
                    _r.label = 48;
                case 48:
                    _r.trys.push([48, 57, , 58]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 49:
                    runDaemonRestart = (_r.sent()).runDaemonRestart;
                    return [4 /*yield*/, runDaemonRestart()];
                case 50:
                    restarted = _r.sent();
                    if (!(!opts.json && restarted)) return [3 /*break*/, 56];
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.success("Daemon restarted successfully."));
                    runtime_js_1.defaultRuntime.log("");
                    process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
                    _r.label = 51;
                case 51:
                    _r.trys.push([51, 54, 55, 56]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../commands/doctor.js"); })];
                case 52:
                    doctorCommand = (_r.sent()).doctorCommand;
                    interactiveDoctor = Boolean(process.stdin.isTTY) && !opts.json && opts.yes !== true;
                    return [4 /*yield*/, doctorCommand(runtime_js_1.defaultRuntime, {
                            nonInteractive: !interactiveDoctor,
                        })];
                case 53:
                    _r.sent();
                    return [3 /*break*/, 56];
                case 54:
                    err_1 = _r.sent();
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Doctor failed: ".concat(String(err_1))));
                    return [3 /*break*/, 56];
                case 55:
                    delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
                    return [7 /*endfinally*/];
                case 56: return [3 /*break*/, 58];
                case 57:
                    err_2 = _r.sent();
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Daemon restart failed: ".concat(String(err_2))));
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("You may need to restart the service manually: ".concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw gateway restart"), CLI_NAME))));
                    }
                    return [3 /*break*/, 58];
                case 58: return [3 /*break*/, 60];
                case 59:
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log("");
                        if (result.mode === "npm" || result.mode === "pnpm") {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Tip: Run `".concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw doctor"), CLI_NAME), "`, then `").concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw gateway restart"), CLI_NAME), "` to apply updates to a running gateway.")));
                        }
                        else {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Tip: Run `".concat((0, cli_name_js_1.replaceCliName)((0, command_format_js_1.formatCliCommand)("openclaw gateway restart"), CLI_NAME), "` to apply updates to a running gateway.")));
                        }
                    }
                    _r.label = 60;
                case 60:
                    if (!opts.json) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted(pickUpdateQuip()));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updateWizardCommand() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var timeoutMs, root, _a, updateStatus, configSnapshot, configChannel, channelInfo, channelLabel, pickedChannel, requestedChannel, gitDir, hasGit, dirExists, empty, ok, restart, err_3;
        var _b, _c, _d, _e, _f, _g;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!process.stdin.isTTY) {
                        runtime_js_1.defaultRuntime.error("Update wizard requires a TTY. Use `openclaw update --channel <stable|beta|dev>` instead.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    timeoutMs = opts.timeout ? Number.parseInt(opts.timeout, 10) * 1000 : undefined;
                    if (timeoutMs !== undefined && (Number.isNaN(timeoutMs) || timeoutMs <= 0)) {
                        runtime_js_1.defaultRuntime.error("--timeout must be a positive integer (seconds)");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 1:
                    root = (_b = (_h.sent())) !== null && _b !== void 0 ? _b : process.cwd();
                    return [4 /*yield*/, Promise.all([
                            (0, update_check_js_1.checkUpdateStatus)({
                                root: root,
                                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 3500,
                                fetchGit: false,
                                includeRegistry: false,
                            }),
                            (0, config_js_1.readConfigFileSnapshot)(),
                        ])];
                case 2:
                    _a = _h.sent(), updateStatus = _a[0], configSnapshot = _a[1];
                    configChannel = configSnapshot.valid
                        ? (0, update_channels_js_1.normalizeUpdateChannel)((_c = configSnapshot.config.update) === null || _c === void 0 ? void 0 : _c.channel)
                        : null;
                    channelInfo = (0, update_channels_js_1.resolveEffectiveUpdateChannel)({
                        configChannel: configChannel,
                        installKind: updateStatus.installKind,
                        git: updateStatus.git
                            ? { tag: updateStatus.git.tag, branch: updateStatus.git.branch }
                            : undefined,
                    });
                    channelLabel = (0, update_channels_js_1.formatUpdateChannelLabel)({
                        channel: channelInfo.channel,
                        source: channelInfo.source,
                        gitTag: (_e = (_d = updateStatus.git) === null || _d === void 0 ? void 0 : _d.tag) !== null && _e !== void 0 ? _e : null,
                        gitBranch: (_g = (_f = updateStatus.git) === null || _f === void 0 ? void 0 : _f.branch) !== null && _g !== void 0 ? _g : null,
                    });
                    return [4 /*yield*/, selectStyled({
                            message: "Update channel",
                            options: [
                                {
                                    value: "keep",
                                    label: "Keep current (".concat(channelInfo.channel, ")"),
                                    hint: channelLabel,
                                },
                                {
                                    value: "stable",
                                    label: "Stable",
                                    hint: "Tagged releases (npm latest)",
                                },
                                {
                                    value: "beta",
                                    label: "Beta",
                                    hint: "Prereleases (npm beta)",
                                },
                                {
                                    value: "dev",
                                    label: "Dev",
                                    hint: "Git main",
                                },
                            ],
                            initialValue: "keep",
                        })];
                case 3:
                    pickedChannel = _h.sent();
                    if ((0, prompts_1.isCancel)(pickedChannel)) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Update cancelled."));
                        runtime_js_1.defaultRuntime.exit(0);
                        return [2 /*return*/];
                    }
                    requestedChannel = pickedChannel === "keep" ? null : pickedChannel;
                    if (!(requestedChannel === "dev" && updateStatus.installKind !== "git")) return [3 /*break*/, 9];
                    gitDir = resolveGitInstallDir();
                    return [4 /*yield*/, isGitCheckout(gitDir)];
                case 4:
                    hasGit = _h.sent();
                    if (!!hasGit) return [3 /*break*/, 9];
                    return [4 /*yield*/, pathExists(gitDir)];
                case 5:
                    dirExists = _h.sent();
                    if (!dirExists) return [3 /*break*/, 7];
                    return [4 /*yield*/, isEmptyDir(gitDir)];
                case 6:
                    empty = _h.sent();
                    if (!empty) {
                        runtime_js_1.defaultRuntime.error("OPENCLAW_GIT_DIR points at a non-git directory: ".concat(gitDir, ". Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout."));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    _h.label = 7;
                case 7: return [4 /*yield*/, (0, prompts_1.confirm)({
                        message: (0, prompt_style_js_1.stylePromptMessage)("Create a git checkout at ".concat(gitDir, "? (override via OPENCLAW_GIT_DIR)")),
                        initialValue: true,
                    })];
                case 8:
                    ok = _h.sent();
                    if ((0, prompts_1.isCancel)(ok) || !ok) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Update cancelled."));
                        runtime_js_1.defaultRuntime.exit(0);
                        return [2 /*return*/];
                    }
                    _h.label = 9;
                case 9: return [4 /*yield*/, (0, prompts_1.confirm)({
                        message: (0, prompt_style_js_1.stylePromptMessage)("Restart the gateway service after update?"),
                        initialValue: true,
                    })];
                case 10:
                    restart = _h.sent();
                    if ((0, prompts_1.isCancel)(restart)) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Update cancelled."));
                        runtime_js_1.defaultRuntime.exit(0);
                        return [2 /*return*/];
                    }
                    _h.label = 11;
                case 11:
                    _h.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, updateCommand({
                            channel: requestedChannel !== null && requestedChannel !== void 0 ? requestedChannel : undefined,
                            restart: Boolean(restart),
                            timeout: opts.timeout,
                        })];
                case 12:
                    _h.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_3 = _h.sent();
                    runtime_js_1.defaultRuntime.error(String(err_3));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function registerUpdateCli(program) {
    var _this = this;
    var update = program
        .command("update")
        .description("Update OpenClaw to the latest version")
        .option("--json", "Output result as JSON", false)
        .option("--no-restart", "Skip restarting the gateway service after a successful update")
        .option("--channel <stable|beta|dev>", "Persist update channel (git + npm)")
        .option("--tag <dist-tag|version>", "Override npm dist-tag or version for this update")
        .option("--timeout <seconds>", "Timeout for each update step in seconds (default: 1200)")
        .option("--yes", "Skip confirmation prompts (non-interactive)", false)
        .addHelpText("after", function () {
        var examples = [
            ["openclaw update", "Update a source checkout (git)"],
            ["openclaw update --channel beta", "Switch to beta channel (git + npm)"],
            ["openclaw update --channel dev", "Switch to dev channel (git + npm)"],
            ["openclaw update --tag beta", "One-off update to a dist-tag or version"],
            ["openclaw update --no-restart", "Update without restarting the service"],
            ["openclaw update --json", "Output result as JSON"],
            ["openclaw update --yes", "Non-interactive (accept downgrade prompts)"],
            ["openclaw update wizard", "Interactive update wizard"],
            ["openclaw --update", "Shorthand for openclaw update"],
        ];
        var fmtExamples = examples
            .map(function (_a) {
            var cmd = _a[0], desc = _a[1];
            return "  ".concat(theme_js_1.theme.command(cmd), " ").concat(theme_js_1.theme.muted("# ".concat(desc)));
        })
            .join("\n");
        return "\n".concat(theme_js_1.theme.heading("What this does:"), "\n  - Git checkouts: fetches, rebases, installs deps, builds, and runs doctor\n  - npm installs: updates via detected package manager\n\n").concat(theme_js_1.theme.heading("Switch channels:"), "\n  - Use --channel stable|beta|dev to persist the update channel in config\n  - Run openclaw update status to see the active channel and source\n  - Use --tag <dist-tag|version> for a one-off npm update without persisting\n\n").concat(theme_js_1.theme.heading("Non-interactive:"), "\n  - Use --yes to accept downgrade prompts\n  - Combine with --channel/--tag/--restart/--json/--timeout as needed\n\n").concat(theme_js_1.theme.heading("Examples:"), "\n").concat(fmtExamples, "\n\n").concat(theme_js_1.theme.heading("Notes:"), "\n  - Switch channels with --channel stable|beta|dev\n  - For global installs: auto-updates via detected package manager when possible (see docs/install/updating.md)\n  - Downgrades require confirmation (can break configuration)\n  - Skips update if the working directory has uncommitted changes\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/update", "docs.openclaw.ai/cli/update"));
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateCommand({
                            json: Boolean(opts.json),
                            restart: Boolean(opts.restart),
                            channel: opts.channel,
                            tag: opts.tag,
                            timeout: opts.timeout,
                            yes: Boolean(opts.yes),
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    runtime_js_1.defaultRuntime.error(String(err_4));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    update
        .command("wizard")
        .description("Interactive update wizard")
        .option("--timeout <seconds>", "Timeout for each update step in seconds (default: 1200)")
        .addHelpText("after", "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/update", "docs.openclaw.ai/cli/update"), "\n"))
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateWizardCommand({
                            timeout: opts.timeout,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    runtime_js_1.defaultRuntime.error(String(err_5));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    update
        .command("status")
        .description("Show update channel and version status")
        .option("--json", "Output result as JSON", false)
        .option("--timeout <seconds>", "Timeout for update checks in seconds (default: 3)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ["openclaw update status", "Show channel + version status."],
            ["openclaw update status --json", "JSON output."],
            ["openclaw update status --timeout 10", "Custom timeout."],
        ]), "\n\n").concat(theme_js_1.theme.heading("Notes:"), "\n").concat(theme_js_1.theme.muted("- Shows current update channel (stable/beta/dev) and source"), "\n").concat(theme_js_1.theme.muted("- Includes git tag/branch/SHA for source checkouts"), "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/update", "docs.openclaw.ai/cli/update"));
    })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateStatusCommand({
                            json: Boolean(opts.json),
                            timeout: opts.timeout,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    runtime_js_1.defaultRuntime.error(String(err_6));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
