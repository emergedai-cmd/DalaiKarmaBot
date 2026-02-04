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
exports.resolveGlobalRoot = resolveGlobalRoot;
exports.resolveGlobalPackageRoot = resolveGlobalPackageRoot;
exports.detectGlobalInstallManagerForRoot = detectGlobalInstallManagerForRoot;
exports.detectGlobalInstallManagerByPresence = detectGlobalInstallManagerByPresence;
exports.globalInstallArgs = globalInstallArgs;
exports.cleanupGlobalRenameDirs = cleanupGlobalRenameDirs;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var PRIMARY_PACKAGE_NAME = "openclaw";
var ALL_PACKAGE_NAMES = [PRIMARY_PACKAGE_NAME];
var GLOBAL_RENAME_PREFIX = ".";
function pathExists(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(targetPath)];
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
function tryRealpath(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.realpath(targetPath)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, node_path_1.default.resolve(targetPath)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveBunGlobalRoot() {
    var _a;
    var bunInstall = ((_a = process.env.BUN_INSTALL) === null || _a === void 0 ? void 0 : _a.trim()) || node_path_1.default.join(node_os_1.default.homedir(), ".bun");
    return node_path_1.default.join(bunInstall, "install", "global", "node_modules");
}
function resolveGlobalRoot(manager, runCommand, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var argv, res, root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (manager === "bun") {
                        return [2 /*return*/, resolveBunGlobalRoot()];
                    }
                    argv = manager === "pnpm" ? ["pnpm", "root", "-g"] : ["npm", "root", "-g"];
                    return [4 /*yield*/, runCommand(argv, { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 1:
                    res = _a.sent();
                    if (!res || res.code !== 0) {
                        return [2 /*return*/, null];
                    }
                    root = res.stdout.trim();
                    return [2 /*return*/, root || null];
            }
        });
    });
}
function resolveGlobalPackageRoot(manager, runCommand, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveGlobalRoot(manager, runCommand, timeoutMs)];
                case 1:
                    root = _a.sent();
                    if (!root) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, node_path_1.default.join(root, PRIMARY_PACKAGE_NAME)];
            }
        });
    });
}
function detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgReal, candidates, _i, candidates_1, _a, manager, argv, res, globalRoot, globalReal, _b, ALL_PACKAGE_NAMES_1, name_1, expected, bunGlobalRoot, bunGlobalReal, _c, ALL_PACKAGE_NAMES_2, name_2, bunExpected;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, tryRealpath(pkgRoot)];
                case 1:
                    pkgReal = _d.sent();
                    candidates = [
                        { manager: "npm", argv: ["npm", "root", "-g"] },
                        { manager: "pnpm", argv: ["pnpm", "root", "-g"] },
                    ];
                    _i = 0, candidates_1 = candidates;
                    _d.label = 2;
                case 2:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 6];
                    _a = candidates_1[_i], manager = _a.manager, argv = _a.argv;
                    return [4 /*yield*/, runCommand(argv, { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 3:
                    res = _d.sent();
                    if (!res || res.code !== 0) {
                        return [3 /*break*/, 5];
                    }
                    globalRoot = res.stdout.trim();
                    if (!globalRoot) {
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, tryRealpath(globalRoot)];
                case 4:
                    globalReal = _d.sent();
                    for (_b = 0, ALL_PACKAGE_NAMES_1 = ALL_PACKAGE_NAMES; _b < ALL_PACKAGE_NAMES_1.length; _b++) {
                        name_1 = ALL_PACKAGE_NAMES_1[_b];
                        expected = node_path_1.default.join(globalReal, name_1);
                        if (node_path_1.default.resolve(expected) === node_path_1.default.resolve(pkgReal)) {
                            return [2 /*return*/, manager];
                        }
                    }
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    bunGlobalRoot = resolveBunGlobalRoot();
                    return [4 /*yield*/, tryRealpath(bunGlobalRoot)];
                case 7:
                    bunGlobalReal = _d.sent();
                    for (_c = 0, ALL_PACKAGE_NAMES_2 = ALL_PACKAGE_NAMES; _c < ALL_PACKAGE_NAMES_2.length; _c++) {
                        name_2 = ALL_PACKAGE_NAMES_2[_c];
                        bunExpected = node_path_1.default.join(bunGlobalReal, name_2);
                        if (node_path_1.default.resolve(bunExpected) === node_path_1.default.resolve(pkgReal)) {
                            return [2 /*return*/, "bun"];
                        }
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function detectGlobalInstallManagerByPresence(runCommand, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, manager, root, _b, ALL_PACKAGE_NAMES_3, name_3, bunRoot, _c, ALL_PACKAGE_NAMES_4, name_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _i = 0, _a = ["npm", "pnpm"];
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    manager = _a[_i];
                    return [4 /*yield*/, resolveGlobalRoot(manager, runCommand, timeoutMs)];
                case 2:
                    root = _d.sent();
                    if (!root) {
                        return [3 /*break*/, 6];
                    }
                    _b = 0, ALL_PACKAGE_NAMES_3 = ALL_PACKAGE_NAMES;
                    _d.label = 3;
                case 3:
                    if (!(_b < ALL_PACKAGE_NAMES_3.length)) return [3 /*break*/, 6];
                    name_3 = ALL_PACKAGE_NAMES_3[_b];
                    return [4 /*yield*/, pathExists(node_path_1.default.join(root, name_3))];
                case 4:
                    if (_d.sent()) {
                        return [2 /*return*/, manager];
                    }
                    _d.label = 5;
                case 5:
                    _b++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    bunRoot = resolveBunGlobalRoot();
                    _c = 0, ALL_PACKAGE_NAMES_4 = ALL_PACKAGE_NAMES;
                    _d.label = 8;
                case 8:
                    if (!(_c < ALL_PACKAGE_NAMES_4.length)) return [3 /*break*/, 11];
                    name_4 = ALL_PACKAGE_NAMES_4[_c];
                    return [4 /*yield*/, pathExists(node_path_1.default.join(bunRoot, name_4))];
                case 9:
                    if (_d.sent()) {
                        return [2 /*return*/, "bun"];
                    }
                    _d.label = 10;
                case 10:
                    _c++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/, null];
            }
        });
    });
}
function globalInstallArgs(manager, spec) {
    if (manager === "pnpm") {
        return ["pnpm", "add", "-g", spec];
    }
    if (manager === "bun") {
        return ["bun", "add", "-g", spec];
    }
    return ["npm", "i", "-g", spec];
}
function cleanupGlobalRenameDirs(params) {
    return __awaiter(this, void 0, void 0, function () {
        var removed, root, name, prefix, entries, _a, _i, entries_1, entry, target, stat, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    removed = [];
                    root = params.globalRoot.trim();
                    name = params.packageName.trim();
                    if (!root || !name) {
                        return [2 /*return*/, { removed: removed }];
                    }
                    prefix = "".concat(GLOBAL_RENAME_PREFIX).concat(name, "-");
                    entries = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readdir(root)];
                case 2:
                    entries = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/, { removed: removed }];
                case 4:
                    _i = 0, entries_1 = entries;
                    _c.label = 5;
                case 5:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 11];
                    entry = entries_1[_i];
                    if (!entry.startsWith(prefix)) {
                        return [3 /*break*/, 10];
                    }
                    target = node_path_1.default.join(root, entry);
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, promises_1.default.lstat(target)];
                case 7:
                    stat = _c.sent();
                    if (!stat.isDirectory()) {
                        return [3 /*break*/, 10];
                    }
                    return [4 /*yield*/, promises_1.default.rm(target, { recursive: true, force: true })];
                case 8:
                    _c.sent();
                    removed.push(entry);
                    return [3 /*break*/, 10];
                case 9:
                    _b = _c.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11: return [2 /*return*/, { removed: removed }];
            }
        });
    });
}
