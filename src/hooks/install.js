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
exports.resolveHookInstallDir = resolveHookInstallDir;
exports.installHooksFromArchive = installHooksFromArchive;
exports.installHooksFromNpmSpec = installHooksFromNpmSpec;
exports.installHooksFromPath = installHooksFromPath;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var legacy_names_js_1 = require("../compat/legacy-names.js");
var archive_js_1 = require("../infra/archive.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
var frontmatter_js_1 = require("./frontmatter.js");
var defaultLogger = {};
function unscopedPackageName(name) {
    var _a;
    var trimmed = name.trim();
    if (!trimmed) {
        return trimmed;
    }
    return trimmed.includes("/") ? ((_a = trimmed.split("/").pop()) !== null && _a !== void 0 ? _a : trimmed) : trimmed;
}
function safeDirName(input) {
    var trimmed = input.trim();
    if (!trimmed) {
        return trimmed;
    }
    return trimmed.replaceAll("/", "__").replaceAll("\\", "__");
}
function validateHookId(hookId) {
    if (!hookId) {
        return "invalid hook name: missing";
    }
    if (hookId === "." || hookId === "..") {
        return "invalid hook name: reserved path segment";
    }
    if (hookId.includes("/") || hookId.includes("\\")) {
        return "invalid hook name: path separators not allowed";
    }
    return null;
}
function resolveHookInstallDir(hookId, hooksDir) {
    var hooksBase = hooksDir ? (0, utils_js_1.resolveUserPath)(hooksDir) : node_path_1.default.join(utils_js_1.CONFIG_DIR, "hooks");
    var hookIdError = validateHookId(hookId);
    if (hookIdError) {
        throw new Error(hookIdError);
    }
    var targetDirResult = resolveSafeInstallDir(hooksBase, hookId);
    if (!targetDirResult.ok) {
        throw new Error(targetDirResult.error);
    }
    return targetDirResult.path;
}
function resolveSafeInstallDir(hooksDir, hookId) {
    var targetDir = node_path_1.default.join(hooksDir, safeDirName(hookId));
    var resolvedBase = node_path_1.default.resolve(hooksDir);
    var resolvedTarget = node_path_1.default.resolve(targetDir);
    var relative = node_path_1.default.relative(resolvedBase, resolvedTarget);
    if (!relative ||
        relative === ".." ||
        relative.startsWith("..".concat(node_path_1.default.sep)) ||
        node_path_1.default.isAbsolute(relative)) {
        return { ok: false, error: "invalid hook name: path traversal detected" };
    }
    return { ok: true, path: targetDir };
}
function ensureOpenClawHooks(manifest) {
    return __awaiter(this, void 0, void 0, function () {
        var hooks, list;
        var _a;
        return __generator(this, function (_b) {
            hooks = (_a = manifest[legacy_names_js_1.MANIFEST_KEY]) === null || _a === void 0 ? void 0 : _a.hooks;
            if (!Array.isArray(hooks)) {
                throw new Error("package.json missing openclaw.hooks");
            }
            list = hooks.map(function (e) { return (typeof e === "string" ? e.trim() : ""); }).filter(Boolean);
            if (list.length === 0) {
                throw new Error("package.json openclaw.hooks is empty");
            }
            return [2 /*return*/, list];
        });
    });
}
function resolveHookNameFromDir(hookDir) {
    return __awaiter(this, void 0, void 0, function () {
        var hookMdPath, raw, frontmatter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookMdPath = node_path_1.default.join(hookDir, "HOOK.md");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(hookMdPath)];
                case 1:
                    if (!(_a.sent())) {
                        throw new Error("HOOK.md missing in ".concat(hookDir));
                    }
                    return [4 /*yield*/, promises_1.default.readFile(hookMdPath, "utf-8")];
                case 2:
                    raw = _a.sent();
                    frontmatter = (0, frontmatter_js_1.parseFrontmatter)(raw);
                    return [2 /*return*/, frontmatter.name || node_path_1.default.basename(hookDir)];
            }
        });
    });
}
function validateHookDir(hookDir) {
    return __awaiter(this, void 0, void 0, function () {
        var hookMdPath, handlerCandidates, hasHandler;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookMdPath = node_path_1.default.join(hookDir, "HOOK.md");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(hookMdPath)];
                case 1:
                    if (!(_a.sent())) {
                        throw new Error("HOOK.md missing in ".concat(hookDir));
                    }
                    handlerCandidates = ["handler.ts", "handler.js", "index.ts", "index.js"];
                    return [4 /*yield*/, Promise.all(handlerCandidates.map(function (candidate) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (0, archive_js_1.fileExists)(node_path_1.default.join(hookDir, candidate))];
                        }); }); })).then(function (results) { return results.some(Boolean); })];
                case 2:
                    hasHandler = _a.sent();
                    if (!hasHandler) {
                        throw new Error("handler.ts/handler.js/index.ts/index.js missing in ".concat(hookDir));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function installHookPackageFromDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, mode, dryRun, manifestPath, manifest, err_1, hookEntries, err_2, pkgName, hookPackId, hookIdError, hooksDir, targetDirResult, targetDir, _a, resolvedHooks, _i, hookEntries_1, entry, hookDir, hookName, backupDir, _b, err_3, deps, hasDeps, npmRes;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    logger = (_c = params.logger) !== null && _c !== void 0 ? _c : defaultLogger;
                    timeoutMs = (_d = params.timeoutMs) !== null && _d !== void 0 ? _d : 120000;
                    mode = (_e = params.mode) !== null && _e !== void 0 ? _e : "install";
                    dryRun = (_f = params.dryRun) !== null && _f !== void 0 ? _f : false;
                    manifestPath = node_path_1.default.join(params.packageDir, "package.json");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(manifestPath)];
                case 1:
                    if (!(_k.sent())) {
                        return [2 /*return*/, { ok: false, error: "package.json missing" }];
                    }
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, archive_js_1.readJsonFile)(manifestPath)];
                case 3:
                    manifest = _k.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _k.sent();
                    return [2 /*return*/, { ok: false, error: "invalid package.json: ".concat(String(err_1)) }];
                case 5:
                    _k.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, ensureOpenClawHooks(manifest)];
                case 6:
                    hookEntries = _k.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _k.sent();
                    return [2 /*return*/, { ok: false, error: String(err_2) }];
                case 8:
                    pkgName = typeof manifest.name === "string" ? manifest.name : "";
                    hookPackId = pkgName ? unscopedPackageName(pkgName) : node_path_1.default.basename(params.packageDir);
                    hookIdError = validateHookId(hookPackId);
                    if (hookIdError) {
                        return [2 /*return*/, { ok: false, error: hookIdError }];
                    }
                    if (params.expectedHookPackId && params.expectedHookPackId !== hookPackId) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "hook pack id mismatch: expected ".concat(params.expectedHookPackId, ", got ").concat(hookPackId),
                            }];
                    }
                    hooksDir = params.hooksDir
                        ? (0, utils_js_1.resolveUserPath)(params.hooksDir)
                        : node_path_1.default.join(utils_js_1.CONFIG_DIR, "hooks");
                    return [4 /*yield*/, promises_1.default.mkdir(hooksDir, { recursive: true })];
                case 9:
                    _k.sent();
                    targetDirResult = resolveSafeInstallDir(hooksDir, hookPackId);
                    if (!targetDirResult.ok) {
                        return [2 /*return*/, { ok: false, error: targetDirResult.error }];
                    }
                    targetDir = targetDirResult.path;
                    _a = mode === "install";
                    if (!_a) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 10:
                    _a = (_k.sent());
                    _k.label = 11;
                case 11:
                    if (_a) {
                        return [2 /*return*/, { ok: false, error: "hook pack already exists: ".concat(targetDir, " (delete it first)") }];
                    }
                    resolvedHooks = [];
                    _i = 0, hookEntries_1 = hookEntries;
                    _k.label = 12;
                case 12:
                    if (!(_i < hookEntries_1.length)) return [3 /*break*/, 16];
                    entry = hookEntries_1[_i];
                    hookDir = node_path_1.default.resolve(params.packageDir, entry);
                    return [4 /*yield*/, validateHookDir(hookDir)];
                case 13:
                    _k.sent();
                    return [4 /*yield*/, resolveHookNameFromDir(hookDir)];
                case 14:
                    hookName = _k.sent();
                    resolvedHooks.push(hookName);
                    _k.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 12];
                case 16:
                    if (dryRun) {
                        return [2 /*return*/, {
                                ok: true,
                                hookPackId: hookPackId,
                                hooks: resolvedHooks,
                                targetDir: targetDir,
                                version: typeof manifest.version === "string" ? manifest.version : undefined,
                            }];
                    }
                    (_g = logger.info) === null || _g === void 0 ? void 0 : _g.call(logger, "Installing to ".concat(targetDir, "\u2026"));
                    backupDir = null;
                    _b = mode === "update";
                    if (!_b) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 17:
                    _b = (_k.sent());
                    _k.label = 18;
                case 18:
                    if (!_b) return [3 /*break*/, 20];
                    backupDir = "".concat(targetDir, ".backup-").concat(Date.now());
                    return [4 /*yield*/, promises_1.default.rename(targetDir, backupDir)];
                case 19:
                    _k.sent();
                    _k.label = 20;
                case 20:
                    _k.trys.push([20, 22, , 26]);
                    return [4 /*yield*/, promises_1.default.cp(params.packageDir, targetDir, { recursive: true })];
                case 21:
                    _k.sent();
                    return [3 /*break*/, 26];
                case 22:
                    err_3 = _k.sent();
                    if (!backupDir) return [3 /*break*/, 25];
                    return [4 /*yield*/, promises_1.default.rm(targetDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 23:
                    _k.sent();
                    return [4 /*yield*/, promises_1.default.rename(backupDir, targetDir).catch(function () { return undefined; })];
                case 24:
                    _k.sent();
                    _k.label = 25;
                case 25: return [2 /*return*/, { ok: false, error: "failed to copy hook pack: ".concat(String(err_3)) }];
                case 26:
                    deps = (_h = manifest.dependencies) !== null && _h !== void 0 ? _h : {};
                    hasDeps = Object.keys(deps).length > 0;
                    if (!hasDeps) return [3 /*break*/, 31];
                    (_j = logger.info) === null || _j === void 0 ? void 0 : _j.call(logger, "Installing hook pack dependencies…");
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["npm", "install", "--omit=dev", "--silent"], {
                            timeoutMs: Math.max(timeoutMs, 300000),
                            cwd: targetDir,
                        })];
                case 27:
                    npmRes = _k.sent();
                    if (!(npmRes.code !== 0)) return [3 /*break*/, 31];
                    if (!backupDir) return [3 /*break*/, 30];
                    return [4 /*yield*/, promises_1.default.rm(targetDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 28:
                    _k.sent();
                    return [4 /*yield*/, promises_1.default.rename(backupDir, targetDir).catch(function () { return undefined; })];
                case 29:
                    _k.sent();
                    _k.label = 30;
                case 30: return [2 /*return*/, {
                        ok: false,
                        error: "npm install failed: ".concat(npmRes.stderr.trim() || npmRes.stdout.trim()),
                    }];
                case 31:
                    if (!backupDir) return [3 /*break*/, 33];
                    return [4 /*yield*/, promises_1.default.rm(backupDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 32:
                    _k.sent();
                    _k.label = 33;
                case 33: return [2 /*return*/, {
                        ok: true,
                        hookPackId: hookPackId,
                        hooks: resolvedHooks,
                        targetDir: targetDir,
                        version: typeof manifest.version === "string" ? manifest.version : undefined,
                    }];
            }
        });
    });
}
function installHookFromDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, mode, dryRun, hookName, hookIdError, hooksDir, targetDirResult, targetDir, _a, backupDir, _b, err_4;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    logger = (_c = params.logger) !== null && _c !== void 0 ? _c : defaultLogger;
                    mode = (_d = params.mode) !== null && _d !== void 0 ? _d : "install";
                    dryRun = (_e = params.dryRun) !== null && _e !== void 0 ? _e : false;
                    return [4 /*yield*/, validateHookDir(params.hookDir)];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, resolveHookNameFromDir(params.hookDir)];
                case 2:
                    hookName = _g.sent();
                    hookIdError = validateHookId(hookName);
                    if (hookIdError) {
                        return [2 /*return*/, { ok: false, error: hookIdError }];
                    }
                    if (params.expectedHookPackId && params.expectedHookPackId !== hookName) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "hook id mismatch: expected ".concat(params.expectedHookPackId, ", got ").concat(hookName),
                            }];
                    }
                    hooksDir = params.hooksDir
                        ? (0, utils_js_1.resolveUserPath)(params.hooksDir)
                        : node_path_1.default.join(utils_js_1.CONFIG_DIR, "hooks");
                    return [4 /*yield*/, promises_1.default.mkdir(hooksDir, { recursive: true })];
                case 3:
                    _g.sent();
                    targetDirResult = resolveSafeInstallDir(hooksDir, hookName);
                    if (!targetDirResult.ok) {
                        return [2 /*return*/, { ok: false, error: targetDirResult.error }];
                    }
                    targetDir = targetDirResult.path;
                    _a = mode === "install";
                    if (!_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 4:
                    _a = (_g.sent());
                    _g.label = 5;
                case 5:
                    if (_a) {
                        return [2 /*return*/, { ok: false, error: "hook already exists: ".concat(targetDir, " (delete it first)") }];
                    }
                    if (dryRun) {
                        return [2 /*return*/, { ok: true, hookPackId: hookName, hooks: [hookName], targetDir: targetDir }];
                    }
                    (_f = logger.info) === null || _f === void 0 ? void 0 : _f.call(logger, "Installing to ".concat(targetDir, "\u2026"));
                    backupDir = null;
                    _b = mode === "update";
                    if (!_b) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 6:
                    _b = (_g.sent());
                    _g.label = 7;
                case 7:
                    if (!_b) return [3 /*break*/, 9];
                    backupDir = "".concat(targetDir, ".backup-").concat(Date.now());
                    return [4 /*yield*/, promises_1.default.rename(targetDir, backupDir)];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, 11, , 15]);
                    return [4 /*yield*/, promises_1.default.cp(params.hookDir, targetDir, { recursive: true })];
                case 10:
                    _g.sent();
                    return [3 /*break*/, 15];
                case 11:
                    err_4 = _g.sent();
                    if (!backupDir) return [3 /*break*/, 14];
                    return [4 /*yield*/, promises_1.default.rm(targetDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, promises_1.default.rename(backupDir, targetDir).catch(function () { return undefined; })];
                case 13:
                    _g.sent();
                    _g.label = 14;
                case 14: return [2 /*return*/, { ok: false, error: "failed to copy hook: ".concat(String(err_4)) }];
                case 15:
                    if (!backupDir) return [3 /*break*/, 17];
                    return [4 /*yield*/, promises_1.default.rm(backupDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 16:
                    _g.sent();
                    _g.label = 17;
                case 17: return [2 /*return*/, { ok: true, hookPackId: hookName, hooks: [hookName], targetDir: targetDir }];
            }
        });
    });
}
function installHooksFromArchive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, archivePath, tmpDir, extractDir, err_5, rootDir, err_6, manifestPath;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logger = (_a = params.logger) !== null && _a !== void 0 ? _a : defaultLogger;
                    timeoutMs = (_b = params.timeoutMs) !== null && _b !== void 0 ? _b : 120000;
                    archivePath = (0, utils_js_1.resolveUserPath)(params.archivePath);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(archivePath)];
                case 1:
                    if (!(_d.sent())) {
                        return [2 /*return*/, { ok: false, error: "archive not found: ".concat(archivePath) }];
                    }
                    if (!(0, archive_js_1.resolveArchiveKind)(archivePath)) {
                        return [2 /*return*/, { ok: false, error: "unsupported archive: ".concat(archivePath) }];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hook-"))];
                case 2:
                    tmpDir = _d.sent();
                    extractDir = node_path_1.default.join(tmpDir, "extract");
                    return [4 /*yield*/, promises_1.default.mkdir(extractDir, { recursive: true })];
                case 3:
                    _d.sent();
                    (_c = logger.info) === null || _c === void 0 ? void 0 : _c.call(logger, "Extracting ".concat(archivePath, "\u2026"));
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, archive_js_1.extractArchive)({ archivePath: archivePath, destDir: extractDir, timeoutMs: timeoutMs, logger: logger })];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_5 = _d.sent();
                    return [2 /*return*/, { ok: false, error: "failed to extract archive: ".concat(String(err_5)) }];
                case 7:
                    rootDir = "";
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, archive_js_1.resolvePackedRootDir)(extractDir)];
                case 9:
                    rootDir = _d.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_6 = _d.sent();
                    return [2 /*return*/, { ok: false, error: String(err_6) }];
                case 11:
                    manifestPath = node_path_1.default.join(rootDir, "package.json");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(manifestPath)];
                case 12:
                    if (!_d.sent()) return [3 /*break*/, 14];
                    return [4 /*yield*/, installHookPackageFromDir({
                            packageDir: rootDir,
                            hooksDir: params.hooksDir,
                            timeoutMs: timeoutMs,
                            logger: logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedHookPackId: params.expectedHookPackId,
                        })];
                case 13: return [2 /*return*/, _d.sent()];
                case 14: return [4 /*yield*/, installHookFromDir({
                        hookDir: rootDir,
                        hooksDir: params.hooksDir,
                        logger: logger,
                        mode: params.mode,
                        dryRun: params.dryRun,
                        expectedHookPackId: params.expectedHookPackId,
                    })];
                case 15: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function installHooksFromNpmSpec(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, mode, dryRun, expectedHookPackId, spec, tmpDir, res, packed, archivePath;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    logger = (_a = params.logger) !== null && _a !== void 0 ? _a : defaultLogger;
                    timeoutMs = (_b = params.timeoutMs) !== null && _b !== void 0 ? _b : 120000;
                    mode = (_c = params.mode) !== null && _c !== void 0 ? _c : "install";
                    dryRun = (_d = params.dryRun) !== null && _d !== void 0 ? _d : false;
                    expectedHookPackId = params.expectedHookPackId;
                    spec = params.spec.trim();
                    if (!spec) {
                        return [2 /*return*/, { ok: false, error: "missing npm spec" }];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hook-pack-"))];
                case 1:
                    tmpDir = _f.sent();
                    (_e = logger.info) === null || _e === void 0 ? void 0 : _e.call(logger, "Downloading ".concat(spec, "\u2026"));
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["npm", "pack", spec], {
                            timeoutMs: Math.max(timeoutMs, 300000),
                            cwd: tmpDir,
                            env: { COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
                        })];
                case 2:
                    res = _f.sent();
                    if (res.code !== 0) {
                        return [2 /*return*/, { ok: false, error: "npm pack failed: ".concat(res.stderr.trim() || res.stdout.trim()) }];
                    }
                    packed = (res.stdout || "")
                        .split("\n")
                        .map(function (l) { return l.trim(); })
                        .filter(Boolean)
                        .pop();
                    if (!packed) {
                        return [2 /*return*/, { ok: false, error: "npm pack produced no archive" }];
                    }
                    archivePath = node_path_1.default.join(tmpDir, packed);
                    return [4 /*yield*/, installHooksFromArchive({
                            archivePath: archivePath,
                            hooksDir: params.hooksDir,
                            timeoutMs: timeoutMs,
                            logger: logger,
                            mode: mode,
                            dryRun: dryRun,
                            expectedHookPackId: expectedHookPackId,
                        })];
                case 3: return [2 /*return*/, _f.sent()];
            }
        });
    });
}
function installHooksFromPath(params) {
    return __awaiter(this, void 0, void 0, function () {
        var resolved, stat, manifestPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = (0, utils_js_1.resolveUserPath)(params.path);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(resolved)];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, { ok: false, error: "path not found: ".concat(resolved) }];
                    }
                    return [4 /*yield*/, promises_1.default.stat(resolved)];
                case 2:
                    stat = _a.sent();
                    if (!stat.isDirectory()) return [3 /*break*/, 7];
                    manifestPath = node_path_1.default.join(resolved, "package.json");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(manifestPath)];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, installHookPackageFromDir({
                            packageDir: resolved,
                            hooksDir: params.hooksDir,
                            timeoutMs: params.timeoutMs,
                            logger: params.logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedHookPackId: params.expectedHookPackId,
                        })];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [4 /*yield*/, installHookFromDir({
                        hookDir: resolved,
                        hooksDir: params.hooksDir,
                        logger: params.logger,
                        mode: params.mode,
                        dryRun: params.dryRun,
                        expectedHookPackId: params.expectedHookPackId,
                    })];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    if (!(0, archive_js_1.resolveArchiveKind)(resolved)) {
                        return [2 /*return*/, { ok: false, error: "unsupported hook file: ".concat(resolved) }];
                    }
                    return [4 /*yield*/, installHooksFromArchive({
                            archivePath: resolved,
                            hooksDir: params.hooksDir,
                            timeoutMs: params.timeoutMs,
                            logger: params.logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedHookPackId: params.expectedHookPackId,
                        })];
                case 8: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
