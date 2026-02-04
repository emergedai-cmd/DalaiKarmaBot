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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var server_js_1 = require("./server.js");
var test_helpers_e2e_js_1 = require("./test-helpers.e2e.js");
var test_helpers_openai_mock_js_1 = require("./test-helpers.openai-mock.js");
function extractPayloadText(result) {
    var record = result;
    var payloads = Array.isArray(record.payloads) ? record.payloads : [];
    var texts = payloads
        .map(function (p) { return (p && typeof p === "object" ? p.text : undefined); })
        .filter(function (t) { return typeof t === "string" && t.trim().length > 0; });
    return texts.join("\n").trim();
}
(0, vitest_1.describe)("gateway e2e", function () {
    (0, vitest_1.it)("runs a mock OpenAI tool call end-to-end via gateway agent loop", { timeout: 90000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var prev, _a, openaiBaseUrl, restore, tempHome, token, workspaceDir, nonceA, nonceB, toolProbePath, configDir, configPath, cfg, port, server, client, sessionKey, runId, payload, text;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prev = {
                        home: process.env.HOME,
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                        skipBrowser: process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER,
                    };
                    _a = (0, test_helpers_openai_mock_js_1.installOpenAiResponsesMock)(), openaiBaseUrl = _a.baseUrl, restore = _a.restore;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-mock-home-"))];
                case 1:
                    tempHome = _b.sent();
                    process.env.HOME = tempHome;
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = "1";
                    token = "test-".concat((0, node_crypto_1.randomUUID)());
                    process.env.OPENCLAW_GATEWAY_TOKEN = token;
                    workspaceDir = node_path_1.default.join(tempHome, "openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 2:
                    _b.sent();
                    nonceA = (0, node_crypto_1.randomUUID)();
                    nonceB = (0, node_crypto_1.randomUUID)();
                    toolProbePath = node_path_1.default.join(workspaceDir, ".openclaw-tool-probe.".concat(nonceA, ".txt"));
                    return [4 /*yield*/, promises_1.default.writeFile(toolProbePath, "nonceA=".concat(nonceA, "\nnonceB=").concat(nonceB, "\n"))];
                case 3:
                    _b.sent();
                    configDir = node_path_1.default.join(tempHome, ".openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                case 4:
                    _b.sent();
                    configPath = node_path_1.default.join(configDir, "openclaw.json");
                    cfg = {
                        agents: { defaults: { workspace: workspaceDir } },
                        models: {
                            mode: "replace",
                            providers: {
                                openai: {
                                    baseUrl: openaiBaseUrl,
                                    apiKey: "test",
                                    api: "openai-responses",
                                    models: [
                                        {
                                            id: "gpt-5.2",
                                            name: "gpt-5.2",
                                            api: "openai-responses",
                                            reasoning: false,
                                            input: ["text"],
                                            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                                            contextWindow: 128000,
                                            maxTokens: 4096,
                                        },
                                    ],
                                },
                            },
                        },
                        gateway: { auth: { token: token } },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "".concat(JSON.stringify(cfg, null, 2), "\n"))];
                case 5:
                    _b.sent();
                    process.env.OPENCLAW_CONFIG_PATH = configPath;
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.getFreeGatewayPort)()];
                case 6:
                    port = _b.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: token },
                            controlUiEnabled: false,
                        })];
                case 7:
                    server = _b.sent();
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.connectGatewayClient)({
                            url: "ws://127.0.0.1:".concat(port),
                            token: token,
                            clientDisplayName: "vitest-mock-openai",
                        })];
                case 8:
                    client = _b.sent();
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, , 12, 15]);
                    sessionKey = "agent:dev:mock-openai";
                    return [4 /*yield*/, client.request("sessions.patch", {
                            key: sessionKey,
                            model: "openai/gpt-5.2",
                        })];
                case 10:
                    _b.sent();
                    runId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runId),
                            message: "Call the read tool on \"".concat(toolProbePath, "\". ") +
                                "Then reply with exactly: ".concat(nonceA, " ").concat(nonceB, ". No extra text."),
                            deliver: false,
                        }, { expectFinal: true })];
                case 11:
                    payload = _b.sent();
                    (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.status).toBe("ok");
                    text = extractPayloadText(payload === null || payload === void 0 ? void 0 : payload.result);
                    (0, vitest_1.expect)(text).toContain(nonceA);
                    (0, vitest_1.expect)(text).toContain(nonceB);
                    return [3 /*break*/, 15];
                case 12:
                    client.stop();
                    return [4 /*yield*/, server.close({ reason: "mock openai test complete" })];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.rm(tempHome, { recursive: true, force: true })];
                case 14:
                    _b.sent();
                    restore();
                    process.env.HOME = prev.home;
                    process.env.OPENCLAW_CONFIG_PATH = prev.configPath;
                    process.env.OPENCLAW_GATEWAY_TOKEN = prev.token;
                    process.env.OPENCLAW_SKIP_CHANNELS = prev.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prev.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = prev.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = prev.skipCanvas;
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = prev.skipBrowser;
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs wizard over ws and writes auth token config", { timeout: 90000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var prev, tempHome, wizardToken, port, server, client, start, sessionId, next, didSendToken, step, value, resolveConfigPath, parsed, _a, _b, token, port2, server2, resNoToken, resToken;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    prev = {
                        home: process.env.HOME,
                        stateDir: process.env.OPENCLAW_STATE_DIR,
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                        skipBrowser: process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER,
                    };
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = "1";
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-wizard-home-"))];
                case 1:
                    tempHome = _f.sent();
                    process.env.HOME = tempHome;
                    delete process.env.OPENCLAW_STATE_DIR;
                    delete process.env.OPENCLAW_CONFIG_PATH;
                    wizardToken = "wiz-".concat((0, node_crypto_1.randomUUID)());
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.getFreeGatewayPort)()];
                case 2:
                    port = _f.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: wizardToken },
                            controlUiEnabled: false,
                            wizardRunner: function (_opts, _runtime, prompter) { return __awaiter(void 0, void 0, void 0, function () {
                                var token, writeConfigFile;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prompter.intro("Wizard E2E")];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, prompter.note("write token")];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, prompter.text({ message: "token" })];
                                        case 3:
                                            token = _a.sent();
                                            return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                                        case 4:
                                            writeConfigFile = (_a.sent()).writeConfigFile;
                                            return [4 /*yield*/, writeConfigFile({
                                                    gateway: { auth: { mode: "token", token: String(token) } },
                                                })];
                                        case 5:
                                            _a.sent();
                                            return [4 /*yield*/, prompter.outro("ok")];
                                        case 6:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        })];
                case 3:
                    server = _f.sent();
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.connectGatewayClient)({
                            url: "ws://127.0.0.1:".concat(port),
                            token: wizardToken,
                            clientDisplayName: "vitest-wizard",
                        })];
                case 4:
                    client = _f.sent();
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, , 12, 14]);
                    return [4 /*yield*/, client.request("wizard.start", { mode: "local" })];
                case 6:
                    start = _f.sent();
                    sessionId = start.sessionId;
                    (0, vitest_1.expect)(typeof sessionId).toBe("string");
                    next = start;
                    didSendToken = false;
                    _f.label = 7;
                case 7:
                    if (!!next.done) return [3 /*break*/, 9];
                    step = next.step;
                    if (!step) {
                        throw new Error("wizard missing step");
                    }
                    value = step.type === "text" ? wizardToken : null;
                    if (step.type === "text") {
                        didSendToken = true;
                    }
                    return [4 /*yield*/, client.request("wizard.next", {
                            sessionId: sessionId,
                            answer: { stepId: step.id, value: value },
                        })];
                case 8:
                    next = _f.sent();
                    return [3 /*break*/, 7];
                case 9:
                    (0, vitest_1.expect)(didSendToken).toBe(true);
                    (0, vitest_1.expect)(next.status).toBe("done");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 10:
                    resolveConfigPath = (_f.sent()).resolveConfigPath;
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(resolveConfigPath(), "utf8")];
                case 11:
                    parsed = _b.apply(_a, [_f.sent()]);
                    token = parsed === null || parsed === void 0 ? void 0 : parsed.gateway;
                    (0, vitest_1.expect)((_c = token === null || token === void 0 ? void 0 : token.auth) === null || _c === void 0 ? void 0 : _c.token).toBe(wizardToken);
                    return [3 /*break*/, 14];
                case 12:
                    client.stop();
                    return [4 /*yield*/, server.close({ reason: "wizard e2e complete" })];
                case 13:
                    _f.sent();
                    return [7 /*endfinally*/];
                case 14: return [4 /*yield*/, (0, test_helpers_e2e_js_1.getFreeGatewayPort)()];
                case 15:
                    port2 = _f.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port2, {
                            bind: "loopback",
                            controlUiEnabled: false,
                        })];
                case 16:
                    server2 = _f.sent();
                    _f.label = 17;
                case 17:
                    _f.trys.push([17, , 20, 23]);
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.connectDeviceAuthReq)({
                            url: "ws://127.0.0.1:".concat(port2),
                        })];
                case 18:
                    resNoToken = _f.sent();
                    (0, vitest_1.expect)(resNoToken.ok).toBe(false);
                    (0, vitest_1.expect)((_e = (_d = resNoToken.error) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : "").toContain("unauthorized");
                    return [4 /*yield*/, (0, test_helpers_e2e_js_1.connectDeviceAuthReq)({
                            url: "ws://127.0.0.1:".concat(port2),
                            token: wizardToken,
                        })];
                case 19:
                    resToken = _f.sent();
                    (0, vitest_1.expect)(resToken.ok).toBe(true);
                    return [3 /*break*/, 23];
                case 20: return [4 /*yield*/, server2.close({ reason: "wizard auth verify" })];
                case 21:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.rm(tempHome, { recursive: true, force: true })];
                case 22:
                    _f.sent();
                    process.env.HOME = prev.home;
                    process.env.OPENCLAW_STATE_DIR = prev.stateDir;
                    process.env.OPENCLAW_CONFIG_PATH = prev.configPath;
                    process.env.OPENCLAW_GATEWAY_TOKEN = prev.token;
                    process.env.OPENCLAW_SKIP_CHANNELS = prev.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prev.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = prev.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = prev.skipCanvas;
                    process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER = prev.skipBrowser;
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    }); });
});
