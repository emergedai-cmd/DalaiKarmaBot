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
var promises_1 = require("node:fs/promises");
var vitest_1 = require("vitest");
var agent_scope_js_1 = require("./agent-scope.js");
var models_config_js_1 = require("./models-config.js");
vitest_1.vi.mock("@mariozechner/pi-ai", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("@mariozechner/pi-ai")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { streamSimple: function (model) {
                            if (model.id === "mock-error") {
                                throw new Error("boom");
                            }
                            var stream = new actual.AssistantMessageEventStream();
                            queueMicrotask(function () {
                                stream.push({
                                    type: "done",
                                    reason: "stop",
                                    message: {
                                        role: "assistant",
                                        content: [{ type: "text", text: "ok" }],
                                        stopReason: "stop",
                                        api: model.api,
                                        provider: model.provider,
                                        model: model.id,
                                        usage: {
                                            input: 1,
                                            output: 1,
                                            cacheRead: 0,
                                            cacheWrite: 0,
                                            totalTokens: 2,
                                            cost: {
                                                input: 0,
                                                output: 0,
                                                cacheRead: 0,
                                                cacheWrite: 0,
                                                total: 0,
                                            },
                                        },
                                        timestamp: Date.now(),
                                    },
                                });
                            });
                            return stream;
                        } })];
        }
    });
}); });
var _makeOpenAiConfig = function (modelIds) {
    return ({
        models: {
            providers: {
                openai: {
                    api: "openai-responses",
                    apiKey: "sk-test",
                    baseUrl: "https://example.com",
                    models: modelIds.map(function (id) { return ({
                        id: id,
                        name: "Mock ".concat(id),
                        reasoning: false,
                        input: ["text"],
                        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                        contextWindow: 16000,
                        maxTokens: 2048,
                    }); }),
                },
            },
        },
    });
};
var _ensureModels = function (cfg, agentDir) {
    return (0, models_config_js_1.ensureOpenClawModelsJson)(cfg, agentDir);
};
var _textFromContent = function (content) {
    var _a;
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content) && ((_a = content[0]) === null || _a === void 0 ? void 0 : _a.type) === "text") {
        return content[0].text;
    }
    return undefined;
};
var _readSessionMessages = function (sessionFile) { return __awaiter(void 0, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, promises_1.default.readFile(sessionFile, "utf-8")];
            case 1:
                raw = _a.sent();
                return [2 /*return*/, raw
                        .split(/\r?\n/)
                        .filter(Boolean)
                        .map(function (line) {
                        return JSON.parse(line);
                    })
                        .filter(function (entry) { return entry.type === "message"; })
                        .map(function (entry) { return entry.message; })];
        }
    });
}); };
(0, vitest_1.describe)("resolveSessionAgentIds", function () {
    var cfg = {
        agents: {
            list: [{ id: "main" }, { id: "beta", default: true }],
        },
    };
    (0, vitest_1.it)("falls back to the configured default when sessionKey is missing", function () {
        var _a = (0, agent_scope_js_1.resolveSessionAgentIds)({
            config: cfg,
        }), defaultAgentId = _a.defaultAgentId, sessionAgentId = _a.sessionAgentId;
        (0, vitest_1.expect)(defaultAgentId).toBe("beta");
        (0, vitest_1.expect)(sessionAgentId).toBe("beta");
    });
    (0, vitest_1.it)("falls back to the configured default when sessionKey is non-agent", function () {
        var sessionAgentId = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: "telegram:slash:123",
            config: cfg,
        }).sessionAgentId;
        (0, vitest_1.expect)(sessionAgentId).toBe("beta");
    });
    (0, vitest_1.it)("falls back to the configured default for global sessions", function () {
        var sessionAgentId = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: "global",
            config: cfg,
        }).sessionAgentId;
        (0, vitest_1.expect)(sessionAgentId).toBe("beta");
    });
    (0, vitest_1.it)("keeps the agent id for provider-qualified agent sessions", function () {
        var sessionAgentId = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: "agent:beta:slack:channel:c1",
            config: cfg,
        }).sessionAgentId;
        (0, vitest_1.expect)(sessionAgentId).toBe("beta");
    });
    (0, vitest_1.it)("uses the agent id from agent session keys", function () {
        var sessionAgentId = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: "agent:main:main",
            config: cfg,
        }).sessionAgentId;
        (0, vitest_1.expect)(sessionAgentId).toBe("main");
    });
});
