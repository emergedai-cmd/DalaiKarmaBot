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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var path_env_js_1 = require("./path-env.js");
(0, vitest_1.describe)("ensureOpenClawCliOnPath", function () {
    (0, vitest_1.it)("prepends the bundled app bin dir when a sibling openclaw exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, appBinDir, cliPath, originalPath, originalFlag, updated;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-path-"))];
                case 1:
                    tmp = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    appBinDir = node_path_1.default.join(tmp, "AppBin");
                    return [4 /*yield*/, promises_1.default.mkdir(appBinDir, { recursive: true })];
                case 3:
                    _b.sent();
                    cliPath = node_path_1.default.join(appBinDir, "openclaw");
                    return [4 /*yield*/, promises_1.default.writeFile(cliPath, "#!/bin/sh\necho ok\n", "utf-8")];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.chmod(cliPath, 493)];
                case 5:
                    _b.sent();
                    originalPath = process.env.PATH;
                    originalFlag = process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    process.env.PATH = "/usr/bin";
                    delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    try {
                        (0, path_env_js_1.ensureOpenClawCliOnPath)({
                            execPath: cliPath,
                            cwd: tmp,
                            homeDir: tmp,
                            platform: "darwin",
                        });
                        updated = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
                        (0, vitest_1.expect)(updated.split(node_path_1.default.delimiter)[0]).toBe(appBinDir);
                    }
                    finally {
                        process.env.PATH = originalPath;
                        if (originalFlag === undefined) {
                            delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                        }
                        else {
                            process.env.OPENCLAW_PATH_BOOTSTRAPPED = originalFlag;
                        }
                    }
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmp, { recursive: true, force: true })];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("is idempotent", function () {
        var originalPath = process.env.PATH;
        var originalFlag = process.env.OPENCLAW_PATH_BOOTSTRAPPED;
        process.env.PATH = "/bin";
        process.env.OPENCLAW_PATH_BOOTSTRAPPED = "1";
        try {
            (0, path_env_js_1.ensureOpenClawCliOnPath)({
                execPath: "/tmp/does-not-matter",
                cwd: "/tmp",
                homeDir: "/tmp",
                platform: "darwin",
            });
            (0, vitest_1.expect)(process.env.PATH).toBe("/bin");
        }
        finally {
            process.env.PATH = originalPath;
            if (originalFlag === undefined) {
                delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
            }
            else {
                process.env.OPENCLAW_PATH_BOOTSTRAPPED = originalFlag;
            }
        }
    });
    (0, vitest_1.it)("prepends mise shims when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, originalPath, originalFlag, originalMiseDataDir, appBinDir, appCli, localBinDir, localCli, miseDataDir, shimsDir, updated, parts, appBinIndex, localIndex, shimsIndex;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-path-"))];
                case 1:
                    tmp = _b.sent();
                    originalPath = process.env.PATH;
                    originalFlag = process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    originalMiseDataDir = process.env.MISE_DATA_DIR;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 10, 12]);
                    appBinDir = node_path_1.default.join(tmp, "AppBin");
                    return [4 /*yield*/, promises_1.default.mkdir(appBinDir, { recursive: true })];
                case 3:
                    _b.sent();
                    appCli = node_path_1.default.join(appBinDir, "openclaw");
                    return [4 /*yield*/, promises_1.default.writeFile(appCli, "#!/bin/sh\necho ok\n", "utf-8")];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.chmod(appCli, 493)];
                case 5:
                    _b.sent();
                    localBinDir = node_path_1.default.join(tmp, "node_modules", ".bin");
                    return [4 /*yield*/, promises_1.default.mkdir(localBinDir, { recursive: true })];
                case 6:
                    _b.sent();
                    localCli = node_path_1.default.join(localBinDir, "openclaw");
                    return [4 /*yield*/, promises_1.default.writeFile(localCli, "#!/bin/sh\necho ok\n", "utf-8")];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.chmod(localCli, 493)];
                case 8:
                    _b.sent();
                    miseDataDir = node_path_1.default.join(tmp, "mise");
                    shimsDir = node_path_1.default.join(miseDataDir, "shims");
                    return [4 /*yield*/, promises_1.default.mkdir(shimsDir, { recursive: true })];
                case 9:
                    _b.sent();
                    process.env.MISE_DATA_DIR = miseDataDir;
                    process.env.PATH = "/usr/bin";
                    delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    (0, path_env_js_1.ensureOpenClawCliOnPath)({
                        execPath: appCli,
                        cwd: tmp,
                        homeDir: tmp,
                        platform: "darwin",
                    });
                    updated = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
                    parts = updated.split(node_path_1.default.delimiter);
                    appBinIndex = parts.indexOf(appBinDir);
                    localIndex = parts.indexOf(localBinDir);
                    shimsIndex = parts.indexOf(shimsDir);
                    (0, vitest_1.expect)(appBinIndex).toBeGreaterThanOrEqual(0);
                    (0, vitest_1.expect)(localIndex).toBeGreaterThan(appBinIndex);
                    (0, vitest_1.expect)(shimsIndex).toBeGreaterThan(localIndex);
                    return [3 /*break*/, 12];
                case 10:
                    process.env.PATH = originalPath;
                    if (originalFlag === undefined) {
                        delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    }
                    else {
                        process.env.OPENCLAW_PATH_BOOTSTRAPPED = originalFlag;
                    }
                    if (originalMiseDataDir === undefined) {
                        delete process.env.MISE_DATA_DIR;
                    }
                    else {
                        process.env.MISE_DATA_DIR = originalMiseDataDir;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmp, { recursive: true, force: true })];
                case 11:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prepends Linuxbrew dirs when present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, originalPath, originalFlag, originalHomebrewPrefix, originalHomebrewBrewFile, originalXdgBinHome, execDir, linuxbrewBin, linuxbrewSbin, updated, parts;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-path-"))];
                case 1:
                    tmp = _b.sent();
                    originalPath = process.env.PATH;
                    originalFlag = process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    originalHomebrewPrefix = process.env.HOMEBREW_PREFIX;
                    originalHomebrewBrewFile = process.env.HOMEBREW_BREW_FILE;
                    originalXdgBinHome = process.env.XDG_BIN_HOME;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    execDir = node_path_1.default.join(tmp, "exec");
                    return [4 /*yield*/, promises_1.default.mkdir(execDir, { recursive: true })];
                case 3:
                    _b.sent();
                    linuxbrewBin = node_path_1.default.join(tmp, ".linuxbrew", "bin");
                    linuxbrewSbin = node_path_1.default.join(tmp, ".linuxbrew", "sbin");
                    return [4 /*yield*/, promises_1.default.mkdir(linuxbrewBin, { recursive: true })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(linuxbrewSbin, { recursive: true })];
                case 5:
                    _b.sent();
                    process.env.PATH = "/usr/bin";
                    delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    delete process.env.HOMEBREW_PREFIX;
                    delete process.env.HOMEBREW_BREW_FILE;
                    delete process.env.XDG_BIN_HOME;
                    (0, path_env_js_1.ensureOpenClawCliOnPath)({
                        execPath: node_path_1.default.join(execDir, "node"),
                        cwd: tmp,
                        homeDir: tmp,
                        platform: "linux",
                    });
                    updated = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
                    parts = updated.split(node_path_1.default.delimiter);
                    (0, vitest_1.expect)(parts[0]).toBe(linuxbrewBin);
                    (0, vitest_1.expect)(parts[1]).toBe(linuxbrewSbin);
                    return [3 /*break*/, 8];
                case 6:
                    process.env.PATH = originalPath;
                    if (originalFlag === undefined) {
                        delete process.env.OPENCLAW_PATH_BOOTSTRAPPED;
                    }
                    else {
                        process.env.OPENCLAW_PATH_BOOTSTRAPPED = originalFlag;
                    }
                    if (originalHomebrewPrefix === undefined) {
                        delete process.env.HOMEBREW_PREFIX;
                    }
                    else {
                        process.env.HOMEBREW_PREFIX = originalHomebrewPrefix;
                    }
                    if (originalHomebrewBrewFile === undefined) {
                        delete process.env.HOMEBREW_BREW_FILE;
                    }
                    else {
                        process.env.HOMEBREW_BREW_FILE = originalHomebrewBrewFile;
                    }
                    if (originalXdgBinHome === undefined) {
                        delete process.env.XDG_BIN_HOME;
                    }
                    else {
                        process.env.XDG_BIN_HOME = originalXdgBinHome;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmp, { recursive: true, force: true })];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
