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
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGatewayMock(opts); },
}); });
vitest_1.vi.mock("../agent-scope.js", function () { return ({
    resolveSessionAgentId: function () { return "agent-123"; },
}); });
var cron_tool_js_1 = require("./cron-tool.js");
(0, vitest_1.describe)("cron tool", function () {
    (0, vitest_1.beforeEach)(function () {
        callGatewayMock.mockReset();
        callGatewayMock.mockResolvedValue({ ok: true });
    });
    vitest_1.it.each([
        [
            "update",
            { action: "update", jobId: "job-1", patch: { foo: "bar" } },
            { id: "job-1", patch: { foo: "bar" } },
        ],
        [
            "update",
            { action: "update", id: "job-2", patch: { foo: "bar" } },
            { id: "job-2", patch: { foo: "bar" } },
        ],
        ["remove", { action: "remove", jobId: "job-1" }, { id: "job-1" }],
        ["remove", { action: "remove", id: "job-2" }, { id: "job-2" }],
        ["run", { action: "run", jobId: "job-1" }, { id: "job-1" }],
        ["run", { action: "run", id: "job-2" }, { id: "job-2" }],
        ["runs", { action: "runs", jobId: "job-1" }, { id: "job-1" }],
        ["runs", { action: "runs", id: "job-2" }, { id: "job-2" }],
    ])("%s sends id to gateway", function (action, args, expectedParams) { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, cron_tool_js_1.createCronTool)();
                    return [4 /*yield*/, tool.execute("call1", args)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(1);
                    call = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.method).toBe("cron.".concat(action));
                    (0, vitest_1.expect)(call.params).toEqual(expectedParams);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers jobId over id when both are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, cron_tool_js_1.createCronTool)();
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "run",
                            jobId: "job-primary",
                            id: "job-legacy",
                        })];
                case 1:
                    _b.sent();
                    call = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.params).toEqual({ id: "job-primary" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes cron.add job payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, cron_tool_js_1.createCronTool)();
                    return [4 /*yield*/, tool.execute("call2", {
                            action: "add",
                            job: {
                                data: {
                                    name: "wake-up",
                                    schedule: { atMs: 123 },
                                    payload: { kind: "systemEvent", text: "hello" },
                                },
                            },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(1);
                    call = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.method).toBe("cron.add");
                    (0, vitest_1.expect)(call.params).toEqual({
                        name: "wake-up",
                        schedule: { kind: "at", atMs: 123 },
                        sessionTarget: "main",
                        wakeMode: "next-heartbeat",
                        payload: { kind: "systemEvent", text: "hello" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not default agentId when job.agentId is null", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tool = (0, cron_tool_js_1.createCronTool)({ agentSessionKey: "main" });
                    return [4 /*yield*/, tool.execute("call-null", {
                            action: "add",
                            job: {
                                name: "wake-up",
                                schedule: { atMs: 123 },
                                agentId: null,
                            },
                        })];
                case 1:
                    _c.sent();
                    call = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.agentId).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds recent context for systemEvent reminders when contextMessages > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, historyCall, cronCall, text;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    callGatewayMock
                        .mockResolvedValueOnce({
                        messages: [
                            { role: "user", content: [{ type: "text", text: "Discussed Q2 budget" }] },
                            {
                                role: "assistant",
                                content: [{ type: "text", text: "We agreed to review on Tuesday." }],
                            },
                            { role: "user", content: [{ type: "text", text: "Remind me about the thing at 2pm" }] },
                        ],
                    })
                        .mockResolvedValueOnce({ ok: true });
                    tool = (0, cron_tool_js_1.createCronTool)({ agentSessionKey: "main" });
                    return [4 /*yield*/, tool.execute("call3", {
                            action: "add",
                            contextMessages: 3,
                            job: {
                                name: "reminder",
                                schedule: { atMs: 123 },
                                payload: { kind: "systemEvent", text: "Reminder: the thing." },
                            },
                        })];
                case 1:
                    _f.sent();
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(2);
                    historyCall = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(historyCall.method).toBe("chat.history");
                    cronCall = (_b = callGatewayMock.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(cronCall.method).toBe("cron.add");
                    text = (_e = (_d = (_c = cronCall.params) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : "";
                    (0, vitest_1.expect)(text).toContain("Recent context:");
                    (0, vitest_1.expect)(text).toContain("User: Discussed Q2 budget");
                    (0, vitest_1.expect)(text).toContain("Assistant: We agreed to review on Tuesday.");
                    (0, vitest_1.expect)(text).toContain("User: Remind me about the thing at 2pm");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caps contextMessages at 10", function () { return __awaiter(void 0, void 0, void 0, function () {
        var messages, tool, historyCall, cronCall, text;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    messages = Array.from({ length: 12 }, function (_, idx) { return ({
                        role: "user",
                        content: [{ type: "text", text: "Message ".concat(idx + 1) }],
                    }); });
                    callGatewayMock.mockResolvedValueOnce({ messages: messages }).mockResolvedValueOnce({ ok: true });
                    tool = (0, cron_tool_js_1.createCronTool)({ agentSessionKey: "main" });
                    return [4 /*yield*/, tool.execute("call5", {
                            action: "add",
                            contextMessages: 20,
                            job: {
                                name: "reminder",
                                schedule: { atMs: 123 },
                                payload: { kind: "systemEvent", text: "Reminder: the thing." },
                            },
                        })];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(2);
                    historyCall = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(historyCall.method).toBe("chat.history");
                    (0, vitest_1.expect)((_b = historyCall.params) === null || _b === void 0 ? void 0 : _b.limit).toBe(10);
                    cronCall = (_c = callGatewayMock.mock.calls[1]) === null || _c === void 0 ? void 0 : _c[0];
                    text = (_f = (_e = (_d = cronCall.params) === null || _d === void 0 ? void 0 : _d.payload) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : "";
                    (0, vitest_1.expect)(text).not.toMatch(/Message 1\\b/);
                    (0, vitest_1.expect)(text).not.toMatch(/Message 2\\b/);
                    (0, vitest_1.expect)(text).toContain("Message 3");
                    (0, vitest_1.expect)(text).toContain("Message 12");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not add context when contextMessages is 0 (default)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, cronCall, text;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayMock.mockResolvedValueOnce({ ok: true });
                    tool = (0, cron_tool_js_1.createCronTool)({ agentSessionKey: "main" });
                    return [4 /*yield*/, tool.execute("call4", {
                            action: "add",
                            job: {
                                name: "reminder",
                                schedule: { atMs: 123 },
                                payload: { text: "Reminder: the thing." },
                            },
                        })];
                case 1:
                    _e.sent();
                    // Should only call cron.add, not chat.history
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(1);
                    cronCall = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(cronCall.method).toBe("cron.add");
                    text = (_d = (_c = (_b = cronCall.params) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : "";
                    (0, vitest_1.expect)(text).not.toContain("Recent context:");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves explicit agentId null on add", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    callGatewayMock.mockResolvedValueOnce({ ok: true });
                    tool = (0, cron_tool_js_1.createCronTool)({ agentSessionKey: "main" });
                    return [4 /*yield*/, tool.execute("call6", {
                            action: "add",
                            job: {
                                name: "reminder",
                                schedule: { atMs: 123 },
                                agentId: null,
                                payload: { kind: "systemEvent", text: "Reminder: the thing." },
                            },
                        })];
                case 1:
                    _c.sent();
                    call = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.method).toBe("cron.add");
                    (0, vitest_1.expect)((_b = call.params) === null || _b === void 0 ? void 0 : _b.agentId).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
