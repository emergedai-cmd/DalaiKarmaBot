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
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var reply_js_1 = require("./reply.js");
var piEmbeddedMock = vitest_1.vi.hoisted(function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
}); });
vitest_1.vi.mock("/src/agents/pi-embedded.js", function () { return piEmbeddedMock; });
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return piEmbeddedMock; });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(),
}); });
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(fn, { prefix: "openclaw-stream-" })];
        });
    });
}
(0, vitest_1.describe)("block streaming", function () {
    (0, vitest_1.beforeEach)(function () {
        piEmbeddedMock.abortEmbeddedPiRun.mockReset().mockReturnValue(false);
        piEmbeddedMock.queueEmbeddedPiMessage.mockReset().mockReturnValue(false);
        piEmbeddedMock.isEmbeddedPiRunActive.mockReset().mockReturnValue(false);
        piEmbeddedMock.isEmbeddedPiRunStreaming.mockReset().mockReturnValue(false);
        piEmbeddedMock.runEmbeddedPiAgent.mockReset();
        vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([
            { id: "claude-opus-4-5", name: "Opus 4.5", provider: "anthropic" },
            { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", provider: "openai" },
        ]);
    });
    function waitForCalls(fn, calls) {
        return __awaiter(this, void 0, void 0, function () {
            var deadline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deadline = Date.now() + 5000;
                        _a.label = 1;
                    case 1:
                        if (!(fn() < calls)) return [3 /*break*/, 3];
                        if (Date.now() > deadline) {
                            throw new Error("Expected ".concat(calls, " call(s), got ").concat(fn()));
                        }
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    (0, vitest_1.it)("waits for block replies before returning final payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var releaseTyping, typingGate, onReplyStart, onBlockReply, impl, replyPromise, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    typingGate = new Promise(function (resolve) {
                                        releaseTyping = resolve;
                                    });
                                    onReplyStart = vitest_1.vi.fn(function () { return typingGate; });
                                    onBlockReply = vitest_1.vi.fn().mockResolvedValue(undefined);
                                    impl = function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            void ((_a = params.onBlockReply) === null || _a === void 0 ? void 0 : _a.call(params, { text: "hello" }));
                                            return [2 /*return*/, {
                                                    payloads: [{ text: "hello" }],
                                                    meta: {
                                                        durationMs: 5,
                                                        agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                                    },
                                                }];
                                        });
                                    }); };
                                    piEmbeddedMock.runEmbeddedPiAgent.mockImplementation(impl);
                                    replyPromise = (0, reply_js_1.getReplyFromConfig)({
                                        Body: "ping",
                                        From: "+1004",
                                        To: "+2000",
                                        MessageSid: "msg-123",
                                        Provider: "discord",
                                    }, {
                                        onReplyStart: onReplyStart,
                                        onBlockReply: onBlockReply,
                                        disableBlockStreaming: false,
                                    }, {
                                        agents: {
                                            defaults: {
                                                model: "anthropic/claude-opus-4-5",
                                                workspace: node_path_1.default.join(home, "openclaw"),
                                            },
                                        },
                                        channels: { whatsapp: { allowFrom: ["*"] } },
                                        session: { store: node_path_1.default.join(home, "sessions.json") },
                                    });
                                    return [4 /*yield*/, waitForCalls(function () { return onReplyStart.mock.calls.length; }, 1)];
                                case 1:
                                    _a.sent();
                                    releaseTyping === null || releaseTyping === void 0 ? void 0 : releaseTyping();
                                    return [4 /*yield*/, replyPromise];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res).toBeUndefined();
                                    (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
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
    (0, vitest_1.it)("preserves block reply ordering when typing start is slow", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var releaseTyping, typingGate, onReplyStart, seen, onBlockReply, impl, replyPromise, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    typingGate = new Promise(function (resolve) {
                                        releaseTyping = resolve;
                                    });
                                    onReplyStart = vitest_1.vi.fn(function () { return typingGate; });
                                    seen = [];
                                    onBlockReply = vitest_1.vi.fn(function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            seen.push((_a = payload.text) !== null && _a !== void 0 ? _a : "");
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    impl = function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            void ((_a = params.onBlockReply) === null || _a === void 0 ? void 0 : _a.call(params, { text: "first" }));
                                            void ((_b = params.onBlockReply) === null || _b === void 0 ? void 0 : _b.call(params, { text: "second" }));
                                            return [2 /*return*/, {
                                                    payloads: [{ text: "first" }, { text: "second" }],
                                                    meta: {
                                                        durationMs: 5,
                                                        agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                                    },
                                                }];
                                        });
                                    }); };
                                    piEmbeddedMock.runEmbeddedPiAgent.mockImplementation(impl);
                                    replyPromise = (0, reply_js_1.getReplyFromConfig)({
                                        Body: "ping",
                                        From: "+1004",
                                        To: "+2000",
                                        MessageSid: "msg-125",
                                        Provider: "telegram",
                                    }, {
                                        onReplyStart: onReplyStart,
                                        onBlockReply: onBlockReply,
                                        disableBlockStreaming: false,
                                    }, {
                                        agents: {
                                            defaults: {
                                                model: "anthropic/claude-opus-4-5",
                                                workspace: node_path_1.default.join(home, "openclaw"),
                                            },
                                        },
                                        channels: { telegram: { allowFrom: ["*"] } },
                                        session: { store: node_path_1.default.join(home, "sessions.json") },
                                    });
                                    return [4 /*yield*/, waitForCalls(function () { return onReplyStart.mock.calls.length; }, 1)];
                                case 1:
                                    _a.sent();
                                    releaseTyping === null || releaseTyping === void 0 ? void 0 : releaseTyping();
                                    return [4 /*yield*/, replyPromise];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res).toBeUndefined();
                                    (0, vitest_1.expect)(seen).toEqual(["first\n\nsecond"]);
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
    (0, vitest_1.it)("drops final payloads when block replies streamed", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var onBlockReply, impl, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    onBlockReply = vitest_1.vi.fn().mockResolvedValue(undefined);
                                    impl = function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            void ((_a = params.onBlockReply) === null || _a === void 0 ? void 0 : _a.call(params, { text: "chunk-1" }));
                                            return [2 /*return*/, {
                                                    payloads: [{ text: "chunk-1\nchunk-2" }],
                                                    meta: {
                                                        durationMs: 5,
                                                        agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                                    },
                                                }];
                                        });
                                    }); };
                                    piEmbeddedMock.runEmbeddedPiAgent.mockImplementation(impl);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "ping",
                                            From: "+1004",
                                            To: "+2000",
                                            MessageSid: "msg-124",
                                            Provider: "discord",
                                        }, {
                                            onBlockReply: onBlockReply,
                                            disableBlockStreaming: false,
                                        }, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { whatsapp: { allowFrom: ["*"] } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res).toBeUndefined();
                                    (0, vitest_1.expect)(onBlockReply).toHaveBeenCalledTimes(1);
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
    (0, vitest_1.it)("falls back to final payloads when block reply send times out", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var sawAbort, onBlockReply, impl, replyPromise, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sawAbort = false;
                                    onBlockReply = vitest_1.vi.fn(function (_, context) {
                                        return new Promise(function (resolve) {
                                            var _a;
                                            (_a = context === null || context === void 0 ? void 0 : context.abortSignal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", function () {
                                                sawAbort = true;
                                                resolve();
                                            }, { once: true });
                                        });
                                    });
                                    impl = function (params) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            void ((_a = params.onBlockReply) === null || _a === void 0 ? void 0 : _a.call(params, { text: "streamed" }));
                                            return [2 /*return*/, {
                                                    payloads: [{ text: "final" }],
                                                    meta: {
                                                        durationMs: 5,
                                                        agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                                    },
                                                }];
                                        });
                                    }); };
                                    piEmbeddedMock.runEmbeddedPiAgent.mockImplementation(impl);
                                    replyPromise = (0, reply_js_1.getReplyFromConfig)({
                                        Body: "ping",
                                        From: "+1004",
                                        To: "+2000",
                                        MessageSid: "msg-126",
                                        Provider: "telegram",
                                    }, {
                                        onBlockReply: onBlockReply,
                                        blockReplyTimeoutMs: 10,
                                        disableBlockStreaming: false,
                                    }, {
                                        agents: {
                                            defaults: {
                                                model: "anthropic/claude-opus-4-5",
                                                workspace: node_path_1.default.join(home, "openclaw"),
                                            },
                                        },
                                        channels: { telegram: { allowFrom: ["*"] } },
                                        session: { store: node_path_1.default.join(home, "sessions.json") },
                                    });
                                    return [4 /*yield*/, replyPromise];
                                case 1:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res).toMatchObject({ text: "final" });
                                    (0, vitest_1.expect)(sawAbort).toBe(true);
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
    (0, vitest_1.it)("does not enable block streaming for telegram streamMode block", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var onBlockReply, impl, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    onBlockReply = vitest_1.vi.fn().mockResolvedValue(undefined);
                                    impl = function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    payloads: [{ text: "final" }],
                                                    meta: {
                                                        durationMs: 5,
                                                        agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                                    },
                                                })];
                                        });
                                    }); };
                                    piEmbeddedMock.runEmbeddedPiAgent.mockImplementation(impl);
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({
                                            Body: "ping",
                                            From: "+1004",
                                            To: "+2000",
                                            MessageSid: "msg-126",
                                            Provider: "telegram",
                                        }, {
                                            onBlockReply: onBlockReply,
                                        }, {
                                            agents: {
                                                defaults: {
                                                    model: "anthropic/claude-opus-4-5",
                                                    workspace: node_path_1.default.join(home, "openclaw"),
                                                },
                                            },
                                            channels: { telegram: { allowFrom: ["*"], streamMode: "block" } },
                                            session: { store: node_path_1.default.join(home, "sessions.json") },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res === null || res === void 0 ? void 0 : res.text).toBe("final");
                                    (0, vitest_1.expect)(onBlockReply).not.toHaveBeenCalled();
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
