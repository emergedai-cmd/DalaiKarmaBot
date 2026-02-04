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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var test_helpers_mocks_js_1 = require("./test-helpers.mocks.js");
var test_helpers_server_js_1 = require("./test-helpers.server.js");
(0, test_helpers_server_js_1.installGatewayTestHooks)({ scope: "suite" });
(0, vitest_1.beforeEach)(function () {
    // Ensure these tests are not affected by host env vars.
    delete process.env.OPENCLAW_GATEWAY_TOKEN;
    delete process.env.OPENCLAW_GATEWAY_PASSWORD;
});
var resolveGatewayToken = function () {
    var _a;
    var token = (_a = test_helpers_mocks_js_1.testState.gatewayAuth) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        throw new Error("test gateway token missing");
    }
    return token;
};
(0, vitest_1.describe)("POST /tools/invoke", function () {
    (0, vitest_1.it)("invokes a tool and returns {ok:true,result}", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, token, res, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Allow the agents_list tool for main agent.
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                        })];
                case 2:
                    server = _a.sent();
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    return [4 /*yield*/, res.json()];
                case 4:
                    body = _a.sent();
                    (0, vitest_1.expect)(body.ok).toBe(true);
                    (0, vitest_1.expect)(body).toHaveProperty("result");
                    return [4 /*yield*/, server.close()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports tools.alsoAllow as additive allowlist (profile stage)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var writeConfigFile, port, server, token, res, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // No explicit tool allowlist; rely on profile + alsoAllow.
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [{ id: "main" }],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    writeConfigFile = (_a.sent()).writeConfigFile;
                    return [4 /*yield*/, writeConfigFile({
                            tools: { profile: "minimal", alsoAllow: ["agents_list"] },
                            // oxlint-disable-next-line typescript/no-explicit-any
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 3:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 4:
                    server = _a.sent();
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 5:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    return [4 /*yield*/, res.json()];
                case 6:
                    body = _a.sent();
                    (0, vitest_1.expect)(body.ok).toBe(true);
                    return [4 /*yield*/, server.close()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports tools.alsoAllow without allow/profile (implicit allow-all)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var CONFIG_PATH, port, server, token, res, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [{ id: "main" }],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                    return [4 /*yield*/, node_fs_1.promises.mkdir(node_path_1.default.dirname(CONFIG_PATH), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, node_fs_1.promises.writeFile(CONFIG_PATH, JSON.stringify({ tools: { alsoAllow: ["agents_list"] } }, null, 2), "utf-8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 4:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 5:
                    server = _a.sent();
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 6:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    return [4 /*yield*/, res.json()];
                case 7:
                    body = _a.sent();
                    (0, vitest_1.expect)(body.ok).toBe(true);
                    return [4 /*yield*/, server.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts password auth when bearer token matches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "password", password: "secret" },
                        })];
                case 2:
                    server = _a.sent();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                                authorization: "Bearer secret",
                            },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    return [4 /*yield*/, server.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes tools invoke before plugin HTTP handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pluginHandler, registry, port, server, token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pluginHandler = vitest_1.vi.fn(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            res.statusCode = 418;
                            res.end("plugin");
                            return [2 /*return*/, true];
                        });
                    }); });
                    registry = (0, channel_plugins_js_1.createTestRegistry)();
                    registry.httpHandlers = [
                        {
                            pluginId: "test-plugin",
                            source: "test",
                            handler: pluginHandler,
                        },
                    ];
                    (0, test_helpers_mocks_js_1.setTestPluginRegistry)(registry);
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 2:
                    server = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 7]);
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({
                                tool: "agents_list",
                                action: "json",
                                args: {},
                                sessionKey: "main",
                            }),
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(pluginHandler).not.toHaveBeenCalled();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, server.close()];
                case 6:
                    _a.sent();
                    (0, test_helpers_mocks_js_1.resetTestPluginRegistry)();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unauthorized when auth mode is token and header is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: "t" },
                        })];
                case 2:
                    server = _a.sent();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(401);
                    return [4 /*yield*/, server.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns 404 when tool is not allowlisted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    deny: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 2:
                    server = _a.sent();
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [4 /*yield*/, server.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects tools.profile allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var writeConfigFile, port, server, token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 1:
                    writeConfigFile = (_a.sent()).writeConfigFile;
                    return [4 /*yield*/, writeConfigFile({
                            tools: { profile: "minimal" },
                            // oxlint-disable-next-line typescript/no-explicit-any
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 3:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 4:
                    server = _a.sent();
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify({ tool: "agents_list", action: "json", args: {}, sessionKey: "main" }),
                        })];
                case 5:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(404);
                    return [4 /*yield*/, server.close()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses the configured main session key when sessionKey is missing or main", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, payload, token, resDefault, resMain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_helpers_mocks_js_1.testState.agentsConfig = {
                        list: [
                            {
                                id: "main",
                                tools: {
                                    deny: ["agents_list"],
                                },
                            },
                            {
                                id: "ops",
                                default: true,
                                tools: {
                                    allow: ["agents_list"],
                                },
                            },
                        ],
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    test_helpers_mocks_js_1.testState.sessionConfig = { mainKey: "primary" };
                    return [4 /*yield*/, (0, test_helpers_server_js_1.getFreePort)()];
                case 1:
                    port = _a.sent();
                    return [4 /*yield*/, (0, test_helpers_server_js_1.startGatewayServer)(port, { bind: "loopback" })];
                case 2:
                    server = _a.sent();
                    payload = { tool: "agents_list", action: "json", args: {} };
                    token = resolveGatewayToken();
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify(payload),
                        })];
                case 3:
                    resDefault = _a.sent();
                    (0, vitest_1.expect)(resDefault.status).toBe(200);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/tools/invoke"), {
                            method: "POST",
                            headers: { "content-type": "application/json", authorization: "Bearer ".concat(token) },
                            body: JSON.stringify(__assign(__assign({}, payload), { sessionKey: "main" })),
                        })];
                case 4:
                    resMain = _a.sent();
                    (0, vitest_1.expect)(resMain.status).toBe(200);
                    return [4 /*yield*/, server.close()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
