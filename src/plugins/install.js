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
exports.resolvePluginInstallDir = resolvePluginInstallDir;
exports.installPluginFromArchive = installPluginFromArchive;
exports.installPluginFromDir = installPluginFromDir;
exports.installPluginFromFile = installPluginFromFile;
exports.installPluginFromNpmSpec = installPluginFromNpmSpec;
exports.installPluginFromPath = installPluginFromPath;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var legacy_names_js_1 = require("../compat/legacy-names.js");
var archive_js_1 = require("../infra/archive.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
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
function safeFileName(input) {
    return safeDirName(input);
}
function validatePluginId(pluginId) {
    if (!pluginId) {
        return "invalid plugin name: missing";
    }
    if (pluginId === "." || pluginId === "..") {
        return "invalid plugin name: reserved path segment";
    }
    if (pluginId.includes("/") || pluginId.includes("\\")) {
        return "invalid plugin name: path separators not allowed";
    }
    return null;
}
function ensureOpenClawExtensions(manifest) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions, list;
        var _a;
        return __generator(this, function (_b) {
            extensions = (_a = manifest[legacy_names_js_1.MANIFEST_KEY]) === null || _a === void 0 ? void 0 : _a.extensions;
            if (!Array.isArray(extensions)) {
                throw new Error("package.json missing openclaw.extensions");
            }
            list = extensions.map(function (e) { return (typeof e === "string" ? e.trim() : ""); }).filter(Boolean);
            if (list.length === 0) {
                throw new Error("package.json openclaw.extensions is empty");
            }
            return [2 /*return*/, list];
        });
    });
}
function resolvePluginInstallDir(pluginId, extensionsDir) {
    var extensionsBase = extensionsDir
        ? (0, utils_js_1.resolveUserPath)(extensionsDir)
        : node_path_1.default.join(utils_js_1.CONFIG_DIR, "extensions");
    var pluginIdError = validatePluginId(pluginId);
    if (pluginIdError) {
        throw new Error(pluginIdError);
    }
    var targetDirResult = resolveSafeInstallDir(extensionsBase, pluginId);
    if (!targetDirResult.ok) {
        throw new Error(targetDirResult.error);
    }
    return targetDirResult.path;
}
function resolveSafeInstallDir(extensionsDir, pluginId) {
    var targetDir = node_path_1.default.join(extensionsDir, safeDirName(pluginId));
    var resolvedBase = node_path_1.default.resolve(extensionsDir);
    var resolvedTarget = node_path_1.default.resolve(targetDir);
    var relative = node_path_1.default.relative(resolvedBase, resolvedTarget);
    if (!relative ||
        relative === ".." ||
        relative.startsWith("..".concat(node_path_1.default.sep)) ||
        node_path_1.default.isAbsolute(relative)) {
        return { ok: false, error: "invalid plugin name: path traversal detected" };
    }
    return { ok: true, path: targetDir };
}
function installPluginFromPackageDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, mode, dryRun, manifestPath, manifest, err_1, extensions, err_2, pkgName, pluginId, pluginIdError, extensionsDir, targetDirResult, targetDir, _a, backupDir, _b, err_3, _i, extensions_1, entry, resolvedEntry, deps, hasDeps, npmRes;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    logger = (_c = params.logger) !== null && _c !== void 0 ? _c : defaultLogger;
                    timeoutMs = (_d = params.timeoutMs) !== null && _d !== void 0 ? _d : 120000;
                    mode = (_e = params.mode) !== null && _e !== void 0 ? _e : "install";
                    dryRun = (_f = params.dryRun) !== null && _f !== void 0 ? _f : false;
                    manifestPath = node_path_1.default.join(params.packageDir, "package.json");
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(manifestPath)];
                case 1:
                    if (!(_l.sent())) {
                        return [2 /*return*/, { ok: false, error: "extracted package missing package.json" }];
                    }
                    _l.label = 2;
                case 2:
                    _l.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, archive_js_1.readJsonFile)(manifestPath)];
                case 3:
                    manifest = _l.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _l.sent();
                    return [2 /*return*/, { ok: false, error: "invalid package.json: ".concat(String(err_1)) }];
                case 5:
                    _l.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, ensureOpenClawExtensions(manifest)];
                case 6:
                    extensions = _l.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _l.sent();
                    return [2 /*return*/, { ok: false, error: String(err_2) }];
                case 8:
                    pkgName = typeof manifest.name === "string" ? manifest.name : "";
                    pluginId = pkgName ? unscopedPackageName(pkgName) : "plugin";
                    pluginIdError = validatePluginId(pluginId);
                    if (pluginIdError) {
                        return [2 /*return*/, { ok: false, error: pluginIdError }];
                    }
                    if (params.expectedPluginId && params.expectedPluginId !== pluginId) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "plugin id mismatch: expected ".concat(params.expectedPluginId, ", got ").concat(pluginId),
                            }];
                    }
                    extensionsDir = params.extensionsDir
                        ? (0, utils_js_1.resolveUserPath)(params.extensionsDir)
                        : node_path_1.default.join(utils_js_1.CONFIG_DIR, "extensions");
                    return [4 /*yield*/, promises_1.default.mkdir(extensionsDir, { recursive: true })];
                case 9:
                    _l.sent();
                    targetDirResult = resolveSafeInstallDir(extensionsDir, pluginId);
                    if (!targetDirResult.ok) {
                        return [2 /*return*/, { ok: false, error: targetDirResult.error }];
                    }
                    targetDir = targetDirResult.path;
                    _a = mode === "install";
                    if (!_a) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 10:
                    _a = (_l.sent());
                    _l.label = 11;
                case 11:
                    if (_a) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "plugin already exists: ".concat(targetDir, " (delete it first)"),
                            }];
                    }
                    if (dryRun) {
                        return [2 /*return*/, {
                                ok: true,
                                pluginId: pluginId,
                                targetDir: targetDir,
                                manifestName: pkgName || undefined,
                                version: typeof manifest.version === "string" ? manifest.version : undefined,
                                extensions: extensions,
                            }];
                    }
                    (_g = logger.info) === null || _g === void 0 ? void 0 : _g.call(logger, "Installing to ".concat(targetDir, "\u2026"));
                    backupDir = null;
                    _b = mode === "update";
                    if (!_b) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetDir)];
                case 12:
                    _b = (_l.sent());
                    _l.label = 13;
                case 13:
                    if (!_b) return [3 /*break*/, 15];
                    backupDir = "".concat(targetDir, ".backup-").concat(Date.now());
                    return [4 /*yield*/, promises_1.default.rename(targetDir, backupDir)];
                case 14:
                    _l.sent();
                    _l.label = 15;
                case 15:
                    _l.trys.push([15, 17, , 21]);
                    return [4 /*yield*/, promises_1.default.cp(params.packageDir, targetDir, { recursive: true })];
                case 16:
                    _l.sent();
                    return [3 /*break*/, 21];
                case 17:
                    err_3 = _l.sent();
                    if (!backupDir) return [3 /*break*/, 20];
                    return [4 /*yield*/, promises_1.default.rm(targetDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 18:
                    _l.sent();
                    return [4 /*yield*/, promises_1.default.rename(backupDir, targetDir).catch(function () { return undefined; })];
                case 19:
                    _l.sent();
                    _l.label = 20;
                case 20: return [2 /*return*/, { ok: false, error: "failed to copy plugin: ".concat(String(err_3)) }];
                case 21:
                    _i = 0, extensions_1 = extensions;
                    _l.label = 22;
                case 22:
                    if (!(_i < extensions_1.length)) return [3 /*break*/, 25];
                    entry = extensions_1[_i];
                    resolvedEntry = node_path_1.default.resolve(targetDir, entry);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(resolvedEntry)];
                case 23:
                    if (!(_l.sent())) {
                        (_h = logger.warn) === null || _h === void 0 ? void 0 : _h.call(logger, "extension entry not found: ".concat(entry));
                    }
                    _l.label = 24;
                case 24:
                    _i++;
                    return [3 /*break*/, 22];
                case 25:
                    deps = (_j = manifest.dependencies) !== null && _j !== void 0 ? _j : {};
                    hasDeps = Object.keys(deps).length > 0;
                    if (!hasDeps) return [3 /*break*/, 30];
                    (_k = logger.info) === null || _k === void 0 ? void 0 : _k.call(logger, "Installing plugin dependencies…");
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["npm", "install", "--omit=dev", "--silent"], {
                            timeoutMs: Math.max(timeoutMs, 300000),
                            cwd: targetDir,
                        })];
                case 26:
                    npmRes = _l.sent();
                    if (!(npmRes.code !== 0)) return [3 /*break*/, 30];
                    if (!backupDir) return [3 /*break*/, 29];
                    return [4 /*yield*/, promises_1.default.rm(targetDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 27:
                    _l.sent();
                    return [4 /*yield*/, promises_1.default.rename(backupDir, targetDir).catch(function () { return undefined; })];
                case 28:
                    _l.sent();
                    _l.label = 29;
                case 29: return [2 /*return*/, {
                        ok: false,
                        error: "npm install failed: ".concat(npmRes.stderr.trim() || npmRes.stdout.trim()),
                    }];
                case 30:
                    if (!backupDir) return [3 /*break*/, 32];
                    return [4 /*yield*/, promises_1.default.rm(backupDir, { recursive: true, force: true }).catch(function () { return undefined; })];
                case 31:
                    _l.sent();
                    _l.label = 32;
                case 32: return [2 /*return*/, {
                        ok: true,
                        pluginId: pluginId,
                        targetDir: targetDir,
                        manifestName: pkgName || undefined,
                        version: typeof manifest.version === "string" ? manifest.version : undefined,
                        extensions: extensions,
                    }];
            }
        });
    });
}
function installPluginFromArchive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, mode, archivePath, tmpDir, extractDir, err_4, packageDir, err_5;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    logger = (_a = params.logger) !== null && _a !== void 0 ? _a : defaultLogger;
                    timeoutMs = (_b = params.timeoutMs) !== null && _b !== void 0 ? _b : 120000;
                    mode = (_c = params.mode) !== null && _c !== void 0 ? _c : "install";
                    archivePath = (0, utils_js_1.resolveUserPath)(params.archivePath);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(archivePath)];
                case 1:
                    if (!(_e.sent())) {
                        return [2 /*return*/, { ok: false, error: "archive not found: ".concat(archivePath) }];
                    }
                    if (!(0, archive_js_1.resolveArchiveKind)(archivePath)) {
                        return [2 /*return*/, { ok: false, error: "unsupported archive: ".concat(archivePath) }];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-plugin-"))];
                case 2:
                    tmpDir = _e.sent();
                    extractDir = node_path_1.default.join(tmpDir, "extract");
                    return [4 /*yield*/, promises_1.default.mkdir(extractDir, { recursive: true })];
                case 3:
                    _e.sent();
                    (_d = logger.info) === null || _d === void 0 ? void 0 : _d.call(logger, "Extracting ".concat(archivePath, "\u2026"));
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, archive_js_1.extractArchive)({
                            archivePath: archivePath,
                            destDir: extractDir,
                            timeoutMs: timeoutMs,
                            logger: logger,
                        })];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_4 = _e.sent();
                    return [2 /*return*/, { ok: false, error: "failed to extract archive: ".concat(String(err_4)) }];
                case 7:
                    packageDir = "";
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, archive_js_1.resolvePackedRootDir)(extractDir)];
                case 9:
                    packageDir = _e.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_5 = _e.sent();
                    return [2 /*return*/, { ok: false, error: String(err_5) }];
                case 11: return [4 /*yield*/, installPluginFromPackageDir({
                        packageDir: packageDir,
                        extensionsDir: params.extensionsDir,
                        timeoutMs: timeoutMs,
                        logger: logger,
                        mode: mode,
                        dryRun: params.dryRun,
                        expectedPluginId: params.expectedPluginId,
                    })];
                case 12: return [2 /*return*/, _e.sent()];
            }
        });
    });
}
function installPluginFromDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var dirPath, stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dirPath = (0, utils_js_1.resolveUserPath)(params.dirPath);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(dirPath)];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, { ok: false, error: "directory not found: ".concat(dirPath) }];
                    }
                    return [4 /*yield*/, promises_1.default.stat(dirPath)];
                case 2:
                    stat = _a.sent();
                    if (!stat.isDirectory()) {
                        return [2 /*return*/, { ok: false, error: "not a directory: ".concat(dirPath) }];
                    }
                    return [4 /*yield*/, installPluginFromPackageDir({
                            packageDir: dirPath,
                            extensionsDir: params.extensionsDir,
                            timeoutMs: params.timeoutMs,
                            logger: params.logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedPluginId: params.expectedPluginId,
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function installPluginFromFile(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, mode, dryRun, filePath, extensionsDir, base, pluginId, pluginIdError, targetFile, _a;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    logger = (_b = params.logger) !== null && _b !== void 0 ? _b : defaultLogger;
                    mode = (_c = params.mode) !== null && _c !== void 0 ? _c : "install";
                    dryRun = (_d = params.dryRun) !== null && _d !== void 0 ? _d : false;
                    filePath = (0, utils_js_1.resolveUserPath)(params.filePath);
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(filePath)];
                case 1:
                    if (!(_f.sent())) {
                        return [2 /*return*/, { ok: false, error: "file not found: ".concat(filePath) }];
                    }
                    extensionsDir = params.extensionsDir
                        ? (0, utils_js_1.resolveUserPath)(params.extensionsDir)
                        : node_path_1.default.join(utils_js_1.CONFIG_DIR, "extensions");
                    return [4 /*yield*/, promises_1.default.mkdir(extensionsDir, { recursive: true })];
                case 2:
                    _f.sent();
                    base = node_path_1.default.basename(filePath, node_path_1.default.extname(filePath));
                    pluginId = base || "plugin";
                    pluginIdError = validatePluginId(pluginId);
                    if (pluginIdError) {
                        return [2 /*return*/, { ok: false, error: pluginIdError }];
                    }
                    targetFile = node_path_1.default.join(extensionsDir, "".concat(safeFileName(pluginId)).concat(node_path_1.default.extname(filePath)));
                    _a = mode === "install";
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, archive_js_1.fileExists)(targetFile)];
                case 3:
                    _a = (_f.sent());
                    _f.label = 4;
                case 4:
                    if (_a) {
                        return [2 /*return*/, { ok: false, error: "plugin already exists: ".concat(targetFile, " (delete it first)") }];
                    }
                    if (dryRun) {
                        return [2 /*return*/, {
                                ok: true,
                                pluginId: pluginId,
                                targetDir: targetFile,
                                manifestName: undefined,
                                version: undefined,
                                extensions: [node_path_1.default.basename(targetFile)],
                            }];
                    }
                    (_e = logger.info) === null || _e === void 0 ? void 0 : _e.call(logger, "Installing to ".concat(targetFile, "\u2026"));
                    return [4 /*yield*/, promises_1.default.copyFile(filePath, targetFile)];
                case 5:
                    _f.sent();
                    return [2 /*return*/, {
                            ok: true,
                            pluginId: pluginId,
                            targetDir: targetFile,
                            manifestName: undefined,
                            version: undefined,
                            extensions: [node_path_1.default.basename(targetFile)],
                        }];
            }
        });
    });
}
function installPluginFromNpmSpec(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, timeoutMs, mode, dryRun, expectedPluginId, spec, tmpDir, res, packed, archivePath;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    logger = (_a = params.logger) !== null && _a !== void 0 ? _a : defaultLogger;
                    timeoutMs = (_b = params.timeoutMs) !== null && _b !== void 0 ? _b : 120000;
                    mode = (_c = params.mode) !== null && _c !== void 0 ? _c : "install";
                    dryRun = (_d = params.dryRun) !== null && _d !== void 0 ? _d : false;
                    expectedPluginId = params.expectedPluginId;
                    spec = params.spec.trim();
                    if (!spec) {
                        return [2 /*return*/, { ok: false, error: "missing npm spec" }];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-npm-pack-"))];
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
                        return [2 /*return*/, {
                                ok: false,
                                error: "npm pack failed: ".concat(res.stderr.trim() || res.stdout.trim()),
                            }];
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
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: params.extensionsDir,
                            timeoutMs: timeoutMs,
                            logger: logger,
                            mode: mode,
                            dryRun: dryRun,
                            expectedPluginId: expectedPluginId,
                        })];
                case 3: return [2 /*return*/, _f.sent()];
            }
        });
    });
}
function installPluginFromPath(params) {
    return __awaiter(this, void 0, void 0, function () {
        var resolved, stat, archiveKind;
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
                    if (!stat.isDirectory()) return [3 /*break*/, 4];
                    return [4 /*yield*/, installPluginFromDir({
                            dirPath: resolved,
                            extensionsDir: params.extensionsDir,
                            timeoutMs: params.timeoutMs,
                            logger: params.logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedPluginId: params.expectedPluginId,
                        })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    archiveKind = (0, archive_js_1.resolveArchiveKind)(resolved);
                    if (!archiveKind) return [3 /*break*/, 6];
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: resolved,
                            extensionsDir: params.extensionsDir,
                            timeoutMs: params.timeoutMs,
                            logger: params.logger,
                            mode: params.mode,
                            dryRun: params.dryRun,
                            expectedPluginId: params.expectedPluginId,
                        })];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [4 /*yield*/, installPluginFromFile({
                        filePath: resolved,
                        extensionsDir: params.extensionsDir,
                        logger: params.logger,
                        mode: params.mode,
                        dryRun: params.dryRun,
                    })];
                case 7: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
