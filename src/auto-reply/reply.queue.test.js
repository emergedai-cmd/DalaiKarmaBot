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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var poll_js_1 = require("../../test/helpers/poll.js");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var reply_js_1 = require("./reply.js");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
}); });
function makeResult(text) {
    return {
        payloads: [{ text: text }],
        meta: {
            durationMs: 5,
            agentMeta: { sessionId: "s", provider: "p", model: "m" },
        },
    };
}
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
                                return [4 /*yield*/, fn(home)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }, { prefix: "openclaw-queue-" })];
        });
    });
}
function makeCfg(home, queue) {
    return {
        agents: {
            defaults: {
                model: "anthropic/claude-opus-4-5",
                workspace: node_path_1.default.join(home, "openclaw"),
            },
        },
        channels: { whatsapp: { allowFrom: ["*"] } },
        session: { store: node_path_1.default.join(home, "sessions.json") },
        messages: queue ? { queue: queue } : undefined,
    };
}
(0, vitest_1.describe)("queue followups", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("collects queued messages and drains after run completes", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            var prompts, cfg, first, second, secondText, queuedPrompt;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        prompts = [];
                                        vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockImplementation(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                prompts.push(params.prompt);
                                                if (params.prompt.includes("[Queued messages while agent was busy]")) {
                                                    return [2 /*return*/, makeResult("followup")];
                                                }
                                                return [2 /*return*/, makeResult("main")];
                                            });
                                        }); });
                                        vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunActive).mockReturnValue(true);
                                        vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunStreaming).mockReturnValue(true);
                                        cfg = makeCfg(home, {
                                            mode: "collect",
                                            debounceMs: 200,
                                            cap: 10,
                                            drop: "summarize",
                                        });
                                        return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "first", From: "+1001", To: "+2000", MessageSid: "m-1" }, {}, cfg)];
                                    case 1:
                                        first = _b.sent();
                                        (0, vitest_1.expect)(first).toBeUndefined();
                                        (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).not.toHaveBeenCalled();
                                        vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunActive).mockReturnValue(false);
                                        vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunStreaming).mockReturnValue(false);
                                        return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "second", From: "+1001", To: "+2000" }, {}, cfg)];
                                    case 2:
                                        second = _b.sent();
                                        secondText = Array.isArray(second) ? (_a = second[0]) === null || _a === void 0 ? void 0 : _a.text : second === null || second === void 0 ? void 0 : second.text;
                                        (0, vitest_1.expect)(secondText).toBe("main");
                                        return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(500)];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, Promise.resolve()];
                                    case 4:
                                        _b.sent();
                                        (0, vitest_1.expect)(pi_embedded_js_1.runEmbeddedPiAgent).toHaveBeenCalledTimes(2);
                                        queuedPrompt = prompts.find(function (p) {
                                            return p.includes("[Queued messages while agent was busy]");
                                        });
                                        (0, vitest_1.expect)(queuedPrompt).toBeTruthy();
                                        (0, vitest_1.expect)(queuedPrompt).toContain("[message_id: m-1]");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("summarizes dropped followups when cap is exceeded", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var prompts, cfg;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    prompts = [];
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockImplementation(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            prompts.push(params.prompt);
                                            return [2 /*return*/, makeResult("ok")];
                                        });
                                    }); });
                                    vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunActive).mockReturnValue(true);
                                    vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunStreaming).mockReturnValue(false);
                                    cfg = makeCfg(home, {
                                        mode: "followup",
                                        debounceMs: 0,
                                        cap: 1,
                                        drop: "summarize",
                                    });
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "one", From: "+1002", To: "+2000" }, {}, cfg)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "two", From: "+1002", To: "+2000" }, {}, cfg)];
                                case 2:
                                    _a.sent();
                                    vitest_1.vi.mocked(pi_embedded_js_1.isEmbeddedPiRunActive).mockReturnValue(false);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "three", From: "+1002", To: "+2000" }, {}, cfg)];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, (0, poll_js_1.pollUntil)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, (prompts.some(function (p) { return p.includes("[Queue overflow]"); }) ? true : null)];
                                        }); }); }, { timeoutMs: 2000 })];
                                case 4:
                                    _a.sent();
                                    (0, vitest_1.expect)(prompts.some(function (p) { return p.includes("[Queue overflow]"); })).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
