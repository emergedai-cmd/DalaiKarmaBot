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
exports.runGatewayUpdate = runGatewayUpdate;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var exec_js_1 = require("../process/exec.js");
var restart_sentinel_js_1 = require("./restart-sentinel.js");
var update_channels_js_1 = require("./update-channels.js");
var update_check_js_1 = require("./update-check.js");
var update_global_js_1 = require("./update-global.js");
var DEFAULT_TIMEOUT_MS = 20 * 60000;
var MAX_LOG_CHARS = 8000;
var PREFLIGHT_MAX_COMMITS = 10;
var START_DIRS = ["cwd", "argv1", "process"];
var DEFAULT_PACKAGE_NAME = "openclaw";
var CORE_PACKAGE_NAMES = new Set([DEFAULT_PACKAGE_NAME]);
function normalizeDir(value) {
    if (!value) {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    return node_path_1.default.resolve(trimmed);
}
function resolveNodeModulesBinPackageRoot(argv1) {
    var normalized = node_path_1.default.resolve(argv1);
    var parts = normalized.split(node_path_1.default.sep);
    var binIndex = parts.lastIndexOf(".bin");
    if (binIndex <= 0) {
        return null;
    }
    if (parts[binIndex - 1] !== "node_modules") {
        return null;
    }
    var binName = node_path_1.default.basename(normalized);
    var nodeModulesDir = parts.slice(0, binIndex).join(node_path_1.default.sep);
    return node_path_1.default.join(nodeModulesDir, binName);
}
function buildStartDirs(opts) {
    var dirs = [];
    var cwd = normalizeDir(opts.cwd);
    if (cwd) {
        dirs.push(cwd);
    }
    var argv1 = normalizeDir(opts.argv1);
    if (argv1) {
        dirs.push(node_path_1.default.dirname(argv1));
        var packageRoot = resolveNodeModulesBinPackageRoot(argv1);
        if (packageRoot) {
            dirs.push(packageRoot);
        }
    }
    var proc = normalizeDir(process.cwd());
    if (proc) {
        dirs.push(proc);
    }
    return Array.from(new Set(dirs));
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
                    return [2 /*return*/, typeof (parsed === null || parsed === void 0 ? void 0 : parsed.version) === "string" ? parsed.version : null];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
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
function readBranchName(runCommand, root, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var res, branch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runCommand(["git", "-C", root, "rev-parse", "--abbrev-ref", "HEAD"], {
                        timeoutMs: timeoutMs,
                    }).catch(function () { return null; })];
                case 1:
                    res = _a.sent();
                    if (!res || res.code !== 0) {
                        return [2 /*return*/, null];
                    }
                    branch = res.stdout.trim();
                    return [2 /*return*/, branch || null];
            }
        });
    });
}
function listGitTags(runCommand_1, root_1, timeoutMs_1) {
    return __awaiter(this, arguments, void 0, function (runCommand, root, timeoutMs, pattern) {
        var res;
        if (pattern === void 0) { pattern = "v*"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runCommand(["git", "-C", root, "tag", "--list", pattern, "--sort=-v:refname"], {
                        timeoutMs: timeoutMs,
                    }).catch(function () { return null; })];
                case 1:
                    res = _a.sent();
                    if (!res || res.code !== 0) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, res.stdout
                            .split("\n")
                            .map(function (line) { return line.trim(); })
                            .filter(Boolean)];
            }
        });
    });
}
function resolveChannelTag(runCommand, root, timeoutMs, channel) {
    return __awaiter(this, void 0, void 0, function () {
        var tags, betaTag, stableTag, cmp;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, listGitTags(runCommand, root, timeoutMs)];
                case 1:
                    tags = _d.sent();
                    if (channel === "beta") {
                        betaTag = (_a = tags.find(function (tag) { return (0, update_channels_js_1.isBetaTag)(tag); })) !== null && _a !== void 0 ? _a : null;
                        stableTag = (_b = tags.find(function (tag) { return (0, update_channels_js_1.isStableTag)(tag); })) !== null && _b !== void 0 ? _b : null;
                        if (!betaTag) {
                            return [2 /*return*/, stableTag];
                        }
                        if (!stableTag) {
                            return [2 /*return*/, betaTag];
                        }
                        cmp = (0, update_check_js_1.compareSemverStrings)(betaTag, stableTag);
                        if (cmp != null && cmp < 0) {
                            return [2 /*return*/, stableTag];
                        }
                        return [2 /*return*/, betaTag];
                    }
                    return [2 /*return*/, (_c = tags.find(function (tag) { return (0, update_channels_js_1.isStableTag)(tag); })) !== null && _c !== void 0 ? _c : null];
            }
        });
    });
}
function resolveGitRoot(runCommand, candidates, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, candidates_1, dir, res, root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, candidates_1 = candidates;
                    _a.label = 1;
                case 1:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 4];
                    dir = candidates_1[_i];
                    return [4 /*yield*/, runCommand(["git", "-C", dir, "rev-parse", "--show-toplevel"], {
                            timeoutMs: timeoutMs,
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code === 0) {
                        root = res.stdout.trim();
                        if (root) {
                            return [2 /*return*/, root];
                        }
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
function findPackageRoot(candidates) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, candidates_2, dir, current, i, pkgPath, raw, parsed, name_2, _a, parent_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, candidates_2 = candidates;
                    _c.label = 1;
                case 1:
                    if (!(_i < candidates_2.length)) return [3 /*break*/, 9];
                    dir = candidates_2[_i];
                    current = dir;
                    i = 0;
                    _c.label = 2;
                case 2:
                    if (!(i < 12)) return [3 /*break*/, 8];
                    pkgPath = node_path_1.default.join(current, "package.json");
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.readFile(pkgPath, "utf-8")];
                case 4:
                    raw = _c.sent();
                    parsed = JSON.parse(raw);
                    name_2 = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.name) === null || _b === void 0 ? void 0 : _b.trim();
                    if (name_2 && CORE_PACKAGE_NAMES.has(name_2)) {
                        return [2 /*return*/, current];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 6];
                case 6:
                    parent_1 = node_path_1.default.dirname(current);
                    if (parent_1 === current) {
                        return [3 /*break*/, 8];
                    }
                    current = parent_1;
                    _c.label = 7;
                case 7:
                    i += 1;
                    return [3 /*break*/, 2];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, null];
            }
        });
    });
}
function detectPackageManager(root) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, pm, _a, files;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(root, "package.json"), "utf-8")];
                case 1:
                    raw = _d.sent();
                    parsed = JSON.parse(raw);
                    pm = (_c = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.packageManager) === null || _b === void 0 ? void 0 : _b.split("@")[0]) === null || _c === void 0 ? void 0 : _c.trim();
                    if (pm === "pnpm" || pm === "bun" || pm === "npm") {
                        return [2 /*return*/, pm];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, promises_1.default.readdir(root).catch(function () { return []; })];
                case 4:
                    files = _d.sent();
                    if (files.includes("pnpm-lock.yaml")) {
                        return [2 /*return*/, "pnpm"];
                    }
                    if (files.includes("bun.lockb")) {
                        return [2 /*return*/, "bun"];
                    }
                    if (files.includes("package-lock.json")) {
                        return [2 /*return*/, "npm"];
                    }
                    return [2 /*return*/, "npm"];
            }
        });
    });
}
function runStep(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var runCommand, name, argv, cwd, timeoutMs, env, progress, stepIndex, totalSteps, command, stepInfo, started, result, durationMs, stderrTail;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runCommand = opts.runCommand, name = opts.name, argv = opts.argv, cwd = opts.cwd, timeoutMs = opts.timeoutMs, env = opts.env, progress = opts.progress, stepIndex = opts.stepIndex, totalSteps = opts.totalSteps;
                    command = argv.join(" ");
                    stepInfo = {
                        name: name,
                        command: command,
                        index: stepIndex,
                        total: totalSteps,
                    };
                    (_a = progress === null || progress === void 0 ? void 0 : progress.onStepStart) === null || _a === void 0 ? void 0 : _a.call(progress, stepInfo);
                    started = Date.now();
                    return [4 /*yield*/, runCommand(argv, { cwd: cwd, timeoutMs: timeoutMs, env: env })];
                case 1:
                    result = _c.sent();
                    durationMs = Date.now() - started;
                    stderrTail = (0, restart_sentinel_js_1.trimLogTail)(result.stderr, MAX_LOG_CHARS);
                    (_b = progress === null || progress === void 0 ? void 0 : progress.onStepComplete) === null || _b === void 0 ? void 0 : _b.call(progress, __assign(__assign({}, stepInfo), { durationMs: durationMs, exitCode: result.code, stderrTail: stderrTail }));
                    return [2 /*return*/, {
                            name: name,
                            command: command,
                            cwd: cwd,
                            durationMs: durationMs,
                            exitCode: result.code,
                            stdoutTail: (0, restart_sentinel_js_1.trimLogTail)(result.stdout, MAX_LOG_CHARS),
                            stderrTail: (0, restart_sentinel_js_1.trimLogTail)(result.stderr, MAX_LOG_CHARS),
                        }];
            }
        });
    });
}
function managerScriptArgs(manager, script, args) {
    if (args === void 0) { args = []; }
    if (manager === "pnpm") {
        return __spreadArray(["pnpm", script], args, true);
    }
    if (manager === "bun") {
        return __spreadArray(["bun", "run", script], args, true);
    }
    if (args.length > 0) {
        return __spreadArray(["npm", "run", script, "--"], args, true);
    }
    return ["npm", "run", script];
}
function managerInstallArgs(manager) {
    if (manager === "pnpm") {
        return ["pnpm", "install"];
    }
    if (manager === "bun") {
        return ["bun", "install"];
    }
    return ["npm", "install"];
}
function normalizeTag(tag) {
    var trimmed = tag === null || tag === void 0 ? void 0 : tag.trim();
    if (!trimmed) {
        return "latest";
    }
    if (trimmed.startsWith("openclaw@")) {
        return trimmed.slice("openclaw@".length);
    }
    if (trimmed.startsWith("".concat(DEFAULT_PACKAGE_NAME, "@"))) {
        return trimmed.slice("".concat(DEFAULT_PACKAGE_NAME, "@").length);
    }
    return trimmed;
}
function runGatewayUpdate() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var startedAt, runCommand, timeoutMs, progress, steps, candidates, stepIndex, gitTotalSteps, step, pkgRoot, gitRoot, beforeShaResult, beforeSha, beforeVersion_1, channel, branch, _a, needsCheckoutMain, statusCheck, hasUncommittedChanges, checkoutStep, upstreamStep, fetchStep, upstreamShaStep, upstreamSha, revListStep, candidates_4, manager_1, preflightRoot, worktreeDir, worktreeStep, selectedSha, _i, candidates_3, sha, shortSha, checkoutStep, depsStep_1, lintStep, buildStep_1, removeStep, rebaseStep, abortResult, fetchStep, tag, checkoutStep, manager, depsStep, buildStep, uiBuildStep, restoreUiStep, doctorStep, failedStep, afterShaStep, afterVersion, beforeVersion, globalManager, packageName, spec, updateStep, steps_1, afterVersion;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    startedAt = Date.now();
                    runCommand = (_b = opts.runCommand) !== null && _b !== void 0 ? _b : (function (argv, options) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, options)];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/, { stdout: res.stdout, stderr: res.stderr, code: res.code }];
                            }
                        });
                    }); });
                    timeoutMs = (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : DEFAULT_TIMEOUT_MS;
                    progress = opts.progress;
                    steps = [];
                    candidates = buildStartDirs(opts);
                    stepIndex = 0;
                    gitTotalSteps = 0;
                    step = function (name, argv, cwd, env) {
                        var currentIndex = stepIndex;
                        stepIndex += 1;
                        return {
                            runCommand: runCommand,
                            name: name,
                            argv: argv,
                            cwd: cwd,
                            timeoutMs: timeoutMs,
                            env: env,
                            progress: progress,
                            stepIndex: currentIndex,
                            totalSteps: gitTotalSteps,
                        };
                    };
                    return [4 /*yield*/, findPackageRoot(candidates)];
                case 1:
                    pkgRoot = _k.sent();
                    return [4 /*yield*/, resolveGitRoot(runCommand, candidates, timeoutMs)];
                case 2:
                    gitRoot = _k.sent();
                    if (gitRoot && pkgRoot && node_path_1.default.resolve(gitRoot) !== node_path_1.default.resolve(pkgRoot)) {
                        gitRoot = null;
                    }
                    if (gitRoot && !pkgRoot) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "unknown",
                                root: gitRoot,
                                reason: "not-openclaw-root",
                                steps: [],
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    if (!(gitRoot && pkgRoot && node_path_1.default.resolve(gitRoot) === node_path_1.default.resolve(pkgRoot))) return [3 /*break*/, 49];
                    return [4 /*yield*/, runCommand(["git", "-C", gitRoot, "rev-parse", "HEAD"], {
                            cwd: gitRoot,
                            timeoutMs: timeoutMs,
                        })];
                case 3:
                    beforeShaResult = _k.sent();
                    beforeSha = beforeShaResult.stdout.trim() || null;
                    return [4 /*yield*/, readPackageVersion(gitRoot)];
                case 4:
                    beforeVersion_1 = _k.sent();
                    channel = (_d = opts.channel) !== null && _d !== void 0 ? _d : "dev";
                    if (!(channel === "dev")) return [3 /*break*/, 6];
                    return [4 /*yield*/, readBranchName(runCommand, gitRoot, timeoutMs)];
                case 5:
                    _a = _k.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = null;
                    _k.label = 7;
                case 7:
                    branch = _a;
                    needsCheckoutMain = channel === "dev" && branch !== update_channels_js_1.DEV_BRANCH;
                    gitTotalSteps = channel === "dev" ? (needsCheckoutMain ? 11 : 10) : 9;
                    return [4 /*yield*/, runStep(step("clean check", ["git", "-C", gitRoot, "status", "--porcelain", "--", ":!dist/control-ui/"], gitRoot))];
                case 8:
                    statusCheck = _k.sent();
                    steps.push(statusCheck);
                    hasUncommittedChanges = statusCheck.stdoutTail && statusCheck.stdoutTail.trim().length > 0;
                    if (hasUncommittedChanges) {
                        return [2 /*return*/, {
                                status: "skipped",
                                mode: "git",
                                root: gitRoot,
                                reason: "dirty",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    if (!(channel === "dev")) return [3 /*break*/, 36];
                    if (!needsCheckoutMain) return [3 /*break*/, 10];
                    return [4 /*yield*/, runStep(step("git checkout ".concat(update_channels_js_1.DEV_BRANCH), ["git", "-C", gitRoot, "checkout", update_channels_js_1.DEV_BRANCH], gitRoot))];
                case 9:
                    checkoutStep = _k.sent();
                    steps.push(checkoutStep);
                    if (checkoutStep.exitCode !== 0) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "checkout-failed",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    _k.label = 10;
                case 10: return [4 /*yield*/, runStep(step("upstream check", [
                        "git",
                        "-C",
                        gitRoot,
                        "rev-parse",
                        "--abbrev-ref",
                        "--symbolic-full-name",
                        "@{upstream}",
                    ], gitRoot))];
                case 11:
                    upstreamStep = _k.sent();
                    steps.push(upstreamStep);
                    if (upstreamStep.exitCode !== 0) {
                        return [2 /*return*/, {
                                status: "skipped",
                                mode: "git",
                                root: gitRoot,
                                reason: "no-upstream",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, runStep(step("git fetch", ["git", "-C", gitRoot, "fetch", "--all", "--prune", "--tags"], gitRoot))];
                case 12:
                    fetchStep = _k.sent();
                    steps.push(fetchStep);
                    return [4 /*yield*/, runStep(step("git rev-parse @{upstream}", ["git", "-C", gitRoot, "rev-parse", "@{upstream}"], gitRoot))];
                case 13:
                    upstreamShaStep = _k.sent();
                    steps.push(upstreamShaStep);
                    upstreamSha = (_e = upstreamShaStep.stdoutTail) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!upstreamShaStep.stdoutTail || !upstreamSha) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "no-upstream-sha",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, runStep(step("git rev-list", ["git", "-C", gitRoot, "rev-list", "--max-count=".concat(PREFLIGHT_MAX_COMMITS), upstreamSha], gitRoot))];
                case 14:
                    revListStep = _k.sent();
                    steps.push(revListStep);
                    if (revListStep.exitCode !== 0) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "preflight-revlist-failed",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    candidates_4 = ((_f = revListStep.stdoutTail) !== null && _f !== void 0 ? _f : "")
                        .split("\n")
                        .map(function (line) { return line.trim(); })
                        .filter(Boolean);
                    if (candidates_4.length === 0) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "preflight-no-candidates",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, detectPackageManager(gitRoot)];
                case 15:
                    manager_1 = _k.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-preflight-"))];
                case 16:
                    preflightRoot = _k.sent();
                    worktreeDir = node_path_1.default.join(preflightRoot, "worktree");
                    return [4 /*yield*/, runStep(step("preflight worktree", ["git", "-C", gitRoot, "worktree", "add", "--detach", worktreeDir, upstreamSha], gitRoot))];
                case 17:
                    worktreeStep = _k.sent();
                    steps.push(worktreeStep);
                    if (!(worktreeStep.exitCode !== 0)) return [3 /*break*/, 19];
                    return [4 /*yield*/, promises_1.default.rm(preflightRoot, { recursive: true, force: true }).catch(function () { })];
                case 18:
                    _k.sent();
                    return [2 /*return*/, {
                            status: "error",
                            mode: "git",
                            root: gitRoot,
                            reason: "preflight-worktree-failed",
                            before: { sha: beforeSha, version: beforeVersion_1 },
                            steps: steps,
                            durationMs: Date.now() - startedAt,
                        }];
                case 19:
                    selectedSha = null;
                    _k.label = 20;
                case 20:
                    _k.trys.push([20, , 28, 32]);
                    _i = 0, candidates_3 = candidates_4;
                    _k.label = 21;
                case 21:
                    if (!(_i < candidates_3.length)) return [3 /*break*/, 27];
                    sha = candidates_3[_i];
                    shortSha = sha.slice(0, 8);
                    return [4 /*yield*/, runStep(step("preflight checkout (".concat(shortSha, ")"), ["git", "-C", worktreeDir, "checkout", "--detach", sha], worktreeDir))];
                case 22:
                    checkoutStep = _k.sent();
                    steps.push(checkoutStep);
                    if (checkoutStep.exitCode !== 0) {
                        return [3 /*break*/, 26];
                    }
                    return [4 /*yield*/, runStep(step("preflight deps install (".concat(shortSha, ")"), managerInstallArgs(manager_1), worktreeDir))];
                case 23:
                    depsStep_1 = _k.sent();
                    steps.push(depsStep_1);
                    if (depsStep_1.exitCode !== 0) {
                        return [3 /*break*/, 26];
                    }
                    return [4 /*yield*/, runStep(step("preflight lint (".concat(shortSha, ")"), managerScriptArgs(manager_1, "lint"), worktreeDir))];
                case 24:
                    lintStep = _k.sent();
                    steps.push(lintStep);
                    if (lintStep.exitCode !== 0) {
                        return [3 /*break*/, 26];
                    }
                    return [4 /*yield*/, runStep(step("preflight build (".concat(shortSha, ")"), managerScriptArgs(manager_1, "build"), worktreeDir))];
                case 25:
                    buildStep_1 = _k.sent();
                    steps.push(buildStep_1);
                    if (buildStep_1.exitCode !== 0) {
                        return [3 /*break*/, 26];
                    }
                    selectedSha = sha;
                    return [3 /*break*/, 27];
                case 26:
                    _i++;
                    return [3 /*break*/, 21];
                case 27: return [3 /*break*/, 32];
                case 28: return [4 /*yield*/, runStep(step("preflight cleanup", ["git", "-C", gitRoot, "worktree", "remove", "--force", worktreeDir], gitRoot))];
                case 29:
                    removeStep = _k.sent();
                    steps.push(removeStep);
                    return [4 /*yield*/, runCommand(["git", "-C", gitRoot, "worktree", "prune"], {
                            cwd: gitRoot,
                            timeoutMs: timeoutMs,
                        }).catch(function () { return null; })];
                case 30:
                    _k.sent();
                    return [4 /*yield*/, promises_1.default.rm(preflightRoot, { recursive: true, force: true }).catch(function () { })];
                case 31:
                    _k.sent();
                    return [7 /*endfinally*/];
                case 32:
                    if (!selectedSha) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "preflight-no-good-commit",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, runStep(step("git rebase", ["git", "-C", gitRoot, "rebase", selectedSha], gitRoot))];
                case 33:
                    rebaseStep = _k.sent();
                    steps.push(rebaseStep);
                    if (!(rebaseStep.exitCode !== 0)) return [3 /*break*/, 35];
                    return [4 /*yield*/, runCommand(["git", "-C", gitRoot, "rebase", "--abort"], {
                            cwd: gitRoot,
                            timeoutMs: timeoutMs,
                        })];
                case 34:
                    abortResult = _k.sent();
                    steps.push({
                        name: "git rebase --abort",
                        command: "git rebase --abort",
                        cwd: gitRoot,
                        durationMs: 0,
                        exitCode: abortResult.code,
                        stdoutTail: (0, restart_sentinel_js_1.trimLogTail)(abortResult.stdout, MAX_LOG_CHARS),
                        stderrTail: (0, restart_sentinel_js_1.trimLogTail)(abortResult.stderr, MAX_LOG_CHARS),
                    });
                    return [2 /*return*/, {
                            status: "error",
                            mode: "git",
                            root: gitRoot,
                            reason: "rebase-failed",
                            before: { sha: beforeSha, version: beforeVersion_1 },
                            steps: steps,
                            durationMs: Date.now() - startedAt,
                        }];
                case 35: return [3 /*break*/, 40];
                case 36: return [4 /*yield*/, runStep(step("git fetch", ["git", "-C", gitRoot, "fetch", "--all", "--prune", "--tags"], gitRoot))];
                case 37:
                    fetchStep = _k.sent();
                    steps.push(fetchStep);
                    if (fetchStep.exitCode !== 0) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "fetch-failed",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, resolveChannelTag(runCommand, gitRoot, timeoutMs, channel)];
                case 38:
                    tag = _k.sent();
                    if (!tag) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "no-release-tag",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, runStep(step("git checkout ".concat(tag), ["git", "-C", gitRoot, "checkout", "--detach", tag], gitRoot))];
                case 39:
                    checkoutStep = _k.sent();
                    steps.push(checkoutStep);
                    if (checkoutStep.exitCode !== 0) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "git",
                                root: gitRoot,
                                reason: "checkout-failed",
                                before: { sha: beforeSha, version: beforeVersion_1 },
                                steps: steps,
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    _k.label = 40;
                case 40: return [4 /*yield*/, detectPackageManager(gitRoot)];
                case 41:
                    manager = _k.sent();
                    return [4 /*yield*/, runStep(step("deps install", managerInstallArgs(manager), gitRoot))];
                case 42:
                    depsStep = _k.sent();
                    steps.push(depsStep);
                    return [4 /*yield*/, runStep(step("build", managerScriptArgs(manager, "build"), gitRoot))];
                case 43:
                    buildStep = _k.sent();
                    steps.push(buildStep);
                    return [4 /*yield*/, runStep(step("ui:build", managerScriptArgs(manager, "ui:build"), gitRoot))];
                case 44:
                    uiBuildStep = _k.sent();
                    steps.push(uiBuildStep);
                    return [4 /*yield*/, runStep(step("restore control-ui", ["git", "-C", gitRoot, "checkout", "--", "dist/control-ui/"], gitRoot))];
                case 45:
                    restoreUiStep = _k.sent();
                    steps.push(restoreUiStep);
                    return [4 /*yield*/, runStep(step("openclaw doctor", managerScriptArgs(manager, "openclaw", ["doctor", "--non-interactive"]), gitRoot, { OPENCLAW_UPDATE_IN_PROGRESS: "1" }))];
                case 46:
                    doctorStep = _k.sent();
                    steps.push(doctorStep);
                    failedStep = steps.find(function (s) { return s.exitCode !== 0; });
                    return [4 /*yield*/, runStep(step("git rev-parse HEAD (after)", ["git", "-C", gitRoot, "rev-parse", "HEAD"], gitRoot))];
                case 47:
                    afterShaStep = _k.sent();
                    steps.push(afterShaStep);
                    return [4 /*yield*/, readPackageVersion(gitRoot)];
                case 48:
                    afterVersion = _k.sent();
                    return [2 /*return*/, {
                            status: failedStep ? "error" : "ok",
                            mode: "git",
                            root: gitRoot,
                            reason: failedStep ? failedStep.name : undefined,
                            before: { sha: beforeSha, version: beforeVersion_1 },
                            after: {
                                sha: (_h = (_g = afterShaStep.stdoutTail) === null || _g === void 0 ? void 0 : _g.trim()) !== null && _h !== void 0 ? _h : null,
                                version: afterVersion,
                            },
                            steps: steps,
                            durationMs: Date.now() - startedAt,
                        }];
                case 49:
                    if (!pkgRoot) {
                        return [2 /*return*/, {
                                status: "error",
                                mode: "unknown",
                                reason: "no root (".concat(START_DIRS.join(","), ")"),
                                steps: [],
                                durationMs: Date.now() - startedAt,
                            }];
                    }
                    return [4 /*yield*/, readPackageVersion(pkgRoot)];
                case 50:
                    beforeVersion = _k.sent();
                    return [4 /*yield*/, (0, update_global_js_1.detectGlobalInstallManagerForRoot)(runCommand, pkgRoot, timeoutMs)];
                case 51:
                    globalManager = _k.sent();
                    if (!globalManager) return [3 /*break*/, 56];
                    return [4 /*yield*/, readPackageName(pkgRoot)];
                case 52:
                    packageName = (_j = (_k.sent())) !== null && _j !== void 0 ? _j : DEFAULT_PACKAGE_NAME;
                    return [4 /*yield*/, (0, update_global_js_1.cleanupGlobalRenameDirs)({
                            globalRoot: node_path_1.default.dirname(pkgRoot),
                            packageName: packageName,
                        })];
                case 53:
                    _k.sent();
                    spec = "".concat(packageName, "@").concat(normalizeTag(opts.tag));
                    return [4 /*yield*/, runStep({
                            runCommand: runCommand,
                            name: "global update",
                            argv: (0, update_global_js_1.globalInstallArgs)(globalManager, spec),
                            cwd: pkgRoot,
                            timeoutMs: timeoutMs,
                            progress: progress,
                            stepIndex: 0,
                            totalSteps: 1,
                        })];
                case 54:
                    updateStep = _k.sent();
                    steps_1 = [updateStep];
                    return [4 /*yield*/, readPackageVersion(pkgRoot)];
                case 55:
                    afterVersion = _k.sent();
                    return [2 /*return*/, {
                            status: updateStep.exitCode === 0 ? "ok" : "error",
                            mode: globalManager,
                            root: pkgRoot,
                            reason: updateStep.exitCode === 0 ? undefined : updateStep.name,
                            before: { version: beforeVersion },
                            after: { version: afterVersion },
                            steps: steps_1,
                            durationMs: Date.now() - startedAt,
                        }];
                case 56: return [2 /*return*/, {
                        status: "skipped",
                        mode: "unknown",
                        root: pkgRoot,
                        reason: "not-git-install",
                        before: { version: beforeVersion },
                        steps: [],
                        durationMs: Date.now() - startedAt,
                    }];
            }
        });
    });
}
