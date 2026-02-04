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
var hook_runner_global_js_1 = require("../plugins/hook-runner-global.js");
var pi_tool_definition_adapter_js_1 = require("./pi-tool-definition-adapter.js");
var pi_tools_before_tool_call_js_1 = require("./pi-tools.before-tool-call.js");
vitest_1.vi.mock("../plugins/hook-runner-global.js");
var mockGetGlobalHookRunner = vitest_1.vi.mocked(hook_runner_global_js_1.getGlobalHookRunner);
(0, vitest_1.describe)("before_tool_call hook integration", function () {
    var hookRunner;
    (0, vitest_1.beforeEach)(function () {
        hookRunner = {
            hasHooks: vitest_1.vi.fn(),
            runBeforeToolCall: vitest_1.vi.fn(),
        };
        // oxlint-disable-next-line typescript/no-explicit-any
        mockGetGlobalHookRunner.mockReturnValue(hookRunner);
    });
    (0, vitest_1.it)("executes tool normally when no hook is registered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execute, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(false);
                    execute = vitest_1.vi.fn().mockResolvedValue({ content: [], details: { ok: true } });
                    tool = (0, pi_tools_before_tool_call_js_1.wrapToolWithBeforeToolCallHook)({ name: "Read", execute: execute }, {
                        agentId: "main",
                        sessionKey: "main",
                    });
                    return [4 /*yield*/, tool.execute("call-1", { path: "/tmp/file" }, undefined, undefined)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(hookRunner.runBeforeToolCall).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(execute).toHaveBeenCalledWith("call-1", { path: "/tmp/file" }, undefined, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows hook to modify parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execute, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(true);
                    hookRunner.runBeforeToolCall.mockResolvedValue({ params: { mode: "safe" } });
                    execute = vitest_1.vi.fn().mockResolvedValue({ content: [], details: { ok: true } });
                    tool = (0, pi_tools_before_tool_call_js_1.wrapToolWithBeforeToolCallHook)({ name: "exec", execute: execute });
                    return [4 /*yield*/, tool.execute("call-2", { cmd: "ls" }, undefined, undefined)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(execute).toHaveBeenCalledWith("call-2", { cmd: "ls", mode: "safe" }, undefined, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks tool execution when hook returns block=true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execute, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(true);
                    hookRunner.runBeforeToolCall.mockResolvedValue({
                        block: true,
                        blockReason: "blocked",
                    });
                    execute = vitest_1.vi.fn().mockResolvedValue({ content: [], details: { ok: true } });
                    tool = (0, pi_tools_before_tool_call_js_1.wrapToolWithBeforeToolCallHook)({ name: "exec", execute: execute });
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call-3", { cmd: "rm -rf /" }, undefined, undefined)).rejects.toThrow("blocked")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(execute).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("continues execution when hook throws", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execute, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(true);
                    hookRunner.runBeforeToolCall.mockRejectedValue(new Error("boom"));
                    execute = vitest_1.vi.fn().mockResolvedValue({ content: [], details: { ok: true } });
                    tool = (0, pi_tools_before_tool_call_js_1.wrapToolWithBeforeToolCallHook)({ name: "read", execute: execute });
                    return [4 /*yield*/, tool.execute("call-4", { path: "/tmp/file" }, undefined, undefined)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(execute).toHaveBeenCalledWith("call-4", { path: "/tmp/file" }, undefined, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes non-object params for hook contract", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execute, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(true);
                    hookRunner.runBeforeToolCall.mockResolvedValue(undefined);
                    execute = vitest_1.vi.fn().mockResolvedValue({ content: [], details: { ok: true } });
                    tool = (0, pi_tools_before_tool_call_js_1.wrapToolWithBeforeToolCallHook)({ name: "ReAd", execute: execute }, {
                        agentId: "main",
                        sessionKey: "main",
                    });
                    return [4 /*yield*/, tool.execute("call-5", "not-an-object", undefined, undefined)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(hookRunner.runBeforeToolCall).toHaveBeenCalledWith({
                        toolName: "read",
                        params: {},
                    }, {
                        toolName: "read",
                        agentId: "main",
                        sessionKey: "main",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("before_tool_call hook integration for client tools", function () {
    var hookRunner;
    (0, vitest_1.beforeEach)(function () {
        hookRunner = {
            hasHooks: vitest_1.vi.fn(),
            runBeforeToolCall: vitest_1.vi.fn(),
        };
        // oxlint-disable-next-line typescript/no-explicit-any
        mockGetGlobalHookRunner.mockReturnValue(hookRunner);
    });
    (0, vitest_1.it)("passes modified params to client tool callbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onClientToolCall, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hookRunner.hasHooks.mockReturnValue(true);
                    hookRunner.runBeforeToolCall.mockResolvedValue({ params: { extra: true } });
                    onClientToolCall = vitest_1.vi.fn();
                    tool = (0, pi_tool_definition_adapter_js_1.toClientToolDefinitions)([
                        {
                            type: "function",
                            function: {
                                name: "client_tool",
                                description: "Client tool",
                                parameters: { type: "object", properties: { value: { type: "string" } } },
                            },
                        },
                    ], onClientToolCall, { agentId: "main", sessionKey: "main" })[0];
                    return [4 /*yield*/, tool.execute("client-call-1", { value: "ok" }, undefined, undefined, undefined)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onClientToolCall).toHaveBeenCalledWith("client_tool", {
                        value: "ok",
                        extra: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
