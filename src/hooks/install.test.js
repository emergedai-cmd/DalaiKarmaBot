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
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var tar = require("tar");
var vitest_1 = require("vitest");
var tempDirs = [];
function makeTempDir() {
    var dir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hook-install-".concat((0, node_crypto_1.randomUUID)()));
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    tempDirs.push(dir);
    return dir;
}
(0, vitest_1.afterEach)(function () {
    for (var _i = 0, _a = tempDirs.splice(0); _i < _a.length; _i++) {
        var dir = _a[_i];
        try {
            node_fs_1.default.rmSync(dir, { recursive: true, force: true });
        }
        catch (_b) {
            // ignore cleanup failures
        }
    }
});
(0, vitest_1.describe)("installHooksFromArchive", function () {
    (0, vitest_1.it)("installs hook packs from zip archives", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, archivePath, zip, buffer, hooksDir, installHooksFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    archivePath = node_path_1.default.join(workDir, "hooks.zip");
                    zip = new jszip_1.default();
                    zip.file("package/package.json", JSON.stringify({
                        name: "@openclaw/zip-hooks",
                        version: "0.0.1",
                        openclaw: { hooks: ["./hooks/zip-hook"] },
                    }));
                    zip.file("package/hooks/zip-hook/HOOK.md", [
                        "---",
                        "name: zip-hook",
                        "description: Zip hook",
                        'metadata: {"openclaw":{"events":["command:new"]}}',
                        "---",
                        "",
                        "# Zip Hook",
                    ].join("\n"));
                    zip.file("package/hooks/zip-hook/handler.ts", "export default async () => {};\n");
                    return [4 /*yield*/, zip.generateAsync({ type: "nodebuffer" })];
                case 1:
                    buffer = _a.sent();
                    node_fs_1.default.writeFileSync(archivePath, buffer);
                    hooksDir = node_path_1.default.join(stateDir, "hooks");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 2:
                    installHooksFromArchive = (_a.sent()).installHooksFromArchive;
                    return [4 /*yield*/, installHooksFromArchive({ archivePath: archivePath, hooksDir: hooksDir })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (!result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.hookPackId).toBe("zip-hooks");
                    (0, vitest_1.expect)(result.hooks).toContain("zip-hook");
                    (0, vitest_1.expect)(result.targetDir).toBe(node_path_1.default.join(stateDir, "hooks", "zip-hooks"));
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "hooks", "zip-hook", "HOOK.md"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("installs hook packs from tar archives", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, archivePath, pkgDir, hooksDir, installHooksFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    archivePath = node_path_1.default.join(workDir, "hooks.tar");
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "hooks", "tar-hook"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@openclaw/tar-hooks",
                        version: "0.0.1",
                        openclaw: { hooks: ["./hooks/tar-hook"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "tar-hook", "HOOK.md"), [
                        "---",
                        "name: tar-hook",
                        "description: Tar hook",
                        'metadata: {"openclaw":{"events":["command:new"]}}',
                        "---",
                        "",
                        "# Tar Hook",
                    ].join("\n"), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "tar-hook", "handler.ts"), "export default async () => {};\n", "utf-8");
                    return [4 /*yield*/, tar.c({ cwd: workDir, file: archivePath }, ["package"])];
                case 1:
                    _a.sent();
                    hooksDir = node_path_1.default.join(stateDir, "hooks");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 2:
                    installHooksFromArchive = (_a.sent()).installHooksFromArchive;
                    return [4 /*yield*/, installHooksFromArchive({ archivePath: archivePath, hooksDir: hooksDir })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (!result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.hookPackId).toBe("tar-hooks");
                    (0, vitest_1.expect)(result.hooks).toContain("tar-hook");
                    (0, vitest_1.expect)(result.targetDir).toBe(node_path_1.default.join(stateDir, "hooks", "tar-hooks"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects hook packs with traversal-like ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, archivePath, pkgDir, hooksDir, installHooksFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    archivePath = node_path_1.default.join(workDir, "hooks.tar");
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "hooks", "evil-hook"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@evil/..",
                        version: "0.0.1",
                        openclaw: { hooks: ["./hooks/evil-hook"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "evil-hook", "HOOK.md"), [
                        "---",
                        "name: evil-hook",
                        "description: Evil hook",
                        'metadata: {"openclaw":{"events":["command:new"]}}',
                        "---",
                        "",
                        "# Evil Hook",
                    ].join("\n"), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "evil-hook", "handler.ts"), "export default async () => {};\n", "utf-8");
                    return [4 /*yield*/, tar.c({ cwd: workDir, file: archivePath }, ["package"])];
                case 1:
                    _a.sent();
                    hooksDir = node_path_1.default.join(stateDir, "hooks");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 2:
                    installHooksFromArchive = (_a.sent()).installHooksFromArchive;
                    return [4 /*yield*/, installHooksFromArchive({ archivePath: archivePath, hooksDir: hooksDir })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.error).toContain("reserved path segment");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects hook packs with reserved ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, archivePath, pkgDir, hooksDir, installHooksFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    archivePath = node_path_1.default.join(workDir, "hooks.tar");
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "hooks", "reserved-hook"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@evil/.",
                        version: "0.0.1",
                        openclaw: { hooks: ["./hooks/reserved-hook"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "reserved-hook", "HOOK.md"), [
                        "---",
                        "name: reserved-hook",
                        "description: Reserved hook",
                        'metadata: {"openclaw":{"events":["command:new"]}}',
                        "---",
                        "",
                        "# Reserved Hook",
                    ].join("\n"), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "hooks", "reserved-hook", "handler.ts"), "export default async () => {};\n", "utf-8");
                    return [4 /*yield*/, tar.c({ cwd: workDir, file: archivePath }, ["package"])];
                case 1:
                    _a.sent();
                    hooksDir = node_path_1.default.join(stateDir, "hooks");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 2:
                    installHooksFromArchive = (_a.sent()).installHooksFromArchive;
                    return [4 /*yield*/, installHooksFromArchive({ archivePath: archivePath, hooksDir: hooksDir })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.error).toContain("reserved path segment");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("installHooksFromPath", function () {
    (0, vitest_1.it)("installs a single hook directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, hookDir, hooksDir, installHooksFromPath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    hookDir = node_path_1.default.join(workDir, "my-hook");
                    node_fs_1.default.mkdirSync(hookDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(hookDir, "HOOK.md"), [
                        "---",
                        "name: my-hook",
                        "description: My hook",
                        'metadata: {"openclaw":{"events":["command:new"]}}',
                        "---",
                        "",
                        "# My Hook",
                    ].join("\n"), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(hookDir, "handler.ts"), "export default async () => {};\n");
                    hooksDir = node_path_1.default.join(stateDir, "hooks");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installHooksFromPath = (_a.sent()).installHooksFromPath;
                    return [4 /*yield*/, installHooksFromPath({ path: hookDir, hooksDir: hooksDir })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (!result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.hookPackId).toBe("my-hook");
                    (0, vitest_1.expect)(result.hooks).toEqual(["my-hook"]);
                    (0, vitest_1.expect)(result.targetDir).toBe(node_path_1.default.join(stateDir, "hooks", "my-hook"));
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "HOOK.md"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
