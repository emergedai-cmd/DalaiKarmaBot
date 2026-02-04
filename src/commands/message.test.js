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
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var loadMessageCommand = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./message.js"); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var testConfig = {};
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return testConfig; } })];
        }
    });
}); });
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return callGatewayMock.apply(void 0, args);
    },
    randomIdempotencyKey: function () { return "idem-1"; },
}); });
var webAuthExists = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, false];
}); }); });
vitest_1.vi.mock("../web/session.js", function () { return ({
    webAuthExists: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return webAuthExists.apply(void 0, args);
    },
}); });
var handleDiscordAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ details: { ok: true } })];
}); }); });
vitest_1.vi.mock("../agents/tools/discord-actions.js", function () { return ({
    handleDiscordAction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return handleDiscordAction.apply(void 0, args);
    },
}); });
var handleSlackAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ details: { ok: true } })];
}); }); });
vitest_1.vi.mock("../agents/tools/slack-actions.js", function () { return ({
    handleSlackAction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return handleSlackAction.apply(void 0, args);
    },
}); });
var handleTelegramAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ details: { ok: true } })];
}); }); });
vitest_1.vi.mock("../agents/tools/telegram-actions.js", function () { return ({
    handleTelegramAction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return handleTelegramAction.apply(void 0, args);
    },
}); });
var handleWhatsAppAction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ details: { ok: true } })];
}); }); });
vitest_1.vi.mock("../agents/tools/whatsapp-actions.js", function () { return ({
    handleWhatsAppAction: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return handleWhatsAppAction.apply(void 0, args);
    },
}); });
var originalTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
var originalDiscordToken = process.env.DISCORD_BOT_TOKEN;
var setRegistry = function (registry) { return __awaiter(void 0, void 0, void 0, function () {
    var setActivePluginRegistry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins/runtime.js"); })];
            case 1:
                setActivePluginRegistry = (_a.sent()).setActivePluginRegistry;
                setActivePluginRegistry(registry);
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process.env.TELEGRAM_BOT_TOKEN = "";
                process.env.DISCORD_BOT_TOKEN = "";
                testConfig = {};
                vitest_1.vi.resetModules();
                return [4 /*yield*/, setRegistry((0, channel_plugins_js_1.createTestRegistry)([]))];
            case 1:
                _a.sent();
                callGatewayMock.mockReset();
                webAuthExists.mockReset().mockResolvedValue(false);
                handleDiscordAction.mockReset();
                handleSlackAction.mockReset();
                handleTelegramAction.mockReset();
                handleWhatsAppAction.mockReset();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () {
    process.env.TELEGRAM_BOT_TOKEN = originalTelegramToken;
    process.env.DISCORD_BOT_TOKEN = originalDiscordToken;
});
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(function () {
        throw new Error("exit");
    }),
};
var makeDeps = function (overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (__assign({ sendMessageWhatsApp: vitest_1.vi.fn(), sendMessageTelegram: vitest_1.vi.fn(), sendMessageDiscord: vitest_1.vi.fn(), sendMessageSlack: vitest_1.vi.fn(), sendMessageSignal: vitest_1.vi.fn(), sendMessageIMessage: vitest_1.vi.fn() }, overrides));
};
var createStubPlugin = function (params) {
    var _a, _b;
    return ({
        id: params.id,
        meta: {
            id: params.id,
            label: (_a = params.label) !== null && _a !== void 0 ? _a : String(params.id),
            selectionLabel: (_b = params.label) !== null && _b !== void 0 ? _b : String(params.id),
            docsPath: "/channels/".concat(params.id),
            blurb: "test stub.",
        },
        capabilities: { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return ["default"]; },
            resolveAccount: function () { return ({}); },
            isConfigured: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); }); },
        },
        actions: params.actions,
        outbound: params.outbound,
    });
};
(0, vitest_1.describe)("messageCommand", function () {
    (0, vitest_1.it)("defaults channel when only one configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deps, messageCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.TELEGRAM_BOT_TOKEN = "token-abc";
                    return [4 /*yield*/, setRegistry((0, channel_plugins_js_1.createTestRegistry)([
                            {
                                pluginId: "telegram",
                                source: "test",
                                plugin: createStubPlugin({
                                    id: "telegram",
                                    label: "Telegram",
                                    actions: {
                                        listActions: function () { return ["send"]; },
                                        handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                            var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0: return [4 /*yield*/, handleTelegramAction({ action: action, to: params.to, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                                                    case 1: return [2 /*return*/, _c.sent()];
                                                }
                                            });
                                        }); },
                                    },
                                }),
                            },
                        ]))];
                case 1:
                    _a.sent();
                    deps = makeDeps();
                    return [4 /*yield*/, loadMessageCommand()];
                case 2:
                    messageCommand = (_a.sent()).messageCommand;
                    return [4 /*yield*/, messageCommand({
                            target: "123456",
                            message: "hi",
                        }, deps, runtime)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(handleTelegramAction).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires channel when multiple configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deps, messageCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.TELEGRAM_BOT_TOKEN = "token-abc";
                    process.env.DISCORD_BOT_TOKEN = "token-discord";
                    return [4 /*yield*/, setRegistry((0, channel_plugins_js_1.createTestRegistry)([
                            {
                                pluginId: "telegram",
                                source: "test",
                                plugin: createStubPlugin({
                                    id: "telegram",
                                    label: "Telegram",
                                    actions: {
                                        listActions: function () { return ["send"]; },
                                        handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                            var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0: return [4 /*yield*/, handleTelegramAction({ action: action, to: params.to, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                                                    case 1: return [2 /*return*/, _c.sent()];
                                                }
                                            });
                                        }); },
                                    },
                                }),
                            },
                            {
                                pluginId: "discord",
                                source: "test",
                                plugin: createStubPlugin({
                                    id: "discord",
                                    label: "Discord",
                                    actions: {
                                        listActions: function () { return ["poll"]; },
                                        handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                            var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0: return [4 /*yield*/, handleDiscordAction({ action: action, to: params.to, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                                                    case 1: return [2 /*return*/, _c.sent()];
                                                }
                                            });
                                        }); },
                                    },
                                }),
                            },
                        ]))];
                case 1:
                    _a.sent();
                    deps = makeDeps();
                    return [4 /*yield*/, loadMessageCommand()];
                case 2:
                    messageCommand = (_a.sent()).messageCommand;
                    return [4 /*yield*/, (0, vitest_1.expect)(messageCommand({
                            target: "123",
                            message: "hi",
                        }, deps, runtime)).rejects.toThrow(/Channel is required/)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends via gateway for WhatsApp", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deps, messageCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockResolvedValueOnce({ messageId: "g1" });
                    return [4 /*yield*/, setRegistry((0, channel_plugins_js_1.createTestRegistry)([
                            {
                                pluginId: "whatsapp",
                                source: "test",
                                plugin: createStubPlugin({
                                    id: "whatsapp",
                                    label: "WhatsApp",
                                    outbound: {
                                        deliveryMode: "gateway",
                                    },
                                }),
                            },
                        ]))];
                case 1:
                    _a.sent();
                    deps = makeDeps();
                    return [4 /*yield*/, loadMessageCommand()];
                case 2:
                    messageCommand = (_a.sent()).messageCommand;
                    return [4 /*yield*/, messageCommand({
                            action: "send",
                            channel: "whatsapp",
                            target: "+15551234567",
                            message: "hi",
                        }, deps, runtime)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes discord polls through message action", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deps, messageCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setRegistry((0, channel_plugins_js_1.createTestRegistry)([
                        {
                            pluginId: "discord",
                            source: "test",
                            plugin: createStubPlugin({
                                id: "discord",
                                label: "Discord",
                                actions: {
                                    listActions: function () { return ["poll"]; },
                                    handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                        var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, handleDiscordAction({ action: action, to: params.to, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                                                case 1: return [2 /*return*/, _c.sent()];
                                            }
                                        });
                                    }); },
                                },
                            }),
                        },
                    ]))];
                case 1:
                    _a.sent();
                    deps = makeDeps();
                    return [4 /*yield*/, loadMessageCommand()];
                case 2:
                    messageCommand = (_a.sent()).messageCommand;
                    return [4 /*yield*/, messageCommand({
                            action: "poll",
                            channel: "discord",
                            target: "channel:123456789",
                            pollQuestion: "Snack?",
                            pollOption: ["Pizza", "Sushi"],
                        }, deps, runtime)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(handleDiscordAction).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        action: "poll",
                        to: "channel:123456789",
                    }), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
});
