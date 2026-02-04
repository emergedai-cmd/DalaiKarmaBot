"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.embeddedRunMock = exports.sessionStoreSaveDelayMs = exports.testIsNixMode = exports.testState = exports.getReplyFromConfig = exports.agentCommand = exports.cronIsolatedRun = exports.piSdkMock = exports.testTailnetIPv4 = exports.setTestConfigRoot = exports.resetTestPluginRegistry = exports.setTestPluginRegistry = void 0;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var plugin_auto_enable_js_1 = require("../config/plugin-auto-enable.js");
var runtime_js_1 = require("../plugins/runtime.js");
var session_key_js_1 = require("../routing/session-key.js");
var createStubOutboundAdapter = function (channelId) { return ({
    deliveryMode: "direct",
    sendText: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    channel: channelId,
                    messageId: "".concat(channelId, "-msg"),
                })];
        });
    }); },
    sendMedia: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    channel: channelId,
                    messageId: "".concat(channelId, "-msg"),
                })];
        });
    }); },
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
        listAccountIds: function () { return [session_key_js_1.DEFAULT_ACCOUNT_ID]; },
        resolveAccount: function () { return ({}); },
        isConfigured: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, false];
        }); }); },
    },
    status: {
        buildChannelSummary: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (__assign({ configured: false }, (params.summary ? params.summary : {})))];
            });
        }); },
    },
    outbound: createStubOutboundAdapter(params.id),
    messaging: {
        normalizeTarget: function (raw) { return raw; },
    },
    gateway: {
        logoutAccount: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        cleared: false,
                        envToken: false,
                        loggedOut: false,
                    })];
            });
        }); },
    },
}); };
var createStubPluginRegistry = function () { return ({
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: [
        {
            pluginId: "whatsapp",
            source: "test",
            plugin: createStubChannelPlugin({ id: "whatsapp", label: "WhatsApp" }),
        },
        {
            pluginId: "telegram",
            source: "test",
            plugin: createStubChannelPlugin({
                id: "telegram",
                label: "Telegram",
                summary: { tokenSource: "none", lastProbeAt: null },
            }),
        },
        {
            pluginId: "discord",
            source: "test",
            plugin: createStubChannelPlugin({ id: "discord", label: "Discord" }),
        },
        {
            pluginId: "slack",
            source: "test",
            plugin: createStubChannelPlugin({ id: "slack", label: "Slack" }),
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
        {
            pluginId: "imessage",
            source: "test",
            plugin: createStubChannelPlugin({ id: "imessage", label: "iMessage" }),
        },
        {
            pluginId: "msteams",
            source: "test",
            plugin: createStubChannelPlugin({ id: "msteams", label: "Microsoft Teams" }),
        },
        {
            pluginId: "matrix",
            source: "test",
            plugin: createStubChannelPlugin({ id: "matrix", label: "Matrix" }),
        },
        {
            pluginId: "zalo",
            source: "test",
            plugin: createStubChannelPlugin({ id: "zalo", label: "Zalo" }),
        },
        {
            pluginId: "zalouser",
            source: "test",
            plugin: createStubChannelPlugin({ id: "zalouser", label: "Zalo Personal" }),
        },
        {
            pluginId: "bluebubbles",
            source: "test",
            plugin: createStubChannelPlugin({ id: "bluebubbles", label: "BlueBubbles" }),
        },
    ],
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    commands: [],
    diagnostics: [],
}); };
var hoisted = vitest_1.vi.hoisted(function () { return ({
    testTailnetIPv4: { value: undefined },
    piSdkMock: {
        enabled: false,
        discoverCalls: 0,
        models: [],
    },
    cronIsolatedRun: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ status: "ok", summary: "ok" })];
    }); }); }),
    agentCommand: vitest_1.vi.fn().mockResolvedValue(undefined),
    testIsNixMode: { value: false },
    sessionStoreSaveDelayMs: { value: 0 },
    embeddedRunMock: {
        activeIds: new Set(),
        abortCalls: [],
        waitCalls: [],
        waitResults: new Map(),
    },
    getReplyFromConfig: vitest_1.vi.fn().mockResolvedValue(undefined),
    sendWhatsAppMock: vitest_1.vi.fn().mockResolvedValue({ messageId: "msg-1", toJid: "jid-1" }),
}); });
var pluginRegistryState = {
    registry: createStubPluginRegistry(),
};
(0, runtime_js_1.setActivePluginRegistry)(pluginRegistryState.registry);
var setTestPluginRegistry = function (registry) {
    pluginRegistryState.registry = registry;
    (0, runtime_js_1.setActivePluginRegistry)(registry);
};
exports.setTestPluginRegistry = setTestPluginRegistry;
var resetTestPluginRegistry = function () {
    pluginRegistryState.registry = createStubPluginRegistry();
    (0, runtime_js_1.setActivePluginRegistry)(pluginRegistryState.registry);
};
exports.resetTestPluginRegistry = resetTestPluginRegistry;
var testConfigRoot = {
    value: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway-test-".concat(process.pid, "-").concat(node_crypto_1.default.randomUUID())),
};
var setTestConfigRoot = function (root) {
    testConfigRoot.value = root;
    process.env.OPENCLAW_CONFIG_PATH = node_path_1.default.join(root, "openclaw.json");
};
exports.setTestConfigRoot = setTestConfigRoot;
exports.testTailnetIPv4 = hoisted.testTailnetIPv4;
exports.piSdkMock = hoisted.piSdkMock;
exports.cronIsolatedRun = hoisted.cronIsolatedRun;
exports.agentCommand = hoisted.agentCommand;
exports.getReplyFromConfig = hoisted.getReplyFromConfig;
exports.testState = {
    agentConfig: undefined,
    agentsConfig: undefined,
    bindingsConfig: undefined,
    channelsConfig: undefined,
    sessionStorePath: undefined,
    sessionConfig: undefined,
    allowFrom: undefined,
    cronStorePath: undefined,
    cronEnabled: false,
    gatewayBind: undefined,
    gatewayAuth: undefined,
    gatewayControlUi: undefined,
    hooksConfig: undefined,
    canvasHostPort: undefined,
    legacyIssues: [],
    legacyParsed: {},
    migrationConfig: null,
    migrationChanges: [],
};
exports.testIsNixMode = hoisted.testIsNixMode;
exports.sessionStoreSaveDelayMs = hoisted.sessionStoreSaveDelayMs;
exports.embeddedRunMock = hoisted.embeddedRunMock;
vitest_1.vi.mock("../agents/pi-model-discovery.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, MockModelRegistry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../agents/pi-model-discovery.js")];
            case 1:
                actual = _a.sent();
                MockModelRegistry = /** @class */ (function (_super) {
                    __extends(MockModelRegistry, _super);
                    function MockModelRegistry() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MockModelRegistry.prototype.getAll = function () {
                        if (!exports.piSdkMock.enabled) {
                            return _super.prototype.getAll.call(this);
                        }
                        exports.piSdkMock.discoverCalls += 1;
                        // Cast to expected type for testing purposes
                        return exports.piSdkMock.models;
                    };
                    return MockModelRegistry;
                }(actual.ModelRegistry));
                return [2 /*return*/, __assign(__assign({}, actual), { ModelRegistry: MockModelRegistry })];
        }
    });
}); });
vitest_1.vi.mock("../cron/isolated-agent.js", function () { return ({
    runCronIsolatedAgentTurn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return exports.cronIsolatedRun.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../infra/tailnet.js", function () { return ({
    pickPrimaryTailnetIPv4: function () { return exports.testTailnetIPv4.value; },
    pickPrimaryTailnetIPv6: function () { return undefined; },
}); });
vitest_1.vi.mock("../config/sessions.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../config/sessions.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { saveSessionStore: vitest_1.vi.fn(function (storePath, store) { return __awaiter(void 0, void 0, void 0, function () {
                            var delay;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        delay = exports.sessionStoreSaveDelayMs.value;
                                        if (!(delay > 0)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, actual.saveSessionStore(storePath, store)];
                                }
                            });
                        }); }) })];
        }
    });
}); });
vitest_1.vi.mock("../config/config.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, resolveConfigPath, hashConfigRaw, readConfigFileSnapshot, writeConfigFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../config/config.js")];
            case 1:
                actual = _a.sent();
                resolveConfigPath = function () { return node_path_1.default.join(testConfigRoot.value, "openclaw.json"); };
                hashConfigRaw = function (raw) {
                    return node_crypto_1.default
                        .createHash("sha256")
                        .update(raw !== null && raw !== void 0 ? raw : "")
                        .digest("hex");
                };
                readConfigFileSnapshot = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var raw, configPath, _a, raw, parsed, err_1;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (exports.testState.legacyIssues.length > 0) {
                                    raw = JSON.stringify((_b = exports.testState.legacyParsed) !== null && _b !== void 0 ? _b : {});
                                    return [2 /*return*/, {
                                            path: resolveConfigPath(),
                                            exists: true,
                                            raw: raw,
                                            parsed: (_c = exports.testState.legacyParsed) !== null && _c !== void 0 ? _c : {},
                                            valid: false,
                                            config: {},
                                            hash: hashConfigRaw(raw),
                                            issues: exports.testState.legacyIssues.map(function (issue) { return ({
                                                path: issue.path,
                                                message: issue.message,
                                            }); }),
                                            legacyIssues: exports.testState.legacyIssues,
                                        }];
                                }
                                configPath = resolveConfigPath();
                                _d.label = 1;
                            case 1:
                                _d.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, promises_1.default.access(configPath)];
                            case 2:
                                _d.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _d.sent();
                                return [2 /*return*/, {
                                        path: configPath,
                                        exists: false,
                                        raw: null,
                                        parsed: {},
                                        valid: true,
                                        config: {},
                                        hash: hashConfigRaw(null),
                                        issues: [],
                                        legacyIssues: [],
                                    }];
                            case 4:
                                _d.trys.push([4, 6, , 7]);
                                return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                            case 5:
                                raw = _d.sent();
                                parsed = JSON.parse(raw);
                                return [2 /*return*/, {
                                        path: configPath,
                                        exists: true,
                                        raw: raw,
                                        parsed: parsed,
                                        valid: true,
                                        config: parsed,
                                        hash: hashConfigRaw(raw),
                                        issues: [],
                                        legacyIssues: [],
                                    }];
                            case 6:
                                err_1 = _d.sent();
                                return [2 /*return*/, {
                                        path: configPath,
                                        exists: true,
                                        raw: null,
                                        parsed: {},
                                        valid: false,
                                        config: {},
                                        hash: hashConfigRaw(null),
                                        issues: [{ path: "", message: "read failed: ".concat(String(err_1)) }],
                                        legacyIssues: [],
                                    }];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); };
                writeConfigFile = vitest_1.vi.fn(function (cfg) { return __awaiter(void 0, void 0, void 0, function () {
                    var configPath, raw;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                configPath = resolveConfigPath();
                                return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                            case 1:
                                _a.sent();
                                raw = JSON.stringify(cfg, null, 2).trimEnd().concat("\n");
                                return [4 /*yield*/, promises_1.default.writeFile(configPath, raw, "utf-8")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, __assign(__assign({}, actual), { get CONFIG_PATH() {
                            return resolveConfigPath();
                        },
                        get STATE_DIR() {
                            return node_path_1.default.dirname(resolveConfigPath());
                        },
                        get isNixMode() {
                            return exports.testIsNixMode.value;
                        }, migrateLegacyConfig: function (raw) {
                            var _a;
                            return ({
                                config: (_a = exports.testState.migrationConfig) !== null && _a !== void 0 ? _a : raw,
                                changes: exports.testState.migrationChanges,
                            });
                        }, loadConfig: function () {
                            var _a, _b, _c;
                            var configPath = resolveConfigPath();
                            var fileConfig = {};
                            try {
                                if (node_fs_1.default.existsSync(configPath)) {
                                    var raw = node_fs_1.default.readFileSync(configPath, "utf-8");
                                    fileConfig = JSON.parse(raw);
                                }
                            }
                            catch (_d) {
                                fileConfig = {};
                            }
                            var fileAgents = fileConfig.agents &&
                                typeof fileConfig.agents === "object" &&
                                !Array.isArray(fileConfig.agents)
                                ? fileConfig.agents
                                : {};
                            var fileDefaults = fileAgents.defaults &&
                                typeof fileAgents.defaults === "object" &&
                                !Array.isArray(fileAgents.defaults)
                                ? fileAgents.defaults
                                : {};
                            var defaults = __assign(__assign({ model: { primary: "anthropic/claude-opus-4-5" }, workspace: node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway-test") }, fileDefaults), exports.testState.agentConfig);
                            var agents = exports.testState.agentsConfig
                                ? __assign(__assign(__assign({}, fileAgents), exports.testState.agentsConfig), { defaults: defaults }) : __assign(__assign({}, fileAgents), { defaults: defaults });
                            var fileBindings = Array.isArray(fileConfig.bindings)
                                ? fileConfig.bindings
                                : undefined;
                            var fileChannels = fileConfig.channels &&
                                typeof fileConfig.channels === "object" &&
                                !Array.isArray(fileConfig.channels)
                                ? __assign({}, fileConfig.channels)
                                : {};
                            var overrideChannels = exports.testState.channelsConfig && typeof exports.testState.channelsConfig === "object"
                                ? __assign({}, exports.testState.channelsConfig) : {};
                            var mergedChannels = __assign(__assign({}, fileChannels), overrideChannels);
                            if (exports.testState.allowFrom !== undefined) {
                                var existing = mergedChannels.whatsapp &&
                                    typeof mergedChannels.whatsapp === "object" &&
                                    !Array.isArray(mergedChannels.whatsapp)
                                    ? mergedChannels.whatsapp
                                    : {};
                                mergedChannels.whatsapp = __assign(__assign({}, existing), { allowFrom: exports.testState.allowFrom });
                            }
                            var channels = Object.keys(mergedChannels).length > 0 ? mergedChannels : undefined;
                            var fileSession = fileConfig.session &&
                                typeof fileConfig.session === "object" &&
                                !Array.isArray(fileConfig.session)
                                ? fileConfig.session
                                : {};
                            var session = __assign(__assign({}, fileSession), { mainKey: (_a = fileSession.mainKey) !== null && _a !== void 0 ? _a : "main" });
                            if (typeof exports.testState.sessionStorePath === "string") {
                                session.store = exports.testState.sessionStorePath;
                            }
                            if (exports.testState.sessionConfig) {
                                Object.assign(session, exports.testState.sessionConfig);
                            }
                            var fileGateway = fileConfig.gateway &&
                                typeof fileConfig.gateway === "object" &&
                                !Array.isArray(fileConfig.gateway)
                                ? __assign({}, fileConfig.gateway)
                                : {};
                            if (exports.testState.gatewayBind) {
                                fileGateway.bind = exports.testState.gatewayBind;
                            }
                            if (exports.testState.gatewayAuth) {
                                fileGateway.auth = exports.testState.gatewayAuth;
                            }
                            if (exports.testState.gatewayControlUi) {
                                fileGateway.controlUi = exports.testState.gatewayControlUi;
                            }
                            var gateway = Object.keys(fileGateway).length > 0 ? fileGateway : undefined;
                            var fileCanvasHost = fileConfig.canvasHost &&
                                typeof fileConfig.canvasHost === "object" &&
                                !Array.isArray(fileConfig.canvasHost)
                                ? __assign({}, fileConfig.canvasHost)
                                : {};
                            if (typeof exports.testState.canvasHostPort === "number") {
                                fileCanvasHost.port = exports.testState.canvasHostPort;
                            }
                            var canvasHost = Object.keys(fileCanvasHost).length > 0 ? fileCanvasHost : undefined;
                            var hooks = (_b = exports.testState.hooksConfig) !== null && _b !== void 0 ? _b : fileConfig.hooks;
                            var fileCron = fileConfig.cron && typeof fileConfig.cron === "object" && !Array.isArray(fileConfig.cron)
                                ? __assign({}, fileConfig.cron)
                                : {};
                            if (typeof exports.testState.cronEnabled === "boolean") {
                                fileCron.enabled = exports.testState.cronEnabled;
                            }
                            if (typeof exports.testState.cronStorePath === "string") {
                                fileCron.store = exports.testState.cronStorePath;
                            }
                            var cron = Object.keys(fileCron).length > 0 ? fileCron : undefined;
                            var config = __assign(__assign({}, fileConfig), { agents: agents, bindings: (_c = exports.testState.bindingsConfig) !== null && _c !== void 0 ? _c : fileBindings, channels: channels, session: session, gateway: gateway, canvasHost: canvasHost, hooks: hooks, cron: cron });
                            return (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({ config: config, env: process.env }).config;
                        }, parseConfigJson5: function (raw) {
                            try {
                                return { ok: true, parsed: JSON.parse(raw) };
                            }
                            catch (err) {
                                return { ok: false, error: String(err) };
                            }
                        }, validateConfigObject: function (parsed) { return ({
                            ok: true,
                            config: parsed,
                            issues: [],
                        }); }, readConfigFileSnapshot: readConfigFileSnapshot, writeConfigFile: writeConfigFile })];
        }
    });
}); });
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../agents/pi-embedded.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { isEmbeddedPiRunActive: function (sessionId) { return exports.embeddedRunMock.activeIds.has(sessionId); }, abortEmbeddedPiRun: function (sessionId) {
                            exports.embeddedRunMock.abortCalls.push(sessionId);
                            return exports.embeddedRunMock.activeIds.has(sessionId);
                        }, waitForEmbeddedPiRunEnd: function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                exports.embeddedRunMock.waitCalls.push(sessionId);
                                return [2 /*return*/, (_a = exports.embeddedRunMock.waitResults.get(sessionId)) !== null && _a !== void 0 ? _a : true];
                            });
                        }); } })];
        }
    });
}); });
vitest_1.vi.mock("../commands/health.js", function () { return ({
    getHealthSnapshot: vitest_1.vi.fn().mockResolvedValue({ ok: true, stub: true }),
}); });
vitest_1.vi.mock("../commands/status.js", function () { return ({
    getStatusSummary: vitest_1.vi.fn().mockResolvedValue({ ok: true }),
}); });
vitest_1.vi.mock("../web/outbound.js", function () { return ({
    sendMessageWhatsApp: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return hoisted.sendWhatsAppMock.apply(hoisted, args);
    },
    sendPollWhatsApp: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return hoisted.sendWhatsAppMock.apply(hoisted, args);
    },
}); });
vitest_1.vi.mock("../channels/web/index.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../channels/web/index.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { sendMessageWhatsApp: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return hoisted.sendWhatsAppMock.apply(hoisted, args);
                        } })];
        }
    });
}); });
vitest_1.vi.mock("../commands/agent.js", function () { return ({
    agentCommand: exports.agentCommand,
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () { return ({
    getReplyFromConfig: exports.getReplyFromConfig,
}); });
vitest_1.vi.mock("../cli/deps.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, base;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../cli/deps.js")];
            case 1:
                actual = _a.sent();
                base = actual.createDefaultDeps();
                return [2 /*return*/, __assign(__assign({}, actual), { createDefaultDeps: function () { return (__assign(__assign({}, base), { sendMessageWhatsApp: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return hoisted.sendWhatsAppMock.apply(hoisted, args);
                            } })); } })];
        }
    });
}); });
process.env.OPENCLAW_SKIP_CHANNELS = "1";
process.env.OPENCLAW_SKIP_CRON = "1";
process.env.OPENCLAW_SKIP_CHANNELS = "1";
process.env.OPENCLAW_SKIP_CRON = "1";
