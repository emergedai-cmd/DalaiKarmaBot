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
var test_helpers_js_1 = require("./test-helpers.js");
var hoisted = vitest_1.vi.hoisted(function () {
    var cronInstances = [];
    var CronServiceMock = /** @class */ (function () {
        function CronServiceMock() {
            var _this = this;
            this.start = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); });
            this.stop = vitest_1.vi.fn();
            cronInstances.push(this);
        }
        return CronServiceMock;
    }());
    var browserStop = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var startBrowserControlServerIfEnabled = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    stop: browserStop,
                })];
        });
    }); });
    var heartbeatStop = vitest_1.vi.fn();
    var heartbeatUpdateConfig = vitest_1.vi.fn();
    var startHeartbeatRunner = vitest_1.vi.fn(function () { return ({
        stop: heartbeatStop,
        updateConfig: heartbeatUpdateConfig,
    }); });
    var startGmailWatcher = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ started: true })];
    }); }); });
    var stopGmailWatcher = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var providerManager = {
        getRuntimeSnapshot: vitest_1.vi.fn(function () { return ({
            providers: {
                whatsapp: {
                    running: false,
                    connected: false,
                    reconnectAttempts: 0,
                    lastConnectedAt: null,
                    lastDisconnect: null,
                    lastMessageAt: null,
                    lastEventAt: null,
                    lastError: null,
                },
                telegram: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                    mode: null,
                },
                discord: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                },
                slack: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                },
                signal: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                    baseUrl: null,
                },
                imessage: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                    cliPath: null,
                    dbPath: null,
                },
                msteams: {
                    running: false,
                    lastStartAt: null,
                    lastStopAt: null,
                    lastError: null,
                },
            },
            providerAccounts: {
                whatsapp: {},
                telegram: {},
                discord: {},
                slack: {},
                signal: {},
                imessage: {},
                msteams: {},
            },
        }); }),
        startChannels: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }),
        startChannel: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }),
        stopChannel: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }),
        markChannelLoggedOut: vitest_1.vi.fn(),
    };
    var createChannelManager = vitest_1.vi.fn(function () { return providerManager; });
    var reloaderStop = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var onHotReload = null;
    var onRestart = null;
    var startGatewayConfigReloader = vitest_1.vi.fn(function (opts) {
        onHotReload = opts.onHotReload;
        onRestart = opts.onRestart;
        return { stop: reloaderStop };
    });
    return {
        CronService: CronServiceMock,
        cronInstances: cronInstances,
        browserStop: browserStop,
        startBrowserControlServerIfEnabled: startBrowserControlServerIfEnabled,
        heartbeatStop: heartbeatStop,
        heartbeatUpdateConfig: heartbeatUpdateConfig,
        startHeartbeatRunner: startHeartbeatRunner,
        startGmailWatcher: startGmailWatcher,
        stopGmailWatcher: stopGmailWatcher,
        providerManager: providerManager,
        createChannelManager: createChannelManager,
        startGatewayConfigReloader: startGatewayConfigReloader,
        reloaderStop: reloaderStop,
        getOnHotReload: function () { return onHotReload; },
        getOnRestart: function () { return onRestart; },
    };
});
vitest_1.vi.mock("../cron/service.js", function () { return ({
    CronService: hoisted.CronService,
}); });
vitest_1.vi.mock("./server-browser.js", function () { return ({
    startBrowserControlServerIfEnabled: hoisted.startBrowserControlServerIfEnabled,
}); });
vitest_1.vi.mock("../infra/heartbeat-runner.js", function () { return ({
    startHeartbeatRunner: hoisted.startHeartbeatRunner,
}); });
vitest_1.vi.mock("../hooks/gmail-watcher.js", function () { return ({
    startGmailWatcher: hoisted.startGmailWatcher,
    stopGmailWatcher: hoisted.stopGmailWatcher,
}); });
vitest_1.vi.mock("./server-channels.js", function () { return ({
    createChannelManager: hoisted.createChannelManager,
}); });
vitest_1.vi.mock("./config-reload.js", function () { return ({
    startGatewayConfigReloader: hoisted.startGatewayConfigReloader,
}); });
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
(0, vitest_1.describe)("gateway hot reload", function () {
    var prevSkipChannels;
    var prevSkipGmail;
    (0, vitest_1.beforeEach)(function () {
        prevSkipChannels = process.env.OPENCLAW_SKIP_CHANNELS;
        prevSkipGmail = process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
        process.env.OPENCLAW_SKIP_CHANNELS = "0";
        delete process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
    });
    (0, vitest_1.afterEach)(function () {
        if (prevSkipChannels === undefined) {
            delete process.env.OPENCLAW_SKIP_CHANNELS;
        }
        else {
            process.env.OPENCLAW_SKIP_CHANNELS = prevSkipChannels;
        }
        if (prevSkipGmail === undefined) {
            delete process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
        }
        else {
            process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prevSkipGmail;
        }
    });
    (0, vitest_1.it)("applies hot reload actions and emits restart signal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, onHotReload, nextConfig, onRestart, signalSpy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
                case 2:
                    server = _a.sent();
                    onHotReload = hoisted.getOnHotReload();
                    (0, vitest_1.expect)(onHotReload).toBeTypeOf("function");
                    nextConfig = {
                        hooks: {
                            enabled: true,
                            token: "secret",
                            gmail: { account: "me@example.com" },
                        },
                        cron: { enabled: true, store: "/tmp/cron.json" },
                        agents: { defaults: { heartbeat: { every: "1m" }, maxConcurrent: 2 } },
                        browser: { enabled: true },
                        web: { enabled: true },
                        channels: {
                            telegram: { botToken: "token" },
                            discord: { token: "token" },
                            signal: { account: "+15550000000" },
                            imessage: { enabled: true },
                        },
                    };
                    return [4 /*yield*/, (onHotReload === null || onHotReload === void 0 ? void 0 : onHotReload({
                            changedPaths: [
                                "hooks.gmail.account",
                                "cron.enabled",
                                "agents.defaults.heartbeat.every",
                                "browser.enabled",
                                "web.enabled",
                                "channels.telegram.botToken",
                                "channels.discord.token",
                                "channels.signal.account",
                                "channels.imessage.enabled",
                            ],
                            restartGateway: false,
                            restartReasons: [],
                            hotReasons: ["web.enabled"],
                            reloadHooks: true,
                            restartGmailWatcher: true,
                            restartBrowserControl: true,
                            restartCron: true,
                            restartHeartbeat: true,
                            restartChannels: new Set(["whatsapp", "telegram", "discord", "signal", "imessage"]),
                            noopPaths: [],
                        }, nextConfig))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(hoisted.stopGmailWatcher).toHaveBeenCalled();
                    (0, vitest_1.expect)(hoisted.startGmailWatcher).toHaveBeenCalledWith(nextConfig);
                    (0, vitest_1.expect)(hoisted.browserStop).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(hoisted.startBrowserControlServerIfEnabled).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(hoisted.startHeartbeatRunner).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(hoisted.heartbeatUpdateConfig).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(hoisted.heartbeatUpdateConfig).toHaveBeenCalledWith(nextConfig);
                    (0, vitest_1.expect)(hoisted.cronInstances.length).toBe(2);
                    (0, vitest_1.expect)(hoisted.cronInstances[0].stop).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(hoisted.cronInstances[1].start).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledTimes(5);
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledTimes(5);
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledWith("whatsapp");
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledWith("whatsapp");
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledWith("telegram");
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledWith("telegram");
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledWith("discord");
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledWith("discord");
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledWith("signal");
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledWith("signal");
                    (0, vitest_1.expect)(hoisted.providerManager.stopChannel).toHaveBeenCalledWith("imessage");
                    (0, vitest_1.expect)(hoisted.providerManager.startChannel).toHaveBeenCalledWith("imessage");
                    onRestart = hoisted.getOnRestart();
                    (0, vitest_1.expect)(onRestart).toBeTypeOf("function");
                    signalSpy = vitest_1.vi.fn();
                    process.once("SIGUSR1", signalSpy);
                    onRestart === null || onRestart === void 0 ? void 0 : onRestart({
                        changedPaths: ["gateway.port"],
                        restartGateway: true,
                        restartReasons: ["gateway.port"],
                        hotReasons: [],
                        reloadHooks: false,
                        restartGmailWatcher: false,
                        restartBrowserControl: false,
                        restartCron: false,
                        restartHeartbeat: false,
                        restartChannels: new Set(),
                        noopPaths: [],
                    }, {});
                    (0, vitest_1.expect)(signalSpy).toHaveBeenCalledTimes(1);
                    return [4 /*yield*/, server.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gateway agents", function () {
    (0, vitest_1.it)("lists configured agents via agents.list RPC", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, server, ws, res;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
                case 1:
                    _a = _c.sent(), server = _a.server, ws = _a.ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "agents.list", {})];
                case 3:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_b = res.payload) === null || _b === void 0 ? void 0 : _b.agents.map(function (agent) { return agent.id; })).toContain("main");
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
