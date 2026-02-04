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
var update_runner_js_1 = require("./update-runner.js");
function createRunner(responses) {
    var _this = this;
    var calls = [];
    var runner = function (argv) { return __awaiter(_this, void 0, void 0, function () {
        var key, res;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            key = argv.join(" ");
            calls.push(key);
            res = (_a = responses[key]) !== null && _a !== void 0 ? _a : {};
            return [2 /*return*/, {
                    stdout: (_b = res.stdout) !== null && _b !== void 0 ? _b : "",
                    stderr: (_c = res.stderr) !== null && _c !== void 0 ? _c : "",
                    code: (_d = res.code) !== null && _d !== void 0 ? _d : 0,
                }];
        });
    }); };
    return { runner: runner, calls: calls };
}
function pathExists(targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(targetPath)];
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
(0, vitest_1.describe)("runGatewayUpdate", function () {
    var tempDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips git update when worktree is dirty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runner, calls, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tempDir, ".git"))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 2:
                    _c.sent();
                    _a = createRunner((_b = {},
                        _b["git -C ".concat(tempDir, " rev-parse --show-toplevel")] = { stdout: tempDir },
                        _b["git -C ".concat(tempDir, " rev-parse HEAD")] = { stdout: "abc123" },
                        _b["git -C ".concat(tempDir, " rev-parse --abbrev-ref HEAD")] = { stdout: "main" },
                        _b["git -C ".concat(tempDir, " status --porcelain -- :!dist/control-ui/")] = { stdout: " M README.md" },
                        _b)), runner = _a.runner, calls = _a.calls;
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: tempDir,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runner(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("skipped");
                    (0, vitest_1.expect)(result.reason).toBe("dirty");
                    (0, vitest_1.expect)(calls.some(function (call) { return call.includes("rebase"); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("aborts rebase on failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runner, calls, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tempDir, ".git"))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 2:
                    _c.sent();
                    _a = createRunner((_b = {},
                        _b["git -C ".concat(tempDir, " rev-parse --show-toplevel")] = { stdout: tempDir },
                        _b["git -C ".concat(tempDir, " rev-parse HEAD")] = { stdout: "abc123" },
                        _b["git -C ".concat(tempDir, " rev-parse --abbrev-ref HEAD")] = { stdout: "main" },
                        _b["git -C ".concat(tempDir, " status --porcelain -- :!dist/control-ui/")] = { stdout: "" },
                        _b["git -C ".concat(tempDir, " rev-parse --abbrev-ref --symbolic-full-name @{upstream}")] = {
                            stdout: "origin/main",
                        },
                        _b["git -C ".concat(tempDir, " fetch --all --prune --tags")] = { stdout: "" },
                        _b["git -C ".concat(tempDir, " rev-parse @{upstream}")] = { stdout: "upstream123" },
                        _b["git -C ".concat(tempDir, " rev-list --max-count=10 upstream123")] = { stdout: "upstream123\n" },
                        _b["git -C ".concat(tempDir, " rebase upstream123")] = { code: 1, stderr: "conflict" },
                        _b["git -C ".concat(tempDir, " rebase --abort")] = { stdout: "" },
                        _b)), runner = _a.runner, calls = _a.calls;
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: tempDir,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runner(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("error");
                    (0, vitest_1.expect)(result.reason).toBe("rebase-failed");
                    (0, vitest_1.expect)(calls.some(function (call) { return call.includes("rebase --abort"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses stable tag when beta tag is older than release", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stableTag, betaTag, _a, runner, calls, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tempDir, ".git"))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0", packageManager: "pnpm@8.0.0" }), "utf-8")];
                case 2:
                    _c.sent();
                    stableTag = "v1.0.1-1";
                    betaTag = "v1.0.0-beta.2";
                    _a = createRunner((_b = {},
                        _b["git -C ".concat(tempDir, " rev-parse --show-toplevel")] = { stdout: tempDir },
                        _b["git -C ".concat(tempDir, " rev-parse HEAD")] = { stdout: "abc123" },
                        _b["git -C ".concat(tempDir, " status --porcelain -- :!dist/control-ui/")] = { stdout: "" },
                        _b["git -C ".concat(tempDir, " fetch --all --prune --tags")] = { stdout: "" },
                        _b["git -C ".concat(tempDir, " tag --list v* --sort=-v:refname")] = {
                            stdout: "".concat(stableTag, "\n").concat(betaTag, "\n"),
                        },
                        _b["git -C ".concat(tempDir, " checkout --detach ").concat(stableTag)] = { stdout: "" },
                        _b["pnpm install"] = { stdout: "" },
                        _b["pnpm build"] = { stdout: "" },
                        _b["pnpm ui:build"] = { stdout: "" },
                        _b["git -C ".concat(tempDir, " checkout -- dist/control-ui/")] = { stdout: "" },
                        _b["pnpm openclaw doctor --non-interactive"] = { stdout: "" },
                        _b)), runner = _a.runner, calls = _a.calls;
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: tempDir,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runner(argv)];
                            }); }); },
                            timeoutMs: 5000,
                            channel: "beta",
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("ok");
                    (0, vitest_1.expect)(calls).toContain("git -C ".concat(tempDir, " checkout --detach ").concat(stableTag));
                    (0, vitest_1.expect)(calls).not.toContain("git -C ".concat(tempDir, " checkout --detach ").concat(betaTag));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips update when no git root", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runner, calls, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", packageManager: "pnpm@8.0.0" }), "utf-8")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "pnpm-lock.yaml"), "", "utf-8")];
                case 2:
                    _c.sent();
                    _a = createRunner((_b = {},
                        _b["git -C ".concat(tempDir, " rev-parse --show-toplevel")] = { code: 1 },
                        _b["npm root -g"] = { code: 1 },
                        _b["pnpm root -g"] = { code: 1 },
                        _b)), runner = _a.runner, calls = _a.calls;
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: tempDir,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runner(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("skipped");
                    (0, vitest_1.expect)(result.reason).toBe("not-git-install");
                    (0, vitest_1.expect)(calls.some(function (call) { return call.startsWith("pnpm add -g"); })).toBe(false);
                    (0, vitest_1.expect)(calls.some(function (call) { return call.startsWith("npm i -g"); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates global npm installs when detected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeModules, pkgRoot, calls, runCommand, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nodeModules = node_path_1.default.join(tempDir, "node_modules");
                    pkgRoot = node_path_1.default.join(nodeModules, "openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(pkgRoot, { recursive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 2:
                    _c.sent();
                    calls = [];
                    runCommand = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                        var key;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = argv.join(" ");
                                    calls.push(key);
                                    if (key === "git -C ".concat(pkgRoot, " rev-parse --show-toplevel")) {
                                        return [2 /*return*/, { stdout: "", stderr: "not a git repository", code: 128 }];
                                    }
                                    if (key === "npm root -g") {
                                        return [2 /*return*/, { stdout: nodeModules, stderr: "", code: 0 }];
                                    }
                                    if (!(key === "npm i -g openclaw@latest")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot, "package.json"), JSON.stringify({ name: "openclaw", version: "2.0.0" }), "utf-8")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, { stdout: "ok", stderr: "", code: 0 }];
                                case 2:
                                    if (key === "pnpm root -g") {
                                        return [2 /*return*/, { stdout: "", stderr: "", code: 1 }];
                                    }
                                    return [2 /*return*/, { stdout: "", stderr: "", code: 0 }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: pkgRoot,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runCommand(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("ok");
                    (0, vitest_1.expect)(result.mode).toBe("npm");
                    (0, vitest_1.expect)((_a = result.before) === null || _a === void 0 ? void 0 : _a.version).toBe("1.0.0");
                    (0, vitest_1.expect)((_b = result.after) === null || _b === void 0 ? void 0 : _b.version).toBe("2.0.0");
                    (0, vitest_1.expect)(calls.some(function (call) { return call === "npm i -g openclaw@latest"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cleans stale npm rename dirs before global update", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeModules, pkgRoot, staleDir, stalePresentAtInstall, runCommand, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodeModules = node_path_1.default.join(tempDir, "node_modules");
                    pkgRoot = node_path_1.default.join(nodeModules, "openclaw");
                    staleDir = node_path_1.default.join(nodeModules, ".openclaw-stale");
                    return [4 /*yield*/, promises_1.default.mkdir(staleDir, { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(pkgRoot, { recursive: true })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 3:
                    _b.sent();
                    stalePresentAtInstall = true;
                    runCommand = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                        var key;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = argv.join(" ");
                                    if (key === "git -C ".concat(pkgRoot, " rev-parse --show-toplevel")) {
                                        return [2 /*return*/, { stdout: "", stderr: "not a git repository", code: 128 }];
                                    }
                                    if (key === "npm root -g") {
                                        return [2 /*return*/, { stdout: nodeModules, stderr: "", code: 0 }];
                                    }
                                    if (key === "pnpm root -g") {
                                        return [2 /*return*/, { stdout: "", stderr: "", code: 1 }];
                                    }
                                    if (!(key === "npm i -g openclaw@latest")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, pathExists(staleDir)];
                                case 1:
                                    stalePresentAtInstall = _a.sent();
                                    return [2 /*return*/, { stdout: "ok", stderr: "", code: 0 }];
                                case 2: return [2 /*return*/, { stdout: "", stderr: "", code: 0 }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: pkgRoot,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runCommand(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.status).toBe("ok");
                    (0, vitest_1.expect)(stalePresentAtInstall).toBe(false);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, pathExists(staleDir)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates global npm installs with tag override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeModules, pkgRoot, calls, runCommand, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nodeModules = node_path_1.default.join(tempDir, "node_modules");
                    pkgRoot = node_path_1.default.join(nodeModules, "openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(pkgRoot, { recursive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 2:
                    _c.sent();
                    calls = [];
                    runCommand = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                        var key;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = argv.join(" ");
                                    calls.push(key);
                                    if (key === "git -C ".concat(pkgRoot, " rev-parse --show-toplevel")) {
                                        return [2 /*return*/, { stdout: "", stderr: "not a git repository", code: 128 }];
                                    }
                                    if (key === "npm root -g") {
                                        return [2 /*return*/, { stdout: nodeModules, stderr: "", code: 0 }];
                                    }
                                    if (!(key === "npm i -g openclaw@beta")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot, "package.json"), JSON.stringify({ name: "openclaw", version: "2.0.0" }), "utf-8")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, { stdout: "ok", stderr: "", code: 0 }];
                                case 2:
                                    if (key === "pnpm root -g") {
                                        return [2 /*return*/, { stdout: "", stderr: "", code: 1 }];
                                    }
                                    return [2 /*return*/, { stdout: "", stderr: "", code: 0 }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: pkgRoot,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runCommand(argv)];
                            }); }); },
                            timeoutMs: 5000,
                            tag: "beta",
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("ok");
                    (0, vitest_1.expect)(result.mode).toBe("npm");
                    (0, vitest_1.expect)((_a = result.before) === null || _a === void 0 ? void 0 : _a.version).toBe("1.0.0");
                    (0, vitest_1.expect)((_b = result.after) === null || _b === void 0 ? void 0 : _b.version).toBe("2.0.0");
                    (0, vitest_1.expect)(calls.some(function (call) { return call === "npm i -g openclaw@beta"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates global bun installs when detected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var oldBunInstall, bunInstall, bunGlobalRoot, pkgRoot_1, calls_1, runCommand_1, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    oldBunInstall = process.env.BUN_INSTALL;
                    bunInstall = node_path_1.default.join(tempDir, "bun-install");
                    process.env.BUN_INSTALL = bunInstall;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 5, 6]);
                    bunGlobalRoot = node_path_1.default.join(bunInstall, "install", "global", "node_modules");
                    pkgRoot_1 = node_path_1.default.join(bunGlobalRoot, "openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(pkgRoot_1, { recursive: true })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot_1, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 3:
                    _c.sent();
                    calls_1 = [];
                    runCommand_1 = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                        var key;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = argv.join(" ");
                                    calls_1.push(key);
                                    if (key === "git -C ".concat(pkgRoot_1, " rev-parse --show-toplevel")) {
                                        return [2 /*return*/, { stdout: "", stderr: "not a git repository", code: 128 }];
                                    }
                                    if (key === "npm root -g") {
                                        return [2 /*return*/, { stdout: "", stderr: "", code: 1 }];
                                    }
                                    if (key === "pnpm root -g") {
                                        return [2 /*return*/, { stdout: "", stderr: "", code: 1 }];
                                    }
                                    if (!(key === "bun add -g openclaw@latest")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pkgRoot_1, "package.json"), JSON.stringify({ name: "openclaw", version: "2.0.0" }), "utf-8")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, { stdout: "ok", stderr: "", code: 0 }];
                                case 2: return [2 /*return*/, { stdout: "", stderr: "", code: 0 }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: pkgRoot_1,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runCommand_1(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 4:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.status).toBe("ok");
                    (0, vitest_1.expect)(result.mode).toBe("bun");
                    (0, vitest_1.expect)((_a = result.before) === null || _a === void 0 ? void 0 : _a.version).toBe("1.0.0");
                    (0, vitest_1.expect)((_b = result.after) === null || _b === void 0 ? void 0 : _b.version).toBe("2.0.0");
                    (0, vitest_1.expect)(calls_1.some(function (call) { return call === "bun add -g openclaw@latest"; })).toBe(true);
                    return [3 /*break*/, 6];
                case 5:
                    if (oldBunInstall === undefined) {
                        delete process.env.BUN_INSTALL;
                    }
                    else {
                        process.env.BUN_INSTALL = oldBunInstall;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects git roots that are not a openclaw checkout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cwdSpy, _a, runner, calls, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tempDir, ".git"))];
                case 1:
                    _c.sent();
                    cwdSpy = vitest_1.vi.spyOn(process, "cwd").mockReturnValue(tempDir);
                    _a = createRunner((_b = {},
                        _b["git -C ".concat(tempDir, " rev-parse --show-toplevel")] = { stdout: tempDir },
                        _b)), runner = _a.runner, calls = _a.calls;
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            cwd: tempDir,
                            runCommand: function (argv, _options) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, runner(argv)];
                            }); }); },
                            timeoutMs: 5000,
                        })];
                case 2:
                    result = _c.sent();
                    cwdSpy.mockRestore();
                    (0, vitest_1.expect)(result.status).toBe("error");
                    (0, vitest_1.expect)(result.reason).toBe("not-openclaw-root");
                    (0, vitest_1.expect)(calls.some(function (call) { return call.includes("status --porcelain"); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
