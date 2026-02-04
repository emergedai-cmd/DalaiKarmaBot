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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var channel_js_1 = require("../../extensions/telegram/src/channel.js");
var runtime_js_1 = require("../../extensions/telegram/src/runtime.js");
var channel_js_2 = require("../../extensions/whatsapp/src/channel.js");
var runtime_js_2 = require("../../extensions/whatsapp/src/runtime.js");
var heartbeat_js_1 = require("../auto-reply/heartbeat.js");
var replyModule = require("../auto-reply/reply.js");
var sessions_js_1 = require("../config/sessions.js");
var runtime_js_3 = require("../plugins/runtime.js");
var index_js_1 = require("../plugins/runtime/index.js");
var session_key_js_1 = require("../routing/session-key.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var heartbeat_runner_js_1 = require("./heartbeat-runner.js");
var targets_js_1 = require("./outbound/targets.js");
// Avoid pulling optional runtime deps during isolated runs.
vitest_1.vi.mock("jiti", function () { return ({ createJiti: function () { return function () { return ({}); }; } }); });
(0, vitest_1.beforeEach)(function () {
    var runtime = (0, index_js_1.createPluginRuntime)();
    (0, runtime_js_1.setTelegramRuntime)(runtime);
    (0, runtime_js_2.setWhatsAppRuntime)(runtime);
    (0, runtime_js_3.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
        { pluginId: "whatsapp", plugin: channel_js_2.whatsappPlugin, source: "test" },
        { pluginId: "telegram", plugin: channel_js_1.telegramPlugin, source: "test" },
    ]));
});
(0, vitest_1.describe)("resolveHeartbeatIntervalMs", function () {
    (0, vitest_1.it)("returns default when unset", function () {
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({})).toBe(30 * 60000);
    });
    (0, vitest_1.it)("returns null when invalid or zero", function () {
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({
            agents: { defaults: { heartbeat: { every: "0m" } } },
        })).toBeNull();
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({
            agents: { defaults: { heartbeat: { every: "oops" } } },
        })).toBeNull();
    });
    (0, vitest_1.it)("parses duration strings with minute defaults", function () {
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({
            agents: { defaults: { heartbeat: { every: "5m" } } },
        })).toBe(5 * 60000);
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({
            agents: { defaults: { heartbeat: { every: "5" } } },
        })).toBe(5 * 60000);
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({
            agents: { defaults: { heartbeat: { every: "2h" } } },
        })).toBe(2 * 60 * 60000);
    });
    (0, vitest_1.it)("uses explicit heartbeat overrides when provided", function () {
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatIntervalMs)({ agents: { defaults: { heartbeat: { every: "30m" } } } }, undefined, { every: "5m" })).toBe(5 * 60000);
    });
});
(0, vitest_1.describe)("resolveHeartbeatPrompt", function () {
    (0, vitest_1.it)("uses the default prompt when unset", function () {
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatPrompt)({})).toBe(heartbeat_js_1.HEARTBEAT_PROMPT);
    });
    (0, vitest_1.it)("uses a trimmed override when configured", function () {
        var cfg = {
            agents: { defaults: { heartbeat: { prompt: "  ping  " } } },
        };
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.resolveHeartbeatPrompt)(cfg)).toBe("ping");
    });
});
(0, vitest_1.describe)("isHeartbeatEnabledForAgent", function () {
    (0, vitest_1.it)("enables only explicit heartbeat agents when configured", function () {
        var cfg = {
            agents: {
                defaults: { heartbeat: { every: "30m" } },
                list: [{ id: "main" }, { id: "ops", heartbeat: { every: "1h" } }],
            },
        };
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.isHeartbeatEnabledForAgent)(cfg, "main")).toBe(false);
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.isHeartbeatEnabledForAgent)(cfg, "ops")).toBe(true);
    });
    (0, vitest_1.it)("falls back to default agent when no explicit heartbeat entries", function () {
        var cfg = {
            agents: {
                defaults: { heartbeat: { every: "30m" } },
                list: [{ id: "main" }, { id: "ops" }],
            },
        };
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.isHeartbeatEnabledForAgent)(cfg, "main")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_runner_js_1.isHeartbeatEnabledForAgent)(cfg, "ops")).toBe(false);
    });
});
(0, vitest_1.describe)("resolveHeartbeatDeliveryTarget", function () {
    var baseEntry = {
        sessionId: "sid",
        updatedAt: Date.now(),
    };
    (0, vitest_1.it)("respects target none", function () {
        var cfg = {
            agents: { defaults: { heartbeat: { target: "none" } } },
        };
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: baseEntry })).toEqual({
            channel: "none",
            reason: "target-none",
            accountId: undefined,
            lastChannel: undefined,
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("uses last route by default", function () {
        var cfg = {};
        var entry = __assign(__assign({}, baseEntry), { lastChannel: "whatsapp", lastTo: "+1555" });
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: entry })).toEqual({
            channel: "whatsapp",
            to: "+1555",
            accountId: undefined,
            lastChannel: "whatsapp",
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("normalizes explicit WhatsApp targets when allowFrom is '*'", function () {
        var cfg = {
            agents: {
                defaults: {
                    heartbeat: { target: "whatsapp", to: "whatsapp:(555) 123" },
                },
            },
            channels: { whatsapp: { allowFrom: ["*"] } },
        };
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: baseEntry })).toEqual({
            channel: "whatsapp",
            to: "+555123",
            accountId: undefined,
            lastChannel: undefined,
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("skips when last route is webchat", function () {
        var cfg = {};
        var entry = __assign(__assign({}, baseEntry), { lastChannel: "webchat", lastTo: "web" });
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: entry })).toEqual({
            channel: "none",
            reason: "no-target",
            accountId: undefined,
            lastChannel: undefined,
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("applies allowFrom fallback for WhatsApp targets", function () {
        var cfg = {
            agents: { defaults: { heartbeat: { target: "whatsapp", to: "+1999" } } },
            channels: { whatsapp: { allowFrom: ["+1555", "+1666"] } },
        };
        var entry = __assign(__assign({}, baseEntry), { lastChannel: "whatsapp", lastTo: "+1222" });
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: entry })).toEqual({
            channel: "whatsapp",
            to: "+1555",
            reason: "allowFrom-fallback",
            accountId: undefined,
            lastChannel: "whatsapp",
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("keeps WhatsApp group targets even with allowFrom set", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+1555"] } },
        };
        var entry = __assign(__assign({}, baseEntry), { lastChannel: "whatsapp", lastTo: "120363401234567890@g.us" });
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: entry })).toEqual({
            channel: "whatsapp",
            to: "120363401234567890@g.us",
            accountId: undefined,
            lastChannel: "whatsapp",
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("normalizes prefixed WhatsApp group targets for heartbeat delivery", function () {
        var cfg = {
            channels: { whatsapp: { allowFrom: ["+1555"] } },
        };
        var entry = __assign(__assign({}, baseEntry), { lastChannel: "whatsapp", lastTo: "whatsapp:120363401234567890@G.US" });
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: entry })).toEqual({
            channel: "whatsapp",
            to: "120363401234567890@g.us",
            accountId: undefined,
            lastChannel: "whatsapp",
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("keeps explicit telegram targets", function () {
        var cfg = {
            agents: { defaults: { heartbeat: { target: "telegram", to: "123" } } },
        };
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({ cfg: cfg, entry: baseEntry })).toEqual({
            channel: "telegram",
            to: "123",
            accountId: undefined,
            lastChannel: undefined,
            lastAccountId: undefined,
        });
    });
    (0, vitest_1.it)("prefers per-agent heartbeat overrides when provided", function () {
        var cfg = {
            agents: { defaults: { heartbeat: { target: "telegram", to: "123" } } },
        };
        var heartbeat = { target: "whatsapp", to: "+1555" };
        (0, vitest_1.expect)((0, targets_js_1.resolveHeartbeatDeliveryTarget)({
            cfg: cfg,
            entry: __assign(__assign({}, baseEntry), { lastChannel: "whatsapp", lastTo: "+1999" }),
            heartbeat: heartbeat,
        })).toEqual({
            channel: "whatsapp",
            to: "+1555",
            accountId: undefined,
            lastChannel: "whatsapp",
            lastAccountId: undefined,
        });
    });
});
(0, vitest_1.describe)("runHeartbeatOnce", function () {
    (0, vitest_1.it)("skips when agent heartbeat is not enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: { heartbeat: { every: "30m" } },
                            list: [{ id: "main" }, { id: "ops", heartbeat: { every: "1h" } }],
                        },
                    };
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({ cfg: cfg, agentId: "main" })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe("skipped");
                    if (res.status === "skipped") {
                        (0, vitest_1.expect)(res.reason).toBe("disabled");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips outside active hours", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                userTimezone: "UTC",
                                heartbeat: {
                                    every: "30m",
                                    activeHours: { start: "08:00", end: "24:00", timezone: "user" },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: { nowMs: function () { return Date.UTC(2025, 0, 1, 7, 0, 0); } },
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe("skipped");
                    if (res.status === "skipped") {
                        (0, vitest_1.expect)(res.reason).toBe("quiet-hours");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses the last non-empty payload for delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: { every: "5m", target: "whatsapp" },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue([{ text: "Let me check..." }, { text: "Final alert" }]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledWith("+1555", "Final alert", vitest_1.expect.any(Object));
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses per-agent heartbeat overrides and session keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                heartbeat: { every: "30m", prompt: "Default prompt" },
                            },
                            list: [
                                { id: "main", default: true },
                                {
                                    id: "ops",
                                    heartbeat: { every: "5m", target: "whatsapp", prompt: "Ops check" },
                                },
                            ],
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveAgentMainSessionKey)({ cfg: cfg, agentId: "ops" });
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue([{ text: "Final alert" }]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            agentId: "ops",
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledWith("+1555", "Final alert", vitest_1.expect.any(Object));
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ Body: "Ops check", SessionKey: sessionKey }), { isHeartbeat: true }, cfg);
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs heartbeats in the explicit session key when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, groupId, cfg, mainSessionKey, agentId, groupSessionKey, sendWhatsApp;
        var _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _d.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 5, 7]);
                    groupId = "120363401234567890@g.us";
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: {
                                    every: "5m",
                                    target: "last",
                                },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    mainSessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(mainSessionKey);
                    groupSessionKey = (0, session_key_js_1.buildAgentPeerSessionKey)({
                        agentId: agentId,
                        channel: "whatsapp",
                        peerKind: "group",
                        peerId: groupId,
                    });
                    if ((_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.heartbeat) {
                        cfg.agents.defaults.heartbeat.session = groupSessionKey;
                    }
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[mainSessionKey] = {
                                sessionId: "sid-main",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a[groupSessionKey] = {
                                sessionId: "sid-group",
                                updatedAt: Date.now() + 10000,
                                lastChannel: "whatsapp",
                                lastTo: groupId,
                            },
                            _a), null, 2))];
                case 3:
                    _d.sent();
                    replySpy.mockResolvedValue([{ text: "Group alert" }]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledWith(groupId, "Group alert", vitest_1.expect.any(Object));
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ SessionKey: groupSessionKey }), { isHeartbeat: true }, cfg);
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("suppresses duplicate heartbeat payloads within 24h", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: { every: "5m", target: "whatsapp" },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                                lastHeartbeatText: "Final alert",
                                lastHeartbeatSentAt: 0,
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue([{ text: "Final alert" }]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({ messageId: "m1", toJid: "jid" });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 60000; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(0);
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("can include reasoning payloads when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: {
                                    every: "5m",
                                    target: "whatsapp",
                                    includeReasoning: true,
                                },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastProvider: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue([
                        { text: "Reasoning:\n_Because it helps_" },
                        { text: "Final alert" },
                    ]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenNthCalledWith(1, "+1555", "Reasoning:\n_Because it helps_", vitest_1.expect.any(Object));
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenNthCalledWith(2, "+1555", "Final alert", vitest_1.expect.any(Object));
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delivers reasoning even when the main heartbeat reply is HEARTBEAT_OK", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: {
                                    every: "5m",
                                    target: "whatsapp",
                                    includeReasoning: true,
                                },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastProvider: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue([
                        { text: "Reasoning:\n_Because it helps_" },
                        { text: "HEARTBEAT_OK" },
                    ]);
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenNthCalledWith(1, "+1555", "Reasoning:\n_Because it helps_", vitest_1.expect.any(Object));
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads the default agent session from templated stores", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storeTemplate, replySpy, cfg, sessionKey, agentId, storePath, sendWhatsApp;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storeTemplate = node_path_1.default.join(tmpDir, "agents", "{agentId}", "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    cfg = {
                        agents: {
                            defaults: { workspace: tmpDir, heartbeat: { every: "5m" } },
                            list: [{ id: "work", default: true }],
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storeTemplate },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(sessionKey);
                    storePath = (0, sessions_js_1.resolveStorePath)(storeTemplate, { agentId: agentId });
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(storePath), { recursive: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastProvider: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 4:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "Hello from heartbeat" });
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledWith("+1555", "Hello from heartbeat", vitest_1.expect.any(Object));
                    return [3 /*break*/, 8];
                case 6:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips heartbeat when HEARTBEAT.md is effectively empty (saves API calls)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, workspaceDir, replySpy, cfg, sessionKey, sendWhatsApp, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    workspaceDir = node_path_1.default.join(tmpDir, "workspace");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 7, 9]);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 3:
                    _b.sent();
                    // Create effectively empty HEARTBEAT.md (only header and comments)
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "HEARTBEAT.md"), "# HEARTBEAT.md\n\n## Tasks\n\n", "utf-8")];
                case 4:
                    // Create effectively empty HEARTBEAT.md (only header and comments)
                    _b.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                heartbeat: { every: "5m", target: "whatsapp" },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 5:
                    _b.sent();
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 6:
                    res = _b.sent();
                    // Should skip without making API call
                    (0, vitest_1.expect)(res.status).toBe("skipped");
                    if (res.status === "skipped") {
                        (0, vitest_1.expect)(res.reason).toBe("empty-heartbeat-file");
                    }
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendWhatsApp).not.toHaveBeenCalled();
                    return [3 /*break*/, 9];
                case 7:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 8:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs heartbeat when HEARTBEAT.md has actionable content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, workspaceDir, replySpy, cfg, sessionKey, sendWhatsApp, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    workspaceDir = node_path_1.default.join(tmpDir, "workspace");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 7, 9]);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 3:
                    _b.sent();
                    // Create HEARTBEAT.md with actionable content
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "HEARTBEAT.md"), "# HEARTBEAT.md\n\n- Check server logs\n- Review pending PRs\n", "utf-8")];
                case 4:
                    // Create HEARTBEAT.md with actionable content
                    _b.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                heartbeat: { every: "5m", target: "whatsapp" },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 5:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "Checked logs and PRs" });
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 6:
                    res = _b.sent();
                    // Should run and make API call
                    (0, vitest_1.expect)(res.status).toBe("ran");
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalled();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    return [3 /*break*/, 9];
                case 7:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 8:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs heartbeat when HEARTBEAT.md does not exist (lets LLM decide)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, workspaceDir, replySpy, cfg, sessionKey, sendWhatsApp, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    workspaceDir = node_path_1.default.join(tmpDir, "workspace");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 6, 8]);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 3:
                    _b.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                heartbeat: { every: "5m", target: "whatsapp" },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 4:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "HEARTBEAT_OK" });
                    sendWhatsApp = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        toJid: "jid",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendWhatsApp: sendWhatsApp,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 5:
                    res = _b.sent();
                    // Should run (not skip) - let LLM decide since file doesn't exist
                    (0, vitest_1.expect)(res.status).toBe("ran");
                    (0, vitest_1.expect)(replySpy).toHaveBeenCalled();
                    return [3 /*break*/, 8];
                case 6:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
