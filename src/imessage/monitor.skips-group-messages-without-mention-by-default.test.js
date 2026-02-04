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
var monitor_js_1 = require("./monitor.js");
var requestMock = vitest_1.vi.fn();
var stopMock = vitest_1.vi.fn();
var sendMock = vitest_1.vi.fn();
var replyMock = vitest_1.vi.fn();
var updateLastRouteMock = vitest_1.vi.fn();
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
var config = {};
var notificationHandler;
var closeResolve;
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
vitest_1.vi.mock("./send.js", function () { return ({
    sendMessageIMessage: function () {
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
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("./client.js", function () { return ({
    createIMessageRpcClient: vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            notificationHandler = opts.onNotification;
            return [2 /*return*/, {
                    request: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return requestMock.apply(void 0, args);
                    },
                    waitForClose: function () {
                        return new Promise(function (resolve) {
                            closeResolve = resolve;
                        });
                    },
                    stop: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return stopMock.apply(void 0, args);
                    },
                }];
        });
    }); }),
}); });
vitest_1.vi.mock("./probe.js", function () { return ({
    probeIMessage: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true })];
    }); }); }),
}); });
var flush = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
function waitForSubscribe() {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 4];
                    if (requestMock.mock.calls.some(function (call) { return call[0] === "watch.subscribe"; })) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.beforeEach)(function () {
    config = {
        channels: {
            imessage: {
                dmPolicy: "open",
                allowFrom: ["*"],
                groups: { "*": { requireMention: true } },
            },
        },
        session: { mainKey: "main" },
        messages: {
            groupChat: { mentionPatterns: ["@openclaw"] },
        },
    };
    requestMock.mockReset().mockImplementation(function (method) {
        if (method === "watch.subscribe") {
            return Promise.resolve({ subscription: 1 });
        }
        return Promise.resolve({});
    });
    stopMock.mockReset().mockResolvedValue(undefined);
    sendMock.mockReset().mockResolvedValue({ messageId: "ok" });
    replyMock.mockReset().mockResolvedValue({ text: "ok" });
    updateLastRouteMock.mockReset();
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
    notificationHandler = undefined;
    closeResolve = undefined;
});
(0, vitest_1.describe)("monitorIMessageProvider", function () {
    (0, vitest_1.it)("skips group messages without a mention by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _a.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 1,
                                chat_id: 99,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello group",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages when imessage groups default disables mention gating", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { groupPolicy: "open", groups: { "*": { requireMention: false } } }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _b.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 11,
                                chat_id: 123,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello group",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages when requireMention is true but no mentionPatterns exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { messages: { groupChat: { mentionPatterns: [] } }, channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { groupPolicy: "open", groups: { "*": { requireMention: true } } }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _b.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 12,
                                chat_id: 777,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello group",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when imessage.groups is set without a wildcard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { groups: { "99": { requireMention: false } } }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _b.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 13,
                                chat_id: 123,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "@openclaw hello",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats configured chat_id as a group session even when is_group is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run, ctx;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { dmPolicy: "open", allowFrom: ["*"], groups: { "2": { requireMention: false } } }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _c.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 14,
                                chat_id: 2,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello",
                                is_group: false,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _c.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalled();
                    ctx = (_b = replyMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(ctx.ChatType).toBe("group");
                    (0, vitest_1.expect)(ctx.SessionKey).toBe("agent:main:imessage:group:2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes final replies with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = __assign(__assign({}, config), { messages: { responsePrefix: "PFX" } });
                    replyMock.mockResolvedValue({ text: "final reply" });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _a.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 7,
                                chat_id: 77,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello",
                                is_group: false,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _a.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMock.mock.calls[0][1]).toBe("PFX final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to dmPolicy=pairing behavior when allowFrom is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { dmPolicy: "pairing", allowFrom: [], groups: { "*": { requireMention: true } } }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _f.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 99,
                                chat_id: 77,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "hello",
                                is_group: false,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _f.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _f.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(upsertPairingRequestMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(String((_c = (_b = sendMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "")).toContain("Your iMessage sender id: +15550001111");
                    (0, vitest_1.expect)(String((_e = (_d = sendMock.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : "")).toContain("Pairing code: PAIRCODE");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delivers group replies when mentioned", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run, ctx;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    replyMock.mockResolvedValueOnce({ text: "yo" });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _d.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 2,
                                chat_id: 42,
                                sender: "+15550002222",
                                is_from_me: false,
                                text: "@openclaw ping",
                                is_group: true,
                                chat_name: "Lobster Squad",
                                participants: ["+1555", "+1556"],
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _d.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalledOnce();
                    ctx = (_a = replyMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(ctx.ChatType).toBe("group");
                    // Sender should appear as prefix in group messages (no redundant [from:] suffix)
                    (0, vitest_1.expect)(String((_b = ctx.Body) !== null && _b !== void 0 ? _b : "")).toContain("+15550002222:");
                    (0, vitest_1.expect)(String((_c = ctx.Body) !== null && _c !== void 0 ? _c : "")).not.toContain("[from:");
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledWith("chat_id:42", "yo", vitest_1.expect.objectContaining({ client: vitest_1.expect.any(Object) }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors group allowlist when groupPolicy is allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { groupPolicy: "allowlist", groupAllowFrom: ["chat_id:101"] }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _b.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 3,
                                chat_id: 202,
                                sender: "+15550003333",
                                is_from_me: false,
                                text: "@openclaw hi",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when groupPolicy is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign(__assign({}, config), { channels: __assign(__assign({}, config.channels), { imessage: __assign(__assign({}, (_a = config.channels) === null || _a === void 0 ? void 0 : _a.imessage), { groupPolicy: "disabled" }) }) });
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _b.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 10,
                                chat_id: 303,
                                sender: "+15550003333",
                                is_from_me: false,
                                text: "@openclaw hi",
                                is_group: true,
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _b.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(replyMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes group message bodies with sender", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run, ctx, body;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _c.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 11,
                                chat_id: 99,
                                chat_name: "Test Group",
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "@openclaw hi",
                                is_group: true,
                                created_at: "2026-01-17T00:00:00Z",
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _c.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalled();
                    ctx = (_a = replyMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    body = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.Body) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(body).toContain("Test Group id:99");
                    (0, vitest_1.expect)(body).toContain("+15550001111: @openclaw hi");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes reply context when imessage reply metadata is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run, ctx;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    run = (0, monitor_js_1.monitorIMessageProvider)();
                    return [4 /*yield*/, waitForSubscribe()];
                case 1:
                    _d.sent();
                    notificationHandler === null || notificationHandler === void 0 ? void 0 : notificationHandler({
                        method: "message",
                        params: {
                            message: {
                                id: 12,
                                chat_id: 55,
                                sender: "+15550001111",
                                is_from_me: false,
                                text: "replying now",
                                is_group: false,
                                reply_to_id: 9001,
                                reply_to_text: "original message",
                                reply_to_sender: "+15559998888",
                            },
                        },
                    });
                    return [4 /*yield*/, flush()];
                case 2:
                    _d.sent();
                    closeResolve === null || closeResolve === void 0 ? void 0 : closeResolve();
                    return [4 /*yield*/, run];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(replyMock).toHaveBeenCalled();
                    ctx = (_a = replyMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(ctx.ReplyToId).toBe("9001");
                    (0, vitest_1.expect)(ctx.ReplyToBody).toBe("original message");
                    (0, vitest_1.expect)(ctx.ReplyToSender).toBe("+15559998888");
                    (0, vitest_1.expect)(String((_b = ctx.Body) !== null && _b !== void 0 ? _b : "")).toContain("[Replying to +15559998888 id:9001]");
                    (0, vitest_1.expect)(String((_c = ctx.Body) !== null && _c !== void 0 ? _c : "")).toContain("original message");
                    return [2 /*return*/];
            }
        });
    }); });
});
