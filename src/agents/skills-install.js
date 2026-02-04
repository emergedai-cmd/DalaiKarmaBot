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
exports.installSkill = installSkill;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_stream_1 = require("node:stream");
var promises_1 = require("node:stream/promises");
var brew_js_1 = require("../infra/brew.js");
var fetch_guard_js_1 = require("../infra/net/fetch-guard.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
var skills_js_1 = require("./skills.js");
var frontmatter_js_1 = require("./skills/frontmatter.js");
function isNodeReadableStream(value) {
    return Boolean(value && typeof value.pipe === "function");
}
function summarizeInstallOutput(text) {
    var _a, _b;
    var raw = text.trim();
    if (!raw) {
        return undefined;
    }
    var lines = raw
        .split("\n")
        .map(function (line) { return line.trim(); })
        .filter(Boolean);
    if (lines.length === 0) {
        return undefined;
    }
    var preferred = (_b = (_a = lines.find(function (line) { return /^error\b/i.test(line); })) !== null && _a !== void 0 ? _a : lines.find(function (line) { return /\b(err!|error:|failed)\b/i.test(line); })) !== null && _b !== void 0 ? _b : lines.at(-1);
    if (!preferred) {
        return undefined;
    }
    var normalized = preferred.replace(/\s+/g, " ").trim();
    var maxLen = 200;
    return normalized.length > maxLen ? "".concat(normalized.slice(0, maxLen - 1), "\u2026") : normalized;
}
function formatInstallFailureMessage(result) {
    var _a;
    var code = typeof result.code === "number" ? "exit ".concat(result.code) : "unknown exit";
    var summary = (_a = summarizeInstallOutput(result.stderr)) !== null && _a !== void 0 ? _a : summarizeInstallOutput(result.stdout);
    if (!summary) {
        return "Install failed (".concat(code, ")");
    }
    return "Install failed (".concat(code, "): ").concat(summary);
}
function resolveInstallId(spec, index) {
    var _a;
    return ((_a = spec.id) !== null && _a !== void 0 ? _a : "".concat(spec.kind, "-").concat(index)).trim();
}
function findInstallSpec(entry, installId) {
    var _a, _b;
    var specs = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.install) !== null && _b !== void 0 ? _b : [];
    for (var _i = 0, _c = specs.entries(); _i < _c.length; _i++) {
        var _d = _c[_i], index = _d[0], spec = _d[1];
        if (resolveInstallId(spec, index) === installId) {
            return spec;
        }
    }
    return undefined;
}
function buildNodeInstallCommand(packageName, prefs) {
    switch (prefs.nodeManager) {
        case "pnpm":
            return ["pnpm", "add", "-g", packageName];
        case "yarn":
            return ["yarn", "global", "add", packageName];
        case "bun":
            return ["bun", "add", "-g", packageName];
        default:
            return ["npm", "install", "-g", packageName];
    }
}
function buildInstallCommand(spec, prefs) {
    switch (spec.kind) {
        case "brew": {
            if (!spec.formula) {
                return { argv: null, error: "missing brew formula" };
            }
            return { argv: ["brew", "install", spec.formula] };
        }
        case "node": {
            if (!spec.package) {
                return { argv: null, error: "missing node package" };
            }
            return {
                argv: buildNodeInstallCommand(spec.package, prefs),
            };
        }
        case "go": {
            if (!spec.module) {
                return { argv: null, error: "missing go module" };
            }
            return { argv: ["go", "install", spec.module] };
        }
        case "uv": {
            if (!spec.package) {
                return { argv: null, error: "missing uv package" };
            }
            return { argv: ["uv", "tool", "install", spec.package] };
        }
        case "download": {
            return { argv: null, error: "download install handled separately" };
        }
        default:
            return { argv: null, error: "unsupported installer" };
    }
}
function resolveDownloadTargetDir(entry, spec) {
    var _a;
    if ((_a = spec.targetDir) === null || _a === void 0 ? void 0 : _a.trim()) {
        return (0, utils_js_1.resolveUserPath)(spec.targetDir);
    }
    var key = (0, frontmatter_js_1.resolveSkillKey)(entry.skill, entry);
    return node_path_1.default.join(utils_js_1.CONFIG_DIR, "tools", key);
}
function resolveArchiveType(spec, filename) {
    var _a;
    var explicit = (_a = spec.archive) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    if (explicit) {
        return explicit;
    }
    var lower = filename.toLowerCase();
    if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
        return "tar.gz";
    }
    if (lower.endsWith(".tar.bz2") || lower.endsWith(".tbz2")) {
        return "tar.bz2";
    }
    if (lower.endsWith(".zip")) {
        return "zip";
    }
    return undefined;
}
function downloadFile(url, destPath, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, response, release, file, body, readable, stat;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fetch_guard_js_1.fetchWithSsrFGuard)({
                        url: url,
                        timeoutMs: Math.max(1000, timeoutMs),
                    })];
                case 1:
                    _a = _b.sent(), response = _a.response, release = _a.release;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    if (!response.ok || !response.body) {
                        throw new Error("Download failed (".concat(response.status, " ").concat(response.statusText, ")"));
                    }
                    return [4 /*yield*/, (0, utils_js_1.ensureDir)(node_path_1.default.dirname(destPath))];
                case 3:
                    _b.sent();
                    file = node_fs_1.default.createWriteStream(destPath);
                    body = response.body;
                    readable = isNodeReadableStream(body)
                        ? body
                        : node_stream_1.Readable.fromWeb(body);
                    return [4 /*yield*/, (0, promises_1.pipeline)(readable, file)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, node_fs_1.default.promises.stat(destPath)];
                case 5:
                    stat = _b.sent();
                    return [2 /*return*/, { bytes: stat.size }];
                case 6: return [4 /*yield*/, release()];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function extractArchive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var archivePath, archiveType, targetDir, stripComponents, timeoutMs, argv_1, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    archivePath = params.archivePath, archiveType = params.archiveType, targetDir = params.targetDir, stripComponents = params.stripComponents, timeoutMs = params.timeoutMs;
                    if (!(archiveType === "zip")) return [3 /*break*/, 2];
                    if (!(0, skills_js_1.hasBinary)("unzip")) {
                        return [2 /*return*/, { stdout: "", stderr: "unzip not found on PATH", code: null }];
                    }
                    argv_1 = ["unzip", "-q", archivePath, "-d", targetDir];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv_1, { timeoutMs: timeoutMs })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(0, skills_js_1.hasBinary)("tar")) {
                        return [2 /*return*/, { stdout: "", stderr: "tar not found on PATH", code: null }];
                    }
                    argv = ["tar", "xf", archivePath, "-C", targetDir];
                    if (typeof stripComponents === "number" && Number.isFinite(stripComponents)) {
                        argv.push("--strip-components", String(Math.max(0, Math.floor(stripComponents))));
                    }
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, { timeoutMs: timeoutMs })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function installDownloadSpec(params) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, spec, timeoutMs, url, filename, parsed, targetDir, archivePath, downloaded, result, err_1, message, archiveType, shouldExtract, extractResult, success;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    entry = params.entry, spec = params.spec, timeoutMs = params.timeoutMs;
                    url = (_a = spec.url) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!url) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "missing download url",
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    filename = "";
                    try {
                        parsed = new URL(url);
                        filename = node_path_1.default.basename(parsed.pathname);
                    }
                    catch (_d) {
                        filename = node_path_1.default.basename(url);
                    }
                    if (!filename) {
                        filename = "download";
                    }
                    targetDir = resolveDownloadTargetDir(entry, spec);
                    return [4 /*yield*/, (0, utils_js_1.ensureDir)(targetDir)];
                case 1:
                    _c.sent();
                    archivePath = node_path_1.default.join(targetDir, filename);
                    downloaded = 0;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, downloadFile(url, archivePath, timeoutMs)];
                case 3:
                    result = _c.sent();
                    downloaded = result.bytes;
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    message = err_1 instanceof Error ? err_1.message : String(err_1);
                    return [2 /*return*/, { ok: false, message: message, stdout: "", stderr: message, code: null }];
                case 5:
                    archiveType = resolveArchiveType(spec, filename);
                    shouldExtract = (_b = spec.extract) !== null && _b !== void 0 ? _b : Boolean(archiveType);
                    if (!shouldExtract) {
                        return [2 /*return*/, {
                                ok: true,
                                message: "Downloaded to ".concat(archivePath),
                                stdout: "downloaded=".concat(downloaded),
                                stderr: "",
                                code: 0,
                            }];
                    }
                    if (!archiveType) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "extract requested but archive type could not be detected",
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    return [4 /*yield*/, extractArchive({
                            archivePath: archivePath,
                            archiveType: archiveType,
                            targetDir: targetDir,
                            stripComponents: spec.stripComponents,
                            timeoutMs: timeoutMs,
                        })];
                case 6:
                    extractResult = _c.sent();
                    success = extractResult.code === 0;
                    return [2 /*return*/, {
                            ok: success,
                            message: success
                                ? "Downloaded and extracted to ".concat(targetDir)
                                : formatInstallFailureMessage(extractResult),
                            stdout: extractResult.stdout.trim(),
                            stderr: extractResult.stderr.trim(),
                            code: extractResult.code,
                        }];
            }
        });
    });
}
function resolveBrewBinDir(timeoutMs, brewExe) {
    return __awaiter(this, void 0, void 0, function () {
        var exe, prefixResult, prefix, envPrefix, _i, _a, candidate;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    exe = brewExe !== null && brewExe !== void 0 ? brewExe : ((0, skills_js_1.hasBinary)("brew") ? "brew" : (0, brew_js_1.resolveBrewExecutable)());
                    if (!exe) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([exe, "--prefix"], {
                            timeoutMs: Math.min(timeoutMs, 30000),
                        })];
                case 1:
                    prefixResult = _c.sent();
                    if (prefixResult.code === 0) {
                        prefix = prefixResult.stdout.trim();
                        if (prefix) {
                            return [2 /*return*/, node_path_1.default.join(prefix, "bin")];
                        }
                    }
                    envPrefix = (_b = process.env.HOMEBREW_PREFIX) === null || _b === void 0 ? void 0 : _b.trim();
                    if (envPrefix) {
                        return [2 /*return*/, node_path_1.default.join(envPrefix, "bin")];
                    }
                    for (_i = 0, _a = ["/opt/homebrew/bin", "/usr/local/bin"]; _i < _a.length; _i++) {
                        candidate = _a[_i];
                        try {
                            if (node_fs_1.default.existsSync(candidate)) {
                                return [2 /*return*/, candidate];
                            }
                        }
                        catch (_d) {
                            // ignore
                        }
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
function installSkill(params) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, workspaceDir, entries, entry, spec, prefs, command, brewExe, brewResult, brewResult, env, brewBin, result, success;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeoutMs = Math.min(Math.max((_a = params.timeoutMs) !== null && _a !== void 0 ? _a : 300000, 1000), 900000);
                    workspaceDir = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
                    entries = (0, skills_js_1.loadWorkspaceSkillEntries)(workspaceDir);
                    entry = entries.find(function (item) { return item.skill.name === params.skillName; });
                    if (!entry) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "Skill not found: ".concat(params.skillName),
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    spec = findInstallSpec(entry, params.installId);
                    if (!spec) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "Installer not found: ".concat(params.installId),
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    if (!(spec.kind === "download")) return [3 /*break*/, 2];
                    return [4 /*yield*/, installDownloadSpec({ entry: entry, spec: spec, timeoutMs: timeoutMs })];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    prefs = (0, skills_js_1.resolveSkillsInstallPreferences)(params.config);
                    command = buildInstallCommand(spec, prefs);
                    if (command.error) {
                        return [2 /*return*/, {
                                ok: false,
                                message: command.error,
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    brewExe = (0, skills_js_1.hasBinary)("brew") ? "brew" : (0, brew_js_1.resolveBrewExecutable)();
                    if (spec.kind === "brew" && !brewExe) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "brew not installed",
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    if (!(spec.kind === "uv" && !(0, skills_js_1.hasBinary)("uv"))) return [3 /*break*/, 5];
                    if (!brewExe) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([brewExe, "install", "uv"], {
                            timeoutMs: timeoutMs,
                        })];
                case 3:
                    brewResult = _b.sent();
                    if (brewResult.code !== 0) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "Failed to install uv (brew)",
                                stdout: brewResult.stdout.trim(),
                                stderr: brewResult.stderr.trim(),
                                code: brewResult.code,
                            }];
                    }
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, {
                        ok: false,
                        message: "uv not installed (install via brew)",
                        stdout: "",
                        stderr: "",
                        code: null,
                    }];
                case 5:
                    if (!command.argv || command.argv.length === 0) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "invalid install command",
                                stdout: "",
                                stderr: "",
                                code: null,
                            }];
                    }
                    if (spec.kind === "brew" && brewExe && command.argv[0] === "brew") {
                        command.argv[0] = brewExe;
                    }
                    if (!(spec.kind === "go" && !(0, skills_js_1.hasBinary)("go"))) return [3 /*break*/, 8];
                    if (!brewExe) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([brewExe, "install", "go"], {
                            timeoutMs: timeoutMs,
                        })];
                case 6:
                    brewResult = _b.sent();
                    if (brewResult.code !== 0) {
                        return [2 /*return*/, {
                                ok: false,
                                message: "Failed to install go (brew)",
                                stdout: brewResult.stdout.trim(),
                                stderr: brewResult.stderr.trim(),
                                code: brewResult.code,
                            }];
                    }
                    return [3 /*break*/, 8];
                case 7: return [2 /*return*/, {
                        ok: false,
                        message: "go not installed (install via brew)",
                        stdout: "",
                        stderr: "",
                        code: null,
                    }];
                case 8:
                    if (!(spec.kind === "go" && brewExe)) return [3 /*break*/, 10];
                    return [4 /*yield*/, resolveBrewBinDir(timeoutMs, brewExe)];
                case 9:
                    brewBin = _b.sent();
                    if (brewBin) {
                        env = { GOBIN: brewBin };
                    }
                    _b.label = 10;
                case 10: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                        var argv, err_2, stderr;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    argv = command.argv;
                                    if (!argv || argv.length === 0) {
                                        return [2 /*return*/, { code: null, stdout: "", stderr: "invalid install command" }];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, {
                                            timeoutMs: timeoutMs,
                                            env: env,
                                        })];
                                case 2: return [2 /*return*/, _a.sent()];
                                case 3:
                                    err_2 = _a.sent();
                                    stderr = err_2 instanceof Error ? err_2.message : String(err_2);
                                    return [2 /*return*/, { code: null, stdout: "", stderr: stderr }];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })()];
                case 11:
                    result = _b.sent();
                    success = result.code === 0;
                    return [2 /*return*/, {
                            ok: success,
                            message: success ? "Installed" : formatInstallFailureMessage(result),
                            stdout: result.stdout.trim(),
                            stderr: result.stderr.trim(),
                            code: result.code,
                        }];
            }
        });
    });
}
