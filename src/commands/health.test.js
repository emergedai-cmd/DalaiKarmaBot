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
var health_js_1 = require("./health.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return callGatewayMock.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("healthCommand", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("outputs JSON from gateway", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentSessions, snapshot, logged, parsed;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    agentSessions = {
                        path: "/tmp/sessions.json",
                        count: 1,
                        recent: [{ key: "+1555", updatedAt: Date.now(), age: 0 }],
                    };
                    snapshot = {
                        ok: true,
                        ts: Date.now(),
                        durationMs: 5,
                        channels: {
                            whatsapp: { accountId: "default", linked: true, authAgeMs: 5000 },
                            telegram: {
                                accountId: "default",
                                configured: true,
                                probe: { ok: true, elapsedMs: 1 },
                            },
                            discord: { accountId: "default", configured: false },
                        },
                        channelOrder: ["whatsapp", "telegram", "discord"],
                        channelLabels: {
                            whatsapp: "WhatsApp",
                            telegram: "Telegram",
                            discord: "Discord",
                        },
                        heartbeatSeconds: 60,
                        defaultAgentId: "main",
                        agents: [
                            {
                                agentId: "main",
                                isDefault: true,
                                heartbeat: {
                                    enabled: true,
                                    every: "1m",
                                    everyMs: 60000,
                                    prompt: "hi",
                                    target: "last",
                                    ackMaxChars: 160,
                                },
                                sessions: agentSessions,
                            },
                        ],
                        sessions: agentSessions,
                    };
                    callGatewayMock.mockResolvedValueOnce(snapshot);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: true, timeoutMs: 5000 }, runtime)];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(runtime.exit).not.toHaveBeenCalled();
                    logged = (_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    parsed = JSON.parse(logged);
                    (0, vitest_1.expect)((_b = parsed.channels.whatsapp) === null || _b === void 0 ? void 0 : _b.linked).toBe(true);
                    (0, vitest_1.expect)((_c = parsed.channels.telegram) === null || _c === void 0 ? void 0 : _c.configured).toBe(true);
                    (0, vitest_1.expect)(parsed.sessions.count).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints text summary when not json", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockResolvedValueOnce({
                        ok: true,
                        ts: Date.now(),
                        durationMs: 5,
                        channels: {
                            whatsapp: { accountId: "default", linked: false, authAgeMs: null },
                            telegram: { accountId: "default", configured: false },
                            discord: { accountId: "default", configured: false },
                        },
                        channelOrder: ["whatsapp", "telegram", "discord"],
                        channelLabels: {
                            whatsapp: "WhatsApp",
                            telegram: "Telegram",
                            discord: "Discord",
                        },
                        heartbeatSeconds: 60,
                        defaultAgentId: "main",
                        agents: [
                            {
                                agentId: "main",
                                isDefault: true,
                                heartbeat: {
                                    enabled: true,
                                    every: "1m",
                                    everyMs: 60000,
                                    prompt: "hi",
                                    target: "last",
                                    ackMaxChars: 160,
                                },
                                sessions: { path: "/tmp/sessions.json", count: 0, recent: [] },
                            },
                        ],
                        sessions: { path: "/tmp/sessions.json", count: 0, recent: [] },
                    });
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false }, runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.exit).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("formats per-account probe timings", function () {
        var summary = {
            ok: true,
            ts: Date.now(),
            durationMs: 5,
            channels: {
                telegram: {
                    accountId: "main",
                    configured: true,
                    probe: { ok: true, elapsedMs: 196, bot: { username: "pinguini_ugi_bot" } },
                    accounts: {
                        main: {
                            accountId: "main",
                            configured: true,
                            probe: { ok: true, elapsedMs: 196, bot: { username: "pinguini_ugi_bot" } },
                        },
                        flurry: {
                            accountId: "flurry",
                            configured: true,
                            probe: { ok: true, elapsedMs: 190, bot: { username: "flurry_ugi_bot" } },
                        },
                        poe: {
                            accountId: "poe",
                            configured: true,
                            probe: { ok: true, elapsedMs: 188, bot: { username: "poe_ugi_bot" } },
                        },
                    },
                },
            },
            channelOrder: ["telegram"],
            channelLabels: { telegram: "Telegram" },
            heartbeatSeconds: 60,
            defaultAgentId: "main",
            agents: [
                {
                    agentId: "main",
                    isDefault: true,
                    heartbeat: {
                        enabled: true,
                        every: "1m",
                        everyMs: 60000,
                        prompt: "hi",
                        target: "last",
                        ackMaxChars: 160,
                    },
                    sessions: { path: "/tmp/sessions.json", count: 0, recent: [] },
                },
            ],
            sessions: { path: "/tmp/sessions.json", count: 0, recent: [] },
        };
        var lines = (0, health_js_1.formatHealthChannelLines)(summary, { accountMode: "all" });
        (0, vitest_1.expect)(lines).toContain("Telegram: ok (@pinguini_ugi_bot:main:196ms, @flurry_ugi_bot:flurry:190ms, @poe_ugi_bot:poe:188ms)");
    });
});
