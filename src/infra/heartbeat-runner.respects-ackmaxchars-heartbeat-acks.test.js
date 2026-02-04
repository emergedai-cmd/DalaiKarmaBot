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
var replyModule = require("../auto-reply/reply.js");
var sessions_js_1 = require("../config/sessions.js");
var runtime_js_3 = require("../plugins/runtime.js");
var index_js_1 = require("../plugins/runtime/index.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var heartbeat_runner_js_1 = require("./heartbeat-runner.js");
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
    (0, vitest_1.it)("respects ackMaxChars for heartbeat acks", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                    ackMaxChars: 0,
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
                    replySpy.mockResolvedValue({ text: "HEARTBEAT_OK 🦞" });
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
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalled();
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
    (0, vitest_1.it)("sends HEARTBEAT_OK when visibility.showOk is true", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"], heartbeat: { showOk: true } } },
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
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendWhatsApp).toHaveBeenCalledWith("+1555", "HEARTBEAT_OK", vitest_1.expect.any(Object));
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
    (0, vitest_1.it)("skips heartbeat LLM calls when visibility disables all output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp, result;
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
                                },
                            },
                        },
                        channels: {
                            whatsapp: {
                                allowFrom: ["*"],
                                heartbeat: { showOk: false, showAlerts: false, useIndicator: false },
                            },
                        },
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
                    result = _b.sent();
                    (0, vitest_1.expect)(replySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(sendWhatsApp).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(result).toEqual({ status: "skipped", reason: "alerts-disabled" });
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
    (0, vitest_1.it)("skips delivery for markup-wrapped HEARTBEAT_OK", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                    replySpy.mockResolvedValue({ text: "<b>HEARTBEAT_OK</b>" });
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
                    (0, vitest_1.expect)(sendWhatsApp).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("does not regress updatedAt when restoring heartbeat sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, originalUpdatedAt, bumpedUpdatedAt_1, cfg, sessionKey_1, finalStore, _a, _b;
        var _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _e.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, , 6, 8]);
                    originalUpdatedAt = 1000;
                    bumpedUpdatedAt_1 = 2000;
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: {
                                    every: "5m",
                                    target: "whatsapp",
                                },
                            },
                        },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                        session: { store: storePath },
                    };
                    sessionKey_1 = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_c = {},
                            _c[sessionKey_1] = {
                                sessionId: "sid",
                                updatedAt: originalUpdatedAt,
                                lastChannel: "whatsapp",
                                lastProvider: "whatsapp",
                                lastTo: "+1555",
                            },
                            _c), null, 2))];
                case 3:
                    _e.sent();
                    replySpy.mockImplementationOnce(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var raw, parsed;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                                case 1:
                                    raw = _a.sent();
                                    parsed = JSON.parse(raw);
                                    if (parsed[sessionKey_1]) {
                                        parsed[sessionKey_1] = __assign(__assign({}, parsed[sessionKey_1]), { updatedAt: bumpedUpdatedAt_1 });
                                    }
                                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(parsed, null, 2))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, { text: "" }];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                                webAuthExists: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                hasActiveWebListener: function () { return true; },
                            },
                        })];
                case 4:
                    _e.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 5:
                    finalStore = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)((_d = finalStore[sessionKey_1]) === null || _d === void 0 ? void 0 : _d.updatedAt).toBe(bumpedUpdatedAt_1);
                    return [3 /*break*/, 8];
                case 6:
                    replySpy.mockRestore();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips WhatsApp delivery when not linked or running", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendWhatsApp, res;
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
                                lastProvider: "whatsapp",
                                lastTo: "+1555",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "Heartbeat alert" });
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
                                    return [2 /*return*/, false];
                                }); }); },
                                hasActiveWebListener: function () { return false; },
                            },
                        })];
                case 4:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe("skipped");
                    (0, vitest_1.expect)(res).toMatchObject({ reason: "whatsapp-not-linked" });
                    (0, vitest_1.expect)(sendWhatsApp).not.toHaveBeenCalled();
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
    (0, vitest_1.it)("passes through accountId for telegram heartbeats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, prevTelegramToken, cfg, sessionKey, sendTelegram;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                    process.env.TELEGRAM_BOT_TOKEN = "";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: { every: "5m", target: "telegram" },
                            },
                        },
                        channels: { telegram: { botToken: "test-bot-token-123" } },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "telegram",
                                lastProvider: "telegram",
                                lastTo: "123456",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "Hello from heartbeat" });
                    sendTelegram = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        chatId: "123456",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendTelegram: sendTelegram,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledWith("123456", "Hello from heartbeat", vitest_1.expect.objectContaining({ accountId: undefined, verbose: false }));
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    if (prevTelegramToken === undefined) {
                        delete process.env.TELEGRAM_BOT_TOKEN;
                    }
                    else {
                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not pre-resolve telegram accountId (allows config-only account tokens)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, prevTelegramToken, cfg, sessionKey, sendTelegram;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hb-"))];
                case 1:
                    tmpDir = _b.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    replySpy = vitest_1.vi.spyOn(replyModule, "getReplyFromConfig");
                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                    process.env.TELEGRAM_BOT_TOKEN = "";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 7]);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: tmpDir,
                                heartbeat: { every: "5m", target: "telegram" },
                            },
                        },
                        channels: {
                            telegram: {
                                accounts: {
                                    work: { botToken: "test-bot-token-123" },
                                },
                            },
                        },
                        session: { store: storePath },
                    };
                    sessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sid",
                                updatedAt: Date.now(),
                                lastChannel: "telegram",
                                lastProvider: "telegram",
                                lastTo: "123456",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockResolvedValue({ text: "Hello from heartbeat" });
                    sendTelegram = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        chatId: "123456",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendTelegram: sendTelegram,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(sendTelegram).toHaveBeenCalledWith("123456", "Hello from heartbeat", vitest_1.expect.objectContaining({ accountId: undefined, verbose: false }));
                    return [3 /*break*/, 7];
                case 5:
                    replySpy.mockRestore();
                    if (prevTelegramToken === undefined) {
                        delete process.env.TELEGRAM_BOT_TOKEN;
                    }
                    else {
                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
