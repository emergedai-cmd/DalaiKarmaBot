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
vitest_1.vi.mock("../../../src/agents/pi-embedded-runner.js", function () {
    return {
        runEmbeddedPiAgent: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        meta: { startedAt: Date.now() },
                        payloads: [{ text: "{}" }],
                    })];
            });
        }); }),
    };
});
var pi_embedded_runner_js_1 = require("../../../src/agents/pi-embedded-runner.js");
var llm_task_tool_js_1 = require("./llm-task-tool.js");
// oxlint-disable-next-line typescript/no-explicit-any
function fakeApi(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: "llm-task", name: "llm-task", source: "test", config: {
            agents: { defaults: { workspace: "/tmp", model: { primary: "openai-codex/gpt-5.2" } } },
        }, pluginConfig: {}, runtime: { version: "test" }, logger: { debug: function () { }, info: function () { }, warn: function () { }, error: function () { } }, registerTool: function () { } }, overrides);
}
(0, vitest_1.describe)("llm-task tool (json-only)", function () {
    (0, vitest_1.beforeEach)(function () { return vitest_1.vi.clearAllMocks(); });
    (0, vitest_1.it)("returns parsed json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ foo: "bar" }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("id", { prompt: "return foo" })];
                case 1:
                    res = _a.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    (0, vitest_1.expect)(res.details.json).toEqual({ foo: "bar" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips fenced json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: '```json\n{"ok":true}\n```' }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("id", { prompt: "return ok" })];
                case 1:
                    res = _a.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    (0, vitest_1.expect)(res.details.json).toEqual({ ok: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("validates schema", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, schema, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ foo: "bar" }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    schema = {
                        type: "object",
                        properties: { foo: { type: "string" } },
                        required: ["foo"],
                        additionalProperties: false,
                    };
                    return [4 /*yield*/, tool.execute("id", { prompt: "return foo", schema: schema })];
                case 1:
                    res = _a.sent();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    (0, vitest_1.expect)(res.details.json).toEqual({ foo: "bar" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on invalid json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: "not-json" }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("id", { prompt: "x" })).rejects.toThrow(/invalid json/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on schema mismatch", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, schema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ foo: 1 }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    schema = { type: "object", properties: { foo: { type: "string" } }, required: ["foo"] };
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("id", { prompt: "x", schema: schema })).rejects.toThrow(/match schema/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes provider/model overrides to embedded runner", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ ok: true }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("id", { prompt: "x", provider: "anthropic", model: "claude-4-sonnet" })];
                case 1:
                    _b.sent();
                    call = (_a = pi_embedded_runner_js_1.runEmbeddedPiAgent.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.provider).toBe("anthropic");
                    (0, vitest_1.expect)(call.model).toBe("claude-4-sonnet");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enforces allowedModels", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ ok: true }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi({ pluginConfig: { allowedModels: ["openai-codex/gpt-5.2"] } }));
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("id", { prompt: "x", provider: "anthropic", model: "claude-4-sonnet" })).rejects.toThrow(/not allowed/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("disables tools for embedded run", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    pi_embedded_runner_js_1.runEmbeddedPiAgent.mockResolvedValueOnce({
                        meta: {},
                        payloads: [{ text: JSON.stringify({ ok: true }) }],
                    });
                    tool = (0, llm_task_tool_js_1.createLlmTaskTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("id", { prompt: "x" })];
                case 1:
                    _b.sent();
                    call = (_a = pi_embedded_runner_js_1.runEmbeddedPiAgent.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call.disableTools).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
