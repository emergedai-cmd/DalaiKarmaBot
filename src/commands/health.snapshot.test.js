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
var channel_js_1 = require("../../extensions/telegram/src/channel.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var health_js_1 = require("./health.js");
var testConfig = {};
var testStore = {};
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
vitest_1.vi.mock("../config/sessions.js", function () { return ({
    resolveStorePath: function () { return "/tmp/sessions.json"; },
    loadSessionStore: function () { return testStore; },
    readSessionUpdatedAt: vitest_1.vi.fn(function () { return undefined; }),
    recordSessionMetaFromInbound: vitest_1.vi.fn().mockResolvedValue(undefined),
    updateLastRoute: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("../web/auth-store.js", function () { return ({
    webAuthExists: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }),
    getWebAuthAgeMs: vitest_1.vi.fn(function () { return 1234; }),
    readWebSelfId: vitest_1.vi.fn(function () { return ({ e164: null, jid: null }); }),
    logWebSelfId: vitest_1.vi.fn(),
    logoutWeb: vitest_1.vi.fn(),
}); });
(0, vitest_1.describe)("getHealthSnapshot", function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createPluginRuntime, setTelegramRuntime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "telegram", plugin: channel_js_1.telegramPlugin, source: "test" }]));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins/runtime/index.js"); })];
                case 1:
                    createPluginRuntime = (_a.sent()).createPluginRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../extensions/telegram/src/runtime.js"); })];
                case 2:
                    setTelegramRuntime = (_a.sent()).setTelegramRuntime;
                    setTelegramRuntime(createPluginRuntime());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
        vitest_1.vi.unstubAllEnvs();
    });
    (0, vitest_1.it)("skips telegram probe when not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snap, telegram;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    testConfig = { session: { store: "/tmp/x" } };
                    testStore = {
                        global: { updatedAt: Date.now() },
                        unknown: { updatedAt: Date.now() },
                        main: { updatedAt: 1000 },
                        foo: { updatedAt: 2000 },
                    };
                    vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
                    vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "");
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({
                            timeoutMs: 10,
                        })];
                case 1:
                    snap = (_b.sent());
                    (0, vitest_1.expect)(snap.ok).toBe(true);
                    telegram = snap.channels.telegram;
                    (0, vitest_1.expect)(telegram.configured).toBe(false);
                    (0, vitest_1.expect)(telegram.probe).toBeUndefined();
                    (0, vitest_1.expect)(snap.sessions.count).toBe(2);
                    (0, vitest_1.expect)((_a = snap.sessions.recent[0]) === null || _a === void 0 ? void 0 : _a.key).toBe("foo");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("probes telegram getMe + webhook info when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, snap, telegram;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    testConfig = { channels: { telegram: { botToken: "t-1" } } };
                    testStore = {};
                    vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "");
                    calls = [];
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(url);
                            if (url.includes("/getMe")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        status: 200,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        result: { id: 1, username: "bot" },
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.includes("/getWebhookInfo")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        status: 200,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        result: {
                                                            url: "https://example.com/h",
                                                            has_custom_certificate: false,
                                                        },
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            return [2 /*return*/, {
                                    ok: false,
                                    status: 404,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ ok: false, description: "nope" })];
                                    }); }); },
                                }];
                        });
                    }); }));
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ timeoutMs: 25 })];
                case 1:
                    snap = _f.sent();
                    telegram = snap.channels.telegram;
                    (0, vitest_1.expect)(telegram.configured).toBe(true);
                    (0, vitest_1.expect)((_a = telegram.probe) === null || _a === void 0 ? void 0 : _a.ok).toBe(true);
                    (0, vitest_1.expect)((_c = (_b = telegram.probe) === null || _b === void 0 ? void 0 : _b.bot) === null || _c === void 0 ? void 0 : _c.username).toBe("bot");
                    (0, vitest_1.expect)((_e = (_d = telegram.probe) === null || _d === void 0 ? void 0 : _d.webhook) === null || _e === void 0 ? void 0 : _e.url).toMatch(/^https:/);
                    (0, vitest_1.expect)(calls.some(function (c) { return c.includes("/getMe"); })).toBe(true);
                    (0, vitest_1.expect)(calls.some(function (c) { return c.includes("/getWebhookInfo"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats telegram.tokenFile as configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, tokenFile, calls, snap, telegram;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tmpDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-health-"));
                    tokenFile = node_path_1.default.join(tmpDir, "telegram-token");
                    node_fs_1.default.writeFileSync(tokenFile, "t-file\n", "utf-8");
                    testConfig = { channels: { telegram: { tokenFile: tokenFile } } };
                    testStore = {};
                    vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
                    calls = [];
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(url);
                            if (url.includes("/getMe")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        status: 200,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        result: { id: 1, username: "bot" },
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.includes("/getWebhookInfo")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        status: 200,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        result: {
                                                            url: "https://example.com/h",
                                                            has_custom_certificate: false,
                                                        },
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            return [2 /*return*/, {
                                    ok: false,
                                    status: 404,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ ok: false, description: "nope" })];
                                    }); }); },
                                }];
                        });
                    }); }));
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ timeoutMs: 25 })];
                case 1:
                    snap = _b.sent();
                    telegram = snap.channels.telegram;
                    (0, vitest_1.expect)(telegram.configured).toBe(true);
                    (0, vitest_1.expect)((_a = telegram.probe) === null || _a === void 0 ? void 0 : _a.ok).toBe(true);
                    (0, vitest_1.expect)(calls.some(function (c) { return c.includes("bott-file/getMe"); })).toBe(true);
                    node_fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns a structured telegram probe error when getMe fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snap, telegram;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    testConfig = { channels: { telegram: { botToken: "bad-token" } } };
                    testStore = {};
                    vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "");
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (url.includes("/getMe")) {
                                return [2 /*return*/, {
                                        ok: false,
                                        status: 401,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, ({ ok: false, description: "unauthorized" })];
                                        }); }); },
                                    }];
                            }
                            throw new Error("unexpected");
                        });
                    }); }));
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ timeoutMs: 25 })];
                case 1:
                    snap = _d.sent();
                    telegram = snap.channels.telegram;
                    (0, vitest_1.expect)(telegram.configured).toBe(true);
                    (0, vitest_1.expect)((_a = telegram.probe) === null || _a === void 0 ? void 0 : _a.ok).toBe(false);
                    (0, vitest_1.expect)((_b = telegram.probe) === null || _b === void 0 ? void 0 : _b.status).toBe(401);
                    (0, vitest_1.expect)((_c = telegram.probe) === null || _c === void 0 ? void 0 : _c.error).toMatch(/unauthorized/i);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("captures unexpected probe exceptions as errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snap, telegram;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    testConfig = { channels: { telegram: { botToken: "t-err" } } };
                    testStore = {};
                    vitest_1.vi.stubEnv("DISCORD_BOT_TOKEN", "");
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("network down");
                        });
                    }); }));
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ timeoutMs: 25 })];
                case 1:
                    snap = _c.sent();
                    telegram = snap.channels.telegram;
                    (0, vitest_1.expect)(telegram.configured).toBe(true);
                    (0, vitest_1.expect)((_a = telegram.probe) === null || _a === void 0 ? void 0 : _a.ok).toBe(false);
                    (0, vitest_1.expect)((_b = telegram.probe) === null || _b === void 0 ? void 0 : _b.error).toMatch(/network down/i);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("disables heartbeat for agents without heartbeat blocks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snap, byAgent, main, ops;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testConfig = {
                        agents: {
                            defaults: {
                                heartbeat: {
                                    every: "30m",
                                    target: "last",
                                },
                            },
                            list: [
                                { id: "main", default: true },
                                { id: "ops", heartbeat: { every: "1h", target: "whatsapp" } },
                            ],
                        },
                    };
                    testStore = {};
                    return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ timeoutMs: 10, probe: false })];
                case 1:
                    snap = _a.sent();
                    byAgent = new Map(snap.agents.map(function (agent) { return [agent.agentId, agent]; }));
                    main = byAgent.get("main");
                    ops = byAgent.get("ops");
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.heartbeat.everyMs).toBeNull();
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.heartbeat.every).toBe("disabled");
                    (0, vitest_1.expect)(ops === null || ops === void 0 ? void 0 : ops.heartbeat.everyMs).toBeTruthy();
                    (0, vitest_1.expect)(ops === null || ops === void 0 ? void 0 : ops.heartbeat.every).toBe("1h");
                    return [2 /*return*/];
            }
        });
    }); });
});
