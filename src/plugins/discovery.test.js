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
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var tempDirs = [];
function makeTempDir() {
    var dir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-plugins-".concat((0, node_crypto_1.randomUUID)()));
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    tempDirs.push(dir);
    return dir;
}
function withStateDir(stateDir, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var prev, prevBundled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = process.env.OPENCLAW_STATE_DIR;
                    prevBundled = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
                    vitest_1.vi.resetModules();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fn()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    if (prev === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prev;
                    }
                    if (prevBundled === undefined) {
                        delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
                    }
                    else {
                        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = prevBundled;
                    }
                    vitest_1.vi.resetModules();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
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
(0, vitest_1.describe)("discoverOpenClawPlugins", function () {
    (0, vitest_1.it)("discovers global and workspace extensions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, workspaceDir, globalExt, workspaceExt, candidates, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    workspaceDir = node_path_1.default.join(stateDir, "workspace");
                    globalExt = node_path_1.default.join(stateDir, "extensions");
                    node_fs_1.default.mkdirSync(globalExt, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "alpha.ts"), "export default function () {}", "utf-8");
                    workspaceExt = node_path_1.default.join(workspaceDir, ".openclaw", "extensions");
                    node_fs_1.default.mkdirSync(workspaceExt, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(workspaceExt, "beta.ts"), "export default function () {}", "utf-8");
                    return [4 /*yield*/, withStateDir(stateDir, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var discoverOpenClawPlugins;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./discovery.js"); })];
                                    case 1:
                                        discoverOpenClawPlugins = (_a.sent()).discoverOpenClawPlugins;
                                        return [2 /*return*/, discoverOpenClawPlugins({ workspaceDir: workspaceDir })];
                                }
                            });
                        }); })];
                case 1:
                    candidates = (_a.sent()).candidates;
                    ids = candidates.map(function (c) { return c.idHint; });
                    (0, vitest_1.expect)(ids).toContain("alpha");
                    (0, vitest_1.expect)(ids).toContain("beta");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads package extension packs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, globalExt, candidates, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    globalExt = node_path_1.default.join(stateDir, "extensions", "pack");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(globalExt, "src"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "package.json"), JSON.stringify({
                        name: "pack",
                        openclaw: { extensions: ["./src/one.ts", "./src/two.ts"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "src", "one.ts"), "export default function () {}", "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "src", "two.ts"), "export default function () {}", "utf-8");
                    return [4 /*yield*/, withStateDir(stateDir, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var discoverOpenClawPlugins;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./discovery.js"); })];
                                    case 1:
                                        discoverOpenClawPlugins = (_a.sent()).discoverOpenClawPlugins;
                                        return [2 /*return*/, discoverOpenClawPlugins({})];
                                }
                            });
                        }); })];
                case 1:
                    candidates = (_a.sent()).candidates;
                    ids = candidates.map(function (c) { return c.idHint; });
                    (0, vitest_1.expect)(ids).toContain("pack/one");
                    (0, vitest_1.expect)(ids).toContain("pack/two");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives unscoped ids for scoped packages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, globalExt, candidates, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    globalExt = node_path_1.default.join(stateDir, "extensions", "voice-call-pack");
                    node_fs_1.default.mkdirSync(node_path_1.default.join(globalExt, "src"), { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "package.json"), JSON.stringify({
                        name: "@openclaw/voice-call",
                        openclaw: { extensions: ["./src/index.ts"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(globalExt, "src", "index.ts"), "export default function () {}", "utf-8");
                    return [4 /*yield*/, withStateDir(stateDir, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var discoverOpenClawPlugins;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./discovery.js"); })];
                                    case 1:
                                        discoverOpenClawPlugins = (_a.sent()).discoverOpenClawPlugins;
                                        return [2 /*return*/, discoverOpenClawPlugins({})];
                                }
                            });
                        }); })];
                case 1:
                    candidates = (_a.sent()).candidates;
                    ids = candidates.map(function (c) { return c.idHint; });
                    (0, vitest_1.expect)(ids).toContain("voice-call");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats configured directory paths as plugin packages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, packDir, candidates, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stateDir = makeTempDir();
                    packDir = node_path_1.default.join(stateDir, "packs", "demo-plugin-dir");
                    node_fs_1.default.mkdirSync(packDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(packDir, "package.json"), JSON.stringify({
                        name: "@openclaw/demo-plugin-dir",
                        openclaw: { extensions: ["./index.js"] },
                    }), "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(packDir, "index.js"), "module.exports = {}", "utf-8");
                    return [4 /*yield*/, withStateDir(stateDir, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var discoverOpenClawPlugins;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./discovery.js"); })];
                                    case 1:
                                        discoverOpenClawPlugins = (_a.sent()).discoverOpenClawPlugins;
                                        return [2 /*return*/, discoverOpenClawPlugins({ extraPaths: [packDir] })];
                                }
                            });
                        }); })];
                case 1:
                    candidates = (_a.sent()).candidates;
                    ids = candidates.map(function (c) { return c.idHint; });
                    (0, vitest_1.expect)(ids).toContain("demo-plugin-dir");
                    return [2 /*return*/];
            }
        });
    }); });
});
