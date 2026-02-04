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
exports.resolveArchiveKind = resolveArchiveKind;
exports.resolvePackedRootDir = resolvePackedRootDir;
exports.withTimeout = withTimeout;
exports.extractArchive = extractArchive;
exports.fileExists = fileExists;
exports.readJsonFile = readJsonFile;
var jszip_1 = require("jszip");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var tar = require("tar");
var TAR_SUFFIXES = [".tgz", ".tar.gz", ".tar"];
function resolveArchiveKind(filePath) {
    var lower = filePath.toLowerCase();
    if (lower.endsWith(".zip")) {
        return "zip";
    }
    if (TAR_SUFFIXES.some(function (suffix) { return lower.endsWith(suffix); })) {
        return "tar";
    }
    return null;
}
function resolvePackedRootDir(extractDir) {
    return __awaiter(this, void 0, void 0, function () {
        var direct, stat, _a, entries, dirs, onlyDir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    direct = node_path_1.default.join(extractDir, "package");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.stat(direct)];
                case 2:
                    stat = _b.sent();
                    if (stat.isDirectory()) {
                        return [2 /*return*/, direct];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, promises_1.default.readdir(extractDir, { withFileTypes: true })];
                case 5:
                    entries = _b.sent();
                    dirs = entries.filter(function (entry) { return entry.isDirectory(); }).map(function (entry) { return entry.name; });
                    if (dirs.length !== 1) {
                        throw new Error("unexpected archive layout (dirs: ".concat(dirs.join(", "), ")"));
                    }
                    onlyDir = dirs[0];
                    if (!onlyDir) {
                        throw new Error("unexpected archive layout (no package dir found)");
                    }
                    return [2 /*return*/, node_path_1.default.join(extractDir, onlyDir)];
            }
        });
    });
}
function withTimeout(promise, timeoutMs, label) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    return [4 /*yield*/, Promise.race([
                            promise,
                            new Promise(function (_, reject) {
                                timeoutId = setTimeout(function () { return reject(new Error("".concat(label, " timed out after ").concat(timeoutMs, "ms"))); }, timeoutMs);
                            }),
                        ])];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractZip(params) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, zip, entries, _i, entries_1, entry, entryPath, dirPath, outPath, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.readFile(params.archivePath)];
                case 1:
                    buffer = _a.sent();
                    return [4 /*yield*/, jszip_1.default.loadAsync(buffer)];
                case 2:
                    zip = _a.sent();
                    entries = Object.values(zip.files);
                    _i = 0, entries_1 = entries;
                    _a.label = 3;
                case 3:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 10];
                    entry = entries_1[_i];
                    entryPath = entry.name.replaceAll("\\", "/");
                    if (!(!entryPath || entryPath.endsWith("/"))) return [3 /*break*/, 5];
                    dirPath = node_path_1.default.resolve(params.destDir, entryPath);
                    if (!dirPath.startsWith(params.destDir)) {
                        throw new Error("zip entry escapes destination: ".concat(entry.name));
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(dirPath, { recursive: true })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 5:
                    outPath = node_path_1.default.resolve(params.destDir, entryPath);
                    if (!outPath.startsWith(params.destDir)) {
                        throw new Error("zip entry escapes destination: ".concat(entry.name));
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(outPath), { recursive: true })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, entry.async("nodebuffer")];
                case 7:
                    data = _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(outPath, data)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function extractArchive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var kind, label;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kind = resolveArchiveKind(params.archivePath);
                    if (!kind) {
                        throw new Error("unsupported archive: ".concat(params.archivePath));
                    }
                    label = kind === "zip" ? "extract zip" : "extract tar";
                    if (!(kind === "tar")) return [3 /*break*/, 2];
                    return [4 /*yield*/, withTimeout(tar.x({ file: params.archivePath, cwd: params.destDir }), params.timeoutMs, label)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, withTimeout(extractZip(params), params.timeoutMs, label)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(filePath)];
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
function readJsonFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.readFile(filePath, "utf-8")];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
