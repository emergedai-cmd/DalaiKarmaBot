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
var channel_js_1 = require("../../../extensions/slack/src/channel.js");
var channel_js_2 = require("../../../extensions/telegram/src/channel.js");
var channel_js_3 = require("../../../extensions/whatsapp/src/channel.js");
var common_js_1 = require("../../agents/tools/common.js");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var media_js_1 = require("../../web/media.js");
var message_action_runner_js_1 = require("./message-action-runner.js");
vitest_1.vi.mock("../../web/media.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../web/media.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadWebMedia: vitest_1.vi.fn(actual.loadWebMedia) })];
        }
    });
}); });
var slackConfig = {
    channels: {
        slack: {
            botToken: "xoxb-test",
            appToken: "xapp-test",
        },
    },
};
var whatsappConfig = {
    channels: {
        whatsapp: {
            allowFrom: ["*"],
        },
    },
};
(0, vitest_1.describe)("runMessageAction context isolation", function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createPluginRuntime, setSlackRuntime, setTelegramRuntime, setWhatsAppRuntime, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../plugins/runtime/index.js"); })];
                case 1:
                    createPluginRuntime = (_a.sent()).createPluginRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../extensions/slack/src/runtime.js"); })];
                case 2:
                    setSlackRuntime = (_a.sent()).setSlackRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../extensions/telegram/src/runtime.js"); })];
                case 3:
                    setTelegramRuntime = (_a.sent()).setTelegramRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../extensions/whatsapp/src/runtime.js"); })];
                case 4:
                    setWhatsAppRuntime = (_a.sent()).setWhatsAppRuntime;
                    runtime = createPluginRuntime();
                    setSlackRuntime(runtime);
                    setTelegramRuntime(runtime);
                    setWhatsAppRuntime(runtime);
                    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
                        {
                            pluginId: "slack",
                            source: "test",
                            plugin: channel_js_1.slackPlugin,
                        },
                        {
                            pluginId: "whatsapp",
                            source: "test",
                            plugin: channel_js_3.whatsappPlugin,
                        },
                        {
                            pluginId: "telegram",
                            source: "test",
                            plugin: channel_js_2.telegramPlugin,
                        },
                        {
                            pluginId: "imessage",
                            source: "test",
                            plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)(),
                        },
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
    });
    (0, vitest_1.it)("allows send when target matches current channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            target: "#C12345678",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "C12345678" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts legacy to parameter for send", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            to: "#C12345678",
                            message: "hi",
                        },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to current channel when target is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "C12345678" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows media-only send when target matches current channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            target: "#C12345678",
                            media: "https://example.com/note.ogg",
                        },
                        toolContext: { currentChannelId: "C12345678" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires message when no media hint is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            target: "#C12345678",
                        },
                        toolContext: { currentChannelId: "C12345678" },
                        dryRun: true,
                    })).rejects.toThrow(/message required/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks send when target differs from current channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "slack",
                            target: "channel:C99999999",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "C12345678", currentChannelProvider: "slack" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks thread-reply when channelId differs from current channel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "thread-reply",
                        params: {
                            channel: "slack",
                            target: "C99999999",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "C12345678", currentChannelProvider: "slack" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("action");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows WhatsApp send when target matches current chat", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: whatsappConfig,
                        action: "send",
                        params: {
                            channel: "whatsapp",
                            target: "123@g.us",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "123@g.us" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks WhatsApp send when target differs from current chat", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: whatsappConfig,
                        action: "send",
                        params: {
                            channel: "whatsapp",
                            target: "456@g.us",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "123@g.us", currentChannelProvider: "whatsapp" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows iMessage send when target matches current handle", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: whatsappConfig,
                        action: "send",
                        params: {
                            channel: "imessage",
                            target: "imessage:+15551234567",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "imessage:+15551234567" },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks iMessage send when target differs from current handle", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: whatsappConfig,
                        action: "send",
                        params: {
                            channel: "imessage",
                            target: "imessage:+15551230000",
                            message: "hi",
                        },
                        toolContext: {
                            currentChannelId: "imessage:+15551234567",
                            currentChannelProvider: "imessage",
                        },
                        dryRun: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("infers channel + target from tool context when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var multiConfig, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    multiConfig = {
                        channels: {
                            slack: {
                                botToken: "xoxb-test",
                                appToken: "xapp-test",
                            },
                            telegram: {
                                token: "tg-test",
                            },
                        },
                    };
                    return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                            cfg: multiConfig,
                            action: "send",
                            params: {
                                message: "hi",
                            },
                            toolContext: { currentChannelId: "C12345678", currentChannelProvider: "slack" },
                            dryRun: true,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("send");
                    (0, vitest_1.expect)(result.channel).toBe("slack");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks cross-provider sends by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, message_action_runner_js_1.runMessageAction)({
                        cfg: slackConfig,
                        action: "send",
                        params: {
                            channel: "telegram",
                            target: "telegram:@ops",
                            message: "hi",
                        },
                        toolContext: { currentChannelId: "C12345678", currentChannelProvider: "slack" },
                        dryRun: true,
                    })).rejects.toThrow(/Cross-context messaging denied/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks same-provider cross-context when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = __assign(__assign({}, slackConfig), { tools: {
                            message: {
                                crossContext: {
                                    allowWithinProvider: false,
                                },
                            },
                        } });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, message_action_runner_js_1.runMessageAction)({
                            cfg: cfg,
                            action: "send",
                            params: {
                                channel: "slack",
                                target: "channel:C99999999",
                                message: "hi",
                            },
                            toolContext: { currentChannelId: "C12345678", currentChannelProvider: "slack" },
                            dryRun: true,
                        })).rejects.toThrow(/Cross-context messaging denied/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("aborts send when abortSignal is already aborted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    controller.abort();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, message_action_runner_js_1.runMessageAction)({
                            cfg: slackConfig,
                            action: "send",
                            params: {
                                channel: "slack",
                                target: "#C12345678",
                                message: "hi",
                            },
                            dryRun: true,
                            abortSignal: controller.signal,
                        })).rejects.toMatchObject({ name: "AbortError" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("aborts broadcast when abortSignal is already aborted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var controller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    controller.abort();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, message_action_runner_js_1.runMessageAction)({
                            cfg: slackConfig,
                            action: "broadcast",
                            params: {
                                targets: ["channel:C12345678"],
                                channel: "slack",
                                message: "hi",
                            },
                            dryRun: true,
                            abortSignal: controller.signal,
                        })).rejects.toMatchObject({ name: "AbortError" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("runMessageAction sendAttachment hydration", function () {
    var attachmentPlugin = {
        id: "bluebubbles",
        meta: {
            id: "bluebubbles",
            label: "BlueBubbles",
            selectionLabel: "BlueBubbles",
            docsPath: "/channels/bluebubbles",
            blurb: "BlueBubbles test plugin.",
        },
        capabilities: { chatTypes: ["direct"], media: true },
        config: {
            listAccountIds: function () { return ["default"]; },
            resolveAccount: function () { return ({ enabled: true }); },
            isConfigured: function () { return true; },
        },
        actions: {
            listActions: function () { return ["sendAttachment"]; },
            supportsAction: function (_a) {
                var action = _a.action;
                return action === "sendAttachment";
            },
            handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                var params = _b.params;
                return __generator(this, function (_c) {
                    return [2 /*return*/, (0, common_js_1.jsonResult)({
                            ok: true,
                            buffer: params.buffer,
                            filename: params.filename,
                            caption: params.caption,
                            contentType: params.contentType,
                        })];
                });
            }); },
        },
    };
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "bluebubbles",
                source: "test",
                plugin: attachmentPlugin,
            },
        ]));
        vitest_1.vi.mocked(media_js_1.loadWebMedia).mockResolvedValue({
            buffer: Buffer.from("hello"),
            contentType: "image/png",
            kind: "image",
            fileName: "pic.png",
        });
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("hydrates buffer and filename from media for sendAttachment", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            bluebubbles: {
                                enabled: true,
                                serverUrl: "http://localhost:1234",
                                password: "test-password",
                            },
                        },
                    };
                    return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                            cfg: cfg,
                            action: "sendAttachment",
                            params: {
                                channel: "bluebubbles",
                                target: "+15551234567",
                                media: "https://example.com/pic.png",
                                message: "caption",
                            },
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("action");
                    (0, vitest_1.expect)(result.payload).toMatchObject({
                        ok: true,
                        filename: "pic.png",
                        caption: "caption",
                        contentType: "image/png",
                    });
                    (0, vitest_1.expect)(result.payload.buffer).toBe(Buffer.from("hello").toString("base64"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("runMessageAction accountId defaults", function () {
    var handleAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
    }); }); });
    var accountPlugin = {
        id: "discord",
        meta: {
            id: "discord",
            label: "Discord",
            selectionLabel: "Discord",
            docsPath: "/channels/discord",
            blurb: "Discord test plugin.",
        },
        capabilities: { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return ["default"]; },
            resolveAccount: function () { return ({}); },
        },
        actions: {
            listActions: function () { return ["send"]; },
            handleAction: handleAction,
        },
    };
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "discord",
                source: "test",
                plugin: accountPlugin,
            },
        ]));
        handleAction.mockClear();
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("propagates defaultAccountId into params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ctx;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                        cfg: {},
                        action: "send",
                        params: {
                            channel: "discord",
                            target: "channel:123",
                            message: "hi",
                        },
                        defaultAccountId: "ops",
                    })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(handleAction).toHaveBeenCalled();
                    ctx = (_a = handleAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(ctx.accountId).toBe("ops");
                    (0, vitest_1.expect)(ctx.params.accountId).toBe("ops");
                    return [2 /*return*/];
            }
        });
    }); });
});
