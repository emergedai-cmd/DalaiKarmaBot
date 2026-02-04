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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var originalIsTTY;
var originalStateDir;
var originalUpdateInProgress;
var tempStateDir;
function setStdinTty(value) {
    try {
        Object.defineProperty(process.stdin, "isTTY", {
            value: value,
            configurable: true,
        });
    }
    catch (_a) {
        // ignore
    }
}
(0, vitest_1.beforeEach)(function () {
    confirm.mockReset().mockResolvedValue(true);
    select.mockReset().mockResolvedValue("node");
    note.mockClear();
    readConfigFileSnapshot.mockReset();
    writeConfigFile.mockReset().mockResolvedValue(undefined);
    resolveOpenClawPackageRoot.mockReset().mockResolvedValue(null);
    runGatewayUpdate.mockReset().mockResolvedValue({
        status: "skipped",
        mode: "unknown",
        steps: [],
        durationMs: 0,
    });
    legacyReadConfigFileSnapshot.mockReset().mockResolvedValue({
        path: "/tmp/openclaw.json",
        exists: false,
        raw: null,
        parsed: {},
        valid: true,
        config: {},
        issues: [],
        legacyIssues: [],
    });
    createConfigIO.mockReset().mockImplementation(function () { return ({
        readConfigFileSnapshot: legacyReadConfigFileSnapshot,
    }); });
    runExec.mockReset().mockResolvedValue({ stdout: "", stderr: "" });
    runCommandWithTimeout.mockReset().mockResolvedValue({
        stdout: "",
        stderr: "",
        code: 0,
        signal: null,
        killed: false,
    });
    ensureAuthProfileStore.mockReset().mockReturnValue({ version: 1, profiles: {} });
    migrateLegacyConfig.mockReset().mockImplementation(function (raw) { return ({
        config: raw,
        changes: ["Moved routing.allowFrom → channels.whatsapp.allowFrom."],
    }); });
    findLegacyGatewayServices.mockReset().mockResolvedValue([]);
    uninstallLegacyGatewayServices.mockReset().mockResolvedValue([]);
    findExtraGatewayServices.mockReset().mockResolvedValue([]);
    renderGatewayServiceCleanupHints.mockReset().mockReturnValue(["cleanup"]);
    resolveGatewayProgramArguments.mockReset().mockResolvedValue({
        programArguments: ["node", "cli", "gateway", "--port", "18789"],
    });
    serviceInstall.mockReset().mockResolvedValue(undefined);
    serviceIsLoaded.mockReset().mockResolvedValue(false);
    serviceStop.mockReset().mockResolvedValue(undefined);
    serviceRestart.mockReset().mockResolvedValue(undefined);
    serviceUninstall.mockReset().mockResolvedValue(undefined);
    callGateway.mockReset().mockRejectedValue(new Error("gateway closed"));
    originalIsTTY = process.stdin.isTTY;
    setStdinTty(true);
    originalStateDir = process.env.OPENCLAW_STATE_DIR;
    originalUpdateInProgress = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
    process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
    tempStateDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-doctor-state-"));
    process.env.OPENCLAW_STATE_DIR = tempStateDir;
    node_fs_1.default.mkdirSync(node_path_1.default.join(tempStateDir, "agents", "main", "sessions"), {
        recursive: true,
    });
    node_fs_1.default.mkdirSync(node_path_1.default.join(tempStateDir, "credentials"), { recursive: true });
});
(0, vitest_1.afterEach)(function () {
    setStdinTty(originalIsTTY);
    if (originalStateDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
    }
    else {
        process.env.OPENCLAW_STATE_DIR = originalStateDir;
    }
    if (originalUpdateInProgress === undefined) {
        delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
    }
    else {
        process.env.OPENCLAW_UPDATE_IN_PROGRESS = originalUpdateInProgress;
    }
    if (tempStateDir) {
        node_fs_1.default.rmSync(tempStateDir, { recursive: true, force: true });
        tempStateDir = undefined;
    }
});
var readConfigFileSnapshot = vitest_1.vi.fn();
var confirm = vitest_1.vi.fn().mockResolvedValue(true);
var select = vitest_1.vi.fn().mockResolvedValue("node");
var note = vitest_1.vi.fn();
var writeConfigFile = vitest_1.vi.fn().mockResolvedValue(undefined);
var resolveOpenClawPackageRoot = vitest_1.vi.fn().mockResolvedValue(null);
var runGatewayUpdate = vitest_1.vi.fn().mockResolvedValue({
    status: "skipped",
    mode: "unknown",
    steps: [],
    durationMs: 0,
});
var migrateLegacyConfig = vitest_1.vi.fn(function (raw) { return ({
    config: raw,
    changes: ["Moved routing.allowFrom → channels.whatsapp.allowFrom."],
}); });
var runExec = vitest_1.vi.fn().mockResolvedValue({ stdout: "", stderr: "" });
var runCommandWithTimeout = vitest_1.vi.fn().mockResolvedValue({
    stdout: "",
    stderr: "",
    code: 0,
    signal: null,
    killed: false,
});
var ensureAuthProfileStore = vitest_1.vi.fn().mockReturnValue({ version: 1, profiles: {} });
var legacyReadConfigFileSnapshot = vitest_1.vi.fn().mockResolvedValue({
    path: "/tmp/openclaw.json",
    exists: false,
    raw: null,
    parsed: {},
    valid: true,
    config: {},
    issues: [],
    legacyIssues: [],
});
var createConfigIO = vitest_1.vi.fn(function () { return ({
    readConfigFileSnapshot: legacyReadConfigFileSnapshot,
}); });
var findLegacyGatewayServices = vitest_1.vi.fn().mockResolvedValue([]);
var uninstallLegacyGatewayServices = vitest_1.vi.fn().mockResolvedValue([]);
var findExtraGatewayServices = vitest_1.vi.fn().mockResolvedValue([]);
var renderGatewayServiceCleanupHints = vitest_1.vi.fn().mockReturnValue(["cleanup"]);
var resolveGatewayProgramArguments = vitest_1.vi.fn().mockResolvedValue({
    programArguments: ["node", "cli", "gateway", "--port", "18789"],
});
var serviceInstall = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceIsLoaded = vitest_1.vi.fn().mockResolvedValue(false);
var serviceStop = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceRestart = vitest_1.vi.fn().mockResolvedValue(undefined);
var serviceUninstall = vitest_1.vi.fn().mockResolvedValue(undefined);
var callGateway = vitest_1.vi.fn().mockRejectedValue(new Error("gateway closed"));
vitest_1.vi.mock("@clack/prompts", function () { return ({
    confirm: confirm,
    intro: vitest_1.vi.fn(),
    note: note,
    outro: vitest_1.vi.fn(),
    select: select,
}); });
vitest_1.vi.mock("../agents/skills-status.js", function () { return ({
    buildWorkspaceSkillStatus: function () { return ({ skills: [] }); },
}); });
vitest_1.vi.mock("../plugins/loader.js", function () { return ({
    loadOpenClawPlugins: function () { return ({ plugins: [], diagnostics: [] }); },
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { CONFIG_PATH: "/tmp/openclaw.json", createConfigIO: createConfigIO, readConfigFileSnapshot: readConfigFileSnapshot, writeConfigFile: writeConfigFile, migrateLegacyConfig: migrateLegacyConfig })];
        }
    });
}); });
vitest_1.vi.mock("../daemon/legacy.js", function () { return ({
    findLegacyGatewayServices: findLegacyGatewayServices,
    uninstallLegacyGatewayServices: uninstallLegacyGatewayServices,
}); });
vitest_1.vi.mock("../daemon/inspect.js", function () { return ({
    findExtraGatewayServices: findExtraGatewayServices,
    renderGatewayServiceCleanupHints: renderGatewayServiceCleanupHints,
}); });
vitest_1.vi.mock("../daemon/program-args.js", function () { return ({
    resolveGatewayProgramArguments: resolveGatewayProgramArguments,
}); });
vitest_1.vi.mock("../gateway/call.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { callGateway: callGateway })];
        }
    });
}); });
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runExec: runExec,
    runCommandWithTimeout: runCommandWithTimeout,
}); });
vitest_1.vi.mock("../infra/openclaw-root.js", function () { return ({
    resolveOpenClawPackageRoot: resolveOpenClawPackageRoot,
}); });
vitest_1.vi.mock("../infra/update-runner.js", function () { return ({
    runGatewayUpdate: runGatewayUpdate,
}); });
vitest_1.vi.mock("../agents/auth-profiles.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { ensureAuthProfileStore: ensureAuthProfileStore })];
        }
    });
}); });
vitest_1.vi.mock("../daemon/service.js", function () { return ({
    resolveGatewayService: function () { return ({
        label: "LaunchAgent",
        loadedText: "loaded",
        notLoadedText: "not loaded",
        install: serviceInstall,
        uninstall: serviceUninstall,
        stop: serviceStop,
        restart: serviceRestart,
        isLoaded: serviceIsLoaded,
        readCommand: vitest_1.vi.fn(),
        readRuntime: vitest_1.vi.fn().mockResolvedValue({ status: "running" }),
    }); },
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: vitest_1.vi.fn().mockResolvedValue([]),
    upsertChannelPairingRequest: vitest_1.vi.fn().mockResolvedValue({ code: "000000", created: false }),
}); });
vitest_1.vi.mock("../telegram/token.js", function () { return ({
    resolveTelegramToken: vitest_1.vi.fn(function () { return ({ token: "", source: "none" }); }),
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: {
        log: function () { },
        error: function () { },
        exit: function () {
            throw new Error("exit");
        },
    },
}); });
vitest_1.vi.mock("../utils.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveUserPath: function (value) { return value; }, sleep: vitest_1.vi.fn() })];
        }
    });
}); });
vitest_1.vi.mock("./health.js", function () { return ({
    healthCommand: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./onboard-helpers.js", function () { return ({
    applyWizardMetadata: function (cfg) { return cfg; },
    DEFAULT_WORKSPACE: "/tmp",
    guardCancel: function (value) { return value; },
    printWizardHeader: vitest_1.vi.fn(),
    randomToken: vitest_1.vi.fn(function () { return "test-gateway-token"; }),
}); });
vitest_1.vi.mock("./doctor-state-migrations.js", function () { return ({
    autoMigrateLegacyStateDir: vitest_1.vi.fn().mockResolvedValue({
        migrated: false,
        skipped: false,
        changes: [],
        warnings: [],
    }),
    detectLegacyStateMigrations: vitest_1.vi.fn().mockResolvedValue({
        targetAgentId: "main",
        targetMainKey: "main",
        targetScope: undefined,
        stateDir: "/tmp/state",
        oauthDir: "/tmp/oauth",
        sessions: {
            legacyDir: "/tmp/state/sessions",
            legacyStorePath: "/tmp/state/sessions/sessions.json",
            targetDir: "/tmp/state/agents/main/sessions",
            targetStorePath: "/tmp/state/agents/main/sessions/sessions.json",
            hasLegacy: false,
            legacyKeys: [],
        },
        agentDir: {
            legacyDir: "/tmp/state/agent",
            targetDir: "/tmp/state/agents/main/agent",
            hasLegacy: false,
        },
        whatsappAuth: {
            legacyDir: "/tmp/oauth",
            targetDir: "/tmp/oauth/whatsapp/default",
            hasLegacy: false,
        },
        preview: [],
    }),
    runLegacyStateMigrations: vitest_1.vi.fn().mockResolvedValue({
        changes: [],
        warnings: [],
    }),
}); });
(0, vitest_1.describe)("doctor command", function () {
    (0, vitest_1.it)("warns when per-agent sandbox docker/browser/prune overrides are ignored under shared scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var doctorCommand, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readConfigFileSnapshot.mockResolvedValue({
                        path: "/tmp/openclaw.json",
                        exists: true,
                        raw: "{}",
                        parsed: {},
                        valid: true,
                        config: {
                            agents: {
                                defaults: {
                                    sandbox: {
                                        mode: "all",
                                        scope: "shared",
                                    },
                                },
                                list: [
                                    {
                                        id: "work",
                                        workspace: "~/openclaw-work",
                                        sandbox: {
                                            mode: "all",
                                            scope: "shared",
                                            docker: {
                                                setupCommand: "echo work",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        issues: [],
                        legacyIssues: [],
                    });
                    note.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./doctor.js"); })];
                case 1:
                    doctorCommand = (_a.sent()).doctorCommand;
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    return [4 /*yield*/, doctorCommand(runtime, { nonInteractive: true })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(note.mock.calls.some(function (_a) {
                        var message = _a[0], title = _a[1];
                        if (title !== "Sandbox" || typeof message !== "string") {
                            return false;
                        }
                        var normalized = message.replace(/\s+/g, " ").trim();
                        return (normalized.includes('agents.list (id "work") sandbox docker') &&
                            normalized.includes('scope resolves to "shared"'));
                    })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    (0, vitest_1.it)("does not warn when only the active workspace is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var homedirSpy, realExists, legacyPath, legacyAgentsPath, existsSpy, doctorCommand, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readConfigFileSnapshot.mockResolvedValue({
                        path: "/tmp/openclaw.json",
                        exists: true,
                        raw: "{}",
                        parsed: {},
                        valid: true,
                        config: {
                            agents: { defaults: { workspace: "/Users/steipete/openclaw" } },
                        },
                        issues: [],
                        legacyIssues: [],
                    });
                    note.mockClear();
                    homedirSpy = vitest_1.vi.spyOn(node_os_1.default, "homedir").mockReturnValue("/Users/steipete");
                    realExists = node_fs_1.default.existsSync;
                    legacyPath = node_path_1.default.join("/Users/steipete", "openclaw");
                    legacyAgentsPath = node_path_1.default.join(legacyPath, "AGENTS.md");
                    existsSpy = vitest_1.vi.spyOn(node_fs_1.default, "existsSync").mockImplementation(function (value) {
                        if (value === "/Users/steipete/openclaw" ||
                            value === legacyPath ||
                            value === legacyAgentsPath) {
                            return true;
                        }
                        return realExists(value);
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./doctor.js"); })];
                case 1:
                    doctorCommand = (_a.sent()).doctorCommand;
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    return [4 /*yield*/, doctorCommand(runtime, { nonInteractive: true })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(note.mock.calls.some(function (_a) {
                        var _ = _a[0], title = _a[1];
                        return title === "Extra workspace";
                    })).toBe(false);
                    homedirSpy.mockRestore();
                    existsSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
