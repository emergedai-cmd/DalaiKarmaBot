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
var loadSessionStoreMock = vitest_1.vi.fn();
var updateSessionStoreMock = vitest_1.vi.fn();
vitest_1.vi.mock("../config/sessions.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadSessionStore: function (storePath) { return loadSessionStoreMock(storePath); }, updateSessionStore: function (storePath, mutator) { return __awaiter(void 0, void 0, void 0, function () {
                            var store;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        store = loadSessionStoreMock(storePath);
                                        return [4 /*yield*/, mutator(store)];
                                    case 1:
                                        _a.sent();
                                        updateSessionStoreMock(storePath, store);
                                        return [2 /*return*/, store];
                                }
                            });
                        }); }, resolveStorePath: function (_store, opts) {
                            return (opts === null || opts === void 0 ? void 0 : opts.agentId) === "support" ? "/tmp/support/sessions.json" : "/tmp/main/sessions.json";
                        } })];
        }
    });
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({
                            session: { mainKey: "main", scope: "per-sender" },
                            agents: {
                                defaults: {
                                    model: { primary: "anthropic/claude-opus-4-5" },
                                    models: {},
                                },
                            },
                        }); } })];
        }
    });
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
                    {
                        provider: "anthropic",
                        id: "claude-opus-4-5",
                        name: "Opus",
                        contextWindow: 200000,
                    },
                    {
                        provider: "anthropic",
                        id: "claude-sonnet-4-5",
                        name: "Sonnet",
                        contextWindow: 200000,
                    },
                ]];
        });
    }); },
}); });
vitest_1.vi.mock("../agents/auth-profiles.js", function () { return ({
    ensureAuthProfileStore: function () { return ({ profiles: {} }); },
    resolveAuthProfileDisplayLabel: function () { return undefined; },
    resolveAuthProfileOrder: function () { return []; },
}); });
vitest_1.vi.mock("../agents/model-auth.js", function () { return ({
    resolveEnvApiKey: function () { return null; },
    getCustomProviderApiKey: function () { return null; },
    resolveModelAuthMode: function () { return "api-key"; },
}); });
vitest_1.vi.mock("../infra/provider-usage.js", function () { return ({
    resolveUsageProviderId: function () { return undefined; },
    loadProviderUsageSummary: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    updatedAt: Date.now(),
                    providers: [],
                })];
        });
    }); },
    formatUsageSummaryLine: function () { return null; },
}); });
require("./test-helpers/fast-core-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
(0, vitest_1.describe)("session_status tool", function () {
    (0, vitest_1.it)("returns a status card for the current session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    loadSessionStoreMock.mockReturnValue({
                        main: {
                            sessionId: "s1",
                            updatedAt: 10,
                        },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {})];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.ok).toBe(true);
                    (0, vitest_1.expect)(details.statusText).toContain("OpenClaw");
                    (0, vitest_1.expect)(details.statusText).toContain("🧠 Model:");
                    (0, vitest_1.expect)(details.statusText).not.toContain("OAuth/token status");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("errors for unknown session keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    loadSessionStoreMock.mockReturnValue({
                        main: { sessionId: "s1", updatedAt: 10 },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call2", { sessionKey: "nope" })).rejects.toThrow("Unknown sessionId")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(updateSessionStoreMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves sessionId inputs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    sessionId = "sess-main";
                    loadSessionStoreMock.mockReturnValue({
                        "agent:main:main": {
                            sessionId: sessionId,
                            updatedAt: 10,
                        },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, tool.execute("call3", { sessionKey: sessionId })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.ok).toBe(true);
                    (0, vitest_1.expect)(details.sessionKey).toBe("agent:main:main");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses non-standard session keys without sessionId resolution", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    loadSessionStoreMock.mockReturnValue({
                        "temp:slug-generator": {
                            sessionId: "sess-temp",
                            updatedAt: 10,
                        },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, tool.execute("call4", { sessionKey: "temp:slug-generator" })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.ok).toBe(true);
                    (0, vitest_1.expect)(details.sessionKey).toBe("temp:slug-generator");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks cross-agent session_status without agent-to-agent access", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    loadSessionStoreMock.mockReturnValue({
                        "agent:other:main": {
                            sessionId: "s2",
                            updatedAt: 10,
                        },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "agent:main:main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call5", { sessionKey: "agent:other:main" })).rejects.toThrow("Agent-to-agent status is disabled")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("scopes bare session keys to the requester agent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stores, tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    stores = new Map([
                        [
                            "/tmp/main/sessions.json",
                            {
                                "agent:main:main": { sessionId: "s-main", updatedAt: 10 },
                            },
                        ],
                        [
                            "/tmp/support/sessions.json",
                            {
                                main: { sessionId: "s-support", updatedAt: 20 },
                            },
                        ],
                    ]);
                    loadSessionStoreMock.mockImplementation(function (storePath) {
                        var _a;
                        return (_a = stores.get(storePath)) !== null && _a !== void 0 ? _a : {};
                    });
                    updateSessionStoreMock.mockImplementation(function (_storePath, store) {
                        // Keep map in sync for resolveSessionEntry fallbacks if needed.
                        if (_storePath) {
                            stores.set(_storePath, store);
                        }
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "agent:support:main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, tool.execute("call6", { sessionKey: "main" })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.ok).toBe(true);
                    (0, vitest_1.expect)(details.sessionKey).toBe("main");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resets per-session model override via model=default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, _a, savedStore, saved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadSessionStoreMock.mockReset();
                    updateSessionStoreMock.mockReset();
                    loadSessionStoreMock.mockReturnValue({
                        main: {
                            sessionId: "s1",
                            updatedAt: 10,
                            providerOverride: "anthropic",
                            modelOverride: "claude-sonnet-4-5",
                            authProfileOverride: "p1",
                        },
                    });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({ agentSessionKey: "main" }).find(function (candidate) { return candidate.name === "session_status"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing session_status tool");
                    }
                    return [4 /*yield*/, tool.execute("call3", { model: "default" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(updateSessionStoreMock).toHaveBeenCalled();
                    _a = updateSessionStoreMock.mock.calls.at(-1), savedStore = _a[1];
                    saved = savedStore.main;
                    (0, vitest_1.expect)(saved.providerOverride).toBeUndefined();
                    (0, vitest_1.expect)(saved.modelOverride).toBeUndefined();
                    (0, vitest_1.expect)(saved.authProfileOverride).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
