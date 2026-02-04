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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var model_selection_js_1 = require("../agents/model-selection.js");
var config_js_1 = require("../config/config.js");
var env_js_1 = require("../infra/env.js");
var client_js_1 = require("./client.js");
var live_image_probe_js_1 = require("./live-image-probe.js");
var server_js_1 = require("./server.js");
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.LIVE) || (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_TEST);
var CLI_LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_CLI_BACKEND);
var CLI_IMAGE = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_CLI_BACKEND_IMAGE_PROBE);
var CLI_RESUME = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_CLI_BACKEND_RESUME_PROBE);
var describeLive = LIVE && CLI_LIVE ? vitest_1.describe : vitest_1.describe.skip;
var DEFAULT_MODEL = "claude-cli/claude-sonnet-4-5";
var DEFAULT_CLAUDE_ARGS = ["-p", "--output-format", "json", "--dangerously-skip-permissions"];
var DEFAULT_CODEX_ARGS = [
    "exec",
    "--json",
    "--color",
    "never",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
];
var DEFAULT_CLEAR_ENV = ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD"];
function randomImageProbeCode(len) {
    if (len === void 0) { len = 6; }
    // Chosen to avoid common OCR confusions in our 5x7 bitmap font.
    // Notably: 0↔8, B↔8, 6↔9, 3↔B, D↔0.
    // Must stay within the glyph set in `src/gateway/live-image-probe.ts`.
    var alphabet = "24567ACEF";
    var bytes = (0, node_crypto_1.randomBytes)(len);
    var out = "";
    for (var i = 0; i < len; i += 1) {
        out += alphabet[bytes[i] % alphabet.length];
    }
    return out;
}
function editDistance(a, b) {
    var _a;
    var _b;
    if (a === b) {
        return 0;
    }
    var aLen = a.length;
    var bLen = b.length;
    if (aLen === 0) {
        return bLen;
    }
    if (bLen === 0) {
        return aLen;
    }
    var prev = Array.from({ length: bLen + 1 }, function (_v, idx) { return idx; });
    var curr = Array.from({ length: bLen + 1 }, function () { return 0; });
    for (var i = 1; i <= aLen; i += 1) {
        curr[0] = i;
        var aCh = a.charCodeAt(i - 1);
        for (var j = 1; j <= bLen; j += 1) {
            var cost = aCh === b.charCodeAt(j - 1) ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, // delete
            curr[j - 1] + 1, // insert
            prev[j - 1] + cost);
        }
        _a = [curr, prev], prev = _a[0], curr = _a[1];
    }
    return (_b = prev[bLen]) !== null && _b !== void 0 ? _b : Number.POSITIVE_INFINITY;
}
function extractPayloadText(result) {
    var record = result;
    var payloads = Array.isArray(record.payloads) ? record.payloads : [];
    var texts = payloads
        .map(function (p) { return (p && typeof p === "object" ? p.text : undefined); })
        .filter(function (t) { return typeof t === "string" && t.trim().length > 0; });
    return texts.join("\n").trim();
}
function parseJsonStringArray(name, raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed) || !parsed.every(function (entry) { return typeof entry === "string"; })) {
        throw new Error("".concat(name, " must be a JSON array of strings."));
    }
    return parsed;
}
function parseImageMode(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return undefined;
    }
    if (trimmed === "list" || trimmed === "repeat") {
        return trimmed;
    }
    throw new Error("OPENCLAW_LIVE_CLI_BACKEND_IMAGE_MODE must be 'list' or 'repeat'.");
}
function withMcpConfigOverrides(args, mcpConfigPath) {
    var next = __spreadArray([], args, true);
    if (!next.includes("--strict-mcp-config")) {
        next.push("--strict-mcp-config");
    }
    if (!next.includes("--mcp-config")) {
        next.push("--mcp-config", mcpConfigPath);
    }
    return next;
}
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var srv = (0, node_net_1.createServer)();
                        srv.on("error", reject);
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
            }
        });
    });
}
function isPortFree(port) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var srv = (0, node_net_1.createServer)();
                            srv.once("error", function () { return resolve(false); });
                            srv.listen(port, "127.0.0.1", function () {
                                srv.close(function () { return resolve(true); });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getFreeGatewayPort() {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, port, candidates, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 25)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getFreePort()];
                case 2:
                    port = _a.sent();
                    candidates = [port, port + 1, port + 2, port + 4];
                    return [4 /*yield*/, Promise.all(candidates.map(function (candidate) { return isPortFree(candidate); }))];
                case 3:
                    ok = (_a.sent()).every(Boolean);
                    if (ok) {
                        return [2 /*return*/, port];
                    }
                    _a.label = 4;
                case 4:
                    attempt += 1;
                    return [3 /*break*/, 1];
                case 5: throw new Error("failed to acquire a free gateway port block");
            }
        });
    });
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
                            clientName: "vitest-live-cli-backend",
                            clientVersion: "dev",
                            mode: "test",
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
describeLive("gateway live (cli backend)", function () {
    (0, vitest_1.it)("runs the agent pipeline against the local CLI backend", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previous, token, rawModel, parsed, providerId, modelKey, providerDefaults, cliCommand, baseCliArgs, cliClearEnv, cliImageArg, cliImageMode, tempDir, disableMcpConfig, cliArgs, mcpConfigPath, cfg, existingBackends, nextCfg, tempConfigPath, port, server, client, sessionKey, runId, nonce, message, payload, text, runIdResume, resumeNonce, resumeMessage, resumePayload, resumeText, imageCode_1, imageBase64, runIdImage, imageProbe, imageText, candidates, bestDistance;
        var _a, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    previous = {
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
                        anthropicApiKeyOld: process.env.ANTHROPIC_API_KEY_OLD,
                    };
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    delete process.env.ANTHROPIC_API_KEY;
                    delete process.env.ANTHROPIC_API_KEY_OLD;
                    token = "test-".concat((0, node_crypto_1.randomUUID)());
                    process.env.OPENCLAW_GATEWAY_TOKEN = token;
                    rawModel = (_c = process.env.OPENCLAW_LIVE_CLI_BACKEND_MODEL) !== null && _c !== void 0 ? _c : DEFAULT_MODEL;
                    parsed = (0, model_selection_js_1.parseModelRef)(rawModel, "claude-cli");
                    if (!parsed) {
                        throw new Error("OPENCLAW_LIVE_CLI_BACKEND_MODEL must resolve to a CLI backend model. Got: ".concat(rawModel));
                    }
                    providerId = parsed.provider;
                    modelKey = "".concat(providerId, "/").concat(parsed.model);
                    providerDefaults = providerId === "claude-cli"
                        ? { command: "claude", args: DEFAULT_CLAUDE_ARGS }
                        : providerId === "codex-cli"
                            ? { command: "codex", args: DEFAULT_CODEX_ARGS }
                            : null;
                    cliCommand = (_d = process.env.OPENCLAW_LIVE_CLI_BACKEND_COMMAND) !== null && _d !== void 0 ? _d : providerDefaults === null || providerDefaults === void 0 ? void 0 : providerDefaults.command;
                    if (!cliCommand) {
                        throw new Error("OPENCLAW_LIVE_CLI_BACKEND_COMMAND is required for provider \"".concat(providerId, "\"."));
                    }
                    baseCliArgs = (_e = parseJsonStringArray("OPENCLAW_LIVE_CLI_BACKEND_ARGS", process.env.OPENCLAW_LIVE_CLI_BACKEND_ARGS)) !== null && _e !== void 0 ? _e : providerDefaults === null || providerDefaults === void 0 ? void 0 : providerDefaults.args;
                    if (!baseCliArgs || baseCliArgs.length === 0) {
                        throw new Error("OPENCLAW_LIVE_CLI_BACKEND_ARGS is required for provider \"".concat(providerId, "\"."));
                    }
                    cliClearEnv = (_f = parseJsonStringArray("OPENCLAW_LIVE_CLI_BACKEND_CLEAR_ENV", process.env.OPENCLAW_LIVE_CLI_BACKEND_CLEAR_ENV)) !== null && _f !== void 0 ? _f : (providerId === "claude-cli" ? DEFAULT_CLEAR_ENV : []);
                    cliImageArg = ((_g = process.env.OPENCLAW_LIVE_CLI_BACKEND_IMAGE_ARG) === null || _g === void 0 ? void 0 : _g.trim()) || undefined;
                    cliImageMode = parseImageMode(process.env.OPENCLAW_LIVE_CLI_BACKEND_IMAGE_MODE);
                    if (cliImageMode && !cliImageArg) {
                        throw new Error("OPENCLAW_LIVE_CLI_BACKEND_IMAGE_MODE requires OPENCLAW_LIVE_CLI_BACKEND_IMAGE_ARG.");
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-live-cli-"))];
                case 1:
                    tempDir = _o.sent();
                    disableMcpConfig = process.env.OPENCLAW_LIVE_CLI_BACKEND_DISABLE_MCP_CONFIG !== "0";
                    cliArgs = baseCliArgs;
                    if (!(providerId === "claude-cli" && disableMcpConfig)) return [3 /*break*/, 3];
                    mcpConfigPath = node_path_1.default.join(tempDir, "claude-mcp.json");
                    return [4 /*yield*/, promises_1.default.writeFile(mcpConfigPath, "".concat(JSON.stringify({ mcpServers: {} }, null, 2), "\n"))];
                case 2:
                    _o.sent();
                    cliArgs = withMcpConfigOverrides(baseCliArgs, mcpConfigPath);
                    _o.label = 3;
                case 3:
                    cfg = (0, config_js_1.loadConfig)();
                    existingBackends = (_k = (_j = (_h = cfg.agents) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.cliBackends) !== null && _k !== void 0 ? _k : {};
                    nextCfg = __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_l = cfg.agents) === null || _l === void 0 ? void 0 : _l.defaults), { model: { primary: modelKey }, models: (_a = {},
                                    _a[modelKey] = {},
                                    _a), cliBackends: __assign(__assign({}, existingBackends), (_b = {}, _b[providerId] = __assign({ command: cliCommand, args: cliArgs, clearEnv: cliClearEnv.length > 0 ? cliClearEnv : undefined, systemPromptWhen: "never" }, (cliImageArg ? { imageArg: cliImageArg, imageMode: cliImageMode } : {})), _b)), sandbox: { mode: "off" } }) }) });
                    tempConfigPath = node_path_1.default.join(tempDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(tempConfigPath, "".concat(JSON.stringify(nextCfg, null, 2), "\n"))];
                case 4:
                    _o.sent();
                    process.env.OPENCLAW_CONFIG_PATH = tempConfigPath;
                    return [4 /*yield*/, getFreeGatewayPort()];
                case 5:
                    port = _o.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: token },
                            controlUiEnabled: false,
                        })];
                case 6:
                    server = _o.sent();
                    return [4 /*yield*/, connectClient({
                            url: "ws://127.0.0.1:".concat(port),
                            token: token,
                        })];
                case 7:
                    client = _o.sent();
                    _o.label = 8;
                case 8:
                    _o.trys.push([8, , 14, 17]);
                    sessionKey = "agent:dev:live-cli-backend";
                    runId = (0, node_crypto_1.randomUUID)();
                    nonce = (0, node_crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                    message = providerId === "codex-cli"
                        ? "Please include the token CLI-BACKEND-".concat(nonce, " in your reply.")
                        : "Reply with exactly: CLI backend OK ".concat(nonce, ".");
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runId),
                            message: message,
                            deliver: false,
                        }, { expectFinal: true })];
                case 9:
                    payload = _o.sent();
                    if ((payload === null || payload === void 0 ? void 0 : payload.status) !== "ok") {
                        throw new Error("agent status=".concat(String(payload === null || payload === void 0 ? void 0 : payload.status)));
                    }
                    text = extractPayloadText(payload === null || payload === void 0 ? void 0 : payload.result);
                    if (providerId === "codex-cli") {
                        (0, vitest_1.expect)(text).toContain("CLI-BACKEND-".concat(nonce));
                    }
                    else {
                        (0, vitest_1.expect)(text).toContain("CLI backend OK ".concat(nonce, "."));
                    }
                    if (!CLI_RESUME) return [3 /*break*/, 11];
                    runIdResume = (0, node_crypto_1.randomUUID)();
                    resumeNonce = (0, node_crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                    resumeMessage = providerId === "codex-cli"
                        ? "Please include the token CLI-RESUME-".concat(resumeNonce, " in your reply.")
                        : "Reply with exactly: CLI backend RESUME OK ".concat(resumeNonce, ".");
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runIdResume),
                            message: resumeMessage,
                            deliver: false,
                        }, { expectFinal: true })];
                case 10:
                    resumePayload = _o.sent();
                    if ((resumePayload === null || resumePayload === void 0 ? void 0 : resumePayload.status) !== "ok") {
                        throw new Error("resume status=".concat(String(resumePayload === null || resumePayload === void 0 ? void 0 : resumePayload.status)));
                    }
                    resumeText = extractPayloadText(resumePayload === null || resumePayload === void 0 ? void 0 : resumePayload.result);
                    if (providerId === "codex-cli") {
                        (0, vitest_1.expect)(resumeText).toContain("CLI-RESUME-".concat(resumeNonce));
                    }
                    else {
                        (0, vitest_1.expect)(resumeText).toContain("CLI backend RESUME OK ".concat(resumeNonce, "."));
                    }
                    _o.label = 11;
                case 11:
                    if (!CLI_IMAGE) return [3 /*break*/, 13];
                    imageCode_1 = randomImageProbeCode();
                    imageBase64 = (0, live_image_probe_js_1.renderCatNoncePngBase64)(imageCode_1);
                    runIdImage = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runIdImage, "-image"),
                            message: "Look at the attached image. Reply with exactly two tokens separated by a single space: " +
                                "(1) the animal shown or written in the image, lowercase; " +
                                "(2) the code printed in the image, uppercase. No extra text.",
                            attachments: [
                                {
                                    mimeType: "image/png",
                                    fileName: "probe-".concat(runIdImage, ".png"),
                                    content: imageBase64,
                                },
                            ],
                            deliver: false,
                        }, { expectFinal: true })];
                case 12:
                    imageProbe = _o.sent();
                    if ((imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.status) !== "ok") {
                        throw new Error("image probe failed: status=".concat(String(imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.status)));
                    }
                    imageText = extractPayloadText(imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.result);
                    if (!/\bcat\b/i.test(imageText)) {
                        throw new Error("image probe missing 'cat': ".concat(imageText));
                    }
                    candidates = (_m = imageText.toUpperCase().match(/[A-Z0-9]{6,20}/g)) !== null && _m !== void 0 ? _m : [];
                    bestDistance = candidates.reduce(function (best, cand) {
                        if (Math.abs(cand.length - imageCode_1.length) > 2) {
                            return best;
                        }
                        return Math.min(best, editDistance(cand, imageCode_1));
                    }, Number.POSITIVE_INFINITY);
                    if (!(bestDistance <= 5)) {
                        throw new Error("image probe missing code (".concat(imageCode_1, "): ").concat(imageText));
                    }
                    _o.label = 13;
                case 13: return [3 /*break*/, 17];
                case 14:
                    client.stop();
                    return [4 /*yield*/, server.close()];
                case 15:
                    _o.sent();
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 16:
                    _o.sent();
                    if (previous.configPath === undefined) {
                        delete process.env.OPENCLAW_CONFIG_PATH;
                    }
                    else {
                        process.env.OPENCLAW_CONFIG_PATH = previous.configPath;
                    }
                    if (previous.token === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = previous.token;
                    }
                    if (previous.skipChannels === undefined) {
                        delete process.env.OPENCLAW_SKIP_CHANNELS;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CHANNELS = previous.skipChannels;
                    }
                    if (previous.skipGmail === undefined) {
                        delete process.env.OPENCLAW_SKIP_GMAIL_WATCHER;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_GMAIL_WATCHER = previous.skipGmail;
                    }
                    if (previous.skipCron === undefined) {
                        delete process.env.OPENCLAW_SKIP_CRON;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CRON = previous.skipCron;
                    }
                    if (previous.skipCanvas === undefined) {
                        delete process.env.OPENCLAW_SKIP_CANVAS_HOST;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CANVAS_HOST = previous.skipCanvas;
                    }
                    if (previous.anthropicApiKey === undefined) {
                        delete process.env.ANTHROPIC_API_KEY;
                    }
                    else {
                        process.env.ANTHROPIC_API_KEY = previous.anthropicApiKey;
                    }
                    if (previous.anthropicApiKeyOld === undefined) {
                        delete process.env.ANTHROPIC_API_KEY_OLD;
                    }
                    else {
                        process.env.ANTHROPIC_API_KEY_OLD = previous.anthropicApiKeyOld;
                    }
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); }, 60000);
});
