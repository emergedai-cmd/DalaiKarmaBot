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
var loadConfig = vitest_1.vi.fn();
var resolveGatewayPort = vitest_1.vi.fn();
var pickPrimaryTailnetIPv4 = vitest_1.vi.fn();
var lastClientOptions = null;
var startMode = "hello";
var closeCode = 1006;
var closeReason = "";
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: loadConfig, resolveGatewayPort: resolveGatewayPort })];
        }
    });
}); });
vitest_1.vi.mock("../infra/tailnet.js", function () { return ({
    pickPrimaryTailnetIPv4: pickPrimaryTailnetIPv4,
}); });
vitest_1.vi.mock("./client.js", function () { return ({
    describeGatewayCloseCode: function (code) {
        if (code === 1000) {
            return "normal closure";
        }
        if (code === 1006) {
            return "abnormal closure (no close frame)";
        }
        return undefined;
    },
    GatewayClient: /** @class */ (function () {
        function class_1(opts) {
            lastClientOptions = opts;
        }
        class_1.prototype.request = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        class_1.prototype.start = function () {
            var _a, _b;
            if (startMode === "hello") {
                void ((_a = lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.onHelloOk) === null || _a === void 0 ? void 0 : _a.call(lastClientOptions));
            }
            else if (startMode === "close") {
                (_b = lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.onClose) === null || _b === void 0 ? void 0 : _b.call(lastClientOptions, closeCode, closeReason);
            }
        };
        class_1.prototype.stop = function () { };
        return class_1;
    }()),
}); });
var _a = await Promise.resolve().then(function () { return require("./call.js"); }), buildGatewayConnectionDetails = _a.buildGatewayConnectionDetails, callGateway = _a.callGateway;
(0, vitest_1.describe)("callGateway url resolution", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReset();
        resolveGatewayPort.mockReset();
        pickPrimaryTailnetIPv4.mockReset();
        lastClientOptions = null;
        startMode = "hello";
        closeCode = 1006;
        closeReason = "";
    });
    (0, vitest_1.it)("keeps loopback when local bind is auto even if tailnet is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({ gateway: { mode: "local", bind: "auto" } });
                    resolveGatewayPort.mockReturnValue(18800);
                    pickPrimaryTailnetIPv4.mockReturnValue("100.64.0.1");
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.url).toBe("ws://127.0.0.1:18800");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to loopback when local bind is auto without tailnet IP", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({ gateway: { mode: "local", bind: "auto" } });
                    resolveGatewayPort.mockReturnValue(18800);
                    pickPrimaryTailnetIPv4.mockReturnValue(undefined);
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.url).toBe("ws://127.0.0.1:18800");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses tailnet IP when local bind is tailnet and tailnet is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({ gateway: { mode: "local", bind: "tailnet" } });
                    resolveGatewayPort.mockReturnValue(18800);
                    pickPrimaryTailnetIPv4.mockReturnValue("100.64.0.1");
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.url).toBe("ws://100.64.0.1:18800");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses url override in remote mode even when remote url is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        gateway: { mode: "remote", bind: "loopback", remote: {} },
                    });
                    resolveGatewayPort.mockReturnValue(18789);
                    pickPrimaryTailnetIPv4.mockReturnValue(undefined);
                    return [4 /*yield*/, callGateway({ method: "health", url: "wss://override.example/ws" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.url).toBe("wss://override.example/ws");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("buildGatewayConnectionDetails", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReset();
        resolveGatewayPort.mockReset();
        pickPrimaryTailnetIPv4.mockReset();
    });
    (0, vitest_1.it)("uses explicit url overrides and omits bind details", function () {
        loadConfig.mockReturnValue({
            gateway: { mode: "local", bind: "loopback" },
        });
        resolveGatewayPort.mockReturnValue(18800);
        pickPrimaryTailnetIPv4.mockReturnValue("100.64.0.1");
        var details = buildGatewayConnectionDetails({
            url: "wss://example.com/ws",
        });
        (0, vitest_1.expect)(details.url).toBe("wss://example.com/ws");
        (0, vitest_1.expect)(details.urlSource).toBe("cli --url");
        (0, vitest_1.expect)(details.bindDetail).toBeUndefined();
        (0, vitest_1.expect)(details.remoteFallbackNote).toBeUndefined();
        (0, vitest_1.expect)(details.message).toContain("Gateway target: wss://example.com/ws");
        (0, vitest_1.expect)(details.message).toContain("Source: cli --url");
    });
    (0, vitest_1.it)("emits a remote fallback note when remote url is missing", function () {
        loadConfig.mockReturnValue({
            gateway: { mode: "remote", bind: "loopback", remote: {} },
        });
        resolveGatewayPort.mockReturnValue(18789);
        pickPrimaryTailnetIPv4.mockReturnValue(undefined);
        var details = buildGatewayConnectionDetails();
        (0, vitest_1.expect)(details.url).toBe("ws://127.0.0.1:18789");
        (0, vitest_1.expect)(details.urlSource).toBe("missing gateway.remote.url (fallback local)");
        (0, vitest_1.expect)(details.bindDetail).toBe("Bind: loopback");
        (0, vitest_1.expect)(details.remoteFallbackNote).toContain("gateway.mode=remote but gateway.remote.url is missing");
        (0, vitest_1.expect)(details.message).toContain("Gateway target: ws://127.0.0.1:18789");
    });
    (0, vitest_1.it)("prefers remote url when configured", function () {
        loadConfig.mockReturnValue({
            gateway: {
                mode: "remote",
                bind: "tailnet",
                remote: { url: "wss://remote.example.com/ws" },
            },
        });
        resolveGatewayPort.mockReturnValue(18800);
        pickPrimaryTailnetIPv4.mockReturnValue("100.64.0.9");
        var details = buildGatewayConnectionDetails();
        (0, vitest_1.expect)(details.url).toBe("wss://remote.example.com/ws");
        (0, vitest_1.expect)(details.urlSource).toBe("config gateway.remote.url");
        (0, vitest_1.expect)(details.bindDetail).toBeUndefined();
        (0, vitest_1.expect)(details.remoteFallbackNote).toBeUndefined();
    });
});
(0, vitest_1.describe)("callGateway error details", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReset();
        resolveGatewayPort.mockReset();
        pickPrimaryTailnetIPv4.mockReset();
        lastClientOptions = null;
        startMode = "hello";
        closeCode = 1006;
        closeReason = "";
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("includes connection details when the gateway closes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var err, caught_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startMode = "close";
                    closeCode = 1006;
                    closeReason = "";
                    loadConfig.mockReturnValue({
                        gateway: { mode: "local", bind: "loopback" },
                    });
                    resolveGatewayPort.mockReturnValue(18789);
                    pickPrimaryTailnetIPv4.mockReturnValue(undefined);
                    err = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    caught_1 = _a.sent();
                    err = caught_1;
                    return [3 /*break*/, 4];
                case 4:
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("gateway closed (1006");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Gateway target: ws://127.0.0.1:18789");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Source: local loopback");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Bind: loopback");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes connection details on timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var err, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startMode = "silent";
                    loadConfig.mockReturnValue({
                        gateway: { mode: "local", bind: "loopback" },
                    });
                    resolveGatewayPort.mockReturnValue(18789);
                    pickPrimaryTailnetIPv4.mockReturnValue(undefined);
                    vitest_1.vi.useFakeTimers();
                    err = null;
                    promise = callGateway({ method: "health", timeoutMs: 5 }).catch(function (caught) {
                        err = caught;
                    });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(5)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promise];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("gateway timeout after 5ms");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Gateway target: ws://127.0.0.1:18789");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Source: local loopback");
                    (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.message).toContain("Bind: loopback");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails fast when remote mode is missing remote url", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        gateway: { mode: "remote", bind: "loopback", remote: {} },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(callGateway({
                            method: "health",
                            timeoutMs: 10,
                        })).rejects.toThrow("gateway remote mode misconfigured")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("callGateway password resolution", function () {
    var originalEnvPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReset();
        resolveGatewayPort.mockReset();
        pickPrimaryTailnetIPv4.mockReset();
        lastClientOptions = null;
        startMode = "hello";
        closeCode = 1006;
        closeReason = "";
        delete process.env.OPENCLAW_GATEWAY_PASSWORD;
        resolveGatewayPort.mockReturnValue(18789);
        pickPrimaryTailnetIPv4.mockReturnValue(undefined);
    });
    (0, vitest_1.afterEach)(function () {
        if (originalEnvPassword == null) {
            delete process.env.OPENCLAW_GATEWAY_PASSWORD;
        }
        else {
            process.env.OPENCLAW_GATEWAY_PASSWORD = originalEnvPassword;
        }
    });
    (0, vitest_1.it)("uses local config password when env is unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        gateway: {
                            mode: "local",
                            bind: "loopback",
                            auth: { password: "secret" },
                        },
                    });
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.password).toBe("secret");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers env password over local config password", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_GATEWAY_PASSWORD = "from-env";
                    loadConfig.mockReturnValue({
                        gateway: {
                            mode: "local",
                            bind: "loopback",
                            auth: { password: "from-config" },
                        },
                    });
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.password).toBe("from-env");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses remote password in remote mode when env is unset", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadConfig.mockReturnValue({
                        gateway: {
                            mode: "remote",
                            remote: { url: "ws://remote.example:18789", password: "remote-secret" },
                            auth: { password: "from-config" },
                        },
                    });
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.password).toBe("remote-secret");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers env password over remote password in remote mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_GATEWAY_PASSWORD = "from-env";
                    loadConfig.mockReturnValue({
                        gateway: {
                            mode: "remote",
                            remote: { url: "ws://remote.example:18789", password: "remote-secret" },
                            auth: { password: "from-config" },
                        },
                    });
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.password).toBe("from-env");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("callGateway token resolution", function () {
    var originalEnvToken = process.env.OPENCLAW_GATEWAY_TOKEN;
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReset();
        resolveGatewayPort.mockReset();
        pickPrimaryTailnetIPv4.mockReset();
        lastClientOptions = null;
        startMode = "hello";
        closeCode = 1006;
        closeReason = "";
        delete process.env.OPENCLAW_GATEWAY_TOKEN;
        resolveGatewayPort.mockReturnValue(18789);
        pickPrimaryTailnetIPv4.mockReturnValue(undefined);
    });
    (0, vitest_1.afterEach)(function () {
        if (originalEnvToken == null) {
            delete process.env.OPENCLAW_GATEWAY_TOKEN;
        }
        else {
            process.env.OPENCLAW_GATEWAY_TOKEN = originalEnvToken;
        }
    });
    (0, vitest_1.it)("uses remote token when remote mode uses url override", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_GATEWAY_TOKEN = "env-token";
                    loadConfig.mockReturnValue({
                        gateway: {
                            mode: "remote",
                            remote: { token: "remote-token" },
                            auth: { token: "local-token" },
                        },
                    });
                    return [4 /*yield*/, callGateway({ method: "health", url: "wss://override.example/ws" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(lastClientOptions === null || lastClientOptions === void 0 ? void 0 : lastClientOptions.token).toBe("remote-token");
                    return [2 /*return*/];
            }
        });
    }); });
});
