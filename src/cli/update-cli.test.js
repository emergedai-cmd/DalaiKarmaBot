"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var confirm = vitest_1.vi.fn();
var select = vitest_1.vi.fn();
var spinner = vitest_1.vi.fn(function () { return ({ start: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); });
var isCancel = function (value) { return value === "cancel"; };
vitest_1.vi.mock("@clack/prompts", function () { return ({
    confirm: confirm,
    select: select,
    isCancel: isCancel,
    spinner: spinner,
}); });
// Mock the update-runner module
vitest_1.vi.mock("../infra/update-runner.js", function () { return ({
    runGatewayUpdate: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../infra/openclaw-root.js", function () { return ({
    resolveOpenClawPackageRoot: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    readConfigFileSnapshot: vitest_1.vi.fn(),
    writeConfigFile: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../infra/update-check.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../infra/update-check.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { checkUpdateStatus: vitest_1.vi.fn(), fetchNpmTagVersion: vitest_1.vi.fn(), resolveNpmChannelTag: vitest_1.vi.fn() })];
        }
    });
}); });
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runCommandWithTimeout: vitest_1.vi.fn(),
}); });
// Mock doctor (heavy module; should not run in unit tests)
vitest_1.vi.mock("../commands/doctor.js", function () { return ({
    doctorCommand: vitest_1.vi.fn(),
}); });
// Mock the daemon-cli module
vitest_1.vi.mock("./daemon-cli.js", function () { return ({
    runDaemonRestart: vitest_1.vi.fn(),
}); });
// Mock the runtime
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: {
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        exit: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)("update-cli", function () {
    var baseSnapshot = {
        valid: true,
        config: {},
        issues: [],
    };
    var setTty = function (value) {
        Object.defineProperty(process.stdin, "isTTY", {
            value: value,
            configurable: true,
        });
    };
    var setStdoutTty = function (value) {
        Object.defineProperty(process.stdout, "isTTY", {
            value: value,
            configurable: true,
        });
    };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveOpenClawPackageRoot, readConfigFileSnapshot, _a, checkUpdateStatus, fetchNpmTagVersion, resolveNpmChannelTag, runCommandWithTimeout;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.clearAllMocks();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 1:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 2:
                    readConfigFileSnapshot = (_b.sent()).readConfigFileSnapshot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 3:
                    _a = _b.sent(), checkUpdateStatus = _a.checkUpdateStatus, fetchNpmTagVersion = _a.fetchNpmTagVersion, resolveNpmChannelTag = _a.resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../process/exec.js"); })];
                case 4:
                    runCommandWithTimeout = (_b.sent()).runCommandWithTimeout;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(process.cwd());
                    vitest_1.vi.mocked(readConfigFileSnapshot).mockResolvedValue(baseSnapshot);
                    vitest_1.vi.mocked(fetchNpmTagVersion).mockResolvedValue({
                        tag: "latest",
                        version: "9999.0.0",
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "9999.0.0",
                    });
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: "/test/path",
                        installKind: "git",
                        packageManager: "pnpm",
                        git: {
                            root: "/test/path",
                            sha: "abcdef1234567890",
                            tag: "v1.2.3",
                            branch: "main",
                            upstream: "origin/main",
                            dirty: false,
                            ahead: 0,
                            behind: 0,
                            fetchOk: true,
                        },
                        deps: {
                            manager: "pnpm",
                            status: "ok",
                            lockfilePath: "/test/path/pnpm-lock.yaml",
                            markerPath: "/test/path/node_modules",
                        },
                        registry: {
                            latestVersion: "1.2.3",
                        },
                    });
                    vitest_1.vi.mocked(runCommandWithTimeout).mockResolvedValue({
                        stdout: "",
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    setTty(false);
                    setStdoutTty(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("exports updateCommand and registerUpdateCli", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, updateCommand, registerUpdateCli, updateWizardCommand;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 1:
                    _a = _b.sent(), updateCommand = _a.updateCommand, registerUpdateCli = _a.registerUpdateCli, updateWizardCommand = _a.updateWizardCommand;
                    (0, vitest_1.expect)(typeof updateCommand).toBe("function");
                    (0, vitest_1.expect)(typeof registerUpdateCli).toBe("function");
                    (0, vitest_1.expect)(typeof updateWizardCommand).toBe("function");
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("updateCommand runs update and outputs result", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, defaultRuntime, updateCommand, mockResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        root: "/test/path",
                        before: { sha: "abc123", version: "1.0.0" },
                        after: { sha: "def456", version: "1.0.1" },
                        steps: [
                            {
                                name: "git fetch",
                                command: "git fetch",
                                cwd: "/test/path",
                                durationMs: 100,
                                exitCode: 0,
                            },
                        ],
                        durationMs: 500,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    return [4 /*yield*/, updateCommand({ json: false })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(runGatewayUpdate).toHaveBeenCalled();
                    (0, vitest_1.expect)(defaultRuntime.log).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateStatusCommand prints table output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultRuntime, updateStatusCommand, logs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 1:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 2:
                    updateStatusCommand = (_a.sent()).updateStatusCommand;
                    return [4 /*yield*/, updateStatusCommand({ json: false })];
                case 3:
                    _a.sent();
                    logs = vitest_1.vi.mocked(defaultRuntime.log).mock.calls.map(function (call) { return call[0]; });
                    (0, vitest_1.expect)(logs.join("\n")).toContain("OpenClaw update status");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateStatusCommand emits JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultRuntime, updateStatusCommand, last, parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 1:
                    defaultRuntime = (_b.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 2:
                    updateStatusCommand = (_b.sent()).updateStatusCommand;
                    return [4 /*yield*/, updateStatusCommand({ json: true })];
                case 3:
                    _b.sent();
                    last = (_a = vitest_1.vi.mocked(defaultRuntime.log).mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(typeof last).toBe("string");
                    parsed = JSON.parse(String(last));
                    (0, vitest_1.expect)(parsed.channel.value).toBe("stable");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to dev channel for git installs when unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, updateCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 2:
                    updateCommand = (_b.sent()).updateCommand;
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateCommand({})];
                case 3:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.channel).toBe("dev");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to stable channel for package installs when unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, resolveOpenClawPackageRoot, runGatewayUpdate, checkUpdateStatus, updateCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 9, 11]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 4:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 5:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 6:
                    checkUpdateStatus = (_b.sent()).checkUpdateStatus;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 7:
                    updateCommand = (_b.sent()).updateCommand;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(tempDir);
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: tempDir,
                        installKind: "package",
                        packageManager: "npm",
                        deps: {
                            manager: "npm",
                            status: "ok",
                            lockfilePath: null,
                            markerPath: null,
                        },
                    });
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "npm",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateCommand({ yes: true })];
                case 8:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.channel).toBe("stable");
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.tag).toBe("latest");
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 10:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses stored beta channel when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var readConfigFileSnapshot, runGatewayUpdate, updateCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    readConfigFileSnapshot = (_b.sent()).readConfigFileSnapshot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 2:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_b.sent()).updateCommand;
                    vitest_1.vi.mocked(readConfigFileSnapshot).mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { update: { channel: "beta" } } }));
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateCommand({})];
                case 4:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.channel).toBe("beta");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to latest when beta tag is older than release", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, resolveOpenClawPackageRoot, readConfigFileSnapshot, resolveNpmChannelTag, runGatewayUpdate, updateCommand, checkUpdateStatus, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 11, 13]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 4:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 5:
                    readConfigFileSnapshot = (_b.sent()).readConfigFileSnapshot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 6:
                    resolveNpmChannelTag = (_b.sent()).resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 7:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 8:
                    updateCommand = (_b.sent()).updateCommand;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 9:
                    checkUpdateStatus = (_b.sent()).checkUpdateStatus;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(tempDir);
                    vitest_1.vi.mocked(readConfigFileSnapshot).mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { update: { channel: "beta" } } }));
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: tempDir,
                        installKind: "package",
                        packageManager: "npm",
                        deps: {
                            manager: "npm",
                            status: "ok",
                            lockfilePath: null,
                            markerPath: null,
                        },
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "1.2.3-1",
                    });
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "npm",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateCommand({})];
                case 10:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.channel).toBe("beta");
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.tag).toBe("latest");
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 12:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors --tag override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, resolveOpenClawPackageRoot, runGatewayUpdate, updateCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 8, 10]);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "1.0.0" }), "utf-8")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 4:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 5:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 6:
                    updateCommand = (_b.sent()).updateCommand;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(tempDir);
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "npm",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateCommand({ tag: "next" })];
                case 7:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.tag).toBe("next");
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 9:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand outputs JSON when --json is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, defaultRuntime, updateCommand, mockResult, logCalls, jsonOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    vitest_1.vi.mocked(defaultRuntime.log).mockClear();
                    return [4 /*yield*/, updateCommand({ json: true })];
                case 4:
                    _a.sent();
                    logCalls = vitest_1.vi.mocked(defaultRuntime.log).mock.calls;
                    jsonOutput = logCalls.find(function (call) {
                        try {
                            JSON.parse(call[0]);
                            return true;
                        }
                        catch (_a) {
                            return false;
                        }
                    });
                    (0, vitest_1.expect)(jsonOutput).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand exits with error on failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, defaultRuntime, updateCommand, mockResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "error",
                        mode: "git",
                        reason: "rebase-failed",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    vitest_1.vi.mocked(defaultRuntime.exit).mockClear();
                    return [4 /*yield*/, updateCommand({})];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(defaultRuntime.exit).toHaveBeenCalledWith(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand restarts daemon by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, runDaemonRestart, updateCommand, mockResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 2:
                    runDaemonRestart = (_a.sent()).runDaemonRestart;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    vitest_1.vi.mocked(runDaemonRestart).mockResolvedValue(true);
                    return [4 /*yield*/, updateCommand({})];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(runDaemonRestart).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand skips restart when --no-restart is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, runDaemonRestart, updateCommand, mockResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 2:
                    runDaemonRestart = (_a.sent()).runDaemonRestart;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    return [4 /*yield*/, updateCommand({ restart: false })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(runDaemonRestart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand skips success message when restart does not run", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdate, runDaemonRestart, defaultRuntime, updateCommand, mockResult, logLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 1:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./daemon-cli.js"); })];
                case 2:
                    runDaemonRestart = (_a.sent()).runDaemonRestart;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 3:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 4:
                    updateCommand = (_a.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    vitest_1.vi.mocked(runDaemonRestart).mockResolvedValue(false);
                    vitest_1.vi.mocked(defaultRuntime.log).mockClear();
                    return [4 /*yield*/, updateCommand({ restart: true })];
                case 5:
                    _a.sent();
                    logLines = vitest_1.vi.mocked(defaultRuntime.log).mock.calls.map(function (call) { return String(call[0]); });
                    (0, vitest_1.expect)(logLines.some(function (line) { return line.includes("Daemon restarted successfully."); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateCommand validates timeout option", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultRuntime, updateCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 1:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 2:
                    updateCommand = (_a.sent()).updateCommand;
                    vitest_1.vi.mocked(defaultRuntime.error).mockClear();
                    vitest_1.vi.mocked(defaultRuntime.exit).mockClear();
                    return [4 /*yield*/, updateCommand({ timeout: "invalid" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(defaultRuntime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("timeout"));
                    (0, vitest_1.expect)(defaultRuntime.exit).toHaveBeenCalledWith(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists update channel when --channel is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var writeConfigFile, runGatewayUpdate, updateCommand, mockResult, call;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    writeConfigFile = (_c.sent()).writeConfigFile;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 2:
                    runGatewayUpdate = (_c.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 3:
                    updateCommand = (_c.sent()).updateCommand;
                    mockResult = {
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    };
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue(mockResult);
                    return [4 /*yield*/, updateCommand({ channel: "beta" })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(writeConfigFile).toHaveBeenCalled();
                    call = (_a = vitest_1.vi.mocked(writeConfigFile).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.update) === null || _b === void 0 ? void 0 : _b.channel).toBe("beta");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires confirmation on downgrade when non-interactive", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, resolveOpenClawPackageRoot, resolveNpmChannelTag, runGatewayUpdate, defaultRuntime, updateCommand, checkUpdateStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 11, 13]);
                    setTty(false);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "2.0.0" }), "utf-8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 4:
                    resolveOpenClawPackageRoot = (_a.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 5:
                    resolveNpmChannelTag = (_a.sent()).resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 6:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 7:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 8:
                    updateCommand = (_a.sent()).updateCommand;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 9:
                    checkUpdateStatus = (_a.sent()).checkUpdateStatus;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(tempDir);
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: tempDir,
                        installKind: "package",
                        packageManager: "npm",
                        deps: {
                            manager: "npm",
                            status: "ok",
                            lockfilePath: null,
                            markerPath: null,
                        },
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "0.0.1",
                    });
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "npm",
                        steps: [],
                        durationMs: 100,
                    });
                    vitest_1.vi.mocked(defaultRuntime.error).mockClear();
                    vitest_1.vi.mocked(defaultRuntime.exit).mockClear();
                    return [4 /*yield*/, updateCommand({})];
                case 10:
                    _a.sent();
                    (0, vitest_1.expect)(defaultRuntime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Downgrade confirmation required."));
                    (0, vitest_1.expect)(defaultRuntime.exit).toHaveBeenCalledWith(1);
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows downgrade with --yes in non-interactive mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, resolveOpenClawPackageRoot, resolveNpmChannelTag, runGatewayUpdate, defaultRuntime, updateCommand, checkUpdateStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-"))];
                case 1:
                    tempDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 11, 13]);
                    setTty(false);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(tempDir, "package.json"), JSON.stringify({ name: "openclaw", version: "2.0.0" }), "utf-8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/openclaw-root.js"); })];
                case 4:
                    resolveOpenClawPackageRoot = (_a.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 5:
                    resolveNpmChannelTag = (_a.sent()).resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 6:
                    runGatewayUpdate = (_a.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 7:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 8:
                    updateCommand = (_a.sent()).updateCommand;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 9:
                    checkUpdateStatus = (_a.sent()).checkUpdateStatus;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue(tempDir);
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: tempDir,
                        installKind: "package",
                        packageManager: "npm",
                        deps: {
                            manager: "npm",
                            status: "ok",
                            lockfilePath: null,
                            markerPath: null,
                        },
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "0.0.1",
                    });
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "npm",
                        steps: [],
                        durationMs: 100,
                    });
                    vitest_1.vi.mocked(defaultRuntime.error).mockClear();
                    vitest_1.vi.mocked(defaultRuntime.exit).mockClear();
                    return [4 /*yield*/, updateCommand({ yes: true })];
                case 10:
                    _a.sent();
                    (0, vitest_1.expect)(defaultRuntime.error).not.toHaveBeenCalledWith(vitest_1.expect.stringContaining("Downgrade confirmation required."));
                    (0, vitest_1.expect)(runGatewayUpdate).toHaveBeenCalled();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateWizardCommand requires a TTY", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultRuntime, updateWizardCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 1:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 2:
                    updateWizardCommand = (_a.sent()).updateWizardCommand;
                    setTty(false);
                    vitest_1.vi.mocked(defaultRuntime.error).mockClear();
                    vitest_1.vi.mocked(defaultRuntime.exit).mockClear();
                    return [4 /*yield*/, updateWizardCommand({})];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(defaultRuntime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Update wizard requires a TTY"));
                    (0, vitest_1.expect)(defaultRuntime.exit).toHaveBeenCalledWith(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateWizardCommand offers dev checkout and forwards selections", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, previousGitDir, checkUpdateStatus, runGatewayUpdate, updateWizardCommand, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-wizard-"))];
                case 1:
                    tempDir = _b.sent();
                    previousGitDir = process.env.OPENCLAW_GIT_DIR;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 7, 9]);
                    setTty(true);
                    process.env.OPENCLAW_GIT_DIR = tempDir;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-check.js"); })];
                case 3:
                    checkUpdateStatus = (_b.sent()).checkUpdateStatus;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/update-runner.js"); })];
                case 4:
                    runGatewayUpdate = (_b.sent()).runGatewayUpdate;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-cli.js"); })];
                case 5:
                    updateWizardCommand = (_b.sent()).updateWizardCommand;
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: "/test/path",
                        installKind: "package",
                        packageManager: "npm",
                        deps: {
                            manager: "npm",
                            status: "ok",
                            lockfilePath: null,
                            markerPath: null,
                        },
                    });
                    select.mockResolvedValue("dev");
                    confirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
                    vitest_1.vi.mocked(runGatewayUpdate).mockResolvedValue({
                        status: "ok",
                        mode: "git",
                        steps: [],
                        durationMs: 100,
                    });
                    return [4 /*yield*/, updateWizardCommand({})];
                case 6:
                    _b.sent();
                    call = (_a = vitest_1.vi.mocked(runGatewayUpdate).mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.channel).toBe("dev");
                    return [3 /*break*/, 9];
                case 7:
                    process.env.OPENCLAW_GIT_DIR = previousGitDir;
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 8:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
