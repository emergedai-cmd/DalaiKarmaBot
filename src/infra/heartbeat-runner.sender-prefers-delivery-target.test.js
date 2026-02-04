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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var channel_js_1 = require("../../extensions/slack/src/channel.js");
var runtime_js_1 = require("../../extensions/slack/src/runtime.js");
var channel_js_2 = require("../../extensions/telegram/src/channel.js");
var runtime_js_2 = require("../../extensions/telegram/src/runtime.js");
var channel_js_3 = require("../../extensions/whatsapp/src/channel.js");
var runtime_js_3 = require("../../extensions/whatsapp/src/runtime.js");
var replyModule = require("../auto-reply/reply.js");
var sessions_js_1 = require("../config/sessions.js");
var runtime_js_4 = require("../plugins/runtime.js");
var index_js_1 = require("../plugins/runtime/index.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var heartbeat_runner_js_1 = require("./heartbeat-runner.js");
// Avoid pulling optional runtime deps during isolated runs.
vitest_1.vi.mock("jiti", function () { return ({ createJiti: function () { return function () { return ({}); }; } }); });
(0, vitest_1.beforeEach)(function () {
    var runtime = (0, index_js_1.createPluginRuntime)();
    (0, runtime_js_1.setSlackRuntime)(runtime);
    (0, runtime_js_2.setTelegramRuntime)(runtime);
    (0, runtime_js_3.setWhatsAppRuntime)(runtime);
    (0, runtime_js_4.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
        { pluginId: "slack", plugin: channel_js_1.slackPlugin, source: "test" },
        { pluginId: "whatsapp", plugin: channel_js_3.whatsappPlugin, source: "test" },
        { pluginId: "telegram", plugin: channel_js_2.telegramPlugin, source: "test" },
    ]));
});
(0, vitest_1.describe)("runHeartbeatOnce", function () {
    (0, vitest_1.it)("uses the delivery target as sender when lastTo differs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, storePath, replySpy, cfg, sessionKey, sendSlack;
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
                                    target: "slack",
                                    to: "C0A9P2N8QHY",
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
                                lastTo: "1644620762",
                            },
                            _a), null, 2))];
                case 3:
                    _b.sent();
                    replySpy.mockImplementation(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, vitest_1.expect)(ctx.To).toBe("C0A9P2N8QHY");
                            (0, vitest_1.expect)(ctx.From).toBe("C0A9P2N8QHY");
                            return [2 /*return*/, { text: "ok" }];
                        });
                    }); });
                    sendSlack = vitest_1.vi.fn().mockResolvedValue({
                        messageId: "m1",
                        channelId: "C0A9P2N8QHY",
                    });
                    return [4 /*yield*/, (0, heartbeat_runner_js_1.runHeartbeatOnce)({
                            cfg: cfg,
                            deps: {
                                sendSlack: sendSlack,
                                getQueueSize: function () { return 0; },
                                nowMs: function () { return 0; },
                            },
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(sendSlack).toHaveBeenCalled();
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
});
