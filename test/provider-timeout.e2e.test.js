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
var client_js_1 = require("../src/gateway/client.js");
var server_js_1 = require("../src/gateway/server.js");
var ports_js_1 = require("../src/test-utils/ports.js");
var message_channel_js_1 = require("../src/utils/message-channel.js");
function buildOpenAIResponsesSse(text) {
    var events = [
        {
            type: "response.output_item.added",
            item: {
                type: "message",
                id: "msg_test_1",
                role: "assistant",
                content: [],
                status: "in_progress",
            },
        },
        {
            type: "response.output_item.done",
            item: {
                type: "message",
                id: "msg_test_1",
                role: "assistant",
                status: "completed",
                content: [{ type: "output_text", text: text, annotations: [] }],
            },
        },
        {
            type: "response.completed",
            response: {
                status: "completed",
                usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 },
            },
        },
    ];
    var sse = "".concat(events.map(function (e) { return "data: ".concat(JSON.stringify(e), "\n\n"); }).join(""), "data: [DONE]\n\n");
    var encoder = new TextEncoder();
    var body = new ReadableStream({
        start: function (controller) {
            controller.enqueue(encoder.encode(sse));
            controller.close();
        },
    });
    return new Response(body, {
        status: 200,
        headers: { "content-type": "text/event-stream" },
    });
}
function extractPayloadText(result) {
    var record = result;
    var payloads = Array.isArray(record.payloads) ? record.payloads : [];
    var texts = payloads
        .map(function (p) { return (p && typeof p === "object" ? p.text : undefined); })
        .filter(function (t) { return typeof t === "string" && t.trim().length > 0; });
    return texts.join("\n").trim();
}
function connectClient(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var settled = false;
                        var stop = function (err, client) {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            clearTimeout(timer);
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(client);
                            }
                        };
                        var client = new client_js_1.GatewayClient({
                            url: params.url,
                            token: params.token,
                            clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                            clientDisplayName: "vitest-timeout-fallback",
                            clientVersion: "dev",
                            mode: message_channel_js_1.GATEWAY_CLIENT_MODES.TEST,
                            onHelloOk: function () { return stop(undefined, client); },
                            onConnectError: function (err) { return stop(err); },
                            onClose: function (code, reason) {
                                return stop(new Error("gateway closed during connect (".concat(code, "): ").concat(reason)));
                            },
                        });
                        var timer = setTimeout(function () { return stop(new Error("gateway connect timeout")); }, 10000);
                        timer.unref();
                        client.start();
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getFreeGatewayPort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ports_js_1.getDeterministicFreePortBlock)({ offsets: [0, 1, 2, 3, 4] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(0, vitest_1.describe)("provider timeouts (e2e)", function () {
    (0, vitest_1.it)("falls back when the primary provider aborts with a timeout-like AbortError", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var prev, originalFetch, primaryBaseUrl, fallbackBaseUrl, counts, fetchImpl, tempHome, token, configDir, configPath, cfg, port, server, client, sessionKey, runId, payload, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = {
                        home: process.env.HOME,
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                    };
                    originalFetch = globalThis.fetch;
                    primaryBaseUrl = "https://primary.example/v1";
                    fallbackBaseUrl = "https://fallback.example/v1";
                    counts = { primary: 0, fallback: 0 };
                    fetchImpl = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, err;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                                    if (url.startsWith("".concat(primaryBaseUrl, "/responses"))) {
                                        counts.primary += 1;
                                        err = new Error("request was aborted");
                                        err.name = "AbortError";
                                        throw err;
                                    }
                                    if (url.startsWith("".concat(fallbackBaseUrl, "/responses"))) {
                                        counts.fallback += 1;
                                        return [2 /*return*/, buildOpenAIResponsesSse("fallback-ok")];
                                    }
                                    if (!originalFetch) {
                                        throw new Error("fetch is not available (url=".concat(url, ")"));
                                    }
                                    return [4 /*yield*/, originalFetch(input, init)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    globalThis.fetch = fetchImpl;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-timeout-e2e-"))];
                case 1:
                    tempHome = _a.sent();
                    process.env.HOME = tempHome;
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    token = "test-".concat((0, node_crypto_1.randomUUID)());
                    process.env.OPENCLAW_GATEWAY_TOKEN = token;
                    configDir = node_path_1.default.join(tempHome, ".openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                case 2:
                    _a.sent();
                    configPath = node_path_1.default.join(configDir, "openclaw.json");
                    cfg = {
                        agents: {
                            defaults: {
                                model: {
                                    primary: "primary/gpt-5.2",
                                    fallbacks: ["fallback/gpt-5.2"],
                                },
                            },
                        },
                        models: {
                            mode: "replace",
                            providers: {
                                primary: {
                                    baseUrl: primaryBaseUrl,
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
                                fallback: {
                                    baseUrl: fallbackBaseUrl,
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
                case 3:
                    _a.sent();
                    process.env.OPENCLAW_CONFIG_PATH = configPath;
                    return [4 /*yield*/, getFreeGatewayPort()];
                case 4:
                    port = _a.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: token },
                            controlUiEnabled: false,
                        })];
                case 5:
                    server = _a.sent();
                    return [4 /*yield*/, connectClient({
                            url: "ws://127.0.0.1:".concat(port),
                            token: token,
                        })];
                case 6:
                    client = _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, , 10, 13]);
                    sessionKey = "agent:dev:timeout-fallback";
                    return [4 /*yield*/, client.request("sessions.patch", {
                            key: sessionKey,
                            model: "primary/gpt-5.2",
                        })];
                case 8:
                    _a.sent();
                    runId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runId),
                            message: "say fallback-ok",
                            deliver: false,
                        }, { expectFinal: true })];
                case 9:
                    payload = _a.sent();
                    (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.status).toBe("ok");
                    text = extractPayloadText(payload === null || payload === void 0 ? void 0 : payload.result);
                    (0, vitest_1.expect)(text).toContain("fallback-ok");
                    (0, vitest_1.expect)(counts.primary).toBeGreaterThan(0);
                    (0, vitest_1.expect)(counts.fallback).toBeGreaterThan(0);
                    return [3 /*break*/, 13];
                case 10:
                    client.stop();
                    return [4 /*yield*/, server.close({ reason: "timeout fallback test complete" })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(tempHome, { recursive: true, force: true })];
                case 12:
                    _a.sent();
                    globalThis.fetch = originalFetch;
                    if (prev.home === undefined) {
                        delete process.env.HOME;
                    }
                    else {
                        process.env.HOME = prev.home;
                    }
                    if (prev.configPath === undefined) {
                        delete process.env.OPENCLAW_CONFIG_PATH;
                    }
                    else {
                        process.env.OPENCLAW_CONFIG_PATH = prev.configPath;
                    }
                    if (prev.token === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prev.token;
                    }
                    if (prev.skipChannels === undefined) {
                        delete process.env.OPENCLAW_SKIP_CHANNELS;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CHANNELS = prev.skipChannels;
                    }
                    if (prev.skipGmail === undefined) {
                        delete process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prev.skipGmail;
                    }
                    if (prev.skipCron === undefined) {
                        delete process.env.OPENCLAW_SKIP_CRON;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CRON = prev.skipCron;
                    }
                    if (prev.skipCanvas === undefined) {
                        delete process.env.OPENCLAW_SKIP_CANVAS_HOST;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CANVAS_HOST = prev.skipCanvas;
                    }
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
});
