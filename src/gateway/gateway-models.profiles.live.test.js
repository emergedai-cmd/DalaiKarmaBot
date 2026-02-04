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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var agent_paths_js_1 = require("../agents/agent-paths.js");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var live_auth_keys_js_1 = require("../agents/live-auth-keys.js");
var live_model_filter_js_1 = require("../agents/live-model-filter.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var models_config_js_1 = require("../agents/models-config.js");
var pi_model_discovery_js_1 = require("../agents/pi-model-discovery.js");
var config_js_1 = require("../config/config.js");
var env_js_1 = require("../infra/env.js");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var client_js_1 = require("./client.js");
var live_image_probe_js_1 = require("./live-image-probe.js");
var server_js_1 = require("./server.js");
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.LIVE) || (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_TEST);
var GATEWAY_LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_GATEWAY);
var ZAI_FALLBACK = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_GATEWAY_ZAI_FALLBACK);
var PROVIDERS = parseFilter(process.env.OPENCLAW_LIVE_GATEWAY_PROVIDERS);
var THINKING_LEVEL = "high";
var THINKING_TAG_RE = /<\s*\/?\s*(?:think(?:ing)?|thought|antthinking)\s*>/i;
var FINAL_TAG_RE = /<\s*\/?\s*final\s*>/i;
var ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
var describeLive = LIVE || GATEWAY_LIVE ? vitest_1.describe : vitest_1.describe.skip;
function parseFilter(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed || trimmed === "all") {
        return null;
    }
    var ids = trimmed
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    return ids.length ? new Set(ids) : null;
}
function logProgress(message) {
    console.log("[live] ".concat(message));
}
function assertNoReasoningTags(params) {
    if (!params.text) {
        return;
    }
    if (THINKING_TAG_RE.test(params.text) || FINAL_TAG_RE.test(params.text)) {
        var snippet = params.text.length > 200 ? "".concat(params.text.slice(0, 200), "\u2026") : params.text;
        throw new Error("[".concat(params.label, "] reasoning tag leak (").concat(params.model, " / ").concat(params.phase, "): ").concat(snippet));
    }
}
function extractPayloadText(result) {
    var record = result;
    var payloads = Array.isArray(record.payloads) ? record.payloads : [];
    var texts = payloads
        .map(function (p) { return (p && typeof p === "object" ? p.text : undefined); })
        .filter(function (t) { return typeof t === "string" && t.trim().length > 0; });
    return texts.join("\n").trim();
}
function isMeaningful(text) {
    if (!text) {
        return false;
    }
    var trimmed = text.trim();
    if (trimmed.toLowerCase() === "ok") {
        return false;
    }
    if (trimmed.length < 60) {
        return false;
    }
    var words = trimmed.split(/\s+/g).filter(Boolean);
    if (words.length < 12) {
        return false;
    }
    return true;
}
function isGoogleModelNotFoundText(text) {
    var trimmed = text.trim();
    if (!trimmed) {
        return false;
    }
    if (!/not found/i.test(trimmed)) {
        return false;
    }
    if (/models\/.+ is not found for api version/i.test(trimmed)) {
        return true;
    }
    if (/"status"\s*:\s*"NOT_FOUND"/.test(trimmed)) {
        return true;
    }
    if (/"code"\s*:\s*404/.test(trimmed)) {
        return true;
    }
    return false;
}
function isGoogleishProvider(provider) {
    return provider === "google" || provider.startsWith("google-");
}
function isRefreshTokenReused(error) {
    return /refresh_token_reused/i.test(error);
}
function isChatGPTUsageLimitErrorMessage(raw) {
    var msg = raw.toLowerCase();
    return msg.includes("hit your chatgpt usage limit") && msg.includes("try again in");
}
function isInstructionsRequiredError(error) {
    return /instructions are required/i.test(error);
}
function isOpenAIReasoningSequenceError(error) {
    var msg = error.toLowerCase();
    return msg.includes("required following item") && msg.includes("reasoning");
}
function isToolNonceRefusal(error) {
    var msg = error.toLowerCase();
    if (!msg.includes("nonce")) {
        return false;
    }
    return (msg.includes("token") ||
        msg.includes("secret") ||
        msg.includes("local file") ||
        msg.includes("disclose") ||
        msg.includes("can't help") ||
        msg.includes("can’t help") ||
        msg.includes("can't comply") ||
        msg.includes("can’t comply"));
}
function isMissingProfileError(error) {
    return /no credentials found for profile/i.test(error);
}
function isEmptyStreamText(text) {
    return text.includes("request ended without sending any chunks");
}
function buildAnthropicRefusalToken() {
    var suffix = (0, node_crypto_1.randomUUID)().replace(/-/g, "");
    return "".concat(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, "_").concat(suffix);
}
function runAnthropicRefusalProbe(params) {
    return __awaiter(this, void 0, void 0, function () {
        var magic, runId, probe, probeText, followupId, followup, followupText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logProgress("".concat(params.label, ": refusal-probe"));
                    magic = buildAnthropicRefusalToken();
                    runId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, params.client.request("agent", {
                            sessionKey: params.sessionKey,
                            idempotencyKey: "idem-".concat(runId, "-refusal"),
                            message: "Reply with the single word ok. Test token: ".concat(magic),
                            thinking: params.thinkingLevel,
                            deliver: false,
                        }, { expectFinal: true })];
                case 1:
                    probe = _a.sent();
                    if ((probe === null || probe === void 0 ? void 0 : probe.status) !== "ok") {
                        throw new Error("refusal probe failed: status=".concat(String(probe === null || probe === void 0 ? void 0 : probe.status)));
                    }
                    probeText = extractPayloadText(probe === null || probe === void 0 ? void 0 : probe.result);
                    assertNoReasoningTags({
                        text: probeText,
                        model: params.modelKey,
                        phase: "refusal-probe",
                        label: params.label,
                    });
                    if (!/\bok\b/i.test(probeText)) {
                        throw new Error("refusal probe missing ok: ".concat(probeText));
                    }
                    followupId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, params.client.request("agent", {
                            sessionKey: params.sessionKey,
                            idempotencyKey: "idem-".concat(followupId, "-refusal-followup"),
                            message: "Now reply with exactly: still ok.",
                            thinking: params.thinkingLevel,
                            deliver: false,
                        }, { expectFinal: true })];
                case 2:
                    followup = _a.sent();
                    if ((followup === null || followup === void 0 ? void 0 : followup.status) !== "ok") {
                        throw new Error("refusal followup failed: status=".concat(String(followup === null || followup === void 0 ? void 0 : followup.status)));
                    }
                    followupText = extractPayloadText(followup === null || followup === void 0 ? void 0 : followup.result);
                    assertNoReasoningTags({
                        text: followupText,
                        model: params.modelKey,
                        phase: "refusal-followup",
                        label: params.label,
                    });
                    if (!/\bstill\b/i.test(followupText) || !/\bok\b/i.test(followupText)) {
                        throw new Error("refusal followup missing expected text: ".concat(followupText));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
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
                            clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.TEST,
                            clientDisplayName: "vitest-live",
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
function buildLiveGatewayConfig(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var providerOverrides = (_a = params.providerOverrides) !== null && _a !== void 0 ? _a : {};
    var lmstudioProvider = (_c = (_b = params.cfg.models) === null || _b === void 0 ? void 0 : _b.providers) === null || _c === void 0 ? void 0 : _c.lmstudio;
    var baseProviders = (_e = (_d = params.cfg.models) === null || _d === void 0 ? void 0 : _d.providers) !== null && _e !== void 0 ? _e : {};
    var nextProviders = __assign(__assign(__assign({}, baseProviders), (lmstudioProvider
        ? {
            lmstudio: __assign(__assign({}, lmstudioProvider), { api: "openai-completions" }),
        }
        : {})), providerOverrides);
    var providers = Object.keys(nextProviders).length > 0 ? nextProviders : baseProviders;
    return __assign(__assign({}, params.cfg), { agents: __assign(__assign({}, params.cfg.agents), { list: ((_g = (_f = params.cfg.agents) === null || _f === void 0 ? void 0 : _f.list) !== null && _g !== void 0 ? _g : []).map(function (entry) { return (__assign(__assign({}, entry), { sandbox: { mode: "off" } })); }), defaults: __assign(__assign({}, (_h = params.cfg.agents) === null || _h === void 0 ? void 0 : _h.defaults), { 
                // Live tests should avoid Docker sandboxing so tool probes can
                // operate on the temporary probe files we create in the host workspace.
                sandbox: { mode: "off" }, models: Object.fromEntries(params.candidates.map(function (m) { return ["".concat(m.provider, "/").concat(m.id), {}]; })) }) }), models: Object.keys(providers).length > 0 ? __assign(__assign({}, params.cfg.models), { providers: providers }) : params.cfg.models });
}
function sanitizeAuthConfig(params) {
    var auth = params.cfg.auth;
    if (!auth) {
        return auth;
    }
    var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
        allowKeychainPrompt: false,
    });
    var profiles;
    if (auth.profiles) {
        profiles = {};
        for (var _i = 0, _a = Object.entries(auth.profiles); _i < _a.length; _i++) {
            var _b = _a[_i], profileId = _b[0], profile = _b[1];
            if (!store.profiles[profileId]) {
                continue;
            }
            profiles[profileId] = profile;
        }
        if (Object.keys(profiles).length === 0) {
            profiles = undefined;
        }
    }
    var order;
    if (auth.order) {
        order = {};
        for (var _c = 0, _d = Object.entries(auth.order); _c < _d.length; _c++) {
            var _e = _d[_c], provider = _e[0], ids = _e[1];
            var filtered = ids.filter(function (id) { return Boolean(store.profiles[id]); });
            if (filtered.length === 0) {
                continue;
            }
            order[provider] = filtered;
        }
        if (Object.keys(order).length === 0) {
            order = undefined;
        }
    }
    if (!profiles && !order && !auth.cooldowns) {
        return undefined;
    }
    return __assign(__assign({}, auth), { profiles: profiles, order: order });
}
function buildMinimaxProviderOverride(params) {
    var _a, _b;
    var existing = (_b = (_a = params.cfg.models) === null || _a === void 0 ? void 0 : _a.providers) === null || _b === void 0 ? void 0 : _b.minimax;
    if (!existing || !Array.isArray(existing.models) || existing.models.length === 0) {
        return null;
    }
    return __assign(__assign({}, existing), { api: params.api, baseUrl: params.baseUrl });
}
function runGatewayModelSuite(params) {
    return __awaiter(this, void 0, void 0, function () {
        var previous, tempAgentDir, tempStateDir, token, agentId, hostAgentDir, hostStore, sanitizedStore, tempSessionAgentDir, workspaceDir, nonceA, nonceB, toolProbePath, agentDir, sanitizedCfg, nextCfg, tempDir, tempConfigPath, port, server, client, anthropicKeys, sessionKey, failures, skippedCount, total, _i, _a, _b, index, model, modelKey, progressLabel, attemptMax, _loop_1, attempt, state_1, preview;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    previous = {
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                        agentDir: process.env.OPENCLAW_AGENT_DIR,
                        piAgentDir: process.env.PI_CODING_AGENT_DIR,
                        stateDir: process.env.OPENCLAW_STATE_DIR,
                    };
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    token = "test-".concat((0, node_crypto_1.randomUUID)());
                    process.env.OPENCLAW_GATEWAY_TOKEN = token;
                    agentId = "dev";
                    hostAgentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    hostStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(hostAgentDir, {
                        allowKeychainPrompt: false,
                    });
                    sanitizedStore = {
                        version: hostStore.version,
                        profiles: __assign({}, hostStore.profiles),
                        // Keep selection state so the gateway picks the same known-good profiles
                        // as the host (important when some profiles are rate-limited/disabled).
                        order: hostStore.order ? __assign({}, hostStore.order) : undefined,
                        lastGood: hostStore.lastGood ? __assign({}, hostStore.lastGood) : undefined,
                        usageStats: hostStore.usageStats ? __assign({}, hostStore.usageStats) : undefined,
                    };
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-live-state-"))];
                case 1:
                    tempStateDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    tempAgentDir = node_path_1.default.join(tempStateDir, "agents", session_key_js_1.DEFAULT_AGENT_ID, "agent");
                    (0, auth_profiles_js_1.saveAuthProfileStore)(sanitizedStore, tempAgentDir);
                    tempSessionAgentDir = node_path_1.default.join(tempStateDir, "agents", agentId, "agent");
                    if (tempSessionAgentDir !== tempAgentDir) {
                        (0, auth_profiles_js_1.saveAuthProfileStore)(sanitizedStore, tempSessionAgentDir);
                    }
                    process.env.OPENCLAW_AGENT_DIR = tempAgentDir;
                    process.env.PI_CODING_AGENT_DIR = tempAgentDir;
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, agentId);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 2:
                    _e.sent();
                    nonceA = (0, node_crypto_1.randomUUID)();
                    nonceB = (0, node_crypto_1.randomUUID)();
                    toolProbePath = node_path_1.default.join(workspaceDir, ".openclaw-live-tool-probe.".concat(nonceA, ".txt"));
                    return [4 /*yield*/, promises_1.default.writeFile(toolProbePath, "nonceA=".concat(nonceA, "\nnonceB=").concat(nonceB, "\n"))];
                case 3:
                    _e.sent();
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    sanitizedCfg = __assign(__assign({}, params.cfg), { auth: sanitizeAuthConfig({ cfg: params.cfg, agentDir: agentDir }) });
                    nextCfg = buildLiveGatewayConfig({
                        cfg: sanitizedCfg,
                        candidates: params.candidates,
                        providerOverrides: params.providerOverrides,
                    });
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-live-"))];
                case 4:
                    tempDir = _e.sent();
                    tempConfigPath = node_path_1.default.join(tempDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(tempConfigPath, "".concat(JSON.stringify(nextCfg, null, 2), "\n"))];
                case 5:
                    _e.sent();
                    process.env.OPENCLAW_CONFIG_PATH = tempConfigPath;
                    return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(nextCfg)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, getFreeGatewayPort()];
                case 7:
                    port = _e.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)(port, {
                            bind: "loopback",
                            auth: { mode: "token", token: token },
                            controlUiEnabled: false,
                        })];
                case 8:
                    server = _e.sent();
                    return [4 /*yield*/, connectClient({
                            url: "ws://127.0.0.1:".concat(port),
                            token: token,
                        })];
                case 9:
                    client = _e.sent();
                    _e.label = 10;
                case 10:
                    _e.trys.push([10, , 17, 25]);
                    logProgress("[".concat(params.label, "] running ").concat(params.candidates.length, " models (thinking=").concat(params.thinkingLevel, ")"));
                    anthropicKeys = (0, live_auth_keys_js_1.collectAnthropicApiKeys)();
                    if (anthropicKeys.length > 0) {
                        process.env.ANTHROPIC_API_KEY = anthropicKeys[0];
                        logProgress("[".concat(params.label, "] anthropic keys loaded: ").concat(anthropicKeys.length));
                    }
                    sessionKey = "agent:".concat(agentId, ":").concat(params.label);
                    failures = [];
                    skippedCount = 0;
                    total = params.candidates.length;
                    _i = 0, _a = params.candidates.entries();
                    _e.label = 11;
                case 11:
                    if (!(_i < _a.length)) return [3 /*break*/, 16];
                    _b = _a[_i], index = _b[0], model = _b[1];
                    modelKey = "".concat(model.provider, "/").concat(model.id);
                    progressLabel = "[".concat(params.label, "] ").concat(index + 1, "/").concat(total, " ").concat(modelKey);
                    attemptMax = model.provider === "anthropic" && anthropicKeys.length > 0 ? anthropicKeys.length : 1;
                    _loop_1 = function (attempt) {
                        var runId, payload, text, retry, runIdTool, toolProbe, toolText, nonceC, toolWritePath, execReadProbe, execReadText, imageCode_1, imageBase64, runIdImage, imageProbe, imageText, candidates, bestDistance, runId2, first, firstText, second, reply, err_1, message;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    if (model.provider === "anthropic" && anthropicKeys.length > 0) {
                                        process.env.ANTHROPIC_API_KEY = anthropicKeys[attempt];
                                    }
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, 18, , 19]);
                                    // Ensure session exists + override model for this run.
                                    // Reset between models: avoids cross-provider transcript incompatibilities
                                    // (notably OpenAI Responses requiring reasoning replay for function_call items).
                                    return [4 /*yield*/, client.request("sessions.reset", {
                                            key: sessionKey,
                                        })];
                                case 2:
                                    // Ensure session exists + override model for this run.
                                    // Reset between models: avoids cross-provider transcript incompatibilities
                                    // (notably OpenAI Responses requiring reasoning replay for function_call items).
                                    _f.sent();
                                    return [4 /*yield*/, client.request("sessions.patch", {
                                            key: sessionKey,
                                            model: modelKey,
                                        })];
                                case 3:
                                    _f.sent();
                                    logProgress("".concat(progressLabel, ": prompt"));
                                    runId = (0, node_crypto_1.randomUUID)();
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat(runId),
                                            message: "Explain in 2-3 sentences how the JavaScript event loop handles microtasks vs macrotasks. Must mention both words: microtask and macrotask.",
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 4:
                                    payload = _f.sent();
                                    if ((payload === null || payload === void 0 ? void 0 : payload.status) !== "ok") {
                                        throw new Error("agent status=".concat(String(payload === null || payload === void 0 ? void 0 : payload.status)));
                                    }
                                    text = extractPayloadText(payload === null || payload === void 0 ? void 0 : payload.result);
                                    if (!!text) return [3 /*break*/, 6];
                                    logProgress("".concat(progressLabel, ": empty response, retrying"));
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat((0, node_crypto_1.randomUUID)(), "-retry"),
                                            message: "Explain in 2-3 sentences how the JavaScript event loop handles microtasks vs macrotasks. Must mention both words: microtask and macrotask.",
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 5:
                                    retry = _f.sent();
                                    if ((retry === null || retry === void 0 ? void 0 : retry.status) !== "ok") {
                                        throw new Error("agent status=".concat(String(retry === null || retry === void 0 ? void 0 : retry.status)));
                                    }
                                    text = extractPayloadText(retry === null || retry === void 0 ? void 0 : retry.result);
                                    _f.label = 6;
                                case 6:
                                    if (!text && isGoogleishProvider(model.provider)) {
                                        logProgress("".concat(progressLabel, ": skip (google empty response)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (isEmptyStreamText(text) &&
                                        (model.provider === "minimax" || model.provider === "openai-codex")) {
                                        logProgress("".concat(progressLabel, ": skip (").concat(model.provider, " empty response)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (isGoogleishProvider(model.provider) && isGoogleModelNotFoundText(text)) {
                                        // Catalog drift: model IDs can disappear or become unavailable on the API.
                                        // Treat as skip when scanning "all models" for Google.
                                        logProgress("".concat(progressLabel, ": skip (google model not found)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    assertNoReasoningTags({
                                        text: text,
                                        model: modelKey,
                                        phase: "prompt",
                                        label: params.label,
                                    });
                                    if (!isMeaningful(text)) {
                                        if (isGoogleishProvider(model.provider) && /gemini/i.test(model.id)) {
                                            logProgress("".concat(progressLabel, ": skip (google not meaningful)"));
                                            return [2 /*return*/, "break"];
                                        }
                                        throw new Error("not meaningful: ".concat(text));
                                    }
                                    if (!/\bmicro\s*-?\s*tasks?\b/i.test(text) || !/\bmacro\s*-?\s*tasks?\b/i.test(text)) {
                                        throw new Error("missing required keywords: ".concat(text));
                                    }
                                    // Real tool invocation: force the agent to Read a local file and echo a nonce.
                                    logProgress("".concat(progressLabel, ": tool-read"));
                                    runIdTool = (0, node_crypto_1.randomUUID)();
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat(runIdTool, "-tool"),
                                            message: "OpenClaw live tool probe (local, safe): " +
                                                "use the tool named `read` (or `Read`) with JSON arguments {\"path\":\"".concat(toolProbePath, "\"}. ") +
                                                "Then reply with the two nonce values you read (include both).",
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 7:
                                    toolProbe = _f.sent();
                                    if ((toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.status) !== "ok") {
                                        throw new Error("tool probe failed: status=".concat(String(toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.status)));
                                    }
                                    toolText = extractPayloadText(toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.result);
                                    if (isEmptyStreamText(toolText) &&
                                        (model.provider === "minimax" || model.provider === "openai-codex")) {
                                        logProgress("".concat(progressLabel, ": skip (").concat(model.provider, " empty response)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    assertNoReasoningTags({
                                        text: toolText,
                                        model: modelKey,
                                        phase: "tool-read",
                                        label: params.label,
                                    });
                                    if (!toolText.includes(nonceA) || !toolText.includes(nonceB)) {
                                        throw new Error("tool probe missing nonce: ".concat(toolText));
                                    }
                                    if (!params.extraToolProbes) return [3 /*break*/, 10];
                                    logProgress("".concat(progressLabel, ": tool-exec"));
                                    nonceC = (0, node_crypto_1.randomUUID)();
                                    toolWritePath = node_path_1.default.join(tempDir, "write-".concat(runIdTool, ".txt"));
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat(runIdTool, "-exec-read"),
                                            message: "OpenClaw live tool probe (local, safe): " +
                                                "use the tool named `exec` (or `Exec`) to run this command: " +
                                                "mkdir -p \"".concat(tempDir, "\" && printf '%s' '").concat(nonceC, "' > \"").concat(toolWritePath, "\". ") +
                                                "Then use the tool named `read` (or `Read`) with JSON arguments {\"path\":\"".concat(toolWritePath, "\"}. ") +
                                                "Finally reply including the nonce text you read back.",
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 8:
                                    execReadProbe = _f.sent();
                                    if ((execReadProbe === null || execReadProbe === void 0 ? void 0 : execReadProbe.status) !== "ok") {
                                        throw new Error("exec+read probe failed: status=".concat(String(execReadProbe === null || execReadProbe === void 0 ? void 0 : execReadProbe.status)));
                                    }
                                    execReadText = extractPayloadText(execReadProbe === null || execReadProbe === void 0 ? void 0 : execReadProbe.result);
                                    if (isEmptyStreamText(execReadText) &&
                                        (model.provider === "minimax" || model.provider === "openai-codex")) {
                                        logProgress("".concat(progressLabel, ": skip (").concat(model.provider, " empty response)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    assertNoReasoningTags({
                                        text: execReadText,
                                        model: modelKey,
                                        phase: "tool-exec",
                                        label: params.label,
                                    });
                                    if (!execReadText.includes(nonceC)) {
                                        throw new Error("exec+read probe missing nonce: ".concat(execReadText));
                                    }
                                    return [4 /*yield*/, promises_1.default.rm(toolWritePath, { force: true })];
                                case 9:
                                    _f.sent();
                                    _f.label = 10;
                                case 10:
                                    if (!(params.extraImageProbes && ((_c = model.input) === null || _c === void 0 ? void 0 : _c.includes("image")))) return [3 /*break*/, 12];
                                    logProgress("".concat(progressLabel, ": image"));
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
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 11:
                                    imageProbe = _f.sent();
                                    // Best-effort: do not fail the whole live suite on flaky image handling.
                                    // (We still keep prompt + tool probes as hard checks.)
                                    if ((imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.status) !== "ok") {
                                        logProgress("".concat(progressLabel, ": image skip (status=").concat(String(imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.status), ")"));
                                    }
                                    else {
                                        imageText = extractPayloadText(imageProbe === null || imageProbe === void 0 ? void 0 : imageProbe.result);
                                        if (isEmptyStreamText(imageText) &&
                                            (model.provider === "minimax" || model.provider === "openai-codex")) {
                                            logProgress("".concat(progressLabel, ": image skip (").concat(model.provider, " empty response)"));
                                        }
                                        else {
                                            assertNoReasoningTags({
                                                text: imageText,
                                                model: modelKey,
                                                phase: "image",
                                                label: params.label,
                                            });
                                            if (!/\bcat\b/i.test(imageText)) {
                                                logProgress("".concat(progressLabel, ": image skip (missing 'cat')"));
                                            }
                                            else {
                                                candidates = (_d = imageText.toUpperCase().match(/[A-Z0-9]{6,20}/g)) !== null && _d !== void 0 ? _d : [];
                                                bestDistance = candidates.reduce(function (best, cand) {
                                                    if (Math.abs(cand.length - imageCode_1.length) > 2) {
                                                        return best;
                                                    }
                                                    return Math.min(best, editDistance(cand, imageCode_1));
                                                }, Number.POSITIVE_INFINITY);
                                                // OCR / image-read flake: allow a small edit distance, but still require the "cat" token above.
                                                if (!(bestDistance <= 3)) {
                                                    logProgress("".concat(progressLabel, ": image skip (code mismatch)"));
                                                }
                                            }
                                        }
                                    }
                                    _f.label = 12;
                                case 12:
                                    if (!((model.provider === "openai" && model.api === "openai-responses") ||
                                        (model.provider === "openai-codex" && model.api === "openai-codex-responses"))) return [3 /*break*/, 15];
                                    logProgress("".concat(progressLabel, ": tool-only regression"));
                                    runId2 = (0, node_crypto_1.randomUUID)();
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat(runId2, "-1"),
                                            message: "Call the tool named `read` (or `Read`) on \"".concat(toolProbePath, "\". Do not write any other text."),
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 13:
                                    first = _f.sent();
                                    if ((first === null || first === void 0 ? void 0 : first.status) !== "ok") {
                                        throw new Error("tool-only turn failed: status=".concat(String(first === null || first === void 0 ? void 0 : first.status)));
                                    }
                                    firstText = extractPayloadText(first === null || first === void 0 ? void 0 : first.result);
                                    assertNoReasoningTags({
                                        text: firstText,
                                        model: modelKey,
                                        phase: "tool-only",
                                        label: params.label,
                                    });
                                    return [4 /*yield*/, client.request("agent", {
                                            sessionKey: sessionKey,
                                            idempotencyKey: "idem-".concat(runId2, "-2"),
                                            message: "Now answer: what are the values of nonceA and nonceB in \"".concat(toolProbePath, "\"? Reply with exactly: ").concat(nonceA, " ").concat(nonceB, "."),
                                            thinking: params.thinkingLevel,
                                            deliver: false,
                                        }, { expectFinal: true })];
                                case 14:
                                    second = _f.sent();
                                    if ((second === null || second === void 0 ? void 0 : second.status) !== "ok") {
                                        throw new Error("post-tool message failed: status=".concat(String(second === null || second === void 0 ? void 0 : second.status)));
                                    }
                                    reply = extractPayloadText(second === null || second === void 0 ? void 0 : second.result);
                                    assertNoReasoningTags({
                                        text: reply,
                                        model: modelKey,
                                        phase: "tool-only-followup",
                                        label: params.label,
                                    });
                                    if (!reply.includes(nonceA) || !reply.includes(nonceB)) {
                                        throw new Error("unexpected reply: ".concat(reply));
                                    }
                                    _f.label = 15;
                                case 15:
                                    if (!(model.provider === "anthropic")) return [3 /*break*/, 17];
                                    return [4 /*yield*/, runAnthropicRefusalProbe({
                                            client: client,
                                            sessionKey: sessionKey,
                                            modelKey: modelKey,
                                            label: progressLabel,
                                            thinkingLevel: params.thinkingLevel,
                                        })];
                                case 16:
                                    _f.sent();
                                    _f.label = 17;
                                case 17:
                                    logProgress("".concat(progressLabel, ": done"));
                                    return [2 /*return*/, "break"];
                                case 18:
                                    err_1 = _f.sent();
                                    message = String(err_1);
                                    if (model.provider === "anthropic" &&
                                        (0, live_auth_keys_js_1.isAnthropicRateLimitError)(message) &&
                                        attempt + 1 < attemptMax) {
                                        logProgress("".concat(progressLabel, ": rate limit, retrying with next key"));
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (model.provider === "anthropic" && (0, live_auth_keys_js_1.isAnthropicBillingError)(message)) {
                                        if (attempt + 1 < attemptMax) {
                                            logProgress("".concat(progressLabel, ": billing issue, retrying with next key"));
                                            return [2 /*return*/, "continue"];
                                        }
                                        logProgress("".concat(progressLabel, ": skip (anthropic billing)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (model.provider === "anthropic" &&
                                        isEmptyStreamText(message) &&
                                        attempt + 1 < attemptMax) {
                                        logProgress("".concat(progressLabel, ": empty response, retrying with next key"));
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (model.provider === "anthropic" && isEmptyStreamText(message)) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (anthropic empty response)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    // OpenAI Codex refresh tokens can become single-use; skip instead of failing all live tests.
                                    if (model.provider === "openai-codex" && isRefreshTokenReused(message)) {
                                        logProgress("".concat(progressLabel, ": skip (codex refresh token reused)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (model.provider === "openai-codex" && isChatGPTUsageLimitErrorMessage(message)) {
                                        logProgress("".concat(progressLabel, ": skip (chatgpt usage limit)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (model.provider === "openai-codex" && isInstructionsRequiredError(message)) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (instructions required)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if ((model.provider === "openai" || model.provider === "openai-codex") &&
                                        isOpenAIReasoningSequenceError(message)) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (openai reasoning sequence error)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if ((model.provider === "openai" || model.provider === "openai-codex") &&
                                        isToolNonceRefusal(message)) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (tool probe refusal)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (isMissingProfileError(message)) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (missing auth profile)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    if (params.label.startsWith("minimax-")) {
                                        skippedCount += 1;
                                        logProgress("".concat(progressLabel, ": skip (minimax endpoint error)"));
                                        return [2 /*return*/, "break"];
                                    }
                                    logProgress("".concat(progressLabel, ": failed"));
                                    failures.push({ model: modelKey, error: message });
                                    return [2 /*return*/, "break"];
                                case 19: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _e.label = 12;
                case 12:
                    if (!(attempt < attemptMax)) return [3 /*break*/, 15];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 13:
                    state_1 = _e.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 15];
                    _e.label = 14;
                case 14:
                    attempt += 1;
                    return [3 /*break*/, 12];
                case 15:
                    _i++;
                    return [3 /*break*/, 11];
                case 16:
                    if (failures.length > 0) {
                        preview = failures
                            .slice(0, 20)
                            .map(function (f) { return "- ".concat(f.model, ": ").concat(f.error); })
                            .join("\n");
                        throw new Error("gateway live model failures (".concat(failures.length, "):\n").concat(preview));
                    }
                    if (skippedCount === total) {
                        logProgress("[".concat(params.label, "] skipped all models (missing profiles)"));
                    }
                    return [3 /*break*/, 25];
                case 17:
                    client.stop();
                    return [4 /*yield*/, server.close({ reason: "live test complete" })];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.rm(toolProbePath, { force: true })];
                case 19:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 20:
                    _e.sent();
                    if (!tempAgentDir) return [3 /*break*/, 22];
                    return [4 /*yield*/, promises_1.default.rm(tempAgentDir, { recursive: true, force: true })];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22:
                    if (!tempStateDir) return [3 /*break*/, 24];
                    return [4 /*yield*/, promises_1.default.rm(tempStateDir, { recursive: true, force: true })];
                case 23:
                    _e.sent();
                    _e.label = 24;
                case 24:
                    process.env.OPENCLAW_CONFIG_PATH = previous.configPath;
                    process.env.OPENCLAW_GATEWAY_TOKEN = previous.token;
                    process.env.OPENCLAW_SKIP_CHANNELS = previous.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = previous.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = previous.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = previous.skipCanvas;
                    process.env.OPENCLAW_AGENT_DIR = previous.agentDir;
                    process.env.PI_CODING_AGENT_DIR = previous.piAgentDir;
                    process.env.OPENCLAW_STATE_DIR = previous.stateDir;
                    return [7 /*endfinally*/];
                case 25: return [2 /*return*/];
            }
        });
    });
}
describeLive("gateway live (dev agent, profile keys)", function () {
    (0, vitest_1.it)("runs meaningful prompts across models with available keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, agentDir, authStore, authStorage, modelRegistry, all, rawModels, useModern, useExplicit, filter, wanted, candidates, _i, wanted_1, model, apiKeyInfo, _a, imageCandidates, minimaxCandidates, minimaxAnthropic;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg)];
                case 1:
                    _c.sent();
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                        allowKeychainPrompt: false,
                    });
                    authStorage = (0, pi_model_discovery_js_1.discoverAuthStorage)(agentDir);
                    modelRegistry = (0, pi_model_discovery_js_1.discoverModels)(authStorage, agentDir);
                    all = modelRegistry.getAll();
                    rawModels = (_b = process.env.OPENCLAW_LIVE_GATEWAY_MODELS) === null || _b === void 0 ? void 0 : _b.trim();
                    useModern = !rawModels || rawModels === "modern" || rawModels === "all";
                    useExplicit = Boolean(rawModels) && !useModern;
                    filter = useExplicit ? parseFilter(rawModels) : null;
                    wanted = filter
                        ? all.filter(function (m) { return filter.has("".concat(m.provider, "/").concat(m.id)); })
                        : all.filter(function (m) { return (0, live_model_filter_js_1.isModernModelRef)({ provider: m.provider, id: m.id }); });
                    candidates = [];
                    _i = 0, wanted_1 = wanted;
                    _c.label = 2;
                case 2:
                    if (!(_i < wanted_1.length)) return [3 /*break*/, 7];
                    model = wanted_1[_i];
                    if (PROVIDERS && !PROVIDERS.has(model.provider)) {
                        return [3 /*break*/, 6];
                    }
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, model_auth_js_1.getApiKeyForModel)({
                            model: model,
                            cfg: cfg,
                            store: authStore,
                            agentDir: agentDir,
                        })];
                case 4:
                    apiKeyInfo = _c.sent();
                    if (!apiKeyInfo.source.startsWith("profile:")) {
                        return [3 /*break*/, 6];
                    }
                    candidates.push(model);
                    return [3 /*break*/, 6];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (candidates.length === 0) {
                        logProgress("[all-models] no API keys found; skipping");
                        return [2 /*return*/];
                    }
                    logProgress("[all-models] selection=".concat(useExplicit ? "explicit" : "modern"));
                    imageCandidates = candidates.filter(function (m) { var _a; return (_a = m.input) === null || _a === void 0 ? void 0 : _a.includes("image"); });
                    if (imageCandidates.length === 0) {
                        logProgress("[all-models] no image-capable models selected; image probe will be skipped");
                    }
                    return [4 /*yield*/, runGatewayModelSuite({
                            label: "all-models",
                            cfg: cfg,
                            candidates: candidates,
                            extraToolProbes: true,
                            extraImageProbes: true,
                            thinkingLevel: THINKING_LEVEL,
                        })];
                case 8:
                    _c.sent();
                    minimaxCandidates = candidates.filter(function (model) { return model.provider === "minimax"; });
                    if (minimaxCandidates.length === 0) {
                        logProgress("[minimax] no candidates with keys; skipping dual endpoint probes");
                        return [2 /*return*/];
                    }
                    minimaxAnthropic = buildMinimaxProviderOverride({
                        cfg: cfg,
                        api: "anthropic-messages",
                        baseUrl: "https://api.minimax.io/anthropic",
                    });
                    if (!minimaxAnthropic) return [3 /*break*/, 10];
                    return [4 /*yield*/, runGatewayModelSuite({
                            label: "minimax-anthropic",
                            cfg: cfg,
                            candidates: minimaxCandidates,
                            extraToolProbes: true,
                            extraImageProbes: true,
                            thinkingLevel: THINKING_LEVEL,
                            providerOverrides: { minimax: minimaxAnthropic },
                        })];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 11];
                case 10:
                    logProgress("[minimax-anthropic] missing minimax provider config; skipping");
                    _c.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); }, 20 * 60 * 1000);
    (0, vitest_1.it)("z.ai fallback handles anthropic tool history", function () { return __awaiter(void 0, void 0, void 0, function () {
        var previous, token, cfg, agentDir, authStorage, modelRegistry, anthropic, zai, _a, agentId, workspaceDir, nonceA, nonceB, toolProbePath, port, server, client, sessionKey, runId, toolProbe, toolText, followupId, followup, followupText;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!ZAI_FALLBACK) {
                        return [2 /*return*/];
                    }
                    previous = {
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                    };
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    token = "test-".concat((0, node_crypto_1.randomUUID)());
                    process.env.OPENCLAW_GATEWAY_TOKEN = token;
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg)];
                case 1:
                    _c.sent();
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    authStorage = (0, pi_model_discovery_js_1.discoverAuthStorage)(agentDir);
                    modelRegistry = (0, pi_model_discovery_js_1.discoverModels)(authStorage, agentDir);
                    anthropic = modelRegistry.find("anthropic", "claude-opus-4-5");
                    zai = modelRegistry.find("zai", "glm-4.7");
                    if (!anthropic || !zai) {
                        return [2 /*return*/];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, model_auth_js_1.getApiKeyForModel)({ model: anthropic, cfg: cfg })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, model_auth_js_1.getApiKeyForModel)({ model: zai, cfg: cfg })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _c.sent();
                    return [2 /*return*/];
                case 6:
                    agentId = "dev";
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 7:
                    _c.sent();
                    nonceA = (0, node_crypto_1.randomUUID)();
                    nonceB = (0, node_crypto_1.randomUUID)();
                    toolProbePath = node_path_1.default.join(workspaceDir, ".openclaw-live-zai-fallback.".concat(nonceA, ".txt"));
                    return [4 /*yield*/, promises_1.default.writeFile(toolProbePath, "nonceA=".concat(nonceA, "\nnonceB=").concat(nonceB, "\n"))];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, getFreeGatewayPort()];
                case 9:
                    port = _c.sent();
                    return [4 /*yield*/, (0, server_js_1.startGatewayServer)({
                            configPath: (_b = cfg.__meta) === null || _b === void 0 ? void 0 : _b.path,
                            port: port,
                            token: token,
                        })];
                case 10:
                    server = _c.sent();
                    return [4 /*yield*/, connectClient({
                            url: "ws://127.0.0.1:".concat(port),
                            token: token,
                        })];
                case 11:
                    client = _c.sent();
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, , 18, 21]);
                    sessionKey = "agent:".concat(agentId, ":live-zai-fallback");
                    return [4 /*yield*/, client.request("sessions.patch", {
                            key: sessionKey,
                            model: "anthropic/claude-opus-4-5",
                        })];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, client.request("sessions.reset", {
                            key: sessionKey,
                        })];
                case 14:
                    _c.sent();
                    runId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(runId, "-tool"),
                            message: "Call the tool named `read` (or `Read` if `read` is unavailable) with JSON arguments {\"path\":\"".concat(toolProbePath, "\"}. ") +
                                "Then reply with exactly: ".concat(nonceA, " ").concat(nonceB, ". No extra text."),
                            thinking: THINKING_LEVEL,
                            deliver: false,
                        }, { expectFinal: true })];
                case 15:
                    toolProbe = _c.sent();
                    if ((toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.status) !== "ok") {
                        throw new Error("anthropic tool probe failed: status=".concat(String(toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.status)));
                    }
                    toolText = extractPayloadText(toolProbe === null || toolProbe === void 0 ? void 0 : toolProbe.result);
                    assertNoReasoningTags({
                        text: toolText,
                        model: "anthropic/claude-opus-4-5",
                        phase: "zai-fallback-tool",
                        label: "zai-fallback",
                    });
                    if (!toolText.includes(nonceA) || !toolText.includes(nonceB)) {
                        throw new Error("anthropic tool probe missing nonce: ".concat(toolText));
                    }
                    return [4 /*yield*/, client.request("sessions.patch", {
                            key: sessionKey,
                            model: "zai/glm-4.7",
                        })];
                case 16:
                    _c.sent();
                    followupId = (0, node_crypto_1.randomUUID)();
                    return [4 /*yield*/, client.request("agent", {
                            sessionKey: sessionKey,
                            idempotencyKey: "idem-".concat(followupId, "-followup"),
                            message: "What are the values of nonceA and nonceB in \"".concat(toolProbePath, "\"? ") +
                                "Reply with exactly: ".concat(nonceA, " ").concat(nonceB, "."),
                            thinking: THINKING_LEVEL,
                            deliver: false,
                        }, { expectFinal: true })];
                case 17:
                    followup = _c.sent();
                    if ((followup === null || followup === void 0 ? void 0 : followup.status) !== "ok") {
                        throw new Error("zai followup failed: status=".concat(String(followup === null || followup === void 0 ? void 0 : followup.status)));
                    }
                    followupText = extractPayloadText(followup === null || followup === void 0 ? void 0 : followup.result);
                    assertNoReasoningTags({
                        text: followupText,
                        model: "zai/glm-4.7",
                        phase: "zai-fallback-followup",
                        label: "zai-fallback",
                    });
                    if (!followupText.includes(nonceA) || !followupText.includes(nonceB)) {
                        throw new Error("zai followup missing nonce: ".concat(followupText));
                    }
                    return [3 /*break*/, 21];
                case 18:
                    client.stop();
                    return [4 /*yield*/, server.close({ reason: "live test complete" })];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.rm(toolProbePath, { force: true })];
                case 20:
                    _c.sent();
                    process.env.OPENCLAW_CONFIG_PATH = previous.configPath;
                    process.env.OPENCLAW_GATEWAY_TOKEN = previous.token;
                    process.env.OPENCLAW_SKIP_CHANNELS = previous.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = previous.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = previous.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = previous.skipCanvas;
                    return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    }); }, 180000);
});
