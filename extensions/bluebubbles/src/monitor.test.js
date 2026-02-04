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
var node_events_1 = require("node:events");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var vitest_1 = require("vitest");
var monitor_js_1 = require("./monitor.js");
var runtime_js_1 = require("./runtime.js");
// Mock dependencies
vitest_1.vi.mock("./send.js", function () { return ({
    resolveChatGuidForTarget: vitest_1.vi.fn().mockResolvedValue("iMessage;-;+15551234567"),
    sendMessageBlueBubbles: vitest_1.vi.fn().mockResolvedValue({ messageId: "msg-123" }),
}); });
vitest_1.vi.mock("./chat.js", function () { return ({
    markBlueBubblesChatRead: vitest_1.vi.fn().mockResolvedValue(undefined),
    sendBlueBubblesTyping: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./attachments.js", function () { return ({
    downloadBlueBubblesAttachment: vitest_1.vi.fn().mockResolvedValue({
        buffer: Buffer.from("test"),
        contentType: "image/jpeg",
    }),
}); });
vitest_1.vi.mock("./reactions.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./reactions.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { sendBlueBubblesReaction: vitest_1.vi.fn().mockResolvedValue(undefined) })];
        }
    });
}); });
// Mock runtime
var mockEnqueueSystemEvent = vitest_1.vi.fn();
var mockBuildPairingReply = vitest_1.vi.fn(function () { return "Pairing code: TESTCODE"; });
var mockReadAllowFromStore = vitest_1.vi.fn().mockResolvedValue([]);
var mockUpsertPairingRequest = vitest_1.vi.fn().mockResolvedValue({ code: "TESTCODE", created: true });
var mockResolveAgentRoute = vitest_1.vi.fn(function () { return ({
    agentId: "main",
    accountId: "default",
    sessionKey: "agent:main:bluebubbles:dm:+15551234567",
}); });
var mockBuildMentionRegexes = vitest_1.vi.fn(function () { return [/\bbert\b/i]; });
var mockMatchesMentionPatterns = vitest_1.vi.fn(function (text, regexes) {
    return regexes.some(function (r) { return r.test(text); });
});
var mockResolveRequireMention = vitest_1.vi.fn(function () { return false; });
var mockResolveGroupPolicy = vitest_1.vi.fn(function () { return "open"; });
var mockDispatchReplyWithBufferedBlockDispatcher = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var mockHasControlCommand = vitest_1.vi.fn(function () { return false; });
var mockResolveCommandAuthorizedFromAuthorizers = vitest_1.vi.fn(function () { return false; });
var mockSaveMediaBuffer = vitest_1.vi.fn().mockResolvedValue({
    path: "/tmp/test-media.jpg",
    contentType: "image/jpeg",
});
var mockResolveStorePath = vitest_1.vi.fn(function () { return "/tmp/sessions.json"; });
var mockReadSessionUpdatedAt = vitest_1.vi.fn(function () { return undefined; });
var mockResolveEnvelopeFormatOptions = vitest_1.vi.fn(function () { return ({
    template: "channel+name+time",
}); });
var mockFormatAgentEnvelope = vitest_1.vi.fn(function (opts) { return opts.body; });
var mockChunkMarkdownText = vitest_1.vi.fn(function (text) { return [text]; });
function createMockRuntime() {
    var _this = this;
    return {
        version: "1.0.0",
        config: {
            loadConfig: vitest_1.vi.fn(function () { return ({}); }),
            writeConfigFile: vitest_1.vi.fn(),
        },
        system: {
            enqueueSystemEvent: mockEnqueueSystemEvent,
            runCommandWithTimeout: vitest_1.vi.fn(),
        },
        media: {
            loadWebMedia: vitest_1.vi.fn(),
            detectMime: vitest_1.vi.fn(),
            mediaKindFromMime: vitest_1.vi.fn(),
            isVoiceCompatibleAudio: vitest_1.vi.fn(),
            getImageMetadata: vitest_1.vi.fn(),
            resizeToJpeg: vitest_1.vi.fn(),
        },
        tools: {
            createMemoryGetTool: vitest_1.vi.fn(),
            createMemorySearchTool: vitest_1.vi.fn(),
            registerMemoryCli: vitest_1.vi.fn(),
        },
        channel: {
            text: {
                chunkMarkdownText: mockChunkMarkdownText,
                chunkText: vitest_1.vi.fn(),
                resolveTextChunkLimit: vitest_1.vi.fn(function () { return 4000; }),
                hasControlCommand: mockHasControlCommand,
                resolveMarkdownTableMode: vitest_1.vi.fn(function () { return "code"; }),
                convertMarkdownTables: vitest_1.vi.fn(function (text) { return text; }),
            },
            reply: {
                dispatchReplyWithBufferedBlockDispatcher: mockDispatchReplyWithBufferedBlockDispatcher,
                createReplyDispatcherWithTyping: vitest_1.vi.fn(),
                resolveEffectiveMessagesConfig: vitest_1.vi.fn(),
                resolveHumanDelayConfig: vitest_1.vi.fn(),
                dispatchReplyFromConfig: vitest_1.vi.fn(),
                finalizeInboundContext: vitest_1.vi.fn(),
                formatAgentEnvelope: mockFormatAgentEnvelope,
                formatInboundEnvelope: vitest_1.vi.fn(),
                resolveEnvelopeFormatOptions: mockResolveEnvelopeFormatOptions,
            },
            routing: {
                resolveAgentRoute: mockResolveAgentRoute,
            },
            pairing: {
                buildPairingReply: mockBuildPairingReply,
                readAllowFromStore: mockReadAllowFromStore,
                upsertPairingRequest: mockUpsertPairingRequest,
            },
            media: {
                fetchRemoteMedia: vitest_1.vi.fn(),
                saveMediaBuffer: mockSaveMediaBuffer,
            },
            session: {
                resolveStorePath: mockResolveStorePath,
                readSessionUpdatedAt: mockReadSessionUpdatedAt,
                recordInboundSession: vitest_1.vi.fn(),
                recordSessionMetaFromInbound: vitest_1.vi.fn(),
                updateLastRoute: vitest_1.vi.fn(),
            },
            mentions: {
                buildMentionRegexes: mockBuildMentionRegexes,
                matchesMentionPatterns: mockMatchesMentionPatterns,
            },
            reactions: {
                shouldAckReaction: plugin_sdk_1.shouldAckReaction,
                removeAckReactionAfterReply: plugin_sdk_1.removeAckReactionAfterReply,
            },
            groups: {
                resolveGroupPolicy: mockResolveGroupPolicy,
                resolveRequireMention: mockResolveRequireMention,
            },
            debounce: {
                // Create a pass-through debouncer that immediately calls onFlush
                createInboundDebouncer: vitest_1.vi.fn(function (params) { return ({
                    enqueue: function (item) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, params.onFlush([item])];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    flushKey: vitest_1.vi.fn(),
                }); }),
                resolveInboundDebounceMs: vitest_1.vi.fn(function () { return 0; }),
            },
            commands: {
                resolveCommandAuthorizedFromAuthorizers: mockResolveCommandAuthorizedFromAuthorizers,
                isControlCommandMessage: vitest_1.vi.fn(),
                shouldComputeCommandAuthorized: vitest_1.vi.fn(),
                shouldHandleTextCommands: vitest_1.vi.fn(),
            },
            discord: {},
            slack: {},
            telegram: {},
            signal: {},
            imessage: {},
            whatsapp: {},
        },
        logging: {
            shouldLogVerbose: vitest_1.vi.fn(function () { return false; }),
            getChildLogger: vitest_1.vi.fn(function () { return ({
                info: vitest_1.vi.fn(),
                warn: vitest_1.vi.fn(),
                error: vitest_1.vi.fn(),
                debug: vitest_1.vi.fn(),
            }); }),
        },
        state: {
            resolveStateDir: vitest_1.vi.fn(function () { return "/tmp/openclaw"; }),
        },
    };
}
function createMockAccount(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return {
        accountId: "default",
        enabled: true,
        configured: true,
        config: __assign({ serverUrl: "http://localhost:1234", password: "test-password", dmPolicy: "open", groupPolicy: "open", allowFrom: [], groupAllowFrom: [] }, overrides),
    };
}
function createMockRequest(method, url, body, headers) {
    if (headers === void 0) { headers = {}; }
    var req = new node_events_1.EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = headers;
    req.socket = { remoteAddress: "127.0.0.1" };
    // Emit body data after a microtask
    // oxlint-disable-next-line no-floating-promises
    Promise.resolve().then(function () {
        var bodyStr = typeof body === "string" ? body : JSON.stringify(body);
        req.emit("data", Buffer.from(bodyStr));
        req.emit("end");
    });
    return req;
}
function createMockResponse() {
    var res = {
        statusCode: 200,
        body: "",
        setHeader: vitest_1.vi.fn(),
        end: vitest_1.vi.fn(function (data) {
            res.body = data !== null && data !== void 0 ? data : "";
        }),
    };
    return res;
}
var flushAsync = function () { return __awaiter(void 0, void 0, void 0, function () {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 2)) return [3 /*break*/, 4];
                return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i += 1;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.describe)("BlueBubbles webhook monitor", function () {
    var unregister;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        // Reset short ID state between tests for predictable behavior
        (0, monitor_js_1._resetBlueBubblesShortIdState)();
        mockReadAllowFromStore.mockResolvedValue([]);
        mockUpsertPairingRequest.mockResolvedValue({ code: "TESTCODE", created: true });
        mockResolveRequireMention.mockReturnValue(false);
        mockHasControlCommand.mockReturnValue(false);
        mockResolveCommandAuthorizedFromAuthorizers.mockReturnValue(false);
        mockBuildMentionRegexes.mockReturnValue([/\bbert\b/i]);
        (0, runtime_js_1.setBlueBubblesRuntime)(createMockRuntime());
    });
    (0, vitest_1.afterEach)(function () {
        unregister === null || unregister === void 0 ? void 0 : unregister();
    });
    (0, vitest_1.describe)("webhook parsing + auth handling", function () {
        (0, vitest_1.it)("rejects non-POST requests", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        req = createMockRequest("GET", "/bluebubbles-webhook", {});
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(405);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("accepts POST requests with valid JSON payload", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        (0, vitest_1.expect)(res.body).toBe("ok");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects requests with invalid JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        req = createMockRequest("POST", "/bluebubbles-webhook", "invalid json {{");
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(400);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("authenticates via password query parameter", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ password: "secret-token" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        req = createMockRequest("POST", "/bluebubbles-webhook?password=secret-token", {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                            },
                        });
                        req.socket = {
                            remoteAddress: "192.168.1.100",
                        };
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("authenticates via x-password header", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ password: "secret-token" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        req = createMockRequest("POST", "/bluebubbles-webhook", {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                            },
                        }, { "x-password": "secret-token" });
                        req.socket = {
                            remoteAddress: "192.168.1.100",
                        };
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects unauthorized requests with wrong password", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ password: "secret-token" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        req = createMockRequest("POST", "/bluebubbles-webhook?password=wrong-token", {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                            },
                        });
                        req.socket = {
                            remoteAddress: "192.168.1.100",
                        };
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(401);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("allows localhost requests without authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ password: "secret-token" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        req = createMockRequest("POST", "/bluebubbles-webhook", {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                            },
                        });
                        // Localhost address
                        req.socket = {
                            remoteAddress: "127.0.0.1",
                        };
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(true);
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("ignores unregistered webhook paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, handled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = createMockRequest("POST", "/unregistered-path", {});
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        handled = _a.sent();
                        (0, vitest_1.expect)(handled).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("parses chatId when provided as a string (webhook variant)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resolveChatGuidForTarget, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        resolveChatGuidForTarget = (_a.sent()).resolveChatGuidForTarget;
                        vitest_1.vi.mocked(resolveChatGuidForTarget).mockClear();
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatId: "123",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(resolveChatGuidForTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            target: { kind: "chat_id", chatId: 123 },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("extracts chatGuid from nested chat object fields (webhook variant)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sendMessageBlueBubbles, resolveChatGuidForTarget, account, config, core, payload, req, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 1:
                        _a = _b.sent(), sendMessageBlueBubbles = _a.sendMessageBlueBubbles, resolveChatGuidForTarget = _a.resolveChatGuidForTarget;
                        vitest_1.vi.mocked(sendMessageBlueBubbles).mockClear();
                        vitest_1.vi.mocked(resolveChatGuidForTarget).mockClear();
                        mockDispatchReplyWithBufferedBlockDispatcher.mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, params.dispatcherOptions.deliver({ text: "replying now" }, { kind: "final" })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chat: { chatGuid: "iMessage;+;chat123456" },
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _b.sent();
                        (0, vitest_1.expect)(resolveChatGuidForTarget).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(sendMessageBlueBubbles).toHaveBeenCalledWith("chat_guid:iMessage;+;chat123456", vitest_1.expect.any(String), vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("DM pairing behavior vs allowFrom", function () {
        (0, vitest_1.it)("allows DM from sender in allowFrom list", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            dmPolicy: "allowlist",
                            allowFrom: ["+15551234567"],
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from allowed sender",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        // Wait for async processing
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        // Wait for async processing
                        _a.sent();
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("blocks DM from sender not in allowFrom when dmPolicy=allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            dmPolicy: "allowlist",
                            allowFrom: ["+15559999999"], // Different number
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from blocked sender",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(res.statusCode).toBe(200);
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("triggers pairing flow for unknown sender when dmPolicy=pairing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            dmPolicy: "pairing",
                            allowFrom: ["+15559999999"], // Different number than sender
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockUpsertPairingRequest).toHaveBeenCalled();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does not resend pairing reply when request already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, sendMessageBlueBubbles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUpsertPairingRequest.mockResolvedValue({ code: "TESTCODE", created: false });
                        account = createMockAccount({
                            dmPolicy: "pairing",
                            allowFrom: ["+15559999999"], // Different number than sender
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello again",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-2",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockUpsertPairingRequest).toHaveBeenCalled();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./send.js"); })];
                    case 3:
                        sendMessageBlueBubbles = (_a.sent()).sendMessageBlueBubbles;
                        (0, vitest_1.expect)(sendMessageBlueBubbles).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("allows all DMs when dmPolicy=open", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            dmPolicy: "open",
                            allowFrom: [],
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from anyone",
                                handle: { address: "+15559999999" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("blocks all DMs when dmPolicy=disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            dmPolicy: "disabled",
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("group message gating", function () {
        (0, vitest_1.it)("allows group messages when groupPolicy=open and no allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            groupPolicy: "open",
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("blocks group messages when groupPolicy=disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            groupPolicy: "disabled",
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("treats chat_guid groups as group even when isGroup=false", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            groupPolicy: "allowlist",
                            dmPolicy: "open",
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from group",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("allows group messages from allowed chat_guid in groupAllowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({
                            groupPolicy: "allowlist",
                            groupAllowFrom: ["chat_guid:iMessage;+;chat123456"],
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello from allowed group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("mention gating (group messages)", function () {
        (0, vitest_1.it)("processes group message when mentioned and requireMention=true", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResolveRequireMention.mockReturnValue(true);
                        mockMatchesMentionPatterns.mockReturnValue(true);
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "bert, can you help me?",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.WasMentioned).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("skips group message when not mentioned and requireMention=true", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResolveRequireMention.mockReturnValue(true);
                        mockMatchesMentionPatterns.mockReturnValue(false);
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello everyone",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("processes group message without mention when requireMention=false", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResolveRequireMention.mockReturnValue(false);
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello everyone",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("group metadata", function () {
        (0, vitest_1.it)("includes group subject + members in ctx", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello group",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                chatName: "Family",
                                participants: [
                                    { address: "+15551234567", displayName: "Alice" },
                                    { address: "+15557654321", displayName: "Bob" },
                                ],
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.GroupSubject).toBe("Family");
                        (0, vitest_1.expect)(callArgs.ctx.GroupMembers).toBe("Alice (+15551234567), Bob (+15557654321)");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("inbound debouncing", function () {
        (0, vitest_1.it)("coalesces text-only then attachment webhook events by messageId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, messageId, chatGuid, payloadA, payloadB, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.useFakeTimers();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 6, 7]);
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        // Use a timing-aware debouncer test double that respects debounceMs/buildKey/shouldDebounce.
                        // oxlint-disable-next-line typescript/no-explicit-any
                        core.channel.debounce.createInboundDebouncer = vitest_1.vi.fn(function (params) {
                            var buckets = new Map();
                            var flush = function (key) { return __awaiter(void 0, void 0, void 0, function () {
                                var bucket, items, err_1;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            bucket = buckets.get(key);
                                            if (!bucket) {
                                                return [2 /*return*/];
                                            }
                                            if (bucket.timer) {
                                                clearTimeout(bucket.timer);
                                                bucket.timer = null;
                                            }
                                            items = bucket.items;
                                            bucket.items = [];
                                            if (!(items.length > 0)) return [3 /*break*/, 4];
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, params.onFlush(items)];
                                        case 2:
                                            _b.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_1 = _b.sent();
                                            (_a = params.onError) === null || _a === void 0 ? void 0 : _a.call(params, err_1);
                                            throw err_1;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return {
                                enqueue: function (item) { return __awaiter(void 0, void 0, void 0, function () {
                                    var key, existing, bucket;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(params.shouldDebounce && !params.shouldDebounce(item))) return [3 /*break*/, 2];
                                                return [4 /*yield*/, params.onFlush([item])];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                            case 2:
                                                key = params.buildKey(item);
                                                existing = buckets.get(key);
                                                bucket = existing !== null && existing !== void 0 ? existing : { items: [], timer: null };
                                                bucket.items.push(item);
                                                if (bucket.timer) {
                                                    clearTimeout(bucket.timer);
                                                }
                                                bucket.timer = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, flush(key)];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, params.debounceMs);
                                                buckets.set(key, bucket);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                flushKey: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, flush(key)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }),
                            };
                        });
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        messageId = "race-msg-1";
                        chatGuid = "iMessage;-;+15551234567";
                        payloadA = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: messageId,
                                chatGuid: chatGuid,
                                date: Date.now(),
                            },
                        };
                        payloadB = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: messageId,
                                chatGuid: chatGuid,
                                attachments: [
                                    {
                                        guid: "att-1",
                                        mimeType: "image/jpeg",
                                        totalBytes: 1024,
                                    },
                                ],
                                date: Date.now(),
                            },
                        };
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(createMockRequest("POST", "/bluebubbles-webhook", payloadA), createMockResponse())];
                    case 2:
                        _a.sent();
                        // Simulate the real-world delay where the attachment-bearing webhook arrives shortly after.
                        return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(300)];
                    case 3:
                        // Simulate the real-world delay where the attachment-bearing webhook arrives shortly after.
                        _a.sent();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(createMockRequest("POST", "/bluebubbles-webhook", payloadB), createMockResponse())];
                    case 4:
                        _a.sent();
                        // Not flushed yet; still within the debounce window.
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        // After the debounce window, the combined message should be processed exactly once.
                        return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(600)];
                    case 5:
                        // After the debounce window, the combined message should be processed exactly once.
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalledTimes(1);
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.MediaPaths).toEqual(["/tmp/test-media.jpg"]);
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("hello");
                        return [3 /*break*/, 7];
                    case 6:
                        vitest_1.vi.useRealTimers();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("reply metadata", function () {
        (0, vitest_1.it)("surfaces reply fields in ctx when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "replying now",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                replyTo: {
                                    guid: "msg-0",
                                    text: "original message",
                                    handle: { address: "+15550000000", displayName: "Alice" },
                                },
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        // ReplyToId is the full UUID since it wasn't previously cached
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToId).toBe("msg-0");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToBody).toBe("original message");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToSender).toBe("+15550000000");
                        // Body uses inline [[reply_to:N]] tag format
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("[[reply_to:msg-0]]");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("preserves part index prefixes in reply tags when short IDs are unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "replying now",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                replyTo: {
                                    guid: "p:1/msg-0",
                                    text: "original message",
                                    handle: { address: "+15550000000", displayName: "Alice" },
                                },
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToId).toBe("p:1/msg-0");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToIdFull).toBe("p:1/msg-0");
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("[[reply_to:p:1/msg-0]]");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("hydrates missing reply sender/body from the recent-message cache", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, chatGuid, originalPayload, originalReq, originalRes, replyPayload, replyReq, replyRes, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open", groupPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        chatGuid = "iMessage;+;chat-reply-cache";
                        originalPayload = {
                            type: "new-message",
                            data: {
                                text: "original message (cached)",
                                handle: { address: "+15550000000" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "cache-msg-0",
                                chatGuid: chatGuid,
                                date: Date.now(),
                            },
                        };
                        originalReq = createMockRequest("POST", "/bluebubbles-webhook", originalPayload);
                        originalRes = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(originalReq, originalRes)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        // Only assert the reply message behavior below.
                        mockDispatchReplyWithBufferedBlockDispatcher.mockClear();
                        replyPayload = {
                            type: "new-message",
                            data: {
                                text: "replying now",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "cache-msg-1",
                                chatGuid: chatGuid,
                                // Only the GUID is provided; sender/body must be hydrated.
                                replyToMessageGuid: "cache-msg-0",
                                date: Date.now(),
                            },
                        };
                        replyReq = createMockRequest("POST", "/bluebubbles-webhook", replyPayload);
                        replyRes = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(replyReq, replyRes)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 4:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        // ReplyToId uses short ID "1" (first cached message) for token savings
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToId).toBe("1");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToIdFull).toBe("cache-msg-0");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToBody).toBe("original message (cached)");
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToSender).toBe("+15550000000");
                        // Body uses inline [[reply_to:N]] tag format with short ID
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("[[reply_to:1]]");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("falls back to threadOriginatorGuid when reply metadata is absent", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "replying now",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                threadOriginatorGuid: "msg-0",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.ReplyToId).toBe("msg-0");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("tapback text parsing", function () {
        (0, vitest_1.it)("does not rewrite tapback-like text without metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "Loved this idea",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.RawBody).toBe("Loved this idea");
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("Loved this idea");
                        (0, vitest_1.expect)(callArgs.ctx.Body).not.toContain("reacted with");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("parses tapback text with custom emoji when metadata is present", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: 'Reacted 😅 to "nice one"',
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-2",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        (0, vitest_1.expect)(callArgs.ctx.RawBody).toBe("reacted with 😅");
                        (0, vitest_1.expect)(callArgs.ctx.Body).toContain("reacted with 😅");
                        (0, vitest_1.expect)(callArgs.ctx.Body).not.toContain("[[reply_to:");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("ack reactions", function () {
        (0, vitest_1.it)("sends ack reaction when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesReaction, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./reactions.js"); })];
                    case 1:
                        sendBlueBubblesReaction = (_a.sent()).sendBlueBubblesReaction;
                        vitest_1.vi.mocked(sendBlueBubblesReaction).mockClear();
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {
                            messages: {
                                ackReaction: "❤️",
                                ackReactionScope: "direct",
                            },
                        };
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesReaction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            chatGuid: "iMessage;-;+15551234567",
                            messageGuid: "msg-1",
                            emoji: "❤️",
                            opts: vitest_1.expect.objectContaining({ accountId: "default" }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("command gating", function () {
        (0, vitest_1.it)("allows control command to bypass mention gating when authorized", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResolveRequireMention.mockReturnValue(true);
                        mockMatchesMentionPatterns.mockReturnValue(false); // Not mentioned
                        mockHasControlCommand.mockReturnValue(true); // Has control command
                        mockResolveCommandAuthorizedFromAuthorizers.mockReturnValue(true); // Authorized
                        account = createMockAccount({
                            groupPolicy: "open",
                            allowFrom: ["+15551234567"],
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "/status",
                                handle: { address: "+15551234567" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        // Should process even without mention because it's an authorized control command
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("blocks control command from unauthorized sender in group", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockHasControlCommand.mockReturnValue(true);
                        mockResolveCommandAuthorizedFromAuthorizers.mockReturnValue(false);
                        account = createMockAccount({
                            groupPolicy: "open",
                            allowFrom: [], // No one authorized
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "/status",
                                handle: { address: "+15559999999" },
                                isGroup: true,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;+;chat123456",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("typing/read receipt toggles", function () {
        (0, vitest_1.it)("marks chat as read when sendReadReceipts=true (default)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var markBlueBubblesChatRead, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        markBlueBubblesChatRead = (_a.sent()).markBlueBubblesChatRead;
                        vitest_1.vi.mocked(markBlueBubblesChatRead).mockClear();
                        account = createMockAccount({
                            sendReadReceipts: true,
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(markBlueBubblesChatRead).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does not mark chat as read when sendReadReceipts=false", function () { return __awaiter(void 0, void 0, void 0, function () {
            var markBlueBubblesChatRead, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        markBlueBubblesChatRead = (_a.sent()).markBlueBubblesChatRead;
                        vitest_1.vi.mocked(markBlueBubblesChatRead).mockClear();
                        account = createMockAccount({
                            sendReadReceipts: false,
                        });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(markBlueBubblesChatRead).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("sends typing indicator when processing message", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesTyping, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        sendBlueBubblesTyping = (_a.sent()).sendBlueBubblesTyping;
                        vitest_1.vi.mocked(sendBlueBubblesTyping).mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        mockDispatchReplyWithBufferedBlockDispatcher.mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, ((_b = (_a = params.dispatcherOptions).onReplyStart) === null || _b === void 0 ? void 0 : _b.call(_a))];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        // Should call typing start when reply flow triggers it.
                        (0, vitest_1.expect)(sendBlueBubblesTyping).toHaveBeenCalledWith(vitest_1.expect.any(String), true, vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("stops typing on idle", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesTyping, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        sendBlueBubblesTyping = (_a.sent()).sendBlueBubblesTyping;
                        vitest_1.vi.mocked(sendBlueBubblesTyping).mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        mockDispatchReplyWithBufferedBlockDispatcher.mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, ((_b = (_a = params.dispatcherOptions).onReplyStart) === null || _b === void 0 ? void 0 : _b.call(_a))];
                                    case 1:
                                        _e.sent();
                                        return [4 /*yield*/, params.dispatcherOptions.deliver({ text: "replying now" }, { kind: "final" })];
                                    case 2:
                                        _e.sent();
                                        return [4 /*yield*/, ((_d = (_c = params.dispatcherOptions).onIdle) === null || _d === void 0 ? void 0 : _d.call(_c))];
                                    case 3:
                                        _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesTyping).toHaveBeenCalledWith(vitest_1.expect.any(String), false, vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("stops typing when no reply is sent", function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendBlueBubblesTyping, account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./chat.js"); })];
                    case 1:
                        sendBlueBubblesTyping = (_a.sent()).sendBlueBubblesTyping;
                        vitest_1.vi.mocked(sendBlueBubblesTyping).mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        mockDispatchReplyWithBufferedBlockDispatcher.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); });
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(sendBlueBubblesTyping).toHaveBeenCalledWith(vitest_1.expect.any(String), false, vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("outbound message ids", function () {
        (0, vitest_1.it)("enqueues system event for outbound message id", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockEnqueueSystemEvent.mockClear();
                        mockDispatchReplyWithBufferedBlockDispatcher.mockImplementationOnce(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, params.dispatcherOptions.deliver({ text: "replying now" }, { kind: "final" })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "msg-1",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        // Outbound message ID uses short ID "2" (inbound msg-1 is "1", outbound msg-123 is "2")
                        (0, vitest_1.expect)(mockEnqueueSystemEvent).toHaveBeenCalledWith('Assistant sent "replying now" [message_id:2]', vitest_1.expect.objectContaining({
                            sessionKey: "agent:main:bluebubbles:dm:+15551234567",
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("reaction events", function () {
        (0, vitest_1.it)("enqueues system event for reaction added", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockEnqueueSystemEvent.mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "message-reaction",
                            data: {
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                associatedMessageGuid: "msg-original-123",
                                associatedMessageType: 2000, // Heart reaction added
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockEnqueueSystemEvent).toHaveBeenCalledWith(vitest_1.expect.stringContaining("reacted with ❤️ [[reply_to:"), vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("enqueues system event for reaction removed", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockEnqueueSystemEvent.mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "message-reaction",
                            data: {
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                associatedMessageGuid: "msg-original-123",
                                associatedMessageType: 3000, // Heart reaction removed
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockEnqueueSystemEvent).toHaveBeenCalledWith(vitest_1.expect.stringContaining("removed ❤️ reaction [[reply_to:"), vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("ignores reaction from self (fromMe=true)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockEnqueueSystemEvent.mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "message-reaction",
                            data: {
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: true, // From self
                                associatedMessageGuid: "msg-original-123",
                                associatedMessageType: 2000,
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockEnqueueSystemEvent).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("maps reaction types to correct emojis", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockEnqueueSystemEvent.mockClear();
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "message-reaction",
                            data: {
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                associatedMessageGuid: "msg-123",
                                associatedMessageType: 2001, // Thumbs up
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockEnqueueSystemEvent).toHaveBeenCalledWith(vitest_1.expect.stringContaining("👍"), vitest_1.expect.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("short message ID mapping", function () {
        (0, vitest_1.it)("assigns sequential short IDs to messages", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res, callArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "p:1/msg-uuid-12345",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).toHaveBeenCalled();
                        callArgs = mockDispatchReplyWithBufferedBlockDispatcher.mock.calls[0][0];
                        // MessageSid should be short ID "1" instead of full UUID
                        (0, vitest_1.expect)(callArgs.ctx.MessageSid).toBe("1");
                        (0, vitest_1.expect)(callArgs.ctx.MessageSidFull).toBe("p:1/msg-uuid-12345");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("resolves short ID back to UUID", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount({ dmPolicy: "open" });
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "hello",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: false,
                                guid: "p:1/msg-uuid-12345",
                                chatGuid: "iMessage;-;+15551234567",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        // The short ID "1" should resolve back to the full UUID
                        (0, vitest_1.expect)((0, monitor_js_1.resolveBlueBubblesMessageId)("1")).toBe("p:1/msg-uuid-12345");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns UUID unchanged when not in cache", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveBlueBubblesMessageId)("msg-not-cached")).toBe("msg-not-cached");
        });
        (0, vitest_1.it)("returns short ID unchanged when numeric but not in cache", function () {
            (0, vitest_1.expect)((0, monitor_js_1.resolveBlueBubblesMessageId)("999")).toBe("999");
        });
        (0, vitest_1.it)("throws when numeric short ID is missing and requireKnownShortId is set", function () {
            (0, vitest_1.expect)(function () { return (0, monitor_js_1.resolveBlueBubblesMessageId)("999", { requireKnownShortId: true }); }).toThrow(/short message id/i);
        });
    });
    (0, vitest_1.describe)("fromMe messages", function () {
        (0, vitest_1.it)("ignores messages from self (fromMe=true)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, config, core, payload, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = createMockAccount();
                        config = {};
                        core = createMockRuntime();
                        (0, runtime_js_1.setBlueBubblesRuntime)(core);
                        unregister = (0, monitor_js_1.registerBlueBubblesWebhookTarget)({
                            account: account,
                            config: config,
                            runtime: { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() },
                            core: core,
                            path: "/bluebubbles-webhook",
                        });
                        payload = {
                            type: "new-message",
                            data: {
                                text: "my own message",
                                handle: { address: "+15551234567" },
                                isGroup: false,
                                isFromMe: true,
                                guid: "msg-1",
                                date: Date.now(),
                            },
                        };
                        req = createMockRequest("POST", "/bluebubbles-webhook", payload);
                        res = createMockResponse();
                        return [4 /*yield*/, (0, monitor_js_1.handleBlueBubblesWebhookRequest)(req, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(mockDispatchReplyWithBufferedBlockDispatcher).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
