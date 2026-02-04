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
var internal_js_1 = require("./internal.js");
(0, vitest_1.describe)("normalizeExtraMemoryPaths", function () {
    (0, vitest_1.it)("trims, resolves, and dedupes paths", function () {
        var workspaceDir = node_path_1.default.join(node_os_1.default.tmpdir(), "memory-test-workspace");
        var absPath = node_path_1.default.resolve(node_path_1.default.sep, "shared-notes");
        var result = (0, internal_js_1.normalizeExtraMemoryPaths)(workspaceDir, [
            " notes ",
            "./notes",
            absPath,
            absPath,
            "",
        ]);
        (0, vitest_1.expect)(result).toEqual([node_path_1.default.resolve(workspaceDir, "notes"), absPath]);
    });
});
(0, vitest_1.describe)("listMemoryFiles", function () {
    var tmpDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "memory-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes files from additional paths (directory)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var extraDir, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tmpDir, "MEMORY.md"), "# Default memory")];
                case 1:
                    _a.sent();
                    extraDir = node_path_1.default.join(tmpDir, "extra-notes");
                    return [4 /*yield*/, promises_1.default.mkdir(extraDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "note1.md"), "# Note 1")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "note2.md"), "# Note 2")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "ignore.txt"), "Not a markdown file")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_js_1.listMemoryFiles)(tmpDir, [extraDir])];
                case 6:
                    files = _a.sent();
                    (0, vitest_1.expect)(files).toHaveLength(3);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("MEMORY.md"); })).toBe(true);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("note1.md"); })).toBe(true);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("note2.md"); })).toBe(true);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("ignore.txt"); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes files from additional paths (single file)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var singleFile, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tmpDir, "MEMORY.md"), "# Default memory")];
                case 1:
                    _a.sent();
                    singleFile = node_path_1.default.join(tmpDir, "standalone.md");
                    return [4 /*yield*/, promises_1.default.writeFile(singleFile, "# Standalone")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_js_1.listMemoryFiles)(tmpDir, [singleFile])];
                case 3:
                    files = _a.sent();
                    (0, vitest_1.expect)(files).toHaveLength(2);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("standalone.md"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles relative paths in additional paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var extraDir, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tmpDir, "MEMORY.md"), "# Default memory")];
                case 1:
                    _a.sent();
                    extraDir = node_path_1.default.join(tmpDir, "subdir");
                    return [4 /*yield*/, promises_1.default.mkdir(extraDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "nested.md"), "# Nested")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_js_1.listMemoryFiles)(tmpDir, ["subdir"])];
                case 4:
                    files = _a.sent();
                    (0, vitest_1.expect)(files).toHaveLength(2);
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("nested.md"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores non-existent additional paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tmpDir, "MEMORY.md"), "# Default memory")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_js_1.listMemoryFiles)(tmpDir, ["/does/not/exist"])];
                case 2:
                    files = _a.sent();
                    (0, vitest_1.expect)(files).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores symlinked files and directories", function () { return __awaiter(void 0, void 0, void 0, function () {
        var extraDir, targetFile, linkFile, targetDir, linkDir, symlinksOk, err_1, code, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tmpDir, "MEMORY.md"), "# Default memory")];
                case 1:
                    _a.sent();
                    extraDir = node_path_1.default.join(tmpDir, "extra");
                    return [4 /*yield*/, promises_1.default.mkdir(extraDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "note.md"), "# Note")];
                case 3:
                    _a.sent();
                    targetFile = node_path_1.default.join(tmpDir, "target.md");
                    return [4 /*yield*/, promises_1.default.writeFile(targetFile, "# Target")];
                case 4:
                    _a.sent();
                    linkFile = node_path_1.default.join(extraDir, "linked.md");
                    targetDir = node_path_1.default.join(tmpDir, "target-dir");
                    return [4 /*yield*/, promises_1.default.mkdir(targetDir, { recursive: true })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(targetDir, "nested.md"), "# Nested")];
                case 6:
                    _a.sent();
                    linkDir = node_path_1.default.join(tmpDir, "linked-dir");
                    symlinksOk = true;
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, promises_1.default.symlink(targetFile, linkFile, "file")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.symlink(targetDir, linkDir, "dir")];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _a.sent();
                    code = err_1.code;
                    if (code === "EPERM" || code === "EACCES") {
                        symlinksOk = false;
                    }
                    else {
                        throw err_1;
                    }
                    return [3 /*break*/, 11];
                case 11: return [4 /*yield*/, (0, internal_js_1.listMemoryFiles)(tmpDir, [extraDir, linkDir])];
                case 12:
                    files = _a.sent();
                    (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("note.md"); })).toBe(true);
                    if (symlinksOk) {
                        (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("linked.md"); })).toBe(false);
                        (0, vitest_1.expect)(files.some(function (file) { return file.endsWith("nested.md"); })).toBe(false);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("chunkMarkdown", function () {
    (0, vitest_1.it)("splits overly long lines into max-sized chunks", function () {
        var chunkTokens = 400;
        var maxChars = chunkTokens * 4;
        var content = "a".repeat(maxChars * 3 + 25);
        var chunks = (0, internal_js_1.chunkMarkdown)(content, { tokens: chunkTokens, overlap: 0 });
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            (0, vitest_1.expect)(chunk.text.length).toBeLessThanOrEqual(maxChars);
        }
    });
});
