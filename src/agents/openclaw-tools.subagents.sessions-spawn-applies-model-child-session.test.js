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
require("./test-helpers/fast-core-tools.js");
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
    (0, vitest_1.it)("sessions_spawn applies a model to the child session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, agentCallCount, tool, result, patchIndex, agentIndex, patchCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    calls = [];
                    agentCallCount = 0;
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, runId;
                        return __generator(this, function (_a) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "sessions.patch") {
                                return [2 /*return*/, { ok: true }];
                            }
                            if (request.method === "agent") {
                                agentCallCount += 1;
                                runId = "run-".concat(agentCallCount);
                                return [2 /*return*/, {
                                        runId: runId,
                                        status: "accepted",
                                        acceptedAt: 3000 + agentCallCount,
                                    }];
                            }
                            if (request.method === "agent.wait") {
                                return [2 /*return*/, { status: "timeout" }];
                            }
                            if (request.method === "sessions.delete") {
                                return [2 /*return*/, { ok: true }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "discord:group:req",
                        agentSurface: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call3", {
                            task: "do thing",
                            runTimeoutSeconds: 1,
                            model: "claude-haiku-4-5",
                            cleanup: "keep",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        modelApplied: true,
                    });
                    patchIndex = calls.findIndex(function (call) { return call.method === "sessions.patch"; });
                    agentIndex = calls.findIndex(function (call) { return call.method === "agent"; });
                    (0, vitest_1.expect)(patchIndex).toBeGreaterThan(-1);
                    (0, vitest_1.expect)(agentIndex).toBeGreaterThan(-1);
                    (0, vitest_1.expect)(patchIndex).toBeLessThan(agentIndex);
                    patchCall = calls[patchIndex];
                    (0, vitest_1.expect)(patchCall === null || patchCall === void 0 ? void 0 : patchCall.params).toMatchObject({
                        key: vitest_1.expect.stringContaining("subagent:"),
                        model: "claude-haiku-4-5",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn forwards thinking overrides to the agent run", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, tool, result, agentCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    calls = [];
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "agent") {
                                return [2 /*return*/, { runId: "run-thinking", status: "accepted" }];
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
                    return [4 /*yield*/, tool.execute("call-thinking", {
                            task: "do thing",
                            thinking: "high",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                    });
                    agentCall = calls.find(function (call) { return call.method === "agent"; });
                    (0, vitest_1.expect)(agentCall === null || agentCall === void 0 ? void 0 : agentCall.params).toMatchObject({
                        thinking: "high",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn rejects invalid thinking levels", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, tool, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    calls = [];
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            calls.push(request);
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
                    return [4 /*yield*/, tool.execute("call-thinking-invalid", {
                            task: "do thing",
                            thinking: "banana",
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "error",
                    });
                    (0, vitest_1.expect)(String((_a = result.details) === null || _a === void 0 ? void 0 : _a.error)).toMatch(/Invalid thinking level/i);
                    (0, vitest_1.expect)(calls).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn applies default subagent model from defaults config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, tool, result, patchCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    configOverride = {
                        session: { mainKey: "main", scope: "per-sender" },
                        agents: { defaults: { subagents: { model: "minimax/MiniMax-M2.1" } } },
                    };
                    calls = [];
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request;
                        return __generator(this, function (_a) {
                            request = opts;
                            calls.push(request);
                            if (request.method === "sessions.patch") {
                                return [2 /*return*/, { ok: true }];
                            }
                            if (request.method === "agent") {
                                return [2 /*return*/, { runId: "run-default-model", status: "accepted" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "agent:main:main",
                        agentChannel: "discord",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call-default-model", {
                            task: "do thing",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        modelApplied: true,
                    });
                    patchCall = calls.find(function (call) { return call.method === "sessions.patch"; });
                    (0, vitest_1.expect)(patchCall === null || patchCall === void 0 ? void 0 : patchCall.params).toMatchObject({
                        model: "minimax/MiniMax-M2.1",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
