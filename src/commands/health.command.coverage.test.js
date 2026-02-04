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
var runtime_js_1 = require("../plugins/runtime.js");
var ansi_js_1 = require("../terminal/ansi.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var health_js_1 = require("./health.js");
var callGatewayMock = vitest_1.vi.fn();
var logWebSelfIdMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return callGatewayMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../web/auth-store.js", function () { return ({
    webAuthExists: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }),
    getWebAuthAgeMs: vitest_1.vi.fn(function () { return 0; }),
    logWebSelfId: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logWebSelfIdMock.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("healthCommand (coverage)", function () {
    var runtime = {
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        exit: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "whatsapp",
                source: "test",
                plugin: {
                    id: "whatsapp",
                    meta: {
                        id: "whatsapp",
                        label: "WhatsApp",
                        selectionLabel: "WhatsApp",
                        docsPath: "/channels/whatsapp",
                        blurb: "WhatsApp test stub.",
                    },
                    capabilities: { chatTypes: ["direct", "group"] },
                    config: {
                        listAccountIds: function () { return ["default"]; },
                        resolveAccount: function () { return ({}); },
                    },
                    status: {
                        logSelfId: function () { return logWebSelfIdMock(); },
                    },
                },
            },
        ]));
    });
    (0, vitest_1.it)("prints the rich text summary when linked and configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockResolvedValueOnce({
                        ok: true,
                        ts: Date.now(),
                        durationMs: 5,
                        channels: {
                            whatsapp: {
                                accountId: "default",
                                linked: true,
                                authAgeMs: 5 * 60000,
                            },
                            telegram: {
                                accountId: "default",
                                configured: true,
                                probe: {
                                    ok: true,
                                    elapsedMs: 7,
                                    bot: { username: "bot" },
                                    webhook: { url: "https://example.com/h" },
                                },
                            },
                            discord: {
                                accountId: "default",
                                configured: false,
                            },
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
                                sessions: {
                                    path: "/tmp/sessions.json",
                                    count: 2,
                                    recent: [
                                        { key: "main", updatedAt: Date.now() - 60000, age: 60000 },
                                        { key: "foo", updatedAt: null, age: null },
                                    ],
                                },
                            },
                        ],
                        sessions: {
                            path: "/tmp/sessions.json",
                            count: 2,
                            recent: [
                                { key: "main", updatedAt: Date.now() - 60000, age: 60000 },
                                { key: "foo", updatedAt: null, age: null },
                            ],
                        },
                    });
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 1000 }, runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.exit).not.toHaveBeenCalled();
                    (0, vitest_1.expect)((0, ansi_js_1.stripAnsi)(runtime.log.mock.calls.map(function (c) { return String(c[0]); }).join("\n"))).toMatch(/WhatsApp: linked/i);
                    (0, vitest_1.expect)(logWebSelfIdMock).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
