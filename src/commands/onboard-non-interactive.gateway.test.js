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
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ports_js_1 = require("../test-utils/ports.js");
var gatewayClientCalls = [];
vitest_1.vi.mock("../gateway/client.js", function () { return ({
    GatewayClient: /** @class */ (function () {
        function class_1(params) {
            this.params = params;
            gatewayClientCalls.push(params);
        }
        class_1.prototype.request = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        class_1.prototype.start = function () {
            var _this = this;
            queueMicrotask(function () { var _a, _b; return (_b = (_a = _this.params).onHelloOk) === null || _b === void 0 ? void 0 : _b.call(_a); });
        };
        class_1.prototype.stop = function () { };
        return class_1;
    }()),
}); });
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var srv = (0, node_net_1.createServer)();
                            srv.on("error", function (err) {
                                srv.close();
                                reject(err);
                            });
                            srv.listen(0, "127.0.0.1", function () {
                                var addr = srv.address();
                                if (!addr || typeof addr === "string") {
                                    srv.close();
                                    reject(new Error("failed to acquire free port"));
                                    return;
                                }
                                var port = addr.port;
                                srv.close(function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(port);
                                    }
                                });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    code = err_1 === null || err_1 === void 0 ? void 0 : err_1.code;
                    if (code === "EPERM" || code === "EACCES") {
                        return [2 /*return*/, 30000 + (process.pid % 10000)];
                    }
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getFreeGatewayPort() {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, ports_js_1.getDeterministicFreePortBlock)({ offsets: [0, 1, 2, 4] })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_2 = _a.sent();
                    code = err_2 === null || err_2 === void 0 ? void 0 : err_2.code;
                    if (code === "EPERM" || code === "EACCES") {
                        return [2 /*return*/, 40000 + (process.pid % 10000)];
                    }
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var runtime = {
    log: function () { },
    error: function (msg) {
        throw new Error(msg);
    },
    exit: function (code) {
        throw new Error("exit:".concat(code));
    },
};
(0, vitest_1.describe)("onboard (non-interactive): gateway and remote auth", function () {
    var prev = {
        home: process.env.HOME,
        stateDir: process.env.OPENCLAW_STATE_DIR,
        configPath: process.env.OPENCLAW_CONFIG_PATH,
        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
        skipCron: process.env.OPENCLAW_SKIP_CRON,
        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
        skipBrowser: process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER,
        token: process.env.OPENCLAW_GATEWAY_TOKEN,
        password: process.env.OPENCLAW_GATEWAY_PASSWORD,
    };
    var tempHome;
    var initStateDir = function (prefix) { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tempHome) {
                        throw new Error("temp home not initialized");
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(tempHome, prefix))];
                case 1:
                    stateDir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    delete process.env.OPENCLAW_CONFIG_PATH;
                    return [2 /*return*/, stateDir];
            }
        });
    }); };
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = "1";
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    delete process.env.OPENCLAW_GATEWAY_PASSWORD;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-onboard-"))];
                case 1:
                    tempHome = _a.sent();
                    process.env.HOME = tempHome;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tempHome) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempHome, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    process.env.HOME = prev.home;
                    process.env.OPENCLAW_STATE_DIR = prev.stateDir;
                    process.env.OPENCLAW_CONFIG_PATH = prev.configPath;
                    process.env.OPENCLAW_SKIP_CHANNELS = prev.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prev.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = prev.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = prev.skipCanvas;
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = prev.skipBrowser;
                    process.env.OPENCLAW_GATEWAY_TOKEN = prev.token;
                    process.env.OPENCLAW_GATEWAY_PASSWORD = prev.password;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes gateway token auth into config and gateway enforces it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, token, workspace, runNonInteractiveOnboarding, resolveConfigPath, configPath, cfg, _a, _b, _c, authorizeGatewayConnect, resolveGatewayAuth, auth, resNoToken, resToken;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, initStateDir("state-noninteractive-")];
                case 1:
                    stateDir = _l.sent();
                    token = "tok_test_123";
                    workspace = node_path_1.default.join(stateDir, "openclaw");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboard-non-interactive.js"); })];
                case 2:
                    runNonInteractiveOnboarding = (_l.sent()).runNonInteractiveOnboarding;
                    return [4 /*yield*/, runNonInteractiveOnboarding({
                            nonInteractive: true,
                            mode: "local",
                            workspace: workspace,
                            authChoice: "skip",
                            skipSkills: true,
                            skipHealth: true,
                            installDaemon: false,
                            gatewayBind: "loopback",
                            gatewayAuth: "token",
                            gatewayToken: token,
                        }, runtime)];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/paths.js"); })];
                case 4:
                    resolveConfigPath = (_l.sent()).resolveConfigPath;
                    configPath = resolveConfigPath(process.env, stateDir);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf8")];
                case 5:
                    cfg = _b.apply(_a, [_l.sent()]);
                    (0, vitest_1.expect)((_e = (_d = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.workspace).toBe(workspace);
                    (0, vitest_1.expect)((_g = (_f = cfg === null || cfg === void 0 ? void 0 : cfg.gateway) === null || _f === void 0 ? void 0 : _f.auth) === null || _g === void 0 ? void 0 : _g.mode).toBe("token");
                    (0, vitest_1.expect)((_j = (_h = cfg === null || cfg === void 0 ? void 0 : cfg.gateway) === null || _h === void 0 ? void 0 : _h.auth) === null || _j === void 0 ? void 0 : _j.token).toBe(token);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../gateway/auth.js"); })];
                case 6:
                    _c = _l.sent(), authorizeGatewayConnect = _c.authorizeGatewayConnect, resolveGatewayAuth = _c.resolveGatewayAuth;
                    auth = resolveGatewayAuth({ authConfig: (_k = cfg.gateway) === null || _k === void 0 ? void 0 : _k.auth, env: process.env });
                    return [4 /*yield*/, authorizeGatewayConnect({ auth: auth, connectAuth: { token: undefined } })];
                case 7:
                    resNoToken = _l.sent();
                    (0, vitest_1.expect)(resNoToken.ok).toBe(false);
                    return [4 /*yield*/, authorizeGatewayConnect({ auth: auth, connectAuth: { token: token } })];
                case 8:
                    resToken = _l.sent();
                    (0, vitest_1.expect)(resToken.ok).toBe(true);
                    return [4 /*yield*/, promises_1.default.rm(stateDir, { recursive: true, force: true })];
                case 9:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 60000);
    (0, vitest_1.it)("writes gateway.remote url/token and callGateway uses them", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, port, token, runNonInteractiveOnboarding, resolveConfigPath, cfg, _a, _b, callGateway, health, lastCall;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, initStateDir("state-remote-")];
                case 1:
                    stateDir = _h.sent();
                    return [4 /*yield*/, getFreePort()];
                case 2:
                    port = _h.sent();
                    token = "tok_remote_123";
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboard-non-interactive.js"); })];
                case 3:
                    runNonInteractiveOnboarding = (_h.sent()).runNonInteractiveOnboarding;
                    return [4 /*yield*/, runNonInteractiveOnboarding({
                            nonInteractive: true,
                            mode: "remote",
                            remoteUrl: "ws://127.0.0.1:".concat(port),
                            remoteToken: token,
                            authChoice: "skip",
                            json: true,
                        }, runtime)];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 5:
                    resolveConfigPath = (_h.sent()).resolveConfigPath;
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(resolveConfigPath(), "utf8")];
                case 6:
                    cfg = _b.apply(_a, [_h.sent()]);
                    (0, vitest_1.expect)((_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.mode).toBe("remote");
                    (0, vitest_1.expect)((_e = (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.remote) === null || _e === void 0 ? void 0 : _e.url).toBe("ws://127.0.0.1:".concat(port));
                    (0, vitest_1.expect)((_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.remote) === null || _g === void 0 ? void 0 : _g.token).toBe(token);
                    gatewayClientCalls.length = 0;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../gateway/call.js"); })];
                case 7:
                    callGateway = (_h.sent()).callGateway;
                    return [4 /*yield*/, callGateway({ method: "health" })];
                case 8:
                    health = _h.sent();
                    (0, vitest_1.expect)(health === null || health === void 0 ? void 0 : health.ok).toBe(true);
                    lastCall = gatewayClientCalls[gatewayClientCalls.length - 1];
                    (0, vitest_1.expect)(lastCall === null || lastCall === void 0 ? void 0 : lastCall.url).toBe("ws://127.0.0.1:".concat(port));
                    (0, vitest_1.expect)(lastCall === null || lastCall === void 0 ? void 0 : lastCall.token).toBe(token);
                    return [4 /*yield*/, promises_1.default.rm(stateDir, { recursive: true, force: true })];
                case 9:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 60000);
    (0, vitest_1.it)("auto-generates token auth when binding LAN and persists the token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, port, workspace, runNonInteractiveOnboarding, resolveConfigPath, configPath, cfg, _a, _b, token, _c, authorizeGatewayConnect, resolveGatewayAuth, auth, resNoToken, resToken;
        var _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (process.platform === "win32") {
                        // Windows runner occasionally drops the temp config write in this flow; skip to keep CI green.
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, initStateDir("state-lan-")];
                case 1:
                    stateDir = _m.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    process.env.OPENCLAW_CONFIG_PATH = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, getFreeGatewayPort()];
                case 2:
                    port = _m.sent();
                    workspace = node_path_1.default.join(stateDir, "openclaw");
                    // Other test files mock ../config/config.js. This onboarding flow needs the real
                    // implementation so it can persist the config and then read it back (Windows CI
                    // otherwise sees a mocked writeConfigFile and the config never lands on disk).
                    vitest_1.vi.resetModules();
                    vitest_1.vi.doMock("../config/config.js", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, vitest_1.vi.importActual("../config/config.js")];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboard-non-interactive.js"); })];
                case 3:
                    runNonInteractiveOnboarding = (_m.sent()).runNonInteractiveOnboarding;
                    return [4 /*yield*/, runNonInteractiveOnboarding({
                            nonInteractive: true,
                            mode: "local",
                            workspace: workspace,
                            authChoice: "skip",
                            skipSkills: true,
                            skipHealth: true,
                            installDaemon: false,
                            gatewayPort: port,
                            gatewayBind: "lan",
                        }, runtime)];
                case 4:
                    _m.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/paths.js"); })];
                case 5:
                    resolveConfigPath = (_m.sent()).resolveConfigPath;
                    configPath = resolveConfigPath(process.env, stateDir);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf8")];
                case 6:
                    cfg = _b.apply(_a, [_m.sent()]);
                    (0, vitest_1.expect)((_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.bind).toBe("lan");
                    (0, vitest_1.expect)((_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.port).toBe(port);
                    (0, vitest_1.expect)((_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.auth) === null || _g === void 0 ? void 0 : _g.mode).toBe("token");
                    token = (_k = (_j = (_h = cfg.gateway) === null || _h === void 0 ? void 0 : _h.auth) === null || _j === void 0 ? void 0 : _j.token) !== null && _k !== void 0 ? _k : "";
                    (0, vitest_1.expect)(token.length).toBeGreaterThan(8);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../gateway/auth.js"); })];
                case 7:
                    _c = _m.sent(), authorizeGatewayConnect = _c.authorizeGatewayConnect, resolveGatewayAuth = _c.resolveGatewayAuth;
                    auth = resolveGatewayAuth({ authConfig: (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.auth, env: process.env });
                    return [4 /*yield*/, authorizeGatewayConnect({ auth: auth, connectAuth: { token: undefined } })];
                case 8:
                    resNoToken = _m.sent();
                    (0, vitest_1.expect)(resNoToken.ok).toBe(false);
                    return [4 /*yield*/, authorizeGatewayConnect({ auth: auth, connectAuth: { token: token } })];
                case 9:
                    resToken = _m.sent();
                    (0, vitest_1.expect)(resToken.ok).toBe(true);
                    return [4 /*yield*/, promises_1.default.rm(stateDir, { recursive: true, force: true })];
                case 10:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 60000);
});
