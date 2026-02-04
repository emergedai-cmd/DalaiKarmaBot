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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var openclaw_tools_js_1 = require("../agents/openclaw-tools.js");
var sessions_js_1 = require("../config/sessions.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var gatewayPort;
var prevGatewayPort;
var prevGatewayToken;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prevGatewayPort = process.env.OPENCLAW_GATEWAY_PORT;
                prevGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
            case 1:
                gatewayPort = _a.sent();
                process.env.OPENCLAW_GATEWAY_PORT = String(gatewayPort);
                process.env.OPENCLAW_GATEWAY_TOKEN = "test-token";
                return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(gatewayPort)];
            case 2:
                server = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                if (prevGatewayPort === undefined) {
                    delete process.env.OPENCLAW_GATEWAY_PORT;
                }
                else {
                    process.env.OPENCLAW_GATEWAY_PORT = prevGatewayPort;
                }
                if (prevGatewayToken === undefined) {
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                }
                else {
                    process.env.OPENCLAW_GATEWAY_TOKEN = prevGatewayToken;
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("sessions_send gateway loopback", function () {
    (0, vitest_1.it)("returns reply when lifecycle ends before agent.wait", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, tool, result, details, firstCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    spy.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var params, sessionId, runId, sessionFile, startedAt, text, message;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    params = opts;
                                    sessionId = (_a = params.sessionId) !== null && _a !== void 0 ? _a : "main";
                                    runId = (_b = params.runId) !== null && _b !== void 0 ? _b : sessionId;
                                    sessionFile = (0, sessions_js_1.resolveSessionTranscriptPath)(sessionId);
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(sessionFile), { recursive: true })];
                                case 1:
                                    _e.sent();
                                    startedAt = Date.now();
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: runId,
                                        stream: "lifecycle",
                                        data: { phase: "start", startedAt: startedAt },
                                    });
                                    text = "pong";
                                    if ((_c = params.extraSystemPrompt) === null || _c === void 0 ? void 0 : _c.includes("Agent-to-agent reply step")) {
                                        text = "REPLY_SKIP";
                                    }
                                    else if ((_d = params.extraSystemPrompt) === null || _d === void 0 ? void 0 : _d.includes("Agent-to-agent announce step")) {
                                        text = "ANNOUNCE_SKIP";
                                    }
                                    message = {
                                        role: "assistant",
                                        content: [{ type: "text", text: text }],
                                        timestamp: Date.now(),
                                    };
                                    return [4 /*yield*/, promises_1.default.appendFile(sessionFile, "".concat(JSON.stringify({ message: message }), "\n"), "utf8")];
                                case 2:
                                    _e.sent();
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: runId,
                                        stream: "lifecycle",
                                        data: {
                                            phase: "end",
                                            startedAt: startedAt,
                                            endedAt: Date.now(),
                                        },
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_send"; });
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call-loopback", {
                            sessionKey: "main",
                            message: "ping",
                            timeoutSeconds: 5,
                        })];
                case 1:
                    result = _b.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("ok");
                    (0, vitest_1.expect)(details.reply).toBe("pong");
                    (0, vitest_1.expect)(details.sessionKey).toBe("main");
                    firstCall = (_a = spy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(firstCall === null || firstCall === void 0 ? void 0 : firstCall.lane).toBe("nested");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("sessions_send label lookup", function () {
    (0, vitest_1.it)("finds session by label and sends message", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, callGateway, tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = vitest_1.vi.mocked(test_helpers_js_1.agentCommand);
                    spy.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var params, sessionId, runId, sessionFile, startedAt, text, message;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    params = opts;
                                    sessionId = (_a = params.sessionId) !== null && _a !== void 0 ? _a : "test-labeled";
                                    runId = (_b = params.runId) !== null && _b !== void 0 ? _b : sessionId;
                                    sessionFile = (0, sessions_js_1.resolveSessionTranscriptPath)(sessionId);
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(sessionFile), { recursive: true })];
                                case 1:
                                    _c.sent();
                                    startedAt = Date.now();
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: runId,
                                        stream: "lifecycle",
                                        data: { phase: "start", startedAt: startedAt },
                                    });
                                    text = "labeled response";
                                    message = {
                                        role: "assistant",
                                        content: [{ type: "text", text: text }],
                                    };
                                    return [4 /*yield*/, promises_1.default.appendFile(sessionFile, "".concat(JSON.stringify({ message: message }), "\n"), "utf8")];
                                case 2:
                                    _c.sent();
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: runId,
                                        stream: "lifecycle",
                                        data: { phase: "end", startedAt: startedAt, endedAt: Date.now() },
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./call.js"); })];
                case 1:
                    callGateway = (_a.sent()).callGateway;
                    return [4 /*yield*/, callGateway({
                            method: "sessions.patch",
                            params: { key: "test-labeled-session", label: "my-test-worker" },
                            timeoutMs: 5000,
                        })];
                case 2:
                    _a.sent();
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_send"; });
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call-by-label", {
                            label: "my-test-worker",
                            message: "hello labeled session",
                            timeoutSeconds: 5,
                        })];
                case 3:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("ok");
                    (0, vitest_1.expect)(details.reply).toBe("labeled response");
                    (0, vitest_1.expect)(details.sessionKey).toBe("agent:main:test-labeled-session");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error when label not found", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_send"; });
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call-missing-label", {
                            label: "nonexistent-label",
                            message: "hello",
                            timeoutSeconds: 5,
                        })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("error");
                    (0, vitest_1.expect)(details.error).toContain("No session found with label");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error when neither sessionKey nor label provided", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, details;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "sessions_send"; });
                    if (!tool) {
                        throw new Error("missing sessions_send tool");
                    }
                    return [4 /*yield*/, tool.execute("call-no-key", {
                            message: "hello",
                            timeoutSeconds: 5,
                        })];
                case 1:
                    result = _a.sent();
                    details = result.details;
                    (0, vitest_1.expect)(details.status).toBe("error");
                    (0, vitest_1.expect)(details.error).toContain("Either sessionKey or label is required");
                    return [2 /*return*/];
            }
        });
    }); });
});
