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
var vitest_1 = require("vitest");
var onboard_hooks_js_1 = require("./onboard-hooks.js");
// Mock hook discovery modules
vitest_1.vi.mock("../hooks/hooks-status.js", function () { return ({
    buildWorkspaceHookStatus: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../agents/agent-scope.js", function () { return ({
    resolveAgentWorkspaceDir: vitest_1.vi.fn().mockReturnValue("/mock/workspace"),
    resolveDefaultAgentId: vitest_1.vi.fn().mockReturnValue("main"),
}); });
(0, vitest_1.describe)("onboard-hooks", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    var createMockPrompter = function (multiselectValue) { return ({
        confirm: vitest_1.vi.fn().mockResolvedValue(true),
        note: vitest_1.vi.fn().mockResolvedValue(undefined),
        intro: vitest_1.vi.fn().mockResolvedValue(undefined),
        outro: vitest_1.vi.fn().mockResolvedValue(undefined),
        text: vitest_1.vi.fn().mockResolvedValue(""),
        select: vitest_1.vi.fn().mockResolvedValue(""),
        multiselect: vitest_1.vi.fn().mockResolvedValue(multiselectValue),
        progress: vitest_1.vi.fn().mockReturnValue({
            stop: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
        }),
    }); };
    var createMockRuntime = function () { return ({
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        exit: vitest_1.vi.fn(),
    }); };
    var createMockHookReport = function (eligible) {
        if (eligible === void 0) { eligible = true; }
        return ({
            workspaceDir: "/mock/workspace",
            managedHooksDir: "/mock/.openclaw/hooks",
            hooks: [
                {
                    name: "session-memory",
                    description: "Save session context to memory when /new command is issued",
                    source: "openclaw-bundled",
                    pluginId: undefined,
                    filePath: "/mock/workspace/hooks/session-memory/HOOK.md",
                    baseDir: "/mock/workspace/hooks/session-memory",
                    handlerPath: "/mock/workspace/hooks/session-memory/handler.js",
                    hookKey: "session-memory",
                    emoji: "💾",
                    events: ["command:new"],
                    homepage: undefined,
                    always: false,
                    disabled: false,
                    eligible: eligible,
                    managedByPlugin: false,
                    requirements: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: ["workspace.dir"],
                        os: [],
                    },
                    missing: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: eligible ? [] : ["workspace.dir"],
                        os: [],
                    },
                    configChecks: [],
                    install: [],
                },
                {
                    name: "command-logger",
                    description: "Log all command events to a centralized audit file",
                    source: "openclaw-bundled",
                    pluginId: undefined,
                    filePath: "/mock/workspace/hooks/command-logger/HOOK.md",
                    baseDir: "/mock/workspace/hooks/command-logger",
                    handlerPath: "/mock/workspace/hooks/command-logger/handler.js",
                    hookKey: "command-logger",
                    emoji: "📝",
                    events: ["command"],
                    homepage: undefined,
                    always: false,
                    disabled: false,
                    eligible: eligible,
                    managedByPlugin: false,
                    requirements: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: ["workspace.dir"],
                        os: [],
                    },
                    missing: {
                        bins: [],
                        anyBins: [],
                        env: [],
                        config: eligible ? [] : ["workspace.dir"],
                        os: [],
                    },
                    configChecks: [],
                    install: [],
                },
            ],
        });
    };
    (0, vitest_1.describe)("setupInternalHooks", function () {
        (0, vitest_1.it)("should enable hooks when user selects them", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_e.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport());
                        cfg = {};
                        prompter = createMockPrompter(["session-memory"]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        result = _e.sent();
                        (0, vitest_1.expect)((_b = (_a = result.hooks) === null || _a === void 0 ? void 0 : _a.internal) === null || _b === void 0 ? void 0 : _b.enabled).toBe(true);
                        (0, vitest_1.expect)((_d = (_c = result.hooks) === null || _c === void 0 ? void 0 : _c.internal) === null || _d === void 0 ? void 0 : _d.entries).toEqual({
                            "session-memory": { enabled: true },
                        });
                        (0, vitest_1.expect)(prompter.note).toHaveBeenCalledTimes(2);
                        (0, vitest_1.expect)(prompter.multiselect).toHaveBeenCalledWith({
                            message: "Enable hooks?",
                            options: [
                                { value: "__skip__", label: "Skip for now" },
                                {
                                    value: "session-memory",
                                    label: "💾 session-memory",
                                    hint: "Save session context to memory when /new command is issued",
                                },
                                {
                                    value: "command-logger",
                                    label: "📝 command-logger",
                                    hint: "Log all command events to a centralized audit file",
                                },
                            ],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should not enable hooks when user skips", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_b.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport());
                        cfg = {};
                        prompter = createMockPrompter(["__skip__"]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        result = _b.sent();
                        (0, vitest_1.expect)((_a = result.hooks) === null || _a === void 0 ? void 0 : _a.internal).toBeUndefined();
                        (0, vitest_1.expect)(prompter.note).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle no eligible hooks", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_a.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport(false));
                        cfg = {};
                        prompter = createMockPrompter([]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(cfg);
                        (0, vitest_1.expect)(prompter.multiselect).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(prompter.note).toHaveBeenCalledWith("No eligible hooks found. You can configure hooks later in your config.", "No Hooks Available");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should preserve existing hooks config when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, result;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_h.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport());
                        cfg = {
                            hooks: {
                                enabled: true,
                                path: "/webhook",
                                token: "existing-token",
                            },
                        };
                        prompter = createMockPrompter(["session-memory"]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        result = _h.sent();
                        (0, vitest_1.expect)((_a = result.hooks) === null || _a === void 0 ? void 0 : _a.enabled).toBe(true);
                        (0, vitest_1.expect)((_b = result.hooks) === null || _b === void 0 ? void 0 : _b.path).toBe("/webhook");
                        (0, vitest_1.expect)((_c = result.hooks) === null || _c === void 0 ? void 0 : _c.token).toBe("existing-token");
                        (0, vitest_1.expect)((_e = (_d = result.hooks) === null || _d === void 0 ? void 0 : _d.internal) === null || _e === void 0 ? void 0 : _e.enabled).toBe(true);
                        (0, vitest_1.expect)((_g = (_f = result.hooks) === null || _f === void 0 ? void 0 : _f.internal) === null || _g === void 0 ? void 0 : _g.entries).toEqual({
                            "session-memory": { enabled: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should preserve existing config when user skips", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_c.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport());
                        cfg = {
                            agents: { defaults: { workspace: "/workspace" } },
                        };
                        prompter = createMockPrompter(["__skip__"]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        result = _c.sent();
                        (0, vitest_1.expect)(result).toEqual(cfg);
                        (0, vitest_1.expect)((_b = (_a = result.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.workspace).toBe("/workspace");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should show informative notes to user", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildWorkspaceHookStatus, cfg, prompter, runtime, noteCalls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks/hooks-status.js"); })];
                    case 1:
                        buildWorkspaceHookStatus = (_a.sent()).buildWorkspaceHookStatus;
                        vitest_1.vi.mocked(buildWorkspaceHookStatus).mockReturnValue(createMockHookReport());
                        cfg = {};
                        prompter = createMockPrompter(["session-memory"]);
                        runtime = createMockRuntime();
                        return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(cfg, runtime, prompter)];
                    case 2:
                        _a.sent();
                        noteCalls = prompter.note.mock.calls;
                        (0, vitest_1.expect)(noteCalls).toHaveLength(2);
                        // First note should explain what hooks are
                        (0, vitest_1.expect)(noteCalls[0][0]).toContain("Hooks let you automate actions");
                        (0, vitest_1.expect)(noteCalls[0][0]).toContain("automate actions");
                        // Second note should confirm configuration
                        (0, vitest_1.expect)(noteCalls[1][0]).toContain("Enabled 1 hook: session-memory");
                        (0, vitest_1.expect)(noteCalls[1][0]).toMatch(/(?:openclaw|openclaw)( --profile isolated)? hooks list/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
