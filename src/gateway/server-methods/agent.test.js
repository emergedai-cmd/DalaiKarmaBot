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
var agent_js_1 = require("./agent.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    loadSessionEntry: vitest_1.vi.fn(),
    updateSessionStore: vitest_1.vi.fn(),
    agentCommand: vitest_1.vi.fn(),
    registerAgentRunContext: vitest_1.vi.fn(),
    loadConfigReturn: {},
}); });
vitest_1.vi.mock("../session-utils.js", function () { return ({
    loadSessionEntry: mocks.loadSessionEntry,
}); });
vitest_1.vi.mock("../../config/sessions.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../config/sessions.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { updateSessionStore: mocks.updateSessionStore, resolveAgentIdFromSessionKey: function () { return "main"; }, resolveExplicitAgentSessionKey: function () { return undefined; }, resolveAgentMainSessionKey: function () { return "agent:main:main"; } })];
        }
    });
}); });
vitest_1.vi.mock("../../commands/agent.js", function () { return ({
    agentCommand: mocks.agentCommand,
}); });
vitest_1.vi.mock("../../config/config.js", function () { return ({
    loadConfig: function () { return mocks.loadConfigReturn; },
}); });
vitest_1.vi.mock("../../agents/agent-scope.js", function () { return ({
    listAgentIds: function () { return ["main"]; },
}); });
vitest_1.vi.mock("../../infra/agent-events.js", function () { return ({
    registerAgentRunContext: mocks.registerAgentRunContext,
    onAgentEvent: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../../sessions/send-policy.js", function () { return ({
    resolveSendPolicy: function () { return "allow"; },
}); });
vitest_1.vi.mock("../../utils/delivery-context.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../utils/delivery-context.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { normalizeSessionDeliveryFields: function () { return ({}); } })];
        }
    });
}); });
var makeContext = function () {
    return ({
        dedupe: new Map(),
        addChatRun: vitest_1.vi.fn(),
        logGateway: { info: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
    });
};
(0, vitest_1.describe)("gateway agent handler", function () {
    (0, vitest_1.it)("preserves cliSessionIds from existing session entry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingCliSessionIds, existingClaudeCliSessionId, capturedEntry, respond;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingCliSessionIds = { "claude-cli": "abc-123-def" };
                    existingClaudeCliSessionId = "abc-123-def";
                    mocks.loadSessionEntry.mockReturnValue({
                        cfg: {},
                        storePath: "/tmp/sessions.json",
                        entry: {
                            sessionId: "existing-session-id",
                            updatedAt: Date.now(),
                            cliSessionIds: existingCliSessionIds,
                            claudeCliSessionId: existingClaudeCliSessionId,
                        },
                        canonicalKey: "agent:main:main",
                    });
                    mocks.updateSessionStore.mockImplementation(function (_path, updater) { return __awaiter(void 0, void 0, void 0, function () {
                        var store;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = {};
                                    return [4 /*yield*/, updater(store)];
                                case 1:
                                    _a.sent();
                                    capturedEntry = store["agent:main:main"];
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    mocks.agentCommand.mockResolvedValue({
                        payloads: [{ text: "ok" }],
                        meta: { durationMs: 100 },
                    });
                    respond = vitest_1.vi.fn();
                    return [4 /*yield*/, agent_js_1.agentHandlers.agent({
                            params: {
                                message: "test",
                                agentId: "main",
                                sessionKey: "agent:main:main",
                                idempotencyKey: "test-idem",
                            },
                            respond: respond,
                            context: makeContext(),
                            req: { type: "req", id: "1", method: "agent" },
                            client: null,
                            isWebchatConnect: function () { return false; },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.updateSessionStore).toHaveBeenCalled();
                    (0, vitest_1.expect)(capturedEntry).toBeDefined();
                    (0, vitest_1.expect)(capturedEntry === null || capturedEntry === void 0 ? void 0 : capturedEntry.cliSessionIds).toEqual(existingCliSessionIds);
                    (0, vitest_1.expect)(capturedEntry === null || capturedEntry === void 0 ? void 0 : capturedEntry.claudeCliSessionId).toBe(existingClaudeCliSessionId);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("injects a timestamp into the message passed to agentCommand", function () { return __awaiter(void 0, void 0, void 0, function () {
        var respond, callArgs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date("2026-01-29T01:30:00.000Z")); // Wed Jan 28, 8:30 PM EST
                    mocks.agentCommand.mockReset();
                    mocks.loadConfigReturn = {
                        agents: {
                            defaults: {
                                userTimezone: "America/New_York",
                            },
                        },
                    };
                    mocks.loadSessionEntry.mockReturnValue({
                        cfg: mocks.loadConfigReturn,
                        storePath: "/tmp/sessions.json",
                        entry: {
                            sessionId: "existing-session-id",
                            updatedAt: Date.now(),
                        },
                        canonicalKey: "agent:main:main",
                    });
                    mocks.updateSessionStore.mockResolvedValue(undefined);
                    mocks.agentCommand.mockResolvedValue({
                        payloads: [{ text: "ok" }],
                        meta: { durationMs: 100 },
                    });
                    respond = vitest_1.vi.fn();
                    return [4 /*yield*/, agent_js_1.agentHandlers.agent({
                            params: {
                                message: "Is it the weekend?",
                                agentId: "main",
                                sessionKey: "agent:main:main",
                                idempotencyKey: "test-timestamp-inject",
                            },
                            respond: respond,
                            context: makeContext(),
                            req: { type: "req", id: "ts-1", method: "agent" },
                            client: null,
                            isWebchatConnect: function () { return false; },
                        })];
                case 1:
                    _a.sent();
                    // Wait for the async agentCommand call
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(mocks.agentCommand).toHaveBeenCalled(); })];
                case 2:
                    // Wait for the async agentCommand call
                    _a.sent();
                    callArgs = mocks.agentCommand.mock.calls[0][0];
                    (0, vitest_1.expect)(callArgs.message).toBe("[Wed 2026-01-28 20:30 EST] Is it the weekend?");
                    mocks.loadConfigReturn = {};
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles missing cliSessionIds gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedEntry, respond;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.loadSessionEntry.mockReturnValue({
                        cfg: {},
                        storePath: "/tmp/sessions.json",
                        entry: {
                            sessionId: "existing-session-id",
                            updatedAt: Date.now(),
                            // No cliSessionIds or claudeCliSessionId
                        },
                        canonicalKey: "agent:main:main",
                    });
                    mocks.updateSessionStore.mockImplementation(function (_path, updater) { return __awaiter(void 0, void 0, void 0, function () {
                        var store;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    store = {};
                                    return [4 /*yield*/, updater(store)];
                                case 1:
                                    _a.sent();
                                    capturedEntry = store["agent:main:main"];
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    mocks.agentCommand.mockResolvedValue({
                        payloads: [{ text: "ok" }],
                        meta: { durationMs: 100 },
                    });
                    respond = vitest_1.vi.fn();
                    return [4 /*yield*/, agent_js_1.agentHandlers.agent({
                            params: {
                                message: "test",
                                agentId: "main",
                                sessionKey: "agent:main:main",
                                idempotencyKey: "test-idem-2",
                            },
                            respond: respond,
                            context: makeContext(),
                            req: { type: "req", id: "2", method: "agent" },
                            client: null,
                            isWebchatConnect: function () { return false; },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.updateSessionStore).toHaveBeenCalled();
                    (0, vitest_1.expect)(capturedEntry).toBeDefined();
                    // Should be undefined, not cause an error
                    (0, vitest_1.expect)(capturedEntry === null || capturedEntry === void 0 ? void 0 : capturedEntry.cliSessionIds).toBeUndefined();
                    (0, vitest_1.expect)(capturedEntry === null || capturedEntry === void 0 ? void 0 : capturedEntry.claudeCliSessionId).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
