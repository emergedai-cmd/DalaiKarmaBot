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
exports.writeSessionStore = writeSessionStore;
exports.installGatewayTestHooks = installGatewayTestHooks;
exports.getFreePort = getFreePort;
exports.occupyPort = occupyPort;
exports.onceMessage = onceMessage;
exports.startGatewayServer = startGatewayServer;
exports.startServerWithClient = startServerWithClient;
exports.connectReq = connectReq;
exports.connectOk = connectOk;
exports.rpcReq = rpcReq;
exports.waitForSystemEvent = waitForSystemEvent;
var promises_1 = require("node:fs/promises");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var sessions_js_1 = require("../config/sessions.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var device_identity_js_1 = require("../infra/device-identity.js");
var system_events_js_1 = require("../infra/system-events.js");
var ws_js_1 = require("../infra/ws.js");
var logging_js_1 = require("../logging.js");
var session_key_js_1 = require("../routing/session-key.js");
var ports_js_1 = require("../test-utils/ports.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var device_auth_js_1 = require("./device-auth.js");
var index_js_1 = require("./protocol/index.js");
var test_helpers_mocks_js_1 = require("./test-helpers.mocks.js");
// Preload the gateway server module once per worker.
// Important: `test-helpers.mocks` must run before importing the server so vi.mock hooks apply.
var serverModulePromise = Promise.resolve().then(function () { return require("./server.js"); });
var previousHome;
var previousUserProfile;
var previousStateDir;
var previousConfigPath;
var previousSkipBrowserControl;
var previousSkipGmailWatcher;
var previousSkipCanvasHost;
var tempHome;
var tempConfigRoot;
function writeSessionStore(params) {
    return __awaiter(this, void 0, void 0, function () {
        var storePath, agentId, store, _i, _a, _b, requestKey, entry, rawKey, storeKey;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    storePath = (_c = params.storePath) !== null && _c !== void 0 ? _c : test_helpers_mocks_js_1.testState.sessionStorePath;
                    if (!storePath) {
                        throw new Error("writeSessionStore requires testState.sessionStorePath");
                    }
                    agentId = (_d = params.agentId) !== null && _d !== void 0 ? _d : session_key_js_1.DEFAULT_AGENT_ID;
                    store = {};
                    for (_i = 0, _a = Object.entries(params.entries); _i < _a.length; _i++) {
                        _b = _a[_i], requestKey = _b[0], entry = _b[1];
                        rawKey = requestKey.trim();
                        storeKey = rawKey === "global" || rawKey === "unknown"
                            ? rawKey
                            : (0, session_key_js_1.toAgentStoreSessionKey)({
                                agentId: agentId,
                                requestKey: requestKey,
                                mainKey: params.mainKey,
                            });
                        store[storeKey] = entry;
                    }
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(storePath), { recursive: true })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8")];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setupGatewayTestHome() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousHome = process.env.HOME;
                    previousUserProfile = process.env.USERPROFILE;
                    previousStateDir = process.env.OPENCLAW_STATE_DIR;
                    previousConfigPath = process.env.OPENCLAW_CONFIG_PATH;
                    previousSkipBrowserControl = process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER;
                    previousSkipGmailWatcher = process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
                    previousSkipCanvasHost = process.env.OPENCLAW_SKIP_CANVAS_HOST;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway-home-"))];
                case 1:
                    tempHome = _a.sent();
                    process.env.HOME = tempHome;
                    process.env.USERPROFILE = tempHome;
                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(tempHome, ".openclaw");
                    delete process.env.OPENCLAW_CONFIG_PATH;
                    return [2 /*return*/];
            }
        });
    });
}
function applyGatewaySkipEnv() {
    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = "1";
    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
}
function resetGatewayTestState(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, mod;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Some tests intentionally use fake timers; ensure they don't leak into gateway suites.
                    vitest_1.vi.useRealTimers();
                    (0, logging_js_1.setLoggerOverride)({ level: "silent", consoleLevel: "silent" });
                    if (!tempHome) {
                        throw new Error("resetGatewayTestState called before temp home was initialized");
                    }
                    applyGatewaySkipEnv();
                    if (!options.uniqueConfigRoot) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(tempHome, "openclaw-test-"))];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = node_path_1.default.join(tempHome, ".openclaw-test");
                    _b.label = 3;
                case 3:
                    tempConfigRoot = _a;
                    (0, test_helpers_mocks_js_1.setTestConfigRoot)(tempConfigRoot);
                    test_helpers_mocks_js_1.sessionStoreSaveDelayMs.value = 0;
                    test_helpers_mocks_js_1.testTailnetIPv4.value = undefined;
                    test_helpers_mocks_js_1.testState.gatewayBind = undefined;
                    test_helpers_mocks_js_1.testState.gatewayAuth = { mode: "token", token: "test-gateway-token-1234567890" };
                    test_helpers_mocks_js_1.testState.gatewayControlUi = undefined;
                    test_helpers_mocks_js_1.testState.hooksConfig = undefined;
                    test_helpers_mocks_js_1.testState.canvasHostPort = undefined;
                    test_helpers_mocks_js_1.testState.legacyIssues = [];
                    test_helpers_mocks_js_1.testState.legacyParsed = {};
                    test_helpers_mocks_js_1.testState.migrationConfig = null;
                    test_helpers_mocks_js_1.testState.migrationChanges = [];
                    test_helpers_mocks_js_1.testState.cronEnabled = false;
                    test_helpers_mocks_js_1.testState.cronStorePath = undefined;
                    test_helpers_mocks_js_1.testState.sessionConfig = undefined;
                    test_helpers_mocks_js_1.testState.sessionStorePath = undefined;
                    test_helpers_mocks_js_1.testState.agentConfig = undefined;
                    test_helpers_mocks_js_1.testState.agentsConfig = undefined;
                    test_helpers_mocks_js_1.testState.bindingsConfig = undefined;
                    test_helpers_mocks_js_1.testState.channelsConfig = undefined;
                    test_helpers_mocks_js_1.testState.allowFrom = undefined;
                    test_helpers_mocks_js_1.testIsNixMode.value = false;
                    test_helpers_mocks_js_1.cronIsolatedRun.mockClear();
                    test_helpers_mocks_js_1.agentCommand.mockClear();
                    test_helpers_mocks_js_1.embeddedRunMock.activeIds.clear();
                    test_helpers_mocks_js_1.embeddedRunMock.abortCalls = [];
                    test_helpers_mocks_js_1.embeddedRunMock.waitCalls = [];
                    test_helpers_mocks_js_1.embeddedRunMock.waitResults.clear();
                    (0, system_events_js_1.drainSystemEvents)((0, sessions_js_1.resolveMainSessionKeyFromConfig)());
                    (0, agent_events_js_1.resetAgentRunContextForTest)();
                    return [4 /*yield*/, serverModulePromise];
                case 4:
                    mod = _b.sent();
                    mod.__resetModelCatalogCacheForTest();
                    test_helpers_mocks_js_1.piSdkMock.enabled = false;
                    test_helpers_mocks_js_1.piSdkMock.discoverCalls = 0;
                    test_helpers_mocks_js_1.piSdkMock.models = [];
                    return [2 /*return*/];
            }
        });
    });
}
function cleanupGatewayTestHome(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useRealTimers();
                    (0, logging_js_1.resetLogger)();
                    if (options.restoreEnv) {
                        if (previousHome === undefined) {
                            delete process.env.HOME;
                        }
                        else {
                            process.env.HOME = previousHome;
                        }
                        if (previousUserProfile === undefined) {
                            delete process.env.USERPROFILE;
                        }
                        else {
                            process.env.USERPROFILE = previousUserProfile;
                        }
                        if (previousStateDir === undefined) {
                            delete process.env.OPENCLAW_STATE_DIR;
                        }
                        else {
                            process.env.OPENCLAW_STATE_DIR = previousStateDir;
                        }
                        if (previousConfigPath === undefined) {
                            delete process.env.OPENCLAW_CONFIG_PATH;
                        }
                        else {
                            process.env.OPENCLAW_CONFIG_PATH = previousConfigPath;
                        }
                        if (previousSkipBrowserControl === undefined) {
                            delete process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER;
                        }
                        else {
                            process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = previousSkipBrowserControl;
                        }
                        if (previousSkipGmailWatcher === undefined) {
                            delete process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
                        }
                        else {
                            process.env.OPENCLAW_SKIP_GMAIL_WATCHER = previousSkipGmailWatcher;
                        }
                        if (previousSkipCanvasHost === undefined) {
                            delete process.env.OPENCLAW_SKIP_CANVAS_HOST;
                        }
                        else {
                            process.env.OPENCLAW_SKIP_CANVAS_HOST = previousSkipCanvasHost;
                        }
                    }
                    if (!(options.restoreEnv && tempHome)) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempHome, {
                            recursive: true,
                            force: true,
                            maxRetries: 20,
                            retryDelay: 25,
                        })];
                case 1:
                    _a.sent();
                    tempHome = undefined;
                    _a.label = 2;
                case 2:
                    tempConfigRoot = undefined;
                    return [2 /*return*/];
            }
        });
    });
}
function installGatewayTestHooks(options) {
    var _this = this;
    var _a;
    var scope = (_a = options === null || options === void 0 ? void 0 : options.scope) !== null && _a !== void 0 ? _a : "test";
    if (scope === "suite") {
        (0, vitest_1.beforeAll)(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setupGatewayTestHome()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, resetGatewayTestState({ uniqueConfigRoot: true })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.beforeEach)(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resetGatewayTestState({ uniqueConfigRoot: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 60000);
        (0, vitest_1.afterEach)(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cleanupGatewayTestHome({ restoreEnv: false })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.afterAll)(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cleanupGatewayTestHome({ restoreEnv: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return;
    }
    (0, vitest_1.beforeEach)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupGatewayTestHome()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resetGatewayTestState({ uniqueConfigRoot: false })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 60000);
    (0, vitest_1.afterEach)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cleanupGatewayTestHome({ restoreEnv: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ports_js_1.getDeterministicFreePortBlock)({ offsets: [0, 1, 2, 3, 4] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function occupyPort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var server = (0, node_net_1.createServer)();
                        server.once("error", reject);
                        server.listen(0, "127.0.0.1", function () {
                            var port = server.address().port;
                            resolve({ server: server, port: port });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function onceMessage(ws, filter, 
// Full-suite runs can saturate the event loop (581+ files). Keep this high
// enough to avoid flaky RPC timeouts, but still fail fast when a response
// never arrives.
timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 10000; }
    return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () { return reject(new Error("timeout")); }, timeoutMs);
        var closeHandler = function (code, reason) {
            clearTimeout(timer);
            ws.off("message", handler);
            reject(new Error("closed ".concat(code, ": ").concat(reason.toString())));
        };
        var handler = function (data) {
            var obj = JSON.parse((0, ws_js_1.rawDataToString)(data));
            if (filter(obj)) {
                clearTimeout(timer);
                ws.off("message", handler);
                ws.off("close", closeHandler);
                resolve(obj);
            }
        };
        ws.on("message", handler);
        ws.once("close", closeHandler);
    });
}
function startGatewayServer(port, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverModulePromise];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.startGatewayServer(port, opts)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function startServerWithClient(token, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var port, prev, fallbackToken, server, attempt, err_1, code, ws;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _c.sent();
                    prev = process.env.OPENCLAW_GATEWAY_TOKEN;
                    if (typeof token === "string") {
                        test_helpers_mocks_js_1.testState.gatewayAuth = { mode: "token", token: token };
                    }
                    fallbackToken = token !== null && token !== void 0 ? token : (typeof ((_a = test_helpers_mocks_js_1.testState.gatewayAuth) === null || _a === void 0 ? void 0 : _a.token) === "string"
                        ? test_helpers_mocks_js_1.testState.gatewayAuth.token
                        : undefined);
                    if (fallbackToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = fallbackToken;
                    }
                    server = null;
                    attempt = 0;
                    _c.label = 2;
                case 2:
                    if (!(attempt < 10)) return [3 /*break*/, 8];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 7]);
                    return [4 /*yield*/, startGatewayServer(port, opts)];
                case 4:
                    server = _c.sent();
                    return [3 /*break*/, 8];
                case 5:
                    err_1 = _c.sent();
                    code = (_b = err_1.cause) === null || _b === void 0 ? void 0 : _b.code;
                    if (code !== "EADDRINUSE") {
                        throw err_1;
                    }
                    return [4 /*yield*/, getFreePort()];
                case 6:
                    port = _c.sent();
                    return [3 /*break*/, 7];
                case 7:
                    attempt++;
                    return [3 /*break*/, 2];
                case 8:
                    if (!server) {
                        throw new Error("failed to start gateway server after retries");
                    }
                    ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
                case 9:
                    _c.sent();
                    return [2 /*return*/, { server: server, ws: ws, port: port, prevToken: prev }];
            }
        });
    });
}
function connectReq(ws, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var randomUUID, id, client, role, defaultToken, defaultPassword, token, password, requestedScopes, device, isResponseForId;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("node:crypto"); })];
                case 1:
                    randomUUID = (_p.sent()).randomUUID;
                    id = randomUUID();
                    client = (_a = opts === null || opts === void 0 ? void 0 : opts.client) !== null && _a !== void 0 ? _a : {
                        id: message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                        version: "1.0.0",
                        platform: "test",
                        mode: message_channel_js_1.GATEWAY_CLIENT_MODES.TEST,
                    };
                    role = (_b = opts === null || opts === void 0 ? void 0 : opts.role) !== null && _b !== void 0 ? _b : "operator";
                    defaultToken = (opts === null || opts === void 0 ? void 0 : opts.skipDefaultAuth) === true
                        ? undefined
                        : typeof ((_c = test_helpers_mocks_js_1.testState.gatewayAuth) === null || _c === void 0 ? void 0 : _c.token) === "string"
                            ? ((_d = test_helpers_mocks_js_1.testState.gatewayAuth.token) !== null && _d !== void 0 ? _d : undefined)
                            : process.env.OPENCLAW_GATEWAY_TOKEN;
                    defaultPassword = (opts === null || opts === void 0 ? void 0 : opts.skipDefaultAuth) === true
                        ? undefined
                        : typeof ((_e = test_helpers_mocks_js_1.testState.gatewayAuth) === null || _e === void 0 ? void 0 : _e.password) === "string"
                            ? ((_f = test_helpers_mocks_js_1.testState.gatewayAuth.password) !== null && _f !== void 0 ? _f : undefined)
                            : process.env.OPENCLAW_GATEWAY_PASSWORD;
                    token = (_g = opts === null || opts === void 0 ? void 0 : opts.token) !== null && _g !== void 0 ? _g : defaultToken;
                    password = (_h = opts === null || opts === void 0 ? void 0 : opts.password) !== null && _h !== void 0 ? _h : defaultPassword;
                    requestedScopes = Array.isArray(opts === null || opts === void 0 ? void 0 : opts.scopes) ? opts === null || opts === void 0 ? void 0 : opts.scopes : [];
                    device = (function () {
                        var _a;
                        if ((opts === null || opts === void 0 ? void 0 : opts.device) === null) {
                            return undefined;
                        }
                        if (opts === null || opts === void 0 ? void 0 : opts.device) {
                            return opts.device;
                        }
                        var identity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)();
                        var signedAtMs = Date.now();
                        var payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                            deviceId: identity.deviceId,
                            clientId: client.id,
                            clientMode: client.mode,
                            role: role,
                            scopes: requestedScopes,
                            signedAtMs: signedAtMs,
                            token: token !== null && token !== void 0 ? token : null,
                        });
                        return {
                            id: identity.deviceId,
                            publicKey: (0, device_identity_js_1.publicKeyRawBase64UrlFromPem)(identity.publicKeyPem),
                            signature: (0, device_identity_js_1.signDevicePayload)(identity.privateKeyPem, payload),
                            signedAt: signedAtMs,
                            nonce: (_a = opts === null || opts === void 0 ? void 0 : opts.device) === null || _a === void 0 ? void 0 : _a.nonce,
                        };
                    })();
                    ws.send(JSON.stringify({
                        type: "req",
                        id: id,
                        method: "connect",
                        params: {
                            minProtocol: (_j = opts === null || opts === void 0 ? void 0 : opts.minProtocol) !== null && _j !== void 0 ? _j : index_js_1.PROTOCOL_VERSION,
                            maxProtocol: (_k = opts === null || opts === void 0 ? void 0 : opts.maxProtocol) !== null && _k !== void 0 ? _k : index_js_1.PROTOCOL_VERSION,
                            client: client,
                            caps: (_l = opts === null || opts === void 0 ? void 0 : opts.caps) !== null && _l !== void 0 ? _l : [],
                            commands: (_m = opts === null || opts === void 0 ? void 0 : opts.commands) !== null && _m !== void 0 ? _m : [],
                            permissions: (_o = opts === null || opts === void 0 ? void 0 : opts.permissions) !== null && _o !== void 0 ? _o : undefined,
                            role: role,
                            scopes: opts === null || opts === void 0 ? void 0 : opts.scopes,
                            auth: token || password
                                ? {
                                    token: token,
                                    password: password,
                                }
                                : undefined,
                            device: device,
                        },
                    }));
                    isResponseForId = function (o) {
                        if (!o || typeof o !== "object" || Array.isArray(o)) {
                            return false;
                        }
                        var rec = o;
                        return rec.type === "res" && rec.id === id;
                    };
                    return [4 /*yield*/, onceMessage(ws, isResponseForId)];
                case 2: return [2 /*return*/, _p.sent()];
            }
        });
    });
}
function connectOk(ws, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, connectReq(ws, opts)];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_a = res.payload) === null || _a === void 0 ? void 0 : _a.type).toBe("hello-ok");
                    return [2 /*return*/, res.payload];
            }
        });
    });
}
function rpcReq(ws, method, params, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var randomUUID, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("node:crypto"); })];
                case 1:
                    randomUUID = (_a.sent()).randomUUID;
                    id = randomUUID();
                    ws.send(JSON.stringify({ type: "req", id: id, method: method, params: params }));
                    return [4 /*yield*/, onceMessage(ws, function (o) {
                            if (!o || typeof o !== "object" || Array.isArray(o)) {
                                return false;
                            }
                            var rec = o;
                            return rec.type === "res" && rec.id === id;
                        }, timeoutMs)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function waitForSystemEvent() {
    return __awaiter(this, arguments, void 0, function (timeoutMs) {
        var sessionKey, deadline, events;
        if (timeoutMs === void 0) { timeoutMs = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionKey = (0, sessions_js_1.resolveMainSessionKeyFromConfig)();
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 3];
                    events = (0, system_events_js_1.peekSystemEvents)(sessionKey);
                    if (events.length > 0) {
                        return [2 /*return*/, events];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: throw new Error("timeout waiting for system event");
            }
        });
    });
}
