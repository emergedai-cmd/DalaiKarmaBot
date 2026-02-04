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
var pi_ai_1 = require("@mariozechner/pi-ai");
var vitest_1 = require("vitest");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_js_1 = require("../agents/pi-embedded-runner/model.js");
var tts = require("./tts.js");
vitest_1.vi.mock("@mariozechner/pi-ai", function () { return ({
    completeSimple: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../agents/pi-embedded-runner/model.js", function () { return ({
    resolveModel: vitest_1.vi.fn(function (provider, modelId) { return ({
        model: {
            provider: provider,
            id: modelId,
            name: modelId,
            api: "openai-completions",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 128000,
            maxTokens: 8192,
        },
        authStorage: { profiles: {} },
        modelRegistry: { find: vitest_1.vi.fn() },
    }); }),
}); });
vitest_1.vi.mock("../agents/model-auth.js", function () { return ({
    getApiKeyForModel: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    apiKey: "test-api-key",
                    source: "test",
                    mode: "api-key",
                })];
        });
    }); }),
    requireApiKey: vitest_1.vi.fn(function (auth) { var _a; return (_a = auth.apiKey) !== null && _a !== void 0 ? _a : ""; }),
}); });
var _test = tts._test, resolveTtsConfig = tts.resolveTtsConfig, maybeApplyTtsToPayload = tts.maybeApplyTtsToPayload, getTtsProvider = tts.getTtsProvider;
var isValidVoiceId = _test.isValidVoiceId, isValidOpenAIVoice = _test.isValidOpenAIVoice, isValidOpenAIModel = _test.isValidOpenAIModel, OPENAI_TTS_MODELS = _test.OPENAI_TTS_MODELS, OPENAI_TTS_VOICES = _test.OPENAI_TTS_VOICES, parseTtsDirectives = _test.parseTtsDirectives, resolveModelOverridePolicy = _test.resolveModelOverridePolicy, summarizeText = _test.summarizeText, resolveOutputFormat = _test.resolveOutputFormat, resolveEdgeOutputFormat = _test.resolveEdgeOutputFormat;
(0, vitest_1.describe)("tts", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.mocked(pi_ai_1.completeSimple).mockResolvedValue({
            content: [{ type: "text", text: "Summary" }],
        });
    });
    (0, vitest_1.describe)("isValidVoiceId", function () {
        (0, vitest_1.it)("accepts valid ElevenLabs voice IDs", function () {
            (0, vitest_1.expect)(isValidVoiceId("pMsXgVXv3BLzUgSXRplE")).toBe(true);
            (0, vitest_1.expect)(isValidVoiceId("21m00Tcm4TlvDq8ikWAM")).toBe(true);
            (0, vitest_1.expect)(isValidVoiceId("EXAVITQu4vr4xnSDxMaL")).toBe(true);
        });
        (0, vitest_1.it)("accepts voice IDs of varying valid lengths", function () {
            (0, vitest_1.expect)(isValidVoiceId("a1b2c3d4e5")).toBe(true);
            (0, vitest_1.expect)(isValidVoiceId("a".repeat(40))).toBe(true);
        });
        (0, vitest_1.it)("rejects too short voice IDs", function () {
            (0, vitest_1.expect)(isValidVoiceId("")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("abc")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("123456789")).toBe(false);
        });
        (0, vitest_1.it)("rejects too long voice IDs", function () {
            (0, vitest_1.expect)(isValidVoiceId("a".repeat(41))).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("a".repeat(100))).toBe(false);
        });
        (0, vitest_1.it)("rejects voice IDs with invalid characters", function () {
            (0, vitest_1.expect)(isValidVoiceId("pMsXgVXv3BLz-gSXRplE")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("pMsXgVXv3BLz_gSXRplE")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("pMsXgVXv3BLz gSXRplE")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("../../../etc/passwd")).toBe(false);
            (0, vitest_1.expect)(isValidVoiceId("voice?param=value")).toBe(false);
        });
    });
    (0, vitest_1.describe)("isValidOpenAIVoice", function () {
        (0, vitest_1.it)("accepts all valid OpenAI voices", function () {
            for (var _i = 0, OPENAI_TTS_VOICES_1 = OPENAI_TTS_VOICES; _i < OPENAI_TTS_VOICES_1.length; _i++) {
                var voice = OPENAI_TTS_VOICES_1[_i];
                (0, vitest_1.expect)(isValidOpenAIVoice(voice)).toBe(true);
            }
        });
        (0, vitest_1.it)("rejects invalid voice names", function () {
            (0, vitest_1.expect)(isValidOpenAIVoice("invalid")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIVoice("")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIVoice("ALLOY")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIVoice("alloy ")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIVoice(" alloy")).toBe(false);
        });
    });
    (0, vitest_1.describe)("isValidOpenAIModel", function () {
        (0, vitest_1.it)("accepts supported models", function () {
            (0, vitest_1.expect)(isValidOpenAIModel("gpt-4o-mini-tts")).toBe(true);
            (0, vitest_1.expect)(isValidOpenAIModel("tts-1")).toBe(true);
            (0, vitest_1.expect)(isValidOpenAIModel("tts-1-hd")).toBe(true);
        });
        (0, vitest_1.it)("rejects unsupported models", function () {
            (0, vitest_1.expect)(isValidOpenAIModel("invalid")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIModel("")).toBe(false);
            (0, vitest_1.expect)(isValidOpenAIModel("gpt-4")).toBe(false);
        });
    });
    (0, vitest_1.describe)("OPENAI_TTS_MODELS", function () {
        (0, vitest_1.it)("contains supported models", function () {
            (0, vitest_1.expect)(OPENAI_TTS_MODELS).toContain("gpt-4o-mini-tts");
            (0, vitest_1.expect)(OPENAI_TTS_MODELS).toContain("tts-1");
            (0, vitest_1.expect)(OPENAI_TTS_MODELS).toContain("tts-1-hd");
            (0, vitest_1.expect)(OPENAI_TTS_MODELS).toHaveLength(3);
        });
        (0, vitest_1.it)("is a non-empty array", function () {
            (0, vitest_1.expect)(Array.isArray(OPENAI_TTS_MODELS)).toBe(true);
            (0, vitest_1.expect)(OPENAI_TTS_MODELS.length).toBeGreaterThan(0);
        });
    });
    (0, vitest_1.describe)("resolveOutputFormat", function () {
        (0, vitest_1.it)("uses Opus for Telegram", function () {
            var output = resolveOutputFormat("telegram");
            (0, vitest_1.expect)(output.openai).toBe("opus");
            (0, vitest_1.expect)(output.elevenlabs).toBe("opus_48000_64");
            (0, vitest_1.expect)(output.extension).toBe(".opus");
            (0, vitest_1.expect)(output.voiceCompatible).toBe(true);
        });
        (0, vitest_1.it)("uses MP3 for other channels", function () {
            var output = resolveOutputFormat("discord");
            (0, vitest_1.expect)(output.openai).toBe("mp3");
            (0, vitest_1.expect)(output.elevenlabs).toBe("mp3_44100_128");
            (0, vitest_1.expect)(output.extension).toBe(".mp3");
            (0, vitest_1.expect)(output.voiceCompatible).toBe(false);
        });
    });
    (0, vitest_1.describe)("resolveEdgeOutputFormat", function () {
        var baseCfg = {
            agents: { defaults: { model: { primary: "openai/gpt-4o-mini" } } },
            messages: { tts: {} },
        };
        (0, vitest_1.it)("uses default output format when edge output format is not configured", function () {
            var config = resolveTtsConfig(baseCfg);
            (0, vitest_1.expect)(resolveEdgeOutputFormat(config)).toBe("audio-24khz-48kbitrate-mono-mp3");
        });
        (0, vitest_1.it)("uses configured output format when provided", function () {
            var config = resolveTtsConfig(__assign(__assign({}, baseCfg), { messages: {
                    tts: {
                        edge: { outputFormat: "audio-24khz-96kbitrate-mono-mp3" },
                    },
                } }));
            (0, vitest_1.expect)(resolveEdgeOutputFormat(config)).toBe("audio-24khz-96kbitrate-mono-mp3");
        });
    });
    (0, vitest_1.describe)("parseTtsDirectives", function () {
        (0, vitest_1.it)("extracts overrides and strips directives when enabled", function () {
            var _a, _b, _c, _d, _e;
            var policy = resolveModelOverridePolicy({ enabled: true });
            var input = "Hello [[tts:provider=elevenlabs voiceId=pMsXgVXv3BLzUgSXRplE stability=0.4 speed=1.1]] world\n\n" +
                "[[tts:text]](laughs) Read the song once more.[[/tts:text]]";
            var result = parseTtsDirectives(input, policy);
            (0, vitest_1.expect)(result.cleanedText).not.toContain("[[tts:");
            (0, vitest_1.expect)(result.ttsText).toBe("(laughs) Read the song once more.");
            (0, vitest_1.expect)(result.overrides.provider).toBe("elevenlabs");
            (0, vitest_1.expect)((_a = result.overrides.elevenlabs) === null || _a === void 0 ? void 0 : _a.voiceId).toBe("pMsXgVXv3BLzUgSXRplE");
            (0, vitest_1.expect)((_c = (_b = result.overrides.elevenlabs) === null || _b === void 0 ? void 0 : _b.voiceSettings) === null || _c === void 0 ? void 0 : _c.stability).toBe(0.4);
            (0, vitest_1.expect)((_e = (_d = result.overrides.elevenlabs) === null || _d === void 0 ? void 0 : _d.voiceSettings) === null || _e === void 0 ? void 0 : _e.speed).toBe(1.1);
        });
        (0, vitest_1.it)("accepts edge as provider override", function () {
            var policy = resolveModelOverridePolicy({ enabled: true });
            var input = "Hello [[tts:provider=edge]] world";
            var result = parseTtsDirectives(input, policy);
            (0, vitest_1.expect)(result.overrides.provider).toBe("edge");
        });
        (0, vitest_1.it)("keeps text intact when overrides are disabled", function () {
            var policy = resolveModelOverridePolicy({ enabled: false });
            var input = "Hello [[tts:voice=alloy]] world";
            var result = parseTtsDirectives(input, policy);
            (0, vitest_1.expect)(result.cleanedText).toBe(input);
            (0, vitest_1.expect)(result.overrides.provider).toBeUndefined();
        });
    });
    (0, vitest_1.describe)("summarizeText", function () {
        var baseCfg = {
            agents: { defaults: { model: { primary: "openai/gpt-4o-mini" } } },
            messages: { tts: {} },
        };
        var baseConfig = resolveTtsConfig(baseCfg);
        (0, vitest_1.it)("summarizes text and returns result with metrics", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSummary, longText, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSummary = "This is a summarized version of the text.";
                        vitest_1.vi.mocked(pi_ai_1.completeSimple).mockResolvedValue({
                            content: [{ type: "text", text: mockSummary }],
                        });
                        longText = "A".repeat(2000);
                        return [4 /*yield*/, summarizeText({
                                text: longText,
                                targetLength: 1500,
                                cfg: baseCfg,
                                config: baseConfig,
                                timeoutMs: 30000,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.summary).toBe(mockSummary);
                        (0, vitest_1.expect)(result.inputLength).toBe(2000);
                        (0, vitest_1.expect)(result.outputLength).toBe(mockSummary.length);
                        (0, vitest_1.expect)(result.latencyMs).toBeGreaterThanOrEqual(0);
                        (0, vitest_1.expect)(pi_ai_1.completeSimple).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("calls the summary model with the expected parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var callArgs;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, summarizeText({
                            text: "Long text to summarize",
                            targetLength: 500,
                            cfg: baseCfg,
                            config: baseConfig,
                            timeoutMs: 30000,
                        })];
                    case 1:
                        _f.sent();
                        callArgs = vitest_1.vi.mocked(pi_ai_1.completeSimple).mock.calls[0];
                        (0, vitest_1.expect)((_c = (_b = (_a = callArgs === null || callArgs === void 0 ? void 0 : callArgs[1]) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.role).toBe("user");
                        (0, vitest_1.expect)((_d = callArgs === null || callArgs === void 0 ? void 0 : callArgs[2]) === null || _d === void 0 ? void 0 : _d.maxTokens).toBe(250);
                        (0, vitest_1.expect)((_e = callArgs === null || callArgs === void 0 ? void 0 : callArgs[2]) === null || _e === void 0 ? void 0 : _e.temperature).toBe(0.3);
                        (0, vitest_1.expect)(model_auth_js_1.getApiKeyForModel).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses summaryModel override when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
                            messages: { tts: { summaryModel: "openai/gpt-4.1-mini" } },
                        };
                        config = resolveTtsConfig(cfg);
                        return [4 /*yield*/, summarizeText({
                                text: "Long text to summarize",
                                targetLength: 500,
                                cfg: cfg,
                                config: config,
                                timeoutMs: 30000,
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(model_js_1.resolveModel).toHaveBeenCalledWith("openai", "gpt-4.1-mini", undefined, cfg);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects targetLength below minimum (100)", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                            text: "text",
                            targetLength: 99,
                            cfg: baseCfg,
                            config: baseConfig,
                            timeoutMs: 30000,
                        })).rejects.toThrow("Invalid targetLength: 99")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects targetLength above maximum (10000)", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                            text: "text",
                            targetLength: 10001,
                            cfg: baseCfg,
                            config: baseConfig,
                            timeoutMs: 30000,
                        })).rejects.toThrow("Invalid targetLength: 10001")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("accepts targetLength at boundaries", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                            text: "text",
                            targetLength: 100,
                            cfg: baseCfg,
                            config: baseConfig,
                            timeoutMs: 30000,
                        })).resolves.toBeDefined()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                                text: "text",
                                targetLength: 10000,
                                cfg: baseCfg,
                                config: baseConfig,
                                timeoutMs: 30000,
                            })).resolves.toBeDefined()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws error when no summary is returned", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(pi_ai_1.completeSimple).mockResolvedValue({
                            content: [],
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                                text: "text",
                                targetLength: 500,
                                cfg: baseCfg,
                                config: baseConfig,
                                timeoutMs: 30000,
                            })).rejects.toThrow("No summary returned")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("throws error when summary content is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(pi_ai_1.completeSimple).mockResolvedValue({
                            content: [{ type: "text", text: "   " }],
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(summarizeText({
                                text: "text",
                                targetLength: 500,
                                cfg: baseCfg,
                                config: baseConfig,
                                timeoutMs: 30000,
                            })).rejects.toThrow("No summary returned")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("getTtsProvider", function () {
        var baseCfg = {
            agents: { defaults: { model: { primary: "openai/gpt-4o-mini" } } },
            messages: { tts: {} },
        };
        var restoreEnv = function (snapshot) {
            var keys = ["OPENAI_API_KEY", "ELEVENLABS_API_KEY", "XI_API_KEY"];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var value = snapshot[key];
                if (value === undefined) {
                    delete process.env[key];
                }
                else {
                    process.env[key] = value;
                }
            }
        };
        var withEnv = function (env, run) {
            var snapshot = {
                OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
                XI_API_KEY: process.env.XI_API_KEY,
            };
            try {
                for (var _i = 0, _a = Object.entries(env); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (value === undefined) {
                        delete process.env[key];
                    }
                    else {
                        process.env[key] = value;
                    }
                }
                run();
            }
            finally {
                restoreEnv(snapshot);
            }
        };
        (0, vitest_1.it)("prefers OpenAI when no provider is configured and API key exists", function () {
            withEnv({
                OPENAI_API_KEY: "test-openai-key",
                ELEVENLABS_API_KEY: undefined,
                XI_API_KEY: undefined,
            }, function () {
                var config = resolveTtsConfig(baseCfg);
                var provider = getTtsProvider(config, "/tmp/tts-prefs-openai.json");
                (0, vitest_1.expect)(provider).toBe("openai");
            });
        });
        (0, vitest_1.it)("prefers ElevenLabs when OpenAI is missing and ElevenLabs key exists", function () {
            withEnv({
                OPENAI_API_KEY: undefined,
                ELEVENLABS_API_KEY: "test-elevenlabs-key",
                XI_API_KEY: undefined,
            }, function () {
                var config = resolveTtsConfig(baseCfg);
                var provider = getTtsProvider(config, "/tmp/tts-prefs-elevenlabs.json");
                (0, vitest_1.expect)(provider).toBe("elevenlabs");
            });
        });
        (0, vitest_1.it)("falls back to Edge when no API keys are present", function () {
            withEnv({
                OPENAI_API_KEY: undefined,
                ELEVENLABS_API_KEY: undefined,
                XI_API_KEY: undefined,
            }, function () {
                var config = resolveTtsConfig(baseCfg);
                var provider = getTtsProvider(config, "/tmp/tts-prefs-edge.json");
                (0, vitest_1.expect)(provider).toBe("edge");
            });
        });
    });
    (0, vitest_1.describe)("maybeApplyTtsToPayload", function () {
        var baseCfg = {
            agents: { defaults: { model: { primary: "openai/gpt-4o-mini" } } },
            messages: {
                tts: {
                    auto: "inbound",
                    provider: "openai",
                    openai: { apiKey: "test-key", model: "gpt-4o-mini-tts", voice: "alloy" },
                },
            },
        };
        (0, vitest_1.it)("skips auto-TTS when inbound audio gating is on and the message is not audio", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prevPrefs, originalFetch, fetchMock, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevPrefs = process.env.OPENCLAW_TTS_PREFS;
                        process.env.OPENCLAW_TTS_PREFS = "/tmp/tts-test-".concat(Date.now(), ".json");
                        originalFetch = globalThis.fetch;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        ok: true,
                                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new ArrayBuffer(1)];
                                        }); }); },
                                    })];
                            });
                        }); });
                        globalThis.fetch = fetchMock;
                        payload = { text: "Hello world" };
                        return [4 /*yield*/, maybeApplyTtsToPayload({
                                payload: payload,
                                cfg: baseCfg,
                                kind: "final",
                                inboundAudio: false,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(payload);
                        (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                        globalThis.fetch = originalFetch;
                        process.env.OPENCLAW_TTS_PREFS = prevPrefs;
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("attempts auto-TTS when inbound audio gating is on and the message is audio", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prevPrefs, originalFetch, fetchMock, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevPrefs = process.env.OPENCLAW_TTS_PREFS;
                        process.env.OPENCLAW_TTS_PREFS = "/tmp/tts-test-".concat(Date.now(), ".json");
                        originalFetch = globalThis.fetch;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        ok: true,
                                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new ArrayBuffer(1)];
                                        }); }); },
                                    })];
                            });
                        }); });
                        globalThis.fetch = fetchMock;
                        return [4 /*yield*/, maybeApplyTtsToPayload({
                                payload: { text: "Hello world" },
                                cfg: baseCfg,
                                kind: "final",
                                inboundAudio: true,
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.mediaUrl).toBeDefined();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(1);
                        globalThis.fetch = originalFetch;
                        process.env.OPENCLAW_TTS_PREFS = prevPrefs;
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("skips auto-TTS in tagged mode unless a tts tag is present", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prevPrefs, originalFetch, fetchMock, cfg, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevPrefs = process.env.OPENCLAW_TTS_PREFS;
                        process.env.OPENCLAW_TTS_PREFS = "/tmp/tts-test-".concat(Date.now(), ".json");
                        originalFetch = globalThis.fetch;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        ok: true,
                                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new ArrayBuffer(1)];
                                        }); }); },
                                    })];
                            });
                        }); });
                        globalThis.fetch = fetchMock;
                        cfg = __assign(__assign({}, baseCfg), { messages: __assign(__assign({}, baseCfg.messages), { tts: __assign(__assign({}, baseCfg.messages.tts), { auto: "tagged" }) }) });
                        payload = { text: "Hello world" };
                        return [4 /*yield*/, maybeApplyTtsToPayload({
                                payload: payload,
                                cfg: cfg,
                                kind: "final",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(payload);
                        (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                        globalThis.fetch = originalFetch;
                        process.env.OPENCLAW_TTS_PREFS = prevPrefs;
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("runs auto-TTS in tagged mode when tags are present", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prevPrefs, originalFetch, fetchMock, cfg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevPrefs = process.env.OPENCLAW_TTS_PREFS;
                        process.env.OPENCLAW_TTS_PREFS = "/tmp/tts-test-".concat(Date.now(), ".json");
                        originalFetch = globalThis.fetch;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        ok: true,
                                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, new ArrayBuffer(1)];
                                        }); }); },
                                    })];
                            });
                        }); });
                        globalThis.fetch = fetchMock;
                        cfg = __assign(__assign({}, baseCfg), { messages: __assign(__assign({}, baseCfg.messages), { tts: __assign(__assign({}, baseCfg.messages.tts), { auto: "tagged" }) }) });
                        return [4 /*yield*/, maybeApplyTtsToPayload({
                                payload: { text: "[[tts:text]]Hello world[[/tts:text]]" },
                                cfg: cfg,
                                kind: "final",
                            })];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.mediaUrl).toBeDefined();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(1);
                        globalThis.fetch = originalFetch;
                        process.env.OPENCLAW_TTS_PREFS = prevPrefs;
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
