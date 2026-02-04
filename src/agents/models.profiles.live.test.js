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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var pi_ai_1 = require("@mariozechner/pi-ai");
var typebox_1 = require("@sinclair/typebox");
var vitest_1 = require("vitest");
var config_js_1 = require("../config/config.js");
var env_js_1 = require("../infra/env.js");
var agent_paths_js_1 = require("./agent-paths.js");
var live_auth_keys_js_1 = require("./live-auth-keys.js");
var live_model_filter_js_1 = require("./live-model-filter.js");
var model_auth_js_1 = require("./model-auth.js");
var models_config_js_1 = require("./models-config.js");
var errors_js_1 = require("./pi-embedded-helpers/errors.js");
var pi_model_discovery_js_1 = require("./pi-model-discovery.js");
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.LIVE) || (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_TEST);
var DIRECT_ENABLED = Boolean((_a = process.env.OPENCLAW_LIVE_MODELS) === null || _a === void 0 ? void 0 : _a.trim());
var REQUIRE_PROFILE_KEYS = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_REQUIRE_PROFILE_KEYS);
var describeLive = LIVE ? vitest_1.describe : vitest_1.describe.skip;
function parseProviderFilter(raw) {
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
function parseModelFilter(raw) {
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
function isGoogleModelNotFoundError(err) {
    var msg = String(err);
    if (!/not found/i.test(msg)) {
        return false;
    }
    if (/models\/.+ is not found for api version/i.test(msg)) {
        return true;
    }
    if (/"status"\\s*:\\s*"NOT_FOUND"/.test(msg)) {
        return true;
    }
    if (/"code"\\s*:\\s*404/.test(msg)) {
        return true;
    }
    return false;
}
function isModelNotFoundErrorMessage(raw) {
    var msg = raw.trim();
    if (!msg) {
        return false;
    }
    if (/\b404\b/.test(msg) && /not[_-]?found/i.test(msg)) {
        return true;
    }
    if (/not_found_error/i.test(msg)) {
        return true;
    }
    if (/model:\s*[a-z0-9._-]+/i.test(msg) && /not[_-]?found/i.test(msg)) {
        return true;
    }
    return false;
}
function isChatGPTUsageLimitErrorMessage(raw) {
    var msg = raw.toLowerCase();
    return msg.includes("hit your chatgpt usage limit") && msg.includes("try again in");
}
function isInstructionsRequiredError(raw) {
    return /instructions are required/i.test(raw);
}
function toInt(value, fallback) {
    var trimmed = value === null || value === void 0 ? void 0 : value.trim();
    if (!trimmed) {
        return fallback;
    }
    var parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}
function resolveTestReasoning(model) {
    if (!model.reasoning) {
        return undefined;
    }
    var id = model.id.toLowerCase();
    if (model.provider === "openai" || model.provider === "openai-codex") {
        if (id.includes("pro")) {
            return "high";
        }
        return "medium";
    }
    return "low";
}
function completeSimpleWithTimeout(model, context, options, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, Math.max(1, timeoutMs));
                    (_a = timer.unref) === null || _a === void 0 ? void 0 : _a.call(timer);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, pi_ai_1.completeSimple)(model, context, __assign(__assign({}, options), { signal: controller.signal }))];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function completeOkWithRetry(params) {
    return __awaiter(this, void 0, void 0, function () {
        var runOnce, first;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runOnce = function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, text;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, completeSimpleWithTimeout(params.model, {
                                        messages: [
                                            {
                                                role: "user",
                                                content: "Reply with the word ok.",
                                                timestamp: Date.now(),
                                            },
                                        ],
                                    }, {
                                        apiKey: params.apiKey,
                                        reasoning: resolveTestReasoning(params.model),
                                        maxTokens: 64,
                                    }, params.timeoutMs)];
                                case 1:
                                    res = _a.sent();
                                    text = res.content
                                        .filter(function (block) { return block.type === "text"; })
                                        .map(function (block) { return block.text.trim(); })
                                        .join(" ");
                                    return [2 /*return*/, { res: res, text: text }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, runOnce()];
                case 1:
                    first = _a.sent();
                    if (first.text.length > 0) {
                        return [2 /*return*/, first];
                    }
                    return [4 /*yield*/, runOnce()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
describeLive("live models (profile keys)", function () {
    (0, vitest_1.it)("completes across selected models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, anthropicKeys, agentDir, authStorage, modelRegistry, models, rawModels, useModern, useExplicit, filter, allowNotFoundSkip, providers, perModelTimeoutMs, failures, skipped, candidates, _i, models_1, model, id, apiKeyInfo, err_1, total, _a, _b, _c, index, entry, model, apiKeyInfo, id, progressLabel, attemptMax, attempt, apiKey, noopTool, firstUserContent, firstUser, first, toolCall, firstText, i, second, secondText, ok, msg, err_2, message, preview;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg)];
                case 1:
                    _f.sent();
                    if (!DIRECT_ENABLED) {
                        logProgress("[live-models] skipping (set OPENCLAW_LIVE_MODELS=modern|all|<list>; all=modern)");
                        return [2 /*return*/];
                    }
                    anthropicKeys = (0, live_auth_keys_js_1.collectAnthropicApiKeys)();
                    if (anthropicKeys.length > 0) {
                        process.env.ANTHROPIC_API_KEY = anthropicKeys[0];
                        logProgress("[live-models] anthropic keys loaded: ".concat(anthropicKeys.length));
                    }
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    authStorage = (0, pi_model_discovery_js_1.discoverAuthStorage)(agentDir);
                    modelRegistry = (0, pi_model_discovery_js_1.discoverModels)(authStorage, agentDir);
                    models = modelRegistry.getAll();
                    rawModels = (_d = process.env.OPENCLAW_LIVE_MODELS) === null || _d === void 0 ? void 0 : _d.trim();
                    useModern = rawModels === "modern" || rawModels === "all";
                    useExplicit = Boolean(rawModels) && !useModern;
                    filter = useExplicit ? parseModelFilter(rawModels) : null;
                    allowNotFoundSkip = useModern;
                    providers = parseProviderFilter(process.env.OPENCLAW_LIVE_PROVIDERS);
                    perModelTimeoutMs = toInt(process.env.OPENCLAW_LIVE_MODEL_TIMEOUT_MS, 30000);
                    failures = [];
                    skipped = [];
                    candidates = [];
                    _i = 0, models_1 = models;
                    _f.label = 2;
                case 2:
                    if (!(_i < models_1.length)) return [3 /*break*/, 7];
                    model = models_1[_i];
                    if (providers && !providers.has(model.provider)) {
                        return [3 /*break*/, 6];
                    }
                    id = "".concat(model.provider, "/").concat(model.id);
                    if (filter && !filter.has(id)) {
                        return [3 /*break*/, 6];
                    }
                    if (!filter && useModern) {
                        if (!(0, live_model_filter_js_1.isModernModelRef)({ provider: model.provider, id: model.id })) {
                            return [3 /*break*/, 6];
                        }
                    }
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, model_auth_js_1.getApiKeyForModel)({ model: model, cfg: cfg })];
                case 4:
                    apiKeyInfo = _f.sent();
                    if (REQUIRE_PROFILE_KEYS && !apiKeyInfo.source.startsWith("profile:")) {
                        skipped.push({
                            model: id,
                            reason: "non-profile credential source: ".concat(apiKeyInfo.source),
                        });
                        return [3 /*break*/, 6];
                    }
                    candidates.push({ model: model, apiKeyInfo: apiKeyInfo });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _f.sent();
                    skipped.push({ model: id, reason: String(err_1) });
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (candidates.length === 0) {
                        logProgress("[live-models] no API keys found; skipping");
                        return [2 /*return*/];
                    }
                    logProgress("[live-models] selection=".concat(useExplicit ? "explicit" : "modern"));
                    logProgress("[live-models] running ".concat(candidates.length, " models"));
                    total = candidates.length;
                    _a = 0, _b = candidates.entries();
                    _f.label = 8;
                case 8:
                    if (!(_a < _b.length)) return [3 /*break*/, 22];
                    _c = _b[_a], index = _c[0], entry = _c[1];
                    model = entry.model, apiKeyInfo = entry.apiKeyInfo;
                    id = "".concat(model.provider, "/").concat(model.id);
                    progressLabel = "[live-models] ".concat(index + 1, "/").concat(total, " ").concat(id);
                    attemptMax = model.provider === "anthropic" && anthropicKeys.length > 0 ? anthropicKeys.length : 1;
                    attempt = 0;
                    _f.label = 9;
                case 9:
                    if (!(attempt < attemptMax)) return [3 /*break*/, 21];
                    if (model.provider === "anthropic" && anthropicKeys.length > 0) {
                        process.env.ANTHROPIC_API_KEY = anthropicKeys[attempt];
                    }
                    apiKey = model.provider === "anthropic" && anthropicKeys.length > 0
                        ? anthropicKeys[attempt]
                        : (0, model_auth_js_1.requireApiKey)(apiKeyInfo, model.provider);
                    _f.label = 10;
                case 10:
                    _f.trys.push([10, 19, , 20]);
                    if (!(model.provider === "openai" &&
                        model.api === "openai-responses" &&
                        model.id === "gpt-5.2")) return [3 /*break*/, 17];
                    logProgress("".concat(progressLabel, ": tool-only regression"));
                    noopTool = {
                        name: "noop",
                        description: "Return ok.",
                        parameters: typebox_1.Type.Object({}, { additionalProperties: false }),
                    };
                    firstUserContent = "Call the tool `noop` with {}. Do not write any other text.";
                    firstUser = {
                        role: "user",
                        content: firstUserContent,
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, completeSimpleWithTimeout(model, { messages: [firstUser], tools: [noopTool] }, {
                            apiKey: apiKey,
                            reasoning: resolveTestReasoning(model),
                            maxTokens: 128,
                        }, perModelTimeoutMs)];
                case 11:
                    first = _f.sent();
                    toolCall = first.content.find(function (b) { return b.type === "toolCall"; });
                    firstText = first.content
                        .filter(function (b) { return b.type === "text"; })
                        .map(function (b) { return b.text.trim(); })
                        .join(" ")
                        .trim();
                    i = 0;
                    _f.label = 12;
                case 12:
                    if (!(i < 2 && (!toolCall || firstText.length > 0))) return [3 /*break*/, 15];
                    firstUserContent =
                        "Call the tool `noop` with {}. IMPORTANT: respond ONLY with the tool call; no other text.";
                    firstUser = {
                        role: "user",
                        content: firstUserContent,
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, completeSimpleWithTimeout(model, { messages: [firstUser], tools: [noopTool] }, {
                            apiKey: apiKey,
                            reasoning: resolveTestReasoning(model),
                            maxTokens: 128,
                        }, perModelTimeoutMs)];
                case 13:
                    first = _f.sent();
                    toolCall = first.content.find(function (b) { return b.type === "toolCall"; });
                    firstText = first.content
                        .filter(function (b) { return b.type === "text"; })
                        .map(function (b) { return b.text.trim(); })
                        .join(" ")
                        .trim();
                    _f.label = 14;
                case 14:
                    i += 1;
                    return [3 /*break*/, 12];
                case 15:
                    (0, vitest_1.expect)(toolCall).toBeTruthy();
                    (0, vitest_1.expect)(firstText.length).toBe(0);
                    if (!toolCall || toolCall.type !== "toolCall") {
                        throw new Error("expected tool call");
                    }
                    return [4 /*yield*/, completeSimpleWithTimeout(model, {
                            messages: [
                                firstUser,
                                first,
                                {
                                    role: "toolResult",
                                    toolCallId: toolCall.id,
                                    toolName: "noop",
                                    content: [{ type: "text", text: "ok" }],
                                    isError: false,
                                    timestamp: Date.now(),
                                },
                                {
                                    role: "user",
                                    content: "Reply with the word ok.",
                                    timestamp: Date.now(),
                                },
                            ],
                        }, {
                            apiKey: apiKey,
                            reasoning: resolveTestReasoning(model),
                            // Headroom: reasoning summary can consume most of the output budget.
                            maxTokens: 256,
                        }, perModelTimeoutMs)];
                case 16:
                    second = _f.sent();
                    secondText = second.content
                        .filter(function (b) { return b.type === "text"; })
                        .map(function (b) { return b.text.trim(); })
                        .join(" ");
                    (0, vitest_1.expect)(secondText.length).toBeGreaterThan(0);
                    logProgress("".concat(progressLabel, ": done"));
                    return [3 /*break*/, 21];
                case 17:
                    logProgress("".concat(progressLabel, ": prompt"));
                    return [4 /*yield*/, completeOkWithRetry({
                            model: model,
                            apiKey: apiKey,
                            timeoutMs: perModelTimeoutMs,
                        })];
                case 18:
                    ok = _f.sent();
                    if (ok.res.stopReason === "error") {
                        msg = (_e = ok.res.errorMessage) !== null && _e !== void 0 ? _e : "";
                        if (allowNotFoundSkip && isModelNotFoundErrorMessage(msg)) {
                            skipped.push({ model: id, reason: msg });
                            logProgress("".concat(progressLabel, ": skip (model not found)"));
                            return [3 /*break*/, 21];
                        }
                        throw new Error(msg || "model returned error with no message");
                    }
                    if (ok.text.length === 0 && model.provider === "google") {
                        skipped.push({
                            model: id,
                            reason: "no text returned (likely unavailable model id)",
                        });
                        logProgress("".concat(progressLabel, ": skip (google model not found)"));
                        return [3 /*break*/, 21];
                    }
                    if (ok.text.length === 0 &&
                        (model.provider === "openrouter" || model.provider === "opencode")) {
                        skipped.push({
                            model: id,
                            reason: "no text returned (provider returned empty content)",
                        });
                        logProgress("".concat(progressLabel, ": skip (empty response)"));
                        return [3 /*break*/, 21];
                    }
                    if (ok.text.length === 0 &&
                        allowNotFoundSkip &&
                        (model.provider === "google-antigravity" || model.provider === "openai-codex")) {
                        skipped.push({
                            model: id,
                            reason: "no text returned (provider returned empty content)",
                        });
                        logProgress("".concat(progressLabel, ": skip (empty response)"));
                        return [3 /*break*/, 21];
                    }
                    (0, vitest_1.expect)(ok.text.length).toBeGreaterThan(0);
                    logProgress("".concat(progressLabel, ": done"));
                    return [3 /*break*/, 21];
                case 19:
                    err_2 = _f.sent();
                    message = String(err_2);
                    if (model.provider === "anthropic" &&
                        (0, live_auth_keys_js_1.isAnthropicRateLimitError)(message) &&
                        attempt + 1 < attemptMax) {
                        logProgress("".concat(progressLabel, ": rate limit, retrying with next key"));
                        return [3 /*break*/, 20];
                    }
                    if (model.provider === "anthropic" && (0, live_auth_keys_js_1.isAnthropicBillingError)(message)) {
                        if (attempt + 1 < attemptMax) {
                            logProgress("".concat(progressLabel, ": billing issue, retrying with next key"));
                            return [3 /*break*/, 20];
                        }
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (anthropic billing)"));
                        return [3 /*break*/, 21];
                    }
                    if (model.provider === "google" && isGoogleModelNotFoundError(err_2)) {
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (google model not found)"));
                        return [3 /*break*/, 21];
                    }
                    if (allowNotFoundSkip &&
                        model.provider === "minimax" &&
                        message.includes("request ended without sending any chunks")) {
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (minimax empty response)"));
                        return [3 /*break*/, 21];
                    }
                    if (allowNotFoundSkip &&
                        model.provider === "opencode" &&
                        (0, errors_js_1.isRateLimitErrorMessage)(message)) {
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (rate limit)"));
                        return [3 /*break*/, 21];
                    }
                    if (allowNotFoundSkip &&
                        model.provider === "openai-codex" &&
                        isChatGPTUsageLimitErrorMessage(message)) {
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (chatgpt usage limit)"));
                        return [3 /*break*/, 21];
                    }
                    if (allowNotFoundSkip &&
                        model.provider === "openai-codex" &&
                        isInstructionsRequiredError(message)) {
                        skipped.push({ model: id, reason: message });
                        logProgress("".concat(progressLabel, ": skip (instructions required)"));
                        return [3 /*break*/, 21];
                    }
                    logProgress("".concat(progressLabel, ": failed"));
                    failures.push({ model: id, error: message });
                    return [3 /*break*/, 21];
                case 20:
                    attempt += 1;
                    return [3 /*break*/, 9];
                case 21:
                    _a++;
                    return [3 /*break*/, 8];
                case 22:
                    if (failures.length > 0) {
                        preview = failures
                            .slice(0, 10)
                            .map(function (f) { return "- ".concat(f.model, ": ").concat(f.error); })
                            .join("\n");
                        throw new Error("live model failures (".concat(failures.length, "):\n").concat(preview));
                    }
                    void skipped;
                    return [2 /*return*/];
            }
        });
    }); }, 15 * 60 * 1000);
});
