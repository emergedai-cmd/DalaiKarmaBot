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
var jszip_1 = require("jszip");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var tar = require("tar");
var vitest_1 = require("vitest");
var archive_js_1 = require("./archive.js");
var tempDirs = [];
function makeTempDir() {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-archive-"))];
                case 1:
                    dir = _a.sent();
                    tempDirs.push(dir);
                    return [2 /*return*/, dir];
            }
        });
    });
}
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, dir, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = tempDirs.splice(0);
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                dir = _a[_i];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
            case 3:
                _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("archive utils", function () {
    (0, vitest_1.it)("detects archive kinds", function () {
        (0, vitest_1.expect)((0, archive_js_1.resolveArchiveKind)("/tmp/file.zip")).toBe("zip");
        (0, vitest_1.expect)((0, archive_js_1.resolveArchiveKind)("/tmp/file.tgz")).toBe("tar");
        (0, vitest_1.expect)((0, archive_js_1.resolveArchiveKind)("/tmp/file.tar.gz")).toBe("tar");
        (0, vitest_1.expect)((0, archive_js_1.resolveArchiveKind)("/tmp/file.tar")).toBe("tar");
        (0, vitest_1.expect)((0, archive_js_1.resolveArchiveKind)("/tmp/file.txt")).toBeNull();
    });
    (0, vitest_1.it)("extracts zip archives", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workDir, archivePath, extractDir, zip, _a, _b, _c, rootDir, content;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, makeTempDir()];
                case 1:
                    workDir = _d.sent();
                    archivePath = node_path_1.default.join(workDir, "bundle.zip");
                    extractDir = node_path_1.default.join(workDir, "extract");
                    zip = new jszip_1.default();
                    zip.file("package/hello.txt", "hi");
                    _b = (_a = promises_1.default).writeFile;
                    _c = [archivePath];
                    return [4 /*yield*/, zip.generateAsync({ type: "nodebuffer" })];
                case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(extractDir, { recursive: true })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, (0, archive_js_1.extractArchive)({ archivePath: archivePath, destDir: extractDir, timeoutMs: 5000 })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, (0, archive_js_1.resolvePackedRootDir)(extractDir)];
                case 6:
                    rootDir = _d.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(rootDir, "hello.txt"), "utf-8")];
                case 7:
                    content = _d.sent();
                    (0, vitest_1.expect)(content).toBe("hi");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("extracts tar archives", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workDir, archivePath, extractDir, packageDir, rootDir, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempDir()];
                case 1:
                    workDir = _a.sent();
                    archivePath = node_path_1.default.join(workDir, "bundle.tar");
                    extractDir = node_path_1.default.join(workDir, "extract");
                    packageDir = node_path_1.default.join(workDir, "package");
                    return [4 /*yield*/, promises_1.default.mkdir(packageDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(packageDir, "hello.txt"), "yo")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tar.c({ cwd: workDir, file: archivePath }, ["package"])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(extractDir, { recursive: true })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, archive_js_1.extractArchive)({ archivePath: archivePath, destDir: extractDir, timeoutMs: 5000 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, archive_js_1.resolvePackedRootDir)(extractDir)];
                case 7:
                    rootDir = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(rootDir, "hello.txt"), "utf-8")];
                case 8:
                    content = _a.sent();
                    (0, vitest_1.expect)(content).toBe("yo");
                    return [2 /*return*/];
            }
        });
    }); });
});
