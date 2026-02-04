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
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var channel_js_1 = require("../../extensions/discord/src/channel.js");
var runtime_js_1 = require("../../extensions/discord/src/runtime.js");
var channel_js_2 = require("../../extensions/telegram/src/channel.js");
var runtime_js_2 = require("../../extensions/telegram/src/runtime.js");
var channel_js_3 = require("../../extensions/whatsapp/src/channel.js");
var runtime_js_3 = require("../../extensions/whatsapp/src/runtime.js");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var runtime_js_4 = require("../plugins/runtime.js");
var index_js_1 = require("../plugins/runtime/index.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
vitest_1.vi.mock("../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(),
}); });
var model_catalog_js_1 = require("../agents/model-catalog.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var isolated_agent_js_1 = require("./isolated-agent.js");
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(fn, { prefix: "openclaw-cron-" })];
        });
    });
}
function writeSessionStore(home) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, storePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_path_1.default.join(home, ".openclaw", "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify({
                            "agent:main:main": {
                                sessionId: "main-session",
                                updatedAt: Date.now(),
                                lastProvider: "webchat",
                                lastTo: "",
                            },
                        }, null, 2), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, storePath];
            }
        });
    });
}
function makeCfg(home, storePath, overrides) {
    if (overrides === void 0) { overrides = {}; }
    var base = {
        agents: {
            defaults: {
                model: "anthropic/claude-opus-4-5",
                workspace: node_path_1.default.join(home, "openclaw"),
            },
        },
        session: { store: storePath, mainKey: "main" },
    };
    return __assign(__assign({}, base), overrides);
}
function makeJob(payload) {
    var now = Date.now();
    return {
        id: "job-1",
        enabled: true,
        createdAtMs: now,
        updatedAtMs: now,
        schedule: { kind: "every", everyMs: 60000 },
        sessionTarget: "isolated",
        wakeMode: "now",
        payload: payload,
        state: {},
        isolation: { postToMainPrefix: "Cron" },
    };
}
(0, vitest_1.describe)("runCronIsolatedAgentTurn", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockReset();
        vitest_1.vi.mocked(model_catalog_js_1.loadModelCatalog).mockResolvedValue([]);
        var runtime = (0, index_js_1.createPluginRuntime)();
        (0, runtime_js_1.setDiscordRuntime)(runtime);
        (0, runtime_js_2.setTelegramRuntime)(runtime);
        (0, runtime_js_3.setWhatsAppRuntime)(runtime);
        (0, runtime_js_4.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            { pluginId: "whatsapp", plugin: channel_js_3.whatsappPlugin, source: "test" },
            { pluginId: "telegram", plugin: channel_js_2.telegramPlugin, source: "test" },
            { pluginId: "discord", plugin: channel_js_1.discordPlugin, source: "test" },
        ]));
    });
    (0, vitest_1.it)("skips delivery without a WhatsApp recipient when bestEffortDeliver=true", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _b.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "whatsapp",
                                                bestEffortDeliver: true,
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _b.sent();
                                    (0, vitest_1.expect)(res.status).toBe("skipped");
                                    (0, vitest_1.expect)(String((_a = res.summary) !== null && _a !== void 0 ? _a : "")).toMatch(/delivery skipped/i);
                                    (0, vitest_1.expect)(deps.sendMessageWhatsApp).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("delivers telegram via channel send", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, prevTelegramToken, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "123",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello from cron" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                                    process.env.TELEGRAM_BOT_TOKEN = "";
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 4, 5]);
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                channels: { telegram: { botToken: "t-1" } },
                                            }),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "telegram",
                                                to: "123",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 3:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalledWith("123", "hello from cron", vitest_1.expect.objectContaining({ verbose: false }));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (prevTelegramToken === undefined) {
                                        delete process.env.TELEGRAM_BOT_TOKEN;
                                    }
                                    else {
                                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                                    }
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-delivers when explicit target is set without deliver flag", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, prevTelegramToken, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "123",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello from cron" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                                    process.env.TELEGRAM_BOT_TOKEN = "";
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 4, 5]);
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                channels: { telegram: { botToken: "t-1" } },
                                            }),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                channel: "telegram",
                                                to: "123",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 3:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalledWith("123", "hello from cron", vitest_1.expect.objectContaining({ verbose: false }));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (prevTelegramToken === undefined) {
                                        delete process.env.TELEGRAM_BOT_TOKEN;
                                    }
                                    else {
                                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                                    }
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips auto-delivery when messaging tool already sent to the target", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, prevTelegramToken, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "123",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "sent" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                        didSendViaMessagingTool: true,
                                        messagingToolSentTargets: [{ tool: "message", provider: "telegram", to: "123" }],
                                    });
                                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                                    process.env.TELEGRAM_BOT_TOKEN = "";
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, , 4, 5]);
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                channels: { telegram: { botToken: "t-1" } },
                                            }),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                channel: "telegram",
                                                to: "123",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 3:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).not.toHaveBeenCalled();
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (prevTelegramToken === undefined) {
                                        delete process.env.TELEGRAM_BOT_TOKEN;
                                    }
                                    else {
                                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                                    }
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delivers telegram topic targets via channel send", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "-1001234567890",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello from cron" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "telegram",
                                                to: "telegram:group:-1001234567890:topic:321",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalledWith("telegram:group:-1001234567890:topic:321", "hello from cron", vitest_1.expect.objectContaining({ verbose: false }));
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
    (0, vitest_1.it)("delivers telegram shorthand topic suffixes via channel send", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "-1001234567890",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello from cron" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "telegram",
                                                to: "-1001234567890:321",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalledWith("-1001234567890:321", "hello from cron", vitest_1.expect.objectContaining({ verbose: false }));
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
    (0, vitest_1.it)("delivers via discord when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "d1",
                                            channelId: "chan",
                                        }),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "hello from cron" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "discord",
                                                to: "channel:1122",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageDiscord).toHaveBeenCalledWith("channel:1122", "hello from cron", vitest_1.expect.objectContaining({ verbose: false }));
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
    (0, vitest_1.it)("skips delivery when response is exactly HEARTBEAT_OK", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "123",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "HEARTBEAT_OK" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "telegram",
                                                to: "123",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    // Job still succeeds, but no delivery happens.
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(res.summary).toBe("HEARTBEAT_OK");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("skips delivery when response has HEARTBEAT_OK with short padding", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "w1",
                                            chatId: "+1234",
                                        }),
                                        sendMessageTelegram: vitest_1.vi.fn(),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    // Short junk around HEARTBEAT_OK (<=30 chars) should still skip delivery.
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "HEARTBEAT_OK 🦞" }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath, {
                                                channels: { whatsapp: { allowFrom: ["+1234"] } },
                                            }),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "whatsapp",
                                                to: "+1234",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageWhatsApp).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("delivers when response has HEARTBEAT_OK but also substantial content", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var storePath, deps, longContent, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, writeSessionStore(home)];
                                case 1:
                                    storePath = _a.sent();
                                    deps = {
                                        sendMessageWhatsApp: vitest_1.vi.fn(),
                                        sendMessageTelegram: vitest_1.vi.fn().mockResolvedValue({
                                            messageId: "t1",
                                            chatId: "123",
                                        }),
                                        sendMessageDiscord: vitest_1.vi.fn(),
                                        sendMessageSignal: vitest_1.vi.fn(),
                                        sendMessageIMessage: vitest_1.vi.fn(),
                                    };
                                    longContent = "Important alert: ".concat("a".repeat(500));
                                    vitest_1.vi.mocked(pi_embedded_js_1.runEmbeddedPiAgent).mockResolvedValue({
                                        payloads: [{ text: "HEARTBEAT_OK ".concat(longContent) }],
                                        meta: {
                                            durationMs: 5,
                                            agentMeta: { sessionId: "s", provider: "p", model: "m" },
                                        },
                                    });
                                    return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                            cfg: makeCfg(home, storePath),
                                            deps: deps,
                                            job: makeJob({
                                                kind: "agentTurn",
                                                message: "do it",
                                                deliver: true,
                                                channel: "telegram",
                                                to: "123",
                                            }),
                                            message: "do it",
                                            sessionKey: "cron:job-1",
                                            lane: "cron",
                                        })];
                                case 2:
                                    res = _a.sent();
                                    (0, vitest_1.expect)(res.status).toBe("ok");
                                    (0, vitest_1.expect)(deps.sendMessageTelegram).toHaveBeenCalled();
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
