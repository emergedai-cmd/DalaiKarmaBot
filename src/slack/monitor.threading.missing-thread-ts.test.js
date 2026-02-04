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
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var monitorSlackProvider = (await Promise.resolve().then(function () { return require("./monitor.js"); })).monitorSlackProvider;
var sendMock = vitest_1.vi.fn();
var replyMock = vitest_1.vi.fn();
var updateLastRouteMock = vitest_1.vi.fn();
var reactMock = vitest_1.vi.fn();
var config = {};
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
var getSlackHandlers = function () {
    return globalThis.__slackHandlers;
};
var getSlackClient = function () {
    return globalThis.__slackClient;
};
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return config; } })];
        }
    });
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () { return ({
    getReplyFromConfig: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return replyMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("./resolve-channels.js", function () { return ({
    resolveSlackChannelAllowlist: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var entries = _b.entries;
        return __generator(this, function (_c) {
            return [2 /*return*/, entries.map(function (input) { return ({ input: input, resolved: false }); })];
        });
    }); },
}); });
vitest_1.vi.mock("./resolve-users.js", function () { return ({
    resolveSlackUserAllowlist: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var entries = _b.entries;
        return __generator(this, function (_c) {
            return [2 /*return*/, entries.map(function (input) { return ({ input: input, resolved: false }); })];
        });
    }); },
}); });
vitest_1.vi.mock("./send.js", function () { return ({
    sendMessageSlack: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return sendMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromStoreMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return upsertPairingRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../config/sessions.js", function () { return ({
    resolveStorePath: vitest_1.vi.fn(function () { return "/tmp/openclaw-sessions.json"; }),
    updateLastRoute: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return updateLastRouteMock.apply(void 0, args);
    },
    resolveSessionKey: vitest_1.vi.fn(),
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("@slack/bolt", function () {
    var handlers = new Map();
    globalThis.__slackHandlers = handlers;
    var client = {
        auth: { test: vitest_1.vi.fn().mockResolvedValue({ user_id: "bot-user" }) },
        conversations: {
            info: vitest_1.vi.fn().mockResolvedValue({
                channel: { name: "general", is_channel: true },
            }),
            replies: vitest_1.vi.fn().mockResolvedValue({ messages: [] }),
            history: vitest_1.vi.fn().mockResolvedValue({ messages: [] }),
        },
        users: {
            info: vitest_1.vi.fn().mockResolvedValue({
                user: { profile: { display_name: "Ada" } },
            }),
        },
        assistant: {
            threads: {
                setStatus: vitest_1.vi.fn().mockResolvedValue({ ok: true }),
            },
        },
        reactions: {
            add: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return reactMock.apply(void 0, args);
            },
        },
    };
    globalThis.__slackClient = client;
    var App = /** @class */ (function () {
        function App() {
            this.client = client;
            this.start = vitest_1.vi.fn().mockResolvedValue(undefined);
            this.stop = vitest_1.vi.fn().mockResolvedValue(undefined);
        }
        App.prototype.event = function (name, handler) {
            handlers.set(name, handler);
        };
        App.prototype.command = function () {
            /* no-op */
        };
        return App;
    }());
    var HTTPReceiver = /** @class */ (function () {
        function HTTPReceiver() {
            this.requestListener = vitest_1.vi.fn();
        }
        return HTTPReceiver;
    }());
    return { App: App, HTTPReceiver: HTTPReceiver, default: { App: App, HTTPReceiver: HTTPReceiver } };
});
var flush = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
function waitForEvent(name) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    if ((_a = getSlackHandlers()) === null || _a === void 0 ? void 0 : _a.has(name)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.beforeEach)(function () {
    var _a;
    (0, inbound_dedupe_js_1.resetInboundDedupe)();
    (_a = getSlackHandlers()) === null || _a === void 0 ? void 0 : _a.clear();
    config = {
        messages: { responsePrefix: "PFX" },
        channels: {
            slack: {
                dm: { enabled: true, policy: "open", allowFrom: ["*"] },
                groupPolicy: "open",
                channels: { C1: { allow: true, requireMention: false } },
            },
        },
    };
    sendMock.mockReset().mockResolvedValue(undefined);
    replyMock.mockReset();
    updateLastRouteMock.mockReset();
    reactMock.mockReset();
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
});
(0, vitest_1.describe)("monitorSlackProvider threading", function () {
    (0, vitest_1.it)("recovers missing thread_ts when parent_user_id is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, conversations, controller, run, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    replyMock.mockResolvedValue({ text: "thread reply" });
                    client = getSlackClient();
                    if (!client) {
                        throw new Error("Slack client not registered");
                    }
                    conversations = client.conversations;
                    conversations.history.mockResolvedValueOnce({
                        messages: [{ ts: "456", thread_ts: "111.222" }],
                    });
                    controller = new AbortController();
                    run = monitorSlackProvider({
                        botToken: "bot-token",
                        appToken: "app-token",
                        abortSignal: controller.signal,
                    });
                    return [4 /*yield*/, waitForEvent("message")];
                case 1:
                    _b.sent();
                    handler = (_a = getSlackHandlers()) === null || _a === void 0 ? void 0 : _a.get("message");
                    if (!handler) {
                        throw new Error("Slack message handler not registered");
                    }
                    return [4 /*yield*/, handler({
                            event: {
                                type: "message",
                                user: "U1",
                                text: "hello",
                                ts: "456",
                                parent_user_id: "U2",
                                channel: "C1",
                                channel_type: "channel",
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, flush()];
                case 3:
                    _b.sent();
                    controller.abort();
                    return [4 /*yield*/, run];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock.mock.calls[0][2]).toMatchObject({ threadTs: "111.222" });
                    return [2 /*return*/];
            }
        });
    }); });
});
