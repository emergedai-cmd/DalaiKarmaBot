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
var channel_js_1 = require("../../extensions/discord/src/channel.js");
var channel_js_2 = require("../../extensions/imessage/src/channel.js");
var channel_js_3 = require("../../extensions/signal/src/channel.js");
var channel_js_4 = require("../../extensions/slack/src/channel.js");
var channel_js_5 = require("../../extensions/telegram/src/channel.js");
var channel_js_6 = require("../../extensions/whatsapp/src/channel.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var configMocks = vitest_1.vi.hoisted(function () { return ({
    readConfigFileSnapshot: vitest_1.vi.fn(),
    writeConfigFile: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
var authMocks = vitest_1.vi.hoisted(function () { return ({
    loadAuthProfileStore: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readConfigFileSnapshot: configMocks.readConfigFileSnapshot, writeConfigFile: configMocks.writeConfigFile })];
        }
    });
}); });
vitest_1.vi.mock("../agents/auth-profiles.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadAuthProfileStore: authMocks.loadAuthProfileStore })];
        }
    });
}); });
var channels_js_1 = require("./channels.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
var baseSnapshot = {
    path: "/tmp/openclaw.json",
    exists: true,
    raw: "{}",
    parsed: {},
    valid: true,
    config: {},
    issues: [],
    legacyIssues: [],
};
(0, vitest_1.describe)("channels command", function () {
    (0, vitest_1.beforeEach)(function () {
        configMocks.readConfigFileSnapshot.mockReset();
        configMocks.writeConfigFile.mockClear();
        authMocks.loadAuthProfileStore.mockReset();
        runtime.log.mockClear();
        runtime.error.mockClear();
        runtime.exit.mockClear();
        authMocks.loadAuthProfileStore.mockReturnValue({
            version: 1,
            profiles: {},
        });
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            { pluginId: "discord", plugin: channel_js_1.discordPlugin, source: "test" },
            { pluginId: "slack", plugin: channel_js_4.slackPlugin, source: "test" },
            { pluginId: "telegram", plugin: channel_js_5.telegramPlugin, source: "test" },
            { pluginId: "whatsapp", plugin: channel_js_6.whatsappPlugin, source: "test" },
            { pluginId: "signal", plugin: channel_js_3.signalPlugin, source: "test" },
            { pluginId: "imessage", plugin: channel_js_2.imessagePlugin, source: "test" },
        ]));
    });
    (0, vitest_1.it)("adds a non-default telegram account", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign({}, baseSnapshot));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({ channel: "telegram", account: "alerts", token: "123:abc" }, runtime, { hasFlags: true })];
                case 1:
                    _h.sent();
                    (0, vitest_1.expect)(configMocks.writeConfigFile).toHaveBeenCalledTimes(1);
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
                    (0, vitest_1.expect)((_g = (_f = (_e = (_d = next.channels) === null || _d === void 0 ? void 0 : _d.telegram) === null || _e === void 0 ? void 0 : _e.accounts) === null || _f === void 0 ? void 0 : _f.alerts) === null || _g === void 0 ? void 0 : _g.botToken).toBe("123:abc");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds a default slack account with tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign({}, baseSnapshot));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({
                            channel: "slack",
                            account: "default",
                            botToken: "xoxb-1",
                            appToken: "xapp-1",
                        }, runtime, { hasFlags: true })];
                case 1:
                    _h.sent();
                    (0, vitest_1.expect)(configMocks.writeConfigFile).toHaveBeenCalledTimes(1);
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
                    (0, vitest_1.expect)((_e = (_d = next.channels) === null || _d === void 0 ? void 0 : _d.slack) === null || _e === void 0 ? void 0 : _e.botToken).toBe("xoxb-1");
                    (0, vitest_1.expect)((_g = (_f = next.channels) === null || _f === void 0 ? void 0 : _f.slack) === null || _g === void 0 ? void 0 : _g.appToken).toBe("xapp-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes a non-default discord account", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            channels: {
                                discord: {
                                    accounts: {
                                        default: { token: "d0" },
                                        work: { token: "d1" },
                                    },
                                },
                            },
                        } }));
                    return [4 /*yield*/, (0, channels_js_1.channelsRemoveCommand)({ channel: "discord", account: "work", delete: true }, runtime, {
                            hasFlags: true,
                        })];
                case 1:
                    _j.sent();
                    (0, vitest_1.expect)(configMocks.writeConfigFile).toHaveBeenCalledTimes(1);
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_d = (_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d.work).toBeUndefined();
                    (0, vitest_1.expect)((_h = (_g = (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.discord) === null || _f === void 0 ? void 0 : _f.accounts) === null || _g === void 0 ? void 0 : _g.default) === null || _h === void 0 ? void 0 : _h.token).toBe("d0");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds a named WhatsApp account", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign({}, baseSnapshot));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({ channel: "whatsapp", account: "family", name: "Family Phone" }, runtime, { hasFlags: true })];
                case 1:
                    _f.sent();
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d.family) === null || _e === void 0 ? void 0 : _e.name).toBe("Family Phone");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds a second signal account with a distinct name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            channels: {
                                signal: {
                                    accounts: {
                                        default: { account: "+15555550111", name: "Primary" },
                                    },
                                },
                            },
                        } }));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({
                            channel: "signal",
                            account: "lab",
                            name: "Lab",
                            signalNumber: "+15555550123",
                        }, runtime, { hasFlags: true })];
                case 1:
                    _p.sent();
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.signal) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d.lab) === null || _e === void 0 ? void 0 : _e.account).toBe("+15555550123");
                    (0, vitest_1.expect)((_j = (_h = (_g = (_f = next.channels) === null || _f === void 0 ? void 0 : _f.signal) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.lab) === null || _j === void 0 ? void 0 : _j.name).toBe("Lab");
                    (0, vitest_1.expect)((_o = (_m = (_l = (_k = next.channels) === null || _k === void 0 ? void 0 : _k.signal) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m.default) === null || _o === void 0 ? void 0 : _o.name).toBe("Primary");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("disables a default provider account when remove has no delete flag", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prompt, prompterModule, promptSpy, next;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            channels: { discord: { token: "d0", enabled: true } },
                        } }));
                    prompt = { confirm: vitest_1.vi.fn().mockResolvedValue(true) };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../wizard/clack-prompter.js"); })];
                case 1:
                    prompterModule = _d.sent();
                    promptSpy = vitest_1.vi
                        .spyOn(prompterModule, "createClackPrompter")
                        .mockReturnValue(prompt);
                    return [4 /*yield*/, (0, channels_js_1.channelsRemoveCommand)({ channel: "discord", account: "default" }, runtime, {
                            hasFlags: true,
                        })];
                case 2:
                    _d.sent();
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.enabled).toBe(false);
                    promptSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes external auth profiles in JSON output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, ids;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {} }));
                    authMocks.loadAuthProfileStore.mockReturnValue({
                        version: 1,
                        profiles: {
                            "anthropic:default": {
                                type: "oauth",
                                provider: "anthropic",
                                access: "token",
                                refresh: "refresh",
                                expires: 0,
                                created: 0,
                            },
                            "openai-codex:default": {
                                type: "oauth",
                                provider: "openai",
                                access: "token",
                                refresh: "refresh",
                                expires: 0,
                                created: 0,
                            },
                        },
                    });
                    return [4 /*yield*/, (0, channels_js_1.channelsListCommand)({ json: true, usage: false }, runtime)];
                case 1:
                    _e.sent();
                    payload = JSON.parse(String((_b = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "{}"));
                    ids = (_d = (_c = payload.auth) === null || _c === void 0 ? void 0 : _c.map(function (entry) { return entry.id; })) !== null && _d !== void 0 ? _d : [];
                    (0, vitest_1.expect)(ids).toContain("anthropic:default");
                    (0, vitest_1.expect)(ids).toContain("openai-codex:default");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stores default account names in accounts when multiple accounts exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            channels: {
                                telegram: {
                                    name: "Legacy Name",
                                    accounts: {
                                        work: { botToken: "t0" },
                                    },
                                },
                            },
                        } }));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({
                            channel: "telegram",
                            account: "default",
                            token: "123:abc",
                            name: "Primary Bot",
                        }, runtime, { hasFlags: true })];
                case 1:
                    _h.sent();
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null || _c === void 0 ? void 0 : _c.name).toBeUndefined();
                    (0, vitest_1.expect)((_g = (_f = (_e = (_d = next.channels) === null || _d === void 0 ? void 0 : _d.telegram) === null || _e === void 0 ? void 0 : _e.accounts) === null || _f === void 0 ? void 0 : _f.default) === null || _g === void 0 ? void 0 : _g.name).toBe("Primary Bot");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates base names when adding non-default accounts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            channels: {
                                discord: {
                                    name: "Primary Bot",
                                    token: "d0",
                                },
                            },
                        } }));
                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)({ channel: "discord", account: "work", token: "d1" }, runtime, {
                            hasFlags: true,
                        })];
                case 1:
                    _m.sent();
                    next = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = next.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.name).toBeUndefined();
                    (0, vitest_1.expect)((_g = (_f = (_e = (_d = next.channels) === null || _d === void 0 ? void 0 : _d.discord) === null || _e === void 0 ? void 0 : _e.accounts) === null || _f === void 0 ? void 0 : _f.default) === null || _g === void 0 ? void 0 : _g.name).toBe("Primary Bot");
                    (0, vitest_1.expect)((_l = (_k = (_j = (_h = next.channels) === null || _h === void 0 ? void 0 : _h.discord) === null || _j === void 0 ? void 0 : _j.accounts) === null || _k === void 0 ? void 0 : _k.work) === null || _l === void 0 ? void 0 : _l.token).toBe("d1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("formats gateway channel status lines in registry order", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                telegram: [{ accountId: "default", configured: true }],
                whatsapp: [{ accountId: "default", linked: true }],
            },
        });
        var telegramIndex = lines.findIndex(function (line) { return line.includes("Telegram default"); });
        var whatsappIndex = lines.findIndex(function (line) { return line.includes("WhatsApp default"); });
        (0, vitest_1.expect)(telegramIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(whatsappIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(telegramIndex).toBeLessThan(whatsappIndex);
    });
    (0, vitest_1.it)("surfaces Discord privileged intent issues in channels status output", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                discord: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        application: { intents: { messageContent: "disabled" } },
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Message Content Intent is disabled/i);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Run: (?:openclaw|openclaw)( --profile isolated)? doctor/);
    });
    (0, vitest_1.it)("surfaces Discord permission audit issues in channels status output", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                discord: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        audit: {
                            unresolvedChannels: 1,
                            channels: [
                                {
                                    channelId: "111",
                                    ok: false,
                                    missing: ["ViewChannel", "SendMessages"],
                                },
                            ],
                        },
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/permission audit/i);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Channel 111/i);
    });
    (0, vitest_1.it)("surfaces Telegram privacy-mode hints when allowUnmentionedGroups is enabled", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                telegram: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        allowUnmentionedGroups: true,
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Telegram Bot API privacy mode/i);
    });
    (0, vitest_1.it)("includes Telegram bot username from probe data", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                telegram: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        probe: { ok: true, bot: { username: "openclaw_bot" } },
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/bot:@openclaw_bot/);
    });
    (0, vitest_1.it)("surfaces Telegram group membership audit issues in channels status output", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                telegram: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        audit: {
                            hasWildcardUnmentionedGroups: true,
                            unresolvedGroups: 1,
                            groups: [
                                {
                                    chatId: "-1001",
                                    ok: false,
                                    status: "left",
                                    error: "not in group",
                                },
                            ],
                        },
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/membership probing is not possible/i);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Group -1001/i);
    });
    (0, vitest_1.it)("surfaces WhatsApp auth/runtime hints when unlinked or disconnected", function () {
        var unlinked = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                whatsapp: [{ accountId: "default", enabled: true, linked: false }],
            },
        });
        (0, vitest_1.expect)(unlinked.join("\n")).toMatch(/WhatsApp/i);
        (0, vitest_1.expect)(unlinked.join("\n")).toMatch(/Not linked/i);
        var disconnected = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                whatsapp: [
                    {
                        accountId: "default",
                        enabled: true,
                        linked: true,
                        running: true,
                        connected: false,
                        reconnectAttempts: 5,
                        lastError: "connection closed",
                    },
                ],
            },
        });
        (0, vitest_1.expect)(disconnected.join("\n")).toMatch(/disconnected/i);
    });
});
