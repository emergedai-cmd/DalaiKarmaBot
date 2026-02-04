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
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGatewayMock(opts); },
}); });
var configOverride = {
    session: {
        mainKey: "main",
        scope: "per-sender",
    },
};
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return configOverride; }, resolveGatewayPort: function () { return 18789; } })];
        }
    });
}); });
var agent_events_js_1 = require("../infra/agent-events.js");
require("./test-helpers/fast-core-tools.js");
var utils_js_1 = require("../utils.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
var subagent_registry_js_1 = require("./subagent-registry.js");
(0, vitest_1.describe)("openclaw-tools: subagents", function () {
    (0, vitest_1.beforeEach)(function () {
        configOverride = {
            session: {
                mainKey: "main",
                scope: "per-sender",
            },
        };
    });
    (0, vitest_1.it)("sessions_spawn normalizes allowlisted agent ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var childSessionKey, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    configOverride = {
                        session: {
                            mainKey: "main",
                            scope: "per-sender",
                        },
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    subagents: {
                                        allowAgents: ["Research"],
                                    },
                                },
                            ],
                        },
                    };
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, params;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "agent") {
                                params = request.params;
                                childSessionKey = params === null || params === void 0 ? void 0 : params.sessionKey;
                                return [2 /*return*/, { runId: "run-1", status: "accepted", acceptedAt: 5200 }];
                            }
                            if (request.method === "agent.wait") {
                                return [2 /*return*/, { status: "timeout" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "whatsapp",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call10", {
                            task: "do thing",
                            agentId: "research",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                    });
                    (0, vitest_1.expect)(childSessionKey === null || childSessionKey === void 0 ? void 0 : childSessionKey.startsWith("agent:research:subagent:")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn forbids cross-agent spawning when not allowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    configOverride = {
                        session: {
                            mainKey: "main",
                            scope: "per-sender",
                        },
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    subagents: {
                                        allowAgents: ["alpha"],
                                    },
                                },
                            ],
                        },
                    };
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "whatsapp",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call9", {
                            task: "do thing",
                            agentId: "beta",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "forbidden",
                    });
                    (0, vitest_1.expect)(callGatewayMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn runs cleanup via lifecycle events", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, agentCallCount, deletedKey, childRunId, childSessionKey, waitCalls, tool, result, childWait, agentCalls, first, second, sendCalls;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    calls = [];
                    agentCallCount = 0;
                    waitCalls = [];
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, runId, params, params, params;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "agent") {
                                agentCallCount += 1;
                                runId = "run-".concat(agentCallCount);
                                params = request.params;
                                if ((params === null || params === void 0 ? void 0 : params.lane) === "subagent") {
                                    childRunId = runId;
                                    childSessionKey = (_a = params === null || params === void 0 ? void 0 : params.sessionKey) !== null && _a !== void 0 ? _a : "";
                                    (0, vitest_1.expect)(params === null || params === void 0 ? void 0 : params.channel).toBe("discord");
                                    (0, vitest_1.expect)(params === null || params === void 0 ? void 0 : params.timeout).toBe(1);
                                }
                                return [2 /*return*/, {
                                        runId: runId,
                                        status: "accepted",
                                        acceptedAt: 1000 + agentCallCount,
                                    }];
                            }
                            if (request.method === "agent.wait") {
                                params = request.params;
                                waitCalls.push(params !== null && params !== void 0 ? params : {});
                                return [2 /*return*/, {
                                        runId: (_b = params === null || params === void 0 ? void 0 : params.runId) !== null && _b !== void 0 ? _b : "run-1",
                                        status: "ok",
                                        startedAt: 1000,
                                        endedAt: 2000,
                                    }];
                            }
                            if (request.method === "sessions.delete") {
                                params = request.params;
                                deletedKey = params === null || params === void 0 ? void 0 : params.key;
                                return [2 /*return*/, { ok: true }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "discord:group:req",
                        agentChannel: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {
                            task: "do thing",
                            runTimeoutSeconds: 1,
                            cleanup: "delete",
                        })];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                    });
                    if (!childRunId) {
                        throw new Error("missing child runId");
                    }
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: childRunId,
                        stream: "lifecycle",
                        data: {
                            phase: "end",
                            startedAt: 1234,
                            endedAt: 2345,
                        },
                    });
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 4:
                    _d.sent();
                    childWait = waitCalls.find(function (call) { return call.runId === childRunId; });
                    (0, vitest_1.expect)(childWait === null || childWait === void 0 ? void 0 : childWait.timeoutMs).toBe(1000);
                    agentCalls = calls.filter(function (call) { return call.method === "agent"; });
                    (0, vitest_1.expect)(agentCalls).toHaveLength(2);
                    first = (_a = agentCalls[0]) === null || _a === void 0 ? void 0 : _a.params;
                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.lane).toBe("subagent");
                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.deliver).toBe(false);
                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.channel).toBe("discord");
                    (0, vitest_1.expect)((_b = first === null || first === void 0 ? void 0 : first.sessionKey) === null || _b === void 0 ? void 0 : _b.startsWith("agent:main:subagent:")).toBe(true);
                    (0, vitest_1.expect)(childSessionKey === null || childSessionKey === void 0 ? void 0 : childSessionKey.startsWith("agent:main:subagent:")).toBe(true);
                    second = (_c = agentCalls[1]) === null || _c === void 0 ? void 0 : _c.params;
                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.sessionKey).toBe("discord:group:req");
                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.deliver).toBe(true);
                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.message).toContain("background task");
                    sendCalls = calls.filter(function (c) { return c.method === "send"; });
                    (0, vitest_1.expect)(sendCalls.length).toBe(0);
                    (0, vitest_1.expect)(deletedKey === null || deletedKey === void 0 ? void 0 : deletedKey.startsWith("agent:main:subagent:")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn announces with requester accountId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, agentCallCount, childRunId, tool, result, agentCalls, announceParams;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    calls = [];
                    agentCallCount = 0;
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, runId, params, params;
                        var _a;
                        return __generator(this, function (_b) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "agent") {
                                agentCallCount += 1;
                                runId = "run-".concat(agentCallCount);
                                params = request.params;
                                if ((params === null || params === void 0 ? void 0 : params.lane) === "subagent") {
                                    childRunId = runId;
                                }
                                return [2 /*return*/, {
                                        runId: runId,
                                        status: "accepted",
                                        acceptedAt: 4000 + agentCallCount,
                                    }];
                            }
                            if (request.method === "agent.wait") {
                                params = request.params;
                                return [2 /*return*/, {
                                        runId: (_a = params === null || params === void 0 ? void 0 : params.runId) !== null && _a !== void 0 ? _a : "run-1",
                                        status: "ok",
                                        startedAt: 1000,
                                        endedAt: 2000,
                                    }];
                            }
                            if (request.method === "sessions.delete" || request.method === "sessions.patch") {
                                return [2 /*return*/, { ok: true }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "whatsapp",
                        agentAccountId: "kev",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call2", {
                            task: "do thing",
                            runTimeoutSeconds: 1,
                            cleanup: "keep",
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                    });
                    if (!childRunId) {
                        throw new Error("missing child runId");
                    }
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: childRunId,
                        stream: "lifecycle",
                        data: {
                            phase: "end",
                            startedAt: 1000,
                            endedAt: 2000,
                        },
                    });
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 4:
                    _b.sent();
                    agentCalls = calls.filter(function (call) { return call.method === "agent"; });
                    (0, vitest_1.expect)(agentCalls).toHaveLength(2);
                    announceParams = (_a = agentCalls[1]) === null || _a === void 0 ? void 0 : _a.params;
                    (0, vitest_1.expect)(announceParams === null || announceParams === void 0 ? void 0 : announceParams.deliver).toBe(true);
                    (0, vitest_1.expect)(announceParams === null || announceParams === void 0 ? void 0 : announceParams.channel).toBe("whatsapp");
                    (0, vitest_1.expect)(announceParams === null || announceParams === void 0 ? void 0 : announceParams.accountId).toBe("kev");
                    return [2 /*return*/];
            }
        });
    }); });
});
