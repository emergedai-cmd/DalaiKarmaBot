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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var envelope_timestamp_js_1 = require("../../test/helpers/envelope-timestamp.js");
var inbound_contract_js_1 = require("../../test/helpers/inbound-contract.js");
var commands_registry_js_1 = require("../auto-reply/commands-registry.js");
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var bot_js_1 = require("./bot.js");
var fetch_js_1 = require("./fetch.js");
var replyModule;
var listSkillCommandsForAgents = vitest_1.vi.hoisted(function () { return ({
    listSkillCommandsForAgents: vitest_1.vi.fn(function () { return []; }),
}); }).listSkillCommandsForAgents;
vitest_1.vi.mock("../auto-reply/skill-commands.js", function () { return ({
    listSkillCommandsForAgents: listSkillCommandsForAgents,
}); });
var sessionStorePath = vitest_1.vi.hoisted(function () { return ({
    sessionStorePath: "/tmp/openclaw-telegram-bot-".concat(Math.random().toString(16).slice(2), ".json"),
}); }).sessionStorePath;
function resolveSkillCommands(config) {
    return listSkillCommandsForAgents({ cfg: config });
}
var loadWebMedia = vitest_1.vi.hoisted(function () { return ({
    loadWebMedia: vitest_1.vi.fn(),
}); }).loadWebMedia;
vitest_1.vi.mock("../web/media.js", function () { return ({
    loadWebMedia: loadWebMedia,
}); });
var loadConfig = vitest_1.vi.hoisted(function () { return ({
    loadConfig: vitest_1.vi.fn(function () { return ({}); }),
}); }).loadConfig;
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: loadConfig })];
        }
    });
}); });
vitest_1.vi.mock("../config/sessions.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveStorePath: vitest_1.vi.fn(function (storePath) { return storePath !== null && storePath !== void 0 ? storePath : sessionStorePath; }) })];
        }
    });
}); });
var _a = vitest_1.vi.hoisted(function () { return ({
    readChannelAllowFromStore: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    upsertChannelPairingRequest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    code: "PAIRCODE",
                    created: true,
                })];
        });
    }); }),
}); }), readChannelAllowFromStore = _a.readChannelAllowFromStore, upsertChannelPairingRequest = _a.upsertChannelPairingRequest;
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: readChannelAllowFromStore,
    upsertChannelPairingRequest: upsertChannelPairingRequest,
}); });
var enqueueSystemEvent = vitest_1.vi.hoisted(function () { return ({
    enqueueSystemEvent: vitest_1.vi.fn(),
}); }).enqueueSystemEvent;
vitest_1.vi.mock("../infra/system-events.js", function () { return ({
    enqueueSystemEvent: enqueueSystemEvent,
}); });
var wasSentByBot = vitest_1.vi.hoisted(function () { return ({
    wasSentByBot: vitest_1.vi.fn(function () { return false; }),
}); }).wasSentByBot;
vitest_1.vi.mock("./sent-message-cache.js", function () { return ({
    wasSentByBot: wasSentByBot,
    recordSentMessage: vitest_1.vi.fn(),
    clearSentMessageCache: vitest_1.vi.fn(),
}); });
var useSpy = vitest_1.vi.fn();
var middlewareUseSpy = vitest_1.vi.fn();
var onSpy = vitest_1.vi.fn();
var stopSpy = vitest_1.vi.fn();
var commandSpy = vitest_1.vi.fn();
var botCtorSpy = vitest_1.vi.fn();
var answerCallbackQuerySpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var sendChatActionSpy = vitest_1.vi.fn();
var editMessageTextSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 88 })];
}); }); });
var setMessageReactionSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var setMyCommandsSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, undefined];
}); }); });
var sendMessageSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 77 })];
}); }); });
var sendAnimationSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 78 })];
}); }); });
var sendPhotoSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ message_id: 79 })];
}); }); });
var apiStub = {
    config: { use: useSpy },
    answerCallbackQuery: answerCallbackQuerySpy,
    sendChatAction: sendChatActionSpy,
    editMessageText: editMessageTextSpy,
    setMessageReaction: setMessageReactionSpy,
    setMyCommands: setMyCommandsSpy,
    sendMessage: sendMessageSpy,
    sendAnimation: sendAnimationSpy,
    sendPhoto: sendPhotoSpy,
};
vitest_1.vi.mock("grammy", function () { return ({
    Bot: /** @class */ (function () {
        function class_1(token, options) {
            this.token = token;
            this.options = options;
            this.api = apiStub;
            this.use = middlewareUseSpy;
            this.on = onSpy;
            this.stop = stopSpy;
            this.command = commandSpy;
            this.catch = vitest_1.vi.fn();
            botCtorSpy(token, options);
        }
        return class_1;
    }()),
    InputFile: /** @class */ (function () {
        function InputFile() {
        }
        return InputFile;
    }()),
    webhookCallback: vitest_1.vi.fn(),
}); });
var sequentializeMiddleware = vitest_1.vi.fn();
var sequentializeSpy = vitest_1.vi.fn(function () { return sequentializeMiddleware; });
var sequentializeKey;
vitest_1.vi.mock("@grammyjs/runner", function () { return ({
    sequentialize: function (keyFn) {
        sequentializeKey = keyFn;
        return sequentializeSpy();
    },
}); });
var throttlerSpy = vitest_1.vi.fn(function () { return "throttler"; });
vitest_1.vi.mock("@grammyjs/transformer-throttler", function () { return ({
    apiThrottler: function () { return throttlerSpy(); },
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () {
    var replySpy = vitest_1.vi.fn(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ((_a = opts === null || opts === void 0 ? void 0 : opts.onReplyStart) === null || _a === void 0 ? void 0 : _a.call(opts))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, undefined];
            }
        });
    }); });
    return { getReplyFromConfig: replySpy, __replySpy: replySpy };
});
var getOnHandler = function (event) {
    var _a;
    var handler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === event; })) === null || _a === void 0 ? void 0 : _a[1];
    if (!handler) {
        throw new Error("Missing handler for event: ".concat(event));
    }
    return handler;
};
var ORIGINAL_TZ = process.env.TZ;
(0, vitest_1.describe)("createTelegramBot", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/reply.js"); })];
                case 1:
                    replyModule = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.beforeEach)(function () {
        process.env.TZ = "UTC";
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        loadConfig.mockReturnValue({
            agents: {
                defaults: {
                    envelopeTimezone: "utc",
                },
            },
            channels: {
                telegram: { dmPolicy: "open", allowFrom: ["*"] },
            },
        });
        loadWebMedia.mockReset();
        sendAnimationSpy.mockReset();
        sendPhotoSpy.mockReset();
        setMessageReactionSpy.mockReset();
        answerCallbackQuerySpy.mockReset();
        editMessageTextSpy.mockReset();
        setMyCommandsSpy.mockReset();
        wasSentByBot.mockReset();
        middlewareUseSpy.mockReset();
        sequentializeSpy.mockReset();
        botCtorSpy.mockReset();
        sequentializeKey = undefined;
    });
    (0, vitest_1.afterEach)(function () {
        process.env.TZ = ORIGINAL_TZ;
    });
    (0, vitest_1.it)("installs grammY throttler", function () {
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(throttlerSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(useSpy).toHaveBeenCalledWith("throttler");
    });
    (0, vitest_1.it)("merges custom commands with native commands", function () {
        var _a;
        var config = {
            channels: {
                telegram: {
                    customCommands: [
                        { command: "custom_backup", description: "Git backup" },
                        { command: "/Custom_Generate", description: "Create an image" },
                    ],
                },
            },
        };
        loadConfig.mockReturnValue(config);
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        var registered = (_a = setMyCommandsSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        var skillCommands = resolveSkillCommands(config);
        var native = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(config, { skillCommands: skillCommands }).map(function (command) { return ({
            command: command.name,
            description: command.description,
        }); });
        (0, vitest_1.expect)(registered.slice(0, native.length)).toEqual(native);
        (0, vitest_1.expect)(registered.slice(native.length)).toEqual([
            { command: "custom_backup", description: "Git backup" },
            { command: "custom_generate", description: "Create an image" },
        ]);
    });
    (0, vitest_1.it)("ignores custom commands that collide with native commands", function () {
        var _a;
        var errorSpy = vitest_1.vi.fn();
        var config = {
            channels: {
                telegram: {
                    customCommands: [
                        { command: "status", description: "Custom status" },
                        { command: "custom_backup", description: "Git backup" },
                    ],
                },
            },
        };
        loadConfig.mockReturnValue(config);
        (0, bot_js_1.createTelegramBot)({
            token: "tok",
            runtime: {
                log: vitest_1.vi.fn(),
                error: errorSpy,
                exit: (function (code) {
                    throw new Error("exit ".concat(code));
                }),
            },
        });
        var registered = (_a = setMyCommandsSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        var skillCommands = resolveSkillCommands(config);
        var native = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(config, { skillCommands: skillCommands }).map(function (command) { return ({
            command: command.name,
            description: command.description,
        }); });
        var nativeStatus = native.find(function (command) { return command.command === "status"; });
        (0, vitest_1.expect)(nativeStatus).toBeDefined();
        (0, vitest_1.expect)(registered).toContainEqual({ command: "custom_backup", description: "Git backup" });
        (0, vitest_1.expect)(registered).not.toContainEqual({ command: "status", description: "Custom status" });
        (0, vitest_1.expect)(registered.filter(function (command) { return command.command === "status"; })).toEqual([nativeStatus]);
        (0, vitest_1.expect)(errorSpy).toHaveBeenCalled();
    });
    (0, vitest_1.it)("registers custom commands when native commands are disabled", function () {
        var _a;
        var config = {
            commands: { native: false },
            channels: {
                telegram: {
                    customCommands: [
                        { command: "custom_backup", description: "Git backup" },
                        { command: "custom_generate", description: "Create an image" },
                    ],
                },
            },
        };
        loadConfig.mockReturnValue(config);
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        var registered = (_a = setMyCommandsSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        (0, vitest_1.expect)(registered).toEqual([
            { command: "custom_backup", description: "Git backup" },
            { command: "custom_generate", description: "Create an image" },
        ]);
        var reserved = new Set((0, commands_registry_js_1.listNativeCommandSpecs)().map(function (command) { return command.name; }));
        (0, vitest_1.expect)(registered.some(function (command) { return reserved.has(command.command); })).toBe(false);
    });
    (0, vitest_1.it)("uses wrapped fetch when global fetch is available", function () {
        var _a, _b, _c;
        var originalFetch = globalThis.fetch;
        var fetchSpy = vitest_1.vi.fn();
        globalThis.fetch = fetchSpy;
        try {
            (0, bot_js_1.createTelegramBot)({ token: "tok" });
            var fetchImpl = (0, fetch_js_1.resolveTelegramFetch)();
            (0, vitest_1.expect)(fetchImpl).toBeTypeOf("function");
            (0, vitest_1.expect)(fetchImpl).not.toBe(fetchSpy);
            var clientFetch = (_c = (_b = (_a = botCtorSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.client) === null || _c === void 0 ? void 0 : _c.fetch;
            (0, vitest_1.expect)(clientFetch).toBeTypeOf("function");
            (0, vitest_1.expect)(clientFetch).not.toBe(fetchSpy);
        }
        finally {
            globalThis.fetch = originalFetch;
        }
    });
    (0, vitest_1.it)("sequentializes updates by chat and thread", function () {
        var _a;
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(sequentializeSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(middlewareUseSpy).toHaveBeenCalledWith((_a = sequentializeSpy.mock.results[0]) === null || _a === void 0 ? void 0 : _a.value);
        (0, vitest_1.expect)(sequentializeKey).toBe(bot_js_1.getTelegramSequentialKey);
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({ message: { chat: { id: 123 } } })).toBe("telegram:123");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "private" }, message_thread_id: 9 },
        })).toBe("telegram:123:topic:9");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "supergroup" }, message_thread_id: 9 },
        })).toBe("telegram:123");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            message: { chat: { id: 123, type: "supergroup", is_forum: true } },
        })).toBe("telegram:123:topic:1");
        (0, vitest_1.expect)((0, bot_js_1.getTelegramSequentialKey)({
            update: { message: { chat: { id: 555 } } },
        })).toBe("telegram:555");
    });
    (0, vitest_1.it)("routes callback_query payloads as messages and answers callbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, callbackHandler, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    callbackHandler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "callback_query"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(callbackHandler).toBeDefined();
                    return [4 /*yield*/, callbackHandler({
                            callbackQuery: {
                                id: "cbq-1",
                                data: "cmd:option_a",
                                from: { id: 9, first_name: "Ada", username: "ada_bot" },
                                message: {
                                    chat: { id: 1234, type: "private" },
                                    date: 1736380800,
                                    message_id: 10,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("cmd:option_a");
                    (0, vitest_1.expect)(answerCallbackQuerySpy).toHaveBeenCalledWith("cbq-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks callback_query when inline buttons are allowlist-only and sender not authorized", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, callbackHandler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({
                        token: "tok",
                        config: {
                            channels: {
                                telegram: {
                                    dmPolicy: "pairing",
                                    capabilities: { inlineButtons: "allowlist" },
                                    allowFrom: [],
                                },
                            },
                        },
                    });
                    callbackHandler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "callback_query"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(callbackHandler).toBeDefined();
                    return [4 /*yield*/, callbackHandler({
                            callbackQuery: {
                                id: "cbq-2",
                                data: "cmd:option_b",
                                from: { id: 9, first_name: "Ada", username: "ada_bot" },
                                message: {
                                    chat: { id: 1234, type: "private" },
                                    date: 1736380800,
                                    message_id: 11,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(answerCallbackQuerySpy).toHaveBeenCalledWith("cbq-2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("edits commands list for pagination callbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callbackHandler, _a, chatId, messageId, text, params;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onSpy.mockReset();
                    listSkillCommandsForAgents.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    callbackHandler = (_b = onSpy.mock.calls.find(function (call) { return call[0] === "callback_query"; })) === null || _b === void 0 ? void 0 : _b[1];
                    (0, vitest_1.expect)(callbackHandler).toBeDefined();
                    return [4 /*yield*/, callbackHandler({
                            callbackQuery: {
                                id: "cbq-3",
                                data: "commands_page_2:main",
                                from: { id: 9, first_name: "Ada", username: "ada_bot" },
                                message: {
                                    chat: { id: 1234, type: "private" },
                                    date: 1736380800,
                                    message_id: 12,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(listSkillCommandsForAgents).toHaveBeenCalledWith({
                        cfg: vitest_1.expect.any(Object),
                        agentIds: ["main"],
                    });
                    (0, vitest_1.expect)(editMessageTextSpy).toHaveBeenCalledTimes(1);
                    _a = (_c = editMessageTextSpy.mock.calls[0]) !== null && _c !== void 0 ? _c : [], chatId = _a[0], messageId = _a[1], text = _a[2], params = _a[3];
                    (0, vitest_1.expect)(chatId).toBe(1234);
                    (0, vitest_1.expect)(messageId).toBe(12);
                    (0, vitest_1.expect)(String(text)).toContain("ℹ️ Commands");
                    (0, vitest_1.expect)(params).toEqual(vitest_1.expect.objectContaining({
                        reply_markup: vitest_1.expect.any(Object),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks pagination callbacks when allowlist rejects sender", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callbackHandler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    editMessageTextSpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({
                        token: "tok",
                        config: {
                            channels: {
                                telegram: {
                                    dmPolicy: "pairing",
                                    capabilities: { inlineButtons: "allowlist" },
                                    allowFrom: [],
                                },
                            },
                        },
                    });
                    callbackHandler = (_a = onSpy.mock.calls.find(function (call) { return call[0] === "callback_query"; })) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(callbackHandler).toBeDefined();
                    return [4 /*yield*/, callbackHandler({
                            callbackQuery: {
                                id: "cbq-4",
                                data: "commands_page_2",
                                from: { id: 9, first_name: "Ada", username: "ada_bot" },
                                message: {
                                    chat: { id: 1234, type: "private" },
                                    date: 1736380800,
                                    message_id: 13,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(editMessageTextSpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(answerCallbackQuerySpy).toHaveBeenCalledWith("cbq-4");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wraps inbound message with Telegram envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalTz, replySpy, handler, message, payload, expectedTimestamp, timestampPattern;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalTz = process.env.TZ;
                    process.env.TZ = "Europe/Vienna";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    (0, vitest_1.expect)(onSpy).toHaveBeenCalledWith("message", vitest_1.expect.any(Function));
                    handler = getOnHandler("message");
                    message = {
                        chat: { id: 1234, type: "private" },
                        text: "hello world",
                        date: 1736380800, // 2025-01-09T00:00:00Z
                        from: {
                            first_name: "Ada",
                            last_name: "Lovelace",
                            username: "ada_bot",
                        },
                    };
                    return [4 /*yield*/, handler({
                            message: message,
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    expectedTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-09T00:00:00Z"));
                    timestampPattern = (0, envelope_timestamp_js_1.escapeRegExp)(expectedTimestamp);
                    (0, vitest_1.expect)(payload.Body).toMatch(new RegExp("^\\[Telegram Ada Lovelace \\(@ada_bot\\) id:1234 (\\+\\d+[smhd] )?".concat(timestampPattern, "\\]")));
                    (0, vitest_1.expect)(payload.Body).toContain("hello world");
                    return [3 /*break*/, 4];
                case 3:
                    process.env.TZ = originalTz;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requests pairing by default for unknown DM senders", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: { telegram: { dmPolicy: "pairing" } },
                    });
                    readChannelAllowFromStore.mockResolvedValue([]);
                    upsertChannelPairingRequest.mockResolvedValue({
                        code: "PAIRME12",
                        created: true,
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 1234, type: "private" },
                                text: "hello",
                                date: 1736380800,
                                from: { id: 999, username: "random" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _e.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = sendMessageSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]).toBe(1234);
                    (0, vitest_1.expect)(String((_b = sendMessageSpy.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1])).toContain("Your Telegram user id: 999");
                    (0, vitest_1.expect)(String((_c = sendMessageSpy.mock.calls[0]) === null || _c === void 0 ? void 0 : _c[1])).toContain("Pairing code:");
                    (0, vitest_1.expect)(String((_d = sendMessageSpy.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[1])).toContain("PAIRME12");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not resend pairing code when a request is already pending", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: { telegram: { dmPolicy: "pairing" } },
                    });
                    readChannelAllowFromStore.mockResolvedValue([]);
                    upsertChannelPairingRequest
                        .mockResolvedValueOnce({ code: "PAIRME12", created: true })
                        .mockResolvedValueOnce({ code: "PAIRME12", created: false });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    message = {
                        chat: { id: 1234, type: "private" },
                        text: "hello",
                        date: 1736380800,
                        from: { id: 999, username: "random" },
                    };
                    return [4 /*yield*/, handler({
                            message: message,
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler({
                            message: __assign(__assign({}, message), { text: "hello again" }),
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("triggers typing cue via onReplyStart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendChatActionSpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: { chat: { id: 42, type: "private" }, text: "hi" },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendChatActionSpy).toHaveBeenCalledWith(42, "typing", undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts group messages when mentionPatterns match (without @botUsername)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload, expectedTimestamp, timestampPattern;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        agents: {
                            defaults: {
                                envelopeTimezone: "utc",
                            },
                        },
                        identity: { name: "Bert" },
                        messages: { groupChat: { mentionPatterns: ["\\bbert\\b"] } },
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "group", title: "Test Group" },
                                text: "bert: introduce yourself",
                                date: 1736380800,
                                message_id: 1,
                                from: { id: 9, first_name: "Ada" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, inbound_contract_js_1.expectInboundContextContract)(payload);
                    (0, vitest_1.expect)(payload.WasMentioned).toBe(true);
                    expectedTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-09T00:00:00Z"));
                    timestampPattern = (0, envelope_timestamp_js_1.escapeRegExp)(expectedTimestamp);
                    (0, vitest_1.expect)(payload.Body).toMatch(new RegExp("^\\[Telegram Test Group id:7 (\\+\\d+[smhd] )?".concat(timestampPattern, "\\]")));
                    (0, vitest_1.expect)(payload.SenderName).toBe("Ada");
                    (0, vitest_1.expect)(payload.SenderId).toBe("9");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes sender identity in group envelope headers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload, expectedTimestamp, timestampPattern;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        agents: {
                            defaults: {
                                envelopeTimezone: "utc",
                            },
                        },
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 42, type: "group", title: "Ops" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 2,
                                from: {
                                    id: 99,
                                    first_name: "Ada",
                                    last_name: "Lovelace",
                                    username: "ada",
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, inbound_contract_js_1.expectInboundContextContract)(payload);
                    expectedTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-09T00:00:00Z"));
                    timestampPattern = (0, envelope_timestamp_js_1.escapeRegExp)(expectedTimestamp);
                    (0, vitest_1.expect)(payload.Body).toMatch(new RegExp("^\\[Telegram Ops id:42 (\\+\\d+[smhd] )?".concat(timestampPattern, "\\]")));
                    (0, vitest_1.expect)(payload.SenderName).toBe("Ada Lovelace");
                    (0, vitest_1.expect)(payload.SenderId).toBe("99");
                    (0, vitest_1.expect)(payload.SenderUsername).toBe("ada");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reacts to mention-gated group messages when ackReaction is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    setMessageReactionSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        messages: {
                            ackReaction: "👀",
                            ackReactionScope: "group-mentions",
                            groupChat: { mentionPatterns: ["\\bbert\\b"] },
                        },
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "group", title: "Test Group" },
                                text: "bert hello",
                                date: 1736380800,
                                message_id: 123,
                                from: { id: 9, first_name: "Ada" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setMessageReactionSpy).toHaveBeenCalledWith(7, 123, [{ type: "emoji", emoji: "👀" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears native commands when disabled", function () {
        loadConfig.mockReturnValue({
            commands: { native: false },
        });
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        (0, vitest_1.expect)(setMyCommandsSpy).toHaveBeenCalledWith([]);
    });
    (0, vitest_1.it)("skips group messages when requireMention is enabled and no mention matches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        messages: { groupChat: { mentionPatterns: ["\\bbert\\b"] } },
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "group", title: "Test Group" },
                                text: "hello everyone",
                                date: 1736380800,
                                message_id: 2,
                                from: { id: 9, first_name: "Ada" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages when requireMention is enabled but mentions cannot be detected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        messages: { groupChat: { mentionPatterns: [] } },
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "group", title: "Test Group" },
                                text: "hello everyone",
                                date: 1736380800,
                                message_id: 3,
                                from: { id: 9, first_name: "Ada" },
                            },
                            me: {},
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.WasMentioned).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes reply-to context when a Telegram reply is received", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "private" },
                                text: "Sure, see below",
                                date: 1736380800,
                                reply_to_message: {
                                    message_id: 9001,
                                    text: "Can you summarize this?",
                                    from: { first_name: "Ada" },
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("[Replying to Ada id:9001]");
                    (0, vitest_1.expect)(payload.Body).toContain("Can you summarize this?");
                    (0, vitest_1.expect)(payload.ReplyToId).toBe("9001");
                    (0, vitest_1.expect)(payload.ReplyToBody).toBe("Can you summarize this?");
                    (0, vitest_1.expect)(payload.ReplyToSender).toBe("Ada");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses quote text when a Telegram partial reply is received", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "private" },
                                text: "Sure, see below",
                                date: 1736380800,
                                reply_to_message: {
                                    message_id: 9001,
                                    text: "Can you summarize this?",
                                    from: { first_name: "Ada" },
                                },
                                quote: {
                                    text: "summarize this",
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("[Quoting Ada id:9001]");
                    (0, vitest_1.expect)(payload.Body).toContain('"summarize this"');
                    (0, vitest_1.expect)(payload.ReplyToId).toBe("9001");
                    (0, vitest_1.expect)(payload.ReplyToBody).toBe("summarize this");
                    (0, vitest_1.expect)(payload.ReplyToSender).toBe("Ada");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles quote-only replies without reply metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 7, type: "private" },
                                text: "Sure, see below",
                                date: 1736380800,
                                quote: {
                                    text: "summarize this",
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.Body).toContain("[Quoting unknown sender]");
                    (0, vitest_1.expect)(payload.Body).toContain('"summarize this"');
                    (0, vitest_1.expect)(payload.ReplyToId).toBeUndefined();
                    (0, vitest_1.expect)(payload.ReplyToBody).toBe("summarize this");
                    (0, vitest_1.expect)(payload.ReplyToSender).toBe("unknown sender");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends replies without native reply threading", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _i, _a, call;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "a".repeat(4500) });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    for (_i = 0, _a = sendMessageSpy.mock.calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        (0, vitest_1.expect)((_b = call[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBeUndefined();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors replyToMode=first for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _a, first, rest, _i, rest_1, call;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({
                        text: "a".repeat(4500),
                        replyToId: "101",
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok", replyToMode: "first" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    _a = sendMessageSpy.mock.calls, first = _a[0], rest = _a.slice(1);
                    (0, vitest_1.expect)((_b = first === null || first === void 0 ? void 0 : first[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBe(101);
                    for (_i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                        call = rest_1[_i];
                        (0, vitest_1.expect)((_c = call[2]) === null || _c === void 0 ? void 0 : _c.reply_to_message_id).toBeUndefined();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes final replies with responsePrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "final reply" });
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", allowFrom: ["*"] },
                        },
                        messages: { responsePrefix: "PFX" },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls[0][1]).toBe("PFX final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors replyToMode=all for threaded replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, _i, _a, call;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({
                        text: "a".repeat(4500),
                        replyToId: "101",
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok", replyToMode: "all" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 5, type: "private" },
                                text: "hi",
                                date: 1736380800,
                                message_id: 101,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.length).toBeGreaterThan(1);
                    for (_i = 0, _a = sendMessageSpy.mock.calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        (0, vitest_1.expect)((_b = call[2]) === null || _b === void 0 ? void 0 : _b.reply_to_message_id).toBe(101);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when telegram.groups is set without a wildcard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groups: {
                                    "123": { requireMention: false },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 456, type: "group", title: "Ops" },
                                text: "@openclaw_bot hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips group messages without mention when requireMention is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { groups: { "*": { requireMention: true } } },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "group", title: "Dev Chat" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts group replies to the bot without explicit mention when requireMention is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { groups: { "*": { requireMention: true } } },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 456, type: "group", title: "Ops Chat" },
                                text: "following up",
                                date: 1736380800,
                                reply_to_message: {
                                    message_id: 42,
                                    text: "original reply",
                                    from: { id: 999, first_name: "OpenClaw" },
                                },
                            },
                            me: { id: 999, username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.WasMentioned).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors routed group activation from session store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, storeDir, storePath, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    storeDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-telegram-"));
                    storePath = node_path_1.default.join(storeDir, "sessions.json");
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify({
                        "agent:ops:telegram:group:123": { groupActivation: "always" },
                    }), "utf-8");
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                        bindings: [
                            {
                                agentId: "ops",
                                match: {
                                    channel: "telegram",
                                    peer: { kind: "group", id: "123" },
                                },
                            },
                        ],
                        session: { store: storePath },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "group", title: "Routing" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes DMs by telegram accountId binding", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                accounts: {
                                    opie: {
                                        botToken: "tok-opie",
                                        dmPolicy: "open",
                                    },
                                },
                            },
                        },
                        bindings: [
                            {
                                agentId: "opie",
                                match: { channel: "telegram", accountId: "opie" },
                            },
                        ],
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok", accountId: "opie" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "private" },
                                from: { id: 999, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.AccountId).toBe("opie");
                    (0, vitest_1.expect)(payload.SessionKey).toBe("agent:opie:main");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows per-group requireMention override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: {
                                    "*": { requireMention: true },
                                    "123": { requireMention: false },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123, type: "group", title: "Dev Chat" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows per-topic requireMention override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: {
                                    "*": { requireMention: true },
                                    "-1001234567890": {
                                        requireMention: true,
                                        topics: {
                                            "99": { requireMention: false },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                text: "hello",
                                date: 1736380800,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("inherits group allowlist + requireMention in topics", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                groups: {
                                    "-1001234567890": {
                                        requireMention: false,
                                        allowFrom: ["123456789"],
                                        topics: {
                                            "99": {},
                                        },
                                    },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers topic allowFrom over group allowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                groups: {
                                    "-1001234567890": {
                                        allowFrom: ["123456789"],
                                        topics: {
                                            "99": { allowFrom: ["999999999"] },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors groups default when no explicit group override exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 456, type: "group", title: "Ops" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not block group messages when bot username is unknown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 789, type: "group", title: "No Me" },
                                text: "hello",
                                date: 1736380800,
                            },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends GIF replies as animations", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValueOnce({
                        text: "caption",
                        mediaUrl: "https://example.com/fun",
                    });
                    loadWebMedia.mockResolvedValueOnce({
                        buffer: Buffer.from("GIF89a"),
                        contentType: "image/gif",
                        fileName: "fun.gif",
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 1234, type: "private" },
                                text: "hello world",
                                date: 1736380800,
                                message_id: 5,
                                from: { first_name: "Ada" },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendAnimationSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendAnimationSpy).toHaveBeenCalledWith("1234", vitest_1.expect.anything(), {
                        caption: "caption",
                        parse_mode: "HTML",
                        reply_to_message_id: undefined,
                    });
                    (0, vitest_1.expect)(sendPhotoSpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    // groupPolicy tests
    (0, vitest_1.it)("blocks all group messages when groupPolicy is 'disabled'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "disabled",
                                allowFrom: ["123456789"],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" },
                                text: "@openclaw_bot hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    // Should NOT call getReplyFromConfig because groupPolicy is disabled
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages from senders not in allowFrom when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["123456789"], // Does not include sender 999999
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 999999, username: "notallowed" }, // Not in allowFrom
                                text: "@openclaw_bot hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages from senders in allowFrom (by ID) when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["123456789"],
                                groups: { "*": { requireMention: false } }, // Skip mention check
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" }, // In allowFrom
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages from senders in allowFrom (by username) when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["@testuser"], // By username
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 12345, username: "testuser" }, // Username matches @testuser
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages from telegram:-prefixed allowFrom entries when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["telegram:77112533"],
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 77112533, username: "mneves" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages from tg:-prefixed allowFrom entries case-insensitively when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["TG:77112533"],
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 77112533, username: "mneves" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows all group messages when groupPolicy is 'open'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 999999, username: "random" }, // Random sender
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches usernames case-insensitively when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["@TestUser"], // Uppercase in config
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 12345, username: "testuser" }, // Lowercase in message
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows direct messages regardless of groupPolicy", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "disabled", // Even with disabled, DMs should work
                                allowFrom: ["123456789"],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123456789, type: "private" }, // Direct message
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows direct messages with tg/Telegram-prefixed allowFrom entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                allowFrom: ["  TG:123456789  "],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123456789, type: "private" }, // Direct message
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows direct messages with telegram:-prefixed allowFrom entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                allowFrom: ["telegram:123456789"],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 123456789, type: "private" },
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows group messages with wildcard in allowFrom when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["*"], // Wildcard allows everyone
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 999999, username: "random" }, // Random sender, but wildcard allows
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages with no sender ID when groupPolicy is 'allowlist'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["123456789"],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                // No `from` field (e.g., channel post or anonymous admin)
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches telegram:-prefixed allowFrom entries in group allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["telegram:123456789"], // Prefixed format
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" }, // Matches after stripping prefix
                                text: "hello from prefixed user",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    // Should call reply because sender ID matches after stripping telegram: prefix
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches tg:-prefixed allowFrom entries case-insensitively in group allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                allowFrom: ["TG:123456789"], // Prefixed format (case-insensitive)
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" }, // Matches after stripping tg: prefix
                                text: "hello from prefixed user",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    // Should call reply because sender ID matches after stripping tg: prefix
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks group messages when groupPolicy allowlist has no groupAllowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows control commands with TG-prefixed groupAllowFrom entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "allowlist",
                                groupAllowFrom: ["  TG:123456789  "],
                                groups: { "*": { requireMention: true } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: -100123456789, type: "group", title: "Test Group" },
                                from: { id: 123456789, username: "testuser" },
                                text: "/status",
                                date: 1736380800,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("isolates forum topic sessions and carries thread metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendChatActionSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.SessionKey).toContain("telegram:group:-1001234567890:topic:99");
                    (0, vitest_1.expect)(payload.From).toBe("telegram:group:-1001234567890:topic:99");
                    (0, vitest_1.expect)(payload.MessageThreadId).toBe(99);
                    (0, vitest_1.expect)(payload.IsForum).toBe(true);
                    (0, vitest_1.expect)(sendChatActionSpy).toHaveBeenCalledWith(-1001234567890, "typing", {
                        message_thread_id: 99,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to General topic thread id for typing in forums", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendChatActionSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendChatActionSpy).toHaveBeenCalledWith(-1001234567890, "typing", {
                        message_thread_id: 1,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes General topic replies using thread id 1", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, sendParams;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "response" });
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    sendParams = (_a = sendMessageSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[2];
                    (0, vitest_1.expect)(sendParams === null || sendParams === void 0 ? void 0 : sendParams.message_thread_id).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies topic skill filters and system prompts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload, opts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: {
                                    "-1001234567890": {
                                        requireMention: false,
                                        systemPrompt: "Group prompt",
                                        skills: ["group-skill"],
                                        topics: {
                                            "99": {
                                                skills: [],
                                                systemPrompt: "Topic prompt",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.GroupSystemPrompt).toBe("Group prompt\n\nTopic prompt");
                    opts = replySpy.mock.calls[0][1];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.skillFilter).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes message_thread_id to topic replies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "response" });
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: {
                                groupPolicy: "open",
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "hello",
                                date: 1736380800,
                                message_id: 42,
                                message_thread_id: 99,
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new Uint8Array()];
                                        }); }); } })];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledWith("-1001234567890", vitest_1.expect.any(String), vitest_1.expect.objectContaining({ message_thread_id: 99 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("threads native command replies inside topics", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "response" });
                    loadConfig.mockReturnValue({
                        commands: { native: true },
                        channels: {
                            telegram: {
                                dmPolicy: "open",
                                allowFrom: ["*"],
                                groups: { "*": { requireMention: false } },
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    (0, vitest_1.expect)(commandSpy).toHaveBeenCalled();
                    handler = commandSpy.mock.calls[0][1];
                    return [4 /*yield*/, handler({
                            message: {
                                chat: {
                                    id: -1001234567890,
                                    type: "supergroup",
                                    title: "Forum Group",
                                    is_forum: true,
                                },
                                from: { id: 12345, username: "testuser" },
                                text: "/status",
                                date: 1736380800,
                                message_id: 42,
                                message_thread_id: 99,
                            },
                            match: "",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledWith("-1001234567890", vitest_1.expect.any(String), vitest_1.expect.objectContaining({ message_thread_id: 99 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets command target session key for dm topic commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "response" });
                    loadConfig.mockReturnValue({
                        commands: { native: true },
                        channels: {
                            telegram: {
                                dmPolicy: "pairing",
                            },
                        },
                    });
                    readChannelAllowFromStore.mockResolvedValueOnce(["12345"]);
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = (_a = commandSpy.mock.calls.find(function (call) { return call[0] === "status"; })) === null || _a === void 0 ? void 0 : _a[1];
                    if (!handler) {
                        throw new Error("status command handler missing");
                    }
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 12345, type: "private" },
                                from: { id: 12345, username: "testuser" },
                                text: "/status",
                                date: 1736380800,
                                message_id: 42,
                                message_thread_id: 99,
                            },
                            match: "",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    payload = replySpy.mock.calls[0][0];
                    (0, vitest_1.expect)(payload.CommandTargetSessionKey).toBe("agent:main:main:thread:99");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows native DM commands for paired users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockResolvedValue({ text: "response" });
                    loadConfig.mockReturnValue({
                        commands: { native: true },
                        channels: {
                            telegram: {
                                dmPolicy: "pairing",
                            },
                        },
                    });
                    readChannelAllowFromStore.mockResolvedValueOnce(["12345"]);
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = (_a = commandSpy.mock.calls.find(function (call) { return call[0] === "status"; })) === null || _a === void 0 ? void 0 : _a[1];
                    if (!handler) {
                        throw new Error("status command handler missing");
                    }
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 12345, type: "private" },
                                from: { id: 12345, username: "testuser" },
                                text: "/status",
                                date: 1736380800,
                                message_id: 42,
                            },
                            match: "",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendMessageSpy.mock.calls.some(function (call) { return call[1] === "You are not authorized to use this command."; })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks native DM commands for unpaired users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        commands: { native: true },
                        channels: {
                            telegram: {
                                dmPolicy: "pairing",
                            },
                        },
                    });
                    readChannelAllowFromStore.mockResolvedValueOnce([]);
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = (_a = commandSpy.mock.calls.find(function (call) { return call[0] === "status"; })) === null || _a === void 0 ? void 0 : _a[1];
                    if (!handler) {
                        throw new Error("status command handler missing");
                    }
                    return [4 /*yield*/, handler({
                            message: {
                                chat: { id: 12345, type: "private" },
                                from: { id: 12345, username: "testuser" },
                                text: "/status",
                                date: 1736380800,
                                message_id: 42,
                            },
                            match: "",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledWith(12345, "You are not authorized to use this command.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips tool summaries for native slash commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, verboseHandler;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onSpy.mockReset();
                    sendMessageSpy.mockReset();
                    commandSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    replySpy.mockImplementation(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ((_a = opts === null || opts === void 0 ? void 0 : opts.onToolResult) === null || _a === void 0 ? void 0 : _a.call(opts, { text: "tool update" }))];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, { text: "final reply" }];
                            }
                        });
                    }); });
                    loadConfig.mockReturnValue({
                        commands: { native: true },
                        channels: {
                            telegram: {
                                dmPolicy: "open",
                                allowFrom: ["*"],
                            },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    verboseHandler = (_a = commandSpy.mock.calls.find(function (call) { return call[0] === "verbose"; })) === null || _a === void 0 ? void 0 : _a[1];
                    if (!verboseHandler) {
                        throw new Error("verbose command handler missing");
                    }
                    return [4 /*yield*/, verboseHandler({
                            message: {
                                chat: { id: 12345, type: "private" },
                                from: { id: 12345, username: "testuser" },
                                text: "/verbose on",
                                date: 1736380800,
                                message_id: 42,
                            },
                            match: "on",
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(sendMessageSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_b = sendMessageSpy.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[1]).toContain("final reply");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("dedupes duplicate message updates by update_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", allowFrom: ["*"] },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message");
                    ctx = {
                        update: { update_id: 111 },
                        message: {
                            chat: { id: 123, type: "private" },
                            from: { id: 456, username: "testuser" },
                            text: "hello",
                            date: 1736380800,
                            message_id: 42,
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ download: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, new Uint8Array()];
                                    }); }); } })];
                        }); }); },
                    };
                    return [4 /*yield*/, handler(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler(ctx)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("dedupes duplicate callback_query updates by update_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", allowFrom: ["*"] },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("callback_query");
                    ctx = {
                        update: { update_id: 222 },
                        callbackQuery: {
                            id: "cb-1",
                            data: "ping",
                            from: { id: 789, username: "testuser" },
                            message: {
                                chat: { id: 123, type: "private" },
                                date: 1736380800,
                                message_id: 9001,
                            },
                        },
                        me: { username: "openclaw_bot" },
                        getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({})];
                        }); }); },
                    };
                    return [4 /*yield*/, handler(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler(ctx)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows distinct callback_query ids without update_id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replySpy, handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    replySpy = replyModule.__replySpy;
                    replySpy.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", allowFrom: ["*"] },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("callback_query");
                    return [4 /*yield*/, handler({
                            callbackQuery: {
                                id: "cb-1",
                                data: "ping",
                                from: { id: 789, username: "testuser" },
                                message: {
                                    chat: { id: 123, type: "private" },
                                    date: 1736380800,
                                    message_id: 9001,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handler({
                            callbackQuery: {
                                id: "cb-2",
                                data: "ping",
                                from: { id: 789, username: "testuser" },
                                message: {
                                    chat: { id: 123, type: "private" },
                                    date: 1736380800,
                                    message_id: 9001,
                                },
                            },
                            me: { username: "openclaw_bot" },
                            getFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registers message_reaction handler", function () {
        onSpy.mockReset();
        (0, bot_js_1.createTelegramBot)({ token: "tok" });
        var reactionHandler = onSpy.mock.calls.find(function (call) { return call[0] === "message_reaction"; });
        (0, vitest_1.expect)(reactionHandler).toBeDefined();
    });
    (0, vitest_1.it)("enqueues system event for reaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 500 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 42,
                                user: { id: 9, first_name: "Ada", username: "ada_bot" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "👍" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: 👍 by Ada (@ada_bot) on msg 42", vitest_1.expect.objectContaining({
                        contextKey: vitest_1.expect.stringContaining("telegram:reaction:add:1234:42:9"),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips reaction when reactionNotifications is off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(true);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "off" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 501 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 42,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "👍" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults reactionNotifications to own", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(true);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 502 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 43,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "👍" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows reaction in all mode regardless of message sender", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(false);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 503 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 99,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🎉" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: 🎉 by Ada on msg 99", vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips reaction in own mode when message is not sent by bot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(false);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "own" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 503 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 99,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🎉" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows reaction in own mode when message is sent by bot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(true);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "own" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 503 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 99,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🎉" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips reaction from bot users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    wasSentByBot.mockReturnValue(true);
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 503 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 99,
                                user: { id: 9, first_name: "Bot", is_bot: true },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🎉" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips reaction removal (only processes added reactions)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 504 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 42,
                                user: { id: 9, first_name: "Ada" },
                                date: 1736380800,
                                old_reaction: [{ type: "emoji", emoji: "👍" }],
                                new_reaction: [],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses correct session key for forum group reactions with topic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 505 },
                            messageReaction: {
                                chat: { id: 5678, type: "supergroup", is_forum: true },
                                message_id: 100,
                                message_thread_id: 42,
                                user: { id: 10, first_name: "Bob", username: "bob_user" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🔥" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: 🔥 by Bob (@bob_user) on msg 100", vitest_1.expect.objectContaining({
                        sessionKey: vitest_1.expect.stringContaining("telegram:group:5678:topic:42"),
                        contextKey: vitest_1.expect.stringContaining("telegram:reaction:add:5678:100:10"),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses correct session key for forum group reactions in general topic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 506 },
                            messageReaction: {
                                chat: { id: 5678, type: "supergroup", is_forum: true },
                                message_id: 101,
                                // No message_thread_id - should default to general topic (1)
                                user: { id: 10, first_name: "Bob" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "👀" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: 👀 by Bob on msg 101", vitest_1.expect.objectContaining({
                        sessionKey: vitest_1.expect.stringContaining("telegram:group:5678:topic:1"),
                        contextKey: vitest_1.expect.stringContaining("telegram:reaction:add:5678:101:10"),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses correct session key for regular group reactions without topic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler, sessionKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 507 },
                            messageReaction: {
                                chat: { id: 9999, type: "group" },
                                message_id: 200,
                                user: { id: 11, first_name: "Charlie" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "❤️" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: ❤️ by Charlie on msg 200", vitest_1.expect.objectContaining({
                        sessionKey: vitest_1.expect.stringContaining("telegram:group:9999"),
                        contextKey: vitest_1.expect.stringContaining("telegram:reaction:add:9999:200:11"),
                    }));
                    sessionKey = enqueueSystemEvent.mock.calls[0][1].sessionKey;
                    (0, vitest_1.expect)(sessionKey).not.toContain(":topic:");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses thread session key for dm reactions with topic id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSpy.mockReset();
                    enqueueSystemEvent.mockReset();
                    loadConfig.mockReturnValue({
                        channels: {
                            telegram: { dmPolicy: "open", reactionNotifications: "all" },
                        },
                    });
                    (0, bot_js_1.createTelegramBot)({ token: "tok" });
                    handler = getOnHandler("message_reaction");
                    return [4 /*yield*/, handler({
                            update: { update_id: 508 },
                            messageReaction: {
                                chat: { id: 1234, type: "private" },
                                message_id: 300,
                                message_thread_id: 42,
                                user: { id: 12, first_name: "Dana" },
                                date: 1736380800,
                                old_reaction: [],
                                new_reaction: [{ type: "emoji", emoji: "🔥" }],
                            },
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Telegram reaction added: 🔥 by Dana on msg 300", vitest_1.expect.objectContaining({
                        sessionKey: vitest_1.expect.stringContaining(":thread:42"),
                        contextKey: vitest_1.expect.stringContaining("telegram:reaction:add:1234:300:12"),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
