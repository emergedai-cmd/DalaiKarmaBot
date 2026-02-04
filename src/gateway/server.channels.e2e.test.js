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
var runtime_js_1 = require("../plugins/runtime.js");
var test_helpers_js_1 = require("./test-helpers.js");
var loadConfigHelpers = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var registryState = vitest_1.vi.hoisted(function () { return ({
    registry: {
        plugins: [],
        tools: [],
        channels: [],
        providers: [],
        gatewayHandlers: {},
        httpHandlers: [],
        httpRoutes: [],
        cliRegistrars: [],
        services: [],
        diagnostics: [],
    },
}); });
vitest_1.vi.mock("./server-plugins.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var setActivePluginRegistry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins/runtime.js"); })];
            case 1:
                setActivePluginRegistry = (_a.sent()).setActivePluginRegistry;
                return [2 /*return*/, {
                        loadGatewayPlugins: function (params) {
                            var _a;
                            setActivePluginRegistry(registryState.registry);
                            return {
                                pluginRegistry: registryState.registry,
                                gatewayMethods: (_a = params.baseMethods) !== null && _a !== void 0 ? _a : [],
                            };
                        },
                    }];
        }
    });
}); });
var createRegistry = function (channels) { return ({
    plugins: [],
    tools: [],
    channels: channels,
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: [],
}); };
var createStubChannelPlugin = function (params) { return ({
    id: params.id,
    meta: {
        id: params.id,
        label: params.label,
        selectionLabel: params.label,
        docsPath: "/channels/".concat(params.id),
        blurb: "test stub.",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
        listAccountIds: function () { return ["default"]; },
        resolveAccount: function () { return ({}); },
        isConfigured: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, false];
        }); }); },
    },
    status: {
        buildChannelSummary: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (__assign({ configured: false }, params.summary))];
            });
        }); },
    },
    gateway: {
        logoutAccount: function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, ({
                        cleared: (_a = params.logoutCleared) !== null && _a !== void 0 ? _a : false,
                        envToken: false,
                    })];
            });
        }); },
    },
}); };
var telegramPlugin = __assign(__assign({}, createStubChannelPlugin({
    id: "telegram",
    label: "Telegram",
    summary: { tokenSource: "none", lastProbeAt: null },
    logoutCleared: true,
})), { gateway: {
        logoutAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var writeConfigFile, nextTelegram;
            var _c;
            var cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                    case 1:
                        writeConfigFile = (_d.sent()).writeConfigFile;
                        nextTelegram = ((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) ? __assign({}, cfg.channels.telegram) : {};
                        delete nextTelegram.botToken;
                        return [4 /*yield*/, writeConfigFile(__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { telegram: nextTelegram }) }))];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, { cleared: true, envToken: false, loggedOut: true }];
                }
            });
        }); },
    } });
var defaultRegistry = createRegistry([
    {
        pluginId: "whatsapp",
        source: "test",
        plugin: createStubChannelPlugin({ id: "whatsapp", label: "WhatsApp" }),
    },
    {
        pluginId: "telegram",
        source: "test",
        plugin: telegramPlugin,
    },
    {
        pluginId: "signal",
        source: "test",
        plugin: createStubChannelPlugin({
            id: "signal",
            label: "Signal",
            summary: { lastProbeAt: null },
        }),
    },
]);
var server;
var ws;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                setRegistry(defaultRegistry);
                return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
            case 1:
                started = _a.sent();
                server = started.server;
                ws = started.ws;
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws.close();
                return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function setRegistry(registry) {
    registryState.registry = registry;
    (0, runtime_js_1.setActivePluginRegistry)(registry);
}
(0, vitest_1.describe)("gateway server channels", function () {
    (0, vitest_1.test)("channels.status returns snapshot without probe", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, telegram, signal;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", undefined);
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "channels.status", { probe: false, timeoutMs: 2000 })];
                case 1:
                    res = _g.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    telegram = (_b = (_a = res.payload) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.telegram;
                    signal = (_d = (_c = res.payload) === null || _c === void 0 ? void 0 : _c.channels) === null || _d === void 0 ? void 0 : _d.signal;
                    (0, vitest_1.expect)((_f = (_e = res.payload) === null || _e === void 0 ? void 0 : _e.channels) === null || _f === void 0 ? void 0 : _f.whatsapp).toBeTruthy();
                    (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.configured).toBe(false);
                    (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.tokenSource).toBe("none");
                    (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.probe).toBeUndefined();
                    (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.lastProbeAt).toBeNull();
                    (0, vitest_1.expect)(signal === null || signal === void 0 ? void 0 : signal.configured).toBe(false);
                    (0, vitest_1.expect)(signal === null || signal === void 0 ? void 0 : signal.probe).toBeUndefined();
                    (0, vitest_1.expect)(signal === null || signal === void 0 ? void 0 : signal.lastProbeAt).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("channels.logout reports no session when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "channels.logout", {
                            channel: "whatsapp",
                        })];
                case 1:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_a = res.payload) === null || _a === void 0 ? void 0 : _a.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_b = res.payload) === null || _b === void 0 ? void 0 : _b.cleared).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("channels.logout clears telegram bot token from config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, readConfigFileSnapshot, writeConfigFile, res, snap;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    vitest_1.vi.stubEnv("TELEGRAM_BOT_TOKEN", undefined);
                    setRegistry(defaultRegistry);
                    return [4 /*yield*/, loadConfigHelpers()];
                case 1:
                    _a = _o.sent(), readConfigFileSnapshot = _a.readConfigFileSnapshot, writeConfigFile = _a.writeConfigFile;
                    return [4 /*yield*/, writeConfigFile({
                            channels: {
                                telegram: {
                                    botToken: "123:abc",
                                    groups: { "*": { requireMention: false } },
                                },
                            },
                        })];
                case 2:
                    _o.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "channels.logout", { channel: "telegram" })];
                case 3:
                    res = _o.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_b = res.payload) === null || _b === void 0 ? void 0 : _b.channel).toBe("telegram");
                    (0, vitest_1.expect)((_c = res.payload) === null || _c === void 0 ? void 0 : _c.cleared).toBe(true);
                    (0, vitest_1.expect)((_d = res.payload) === null || _d === void 0 ? void 0 : _d.envToken).toBe(false);
                    return [4 /*yield*/, readConfigFileSnapshot()];
                case 4:
                    snap = _o.sent();
                    (0, vitest_1.expect)(snap.valid).toBe(true);
                    (0, vitest_1.expect)((_g = (_f = (_e = snap.config) === null || _e === void 0 ? void 0 : _e.channels) === null || _f === void 0 ? void 0 : _f.telegram) === null || _g === void 0 ? void 0 : _g.botToken).toBeUndefined();
                    (0, vitest_1.expect)((_m = (_l = (_k = (_j = (_h = snap.config) === null || _h === void 0 ? void 0 : _h.channels) === null || _j === void 0 ? void 0 : _j.telegram) === null || _k === void 0 ? void 0 : _k.groups) === null || _l === void 0 ? void 0 : _l["*"]) === null || _m === void 0 ? void 0 : _m.requireMention).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
