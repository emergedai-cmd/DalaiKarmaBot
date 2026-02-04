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
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var tempDirs = [];
function makeTempDir() {
    var dir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-plugin-install-".concat((0, node_crypto_1.randomUUID)()));
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    tempDirs.push(dir);
    return dir;
}
function resolveNpmCliJs() {
    var fromEnv = process.env.npm_execpath;
    if ((fromEnv === null || fromEnv === void 0 ? void 0 : fromEnv.includes("".concat(node_path_1.default.sep, "npm").concat(node_path_1.default.sep))) && (fromEnv === null || fromEnv === void 0 ? void 0 : fromEnv.endsWith("npm-cli.js"))) {
        return fromEnv !== null && fromEnv !== void 0 ? fromEnv : null;
    }
    var fromNodeDir = node_path_1.default.join(node_path_1.default.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
    if (node_fs_1.default.existsSync(fromNodeDir)) {
        return fromNodeDir;
    }
    var fromLibNodeModules = node_path_1.default.resolve(node_path_1.default.dirname(process.execPath), "..", "lib", "node_modules", "npm", "bin", "npm-cli.js");
    if (node_fs_1.default.existsSync(fromLibNodeModules)) {
        return fromLibNodeModules;
    }
    return null;
}
function packToArchive(_a) {
    var pkgDir = _a.pkgDir, outDir = _a.outDir, outName = _a.outName;
    var npmCli = resolveNpmCliJs();
    var cmd = npmCli ? process.execPath : "npm";
    var args = npmCli
        ? [npmCli, "pack", "--silent", "--pack-destination", outDir, pkgDir]
        : ["pack", "--silent", "--pack-destination", outDir, pkgDir];
    var res = (0, node_child_process_1.spawnSync)(cmd, args, { encoding: "utf-8" });
    (0, vitest_1.expect)(res.status).toBe(0);
    if (res.status !== 0) {
        throw new Error("npm pack failed: ".concat(res.stderr || res.stdout || "<no output>"));
    }
    var packed = (res.stdout || "").trim().split(/\r?\n/).filter(Boolean).at(-1);
    if (!packed) {
        throw new Error("npm pack did not output a filename: ".concat(res.stdout || "<no stdout>"));
    }
    var src = node_path_1.default.join(outDir, packed);
    var dest = node_path_1.default.join(outDir, outName);
    node_fs_1.default.rmSync(dest, { force: true });
    node_fs_1.default.renameSync(src, dest);
    return dest;
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
(0, vitest_1.describe)("installPluginFromArchive", function () {
    (0, vitest_1.it)("installs into ~/.openclaw/extensions and uses unscoped id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archivePath, extensionsDir, installPluginFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "dist"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@openclaw/voice-call",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "dist", "index.js"), "export {};", "utf-8");
                    archivePath = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "plugin.tgz",
                    });
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (!result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.pluginId).toBe("voice-call");
                    (0, vitest_1.expect)(result.targetDir).toBe(node_path_1.default.join(stateDir, "extensions", "voice-call"));
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "package.json"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "dist", "index.js"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects installing when plugin already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archivePath, extensionsDir, installPluginFromArchive, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "dist"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@openclaw/voice-call",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "dist", "index.js"), "export {};", "utf-8");
                    archivePath = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "plugin.tgz",
                    });
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
                    first = _a.sent();
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 3:
                    second = _a.sent();
                    (0, vitest_1.expect)(first.ok).toBe(true);
                    (0, vitest_1.expect)(second.ok).toBe(false);
                    if (second.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(second.error).toContain("already exists");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("installs from a zip archive", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, archivePath, zip, buffer, extensionsDir, installPluginFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    archivePath = node_path_1.default.join(workDir, "plugin.zip");
                    zip = new jszip_1.default();
                    zip.file("package/package.json", JSON.stringify({
                        name: "@openclaw/zipper",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }));
                    zip.file("package/dist/index.js", "export {};");
                    return [4 /*yield*/, zip.generateAsync({ type: "nodebuffer" })];
                case 1:
                    buffer = _a.sent();
                    node_fs_1.default.writeFileSync(archivePath, buffer);
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 2:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (!result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.pluginId).toBe("zipper");
                    (0, vitest_1.expect)(result.targetDir).toBe(node_path_1.default.join(stateDir, "extensions", "zipper"));
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "package.json"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.targetDir, "dist", "index.js"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows updates when mode is update", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archiveV1, archiveV2, extensionsDir, installPluginFromArchive, first, second, manifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "dist"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@openclaw/voice-call",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "dist", "index.js"), "export {};", "utf-8");
                    archiveV1 = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "plugin-v1.tgz",
                    });
                    archiveV2 = (function () {
                        node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                            name: "@openclaw/voice-call",
                            version: "0.0.2",
                            openclaw: { extensions: ["./dist/index.js"] },
                        }), "utf-8");
                        return packToArchive({
                            pkgDir: pkgDir,
                            outDir: workDir,
                            outName: "plugin-v2.tgz",
                        });
                    })();
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archiveV1,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
                    first = _a.sent();
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archiveV2,
                            extensionsDir: extensionsDir,
                            mode: "update",
                        })];
                case 3:
                    second = _a.sent();
                    (0, vitest_1.expect)(first.ok).toBe(true);
                    (0, vitest_1.expect)(second.ok).toBe(true);
                    if (!second.ok) {
                        return [2 /*return*/];
                    }
                    manifest = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(second.targetDir, "package.json"), "utf-8"));
                    (0, vitest_1.expect)(manifest.version).toBe("0.0.2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects traversal-like plugin names", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archivePath, extensionsDir, installPluginFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "dist"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@evil/..",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "dist", "index.js"), "export {};", "utf-8");
                    archivePath = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "traversal.tgz",
                    });
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
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
    (0, vitest_1.it)("rejects reserved plugin ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archivePath, extensionsDir, installPluginFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(pkgDir, "dist"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({
                        name: "@evil/.",
                        version: "0.0.1",
                        openclaw: { extensions: ["./dist/index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "dist", "index.js"), "export {};", "utf-8");
                    archivePath = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "reserved.tgz",
                    });
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
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
    (0, vitest_1.it)("rejects packages without openclaw.extensions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workDir, pkgDir, archivePath, extensionsDir, installPluginFromArchive, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workDir = makeTempDir();
                    pkgDir = node_path_1.default.join(workDir, "package");
                    node_fs_1.default.mkdirSync(pkgDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(pkgDir, "package.json"), JSON.stringify({ name: "@openclaw/nope", version: "0.0.1" }), "utf-8");
                    archivePath = packToArchive({
                        pkgDir: pkgDir,
                        outDir: workDir,
                        outName: "bad.tgz",
                    });
                    extensionsDir = node_path_1.default.join(stateDir, "extensions");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 1:
                    installPluginFromArchive = (_a.sent()).installPluginFromArchive;
                    return [4 /*yield*/, installPluginFromArchive({
                            archivePath: archivePath,
                            extensionsDir: extensionsDir,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (result.ok) {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.error).toContain("openclaw.extensions");
                    return [2 /*return*/];
            }
        });
    }); });
});
