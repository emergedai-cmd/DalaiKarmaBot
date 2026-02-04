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
var vitest_1 = require("vitest");
var bot_native_commands_js_1 = require("./bot-native-commands.js");
var getPluginCommandSpecs = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var matchPluginCommand = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var executePluginCommand = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../plugins/commands.js", function () { return ({
    getPluginCommandSpecs: getPluginCommandSpecs,
    matchPluginCommand: matchPluginCommand,
    executePluginCommand: executePluginCommand,
}); });
var deliverReplies = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
vitest_1.vi.mock("./bot/delivery.js", function () { return ({ deliverReplies: deliverReplies }); });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
}); });
(0, vitest_1.describe)("registerTelegramNativeCommands (plugin auth)", function () {
    (0, vitest_1.it)("allows requireAuth:false plugin command even when sender is unauthorized", function () { return __awaiter(void 0, void 0, void 0, function () {
        var command, handlers, bot, cfg, telegramCfg, resolveGroupPolicy, ctx;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    command = {
                        name: "plugin",
                        description: "Plugin command",
                        requireAuth: false,
                        handler: vitest_1.vi.fn(),
                    };
                    getPluginCommandSpecs.mockReturnValue([{ name: "plugin", description: "Plugin command" }]);
                    matchPluginCommand.mockReturnValue({ command: command, args: undefined });
                    executePluginCommand.mockResolvedValue({ text: "ok" });
                    handlers = {};
                    bot = {
                        api: {
                            setMyCommands: vitest_1.vi.fn().mockResolvedValue(undefined),
                            sendMessage: vitest_1.vi.fn(),
                        },
                        command: function (name, handler) {
                            handlers[name] = handler;
                        },
                    };
                    cfg = {};
                    telegramCfg = {};
                    resolveGroupPolicy = function () {
                        return ({
                            allowlistEnabled: false,
                            allowed: true,
                        });
                    };
                    (0, bot_native_commands_js_1.registerTelegramNativeCommands)({
                        bot: bot,
                        cfg: cfg,
                        runtime: {},
                        accountId: "default",
                        telegramCfg: telegramCfg,
                        allowFrom: ["999"],
                        groupAllowFrom: [],
                        replyToMode: "off",
                        textLimit: 4000,
                        useAccessGroups: false,
                        nativeEnabled: false,
                        nativeSkillsEnabled: false,
                        nativeDisabledExplicit: false,
                        resolveGroupPolicy: resolveGroupPolicy,
                        resolveTelegramGroupConfig: function () { return ({
                            groupConfig: undefined,
                            topicConfig: undefined,
                        }); },
                        shouldSkipUpdate: function () { return false; },
                        opts: { token: "token" },
                    });
                    ctx = {
                        message: {
                            chat: { id: 123, type: "private" },
                            from: { id: 111, username: "nope" },
                            message_id: 10,
                            date: 123456,
                        },
                        match: "",
                    };
                    return [4 /*yield*/, ((_a = handlers.plugin) === null || _a === void 0 ? void 0 : _a.call(handlers, ctx))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(matchPluginCommand).toHaveBeenCalled();
                    (0, vitest_1.expect)(executePluginCommand).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        isAuthorizedSender: false,
                    }));
                    (0, vitest_1.expect)(deliverReplies).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        replies: [{ text: "ok" }],
                    }));
                    (0, vitest_1.expect)(bot.api.sendMessage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
