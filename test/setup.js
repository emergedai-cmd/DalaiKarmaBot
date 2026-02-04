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
// Ensure Vitest environment is properly set
process.env.VITEST = "true";
var warnings_js_1 = require("../src/infra/warnings.js");
var runtime_js_1 = require("../src/plugins/runtime.js");
var channel_plugins_js_1 = require("../src/test-utils/channel-plugins.js");
var test_env_1 = require("./test-env");
(0, warnings_js_1.installProcessWarningFilter)();
var testEnv = (0, test_env_1.withIsolatedTestHome)();
(0, vitest_1.afterAll)(function () { return testEnv.cleanup(); });
var pickSendFn = function (id, deps) {
    switch (id) {
        case "discord":
            return deps === null || deps === void 0 ? void 0 : deps.sendDiscord;
        case "slack":
            return deps === null || deps === void 0 ? void 0 : deps.sendSlack;
        case "telegram":
            return deps === null || deps === void 0 ? void 0 : deps.sendTelegram;
        case "whatsapp":
            return deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp;
        case "signal":
            return deps === null || deps === void 0 ? void 0 : deps.sendSignal;
        case "imessage":
            return deps === null || deps === void 0 ? void 0 : deps.sendIMessage;
        default:
            return undefined;
    }
};
var createStubOutbound = function (id, deliveryMode) {
    if (deliveryMode === void 0) { deliveryMode = "direct"; }
    return ({
        deliveryMode: deliveryMode,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var deps = _b.deps, to = _b.to, text = _b.text;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        send = pickSendFn(id, deps);
                        if (!send) return [3 /*break*/, 2];
                        return [4 /*yield*/, send(to, text, {})];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: id }, result)];
                    case 2: return [2 /*return*/, { channel: id, messageId: "test" }];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var deps = _b.deps, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        send = pickSendFn(id, deps);
                        if (!send) return [3 /*break*/, 2];
                        return [4 /*yield*/, send(to, text, { mediaUrl: mediaUrl })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: id }, result)];
                    case 2: return [2 /*return*/, { channel: id, messageId: "test" }];
                }
            });
        }); },
    });
};
var createStubPlugin = function (params) {
    var _a, _b;
    return ({
        id: params.id,
        meta: {
            id: params.id,
            label: (_a = params.label) !== null && _a !== void 0 ? _a : String(params.id),
            selectionLabel: (_b = params.label) !== null && _b !== void 0 ? _b : String(params.id),
            docsPath: "/channels/".concat(params.id),
            blurb: "test stub.",
            aliases: params.aliases,
            preferSessionLookupForAnnounceTarget: params.preferSessionLookupForAnnounceTarget,
        },
        capabilities: { chatTypes: ["direct", "group"] },
        config: {
            listAccountIds: function (cfg) {
                var channels = cfg.channels;
                var entry = channels === null || channels === void 0 ? void 0 : channels[params.id];
                if (!entry || typeof entry !== "object") {
                    return [];
                }
                var accounts = entry.accounts;
                var ids = accounts ? Object.keys(accounts).filter(Boolean) : [];
                return ids.length > 0 ? ids : ["default"];
            },
            resolveAccount: function (cfg, accountId) {
                var channels = cfg.channels;
                var entry = channels === null || channels === void 0 ? void 0 : channels[params.id];
                if (!entry || typeof entry !== "object") {
                    return {};
                }
                var accounts = entry.accounts;
                var match = accounts === null || accounts === void 0 ? void 0 : accounts[accountId];
                return (match && typeof match === "object") || typeof match === "string" ? match : entry;
            },
            isConfigured: function (_account, cfg) { return __awaiter(void 0, void 0, void 0, function () {
                var channels;
                return __generator(this, function (_a) {
                    channels = cfg.channels;
                    return [2 /*return*/, Boolean(channels === null || channels === void 0 ? void 0 : channels[params.id])];
                });
            }); },
        },
        outbound: createStubOutbound(params.id, params.deliveryMode),
    });
};
var createDefaultRegistry = function () {
    return (0, channel_plugins_js_1.createTestRegistry)([
        {
            pluginId: "discord",
            plugin: createStubPlugin({ id: "discord", label: "Discord" }),
            source: "test",
        },
        {
            pluginId: "slack",
            plugin: createStubPlugin({ id: "slack", label: "Slack" }),
            source: "test",
        },
        {
            pluginId: "telegram",
            plugin: __assign(__assign({}, createStubPlugin({ id: "telegram", label: "Telegram" })), { status: {
                    buildChannelSummary: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    configured: false,
                                    tokenSource: process.env.TELEGRAM_BOT_TOKEN ? "env" : "none",
                                })];
                        });
                    }); },
                } }),
            source: "test",
        },
        {
            pluginId: "whatsapp",
            plugin: createStubPlugin({
                id: "whatsapp",
                label: "WhatsApp",
                deliveryMode: "gateway",
                preferSessionLookupForAnnounceTarget: true,
            }),
            source: "test",
        },
        {
            pluginId: "signal",
            plugin: createStubPlugin({ id: "signal", label: "Signal" }),
            source: "test",
        },
        {
            pluginId: "imessage",
            plugin: createStubPlugin({ id: "imessage", label: "iMessage", aliases: ["imsg"] }),
            source: "test",
        },
    ]);
};
(0, vitest_1.beforeEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)(createDefaultRegistry());
});
(0, vitest_1.afterEach)(function () {
    (0, runtime_js_1.setActivePluginRegistry)(createDefaultRegistry());
    // Guard against leaked fake timers across test files/workers.
    vitest_1.vi.useRealTimers();
});
