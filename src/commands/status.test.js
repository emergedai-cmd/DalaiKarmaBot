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
var vitest_1 = require("vitest");
var previousProfile;
(0, vitest_1.beforeAll)(function () {
    previousProfile = process.env.OPENCLAW_PROFILE;
    process.env.OPENCLAW_PROFILE = "isolated";
});
(0, vitest_1.afterAll)(function () {
    if (previousProfile === undefined) {
        delete process.env.OPENCLAW_PROFILE;
    }
    else {
        process.env.OPENCLAW_PROFILE = previousProfile;
    }
});
var mocks = vitest_1.vi.hoisted(function () { return ({
    loadSessionStore: vitest_1.vi.fn().mockReturnValue({
        "+1000": {
            updatedAt: Date.now() - 60000,
            verboseLevel: "on",
            thinkingLevel: "low",
            inputTokens: 2000,
            outputTokens: 3000,
            contextTokens: 10000,
            model: "pi:opus",
            sessionId: "abc123",
            systemSent: true,
        },
    }),
    resolveMainSessionKey: vitest_1.vi.fn().mockReturnValue("agent:main:main"),
    resolveStorePath: vitest_1.vi.fn().mockReturnValue("/tmp/sessions.json"),
    webAuthExists: vitest_1.vi.fn().mockResolvedValue(true),
    getWebAuthAgeMs: vitest_1.vi.fn().mockReturnValue(5000),
    readWebSelfId: vitest_1.vi.fn().mockReturnValue({ e164: "+1999" }),
    logWebSelfId: vitest_1.vi.fn(),
    probeGateway: vitest_1.vi.fn().mockResolvedValue({
        ok: false,
        url: "ws://127.0.0.1:18789",
        connectLatencyMs: null,
        error: "timeout",
        close: null,
        health: null,
        status: null,
        presence: null,
        configSnapshot: null,
    }),
    callGateway: vitest_1.vi.fn().mockResolvedValue({}),
    listAgentsForGateway: vitest_1.vi.fn().mockReturnValue({
        defaultId: "main",
        mainKey: "agent:main:main",
        scope: "per-sender",
        agents: [{ id: "main", name: "Main" }],
    }),
    runSecurityAudit: vitest_1.vi.fn().mockResolvedValue({
        ts: 0,
        summary: { critical: 1, warn: 1, info: 2 },
        findings: [
            {
                checkId: "test.critical",
                severity: "critical",
                title: "Test critical finding",
                detail: "Something is very wrong\nbut on two lines",
                remediation: "Do the thing",
            },
            {
                checkId: "test.warn",
                severity: "warn",
                title: "Test warning finding",
                detail: "Something is maybe wrong",
            },
            {
                checkId: "test.info",
                severity: "info",
                title: "Test info finding",
                detail: "FYI only",
            },
            {
                checkId: "test.info2",
                severity: "info",
                title: "Another info finding",
                detail: "More FYI",
            },
        ],
    }),
}); });
vitest_1.vi.mock("../memory/manager.js", function () { return ({
    MemoryIndexManager: {
        get: vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var agentId = _b.agentId;
            return __generator(this, function (_c) {
                return [2 /*return*/, ({
                        probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        }); }); }),
                        status: function () { return ({
                            files: 2,
                            chunks: 3,
                            dirty: false,
                            workspaceDir: "/tmp/openclaw",
                            dbPath: "/tmp/memory.sqlite",
                            provider: "openai",
                            model: "text-embedding-3-small",
                            requestedProvider: "openai",
                            sources: ["memory"],
                            sourceCounts: [{ source: "memory", files: 2, chunks: 3 }],
                            cache: { enabled: true, entries: 10, maxEntries: 500 },
                            fts: { enabled: true, available: true },
                            vector: {
                                enabled: true,
                                available: true,
                                extensionPath: "/opt/vec0.dylib",
                                dims: 1024,
                            },
                        }); },
                        close: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        __agentId: agentId,
                    })];
            });
        }); }),
    },
}); });
vitest_1.vi.mock("../config/sessions.js", function () { return ({
    loadSessionStore: mocks.loadSessionStore,
    resolveMainSessionKey: mocks.resolveMainSessionKey,
    resolveStorePath: mocks.resolveStorePath,
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("../channels/plugins/index.js", function () { return ({
    listChannelPlugins: function () {
        return [
            {
                id: "whatsapp",
                meta: {
                    id: "whatsapp",
                    label: "WhatsApp",
                    selectionLabel: "WhatsApp",
                    docsPath: "/platforms/whatsapp",
                    blurb: "mock",
                },
                config: {
                    listAccountIds: function () { return ["default"]; },
                    resolveAccount: function () { return ({}); },
                },
                status: {
                    buildChannelSummary: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ linked: true, authAgeMs: 5000 })];
                    }); }); },
                },
            },
            {
                id: "signal",
                meta: {
                    id: "signal",
                    label: "Signal",
                    selectionLabel: "Signal",
                    docsPath: "/platforms/signal",
                    blurb: "mock",
                },
                config: {
                    listAccountIds: function () { return ["default"]; },
                    resolveAccount: function () { return ({}); },
                },
                status: {
                    collectStatusIssues: function (accounts) {
                        return accounts
                            .filter(function (account) { return typeof account.lastError === "string" && account.lastError; })
                            .map(function (account) { return ({
                            channel: "signal",
                            accountId: typeof account.accountId === "string" ? account.accountId : "default",
                            message: "Channel error: ".concat(String(account.lastError)),
                        }); });
                    },
                },
            },
            {
                id: "imessage",
                meta: {
                    id: "imessage",
                    label: "iMessage",
                    selectionLabel: "iMessage",
                    docsPath: "/platforms/mac",
                    blurb: "mock",
                },
                config: {
                    listAccountIds: function () { return ["default"]; },
                    resolveAccount: function () { return ({}); },
                },
                status: {
                    collectStatusIssues: function (accounts) {
                        return accounts
                            .filter(function (account) { return typeof account.lastError === "string" && account.lastError; })
                            .map(function (account) { return ({
                            channel: "imessage",
                            accountId: typeof account.accountId === "string" ? account.accountId : "default",
                            message: "Channel error: ".concat(String(account.lastError)),
                        }); });
                    },
                },
            },
        ];
    },
}); });
vitest_1.vi.mock("../web/session.js", function () { return ({
    webAuthExists: mocks.webAuthExists,
    getWebAuthAgeMs: mocks.getWebAuthAgeMs,
    readWebSelfId: mocks.readWebSelfId,
    logWebSelfId: mocks.logWebSelfId,
}); });
vitest_1.vi.mock("../gateway/probe.js", function () { return ({
    probeGateway: mocks.probeGateway,
}); });
vitest_1.vi.mock("../gateway/call.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { callGateway: mocks.callGateway })];
        }
    });
}); });
vitest_1.vi.mock("../gateway/session-utils.js", function () { return ({
    listAgentsForGateway: mocks.listAgentsForGateway,
}); });
vitest_1.vi.mock("../infra/openclaw-root.js", function () { return ({
    resolveOpenClawPackageRoot: vitest_1.vi.fn().mockResolvedValue("/tmp/openclaw"),
}); });
vitest_1.vi.mock("../infra/os-summary.js", function () { return ({
    resolveOsSummary: function () { return ({
        platform: "darwin",
        arch: "arm64",
        release: "23.0.0",
        label: "macos 14.0 (arm64)",
    }); },
}); });
vitest_1.vi.mock("../infra/update-check.js", function () { return ({
    checkUpdateStatus: vitest_1.vi.fn().mockResolvedValue({
        root: "/tmp/openclaw",
        installKind: "git",
        packageManager: "pnpm",
        git: {
            root: "/tmp/openclaw",
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
            lockfilePath: "/tmp/openclaw/pnpm-lock.yaml",
            markerPath: "/tmp/openclaw/node_modules/.modules.yaml",
        },
        registry: { latestVersion: "0.0.0" },
    }),
    compareSemverStrings: vitest_1.vi.fn(function () { return 0; }),
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({ session: {} }); } })];
        }
    });
}); });
vitest_1.vi.mock("../daemon/service.js", function () { return ({
    resolveGatewayService: function () { return ({
        label: "LaunchAgent",
        loadedText: "loaded",
        notLoadedText: "not loaded",
        isLoaded: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, true];
        }); }); },
        readRuntime: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ status: "running", pid: 1234 })];
        }); }); },
        readCommand: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        programArguments: ["node", "dist/entry.js", "gateway"],
                        sourcePath: "/tmp/Library/LaunchAgents/bot.molt.gateway.plist",
                    })];
            });
        }); },
    }); },
}); });
vitest_1.vi.mock("../daemon/node-service.js", function () { return ({
    resolveNodeService: function () { return ({
        label: "LaunchAgent",
        loadedText: "loaded",
        notLoadedText: "not loaded",
        isLoaded: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, true];
        }); }); },
        readRuntime: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ status: "running", pid: 4321 })];
        }); }); },
        readCommand: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        programArguments: ["node", "dist/entry.js", "node-host"],
                        sourcePath: "/tmp/Library/LaunchAgents/bot.molt.node.plist",
                    })];
            });
        }); },
    }); },
}); });
vitest_1.vi.mock("../security/audit.js", function () { return ({
    runSecurityAudit: mocks.runSecurityAudit,
}); });
var status_js_1 = require("./status.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
(0, vitest_1.describe)("statusCommand", function () {
    (0, vitest_1.it)("prints JSON when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, status_js_1.statusCommand)({ json: true }, runtime)];
                case 1:
                    _a.sent();
                    payload = JSON.parse(runtime.log.mock.calls[0][0]);
                    (0, vitest_1.expect)(payload.linkChannel.linked).toBe(true);
                    (0, vitest_1.expect)(payload.memory.agentId).toBe("main");
                    (0, vitest_1.expect)(payload.memoryPlugin.enabled).toBe(true);
                    (0, vitest_1.expect)(payload.memoryPlugin.slot).toBe("memory-core");
                    (0, vitest_1.expect)(payload.memory.vector.available).toBe(true);
                    (0, vitest_1.expect)(payload.sessions.count).toBe(1);
                    (0, vitest_1.expect)(payload.sessions.paths).toContain("/tmp/sessions.json");
                    (0, vitest_1.expect)(payload.sessions.defaults.model).toBeTruthy();
                    (0, vitest_1.expect)(payload.sessions.defaults.contextTokens).toBeGreaterThan(0);
                    (0, vitest_1.expect)(payload.sessions.recent[0].percentUsed).toBe(50);
                    (0, vitest_1.expect)(payload.sessions.recent[0].remainingTokens).toBe(5000);
                    (0, vitest_1.expect)(payload.sessions.recent[0].flags).toContain("verbose:on");
                    (0, vitest_1.expect)(payload.securityAudit.summary.critical).toBe(1);
                    (0, vitest_1.expect)(payload.securityAudit.summary.warn).toBe(1);
                    (0, vitest_1.expect)(payload.gatewayService.label).toBe("LaunchAgent");
                    (0, vitest_1.expect)(payload.nodeService.label).toBe("LaunchAgent");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints formatted lines otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime.log.mockClear();
                    return [4 /*yield*/, (0, status_js_1.statusCommand)({}, runtime)];
                case 1:
                    _a.sent();
                    logs = runtime.log.mock.calls.map(function (c) { return String(c[0]); });
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("OpenClaw status"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Overview"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Security audit"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Summary:"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("CRITICAL"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Dashboard"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("macos 14.0 (arm64)"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Memory"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Channels"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("WhatsApp"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Sessions"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("+1000"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("50%"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("LaunchAgent"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("FAQ:"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Troubleshooting:"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("Next steps:"); })).toBe(true);
                    (0, vitest_1.expect)(logs.some(function (l) {
                        return l.includes("openclaw status --all") ||
                            l.includes("openclaw --profile isolated status --all") ||
                            l.includes("openclaw status --all") ||
                            l.includes("openclaw --profile isolated status --all");
                    })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows gateway auth when reachable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevToken, logs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                    process.env.OPENCLAW_GATEWAY_TOKEN = "abcd1234";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    mocks.probeGateway.mockResolvedValueOnce({
                        ok: true,
                        url: "ws://127.0.0.1:18789",
                        connectLatencyMs: 123,
                        error: null,
                        close: null,
                        health: {},
                        status: {},
                        presence: [],
                        configSnapshot: null,
                    });
                    runtime.log.mockClear();
                    return [4 /*yield*/, (0, status_js_1.statusCommand)({}, runtime)];
                case 2:
                    _a.sent();
                    logs = runtime.log.mock.calls.map(function (c) { return String(c[0]); });
                    (0, vitest_1.expect)(logs.some(function (l) { return l.includes("auth token"); })).toBe(true);
                    return [3 /*break*/, 4];
                case 3:
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("surfaces channel runtime errors from the gateway", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.probeGateway.mockResolvedValueOnce({
                        ok: true,
                        url: "ws://127.0.0.1:18789",
                        connectLatencyMs: 10,
                        error: null,
                        close: null,
                        health: {},
                        status: {},
                        presence: [],
                        configSnapshot: null,
                    });
                    mocks.callGateway.mockResolvedValueOnce({
                        channelAccounts: {
                            signal: [
                                {
                                    accountId: "default",
                                    enabled: true,
                                    configured: true,
                                    running: false,
                                    lastError: "signal-cli unreachable",
                                },
                            ],
                            imessage: [
                                {
                                    accountId: "default",
                                    enabled: true,
                                    configured: true,
                                    running: false,
                                    lastError: "imessage permission denied",
                                },
                            ],
                        },
                    });
                    runtime.log.mockClear();
                    return [4 /*yield*/, (0, status_js_1.statusCommand)({}, runtime)];
                case 1:
                    _a.sent();
                    logs = runtime.log.mock.calls.map(function (c) { return String(c[0]); });
                    (0, vitest_1.expect)(logs.join("\n")).toMatch(/Signal/i);
                    (0, vitest_1.expect)(logs.join("\n")).toMatch(/iMessage/i);
                    (0, vitest_1.expect)(logs.join("\n")).toMatch(/gateway:/i);
                    (0, vitest_1.expect)(logs.join("\n")).toMatch(/WARN/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes sessions across agents in JSON output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalAgents, originalResolveStorePath, originalLoadSessionStore, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalAgents = mocks.listAgentsForGateway.getMockImplementation();
                    originalResolveStorePath = mocks.resolveStorePath.getMockImplementation();
                    originalLoadSessionStore = mocks.loadSessionStore.getMockImplementation();
                    mocks.listAgentsForGateway.mockReturnValue({
                        defaultId: "main",
                        mainKey: "agent:main:main",
                        scope: "per-sender",
                        agents: [
                            { id: "main", name: "Main" },
                            { id: "ops", name: "Ops" },
                        ],
                    });
                    mocks.resolveStorePath.mockImplementation(function (_store, opts) {
                        return (opts === null || opts === void 0 ? void 0 : opts.agentId) === "ops" ? "/tmp/ops.json" : "/tmp/main.json";
                    });
                    mocks.loadSessionStore.mockImplementation(function (storePath) {
                        if (storePath === "/tmp/ops.json") {
                            return {
                                "agent:ops:main": {
                                    updatedAt: Date.now() - 120000,
                                    inputTokens: 1000,
                                    outputTokens: 1000,
                                    contextTokens: 10000,
                                    model: "pi:opus",
                                },
                            };
                        }
                        return {
                            "+1000": {
                                updatedAt: Date.now() - 60000,
                                verboseLevel: "on",
                                thinkingLevel: "low",
                                inputTokens: 2000,
                                outputTokens: 3000,
                                contextTokens: 10000,
                                model: "pi:opus",
                                sessionId: "abc123",
                                systemSent: true,
                            },
                        };
                    });
                    return [4 /*yield*/, (0, status_js_1.statusCommand)({ json: true }, runtime)];
                case 1:
                    _b.sent();
                    payload = JSON.parse((_a = runtime.log.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0]);
                    (0, vitest_1.expect)(payload.sessions.count).toBe(2);
                    (0, vitest_1.expect)(payload.sessions.paths.length).toBe(2);
                    (0, vitest_1.expect)(payload.sessions.recent.some(function (sess) { return sess.key === "agent:ops:main"; })).toBe(true);
                    if (originalAgents) {
                        mocks.listAgentsForGateway.mockImplementation(originalAgents);
                    }
                    if (originalResolveStorePath) {
                        mocks.resolveStorePath.mockImplementation(originalResolveStorePath);
                    }
                    if (originalLoadSessionStore) {
                        mocks.loadSessionStore.mockImplementation(originalLoadSessionStore);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
